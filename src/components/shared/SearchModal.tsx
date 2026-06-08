"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Search, X, Clock, TrendingUp, ArrowRight } from "lucide-react";
import { useSearchStore } from "@/store/search";

const trendingSearches = [
  "Mekhela Sador",
  "Muga Silk",
  "Wedding Collection",
  "Pat Silk Mekhela",
  "Bridal Wear",
  "Eri Silk",
];

export default function SearchModal() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const { query, setQuery, close, recentSearches, addToHistory, clearHistory } =
    useSearchStore();

  useEffect(() => {
    inputRef.current?.focus();
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const handleSearch = (searchQuery?: string) => {
    const q = searchQuery || query;
    if (!q.trim()) return;
    addToHistory(q);
    close();
    router.push(`/search?q=${encodeURIComponent(q)}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
      onClick={close}
    >
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="max-w-2xl mx-auto mt-20 mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-border">
          <Search className="h-5 w-5 text-muted-foreground shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="Search for Mekhela Sador, Silk, Wedding wear..."
            className="flex-1 text-base bg-transparent outline-none placeholder:text-muted-foreground"
          />
          <button onClick={close} className="p-1 hover:bg-muted rounded-full">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-5 space-y-6">
          {/* Recent Searches */}
          {recentSearches.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                  Recent Searches
                </h3>
                <button
                  onClick={clearHistory}
                  className="text-xs text-brand-red hover:underline"
                >
                  Clear all
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((search) => (
                  <button
                    key={search}
                    onClick={() => handleSearch(search)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-brand-cream rounded-full hover:bg-brand-gold/20 transition-colors"
                  >
                    <Clock className="h-3 w-3 text-muted-foreground" />
                    {search}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Trending */}
          <div>
            <h3 className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground uppercase tracking-wide mb-3">
              <TrendingUp className="h-4 w-4" />
              Trending Searches
            </h3>
            <div className="space-y-1">
              {trendingSearches.map((search, i) => (
                <button
                  key={search}
                  onClick={() => handleSearch(search)}
                  className="w-full flex items-center justify-between px-3 py-2.5 text-sm hover:bg-brand-cream rounded-lg transition-colors group"
                >
                  <span className="flex items-center gap-3">
                    <span className="text-xs font-bold text-brand-gold w-5">
                      {i + 1}
                    </span>
                    {search}
                  </span>
                  <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
