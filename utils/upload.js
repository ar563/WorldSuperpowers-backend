const multer = require("multer");

const fileFilter = require("./fileFilter");

const upload = multer({
  dest: "public/images",
  fileFilter: fileFilter,
  limits: {
    fileSize: 5120000,
  },
});

module.exports = upload;
