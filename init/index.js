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
   // purana data delete
   await Listing.deleteMany({});

   // owner add karna har listing me
   const sampleData = initData.data.map((obj) => ({
      ...obj,
      owner: "69fc6367a0b8242a97da23fc",
   }));

   // database me insert
   await Listing.insertMany(sampleData);

   console.log("Database initialized successfully");
};

initDB();