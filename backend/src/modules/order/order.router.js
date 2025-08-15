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

OrderRouter.post('/order',loginCheck,placeOrder)
OrderRouter.get("/getMyOrders/:id",loginCheck,getMyOrders)
OrderRouter.patch('/cancelOrder/:id',loginCheck, cancelOrder)
OrderRouter.get("/getAllOrders",loginCheck, hasPermission('admin'), getAllOrders)
OrderRouter.get('/seller/earnings', loginCheck, hasPermission('admin', 'seller'), getSellerEarnings);
OrderRouter.get("/getOrdersBySeller/:id", loginCheck, hasPermission('seller'), getOrdersForSeller)
OrderRouter.patch("/update-status/:orderId", loginCheck, hasPermission('seller'), updateOrderStatus);
OrderRouter.get("/analytics", loginCheck, hasPermission('admin'), getSalesAnalytics)

module.exports = OrderRouter;