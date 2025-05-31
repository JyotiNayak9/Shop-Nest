const express = require('express'); 
const loginCheck = require('../../middlewares/auth.middleware');
const { placeOrder, getMyOrders, cancelOrder, getAllOrders, getOrdersForSeller } = require('./order.controller');
const hasPermission = require('../../middlewares/rbac.middleware');


const OrderRouter = express.Router();

OrderRouter.post('/order',loginCheck,placeOrder)
OrderRouter.get("/getMyOrders/:id",loginCheck,getMyOrders)
OrderRouter.patch('/cancelOrder/:id',loginCheck, cancelOrder)
OrderRouter.get("/getAllOrders",loginCheck, hasPermission('admin'), getAllOrders)
OrderRouter.get("/getOrdersBySeller",loginCheck, hasPermission('seller'), getOrdersForSeller)

module.exports = OrderRouter;