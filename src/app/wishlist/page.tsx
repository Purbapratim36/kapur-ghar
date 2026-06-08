"use client";

import Link from "next/link";
import { Heart, ArrowRight } from "lucide-react";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ProductCard from "@/components/product/ProductCard";
import { useWishlistStore } from "@/store/wishlist";

export default function WishlistPage() {
  const { items } = useWishlistStore();

  const productCards = items.map((item) => ({
    id: item.id,
    name: item.name,
    slug: item.slug,
    price: item.price,
    comparePrice: item.comparePrice,
    images: [{ url: item.image, alt: item.name }],
    stock: 10,
    isNew: false,
    fabric: null,
  }));

  return (
    <>
      <AnnouncementBar />
      <Header />
      <main className="min-h-screen bg-brand-cream/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="font-heading text-2xl lg:text-3xl font-bold text-foreground mb-8">
            My Wishlist
            {items.length > 0 && (
              <span className="text-muted-foreground text-lg font-normal ml-2">
                ({items.length} {items.length === 1 ? "item" : "items"})
              </span>
            )}
          </h1>

          {items.length === 0 ? (
            <div className="text-center py-20">
              <Heart className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
              <h2 className="font-heading text-2xl font-bold text-foreground mb-2">
                Your wishlist is empty
              </h2>
              <p className="text-muted-foreground mb-6">
                Save items you love to your wishlist and shop them later.
              </p>
              <Link
                href="/products"
                className="inline-flex items-center gap-2 bg-brand-red text-white px-6 py-3 rounded-full text-sm font-semibold hover:bg-brand-deep-red transition-colors"
              >
                Explore Collection
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
              {productCards.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
