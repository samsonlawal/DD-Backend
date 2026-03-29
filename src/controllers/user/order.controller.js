const mongoose = require("mongoose");
const Order = require("../../models/Order");
// const Coupon = require("../../models/Coupon");
const Product = require("../../models/Product");
const Counter = require("../../models/Counter");
const calculateOrderTotals = require("../../utils/calculateOrderTotals");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

exports.createOrder = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { items, couponCode, paymentMethod, shippingAddress } = req.body;

    if (!items || items.length === 0) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: "No items provided" });
    }

    // 1️⃣ Fetch products from DB
    const detailedItems = [];

    for (const item of items) {
      // NOTE: use .session(session) to ensure reads are part of transaction lock
      const product = await Product.findById(item.product).session(session);

      if (!product) {
        await session.abortTransaction();
        session.endSession();
        return res.status(404).json({
          message: `Product not found: ${item.product}`
        });
      }

      if (product.availableQuantity < item.quantity) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({
          message: `Insufficient stock for ${item.name}`
        });
      }

      detailedItems.push({
        product,
        quantity: item.quantity,
        image: item.image, // Pass frontend image so calculateOrderTotals has it
        name: item.name
      });
    }

    // 2️⃣ Fetch coupon (if provided)
    let coupon = null;

    if (couponCode) {
      // Not yet fully implemented, but passing session just in case
      // coupon = await Coupon.findOne({ code: couponCode, isActive: true }).session(session);
      // ... same error checks
    }

    // 3️⃣ Define tax + shipping
    const taxRate = 0.05; // 5%
    const shippingFee = 20; // example flat rate

    // 4️⃣ Calculate totals
    const totals = calculateOrderTotals({
      items: detailedItems,
      coupon,
      taxRate,
      shippingFee
    });

    // 4.5️⃣ Generate Sequential Order ID
    const counter = await Counter.findOneAndUpdate(
      { id: "orderId" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true, session }
    );
    
    // Format sequence to always be 4 digits (e.g., 0001)
    const formattedSeq = counter.seq.toString().padStart(4, "0");
    const orderId = `ORD${formattedSeq}`;

    // 5️⃣ Create Stripe Checkout Session
    const origin = req.headers.origin || process.env.CLIENT_URL || "http://localhost:3000";

    const stripeSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      success_url: `${origin}/order/success?order_id=${orderId}`,
      cancel_url: `${origin}/order/failed?order_id=${orderId}`,
      client_reference_id: req.user._id.toString(),
      metadata: { orderId },
      line_items: [
        {
          price_data: {
            currency: "gbp", // adjust if needed
            product_data: {
              name: `Order ${orderId}`,
            },
            unit_amount: Math.round(totals.total * 100),
          },
          quantity: 1,
        },
      ],
    });

    // 6️⃣ Create order (Inside Transaction)
    // When using transactions, `Order.create` must take an array of documents
    const createdOrders = await Order.create([{
      user: req.user._id,
      orderId,
      items: totals.orderItems,
      shippingAddress,
      subtotal: totals.subtotal,
      couponDiscount: totals.couponDiscount,
      paymentMethod,
      tax: totals.tax,
      shippingCost: totals.shipping,
      totalAmount: totals.total,
      status: "pending", 
      paymentStatus: "pending",
      stripeSessionId: stripeSession.id,
    }], { session });

    const order = createdOrders[0];

    // 7️⃣ Reduce stock (Inside Transaction)
    for (const item of detailedItems) {
      item.product.availableQuantity -= item.quantity;
      await item.product.save({ session });
    }

    // 8️⃣ Commit transaction
    await session.commitTransaction();
    session.endSession();

    // Return the checkout url to redirect the user
    res.status(201).json({
      success: true,
      url: stripeSession.url,
      order,
    });

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Order Creation Error:", error);
    res.status(500).json({ message: "Server error during order creation", error: error.message });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    let query;

    // Check if the provided id is a valid MongoDB ObjectId
    if (mongoose.Types.ObjectId.isValid(id)) {
      query = { _id: id, user: req.user._id };
    } else {
      // Otherwise, assume it's the human-readable orderId (e.g., ORD0001)
      query = { orderId: id, user: req.user._id };
    }

    const order = await Order.findOne(query)
      .populate("user", "name email phone")
      .populate("items.product", "name images price basePrice description brand");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found or you do not have permission to view it",
      });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.params.userId })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: "cancelled" },
      { new: true, runValidators: true },
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// What's missing:

// Payment provider logic
// Stock decrement
// Webhooks
// Order cancellation rules
