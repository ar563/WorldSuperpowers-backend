const express = require("express");
const router = express.Router();
const format = require("pg-format");

const client = require("../db");

router.get("/:verificationcode", (req, response) => {
  client.query(
    format(
      "UPDATE login_data SET isemailverified = true WHERE verification_code = %L;",
      req.params.verificationcode,
    ),
    (err, res) => {
      if (err) {
        response.sendStatus(403);
        return;
      }
      response.send("user verified");
    },
  );
});

module.exports = router;
