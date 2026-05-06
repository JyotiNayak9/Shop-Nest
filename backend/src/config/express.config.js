const express = require("express");
const cors = require('cors');
require("./db.config.js");

const router = require("./router.config.js");
const { MulterError } = require("multer");
const app = express();

app.use(cors({
  origin: [
    "https://shop-nest-teal-five.vercel.app"
  ],
  credentials: true
}));

app.use('/images', express.static('./public/uploads'))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(router)

app.use((req, res, next) => {
    next({ status: 404, message: "resource not found" })
})

// error handling middleware
app.use((error, req, res, next) => {
    console.log(error)

    let statusCode = error.status || 500;
    let message = error.message || "Server error....";
    let detail = error.detail || null;
    let code = error.code || null;  

    // MongoDB duplicate key error — overwrites code with 11000, handle separately
    if (error.code === 11000) {
        const uniqueFailedKeys = Object.keys(error.keyPattern);
        detail = {};
        message = "Validation Failed";
        uniqueFailedKeys.map((field) => {
            detail[field] = field + " should be unique";
        });
        statusCode = 400;
        code = null; 
    }

    if (error instanceof MulterError) {
        if (error.code === "LIMIT_FILE_SIZE") {
            statusCode = 400;
            detail = {
                [error.field]: error.message
            };
            code = null;
        }
    }

    res.status(statusCode).json({
        result: detail,
        code: code,     
        message: message,
        meta: null
    })
})

module.exports = app;