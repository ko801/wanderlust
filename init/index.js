const mongoose = require("mongoose");
const axios = require("axios");

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

  // create listings with geometry
  const sampleData = await Promise.all(
    initData.data.map(async (obj) => {

      // get coordinates from location
      const response = await axios.get(
        "https://nominatim.openstreetmap.org/search",
        {
          params: {
            q: obj.location,
            format: "json",
            limit: 1,
          },
          headers: {
            "User-Agent": "wanderlust-app",
          },
        }
      );

      const data = response.data[0];

      return {
        ...obj,
        owner: "6a1691427232e9cb2a548712",

        geometry: data
          ? {
              type: "Point",
              coordinates: [
                parseFloat(data.lon),
                parseFloat(data.lat),
              ],
            }
          : undefined,
      };
    })
  );

  // insert into DB
  await Listing.insertMany(sampleData);

  console.log("Database initialized successfully");
};

initDB();