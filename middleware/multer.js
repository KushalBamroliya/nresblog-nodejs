const multer = require("multer");
const path = require("path");

const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      try {
        cb(null, path.join(__dirname, "../public/uploads"));
      } catch (err) {
        cb(err);
      }
    },
    filename: function (req, file, cb) {
      try {
        cb(null, Date.now() + path.extname(file.originalname));
      } catch (err) {
        cb(err);
      }
    },
  }),
  limits: {
    fileSize: (() => {
      try {
        return 1024 * 1024 * 10;
      } catch (err) {
        console.error(err+ "file error");
        return 0;
      }
    })(),
  },
  fileFilter: function (req, file, cb) {
    try {
      const ext = path.extname(file.originalname);
      if (ext !== ".jpg" && ext !== ".jpeg" && ext !== ".png") {
        throw new Error("Only .jpg, .jpeg, .png files are allowed");
      }
      cb(null, true);
    } catch (err) {
      cb(err);
    }
  },
});

module.exports = upload;
