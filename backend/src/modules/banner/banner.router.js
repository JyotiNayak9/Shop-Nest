const bannerRouter = require("express").Router();

const { fileFilterType } = require("../../config/constants.config");
const loginCheck = require("../../middlewares/auth.middleware");
const hasPermission = require("../../middlewares/rbac.middleware");
const { setPath, uploadfile } = require("../../middlewares/uploader.middleware");
const bodyValidator = require("../../middlewares/validator.middleware");
const bannerController = require("./banner.controller");
const { BannerCreateDTO, BannerUpdpateDTO } = require("./banner.request");

bannerRouter.get('/list-home', bannerController.listForHome)

bannerRouter.route('/')
    .post(loginCheck, hasPermission("admin"), setPath('banner'), uploadfile(fileFilterType.IMAGE).single("image"), bodyValidator(BannerCreateDTO),bannerController.create)
    .get(loginCheck, hasPermission('admin'), bannerController.index)

bannerRouter.route('/:id')
.get(loginCheck, hasPermission('admin'), bannerController.show)
.patch(loginCheck, hasPermission("admin"), setPath('banner'), uploadfile(fileFilterType.IMAGE).single("image"), bodyValidator(BannerUpdpateDTO), bannerController.update)
.delete(loginCheck, hasPermission('admin'), bannerController.delete)
module.exports = bannerRouter;