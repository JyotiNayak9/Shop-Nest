const axios = require('axios');
const OrderModel = require('../order/order.model');
const Payment = require('./payment.model');
require ("dotenv").config();


class PaymentController{
 KHALTI_CONFIG = {
  SECRET_KEY: process.env.KHALTI_SECRET_KEY ,
  VERIFY_URL: 'https://khalti.com/api/v2/payment/verify/',
  INITIATE_URL: 'https://khalti.com/api/v2/payment/initiate/',
};


 verifyKhaltiPayment = async (req, res) => {
  const { token, amount, orderId } = req.body;
  const userId = req.user._id;

  try {
   
    const response = await axios.post(
      KHALTI_CONFIG.VERIFY_URL,
      { token, amount },
      { headers: { Authorization: `Key ${KHALTI_CONFIG.SECRET_KEY}` }}
    );

    const paymentData = response.data;
    
    const order = await OrderModel.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    const payment = await Payment.create({
      orderId: order._id,
      userId,
      amount: paymentData.amount / 100, 
      currency: 'NPR',
      paymentMethod: 'KHALTI',
      status: 'COMPLETED',
      transactionId: paymentData.idx,
      paymentDetails: paymentData,
      paidAt: new Date()
    });

    order.status = 'PAID';
    order.paymentStatus = 'PAID';
    order.paymentInfo = {
      method: 'KHALTI',
      paymentId: payment._id,
      transactionId: payment.transactionId,
      paidAt: payment.paidAt
    };
    
    await order.save();

    res.json({
      success: true,
      message: 'Payment verified successfully',
      data: {
        paymentId: payment._id,
        orderId: order._id,
        amount: payment.amount,
        status: payment.status
      }
    });

  } catch (error) {
    console.error('Payment verification failed:', error.response?.data || error.message);
    
    if (orderId) {
      await Payment.findOneAndUpdate(
        { orderId },
        { 
          status: 'FAILED',
          'paymentDetails.error': error.response?.data || error.message 
        },
        { upsert: true, new: true }
      );
    }

    res.status(400).json({
      success: false,
      message: 'Payment verification failed',
      error: error.response?.data?.detail || error.message
    });
  }
};


 processCashOnDelivery = async (req, res) => {
  const { orderId } = req.body;

  const userId = req.authUser._id;

  try {
    const order = await OrderModel.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

   
    const payment = await Payment.create({
      orderId: order._id,
      userId,
      amount: order.totalAmount,
      currency: 'NPR',
      paymentMethod: 'CASH_ON_DELIVERY',
      status: 'PENDING',
      paidAt: null
    });

  
    order.status = 'pending';
    order.paymentStatus = 'PENDING';
    order.paymentInfo = {
      method: 'CASH_ON_DELIVERY',
      paymentId: payment._id
    };
    
    await order.save();

    res.json({
      success: true,
      message: 'Order placed with Cash on Delivery',
      data: {
        paymentId: payment._id,
        orderId: order._id,
        amount: payment.amount,
        status: payment.status
      }
    });

  } catch (error) {
    console.error('Cash on Delivery processing failed:', error);
    res.status(400).json({
      success: false,
      message: 'Failed to process Cash on Delivery',
      error: error.message
    });
  }
};


 getPaymentDetails = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate('orderId', 'orderNumber totalAmount status')
      .populate('userId', 'name email');

    if (!payment) {
      return res.status(404).json({ 
        success: false, 
        message: 'Payment not found' 
      });
    }

    // Check if user is authorized to view this payment
    if (payment.userId._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized to view this payment' 
      });
    }

    res.json({ success: true, data: payment });
  } catch (error) {
    console.error('Error fetching payment details:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch payment details',
      error: error.message
    });
  }
}
}
const PaymentCtrl = new PaymentController();
module.exports = PaymentCtrl;
