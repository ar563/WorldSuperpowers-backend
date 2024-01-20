const express = require("express");
const router = express.Router();
const format = require("pg-format");
const bodyParser = require("body-parser");

const client = require("../db");
const logger = require("../utils/logger");
const auth = require("../utils/auth");

const jsonParser = bodyParser.json();

router.delete("/", auth, jsonParser, (req, response) => {
  if (typeof req.body.id !== "string") return;
  client.query(
    format(
      "DELETE FROM articles WHERE username = %L AND articleid = %L;",
      response.locals.user,
      req.body.id,
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
