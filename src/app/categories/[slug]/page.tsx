import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ProductFilter from "@/components/product/ProductFilter";
import ProductGrid from "@/components/product/ProductGrid";
import QuickFilterChips from "@/components/product/QuickFilterChips";
import { db } from "@/lib/db";
import { getProducts } from "@/lib/products";

export const dynamic = "force-dynamic";

interface SearchParams {
  color?: string;
  fabric?: string;
  occasion?: string;
  silkType?: string;
  price?: string;
  sort?: string;
}

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
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<SearchParams>;
}) {
  const { slug } = await params;
  const sp = await searchParams;

  const category = await db.category.findUnique({
    where: { slug, isActive: true },
  });

  if (!category) notFound();

  const products = await getProducts({
    categorySlug: slug,
    limit: 60,
    color: sp.color,
    fabric: sp.fabric,
    occasion: sp.occasion,
    silkType: sp.silkType,
    priceBand: sp.price,
    sort: sp.sort,
  });

  // Surface the most likely useful quick filters as chips above the grid
  const chipOptions = ["Red", "Pink", "Blue", "Black", "Gold", "White", "Maroon"];

  return (
    <>
      <AnnouncementBar />
      <Header />
      <main className="min-h-screen bg-brand-cream/10">
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

        {/* Banner hero */}
        {category.bannerImage ? (
          <div className="relative h-[220px] lg:h-[280px] overflow-hidden bg-brand-maroon">
            <Image
              src={category.bannerImage}
              alt={category.name}
              fill
              priority
              className="object-cover"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
            <div className="absolute inset-0 flex items-center">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <div className="max-w-xl">
                  {category.tagline && (
                    <p className="text-brand-gold text-xs tracking-[0.3em] uppercase font-medium mb-2">
                      {category.tagline}
                    </p>
                  )}
                  <h1 className="font-heading text-3xl lg:text-4xl font-bold text-white mb-2">
                    {category.name}
                  </h1>
                  {category.description && (
                    <p className="text-white/80 text-sm leading-relaxed max-w-md">
                      {category.description}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white border-b border-border py-5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {category.tagline && (
                <p className="text-brand-gold text-[10px] tracking-[0.3em] uppercase font-medium mb-1">
                  {category.tagline}
                </p>
              )}
              <h1 className="font-heading text-2xl lg:text-3xl font-bold text-foreground">
                {category.name}
              </h1>
              {category.description && (
                <p className="mt-1 text-muted-foreground text-sm max-w-2xl">
                  {category.description}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Quick filter chips row */}
        <div className="bg-white border-b border-border sticky top-16 lg:top-20 z-20 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <Suspense fallback={null}>
              <QuickFilterChips
                filterKey="color"
                options={chipOptions}
                allLabel={category.name}
              />
            </Suspense>
          </div>
        </div>

        {/* Products */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {products.length === 0 ? (
            <div className="max-w-md mx-auto text-center py-20">
              <h2 className="font-heading text-xl font-bold mb-2">
                No products match these filters
              </h2>
              <p className="text-sm text-muted-foreground mb-6">
                Try clearing some filters, or browse the full catalogue.
              </p>
              <Link
                href={`/categories/${slug}`}
                className="inline-flex bg-brand-red hover:bg-brand-deep-red text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors"
              >
                Clear all filters
              </Link>
            </div>
          ) : (
            <div className="lg:flex gap-6">
              <Suspense fallback={<div>Loading…</div>}>
                <ProductFilter totalProducts={products.length} />
              </Suspense>
              <Suspense fallback={<div>Loading…</div>}>
                <ProductGrid products={products} total={products.length} />
              </Suspense>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
