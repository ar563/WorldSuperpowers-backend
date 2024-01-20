const express = require("express");
const router = express.Router();
const format = require("pg-format");

const client = require("../db");
const logger = require("../utils/logger");
const auth = require("../utils/auth");

router.get("/:province", auth, async (req, response) => {
  try {
    const province = parseInt(req.params.province);

    await client.query("BEGIN");

    await client.query(
      format(
        "UPDATE user_data SET oil = oil - %L WHERE username = %L;",
        process.env.TRAVEL_OIL_USAGE,
        response.locals.user,
      ),
    );

    await client.query(
      format(
        "UPDATE profiles SET province = %L WHERE username = %L;",
        province,
        response.locals.user,
      ),
    );

    await client.query("COMMIT");

    response.send("success");
  } catch (err) {
    logger.error(err);
    await client.query("ROLLBACK");
    response.status(500).send("Error occurred.");
  }
});

module.exports = router;
