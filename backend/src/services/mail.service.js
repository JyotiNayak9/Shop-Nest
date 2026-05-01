require("dotenv").config();
const nodemailer = require("nodemailer");

class MailService {
  #transport;

  constructor() {
    try {
      console.log("SMTP CONFIG:", {
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        user: process.env.SMTP_USER,
      });
      const config = {
        host: process.env.SMTP_HOST,
        port: 587,
        secure: false,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASSWORD,
        },
        tls: {
          rejectUnauthorized: false,
        },
      };
      this.#transport = nodemailer.createTransport(config);
      console.log("smtp server connected successfully");
    } catch (exception) {
      console.log(exception);
      console.log("Error connecting to mail server");
      // process.exit(1)
    }
  }

  sendEmail = async ({ to, sub, message, attachments = null }) => {
    try {
      console.log("sendEmail called with:", { to, from: process.env.SMTP_FROM, sub });
      
      const msgOpts = {
        to: to,
        from: process.env.SMTP_FROM,
        subject: sub,
        html: message,
      };

      if (attachments) {
        msgOpts["attachments"] = attachments;
      }
      
      console.log("Sending mail with options:", JSON.stringify(msgOpts, null, 2));
      console.log("Transport status:", this.#transport ? "Initialized" : "Not initialized");
      
      const response = await this.#transport.sendMail(msgOpts);
      console.log("Email sent successfully:", response);
      return response;
    } catch (exception) {
      console.error("SEND EMAIL ERROR:");
      console.error("Error code:", exception.code);
      console.error("Error message:", exception.message);
      console.error("Error stack:", exception.stack);
      console.error("Full error:", exception);
      throw { status: 500, message: "error sending email: " + exception.message, detail: exception };
    }
  };
}

const mailSvc = new MailService();

module.exports = mailSvc;
