const express = require("express");
const router = express.Router();
const format = require("pg-format");
const { nanoid } = require("nanoid");

const client = require("../db");
const logger = require("../utils/logger");
const auth = require("../utils/auth");

router.get("/:building/:building_id", auth, (req, response) => {
  const building = req.params.building;
  if (
    building !== "gold_mines" &&
    building !== "oil_fields" &&
    building !== "gas_plants" &&
    building !== "iron_mines"
  ) {
    response.sendStatus(404);
    return;
  }
  client.query(
    format(
      "UPDATE gold_mines SET current_workers = current_workers - 1 WHERE building_id = (SELECT building_id FROM working WHERE username = %L FOR UPDATE); UPDATE oil_fields SET current_workers = current_workers - 1 WHERE building_id = (SELECT building_id FROM working WHERE username = %L FOR UPDATE); UPDATE gas_plants SET current_workers = current_workers - 1 WHERE building_id = (SELECT building_id FROM working WHERE username = %L FOR UPDATE); UPDATE iron_mines SET current_workers = current_workers - 1 WHERE building_id = (SELECT building_id FROM working WHERE username = %L FOR UPDATE); DELETE FROM working WHERE username = %L; BEGIN; WITH cte AS (UPDATE %I SET current_workers = current_workers + 1 WHERE building_id = %L RETURNING *) SELECT 1 / COUNT(*) FROM cte; INSERT INTO working (username, building_id, building_type, workplace_id) VALUES(%L, %L, %L, %L); COMMIT;",
      response.locals.user,
      response.locals.user,
      response.locals.user,
      response.locals.user,
      response.locals.user,
      building,
      req.params.building_id,
      response.locals.user,
      req.params.building_id,
      building,
      nanoid(),
    ),
    (err) => {
      if (err) {
        logger.error(err);
        return;
      }
      response.send("success");
    },
  );
});

module.exports = router;
