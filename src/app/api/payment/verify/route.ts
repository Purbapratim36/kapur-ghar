import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { verifyPaymentSignature } from "@/lib/razorpay";
import { sendMail, orderConfirmationEmail } from "@/lib/mail";

const schema = z.object({
  orderId: z.string(), // our DB order id
  razorpayOrderId: z.string(),
  razorpayPaymentId: z.string(),
  razorpaySignature: z.string(),
});

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid input" },
        { status: 400 }
      );
    }
    const { orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature } =
      parsed.data;

    const order = await db.order.findFirst({
      where: { id: orderId, userId: session.user.id },
    });
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }
    if (order.razorpayOrderId !== razorpayOrderId) {
      return NextResponse.json(
        { error: "Order/payment mismatch" },
        { status: 400 }
      );
    }

    const valid = verifyPaymentSignature(
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature
    );
    if (!valid) {
      return NextResponse.json(
        { error: "Invalid payment signature" },
        { status: 400 }
      );
    }

    await db.order.update({
      where: { id: orderId },
      data: {
        paymentStatus: "PAID",
        status: "CONFIRMED",
        razorpayPaymentId,
      },
    });

    // Send confirmation email (best-effort, never blocks the response)
    if (session.user.email) {
      sendMail({
        to: session.user.email,
        subject: `Order Confirmed - ${order.orderNumber}`,
        html: orderConfirmationEmail(
          order.orderNumber,
          `₹${order.total.toLocaleString("en-IN")}`
        ),
      }).catch(() => {});
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Payment verify error:", error);
    return NextResponse.json(
      { error: "Failed to verify payment" },
      { status: 500 }
    );
  }
}
