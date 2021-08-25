const mongoose = require("mongoose");

const countrySchema = new mongoose.Schema({
  label: {
    type: String,
  },
},
);



const Country = mongoose.model("Country", countrySchema);


module.exports = { Country };