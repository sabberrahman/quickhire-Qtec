import { env } from '../config/env.js';
import { AppError } from '../utils/appError.js';

export const requireAdmin = (req, _res, next) => {
  if (!env.adminApiKey) {
    if (env.isProduction) {
      return next(new AppError('Admin API key is not configured', 500));
    }
    return next();
  }

  const apiKey = req.headers['x-admin-key'];
  if (apiKey !== env.adminApiKey) {
    return next(new AppError('Unauthorized admin request', 401, [{ field: 'x-admin-key', message: 'Invalid or missing admin key' }]));
  }

  return next();
};
