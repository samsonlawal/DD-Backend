const layout = require("./layout");

const orderProgressTemplate = (name, orderId, status, message) => {
  let humanFriendlyStatus = status;
  let descriptionText = "We wanted to let you know about an update to your order.";

  switch (status.toLowerCase()) {
    case "payment confirmed":
      humanFriendlyStatus = "Payment Confirmed";
      descriptionText = "Great news! We have successfully received your payment. Your order is now being processed.";
      break;
    case "processing":
      humanFriendlyStatus = "Processing";
      descriptionText = "Your order is currently being prepared and packed in our warehouse.";
      break;
    case "dispatched":
    case "shipped":
      humanFriendlyStatus = "Shipped";
      descriptionText = "Your order has been shipped and is on its way to you!";
      break;
    case "delivered":
      humanFriendlyStatus = "Delivered";
      descriptionText = "Your order has been successfully delivered. We hope you enjoy your drinks!";
      break;
    case "cancelled":
      humanFriendlyStatus = "Cancelled";
      descriptionText = "Your order has been cancelled.";
      break;
    default:
      humanFriendlyStatus = status.charAt(0).toUpperCase() + status.slice(1);
  }

  const content = `
    <tr>
      <td style="padding-bottom: 24px">
        <h5 style="font-size: 24px; margin: 0">
          Hello ${name},
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
          "
        >
          There has been an update regarding your order:
          <br />
          <strong style="font-size: 18px;">Order #${orderId}</strong>
        </p>
      </td>
    </tr>

    <tr>
      <td style="padding-bottom: 24px">
        <h4
          style="
            color: #111111;
            margin: 0;
            font-size: 20px;
            padding: 12px;
            border: 2px solid #e7e7e7;
            background-color: #f9f9f9;
            width: fit-content;
            border-radius: 8px;
          "
        >
          Status: <span style="color: #345c72;">${humanFriendlyStatus}</span>
        </h4>
      </td>
    </tr>

    <tr>
      <td style="text-align: left; padding-bottom: 24px">
        <p
          style="
            font-size: 16px;
            margin: 0;
            line-height: 24px;
            padding: 15px;
            background-color: #f1f1f1;
            border-left: 4px solid #345c72;
          "
        >
           ${message ? message : descriptionText}
        </p>
      </td>
    </tr>

    <tr>
      <td
        align="center"
        style="
          background-color: #111111;
          padding: 12px 24px;
          border-radius: 100px;
          display: inline-block;
          margin-bottom: 24px;
        "
      >
        <a
          href="https://discountdrinksandmoreltd.co.uk/user/orders/${orderId}"
          target="_blank"
          style="
            color: #ffffff;
            text-decoration: none;
            font-weight: 500;
            margin: 0;
            font-size: 16px;
          "
        >
          View Order Details
        </a>
      </td>
    </tr>

    <tr>
      <td style="text-align: left;">
        <p
          style="
            font-size: 16px;
            margin: 0;
            line-height: 24px;
          "
        >
          If you have any questions, feel free to contact us.
        </p>
      </td>
    </tr>
  `;

  return layout(content);
};

module.exports = orderProgressTemplate;
