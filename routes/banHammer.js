const express = require("express");
const router = express.Router();
const format = require("pg-format");

const client = require("../db");
const logger = require("../utils/logger");
const auth = require("../utils/auth");

router.get("/:username", auth, (req, response) => {
  if (response.locals.user !== "admin") {
    response.sendStatus(403);
    return;
  }
  client.query(
    format(
      "DELETE FROM chat_global WHERE username = %L; DELETE FROM articles WHERE username = %L; INSERT INTO banned VALUES (%L);",
      req.params.username,
      req.params.username,
      req.params.username,
    ),
    (err) => {
      if (err) {
        logger.error(err);
        return;
      }
      response.send("user successfully banned");
    },
  );
});

module.exports = router;
