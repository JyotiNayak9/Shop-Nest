require ("dotenv").config();
const bcrypt = require("bcryptjs");
const { randomStringGenerator, deleteFile } = require("../../utilities/helper");
const mailSvc = require("../../services/mail.service");
const UserModel = require("./user.model");
const uploadImage = require("../../config/cloudinary.config");



class UserService{

generateUserActivationToken = (data) =>{
    data.activationToken = randomStringGenerator(100)
    data.activateFor = new Date(Date.now()+(process.env.TOKEN_ACTIVE_FOR*60*60*1000))      
    return data; 
}
    transformUserCreate = async (req) =>{
        let data = req.body;

            if(req.file){
                data.image = req.file.filename
            }
            data.password = bcrypt.hashSync(data.password, 10)
           const tokenData = this.generateUserActivationToken(data)
           data.activationToken = tokenData.activationToken;
           data.status = "inactive"
           data.image = await uploadImage("./public/uploads/user/"+req.file.filename)
            return data;
    }

    sendActivationEmail =  async ({name, email, token, sub = "Activate yoour account"}) =>{
        try{
            await mailSvc.sendEmail({
                to: email,
                sub: sub ,
                message : `
                Dear ${name}, <br/>
                <p>Your account has been registered successfully</p>
                <p> Please click on the link below or copy and paste the url inthe browser to activate your account: </p>
                <a href = "${process.env.FRONTEND_URL+'activate/'+token}">${process.env.FRONTEND_URL+'activate/'+token}</a>
                <br>
                <p>----------------------------------------------------</p>
                <p>Regards</p>
                <p>System Admin</p>
                <p>"${process.env.SMTP_FROM}"</p>
                <p>
                <small><i>Please do not reply to this email</i></small>
                </p>               
                `
                
            })
        }catch(exception){
            throw exception
        }
    }

    registerUser = async (data)=>{
        try{
            const user = new UserModel(data);
              return await user.save();
        }catch(exception){
            if(data.image){
                deleteFile("./public/uploads/user/"+data.image);
            }
            throw(exception)
        }
    }

    getSingleUserByFilter = async(filter) =>{
        try{
           const UserDetail = await UserModel.findOne(filter);
           if(UserDetail){
            return UserDetail;
           }else{
            throw {status : 404, message: "User doesnot exist"}
           }
        }catch(exception){
            throw exception
        }
    }
}

const userSvc = new UserService()
module.exports = {
    userSvc
}