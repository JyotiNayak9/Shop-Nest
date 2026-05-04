const bodyValidator = require('../../middlewares/validator.middleware')
const ProductCtrl = require('./product.controller')
const multer = require('multer')
const { ProductCreateDTO, ProductUpdateDTO } = require('./product.request')
const loginCheck = require('../../middlewares/auth.middleware')
const hasPermission = require('../../middlewares/rbac.middleware')
const { setPath, uploadfile } = require('../../middlewares/uploader.middleware')
const { fileFilterType } = require('../../config/constants.config')

const productRouter = require("express").Router();

const upload = multer()

productRouter.get('/', ProductCtrl.index)
productRouter.post('/', loginCheck, setPath('product'), uploadfile(fileFilterType.IMAGE).array('image',10), bodyValidator(ProductCreateDTO), ProductCtrl.CreateProduct)

productRouter.get('/slug/:slug', ProductCtrl.getbyslug)
productRouter.get('/category/:categoryId', ProductCtrl.getProductByCategory)
productRouter.get('/seller/:id', loginCheck, ProductCtrl.getProductBySeller)
productRouter.get('/approved', ProductCtrl.getApprovedProducts)

productRouter.get('/:id', ProductCtrl.getaproduct)
productRouter.patch('/:id', loginCheck, upload.none(), bodyValidator(ProductUpdateDTO), ProductCtrl.UpdateaProduct)
productRouter.delete('/:id', loginCheck, hasPermission('admin'), ProductCtrl.DeleteaProduct)
productRouter.patch('/:id/approve', loginCheck, hasPermission('admin'), ProductCtrl.approveProduct)
productRouter.patch('/:id/reject', loginCheck, hasPermission('admin'), ProductCtrl.rejectProduct)

productRouter.get('/:slug/reviews', ProductCtrl.getReviews)
productRouter.post('/:slug/reviews', loginCheck, hasPermission('customer'), ProductCtrl.addReview)
productRouter.patch('/:slug/reviews/:reviewId', loginCheck, ProductCtrl.updateReview)
productRouter.delete('/:slug/reviews/:reviewId', loginCheck, ProductCtrl.deleteReview)

module.exports = productRouter