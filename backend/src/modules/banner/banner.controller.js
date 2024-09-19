const uploadImage = require("../../config/cloudinary.config");
const { StatusType } = require("../../config/constants.config");
const { deleteFile } = require("../../utilities/helper");
const bannerService = require("./banner.service");

class BannerController{
    bannerDetail;
    create = async(req, res, next) =>{
        try{
            const data = req.body;
            data.image = await uploadImage("./public/uploads/banner/"+req.file.filename)
            deleteFile("./public/uploads/banner/"+req.file.filename)
            data.createdBy = req.authUser._id;
            const banner = await bannerService.createBanner(data)

            res.json({
                result: banner,
                message: "banner created",
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

            const {count, data} = await bannerService.listData({
                skip: skip,
                limit:limit,
                filter: filter
            });

            res.json({
                result: data,
                message: "banner list all",
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
            this.bannerDetail = await bannerService.getDetailByfilter({
                _id:id
            })
            if(!this.bannerDetail){
                throw{status:404, message:"Banner doesnot exists"}
            }}catch(exception){
                throw exception
            }
    }
    show = async(req, res, next) =>{
        try{
            const id = req.params.id;
            await this.#validateId(id)
            res.json({
                result: this.bannerDetail,
                maessage: "Banner Fetched successfully",
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
                data.image = await uploadImage("./public//banner/"+req.file.filename)
                deleteFile("./public//banner/"+req.file.filename)
            }

            const response = await bannerService.updateBanner(data, id);
            res.json({
                result:response,
                meta: null,
                message: "Banner uodated successfully"
            })
        }catch(exception){
            next(exception)
        }
    }
    delete = async(req, res, next) =>{
        try{
            const id = req.params.id;
            await this.#validateId(id)

            const response = await bannerService.deleteById(id)
            //TODO: delete image from cloudinary

            res.json({
                result: response,
                meta: null,
                 message: "Banner deleted successfully"
            })
        }catch(exception){
            next(exception)
        }
    }

    listForHome = async(req, res,next)=>{
        try{
            const list = await bannerService.listData({
                limit: 5,
                filter:{
                    status: StatusType.ACTIVE
                }
            })
            res.json({
                result: list,
                meta: null,
                message: "Banner list"
            })
        }catch(exception){
            next(exception)
        }
    }
}

module.exports = new BannerController()