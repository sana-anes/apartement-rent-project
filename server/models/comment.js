const mongoose = require("mongoose");
const commentSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
    unique:false,
  },
  comment: {
    type: String,
  },
  replies:{
    type: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    }],
  },
},
{timestamps: { createdAt: 'created_at' } }
);
const Comment = mongoose.model("Comment", commentSchema);
module.exports = { Comment };
