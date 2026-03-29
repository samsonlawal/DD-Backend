const { sendEmail } = require("../utils/email");

exports.sendContactMessage = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: "Please provide name, email, subject, and message.",
      });
    }

    // const adminEmail = process.env.ADMIN_EMAIL || "taskstackhq@gmail.com";
    const adminEmail = process.env.ADMIN_EMAIL || "support@discountdrinksandmoreltd.co.uk";


    // 1. Email to admin with the user's message
    await sendEmail({
      to: adminEmail,
      subject: `${subject} || New Message`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
          <h2>New Contact Form Message</h2>
          <p><strong>From:</strong> ${name} (${email})</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <hr />
          <p>${message.replace(/\n/g, "<br />")}</p>
        </div>
      `,
    });

    // 2. Auto-reply to the user
    await sendEmail({
      to: email,
      subject: "We've received your message — Discount Drinks",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
          <h2>Thanks for reaching out, ${name}!</h2>
          <p>We've received your message and will get back to you as soon as possible.</p>
          <br />
          <p><strong>Your message:</strong></p>
          <p style="background:#f5f5f5; padding:12px; border-radius:6px;">${message.replace(/\n/g, "<br />")}</p>
          <br />
          <p>Cheers,</p>
          <p><strong>The Discount Drinks Team</strong></p>
        </div>
      `,
    });

    res.status(200).json({
      success: true,
      message: "Your message has been sent. We'll be in touch soon!",
    });
  } catch (error) {
    console.error("Contact Form Error:", error);
    res.status(500).json({ success: false, message: "Failed to send message. Please try again." });
  }
};
