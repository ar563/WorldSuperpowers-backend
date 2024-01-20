const express = require("express");
const router = express.Router();
const format = require("pg-format");

const client = require("../db");
const logger = require("../utils/logger");
const auth = require("../utils/auth");

router.get("/:username", auth, (req, response) => {
  if (response.locals.user === req.params.username) {
    response.sendStatus(403);
    return;
  }
  client.query(
    format(
      "BEGIN; WITH cte AS (UPDATE profiles SET partyid = 'non-partisan' WHERE username = %L AND partyid = (SELECT partyid FROM parties WHERE leader_username = %L FOR UPDATE) RETURNING *) SELECT 1 / COUNT(*) FROM cte; WITH cte AS (UPDATE parties SET current_members = current_members - 1 WHERE leader_username = %L RETURNING *) SELECT 1 / COUNT(*) FROM cte; COMMIT;",
      req.params.username,
      response.locals.user,
      response.locals.user,
    ),
    (err) => {
      if (err) {
        logger.error(err);
        return;
      }
      response.send("kicked from party");
    },
  );
});

module.exports = router;
