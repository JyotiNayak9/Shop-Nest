require ("dotenv").config();
const bcrypt = require("bcryptjs");
const { randomStringGenerator, deleteFile } = require("../../utilities/helper");
const mailSvc = require("../../services/mail.service");
const UserModel = require("./user.model");
const uploadImage = require("../../config/cloudinary.config");
// const { hasValidDomain, verifyEmailExists } = require("./email_validator");
// const dns= require('dns').promises;



class UserService{

generateUserActivationToken = (data) =>{
    data.activationToken = randomStringGenerator(100)
    data.activateFor = Date.now()+(process.env.TOKEN_ACTIVE_FOR*60*60*1000)     
    return data; 
}
transformUserCreate = async (req) =>{
let data = req;
        // if(req.file){
        //     data.image = req.file.filename
        // }
        console.log("Data", data)
        data.password = bcrypt.hashSync(data.password, 10)
    //    const tokenData = this.generateUserActivationToken(data)
    //    data.activationToken = tokenData.activationToken;
    //    data.status = "inactive"
    console.log(data)

    //    data.image = await uploadImage("./public/uploads/user/"+req.file.filename)
        return data;
}

      

    sendActivationEmail =  async ({name, email, token, sub = "Activate your account"}) =>{
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
            console.log(data)
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

    GeneratePasswordResetToken = (data) => {
        data.passwordResetToken = randomStringGenerator(32)
        data.passwordResetExpires = new Date(Date.now()+(30*60*1000))
        return data;
    }

    generateForgotPasswordToken = async(req) => {

        const { email } = req.body;
       
      let user = await UserModel.findOne({ email });

      if (!user) {
        throw { message: "User doesnot exist" };
      }
      user = userSvc.GeneratePasswordResetToken(user);
        console.log("2", user.passwordResetToken);

      return await user.save();
    }

    ResetPasswordEmail = async ({name, email, token, sub = "Password Reset Token"}) =>{
        try{
            console.log(`Attempting to send reset email to: ${email}`);
            console.log(`FRONTEND_URL: ${process.env.FRONTEND_URL}`);
            console.log(`SMTP_FROM: ${process.env.SMTP_FROM}`);
            
            const result = await mailSvc.sendEmail({
                to: email,
                sub: sub ,
                message : `
                Dear ${name}, <br/>
                <p> Please click on the link below or copy and paste the url in the browser to reset your password: </p>
                <a href = "${process.env.FRONTEND_URL}resetpassword/${token}">${process.env.FRONTEND_URL}resetpassword/${token}</a>
                <p>This link is valid till 30 minutes</p>
                <br>
                <p>----------------------------------------------------</p>
                <p>Regards</p>
                <p>System Admin</p>
                <p>"${process.env.SMTP_FROM}"</p>
                <p>
                <small><i>Please do not reply to this email</i></small>
                </p>               
                `
            });
            console.log(`Reset email sent successfully:`, result);
            return result;
        }catch(exception){
            console.error(`Failed to send reset email to ${email}:`, exception);
            throw exception
        }
    }

   ResetPassword = async(req) => {
    const { password } = req.body;
    const { token } = req.params;

    console.log("token from params:", JSON.stringify(token));

    const allUsers = await UserModel.find({ passwordResetToken: { $ne: null } }, { email: 1, passwordResetToken: 1, passwordResetExpires: 1 });
    console.log("All users with reset tokens:", JSON.stringify(allUsers));

    const user = await UserModel.findOne({ passwordResetToken: token });
    console.log("user found:", user ? user.email : "NOT FOUND");


    if (!user) {
        throw({ message: "No such reset password found" });
    } else if (user.passwordResetExpires < Date.now()) {
        throw({ message: "Token expired. Please try again" });
    }

    const hashed = bcrypt.hashSync(password, 10);
    console.log("Hashed password being saved:", hashed); // add this

    user.password = hashed;
    user.passwordResetExpires = null;
    user.passwordResetToken = null;

    const saved = await user.save();
    console.log("Password in DB after save:", saved.password); // add this
    return saved;
}

    listUsers= async (filter = {}) => {
    return await UserModel.find(filter).select("-password").sort({ _id: -1 });
}

countUsers= async (filter = {}) => {
    return await UserModel.countDocuments(filter);
}

}



const userSvc = new UserService()
module.exports = {
    userSvc
}