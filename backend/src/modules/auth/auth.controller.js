const { StatusCodes } = require('http-status-codes');
const prisma = require('../../config/prisma');
const { ApiError } = require('../../utils/apiError');
const { ApiResponse } = require('../../utils/apiResponse');
const { asyncHandler } = require('../../utils/asyncHandler');
const {
  hashPassword,
  comparePassword,
  generateAuthTokens,
  verifyRefreshToken,
  incrementRefreshVersion,
  sanitizeUser,
} = require('./auth.service');
const { ROLES } = require('../../constants/roles');

const register = asyncHandler(async (req, res) => {
  const { name, email, password, role, phone } = req.body;

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new ApiError(StatusCodes.CONFLICT, 'Email already in use');
  }

  if (role && role === ROLES.ADMIN) {
    throw new ApiError(StatusCodes.FORBIDDEN, 'Cannot self assign admin role');
  }

  const hashed = await hashPassword(password);
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashed,
      role: role || ROLES.PHARMACIST,
      phone,
    }
  });

  const tokens = generateAuthTokens(user);

  return res.status(StatusCodes.CREATED).json(
    new ApiResponse(StatusCodes.CREATED, {
      user: sanitizeUser(user),
      tokens,
    }),
  );
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true, email: true, name: true, role: true, phone: true, password: true, refreshTokenVersion: true, createdAt: true, updatedAt: true }
  });
  if (!user) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, 'Invalid credentials');
  }

  const isValid = await comparePassword(password, user.password);
  if (!isValid) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, 'Invalid credentials');
  }

  const tokens = generateAuthTokens(user);

  return res.status(StatusCodes.OK).json(
    new ApiResponse(StatusCodes.OK, {
      user: sanitizeUser(user),
      tokens,
    }),
  );
});

const refreshToken = asyncHandler(async (req, res) => {
  const { refreshToken: token } = req.body;
  if (!token) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Refresh token required');
  }

  const user = await verifyRefreshToken(token);
  const tokens = generateAuthTokens(user);

  return res.status(StatusCodes.OK).json(
    new ApiResponse(StatusCodes.OK, {
      user: sanitizeUser(user),
      tokens,
    }),
  );
});

const logout = asyncHandler(async (req, res) => {
  await incrementRefreshVersion(req.user.id);
  return res
    .status(StatusCodes.OK)
    .json(new ApiResponse(StatusCodes.OK, null, 'Logged out'));
});

module.exports = {
  register,
  login,
  refreshToken,
  logout,
};


