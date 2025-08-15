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

// Get sales analytics data
const getSellerEarnings = async (req, res) => {
  try {
    const { days = '30' } = req.query;
    const sellerId = req.userId;
    
    // Calculate date range
    const date = new Date();
    const daysAgo = days === 'all' ? 3650 : parseInt(days); // 10 years for 'all' time
    date.setDate(date.getDate() - daysAgo);
    
    // Get orders for the seller within the date range
    const orders = await Order.find({
      'items.seller': sellerId,
      status: { $in: ['delivered'] },
      createdAt: { $gte: date }
    }).sort({ createdAt: 1 });
    
    // Process data for daily earnings
    const dailyEarnings = {};
    let totalEarnings = 0;
    
    orders.forEach(order => {
      const orderDate = order.createdAt.toISOString().split('T')[0];
      const sellerItems = order.items.filter(item => 
        item.seller && item.seller.toString() === sellerId
      );
      
      const orderTotal = sellerItems.reduce((sum, item) => 
        sum + (item.price * item.quantity), 0
      );
      
      if (!dailyEarnings[orderDate]) {
        dailyEarnings[orderDate] = {
          date: orderDate,
          totalEarnings: 0,
          totalOrders: 0
        };
      }
      
      dailyEarnings[orderDate].totalEarnings += orderTotal;
      dailyEarnings[orderDate].totalOrders += 1;
      totalEarnings += orderTotal;
    });
    
    // Convert to array and sort by date
    const dailyData = Object.values(dailyEarnings).sort((a, b) => 
      new Date(a.date) - new Date(b.date)
    );
    
    res.status(200).json({
      success: true,
      result: {
        dailyData,
        totalEarnings,
        totalOrders: orders.length
      }
    });
    
  } catch (error) {
    console.error('Error fetching seller earnings:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching seller earnings',
      error: error.message
    });
  }
};

const getSalesAnalytics = async (req, res) => {
  try {
    // Get sales data for the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Get daily sales data
    const dailySales = await OrderModel.aggregate([
      {
        $match: {
          createdAt: { $gte: thirtyDaysAgo },
          status: { $ne: 'cancelled' } // Exclude cancelled orders
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          totalSales: { $sum: "$totalAmount" },
          orderCount: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Get sales by status
    const salesByStatus = await OrderModel.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
          totalAmount: { $sum: "$totalAmount" }
        }
      }
    ]);

    // Get top selling products
    const topProducts = await OrderModel.aggregate([
      { $unwind: "$items" },
      {
        $group: {
          _id: {
            productId: "$items.productId",
            productTitle: "$items.productTitle"
          },
          totalQuantity: { $sum: "$items.quantity" },
          totalRevenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } }
        }
      },
      { $sort: { totalQuantity: -1 } },
      { $limit: 5 }
    ]);

    // Calculate total sales and orders
    const totalSales = dailySales.reduce((sum, day) => sum + day.totalSales, 0);
    const totalOrders = dailySales.reduce((sum, day) => sum + day.orderCount, 0);

    res.json({
      result: {
        dailySales,
        salesByStatus,
        topProducts,
        summary: {
          totalSales,
          totalOrders,
          avgOrderValue: totalOrders > 0 ? totalSales / totalOrders : 0
        }
      },
      message: "Sales analytics data retrieved successfully",
      meta: null
    });
  } catch (exception) {
    console.error('Error in getSalesAnalytics:', exception);
    res.status(500).json({
      result: null,
      message: 'Error fetching sales analytics',
      meta: { error: exception.message }
    });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const sellerId = req.userId; // Assuming seller ID is available in req.userId

    // Validate status
    const validStatuses = ['processing', 'shipped', 'delivered'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    // Find the order and verify the seller has products in this order
    const order = await OrderModel.findOne({
      _id: orderId,
      'items.seller': sellerId
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found or you are not authorized' });
    }

    // Update the order status
    order.status = status;
    if (status === 'delivered') {
      order.deliveredAt = new Date();
    }

    await order.save();
    
    res.json({ 
      message: 'Order status updated successfully',
      order
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ message: 'Error updating order status', error: error.message });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await OrderModel.find()
      .populate('customer', 'name email')
      .populate('items.productId', 'title price')
       
      .sort({ createdAt: -1 });
      
    const count = await OrderModel.countDocuments();
    //   console.log(orders);
    const fullOrders = await Promise.all(orders.map(async (order) => {
      const detailedItems = await Promise.all(order.items.map(async (item) => {
        const product = await ProductModel.findById(item.productId)
        .populate({
          path:'createdBy', 
          select:'store email role name',
            populate:{
            path: 'store',
            select: 'name address panNumber',
          }
        });
        // console.log(product);
        return {
          name: product?.title || '',
          quantity: item.quantity,
          price: item.price,
          seller: product?.createdBy,
          store: product?.createdBy?.store 
        };
      }));

      return {
        ...order.toObject(),
        items: detailedItems,
      };
    }));

    res.json({
      result: fullOrders,
      message: 'List of all orders',
      meta: {
        total: count,
      },
    });
  } catch (exception) {
    console.log(exception);
    throw(exception);
  }
}
  const getOrdersForSeller = async (req, res) => {
  try {
    const sellerId = req.params.id;

    // Fetch all orders where at least one product was created by this seller
    const orders = await OrderModel.find()
      .populate('customer', 'name email')
      .populate({
        path: 'items.productId',
        select: 'title price createdBy',
        populate: {
          path: 'createdBy',
          select: 'name email role store',
          
        },
      })
      .sort({ createdAt: -1 });

    const filteredOrders = [];

    for (const order of orders) {
      const relevantItems = order.items.filter(item => {
        const product = item.productId;
        return product?.createdBy?._id.toString() === sellerId.toString();
      });

      if (relevantItems.length > 0) {
        filteredOrders.push({
          ...order.toObject(),
          items: relevantItems.map(item => ({
            name: item.productId.title,
            quantity: item.quantity,
            price: item.price,
            seller: item.productId.createdBy,
          })),
        });
      }
    }

    res.json({
      result: filteredOrders,
      message: 'Orders for current seller',
      meta: {
        total: filteredOrders.length,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};



module.exports = {
  placeOrder,
  getMyOrders,
  cancelOrder,
  getAllOrders,
  getOrdersForSeller,
  getSalesAnalytics,
  updateOrderStatus,
  getSellerEarnings
};