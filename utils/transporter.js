const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "your_host",
  port: 465,
  secure: true,
  auth: {
    user: "your_email",
    pass: "your_password",
  },
  dkim: {
    domainName: "your_domain",
    privateKey: "your_private_key",
  },
});

module.exports = transporter;
