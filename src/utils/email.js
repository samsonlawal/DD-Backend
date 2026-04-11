const nodemailer = require("nodemailer");
const sendgridTransport = require("nodemailer-sendgrid-transport");

const welcomeTemplate = require("../templates/welcome");
const passwordResetOTPTemplate = require("../templates/passwordResetOTP");
const passwordResetSuccessTemplate = require("../templates/passwordResetSuccess");
const orderProgressTemplate = require("../templates/orderProgress");
const orderSuccessTemplate = require("../templates/orderSuccess");
const orderAdminNotificationTemplate = require("../templates/orderAdminNotification");

// Configure SendGrid Transport
const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key: process.env.SEND_GRID_API_KEY,
    },
  })
);

// Generic email sender
const sendEmail = async ({ to, name, subject, html }) => {
  try {
    // CRITICAL: SendGrid requires the 'from' address to be a verified sender.
    // We use SENDER_EMAIL for the 'from' field, and ADMIN_EMAIL for the notification recipient.
    const fromAddress = process.env.SENDER_EMAIL || "support@discountdrinksandmoreltd.co.uk";

    // Format the recipient so their email client prominently displays their name
    const recipient = name ? `"${name}" <${to}>` : to;

    console.log(`✉️ Attempting to send email...`);
    console.log(`   From: "Discount Drinks" <${fromAddress}>`);
    console.log(`   To: ${recipient}`);
    console.log(`   Subject: ${subject}`);

    const info = await transporter.sendMail({
      from: `"Discount Drinks" <${fromAddress}>`,
      replyTo: "no-reply@discountdrinksandmoreltd.co.uk",
      to: recipient,
      subject,
      html,
    });
    console.log(`✅ Email sent successfully to ${to}`);
    return info;
  } catch (error) {
    console.error(`❌ FAILED to send email to ${to}:`);
    console.error(`   Error Status: ${error.code || 'N/A'}`);
    console.error(`   Error Message: ${error.message || error}`);
    
    // If it's a SendGrid specific error (401/403), it's usually API key or verified sender issue
    if (error.response) {
      console.error(`   Backend Response:`, JSON.stringify(error.response.body, null, 2));
    }
    
    throw error;
  }
};

// --- EMAIL SENDERS ---

const sendWelcomeEmail = async (email, name) => {
  const subject = "Welcome to Discount Drinks!";
  const html = welcomeTemplate(name);
  return sendEmail({ to: email, name, subject, html });
};

const sendPasswordResetOTP = async (email, name, otpCode) => {
  const subject = "Your Password Reset Code";
  const html = passwordResetOTPTemplate(name, otpCode);
  return sendEmail({ to: email, name, subject, html });
};

const sendPasswordResetSuccess = async (email, name) => {
  const subject = "Password Reset Successful";
  const html = passwordResetSuccessTemplate(name);
  return sendEmail({ to: email, name, subject, html });
};

// Sent after Stripe payment is confirmed — full receipt with items & totals
const sendOrderSuccessEmail = async (order) => {
  const email = order.user?.email;
  const name = order.user?.name;
  if (!email) {
    console.warn("⚠️ sendOrderSuccessEmail: no email on order, skipping.");
    return;
  }
  const subject = `Order Confirmed! Your Discount Drinks Order #${order.orderId}`;
  const html = orderSuccessTemplate(order);
  return sendEmail({ to: email, name, subject, html });
};

// Sent to the store admin when a new order is paid
const sendStoreOrderNotificationEmail = async (order) => {
  try {
    const storeEmail = process.env.ADMIN_EMAIL;
    console.log(`🔔 CHECK: Starting Store Notification for Order #${order.orderId}`);
    
    if (!storeEmail) {
      console.warn("⚠️ ABORT: sendStoreOrderNotificationEmail: ADMIN_EMAIL not set in .env!");
      return;
    }

    console.log(`📧 Sending business notification to: ${storeEmail}`);
    
    const subject = `New Order Received — #${order.orderId}`;
    const html = orderAdminNotificationTemplate(order);

    const result = await sendEmail({ to: storeEmail, subject, html });
    console.log(`✅ Business notification sent to ${storeEmail}`);
    return result;
  } catch (error) {
    console.error(`❌ CRITICAL ERROR in sendStoreOrderNotificationEmail:`, error.message);
    throw error;
  }
};

// Sent when the admin updates order status (processing → dispatched → delivered etc.)
const sendOrderProgressEmail = async (email, name, orderId, status, message) => {
  const subject = `Update on your Order #${orderId} — ${toTitleCase(status)}`;
  const html = orderProgressTemplate(name, orderId, status, message);
  return sendEmail({ to: email, name, subject, html });
};

// Helper
const toTitleCase = (str) =>
  str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());

module.exports = {
  sendEmail,
  sendWelcomeEmail,
  sendPasswordResetOTP,
  sendPasswordResetSuccess,
  sendOrderSuccessEmail,
  sendStoreOrderNotificationEmail,
  sendOrderProgressEmail,
};
