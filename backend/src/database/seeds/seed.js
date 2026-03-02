import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { pool } from '../pool.js';
import { logger } from '../../config/logger.js';
import { runMigrations } from '../migrations/runMigrations.js';
import { hashPassword } from '../../utils/password.js';
import { env } from '../../config/env.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const jobsSeedPath = path.join(__dirname, 'data', 'jobs.seed.json');
const companiesSeedPath = path.join(__dirname, 'data', 'companies.seed.json');

const loadSeedJobs = async () => {
  const raw = await fs.readFile(jobsSeedPath, 'utf8');
  const parsed = JSON.parse(raw);

  if (!Array.isArray(parsed)) {
    throw new Error('Seed file is invalid. Expected an array of jobs.');
  }

  return parsed;
};

const loadSeedCompanies = async () => {
  const raw = await fs.readFile(companiesSeedPath, 'utf8');
  const parsed = JSON.parse(raw);

  if (!Array.isArray(parsed)) {
    throw new Error('Companies seed file is invalid. Expected an array of companies.');
  }

  return parsed;
};

export const runSeed = async ({ force = false } = {}) => {
  const jobs = await loadSeedJobs();
  const companies = await loadSeedCompanies();
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    if (force) {
      await client.query('DELETE FROM sessions');
      await client.query('DELETE FROM applications');
      await client.query('DELETE FROM jobs');
      await client.query('DELETE FROM companies');
      await client.query('DELETE FROM users WHERE email IN ($1, $2)', [env.demoUserEmail, env.guestUserEmail]);
    }

    let insertedJobs = 0;
    const existingCountResult = await client.query('SELECT COUNT(*)::int AS total FROM jobs');
    const existingJobs = existingCountResult.rows[0]?.total || 0;

    if (existingJobs === 0 || force) {
      for (const job of jobs) {
        await client.query(
          `INSERT INTO jobs (title, company, location, category, description, employment_type, company_logo, tags, created_at, updated_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, COALESCE($9::timestamptz, NOW()), NOW())`,
          [
            job.title,
            job.company,
            job.location,
            job.category,
            job.description,
            job.employment_type || 'Full Time',
            job.company_logo || null,
            job.tags || [],
            job.created_at || null,
          ],
        );
      }
      insertedJobs = jobs.length;
    }

    const upsertCompanyQuery = `
      INSERT INTO companies (name, slug, location, industry, website, description, total_employees, rating, logo)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      ON CONFLICT (slug)
      DO UPDATE SET
        name = EXCLUDED.name,
        location = EXCLUDED.location,
        industry = EXCLUDED.industry,
        website = EXCLUDED.website,
        description = EXCLUDED.description,
        total_employees = EXCLUDED.total_employees,
        rating = EXCLUDED.rating,
        logo = EXCLUDED.logo,
        updated_at = NOW()
    `;

    for (const company of companies) {
      await client.query(upsertCompanyQuery, [
        company.name,
        company.slug,
        company.location,
        company.industry,
        company.website || null,
        company.description,
        company.total_employees || 0,
        company.rating || 0,
        company.logo || null,
      ]);
    }

    const demoPasswordHash = hashPassword(env.demoUserPassword);
    const guestPasswordHash = hashPassword(env.guestUserPassword);

    const upsertUserQuery = `
      INSERT INTO users (name, email, password_hash, resume_link, is_guest)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (email)
      DO UPDATE SET
        name = EXCLUDED.name,
        password_hash = EXCLUDED.password_hash,
        resume_link = EXCLUDED.resume_link,
        is_guest = EXCLUDED.is_guest,
        updated_at = NOW()
      RETURNING id, email
    `;

    const demoUserResult = await client.query(upsertUserQuery, [
      'Demo User',
      env.demoUserEmail,
      demoPasswordHash,
      'http://localhost:8080/Shohanur_Rahman_sabbir_resume.pdf',
      false,
    ]);

    await client.query(upsertUserQuery, [
      'Guest User',
      env.guestUserEmail,
      guestPasswordHash,
      'http://localhost:8080/Shohanur_Rahman_sabbir_resume.pdf',
      true,
    ]);

    const demoUserId = demoUserResult.rows[0]?.id;
    const applicationsCount = await client.query('SELECT COUNT(*)::int AS total FROM applications');

    if (demoUserId && (Number(applicationsCount.rows[0]?.total || 0) === 0 || force)) {
      const sampleJobs = await client.query(
        `SELECT id, title, company
         FROM jobs
         ORDER BY created_at DESC
         LIMIT 2`,
      );

      for (const [index, job] of sampleJobs.rows.entries()) {
        const status = index === 0 ? 'Reviewing' : 'Shortlisted';
        await client.query(
          `INSERT INTO applications (job_id, user_id, name, email, resume_link, cover_note, status, tracking_token, status_updated_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, encode(gen_random_bytes(12), 'hex'), NOW())`,
          [
            job.id,
            demoUserId,
            'Demo User',
            env.demoUserEmail,
            'http://localhost:8080/Shohanur_Rahman_sabbir_resume.pdf',
            `I am very interested in ${job.title} at ${job.company}.`,
            status,
          ],
        );
      }

      await client.query(
        `INSERT INTO applications (job_id, user_id, name, email, resume_link, cover_note, status, tracking_token, status_updated_at)
         VALUES (
           (SELECT id FROM jobs ORDER BY created_at DESC LIMIT 1),
           NULL,
           'Anonymous Candidate',
           'anonymous@example.com',
           'http://localhost:8080/Shohanur_Rahman_sabbir_resume.pdf',
           'Sharing my anonymous application for review.',
           'Submitted',
           encode(gen_random_bytes(12), 'hex'),
           NOW()
         )`,
      );
    }

    await client.query('COMMIT');
    logger.info(
      `Seed completed: jobs inserted ${insertedJobs}, companies upserted ${companies.length}, demo users upserted and sample applications ensured`,
    );
    return { seeded: true, insertedJobs, skippedBecauseNotEmpty: false };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

const isDirectRun = process.argv[1] && path.resolve(process.argv[1]) === __filename;

if (isDirectRun) {
  const force = process.env.SEED_FORCE === 'true';

  runMigrations()
    .then(() => runSeed({ force }))
    .catch((error) => {
      logger.error('Seed failed', error);
      process.exitCode = 1;
    })
    .finally(async () => {
      await pool.end();
    });
}
