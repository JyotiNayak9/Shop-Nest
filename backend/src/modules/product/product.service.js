const uploadImage = require("../../config/cloudinary.config")
const { deleteFile } = require("../../middlewares/uploader.middleware")
const ProductModel = require("./product.model")
const slugify = require('slugify')
class ProductService{
     createProduct  = async (req) => {
    try{
        const data = req.body
        const files = req.files
        if(data.title){
            data.slug = slugify(data.title)
        }
        const urls = []
        if (Array.isArray(files)) {
            await Promise.all(files.map(async(file)=>{
             const images = await uploadImage("./public/uploads/product/"+ file.filename)
             urls.push(images)
              deleteFile("./public/uploads/product/"+ file.filename)    
                }))
            }
            data.image = urls
        const newProduct = await ProductModel.create(data)
        return newProduct
    }catch(exception){
        throw(exception)
    }
}

productDetailById = async(id) => {
    try{
        const product = await ProductModel.findById(id)
        return product
    }catch(exception){
        throw(exception)
    }
}

AllProductsFiltering = async(query)=>{
    try{
        const queryObj = {...query};
        const excludeFields = ['page', 'sort','limit','fields']
        excludeFields.forEach((el) => delete queryObj[el])
        let queryStr = JSON.stringify(queryObj)
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g,(match) => `$${match}`)
        let allProducts =  ProductModel.find(JSON.parse(queryStr))

        // fields
        if(query.fields){
            const fields = query.fields.split(',').join(' ')
            allProducts = allProducts.select(fields)
        }

        //Pagination
        const page = query.page
        const limit = query.limit
        const skip = (page -1) * limit

        if(query.page){
            allProducts = allProducts.skip(skip).limit(limit)
            const ProductCount = await ProductModel.countDocuments()
            if(skip >= ProductCount){
                throw ({message:"This page doesnot exist"})
            }
        }
        return allProducts
    }catch(exception){
        throw(exception)
    }
}

ProductUpdateById  = async(id,data) => {
    try{
        if(data.title){
            data.slug = slugify(data.title)
        }
        const productUpdate = await ProductModel.findByIdAndUpdate(id, {$set:data}, {new:true})
        return productUpdate
    }catch(exception){
        throw(exception)
    }
}

ProductDeleteById = async(id) => {
    try{
        const productDelete = await ProductModel.findByIdAndDelete(id)
        return(productDelete)
    }catch(exception){
        throw(exception)
    }
}
}

const productSvc = new ProductService()
module.exports = productSvc