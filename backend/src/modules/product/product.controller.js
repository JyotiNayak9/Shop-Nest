const idvalidate = require("../../utilities/mongo_id_validator");
const categoryModel = require("../category/category.model");
const UserModel = require("../user/user.model");
const ProductModel = require("./product.model")
const productSvc = require("./product.service")

class ProductController {
    CreateProduct = async(req, res, next) =>{
        try{
            const newProduct = await productSvc.createProduct(req);
            res.json({
                result: newProduct,
                message: "Product Added",
                meta: null
              })
        }catch(exception){
            next(exception)
        }
    };

    // Approve a product
    approveProduct = async (req, res, next) => {
        try {
            const { id } = req.params;
            const product = await ProductModel.findByIdAndUpdate(
                id,
                { 
                    approvalStatus: 'approved',
                    approvedBy: req.authUser._id,
                    approvedAt: new Date()
                },
                { new: true }
            );
            
            if (!product) {
                throw new Error('Product not found');
            }
            
            res.json({
                result: product,
                message: 'Product approved successfully',
                meta: null
            });
        } catch (exception) {
            next(exception);
        }
    }
    
    // Reject a product
    rejectProduct = async (req, res, next) => {
        try {
            const { id } = req.params;
            const { reason } = req.body;
            
            const product = await ProductModel.findByIdAndUpdate(
                id,
                { 
                    approvalStatus: 'rejected',
                    rejectionReason: reason,
                    approvedBy: req.authUser._id,
                    approvedAt: new Date()
                },
                { new: true }
            );
            
            if (!product) {
                throw new Error('Product not found');
            }
            
            res.json({
                result: product,
                message: 'Product rejected successfully',
                meta: null
            });
        } catch (exception) {
            next(exception);
        }
    }
    
    // Get reviews for a product
    getReviews = async(req, res, next) => {
        try {
            const  {productSlug}  = req.params;
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            
            const product = await productSvc.productDetailBySlug(productSlug);
            if (!product) {
                throw new Error('Product not founddddd');
            }

            const reviews = product.reviews.sort((a, b) => b.createdAt - a.createdAt);
            
            const startIndex = (page - 1) * limit;
            const endIndex = page * limit;
            const paginatedReviews = reviews.slice(startIndex, endIndex);

            res.json({
                result: {
                    reviews: paginatedReviews,
                    totalReviews: reviews.length,
                    averageRating: product.averageRating,
                    reviewCount: product.reviewCount
                },
                message: "Reviews fetched successfully",
                meta: {
                    page,
                    limit,
                    totalPages: Math.ceil(reviews.length / limit)
                }
            });
        } catch (error) {
            next(error);
        }
    };

    addReview = async(req, res, next) => {
        try {
            const { productSlug } = req.params;
            const { rating, comment } = req.body;
            const userId = req.authUser._id;
           
            const updatedProduct = await productSvc.addReview(productSlug, userId, {
                rating,
                comment
            });
  
            res.json({
                result: updatedProduct,
                message: "Review added successfully",
                meta: null
            });
        } catch (exception) {
            next(exception);
        }
    };

    updateReview = async(req, res, next) => {
        try {
            const { productslug, reviewId } = req.params;
            const { rating, comment } = req.body;
            const userId = req.authUser._id;

            const updatedProduct = await productSvc.updateReview(productslug, reviewId, userId, {
                rating,
                comment
            });

            res.json({
                result: updatedProduct,
                message: "Review updated successfully",
                meta: null
            });
        } catch (error) {
            next(error);
        }
    };

    deleteReview = async(req, res, next) => {
        try {
            const { productslug, reviewId } = req.params;
            const userId = req.authUser._id;

            const updatedProduct = await productSvc.deleteReview(productslug, reviewId, userId);

            res.json({
                result: updatedProduct,
                message: "Review deleted successfully",
                meta: null
            });
        } catch (error) {
            next(error);
        }
    };

 getaproduct = async(req, res, next) => {
    try{
        const {id} = req.params
        idvalidate(id)
    const product = await productSvc.productDetailById(id)
    res.json({
        result : product,
        message: `details of product Id ${id} `,
        meta: null
    })
    }catch(exception){
        next(exception)
    }
 }

