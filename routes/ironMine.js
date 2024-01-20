const express = require("express");
const router = express.Router();
const format = require("pg-format");

const client = require("../db");
const logger = require("../utils/logger");

router.get("/:ironmineid", (req, response) => {
  client.query(
    format(
      "SELECT * FROM iron_mines WHERE building_id = %L",
      req.params.ironmineid,
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
