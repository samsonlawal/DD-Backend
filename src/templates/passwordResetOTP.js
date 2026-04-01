const layout = require("./layout");

const passwordResetOTPTemplate = (name, otpCode) => {
  const content = `
    <tr>
      <td style="padding-bottom: 24px">
        <h5 style="font-size: 24px; margin: 0">
          Hello ${name.split(" ")[0]},
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
          We received a request to reset your password for your Discount Drinks account.
          <br />
          <br />
          Here is your verification code:
        </p>
      </td>
    </tr>

    <tr>
      <td style="padding-bottom: 24px">
        <h4
          style="
            color: #111111;
            margin: 0;
            font-size: 34px;
            padding: 12px;
            border: 1px dashed #e7e7e7;
            width: fit-content;
            letter-spacing: 5px;
          "
        >
          ${otpCode}
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
          "
        >
          This code will expire in 10 minutes. If you did not attempt to reset your password, please contact us immediately.
        </p>
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
          Thank you,
          <br />
          <br />
          The Discount Drinks Team
        </p>
      </td>
    </tr>
  `;

  return layout(content);
};

module.exports = passwordResetOTPTemplate;
