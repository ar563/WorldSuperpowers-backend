const express = require("express");
const router = express.Router();
const format = require("pg-format");

const client = require("../db");
const logger = require("../utils/logger");
const auth = require("../utils/auth");

router.get("/", auth, (req, response) => {
  client.query(
    format("SELECT * FROM study WHERE username = %L;", response.locals.user),
    (err, res) => {
      if (err) {
        logger.error(err);
        return;
      }
      if (res.rows.length === 0) {
        response.send("not studying");
        return;
      }
      response.send(res.rows[0]);
    },
  );
});

module.exports = router;
