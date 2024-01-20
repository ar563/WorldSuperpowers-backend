const express = require("express");
const router = express.Router();
const format = require("pg-format");
const validator = require("validator");

const client = require("../db");
const logger = require("../utils/logger");
const auth = require("../utils/auth");

router.get("/:partyid", auth, (req, response) => {
  const partyID = req.params.partyid;
  if (
    !validator.isAscii(partyID) ||
    !validator.isByteLength(partyID, { min: 21, max: 21 })
  ) {
    response.sendStatus(404);
    return;
  }

  client.query(
    format(
      "BEGIN; WITH cte AS (UPDATE parties SET current_members = current_members + 1 WHERE partyid = %L AND invitation_only = false AND province = (SELECT province FROM profiles WHERE username = %L FOR UPDATE) RETURNING *) SELECT 1 / COUNT(*) FROM cte; WITH cte AS (UPDATE profiles SET partyid = %L WHERE username = %L RETURNING *) SELECT 1 / COUNT(*) FROM cte; COMMIT;",
      partyID,
      response.locals.user,
      partyID,
      response.locals.user,
    ),
    (err) => {
      if (err) {
        logger.error(err);
        return;
      }
      response.send("joined party");
    },
  );
});

module.exports = router;
