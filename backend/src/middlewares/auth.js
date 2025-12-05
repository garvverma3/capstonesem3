const jwt = require('jsonwebtoken');
const { StatusCodes } = require('http-status-codes');
const { config } = require('../config/env');
const { ApiError } = require('../utils/apiError');
const { User } = require('../modules/users/user.model');

const authenticate = async (req, res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, 'Authentication required');
    }

    const token = header.split(' ')[1];
    const payload = jwt.verify(token, config.jwt.secret);
    const user = await User.findById(payload.userId);
    if (!user) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, 'Invalid token');
    }

    req.user = user;
    return next();
  } catch (error) {
    return next(
      error instanceof ApiError
        ? error
        : new ApiError(StatusCodes.UNAUTHORIZED, 'Invalid or expired token'),
    );
  }
};

const authorize =
  (...roles) =>
  (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(
        new ApiError(StatusCodes.FORBIDDEN, 'Insufficient permissions'),
      );
    }
    return next();
  };

module.exports = { authenticate, authorize };


