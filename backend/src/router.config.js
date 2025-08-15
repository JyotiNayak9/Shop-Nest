const express = require('express');
const router = express.Router();

// Import all module routes
const userRoutes = require('./modules/user/user.routes');
const productRoutes = require('./modules/product/product.routes');
const categoryRoutes = require('./modules/category/category.routes');
const brandRoutes = require('./modules/brand/brand.routes');
const orderRoutes = require('./modules/order/order.routes');
const reviewRoutes = require('./modules/review/review.routes');

// Mount all routes
router.use('/user', userRoutes);
router.use('/product', productRoutes);
router.use('/category', categoryRoutes);
router.use('/brand', brandRoutes);
router.use('/order', orderRoutes);
router.use('/review', reviewRoutes);

module.exports = router;
