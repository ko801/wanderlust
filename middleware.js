const Listing = require("./models/listing");
const Review = require("./models/review");

const { listingSchema, reviewSchema } = require("./schema.js");

const ExpressError = require("./utils/ExpressError.js");


// LOGIN CHECK
const isLoggedIn = (req, res, next) => {

    if (!req.isAuthenticated()) {

        req.session.redirectUrl = req.originalUrl;

        req.flash("error", "You must be logged in first!");

        return res.redirect("/login");
    }

    next();
};


// SAVE REDIRECT URL
const saveRedirectUrl = (req, res, next) => {

    if (req.session.redirectUrl) {

        res.locals.redirectUrl = req.session.redirectUrl;
    }

    next();
};


// OWNER CHECK
const isOwner = async (req, res, next) => {

    const { id } = req.params;

    let listing = await Listing.findById(id);

    if (!listing.owner.equals(res.locals.currUser._id)) {

        req.flash("error", "You are not the owner of this listing");

        return res.redirect(`/listings/${id}`);
    }

    next();
};


// REVIEW AUTHOR CHECK
const isReviewAuthor = async (req, res, next) => {

    const { id, reviewId } = req.params;

    let review = await Review.findById(reviewId);

    if (!review.author.equals(res.locals.currUser._id)) {

        req.flash("error", "You did not create this review");

        return res.redirect(`/listings/${id}`);
    }

    next();
};


// JOI VALIDATION FOR LISTING
const validateListing = (req, res, next) => {

    let { error } = listingSchema.validate(req.body);

    if (error) {

        let errMsg = error.details.map((el) => el.message).join(",");

        throw new ExpressError(400, errMsg);
    }

    next();
};


// JOI VALIDATION FOR REVIEW
const validateReview = (req, res, next) => {

    let { error } = reviewSchema.validate(req.body);

    if (error) {

        let errMsg = error.details.map((el) => el.message).join(",");

        throw new ExpressError(400, errMsg);
    }

    next();
};


// EXPORTS
module.exports = {
    isLoggedIn,
    saveRedirectUrl,
    isOwner,
    isReviewAuthor,
    validateListing,
    validateReview,
};