const { config } = require('../config/env');

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  const response = {
    message,
    errors: err.errors || [],
    stack: config.env === 'development' ? err.stack : undefined,
  };

  res.status(statusCode).json(response);
};

module.exports = { errorHandler };


