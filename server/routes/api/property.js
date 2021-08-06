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
  const all_property = await Property.find();
  res.json(all_property);
});
// @route   GET api/v1/property/others
// @desc    Get other property
// @access  private
router.get("/others", auth, async (req, res) => {
  const { _id } = req.user;
  const other_properties = await Property.find({user: { $ne: _id }});
  res.json(other_properties);
});

// @route   GET api/v1/property
// @desc    Get user property
// @access  private
router.get("/", auth, async (req, res) => {
  const { _id } = req.user;
  const all_property = await Property.find({ user: _id });
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
  if(status=="all") propreties = await Property.find({ user: _id});
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
  uploadImage.single("picture"),
  async (req, res) => {
    const { id } = req.params;
    // const { error } = validate_update(req.body);
    // if (error) {
    //   if(req.file) deleteFile(join(fileUploadPaths.FILE_UPLOAD_PATH,req.file.filename));
    //   return res.status(400).json(error.details[0].message);
    // }
    let update_values = req.body;
    const property = await Property.findById(id);
    if (!property) return res.json({ message: "Property not found" });
    if (req.file) {
      let image_filename = basename(property.picture);
      const imageName = req.file.filename;
      if (imageName !== image_filename)
        deleteFile(
          join(fileUploadPaths.PROPERTY_IMAGE_UPLOAD_PATH, image_filename)
        );
      path = `${fileUploadPaths.PROPERTY_IMAGE_URL}/${req.file.filename}`; 
      update_values = { ...update_values, picture: path };
      moveFile(
        join(fileUploadPaths.FILE_UPLOAD_PATH, imageName),
        join(fileUploadPaths.PROPERTY_IMAGE_UPLOAD_PATH, imageName)
      );
    }

    debug(update_values);
    const newProperty = await Property.findByIdAndUpdate(id, update_values);
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
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const property = await Property.findById(id); //.populate("user");
  res.json({ property });
});

const validate_update = (req) => {
  const schema = {
    title: Joi.string().min(5).required(),
    location: Joi.string().min(3).max(50).required(),
    type: Joi.array().items(Joi.string().required()),
    user: Joi.string().min(5).max(255).required(),
   };
  return Joi.validate(req, schema);
};

module.exports = router;
