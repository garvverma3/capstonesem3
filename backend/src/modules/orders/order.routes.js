const { Router } = require('express');
const { authenticate, authorize } = require('../../middlewares/auth');
const { validateRequest } = require('../../middlewares/validateRequest');
const {
  createOrder,
  listOrders,
  getOrder,
  updateOrderStatus,
  deleteOrder,
} = require('./order.controller');
const {
  createOrderSchema,
  updateStatusSchema,
} = require('./order.validation');
const { ROLES } = require('../../constants/roles');

const router = Router();

router.use(authenticate);

router.get('/', listOrders);
router.get('/:orderId', getOrder);

router.post(
  '/',
  authorize(ROLES.PHARMACIST, ROLES.ADMIN),
  validateRequest(createOrderSchema),
  createOrder,
);

router.patch(
  '/:orderId/status',
  authorize(ROLES.PHARMACIST, ROLES.ADMIN),
  validateRequest(updateStatusSchema),
  updateOrderStatus,
);

router.delete('/:orderId', authorize(ROLES.ADMIN), deleteOrder);

module.exports = router;


