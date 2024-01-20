const express = require("express");
const router = express.Router();
const format = require("pg-format");
const { nanoid } = require("nanoid");
const base64url = require("base64url");
const validator = require("validator");

const client = require("../db");
const logger = require("../utils/logger");
const auth = require("../utils/auth");

router.get("/:building/:buildingname", auth, (req, response) => {
  const buildingType = req.params.building;
  const buildingName = base64url.decode(req.params.buildingname);
  const price =
    buildingType === "gold_mines"
      ? 100
      : buildingType === "oil_fields"
        ? 80
        : buildingType === "gas_plants"
          ? 50
          : 40;
  const isValidBuildingType =
    buildingType === "gold_mines" ||
    buildingType === "oil_fields" ||
    buildingType === "gas_plants" ||
    buildingType === "iron_mines";

  if (
    !isValidBuildingType ||
    !validator.isLength(buildingName, { min: 1, max: 20 })
  ) {
    response.sendStatus(404);
    return;
  }

  client.query(
    format(
      "BEGIN; INSERT INTO %I (mine_name, owner_username, building_id, province, profit_multiplier) select %L, %L, %L, province, %I + economic_education FROM profiles INNER JOIN provinces ON profiles.province = provinces.province_number WHERE username = %L FOR UPDATE; UPDATE user_data SET gold = gold - %L WHERE username = %L; COMMIT;",
      buildingType,
      buildingName,
      response.locals.user,
      nanoid(),
      buildingType.split("_")[0],
      response.locals.user,
      price,
      response.locals.user,
    ),
    (err) => {
      if (err) {
        logger.error(err);
        return;
      }
      response.send("building created");
    },
  );
});

module.exports = router;
