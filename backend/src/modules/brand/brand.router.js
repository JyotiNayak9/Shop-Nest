const brandRouter = require("express").Router();

const { fileFilterType } = require("../../config/constants.config");
const loginCheck = require("../../middlewares/auth.middleware");
const hasPermission = require("../../middlewares/rbac.middleware");
const { setPath, uploadfile } = require("../../middlewares/uploader.middleware");
const bodyValidator = require("../../middlewares/validator.middleware");
const brandController = require("./brand.controller");
const { BrandCreateDTO, BrandUpdpateDTO } = require("./brand.request");

// Brand routes - RESTful design
brandRouter.get('/home', brandController.listForHome)
brandRouter.get('/', loginCheck, hasPermission('admin'), brandController.index)
brandRouter.post('/', loginCheck, hasPermission("admin"), setPath('brand'), uploadfile(fileFilterType.IMAGE).single("image"), bodyValidator(BrandCreateDTO), brandController.create)
brandRouter.get('/all', brandController.getAllBrands)

brandRouter.get('/:id', loginCheck, hasPermission('admin'), brandController.show)
brandRouter.patch('/:id', loginCheck, hasPermission("admin"), setPath('brand'), uploadfile(fileFilterType.IMAGE).single("image"), bodyValidator(BrandUpdpateDTO), brandController.update)
brandRouter.delete('/:id', loginCheck, hasPermission('admin'), brandController.delete)
module.exports = brandRouter;