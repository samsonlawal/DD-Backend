const Order = require("../../models/Order");
const { sendOrderProgressEmail } = require("../../utils/email");

// Statuses that should trigger a customer notification email
const NOTIFIABLE_STATUSES = new Set([
  "processing",
  "dispatched",
  "shipped",
  "on its way",
  "delivered",
  "cancelled",
]);

exports.getAllOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const { status } = req.query;
    const filter = {};
    if (status && status !== "all") {
      filter.status = status;
    }

    const orders = await Order.find(filter)
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Order.countDocuments(filter);

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
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user", "name email phone")
      .populate("items.product", "name images price basePrice description brand");

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    res.status(200).json({ success: true, data: order });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.params.userId }).sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { status, message } = req.body;
    const cleanStatus = status?.trim().toLowerCase();

    if (!cleanStatus) {
      return res.status(400).json({ success: false, message: "Status is required" });
    }

    // Validate against schema enum
    const validStatuses = Order.schema.path("status").options.enum;
    if (!validStatuses.includes(cleanStatus)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status "${cleanStatus}". Valid values: ${validStatuses.join(", ")}`,
      });
    }

    const order = await Order.findById(req.params.id).populate("user", "name email");

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    // Update status
    order.status = cleanStatus;

    // Record in history
    order.statusHistory.push({
      status: cleanStatus,
      timestamp: new Date(),
      message: message || `Order status updated to ${cleanStatus}`,
    });

    await order.save();

    console.log(`✅ Order ${order.orderId} status updated to "${cleanStatus}"`);

    // Send customer notification for key delivery milestones
    if (NOTIFIABLE_STATUSES.has(cleanStatus) && order.user?.email) {
      sendOrderProgressEmail(
        order.user.email,
        order.user.name,
        order.orderId,
        cleanStatus,
        message
      ).catch((err) =>
        console.error(
          `❌ Failed to send progress email for ${order.orderId} (${cleanStatus}):`,
          err.message
        )
      );
    }

    res.status(200).json({ success: true, data: order });
  } catch (error) {
    console.error("updateOrderStatus error:", error);
    res.status(400).json({ success: false, message: error.message });
  }
};
