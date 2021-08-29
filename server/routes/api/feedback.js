const express = require("express");
const { Feedback } = require("../../models/Feedback");
const admin = require("../../middleware/admin");

const router = express.Router();

const getFeedback = async (query, page = 0, perPage = 4) => {
  return await Feedback.find(query)  
    .sort({created_at: -1})
    .limit(perPage)
    .skip(perPage * page);
};



router.post("/send", async (req, res) => {


  console.log(req.body)
    feedback = new Feedback({
      ...req.body,
    });
  
    feed = await feedback.save()
    .then(data => {
      res.status(201) .json({
         message: 'feedback sended successfully', 
        });
    })
    .catch(() => {
      res
      .status(500)
      .json({ message: 'Error occured' });
  });
  
  });

// @route   GET api/v1/feedback/all
// @desc    Get all feedback
// @access  private
router.get("/all",admin,async (req, res) => {
  const {page} = req.query;

  const feedbacks = await getFeedback({},page);
const total= await Feedback.find();
  res.json({data:feedbacks,total:total.length});
  
});

  module.exports = router;
