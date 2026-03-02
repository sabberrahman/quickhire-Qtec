import dotenv from 'dotenv';

dotenv.config();

const isProduction = process.env.NODE_ENV === 'production';
const dbProvider = process.env.DB_PROVIDER || 'local';

const buildLocalDatabaseUrl = () => {
  if (process.env.LOCAL_DATABASE_URL) {
    return process.env.LOCAL_DATABASE_URL;
  }

  const host = process.env.LOCAL_DB_HOST || 'localhost';
  const port = process.env.LOCAL_DB_PORT || '5432';
  const name = process.env.LOCAL_DB_NAME || 'quickhire';
  const user = process.env.LOCAL_DB_USER || 'postgres';
  const password = process.env.LOCAL_DB_PASSWORD || 'sabber@123';

  return `postgresql://${encodeURIComponent(user)}:${encodeURIComponent(password)}@${host}:${port}/${name}`;
};

const resolveDatabaseUrl = () => {
  if (process.env.DATABASE_URL) {
    return process.env.DATABASE_URL;
  }

  if (dbProvider === 'neon') {
    return process.env.NEON_DATABASE_URL;
  }

  return buildLocalDatabaseUrl();
};

const databaseUrl = resolveDatabaseUrl();

export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number.parseInt(process.env.PORT || '4000', 10),
  dbProvider,
  databaseUrl,
  useDbSsl: dbProvider === 'neon' || Boolean(databaseUrl?.includes('neon.tech')),
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:8080',
  adminApiKey: process.env.ADMIN_API_KEY || '',
  rateLimitWindowMs: Number.parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
  rateLimitMax: Number.parseInt(process.env.RATE_LIMIT_MAX || '200', 10),
  seedOnStart: process.env.SEED_ON_START !== 'false',
  seedForce: process.env.SEED_FORCE === 'true',
  sessionCookieName: process.env.SESSION_COOKIE_NAME || 'quickhire_session',
  sessionTtlDays: Number.parseInt(process.env.SESSION_TTL_DAYS || '7', 10),
  sessionCookieSameSite: process.env.SESSION_COOKIE_SAME_SITE || (isProduction ? 'none' : 'lax'),
  sessionCookieSecure: process.env.SESSION_COOKIE_SECURE
    ? process.env.SESSION_COOKIE_SECURE === 'true'
    : isProduction,
  sessionHeaderName: process.env.SESSION_HEADER_NAME || 'x-session-token',
  demoUserEmail: process.env.DEMO_USER_EMAIL || 'demo@quickhire.local',
  demoUserPassword: process.env.DEMO_USER_PASSWORD || 'Demo@12345',
  guestUserEmail: process.env.GUEST_USER_EMAIL || 'guest@quickhire.local',
  guestUserPassword: process.env.GUEST_USER_PASSWORD || 'Guest@12345',
  isProduction,
};

if (!env.databaseUrl) {
  throw new Error(
    'Database connection is not configured. Set DATABASE_URL or configure DB_PROVIDER with LOCAL/NEON settings.',
  );
}
