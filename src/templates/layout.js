const layout = (content) => `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta http-equiv="Content-Type" content="text/html charset=UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Discount Drinks</title>

    <style>
      @media only screen and (max-width: 600px) {
        .content {
          padding: 20px !important;
        }
      }
    </style>
  </head>
  <body style="margin: 0; padding: 0; font-family: Arial, sans-serif">
    <table
      width="100%"
      cellpadding="0"
      cellspacing="0"
      border="0"
      style="background-color: #e7e7e7; padding: 60px 0px"
    >
      <tr>
        <td align="center" style="padding: 0px 10px">
          <table
            cellpadding="0"
            cellspacing="0"
            border="0"
            style="text-align: center; color: #111111; max-width: 658px; width: 100%; margin: 0 auto;"
          >
            <tr>
              <td
                class="content"
                style="
                  padding-top: 40px;
                  padding-bottom: 40px;
                  padding-left: 40px;
                  padding-right: 40px;
                  background-color: #fafafa;
                "
              >
                <table cellpadding="0" cellspacing="0" border="0" width="100%">
                  <tr>
                    <td
                      style="
                        text-align: center;
                        color: white;
                        font-size: 24px;
                        padding-bottom: 24px;
                      "
                    >
                      <img
                        src="https://discountdrinksandmoreltd.co.uk/logo.svg"
                        alt="Discount Drinks Logo"
                        style="max-width: 150px; margin: 0 auto; display: block;"
                      />
                    </td>
                  </tr>

                  <tr>
                    <td style="padding-bottom: 24px">
                      <hr
                        style="
                          width: 100%;
                          border-color: #e7e7e7;
                          border-top: 1px;
                          margin: 0;
                        "
                      />
                    </td>
                  </tr>

                  <tr>
                    <td style="padding: 0; width: 100%;">
                      <table width="100%" style="text-align: left; table-layout: fixed;">
                        ${content}
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <tr>
              <td>
                <table
                  class="row"
                  cellpadding="0"
                  cellspacing="0"
                  border="0"
                  style="
                    background-color: #e7e7e7;
                    text-align: center;
                    width: 100%;
                    padding: 31px 0px 31px 0px;
                  "
                >
                  <tr>
                    <td>
                      <table
                        cellpadding="0"
                        cellspacing="0"
                        border="0"
                        style="
                          text-align: center;
                          max-width: 500px;
                          margin: 0px auto;
                        "
                      >
                        <tr>
                          <td>
                            <p
                              style="
                                color: #4e4e4e;
                                font-size: 12px;
                                padding: 31px 0px;
                                margin: 0;
                                line-height: 20px;
                              "
                            >
                              If you have any questions or need assistance, our support team is here to help. Feel free to reach out to us at
                              <br />
                              <a
                                href="mailto:support@discountdrinksandmoreltd.co.uk"
                                style="text-decoration: none; color: #111111; font-weight: bold;"
                              >
                                support@discountdrinksandmoreltd.co.uk
                              </a>.
                            </p>
                          </td>
                        </tr>

                        <tr>
                          <td style="text-align: center; padding-top: 31px">
                            <p style="margin: 0;">
                              <a href="https://discountdrinksandmoreltd.co.uk/legal/terms-and-conditions" style="color: #4e4e4e; font-size: 12px; text-decoration: none; padding: 0 5px;">Terms & Conditions</a> |
                              <a href="https://discountdrinksandmoreltd.co.uk/legal/privacy-policy" style="color: #4e4e4e; font-size: 12px; text-decoration: none; padding: 0 5px;">Privacy Policy</a> |
                              <a href="#" style="color: #4e4e4e; font-size: 12px; text-decoration: none; padding: 0 5px;">Unsubscribe</a>
                            </p>
                          </td>
                        </tr>

                        <tr>
                          <td style="text-align: center; padding-top: 15px">
                            <p
                              style="
                                font-size: 14px;
                                color: #111111;
                                margin: 0;
                                line-height: 20px;
                                font-weight: bold;
                              "
                            >
                              © ${new Date().getFullYear()} Discount Drinks. All rights reserved.
                            </p>
                          </td>
                        </tr>

                        <tr>
                          <td style="text-align: center; padding-top: 10px">
                            <p
                              style="
                                font-size: 12px;
                                color: #4e4e4e;
                                margin: 0;
                                line-height: 18px;
                              "
                            >
                              123 High Street, London, W1F 8ZT, United Kingdom
                              <br>
                              Registered in England: 12345678. VAT No. 997654321
                            </p>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`;

module.exports = layout;
