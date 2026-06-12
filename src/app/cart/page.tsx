"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, X, ArrowRight, Tag, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import EmptyState from "@/components/shared/EmptyState";
import { useCartStore } from "@/store/cart";
import toast from "react-hot-toast";

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, getTotal } =
    useCartStore();
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);

  const subtotal = getTotal();
  const shipping = subtotal >= 2999 ? 0 : 99;
  const discount = appliedCoupon ? subtotal * 0.1 : 0;
  const total = subtotal - discount + shipping;

  const handleApplyCoupon = () => {
    if (couponCode.toUpperCase() === "KAPURGHAR20") {
      setAppliedCoupon(couponCode.toUpperCase());
      toast.success("Coupon applied! 10% discount added.");
    } else {
      toast.error("Invalid coupon code.");
    }
    setCouponCode("");
  };

  return (
    <>
      <AnnouncementBar />
      <Header />
      <main className="min-h-screen bg-brand-cream/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h1 className="font-heading text-2xl lg:text-3xl font-bold text-foreground">
              Shopping Cart
              {items.length > 0 && (
                <span className="text-muted-foreground text-lg font-normal ml-2">
                  ({items.length} {items.length === 1 ? "item" : "items"})
                </span>
              )}
            </h1>
            {items.length > 0 && (
              <button
                onClick={() => {
                  clearCart();
                  toast("Cart cleared");
                }}
                className="text-sm text-muted-foreground hover:text-brand-red flex items-center gap-1"
              >
                <Trash2 className="h-4 w-4" />
                Clear all
              </button>
            )}
          </div>

          {items.length === 0 ? (
            <EmptyState
              kind="cart"
              title="Your cart is empty"
              description="Looks like you haven't added anything to your cart yet. Let's fix that."
              ctaLabel="Continue shopping"
              ctaHref="/products"
            />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                <AnimatePresence>
                  {items.map((item) => (
                    <motion.div
                      key={`${item.productId}-${item.variantId}`}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      className="flex gap-4 bg-white p-4 rounded-xl border border-border"
                    >
                      {/* Image */}
                      <Link
                        href={`/products/${item.product.slug}`}
                        className="shrink-0 w-24 h-32 sm:w-32 sm:h-40 rounded-lg overflow-hidden bg-muted"
                      >
                        {item.product.image ? (
                          <Image
                            src={item.product.image}
                            alt={item.product.name}
                            width={128}
                            height={160}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = "none";
                            }}
                          />
                        ) : (
                          <div className="w-full h-full bg-brand-cream flex items-center justify-center">
                            <span className="font-heading text-brand-gold/40">KG</span>
                          </div>
                        )}
                      </Link>

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between gap-2">
                          <Link
                            href={`/products/${item.product.slug}`}
                            className="text-sm font-medium text-foreground hover:text-brand-red transition-colors line-clamp-2"
                          >
                            {item.product.name}
                          </Link>
                          <button
                            onClick={() =>
                              removeItem(item.productId, item.variantId)
                            }
                            className="shrink-0 p-1 hover:bg-muted rounded-full"
                            aria-label="Remove item"
                          >
                            <X className="h-4 w-4 text-muted-foreground" />
                          </button>
                        </div>

                        {item.variantName && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Size: {item.variantName}
                          </p>
                        )}

                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-base font-bold">
                            ₹{item.product.price.toLocaleString("en-IN")}
                          </span>
                          {item.product.comparePrice &&
                            item.product.comparePrice > item.product.price && (
                              <span className="text-sm text-muted-foreground line-through">
                                ₹{item.product.comparePrice.toLocaleString("en-IN")}
                              </span>
                            )}
                        </div>

                        {/* Quantity */}
                        <div className="flex items-center gap-3 mt-3">
                          <div className="flex items-center border border-border rounded-lg">
                            <button
                              onClick={() =>
                                updateQuantity(
                                  item.productId,
                                  item.quantity - 1,
                                  item.variantId
                                )
                              }
                              disabled={item.quantity <= 1}
                              className="p-1.5 hover:bg-muted transition-colors disabled:opacity-30"
                            >
                              <Minus className="h-3.5 w-3.5" />
                            </button>
                            <span className="px-3 text-sm font-semibold">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(
                                  item.productId,
                                  item.quantity + 1,
                                  item.variantId
                                )
                              }
                              disabled={item.quantity >= item.product.stock}
                              className="p-1.5 hover:bg-muted transition-colors disabled:opacity-30"
                            >
                              <Plus className="h-3.5 w-3.5" />
                            </button>
                          </div>
                          <span className="text-sm font-semibold text-foreground">
                            ₹
                            {(
                              item.product.price * item.quantity
                            ).toLocaleString("en-IN")}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-xl border border-border p-6 sticky top-24">
                  <h2 className="font-heading text-lg font-bold text-foreground mb-4">
                    Order Summary
                  </h2>

                  {/* Coupon */}
                  <div className="mb-4 pb-4 border-b border-border">
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <input
                          type="text"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value)}
                          placeholder="Coupon code"
                          className="w-full pl-9 pr-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-red"
                        />
                      </div>
                      <button
                        onClick={handleApplyCoupon}
                        className="px-4 py-2 bg-foreground text-white rounded-lg text-sm font-medium hover:bg-foreground/90"
                      >
                        Apply
                      </button>
                    </div>
                    {appliedCoupon && (
                      <div className="flex items-center justify-between mt-2 text-sm">
                        <span className="text-green-600 font-medium">
                          {appliedCoupon} applied
                        </span>
                        <button
                          onClick={() => setAppliedCoupon(null)}
                          className="text-xs text-brand-red hover:underline"
                        >
                          Remove
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3 mb-4 pb-4 border-b border-border">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>₹{subtotal.toLocaleString("en-IN")}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-sm text-green-600">
                        <span>Discount</span>
                        <span>-₹{discount.toLocaleString("en-IN")}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm">
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

                  <div className="flex justify-between text-lg font-bold mb-6">
                    <span>Total</span>
                    <span>₹{total.toLocaleString("en-IN")}</span>
                  </div>

                  <Link
                    href="/checkout"
                    className="flex items-center justify-center gap-2 w-full bg-brand-red hover:bg-brand-deep-red text-white py-3.5 rounded-xl text-sm font-semibold transition-colors"
                  >
                    Proceed to Checkout
                    <ArrowRight className="h-4 w-4" />
                  </Link>

                  {shipping > 0 && (
                    <p className="text-xs text-muted-foreground text-center mt-3">
                      Add ₹{(2999 - subtotal).toLocaleString("en-IN")} more for
                      free shipping
                    </p>
                  )}

                  <Link
                    href="/products"
                    className="block text-center text-sm text-brand-red hover:underline mt-4"
                  >
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
