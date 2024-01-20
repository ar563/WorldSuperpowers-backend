const express = require("express");
const router = express.Router();
const format = require("pg-format");
const fs = require("fs");
const base64url = require("base64url");
const jwt = require("jsonwebtoken");

const sendMail = require("../utils/sendMail");
const client = require("../db");
const privateData = require("../private");
const logger = require("../utils/logger");

router.get("/:email", (req, response) => {
  fs.readFile(privateData.filePath, (err, data) => {
    if (err) {
      logger.error(err);
      return;
    }
    const mail = base64url.decode(req.params.email);
    client.query(
      format("SELECT * FROM login_data WHERE email = %L;", mail),
      async (err, res) => {
        if (err || res.rows.length !== 1) {
          err && logger.error(err);
          return;
        }
        const code = jwt.sign(
          {
            userPassRecover: res.rows[0].username,
            passwordHash: res.rows[0].hashed_password,
          },
          privateData.passphrase(data),
          {
            expiresIn: "2h",
          },
        );
        response.send("recovery code sended");
        await sendMail({
          to: mail,
          subject: "account recovery",
          html: `<html><body><p><a target="_blank" href="https://worldsuperpowers.cc/change_password?code=${code}">Click here</a> to change your WorldSuperpowers password</p></body></html>`,
        });
      },
    );
  });
});

module.exports = router;
