const bodyValidator = require('../../middlewares/validator.middleware')
const ProductCtrl = require('./product.controller')
const multer = require('multer')
const { ProductCreateDTO, ProductUpdateDTO } = require('./product.request')
const loginCheck = require('../../middlewares/auth.middleware')
const hasPermission = require('../../middlewares/rbac.middleware')
const { setPath, uploadfile } = require('../../middlewares/uploader.middleware')
const { fileFilterType } = require('../../config/constants.config')
const productRouter = require('express').Router()

const upload = multer()
productRouter.post('/createProduct',loginCheck, hasPermission('admin'), setPath('product'), uploadfile(fileFilterType.IMAGE).array('image',10), bodyValidator(ProductCreateDTO), ProductCtrl.CreateProduct)
productRouter.get('/getaproduct/:id',ProductCtrl.getaproduct)
productRouter.get('/getallproducts',ProductCtrl.getallProducts)
productRouter.patch('/updateaproduct/:id',loginCheck, hasPermission('admin'), upload.none(),bodyValidator(ProductUpdateDTO),ProductCtrl.UpdateaProduct)
productRouter.delete('/deleteaproduct/:id',loginCheck, hasPermission('admin'),ProductCtrl.DeleteaProduct)

module.exports = productRouter