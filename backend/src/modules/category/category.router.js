const CategoryRouter = require("express").Router();

const { fileFilterType } = require("../../config/constants.config");
const loginCheck = require("../../middlewares/auth.middleware");
const hasPermission = require("../../middlewares/rbac.middleware");
const { setPath, uploadfile } = require("../../middlewares/uploader.middleware");
const bodyValidator = require("../../middlewares/validator.middleware");
const categoryController = require("./category.controller");
const { CategoryCreateDTO, CategoryUpdpateDTO } = require("./category.request");

// Category routes - RESTful design
CategoryRouter.get('/home', categoryController.listForHome)
CategoryRouter.get('/', loginCheck, hasPermission('admin'), categoryController.index)
CategoryRouter.post('/', loginCheck, hasPermission("admin"), setPath('category'), uploadfile(fileFilterType.IMAGE).single("image"), bodyValidator(CategoryCreateDTO), categoryController.create)
CategoryRouter.get('/all', categoryController.getAllCategories)
CategoryRouter.get('/with-subcategories', categoryController.getAllCategoriesWithSubcategories)
CategoryRouter.get('/slug/:slug', categoryController.getbyslug)

CategoryRouter.get('/:id', loginCheck, hasPermission('admin'), categoryController.show)
CategoryRouter.patch('/:id', loginCheck, hasPermission("admin"), setPath('category'), uploadfile(fileFilterType.IMAGE).single("image"), bodyValidator(CategoryUpdpateDTO), categoryController.update)
CategoryRouter.delete('/:id', loginCheck, hasPermission('admin'), categoryController.delete)
module.exports = CategoryRouter;