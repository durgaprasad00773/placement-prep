import { pool } from '../config/db.js';

// Get all experiences with filters
export const getExperiences = async (req, res) => {
  const user_id = req.user.userId;
  const { company, role, difficulty, outcome } = req.query;

  try {
    let query = `
      SELECT 
        e.*,
        u.name as author_name,
        EXISTS(
          SELECT 1 FROM experience_upvotes 
          WHERE experience_id = e.id AND user_id = $1
        ) as has_upvoted
      FROM experiences e
      JOIN users u ON e.user_id = u.id
      WHERE 1=1
    `;

    const params = [user_id];
    let paramCount = 2;

    if (company) {
      query += ` AND LOWER(e.company) LIKE LOWER($${paramCount})`;
      params.push(`%${company}%`);
      paramCount++;
    }

    if (role) {
      query += ` AND LOWER(e.role) LIKE LOWER($${paramCount})`;
      params.push(`%${role}%`);
      paramCount++;
    }

    if (difficulty) {
      query += ` AND e.difficulty = $${paramCount}`;
      params.push(difficulty);
      paramCount++;
    }

    if (outcome) {
      query += ` AND e.outcome = $${paramCount}`;
      params.push(outcome);
      paramCount++;
    }

    query += ` ORDER BY e.upvotes DESC, e.created_at DESC`;

    const result = await pool.query(query, params);
    res.status(200).json({ experiences: result.rows });
  } catch (error) {
    console.error('Get experiences error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

//add new experience
export const addExperience = async (req, res) => {
  const user_id = req.user.userId;
  const {
    company, role, year, difficulty,
    oa_experience, interview_rounds, tips, outcome,
    college, cgpa, preparation_months, offer_type, resources_used
  } = req.body;

  if (!company || !role || !year) {
    return res.status(400).json({ message: 'Company, role and year are required' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO experiences 
        (user_id, company, role, year, difficulty, oa_experience, interview_rounds, 
         tips, outcome, college, cgpa, preparation_months, offer_type, resources_used)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
       RETURNING *`,
      [
        user_id, company, role, year,
        difficulty || null, oa_experience || null,
        interview_rounds || null, tips || null,
        outcome || 'Selected', college || null,
        cgpa || null, preparation_months || null,
        offer_type || 'Internship', resources_used || null
      ]
    );

    res.status(201).json({ message: 'Experience shared', experience: result.rows[0] });
  } catch (error) {
    console.error('Add experience error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Toggle upvote
export const toggleUpvote = async (req, res) => {
  const user_id = req.user.userId;
  const { id } = req.params;

  try {
    // Check if already upvoted
    const existing = await pool.query(
      'SELECT * FROM experience_upvotes WHERE user_id = $1 AND experience_id = $2',
      [user_id, id]
    );

    if (existing.rows.length > 0) {
      // Remove upvote
      await pool.query(
        'DELETE FROM experience_upvotes WHERE user_id = $1 AND experience_id = $2',
        [user_id, id]
      );

      await pool.query(
        'UPDATE experiences SET upvotes = upvotes - 1 WHERE id = $1',
        [id]
      );

      res.status(200).json({ message: 'Upvote removed', upvoted: false });
    } else {
      // Add upvote
      await pool.query(
        'INSERT INTO experience_upvotes (user_id, experience_id) VALUES ($1, $2)',
        [user_id, id]
      );

      await pool.query(
        'UPDATE experiences SET upvotes = upvotes + 1 WHERE id = $1',
        [id]
      );

      res.status(200).json({ message: 'Upvoted', upvoted: true });
    }
  } catch (error) {
    console.error('Toggle upvote error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete experience (only own posts)
export const deleteExperience = async (req, res) => {
  const user_id = req.user.userId;
  const { id } = req.params;

  try {
    const result = await pool.query(
      'DELETE FROM experiences WHERE id = $1 AND user_id = $2 RETURNING *',
      [id, user_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Experience not found or unauthorized' });
    }

    res.status(200).json({ message: 'Experience deleted' });
  } catch (error) {
    console.error('Delete experience error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};