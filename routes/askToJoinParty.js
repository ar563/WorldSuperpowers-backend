const express = require("express");
const router = express.Router();
const format = require("pg-format");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const validator = require("validator");

const logger = require("../utils/logger");
const auth = require("../utils/auth");

const client = require("../db");

router.get("/:partyid", auth, (req, response) => {
  if (
    !validator.isAscii(req.params.partyid) ||
    !validator.isByteLength(req.params.partyid, { min: 21, max: 21 })
  ) {
    response.sendStatus(404);
    return;
  }

  client.query(
    format(
      "INSERT INTO partyinvitations (partyid, username) VALUES (%L, %L);",
      req.params.partyid,
      response.locals.user,
    ),
    (err) => {
      if (err) {
        logger.error(err);
        return;
      }
      response.send("added to wait list");
    },
  );
});

module.exports = router;
