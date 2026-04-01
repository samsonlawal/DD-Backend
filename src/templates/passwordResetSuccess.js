const layout = require("./layout");

const passwordResetSuccessTemplate = (name) => {
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
          Your password has been successfully reset!
          <br />
          <br />
          You can now log in to your Discount Drinks account using your new password.
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
          href="https://discountdrinksandmoreltd.co.uk/login"
          target="_blank"
          style="
            color: #ffffff;
            text-decoration: none;
            font-weight: 500;
            margin: 0;
            font-size: 16px;
          "
        >
          Log In Now
        </a>
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
          If you did not perform this action, please contact our support team immediately.
        </p>
      </td>
    </tr>
  `;

  return layout(content);
};

module.exports = passwordResetSuccessTemplate;
