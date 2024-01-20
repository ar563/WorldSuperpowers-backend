const express = require("express");
const router = express.Router();
const format = require("pg-format");

const client = require("../db");
const logger = require("../utils/logger");
const auth = require("../utils/auth");

router.get("/", auth, (req, response) => {
  client.query(
    format(
      "begin; WITH cte AS (UPDATE states SET political_system = 'democracy', leader = NULL where leader = %L and political_system = 'dictatorship' RETURNING *) SELECT 1 / COUNT(*) FROM cte; INSERT INTO votes (stateid, voting_start, voting_end, partyid) select states.stateid, now() + interval '12 hours', now() + interval '24 hours', array_agg(parties.partyid) from parties inner join states on parties.province = any(states.provinces) where leader = %L group by states.stateid; commit;",
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
