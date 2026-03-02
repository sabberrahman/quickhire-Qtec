import { runMigrations } from './runMigrations.js';
import { pool } from '../pool.js';
import { logger } from '../../config/logger.js';

const run = async () => {
  try {
    await runMigrations();
    logger.info('Database migrations completed');
  } catch (error) {
    logger.error('Database migration failed', error);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
};

run();
