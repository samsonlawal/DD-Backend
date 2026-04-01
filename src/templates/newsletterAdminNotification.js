const layout = require("./layout");

/**
 * Sent to the admin whenever a new subscriber signs up.
 * @param {string} email        - The new subscriber's email address.
 * @param {string} subscribedAt - ISO date string of when they subscribed.
 */
const newsletterAdminNotificationTemplate = (email, subscribedAt) => {
  const formattedDate = new Date(subscribedAt).toLocaleString("en-GB", {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: "Europe/London",
  });

  const content = `
    <tr>
      <td style="padding-bottom: 24px">
        <h5 style="font-size: 24px; margin: 0">
          📬 New Newsletter Subscriber
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
          A new user has just subscribed to the Discount Drinks newsletter.
        </p>
      </td>
    </tr>

    <tr>
      <td
        style="
          background-color: #f5f5f5;
          border-radius: 8px;
          padding: 16px 20px;
          margin-bottom: 24px;
          text-align: left;
        "
      >
        <table cellpadding="0" cellspacing="0" border="0" width="100%">
          <tr>
            <td style="padding: 6px 0;">
              <span style="font-size: 13px; color: #888888; text-transform: uppercase; letter-spacing: 0.5px;">Email</span><br />
              <strong style="font-size: 15px; color: #111111;">${email}</strong>
            </td>
          </tr>
          <tr>
            <td style="padding: 6px 0;">
              <span style="font-size: 13px; color: #888888; text-transform: uppercase; letter-spacing: 0.5px;">Subscribed At</span><br />
              <strong style="font-size: 15px; color: #111111;">${formattedDate}</strong>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <tr>
      <td style="text-align: left; padding-top: 16px">
        <p
          style="
            font-size: 14px;
            margin: 0;
            line-height: 22px;
            color: #666666;
          "
        >
          This is an automated notification from the Discount Drinks backend.
        </p>
      </td>
    </tr>
  `;

  return layout(content);
};

module.exports = newsletterAdminNotificationTemplate;
