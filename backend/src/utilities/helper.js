const fs = require("fs")

const randomStringGenerator = (len) =>{
    const char = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMMNOPQRSTUVQXYZ";
    const lenght = char.length;
    let random = "";
    for(let i= 0 ;i<len; i++){
        const posn = Math.ceil(Math.random()*(lenght - 1))  // 0, 61
        random += char[posn];
    }
    return random;
}
// src/utils/otp.util.js
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString(); // 6 digit OTP
};

module.exports = generateOTP;

const deleteFile = (path) => {
    if(fs.existsSync(path)){
        fs.unlinkSync(path)
    }
}
module.exports = {
    randomStringGenerator,
    deleteFile
}