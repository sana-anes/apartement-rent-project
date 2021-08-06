const multer = require("multer");
const path = require("path");

const fileUploadPaths = {
  FILE_UPLOAD_PATH: path.join(__dirname, "..", "public"),
  PROPERTY_IMAGE_UPLOAD_PATH: path.join(__dirname, "..", "public", "property_images"),
  PROPERTY_IMAGE_URL: "/static/property_images",

  USER_IMAGE_UPLOAD_PATH: path.join(__dirname, "..", "public", "user_profile"),
  USER_IMAGE_URL: "/static/user_profile"

};

const imageFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};



let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, fileUploadPaths.FILE_UPLOAD_PATH);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now()+'-'+file.originalname.toLowerCase().replace(/ /g, "_"));
  },
});

let uploadImage = multer({
  storage: storage,
  fileFilter: imageFilter,
});



module.exports = { uploadImage, fileUploadPaths };
