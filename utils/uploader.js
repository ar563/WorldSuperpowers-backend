const { nanoid } = require("nanoid");
const checkFileType = require("file-type");

const client = require("../db");
const logger = require("./logger");
const setFilename = require("./setFilename");

const uploader = async ({ req, response, formatRequest }) => {
  if (!req.file?.path) {
    response.sendStatus(404);
    return;
  }
  const fileFormat = await checkFileType.fromFile(req.file.path);
  const isAllowedFileFormat =
    fileFormat.ext === "jpg" ||
    fileFormat.ext === "jpeg" ||
    fileFormat.ext === "png";
  const isAllowedFileType =
    fileFormat.mime === "image/jpeg" || fileFormat.mime === "image/png";
  const fileName = `${nanoid()}.${fileFormat.ext}`;
  if (!isAllowedFileFormat || !isAllowedFileType) {
    response.sendStatus(404);
    return;
  }
  setFilename({
    fileName,
    filePath: req.file.path,
    callback: () =>
      client.query(
        formatRequest({ fileName, user: response.locals.user }),
        (err) => {
          if (err) {
            logger.error(err);
            return;
          }
          response.send("file uploaded successfully");
        },
      ),
  });
};

module.exports = uploader;
