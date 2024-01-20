const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");
const rfs = require("rotating-file-stream");
const http = require("http");
const { isEqual } = require("underscore");
const format = require("pg-format");
const logger = require("./utils/logger");
const { Server } = require("socket.io");

const userProfile = require("./routes/profile");
const gasPlant = require("./routes/gasPlant");
const goldMine = require("./routes/goldMine");
const ironMine = require("./routes/ironMine");
const oilField = require("./routes/oilField");
const province = require("./routes/province");
const provinces = require("./routes/provinces");
const state = require("./routes/state");
const register = require("./routes/register");
const login = require("./routes/login");
const create = require("./routes/create");
const work = require("./routes/work");
const userdata = require("./routes/userData");
const buildingsByProvince = require("./routes/buildingsByProvince");
const postToChat = require("./routes/postToChat");
const uploadAvatar = require("./routes/uploadAvatar");
const checkEmployment = require("./routes/checkEmployment");
const unban = require("./routes/unban");
const banHammer = require("./routes/banHammer");
const study = require("./routes/study");
const checkStudy = require("./routes/checkStudy");
const sendMoney = require("./routes/sendMoney");
const createParty = require("./routes/createParty");
const joinParty = require("./routes/joinParty");
const kickFromParty = require("./routes/kickFromParty");
const leaveParty = require("./routes/leaveParty");
const askToJoinParty = require("./routes/askToJoinParty");
const partiesByProvince = require("./routes/partiesByProvince");
const acceptMembershipRequest = require("./routes/acceptMembershipRequest");
const invitations = require("./routes/invitations");
const party = require("./routes/party");
const cancelMembershipRequest = require("./routes/cancelMembershipRequest");
const uploadPartyLogo = require("./routes/uploadPartyLogo");
const invitationOnly = require("./routes/invitationOnly");
const verifyEmail = require("./routes/verifyEmail");
const changeEmail = require("./routes/changeEmail");
const passwordRecovery = require("./routes/passwordRecovery");
const recoveryCode = require("./routes/recoveryCode");
const craft = require("./routes/craft");
const partyMembers = require("./routes/partyMembers");
const buy = require("./routes/buy");
const sell = require("./routes/sell");
const changeFactoryName = require("./routes/changeFactoryName");
const changeFactoryShare = require("./routes/changeFactoryShare");
const changeLeader = require("./routes/changeLeader");
const deleteStudy = require("./routes/deleteStudy");
const stopWorking = require("./routes/stopWorking");
const cancelJoinRequest = require("./routes/cancelJoinRequest");
const provinceOwnership = require("./routes/provinceOwnership");
const createLaw = require("./routes/createLaw");
const vote = require("./routes/vote");
const voteOnLaw = require("./routes/voteOnLaw");
const wageWar = require("./routes/wageWar");
const attack = require("./routes/attack");
const defend = require("./routes/defend");
const switchToDemocracy = require("./routes/switchToDemocracy");
const postArticle = require("./routes/postArticle");
const articles = require("./routes/articles");
const article = require("./routes/article");
const election = require("./routes/election");
const laws = require("./routes/laws");
const wars = require("./routes/wars");
const uploadCoatOfArms = require("./routes/uploadCoatOfArms");
const setBonusProvince = require("./routes/setBonusProvince");
const travel = require("./routes/travel");
const setCitizenship = require("./routes/setCitizenship");
const setStateName = require("./routes/setStateName");
const setPartyName = require("./routes/setPartyName");
const states = require("./routes/states");
const deleteArticle = require("./routes/deleteArticle");
const upvoteArticle = require("./routes/upvoteArticle");
const deleteArticleUpvote = require("./routes/deleteArticleUpvote");
const getArticleUpvote = require("./routes/getArticleUpvote");
const loginGoogle = require("./routes/loginGoogle");
const app = express();

const allowedOrigins =
  app.get("env") === "development"
    ? "*"
    : ["https://worldsuperpowers.cc", "https://goldenhead.club"];

