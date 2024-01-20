const express = require("express");
const router = express.Router();

const pool = require("../db");
const auth = require("../utils/auth");
const logger = require("../utils/logger");

router.delete("/:upvoteid", auth, async (req, res) => {
  const upvoteId = req.params.upvoteid;
  const username = res.locals.user;
  const client = await pool.getClient();

  try {
    await client.query("BEGIN");
    const existingUpvoteQuery = "SELECT * FROM upvotes WHERE upvoteid = $1";
    const existingUpvoteResult = await client.query(existingUpvoteQuery, [
      upvoteId,
    ]);
    if (existingUpvoteResult.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).send({ message: "Upvote not found" });
    }
    const result1 = await client.query(
      "DELETE FROM upvotes WHERE upvoteid = $1 AND username = $2 RETURNING articleid",
      [upvoteId, username],
    );
    const result2 = await client.query(
      "UPDATE articles SET upvotes = upvotes - 1 WHERE articleid = $1 RETURNING upvotes",
      [result1.rows[0].articleid],
    );
    await client.query("COMMIT");
    res.status(200).send({
      message: "Article upvote deleted!",
      upvotes: result2.rows[0].upvotes,
    });
  } catch (err) {
    await client.query("ROLLBACK");
    logger.error(err);
    res.status(500).send({ message: "Internal Server Error" });
  } finally {
    client.release();
  }
});

module.exports = router;
