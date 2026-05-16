const rateLimit = require('express-rate-limit');

const otpLimiter = rateLimit({
    windowMs: 60 * 1000,  //
    message: { status: 429, message: "Too many requests. Please wait before requesting a new OTP." }
});

const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString(); 
};

module.exports = {
    generateOTP, otpLimiter};
