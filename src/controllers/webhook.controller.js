const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Order = require("../models/Order");
const Product = require("../models/Product");
const { sendOrderSuccessEmail, sendStoreOrderNotificationEmail } = require("../utils/email");

// Handle Stripe Webhook events
exports.handleStripeWebhook = async (req, res) => {
  console.log("Stripe Webhook Received!");
  const sig = req.headers["stripe-signature"];
  
  if (!sig) {
    console.warn("Webhook received without stripe-signature header!");
  }

  let event;

  // Verify the webhook signature to ensure request authenticity
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
    console.log(`Webhook verified: ${event.type}`);
  } catch (err) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    console.log("Check if STRIPE_WEBHOOK_SECRET in .env matches your Stripe CLI/Dashboard secret.");
    return res.status(400).json({ success: false, message: `Webhook Error: ${err.message}` });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        // A checkout session was successfully completed (User paid)
        const session = event.data.object;
        const mongoOrderId = session.metadata.mongo_order_id;
        const fallbackOrderId = session.metadata.orderId;

        if (session.payment_status === "paid") {
          /**
           * IDEMPOTENCY CHECK:
           * We only search for orders where paymentStatus is NOT "paid".
           * If Stripe sends this event twice, the second time will return 'null',
           * preventing duplicate emails and double-counting sales.
           */
          const query = {
            ...(mongoOrderId ? { _id: mongoOrderId } : { orderId: fallbackOrderId }),
            paymentStatus: { $ne: "paid" } 
          };
          
          console.log(`Searching for unpaid order with query:`, JSON.stringify(query));

          // Update order status to paid and move to processing
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
            console.log(`Order ${paidOrder.orderId} found and updated to PAID.`);
            
            // Increment soldCount for each product to track popularity
            for (const item of paidOrder.items) {
              if (item.product) {
                await Product.findByIdAndUpdate(item.product._id || item.product, {
                  $inc: { soldCount: item.quantity },
                });
              }
            }

            console.log(`Dispatching confirmation emails...`);
            // Notify customer of order success
            try {
              await sendOrderSuccessEmail(paidOrder);
              console.log(`Successfully dispatched customer email.`);
            } catch (err) {
              console.error(`Failed to send order success email:`, err.message);
            }

            // Notify store administrator of new order
            try {
              await sendStoreOrderNotificationEmail(paidOrder);
              console.log(`Successfully dispatched business notification.`);
            } catch (err) {
              console.error(`Failed to send store notification email:`, err.message);
            }
          } else {
            // This happens if the order was already marked as paid by a previous webhook delivery
            console.log(`Order already processed or not found for IDs: Mongo=${mongoOrderId}, Human=${fallbackOrderId}`);
          }
        } else {
          console.log(`Session completed but payment_status is '${session.payment_status}'. Waiting for further events...`);
        }
        break;
      }

      case "checkout.session.expired": {
        // Customer initiated checkout but didn't pay within the timeframe
        const session = event.data.object;
        const orderId = session.metadata.orderId;

        if (orderId) {
          /**
           * IDEMPOTENCY CHECK:
           * Only cancel if the order is currently "pending".
           * This avoids accidentally cancelling an order that was actually paid
           * but triggered an expiration event due to a race condition.
           */
          const failedOrder = await Order.findOneAndUpdate(
            { orderId, paymentStatus: "pending" },
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
            // Restore stock levels so items are available for other customers
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

    // Always acknowledge receipt of the event to Stripe
    res.json({ received: true });
  } catch (error) {
    console.error("Error processing webhook:", error);
    res.status(500).json({ success: false, message: "Webhook handler failed" });
  }
  }



