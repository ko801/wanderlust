const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

main()
   .then(() => {
      console.log("MongoDB connected successfully");
   })
   .catch((err) => {
      console.log(err);
   });

async function main() {
   await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}

const initDB = async () => {

   // delete old listings
   await Listing.deleteMany({});

   // add owner to every listing
   const sampleData = initData.data.map((obj) => ({
      ...obj,
      owner: "6a1691427232e9cb2a548712",
   }));

   // insert into DB
   await Listing.insertMany(sampleData);

   console.log("Database initialized successfully");
};

initDB();