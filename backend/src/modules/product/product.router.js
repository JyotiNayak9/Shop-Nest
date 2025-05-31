const bodyValidator = require('../../middlewares/validator.middleware')
const ProductCtrl = require('./product.controller')
const multer = require('multer')
const { ProductCreateDTO, ProductUpdateDTO } = require('./product.request')
const loginCheck = require('../../middlewares/auth.middleware')
const hasPermission = require('../../middlewares/rbac.middleware')
const { setPath, uploadfile } = require('../../middlewares/uploader.middleware')
const { fileFilterType } = require('../../config/constants.config')

const productRouter= require("express").Router();

const upload = multer()
productRouter.post('/createProduct',loginCheck, setPath('product'), uploadfile(fileFilterType.IMAGE).array('image',10), bodyValidator(ProductCreateDTO), ProductCtrl.CreateProduct)
productRouter.get('/getaproduct/:id',ProductCtrl.getaproduct)
productRouter.get('/getproductbyslug/:slug',ProductCtrl.getbyslug)
productRouter.get('/getallproducts',ProductCtrl.getallProducts)
productRouter.get('/getproductbycategory/:categoryId',ProductCtrl.getProductByCategory)
productRouter.get('/getproducts',  ProductCtrl.index)
productRouter.get('/getProductBySeller/:id',loginCheck, ProductCtrl.getProductBySeller)
productRouter.patch('/updateaproduct/:id',loginCheck,  upload.none(),bodyValidator(ProductUpdateDTO),ProductCtrl.UpdateaProduct)
productRouter.delete('/deleteaproduct/:id',loginCheck, hasPermission('admin'),ProductCtrl.DeleteaProduct)

module.exports = productRouter