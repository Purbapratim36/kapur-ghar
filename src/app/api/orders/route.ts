import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

const itemSchema = z.object({
  productId: z.string(),
  variantId: z.string().nullable().optional(),
  quantity: z.number().int().min(1).max(99),
});

const orderSchema = z.object({
  addressId: z.string(),
  paymentMethod: z.enum(["RAZORPAY", "UPI", "CARD", "NET_BANKING", "COD", "WALLET"]),
  items: z.array(itemSchema).min(1, "Cart cannot be empty"),
  couponCode: z.string().optional(),
});

function generateOrderNumber() {
  const t = Date.now().toString(36).toUpperCase();
  const r = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `KG-${t}-${r}`;
}

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const orders = await db.order.findMany({
    where: { userId: session.user.id },
    include: { items: true, address: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ orders });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json(
      { error: "You must be signed in to place an order" },
      { status: 401 }
    );
  }

  try {
    const body = await req.json();
    const parsed = orderSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid order data" },
        { status: 400 }
      );
    }
    const { addressId, paymentMethod, items, couponCode } = parsed.data;

    // Verify address belongs to this user
    const address = await db.address.findFirst({
      where: { id: addressId, userId: session.user.id },
    });
    if (!address) {
      return NextResponse.json(
        { error: "Selected address is invalid" },
        { status: 400 }
      );
    }

    // Load products and validate stock
    const products = await db.product.findMany({
      where: { id: { in: items.map((i) => i.productId) }, isActive: true },
      include: { images: { take: 1, orderBy: { sortOrder: "asc" } } },
    });

    let subtotal = 0;
    const orderItemsData: {
      productId: string;
      variantId?: string;
      name: string;
      price: number;
      quantity: number;
      image: string | null;
    }[] = [];

    for (const item of items) {
      const product = products.find((p) => p.id === item.productId);
      if (!product) {
        return NextResponse.json(
          { error: `Product is no longer available` },
          { status: 400 }
        );
      }
      if (product.stock < item.quantity) {
        return NextResponse.json(
          { error: `Insufficient stock for "${product.name}"` },
          { status: 400 }
        );
      }
      subtotal += product.price * item.quantity;
      orderItemsData.push({
        productId: product.id,
        variantId: item.variantId || undefined,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        image: product.images[0]?.url ?? null,
      });
    }

    // Apply coupon
    let discount = 0;
    let couponId: string | undefined;
    if (couponCode) {
      const coupon = await db.coupon.findUnique({ where: { code: couponCode } });
      if (
        coupon &&
        coupon.isActive &&
        (!coupon.expiresAt || coupon.expiresAt > new Date()) &&
        (!coupon.usageLimit || coupon.usedCount < coupon.usageLimit) &&
        (!coupon.minOrder || subtotal >= coupon.minOrder)
      ) {
        if (coupon.type === "percentage") {
          discount = subtotal * (coupon.value / 100);
          if (coupon.maxDiscount) discount = Math.min(discount, coupon.maxDiscount);
        } else {
          discount = coupon.value;
        }
        couponId = coupon.id;
      }
    }

    const shippingCharge = subtotal >= 2999 ? 0 : 99;
    const total = subtotal - discount + shippingCharge;
    const orderNumber = generateOrderNumber();

    // Create order + decrement stock atomically
    const order = await db.$transaction(async (tx) => {
      const created = await tx.order.create({
        data: {
          orderNumber,
          userId: session.user.id,
          addressId,
          status: paymentMethod === "COD" ? "CONFIRMED" : "PENDING",
          paymentStatus: "PENDING",
          paymentMethod,
          subtotal,
          discount,
          shippingCharge,
          tax: 0,
          total,
          couponId,
          items: { create: orderItemsData },
        },
        include: { items: true, address: true },
      });

      for (const item of items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      if (couponId) {
        await tx.coupon.update({
          where: { id: couponId },
          data: { usedCount: { increment: 1 } },
        });
      }

      return created;
    });

    return NextResponse.json(
      { orderId: order.id, orderNumber: order.orderNumber, total },
      { status: 201 }
    );
  } catch (error) {
    console.error("Order POST error:", error);
    return NextResponse.json(
      { error: "Failed to place order. Please try again." },
      { status: 500 }
    );
  }
}
