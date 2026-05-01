require('dotenv').config();
const nodemailer = require("nodemailer")

class MailService {

    #transport

    constructor(){
        try{
            const config = {
                host: process.env.SMTP_HOST,
                port: process.env.SMTP_PORT,
                auth:{
                    user: process.env.SMTP_USER,
                    pass : process.env.SMTP_PASSWORD
                }
            }
            if(process.env.SMTP_PROVIDER === 'gmail'){
                config['service'] = 'gmail'
            }
        this.#transport = nodemailer.createTransport(config)
        console.log("smtp server connected successfully")
        }catch(exception){
            console.log(exception)
            console.log("Error connecting to mail server")
            // process.exit(1)
        }
    }

    sendEmail = async ({to, sub, message, attachments = null}) =>{
        try{
            console.log("Verifying SMTP connection...");
            await this.#transport.verify();
            console.log("SMTP verified");
            
            const msgOpts = {
                to: to, 
                from: process.env.SMTP_FROM,
                subject : sub,
                html: message
            }

            if(attachments){
                msgOpts ['attachments'] = attachments;
            }
            
            // Send with timeout
            const sendPromise = this.#transport.sendMail(msgOpts);
            const timeoutPromise = new Promise((_, reject) => 
                setTimeout(() => reject(new Error("Email timeout - check SMTP settings")), 10000)
            );
            
            const response = await Promise.race([sendPromise, timeoutPromise]);
            console.log("Email sent:", response.messageId);
            return response;
        }catch(exception){
            console.error("Email send failed:", exception.message);
            throw{status:500, message: "Email failed: " + exception.message, detail:exception}
        }
    }
}

const mailSvc = new MailService()

module.exports = mailSvc;