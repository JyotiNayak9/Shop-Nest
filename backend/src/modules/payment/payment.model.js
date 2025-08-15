const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'NPR'
  },
  paymentMethod: {
    type: String,
    enum: ['KHALTI', 'CASH_ON_DELIVERY', 'ESEWA'],
    required: true
  },
  status: {
    type: String,
    enum: ['PENDING', 'COMPLETED', 'FAILED', 'REFUNDED'],
    default: 'PENDING'
  },
  transactionId: String,
  paymentDetails: {},
  refundDetails: {
    amount: Number,
    reason: String,
    processedAt: Date
  },
  paidAt: Date,
  refundedAt: Date
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
paymentSchema.index({ orderId: 1 });
paymentSchema.index({ userId: 1 });
paymentSchema.index({ status: 1 });
paymentSchema.index({ 'paymentDetails.idx': 1 });

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;
