import { authService } from '../modules/auth/auth.service.js';
import { parseCookies } from '../utils/cookies.js';
import { env } from '../config/env.js';
import { AppError } from '../utils/appError.js';

export const attachAuthUser = async (req, _res, next) => {
  const cookies = parseCookies(req.headers.cookie || '');
  const sessionToken = cookies[env.sessionCookieName] || null;
  req.sessionToken = sessionToken;

  if (!sessionToken) {
    req.user = null;
    next();
    return;
  }

  const user = await authService.getSessionUser(sessionToken);
  req.user = user || null;
  next();
};

export const requireAuth = (req, _res, next) => {
  if (!req.user) {
    throw new AppError('Authentication required', 401, [
      { field: 'auth', message: 'Please login to access this resource' },
    ]);
  }

  next();
};
