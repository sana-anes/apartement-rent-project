const express = require("express");
const { User } = require("../../models/User");
const bcrypt = require("bcryptjs");
const _ = require("lodash");
const auth = require("../../middleware/auth");
const admin = require("../../middleware/admin");
const router = express.Router();
const debug = require("debug")("app:routes");

const getUsers = async (query, page = 0, perPage = parseInt(process.env.PAGNATION_PAGE)) => {
  return await User.find(query)  
    .sort({created_at: -1})
    .limit(perPage)
    .skip(perPage * page);
};

// @route   GET api/v1/user/users
// @desc    all user info
// @access  public
router.get("/all", admin,async (req, res) => {
  const {page} = req.query;
  const query={isAdmin:false };
  const users = await getUsers(query,page)
  const total= await User.find(query);
    res.json({data:users,total:total.length});
});

// @route   DELETE api/v1/user/delete
// @desc    delete a user
// @access  private
router.delete("/delete", admin, async (req, res) => {
  const { id } = req.body;
  const user = await User.findByIdAndDelete(id);

  if (user === null)
    return res.status(400).json({ message: "User not exists" });
  else {
    res.json({
      message: "User deleted",
    });
  }
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
router.patch("/update",auth, async (req, res) => {

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
// @route   GET api/v1/user
// @desc    Search for user
// @access  private
router.get("/search", admin,async (req, res) => {
  const { q ,page} = req.query;
  if (!q) return res.status(400).json({ message: "no query" });
  const searchParams = [...q.split(" "), q];
  let reg = "";
  searchParams.forEach((i, index) => {
    reg += "\\b" + i + "\\b";
    reg += index === searchParams.length - 1 ? "" : "|";
  });
  console.log(reg, new RegExp(reg));
  const query={
     $or: [ { firstname: new RegExp(reg), }, { lastname: new RegExp(reg),} ] ,
    isAdmin:false };
  const users = await getUsers(query,page)
  const total= await User.find(query);
    res.json({data:users,total:total.length});
});






module.exports = router;
