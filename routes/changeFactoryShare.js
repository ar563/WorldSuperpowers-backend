const express = require("express");
const router = express.Router();
const format = require("pg-format");

const client = require("../db");
const logger = require("../utils/logger");
const auth = require("../utils/auth");

router.get("/:building/:buildingid/:newshare", auth, (req, response) => {
  const newShare = parseInt(req.params.newshare);
  const building = req.params.building;
  const isValidBuildingType =
    building !== "gold_mines" &&
    building !== "oil_fields" &&
    building !== "gas_plants" &&
    building !== "iron_mines";
  if (isValidBuildingType || typeof newShare !== "number") {
    response.sendStatus(404);
    return;
  }

  client.query(
    format(
      "UPDATE %I SET owner_profit_share = %L WHERE owner_username = %L AND building_id = %L;",
      building,
      newShare,
      response.locals.user,
      req.params.buildingid,
    ),
    (err, res) => {
      if (err) {
        logger.error(err);
        return;
      }
      response.send(
        res.rowCount === 1
          ? "factory owner share changed"
          : "you can not change owner share",
      );
    },
  );
});

module.exports = router;
