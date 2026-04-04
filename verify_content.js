const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const Product = require("./src/models/Product");

async function check() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to DB");

  const bestSellers = await Product.find({
    status: "active",
    tags: { $in: ["best seller"] }
  });

  console.log(`Found ${bestSellers.length} best sellers`);
  bestSellers.forEach(p => {
    console.log(`- ${p.name} (Tags: ${p.tags.join(", ")})`);
  });

  process.exit(0);
}

check().catch(err => {
  console.error(err);
  process.exit(1);
});
