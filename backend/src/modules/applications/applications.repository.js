import { pool } from '../../database/pool.js';

const toApplication = (row) => ({
  id: row.id,
  job_id: row.job_id,
  job_title: row.job_title,
  job_company: row.job_company,
  user_id: row.user_id,
  name: row.name,
  email: row.email,
  resume_link: row.resume_link,
  cover_note: row.cover_note,
  status: row.status,
  tracking_token: row.tracking_token,
  status_updated_at: row.status_updated_at,
  created_at: row.created_at,
});

export const applicationsRepository = {
  async create(payload) {
    const result = await pool.query(
      `INSERT INTO applications (job_id, user_id, name, email, resume_link, cover_note, status, tracking_token, status_updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, 'Submitted', encode(gen_random_bytes(12), 'hex'), NOW())
       RETURNING id, job_id, user_id, name, email, resume_link, cover_note, status, tracking_token, status_updated_at, created_at`,
      [
        payload.job_id,
        payload.user_id || null,
        payload.name,
        payload.email,
        payload.resume_link,
        payload.cover_note,
      ],
    );

    return toApplication(result.rows[0]);
  },

  async findByTrackingToken(trackingToken) {
    const result = await pool.query(
      `SELECT a.id, a.job_id, a.user_id, a.name, a.email, a.resume_link, a.cover_note, a.status, a.tracking_token, a.status_updated_at, a.created_at,
              j.title AS job_title, j.company AS job_company
       FROM applications a
       INNER JOIN jobs j ON j.id = a.job_id
       WHERE a.tracking_token = $1
       LIMIT 1`,
      [trackingToken],
    );

    if (result.rowCount === 0) {
      return null;
    }

    return toApplication(result.rows[0]);
  },

  async listByUserId(userId) {
    const result = await pool.query(
      `SELECT a.id, a.job_id, a.user_id, a.name, a.email, a.resume_link, a.cover_note, a.status, a.tracking_token, a.status_updated_at, a.created_at,
              j.title AS job_title, j.company AS job_company
       FROM applications a
       INNER JOIN jobs j ON j.id = a.job_id
       WHERE a.user_id = $1
       ORDER BY a.created_at DESC`,
      [userId],
    );

    return result.rows.map(toApplication);
  },
};
