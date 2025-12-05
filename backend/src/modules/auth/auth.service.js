const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { config } = require('../../config/env');
const prisma = require('../../config/prisma');
const { ApiError } = require('../../utils/apiError');
const { StatusCodes } = require('http-status-codes');

const SALT_ROUNDS = 10;

const hashPassword = (password) => bcrypt.hash(password, SALT_ROUNDS);
const comparePassword = (password, hash) => bcrypt.compare(password, hash);

const generateAccessToken = (user) =>
  jwt.sign(
    { userId: user.id.toString(), role: user.role },
    config.jwt.secret,
    {
      expiresIn: config.jwt.accessExpiresIn,
    },
  );

const generateRefreshToken = (user) =>
  jwt.sign(
    {
      userId: user.id.toString(),
      tokenVersion: user.refreshTokenVersion,
    },
    config.jwt.refreshSecret,
    {
      expiresIn: config.jwt.refreshExpiresIn,
    },
  );

const generateAuthTokens = (user) => ({
  accessToken: generateAccessToken(user),
  refreshToken: generateRefreshToken(user),
});

const verifyRefreshToken = async (token) => {
  try {
    const payload = jwt.verify(token, config.jwt.refreshSecret);
    const user = await prisma.user.findUnique({
      where: { id: parseInt(payload.userId) },
      select: { id: true, email: true, name: true, role: true, refreshTokenVersion: true }
    });
    if (!user || user.refreshTokenVersion !== payload.tokenVersion) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, 'Invalid refresh token');
    }
    return user;
  } catch (error) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, 'Invalid refresh token');
  }
};

const incrementRefreshVersion = async (userId) => {
  await prisma.user.update({
    where: { id: parseInt(userId) },
    data: { refreshTokenVersion: { increment: 1 } }
  });
};

const sanitizeUser = (user) => {
  const { password, refreshTokenVersion, ...safe } = user;
  return safe;
};

module.exports = {
  hashPassword,
  comparePassword,
  generateAuthTokens,
  verifyRefreshToken,
  incrementRefreshVersion,
  sanitizeUser,
};


