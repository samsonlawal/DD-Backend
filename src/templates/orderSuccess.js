const layout = require("./layout");

const orderSuccessTemplate = (order) => {
  const {
    orderId,
    items = [],
    subtotal = 0,
    tax = 0,
    shippingCost = 0,
    couponDiscount = 0,
    totalAmount = 0,
    shippingAddress = {},
    user = {},
  } = order;

  const name = user.name || "Customer";

  const itemsHtml = items
    .map(
      (item) => `
    <tr>
      <td style="padding: 12px 0; border-bottom: 1px solid #eeeeee;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td width="56" style="vertical-align: top;">
              <img
                src="${item.image || "https://discountdrinksandmoreltd.co.uk/placeholder-product.png"}"
                alt="${item.name}"
                style="width: 48px; height: 48px; border-radius: 6px; object-fit: cover; display: block;"
              />
            </td>
            <td style="padding-left: 12px; vertical-align: top;">
              <p style="margin: 0 0 2px 0; font-size: 14px; font-weight: bold; color: #111111;">${item.name}</p>
              <p style="margin: 0; font-size: 13px; color: #888888;">Qty: ${item.quantity}</p>
            </td>
            <td align="right" style="vertical-align: top; font-size: 14px; font-weight: bold; color: #111111; white-space: nowrap;">
              £${(item.price * item.quantity).toFixed(2)}
            </td>
          </tr>
        </table>
      </td>
    </tr>
  `
    )
    .join("");

  const content = `
    <tr>
      <td style="padding-bottom: 20px;">
        <h5 style="font-size: 22px; margin: 0; color: #111111;">
          Thank you, ${name}! 🎉
        </h5>
      </td>
    </tr>

    <tr>
      <td style="text-align: left; padding-bottom: 24px;">
        <p style="font-size: 15px; margin: 0; line-height: 24px; color: #4e4e4e;">
          Your payment was successful and your order is now being processed.
          We'll send you another email as soon as it's dispatched.
        </p>
      </td>
    </tr>

    <!-- Order ID + Status Banner -->
    <tr>
      <td style="padding-bottom: 24px;">
        <table
          cellpadding="0"
          cellspacing="0"
          border="0"
          width="100%"
          style="background-color: #111111; border-radius: 8px; padding: 16px 20px;"
        >
          <tr>
            <td>
              <p style="margin: 0 0 2px 0; font-size: 12px; text-transform: uppercase; letter-spacing: 0.08em; color: #999999;">Order Number</p>
              <p style="margin: 0; font-size: 22px; font-weight: bold; color: #ffffff;">#${orderId}</p>
            </td>
            <td align="right">
              <div style="margin-bottom: 8px;">
                <span style="background-color: #10b981; color: #ffffff; font-size: 12px; font-weight: bold; padding: 4px 12px; border-radius: 100px; white-space: nowrap;">
                  ✅ Payment Confirmed
                </span>
              </div>
              <div>
                <span style="background-color: #3b82f6; color: #ffffff; font-size: 11px; font-weight: bold; padding: 3px 10px; border-radius: 100px; white-space: nowrap; text-transform: uppercase; letter-spacing: 0.05em;">
                  🔞 Age Verified
                </span>
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- Delivery Address -->
    <tr>
      <td style="padding-bottom: 24px;">
        <table
          cellpadding="0"
          cellspacing="0"
          border="0"
          width="100%"
          style="border: 1px solid #e7e7e7; border-radius: 8px; padding: 16px 20px;"
        >
          <tr>
            <td>
              <p style="margin: 0 0 8px 0; font-size: 13px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.05em; color: #888888;">
                Delivery Address
              </p>
              <p style="margin: 0; font-size: 14px; color: #111111; line-height: 22px;">
                ${shippingAddress.addressLine1 || ""}${shippingAddress.addressLine2 ? `<br>${shippingAddress.addressLine2}` : ""}
                <br>${shippingAddress.city || ""}, ${shippingAddress.postCode || ""}
                <br>${shippingAddress.country || ""}
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- Items Section -->
    <tr>
      <td style="padding-bottom: 12px;">
        <p style="margin: 0; font-size: 15px; font-weight: bold; color: #111111; border-bottom: 2px solid #111111; padding-bottom: 8px;">
          Order Summary
        </p>
      </td>
    </tr>

    ${itemsHtml}

    <!-- Totals -->
    <tr>
      <td style="padding-top: 16px;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td style="padding: 5px 0; font-size: 14px; color: #4e4e4e;">Subtotal</td>
            <td align="right" style="padding: 5px 0; font-size: 14px; color: #111111;">£${subtotal.toFixed(2)}</td>
          </tr>
          ${
            tax > 0
              ? `<tr>
            <td style="padding: 5px 0; font-size: 14px; color: #4e4e4e;">Tax (VAT)</td>
            <td align="right" style="padding: 5px 0; font-size: 14px; color: #111111;">£${tax.toFixed(2)}</td>
          </tr>`
              : ""
          }
          <tr>
            <td style="padding: 5px 0; font-size: 14px; color: #4e4e4e;">Delivery</td>
            <td align="right" style="padding: 5px 0; font-size: 14px; color: #111111;">
              ${shippingCost === 0 ? '<span style="color: #10b981; font-weight: bold;">FREE</span>' : `£${shippingCost.toFixed(2)}`}
            </td>
          </tr>
          ${
            couponDiscount > 0
              ? `<tr>
            <td style="padding: 5px 0; font-size: 14px; color: #ef4444;">Discount</td>
            <td align="right" style="padding: 5px 0; font-size: 14px; color: #ef4444;">-£${couponDiscount.toFixed(2)}</td>
          </tr>`
              : ""
          }
          <tr>
            <td colspan="2">
              <hr style="border: none; border-top: 2px solid #111111; margin: 10px 0;" />
            </td>
          </tr>
          <tr>
            <td style="font-size: 17px; font-weight: bold; color: #111111;">Total Paid</td>
            <td align="right" style="font-size: 20px; font-weight: bold; color: #345c72;">£${totalAmount.toFixed(2)}</td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- CTA Button -->
    <tr>
      <td align="left" style="padding-top: 32px; padding-bottom: 24px;">
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
          Track Your Order →
        </a>
      </td>
    </tr>
  `;

  return layout(content);
};

module.exports = orderSuccessTemplate;
