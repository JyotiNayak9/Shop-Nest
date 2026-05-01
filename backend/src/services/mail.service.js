require('dotenv').config();
const nodemailer = require("nodemailer")

class MailService {

    #transport

    constructor(){
        try{
            const config = {
                host: process.env.SMTP_HOST,
                port: Number(process.env.SMTP_PORT),
                secure: Number(process.env.SMTP_PORT) === 465, // true for 465, false for 587
                auth:{
                    user: process.env.SMTP_USER,
                    pass : process.env.SMTP_PASSWORD
                },
                connectionTimeout: 10000,
                greetingTimeout: 10000,
                socketTimeout: 10000,
            }

            if(process.env.SMTP_PROVIDER === 'gmail'){
                config['service'] = 'gmail'
            }

            this.#transport = nodemailer.createTransport(config)
            console.log("SMTP transport created successfully")
        }catch(exception){
            console.log(exception)
            console.log("Error creating mail transport")
        }
    }

    sendEmail = async ({to, sub, message, attachments = null}) =>{
        try{
            console.log("sendEmail called for:", to);  // add this
        console.log("SMTP config:", {
            user: process.env.SMTP_USER,
            from: process.env.SMTP_FROM,
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
        });
            const msgOpts = {
                to: to, 
                from: process.env.SMTP_FROM,
                subject : sub,
                html: message
            }

            if(attachments){
                msgOpts['attachments'] = attachments;
            }
            
            const sendPromise = this.#transport.sendMail(msgOpts);
            const timeoutPromise = new Promise((_, reject) => 
                setTimeout(() => reject(new Error("Email timeout - check SMTP settings")), 15000)
            );
            
            const response = await Promise.race([sendPromise, timeoutPromise]);
            console.log("Email sent:", response.messageId);
            return response;
        }catch(exception){
            console.error("Email send failed:", exception.message);
            throw { status: 500, message: "Email failed: " + exception.message, detail: exception }
        }
    }
}

const mailSvc = new MailService()

module.exports = mailSvc;