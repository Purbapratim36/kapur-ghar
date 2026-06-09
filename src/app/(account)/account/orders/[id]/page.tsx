import Link from "next/link";
import Image from "next/image";
import { notFound, redirect } from "next/navigation";
import { ChevronLeft, CheckCircle2, Truck, Package, MapPin } from "lucide-react";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

const statusSteps = ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED"];

export default async function CustomerOrderDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user) redirect(`/login?callbackUrl=/account/orders/${id}`);

  const order = await db.order.findFirst({
    where: { id, userId: session.user.id },
    include: { items: true, address: true },
  });
  if (!order) notFound();

  const currentStep = statusSteps.indexOf(order.status);

  return (
    <>
      <AnnouncementBar />
      <Header />
      <main className="min-h-screen bg-brand-cream/20 py-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/account/orders"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-brand-red transition-colors mb-4"
          >
            <ChevronLeft className="h-4 w-4" />
            All orders
          </Link>

          <div className="bg-white rounded-xl border border-border p-6 mb-4">
            <div className="flex items-start justify-between flex-wrap gap-3 mb-4">
              <div>
                <p className="text-xs text-muted-foreground">Order</p>
                <h1 className="font-mono text-lg font-bold">{order.orderNumber}</h1>
                <p className="text-xs text-muted-foreground mt-1">
                  Placed on{" "}
                  {new Intl.DateTimeFormat("en-IN", {
                    dateStyle: "long",
                  }).format(order.createdAt)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Total</p>
                <p className="font-bold text-lg">
                  ₹{order.total.toLocaleString("en-IN")}
                </p>
                <span
                  className={`inline-block mt-1 text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full ${
                    order.paymentStatus === "PAID"
                      ? "bg-green-100 text-green-700"
                      : "bg-amber-100 text-amber-700"
                  }`}
                >
                  Payment {order.paymentStatus}
                </span>
              </div>
            </div>

            {/* Status timeline */}
            {currentStep >= 0 && order.status !== "CANCELLED" && (
              <div className="flex items-center justify-between mt-6">
                {statusSteps.map((s, i) => {
                  const done = i <= currentStep;
                  return (
                    <div key={s} className="flex-1 flex flex-col items-center relative">
                      {i > 0 && (
                        <div
                          className={`absolute right-1/2 top-3 h-[2px] w-full ${
                            i <= currentStep ? "bg-brand-red" : "bg-muted"
                          }`}
                        />
                      )}
                      <div
                        className={`relative w-7 h-7 rounded-full flex items-center justify-center ${
                          done ? "bg-brand-red text-white" : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {s === "DELIVERED" ? (
                          <CheckCircle2 className="h-4 w-4" />
                        ) : s === "SHIPPED" ? (
                          <Truck className="h-4 w-4" />
                        ) : (
                          <Package className="h-4 w-4" />
                        )}
                      </div>
                      <p
                        className={`text-[10px] uppercase tracking-wider font-medium mt-2 ${
                          done ? "text-foreground" : "text-muted-foreground"
                        }`}
                      >
                        {s}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}

            {order.status === "CANCELLED" && (
              <p className="text-sm text-red-600 mt-4">This order was cancelled.</p>
            )}

            {order.trackingNumber && (
              <div className="mt-5 pt-5 border-t border-border text-sm">
                <p className="font-medium">Tracking number: {order.trackingNumber}</p>
                {order.trackingUrl && (
                  <a
                    href={order.trackingUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-brand-red hover:underline text-xs"
                  >
                    Track shipment →
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Items */}
          <div className="bg-white rounded-xl border border-border p-6 mb-4">
            <h2 className="font-heading text-base font-bold mb-4">Items</h2>
            <div className="divide-y divide-gray-100">
              {order.items.map((item) => (
                <div key={item.id} className="py-3 flex items-center gap-3">
                  <div className="w-14 h-16 rounded-lg bg-muted overflow-hidden shrink-0">
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
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm line-clamp-1">{item.name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Qty {item.quantity}
                    </p>
                  </div>
                  <p className="font-semibold whitespace-nowrap">
                    ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-border space-y-1 text-sm">
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
              <div className="flex justify-between font-bold text-base mt-2 pt-2 border-t border-border">
                <span>Total</span>
                <span>₹{order.total.toLocaleString("en-IN")}</span>
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="bg-white rounded-xl border border-border p-6">
            <h2 className="font-heading text-base font-bold mb-3 flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Shipping address
            </h2>
            <p className="text-sm font-medium">{order.address.name}</p>
            <p className="text-xs text-muted-foreground">{order.address.phone}</p>
            <p className="text-sm mt-2 text-muted-foreground leading-relaxed">
              {order.address.line1}
              {order.address.line2 && <>, {order.address.line2}</>}
              <br />
              {order.address.city}, {order.address.state} {order.address.pincode}
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
