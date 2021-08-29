const cors = require("cors");
const error = require("../middleware/error");
const express = require("express");
const fileUploader = require("express-fileupload");
const helmet = require("helmet");
const morgan = require("morgan");
const path = require("path");

const auth = require("../routes/api/auth");
const property = require("../routes/api/property");
const user = require("../routes/api/user");
const feedback = require("../routes/api/feedback");
const reservation = require("../routes/api/reservation");
const content = require("../routes/api/content");
const comment = require("../routes/api/comment");


module.exports = (app) => {
  app.use("/static",express.static(path.join(__dirname, "..", "public")));
  app.use(cors());
  app.use(error);
  app.use(express.json());
  app.use(helmet());
  app.use(morgan("tiny"));
  app.use("/api/user", user);
  app.use("/api/property", property);
  app.use("/api/auth", auth);
  app.use("/api/feedback", feedback);
  app.use("/api/reservation", reservation);
  app.use("/api/content", content);
  app.use("/api/comment", comment);



};
