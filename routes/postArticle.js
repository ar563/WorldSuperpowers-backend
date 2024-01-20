const express = require("express");
const router = express.Router();
const format = require("pg-format");
const { nanoid } = require("nanoid");
const validator = require("validator");
const bodyParser = require("body-parser");

const client = require("../db");
const logger = require("../utils/logger");
const auth = require("../utils/auth");

const jsonParser = bodyParser.json();

router.post("/", auth, jsonParser, (req, response) => {
  const isValidLocale =
    req.body.locale && typeof req.body.locale === "string"
      ? validator.isLocale(req.body.locale) || req.body.locale === "global"
      : false;
  const isValidTitle =
    req.body.title && typeof req.body.title === "string"
      ? validator.isLength(req.body.title, { min: 1, max: 20 }) &&
        validator.isAscii(req.body.title)
      : false;
  const isValidArticle =
    req.body.article && typeof req.body.article === "string"
      ? validator.isAscii(req.body.article)
      : false;
  if (!isValidLocale || !isValidArticle || !isValidTitle) return;
  client.query(
    format(
      "INSERT INTO articles (articleid, username, article, nickname, locale, islocal, title) SELECT %L, username, %L, nickname, %L, %L, %L FROM profiles WHERE username = %L AND NOT EXISTS (SELECT * FROM banned WHERE username = %L FOR UPDATE) FOR UPDATE;",
      nanoid(),
      req.body.article,
      req.body.locale,
      req.body.locale !== "global",
      req.body.title,
      response.locals.user,
      response.locals.user,
    ),
    (err) => {
      if (err) {
        logger.error(err);
        return;
      }
      response.send("success");
    },
  );
});

module.exports = router;