// postgresql config
const pool = require("./db");
// game
setInterval(() => {
  pool.query(
    "BEGIN; UPDATE profiles SET military_education = military_education + 1 WHERE username IN (SELECT username FROM study WHERE finish_time <= NOW() AND field_of_study = 'military_education' FOR UPDATE); DELETE FROM study WHERE finish_time <= NOW() AND field_of_study = 'military_education'; COMMIT; BEGIN; UPDATE profiles SET economic_education = economic_education + 1 WHERE username IN (SELECT username FROM study WHERE finish_time <= NOW() AND field_of_study = 'economic_education' FOR UPDATE); DELETE FROM study WHERE finish_time <= NOW() AND field_of_study = 'economic_education'; COMMIT; BEGIN; UPDATE profiles SET political_education = political_education + 1 WHERE username IN (SELECT username FROM study WHERE finish_time <= NOW() AND field_of_study = 'political_education' FOR UPDATE); DELETE FROM study WHERE finish_time <= NOW() AND field_of_study = 'political_education'; COMMIT; UPDATE parties SET max_members = 20 + subquery.political_education FROM (SELECT * FROM profiles FOR UPDATE) AS subquery WHERE parties.leader_username IN (subquery.username); UPDATE gold_mines SET profit_multiplier = subquery.economic_education + (SELECT gold FROM provinces WHERE province_number = subquery.province FOR UPDATE) FROM (SELECT economic_education, username, province FROM profiles FOR UPDATE) AS subquery WHERE gold_mines.owner_username IN (subquery.username); UPDATE oil_fields SET profit_multiplier = subquery.economic_education + (SELECT oil FROM provinces WHERE province_number = subquery.province FOR UPDATE) FROM (SELECT economic_education, username, province FROM profiles FOR UPDATE) AS subquery WHERE oil_fields.owner_username IN (subquery.username); UPDATE gas_plants SET profit_multiplier = subquery.economic_education + (SELECT gas FROM provinces WHERE province_number = subquery.province FOR UPDATE) FROM (SELECT economic_education, username, province FROM profiles FOR UPDATE) AS subquery WHERE gas_plants.owner_username IN (subquery.username); UPDATE iron_mines SET profit_multiplier = subquery.economic_education + (SELECT iron FROM provinces WHERE province_number = subquery.province FOR UPDATE) FROM (SELECT economic_education, username, province FROM profiles FOR UPDATE) AS subquery WHERE iron_mines.owner_username IN (subquery.username); BEGIN; update states set provinces = array_remove(states.provinces, subquery.disputed_province) from (select * from wars where now() > war_end and score > 0 for update) as subquery where subquery.defenders_stateid = states.stateid; update states set provinces = array_append(states.provinces, subquery.disputed_province) from (select * from wars where now() > war_end and score > 0 for update) as subquery where subquery.attackers_stateid = states.stateid; COMMIT; delete from wars where now() > war_end; delete from states where provinces = '{}';",
    (err) => {
      if (err) {
        logger.error(err);
        return;
      }
    },
  );
}, 1000);
setInterval(() => {
  pool.query(
    "begin; select * from votes where now() >= voting_end for update; update votes set vote_count = null, users_who_voted = null, voting_end = now() + interval '1 hour' * 24, voting_start = now() + interval '1 hour' * 12 where now() >= voting_end; commit; update votes set partyid = parties.partyid from (select array_agg(parties.partyid) as partyid, states.stateid from parties inner join states on parties.province = any(states.provinces) group by states.stateid) as parties where votes.stateid = parties.stateid and votes.voting_start > now();",
    (err, res) => {
      if (err) {
        logger.error(err);
        return;
      }
      if (res[1].rows.length === 0) return;
      const numberOfSeatsInParliament = 60;
      for (const row of res[1].rows) {
        if (row.vote_count === null || row.partyid === null) return;
        const totalVotes = row.vote_count.reduce((a, b) => a + b, 0);
        const request = row.partyid
          .map((partyid, index) =>
            format(
              "UPDATE states SET members_of_parliament = (select array_agg(username) from profiles where partyid = %L ORDER BY random() limit %L) where stateid = %L;",
              partyid,
              Math.round(
                (row.vote_count[index] / totalVotes) *
                  numberOfSeatsInParliament,
              ),
              row.stateid,
            ),
          )
          .join(" ");
        pool.query(
          `BEGIN; LOCK profiles IN ROW SHARE MODE; ${request} COMMIT;`,
          (err) => {
            if (err) {
              logger.error(err);
              return;
            }
          },
        );
      }
    },
  );
}, 1000);
const addProfitForWorkers = (res) => {
  for (const worker of res.rows) {
    pool.query(
      format(
        "SELECT * FROM %I WHERE building_id = %L;",
        worker.building_type,
        worker.building_id,
      ),
      (err, response) => {
        if (err) {
          logger.error(err);
          return;
        }
        if (response.rows.length !== 1) return;
        const workerProfitShare = 100 - response.rows[0].owner_profit_share;
        const resource = worker.building_type.split("_")[0];
        const resourceMultiplier =
          resource === "gold"
            ? 1
            : resource === "oil"
              ? 2
              : resource === "gas"
                ? 3
                : 4;
        pool.query(
          format(
            "BEGIN; UPDATE user_data SET %I = %I + %L WHERE username = %L; UPDATE user_data SET %I = %I + %L WHERE username = %L; COMMIT;",
            resource,
            resource,
            Math.round(
              resourceMultiplier *
                response.rows[0].profit_multiplier *
                (workerProfitShare / 100),
            ),
            worker.username,
            resource,
            resource,
            Math.round(
              resourceMultiplier *
                response.rows[0].profit_multiplier *
                (response.rows[0].owner_profit_share / 100),
            ),
            response.rows[0].owner_username,
          ),
          (err) => {
            !err || logger.error(err);
          },
        );
      },
    );
  }
};
setInterval(() => {
  pool.query(
    "SELECT * FROM working WHERE start_time + interval '1 hour' <= NOW();",
    (err, res) => {
      err ? logger.error(err) : addProfitForWorkers(res);
    },
  );
}, 50000);
// apply laws
setInterval(async () => {
  const client = await pool.getClient();
  try {
    await client.query(`WITH law AS (
      DELETE FROM pending_laws
      WHERE voting_end < NOW()
        AND law = 'proclaim_leadership'
        AND (
          array_length(voted_yes, 1) > array_length(voted_no, 1)
          OR array_length(voted_no, 1) IS NULL
        )
      RETURNING stateid, proposer
    )
    UPDATE states
    SET leader = law.proposer
    FROM law
    WHERE states.stateid = law.stateid
      AND states.political_system = 'democracy';
    `);
    await client.query(`WITH law AS (
      DELETE FROM pending_laws
      WHERE voting_end < NOW()
        AND law = 'proclaim_dictatorship'
        AND (
          array_length(voted_yes, 1) > array_length(voted_no, 1)
          OR array_length(voted_no, 1) IS NULL
        )
      RETURNING stateid, proposer
    )
    UPDATE states
    SET leader = law.proposer,
        political_system = 'dictatorship',
        members_of_parliament = NULL
    FROM law
    WHERE states.stateid = law.stateid
      AND states.political_system = 'democracy';
    `);
    await client.query(`WITH law AS (
      DELETE
      FROM pending_laws
      WHERE voting_end < NOW()
        AND law = 'overthrow_leader'
        AND (
          array_length(voted_yes, 1) > array_length(voted_no, 1)
          OR array_length(voted_no, 1) IS NULL
        )
      RETURNING stateid, proposer
    )
    UPDATE states
    SET leader = NULL
    FROM law
    WHERE states.stateid = law.stateid
      AND political_system = 'democracy';
    `);
  } finally {
    await client.query("delete from pending_laws where voting_end < now();");
    client.release();
  }
}, 1000);
// socket.io
(() => {
  const server = http.createServer(app);
  const io = new Server(server, {
    cors: {
      origin: allowedOrigins,
      methods: ["*"],
      credentials: true,
    },
  });
  const port = 44225;
  server.listen(port, () => {
    logger.info(`listening on *:${port}`);
  });
  let markets = [];
  let chatGlobal = [];
  io.on("connection", (socket) => {
    socket.emit("markets", markets);
    socket.emit("chat_global", chatGlobal);
    setInterval(() => {
      pool.query("SELECT * FROM markets;", (err, res) => {
        if (err) {
          logger.error(err);
        } else if (!isEqual(markets, res.rows)) {
          markets = res.rows;
          io.emit("markets", res.rows);
        }
      });
    }, 1000);
    setInterval(() => {
      pool.query("SELECT * FROM chat_global;", (err, res) => {
        if (err) {
          logger.error(err);
        } else if (chatGlobal.length !== res.rows.length) {
          chatGlobal = res.rows;
          io.emit("chat_global", res.rows);
        }
      });
    }, 1000);
  });
})();
// log only 4xx and 5xx responses to console
app.use(
  morgan("dev", {
    skip: function (req, res) {
      return res.statusCode < 400;
    },
  }),
);
// create a rotating write stream
const accessLogStream = rfs.createStream("access.log", {
  interval: "1d", // rotate daily
  path: path.join(__dirname, "log"),
});
// setup the logger
app.use(morgan("combined", { stream: accessLogStream }));
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.set("trust proxy", true);

