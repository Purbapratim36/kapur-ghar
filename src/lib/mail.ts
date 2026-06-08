import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

interface SendMailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendMail({ to, subject, html }: SendMailOptions) {
  await transporter.sendMail({
    from: `"Kapur Ghar" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
    to,
    subject,
    html,
  });
}

export function orderConfirmationEmail(orderNumber: string, total: string) {
  return `
    <div style="font-family: 'Georgia', serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; padding: 20px; background: #CC0000; color: white;">
        <h1 style="margin: 0; font-size: 28px;">Kapur Ghar</h1>
        <p style="margin: 5px 0 0; color: #C5A258;">Traditional Assamese Fashion</p>
      </div>
      <div style="padding: 30px; background: #FFF8E7;">
        <h2 style="color: #CC0000;">Order Confirmed!</h2>
        <p>Thank you for your order. Your order <strong>#${orderNumber}</strong> has been confirmed.</p>
        <p style="font-size: 18px;">Total: <strong>${total}</strong></p>
        <p>We'll notify you when your order ships.</p>
      </div>
      <div style="text-align: center; padding: 15px; background: #f5f0e8; color: #6b6b6b; font-size: 12px;">
        <p>Kapur Ghar - Handcrafted Assamese Ethnic Wear</p>
      </div>
    </div>
  `;
}
