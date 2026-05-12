const express = require("express");
const router = express.Router();

const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");

const { isLoggedIn, isOwner,validateListing } = require("../middleware.js");



// INDEX ROUTE
router.get("/",
    wrapAsync(async (req, res) => {

        const allListings = await Listing.find({});

        res.render("listings/index", { allListings });
}));

console.log(isLoggedIn);
console.log(isOwner);
console.log(validateListing);

// NEW ROUTE
router.get("/new",
    isLoggedIn,
    (req, res) => {

        res.render("listings/new.ejs");
});

// CREATE ROUTE
router.post("/",
    isLoggedIn,
    validateListing,

    wrapAsync(async (req, res) => {

        const newListing = new Listing(req.body.listing);

        // owner add
        newListing.owner = req.user._id;

        await newListing.save();

        req.flash("success", "New Listing Created!");

        res.redirect("/listings");
}));

// EDIT ROUTE
router.get("/:id/edit",
    isLoggedIn,
    isOwner,

    wrapAsync(async (req, res) => {

        const { id } = req.params;

        const listing = await Listing.findById(id);

        // owner check
        if (!listing.owner.equals(res.locals.currUser._id)) {

            req.flash("error", "You are not the owner of this");

            return res.redirect(`/listings/${id}`);
        }

        res.render("listings/edit", { listing });
}));

// UPDATE ROUTE
router.put("/:id",
    isLoggedIn,
isOwner,
validateListing,
    wrapAsync(async (req, res) => {

        const { id } = req.params;

        await Listing.findByIdAndUpdate(id, {
            ...req.body.listing,
        });

        req.flash("success", "Listing Updated!");

        res.redirect(`/listings/${id}`);
}));

// DELETE ROUTE
router.delete("/:id",
    isLoggedIn,
    isOwner,

    wrapAsync(async (req, res) => {
        const { id } = req.params;
        await Listing.findByIdAndDelete(id);
        req.flash("success", "Listing Deleted!");
        res.redirect("/listings");
}));

module.exports = router;