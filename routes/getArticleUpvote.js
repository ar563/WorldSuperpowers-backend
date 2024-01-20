const express = require("express");
const router = express.Router();
const format = require("pg-format");

const pool = require("../db");
const logger = require("../utils/logger");

router.get("/:articleid", async (req, response) => {
  const client = await pool.getClient();

  try {
    const result = await client.query(
      "SELECT * FROM upvotes WHERE articleid = $1;",
      [req.params.articleid],
    );
    if (result.rows.length === 0) {
      response.sendStatus(404);
      return;
    }
    response.send(result.rows);
  } catch (err) {
    logger.error(err);
    res.status(500).send({ message: "Internal Server Error" });
  } finally {
    client.release();
  }
});

module.exports = router;
