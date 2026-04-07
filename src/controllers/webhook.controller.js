const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Order = require("../models/Order");
const Product = require("../models/Product");
const { sendOrderSuccessEmail } = require("../utils/email");

exports.handleStripeWebhook = async (req, res) => {
  console.log("🔔 Stripe Webhook Received!");
  const sig = req.headers["stripe-signature"];
  
  if (!sig) {
    console.warn("⚠️ Webhook received without stripe-signature header!");
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
    console.log(`✅ Webhook verified: ${event.type}`);
  } catch (err) {
    console.error(`❌ Webhook signature verification failed: ${err.message}`);
    console.log("Check if STRIPE_WEBHOOK_SECRET in .env matches your Stripe CLI/Dashboard secret.");
    return res.status(400).json({ success: false, message: `Webhook Error: ${err.message}` });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        const orderId = session.metadata.orderId;

        if (session.payment_status === "paid" && orderId) {
          // Populate user + items so the receipt email has full details
          const paidOrder = await Order.findOneAndUpdate(
            { orderId },
            {
              paymentStatus: "paid",
              transactionId: session.payment_intent,
              status: "processing", 
              $push: {
                statusHistory: {
                  status: "processing",
                  timestamp: new Date(),
                  message: "Payment confirmed. Order is now being processed.",
                },
              },
            },
            { new: true }
          )
            .populate("user", "name email")
            .populate("items.product", "name images");

            if (paidOrder) {
            console.log(`✅ Order ${paidOrder.orderId} successfully paid. Incrementing soldCount and sending confirmation email...`);
            
            // Increment soldCount for each item
            for (const item of paidOrder.items) {
              await Product.findByIdAndUpdate(item.product, {
                $inc: { soldCount: item.quantity },
              });
            }

            // Fire-and-forget — don't block the webhook response
            sendOrderSuccessEmail(paidOrder).catch((err) =>
              console.error(`❌ Failed to send order success email for ${paidOrder.orderId}:`, err.message)
            );
          } else {
            console.warn(`⚠️ Webhook: Order not found for orderId=${orderId}`);
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
            {
              paymentStatus: "failed",
              status: "cancelled",
              $push: {
                statusHistory: {
                  status: "cancelled",
                  timestamp: new Date(),
                  message: "Checkout session expired. Order cancelled and stock restored.",
                },
              },
            },
            { new: true }
          );

          if (failedOrder) {
            // Restore stock
            for (const item of failedOrder.items) {
              await Product.findByIdAndUpdate(item.product, {
                $inc: { availableQuantity: item.quantity },
              });
            }
            console.log(`Order ${failedOrder.orderId} expired. Stock restored.`);
          }
        }
        break;
      }

      default:
        console.log(`Unhandled Stripe event: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error("Error processing webhook:", error);
    res.status(500).json({ success: false, message: "Webhook handler failed" });
  }
};
