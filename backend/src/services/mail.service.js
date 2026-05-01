require('dotenv').config();
const Brevo = require('@getbrevo/brevo');

class MailService {

    #apiInstance

    constructor() {
        try {
            const client = Brevo.ApiClient.instance;
            const apiKey = client.authentications['api-key'];
            apiKey.apiKey = process.env.BREVO_API_KEY;

            this.#apiInstance = new Brevo.TransactionalEmailsApi();
            console.log("Brevo mail service initialized successfully");
        } catch (exception) {
            console.error("Error initializing Brevo mail service:", exception);
        }
    }

    sendEmail = async ({ to, sub, message, attachments = null }) => {
        try {
            console.log("sendEmail called for:", to);

            const sendSmtpEmail = new Brevo.SendSmtpEmail();

            sendSmtpEmail.to = [{ email: to }];
            sendSmtpEmail.sender = {
                email: process.env.SMTP_FROM,
                name: "ShopNest"
            };
            sendSmtpEmail.subject = sub;
            sendSmtpEmail.htmlContent = message;

            if (attachments) {
                sendSmtpEmail.attachment = attachments;
            }

            const response = await this.#apiInstance.sendTransacEmail(sendSmtpEmail);
            console.log("Email sent successfully, messageId:", response.messageId);
            return response;
        } catch (exception) {
            console.error("Email send failed:", exception.message);
            throw { status: 500, message: "Email failed: " + exception.message, detail: exception };
        }
    }
}

const mailSvc = new MailService();

module.exports = mailSvc;