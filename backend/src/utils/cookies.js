export const parseCookies = (cookieHeader) => {
  if (!cookieHeader) {
    return {};
  }

  return cookieHeader.split(';').reduce((acc, pair) => {
    const index = pair.indexOf('=');
    if (index === -1) {
      return acc;
    }

    const key = pair.slice(0, index).trim();
    const value = pair.slice(index + 1).trim();
    if (!key) {
      return acc;
    }

    acc[key] = decodeURIComponent(value);
    return acc;
  }, {});
};

const normalizeSameSite = (value) => {
  const mapped = String(value || 'lax').toLowerCase();
  if (mapped === 'none') return 'None';
  if (mapped === 'strict') return 'Strict';
  return 'Lax';
};

export const buildSessionCookie = ({
  name,
  token,
  maxAgeMs,
  sameSite = 'lax',
  secure = false,
}) => {
  const parts = [
    `${name}=${encodeURIComponent(token)}`,
    'Path=/',
    `Max-Age=${Math.floor(maxAgeMs / 1000)}`,
    'HttpOnly',
    `SameSite=${normalizeSameSite(sameSite)}`,
  ];

  if (secure) {
    parts.push('Secure');
  }

  return parts.join('; ');
};

export const clearSessionCookie = ({
  name,
  sameSite = 'lax',
  secure = false,
}) => {
  const parts = [
    `${name}=`,
    'Path=/',
    'Max-Age=0',
    'HttpOnly',
    `SameSite=${normalizeSameSite(sameSite)}`,
  ];

  if (secure) {
    parts.push('Secure');
  }

  return parts.join('; ');
};
