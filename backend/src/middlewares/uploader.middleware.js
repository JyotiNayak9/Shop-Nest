const multer = require ("multer");
const fs = require ("fs");
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
        const filename = randomStringGenerator(40)+"."+ ext;
        cb(null,filename);
    }   
})

const uploadfile = (filetype = fileFilterType.IMAGE) =>{
    let allowed  = ['jpg','svg','jpeg','webp','png','gif','bmp'];
    if (filetype === fileFilterType.DOC){
        allowed = ['doc','docx','xls','txt'];
    }else if(filetype === fileFilterType.VIDEO){
        allowed = ['mp4','mov','wav','mkv'];
    }

   return multer({
        storage: myStorage,
        limits : {
            fileSize :3000000 
        },
        fileFilter :(req, file, cb) => {
            const ext = file.originalname.split(".").pop();
            if(allowed.includes(ext.toLowerCase())){
                cb(null,true)
            }else{
            cb({code: 400, message:"file format not supported"})
        }
    }
    })
}
    
const setPath  = (path) =>{
    return (req, res, next) =>{
        req.uploadPath = path
        next();
    }
}

module.exports = {
    uploadfile,
    setPath
}