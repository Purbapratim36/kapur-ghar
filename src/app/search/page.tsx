"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Search } from "lucide-react";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ProductCard from "@/components/product/ProductCard";

const allProducts = Array.from({ length: 8 }, (_, i) => ({
  id: `search-${i + 1}`,
  name: [
    "Golden Muga Silk Mekhela Sador",
    "Royal Pat Silk Wedding Set",
    "Handwoven Eri Silk Mekhela",
    "Traditional Gamusa Pattern Mekhela",
    "Bridal Red Silk Mekhela Sador",
    "Assamese Motif Cotton Mekhela",
    "Festive Muga Silk Collection",
    "Designer Pat Silk Ensemble",
  ][i],
  slug: `product-${i + 1}`,
  price: [8999, 12499, 6999, 3499, 15999, 2999, 9499, 11999][i],
  comparePrice: [11999, 16999, 8999, 4999, 21999, 4499, 12999, 15999][i],
  images: [{ url: `/images/products/product-${i + 1}.jpg`, alt: null }],
  stock: 10,
  isNew: i < 2,
  fabric: ["Muga Silk", "Pat Silk", "Eri Silk", "Cotton", "Silk", "Cotton", "Muga Silk", "Pat Silk"][i],
  avgRating: [4.8, 4.9, 4.7, 4.5, 5.0, 4.3, 4.6, 4.8][i],
  _count: { reviews: [124, 89, 67, 203, 45, 156, 78, 92][i] },
}));

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";

  const filtered = query
    ? allProducts.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          (p.fabric && p.fabric.toLowerCase().includes(query.toLowerCase()))
      )
    : allProducts;

  return (
    <>
      <div className="mb-8">
        <h1 className="font-heading text-2xl lg:text-3xl font-bold text-foreground">
          {query ? `Search results for "${query}"` : "All Products"}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {filtered.length} {filtered.length === 1 ? "product" : "products"} found
        </p>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <Search className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
          <h2 className="font-heading text-xl font-bold mb-2">No results found</h2>
          <p className="text-muted-foreground">
            Try a different search term or browse our categories.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </>
  );
}

export default function SearchPage() {
  return (
    <>
      <AnnouncementBar />
      <Header />
      <main className="min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Suspense fallback={<div className="py-20 text-center">Searching...</div>}>
            <SearchResults />
          </Suspense>
        </div>
      </main>
      <Footer />
    </>
  );
}
