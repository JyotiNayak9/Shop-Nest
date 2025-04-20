const axios = require("axios");

const verifyEmailExists = async (email) => {
  try {
    const res = await axios.get("https://apilayer.net/api/check", {
      params: {
        access_key: process.env.MAILBOXLAYER_KEY,
        email,
        smtp: 1,
        format: 1
      }
    });

    const { format_valid, smtp_check, domain, catch_all, disposable, score } = res.data;

    // Basic logic: allow known domains even if smtp_check fails (Gmail, Outlook etc.)
    const knownSafeDomains = ["gmail.com", "yahoo.com", "outlook.com", "hotmail.com"];
    const isKnownDomain = knownSafeDomains.includes(domain);

    if (!format_valid) {
      return false; // Invalid email format
    }

    if (smtp_check || isKnownDomain) {
      return true;
    }

    return false;
  } catch (err) {
    console.error("Email validation error:", err.message);
    return false; // fallback: reject if API fails
  }
};

module.exports = {
  verifyEmailExists
};
