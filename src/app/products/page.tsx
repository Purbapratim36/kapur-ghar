import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ProductFilter from "@/components/product/ProductFilter";
import ProductGrid from "@/components/product/ProductGrid";
import { getProducts } from "@/lib/products";

export const metadata: Metadata = {
  title: "Shop All Products",
  description:
    "Browse our complete collection of Assamese Mekhela Sador, Muga Silk, Pat Silk, Eri Silk, and handloom ethnic wear.",
};

export const revalidate = 30;

export default async function ProductsPage() {
  const products = await getProducts({ limit: 60 });

  return (
    <>
      <AnnouncementBar />
      <Header />
      <main className="min-h-screen">
        {/* Breadcrumb */}
        <div className="bg-brand-cream/50 border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <nav className="flex items-center gap-2 text-sm text-muted-foreground">
              <Link href="/" className="hover:text-brand-red transition-colors">
                Home
              </Link>
              <span>/</span>
              <span className="text-foreground font-medium">All Products</span>
            </nav>
          </div>
        </div>

        {/* Page Header */}
        <div className="bg-brand-cream/30 py-8 lg:py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="font-heading text-3xl lg:text-4xl font-bold text-foreground">
              Our Collection
            </h1>
            <p className="mt-2 text-muted-foreground max-w-xl">
              Explore our handcrafted Assamese ethnic wear — each piece tells a story
              of tradition, artistry, and heritage.
            </p>
          </div>
        </div>

        {/* Products */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {products.length === 0 ? (
            <div className="max-w-md mx-auto text-center py-20">
              <h2 className="font-heading text-xl font-bold mb-2">
                No products yet
              </h2>
              <p className="text-sm text-muted-foreground mb-6">
                Once you add products from the admin panel, they will appear here.
              </p>
              <Link
                href="/admin/products"
                className="inline-flex bg-brand-red hover:bg-brand-deep-red text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors"
              >
                Go to Admin
              </Link>
            </div>
          ) : (
            <div className="lg:flex gap-8 mt-4">
              <Suspense fallback={<div>Loading…</div>}>
                <ProductFilter totalProducts={products.length} />
              </Suspense>
              <ProductGrid products={products} />
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
