const express = require("express");
const { User } = require("../../models/User");
const { Property } = require("../../models/property");
const { Reservation } = require("../../models/reservation");
const { Feedback } = require("../../models/Feedback");

const bcrypt = require("bcryptjs");
const _ = require("lodash");
const admin = require("../../middleware/admin");
const router = express.Router();
const debug = require("debug")("app:routes");
const Joi = require("joi");



// @route   GET api/v1/admin/users
// @desc    all user info
// @access  private
router.get("/users",admin, async (req, res) => {
  const user = await User.find();
  res.json(
    _.pick(user, [
        "_id",
        "firstname",
        "lastname",
        "phone",
        "email",
        "address",
      ])
  );
});

// @route   GET api/v1/admin/properties
// @desc    all proptries
// @access  private
router.get("/properties",admin, async (req, res) => {
    const properties = await Property.find();
    res.json(properties);
  });

// @route   GET api/v1/admin/reservations
// @desc    all reservations
// @access  private
router.get("/reservations",admin, async (req, res) => {
    const reservations = await Reservation.find();
    res.json(reservations);
  });

// @route   GET api/v1/admin/message
// @desc    all message
// @access  private
router.get("/messages",admin, async (req, res) => {
    const messages = await Feedback.find();
    res.json(messages);
  });





// @route   GET api/v1/admin/update
// @desc    update profile
// @access  private
router.patch("/update",admin, async (req, res) => {

  const { email } = req.body.user;

  // Check if email is used
  let user = await User.findOne({ email });
  if (user && ( user._id != req.user._id)) return res.status(409).json({ message: "Email already exist" });

    const updated_user = await User.findByIdAndUpdate(
      req.user._id,
      req.body.user,
      { new: true }
    );
    res.json(
      {
      message: "informations updated",
      user:
      _.pick(updated_user, [
        "_id",
        "firstname",
        "lastname",
        "email",
        "isAdmin"
      ])
    }
    );
  }
);


// @route   GET api/v1/user/password
// @desc    update user password
// @access  private

router.patch(
  "/password",auth, async (req, res) => {
    console.log(req.body);
    const user = await User.findById(req.user._id);
    const { old_password ,new_password} = req.body;

    // Validate password
    const validPassword = await bcrypt.compare(old_password, user.password);
    if (!validPassword)
      return res.status(400).json({ message: "Incorrect password" });
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

module.exports = router;
