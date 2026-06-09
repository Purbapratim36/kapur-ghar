"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import {
  MapPin,
  CreditCard,
  Package,
  ChevronRight,
  Plus,
  Check,
  Shield,
  Lock,
} from "lucide-react";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AddressForm from "@/components/account/AddressForm";
import { useCartStore } from "@/store/cart";
import toast from "react-hot-toast";

const steps = [
  { id: 1, label: "Address", icon: MapPin },
  { id: 2, label: "Payment", icon: CreditCard },
  { id: 3, label: "Review", icon: Package },
];

interface Address {
  id: string;
  name: string;
  phone: string;
  line1: string;
  line2?: string | null;
  city: string;
  state: string;
  pincode: string;
  landmark?: string | null;
  isDefault?: boolean;
}

const paymentMethods = [
  { id: "RAZORPAY", label: "Pay Online", desc: "UPI, Cards, Net Banking, Wallets", icon: "💳" },
  { id: "UPI", label: "UPI", desc: "Google Pay, PhonePe, Paytm, BHIM", icon: "📱" },
  { id: "COD", label: "Cash on Delivery", desc: "Pay when you receive", icon: "💵" },
];

export default function CheckoutPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [step, setStep] = useState(1);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loadingAddrs, setLoadingAddrs] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<string>("");
  const [selectedPayment, setSelectedPayment] = useState("RAZORPAY");
  const [placing, setPlacing] = useState(false);

  const { items, getTotal, clearCart } = useCartStore();
  const subtotal = getTotal();
  const shipping = subtotal >= 2999 ? 0 : 99;
  const total = subtotal + shipping;

  // Auth guard — redirect to login with callback back to checkout
  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login?callbackUrl=/checkout");
    }
  }, [status, router]);

  // Load addresses
  useEffect(() => {
    if (status !== "authenticated") return;
    (async () => {
      setLoadingAddrs(true);
      try {
        const res = await fetch("/api/addresses");
        const data = await res.json();
        const list: Address[] = data.addresses || [];
        setAddresses(list);
        const def = list.find((a) => a.isDefault);
        if (def) setSelectedAddress(def.id);
        else if (list[0]) setSelectedAddress(list[0].id);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingAddrs(false);
      }
    })();
  }, [status]);

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      toast.error("Please choose a delivery address");
      return;
    }
    setPlacing(true);
    try {
      // 1. Create the DB order (and a linked Razorpay order if non-COD)
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          addressId: selectedAddress,
          paymentMethod: selectedPayment,
          items: items.map((i) => ({
            productId: i.productId,
            variantId: i.variantId,
            quantity: i.quantity,
          })),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Failed to place order");
        return;
      }

      // 2a. COD — done. Show success and redirect.
      if (selectedPayment === "COD") {
        toast.success("Order placed! Pay on delivery.");
        clearCart();
        router.push(`/account/orders/${data.orderId}`);
        return;
      }

      // 2b. Online — launch Razorpay popup
      if (!data.razorpayOrderId || !data.razorpayKeyId) {
        toast.error("Online payment is not configured yet. Try COD for now.");
        return;
      }

      const { launchRazorpayCheckout } = await import("@/lib/razorpay-checkout");
      const launched = await launchRazorpayCheckout({
        keyId: data.razorpayKeyId,
        razorpayOrderId: data.razorpayOrderId,
        amountPaise: Math.round(data.total * 100),
        orderNumber: data.orderNumber,
        customerName: session?.user?.name || undefined,
        customerEmail: session?.user?.email || undefined,
        onSuccess: async (resp) => {
          // 3. Verify the payment signature server-side
          const verifyRes = await fetch("/api/payment/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              orderId: data.orderId,
              razorpayOrderId: resp.razorpay_order_id,
              razorpayPaymentId: resp.razorpay_payment_id,
              razorpaySignature: resp.razorpay_signature,
            }),
          });
          if (!verifyRes.ok) {
            const v = await verifyRes.json();
            toast.error(v.error || "Payment verification failed");
            return;
          }
          toast.success("Payment successful! Order confirmed.");
          clearCart();
          router.push(`/account/orders/${data.orderId}`);
        },
        onDismiss: () => {
          toast("Payment cancelled. Your order is on hold — you can complete it from My Orders.");
          router.push(`/account/orders/${data.orderId}`);
        },
      });
      if (!launched) {
        toast.error("Could not open payment popup. Please check your network.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Could not place order");
    } finally {
      setPlacing(false);
    }
  };

  if (status === "loading") {
    return (
      <>
        <AnnouncementBar />
        <Header />
        <main className="min-h-screen flex items-center justify-center">
          <p className="text-muted-foreground">Loading…</p>
        </main>
        <Footer />
      </>
    );
  }

  if (items.length === 0) {
    return (
      <>
        <AnnouncementBar />
        <Header />
        <main className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="font-heading text-2xl font-bold mb-2">No items to checkout</h1>
            <Link href="/products" className="text-brand-red hover:underline">
              Continue shopping
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <AnnouncementBar />
      <Header />
      <main className="min-h-screen bg-brand-cream/20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Auth banner */}
          {session?.user && (
            <div className="mb-6 flex items-center gap-2 text-xs text-muted-foreground">
              <Lock className="h-3.5 w-3.5 text-green-600" />
              Signed in as <strong className="text-foreground">{session.user.email}</strong>
            </div>
          )}

          {/* Steps */}
          <div className="flex items-center justify-center gap-0 mb-10">
            {steps.map((s, i) => (
              <div key={s.id} className="flex items-center">
                <button
                  onClick={() => step > s.id && setStep(s.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    step >= s.id
                      ? "bg-brand-red text-white"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {step > s.id ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <s.icon className="h-4 w-4" />
                  )}
                  <span className="hidden sm:inline">{s.label}</span>
                </button>
                {i < steps.length - 1 && (
                  <ChevronRight className="h-4 w-4 mx-2 text-muted-foreground" />
                )}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {/* Step 1: Address */}
              {step === 1 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <h2 className="font-heading text-xl font-bold mb-4">Delivery Address</h2>

                  {loadingAddrs ? (
                    <p className="text-muted-foreground">Loading addresses…</p>
                  ) : addresses.length === 0 && !showAddForm ? (
                    <div className="bg-white rounded-xl border border-border p-8 text-center">
                      <MapPin className="h-10 w-10 text-brand-gold/40 mx-auto mb-3" />
                      <h3 className="font-heading font-bold mb-1">
                        No delivery address saved
                      </h3>
                      <p className="text-sm text-muted-foreground mb-5">
                        Add a delivery address to continue with your order.
                      </p>
                      <button
                        onClick={() => setShowAddForm(true)}
                        className="bg-brand-red hover:bg-brand-deep-red text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors"
                      >
                        Add delivery address
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {addresses.map((addr) => (
                        <label
                          key={addr.id}
                          className={`block p-4 rounded-xl border-2 cursor-pointer transition-colors ${
                            selectedAddress === addr.id
                              ? "border-brand-red bg-brand-red/5"
                              : "border-border hover:border-brand-gold/50"
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <input
                              type="radio"
                              name="address"
                              value={addr.id}
                              checked={selectedAddress === addr.id}
                              onChange={() => setSelectedAddress(addr.id)}
                              className="mt-1 accent-brand-red"
                            />
                            <div className="flex-1">
                              <p className="font-semibold text-sm">
                                {addr.name}{" "}
                                <span className="text-muted-foreground font-normal">
                                  {addr.phone}
                                </span>
                              </p>
                              <p className="text-sm text-muted-foreground mt-1">
                                {addr.line1}
                                {addr.line2 && `, ${addr.line2}`}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {addr.city}, {addr.state} - {addr.pincode}
                              </p>
                              {addr.isDefault && (
                                <span className="inline-block mt-2 text-[10px] bg-brand-gold/20 text-brand-muga px-2 py-0.5 rounded-full font-medium uppercase">
                                  Default
                                </span>
                              )}
                            </div>
                          </div>
                        </label>
                      ))}

                      {showAddForm ? (
                        <div className="bg-white p-5 border-2 border-brand-gold/40 rounded-xl">
                          <h3 className="font-heading font-bold mb-4">New address</h3>
                          <AddressForm
                            onSaved={async () => {
                              setShowAddForm(false);
                              const r = await fetch("/api/addresses");
                              const d = await r.json();
                              setAddresses(d.addresses || []);
                              const last = (d.addresses || []).at(-1);
                              if (last) setSelectedAddress(last.id);
                            }}
                            onCancel={() => setShowAddForm(false)}
                          />
                        </div>
                      ) : (
                        <button
                          onClick={() => setShowAddForm(true)}
                          className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-border rounded-xl text-sm text-muted-foreground hover:border-brand-red hover:text-brand-red transition-colors"
                        >
                          <Plus className="h-4 w-4" />
                          Add new address
                        </button>
                      )}
                    </div>
                  )}

                  <button
                    onClick={() => setStep(2)}
                    disabled={!selectedAddress}
                    className="mt-6 w-full bg-brand-red text-white py-3.5 rounded-xl text-sm font-semibold hover:bg-brand-deep-red transition-colors disabled:opacity-50"
                  >
                    Continue to Payment
                  </button>
                </motion.div>
              )}

              {/* Step 2: Payment */}
              {step === 2 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <h2 className="font-heading text-xl font-bold mb-4">Payment Method</h2>
                  <div className="space-y-3">
                    {paymentMethods.map((method) => (
                      <label
                        key={method.id}
                        className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-colors ${
                          selectedPayment === method.id
                            ? "border-brand-red bg-brand-red/5"
                            : "border-border hover:border-brand-gold/50"
                        }`}
                      >
                        <input
                          type="radio"
                          name="payment"
                          value={method.id}
                          checked={selectedPayment === method.id}
                          onChange={() => setSelectedPayment(method.id)}
                          className="accent-brand-red"
                        />
                        <span className="text-2xl">{method.icon}</span>
                        <div>
                          <p className="font-semibold text-sm">{method.label}</p>
                          <p className="text-xs text-muted-foreground">{method.desc}</p>
                        </div>
                      </label>
                    ))}
                  </div>

                  <div className="flex gap-3 mt-6">
                    <button
                      onClick={() => setStep(1)}
                      className="flex-1 py-3.5 border border-border rounded-xl text-sm font-semibold hover:bg-muted transition-colors"
                    >
                      Back
                    </button>
                    <button
                      onClick={() => setStep(3)}
                      className="flex-1 bg-brand-red text-white py-3.5 rounded-xl text-sm font-semibold hover:bg-brand-deep-red transition-colors"
                    >
                      Review Order
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Review */}
              {step === 3 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <h2 className="font-heading text-xl font-bold mb-4">Order Review</h2>

                  <div className="space-y-3 mb-6">
                    {items.map((item) => (
                      <div
                        key={`${item.productId}-${item.variantId}`}
                        className="flex gap-3 bg-white p-3 rounded-xl border border-border"
                      >
                        <div className="w-16 h-20 rounded-lg bg-muted overflow-hidden shrink-0">
                          {item.product.image ? (
                            <Image
                              src={item.product.image}
                              alt={item.product.name}
                              width={64}
                              height={80}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = "none";
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-brand-gold/40 font-heading text-xs">
                              KG
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium line-clamp-1">{item.product.name}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            Qty: {item.quantity}
                            {item.variantName && ` · ${item.variantName}`}
                          </p>
                          <p className="text-sm font-bold mt-1">
                            ₹{(item.product.price * item.quantity).toLocaleString("en-IN")}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setStep(2)}
                      className="flex-1 py-3.5 border border-border rounded-xl text-sm font-semibold hover:bg-muted transition-colors"
                    >
                      Back
                    </button>
                    <button
                      onClick={handlePlaceOrder}
                      disabled={placing}
                      className="flex-1 bg-brand-red text-white py-3.5 rounded-xl text-sm font-semibold hover:bg-brand-deep-red transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      <Shield className="h-4 w-4" />
                      {placing ? "Placing order…" : `Place Order · ₹${total.toLocaleString("en-IN")}`}
                    </button>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl border border-border p-5 sticky top-24">
                <h3 className="font-heading text-base font-bold mb-4">Order Summary</h3>
                <div className="space-y-2 pb-4 border-b border-border text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Items ({items.length})</span>
                    <span>₹{subtotal.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>
                      {shipping === 0 ? (
                        <span className="text-green-600">Free</span>
                      ) : (
                        `₹${shipping}`
                      )}
                    </span>
                  </div>
                </div>
                <div className="flex justify-between font-bold text-lg mt-4">
                  <span>Total</span>
                  <span>₹{total.toLocaleString("en-IN")}</span>
                </div>
                <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                  <Shield className="h-3.5 w-3.5 text-green-600" />
                  Secure checkout
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
