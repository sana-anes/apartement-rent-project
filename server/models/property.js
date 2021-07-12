const mongoose = require("mongoose");
const Joi = require("joi");

const propertySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
  },
  location: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50,
  },
  type: {
    type: String,
    required: true,
  },
  rooms: {
    type: String,
    required: true,
  },
  beds: {
    type: String,
    required: true,
  },
  beds: {
    type: String,
    required: true,
  },
  baths: {
    type: String,
    required: true,
  },
  rentFrom: {
    type: Date,
  },
  rentTo: {
    type: Date,
  },
  picture: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 1024,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

const validateProperty= (card) => {
  const schema = {
    title: Joi.string().min(5).required(),
    location: Joi.string().min(3).max(50).required(),
    type: Joi.array().items(Joi.string().required()),
    user: Joi.string().min(5).max(255).required(),
  };
  return Joi.validate(card, schema);
};

const Property = mongoose.model("Property", propertySchema);

module.exports = { Property, validateProperty };
