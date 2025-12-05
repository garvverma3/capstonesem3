const { Router } = require('express');
const { authenticate, authorize } = require('../../middlewares/auth');
const { validateRequest } = require('../../middlewares/validateRequest');
const {
  createDrug,
  listDrugs,
  getDrugById,
  updateDrug,
  deleteDrug,
} = require('./drug.controller');
const { createDrugSchema, updateDrugSchema } = require('./drug.validation');
const { ROLES } = require('../../constants/roles');

const router = Router();

router.get('/', authenticate, listDrugs);
router.get('/:drugId', authenticate, getDrugById);

router.post(
  '/',
  authenticate,
  authorize(ROLES.ADMIN),
  validateRequest(createDrugSchema),
  createDrug,
);

router.put(
  '/:drugId',
  authenticate,
  authorize(ROLES.ADMIN),
  validateRequest(updateDrugSchema),
  updateDrug,
);

router.delete(
  '/:drugId',
  authenticate,
  authorize(ROLES.ADMIN),
  deleteDrug,
);

module.exports = router;


