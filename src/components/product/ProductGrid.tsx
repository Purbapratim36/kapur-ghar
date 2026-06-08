"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
    isFeatured?: boolean;
    fabric?: string | null;
    avgRating?: number;
    _count?: { reviews: number };
  }>;
  total?: number;
}

const sortOptions = [
  { value: "newest", label: "Newest First" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
  { value: "popular", label: "Most Popular" },
];

export default function ProductGrid({ products, total }: ProductGridProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [view, setView] = useState<"grid" | "list">("grid");

  if (products.length === 0) {
    return (
      <div className="flex-1 text-center py-20">
        <p className="font-heading text-2xl text-foreground mb-2">No products found</p>
        <p className="text-muted-foreground">Try adjusting your filters or search terms.</p>
      </div>
    );
  }

  const currentSort = searchParams.get("sort") || "newest";

  const onSortChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", value);
    params.delete("page");
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="flex-1 min-w-0">
      {/* Top control bar */}
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setView("grid")}
            className={`p-2 rounded-md transition-colors ${
              view === "grid"
                ? "bg-brand-red text-white"
                : "text-muted-foreground hover:bg-muted"
            }`}
            aria-label="Grid view"
          >
            <LayoutGrid className="h-4 w-4" />
          </button>
          <button
            onClick={() => setView("list")}
            className={`p-2 rounded-md transition-colors ${
              view === "list"
                ? "bg-brand-red text-white"
                : "text-muted-foreground hover:bg-muted"
            }`}
            aria-label="List view"
          >
            <List className="h-4 w-4" />
          </button>
          <p className="text-sm text-muted-foreground ml-2">
            <span className="font-semibold text-foreground">
              {total ?? products.length}
            </span>{" "}
            Product{(total ?? products.length) === 1 ? "" : "s"}
          </p>
        </div>

        <select
          value={currentSort}
          onChange={(e) => onSortChange(e.target.value)}
          className="px-4 py-2 border border-border rounded-lg text-xs uppercase tracking-wider font-medium bg-white focus:outline-none focus:ring-2 focus:ring-brand-red min-w-[180px]"
        >
          {sortOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Product grid — 2 → 3 → 4 → 5 columns */}
      <div
        className={
          view === "grid"
            ? "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 lg:gap-5"
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
