import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  sendMail,
  orderShippedEmail,
  orderDeliveredEmail,
} from "@/lib/mail";

const updateSchema = z.object({
  status: z
    .enum([
      "PENDING",
      "CONFIRMED",
      "PROCESSING",
      "SHIPPED",
      "DELIVERED",
      "CANCELLED",
      "RETURNED",
      "REFUNDED",
    ])
    .optional(),
  paymentStatus: z.enum(["PENDING", "PAID", "FAILED", "REFUNDED"]).optional(),
  trackingNumber: z.string().trim().nullable().optional(),
  trackingUrl: z.string().trim().nullable().optional(),
  notes: z.string().trim().nullable().optional(),
});

async function ensureAdmin() {
  const session = await auth();
  if (!session?.user) return { ok: false as const, status: 401, error: "Unauthorized" };
  if (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN") {
    return { ok: false as const, status: 403, error: "Admin access required" };
  }
  return { ok: true as const, session };
}

export async function GET(
  _req: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  const gate = await ensureAdmin();
  if (!gate.ok) return NextResponse.json({ error: gate.error }, { status: gate.status });

  const { id } = await ctx.params;
  const order = await db.order.findUnique({
    where: { id },
    include: {
      items: true,
      address: true,
      user: { select: { email: true, name: true, phone: true } },
    },
  });
  if (!order) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ order });
}

export async function PATCH(
  req: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  const gate = await ensureAdmin();
  if (!gate.ok) return NextResponse.json({ error: gate.error }, { status: gate.status });

  const { id } = await ctx.params;
  try {
    const body = await req.json();
    const parsed = updateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid input" },
        { status: 400 }
      );
    }
    const previous = await db.order.findUnique({
      where: { id },
      include: { user: { select: { email: true } } },
    });
    const order = await db.order.update({ where: { id }, data: parsed.data });

    // Fire status-change emails (best-effort, never blocks)
    const newStatus = parsed.data.status;
    if (previous && newStatus && newStatus !== previous.status && previous.user.email) {
      if (newStatus === "SHIPPED") {
        sendMail({
          to: previous.user.email,
          subject: `Your order ${order.orderNumber} has shipped`,
          html: orderShippedEmail(
            order.orderNumber,
            order.trackingNumber,
            order.trackingUrl
          ),
        }).catch(() => {});
      } else if (newStatus === "DELIVERED") {
        sendMail({
          to: previous.user.email,
          subject: `Your order ${order.orderNumber} was delivered`,
          html: orderDeliveredEmail(order.orderNumber),
        }).catch(() => {});
      }
    }

    revalidatePath("/admin/orders");
    revalidatePath(`/admin/orders/${id}`);
    revalidatePath(`/account/orders/${id}`);
    revalidatePath("/account/orders");
    return NextResponse.json({ order });
  } catch (error) {
    console.error("Admin order PATCH error:", error);
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
  }
}
