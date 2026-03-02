import { Router } from 'express';
import { checkDatabaseConnection } from '../database/pool.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';
import { env } from '../config/env.js';

const router = Router();

router.get('/health', async (_req, res) => {
  let database = 'down';
  try {
    await checkDatabaseConnection();
    database = 'up';
  } catch (_error) {
    database = 'down';
  }

  return sendSuccess(res, {
    message: 'Health check successful',
    data: {
      uptime_seconds: process.uptime(),
      database,
      environment: env.nodeEnv,
      timestamp: new Date().toISOString(),
    },
  });
});

router.get('/ready', async (_req, res) => {
  try {
    await checkDatabaseConnection();
    return sendSuccess(res, {
      message: 'Service is ready',
      data: {
        database: 'reachable',
        timestamp: new Date().toISOString(),
      },
    });
  } catch (_error) {
    return sendError(res, {
      statusCode: 503,
      message: 'Service is not ready',
      errors: [{ field: 'database', message: 'Database is unreachable' }],
    });
  }
});

export default router;
