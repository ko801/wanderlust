const mongoose = require("mongoose");
const axios = require("axios");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.join(__dirname, "../.env") });

const initData = require("./data.js");
const Listing = require("../models/listing.js");

const dbUrl = process.env.ATLASDB_URL;

main()
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(dbUrl);
}

const initDB = async () => {
  // delete old listings
  await Listing.deleteMany({});

  // create listings with geometry
  const sampleData = await Promise.all(
    initData.data.map(async (obj) => {
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
          : {
              type: "Point",
              coordinates: [0, 0],
            },
      };
    })
  );

  await Listing.insertMany(sampleData);

  console.log("Database initialized successfully");
  mongoose.connection.close();
};

main()
  .then(() => initDB())
  .catch((err) => console.log(err));