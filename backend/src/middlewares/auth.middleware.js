const jwt= require("jsonwebtoken")
const { userSvc } = require("../modules/user/user.service")
require("dotenv").config()

const loginCheck = async (req, res, next) => {
   try{
    let token = req.headers['authorization'] 

    if(!token){
        throw {status: 401, message: "Unauthorized access"}
    }else{
        token = token.split(" ").pop()

        const data = jwt.verify(token, process.env.JWT_SECRET)
        
        if(data.hasOwnProperty('type')){
            throw {status:403, message : "access token required"}
        }
        const user = await userSvc.getSingleUserByFilter({
            _id: data.sub
            
        })
        req.authUser = {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            status: user.status,
            address: user.address,
            phone: user.phone,
            image: user.image || null
        }

        next();
   }
    } catch(exception){
        console.log(exception)
        next({status :401, message: exception.message})
        }
    }

    

    module.exports = loginCheck;