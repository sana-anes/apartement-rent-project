const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Joi = require("joi");

const userSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 20,
  },
  lastname: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 20,
  },
  address: {
    type: String,
    minlength: 5,
    maxlength: 50,
  },
  phone: {
    type: String,
    minlength: 5,
    maxlength: 50,
  },
  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 1024,
  },
  picture: {
    type: String,
    default: "/static/user_profile/default.jpg",
    minlength: 5,
    maxlength: 1024,
  },
  savedProperties:{
    type: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
    }],
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
},
{timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    { _id: this._id, isAdmin: this.isAdmin },
    process.env.JWT_SECRET
  );
  return token;
};

const User = mongoose.model("User", userSchema);

const validateUser = (user) => {
  const schema = {
    //name: Joi.string().min(5).max(50).required(),
    // address: Joi.string().min(5).max(50),
    email: Joi.string().min(5).max(50).required().email(),
    password: Joi.string().min(5).max(255).required(),
    // isAdmin: Joi.boolean(),
  };

  return Joi.validate(user, schema);
};

module.exports = { User, validate: validateUser };
