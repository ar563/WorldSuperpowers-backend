const fs = require("fs");
const jwt = require("jsonwebtoken");

const logger = require("./logger");
const privateData = require("../private");

const auth = (req, response, next) => {
  fs.readFile(privateData.filePath, (err, data) => {
    if (err) {
      logger.error(err);
      return;
    }
    jwt.verify(
      req.get("Authorization"),
      privateData.passphrase(data),
      (err, decoded) => {
        if (err || !decoded.user) {
          err && logger.error(err);
          response.sendStatus(403);
          return;
        }
        logger.info({
          authorizedUser: decoded.user,
          IP: req.ips,
        });
        response.locals.user = decoded.user;
        next();
      },
    );
  });
};

module.exports = auth;
