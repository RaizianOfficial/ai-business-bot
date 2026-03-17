import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendOrderNotification = async (order: any) => {
  // Stylish HTML Template
  const htmlContent = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f9f9f9; padding: 30px 10px; margin: 0;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; border: 1px solid #e0e0e0; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
        
        <div style="background-color: #2c3e50; padding: 25px 20px; text-align: center;">
          <h1 style="margin: 0; font-size: 24px; color: #ffffff; letter-spacing: 1px;">🎁 New Order Received</h1>
          <p style="margin: 5px 0 0 0; color: #bdc3c7; font-size: 14px;">Velourah Hampers</p>
        </div>

        <div style="padding: 30px;">
          <p style="color: #333333; font-size: 16px; margin-top: 0;">Hello Admin,</p>
          <p style="color: #555555; font-size: 15px; line-height: 1.6;">A new gift hamper order has just been placed. Here are the fulfillment details:</p>
          
          <table style="width: 100%; border-collapse: collapse; margin-top: 25px; font-size: 14px;">
            <tr>
              <td style="padding: 12px 10px; border-bottom: 1px solid #eeeeee; font-weight: bold; color: #555; width: 35%;">Order ID</td>
              <td style="padding: 12px 10px; border-bottom: 1px solid #eeeeee; color: #222;">${order.order_id || "N/A"}</td>
            </tr>
            <tr>
              <td style="padding: 12px 10px; border-bottom: 1px solid #eeeeee; font-weight: bold; color: #555;">Status</td>
              <td style="padding: 12px 10px; border-bottom: 1px solid #eeeeee;">
                <span style="background-color: #f39c12; color: #fff; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: bold;">
                  ${order.status || "Pending"}
                </span>
              </td>
            </tr>
            <tr>
              <td style="padding: 12px 10px; border-bottom: 1px solid #eeeeee; font-weight: bold; color: #555;">Product Code</td>
              <td style="padding: 12px 10px; border-bottom: 1px solid #eeeeee; color: #222;">${order.product_code}</td>
            </tr>
            <tr>
              <td style="padding: 12px 10px; border-bottom: 1px solid #eeeeee; font-weight: bold; color: #555;">Customer Name</td>
              <td style="padding: 12px 10px; border-bottom: 1px solid #eeeeee; color: #222;">${order.name}</td>
            </tr>
            <tr>
              <td style="padding: 12px 10px; border-bottom: 1px solid #eeeeee; font-weight: bold; color: #555;">Phone</td>
              <td style="padding: 12px 10px; border-bottom: 1px solid #eeeeee; color: #222;">
                <a href="tel:${order.phone}" style="color: #2980b9; text-decoration: none;">${order.phone}</a>
              </td>
            </tr>
            <tr>
              <td style="padding: 12px 10px; border-bottom: 1px solid #eeeeee; font-weight: bold; color: #555;">Email</td>
              <td style="padding: 12px 10px; border-bottom: 1px solid #eeeeee; color: #222;">
                <a href="mailto:${order.email}" style="color: #2980b9; text-decoration: none;">${order.email || "Not provided"}</a>
              </td>
            </tr>
            <tr>
              <td style="padding: 12px 10px; border-bottom: 1px solid #eeeeee; font-weight: bold; color: #555;">City</td>
              <td style="padding: 12px 10px; border-bottom: 1px solid #eeeeee; color: #222;">${order.city}</td>
            </tr>
            <tr>
              <td style="padding: 12px 10px; border-bottom: 1px solid #eeeeee; font-weight: bold; color: #555;">Address</td>
              <td style="padding: 12px 10px; border-bottom: 1px solid #eeeeee; color: #222;">${order.address}</td>
            </tr>
            <tr>
              <td style="padding: 12px 10px; border-bottom: 1px solid #eeeeee; font-weight: bold; color: #555;">Custom Message</td>
              <td style="padding: 12px 10px; border-bottom: 1px solid #eeeeee; color: #222; font-style: italic;">"${order.custom_message || "None"}"</td>
            </tr>
          </table>
        </div>

        <div style="background-color: #f1f2f6; padding: 15px; text-align: center; border-top: 1px solid #e0e0e0;">
          <p style="margin: 0; font-size: 12px; color: #7f8c8d;">This is an automated notification from your store system.</p>
        </div>
      </div>
    </div>
  `;

  // Original plain text template (Fallback)
  const textContent = `🎁 New order received!

Order ID: ${order.order_id || "N/A"}
Name: ${order.name}
Product Code: ${order.product_code}
Phone: ${order.phone}
City: ${order.city}
Address: ${order.address}
Email: ${order.email || "Not provided"}
Message: ${order.custom_message || "None"}
Status: ${order.status || "Pending"}`;

  const mailOptions = {
    from: '"Velourah Hampers" <' + process.env.SMTP_USER + ">",
    to: process.env.ADMIN_EMAIL,
    subject: `New Order ${order.order_id || ""} - Gift Hamper`,
    text: textContent, // Plain text fallback
    html: htmlContent, // Rich HTML version
  };

  return transporter.sendMail(mailOptions);
};
