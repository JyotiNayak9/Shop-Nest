const multer = require ("multer");
const fs = require ("fs");
// const sharp = require("sharp")
const { fileFilterType } = require("../config/constants.config");
const { randomStringGenerator } = require("../utilities/helper");

const myStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        const path = "./public/uploads/"+ req.uploadPath
         if(!fs.existsSync(path)){
            fs.mkdirSync(path , {recursive:true})
         }
         cb(null, path)
    },
    filename : (req, file, cb) =>{
        const ext = file.originalname.split(".").pop()
        const filename = randomStringGenerator(20)+"."+ ext;
        cb(null,filename);
    }   
})

const fileFilter = (req,file,cb) =>{
    let allowed  = ['jpg','svg','jpeg','webp','png','gif','bmp'];
    const ext = file.originalname.split(".").pop();
    if(allowed.includes(ext.toLowerCase())){
        cb(null,true)
    }else{
    cb({code: 400, message:"file format not supported"})
}
}
const uploadfile = (filetype = fileFilterType.IMAGE) =>{
   return multer({
        storage: myStorage,
        limits : {fileSize :3000000 },
        fileFilter :fileFilter    
    })
}
 
const setPath  = (path) =>{
    return (req, res, next) =>{
        req.uploadPath = path
        next();
    }
}

const deleteFile = (path) => {
    if(fs.existsSync(path)){
        fs.unlinkSync(path)
    }
}
module.exports = {
    uploadfile,
    setPath,
    deleteFile
}