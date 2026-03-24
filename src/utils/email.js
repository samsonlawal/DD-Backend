const nodemailer = require("nodemailer");
const sendgridTransport = require("nodemailer-sendgrid-transport");

// Configure SendGrid Transport
const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key: process.env.SEND_GRID_API_KEY,
    },
  })
);

// Generic email sender
const sendEmail = async ({ to, subject, html }) => {
  try {
    const info = await transporter.sendMail({
      from: process.env.ADMIN_EMAIL || "admin@discountdrinks.com", // update this to your verified SendGrid sender email
      to,
      subject,
      html,
    });
    console.log(`Email sent successfully to ${to}`);
    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

// --- EMAIL TEMPLATES ---

const sendWelcomeEmail = async (email, name) => {
  const subject = "Welcome to Discount Drinks!";
  const html = `
    <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
      <h2>Welcome, ${name}! 🎉</h2>
      <p>Thank you for signing up to Discount Drinks.</p>
      <p>We are thrilled to have you on board. Start exploring our wide selection of drinks at the best prices.</p>
      <br />
      <p>Cheers,</p>
      <p><strong>The Discount Drinks Team</strong></p>
    </div>
  `;
  return sendEmail({ to: email, subject, html });
};

const sendPasswordResetOTP = async (email, name, otpCode) => {
  const subject = "Your Password Reset Code";
  const html = `
    <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
      <h2>Password Reset Request</h2>
      <p>Hi ${name},</p>
      <p>We received a request to reset your password. Here is your 6-digit verification code:</p>
      <div style="margin: 20px 0; font-size: 24px; font-weight: bold; letter-spacing: 5px; color: #d9534f;">
        ${otpCode}
      </div>
      <p>This code will expire in 10 minutes. If you did not request this, please ignore this email.</p>
      <br />
      <p>Thank you,</p>
      <p><strong>The Discount Drinks Team</strong></p>
    </div>
  `;
  return sendEmail({ to: email, subject, html });
};

const sendPasswordResetSuccess = async (email, name) => {
  const subject = "Password Reset Successful";
  const html = `
    <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
      <h2>Password Reset Complete</h2>
      <p>Hi ${name},</p>
      <p>Your password has been successfully reset. You can now log in using your new password.</p>
      <p>If you did not perform this action, please contact our support immediately.</p>
      <br />
      <p>Best Regards,</p>
      <p><strong>The Discount Drinks Team</strong></p>
    </div>
  `;
  return sendEmail({ to: email, subject, html });
};

module.exports = {
  sendEmail,
  sendWelcomeEmail,
  sendPasswordResetOTP,
  sendPasswordResetSuccess,
};
