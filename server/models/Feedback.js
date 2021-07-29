const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Joi = require("joi");


const feedbackSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
},
{timestamps: { createdAt: 'created_at' } }
);
const Feedback = mongoose.model("Feedback", feedbackSchema);
module.exports = { Feedback}