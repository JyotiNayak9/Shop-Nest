const UserPreferenceModel = require('../UserPreferences/userpreferences.model');
const CartModel = require('./cart.model');

class CartController {
addToCart = async (req, res) => {
  try {
    const { customerId, productId, quantity, productTitle, price ,image} = req.body;

    const existingItem = await CartModel.findOne({
        customerId,
        productId,
        status: 'pending'
      });
  
      if (existingItem) {
        existingItem.quantity += quantity;
        existingItem.amount = existingItem.quantity * existingItem.price;
        await existingItem.save();
        return res.json({
            message: 'Item quantity updated successfully',
            result: existingItem,
            meta:null
        });
      }
  
      const amount = quantity * price;
    const newItem = new CartModel({
      customerId,
      productId,
      quantity,
      productTitle,
      price,
      amount,
      image
      
    });

    await newItem.save();

    let pref = await UserPreferenceModel.findOne({ userId: customerId });

    if (!pref) {
      // console.log("ajehfiuh")
      pref = new UserPreferenceModel({ userId:customerId, interactedProductIds: [productId] });
    } else {
      // Prevent duplicates
      if (!pref.interactedProductIds.includes(productId)) {
        pref.interactedProductIds.push(productId);
      }
    }
  
    await pref.save();
    res.json({
        message: 'Item added to cart successfully',
        result: newItem,
        meta:null
    })
  } catch (exception) {
  throw exception;
  }
};


getCartByCustomer = async (req, res) => {
  try {
    const customerId = req.params.customerId;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    

    const [items, total] = await Promise.all([
      CartModel.find({ customerId, status: 'pending' })
        .populate('productId')
        .skip((page - 1) * limit)
        .limit(limit),
      CartModel.countDocuments({ customerId, status: 'pending' })
    ]);

    res.json({
      items,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    });
  } catch (exception) {
    console.log(exception);
    throw(exception);
}
};


updateCartItem = async (req, res) => {
  try {
    const { quantity, price } = req.body;
    const amount = quantity * price;

    const updatedItem = await CartModel.findByIdAndUpdate(
      req.params.id,
      { quantity, price, amount },
      { new: true }
    );

    res.json({
      message: 'Item updated successfully',
      result: updatedItem,
      meta:null
    });
  } catch (exception) {
    console.log(exception);
    throw(exception);
  }
};

// Delete item
deleteCartItem = async (req, res) => {
  try {
    await CartModel.findByIdAndDelete(req.params.id);
    res.json({ message: 'Item removed from cart' });
  } catch (exception) {
    console.log(exception);
    throw(exception);
  }
};

clearCart = async (req, res) => {
  try {
    await CartModel.deleteMany({ customer: req.params.customerId, status: 'pending' });
    res.json({ message: 'Cart cleared' });
  } catch (exception) {
    console.log(exception);
    throw(exception);
  }
};

getCartTotals = async (req, res) => {
  try {
    const customer = req.userId;
    const cartItems = await CartModel.find({ customer, status: 'pending' });
    const totals = cartItems.reduce(
      (acc, item) => {
        acc.totalQuantity += item.quantity;
        acc.totalAmount += item.amount;
        acc.uniqueItems += 1;
        return acc;
      },
      { totalQuantity: 0, totalAmount: 0, uniqueItems: 0 }
    );
    res.json(totals);
  } catch (exception) {
    console.log(exception);
    throw(exception);
  }
};
}
module.exports = new CartController();
