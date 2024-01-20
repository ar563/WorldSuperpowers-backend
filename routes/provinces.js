const express = require("express");
const router = express.Router();

const client = require("../db");
const logger = require("../utils/logger");

router.get("/", (req, response) => {
  client.query("SELECT * FROM provinces;", (err, res) => {
    if (err || res.rows.length === 0) {
      err && logger.error(err);
      response.sendStatus(404);
      return;
    }
    response.send(res.rows);
  });
});

module.exports = router;
