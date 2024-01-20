const express = require("express");
const router = express.Router();
const { nanoid } = require("nanoid");

const pool = require("../db");
const auth = require("../utils/auth");
const logger = require("../utils/logger");

router.post("/", auth, async (req, res) => {
  const username = res.locals.user;
  const id = req.body.articleid;

  if (!id) {
    return res.status(400).send("no id");
  }

  const client = await pool.getClient();

  try {
    await client.query("BEGIN");
    const existingUpvote = await client.query(
      "SELECT * FROM upvotes WHERE username = $1 AND articleid = $2 FOR UPDATE",
      [username, id],
    );
    if (existingUpvote.rows.length > 0) {
      await client.query("ROLLBACK");
      res.status(403).send({ message: "User has already upvoted" });
      return;
    }
    const upvoteid = nanoid();
    await client.query(
      "INSERT INTO upvotes (articleid, username, upvote, upvoteid) VALUES ($1, $2, $3, $4)",
      [id, username, true, upvoteid],
    );
    const result = await client.query(
      "UPDATE articles SET upvotes = upvotes + 1 WHERE articleid = $1 RETURNING upvotes",
      [id],
    );
    const upvotes = result.rows[0].upvotes;
    await client.query("COMMIT");
    res.send({ message: "Article upvoted!", upvotes, upvoteid });
  } catch (e) {
    await client.query("ROLLBACK");
    logger.error(e);
    res.send({ message: "Error adding upvote" });
  } finally {
    client.release();
  }
});

module.exports = router;
