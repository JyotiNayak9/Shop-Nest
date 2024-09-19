const { JsonWebTokenError } = require("jsonwebtoken");
const { StatusType } = require("../../config/constants.config");
const { userSvc } = require("../user/user.service");
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()

class AuthController {
    activateUser = async (req,res, next) => {
        try{
            const {token} = req.params;
            if(token.length !== 100){
                throw {status: 422, message:"Invalid Token"}
            }
           let user = await userSvc.getSingleUserByFilter({
                activationToken: token
            })
            const today = Date.now()
            let activateFor = user.activateFor.getTime();
            if(activateFor < today){
                throw {status:422, message :"Token expired"}
            }

            user.activationToken= null;
            user.activateFor = null;
            user.status = StatusType.ACTIVE

            await user.save();

            res.json({
                result : null,
                message: "Your account has been activated successfully. Please login to proceed",
                meta: null
            })
        }catch(exception){
            next(exception)
        }
    }

    resendActivationToken = async (req,res, next) =>{
        try{
            const {token} = req.params;
            let user = await userSvc.getSingleUserByFilter({
                activationToken :token
            })
            user = userSvc.generateUserActivationToken(user);
            await user.save();     
            await userSvc.sendActivationEmail({
                email: user.email,
                name : user.name,
                token : user.activationToken,
                sub: "Re-send, Activate your account"
            })
            res.json({
                result:null,
                message: "A new activation token has been sent to your registered email. Please follow the process to activate your account",
                meta: null
            })
        }catch(exception){
            next(exception)
        }
    }

    login = async (req, res, next) =>{
        try{
            const {email, password} = req.body

            const user = await userSvc.getSingleUserByFilter({
                email:email
            })

            if(bcrypt.compareSync(password, user.password)){
                if(user.status === StatusType.ACTIVE){

                    const token = jwt.sign({
                        sub: user._id
                    }, process.env.JWT_SECRET,
                    {
                       expiresIn: "1 day"
                }
                );

                const refreshToken = jwt.sign({
                    sub: user._id,
                    type: "refresh"
                }, process.env.JWT_SECRET,{
                    expiresIn: "1 day"
                })

                res.json({
                    result: {
                        UserDetail:{
                            _id: user._id,
                            name: user.name,
                            email: user.email,
                            role:user.role
                        },
                        token: {
                            token:token,
                            refreshToken: refreshToken
                        }
                    },
                        message: "login successful",
                        meta: null
                    })
                }else{
                    throw {status:422, message: "your account has not been activated yet"}
                }
            }else{
                throw {status: 422, message:"Credentials doesnot match"}
            }
        }catch(exception){
            next(exception)
        }
    }
    
    getloggedinUser = (req, res, next) =>{
        try{
            res.json({
                result: req.authUser,
                message: "Your Profile",
                meta: null

            })
        } catch(exception){
            next(exception)
        }
    }

    refreshToken = async(req, res, next) =>{
        try{
            let token = req.headers['Authorization'] || null;
        
            if(!token){
                throw {status: 401, message: "Token required"}
            }
                token = token.split(" ").pop()    
                const {sub, type} = jwt.verify(token, process.env.JWT_SECRET)
                if(!type || type !== "refresh"){
                    throw{status: 401, messsage: "refresh token required"}
                }
            await userSvc.getSingleUserByFilter({
                _id: sub
            })
            const accessToken = jwt.sign({
                sub: sub,
            }, process.env.JWT_SECRET,{
            })
            const refreshToken = jwt.sign({
                sub: sub,
                type: "refresh"
            }, process.env.JWT_SECRET,{
                expiresIn:"1 day"
            })
            res.json({
                result:{
                    token: accessToken,
                    refreshToken: refreshToken
                },
                message: "Token refreshed",
                meta: null
            })
        }catch(exception){
            next(exception)
        }
}
}



module.exports = new AuthController()