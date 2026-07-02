import { pool } from '../config/db.js';

// Add a new problem
export const addProblem = async (req, res) => {
  const { title, platform, difficulty, topic, status, notes, url } = req.body;
  const user_id = req.user.userId;

  if (!title) {
    return res.status(400).json({status: 'error', message: 'Title is required' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO problems 
        (user_id, title, platform, difficulty, topic, status, notes, url, solved_at)
       VALUES 
        ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [
        user_id,
        title,
        platform || null,
        difficulty || null,
        topic || null,
        status || 'Unsolved',
        notes || null,
        url || null,
        status === 'Solved' ? new Date() : null
      ]
    );

    res.status(201).json({status: 'success', message: 'Problem added', problem: result.rows[0] });
  } catch (error) {
    console.error('Add problem error:', error);
    res.status(500).json({status: 'error', message: 'Internal server error' });
  }
};

// Get all problems for logged in user
export const getProblems = async (req, res) => {
  const user_id = req.user.userId;

  try {
    const result = await pool.query(
      `SELECT * FROM problems WHERE user_id = $1 ORDER BY created_at DESC`,
      [user_id]
    );

    res.status(200).json({ problems: result.rows });
  } catch (error) {
    console.error('Get problems error:', error);
    res.status(500).json({status: 'error', message: 'Internal server error' });
  }
};

// Update a problem
export const updateProblem = async (req, res) => {
  const { id } = req.params;
  const user_id = req.user.userId;
  const { title, platform, difficulty, topic, status, notes, url } = req.body;

  try {
    // Make sure this problem belongs to this user
    const existing = await pool.query(
      'SELECT * FROM problems WHERE id = $1 AND user_id = $2',
      [id, user_id]
    );

    if (existing.rows.length === 0) {
      return res.status(404).json({status: 'error', message: 'Problem not found' });
    }

    const result = await pool.query(
      `UPDATE problems SET
        title = $1,
        platform = $2,
        difficulty = $3,
        topic = $4,
        status = $5,
        notes = $6,
        url = $7,
        solved_at = $8
       WHERE id = $9 AND user_id = $10
       RETURNING *`,
      [
        title,
        platform || null,
        difficulty || null,
        topic || null,
        status,
        notes || null,
        url || null,
        status === 'Solved' ? new Date() : null,
        id,
        user_id
      ]
    );

    res.status(200).json({status: 'success', message: 'Problem updated', problem: result.rows[0] });
  } catch (error) {
    console.error('Update problem error:', error);
    res.status(500).json({status: 'error', message: 'Internal server error' });
  }
};

// Delete a problem
export const deleteProblem = async (req, res) => {
  const { id } = req.params;
  const user_id = req.user.userId;

  try {
    const result = await pool.query(
      'DELETE FROM problems WHERE id = $1 AND user_id = $2 RETURNING *',
      [id, user_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({status: 'error', message: 'Problem not found' });
    }

    res.status(200).json({status: 'success', message: 'Problem deleted' });
  } catch (error) {
    console.error('Delete problem error:', error);
    res.status(500).json({status: 'error', message: 'Internal server error' });
  }
};