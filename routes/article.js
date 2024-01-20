const express = require("express");
const router = express.Router();
const format = require("pg-format");

const client = require("../db");
const logger = require("../utils/logger");
const auth = require("../utils/auth");

router.get("/:articleid", (req, response) => {
  client.query(
    format(
      "SELECT * FROM articles WHERE articleid = %L;",
      req.params.articleid,
    ),
    (err, res) => {
      if (err || res.rows.length === 0) {
        err && logger.error(err);
        response.sendStatus(404);
        return;
      }
      response.send(res.rows[0]);
    },
  );
});

module.exports = router;
