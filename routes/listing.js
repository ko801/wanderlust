const express = require("express");
const router = express.Router();
const path = require("path"); console.log(__dirname); console.log(path.join(__dirname, "../controllers/listings.js"));

const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");

const { isLoggedIn, isOwner,validateListing } = require("../middleware.js");

const listingController=require("../controllers/listings.js");

// INDEX ROUTE
router.get("/",wrapAsync(listingController.index));

console.log(isLoggedIn);
console.log(isOwner);
console.log(validateListing);

// NEW ROUTE
router.get("/new",
    isLoggedIn,listingController.renderNewForm
);


router.get("/:id", wrapAsync(listingController.showListing));

// CREATE ROUTE
router.post("/",
    isLoggedIn,
    validateListing,
    wrapAsync(listingController.createListing));


// EDIT ROUTE
router.get("/:id/edit",
    isLoggedIn,
    isOwner,

    wrapAsync(listingController.editListing));

// UPDATE ROUTE
router.put("/:id",
    isLoggedIn,
isOwner,
validateListing,
    wrapAsync(listingController.updateListing));

// DELETE ROUTE
router.delete("/:id",
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.deleteListing));

module.exports = router;