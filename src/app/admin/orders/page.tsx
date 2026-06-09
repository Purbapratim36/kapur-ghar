import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

const statusColor: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-700",
  CONFIRMED: "bg-blue-100 text-blue-700",
  PROCESSING: "bg-purple-100 text-purple-700",
  SHIPPED: "bg-indigo-100 text-indigo-700",
  DELIVERED: "bg-green-100 text-green-700",
  CANCELLED: "bg-gray-100 text-gray-700",
  RETURNED: "bg-orange-100 text-orange-700",
  REFUNDED: "bg-rose-100 text-rose-700",
};

const paymentColor: Record<string, string> = {
  PAID: "bg-green-100 text-green-700",
  PENDING: "bg-amber-100 text-amber-700",
  FAILED: "bg-red-100 text-red-700",
  REFUNDED: "bg-gray-100 text-gray-700",
};

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const session = await auth();
  if (
    !session?.user ||
    (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")
  ) {
    redirect("/login?callbackUrl=/admin/orders");
  }

  const orders = await db.order.findMany({
    include: {
      items: { select: { id: true } },
      user: { select: { email: true, name: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 200,
  });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Orders</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {orders.length} order{orders.length === 1 ? "" : "s"} total
        </p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {orders.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-muted-foreground">No orders yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50 text-left">
                  <th className="px-5 py-3 text-muted-foreground font-medium">Order #</th>
                  <th className="px-5 py-3 text-muted-foreground font-medium">Customer</th>
                  <th className="px-5 py-3 text-muted-foreground font-medium">Items</th>
                  <th className="px-5 py-3 text-muted-foreground font-medium">Total</th>
                  <th className="px-5 py-3 text-muted-foreground font-medium">Payment</th>
                  <th className="px-5 py-3 text-muted-foreground font-medium">Status</th>
                  <th className="px-5 py-3 text-muted-foreground font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr
                    key={o.id}
                    className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-5 py-3 font-mono text-xs">
                      <Link
                        href={`/admin/orders/${o.id}`}
                        className="text-brand-red font-semibold hover:underline"
                      >
                        {o.orderNumber}
                      </Link>
                    </td>
                    <td className="px-5 py-3">
                      <div>
                        <p className="text-sm">{o.user.name || "—"}</p>
                        <p className="text-xs text-muted-foreground">{o.user.email}</p>
                      </div>
                    </td>
                    <td className="px-5 py-3">{o.items.length}</td>
                    <td className="px-5 py-3 font-semibold">
                      ₹{o.total.toLocaleString("en-IN")}
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${paymentColor[o.paymentStatus] || ""}`}
                      >
                        {o.paymentStatus}
                      </span>
                      <p className="text-[10px] text-muted-foreground mt-1">
                        {o.paymentMethod}
                      </p>
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColor[o.status] || ""}`}
                      >
                        {o.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-xs text-muted-foreground">
                      {new Intl.DateTimeFormat("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      }).format(o.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
