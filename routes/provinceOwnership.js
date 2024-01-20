const express = require("express");
const router = express.Router();
const format = require("pg-format");

const client = require("../db");
const logger = require("../utils/logger");

router.get("/:province", (req, response) => {
  client.query(
    format(
      "SELECT * FROM states WHERE %L = ANY(provinces);",
      req.params.province,
    ),
    (err, res) => {
      if (err || res.rows.length === 0) {
        err && logger.error(err);
        response.send(404);
        return;
      }
      response.send(
        res.rows.filter((state) =>
          state.provinces.includes(parseInt(req.params.province)),
        )[0],
      );
    },
  );
});

module.exports = router;
