const express = require("express");
const router = express.Router();
const { Property } = require("../../models/property");
const { User } = require("../../models/User");
const { Reservation } = require("../../models/reservation");
const _ = require("lodash");
const auth = require("../../middleware/auth");
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

function date(d){
    return new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes() - d.getTimezoneOffset()).toISOString();
}
function getNumberOfDays(start, end) {
    date1=new Date(start);
    date2=new Date(end);
    const oneDay = 1000 * 60 * 60 * 24;
    const diffInTime = date2.getTime() - date1.getTime();
    const diffInDays = Math.round(diffInTime / oneDay);
    return diffInDays+1;
}
const getReservations = async (query, page = 0, perPage = parseInt(process.env.PAGNATION_PAGE)) => {
  return await Reservation.find(query)
  .populate({
    path: "user",
    select: "firstname lastname ",
  }).populate({
    path: "property",
    select: "title ",
  })  
    .sort({created_at: -1})
    .limit(perPage)
    .skip(perPage * page);
};

// @route   POST api/v1/reservation/check
// @desc    POST check availability
// @access  public
router.post("/check", async (req, res) => {
console.log(req.body)
const {start,end ,id }=req.body;
const start_date=new Date(start);
const end_date=new Date(end);
const check_in=date(start_date);
const check_out=date(end_date);

let reservations =await Reservation.findOne({
    "property": id,
     $and:[
        {"check_in": {"$lt": check_out}},
        {"check_out": {"$gt": check_in}}
     ]
});
if(reservations){
    res.json({message:"The Property not available",available:false});
}else{
  const property= await Property.findById(id);
  const nbr_days=getNumberOfDays(check_in,check_out);
  const price=nbr_days*property.price;
    res.json({message:"The Property is available",available:true , cost:price});
}

});


// @route   POST api/v1/reservation/book
// @desc    POST reservation booking
// @access  private
router.post("/book",auth, async (req, res) => {
    const { _id } = req.user;
    const {start,end ,id }=req.body;
    const start_date=new Date(start);
    const end_date=new Date(end);
    const check_in=date(start_date);
    const check_out=date(end_date);
    
    let reservations =await Reservation.findOne({
        "property": id, 
        $and:[
            {"check_in": {"$lt": check_out}},
            {"check_out": {"$gt": check_in}}
        ]
    });
    if(reservations){
        return res.status(409).json({message:"property not available, booking is canceled"});
    }else{
        const property= await Property.findById(id);
        const nbr_days=getNumberOfDays(check_in,check_out);
        const price=nbr_days*property.price;
        const reservation={
            user:_id,
            property:id,
            check_in:check_in,
            check_out:check_out,
            total_price:price
        }
        const new_reservation= await new Reservation(reservation).save();
        res.json({message:"property booked successfully", new_reservation:new_reservation})

    }
    
    });


// @route   PATCH api/v1/reservation/confirm
// @desc    PATCH reservation confirmation
// @access  private


router.patch("/confirm",auth, async (req, res) => {
  const {id,email,token}=req.body;
  const reservation=await Reservation.findById(id);
  const amount=reservation.total_price*100;
  stripe.customers.create({
    email: email,
    source: token.id
  })
  .then(customer => stripe.charges.create({
    amount,
    description: 'AtypicHouse',
    currency: 'usd',
    customer: customer.id
  }))
  .then( async (charge) => 
    {
      if(charge.status==='succeeded'){
        let reservations =await Reservation.findByIdAndUpdate(id, {status:"confirmed"})
        res.json({message:"payment is succeeded , reservation is confirmed successfully"})
      }
      else res.status(406).json({message:"payment is failed , reservation is not confirmed yet"})

    }
    
    );
  });

// @route   PATCH api/v1/reservation/cancel
// @desc    PATCH reservation cancelation
// @access  private


router.patch("/cancel",auth, async (req, res) => {
  const {id}=req.body;
  console.log(req.body);
        let reservations =await Reservation.findByIdAndUpdate(id, {status:"canceled"})
        res.json({message:"Reservation is canceled successfully"})

  });


   // @route   GET api/v1/reservation/all
// @desc    Get all reservation
// @access  private
router.get("/all", async (req, res) => {
  const {page} = req.query;
  let query={status: { $ne: 'not confirmed' } };
  const reservations = await getReservations(query,page);
const total= await Reservation.find(query);
  res.json({data:reservations,total:total.length});
}); 


 // @route   GET api/v1/reservation
  // @desc    Get user reservations
  // @access  private
  router.get("/", auth, async (req, res) => {
    const { _id } = req.user;
    const all_reservation = await Reservation.find({ user: _id }).sort({created_at: -1}).populate({
      path: "user",
      select: "firstname lastname ",
    }).populate({
      path: "property",
      select: "title ",
    });
    res.json(all_reservation);
  });
  
  // @route   GET api/v1/reservation/status/:status
  // @desc    Get user reservation by status
  // @access  private
  router.get("/status", auth, async (req, res) => {
    const { status,pageN} = req.query;
    const { _id } = req.user;
    const page = parseInt(pageN) || 0;
    console.log(status);
    console.log(pageN);

    let query={user: _id };
    if(status!=="all") query={...query,status:status}
    
    const reservations = await getReservations(query,page)
  const total= await Reservation.find(query);
    res.json({data:reservations,total:total.length});
  });   
  // @route   GET api/v1/reservation/property
  // @desc    Get property reservation 
  // @access  private
  router.get("/property", auth, async (req, res) => {
    const { id,page} = req.query;
    const query={property:id};
    const reservations = await getReservations(query,page)
  const total= await Reservation.find(query);
  res.json({data:reservations,total:total.length});

  });

// @route   DELETE api/v1/reservation
// @desc    delete a single reservation
// @access  private
router.delete("/delete", auth, async (req, res) => {
    const { id } = req.body;
    const reservation = await Reservation.findByIdAndDelete(id);
  
    if (reservation === null)
      return res.status(400).json({ message: "Reservation not exists" });
    else {
      res.json({
        message: "Reservation deleted",
      });
    }
  });




module.exports = router;

