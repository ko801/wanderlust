const express = require("express");
const router = express.Router({ mergeParams: true });

const Review = require("../models/review.js");
const Listing = require("../models/listing.js");

const wrapAsync = require("../utils/wrapAsync.js");
const reviewController = require("../controllers/reviews.js");

const { isLoggedIn, isReviewAuthor } = require("../middleware.js");
const { reviewSchema } = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");

/* VALIDATION */
const validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);

    if (error) {
        let msg = error.details.map(el => el.message).join(",");
        throw new ExpressError(400, msg);
    }
    next();
};

/* CREATE REVIEW */
router.post(
    "/",
    isLoggedIn,
    validateReview,
    wrapAsync(reviewController.createReview)
);

/* DELETE REVIEW */
router.delete(
    "/:reviewId",
    isLoggedIn,
    isReviewAuthor,
    wrapAsync(reviewController.deleteReview)
);

module.exports = router;