import app from './app.js';
import { env } from './config/env.js';
import { pool } from './database/pool.js';
import { runMigrations } from './database/migrations/runMigrations.js';
import { runSeed } from './database/seeds/seed.js';
import { logger } from './config/logger.js';

let server;

const startServer = async () => {
  await runMigrations();
  if (env.seedOnStart) {
    await runSeed({ force: env.seedForce });
  }

  if (!env.adminApiKey && env.nodeEnv !== 'production') {
    logger.warn('ADMIN_API_KEY is not set. Admin endpoints are open in non-production mode.');
  }

  server = app.listen(env.port, () => {
    logger.info(`Server running on port ${env.port}`);
  });
};

const shutdown = async (signal) => {
  logger.info(`${signal} received. Closing server gracefully...`);

  if (server) {
    await new Promise((resolve, reject) => {
      server.close((error) => {
        if (error) {
          reject(error);
          return;
        }
        resolve();
      });
    });
  }

  await pool.end();
  process.exit(0);
};

process.on('SIGTERM', () => {
  shutdown('SIGTERM').catch((error) => {
    logger.error('Error during SIGTERM shutdown', error);
    process.exit(1);
  });
});

process.on('SIGINT', () => {
  shutdown('SIGINT').catch((error) => {
    logger.error('Error during SIGINT shutdown', error);
    process.exit(1);
  });
});

startServer().catch((error) => {
  logger.error('Failed to start server', error);
  process.exit(1);
});
