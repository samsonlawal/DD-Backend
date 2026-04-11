const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Order = require("../models/Order");
const Product = require("../models/Product");
const { sendOrderSuccessEmail, sendStoreOrderNotificationEmail } = require("../utils/email");

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
        const mongoOrderId = session.metadata.mongo_order_id;
        const fallbackOrderId = session.metadata.orderId;

        console.log(`💳 Checkout session completed!`);
        console.log(`   Session ID: ${session.id}`);
        console.log(`   Payment Status: ${session.payment_status}`);
        console.log(`   Metadata Order IDs: Mongo=${mongoOrderId}, Human=${fallbackOrderId}`);

        if (session.payment_status === "paid") {
          // Use mongo_order_id if available, otherwise fallback to orderId
          const query = mongoOrderId ? { _id: mongoOrderId } : { orderId: fallbackOrderId };
          
          console.log(`🔍 Searching for order with query:`, JSON.stringify(query));

          const paidOrder = await Order.findOneAndUpdate(
            query,
            {
              paymentStatus: "paid",
              transactionId: session.payment_intent,
              status: "processing", 
              $push: {
                statusHistory: {
                  status: "processing",
                  timestamp: new Date(),
                  message: "Payment confirmed via Stripe. Order is now being processed.",
                },
              },
            },
            { new: true }
          )
            .populate("user", "name email")
            .populate("items.product", "name images");

          if (paidOrder) {
            console.log(`✅ Order ${paidOrder.orderId} (ID: ${paidOrder._id}) found and updated to PAID.`);
            
            // Increment soldCount for each item
            for (const item of paidOrder.items) {
              if (item.product) {
                await Product.findByIdAndUpdate(item.product._id || item.product, {
                  $inc: { soldCount: item.quantity },
                });
              }
            }

            console.log(`📧 Dispatching confirmation emails...`);
            // Use await to ensure emails are sent before finishing the webhook request
            try {
              await sendOrderSuccessEmail(paidOrder);
              console.log(`Successfully dispatched customer email.`);
            } catch (err) {
              console.error(`❌ Failed to send order success email:`, err.message);
            }

            try {
              await sendStoreOrderNotificationEmail(paidOrder);
              console.log(`Successfully dispatched business notification.`);
            } catch (err) {
              console.error(`❌ Failed to send store notification email:`, err.message);
            }
          } else {
            console.warn(`⚠️ WEBHOOK ERROR: Order not found in database! Tried Mongo ID: ${mongoOrderId} and Human ID: ${fallbackOrderId}`);
          }
        } else {
          console.log(`ℹ️ Session completed but payment_status is '${session.payment_status}'. Waiting for further events...`);
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
