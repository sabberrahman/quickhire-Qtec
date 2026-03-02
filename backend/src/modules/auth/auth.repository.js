import { pool } from '../../database/pool.js';

const toUser = (row) => ({
  id: row.id,
  name: row.name,
  email: row.email,
  resume_link: row.resume_link,
  is_guest: row.is_guest,
  created_at: row.created_at,
  updated_at: row.updated_at,
});

export const authRepository = {
  async findUserByEmail(email) {
    const result = await pool.query(
      `SELECT id, name, email, password_hash, resume_link, is_guest, created_at, updated_at
       FROM users
       WHERE LOWER(email) = LOWER($1)
       LIMIT 1`,
      [email],
    );

    return result.rows[0] || null;
  },

  async findUserById(id) {
    const result = await pool.query(
      `SELECT id, name, email, password_hash, resume_link, is_guest, created_at, updated_at
       FROM users
       WHERE id = $1
       LIMIT 1`,
      [id],
    );

    return result.rows[0] || null;
  },

  async createUser({ name, email, password_hash, resume_link, is_guest = false }) {
    const result = await pool.query(
      `INSERT INTO users (name, email, password_hash, resume_link, is_guest)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, name, email, resume_link, is_guest, created_at, updated_at`,
      [name, email, password_hash, resume_link || null, is_guest],
    );

    return toUser(result.rows[0]);
  },

  async updateUserProfile({ id, name, resume_link }) {
    const result = await pool.query(
      `UPDATE users
       SET name = $2,
           resume_link = $3,
           updated_at = NOW()
       WHERE id = $1
       RETURNING id, name, email, resume_link, is_guest, created_at, updated_at`,
      [id, name, resume_link || null],
    );

    if (result.rowCount === 0) {
      return null;
    }

    return toUser(result.rows[0]);
  },

  async createSession({ user_id, token, expires_at }) {
    await pool.query(
      `INSERT INTO sessions (user_id, token, expires_at)
       VALUES ($1, $2, $3)`,
      [user_id, token, expires_at],
    );
  },

  async findSessionWithUser(token) {
    const result = await pool.query(
      `SELECT s.token, s.expires_at, u.id, u.name, u.email, u.resume_link, u.is_guest, u.created_at, u.updated_at
       FROM sessions s
       INNER JOIN users u ON u.id = s.user_id
       WHERE s.token = $1
       LIMIT 1`,
      [token],
    );

    if (result.rowCount === 0) {
      return null;
    }

    const row = result.rows[0];
    return {
      token: row.token,
      expires_at: row.expires_at,
      user: toUser(row),
    };
  },

  async deleteSession(token) {
    await pool.query('DELETE FROM sessions WHERE token = $1', [token]);
  },

  async deleteExpiredSessions() {
    await pool.query('DELETE FROM sessions WHERE expires_at < NOW()');
  },
};
