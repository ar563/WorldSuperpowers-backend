const express = require("express");
const router = express.Router();
const format = require("pg-format");
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

  client.query(
    format(
      "UPDATE parties SET party_name = %L WHERE leader_username = %L;",
      partyName,
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
