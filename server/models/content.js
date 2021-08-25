const mongoose = require("mongoose");

const contentSchema = new mongoose.Schema({
  logo: {
      label:{type: String},
      brand:{type: String}
  },


},
);



const Content = mongoose.model("Content", contentSchema);


module.exports = { Content };