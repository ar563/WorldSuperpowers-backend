const express = require("express");
const router = express.Router();
const format = require("pg-format");

const client = require("../db");
const logger = require("../utils/logger");
const auth = require("../utils/auth");

router.get("/:locale", (req, response) => {
  client.query(
    format(
      "SELECT * FROM articles WHERE locale = %L OR islocal = false;",
      req.params.locale,
    ),
    (err, res) => {
      if (err) {
        logger.error(err);
        response.sendStatus(500);
        return;
      }
      response.send(res.rows);
    },
  );
});

module.exports = router;
