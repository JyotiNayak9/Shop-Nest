const express = require('express'); 
const loginCheck = require('../../middlewares/auth.middleware');
const { placeOrder, getMyOrders, cancelOrder, getAllOrders } = require('./order.controller');
const hasPermission = require('../../middlewares/rbac.middleware');


const OrderRouter = express.Router();

OrderRouter.post('/order',loginCheck,placeOrder)
OrderRouter.get("/getMyOrders/:id",loginCheck,getMyOrders)
OrderRouter.patch('/cancelOrder/:id',loginCheck, cancelOrder)
OrderRouter.get("/getAllOrders",loginCheck, hasPermission('admin'), getAllOrders)
module.exports = OrderRouter;