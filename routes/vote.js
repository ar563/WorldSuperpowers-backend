const express = require("express");
const router = express.Router();
const format = require("pg-format");

const client = require("../db");
const logger = require("../utils/logger");
const auth = require("../utils/auth");

router.get("/:partyid", auth, (req, response) => {
  client.query(
    format(
      "update votes set vote_count[subquery.array_position] = vote_count[subquery.array_position] + 1, users_who_voted = array_append(users_who_voted, %L) from (select array_position(partyid, %L) from votes where stateid = (select stateid from states inner join profiles on profiles.citizenship = any(states.provinces) where username = %L and now() > profiles.date_of_citizenship + interval '1 hours' * 24 for update) for update) as subquery where %L = any(partyid) and stateid = (select stateid from states inner join profiles on profiles.citizenship = any(states.provinces) where username = %L and now() > profiles.date_of_citizenship + interval '1 hours' * 24 for update) and now() between voting_start and voting_end and not %L = any(users_who_voted); update votes set vote_count[subquery.array_position] = 1, users_who_voted = array_append(users_who_voted, %L) from (select array_position(partyid, %L) from votes where stateid = (select stateid from states inner join profiles on profiles.citizenship = any(states.provinces) where username = %L and now() > profiles.date_of_citizenship + interval '1 hours' * 24 for update) for update) as subquery where %L = any(partyid) and stateid = (select stateid from states inner join profiles on profiles.citizenship = any(states.provinces) where username = %L and now() > profiles.date_of_citizenship + interval '1 hours' * 24 for update) and now() between voting_start and voting_end and users_who_voted is null and vote_count is null;",
      response.locals.user,
      req.params.partyid,
      response.locals.user,
      req.params.partyid,
      response.locals.user,
      response.locals.user,
      response.locals.user,
      req.params.partyid,
      response.locals.user,
      req.params.partyid,
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
