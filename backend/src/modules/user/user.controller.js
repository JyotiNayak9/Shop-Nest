require("dotenv").config();
const { hasValidDomain } = require("./user.request");
const bcrypt = require("bcryptjs");

const { userSvc } = require("./user.service");
const { UserRoles, StatusType } = require("../../config/constants.config");


class UserController{
   
    
    userCreate= async (req, res, next)=>{
            try{
                const body = req.body;
                await userSvc.validateEmail(body.email);
                console.log("Email validation passed for:", body.email);
                const data = await userSvc.transformUserCreate(body);
                const user = await userSvc.registerUser(data);
                
                console.log("Registered Data:", user);
                
                await userSvc.sendVerificationOTP(user);                
                res.json({
                    result: null,
                    message: "Registration successful. Please check your email for OTP.",
                    meta : null
                })
            } catch(exception){
                next(exception)
            }
        }

        
        
       userLists = async (req, res, next) => {
    try {
        const { role } = req.query; 
        let filter = {};

        if (role === "customer") {
            filter.role = UserRoles.CUSTOMER;
        } else if (role === "seller") {
            filter.role = UserRoles.SELLER;
        }

        const users = await userSvc.listUsers(filter); 
        const count = await userSvc.countUsers(filter); 
        res.json({
            result: users,
            message: `List of ${role || 'all'} users`,
            meta: {
                total: count,
            },
        });
    } catch (exception) {
        next(exception);
    }
};


        userdetailbyId = (req,res, next)=>{
            const params = req.params;
            res.json({
                result:"",
                message:`user details of ${req.params.id}`,
                meta : null
            })
    }
    userupdatebyId = (req,res, next)=>{
        const params = req.params;
        res.json({
            result:"",
            message:`user update of ${req.params.id}`,
            meta : null
        })
}
userdeletebyId = (req,res, next)=>{
    const params = req.params;
    res.json({
        result:"",
        message:`user delete of ${req.params.id}`,
        meta : null
    })
}


ForgotPasswordToken = async (req, res, next) => {
    try {
        console.log("ForgotPasswordToken controller - req.body:", req.body);
        const user = await userSvc.generateForgotPasswordToken(req)
        console.log("1 - User token generated:", user.passwordResetToken);
        await userSvc.ResetPasswordEmail({
            name: user.name,
            email: user.email,
            token: user.passwordResetToken,
          });
      res.json({
        result: user.passwordResetToken,
        message:
          "Reset Token is sent to your email. Please check and proceed further.",
        meta: null,
      });
    } catch (exception) {
      console.error("ForgotPasswordToken ERROR:", exception);
      next(exception);
    }
  };

  ResetPassword = async(req,res,next) => {
    try{
        const user = await userSvc.ResetPassword(req)
    res.json({
        result:user,
        message:"Password changed successfully.",
        meta: null
    })
    }catch(exception){
        next(exception)
    }
  }
 registerSeller = async (req, res, next) => {
        try {
            const { name, email, password, phone, storeName, storeAddress, panNumber } = req.body;

            console.log(req.body)
            const userData = {
                name: name,
                email,
                password:password,
                role: UserRoles.SELLER,
                phone: [phone],
                store: {
                    name: storeName,
                    address: storeAddress,
                    panNumber: panNumber,
                    // status: StatusType.INACTIVE
                }
            };
            console.log(userData)
            let user = await userSvc.transformUserCreate(userData);
            user = await userSvc.registerUser(user);
            console.log("Registered Data:", user);

            // Send OTP for email verification
            await userSvc.sendVerificationOTP(user);

            res.json({
                result: null,
                message: "Seller registration successful. Please check your email for OTP.",
                meta: null
            });
        } catch (exception) {
            next(exception);
        }
    }

    // Verify OTP
    verifyEmail = async (req, res, next) => {
        try {
            const { email, otp } = req.body;
            const result = await userSvc.verifyOTP(email, otp);
            res.json({ result, message: "Email verified successfully.", meta: null });
        } catch (exception) {
            next(exception);
        }
    }

    // Resend OTP
    resendOTP = async (req, res, next) => {
        try {
            const { email } = req.body;
            const result = await userSvc.resendVerificationOTP(email);
            res.json({ result: null, message: "OTP resent successfully.", meta: null });
        } catch (exception) {
            next(exception);
        }
    }
}



const userCtrl = new UserController()

module.exports = userCtrl;