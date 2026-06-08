"use server";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { getRazorpay } from "@/lib/razorpay";
import { sendMail, orderConfirmationEmail } from "@/lib/mail";
import { revalidatePath } from "next/cache";

function generateOrderNumber() {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `KG-${timestamp}-${random}`;
}

export async function createOrder(data: {
  addressId: string;
  paymentMethod: string;
  items: Array<{
    productId: string;
    variantId?: string;
    quantity: number;
  }>;
  couponCode?: string;
}) {
  const session = await auth();
  if (!session?.user) throw new Error("Please sign in to place an order");

  const products = await db.product.findMany({
    where: { id: { in: data.items.map((item) => item.productId) } },
    include: { images: { take: 1 } },
  });

  let subtotal = 0;
  const orderItems = data.items.map((item) => {
    const product = products.find((p) => p.id === item.productId);
    if (!product) throw new Error(`Product not found: ${item.productId}`);
    if (product.stock < item.quantity) {
      throw new Error(`Insufficient stock for ${product.name}`);
    }

    const price = Number(product.price);
    subtotal += price * item.quantity;

    return {
      productId: product.id,
      variantId: item.variantId || undefined,
      name: product.name,
      price,
      quantity: item.quantity,
      image: product.images[0]?.url,
    };
  });

  let discount = 0;
  let couponId: string | undefined;
  if (data.couponCode) {
    const coupon = await db.coupon.findUnique({
      where: { code: data.couponCode },
    });
    if (
      coupon &&
      coupon.isActive &&
      (!coupon.expiresAt || coupon.expiresAt > new Date()) &&
      (!coupon.usageLimit || coupon.usedCount < coupon.usageLimit)
    ) {
      if (!coupon.minOrder || subtotal >= Number(coupon.minOrder)) {
        if (coupon.type === "percentage") {
          discount = subtotal * (Number(coupon.value) / 100);
          if (coupon.maxDiscount) {
            discount = Math.min(discount, Number(coupon.maxDiscount));
          }
        } else {
          discount = Number(coupon.value);
        }
        couponId = coupon.id;
      }
    }
  }

  const shippingCharge = subtotal >= 2999 ? 0 : 99;
  const tax = 0;
  const total = subtotal - discount + shippingCharge + tax;

  const orderNumber = generateOrderNumber();

  let razorpayOrderId: string | undefined;
  if (data.paymentMethod !== "COD") {
    const rpOrder = await getRazorpay().orders.create({
      amount: Math.round(total * 100),
      currency: "INR",
      receipt: orderNumber,
    });
    razorpayOrderId = rpOrder.id;
  }

  const order = await db.order.create({
    data: {
      orderNumber,
      userId: session.user.id,
      addressId: data.addressId,
      status: data.paymentMethod === "COD" ? "CONFIRMED" : "PENDING",
      paymentStatus: data.paymentMethod === "COD" ? "PENDING" : "PENDING",
      paymentMethod: data.paymentMethod,
      subtotal,
      discount,
      shippingCharge,
      tax,
      total,
      razorpayOrderId,
      couponId,
      items: { create: orderItems },
    },
    include: { items: true },
  });

  for (const item of data.items) {
    await db.product.update({
      where: { id: item.productId },
      data: { stock: { decrement: item.quantity } },
    });
  }

  if (couponId) {
    await db.coupon.update({
      where: { id: couponId },
      data: { usedCount: { increment: 1 } },
    });
  }

  await db.cartItem.deleteMany({ where: { userId: session.user.id } });

  if (data.paymentMethod === "COD" && session.user.email) {
    await sendMail({
      to: session.user.email,
      subject: `Order Confirmed - #${orderNumber}`,
      html: orderConfirmationEmail(orderNumber, `₹${total.toLocaleString("en-IN")}`),
    });
  }

  revalidatePath("/orders");
  revalidatePath("/admin/orders");

  return {
    orderId: order.id,
    orderNumber: order.orderNumber,
    razorpayOrderId,
    total,
  };
}

export async function updateOrderStatus(
  orderId: string,
  status: string,
  trackingNumber?: string,
  trackingUrl?: string
) {
  const session = await auth();
  if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
    throw new Error("Unauthorized");
  }

  const order = await db.order.update({
    where: { id: orderId },
    data: {
      status,
      trackingNumber,
      trackingUrl,
    },
  });

  revalidatePath("/admin/orders");
  return order;
}
