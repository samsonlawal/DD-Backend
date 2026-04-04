const mongoose = require("mongoose");
const Product = require("./src/models/Product");

const testFormatting = () => {
    console.log("--- Starting Unit Formatting Test ---");

    // Create a mock product object (not saved to DB)
    const mockProduct = new Product({
        name: "Test Drink",
        category: "Test",
        description: "Test description",
        basePrice: 10,
        costPrice: 5,
        shippingWeight: 1.5,
        specifications: {
            volume: "75",
            abv: "12.5",
            origin: "France"
        }
    });

    // Convert to JSON (this triggers the transform)
    const jsonOutput = mockProduct.toJSON();

    console.log("Original Weight (Number):", mockProduct.shippingWeight);
    console.log("Formatted Weight (String in JSON):", jsonOutput.shippingWeight);
    
    console.log("Original ABV:", mockProduct.specifications.abv);
    console.log("Formatted ABV:", jsonOutput.specifications.abv);
    
    console.log("Original Volume:", mockProduct.specifications.volume);
    console.log("Formatted Volume:", jsonOutput.specifications.volume);

    // Assertions
    let success = true;
    if (jsonOutput.shippingWeight !== "1.5 kg") {
        console.error("FAIL: Weight formatting failed");
        success = false;
    }
    if (jsonOutput.specifications.abv !== "12.5 %") {
        console.error("FAIL: ABV formatting failed");
        success = false;
    }
    if (jsonOutput.specifications.volume !== "75 cl") {
        console.error("FAIL: Volume formatting failed");
        success = false;
    }

    if (success) {
        console.log("SUCCESS: All units formatted correctly!");
    } else {
        console.error("FAILURE: Some units did not format correctly.");
    }
};

testFormatting();
