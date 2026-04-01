const layout = require("./layout");

/**
 * Sent to the subscriber confirming their sign-up.
 * @param {string} email - The subscriber's email address.
 */
const newsletterConfirmationTemplate = (email) => {
  const content = `
    <tr>
      <td style="padding-bottom: 24px">
        <h5 style="font-size: 24px; margin: 0">
          You're subscribed! 🎉
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
          Thanks for subscribing to the <strong>Discount Drinks</strong> newsletter!
          <br /><br />
          You'll be the first to hear about our latest deals, new arrivals, exclusive
          offers, and more — delivered straight to <strong>${email}</strong>.
          <br /><br />
          In the meantime, explore our full range of drinks and take advantage of
          today's best prices.
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
          href="https://discountdrinksandmoreltd.co.uk"
          target="_blank"
          style="
            color: #ffffff;
            text-decoration: none;
            font-weight: 500;
            margin: 0;
            font-size: 16px;
          "
          >Shop Now</a
        >
      </td>
    </tr>

    <tr>
      <td style="text-align: left; padding: 0px 0px">
        <p
          style="
            font-size: 14px;
            margin: 0;
            line-height: 22px;
            color: #666666;
          "
        >
          If you didn't sign up for this newsletter, you can safely ignore this
          email — you won't receive any further messages.
        </p>
      </td>
    </tr>
  `;

  return layout(content);
};

module.exports = newsletterConfirmationTemplate;
