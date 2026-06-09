import nodemailer, { type Transporter } from "nodemailer";

let cachedTransporter: Transporter | null = null;

function isSmtpConfigured(): boolean {
  return Boolean(
    process.env.SMTP_HOST &&
      process.env.SMTP_USER &&
      process.env.SMTP_PASS
  );
}

function getTransporter(): Transporter {
  if (!cachedTransporter) {
    cachedTransporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }
  return cachedTransporter;
}

interface SendMailOptions {
  to: string;
  subject: string;
  html: string;
}

/**
 * Sends an email. If SMTP isn't configured, logs and returns silently — never
 * crashes the request. Real production SMTP errors are caught and logged but
 * also don't propagate, because a failed transactional email shouldn't fail
 * an order placement.
 */
export async function sendMail({ to, subject, html }: SendMailOptions): Promise<boolean> {
  if (!isSmtpConfigured()) {
    console.log(`[mail] SMTP not configured — skipping email to ${to} (${subject})`);
    return false;
  }
  try {
    await getTransporter().sendMail({
      from: `"Kapur Ghar" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
      to,
      subject,
      html,
    });
    return true;
  } catch (err) {
    console.error("[mail] send failed:", err);
    return false;
  }
}

function shell(title: string, body: string) {
  return `
<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#f5f0e8;font-family:Georgia,serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f0e8;padding:20px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;background:#FFF8E7;border-radius:8px;overflow:hidden;">
        <tr><td style="background:#CC0000;padding:24px;text-align:center;">
          <h1 style="margin:0;color:#fff;font-size:28px;font-family:Georgia,serif;">Kapur Ghar</h1>
          <p style="margin:6px 0 0;color:#C5A258;letter-spacing:3px;font-size:11px;text-transform:uppercase;">Traditional Assamese Fashion</p>
        </td></tr>
        <tr><td style="padding:32px 28px;color:#222;font-size:15px;line-height:1.55;">
          <h2 style="color:#7a0000;font-family:Georgia,serif;margin:0 0 16px;">${title}</h2>
          ${body}
        </td></tr>
        <tr><td style="background:#f5f0e8;padding:16px;text-align:center;color:#6b6b6b;font-size:11px;">
          Kapur Ghar · Handcrafted Assamese Ethnic Wear<br/>
          Guwahati, Assam, India
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export function orderConfirmationEmail(orderNumber: string, total: string) {
  return shell(
    "Order Confirmed!",
    `<p>Thanks for your order. Your order <strong>#${orderNumber}</strong> has been confirmed and is being prepared.</p>
     <p style="font-size:18px;margin:18px 0;"><strong>Total:</strong> ${total}</p>
     <p>We'll send you another email as soon as it ships, with tracking details.</p>
     <p style="margin-top:24px;color:#6b6b6b;font-size:13px;">If you have any questions, just reply to this email — we're happy to help.</p>`
  );
}

export function orderShippedEmail(
  orderNumber: string,
  trackingNumber: string | null,
  trackingUrl: string | null
) {
  const trackingLine = trackingNumber
    ? `<p style="margin:18px 0;"><strong>Tracking number:</strong> ${trackingNumber}</p>`
    : "";
  const trackButton = trackingUrl
    ? `<p style="margin:24px 0;text-align:center;">
         <a href="${trackingUrl}" style="display:inline-block;background:#CC0000;color:#fff;padding:12px 28px;border-radius:24px;text-decoration:none;font-weight:bold;font-size:14px;">Track your shipment</a>
       </p>`
    : "";
  return shell(
    "Your order is on the way!",
    `<p>Great news — your order <strong>#${orderNumber}</strong> has shipped.</p>
     ${trackingLine}
     ${trackButton}
     <p style="margin-top:24px;color:#6b6b6b;font-size:13px;">Most parcels arrive within 4–7 business days.</p>`
  );
}

export function orderDeliveredEmail(orderNumber: string) {
  return shell(
    "Order delivered",
    `<p>Your order <strong>#${orderNumber}</strong> was just delivered. We hope you love it!</p>
     <p style="margin:18px 0;">If anything's not quite right, just reply to this email and we'll make it right.</p>
     <p style="margin-top:24px;color:#6b6b6b;font-size:13px;">We'd love a review when you have a moment — it helps fellow shoppers.</p>`
  );
}

export function welcomeEmail(name: string | null) {
  return shell(
    "Welcome to Kapur Ghar",
    `<p>${name ? `Hi ${name},` : "Hello,"} welcome to Kapur Ghar.</p>
     <p>We're a small team in Guwahati on a mission to bring the finest Assamese handloom — Mekhela Sador, Muga silk, Pat silk, Eri silk — to your wardrobe.</p>
     <p style="margin:18px 0;">Use code <strong style="color:#CC0000;letter-spacing:1px;">KAPURGHAR20</strong> for 20% off your first order.</p>
     <p style="margin-top:24px;color:#6b6b6b;font-size:13px;">Questions? Just reply — we read every email.</p>`
  );
}
