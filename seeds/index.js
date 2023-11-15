const mongoose = require("mongoose");
const cities = require("./cities");
const axios = require("axios");
const Campground = require("../models/campground");
const { places, descriptors } = require("./seedHelpers");
mongoose.connect("mongodb://127.0.0.1:27017/yelp-camp");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding')
const mapBoxToken= 'pk.eyJ1IjoiZGhlZXJhanNhcmFuYSIsImEiOiJjbG94eW1neW8xYTlyMnZuenl4Z3l1OG41In0.MUZ8iUjPWrRgmbiC8Jn8HQ';
const geocoder=mbxGeocoding({accessToken: mapBoxToken})


const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

// async function seedImg() {
//   try {
//     const resp = await axios.get("https://api.unsplash.com/photos/random", {
//       params: {
//         client_id: "KNTjdIBHp7S1t4iM8nCmMBtsgM8G4Wtrx_0kNhAlU94",
//         collections: 1114848,
//       },
//     });
//     return resp.data.urls.small;
//   } catch (err) {
//     console.error(err);
//   }
// }

const seedDB = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 400; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 20) + 10;
    const location = `${cities[random1000].name}, ${cities[random1000].state}`;
    const geoData = await geocoder.forwardGeocode({
      query: `${location}`,
      limit: 1
    }).send()
    const camp = new Campground({
      author: "65518baa185bc600ff5407d9",
      location: location,
      title: `${sample(descriptors)} ${sample(places)}`,
      description:
        "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Possimus sit, sequi molestiae ullam amet maiores cum dolores? Eius eveniet neque facere repudiandae sint, aliquid pariatur atque voluptatibus optio accusantium error.",
      price: price,
      geometry:geoData.body.features[0].geometry,
      images:  [
        {
          url: 'https://res.cloudinary.com/saranadheeraj/image/upload/v1699934471/YelpCamp/jbfkea4gzrswuwjjlwrs.jpg',
          filename: 'YelpCamp/jbfkea4gzrswuwjjlwrs',
        },
        {
          url: 'https://res.cloudinary.com/saranadheeraj/image/upload/v1699934479/YelpCamp/scemueyw8juzrm74k7xw.jpg',
          filename: 'YelpCamp/scemueyw8juzrm74k7xw',
        }
      ],
    });
    await camp.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
