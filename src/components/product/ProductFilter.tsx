"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronDown, X, SlidersHorizontal } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const filterConfig = [
  {
    key: "fabric",
    label: "Fabric",
    options: ["Muga Silk", "Pat Silk", "Eri Silk", "Cotton", "Tussar Silk", "Blended"],
  },
  {
    key: "occasion",
    label: "Occasion",
    options: ["Wedding", "Festival", "Daily Wear", "Party", "Casual", "Formal"],
  },
  {
    key: "silkType",
    label: "Silk Type",
    options: ["Muga", "Pat", "Eri", "Tussar", "Mulberry"],
  },
  {
    key: "color",
    label: "Color",
    options: ["Red", "Gold", "White", "Black", "Green", "Blue", "Pink", "Yellow", "Orange", "Maroon"],
  },
  {
    key: "price",
    label: "Price",
    options: ["Under ₹2,000", "₹2,000 - ₹5,000", "₹5,000 - ₹10,000", "₹10,000 - ₹20,000", "Above ₹20,000"],
  },
];

const sortOptions = [
  { value: "newest", label: "Newest First" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
  { value: "popular", label: "Most Popular" },
];

interface ProductFilterProps {
  totalProducts: number;
}

export default function ProductFilter({ totalProducts }: ProductFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [openSections, setOpenSections] = useState<string[]>(["fabric", "price"]);

  const activeFilters: Record<string, string> = {};
  filterConfig.forEach((filter) => {
    const value = searchParams.get(filter.key);
    if (value) activeFilters[filter.key] = value;
  });

  const currentSort = searchParams.get("sort") || "newest";

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (params.get(key) === value) {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    params.delete("page");
    router.push(`?${params.toString()}`);
  };

  const clearAllFilters = () => {
    router.push(window.location.pathname);
  };

  const toggleSection = (key: string) => {
    setOpenSections((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const filterContent = (
    <div className="space-y-4">
      {filterConfig.map((filter) => (
        <div key={filter.key} className="border-b border-border pb-4">
          <button
            onClick={() => toggleSection(filter.key)}
            className="w-full flex items-center justify-between py-2 text-sm font-semibold text-foreground"
          >
            {filter.label}
            <ChevronDown
              className={`h-4 w-4 transition-transform ${
                openSections.includes(filter.key) ? "rotate-180" : ""
              }`}
            />
          </button>
          <AnimatePresence>
            {openSections.includes(filter.key) && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="space-y-1.5 pt-2">
                  {filter.options.map((option) => (
                    <button
                      key={option}
                      onClick={() => updateFilter(filter.key, option)}
                      className={`block w-full text-left px-3 py-1.5 text-sm rounded-md transition-colors ${
                        activeFilters[filter.key] === option
                          ? "bg-brand-red text-white"
                          : "hover:bg-brand-cream text-foreground"
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );

  return (
    <>
      {/* Top bar */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="lg:hidden flex items-center gap-2 px-3 py-2 border border-border rounded-lg text-sm"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters
          </button>
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">{totalProducts}</span> products
          </p>
        </div>

        <div className="flex items-center gap-3">
          {Object.keys(activeFilters).length > 0 && (
            <button
              onClick={clearAllFilters}
              className="text-xs text-brand-red hover:underline"
            >
              Clear all
            </button>
          )}
          <select
            value={currentSort}
            onChange={(e) => updateFilter("sort", e.target.value)}
            className="px-3 py-2 border border-border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-red"
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Active filter chips */}
      {Object.keys(activeFilters).length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {Object.entries(activeFilters).map(([key, value]) => (
            <button
              key={key}
              onClick={() => updateFilter(key, value)}
              className="flex items-center gap-1.5 px-3 py-1 bg-brand-cream text-sm rounded-full hover:bg-brand-gold/20 transition-colors"
            >
              {value}
              <X className="h-3 w-3" />
            </button>
          ))}
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 pr-8">
        <h3 className="font-heading text-lg font-semibold mb-4">Filters</h3>
        {filterContent}
      </aside>

      {/* Mobile filter drawer */}
      <AnimatePresence>
        {mobileFilterOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50 lg:hidden"
              onClick={() => setMobileFilterOpen(false)}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween" }}
              className="fixed top-0 left-0 bottom-0 w-80 bg-white z-50 lg:hidden overflow-y-auto p-5"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-heading text-lg font-semibold">Filters</h3>
                <button onClick={() => setMobileFilterOpen(false)}>
                  <X className="h-5 w-5" />
                </button>
              </div>
              {filterContent}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
