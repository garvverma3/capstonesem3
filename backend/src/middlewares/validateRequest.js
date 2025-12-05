const { ApiError } = require('../utils/apiError');
const { StatusCodes } = require('http-status-codes');

const validateRequest = (schema) => (req, res, next) => {
  try {
    const data = {
      body: req.body,
      query: req.query,
      params: req.params,
    };
    schema.parse(data);
    return next();
  } catch (error) {
    const errorMessage = error.errors
      ?.map((err) => {
        const path = err.path?.join('.') || 'field';
        return `${path}: ${err.message}`;
      })
      .join(', ') || 'Validation failed';
    
    return next(
      new ApiError(StatusCodes.BAD_REQUEST, errorMessage, error.errors),
    );
  }
};

module.exports = { validateRequest };


