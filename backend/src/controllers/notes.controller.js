import { pool } from '../config/db.js';

// Add note
export const addNote = async (req, res) => {
  const user_id = req.user.userId;
  const { title, content, tag } = req.body;

  if (!title) {
    return res.status(400).json({ message: 'Title is required' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO notes (user_id, title, content, tag)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [user_id, title, content || null, tag || null]
    );

    res.status(201).json({ message: 'Note added', note: result.rows[0] });
  } catch (error) {
    console.error('Add note error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get all notes
export const getNotes = async (req, res) => {
  const user_id = req.user.userId;

  try {
    const result = await pool.query(
      'SELECT * FROM notes WHERE user_id = $1 ORDER BY updated_at DESC',
      [user_id]
    );

    res.status(200).json({ notes: result.rows });
  } catch (error) {
    console.error('Get notes error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update note
export const updateNote = async (req, res) => {
  const { id } = req.params;
  const user_id = req.user.userId;
  const { title, content, tag } = req.body;

  if (!title) {
    return res.status(400).json({ message: 'Title is required' });
  }

  try {
    const existing = await pool.query(
      'SELECT * FROM notes WHERE id = $1 AND user_id = $2',
      [id, user_id]
    );

    if (existing.rows.length === 0) {
      return res.status(404).json({ message: 'Note not found' });
    }

    const result = await pool.query(
      `UPDATE notes SET
        title = $1, content = $2, tag = $3, updated_at = NOW()
       WHERE id = $4 AND user_id = $5
       RETURNING *`,
      [title, content || null, tag || null, id, user_id]
    );

    res.status(200).json({ message: 'Note updated', note: result.rows[0] });
  } catch (error) {
    console.error('Update note error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete note
export const deleteNote = async (req, res) => {
  const { id } = req.params;
  const user_id = req.user.userId;

  try {
    const result = await pool.query(
      'DELETE FROM notes WHERE id = $1 AND user_id = $2 RETURNING *',
      [id, user_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Note not found' });
    }

    res.status(200).json({ message: 'Note deleted' });
  } catch (error) {
    console.error('Delete note error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};