import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ProductFilter from "@/components/product/ProductFilter";
import ProductGrid from "@/components/product/ProductGrid";
import { db } from "@/lib/db";
import { getProducts } from "@/lib/products";

// Always fetch fresh — newly added products show up immediately
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = await db.category.findUnique({
    where: { slug },
    select: { name: true, description: true },
  });
  if (!category) return { title: "Category not found" };
  return {
    title: `${category.name} | Kapur Ghar`,
    description:
      category.description ||
      `Browse our ${category.name} collection — handcrafted Assamese ethnic wear.`,
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const category = await db.category.findUnique({
    where: { slug, isActive: true },
  });

  if (!category) notFound();

  const products = await getProducts({ categorySlug: slug, limit: 60 });

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
              <Link
                href="/products"
                className="hover:text-brand-red transition-colors"
              >
                Shop
              </Link>
              <span>/</span>
              <span className="text-foreground font-medium">{category.name}</span>
            </nav>
          </div>
        </div>

        {/* Page Header */}
        <div className="bg-brand-cream/30 py-8 lg:py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="font-heading text-3xl lg:text-4xl font-bold text-foreground">
              {category.name}
            </h1>
            {category.description && (
              <p className="mt-2 text-muted-foreground max-w-2xl">
                {category.description}
              </p>
            )}
            <p className="mt-3 text-sm text-muted-foreground">
              {products.length} {products.length === 1 ? "product" : "products"}
            </p>
          </div>
        </div>

        {/* Products */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {products.length === 0 ? (
            <div className="max-w-md mx-auto text-center py-20">
              <h2 className="font-heading text-xl font-bold mb-2">
                No products in this category yet
              </h2>
              <p className="text-sm text-muted-foreground mb-6">
                We&apos;re working on adding pieces to our {category.name} collection.
                Check back soon, or browse our full catalogue.
              </p>
              <Link
                href="/products"
                className="inline-flex bg-brand-red hover:bg-brand-deep-red text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors"
              >
                Browse all products
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
