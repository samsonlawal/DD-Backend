const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    orderId: {
      type: String,
      unique: true,
      required: true,
    },

    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        price: {
          type: Number,
          required: true,
        },
        image: {
          type: String,
        },
        name: {
          type: String,
          required: true,
        },
      },
    ],

    subtotal: {
      type: Number,
      required: true,
      default: 0,
    },

    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    status: {
      type: String,
      enum: [
        "pending",
        "payment confirmed",
        "processing",
        "dispatched",
        "shipped",
        "on its way",
        "delivered",
        "cancelled",
      ],
      default: "pending",
    },

    statusHistory: [
      {
        status: String,
        timestamp: { type: Date, default: Date.now },
        message: String,
      },
    ],

    shippingAddress: {
      addressLine1: {
        type: String,
        required: true,
      },
      addressLine2: {
        type: String,
      },
      city: {
        type: String,
        required: true,
      },
      state: {
        type: String,
        required: true,
      },
      postCode: {
        type: String,
        required: true,
      },
      country: {
        type: String,
        required: true,
      },
      phone: {
        type: String,
      },
    },

    shippingCost: {
      type: Number,
      default: 0,
    },

    tax: {
      type: Number,
      default: 0,
    },

    couponDiscount: {
      type: Number,
      default: 0,
    },

    paymentMethod: {
      type: String,
      enum: ["card", "cash", "transfer"],
      required: true,
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "delivered", "collected", "failed", "refunded", "cancelled"],
      default: "pending",
    },

    stripeSessionId: {
      type: String,
    },
    transactionId: {
      type: String,
    },

    ageVerification: {
      isVerified: {
        type: Boolean,
        required: true,
      },
      timestamp: {
        type: Date,
        default: Date.now,
      },
      ipAddress: {
        type: String,
      },
      dob: {
        type: Date,
      },
      ageAtOrder: {
        type: Number,
      },
      userAgent: {
        type: String,
      },
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Order", orderSchema);
