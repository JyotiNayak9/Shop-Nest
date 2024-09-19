const router = require("express").Router();
const userCtrl = require("./user.controller");
const loginCheck = require("../../middlewares/auth.middleware");
const hasPermission = require("../../middlewares/rbac.middleware");
const { setPath, uploadfile } = require("../../middlewares/uploader.middleware");
const bodyValidator = require("../../middlewares/validator.middleware");
const { userCreateDTO } = require("./user.request");

// router.use(loginCheck);     
router.route("/")
.post(loginCheck,hasPermission('admin'|'seller'), setPath('user'),uploadfile().single('image'),bodyValidator(userCreateDTO),  userCtrl.userCreate) 
.get( userCtrl.userLists)

router.route('/:id')
.get(userCtrl.userdetailbyId)
 .put( userCtrl.userupdatebyId)
 .delete(userCtrl.userdeletebyId)

 module.exports = router;