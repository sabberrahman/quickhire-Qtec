import { pool } from '../../database/pool.js';

const toCompany = (row) => ({
  id: row.id,
  name: row.name,
  slug: row.slug,
  location: row.location,
  industry: row.industry,
  website: row.website,
  description: row.description,
  total_employees: row.total_employees,
  rating: Number(row.rating),
  logo: row.logo,
  recent_hiring_count: row.recent_hiring_count || 0,
  created_at: row.created_at,
  updated_at: row.updated_at,
});

export const companiesRepository = {
  async list() {
    const result = await pool.query(`
      SELECT c.id, c.name, c.slug, c.location, c.industry, c.website, c.description, c.total_employees, c.rating, c.logo, c.created_at, c.updated_at,
             COUNT(j.id)::int AS recent_hiring_count
      FROM companies c
      LEFT JOIN jobs j ON j.company = c.name
      GROUP BY c.id
      ORDER BY recent_hiring_count DESC, c.name ASC
    `);

    return result.rows.map(toCompany);
  },

  async findBySlug(slug) {
    const result = await pool.query(
      `SELECT c.id, c.name, c.slug, c.location, c.industry, c.website, c.description, c.total_employees, c.rating, c.logo, c.created_at, c.updated_at,
              COUNT(j.id)::int AS recent_hiring_count
       FROM companies c
       LEFT JOIN jobs j ON j.company = c.name
       WHERE c.slug = $1
       GROUP BY c.id
       LIMIT 1`,
      [slug],
    );

    if (result.rowCount === 0) {
      return null;
    }

    const company = toCompany(result.rows[0]);
    const jobsResult = await pool.query(
      `SELECT id, title, employment_type, location, created_at
       FROM jobs
       WHERE company = $1
       ORDER BY created_at DESC
       LIMIT 5`,
      [company.name],
    );

    return {
      ...company,
      recent_hiring: jobsResult.rows,
    };
  },
};
