const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  label: {
    type: String,
  },
},
);

const Category = mongoose.model("Category", categorySchema);


module.exports = { Category };
