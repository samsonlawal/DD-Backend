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
      index: true,
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
      // required: true,
      min: 0,
    },
    costPrice: {
      type: Number,
      required: true,
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
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        // ABV Unit Format
        if (ret.specifications?.abv) {
          const abv = ret.specifications.abv.toString().trim();
          if (!abv.endsWith("%")) {
            ret.specifications.abv = `${abv} %`;
          }
        }
        
        // Volume Unit Format
        if (ret.specifications?.volume) {
          const vol = ret.specifications.volume.toString().trim();
          if (!vol.toLowerCase().endsWith("cl") && !vol.toLowerCase().endsWith("ml") && !vol.toLowerCase().endsWith("l")) {
            ret.specifications.volume = `${vol} cl`;
          }
        }

        // Shipping Weight Unit Format
        if (ret.shippingWeight !== undefined && ret.shippingWeight !== null) {
          const weight = ret.shippingWeight.toString().trim();
          if (!weight.toLowerCase().endsWith("kg") && !weight.toLowerCase().endsWith("g")) {
            ret.shippingWeight = `${weight} kg`;
          }
        }

        delete ret.__v;
        return ret;
      }
    },
    toObject: { virtuals: true }
  },
);

// Compound Index for default sorting and status filtering
productSchema.index({ status: 1, createdAt: -1 });

// Search Field Indexes
productSchema.index({ category: 1 });
productSchema.index({ subCategory: 1 });
productSchema.index({ brand: 1 });
productSchema.index({ tags: 1 });
productSchema.index({ basePrice: 1 });

// Virtual to sync isActive with status
productSchema.virtual("activeStatus").get(function () {
  return this.status === "active";
});

module.exports = mongoose.model("Product", productSchema);
