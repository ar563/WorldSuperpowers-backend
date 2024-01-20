const express = require("express");
const router = express.Router();
const format = require("pg-format");
const validator = require("validator").default;
const base64url = require("base64url");

const client = require("../db");
const logger = require("../utils/logger");
const auth = require("../utils/auth");

router.get("/:newStateName", auth, (req, response) => {
  const stateName = base64url.decode(req.params.newStateName);
  if (
    !validator.isLength(stateName, { min: 1, max: 20 }) ||
    !validator.isAscii(stateName)
  ) {
    response.sendStatus(400);
    return;
  }

  client.query(
    format(
      "UPDATE states SET state_name = %L WHERE leader = %L;",
      stateName,
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
