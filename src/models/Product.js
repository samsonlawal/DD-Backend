const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    brand: {
      type: String,
      trim: true,
    },
    category: {
      type: String,
      required: true,
    },
    subCategory: {
      type: String,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    badge: {
      type: String,
    },
    tags: [
      {
        type: String,
      },
    ],
    description: {
      type: String,
      required: true,
    },

    basePrice: {
      type: Number,
      required: true,
      min: 0,
    },
    costPrice: {
      type: Number,
      min: 0,
    },
    availableQuantity: {
      type: Number,
      default: 0,
      min: 0,
    },
    lowStockThreshold: {
      type: Number,
      default: 10,
      min: 0,
    },

    // Shipping & Logistics
    shippingWeight: {
      type: Number,
      min: 0,
    },
    shippingClass: {
      type: String,
      enum: ["standard", "fragile"],
      default: "standard",
    },
    dimensions: {
      type: String,
    },

    images: [
      {
        type: String,
      },
    ],

    specifications: {
      volume: {
        type: String,
      },
      abv: {
        type: String,
      },
      origin: {
        type: String,
      },
    },
  },
  {
    timestamps: true,
  },
);

// Virtual to sync isActive with status
productSchema.virtual("activeStatus").get(function () {
  return this.status === "active";
});

module.exports = mongoose.model("Product", productSchema);
