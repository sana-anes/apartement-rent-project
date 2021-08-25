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
  check_in: {
    type: Date,
  },
  check_out: {
    type: Date,
  },
  status:{
    type:String,
    default:"not confirmed"
  },
  total_price:{
    type:Number,
  }
 
},
{timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

const Reservation = mongoose.model("Reservation", reservationSchema);


module.exports = { Reservation };
