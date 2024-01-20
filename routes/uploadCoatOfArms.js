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
        "UPDATE states SET coat_of_arms = %L WHERE leader = %L;",
        fileName,
        user,
      );
    },
  }),
);

module.exports = router;
