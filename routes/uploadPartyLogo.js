const express = require("express");
const router = express.Router();
const format = require("pg-format");

const upload = require("../utils/upload");
const uploader = require("../utils/uploader");
const auth = require("../utils/auth");

router.post("/", auth, upload.single("file"), (req, response) =>
  uploader({
    req,
    response,
    formatRequest: ({ fileName, user }) => {
      return format(
        "UPDATE parties SET logo = %L WHERE leader_username = %L;",
        fileName,
        user,
      );
    },
  }),
);

module.exports = router;
