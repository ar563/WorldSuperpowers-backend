const express = require("express");
const router = express.Router();
const format = require("pg-format");

const pool = require("../db");
const logger = require("../utils/logger");
const auth = require("../utils/auth");

const calculateBuy = ({ initCash, initAsset, initBalance, ammount }) => {
  let cash = parseInt(initCash);
  const asset = initAsset - ammount;
  let balance = initBalance;
  let cost = Math.ceil(balance / asset - cash);
  const fee = Math.ceil(cost * (3 / 1000));
  cost += fee;
  cash += cost;
  balance = asset * cash;
  return { cost, asset, cash, balance };
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
    const { cost, asset, cash, balance } = calculateBuy({
      initCash: res.rows[0].cash,
      initAsset: res.rows[0].asset,
      initBalance: res.rows[0].balance,
      ammount,
    });
    await client.query(
      format(
        "UPDATE user_data SET interstellardobra = interstellardobra - %L, %I = %I + %L WHERE username = %L;",
        cost,
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
