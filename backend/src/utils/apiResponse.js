export const sendSuccess = (res, { statusCode = 200, message, data = null } = {}) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    errors: null,
  });
};

export const sendError = (res, { statusCode = 500, message, errors = null } = {}) => {
  return res.status(statusCode).json({
    success: false,
    message,
    data: null,
    errors,
  });
};
