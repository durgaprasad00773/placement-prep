import { pool } from '../config/db.js';

// Add OA record
export const addOA = async (req, res) => {
  const user_id = req.user.userId;
  const { company, role, oa_date, platform, status, difficulty, num_questions, duration_mins, topics, notes } = req.body;

  if (!company) {
    return res.status(400).json({ message: 'Company name is required' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO oa_records 
        (user_id, company, role, oa_date, platform, status, difficulty, num_questions, duration_mins, topics, notes)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       RETURNING *`,
      [
        user_id,
        company,
        role || null,
        oa_date || null,
        platform || null,
        status || 'Pending',
        difficulty || null,
        num_questions || null,
        duration_mins || null,
        topics || [],
        notes || null
      ]
    );

    res.status(201).json({ message: 'OA record added', oa: result.rows[0] });
  } catch (error) {
    console.error('Add OA error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get all OA records
export const getOAs = async (req, res) => {
  const user_id = req.user.userId;

  try {
    const result = await pool.query(
      'SELECT * FROM oa_records WHERE user_id = $1 ORDER BY created_at DESC',
      [user_id]
    );

    res.status(200).json({ oas: result.rows });
  } catch (error) {
    console.error('Get OAs error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update OA record
export const updateOA = async (req, res) => {
  const { id } = req.params;
  const user_id = req.user.userId;
  const { company, role, oa_date, platform, status, difficulty, num_questions, duration_mins, topics, notes } = req.body;

  try {
    const existing = await pool.query(
      'SELECT * FROM oa_records WHERE id = $1 AND user_id = $2',
      [id, user_id]
    );

    if (existing.rows.length === 0) {
      return res.status(404).json({ message: 'OA record not found' });
    }

    const result = await pool.query(
      `UPDATE oa_records SET
        company = $1, role = $2, oa_date = $3, platform = $4,
        status = $5, difficulty = $6, num_questions = $7,
        duration_mins = $8, topics = $9, notes = $10
       WHERE id = $11 AND user_id = $12
       RETURNING *`,
      [company, role || null, oa_date || null, platform || null, status, difficulty || null, num_questions || null, duration_mins || null, topics || [], notes || null, id, user_id]
    );

    res.status(200).json({ message: 'OA record updated', oa: result.rows[0] });
  } catch (error) {
    console.error('Update OA error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete OA record
export const deleteOA = async (req, res) => {
  const { id } = req.params;
  const user_id = req.user.userId;

  try {
    const result = await pool.query(
      'DELETE FROM oa_records WHERE id = $1 AND user_id = $2 RETURNING *',
      [id, user_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'OA record not found' });
    }

    res.status(200).json({ message: 'OA record deleted' });
  } catch (error) {
    console.error('Delete OA error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};