const nodemailer = require("nodemailer");
const sendgridTransport = require("nodemailer-sendgrid-transport");

const welcomeTemplate = require("../templates/welcome");
const passwordResetOTPTemplate = require("../templates/passwordResetOTP");
const passwordResetSuccessTemplate = require("../templates/passwordResetSuccess");
const orderProgressTemplate = require("../templates/orderProgress");
const orderSuccessTemplate = require("../templates/orderSuccess");

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
    const fromAddress = process.env.ADMIN_EMAIL || "support@discountdrinksandmoreltd.co.uk";

    // Format the recipient so their email client prominently displays their name
    const recipient = name ? `"${name}" <${to}>` : to;

    const info = await transporter.sendMail({
      from: `"Discount Drinks" <${fromAddress}>`,
      replyTo: "no-reply@discountdrinksandmoreltd.co.uk",
      to: recipient,
      subject,
      html,
    });
    console.log(`✅ Email sent successfully to ${to} | Subject: ${subject}`);
    return info;
  } catch (error) {
    console.error(`❌ Error sending email to ${to}:`, error.message || error);
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
  sendOrderProgressEmail,
};
