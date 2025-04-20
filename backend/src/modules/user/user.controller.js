require("dotenv").config();
const { hasValidDomain } = require("./user.request");
const { userSvc } = require("./user.service");


class UserController{
   
    
    userCreate= async (req, res, next)=>{
            try{
                const data = await userSvc.transformUserCreate(req);
                const user = await userSvc.registerUser(data);
               
                console.log("Registered Data:", user);
                // await userSvc.sendActivationEmail({name: user.name, email: user.email, token: user.activationToken})   
            res.json({
                result:user,
                message:"User created",
                meta : null
            })
            } catch(exception){
                next(exception)
            }
        }

        userLists = (req, res,next)=>{
            console.log("post after")
            res.json({
                result:"",
                message:"list all user",
                meta : null
            })
        }

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
        const user = await userSvc.ForgotPasswordToken(req)
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

}

const userCtrl = new UserController()

module.exports = userCtrl;