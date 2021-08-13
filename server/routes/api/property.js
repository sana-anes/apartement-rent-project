const express = require("express");
const Joi = require("joi");
const router = express.Router();
const { join, basename } = require("path");
const { Property } = require("../../models/property");
const { User } = require("../../models/User");

const { moveFile, deleteFile} = require("../../utilities/fileManager");
const _ = require("lodash");
const auth = require("../../middleware/auth");
const debug = require("debug")("app:routes");

const {
  uploadImage,
  fileUploadPaths,
} = require("../../middleware/uploadHandler");

// @route   GET api/v1/property/all
// @desc    Get all property
// @access  private
router.get("/all", async (req, res) => {
  const all_property = await Property.find().sort({created_at: -1}).populate({
    path: "user",
    select: "firstname lastname picture",
  });
  res.json(all_property);
});

// @route   GET api/v1/property/others
// @desc    Get other users property
// @access  private
router.get("/others", auth, async (req, res) => {
  const { _id } = req.user;
  const other_properties = await Property.find({user: { $ne: _id }}).sort({created_at: -1}).populate({
    path: "user",
    select: "firstname lastname picture",
  });
  res.json(other_properties);
});

// @route   GET api/v1/property
// @desc    Get user property
// @access  private
router.get("/", auth, async (req, res) => {
  const { _id } = req.user;
  const all_property = await Property.find({ user: _id }).sort({created_at: -1});
  res.json(all_property);
});

// @route   GET api/v1/property
// @desc    Get user property by status
// @access  private
router.get("/status/:status", auth, async (req, res) => {
  const { status} = req.params;
  const { _id } = req.user;
  console.log(status);
  var propreties;
  if(status=="all") propreties = await Property.find({ user: _id}).sort({created_at: -1});
  else propreties = await Property.find({ user: _id , status:status});
  res.json(propreties);
});

// @route   POST api/v1/property/save
// @desc    POST save property
// @access  private
router.post("/save", auth, async (req, res) => {
  const { _id } = req.user;
  const updated_user = await User.findByIdAndUpdate(
    _id,
    { $addToSet: { savedProperties: req.body.id }},  
    )
  res.json({message:"property saved"});
});
// @route   POST api/v1/property/unsave
// @desc    POST unsave property
// @access  private
router.post("/unsave", auth, async (req, res) => {
  const { _id } = req.user;
  const updated_user = await User.findByIdAndUpdate(
    _id,
    { $pull: { savedProperties: req.body.id }},  
    )
  res.json({message:"property unsaved"});
});

// @route   POST api/v1/property
// @desc    Add property
// @access  private
router.post("/add", 
            auth, 
            uploadImage.array("file"),
            async (req, res) => {
  console.log(req.body);
  console.log(req.file);
  console.log(req.files);

const pictures=[];
for(let i =0; i<req.files.length; i++){
    const imageName = req.files[i].filename;
    moveFile(
      join(fileUploadPaths.FILE_UPLOAD_PATH, imageName),
      join(fileUploadPaths.PROPERTY_IMAGE_UPLOAD_PATH, imageName)
    );
    pictures.push(`${fileUploadPaths. PROPERTY_IMAGE_URL}/${imageName}`);
}
  var property=req.body;
  if(!req.body.activities)
  property={...property,activities:null}
  else
  property={...property,activities:JSON.parse(req.body.activities)}

    const newProperty = {
      ...property,
      picture: pictures,
      user: req.user._id,
    };

    const savedProperty = await new Property(newProperty).save()
    .then(data => {
      res.status(201).json({
         message: 'Property created successfully', 
         data 
        });
    })
    .catch((error) => {
      for(let i =0; i<req.files.length; i++){
        const imageName = req.files[i].filename;
        deleteFile(
          join(fileUploadPaths.PROPERTY_IMAGE_UPLOAD_PATH, imageName)
        );
      }
      res
      .status(500)
      .json({ message: 'Error occured' ,
      error
    });
  });
  
});

// @route   PATCH api/v1/property
// @desc    update Property
// @access  private
router.patch(
  "/update/:id",
  auth,
  uploadImage.array("file"),
  async (req, res) => {
    const { id } = req.params;
    const property = await Property.findById(id);
    if (!property) return res.json({ message: "Property not found" });

    var update_values=req.body;
    var pictures = JSON.parse(req.body.picture);
    if(!req.body.activities)
    update_values={...update_values,activities:null}
    else
    update_values={...update_values,activities:JSON.parse(req.body.activities)}
  
      //remove deleted picture
      let deletedPicture = property.picture.filter(x => !pictures.includes(x));
      for(let i =0; i<deletedPicture.length; i++){
        const imageName = basename(deletedPicture[i]);
        deleteFile(
          join(fileUploadPaths.PROPERTY_IMAGE_UPLOAD_PATH, imageName)
        );
      }
   //get new pictures
     if (req.files) {
      for(let i =0; i<req.files.length; i++){
        const imageName = req.files[i].filename;
        moveFile(
          join(fileUploadPaths.FILE_UPLOAD_PATH, imageName),
          join(fileUploadPaths.PROPERTY_IMAGE_UPLOAD_PATH, imageName)
        );
        pictures.push(`${fileUploadPaths. PROPERTY_IMAGE_URL}/${imageName}`);
      }
     }
     const newProperty = {
      ...update_values,
      picture: pictures,
    };

    const updatedProperty = await Property.findByIdAndUpdate(id, newProperty);
    res.json({ message: "Property updated", success: true });

  }
);



// @route   DELETE api/v1/property
// @desc    delete a single Property
// @access  private
router.delete("/delete", auth, async (req, res) => {
  const { id } = req.body;
  const property = await Property.findByIdAndDelete(id);

  if (property === null)
    return res.status(400).json({ message: "Property not exists" });
  else {
    // deleteFile(
    //   join(fileUploadPaths.PROPERTY_IMAGE_UPLOAD_PATH, basename(property.picture))
    // );
    res.json({
      message: "Property deleted",
    });
  }
});

// @route   GET api/v1/Property
// @desc    Get Property by id
// @access  public
router.get("/single/:id", async (req, res) => {
  const { id } = req.params;
  const property = await Property.findById(id).populate({
    path: "user",
    select: "firstname lastname picture",
  }); //.populate("user");
  res.json({ property });
});

// @route   GET api/property/filter
// @desc    Filter property
// @access  public
router.get("/filter", async (req, res) => {
  var query=null;
  var filterResult;
  const { type,country,rentPer,rooms,baths } = req.query;
  if(type && type!=="all") query={...query,type:type};
  if(country && country!=="all") query={...query,country:country};
  if(rentPer && rentPer!=="all") query={...query,rentPer:rentPer};
  if(rooms && rooms!=="all") query={...query,rooms:rooms};
  if(baths && baths!=="all") query={...query,baths:baths};
if(query)
  filterResult = await Property.find(query);
else
   filterResult = await Property.find();

res.json(filterResult);

});



module.exports = router;
