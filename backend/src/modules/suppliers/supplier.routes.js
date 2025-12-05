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
  authorize(ROLES.ADMIN, ROLES.PHARMACIST),
  validateRequest(createSupplierSchema),
  createSupplier,
);

router.put(
  '/:supplierId',
  authorize(ROLES.ADMIN, ROLES.PHARMACIST),
  validateRequest(updateSupplierSchema),
  updateSupplier,
);

router.delete('/:supplierId', authorize(ROLES.ADMIN, ROLES.PHARMACIST), deleteSupplier);

module.exports = router;


