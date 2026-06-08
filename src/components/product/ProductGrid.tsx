"use client";

import { useState } from "react";
import { LayoutGrid, List } from "lucide-react";
import ProductCard from "./ProductCard";

interface ProductGridProps {
  products: Array<{
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
  }>;
}

export default function ProductGrid({ products }: ProductGridProps) {
  const [view, setView] = useState<"grid" | "list">("grid");

  if (products.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="font-heading text-2xl text-foreground mb-2">
          No products found
        </p>
        <p className="text-muted-foreground">
          Try adjusting your filters or search terms.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1">
      {/* View toggle */}
      <div className="flex items-center gap-1 mb-4 justify-end">
        <button
          onClick={() => setView("grid")}
          className={`p-2 rounded-md transition-colors ${
            view === "grid" ? "bg-brand-cream text-brand-red" : "text-muted-foreground hover:bg-muted"
          }`}
          aria-label="Grid view"
        >
          <LayoutGrid className="h-4 w-4" />
        </button>
        <button
          onClick={() => setView("list")}
          className={`p-2 rounded-md transition-colors ${
            view === "list" ? "bg-brand-cream text-brand-red" : "text-muted-foreground hover:bg-muted"
          }`}
          aria-label="List view"
        >
          <List className="h-4 w-4" />
        </button>
      </div>

      <div
        className={
          view === "grid"
            ? "grid grid-cols-2 md:grid-cols-3 gap-4 lg:gap-6"
            : "space-y-4"
        }
      >
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
