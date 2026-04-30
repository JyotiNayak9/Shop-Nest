const express = require('express');
const Cartrouter = express.Router();
const loginCheck = require('../../middlewares/auth.middleware');
const cartController = require('./cart.controller');

Cartrouter.post('/', cartController.addToCart);
Cartrouter.get('/',loginCheck, cartController.getCartByCustomer);
Cartrouter.put('/:id',loginCheck, cartController.updateCartItem);
Cartrouter.delete('/:id',loginCheck, cartController.deleteCartItem);
Cartrouter.delete('/clear/:customerId',loginCheck, cartController.clearCart);
Cartrouter.get('/totals',loginCheck, cartController.getCartTotals)
module.exports = Cartrouter;
