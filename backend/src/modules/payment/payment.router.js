const express = require('express');
const PaymentRouter = express.Router();
const PaymentCtrl = require('./payment.controller');

const  loginCheck  = require('../../middlewares/auth.middleware');
const Payment = require('./payment.model');


PaymentRouter.post('/khalti/verify',loginCheck,PaymentCtrl.verifyKhaltiPayment );


PaymentRouter.post('/cod',loginCheck, PaymentCtrl.processCashOnDelivery);


PaymentRouter.get('/:id',loginCheck,PaymentCtrl.getPaymentDetails );

module.exports = PaymentRouter;