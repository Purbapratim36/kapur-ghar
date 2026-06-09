import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { Package } from "lucide-react";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

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

export default async function MyOrdersPage() {
  const session = await auth();
  if (!session?.user) redirect("/login?callbackUrl=/account/orders");

  const orders = await db.order.findMany({
    where: { userId: session.user.id },
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <>
      <AnnouncementBar />
      <Header />
      <main className="min-h-screen bg-brand-cream/20 py-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <h1 className="font-heading text-2xl font-bold">My Orders</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {orders.length === 0
                ? "You haven't placed any orders yet."
                : `${orders.length} order${orders.length === 1 ? "" : "s"}`}
            </p>
          </div>

          {orders.length === 0 ? (
            <div className="bg-white rounded-xl border border-border p-10 text-center">
              <Package className="h-12 w-12 text-brand-gold/40 mx-auto mb-3" />
              <h3 className="font-heading text-lg font-bold mb-1">
                No orders yet
              </h3>
              <p className="text-sm text-muted-foreground mb-5">
                When you place an order it&apos;ll show up here.
              </p>
              <Link
                href="/products"
                className="inline-flex bg-brand-red hover:bg-brand-deep-red text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors"
              >
                Start shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {orders.map((order) => (
                <Link
                  key={order.id}
                  href={`/account/orders/${order.id}`}
                  className="block bg-white rounded-xl border border-border hover:border-brand-red/40 transition-colors p-5"
                >
                  <div className="flex items-start justify-between flex-wrap gap-3 mb-3">
                    <div>
                      <p className="font-mono text-xs text-muted-foreground">
                        {order.orderNumber}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {new Intl.DateTimeFormat("en-IN", {
                          dateStyle: "long",
                        }).format(order.createdAt)}
                      </p>
                    </div>
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider ${statusColor[order.status] || ""}`}
                    >
                      {order.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 flex-wrap">
                    {order.items.slice(0, 4).map((item) => (
                      <div
                        key={item.id}
                        className="w-14 h-16 rounded-lg bg-muted overflow-hidden shrink-0"
                      >
                        {item.image ? (
                          <Image
                            src={item.image}
                            alt={item.name}
                            width={56}
                            height={64}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-brand-gold/40 font-heading text-xs">
                            KG
                          </div>
                        )}
                      </div>
                    ))}
                    {order.items.length > 4 && (
                      <p className="text-xs text-muted-foreground">
                        +{order.items.length - 4} more
                      </p>
                    )}
                    <div className="ml-auto text-right">
                      <p className="text-xs text-muted-foreground">Total</p>
                      <p className="font-bold">
                        ₹{order.total.toLocaleString("en-IN")}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
