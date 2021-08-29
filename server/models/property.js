const mongoose = require("mongoose");
const Joi = require("joi");

const propertySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,

  },
  country:{
    type: String,
    required: true,
  },
  state:{
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
  baths: {
    type: Number,
    required: true,
  },
  price:{
    type: Number,
    required: true,
  },
  rentPer:{
    type: String,
    default:"night"
  },
  picture: [{
    type: String
  }],
  activities: [{
    name:{type: String},
    distance:{type: Number},
  }],
  status: {
    type: String,
    default:"pending"
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  comments:{
    type: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    }],
  }
},
{timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

const validateProperty= (prop) => {
  const schema = {
    title: Joi.string().required(),
    type: Joi.string().required(),
    address: Joi.string().required(),
    country: Joi.string().required(),
    state: Joi.string().required(),
    rooms: Joi.number().required(),
    baths: Joi.number().required(),
    rentPer:Joi.string().required(),
    status:Joi.string(),
    user:Joi.string().min(5).max(255).required(),
  };
  return Joi.validate(prop, schema);
};

const Property = mongoose.model("Property", propertySchema);

module.exports = { Property, validateProperty };
