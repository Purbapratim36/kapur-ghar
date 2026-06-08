"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronDown, X, SlidersHorizontal } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const filterConfig = [
  {
    key: "color",
    label: "Color",
    options: [
      "Red", "Gold", "White", "Black", "Green", "Blue", "Pink", "Yellow", "Orange", "Maroon",
    ],
  },
  {
    key: "occasion",
    label: "Occasions",
    options: ["Wedding", "Festival", "Daily Wear", "Party", "Casual", "Formal"],
  },
  {
    key: "fabric",
    label: "Fabric",
    options: ["Muga Silk", "Pat Silk", "Eri Silk", "Cotton", "Tussar Silk", "Blended"],
  },
  {
    key: "silkType",
    label: "Silk Type",
    options: ["Muga", "Pat", "Eri", "Tussar", "Mulberry"],
  },
  {
    key: "price",
    label: "Price",
    options: [
      "Under ₹2,000",
      "₹2,000 - ₹5,000",
      "₹5,000 - ₹10,000",
      "₹10,000 - ₹20,000",
      "Above ₹20,000",
    ],
  },
];

interface ProductFilterProps {
  totalProducts: number;
}

export default function ProductFilter({ totalProducts: _totalProducts }: ProductFilterProps) {
  void _totalProducts;
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [openSections, setOpenSections] = useState<string[]>([
    "color",
    "occasion",
    "fabric",
    "price",
  ]);

  const activeFilters: Record<string, string> = {};
  filterConfig.forEach((filter) => {
    const value = searchParams.get(filter.key);
    if (value) activeFilters[filter.key] = value;
  });

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

  const toggleSection = (key: string) =>
    setOpenSections((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );

  const sidebarBody = (
    <div className="space-y-1">
      {filterConfig.map((filter) => {
        const open = openSections.includes(filter.key);
        return (
          <div key={filter.key} className="border-b border-border last:border-b-0">
            <button
              onClick={() => toggleSection(filter.key)}
              className="w-full flex items-center justify-between py-4 text-xs font-semibold uppercase tracking-[0.15em] text-foreground"
            >
              {filter.label}
              <ChevronDown
                className={`h-4 w-4 text-muted-foreground transition-transform ${
                  open ? "rotate-180" : ""
                }`}
              />
            </button>
            <AnimatePresence initial={false}>
              {open && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="space-y-1 pb-4 pl-3">
                    {filter.options.map((option) => {
                      const isActive = activeFilters[filter.key] === option;
                      return (
                        <button
                          key={option}
                          onClick={() => updateFilter(filter.key, option)}
                          className={`block w-full text-left px-2 py-1.5 text-sm rounded-md transition-colors ${
                            isActive
                              ? "text-brand-red font-semibold"
                              : "text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          {option}
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );

  return (
    <>
      {/* Mobile filter button + active chips bar */}
      <div className="lg:hidden mb-4 flex items-center justify-between flex-wrap gap-2">
        <button
          onClick={() => setMobileFilterOpen(true)}
          className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg text-sm bg-white"
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filters
          {Object.keys(activeFilters).length > 0 && (
            <span className="ml-1 bg-brand-red text-white text-[10px] font-bold rounded-full px-1.5 py-0.5 min-w-[18px] text-center">
              {Object.keys(activeFilters).length}
            </span>
          )}
        </button>
        {Object.keys(activeFilters).length > 0 && (
          <button
            onClick={clearAllFilters}
            className="text-xs text-brand-red hover:underline"
          >
            Clear all
          </button>
        )}
      </div>

      {Object.keys(activeFilters).length > 0 && (
        <div className="lg:hidden flex flex-wrap gap-2 mb-4">
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
      <aside className="hidden lg:block w-64 shrink-0 pr-6">
        <div className="flex items-center justify-between mb-2 pb-3 border-b border-border">
          <h3 className="font-heading text-2xl font-semibold">Filters</h3>
          {Object.keys(activeFilters).length > 0 && (
            <button
              onClick={clearAllFilters}
              className="text-xs text-brand-red hover:underline"
            >
              Clear all
            </button>
          )}
        </div>
        {sidebarBody}
      </aside>

      {/* Mobile drawer */}
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
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-border">
                <h3 className="font-heading text-lg font-semibold">Filters</h3>
                <button onClick={() => setMobileFilterOpen(false)}>
                  <X className="h-5 w-5" />
                </button>
              </div>
              {sidebarBody}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
