const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Product = require("../models/Product");

dotenv.config();

const verifyFiltering = async () => {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB.");

    // Test cases
    const testCases = [
      { name: "No filters (status: active only)", filter: { status: "active" } },
      { name: "Filter by Category", filter: { status: "active", category: "Wine" } },
      { name: "Filter by Brand", filter: { status: "active", brand: "Heineken" } },
      { name: "Filter by Category and Brand", filter: { status: "active", category: "Beer", brand: "Guinness" } },
    ];

    for (const test of testCases) {
      console.log(`\nTesting: ${test.name}`);
      console.log(`Filter: ${JSON.stringify(test.filter)}`);
      
      const count = await Product.countDocuments(test.filter);
      const products = await Product.find(test.filter).limit(2).lean();
      
      console.log(`Results found: ${count}`);
      if (products.length > 0) {
        console.log(`Sample product: ${products[0].name} (Category: ${products[0].category}, Brand: ${products[0].brand})`);
      } else {
        console.log("No products found for this filter.");
      }
    }

    console.log("\nVerification complete.");
  } catch (error) {
    console.error("Verification failed:", error);
  } finally {
    await mongoose.connection.close();
  }
};

verifyFiltering();
