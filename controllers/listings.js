const axios = require("axios");
const Listing=require("../models/listing");


module.exports.index=async (req, res) => {
    const { category } = req.query;
    let allListings;
    if (category) {
        allListings = await Listing.find({ category });
    } else {
        allListings = await Listing.find({});
    }
    res.render("listings/index", { allListings, currCategory: category || null });
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
     return res.redirect("/listings");
    }
    res.render("listings/show", { listing });
};

// create ROUTE
module.exports.createListing = async (req, res) => {

    let url = req.file.path;
    let filename = req.file.filename;

    
    let location = req.body.listing.location;

    // convert location -> coordinates
    const response = await axios.get(
        "https://nominatim.openstreetmap.org/search",
        {
            params: {
                q: location,
                format: "json",
                limit: 1,
            },
            headers: {
                "User-Agent": "wanderlust-app",
            },
        }
    );

    const data = response.data[0];

    const newListing = new Listing(req.body.listing);

    newListing.owner = req.user._id;
    newListing.image = { url, filename };

    // dynamic coordinates
    if (data) {
        newListing.geometry = {
            type: "Point",
            coordinates: [
                parseFloat(data.lon),
                parseFloat(data.lat),
            ],
        };
    }

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

        let origimalImageUrl=listing.image.url;
       origimalImageUrl= origimalImageUrl.replace("/upload","/upload/h_300,w_250")
        res.render("listings/edit", { listing ,origimalImageUrl});
};

// update ROUTE
module.exports.updateListing=async (req, res) => {
        const { id } = req.params;
      let listing=  await Listing.findByIdAndUpdate(id, {
            ...req.body.listing,
        });
        if(typeof req.file !=="undefined"){
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image={url,filename};
    await listing.save();
        }
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

module.exports.searchListings = async (req, res) => {

    let { q } = req.query;

    // empty search
    if (!q || q.trim() === "") {
        req.flash("error", "Please enter a location");
        return res.redirect("/listings");
    }

    q = q.trim();

    // search by location only
    const allListings = await Listing.find({
        location: {
            $regex: q,
            $options: "i",
        },
    });

    // no listings found
    if (allListings.length === 0) {
        req.flash("error", "No listings found for this location");
        return res.redirect("/listings");
    }

    res.render("listings/index", {
        allListings,
        currCategory: null,
    });
};
