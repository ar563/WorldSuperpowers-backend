const express = require("express");
const router = express.Router();
const format = require("pg-format");

const client = require("../db");
const logger = require("../utils/logger");
const auth = require("../utils/auth");

router.get("/:fieldofstudy", auth, (req, response) => {
  const fieldOfStudy = req.params.fieldofstudy;
  if (
    fieldOfStudy !== "economic_education" &&
    fieldOfStudy !== "military_education" &&
    fieldOfStudy !== "political_education"
  ) {
    response.sendStatus(404);
    return;
  }

  client.query(
    format(
      "BEGIN; DELETE FROM study WHERE username = %L; INSERT INTO study (username, field_of_study, finish_time) SELECT %L, %L, interval '1 hour' * %I + now() FROM profiles WHERE username = %L AND %I < 100 FOR UPDATE; COMMIT;",
      response.locals.user,
      response.locals.user,
      fieldOfStudy,
      fieldOfStudy,
      response.locals.user,
      fieldOfStudy,
    ),
    (err, res) => {
      if (err) {
        logger.error(err);
        return;
      }
      response.send("success");
    },
  );
});

module.exports = router;
