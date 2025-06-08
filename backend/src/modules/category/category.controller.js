const uploadImage = require("../../config/cloudinary.config");
const { StatusType } = require("../../config/constants.config");
const { deleteFile } = require("../../utilities/helper");
const categoryModel = require("./category.model");
const categoryService = require("./category.service");
const slugify = require('slugify')

class CategoryController{
    categoryDetail;
    create = async(req, res, next) =>{
        try{
            const data = req.body;
          if(req.file)
             { data.image = await uploadImage("./public/uploads/category/"+req.file.filename)
            deleteFile("./public/uploads/category/"+req.file.filename)}

            data.slug = slugify(data.title,{lower:true})
            

            if(!data.parentId || data.parentId ==='null' || data.parentId ===null){
                data.parentId = null
            }
            if(!data.brands || data.brands ==='null' || data.brands === null){
                data.brands = null
            }

            data.createdBy = req.authUser._id;
            const category= await categoryService.createCategory(data)

            res.json({
                result: category,
                message: "Category created",
                meta: null
            })
        }catch(exception){
            console.log(exception)
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

            const {count, data} = await categoryService.listData({
                skip: skip,
                limit:limit,
                filter: filter
            });

            res.json({
                result: data,
                message: "category list all",
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
    #validateId =async (id) => {
       try {
            if(!id){
                throw {status:400, message:"Id is required"}
            }
            
            }catch(exception){
                throw exception
            }
    }
    show = async(req, res, next) =>{
        try{
            const id = req.params.id;
            await this.#validateId(id)
            this.categoryDetail = await categoryService.getDetailByfilter({
                _id:id
            })
            if(!this.categoryDetail){
                throw{status:404, message:"Category doesnot exists"}
            }
            res.json({
                result: this.categoryDetail,
                maessage: "Category Fetched successfully",
                meta: null
            })
        }catch(exception){
            next(exception)
        }
        
    }
     getbyslug = async(req, res, next) => {
        try{
            const {slug} = req.params
            // idvalidate(id)
        const category = await categoryService.categoryDetailBySlug(slug)
        res.json({
            result : category,
            message: `details of category Id ${slug} `,
            meta: null
        })
        }catch(exception){
            next(exception)
        }
     }
    getAllCategories = async(req, res, next) =>{
        try{
            const categories = await categoryService.getAllCategory()
            res.json({
                result: categories,
                message: "Category list",
                meta: null
            })
        }catch(exception){
            next(exception)

        }
    }
 getParentCategories = async(req, res, next) =>{
        try{
            const categories = await categoryService.listData({
                filter: {
                    parentId: null
                }
            })  
            res.json({
                result: categories,
                message: "Parent category list",
                meta: null
            })
        }catch(exception){
            next(exception)
        }
    }
    getAllCategoriesWithSubcategories = async (req, res, next) => {
  try {
    const allCategories = await categoryModel.find();

    const parents = allCategories.filter(cat => !cat.parentId);
    const subcategories = allCategories.filter(cat => cat.parentId);

    const result = parents.map(parent => ({
      ...parent._doc,
      subcategories: subcategories.filter(sub => sub.parentId.toString() === parent._id.toString())
    }));

    res.json({
      result,
      message: "Categories with subcategories",
      meta: null
    });
  } catch (err) {
    next(err);
  }
};

    update = async(req, res, next) =>{
        try{
            const id = req.params.id;
            await this.#validateId(id)

            const data = req.body;
            if(req.file){
                data.image = await uploadImage("./public//category/"+req.file.filename)
                deleteFile("./public//category/"+req.file.filename)
            }

            if(!data.parentId || data.parentId ==='null' || data.parentId ===null){
                data.parentId = null
            }
            if(!data.brands || data.brands ==='null' || data.brands ===null){
                data.brands = null
            }

            const response = await categoryService.updateCategory(data, id);
            res.json({
                result:response,
                meta: null,
                message: "Category updated successfully"
            })
        }catch(exception){
            next(exception)
        }
    }
    delete = async(req, res, next) =>{
        try{
            const id = req.params.id;
            await this.#validateId(id)

            const response = await categoryService.deleteById(id)
            //TODO: delete image from cloudinary

            res.json({
                result: response,
                meta: null,
                 message: "Category deleted successfully"
            })
        }catch(exception){
            next(exception)
        }
    }

    listForHome = async(req, res,next)=>{
        try{
            const list = await categoryService.listData({
                limit: 5,
                filter:{
                    status: StatusType.ACTIVE
                }
            })
            res.json({
                result: list,
                meta: null,
                message: "Category list"
            })
        }catch(exception){
            next(exception)
        }
    }
}

module.exports = new CategoryController()