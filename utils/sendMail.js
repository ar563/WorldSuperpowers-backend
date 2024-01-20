const transporter = require("./transporter");
const logger = require("../utils/logger");

const sendMail = async ({ to, subject, html }) => {
  try {
    return await transporter.sendMail({
      from: "your_email",
      to: to,
      subject: subject,
      html: html,
    });
  } catch (error) {
    logger.error(error);
    return error;
  }
};

module.exports = sendMail;
