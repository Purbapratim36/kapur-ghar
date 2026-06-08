"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";
import { useCartStore } from "@/store/cart";
import { useWishlistStore } from "@/store/wishlist";
import toast from "react-hot-toast";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    comparePrice: number | null;
    images: { url: string; alt: string | null }[];
    stock: number;
    isNew?: boolean;
    fabric?: string | null;
    avgRating?: number;
    _count?: { reviews: number };
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const addToCart = useCartStore((s) => s.addItem);
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } =
    useWishlistStore();
  const isWished = isInWishlist(product.id);
  const image = product.images?.[0];
  const discount = product.comparePrice
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.stock <= 0) return;
    addToCart({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      comparePrice: product.comparePrice,
      image: image?.url || "",
      stock: product.stock,
    });
    toast.success("Added to cart");
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isWished) {
      removeFromWishlist(product.id);
      toast("Removed from wishlist");
    } else {
      addToWishlist({
        id: product.id,
        name: product.name,
        slug: product.slug,
        price: product.price,
        comparePrice: product.comparePrice,
        image: image?.url || "",
      });
      toast.success("Added to wishlist");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group"
    >
      <Link href={`/products/${product.slug}`} className="block">
        {/* Image */}
        <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-muted mb-3">
          {image ? (
            <Image
              src={image.url}
              alt={image.alt || product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-brand-cream to-muted flex items-center justify-center">
              <span className="font-heading text-2xl text-brand-gold/40">KG</span>
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5">
            {product.isNew && (
              <span className="px-2.5 py-1 bg-brand-gold text-white text-[10px] font-bold uppercase tracking-wider rounded-full">
                New
              </span>
            )}
            {discount > 0 && (
              <span className="px-2.5 py-1 bg-brand-red text-white text-[10px] font-bold rounded-full">
                {discount}% OFF
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="absolute top-2.5 right-2.5 flex flex-col gap-2">
            <button
              onClick={handleToggleWishlist}
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-all shadow-md ${
                isWished
                  ? "bg-brand-red text-white"
                  : "bg-white/90 hover:bg-white text-foreground"
              }`}
              aria-label={isWished ? "Remove from wishlist" : "Add to wishlist"}
            >
              <Heart
                className={`h-4 w-4 ${isWished ? "fill-current" : ""}`}
              />
            </button>
            <button
              onClick={handleAddToCart}
              disabled={product.stock <= 0}
              className="w-9 h-9 rounded-full bg-white/90 hover:bg-white flex items-center justify-center transition-all shadow-md disabled:opacity-50"
              aria-label="Add to cart"
            >
              <ShoppingBag className="h-4 w-4" />
            </button>
          </div>

          {product.stock <= 0 && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <span className="bg-white text-foreground px-4 py-1.5 rounded-full text-xs font-semibold">
                Sold Out
              </span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="space-y-1">
          {product.fabric && (
            <p className="text-[11px] uppercase tracking-wider text-brand-gold font-medium">
              {product.fabric}
            </p>
          )}
          <h3 className="text-sm font-medium text-foreground line-clamp-2 group-hover:text-brand-red transition-colors">
            {product.name}
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-base font-bold text-foreground">
              ₹{product.price.toLocaleString("en-IN")}
            </span>
            {product.comparePrice && product.comparePrice > product.price && (
              <span className="text-sm text-muted-foreground line-through">
                ₹{product.comparePrice.toLocaleString("en-IN")}
              </span>
            )}
          </div>
          {product.avgRating !== undefined && product.avgRating > 0 && (
            <div className="flex items-center gap-1.5">
              <div className="flex items-center gap-0.5 px-1.5 py-0.5 bg-green-600 text-white rounded text-[11px] font-semibold">
                {product.avgRating.toFixed(1)} ★
              </div>
              {product._count?.reviews && (
                <span className="text-xs text-muted-foreground">
                  ({product._count.reviews})
                </span>
              )}
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
}
