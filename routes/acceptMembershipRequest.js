const express = require("express");
const router = express.Router();
const format = require("pg-format");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const validator = require("validator");

const logger = require("../utils/logger");
const auth = require("../utils/auth");

const client = require("../db");

router.get("/:partyid/:username", auth, (req, response) => {
  const username = req.params.username;
  const partyID = req.params.partyid;
  if (
    !validator.isByteLength(partyID, { min: 21, max: 21 }) ||
    !validator.isAscii(partyID) ||
    !validator.isAlphanumeric(username)
  ) {
    response.sendStatus(404);
    return;
  }

  client.query(
    format(
      "BEGIN; WITH cte AS (UPDATE parties SET current_members = current_members + 1 WHERE partyid = %L AND leader_username = %L RETURNING *) SELECT 1 / COUNT(*) FROM cte; WITH cte AS (UPDATE profiles SET partyid = %L WHERE username = %L AND partyid = 'non-partisan' RETURNING *) SELECT 1 / COUNT(*) FROM cte; WITH cte AS (DELETE FROM partyinvitations WHERE username = %L AND partyid = %L RETURNING *) SELECT 1 / COUNT(*) FROM cte; COMMIT;",
      partyID,
      response.locals.user,
      partyID,
      response.locals.user,
      username,
      partyID,
    ),
    (err, res) => {
      if (err) {
        logger.error(err);
        return;
      }
      response.send("joined party");
    },
  );
});

module.exports = router;
