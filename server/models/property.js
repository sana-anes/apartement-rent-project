const mongoose = require("mongoose");
const Joi = require("joi");

const propertySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 3,
  },
  address: {
    type: String,
    required: true,
    minlength: 3,

  },
  country:{
    type: String,
    required: true,
  },
  state:{
    type: String,
    required: true,
  },
  city:{
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  rooms: {
    type: Number,
    required: true,
  },
  beds: {
    type: Number,
    required: true,
  },
  baths: {
    type: Number,
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
  activities: [{
    name:{type: String},
    distance:{type: String},
  }],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

const validateProperty= (card) => {
  const schema = {
    title: Joi.string().min(3).required(),
    type: Joi.string().required(),
    address: Joi.string().required(),
    country: Joi.string().required(),
    state: Joi.string().required(),
    city: Joi.string().required(),
    rooms: Joi.number().required(),
    beds: Joi.number().required(),
    baths: Joi.number().required(),
    rentFrom:Joi.date().required(),
    rentTo:Joi.date().required(),
    user: Joi.string().min(5).max(255).required(),
  };
  return Joi.validate(card, schema);
};

const Property = mongoose.model("Property", propertySchema);

module.exports = { Property, validateProperty };
