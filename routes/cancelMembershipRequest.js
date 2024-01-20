const express = require("express");
const router = express.Router();
const format = require("pg-format");
const validator = require("validator");

const client = require("../db");
const logger = require("../utils/logger");
const auth = require("../utils/auth");

router.get("/:username", auth, (req, response) => {
  const username = req.params.username;
  if (!validator.isAlphanumeric(username)) {
    response.sendStatus(404);
    return;
  }

  client.query(
    format(
      "DELETE FROM partyinvitations WHERE partyid = (SELECT partyid FROM parties WHERE leader_username = %L FOR UPDATE) AND username = %L;",
      response.locals.user,
      username,
    ),
    (err) => {
      if (err) {
        logger.error(err);
        return;
      }
      response.send("invitation canceled");
    },
  );
});

module.exports = router;
