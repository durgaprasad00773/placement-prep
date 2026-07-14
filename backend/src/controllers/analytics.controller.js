import { pool } from '../config/db.js';

export const getAnalytics = async (req, res) => {
  const user_id = req.user.userId;

  try {
    // DSA Stats
    const dsaStats = await pool.query(
      `SELECT 
        COUNT(*) as total,
        COUNT(CASE WHEN status = 'Solved' THEN 1 END) as solved,
        COUNT(CASE WHEN status = 'Unsolved' THEN 1 END) as unsolved,
        COUNT(CASE WHEN status = 'Revisit' THEN 1 END) as revisit,
        COUNT(CASE WHEN difficulty = 'Easy' THEN 1 END) as easy,
        COUNT(CASE WHEN difficulty = 'Medium' THEN 1 END) as medium,
        COUNT(CASE WHEN difficulty = 'Hard' THEN 1 END) as hard
       FROM problems WHERE user_id = $1`,
      [user_id]
    );

    // DSA by topic
    const dsaByTopic = await pool.query(
      `SELECT topic, COUNT(*) as count
       FROM problems 
       WHERE user_id = $1 AND topic IS NOT NULL
       GROUP BY topic
       ORDER BY count DESC`,
      [user_id]
    );

    // OA Stats
    const oaStats = await pool.query(
      `SELECT
        COUNT(*) as total,
        COUNT(CASE WHEN status = 'Cleared' THEN 1 END) as cleared,
        COUNT(CASE WHEN status = 'Failed' THEN 1 END) as failed,
        COUNT(CASE WHEN status = 'Pending' THEN 1 END) as pending,
        COUNT(CASE WHEN status = 'No Response' THEN 1 END) as no_response
       FROM oa_records WHERE user_id = $1`,
      [user_id]
    );

    // OA by company
    const oaByCompany = await pool.query(
      `SELECT company, COUNT(*) as count, 
        COUNT(CASE WHEN status = 'Cleared' THEN 1 END) as cleared
       FROM oa_records
       WHERE user_id = $1
       GROUP BY company
       ORDER BY count DESC
       LIMIT 5`,
      [user_id]
    );

    // Problems solved over time (last 7 days)
    const solvedOverTime = await pool.query(
      `SELECT 
        DATE(solved_at) as date,
        COUNT(*) as count
       FROM problems
       WHERE user_id = $1 
         AND status = 'Solved'
         AND solved_at >= NOW() - INTERVAL '7 days'
       GROUP BY DATE(solved_at)
       ORDER BY date ASC`,
      [user_id]
    );

    res.status(200).json({
      dsa: {
        ...dsaStats.rows[0],
        byTopic: dsaByTopic.rows,
      },
      oa: {
        ...oaStats.rows[0],
        byCompany: oaByCompany.rows,
      },
      solvedOverTime: solvedOverTime.rows,
    });

  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};