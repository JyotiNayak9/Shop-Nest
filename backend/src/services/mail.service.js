require('dotenv').config();
const axios = require('axios');

class MailService {

  sendEmail = async ({ to, sub, message }) => {
    try {
      const response = await axios.post(
        'https://api.brevo.com/v3/smtp/email',
        {
          sender: {
            email: process.env.SMTP_FROM,
            name: "ShopNest"
          },
          to: [{ email: to }],
          subject: sub,
          htmlContent: message
        },
        {
          headers: {
            'api-key':process.env.B,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log("Email sent:", response.data);
      return response.data;

    } catch (error) {
      console.error("Email send failed:", error.response?.data || error.message);
      throw {
        status: 500,
        message: "Email failed",
        detail: error.response?.data || error.message
      };
    }
  };
}

module.exports = new MailService();