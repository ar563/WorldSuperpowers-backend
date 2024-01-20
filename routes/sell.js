const express = require("express");
const router = express.Router();
const format = require("pg-format");

const pool = require("../db");
const logger = require("../utils/logger");
const auth = require("../utils/auth");

const calculateSell = ({ initCash, initAsset, initBalance, ammount }) => {
  let balance = parseInt(initBalance);
  const fee = Math.ceil(ammount * (3 / 1000));
  let asset = parseInt(initAsset) + ammount - fee;
  const cash = Math.ceil(balance / asset);
  asset += fee;
  const profit = initCash - cash;
  balance = asset * cash;
  return { profit, asset, cash, balance };
};

router.get("/:asset/:ammount", auth, async (req, response) => {
  const ammount = parseInt(req.params.ammount);

  if (
    req.params.asset !== "gas" &&
    req.params.asset !== "iron" &&
    req.params.asset !== "gold" &&
    req.params.asset !== "oil"
  ) {
    response.send("wrong asset name").status(404);
    return;
  }

  const client = await pool.getClient();

  try {
    await client.query("BEGIN");
    const res = await client.query(
      format("SELECT * FROM markets WHERE asset_name = %L;", req.params.asset),
    );
    if (res.rows?.length === 0) {
      await client.query("ROLLBACK");
      response.sendStatus(404);
      return;
    }
    const { profit, asset, cash, balance } = calculateSell({
      initCash: res.rows[0].cash,
      initAsset: res.rows[0].asset,
      initBalance: res.rows[0].balance,
      ammount,
    });
    await client.query(
      format(
        "UPDATE user_data SET interstellardobra = interstellardobra + %L, %I = %I - %L WHERE username = %L;",
        profit,
        req.params.asset,
        req.params.asset,
        ammount,
        response.locals.user,
      ),
    );
    await client.query(
      format(
        "WITH cte AS (UPDATE markets SET asset = %L, cash = %L, balance = %L WHERE asset_name = %L RETURNING *) SELECT 1 / COUNT(*) FROM cte;",
        asset,
        cash,
        balance,
        req.params.asset,
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
