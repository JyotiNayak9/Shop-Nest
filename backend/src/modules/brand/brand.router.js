const brandRouter = require("express").Router();

const { fileFilterType } = require("../../config/constants.config");
const loginCheck = require("../../middlewares/auth.middleware");
const hasPermission = require("../../middlewares/rbac.middleware");
const { setPath, uploadfile } = require("../../middlewares/uploader.middleware");
const bodyValidator = require("../../middlewares/validator.middleware");
const brandController = require("./brand.controller");
const { BrandCreateDTO, BrandUpdpateDTO } = require("./brand.request");

brandRouter.get('/list-home', brandController.listForHome)

// TODO: brand wise list product
// router.get("/:slug/detail", brand)

brandRouter.route('/')
    .post(loginCheck, hasPermission("admin"), setPath('brand'), uploadfile(fileFilterType.IMAGE).single("image"), bodyValidator(BrandCreateDTO),brandController.create)
    .get(loginCheck, hasPermission('admin'), brandController.index)

brandRouter.route('/:id')
.get(loginCheck, hasPermission('admin'), brandController.show)
.patch(loginCheck, hasPermission("admin"), setPath('brand'), uploadfile(fileFilterType.IMAGE).single("image"), bodyValidator(BrandUpdpateDTO), brandController.update)
.delete(loginCheck, hasPermission('admin'), brandController.delete)
module.exports = brandRouter;