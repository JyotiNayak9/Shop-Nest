const express = require('express');
const khaltiPayment = require('./payment.controller');
const loginCheck = require('../../middlewares/auth.middleware');

const PaymentRouter = express.Router();

PaymentRouter.post('/verify', loginCheck , khaltiPayment)

module.exports = PaymentRouter