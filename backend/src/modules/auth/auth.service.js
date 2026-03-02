import { randomBytes } from 'crypto';
import { authRepository } from './auth.repository.js';
import { AppError } from '../../utils/appError.js';
import { hashPassword, verifyPassword } from '../../utils/password.js';
import { env } from '../../config/env.js';

const sessionTtlMs = env.sessionTtlDays * 24 * 60 * 60 * 1000;

const sanitizeUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  resume_link: user.resume_link,
  is_guest: user.is_guest,
  created_at: user.created_at,
  updated_at: user.updated_at,
});

const createSession = async (userId) => {
  const token = randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + sessionTtlMs);
  await authRepository.createSession({
    user_id: userId,
    token,
    expires_at: expiresAt.toISOString(),
  });
  return { token, expiresAt };
};

export const authService = {
  sessionTtlMs,

  async register(payload) {
    const existing = await authRepository.findUserByEmail(payload.email);
    if (existing) {
      throw new AppError('Email already registered', 409, [
        { field: 'email', message: 'Try logging in with this email' },
      ]);
    }

    const user = await authRepository.createUser({
      name: payload.name,
      email: payload.email,
      password_hash: hashPassword(payload.password),
      resume_link: payload.resume_link || null,
      is_guest: false,
    });

    const session = await createSession(user.id);

    return {
      user,
      session,
    };
  },

  async login(payload) {
    const user = await authRepository.findUserByEmail(payload.email);
    if (!user || !verifyPassword(payload.password, user.password_hash)) {
      throw new AppError('Invalid credentials', 401, [
        { field: 'email', message: 'Email or password is incorrect' },
      ]);
    }

    const session = await createSession(user.id);

    return {
      user: sanitizeUser(user),
      session,
    };
  },

  async loginGuest() {
    const user = await authRepository.findUserByEmail(env.guestUserEmail);
    if (!user) {
      throw new AppError('Guest account not found', 500, [
        { field: 'guest', message: 'Seed data is missing guest account' },
      ]);
    }

    const session = await createSession(user.id);
    return {
      user: sanitizeUser(user),
      session,
    };
  },

  async getSessionUser(token) {
    if (!token) {
      return null;
    }

    const session = await authRepository.findSessionWithUser(token);
    if (!session) {
      return null;
    }

    if (new Date(session.expires_at).getTime() <= Date.now()) {
      await authRepository.deleteSession(token);
      return null;
    }

    return session.user;
  },

  async logout(token) {
    if (!token) {
      return;
    }

    await authRepository.deleteSession(token);
  },

  async updateProfile(userId, payload) {
    const user = await authRepository.updateUserProfile({
      id: userId,
      name: payload.name,
      resume_link: payload.resume_link || null,
    });

    if (!user) {
      throw new AppError('User not found', 404, [
        { field: 'user', message: 'Account no longer exists' },
      ]);
    }

    return user;
  },

  async getDemoAccount() {
    return {
      email: env.demoUserEmail,
      password: env.demoUserPassword,
      guest_email: env.guestUserEmail,
      guest_password: env.guestUserPassword,
    };
  },
};
