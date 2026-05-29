const express = require("express");
const router = express.Router({ mergeParams: true });

const Listing = require("../models/listing.js");
const Review = require("../models/review.js");

const { reviewSchema } = require("../schema.js");

const ExpressError = require("../utils/ExpressError.js");
const wrapAsync = require("../utils/wrapAsync.js");

const reviewController=require("../controllers/reviews.js");

const { isLoggedIn,isReviewAuthor } = require("../middleware.js");


const validateReview = (req, res, next) => {

    let { error } = reviewSchema.validate(req.body);

    if (error) {

        let errMsg = error.details.map((el) => el.message).join(",");

        throw new ExpressError(400, errMsg);

    } else {

        next();
    }
};



router.post(
    "/:id/reviews",
    isLoggedIn,
    validateReview,
wrapAsync(reviewController.createReview)
);

router.delete(
    "/:id/reviews/:reviewId",
isLoggedIn,
isReviewAuthor,
    wrapAsync(reviewController.deleteReview));


module.exports = router;