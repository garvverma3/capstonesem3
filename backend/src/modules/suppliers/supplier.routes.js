const { Router } = require('express');
const { authenticate, authorize } = require('../../middlewares/auth');
const { validateRequest } = require('../../middlewares/validateRequest');
const {
  createSupplier,
  listSuppliers,
  getSupplier,
  updateSupplier,
  deleteSupplier,
} = require('./supplier.controller');
const {
  createSupplierSchema,
  updateSupplierSchema,
} = require('./supplier.validation');
const { ROLES } = require('../../constants/roles');

const router = Router();

router.use(authenticate);

router.get('/', listSuppliers);
router.get('/:supplierId', getSupplier);

router.post(
  '/',
  authorize(ROLES.ADMIN),
  validateRequest(createSupplierSchema),
  createSupplier,
);

router.put(
  '/:supplierId',
  authorize(ROLES.ADMIN),
  validateRequest(updateSupplierSchema),
  updateSupplier,
);

router.delete('/:supplierId', authorize(ROLES.ADMIN), deleteSupplier);

module.exports = router;


