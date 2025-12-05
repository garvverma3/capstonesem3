const { Router } = require('express');
const { authenticate, authorize } = require('../../middlewares/auth');
const { validateRequest } = require('../../middlewares/validateRequest');
const { changeRoleSchema } = require('./user.validation');
const {
  getProfile,
  getUsers,
  changeUserRole,
  getUserById,
} = require('./user.controller');
const { ROLES } = require('../../constants/roles');

const router = Router();

router.get('/me', authenticate, getProfile);

router.get('/', authenticate, authorize(ROLES.ADMIN), getUsers);

router.get('/:userId', authenticate, authorize(ROLES.ADMIN), getUserById);

router.patch(
  '/:userId/role',
  authenticate,
  authorize(ROLES.ADMIN),
  validateRequest(changeRoleSchema),
  changeUserRole,
);

module.exports = router;


