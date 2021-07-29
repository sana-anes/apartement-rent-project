const express = require("express");
const { Feedback } = require("../../models/Feedback");

const router = express.Router();


router.post("/send", async (req, res) => {


  console.log(req.body)
    feedback = new Feedback({
      ...req.body,
    });
  
    feed = await feedback.save()
    .then(data => {
      res.status(201) .json({
         message: 'feedback sended successfully', 
         feed 
        });
    })
    .catch(() => {
      res
      .status(500)
      .json({ message: 'Error occured' });
  });
  
  });
  module.exports = router;
