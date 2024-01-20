const express = require("express");
const router = express.Router();
const validator = require("validator");

const pool = require("../db");
const logger = require("../utils/logger");
const auth = require("../utils/auth");

router.get("/:partyid", auth, async (req, res) => {
  const client = await pool.getClient();

  try {
    const partyID = req.params.partyid;
    if (
      !validator.isAscii(partyID) ||
      !validator.isByteLength(partyID, { min: 21, max: 21 })
    ) {
      res.sendStatus(404);
      return;
    }

    await client.query("BEGIN");

    const updateProfile = await client.query(
      "UPDATE profiles SET partyid = 'non-partisan' WHERE username = $1 AND partyid = $2;",
      [res.locals.user, partyID],
    );
    const updateParty = await client.query(
      "UPDATE parties SET current_members = current_members - 1 WHERE partyid = $1;",
      [partyID],
    );

    if (updateProfile.rowCount !== 1 || updateParty.rowCount !== 1) {
      throw new Error("Failed to update party and profile");
    }

    const deleteParty = await client.query(
      "DELETE FROM parties WHERE leader_username = $1;",
      [res.locals.user],
    );

    if (deleteParty.rowCount === 1) {
      await client.query(
        "UPDATE profiles SET partyid = 'non-partisan' WHERE partyid = $1;",
        [partyID],
      );
    }

    await client.query("COMMIT");

    res.send("Left the party");
  } catch (error) {
    await client.query("ROLLBACK");
    logger.error(error);
    res.sendStatus(500);
  } finally {
    client.release();
  }
});

module.exports = router;
