const express = require("express");
const { User } = require("../../models/User");
const bcrypt = require("bcryptjs");
const Joi = require("joi");
const router = express.Router();
const debug = require("debug")("app:routes");
const {PasswordResetToken} = require('../../models/resetToken');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const _ = require("lodash");


// @route   POST api/auth/login
// @desc    Login user
// @access  Public
router.post("/login", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  const { email, password } = req.body;

  // Check if the user do exist
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "Not registred email " });

  // Validate password
  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword)
    return res.status(400).json({ message: "Invalid password" });

  const token = user.generateAuthToken();
  res.status(202).json({ 
    accessToken:token ,
    user:
    _.pick(user, [
      "_id",
      "firstname",
      "lastname",
      "email",
      "isAdmin"
    ])
  
  });
});


// @route   POST api/auth/register
// @desc    register user
// @access  Public
router.post("/register", async (req, res) => {

  const { email, password } = req.body;

  // Check if email is used
  let user = await User.findOne({ email });
  if (user) return res.status(409).json({ message: "Email already exist" });

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  debug({
    ...req.body,
    password: hash,
  });

  user = new User({
    ...req.body,
    password: hash,
  });

  user = await user.save()
  .then(data => {
    res.status(201) .json({
       message: 'User created successfully', 
       user 
      });
  })
  .catch(() => {
    res
    .status(500)
    .json({ message: 'Error occured' });
});

});

// @route   POST api/auth/forget-password
// @desc    forgett password
// @access  Public
router.post("/forget-password",
async (req, res) =>{
 const {email}=req.body;
  const user = await User.findOne({
    email:req.body.email
  });
  if (!user) {
    return res
    .status(409)
    .json({ message: 'Email does not exist' });
  }
  const token = user.generateAuthToken();
  var resettoken = new PasswordResetToken({ _userId: user._id, resettoken:token });
  resettoken.save(function (err) {
    if (err) { 
      return res.status(500).send({ message: "something went wrong" });
    }
  PasswordResetToken.find({ 
    _userId: user._id,
     resettoken: { $ne: resettoken.resettoken } 
  }).deleteOne().exec();

  const transporter = nodemailer.createTransport({
    // host: 'smtp.ethereal.email',
    // port: 587,
    // auth: {
    //     user: 'damion23@ethereal.email',
    //     pass: 'UKWZfjm4zRfyG8gZtt'
    // },
    service: 'gmail',
    auth: {
        user: 'atypicHouse@gmail.com',
        pass: 'atypicHouse2021'
    },
    tls:{
      rejectUnauthorized:false   //because of the localhost : we're not using the actual server
    }
  });

  var mailOptions = {
  to: user.email,
  from: '"AtypicHouse" <atypicHouse@gmail.com>',
  subject: 'AtypicHouse Password Reset',
  html: `
  <h3>Hello ${user.firstname} ,</h3>
  <div >It looks like you need a new password. Click on the link below to confirm your request</div>
  <br/>
  <a href="http://localhost:4200/auth/reset-password/${resettoken.resettoken}"><button style="background-color:#21c4bc; color:white; height:30px;width:200px">Confirm my request</button></a> 
  <br/>
  <p >This request was not sent to you? Do you have a problem with your account?</p>
  <p >Please write to us at atypicHouse@gmail.com.
  </p> 
  <p>See you soon,</p>
  ` 
  }
  transporter.sendMail(mailOptions,(err, info) => {
    if (err) {
        return res.status(500).send({ message: "something went wrong while sending the email" });
    }
    console.log('Message sent: %s', info.messageId);
  });
  return  res.status(204).json({ message: 'Reset Password successfully.' , token:resettoken.resettoken});

  })

  });


// @route   POST api/auth/valid-password-token
// @desc    Valid password token
// @access  Public
router.post("/valid-password-token",
async (req, res) =>{
  if (!req.body.resettoken) {
  return res
  .status(500)
  .json({ message: 'Token is required' });
  }
  const user = await PasswordResetToken.findOne({
  resettoken: req.body.resettoken
  });
  if (!user) {
  return res
  .status(409)
  .json({ message: 'Invalid URL' });
  }
  User.findById(user._userId).then(() => {
  res.status(204).json({ message: 'Token verified successfully.' });
  }).catch((err) => {
  return res.status(500).send({ message:"something went wrong." });
  });
});

// @route   POST api/auth/new-password
// @desc    New Password
// @access  Public
router.post("/new-password",
  async (req, res) =>{
      PasswordResetToken.findOne({ resettoken: req.body.resettoken },
         function (err, userToken, next) {
        if (!userToken) {
          return res
            .status(409)
            .json({ message: 'Token has expired' });
        }
  
        User.findOne({
          _id: userToken._userId
        }, function (err, userEmail, next) {
          if (!userEmail) {
            return res
              .status(404)
              .json({ message: 'User does not exist' });
          }
          return bcrypt.hash(req.body.newPassword, 10, (err, hash) => {
            if (err) {
              return res
                .status(400)
                .json({ message: 'Error hashing password' });
            }
            userEmail.password = hash;
            userEmail.save(function (err) {
              if (err) {
                return res
                  .status(400)
                  .json({ message: 'Password can not reset.' });
              } else {
                userToken.remove();
                return res
                  .status(201)
                  .json({ message: 'Password reset successfully' });
              }
  
            });
          });
        });
  
      })
  }
)


router.get("/tokens",
async (req, res) =>{
  const tokens =await PasswordResetToken.find();
res.json(tokens);
  });


const validate = (req) => {
  const schema = {
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required(),
  };

  return Joi.validate(req, schema);
};
const validateUser = (user) => {
  const schema = {
    firstname: Joi.string().min(3).max(20),
    lastname: Joi.string().min(3).max(20),
    email: Joi.string().min(5).max(50).email(),
    password: Joi.string().min(5).max(255).required(),

  };
  return Joi.validate(user, schema);
}

module.exports = router;
