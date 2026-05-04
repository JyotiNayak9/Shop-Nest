const router = require("express").Router();
const userCtrl = require("./user.controller");
const loginCheck = require("../../middlewares/auth.middleware");
const hasPermission = require("../../middlewares/rbac.middleware");
const { setPath, uploadfile } = require("../../middlewares/uploader.middleware");
const bodyValidator = require("../../middlewares/validator.middleware");
const { userCreateDTO, PasswordUpdateDTO} = require("./user.request");

// User routes - RESTful design
router.route("/")
.post(loginCheck,hasPermission('admin'|'seller'), setPath('user'),uploadfile().array('image',10),bodyValidator(userCreateDTO),  userCtrl.userCreate) 
.get( loginCheck,hasPermission('admin'),userCtrl.userLists)

router.post("/forgot-password-token",userCtrl.ForgotPasswordToken)
router.patch("/reset-password/:token", bodyValidator(PasswordUpdateDTO), userCtrl.ResetPassword)

router.route('/:id')
.get(userCtrl.userdetailbyId)
.put(userCtrl.userupdatebyId)
.delete(userCtrl.userdeletebyId)

 module.exports = router;