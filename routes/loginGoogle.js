const express = require("express");
const { nanoid } = require("nanoid");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const admin = require("firebase-admin");

const pool = require("../db");
const privateData = require("../private");
const logger = require("../utils/logger");
const serviceAccount = require("../private/firebase-admin.json");

const router = express.Router();

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const generateJwtToken = async ({ dbClient, userId, name }) => {
  try {
    await dbClient.query("BEGIN");
    const loginData = await dbClient.query(
      "SELECT * FROM google_login_data WHERE google_id = $1 FOR UPDATE;",
      [userId],
    );
    let username = loginData.rows[0]?.username;

    if (loginData.rows.length === 0) {
      username = nanoid();
      await dbClient.query(
        "INSERT INTO google_login_data (google_id, username) VALUES ($1, $2);",
        [userId, username],
      );
      await dbClient.query("INSERT INTO user_data (username) VALUES ($1);", [
        username,
      ]);
      await dbClient.query(
        "INSERT INTO profiles (nickname, username) VALUES ($1, $2);",
        [name, username],
      );
    }

    await dbClient.query("COMMIT");

    return new Promise((resolve, reject) => {
      fs.readFile(privateData.filePath, (err, data) => {
        if (err) {
          reject(err);
          return;
        }

        const authToken = jwt.sign(
          { user: username },
          privateData.passphrase(data),
        );
        resolve(authToken);
      });
    });
  } catch (error) {
    await dbClient.query("ROLLBACK");
    throw new Error(`Failed to generate JWT token: ${error}`);
  }
};

const sendJwtToken = async ({ token, dbClient, res }) => {
  const { uid } = await admin.auth().verifyIdToken(token);
  const { displayName } = await admin.auth().getUser(uid);

  const authToken = await generateJwtToken({
    dbClient,
    userId: uid,
    name: displayName,
  });
  res.json({ jwt: authToken });
};

// verify google PC token
router.post("/pc/verify_google_token", async (req, res) => {
  const dbClient = await pool.getClient();

  try {
    const { token } = req.body;

    await sendJwtToken({ token, dbClient, res });
  } catch (error) {
    logger.error("Token verification error:", error);
    res
      .status(500)
      .json({ error: "Failed to sign in with Google (PC platform)" });
  } finally {
    dbClient.release();
  }
});

// verify google mobile token
router.post("/mobile/verify_google_token", async (req, res) => {
  const dbClient = await pool.getClient();

  try {
    const { token } = req.body;

    await sendJwtToken({ token, dbClient, res });
  } catch (error) {
    logger.error("Token verification error:", error);
    res
      .status(500)
      .json({ error: "Failed to sign in with Google (mobile platform)" });
  } finally {
    dbClient.release();
  }
});

module.exports = router;
