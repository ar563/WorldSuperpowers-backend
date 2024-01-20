const express = require("express");
const router = express.Router();
const format = require("pg-format");

const client = require("../db");
const logger = require("../utils/logger");
const auth = require("../utils/auth");

router.get("/:item/:ammount", auth, (req, response) => {
  const ammount = parseInt(req.params.ammount);
  if (
    ammount < 1 ||
    (req.params.item !== "riffles" &&
      req.params.item !== "ammo" &&
      req.params.item !== "grenades")
  ) {
    response.sendStatus(404);
    return;
  }
  const price =
    req.params.item === "riffles"
      ? 1000 * ammount
      : req.params.item === "ammo"
        ? 1 * ammount
        : 10 * ammount;

  client.query(
    format(
      "UPDATE user_data SET iron = iron - %L, %I = %I + %L WHERE username = %L AND iron > %L;",
      price,
      req.params.item,
      req.params.item,
      ammount,
      response.locals.user,
      price,
    ),
    (err, res) => {
      if (err || res.rowCount === 0) {
        err && logger.error(err);
        res.rowCount === 0 && response.sendStatus(404);
        return;
      }
      response.send("weapons crafted");
    },
  );
});

module.exports = router;
