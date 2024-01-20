const express = require("express");
const router = express.Router();
const format = require("pg-format");
const argon2 = require("argon2");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const validator = require("validator");

const client = require("../db");
const privateData = require("../private");
const logger = require("../utils/logger");

router.get("/", (req, response) => {
  if (!req.get("Authorization")) {
    response.sendStatus(403);
    return;
  }
  const buff = Buffer.from(req.get("Authorization"), "base64");
  const [username, password] = buff.toString("utf-8").split(":");

  if (
    !validator.isByteLength(password, {
      min: 0,
      max: 260,
    })
  ) {
    response.sendStatus(403);
    return;
  }
  client.query(
    format(
      "SELECT * FROM login_data WHERE username = %L AND isemailverified = true;",
      username,
    ),
    (err, res) => {
      if (err) {
        logger.error(err);
        return;
      }
      fs.readFile(privateData.filePath, async (err, data) => {
        if (err) {
          logger.error(err);
          response.sendStatus(403);
          return;
        }
        if (res.rows.length === 0) {
          response.status(418).send("email not verified");
          return;
        }
        try {
          const isCorrectPassword = await argon2.verify(
            res.rows[0].hashed_password,
            password,
          );
          if (!isCorrectPassword) {
            response.sendStatus(403);
            return;
          }
          response.send(
            jwt.sign({ user: username }, privateData.passphrase(data)),
          );
        } catch (err) {
          logger.error(err);
        }
      });
    },
  );
});

module.exports = router;
