import groq from '../config/groq.js';
import { pool } from '../config/db.js';
import fetch from 'node-fetch';
import { extractText } from 'unpdf';

// AI Resume Analyzer
export const analyzeResume = async (req, res) => {
  const user_id = req.user.userId;
  const {
    target_role = 'SDE Intern',
    target_company = 'top tech companies'
  } = req.body;

  try {
    // Get active resume from DB
    const resumeResult = await pool.query(
      'SELECT * FROM resumes WHERE user_id = $1 AND is_active = true',
      [user_id]
    );

    if (resumeResult.rows.length === 0) {
      return res.status(400).json({
        message: 'No active resume found. Please upload a resume and set it as active in Resume Manager.'
      });
    }

    const resume = resumeResult.rows[0];

    // Get user info
    const userResult = await pool.query(
      'SELECT name, email FROM users WHERE id = $1',
      [user_id]
    );
    const user = userResult.rows[0];

    // Fetch PDF from Cloudinary and extract text
    const pdfResponse = await fetch(resume.url);
    const pdfBuffer = await pdfResponse.arrayBuffer();
    const { text: resumeText } = await extractText(new Uint8Array(pdfBuffer), { mergePages: true });

    if (!resumeText || resumeText.trim().length < 50) {
      return res.status(400).json({
        message: 'Could not extract text from resume PDF. Make sure your PDF contains selectable text.'
      });
    }

    // Send to Groq for analysis
    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: `You are an expert resume reviewer and hiring manager with 15+ years of experience 
          at top tech companies including Google, Amazon, Microsoft, Meta, Goldman Sachs, Morgan Stanley,
          Uber, Atlassian, Oracle, Flipkart, Walmart, and other leading product and service companies.
          You review resumes for all engineering roles including SDE Intern, SDE-1, SDE-2, 
          Frontend Engineer, Backend Engineer, Full Stack Engineer, Data Engineer, ML Engineer,
          DevOps Engineer, and more.
          You provide brutally honest, detailed, and actionable feedback.
          Always respond in valid JSON format only, no markdown, no extra text.`
        },
        {
          role: 'user',
          content: `Analyze this resume for the following position and provide detailed feedback:

Candidate Name: ${user.name}
Target Role: ${target_role}
Target Company: ${target_company}
Resume Title: ${resume.title}
Resume Version: ${resume.version || 'v1'}

RESUME CONTENT:
${resumeText}

Based on the actual resume content above, provide a comprehensive analysis.
Consider the specific requirements and culture of ${target_company} for a ${target_role} position.

Return a JSON object with exactly this structure:
{
  "overall_score": <number 1-100>,
  "summary": "<3-4 sentence overall assessment specific to ${target_role} at ${target_company}>",
  "strengths": [
    "<specific strength 1 from resume>",
    "<specific strength 2 from resume>",
    "<specific strength 3 from resume>",
    "<specific strength 4 from resume>",
    "<specific strength 5 from resume>"
  ],
  "weaknesses": [
    "<specific weakness 1>",
    "<specific weakness 2>",
    "<specific weakness 3>"
  ],
  "suggestions": [
    {
      "category": "Projects",
      "issue": "<what's wrong with projects section>",
      "fix": "<specific fix>"
    },
    {
      "category": "Skills",
      "issue": "<what's wrong with skills section>",
      "fix": "<specific fix>"
    },
    {
      "category": "Experience",
      "issue": "<what's wrong>",
      "fix": "<specific fix>"
    },
    {
      "category": "Impact Metrics",
      "issue": "<what's wrong>",
      "fix": "<specific fix>"
    },
    {
      "category": "Keywords",
      "issue": "<missing keywords for ${target_role} at ${target_company}>",
      "fix": "<specific keywords to add>"
    }
  ],
  "missing_sections": ["<missing section 1>", "<missing section 2>"],
  "ats_score": <number 1-100>,
  "ats_tips": [
    "<ATS tip 1>",
    "<ATS tip 2>",
    "<ATS tip 3>",
    "<ATS tip 4>"
  ],
  "company_fit": {
    "score": <number 1-100>,
    "reason": "<why this score for ${target_company}>",
    "what_they_look_for": "<what ${target_company} specifically looks for in ${target_role}>",
    "gaps": ["<gap 1>", "<gap 2>"]
  },
  "action_items": [
    "<most important thing to fix first>",
    "<second most important>",
    "<third most important>"
  ],
  "interview_topics": [
    "<topic to prepare based on resume>",
    "<topic 2>",
    "<topic 3>",
    "<topic 4>",
    "<topic 5>"
  ]
}`
        }
      ],
      temperature: 0.3,
      max_tokens: 2000,
    });

    const rawResponse = completion.choices[0].message.content;

    // Parse JSON response
    let analysis;
    try {
      const cleaned = rawResponse.replace(/```json|```/g, '').trim();
      analysis = JSON.parse(cleaned);
    } catch (parseError) {
      console.error('Parse error:', parseError);
      return res.status(500).json({ message: 'Failed to parse AI response' });
    }

    res.status(200).json({
      message: 'Resume analyzed successfully',
      resume: {
        title: resume.title,
        version: resume.version,
      },
      target: {
        role: target_role,
        company: target_company,
      },
      analysis
    });

  } catch (error) {
    console.error('Resume analysis error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// AI Mock Interview Generator
export const generateInterview = async (req, res) => {
  const user_id = req.user.userId;
  const {
    company = 'Google',
    role = 'SDE Intern',
    round = 'Technical',
    topics = []
  } = req.body;

  try {
    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: `You are an experienced technical interviewer at ${company}.
          You conduct ${round} interviews for ${role} positions.
          Generate realistic interview questions that ${company} actually asks.
          Always respond in valid JSON format only, no markdown, no extra text.`
        },
        {
          role: 'user',
          content: `Generate a ${round} interview for ${role} position at ${company}.
          ${topics.length > 0 ? `Focus on these topics: ${topics.join(', ')}` : ''}
          
          Return a JSON object with exactly this structure:
          {
            "interview_title": "<title>",
            "company": "${company}",
            "role": "${role}",
            "round": "${round}",
            "duration": "<estimated duration>",
            "instructions": "<brief instructions for the candidate>",
            "questions": [
              {
                "id": 1,
                "type": "<DSA/System Design/Behavioral/Conceptual>",
                "difficulty": "<Easy/Medium/Hard>",
                "question": "<full question text>",
                "hints": ["<hint 1>", "<hint 2>"],
                "expected_topics": ["<topic 1>", "<topic 2>"],
                "time_limit": "<suggested time>"
              }
            ]
          }
          
          Generate exactly 5 questions appropriate for ${company}'s ${round} interview style.`
        }
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const rawResponse = completion.choices[0].message.content;

    let interview;
    try {
      const cleaned = rawResponse.replace(/```json|```/g, '').trim();
      interview = JSON.parse(cleaned);
    } catch (parseError) {
      console.error('Parse error:', parseError);
      return res.status(500).json({ message: 'Failed to parse AI response' });
    }

    res.status(200).json({
      message: 'Interview generated successfully',
      interview
    });

  } catch (error) {
    console.error('Generate interview error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Evaluate interview answer
export const evaluateAnswer = async (req, res) => {
  const { question, answer, company, role } = req.body;

  if (!question || !answer) {
    return res.status(400).json({ message: 'Question and answer are required' });
  }

  try {
    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: `You are an experienced technical interviewer at ${company}.
          Evaluate candidate answers honestly and constructively.
          Always respond in valid JSON format only, no markdown, no extra text.`
        },
        {
          role: 'user',
          content: `Evaluate this interview answer:

Company: ${company}
Role: ${role}
Question: ${question}
Candidate Answer: ${answer}

Return a JSON object with exactly this structure:
{
  "score": <number 1-10>,
  "verdict": "<Excellent/Good/Average/Poor>",
  "feedback": "<detailed feedback on the answer>",
  "what_was_good": ["<good point 1>", "<good point 2>"],
  "what_was_missing": ["<missing point 1>", "<missing point 2>"],
  "ideal_answer_outline": "<brief outline of what an ideal answer looks like>",
  "follow_up_question": "<a follow up question the interviewer might ask>"
}`
        }
      ],
      temperature: 0.3,
      max_tokens: 1000,
    });

    const rawResponse = completion.choices[0].message.content;

    let evaluation;
    try {
      const cleaned = rawResponse.replace(/```json|```/g, '').trim();
      evaluation = JSON.parse(cleaned);
    } catch (parseError) {
      return res.status(500).json({ message: 'Failed to parse AI response' });
    }

    res.status(200).json({ evaluation });

  } catch (error) {
    console.error('Evaluate answer error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Generate Daily Plan
export const generateDailyPlan = async (req, res) => {
  const user_id = req.user.userId;
  const { date } = req.body; // date from frontend in user's timezone

  const planDate = date || new Date().toISOString().split('T')[0];

  try {
    // Check if plan already exists for today
    const existingPlan = await pool.query(
      'SELECT * FROM daily_plans WHERE user_id = $1 AND plan_date = $2',
      [user_id, planDate]
    );

    if (existingPlan.rows.length > 0) {
      return res.status(200).json({
        message: 'Plan already exists',
        plan: existingPlan.rows[0],
        isExisting: true
      });
    }

    // Fetch user's real data
    const userResult = await pool.query(
      'SELECT name FROM users WHERE id = $1',
      [user_id]
    );
    const userName = userResult.rows[0].name;

    // DSA stats
    const dsaStats = await pool.query(
      `SELECT 
        COUNT(*) as total,
        COUNT(CASE WHEN status = 'Solved' THEN 1 END) as solved,
        COUNT(CASE WHEN status = 'Unsolved' THEN 1 END) as unsolved
       FROM problems WHERE user_id = $1`,
      [user_id]
    );

    // Weak topics (most unsolved)
    const weakTopics = await pool.query(
      `SELECT topic, COUNT(*) as count
       FROM problems
       WHERE user_id = $1 AND status = 'Unsolved' AND topic IS NOT NULL
       GROUP BY topic
       ORDER BY count DESC
       LIMIT 3`,
      [user_id]
    );

    // Revision list
    const revisionList = await pool.query(
      `SELECT title, topic, difficulty
       FROM problems
       WHERE user_id = $1 AND needs_revision = true
       LIMIT 5`,
      [user_id]
    );

    // OA stats
    const oaStats = await pool.query(
      `SELECT
        COUNT(*) as total,
        COUNT(CASE WHEN status = 'Cleared' THEN 1 END) as cleared
       FROM oa_records WHERE user_id = $1`,
      [user_id]
    );

    // Yesterday's missed tasks
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayDate = yesterday.toISOString().split('T')[0];

    const yesterdayPlan = await pool.query(
      'SELECT tasks, completed_tasks FROM daily_plans WHERE user_id = $1 AND plan_date = $2',
      [user_id, yesterdayDate]
    );

    let missedTasks = [];
    if (yesterdayPlan.rows.length > 0) {
      const allTasks = yesterdayPlan.rows[0].tasks;
      const completedIds = yesterdayPlan.rows[0].completed_tasks;
      missedTasks = allTasks.filter(t => !completedIds.includes(t.id));
    }

    // Build context for AI
    const context = {
      userName,
      date: planDate,
      dsa: dsaStats.rows[0],
      weakTopics: weakTopics.rows,
      revisionList: revisionList.rows,
      oa: oaStats.rows[0],
      missedTasks,
    };

    // Generate plan with Groq
    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: `You are an expert placement preparation coach for engineering students in India.
          You create personalized, realistic daily study plans based on the student's actual progress.
          Be motivating but honest. Set achievable targets for 4-5 hours of study.
          Always respond in valid JSON format only, no markdown, no extra text.`
        },
        {
          role: 'user',
          content: `Create a personalized daily study plan for ${userName} for ${planDate}.

Student's current progress:
- Total DSA Problems: ${context.dsa.total}
- Solved: ${context.dsa.solved}
- Unsolved: ${context.dsa.unsolved}
- Weak Topics: ${context.weakTopics.map(t => t.topic).join(', ') || 'None identified yet'}
- Problems for Revision: ${context.revisionList.map(p => p.title).join(', ') || 'None'}
- Total OAs Attempted: ${context.oa.total}
- OAs Cleared: ${context.oa.cleared}
${missedTasks.length > 0 ? `- Missed tasks from yesterday: ${missedTasks.map(t => t.title).join(', ')}` : ''}

Create a realistic study plan for 4-5 hours of study today.
Return a JSON object with exactly this structure:
{
  "motivation": "<personalized motivational message addressing ${userName} directly, 2-3 sentences>",
  "summary": "<brief summary of today's focus>",
  "total_hours": "<estimated total hours>",
  "tasks": [
    {
      "id": "task_1",
      "category": "<DSA/Revision/OA Prep/Concept/Break>",
      "title": "<specific task title>",
      "description": "<detailed description of what to do>",
      "duration": "<e.g. 45 mins>",
      "priority": "<High/Medium/Low>",
      "resources": ["<resource 1>", "<resource 2>"]
    }
  ]
}

Generate 5-7 specific, actionable tasks. Make them specific to the student's weak areas.
${missedTasks.length > 0 ? 'Include 1-2 tasks from yesterday that were missed.' : ''}`
        }
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const rawResponse = completion.choices[0].message.content;

    let planData;
    try {
      const cleaned = rawResponse.replace(/```json|```/g, '').trim();
      planData = JSON.parse(cleaned);
    } catch (parseError) {
      console.error('Parse error:', parseError);
      return res.status(500).json({ message: 'Failed to parse AI response' });
    }

    // Save plan to DB
    const savedPlan = await pool.query(
      `INSERT INTO daily_plans (user_id, plan_date, tasks, motivation)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [user_id, planDate, JSON.stringify(planData.tasks), planData.motivation]
    );

    res.status(201).json({
      message: 'Daily plan generated',
      plan: {
        ...savedPlan.rows[0],
        summary: planData.summary,
        total_hours: planData.total_hours,
      },
      isExisting: false
    });

  } catch (error) {
    console.error('Generate daily plan error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Mark task complete
export const completeTask = async (req, res) => {
  const user_id = req.user.userId;
  const { date, task_id } = req.body;

  const planDate = date || new Date().toISOString().split('T')[0];

  try {
    const plan = await pool.query(
      'SELECT * FROM daily_plans WHERE user_id = $1 AND plan_date = $2',
      [user_id, planDate]
    );

    if (plan.rows.length === 0) {
      return res.status(404).json({ message: 'No plan found for today' });
    }

    const completedTasks = plan.rows[0].completed_tasks || [];

    // Toggle — if already completed, remove it
    let updatedCompleted;
    if (completedTasks.includes(task_id)) {
      updatedCompleted = completedTasks.filter(id => id !== task_id);
    } else {
      updatedCompleted = [...completedTasks, task_id];
    }

    const result = await pool.query(
      `UPDATE daily_plans SET completed_tasks = $1
       WHERE user_id = $2 AND plan_date = $3
       RETURNING *`,
      [JSON.stringify(updatedCompleted), user_id, planDate]
    );

    res.status(200).json({
      message: 'Task updated',
      plan: result.rows[0]
    });

  } catch (error) {
    console.error('Complete task error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get today's plan
export const getTodayPlan = async (req, res) => {
  const user_id = req.user.userId;
  const { date } = req.query;

  const planDate = date || new Date().toISOString().split('T')[0];

  try {
    const result = await pool.query(
      'SELECT * FROM daily_plans WHERE user_id = $1 AND plan_date = $2',
      [user_id, planDate]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'No plan found for today', plan: null });
    }

    res.status(200).json({ plan: result.rows[0] });
  } catch (error) {
    console.error('Get today plan error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Generate Company Roadmap
export const generateRoadmap = async (req, res) => {
  const user_id = req.user.userId;
  const { company, role = 'SDE Intern', timeline = '3 months' } = req.body;

  if (!company) {
    return res.status(400).json({ message: 'Company is required' });
  }

  try {
    // Get user's current progress for personalization
    const dsaStats = await pool.query(
      `SELECT 
        COUNT(*) as total,
        COUNT(CASE WHEN status = 'Solved' THEN 1 END) as solved
       FROM problems WHERE user_id = $1`,
      [user_id]
    );

    const weakTopics = await pool.query(
      `SELECT topic, COUNT(*) as count
       FROM problems
       WHERE user_id = $1 AND status = 'Unsolved' AND topic IS NOT NULL
       GROUP BY topic ORDER BY count DESC LIMIT 3`,
      [user_id]
    );

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: `You are an expert placement coach who has helped hundreds of students 
          get into top tech companies. You know exactly what each company looks for in 
          ${role} candidates. Always respond in valid JSON format only, no markdown, no extra text.`
        },
        {
          role: 'user',
          content: `Generate a complete preparation roadmap for ${role} at ${company}.
          
Student's current progress:
- DSA Problems Solved: ${dsaStats.rows[0].solved} out of ${dsaStats.rows[0].total}
- Weak Topics: ${weakTopics.rows.map(t => t.topic).join(', ') || 'Not identified yet'}
- Timeline: ${timeline}

Return a JSON object with exactly this structure:
{
  "company": "${company}",
  "role": "${role}",
  "timeline": "${timeline}",
  "overview": "<2-3 sentences about ${company}'s hiring process for ${role}>",
  "difficulty": "<Easy/Medium/Hard>",
  "hiring_process": [
    {
      "round": "<round name>",
      "description": "<what happens in this round>",
      "duration": "<typical duration>",
      "tips": "<specific tip for this round>"
    }
  ],
  "core_topics": [
    {
      "topic": "<topic name>",
      "importance": "<High/Medium/Low>",
      "subtopics": ["<subtopic 1>", "<subtopic 2>"],
      "recommended_problems": "<number of problems to solve>",
      "resources": ["<resource 1>", "<resource 2>"]
    }
  ],
  "weekly_plan": [
    {
      "week": "<Week 1-2>",
      "focus": "<main focus>",
      "goals": ["<goal 1>", "<goal 2>", "<goal 3>"]
    }
  ],
  "must_know": ["<must know concept 1>", "<must know concept 2>", "<must know concept 3>", "<must know concept 4>", "<must know concept 5>"],
  "common_mistakes": ["<mistake 1>", "<mistake 2>", "<mistake 3>"],
  "insider_tips": ["<tip 1>", "<tip 2>", "<tip 3>"],
  "recommended_resources": {
    "dsa": ["<resource 1>", "<resource 2>"],
    "system_design": ["<resource 1>", "<resource 2>"],
    "behavioral": ["<resource 1>", "<resource 2>"]
  }
}`
        }
      ],
      temperature: 0.5,
      max_tokens: 3000,
    });

    const rawResponse = completion.choices[0].message.content;

    let roadmap;
    try {
      const cleaned = rawResponse.replace(/```json|```/g, '').trim();
      roadmap = JSON.parse(cleaned);
    } catch (parseError) {
      console.error('Parse error:', parseError);
      return res.status(500).json({ message: 'Failed to parse AI response' });
    }

    res.status(200).json({
      message: 'Roadmap generated successfully',
      roadmap
    });

  } catch (error) {
    console.error('Generate roadmap error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};