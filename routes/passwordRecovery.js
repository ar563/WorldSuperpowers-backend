const express = require("express");
const router = express.Router();
const format = require("pg-format");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const argon2 = require("argon2");

const client = require("../db");
const privateData = require("../private");
const logger = require("../utils/logger");

router.get("/:code", (req, response) => {
  const buff = Buffer.from(req.get("authorization"), "base64");
  const password = buff.toString("utf-8");
  if (
    !validator.isByteLength(password, {
      min: 0,
      max: 300,
    })
  ) {
    response.sendStatus(404);
    return;
  }
  fs.readFile(privateData.filePath, async (err, data) => {
    if (err) {
      logger.error(err);
      return;
    }
    try {
      const hashedPassword = await argon2.hash(password);
      jwt.verify(
        req.params.code,
        privateData.passphrase(data),
        (err, decoded) => {
          if (err) {
            response.sendStatus(403);
            return;
          }
          if (
            decoded?.userPassRecover === undefined ||
            decoded?.passwordHash === undefined
          )
            return;
          client.query(
            format(
              "UPDATE login_data SET hashed_password = %L WHERE username = %L AND hashed_password = %L;",
              hashedPassword,
              decoded.userPassRecover,
              decoded.passwordHash,
            ),
            (err) => {
              if (err) {
                logger.error(err);
                return;
              }
              response.send(
                `password changed for user:${decoded.userPassRecover}`,
              );
            },
          );
        },
      );
    } catch (error) {
      logger.error(error);
    }
  });
});

module.exports = router;
