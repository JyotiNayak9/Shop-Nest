const mongoose = require('mongoose');

const CartStatus = {
  PENDING: 'pending',
  ORDERED: 'ordered',
  CANCELLED: 'cancelled'
};

const CartDetailSchema = new mongoose.Schema(
  {
    // orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true },
    productTitle: { type: String, required: true },
    price: { type: Number, required: true },
    amount: { type: Number, required: true },
    // total: {type:Number},
    image:{type:String}, 
    status: {
      type: String,
      enum: Object.values(CartStatus),
      default: CartStatus.PENDING
    }
  },
  { timestamps: true,
    autoCreate:true,
    autoIndex:true
   }
);
const CartModel = mongoose.model('Cart', CartDetailSchema);
module.exports = CartModel;
