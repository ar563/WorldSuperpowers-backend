const express = require("express");
const router = express.Router();
const format = require("pg-format");
const base64url = require("base64url");
const { nanoid } = require("nanoid");
const validator = require("validator");

const sendMail = require("../utils/sendMail");
const client = require("../db");
const logger = require("../utils/logger");
const auth = require("../utils/auth");

router.get("/:newemail", auth, (req, response) => {
  const newEmail = base64url.decode(req.params.newemail);
  if (!validator.isEmail(newEmail)) return;
  const code = nanoid();
  client.query(
    format(
      "UPDATE login_data SET verification_code = %L, email = %L, isemailverified = false WHERE username = %L AND NOT EXISTS (SELECT * FROM login_data WHERE email = %L FOR UPDATE);",
      code,
      newEmail,
      response.locals.user,
      newEmail,
    ),
    (err, res) => {
      if (err || res.rowCount !== 1) {
        err && logger.error(err);
        return;
      }
      sendMail({
        to: newEmail,
        subject: "account verification",
        html: `<html><body><p><a target="_blank" href="https://worldsuperpowers.cc/verify/${code}">Click here</a> to verify your WorldSuperpowers account</p></body></html>`,
      }).then(response.send("email updated"));
    },
  );
});

module.exports = router;
