const ProductModel = require("../product/product.model");
const OrderModel = require("./order.model");

const placeOrder = async (req, res) => {
  try {
    const { customerId, items, customer, totalAmount } = req.body;
    
    if (!items || !customer || !totalAmount) {
      throw Error('Missing required fields');
    }

    const order = await OrderModel.create({
      customer: customerId, 
      shippingInfo: customer,
      items,
      totalAmount,
    });
    order.save();
    console.log(order);
    res.json({ 
        message: 'Order placed successfully', 
        result:order,
        meta:null
     });
  } catch (exception) {
    console.log(exception);
    throw(exception);
  }
};

 const getMyOrders = async (req, res) => {
  try {
    const  id  = req.params.id;
    const orders = await OrderModel.find({ customer: id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (exception) {
   console.log(exception);
    throw(exception);
  }
};

const cancelOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    // const userId = req.userId;

    const order = await OrderModel.findById(orderId);             

    if (order.status !== 'pending') {
      return res.status(400).json({message:'Only pending orders can be cancelled'});
    }

    order.status = 'cancelled';
    await order.save();

    res.json({ message: 'Order cancelled successfully', order });
  } catch (exception) {
    console.log(exception);
    throw(exception);
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await OrderModel.find()
      .populate('customer', 'name email')
    //   .populate('items.productId', 'name c') 
      .sort({ createdAt: -1 });

    //   console.log(orders);
    const fullOrders = await Promise.all(orders.map(async (order) => {
      const detailedItems = await Promise.all(order.items.map(async (item) => {
        const product = await ProductModel.findById(item.productId).populate('createdBy', 'store email role name');
        // console.log(product);
        return {
          name: product?.title || '',
          quantity: item.quantity,
          price: item.price,
          seller: product?.seller,
        };
      }));

      return {
        ...order.toObject(),
        items: detailedItems,
      };
    }));

    res.json(fullOrders);
  } catch (exception) {
    console.log(exception);
    throw(exception);
  }
};

module.exports = {
  placeOrder,
  getMyOrders,
  cancelOrder,
  getAllOrders
};