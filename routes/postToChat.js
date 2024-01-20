const express = require("express");
const router = express.Router();
const format = require("pg-format");
const base64url = require("base64url");
const validator = require("validator");
const { nanoid } = require("nanoid");

const client = require("../db");
const logger = require("../utils/logger");
const auth = require("../utils/auth");

router.get("/:locale/:encodedmessage", auth, (req, response) => {
  const isLocal = req.params.locale !== "global";
  if (!validator.isLocale(req.params.locale) && isLocal) return;

  client.query(
    format(
      "INSERT INTO chat_global (message_id, username, message, avatar, nickname, locale, islocal) SELECT %L, username, %L, avatar, nickname, %L, %L FROM profiles WHERE username = %L AND NOT EXISTS (SELECT * FROM banned WHERE username = %L FOR UPDATE) FOR UPDATE;",
      nanoid(),
      base64url.decode(req.params.encodedmessage),
      req.params.locale,
      isLocal,
      response.locals.user,
      response.locals.user,
    ),
    (err) => {
      if (err) {
        logger.error(err);
        return;
      }
      response.send("message successfully send");
    },
  );
});

module.exports = router;
