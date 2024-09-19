const authRouter = require("express").Router();
const loginCheck = require("../../middlewares/auth.middleware");
const {setPath, uploadfile} = require("../../middlewares/uploader.middleware");
const bodyValidator = require("../../middlewares/validator.middleware");
const userCtrl = require("../user/user.controller");
const { userCreateDTO } = require("../user/user.request");
const authController = require("./auth.controller");
const LoginDTO = require("./auth.request");

authRouter.post("/register", setPath('user'),uploadfile().single('image'),bodyValidator(userCreateDTO),  userCtrl.userCreate)
authRouter.get("/activate/:token",authController.activateUser)
authRouter.get("/resend-activationToken/:token",authController.resendActivationToken)
authRouter.post("/login", bodyValidator(LoginDTO), authController.login);
authRouter.get("/me",loginCheck, authController.getloggedinUser);

authRouter.get("/refresh", authController.refreshToken)

module.exports = authRouter;