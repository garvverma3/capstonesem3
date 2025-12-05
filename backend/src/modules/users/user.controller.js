const { StatusCodes } = require('http-status-codes');
const { asyncHandler } = require('../../utils/asyncHandler');
const { ApiResponse } = require('../../utils/apiResponse');
const { ApiError } = require('../../utils/apiError');
const { ROLES } = require('../../constants/roles');
const {
  listUsers,
  countUsers,
  findUserById,
  updateUserRole,
} = require('./user.service');
const { buildPagination } = require('../../utils/paginate');

const getProfile = asyncHandler(async (req, res) => {
  return res
    .status(StatusCodes.OK)
    .json(new ApiResponse(StatusCodes.OK, req.user, 'Profile fetched'));
});

const getUsers = asyncHandler(async (req, res) => {
  const { role } = req.query;
  const pagination = buildPagination(req.query);
  const filter = {};
  if (role && Object.values(ROLES).includes(role)) {
    filter.role = role;
  }

  const [users, total] = await Promise.all([
    listUsers({ filter, skip: pagination.skip, limit: pagination.limit }),
    countUsers(filter),
  ]);

  return res.status(StatusCodes.OK).json(
    new ApiResponse(
      StatusCodes.OK,
      users,
      'Users fetched',
      {
        total,
        page: pagination.page,
        pageSize: pagination.limit,
        totalPages: Math.ceil(total / pagination.limit),
      },
    ),
  );
});

const changeUserRole = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { role } = req.body;

  if (!Object.values(ROLES).includes(role)) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid role');
  }

  const user = await updateUserRole(userId, role);
  if (!user) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'User not found');
  }

  return res
    .status(StatusCodes.OK)
    .json(new ApiResponse(StatusCodes.OK, user, 'Role updated'));
});

const getUserById = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const user = await findUserById(userId);
  if (!user) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'User not found');
  }

  return res
    .status(StatusCodes.OK)
    .json(new ApiResponse(StatusCodes.OK, user, 'User fetched'));
});

module.exports = {
  getProfile,
  getUsers,
  changeUserRole,
  getUserById,
};


