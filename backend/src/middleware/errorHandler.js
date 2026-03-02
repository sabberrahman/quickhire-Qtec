import { ZodError } from 'zod';
import { AppError } from '../utils/appError.js';
import { sendError } from '../utils/apiResponse.js';
import { env } from '../config/env.js';
import { logger } from '../config/logger.js';

const mapZodIssues = (issues) => issues.map((issue) => ({
  field: issue.path.join('.') || 'body',
  message: issue.message,
}));

export const errorHandler = (err, req, res, _next) => {
  if (err instanceof ZodError) {
    return sendError(res, {
      statusCode: 400,
      message: 'Validation failed',
      errors: mapZodIssues(err.issues),
    });
  }

  if (err instanceof AppError) {
    return sendError(res, {
      statusCode: err.statusCode,
      message: err.message,
      errors: err.errors,
    });
  }

  logger.error('Unhandled error:', err);

  return sendError(res, {
    statusCode: 500,
    message: 'Internal server error',
    errors: env.isProduction ? null : [{ field: 'server', message: err.message }],
  });
};
