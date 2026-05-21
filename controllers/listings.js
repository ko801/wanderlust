const Listing=require("../models/listing");
module.exports.index=async (req, res) => {

        const allListings = await Listing.find({});

        res.render("listings/index", { allListings });
};

module.exports.renderNewForm=(req, res) => {

        res.render("listings/new.ejs");
};
// show ROUTE


module.exports.showListing= async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id).populate({path:"reviews",populate:{path:"author"},}).populate("owner");
    if(!listing){
     req.flash("error"," listing you requested does not exist!");
     res.redirect("/listings");
    }
    res.render("listings/show", { listing });
};

// create ROUTE


module.exports.createListing=async (req, res) => {

        const newListing = new Listing(req.body.listing);

        // owner add
        newListing.owner = req.user._id;

        await newListing.save();

        req.flash("success", "New Listing Created!");

        res.redirect("/listings");
};

// edit ROUTE


module.exports.editListing=async (req, res) => {

        const { id } = req.params;

        const listing = await Listing.findById(id);

        // owner check
        if (!listing.owner.equals(res.locals.currUser._id)) {

            req.flash("error", "You are not the owner of this");

            return res.redirect(`/listings/${id}`);
        }

        res.render("listings/edit", { listing });
};
// update ROUTE


module.exports.updateListing=async (req, res) => {

        const { id } = req.params;

        await Listing.findByIdAndUpdate(id, {
            ...req.body.listing,
        });

        req.flash("success", "Listing Updated!");

        res.redirect(`/listings/${id}`);
};

// DELETE ROUTE

module.exports.deleteListing= async (req, res) => {
        const { id } = req.params;
        await Listing.findByIdAndDelete(id);
        req.flash("success", "Listing Deleted!");
        res.redirect("/listings");
};

