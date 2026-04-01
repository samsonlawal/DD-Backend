const layout = require("./layout");

const welcomeTemplate = (name) => {
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
          Welcome to Discount Drinks!
          <br />
          <br />
          We're thrilled to have you join our community. We strive to provide you with the
          best selection of drinks at the best prices.
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
          >Browse our selection</a
        >
      </td>
    </tr>

    <tr>
      <td style="text-align: left; padding: 0px 0px">
        <p
          style="
            font-size: 16px;
            margin: 0;
            line-height: 24px;
            font-weight: 500;
          "
        >
          Should you have any questions or need assistance,
          our support team is here to help, feel free to
          reach out at any time!
        </p>
      </td>
    </tr>
  `;

  return layout(content);
};

module.exports = welcomeTemplate;
