const mongoose = require('mongoose'); 
const { ProductStatus, ProductApprovalStatus } = require('../../config/constants.config');
const { required } = require('joi');
require("../../config/constants.config")


 const ProductSchema = new mongoose.Schema({
     title: {
         type: String,
         min:2,
         max:50,
         required:true
     },
     slug :{
         type:String,
         unique:true,
         required:true,
         lowercase:true,
         unique: true
     },
     description:{
         type: String,
         required:true       
     },
     image:{
        type: Array,
    },
     price:{
         type : Number,
         required: true
     },
     category:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
       required: true
     },
     brand:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Brand",
       required: true
     },
     quantity: Number,
     features: [String],
      reviews: [
        {
            rating: {
                type: Number,
                required: true,
                min: 1,
                max: 5
            },
            comment: {
                type: String,
                trim: true
            },
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true
            },
         
            createdAt: {
                type: Date,
                default: Date.now
            }
        }
    ],
    averageRating: {
        type: Number,
        default: 0
    },
    reviewCount: {
        type: Number,
        default: 0
    },
       createdBy:{
              type: mongoose.Types.ObjectId,
              ref: "User",
              default: null
       },
     status: {
         type: String,
         enum: [...Object.values(ProductStatus)],
         default: ProductStatus.AVAIL
     },
     approvalStatus: {
         type: String,
         enum: [...Object.values(ProductApprovalStatus)],
         default: ProductApprovalStatus.PENDING
     },
     approvedBy: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User",
         default: null
     },
     approvedAt: {
         type: Date,
         default: null
     },
     
     
 },{
     timestamps:true,  
     autoIndex:true,
     autoCreate: true
 });
 
 
 const ProductModel = mongoose.model("Product", ProductSchema)
 
 module.exports = ProductModel;
 