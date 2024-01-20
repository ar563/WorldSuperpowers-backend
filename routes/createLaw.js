const express = require("express");
const router = express.Router();
const format = require("pg-format");
const { nanoid } = require("nanoid");
const listOfLaws = require("../utils/listOfLaws");

const client = require("../db");
const logger = require("../utils/logger");
const auth = require("../utils/auth");

router.get("/:law", auth, (req, response) => {
  if (!listOfLaws.includes(req.params.law)) return;

  client.query(
    format(
      "INSERT INTO pending_laws (law_id, stateid, proposer, law, voting_end, not_voted) SELECT %L, stateid, %L, %L, now() + interval '6 hours', members_of_parliament from states where %L = any(members_of_parliament) or leader = %L and not exists (select * from pending_laws where proposer = %L for update) and political_system = 'democracy' for update;",
      nanoid(),
      response.locals.user,
      req.params.law,
      response.locals.user,
      response.locals.user,
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
