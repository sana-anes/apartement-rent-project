const mongoose = require("mongoose");


const reservationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  property: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Property",
  },
  rentFrom: {
    type: Date,
  },
  rentTo: {
    type: Date,
  },
  status:{
    type:Boolean,
    default:"pending"
  },
 
},
{timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

const Reservation = mongoose.model("Reservation", reservationSchema);


module.exports = { Reservation };
