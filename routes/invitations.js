const express = require("express");
const router = express.Router();
const format = require("pg-format");

const client = require("../db");
const logger = require("../utils/logger");

router.get("/:partyid", (req, response) => {
  client.query(
    format(
      "SELECT * FROM partyinvitations WHERE partyid = %L;",
      req.params.partyid,
    ),
    (err, res) => {
      if (err || res.rows.length === 0) {
        err && logger.error(err);
        response.sendStatus(404);
        return;
      }
      response.send(res.rows.map((row) => row.username));
    },
  );
});

module.exports = router;
