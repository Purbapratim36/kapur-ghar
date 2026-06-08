"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag, Star } from "lucide-react";
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
    isFeatured?: boolean;
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
        {/* Image area — fills the card, no rounding mismatch */}
        <div className="relative aspect-[3/4] rounded-lg overflow-hidden bg-muted">
          {image ? (
            <Image
              src={image.url}
              alt={image.alt || product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-brand-cream to-muted flex items-center justify-center">
              <span className="font-heading text-2xl text-brand-gold/40">KG</span>
            </div>
          )}

          {/* Discount badge — top left */}
          {discount > 0 && (
            <div className="absolute top-0 left-0">
              <div className="bg-brand-red text-white text-[10px] font-bold rounded-br-lg px-2.5 py-1.5 shadow-md">
                {discount}% OFF
              </div>
            </div>
          )}

          {/* NEW badge — sits above discount if both */}
          {product.isNew && discount === 0 && (
            <div className="absolute top-0 left-0">
              <div className="bg-brand-gold text-white text-[10px] font-bold uppercase tracking-wider rounded-br-lg px-2.5 py-1.5 shadow-md">
                New
              </div>
            </div>
          )}

          {/* Heart icon — top right, always visible */}
          <button
            onClick={handleToggleWishlist}
            className={`absolute top-2 right-2 w-9 h-9 rounded-full flex items-center justify-center transition-all shadow-md ${
              isWished
                ? "bg-brand-red text-white"
                : "bg-white/95 hover:bg-white text-foreground"
            }`}
            aria-label={isWished ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart className={`h-4 w-4 ${isWished ? "fill-current" : ""}`} />
          </button>

          {/* Bestseller ribbon — bottom left (only if featured) */}
          {product.isFeatured && (
            <div className="absolute bottom-0 left-0 bg-brand-deep-red text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 [clip-path:polygon(0_0,100%_0,calc(100%-8px)_100%,0_100%)] pr-4">
              Bestseller
            </div>
          )}

          {/* Rating badge — bottom right */}
          {product.avgRating !== undefined && product.avgRating > 0 && (
            <div className="absolute bottom-2 right-2 bg-white/95 backdrop-blur-sm flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[11px] font-semibold text-foreground shadow-sm">
              {product.avgRating.toFixed(1)}
              <Star className="h-2.5 w-2.5 fill-green-600 text-green-600" />
            </div>
          )}

          {/* Sold out overlay */}
          {product.stock <= 0 && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <span className="bg-white text-foreground px-4 py-1.5 rounded-full text-xs font-semibold">
                Sold Out
              </span>
            </div>
          )}
        </div>

        {/* Info row — name on left, add-to-cart bag on right (always visible) */}
        <div className="mt-3 flex items-start gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-medium text-foreground line-clamp-2 group-hover:text-brand-red transition-colors leading-snug">
              {product.name}
            </h3>
            <div className="flex items-baseline gap-2 mt-1.5 flex-wrap">
              {product.comparePrice && product.comparePrice > product.price && (
                <span className="text-xs text-muted-foreground line-through">
                  ₹{product.comparePrice.toLocaleString("en-IN")}
                </span>
              )}
              <span className="text-sm font-bold text-foreground">
                ₹{product.price.toLocaleString("en-IN")}
              </span>
              {discount > 0 && (
                <span className="text-[11px] font-semibold text-brand-red">
                  {discount}% OFF
                </span>
              )}
            </div>
          </div>
          <button
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
            className="shrink-0 w-9 h-9 rounded-md bg-brand-red hover:bg-brand-deep-red text-white flex items-center justify-center shadow-md transition-colors disabled:opacity-50"
            aria-label="Add to cart"
          >
            <ShoppingBag className="h-4 w-4" />
          </button>
        </div>
      </Link>
    </motion.div>
  );
}
