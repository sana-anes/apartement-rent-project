const express = require("express");
const { Comment } = require("../../models/comment");
const { Property } = require("../../models/property");
const auth = require("../../middleware/auth");
const router = express.Router();

deleteReplies=async (id)=>{
    const main_comment= await Comment.findById(id);
    if(main_comment){
      console.log(main_comment.comment);
        const deleted_comment= await Comment.findByIdAndDelete(id);
        const replies=main_comment.replies;
        for(let i=0; i < replies.length ; i++){
          deleteReplies(replies[i]);
        }  
    }
}

// @route   POST api/v1/comment/add
// @desc    POST add comment
// @access  public
router.post("/add", async (req, res) => {
  const{property,name,email,comment}=req.body;
  const new_comment = await new Comment({ 
    name:name,
    email:email,
    comment:comment,
  }).save()
  .then( async (data) =>{
    const updated_property= await Property.findByIdAndUpdate(
      property,
      { $addToSet: { comments: data._id }},
      {new:true} 
    ).populate({
      path: "user",
      select: "firstname lastname picture",
    })
    .then(datta=>{
       return  res.status(201) .json({message: 'comment added',data:datta});
    })
    .catch(() => {
      return res.status(500).json({ message: 'Error occured' });
    })
  })
  .catch(() => {
    return res.status(500).json({ message: 'Error occured' });
  })

  });

// @route   POST api/v1/comment/reply/:comment
// @desc    POST add reply to a comment
// @access  public
  router.post("/reply", async (req, res) => {
    const{name,email,comment,parent}=req.body;
    const new_comment = await new Comment({ 
      name:name,
      email:email,
      comment:comment,
    }).save()
    .then( async (data) =>{
        updated_comment = await Comment.findByIdAndUpdate(
            parent,
            { $addToSet: { replies: data._id }},  
            )
        .then(data => {
            res.status(201) .json({
            message: 'comment added', 
            });
        })
        .catch(() => {
            res
            .status(500)
            .json({ message: 'Error occured' });
        });
    })
 
    
    });



// @route   DELETE api/v1/comments/delete
// @desc    delete a single comment
// @access  private
router.delete("/deleteComment", auth, async (req, res) => {
    const { comment ,property} = req.body;

    const updated_property = await Property.findById(property)  
    if (updated_property === null)
      return res.status(400).json({ message: "Property not exists" });
    else {
        deleteReplies(comment);
        const updated_property = await Property.findByIdAndUpdate(
            property,
            { $pull: { comments: comment }},  
            {new:true} 
            ).populate({
              path: "user",
              select: "firstname lastname picture",
            })
            .then(data=>{
               return  res.status(201) .json({message: 'comment deleted',data:data});
            })
            .catch(() => {
              return res.status(500).json({ message: 'Error occured' });
            })
   
    }
  });
// @route   DELETE api/v1/comments/delete
// @desc    delete a single comment
// @access  private
router.delete("/deleteReply", auth, async (req, res) => {

    const { reply ,comment} = req.body;
      deleteReplies(reply);
        const updated_comment = await Comment.findByIdAndUpdate(
            comment,
            { $pull: { replies: reply }},  
            );
      res.json({
        message: "comment deleted",
      });
    
  });

  module.exports = router;
