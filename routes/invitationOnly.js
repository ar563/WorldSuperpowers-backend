const express = require("express");
const router = express.Router();
const format = require("pg-format");

const client = require("../db");
const logger = require("../utils/logger");
const auth = require("../utils/auth");

router.get("/:invitationonly", auth, (req, response) => {
  const invitationOnly = req.params.invitationonly;
  if (invitationOnly !== "true" && invitationOnly !== "false") {
    response.sendStatus(404);
    return;
  }

  client.query(
    format(
      "UPDATE parties SET invitation_only = %L WHERE leader_username = %L;",
      invitationOnly,
      response.locals.user,
    ),
    (err) => {
      if (err) {
        logger.error(err);
        return;
      }
      response.send("invitation settings changed");
    },
  );
});

module.exports = router;
