const express = require("express");
const router = express.Router();
const format = require("pg-format");
const validator = require("validator");
const base64url = require("base64url");

const client = require("../db");
const logger = require("../utils/logger");
const auth = require("../utils/auth");

router.get("/:building/:buildingid/:newname", auth, (req, response) => {
  const newName = base64url.decode(req.params.newname);
  const building = req.params.building;
  if (
    (building !== "gold_mines" &&
      building !== "oil_fields" &&
      building !== "gas_plants" &&
      building !== "iron_mines") ||
    !validator.isLength(newName, { min: 1, max: 20 })
  ) {
    response.sendStatus(404);
    return;
  }

  client.query(
    format(
      "UPDATE %I SET mine_name = %L WHERE owner_username = %L AND building_id = %L;",
      building,
      newName,
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
          ? "factory name changed"
          : "you can not change building name",
      );
    },
  );
});

module.exports = router;
