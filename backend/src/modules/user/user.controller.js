require("dotenv").config();
const { userSvc } = require("./user.service");


class UserController{
   
    
    userCreate= async (req, res, next)=>{
            try{
                const data = userSvc.transformUserCreate(req);
                const user = await userSvc.registerUser(data);

                await userSvc.sendActivationEmail({name: user.name, email: user.email, token: user.activationToken})   
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
}


const userCtrl = new UserController()

module.exports = userCtrl;