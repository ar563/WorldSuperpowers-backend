const express = require("express");
const router = express.Router();
const format = require("pg-format");

const client = require("../db");
const logger = require("../utils/logger");
const auth = require("../utils/auth");

router.get("/", auth, (req, response) => {
  client.query(
    format(
      "UPDATE gold_mines SET current_workers = current_workers - 1 WHERE building_id = (SELECT building_id FROM working WHERE username = %L FOR UPDATE); UPDATE oil_fields SET current_workers = current_workers - 1 WHERE building_id = (SELECT building_id FROM working WHERE username = %L FOR UPDATE); UPDATE gas_plants SET current_workers = current_workers - 1 WHERE building_id = (SELECT building_id FROM working WHERE username = %L FOR UPDATE); UPDATE iron_mines SET current_workers = current_workers - 1 WHERE building_id = (SELECT building_id FROM working WHERE username = %L FOR UPDATE); DELETE FROM working WHERE username = %L;",
      response.locals.user,
      response.locals.user,
      response.locals.user,
      response.locals.user,
      response.locals.user,
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
