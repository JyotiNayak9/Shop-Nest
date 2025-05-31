const express = require('express');
const axios = require('axios');
const OrderModel = require('../order/order.model');
// const router = express.Router();

// router.post('/verify', verifyToken, async (req, res) => {

const khaltiPayment =  async(req, res) => {
 
  const { token, amount, orderId } = req.body;

  try {
     console.log("ajsehj");
    const response = await axios.post(
      'https://khalti.com/api/v2/payment/verify/',
      {
        token,
        amount,
      },
      {
        headers: {
          Authorization: `Key 182e993f549f4409b66c0c96c2f469fe`, 
        },
      }
    );

    // Update order status
    const order = await OrderModel.findById(orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    order.status = 'paid';
    order.paymentInfo = {
      method: 'Khalti',
      refId: response.data.idx,
    };
    await order.save();

    res.json({ message: 'Payment verified and order updated', data: response.data });
  } catch (err) {
    console.error(err.response?.data || err);
    res.status(400).json({ message: 'Payment verification failed' });
  }
};

module.exports = khaltiPayment;
