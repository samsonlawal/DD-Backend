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
    const { items, couponCode, paymentMethod, shippingAddress, ageVerified } = req.body;

    if (!items || items.length === 0) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ success: false, message: "No items provided" });
    }

    // 0️⃣ Profile Completeness Check
    if (!req.user.name || !req.user.phone || !req.user.dob) {
      const missing = [];
      if (!req.user.name) missing.push("Name");
      if (!req.user.phone) missing.push("Phone Number");
      if (!req.user.dob) missing.push("Date of Birth");

      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        success: false,
        message: `Please complete your profile before ordering. Missing: ${missing.join(", ")}`,
      });
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
          success: false,
          message: `Product not found: ${item.product}`
        });
      }

      if (product.availableQuantity < item.quantity) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({
          success: false,
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
    const taxRate = 0; // 5%
    const shippingFee = 0; // Free shipping

    // 4️⃣ Calculate totals
    const totals = calculateOrderTotals({
      items: detailedItems,
      coupon,
      taxRate,
      shippingFee
    });

    // 4.1 Check for minimum order amount (Stripe GBP minimum is £0.30)
    if (totals.total < 0.30) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ 
        success: false,
        message: "The total order amount must be at least £0.30 to proceed with checkout." 
      });
    }

    // 4.2 Legal Age Verification Check (Backend Guard)
    const userAge = Math.floor((new Date() - new Date(req.user.dob)) / (1000 * 60 * 60 * 24 * 365.25));
    if (userAge < 18) {
      await session.abortTransaction();
      session.endSession();
      return res.status(403).json({ 
        success: false,
        message: "You must be at least 18 years of age to purchase products from this store." 
      });
    }

    // 4.5️⃣ Pre-generate MongoDB ID for the order
    const mongoOrderId = new mongoose.Types.ObjectId();

    // 4.6️⃣ Generate Sequential Order ID
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

    // Expire checkout session after 30 minutes (minimum allowed by Stripe) to prevent locking up stock
    const expiresAt = Math.floor(Date.now() / 1000) + (30 * 60);

    const stripeSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      expires_at: expiresAt,
      success_url: `${origin}/order/success?order_id=${mongoOrderId}`,
      cancel_url: `${origin}/order/failed?order_id=${mongoOrderId}`,
      client_reference_id: req.user._id.toString(),
      metadata: { 
        orderId,
        mongo_order_id: mongoOrderId.toString(),
        isAgeVerified: "true", 
        ageAtOrder: req.user.dob ? Math.floor((new Date() - new Date(req.user.dob)) / (1000 * 60 * 60 * 24 * 365.25)).toString() : "N/A"
      },
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
      _id: mongoOrderId,
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
      ageVerification: {
        isVerified: ageVerified,
        timestamp: new Date(),
        ipAddress: req.ip || req.headers["x-forwarded-for"] || req.connection.remoteAddress,
        dob: req.user.dob,
        ageAtOrder: userAge,
        userAgent: req.headers["user-agent"],
      },
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

    const orderObject = order.toObject();
    delete orderObject.ageVerification;

    // Return the checkout url to redirect the user
    res.status(201).json({
      success: true,
      url: stripeSession.url,
      order: orderObject,
    });

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Order Creation Error:", error);
    res.status(500).json({ success: false, message: error.message });
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
      .populate("items.product", "name images price basePrice costPrice description brand")
      .select("-ageVerification");

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
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const orders = await Order.find({ user: req.params.userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select("-ageVerification");

    const total = await Order.countDocuments({ user: req.params.userId });

    res.status(200).json({
      success: true,
      count: orders.length,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
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
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.user._id }).session(session);

    if (!order) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (order.status === "cancelled") {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        success: false,
        message: "Order is already cancelled",
      });
    }

    // Only allow cancellation of pending/processing/payment confirmed orders
    const allowedForCancellation = ["pending", "payment confirmed", "processing"];
    if (!allowedForCancellation.includes(order.status)) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        success: false,
        message: `Order cannot be cancelled as it is already ${order.status}`,
      });
    }

    // Restore stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(
        item.product,
        { $inc: { availableQuantity: item.quantity } },
        { session }
      );
    }

    order.status = "cancelled";
    order.statusHistory.push({
      status: "cancelled",
      timestamp: new Date(),
      message: "Order cancelled by user. Stock restored.",
    });

    await order.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      success: true,
      message: "Order cancelled and stock restored",
      data: order,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
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
