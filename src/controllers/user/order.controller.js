const Order = require("../../models/Order");
// const Coupon = require("../../models/Coupon");
const Product = require("../../models/Product");
const Counter = require("../../models/Counter");
const calculateOrderTotals = require("../../utils/calculateOrderTotals");

exports.createOrder = async (req, res) => {
  try {
    const { items, couponCode, paymentMethod, shippingAddress } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No items provided" });
    }

    // 1️⃣ Fetch products from DB
    const detailedItems = [];

    for (const item of items) {
      const product = await Product.findById(item.product);

      if (!product) {
        return res.status(404).json({
          message: `Product not found: ${item.product}`
        });
      }

      if (product.availableQuantity < item.quantity) {
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

    console.log("Detailed Items after fetching from DB:", detailedItems.map(i => ({ 
      id: i.product._id, 
      price: i.product.price, 
      name: i.product.name 
    })));

    // 2️⃣ Fetch coupon (if provided)
    let coupon = null;

    if (couponCode) {
      coupon = await Coupon.findOne({
        code: couponCode,
        isActive: true
      });

      if (!coupon) {
        return res.status(400).json({
          message: "Invalid or expired coupon"
        });
      }

      if (coupon.expiresAt && coupon.expiresAt < new Date()) {
        return res.status(400).json({
          message: "Coupon has expired"
        });
      }
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
      { new: true, upsert: true }
    );
    
    // Format sequence to always be 4 digits (e.g., 0001)
    const formattedSeq = counter.seq.toString().padStart(4, "0");
    const orderId = `ORD${formattedSeq}`;

    // 5️⃣ Create order
    const order = await Order.create({
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
      status: "pending"
    });

    // 6️⃣ Reduce stock
    for (const item of detailedItems) {
      item.product.availableQuantity -= item.quantity;
      await item.product.save();
    }

    res.status(201).json(order);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user", "name email phone");

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
