const layout = require("./layout");

const orderProgressTemplate = (name, orderId, status, message) => {
  const s = (status || "").toLowerCase().trim();

  // Map every status to icon + colour + description
  const statusConfig = {
    "processing": {
      icon: "⚙️",
      label: "Processing",
      color: "#f59e0b",
      description: "Your order is being picked and packed in our warehouse. We'll update you as soon as it's on its way.",
    },
    "dispatched": {
      icon: "📦",
      label: "Dispatched",
      color: "#3b82f6",
      description: "Great news! Your order has left our warehouse and is now with the courier.",
    },
    "shipped": {
      icon: "📦",
      label: "Dispatched",
      color: "#3b82f6",
      description: "Great news! Your order has been dispatched and is heading your way.",
    },
    "on its way": {
      icon: "🚚",
      label: "On Its Way",
      color: "#8b5cf6",
      description: "Your delivery is on its way to you right now! Make sure someone is available to receive it.",
    },
    "delivered": {
      icon: "✅",
      label: "Delivered",
      color: "#10b981",
      description: "Your order has been successfully delivered. We hope you enjoy your drinks! If anything is missing or damaged, please contact us.",
    },
    "cancelled": {
      icon: "❌",
      label: "Cancelled",
      color: "#ef4444",
      description: "Your order has been cancelled. If you believe this is a mistake or need a refund, please contact our support team.",
    },
    "payment confirmed": {
      icon: "💳",
      label: "Payment Confirmed",
      color: "#10b981",
      description: "We have successfully received your payment. Your order is now being prepared.",
    },
  };

  const cfg = statusConfig[s] || {
    icon: "📋",
    label: status.charAt(0).toUpperCase() + status.slice(1),
    color: "#345c72",
    description: "We wanted to let you know about an update to your order.",
  };

  const content = `
    <tr>
      <td style="padding-bottom: 20px;">
        <h5 style="font-size: 22px; margin: 0; color: #111111;">
          Hello ${name},
        </h5>
      </td>
    </tr>

    <tr>
      <td style="text-align: left; padding-bottom: 24px;">
        <p style="font-size: 16px; margin: 0; line-height: 24px; color: #4e4e4e;">
          There's an update on your order:
          <br />
          <strong style="font-size: 17px; color: #111111;">Order #${orderId}</strong>
        </p>
      </td>
    </tr>

    <tr>
      <td style="padding-bottom: 24px;">
        <table
          cellpadding="0"
          cellspacing="0"
          border="0"
          style="
            border-left: 4px solid ${cfg.color};
            background-color: #f9f9f9;
            border-radius: 0 8px 8px 0;
            padding: 16px 20px;
            width: 100%;
          "
        >
          <tr>
            <td>
              <p style="margin: 0 0 4px 0; font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em; color: #888888; font-weight: bold;">
                Order Status
              </p>
              <p style="margin: 0; font-size: 20px; font-weight: bold; color: ${cfg.color};">
                ${cfg.icon}&nbsp; ${cfg.label}
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <tr>
      <td style="text-align: left; padding-bottom: 28px;">
        <p style="font-size: 15px; margin: 0; line-height: 24px; color: #4e4e4e;">
          ${message ? message : cfg.description}
        </p>
      </td>
    </tr>

    <tr>
      <td align="left" style="padding-bottom: 24px;">
        <a
          href="https://discountdrinksandmoreltd.co.uk/user/orders/${orderId}"
          target="_blank"
          style="
            background-color: #111111;
            color: #ffffff;
            padding: 14px 28px;
            text-decoration: none;
            border-radius: 100px;
            font-weight: bold;
            font-size: 15px;
            display: inline-block;
          "
        >
          View Order Details →
        </a>
      </td>
    </tr>

    <tr>
      <td style="text-align: left;">
        <p style="font-size: 14px; margin: 0; line-height: 22px; color: #888888;">
          If you have any questions about your order, reply to this email or contact us at
          <a href="mailto:support@discountdrinksandmoreltd.co.uk" style="color: #345c72; text-decoration: none;">
            support@discountdrinksandmoreltd.co.uk
          </a>.
        </p>
      </td>
    </tr>
  `;

  return layout(content);
};

module.exports = orderProgressTemplate;
