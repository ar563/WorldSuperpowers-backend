const express = require("express");
const router = express.Router();
const format = require("pg-format");

const client = require("../db");
const logger = require("../utils/logger");

router.get("/:province", (req, response) => {
  client.query(
    format("SELECT * FROM parties WHERE province = %L;", req.params.province),
    (err, res) => {
      if (err) {
        logger.error(err);
        return;
      }
      response.send(res.rows);
    },
  );
});

module.exports = router;
