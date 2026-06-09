import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import OrderStatusEditor from "@/components/admin/OrderStatusEditor";

export const dynamic = "force-dynamic";

export default async function AdminOrderDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  if (
    !session?.user ||
    (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")
  ) {
    redirect(`/login?callbackUrl=/admin/orders/${id}`);
  }

  const order = await db.order.findUnique({
    where: { id },
    include: {
      items: true,
      address: true,
      user: { select: { name: true, email: true, phone: true } },
    },
  });
  if (!order) notFound();

  return (
    <div className="max-w-5xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">
          Order {order.orderNumber}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Placed{" "}
          {new Intl.DateTimeFormat("en-IN", {
            dateStyle: "long",
            timeStyle: "short",
          }).format(order.createdAt)}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Items */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="font-heading text-lg font-bold mb-4">Items</h2>
            <div className="divide-y divide-gray-100">
              {order.items.map((item) => (
                <div key={item.id} className="py-3 flex justify-between gap-4">
                  <div className="min-w-0">
                    <p className="font-medium text-sm">{item.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Qty {item.quantity} × ₹{item.price.toLocaleString("en-IN")}
                    </p>
                  </div>
                  <p className="font-semibold whitespace-nowrap">
                    ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100 space-y-1 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span>₹{order.subtotal.toLocaleString("en-IN")}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-green-700">
                  <span>Discount</span>
                  <span>− ₹{order.discount.toLocaleString("en-IN")}</span>
                </div>
              )}
              <div className="flex justify-between text-muted-foreground">
                <span>Shipping</span>
                <span>
                  {order.shippingCharge === 0
                    ? "Free"
                    : `₹${order.shippingCharge.toLocaleString("en-IN")}`}
                </span>
              </div>
              <div className="flex justify-between font-bold text-base mt-2">
                <span>Total</span>
                <span>₹{order.total.toLocaleString("en-IN")}</span>
              </div>
            </div>
          </div>

          {/* Customer + address */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="font-heading text-base font-bold mb-3">Customer</h3>
              <p className="text-sm">{order.user.name || "—"}</p>
              <p className="text-xs text-muted-foreground">{order.user.email}</p>
              {order.user.phone && (
                <p className="text-xs text-muted-foreground">{order.user.phone}</p>
              )}
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="font-heading text-base font-bold mb-3">Shipping address</h3>
              <p className="text-sm font-medium">{order.address.name}</p>
              <p className="text-xs text-muted-foreground">{order.address.phone}</p>
              <p className="text-sm mt-2 text-muted-foreground">
                {order.address.line1}
                {order.address.line2 && <>, {order.address.line2}</>}
                <br />
                {order.address.city}, {order.address.state} {order.address.pincode}
              </p>
            </div>
          </div>
        </div>

        {/* Status editor */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-gray-200 p-5 sticky top-6">
            <OrderStatusEditor
              orderId={order.id}
              status={order.status}
              paymentStatus={order.paymentStatus}
              trackingNumber={order.trackingNumber}
              trackingUrl={order.trackingUrl}
              notes={order.notes}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
