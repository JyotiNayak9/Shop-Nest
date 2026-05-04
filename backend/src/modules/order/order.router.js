const express = require('express'); 
const loginCheck = require('../../middlewares/auth.middleware');
const { 
  placeOrder, 
  getMyOrders, 
  cancelOrder, 
  getAllOrders, 
  getOrdersForSeller, 
  getSalesAnalytics,
  updateOrderStatus,
  getSellerEarnings
} = require('./order.controller');
const hasPermission = require('../../middlewares/rbac.middleware');

const OrderRouter = express.Router();

// Order routes - RESTful design
OrderRouter.post('/', loginCheck, placeOrder)
OrderRouter.get('/', loginCheck, hasPermission('admin'), getAllOrders)
OrderRouter.get('/my/:id', loginCheck, getMyOrders)
OrderRouter.get('/seller/:id', loginCheck, hasPermission('seller'), getOrdersForSeller)
OrderRouter.patch('/:id/cancel', loginCheck, cancelOrder)
OrderRouter.patch('/:id/status', loginCheck, hasPermission('seller'), updateOrderStatus)
OrderRouter.get('/seller/earnings', loginCheck, hasPermission('admin', 'seller'), getSellerEarnings)
OrderRouter.get('/analytics', loginCheck, hasPermission('admin'), getSalesAnalytics)

module.exports = OrderRouter;