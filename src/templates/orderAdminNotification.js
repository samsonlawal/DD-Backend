const layout = require("./layout");

/**
 * Sent to the store admin whenever a new order is paid.
 * @param {Object} order - The order document from the database.
 */
const orderAdminNotificationTemplate = (order) => {
  const {
    orderId,
    _id,
    user = {},
    items = [],
    totalAmount = 0,
    createdAt,
  } = order;

  const formattedDate = new Date(createdAt || Date.now()).toLocaleString("en-GB", {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: "Europe/London",
  });

  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const customerName = user.name || "Unknown Customer";
  const customerEmail = user.email || "N/A";

  const content = `
    <tr>
      <td style="padding-bottom: 24px">
        <h5 style="font-size: 24px; margin: 0; color: #111111;">
          🛒 New Order Received!
        </h5>
      </td>
    </tr>

    <tr>
      <td style="text-align: left; padding-bottom: 24px">
        <p
          style="
            font-size: 16px;
            margin: 0;
            line-height: 24px;
            color: #4e4e4e;
          "
        >
          Great news! A new order has just been placed and payment has been confirmed via Stripe.
        </p>
      </td>
    </tr>

    <!-- Order Summary Box -->
    <tr>
      <td
        style="
          background-color: #f5f5f5;
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 24px;
          text-align: left;
        "
      >
        <table cellpadding="0" cellspacing="0" border="0" width="100%">
          <tr>
            <td style="padding: 8px 0; border-bottom: 1px solid #e0e0e0;">
              <span style="font-size: 12px; color: #888888; text-transform: uppercase; letter-spacing: 0.5px;">Order ID</span><br />
              <strong style="font-size: 16px; color: #111111;">#${orderId}</strong>
              <small style="color: #666; display: block; font-size: 11px; margin-top: 2px;">DB ID: ${_id}</small>
            </td>
          </tr>
          <tr>
            <td style="padding: 8px 0; border-bottom: 1px solid #e0e0e0;">
              <span style="font-size: 12px; color: #888888; text-transform: uppercase; letter-spacing: 0.5px;">Customer Details</span><br />
              <strong style="font-size: 15px; color: #111111;">${customerName}</strong><br />
              <span style="font-size: 14px; color: #4e4e4e;">${customerEmail}</span>
            </td>
          </tr>
          <tr>
            <td style="padding: 8px 0; border-bottom: 1px solid #e0e0e0;">
              <span style="font-size: 12px; color: #888888; text-transform: uppercase; letter-spacing: 0.5px;">Items Ordered</span><br />
              <strong style="font-size: 15px; color: #111111;">${itemCount} unit${itemCount === 1 ? "" : "s"}</strong>
            </td>
          </tr>
          <tr>
            <td style="padding: 8px 0;">
              <span style="font-size: 12px; color: #888888; text-transform: uppercase; letter-spacing: 0.5px;">Total Amount</span><br />
              <strong style="font-size: 18px; color: #345c72;">£${totalAmount.toFixed(2)}</strong>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <tr>
      <td style="padding-bottom: 24px;">
        <p style="font-size: 14px; color: #888888; margin: 0;">
          Placed on: ${formattedDate}
        </p>
      </td>
    </tr>

    <tr>
      <td style="text-align: left; padding-top: 16px">
        <a
          href="https://admin.discountdrinksandmoreltd.co.uk/orders/${_id}"
          style="
            background-color: #345c72;
            color: #ffffff;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 6px;
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
      <td style="text-align: left; padding-top: 24px">
        <p
          style="
            font-size: 14px;
            margin: 0;
            line-height: 22px;
            color: #666666;
          "
        >
          This is an automated operational notification from the Discount Drinks backend.
        </p>
      </td>
    </tr>
  `;

  return layout(content);
};

module.exports = orderAdminNotificationTemplate;
