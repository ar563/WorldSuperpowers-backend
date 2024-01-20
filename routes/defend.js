const express = require("express");
const router = express.Router();
const format = require("pg-format");

const client = require("../db");
const logger = require("../utils/logger");
const auth = require("../utils/auth");

router.get("/:war_id/:attacking_province/:target", auth, (req, response) => {
  client.query(
    format(
      "begin; WITH cte AS (update user_data set ammo = ammo - 40, grenades = grenades - 2, can_fight_from = now() + interval '10 minutes' where riffles >= 1 and can_fight_from < now() and username = %L RETURNING *) SELECT 1 / COUNT(*) FROM cte; WITH cte AS (UPDATE wars set score = score - (SELECT CASE when damage_bonus_province = %L then military_education * 10000 else military_education * 1000 end from profiles where province = %L and username = %L for update) where attacking_province = %L and disputed_province = %L and war_id = %L RETURNING *) SELECT 1 / COUNT(*) FROM cte; commit;",
      response.locals.user,
      req.params.attacking_province,
      req.params.target,
      response.locals.user,
      req.params.attacking_province,
      req.params.target,
      req.params.war_id,
    ),
    (err) => {
      if (err) {
        logger.error(err);
        return;
      }
      response.send("success");
    },
  );
});

module.exports = router;