app.use(cors({ origin: allowedOrigins }));
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use("/api", express.static(path.join(__dirname, "public")));
app.use("/api/profile", userProfile);
app.use("/api/gas_plant", gasPlant);
app.use("/api/gold_mine", goldMine);
app.use("/api/oil_field", oilField);
app.use("/api/province", province);
app.use("/api/provinces", provinces);
app.use("/api/state", state);
app.use("/api/register", register);
app.use("/api/login", login);
app.use("/api/create", create);
app.use("/api/work", work);
app.use("/api/user_data", userdata);
app.use("/api/buildings_by_province", buildingsByProvince);
app.use("/api/post_to_chat", postToChat);
app.use("/api/upload_avatar", uploadAvatar);
app.use("/api/check_employment", checkEmployment);
app.use("/api/unban", unban);
app.use("/api/ban_hammer", banHammer);
app.use("/api/study", study);
app.use("/api/check_study", checkStudy);
app.use("/api/send_money", sendMoney);
app.use("/api/create_party", createParty);
app.use("/api/join_party", joinParty);
app.use("/api/kick_from_party", kickFromParty);
app.use("/api/leave_party", leaveParty);
app.use("/api/ask_to_join_party", askToJoinParty);
app.use("/api/parties_by_province", partiesByProvince);
app.use("/api/invitations", invitations);
app.use("/api/accept_membership_request", acceptMembershipRequest);
app.use("/api/party", party);
app.use("/api/cancel_membership_request", cancelMembershipRequest);
app.use("/api/upload_party_logo", uploadPartyLogo);
app.use("/api/invitation_only", invitationOnly);
app.use("/api/verify_email", verifyEmail);
app.use("/api/change_email", changeEmail);
app.use("/api/password_recovery", passwordRecovery);
app.use("/api/recovery_code", recoveryCode);
app.use("/api/iron_mine", ironMine);
app.use("/api/craft", craft);
app.use("/api/party_members", partyMembers);
app.use("/api/buy", buy);
app.use("/api/sell", sell);
app.use("/api/change_factory_name", changeFactoryName);
app.use("/api/change_factory_share", changeFactoryShare);
app.use("/api/change_leader", changeLeader);
app.use("/api/delete_study", deleteStudy);
app.use("/api/stop_working", stopWorking);
app.use("/api/cancel_join_request", cancelJoinRequest);
app.use("/api/province_ownership", provinceOwnership);
app.use("/api/create_law", createLaw);
app.use("/api/vote", vote);
app.use("/api/vote_on_law", voteOnLaw);
app.use("/api/wage_war", wageWar);
app.use("/api/attack", attack);
app.use("/api/defend", defend);
app.use("/api/switch_to_democracy", switchToDemocracy);
app.use("/api/post_article", postArticle);
app.use("/api/articles", articles);
app.use("/api/article", article);
app.use("/api/election", election);
app.use("/api/laws", laws);
app.use("/api/wars", wars);
app.use("/api/upload_coat_of_arms", uploadCoatOfArms);
app.use("/api/set_bonus_province", setBonusProvince);
app.use("/api/travel", travel);
app.use("/api/set_citizenship", setCitizenship);
app.use("/api/set_state_name", setStateName);
app.use("/api/set_party_name", setPartyName);
app.use("/api/delete_article", deleteArticle);
app.use("/api/states", states);
app.use("/api/upvote_article", upvoteArticle);
app.use("/api/article_upvotes", deleteArticleUpvote);
app.use("/api/article_upvotes", getArticleUpvote);
app.use("/api/login/google", loginGoogle);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
