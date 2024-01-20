const fs = require("fs");

const logger = require("../utils/logger");

const setFilename = ({ fileName, filePath, callback }) => {
  fs.rename(filePath, `public/images/${fileName}`, (err) => {
    if (err) {
      logger.error(err);
      return;
    }
    callback();
  });
};

module.exports = setFilename;
