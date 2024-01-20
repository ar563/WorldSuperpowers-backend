const express = require("express");
const router = express.Router();
const format = require("pg-format");
const argon2 = require("argon2");
const validator = require("validator");
const { nanoid } = require("nanoid");

const sendMail = require("../utils/sendMail");
const logger = require("../utils/logger");
const auth = require("../utils/auth");

const client = require("../db");

router.get("/", async (req, response) => {
  const buff = Buffer.from(req.get("Authorization"), "base64");
  const credentials = buff.toString("utf-8");
  const [username, password, email, captcha] = credentials.split(":");
  const isValidData =
    validator.isAlphanumeric(username) &&
    validator.isLength(username, { min: 1, max: 20 }) &&
    validator.isLength(password, {
      min: 1,
      max: 260,
    }) &&
    validator.isEmail(email);

  if (!req.get("Authorization") || !isValidData) {
    response.sendStatus(403);
    return;
  }

  const verificationUrl = "https://hcaptcha.com/siteverify";
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      response: captcha,
      secret: process.env.HCAPTCHA_SECRET_KEY,
    }).toString(),
  };

  try {
    const resp = await fetch(verificationUrl, requestOptions);

    if (!resp.ok) {
      throw new Error("CAPTCHA verification request failed");
    }

    const data = await resp.json();

    if (!data.success) {
      response.sendStatus(403);
      return;
    }

    const code = nanoid();
    const hashedPassword = await argon2.hash(password);

    await client.query(
      format(
        "BEGIN; INSERT INTO login_data (hashed_password, verification_code, username, email) SELECT %L, %L, %L, %L WHERE NOT EXISTS (SELECT * FROM login_data WHERE username = %L OR email = %L FOR UPDATE); INSERT INTO user_data (username) VALUES (%L); INSERT INTO profiles (nickname, username) VALUES (%L, %L); COMMIT;",
        hashedPassword,
        code,
        username,
        email,
        username,
        email,
        username,
        username,
        username,
      ),
    );

    response.send("account successfully created");
    await sendMail({
      to: email,
      subject: "account verification",
      html: `<html><body><p><a target="_blank" href="https://worldsuperpowers.cc/verify/${code}">Click here</a> to verify your WorldSuperpowers account</p></body></html>`,
    });
  } catch (error) {
    logger.error(error);
    response.sendStatus(500);
  }
});

module.exports = router;
