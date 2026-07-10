import { pool } from '../config/db.js';
import cloudinary from '../config/cloudinary.js';

// Upload and add resume
export const addResume = async (req, res) => {
  const user_id = req.user.userId;
  const { title, version, notes } = req.body;

  if (!title) {
    return res.status(400).json({ message: 'Title is required' });
  }

  if (!req.file) {
    return res.status(400).json({ message: 'PDF file is required' });
  }

  try {
    const url = req.file.path;

    const result = await pool.query(
      `INSERT INTO resumes (user_id, title, url, version, notes)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [user_id, title, url, version || null, notes || null]
    );

    res.status(201).json({ message: 'Resume uploaded', resume: result.rows[0] });
  } catch (error) {
    console.error('Add resume error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get all resumes
export const getResumes = async (req, res) => {
  const user_id = req.user.userId;

  try {
    const result = await pool.query(
      'SELECT * FROM resumes WHERE user_id = $1 ORDER BY created_at DESC',
      [user_id]
    );

    res.status(200).json({ resumes: result.rows });
  } catch (error) {
    console.error('Get resumes error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Set active resume
export const setActiveResume = async (req, res) => {
  const { id } = req.params;
  const user_id = req.user.userId;

  try {
    // Set all resumes inactive first
    await pool.query(
      'UPDATE resumes SET is_active = false WHERE user_id = $1',
      [user_id]
    );

    // Set selected resume active
    const result = await pool.query(
      'UPDATE resumes SET is_active = true WHERE id = $1 AND user_id = $2 RETURNING *',
      [id, user_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    res.status(200).json({ message: 'Active resume updated', resume: result.rows[0] });
  } catch (error) {
    console.error('Set active resume error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete resume
export const deleteResume = async (req, res) => {
  const { id } = req.params;
  const user_id = req.user.userId;

  try {
    const existing = await pool.query(
      'SELECT * FROM resumes WHERE id = $1 AND user_id = $2',
      [id, user_id]
    );

    if (existing.rows.length === 0) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    // Delete from Cloudinary
    const resume = existing.rows[0];
    const urlParts = resume.url.split('/');
    const publicId = `placement-prep/resumes/${urlParts[urlParts.length - 1].split('.')[0]}`;
    await cloudinary.uploader.destroy(publicId, { resource_type: 'raw' });

    // Delete from DB
    await pool.query(
      'DELETE FROM resumes WHERE id = $1 AND user_id = $2',
      [id, user_id]
    );

    res.status(200).json({ message: 'Resume deleted' });
  } catch (error) {
    console.error('Delete resume error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};