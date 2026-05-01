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
      const msgOpts = {
        to: to,
        from: process.env.SMTP_FROM,
        subject: sub,
        html: message,
      };

      if (attachments) {
        msgOpts["attachments"] = attachments;
      }
      const response = await this.#transport.sendMail(msgOpts);
      return response;
    } catch (exception) {
      console.log(exception);
      console.log("error sending email");
      throw { status: 500, message: "error sending email", detail: exception };
    }
  };
}

const mailSvc = new MailService();

module.exports = mailSvc;
