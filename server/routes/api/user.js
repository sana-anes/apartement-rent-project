const express = require("express");
const { User, validate } = require("../../models/User");
const bcrypt = require("bcryptjs");
const _ = require("lodash");
const auth = require("../../middleware/auth");
const router = express.Router();
const debug = require("debug")("app:routes");
const Joi = require("joi");
const { join, basename } = require("path");
const { moveFile, deleteFile } = require("../../utilities/fileManager");

const {
  uploadImage,
  fileUploadPaths,
} = require("../../middleware/uploadHandler");


// @route   GET api/v1/user/users
// @desc    all user info
// @access  public
router.get("/users", async (req, res) => {
  const user = await User.find();
  res.json(user);
});

// @route   GET api/v1/user/me
// @desc    user info
// @access  private
router.get("/me", auth, async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  debug(req.user);
  res.json(
    _.pick(user, [
      "_id",
      "firstname",
      "lastname",
      "phone",
      "email",
      "address",
      "picture",
      "savedProperties"
    ])
  );
});

// @route   GET api/v1/user/savedPropreties
// @desc    user saved Propreties
// @access  private
router.get("/savedProperties", auth, async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  debug(req.user);
  res.json(
    _.pick(user, [
      "savedProperties"
    ])
  );
});

// @route   GET api/v1/user/update
// @desc    update profile
// @access  private
router.patch(
  "/update",
  auth,
  async (req, res) => {
    const { error } = validateUser(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    const updated_user = await User.findByIdAndUpdate(
      req.user._id,
      req.body
    ).select("-password");
    debug(updated_user);
    res.json(
      {
      message: "user updated",
      success: true,
    }
    );
  }
);

// @route   GET api/v1/user/updatePicture
// @desc    update profile picture
// @access  private

router.patch(
  "/updatePicture",
  auth,
  uploadImage.single("picture"),
  async (req, res) => {
    
    if (!req.file)  return res.status(400).json({ message: "No image uploaded" });
      const user = await User.findById(req.user._id);
      let image_filename = basename(user.picture);
      const imageName = req.file.filename;
      if (imageName !== image_filename && image_filename !== "default.jpg")
        deleteFile(
          join(fileUploadPaths.USER_IMAGE_UPLOAD_PATH, image_filename)
        );

      //set the path of the new image
      path = `${fileUploadPaths.USER_IMAGE_URL}/${imageName}`;
      const update_values = { picture: path };
      moveFile(
        join(fileUploadPaths.FILE_UPLOAD_PATH, imageName),
        join(fileUploadPaths.USER_IMAGE_UPLOAD_PATH, imageName)
      );
    

    const updated_user = await User.findByIdAndUpdate(
      req.user._id,
      update_values
    ).select("-password");
    debug(updated_user);
    res.json({
      message: "profile picture updated",
      success: true,
    });
  }
);

// @route   GET api/v1/user/removePicture
// @desc    remove profile picture
// @access  private

router.patch(
  "/removePicture",
  auth,
  async (req, res) => {
    const user = await User.findById(req.user._id);
    let image_filename = basename(user.picture);
    deleteFile(
      join(fileUploadPaths.USER_IMAGE_UPLOAD_PATH, image_filename)
    );
    const updated_user = await User.findByIdAndUpdate(
      req.user._id,
      {picture:"/static/user_profile/default.jpg"}
    );
    debug(updated_user);
    res.json({
      message: "profile picture removed",
      success: true,
    });
  }
);

// @route   GET api/v1/user/password
// @desc    update user password
// @access  private

router.patch(
  "/password",
  auth,
  async (req, res) => {
    const user = await User.findById(req.user._id);
    const { password ,new_password} = req.body;

    // Validate password
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword)
      return res.status(400).json({ message: "Invalid password" });
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(new_password, salt);
    const updated_user = await User.findByIdAndUpdate(
      req.user._id,
      {password:hash}
    );
    res.json({
      message: "password updated",
      success: true,
    });
  }
);



const validateUser = (user) => {
  const schema = {
    name: Joi.string().min(5).max(50),
    bio: Joi.string(),
    region: Joi.string().min(5).max(50),
    address: Joi.string().min(5).max(50),
    email: Joi.string().min(5).max(50).email(),
    // isAdmin: Joi.boolean(),
    // isPro: Joi.boolean(),
  };
  return Joi.validate(user, schema);
};
module.exports = router;