 getProductBySeller = async(req, res, next) => {
    try{
        const id = req.params.id
        console.log(id)
            const page = +req.query.page || 1
            const limit = +req.query.limit || 10
            const skip = (page - 1)*limit
            
            let filter = {createdBy: id};
            if(req.query.search){
                
                    filter.title= new RegExp(req.query.search, 'i') 
                
            }

            const {count, data} = await productSvc.listData({
                skip: skip,
                limit:limit,
                filter: filter
            });

            res.json({
                result: data,
                message: "product list by seller",
                meta: {
                    currentPage: page,
                    total: count,
                    limit: limit
                }
            })
        }catch(exception){
            next(exception)
        }
 }
 getbyslug = async(req, res, next) => {
    try{
        const {slug} = req.params
        const product = await ProductModel.findOne({ slug })
            .populate({
                path: "createdBy",
                select: "_id name email role store",
                populate: {
                    path: "store",
                    select: "name address panNumber"
                }
            })
            .populate("category", ["_id","title"])
            .populate("brand", ["_id","title"])
            .populate("image")

        if (!product) {
            return res.status(404).json({
                result: null,
                message: "Product not found",
                meta: null
            })
        }

        res.json({
            result: product,
            message: "Product details retrieved successfully",
            meta: null
        })
    } catch (exception) {
        next(exception)
    }
 }

 getProductByCategory = async (req, res, next) => {
  try {
    const categoryId = req.params.categoryId;
    const { minPrice, maxPrice } = req.query;

    const subcategories = await categoryModel.find({ parentId: categoryId }).select('_id');
    const subcategoryIds = subcategories.map(sub => sub._id.toString());

    const categoryIds = [categoryId, ...subcategoryIds];

    const filter = {
      category: { $in: categoryIds }
    };

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }

    const products = await ProductModel
      .find(filter)
      .populate("category", ["_id", "title"])
      .populate("brand", ["_id", "title"])
      .populate("createdBy", ["_id", "name", "email", "role"])
      .sort({ _id: -1 });

    res.json({
      result: products,
      message: "Product list by category (including subcategories)",
      meta: null
    });

  } catch (exception) {
    next(exception);
  }
};


// getProductsByCategoryAndPrice = async (req, res, next) => {
//   try {
//     const categoryId = req.params.id;
//     const { minPrice, maxPrice } = req.query;

//     const filter = { category: categoryId };

//     if (minPrice || maxPrice) {
//       filter.price = {};
//       if (minPrice) filter.price.$gte = parseFloat(minPrice);
//       if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
//     }

//     const products = await ProductModel
//       .find(filter)
//       .populate("category", ["_id", "title"])
//       .sort({ _id: -1 });

//     res.json({ result: products, message: "Filtered products" });
//   } catch (err) {
//     next(err);
//   }
// };




 getallProducts = async(req,res,next) =>{
    try{
        const query = req.query
        const allProducts = await ProductModel.find({})
        res.json({
            result: allProducts,
            message: "All Products",
            meta: null
        })
    }catch(exception){
        next(exception)
    }
 }

index = async(req, res, next) =>{
        try{
            const page = +req.query.page || 1
            const limit = +req.query.limit || 10
            const skip = (page - 1)*limit

            let filter = {};
            if(req.query.search){
                filter = {
                    title: new RegExp(req.query.search, 'i')
                }
            }

            const {count, data} = await productSvc.listData({
                skip: skip,
                limit:limit,
                filter: filter
            });

            res.json({
                result: data,
                message: "product list all",
                meta: {
                    currentPage: page,
                    total: count,
                    limit: limit
                }
            })
        }catch(exception){
            next(exception)
        }
    }
 UpdateaProduct = async(req,res,next) => {
    try{
        const {id} = req.params
        idvalidate(id)
        const updatedProduct = await productSvc.ProductUpdateById(id, req.body)
        res.json({
            result: updatedProduct,
            message: "The product has been updated successfully",
            meta: null
        })
    }catch(exception){
        next(exception)
    }
}
 
    // Get approved products
    getApprovedProducts = async(req, res, next) => {
        try {
            const page = +req.query.page || 1;
            const limit = +req.query.limit || 10;
            const skip = (page - 1) * limit;

            // Filter for approved products
            const filter = { approvalStatus: 'approved' };
            
            // Add search filter if provided
            if (req.query.search) {
                filter.title = new RegExp(req.query.search, 'i');
            }

            const { count, data } = await productSvc.listData({
                skip: skip,
                limit: limit,
                filter: filter
            });

            res.json({
                result: data,
                message: "Approved products list",
                meta: {
                    currentPage: page,
                    total: count,
                    limit: limit
                }
            });
        } catch (exception) {
            next(exception);
        }
    }

    DeleteaProduct = async(req, res, next) =>{
        try{
            const {id} = req.params
        idvalidate(id)
        const deletedproduct = await productSvc.ProductDeleteById(id)
        res.json({
            result: deletedproduct,
            message: `The product ${deletedproduct.title} has been deleted`,
            meta: null
        })
    }catch(exception){
        next(exception)
    }
 }

}

const ProductCtrl = new ProductController()
module.exports= ProductCtrl