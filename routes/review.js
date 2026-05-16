const express = require("express");
const router = express.Router({ mergeParams: true });

const Listing = require("../models/listing.js");
const Review = require("../models/review.js");

const { reviewSchema } = require("../schema.js");

const ExpressError = require("../utils/ExpressError.js");
const wrapAsync = require("../utils/wrapAsync.js");

const { isLoggedIn,isReviewAuthor } = require("../middleware.js");

// REVIEW VALIDATION
const validateReview = (req, res, next) => {

    let { error } = reviewSchema.validate(req.body);

    if (error) {

        let errMsg = error.details.map((el) => el.message).join(",");

        throw new ExpressError(400, errMsg);

    } else {

        next();
    }
};


// CREATE REVIEW ROUTE
router.post(
    "/:id/reviews",
    isLoggedIn,
    validateReview,

    wrapAsync(async (req, res) => {

        let listing = await Listing.findById(req.params.id);

        if (!listing) {

            throw new ExpressError(404, "Listing not found");
        }

        let newReview = new Review(req.body.review);

        // ADD AUTHOR
        newReview.author = req.user._id;

        // PUSH REVIEW
        listing.reviews.push(newReview);

        // SAVE
        await newReview.save();
        await listing.save();

        req.flash("success", "New Review Created!");

        res.redirect(`/listings/${listing._id}`);
}));


// DELETE REVIEW ROUTE
router.delete(
    "/:id/reviews/:reviewId",
isLoggedIn,
isReviewAuthor,
    wrapAsync(async (req, res) => {

        let { id, reviewId } = req.params;

        await Listing.findByIdAndUpdate(id, {
            $pull: { reviews: reviewId }
        });

        await Review.findByIdAndDelete(reviewId);

        req.flash("success", "Review Deleted!");

        res.redirect(`/listings/${id}`);
}));


module.exports = router;