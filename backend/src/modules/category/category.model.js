const mongoose = require("mongoose");
const { StatusType } = require("../../config/constants.config");

const CategorySchema = new mongoose.Schema({
    title:{
        type:String,
        required: true,
        unique:true,
        min:3,
        max:100
    },
    image:{
        type: String,
        required: true
    },
    parentId:{
        type: mongoose.Types.ObjectId,
        ref: "Category",
        default:null
    },
    brands:[{
        type: mongoose.Types.ObjectId,
        ref: "Brand",
        default:null
    }],
    slug:{
        type:String,
        required: true,
        unique: true
    },
    status:{
        type: String,
        enum: [StatusType.ACTIVE, StatusType.INACTIVE],
        default : StatusType.INACTIVE
    },
    createdBy:{
        type: mongoose.Types.ObjectId,
        ref: "User",
        default: null
    },
},{
    timestamps: true,
    autoIndex: true,
    autoIndex: true
})

const categoryModel = mongoose.model("Category", CategorySchema)

module.exports = categoryModel;