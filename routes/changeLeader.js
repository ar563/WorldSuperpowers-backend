const express = require("express");
const router = express.Router();
const format = require("pg-format");

const client = require("../db");
const logger = require("../utils/logger");

router.get("/:newleader", (req, response) => {
  client.query(
    format(
      "UPDATE parties SET leader_username = %L WHERE leader_username = %L;",
      req.params.newleader,
    ),
    (err) => {
      if (err) {
        logger.error(err);
        return;
      }
      response.send("leader changed");
    },
  );
});

module.exports = router;
