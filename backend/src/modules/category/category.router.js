const CategoryRouter = require("express").Router();

const { fileFilterType } = require("../../config/constants.config");
const loginCheck = require("../../middlewares/auth.middleware");
const hasPermission = require("../../middlewares/rbac.middleware");
const { setPath, uploadfile } = require("../../middlewares/uploader.middleware");
const bodyValidator = require("../../middlewares/validator.middleware");
const categoryController = require("./category.controller");
const { CategoryCreateDTO, CategoryUpdpateDTO } = require("./category.request");

CategoryRouter.get('/list-home', categoryController.listForHome)

CategoryRouter.route('/')
    .post(loginCheck, hasPermission("admin"), setPath('category'), uploadfile(fileFilterType.IMAGE).single("image"), bodyValidator(CategoryCreateDTO),categoryController.create)
    .get(loginCheck, hasPermission('admin'), categoryController.index)

    CategoryRouter.route('/:id')
.get(loginCheck, hasPermission('admin'), categoryController.show)
.patch(loginCheck, hasPermission("admin"), setPath('category'), uploadfile(fileFilterType.IMAGE).single("image"), bodyValidator(CategoryUpdpateDTO), categoryController.update)
.delete(loginCheck, hasPermission('admin'), categoryController.delete)
module.exports = CategoryRouter;