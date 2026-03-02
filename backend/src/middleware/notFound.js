import { sendError } from '../utils/apiResponse.js';

export const notFoundHandler = (req, res) => {
  return sendError(res, {
    statusCode: 404,
    message: `Route not found: ${req.originalUrl}`,
    errors: [{ field: 'route', message: 'Not Found' }],
  });
};
