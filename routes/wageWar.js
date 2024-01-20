const express = require("express");
const router = express.Router();
const format = require("pg-format");
const { nanoid } = require("nanoid");

const pool = require("../db");
const logger = require("../utils/logger");
const auth = require("../utils/auth");

router.get("/:attacking_province/:target", auth, async (req, response) => {
  const client = await pool.getClient();

  try {
    await client.query("BEGIN");
    const res = await client.query(
      "SELECT * FROM provinces WHERE province_number = $1 AND $2 = ANY (borders) FOR UPDATE",
      [req.params.attacking_province, req.params.target],
    );
    if (res.rows?.length === 0) {
      await client.query("ROLLBACK");
      return;
    }
    await client.query("DELETE FROM wars WHERE attacking_province = $1", [
      req.params.attacking_province,
    ]);
    await client.query(
      format(
        "INSERT INTO wars (attacking_province, war_id, attackers_stateid, defenders_stateid, disputed_province, war_end) SELECT %L, %L, stateid, (SELECT stateid FROM states where %L = ANY(provinces) FOR UPDATE), %L, now() + interval '12 hours' from states where leader = %L AND %L = ANY(provinces) FOR UPDATE;",
        req.params.attacking_province,
        nanoid(),
        req.params.target,
        req.params.target,
        response.locals.user,
        req.params.attacking_province,
      ),
    );
    await client.query("COMMIT");
    response.send("success");
  } catch (e) {
    await client.query("ROLLBACK");
    logger.error(e);
    response.send({ message: "Error" }).status(500);
  } finally {
    client.release();
  }
});

module.exports = router;
