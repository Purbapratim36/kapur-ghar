"use client";

import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ProductCard from "@/components/product/ProductCard";
import EmptyState from "@/components/shared/EmptyState";
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
            <EmptyState
              kind="wishlist"
              title="Your wishlist is empty"
              description="Tap the heart on any product to save it here for later."
              ctaLabel="Explore the collection"
              ctaHref="/products"
            />
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
