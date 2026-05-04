const router = require("express").Router();
const authRouter = require("../modules/auth/auth.router");
// const bannerRouter = require("../modules/banner/banner.router");
const userRouter = require("../modules/user/user.router")
const brandRouter = require("../modules/brand/brand.router");
const CategoryRouter = require("../modules/category/category.router");
const productRouter = require("../modules/product/product.router");
const Cartrouter = require("../modules/cart/cart.router");
const OrderRouter = require("../modules/order/order.router");
const PaymentRouter = require("../modules/payment/payment.router");
const recommendationRouter = require("../modules/UserPreferences/recommendation_router");


 router.use("/auth", authRouter)
 router.use("/users", userRouter)
//  router.use("/banner",bannerRouter)
 router.use("/brands",brandRouter)
 router.use("/categories", CategoryRouter)
 router.use("/products", productRouter)
router.use("/cart",Cartrouter)
router.use("/recommendation",recommendationRouter)
router.use("/orders",OrderRouter)
router.use("/payment",PaymentRouter)


 module.exports = router;