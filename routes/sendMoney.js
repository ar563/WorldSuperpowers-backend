const express = require("express");
const router = express.Router();
const format = require("pg-format");

const client = require("../db");
const logger = require("../utils/logger");
const auth = require("../utils/auth");

router.get("/:recipient/:ammount", auth, (req, response) => {
  client.query(
    format(
      "BEGIN; UPDATE user_data SET interstellardobra = interstellardobra - %L WHERE username = %L; WITH cte AS (UPDATE user_data SET interstellardobra = interstellardobra + %L WHERE username = %L RETURNING *) SELECT 1 / COUNT(*) FROM cte; COMMIT;",
      req.params.ammount,
      response.locals.user,
      req.params.ammount,
      req.params.recipient,
    ),
    (err, res) => {
      if (err) {
        logger.error(err);
        return;
      }
      response.send("Success");
    },
  );
});

module.exports = router;
