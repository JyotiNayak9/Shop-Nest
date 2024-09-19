const uploadImage = require("../../config/cloudinary.config");
const { StatusType } = require("../../config/constants.config");
const { deleteFile } = require("../../utilities/helper");
const brandService = require("./brand.service");
const slugify = require('slugify')

class BrandController{
    brandDetail;
    create = async(req, res, next) =>{
        try{
            const data = req.body;
            data.image = await uploadImage("./public/uploads/brand/"+req.file.filename)

            data.slug = slugify(data.title,{lower:true})
            
            deleteFile("./public/uploads/brand/"+req.file.filename)
            data.createdBy = req.authUser._id;
            const brand = await brandService.createBrand(data)

            res.json({
                result: brand,
                message: "brand created",
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

            const {count, data} = await brandService.listData({
                skip: skip,
                limit:limit,
                filter: filter
            });

            res.json({
                result: data,
                message: "brand list all",
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
            this.brandDetail = await brandService.getDetailByfilter({
                _id:id
            })
            if(!this.brandDetail){
                throw{status:404, message:"Brand doesnot exists"}
            }}catch(exception){
                throw exception
            }
    }
    show = async(req, res, next) =>{
        try{
            const id = req.params.id;
            await this.#validateId(id)
            res.json({
                result: this.brandDetail,
                maessage: "Brand Fetched successfully",
                meta: null
            })
        }catch(exception){
            next(exception)
        }
        
    }
    update = async(req, res, next) =>{
        try{
            const id = req.params.id;
            await this.#validateId(id)

            const data = req.body;
            if(req.file){
                data.image = await uploadImage("./public//brand/"+req.file.filename)
                deleteFile("./public//brand/"+req.file.filename)
            }

            const response = await brandService.updateBrand(data, id);
            res.json({
                result:response,
                meta: null,
                message: "Brand uodated successfully"
            })
        }catch(exception){
            next(exception)
        }
    }
    delete = async(req, res, next) =>{
        try{
            const id = req.params.id;
            await this.#validateId(id)

            const response = await brandService.deleteById(id)
            //TODO: delete image from cloudinary

            res.json({
                result: response,
                meta: null,
                 message: "Brand deleted successfully"
            })
        }catch(exception){
            next(exception)
        }
    }

    listForHome = async(req, res,next)=>{
        try{
            const list = await brandService.listData({
                limit: 5,
                filter:{
                    status: StatusType.ACTIVE
                }
            })
            res.json({
                result: list,
                meta: null,
                message: "Brand list"
            })
        }catch(exception){
            next(exception)
        }
    }
}

module.exports = new BrandController()