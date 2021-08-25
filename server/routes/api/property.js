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
const admin = require("../../middleware/admin");

const {
  uploadImage,
  fileUploadPaths,
} = require("../../middleware/uploadHandler");


const getProperties = async (query, page = 0, perPage = 10) => {
  return await Property.find(query)
  .populate({
    path: "user",
    select: "firstname lastname picture",
  }) 
    .sort({created_at: -1})
    .limit(perPage)
    .skip(perPage * page);
};

// @route   GET api/v1/property/all
// @desc    Get all property
// @access  private
router.get("/all",admin,async (req, res) => {
  var query=null;
  const { type,country,property,rooms,baths ,page} = req.query;
  if(type && type!=="all") query={...query,type:type};
  if(country && country!=="all") query={...query,country:country};
  if(property && property!=="all") query={...query,status:property};
  if(rooms && rooms!=='') query={...query,rooms:rooms};
  if(baths && baths!=='') query={...query,baths:baths};
  const all_properties = await getProperties(query,page);
const total= await Property.find(query);
  res.json({data:all_properties,total:total.length});

});

// @route   GET api/v1/property/others
// @desc    Get other users property
// @access  private
router.get("/others", auth, async (req, res) => {
  const { _id } = req.user;
  var query={user: { $ne: _id },status:'accepted'};
  const { type,country,rooms,baths ,page} = req.query;
  if(type && type!=="all") query={...query,type:type};
  if(country && country!=="all") query={...query,country:country};
  if(rooms && rooms!=='') query={...query,rooms:rooms};
  if(baths && baths!=='') query={...query,baths:baths};
  const other_properties = await getProperties(query,page);
const total= await Property.find(query);
  res.json({data:other_properties,total:total.length});
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
router.get("/status", auth, async (req, res) => {
  const { _id } = req.user;
  var query={user: _id };
  const { status,page} = req.query;
  if(status && status!=="all") query={...query,status:status};
  const properties = await getProperties(query,page);
const total= await Property.find(query);
  res.json({data:properties,total:total.length});  

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
  const property = await Property.findById(id);

  if (property === null)
    return res.status(400).json({ message: "Property not exists" });
  else {
    for(let i =0; i<property.picture.length; i++){
    deleteFile(property.picture[i])
    }
    const propertyy = await Property.findByIdAndDelete(id);
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
router.get("/adminFilter", async (req, res) => {
  var query=null;
  var filterResult;
  const { type,country,property,rooms,baths } = req.query;
  if(type && type!=="all") query={...query,type:type};
  if(country && country!=="all") query={...query,country:country};
  if(rooms && rooms!=="all") query={...query,rooms:rooms};
  if(baths && baths!=="all") query={...query,baths:baths};
  if(property && property!=="all") query={...query,status:property};

if(query)
  filterResult = await Property.find(query).sort({created_at: -1}).populate({
    path: "user",
    select: "firstname lastname picture",
  });
else
   filterResult = await Property.find().sort({created_at: -1}).populate({
    path: "user",
    select: "firstname lastname picture",
  });

res.json(filterResult);

});


// @route   GET api/property/userFilter
// @desc    Filter property
// @access  user
router.get("/userFilter", async (req, res) => {
  var query=null;
  var filterResult;
  const { type,country,rooms,baths } = req.query;
  if(type && type!=="all") query={...query,type:type};
  if(country && country!=="all") query={...query,country:country};
  if(rooms && rooms!=="all") query={...query,rooms:rooms};
  if(baths && baths!=="all") query={...query,baths:baths};

if(query)
  filterResult = await Property.find({...query,user: { $ne: _id },status:'accepted'}).sort({created_at: -1}).populate({
    path: "user",
    select: "firstname lastname picture",
  });
else
   filterResult = await Property.find({user: { $ne: _id },status:'accepted'}).sort({created_at: -1}).populate({
    path: "user",
    select: "firstname lastname picture",
  });

res.json(filterResult);

});


// @route   GET api/property/userFilter
// @desc    Filter property
// @access  user
router.get("/clientFilter", async (req, res) => {
  var query=null;
  var filterResult;
  const { type,country,rooms,baths } = req.query;
  if(type && type!=="all") query={...query,type:type};
  if(country && country!=="all") query={...query,country:country};
  if(rooms && rooms!=="all") query={...query,rooms:rooms};
  if(baths && baths!=="all") query={...query,baths:baths};

if(query)
  filterResult = await Property.find({...query,status:'accepted'}).sort({created_at: -1}).populate({
    path: "user",
    select: "firstname lastname picture",
  });
else
   filterResult = await Property.find({status:'accepted'}).sort({created_at: -1}).populate({
    path: "user",
    select: "firstname lastname picture",
  });

res.json(filterResult);

});
// @route   POST api/v1/property/accepte
// @desc    POST accepte property
// @access  private
router.post("/accepte", admin, async (req, res) => {
  const{id}=req.body;
  const updated_user = await Property.findByIdAndUpdate(
    id,
    { status:'accepted'},  
    )
  res.json({message:"property accepted"});
});



module.exports = router;
