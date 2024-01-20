const fileFilter = (req, file, cb) => {
  const fileFormat = file.originalname.split(".").reverse()[0];
  const isAllowedFileFormat =
    fileFormat === "jpg" || fileFormat === "jpeg" || fileFormat === "png";
  const isAllowedFileType =
    file.mimetype === "image/jpeg" || file.mimetype === "image/png";
  isAllowedFileFormat && isAllowedFileType ? cb(null, true) : cb(null, false);
};

module.exports = fileFilter;
