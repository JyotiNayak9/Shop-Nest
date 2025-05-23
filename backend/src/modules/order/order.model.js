const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  shippingInfo: {
    name: String,
    phone: String,
    address: String,
    city: String,
  },
  items: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
      },
      productTitle: String,
      price: Number,
      quantity: Number,
      image: String,
    }
  ],
  totalAmount: Number,
  status: {
    type: String,
    default: 'pending', 
  },
  paymentInfo: {
  method: String,
  refId: String,
},

},
  { timestamps: true,
    autoCreate:true,
    autoIndex:true
   }
);

const OrderModel =  mongoose.model('Order', orderSchema);
module.exports = OrderModel;