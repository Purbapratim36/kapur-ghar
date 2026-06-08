"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Heart,
  ShoppingBag,
  Share2,
  Star,
  Truck,
  Shield,
  RotateCcw,
  Ruler,
  ChevronDown,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCartStore } from "@/store/cart";
import { useWishlistStore } from "@/store/wishlist";
import toast from "react-hot-toast";
import type { Product, ProductVariant } from "@/types";

interface ProductInfoProps {
  product: Product;
}

export default function ProductInfo({ product }: ProductInfoProps) {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    null
  );
  const [quantity, setQuantity] = useState(1);
  const [openSection, setOpenSection] = useState<string | null>("description");

  const addToCart = useCartStore((s) => s.addItem);
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } =
    useWishlistStore();
  const isWished = isInWishlist(product.id);

  const price = selectedVariant?.price ?? product.price;
  const stock = selectedVariant?.stock ?? product.stock;
  const discount = product.comparePrice
    ? Math.round(((product.comparePrice - price) / product.comparePrice) * 100)
    : 0;

  const handleAddToCart = () => {
    if (stock <= 0) return;
    addToCart(
      {
        id: product.id,
        name: product.name,
        slug: product.slug,
        price,
        comparePrice: product.comparePrice,
        image: product.images?.[0]?.url || "",
        stock,
      },
      quantity,
      selectedVariant?.id || null,
      selectedVariant?.value || null
    );
    toast.success("Added to cart!");
  };

  const handleToggleWishlist = () => {
    if (isWished) {
      removeFromWishlist(product.id);
      toast("Removed from wishlist");
    } else {
      addToWishlist({
        id: product.id,
        name: product.name,
        slug: product.slug,
        price,
        comparePrice: product.comparePrice,
        image: product.images?.[0]?.url || "",
      });
      toast.success("Added to wishlist!");
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({ title: product.name, url });
    } else {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied!");
    }
  };

  const infoSections = [
    {
      key: "description",
      label: "Product Description",
      content: product.description,
    },
    ...(product.fabric
      ? [
          {
            key: "fabric",
            label: "Fabric & Material",
            content: `Fabric: ${product.fabric}${product.weight ? `\nWeight: ${product.weight}` : ""}${product.dimensions ? `\nDimensions: ${product.dimensions}` : ""}`,
          },
        ]
      : []),
    ...(product.careInstructions
      ? [
          {
            key: "care",
            label: "Care Instructions",
            content: product.careInstructions,
          },
        ]
      : []),
  ];

  return (
    <div className="space-y-6">
      {/* Category breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-brand-red">
          Home
        </Link>
        <span>/</span>
        <Link href="/products" className="hover:text-brand-red">
          Shop
        </Link>
        <span>/</span>
        <Link
          href={`/categories/${product.category?.slug || ""}`}
          className="hover:text-brand-red"
        >
          {product.category?.name || "Category"}
        </Link>
      </nav>

      {/* Title & Rating */}
      <div>
        {product.fabric && (
          <p className="text-sm text-brand-gold font-medium tracking-wider uppercase mb-1">
            {product.fabric}
          </p>
        )}
        <h1 className="font-heading text-2xl lg:text-3xl font-bold text-foreground">
          {product.name}
        </h1>
        {product.avgRating !== undefined && product.avgRating > 0 && (
          <div className="flex items-center gap-3 mt-2">
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.round(product.avgRating!)
                      ? "text-brand-gold fill-brand-gold"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">
              {product.avgRating.toFixed(1)} ({product._count?.reviews || 0}{" "}
              reviews)
            </span>
          </div>
        )}
      </div>

      {/* Price */}
      <div className="flex items-end gap-3">
        <span className="text-3xl font-bold text-foreground">
          ₹{price.toLocaleString("en-IN")}
        </span>
        {product.comparePrice && product.comparePrice > price && (
          <>
            <span className="text-lg text-muted-foreground line-through">
              ₹{product.comparePrice.toLocaleString("en-IN")}
            </span>
            <span className="text-sm font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded">
              {discount}% OFF
            </span>
          </>
        )}
      </div>

      <p className="text-xs text-muted-foreground">
        Inclusive of all taxes. Free shipping on orders above ₹2,999.
      </p>

      {/* Variants */}
      {product.variants && product.variants.length > 0 && (
        <div>
          <p className="text-sm font-semibold mb-2">
            Select {product.variants[0]?.name || "Option"}:
          </p>
          <div className="flex flex-wrap gap-2">
            {product.variants.map((variant) => (
              <button
                key={variant.id}
                onClick={() => setSelectedVariant(variant)}
                disabled={variant.stock <= 0}
                className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
                  selectedVariant?.id === variant.id
                    ? "border-brand-red bg-brand-red/5 text-brand-red"
                    : "border-border hover:border-brand-gold"
                }`}
              >
                {variant.value}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quantity + Actions */}
      <div className="flex items-center gap-4">
        <div className="flex items-center border border-border rounded-lg">
          <button
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="px-3 py-2 text-lg hover:bg-muted transition-colors"
          >
            −
          </button>
          <span className="px-4 py-2 text-sm font-semibold min-w-[40px] text-center">
            {quantity}
          </span>
          <button
            onClick={() => setQuantity((q) => Math.min(stock, q + 1))}
            className="px-3 py-2 text-lg hover:bg-muted transition-colors"
          >
            +
          </button>
        </div>
        <p className="text-sm text-muted-foreground">
          {stock > 0 ? (
            stock <= 5 ? (
              <span className="text-orange-600">Only {stock} left!</span>
            ) : (
              "In Stock"
            )
          ) : (
            <span className="text-red-600">Out of Stock</span>
          )}
        </p>
      </div>

      {/* CTA Buttons */}
      <div className="flex gap-3">
        <button
          onClick={handleAddToCart}
          disabled={stock <= 0}
          className="flex-1 flex items-center justify-center gap-2 bg-brand-red hover:bg-brand-deep-red text-white py-3.5 rounded-xl text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ShoppingBag className="h-5 w-5" />
          {stock > 0 ? "Add to Cart" : "Out of Stock"}
        </button>
        <button
          onClick={handleToggleWishlist}
          className={`w-14 flex items-center justify-center rounded-xl border transition-all ${
            isWished
              ? "bg-brand-red border-brand-red text-white"
              : "border-border hover:border-brand-red"
          }`}
          aria-label={isWished ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart className={`h-5 w-5 ${isWished ? "fill-current" : ""}`} />
        </button>
        <button
          onClick={handleShare}
          className="w-14 flex items-center justify-center rounded-xl border border-border hover:border-brand-gold transition-colors"
          aria-label="Share"
        >
          <Share2 className="h-5 w-5" />
        </button>
      </div>

      {/* Trust badges */}
      <div className="grid grid-cols-3 gap-3 py-4 border-y border-border">
        {[
          { icon: Truck, label: "Free Shipping", sub: "Above ₹2,999" },
          { icon: RotateCcw, label: "Easy Returns", sub: "7-day policy" },
          { icon: Shield, label: "Authentic", sub: "100% genuine" },
        ].map(({ icon: Icon, label, sub }) => (
          <div key={label} className="flex items-center gap-2 text-center">
            <Icon className="h-5 w-5 text-brand-gold shrink-0" />
            <div className="text-left">
              <p className="text-xs font-semibold text-foreground">{label}</p>
              <p className="text-[10px] text-muted-foreground">{sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Accordion sections */}
      <div className="space-y-0">
        {infoSections.map((section) => (
          <div key={section.key} className="border-b border-border">
            <button
              onClick={() =>
                setOpenSection(
                  openSection === section.key ? null : section.key
                )
              }
              className="w-full flex items-center justify-between py-4 text-sm font-semibold text-foreground"
            >
              {section.label}
              <ChevronDown
                className={`h-4 w-4 transition-transform ${
                  openSection === section.key ? "rotate-180" : ""
                }`}
              />
            </button>
            <AnimatePresence>
              {openSection === section.key && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <p className="text-sm text-muted-foreground leading-relaxed pb-4 whitespace-pre-line">
                    {section.content}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
}
