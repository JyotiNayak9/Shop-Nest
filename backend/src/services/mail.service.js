require('dotenv').config();
const SibApiV3Sdk = require('@getbrevo/brevo');

class MailService {

    #apiInstance

    constructor() {
    try {
        const client = SibApiV3Sdk.ApiClient.instance;
        const apiKey = client.authentications['api-key'];
        apiKey.apiKey = process.env.BREVO_API_KEY;

        this.#apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

        console.log("Brevo mail service initialized successfully");
    } catch (exception) {
        console.error("Error initializing Brevo mail service:", exception);
    }
}

sendEmail = async ({ to, sub, message }) => {
    try {
        const emailData = {
            sender: {
                email: process.env.SMTP_FROM,
                name: "ShopNest"
            },
            to: [{ email: to }],
            subject: sub,
            htmlContent: message
        };

        const response = await this.#apiInstance.sendTransacEmail(emailData);

        console.log("Email sent successfully:", response);
        return response;

    } catch (exception) {
        console.error("Email send failed:", exception);
        throw { status: 500, message: "Email failed", detail: exception };
    }
};
}

const mailSvc = new MailService();

module.exports = mailSvc;