const router = require("express").Router();
const userCtrl = require("./user.controller");
const loginCheck = require("../../middlewares/auth.middleware");
const hasPermission = require("../../middlewares/rbac.middleware");
const { setPath, uploadfile } = require("../../middlewares/uploader.middleware");
const bodyValidator = require("../../middlewares/validator.middleware");
const { userCreateDTO, PasswordUpdateDTO} = require("./user.request");

// router.use(loginCheck);     
router.route("/")
.post(loginCheck,hasPermission('admin'|'seller'), setPath('user'),uploadfile().array('image',10),bodyValidator(userCreateDTO),  userCtrl.userCreate) 
.get( loginCheck,hasPermission('admin'),userCtrl.userLists)
router.post("/forgotpasswordtoken",uploadfile().none(),userCtrl.ForgotPasswordToken)
router.patch("/resetpassword/:token",uploadfile().none(), bodyValidator(PasswordUpdateDTO), userCtrl.ResetPassword)
router.route('/:id')
.get(userCtrl.userdetailbyId)
 .put( userCtrl.userupdatebyId)
 .delete(userCtrl.userdeletebyId)

 module.exports = router;