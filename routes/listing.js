const express = require("express");
const router = express.Router();

const path = require("path");
console.log(__dirname);
console.log(path.join(__dirname, "../controllers/listings.js"));

const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");

const {
    isLoggedIn,
  isOwner,
    validateListing,
} = require("../middleware.js");

const listingController = require("../controllers/listings.js");

const multer = require("multer");
const { storage } = require("../cloudConfig.js");

const upload = multer({ storage });


// INDEX ROUTE + CREATE ROUTE
router
.route("/")
.get(wrapAsync(listingController.index))
.post(
    isLoggedIn,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.createListing)
);


// NEW ROUTE
router.get(
    "/new",
    isLoggedIn,
    listingController.renderNewForm
);


// SEARCH ROUTE
router.get(
    "/search",
    wrapAsync(listingController.searchListings)
);


// SHOW, UPDATE, DELETE ROUTES
router
.route("/:id")

.get(
    wrapAsync(listingController.showListing)
)

.put(
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.updateListing)
)

.delete(
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.deleteListing)
);



router.get(
    "/:id/edit",
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.editListing)
);


module.exports = router;