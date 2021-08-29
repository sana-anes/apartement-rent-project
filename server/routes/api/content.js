const express = require("express");
const router = express.Router();

const admin = require("../../middleware/admin");
const auth = require("../../middleware/auth");
const {Category} = require("../../models/category");
const { User } = require("../../models/User");
const { Country,} = require("../../models/country");
const { Property } = require("../../models/property");
const { Reservation } = require("../../models/reservation");

// @route   POST api/content/addCategory
// @desc    create a Category
// @access  Admin
router.post("/addCategory", admin, async (req, res) => {
  const label=req.body.label;
  const category= await Category.find({label:label});
  if(category.length !=0) return res.status(404).json({ message: "category already exist" });

  let newCategory = new Category({ label:label });
  newCategory = await newCategory.save();
  if (!newCategory) throw Error("Could not add category");
  return res.json(newCategory);
  
});

// @route   GET api/content/categories
// @desc    Get all category
// @access  public
router.get("/categories", async (req, res) => {
    const category = await Category.find();
    if (category.length === 0)
      return res.status(404).json({ message: "no such category" });
    res.json(category);
  });


  // @route   DELETE api/content/deleteCategory
// @desc   DELETE category
// @access  admin
router.delete("/deleteCategory",admin, async (req, res) => {
  const { id } = req.body;
  const category = await Category.findById(id);

  if (category === null)
    return res.status(400).json({ message: "Country not exists" });
  else {
    const category = await Category.findByIdAndDelete(id);
    res.json({
      message: "Category deleted",
    });
  }
});
//---------------------------------------------------------------//
// @route   POST api/content/addCountry
// @desc    create a Country
// @access  Admin
router.post("/addCountry", admin, async (req, res) => {
  let{label}=req.body;
  const country= await Country.find({label:label});
  if(country.length !=0) return res.status(404).json({ message: "country already exist" });

    let newCountry = new Country({label:label});
    newCountry = await newCountry.save();
    if (!newCountry) throw Error("Could not add Country");
    return res.json(newCountry);
  });



// @route   GET api/content/countries
// @desc    Get all country
// @access  public
router.get("/countries", async (req, res) => {
  const all_country = await Country.find();
  if (all_category.length === 0)
    return res.status(404).json({ message: "no such category" });
  res.json(all_country);
});

// @route   DELETE api/content/deleteCountry
// @desc   DELETE country
// @access  admin
router.delete("/deleteCountry",admin, async (req, res) => {
  const { id } = req.body;
  const country = await Country.findById(id);

  if (country === null)
    return res.status(400).json({ message: "Country not exists" });
  else {
    const country = await Country.findByIdAndDelete(id);
    res.json({
      message: "Country deleted",
    });
  }
});

// @route   GET api/content/
// @desc    Get content
// @access  public
router.get("/content", async (req, res) => {
  const all_country = await Country.find();
  const all_category = await Category.find();
  res.json({country:all_country,category:all_category});
});

// @route   GET api/content/
// @desc    Get content
// @access  public
router.get("/count", async (req, res) => {
  const all_users = await User.find({isAdmin:false});
  const all_properties = await Property.find({status:'accepted'});
  const all_reservations = await Reservation.find();

  res.json({users:all_users.length, properties: all_properties.length,reservations:all_reservations.length});
});


module.exports = router;