const { StatusCodes } = require('http-status-codes');
const { User } = require('../users/user.model');
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

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(StatusCodes.CONFLICT, 'Email already in use');
  }

  if (role && role === ROLES.ADMIN) {
    throw new ApiError(StatusCodes.FORBIDDEN, 'Cannot self assign admin role');
  }

  const hashed = await hashPassword(password);
  const user = await User.create({
    name,
    email,
    password: hashed,
    role: role || ROLES.PHARMACIST,
    phone,
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
  const user = await User.findOne({ email }).select('+password +refreshTokenVersion');
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
  await incrementRefreshVersion(req.user._id);
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


