import { env } from './env.js';

export const logger = {
  info: (...args) => {
    if (!env.isProduction) {
      console.info(...args);
    }
  },
  warn: (...args) => {
    if (!env.isProduction) {
      console.warn(...args);
    }
  },
  error: (...args) => {
    console.error(...args);
  },
};
