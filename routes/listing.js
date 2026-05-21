const express = require("express");
const router = express.Router();
const path = require("path"); console.log(__dirname); console.log(path.join(__dirname, "../controllers/listings.js"));

const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");

const { isLoggedIn, isOwner,validateListing } = require("../middleware.js");

const listingController=require("../controllers/listings.js");

router
.route("/")
.get(wrapAsync(listingController.index))
.post(
    isLoggedIn,
    validateListing,
    wrapAsync(listingController.createListing));

    
// NEW ROUTE
router.get("/new",
    isLoggedIn,listingController.renderNewForm
);

    router
    .route("/:id")
    .get( wrapAsync(listingController.showListing))
    .put(
    isLoggedIn,
isOwner,
validateListing,
wrapAsync(listingController.updateListing))
.delete(
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.deleteListing));


// EDIT ROUTE
router.get("/:id/edit",
    isLoggedIn,
    isOwner,

    wrapAsync(listingController.editListing));
module.exports = router;