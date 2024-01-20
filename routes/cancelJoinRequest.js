const express = require("express");
const router = express.Router();
const format = require("pg-format");
const validator = require("validator");

const client = require("../db");
const logger = require("../utils/logger");
const auth = require("../utils/auth");

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
      "DELETE FROM partyinvitations WHERE username = %L AND partyid = %L;",
      response.locals.user,
      req.params.partyid,
    ),
    (err) => {
      if (err) {
        logger.error(err);
        return;
      }
      response.send("request canceled");
    },
  );
});

module.exports = router;
