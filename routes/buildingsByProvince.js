const express = require("express");
const router = express.Router();
const format = require("pg-format");

const client = require("../db");
const logger = require("../utils/logger");

router.get("/:buildingprovince/:buildingtype", (req, response) => {
  const buildingType = req.params.buildingtype;
  if (
    buildingType !== "gold_mines" &&
    buildingType !== "oil_fields" &&
    buildingType !== "gas_plants" &&
    buildingType !== "iron_mines"
  ) {
    response.sendStatus(404);
    return;
  }
  client.query(
    format(
      "SELECT * FROM %I WHERE province = %L",
      buildingType,
      req.params.buildingprovince,
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
