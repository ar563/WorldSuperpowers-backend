const express = require("express");
const router = express.Router();
const format = require("pg-format");

const client = require("../db");
const logger = require("../utils/logger");
const auth = require("../utils/auth");
const isPast = require("date-fns/isPast");

router.get("/:province", auth, (req, response) => {
  const province = parseInt(req.params.province);
  client.query(
    isPast(new Date(process.env.DAMAGE_BONUS_CHANGE_DEADLINE))
      ? format(
          "UPDATE profiles SET damage_bonus_province = %L WHERE username = %L AND damage_bonus_province IS NULL;",
          province,
          response.locals.user,
        )
      : format(
          "UPDATE profiles SET damage_bonus_province = %L WHERE username = %L;",
          province,
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
