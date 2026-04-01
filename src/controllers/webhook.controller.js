const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Order = require("../models/Order");
const Product = require("../models/Product");
const { sendOrderProgressEmail } = require("../utils/email");

exports.handleStripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

    try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        
        // Find order by the metadata we passed
        const orderId = session.metadata.orderId;
        
        if (session.payment_status === "paid" && orderId) {
          const paidOrder = await Order.findOneAndUpdate(
            { orderId },
            { paymentStatus: "paid", status: "processing" },
            { new: true }
          ).populate("user", "name email");
          if (paidOrder) {
            console.log(`Order ${paidOrder.orderId} successfully paid!`);
            if (paidOrder.user && paidOrder.user.email) {
              sendOrderProgressEmail(paidOrder.user.email, paidOrder.user.name, paidOrder.orderId, "payment confirmed").catch(console.error);
            }
          }
        }
        break;
      }
      
      case "checkout.session.expired": {
        const session = event.data.object;
        const orderId = session.metadata.orderId;

        if (orderId) {
          const failedOrder = await Order.findOneAndUpdate(
            { orderId },
            { paymentStatus: "failed", status: "cancelled" },
            { new: true }
          );

          if (failedOrder) {
            // Restore stock
            for (const item of failedOrder.items) {
              await Product.findByIdAndUpdate(item.product, {
                 $inc: { availableQuantity: item.quantity }
              });
            }
            console.log(`Checkout expired for Order ${failedOrder.orderId}. Order cancelled and stock restored.`);
          }
        }
        break;
      }
      
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error("Error processing webhook:", error);
    res.status(500).json({ message: "Webhook handler failed" });
  }
};
