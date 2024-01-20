const express = require("express");
const router = express.Router();
const format = require("pg-format");
const { nanoid } = require("nanoid");
const base64url = require("base64url");
const validator = require("validator");

const client = require("../db");
const logger = require("../utils/logger");
const auth = require("../utils/auth");

router.get("/:partynameencoded", auth, (req, response) => {
  const partyName = base64url.decode(req.params.partynameencoded);
  if (
    !validator.isLength(partyName, { min: 1, max: 20 }) ||
    !validator.isAscii(partyName)
  ) {
    response.sendStatus(400);
    return;
  }

  const partyID = nanoid();
  client.query(
    format(
      "BEGIN; INSERT INTO parties (partyid, party_name, leader_username, province, max_members) SELECT %L, %L, %L, province, political_education + 20 FROM profiles WHERE username = %L for update; WITH cte AS (UPDATE profiles SET partyid = %L WHERE username = %L AND partyid = 'non-partisan' RETURNING *) SELECT 1 / COUNT(*) FROM cte; UPDATE user_data SET gold = gold - 5 WHERE username = %L;",
      partyID,
      partyName,
      response.locals.user,
      response.locals.user,
      partyID,
      response.locals.user,
      response.locals.user,
    ),
    (err, res) => {
      if (err) {
        logger.error(err);
        return;
      }
      response.send({ partyID });
    },
  );
});

module.exports = router;
