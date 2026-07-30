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