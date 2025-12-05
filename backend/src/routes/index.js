const { Router } = require('express');
const authRoutes = require('../modules/auth/auth.routes');
const userRoutes = require('../modules/users/user.routes');
const drugRoutes = require('../modules/drugs/drug.routes');
const supplierRoutes = require('../modules/suppliers/supplier.routes');
const orderRoutes = require('../modules/orders/order.routes');

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/drugs', drugRoutes);
router.use('/suppliers', supplierRoutes);
router.use('/orders', orderRoutes);

module.exports = router;


