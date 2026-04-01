const { sendEmail } = require("../utils/email");
const NewsletterSubscriber = require("../models/NewsletterSubscriber");
const newsletterConfirmationTemplate = require("../templates/newsletterConfirmation");
const newsletterAdminNotificationTemplate = require("../templates/newsletterAdminNotification");

exports.subscribe = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email address is required.",
      });
    }

    // Validate basic email format
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address.",
      });
    }

    // Check for existing subscriber
    const existing = await NewsletterSubscriber.findOne({
      email: email.toLowerCase().trim(),
    });

    if (existing) {
      return res.status(409).json({
        success: false,
        message: "This email is already subscribed to our newsletter.",
      });
    }

    // Save new subscriber
    const subscriber = await NewsletterSubscriber.create({
      email: email.toLowerCase().trim(),
    });

    const adminEmail =
      process.env.ADMIN_EMAIL || "support@discountdrinksandmoreltd.co.uk";

    // 1. Send confirmation email to subscriber
    await sendEmail({
      to: subscriber.email,
      subject: "Welcome to Discount Drinks Newsletter! 🎉",
      html: newsletterConfirmationTemplate(subscriber.email),
    });

    // 2. Notify admin of new subscriber
    await sendEmail({
      to: adminEmail,
      subject: "New Newsletter Subscriber — Discount Drinks",
      html: newsletterAdminNotificationTemplate(
        subscriber.email,
        subscriber.subscribedAt
      ),
    });

    return res.status(201).json({
      success: true,
      message:
        "You've successfully subscribed! Check your inbox for a confirmation email.",
    });
  } catch (error) {
    console.error("Newsletter Subscribe Error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};
