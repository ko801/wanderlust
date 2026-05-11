const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const { listingSchema } = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn } = require("../middleware.js");

const validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);

    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

// INDEX

router.get("/", wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index", { allListings });
}));

// NEW
router.get("/new", isLoggedIn, (req, res) => {
    res.render("listings/new.ejs");
});

// CREATE
router.post("/",
    isLoggedIn,
    validateListing,
    wrapAsync(async (req, res) => {

        const newListing = new Listing(req.body.listing);
        await newListing.save();

        req.flash("success", "New Listing Created!");
        res.redirect("/listings");
}));

// EDIT
router.get("/:id/edit",
    isLoggedIn,
    wrapAsync(async (req, res) => {
        const { id } = req.params;
        const listing = await Listing.findById(id);

        res.render("listings/edit", { listing });
}));

// UPDATE
router.put("/:id",
    isLoggedIn,
    validateListing,
    wrapAsync(async (req, res) => {

        const { id } = req.params;

        await Listing.findByIdAndUpdate(id, {
            ...req.body.listing,
        });

        req.flash("success", "Listing Updated!");
        res.redirect(`/listings/${id}`);
}));

// DELETE
router.delete("/:id",
    isLoggedIn,
    wrapAsync(async (req, res) => {

        const { id } = req.params;

        await Listing.findByIdAndDelete(id);

        req.flash("success", "Listing Deleted!");
        res.redirect("/listings");
}));

module.exports = router;