const express = require("express");
const router = express.Router();
const format = require("pg-format");

const client = require("../db");
const logger = require("../utils/logger");
const auth = require("../utils/auth");

router.get("/:law_id/:currentVote/:vote", auth, (req, response) => {
  const voteOptions = ["voted_yes", "voted_no", "voted_abstain", "not_voted"];
  if (
    !voteOptions.includes(req.params.vote) ||
    !voteOptions.includes(req.params.currentVote) ||
    req.params.vote === "not_voted"
  )
    return;

  client.query(
    format(
      "UPDATE pending_laws SET %I = array_append(%I, %L), %I = array_remove(%I, %L) where %L = any(%I) and law_id = %L and voting_end > now();",
      req.params.vote,
      req.params.vote,
      response.locals.user,
      req.params.currentVote,
      req.params.currentVote,
      response.locals.user,
      response.locals.user,
      req.params.currentVote,
      req.params.law_id,
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
