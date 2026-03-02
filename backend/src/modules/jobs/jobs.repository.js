import { pool } from '../../database/pool.js';

const toJob = (row) => ({
  id: row.id,
  title: row.title,
  company: row.company,
  location: row.location,
  category: row.category,
  description: row.description,
  employment_type: row.employment_type,
  company_logo: row.company_logo,
  tags: row.tags || [],
  created_at: row.created_at,
  updated_at: row.updated_at,
});

export const jobsRepository = {
  async list({ search, category, location, page, limit }) {
    const values = [];
    const where = [];

    if (search) {
      values.push(`%${search}%`);
      where.push(`(title ILIKE $${values.length} OR company ILIKE $${values.length})`);
    }

    if (category) {
      values.push(category);
      where.push(`category = $${values.length}`);
    }

    if (location) {
      values.push(`%${location}%`);
      where.push(`location ILIKE $${values.length}`);
    }

    const whereSql = where.length > 0 ? `WHERE ${where.join(' AND ')}` : '';

    const countQuery = `SELECT COUNT(*)::int AS total FROM jobs ${whereSql}`;
    const countResult = await pool.query(countQuery, values);
    const total = countResult.rows[0]?.total || 0;

    let paginationSql = '';
    const pagedValues = [...values];

    if (page && limit) {
      const offset = (page - 1) * limit;
      pagedValues.push(limit);
      const limitIndex = pagedValues.length;
      pagedValues.push(offset);
      const offsetIndex = pagedValues.length;
      paginationSql = ` LIMIT $${limitIndex} OFFSET $${offsetIndex}`;
    }

    const dataQuery = `
      SELECT id, title, company, location, category, description, employment_type, company_logo, tags, created_at, updated_at
      FROM jobs
      ${whereSql}
      ORDER BY created_at DESC
      ${paginationSql}
    `;

    const result = await pool.query(dataQuery, pagedValues);

    return {
      rows: result.rows.map(toJob),
      total,
    };
  },

  async findById(id) {
    const result = await pool.query(
      `SELECT id, title, company, location, category, description, employment_type, company_logo, tags, created_at, updated_at
       FROM jobs
       WHERE id = $1`,
      [id],
    );

    if (result.rowCount === 0) {
      return null;
    }

    return toJob(result.rows[0]);
  },

  async getMeta() {
    const categoryResult = await pool.query(`
      SELECT category, COUNT(*)::int AS count
      FROM jobs
      GROUP BY category
      ORDER BY count DESC, category ASC
    `);

    const totalResult = await pool.query('SELECT COUNT(*)::int AS total FROM jobs');

    return {
      total_jobs: totalResult.rows[0]?.total || 0,
      categories: categoryResult.rows.map((row) => ({
        name: row.category,
        count: row.count,
      })),
    };
  },

  async create(payload) {
    const result = await pool.query(
      `INSERT INTO jobs (title, company, location, category, description, employment_type, company_logo, tags)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING id, title, company, location, category, description, employment_type, company_logo, tags, created_at, updated_at`,
      [
        payload.title,
        payload.company,
        payload.location,
        payload.category,
        payload.description,
        payload.employment_type || 'Full Time',
        payload.company_logo || null,
        payload.tags || [],
      ],
    );

    return toJob(result.rows[0]);
  },

  async removeById(id) {
    const result = await pool.query('DELETE FROM jobs WHERE id = $1 RETURNING id', [id]);
    return result.rowCount > 0;
  },
};
