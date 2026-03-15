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
  const mailOptions = {
    from: '"Hamper Store" <' + process.env.SMTP_USER + ">",
    to: process.env.ADMIN_EMAIL,
    subject: "New Gift Hamper Order",
    text: `New order received

Name: ${order.name}
Product Code: ${order.product_code}
Phone: ${order.phone}
City: ${order.city}
Address: ${order.address}
Email: ${order.email || "Not provided"}
Message: ${order.custom_message || "None"}
`,
  };

  return transporter.sendMail(mailOptions);
};
