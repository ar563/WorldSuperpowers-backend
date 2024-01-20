const express = require("express");
const router = express.Router();
const format = require("pg-format");

const client = require("../db");
const logger = require("../utils/logger");
const auth = require("../utils/auth");

router.get("/:stateid", (req, response) => {
  client.query(
    format(
      "SELECT * FROM wars WHERE attackers_stateid = %L OR defenders_stateid = %L;",
      req.params.stateid,
      req.params.stateid,
    ),
    (err, res) => {
      if (err || res.rows.length === 0) {
        err && logger.error(err);
        response.sendStatus(404);
        return;
      }
      response.send(res.rows);
    },
  );
});

module.exports = router;
