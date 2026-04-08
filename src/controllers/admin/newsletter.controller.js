const NewsletterSubscriber = require("../../models/NewsletterSubscriber");

/**
 * Get all newsletter subscribers with pagination
 * GET /api/admin/newsletter
 */
exports.getAllSubscribers = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const skip = (page - 1) * limit;

    // Fetch subscribers sorted by newest first
    const subscribers = await NewsletterSubscriber.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Get total count for pagination metadata
    const total = await NewsletterSubscriber.countDocuments();

    res.status(200).json({
      success: true,
      count: subscribers.length,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
      data: subscribers,
    });
  } catch (error) {
    console.error("Error fetching newsletter subscribers:", error);
    res.status(500).json({
      success: false,
      message: "Server Error: Could not fetch subscribers",
      error: error.message,
    });
  }
};

/**
 * Get total subscriber count (for dashboard stats)
 * GET /api/admin/newsletter/stats
 */
exports.getSubscriberCount = async (req, res) => {
  try {
    const total = await NewsletterSubscriber.countDocuments();

    res.status(200).json({
      success: true,
      data: {
        totalSubscribers: total,
      },
    });
  } catch (error) {
    console.error("Error fetching newsletter count:", error);
    res.status(500).json({
      success: false,
      message: "Server Error: Could not fetch count",
      error: error.message,
    });
  }
};
