import { sendSuccess } from '../../utils/apiResponse.js';
import { authService } from './auth.service.js';
import { clearSessionCookie, buildSessionCookie } from '../../utils/cookies.js';
import { env } from '../../config/env.js';

const setSessionCookie = (res, token) => {
  res.setHeader(
    'Set-Cookie',
    buildSessionCookie({
      name: env.sessionCookieName,
      token,
      maxAgeMs: authService.sessionTtlMs,
      isProduction: env.isProduction,
    }),
  );
};

const clearCookie = (res) => {
  res.setHeader(
    'Set-Cookie',
    clearSessionCookie({
      name: env.sessionCookieName,
      isProduction: env.isProduction,
    }),
  );
};

export const authController = {
  async register(req, res) {
    const data = await authService.register(req.validated.body);
    setSessionCookie(res, data.session.token);

    return sendSuccess(res, {
      statusCode: 201,
      message: 'Registered successfully',
      data: {
        user: data.user,
      },
    });
  },

  async login(req, res) {
    const data = await authService.login(req.validated.body);
    setSessionCookie(res, data.session.token);

    return sendSuccess(res, {
      message: 'Logged in successfully',
      data: {
        user: data.user,
      },
    });
  },

  async loginGuest(_req, res) {
    const data = await authService.loginGuest();
    setSessionCookie(res, data.session.token);

    return sendSuccess(res, {
      message: 'Guest mode enabled',
      data: {
        user: data.user,
      },
    });
  },

  async me(req, res) {
    return sendSuccess(res, {
      message: 'Authenticated user fetched',
      data: req.user || null,
    });
  },

  async logout(req, res) {
    await authService.logout(req.sessionToken);
    clearCookie(res);
    return sendSuccess(res, {
      message: 'Logged out successfully',
      data: null,
    });
  },

  async updateProfile(req, res) {
    const data = await authService.updateProfile(req.user.id, req.validated.body);
    return sendSuccess(res, {
      message: 'Profile updated successfully',
      data,
    });
  },

  async demoAccount(_req, res) {
    const data = await authService.getDemoAccount();
    return sendSuccess(res, {
      message: 'Demo account details',
      data,
    });
  },
};
