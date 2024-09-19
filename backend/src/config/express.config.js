const express = require("express");
const cors = require('cors');
// import db connection
require("./db.config.js");

const router = require("./router.config.js");
const { MulterError } = require("multer");
const app = express();

app.use(cors())

app.use('/images', express.static('./public/uploads'))
//parsers
app.use(express.json()) ; //json content type
app.use(express.urlencoded({    
    extended :true
}));

//router mounting point
app.use(router)

app.use((req, res, next) => {
    next({status: 404, message : "resource not found"})
})

// error handling midldeware
app.use((error, req,res, next) =>{
console.log (error)
let statusCode = error.status || 500;
let message = error.message || "Server error...."
let detail = error.detail || null;


if(error.code === 11000){
   
        const uniqueFailedKeys = Object.keys(error.keyPattern)
        detail = {};
        message ="validation Failed"             
        uniqueFailedKeys.map((field)=>{
            detail[field] = field + " Should be unique"
        })
        statusCode = 400
    }

if(error instanceof MulterError){
    if(error.code = "LIMIT_FILE_SIZE"){
        statusCode = 400,
        detail = {
            [error.field] : 'file size too large'
        }

    }
}


res.status(statusCode).json({
    result:detail,
    message : message,
    meta : null
})
})





module.exports = app;