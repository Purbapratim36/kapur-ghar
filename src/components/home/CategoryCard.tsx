"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import type { CategoryCard as CategoryCardData } from "@/lib/categories";

// Fallback gradients used when there's no cover image and no product images yet.
const FALLBACK_GRADIENTS = [
  "from-rose-900 via-brand-deep-red to-amber-900",
  "from-amber-800 via-yellow-700 to-orange-900",
  "from-brand-deep-red via-rose-800 to-pink-900",
  "from-amber-700 via-stone-700 to-amber-900",
  "from-brand-red via-brand-deep-red to-rose-900",
  "from-brand-maroon via-purple-900 to-brand-maroon",
];

interface Props {
  category: CategoryCardData;
  index: number;
}

export default function CategoryCard({ category, index }: Props) {
  // Build the slideshow image list. Cover image (if set) always appears first,
  // then the most recent product images. De-duped.
  const slides = useMemo(() => {
    const arr: string[] = [];
    if (category.coverImage) arr.push(category.coverImage);
    for (const u of category.productImages) {
      if (!arr.includes(u)) arr.push(u);
    }
    return arr;
  }, [category.coverImage, category.productImages]);

  const [current, setCurrent] = useState(0);

  // Auto-rotate every 3.5s, with a slight stagger per card so they don't all flip at once.
  useEffect(() => {
    if (slides.length <= 1) return;
    const stagger = (index * 700) % 2000;
    const timer = setInterval(
      () => setCurrent((c) => (c + 1) % slides.length),
      3500
    );
    const startDelay = setTimeout(
      () => setCurrent((c) => (c + 1) % slides.length),
      stagger
    );
    return () => {
      clearInterval(timer);
      clearTimeout(startDelay);
    };
  }, [slides.length, index]);

  const gradient = FALLBACK_GRADIENTS[index % FALLBACK_GRADIENTS.length];
  const showSlideshow = slides.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08 }}
    >
      <Link
        href={`/categories/${category.slug}`}
        className="group block text-center"
      >
        <div className="relative aspect-[3/4] rounded-2xl overflow-hidden border-2 border-brand-gold/20 group-hover:border-brand-gold transition-colors mb-3 bg-muted">
          {showSlideshow ? (
            <AnimatePresence mode="wait">
              <motion.div
                key={slides[current]}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1 }}
                transition={{ duration: 0.8 }}
                className="absolute inset-0"
              >
                <Image
                  src={slides[current]}
                  alt={category.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 16vw"
                />
              </motion.div>
            </AnimatePresence>
          ) : (
            <>
              <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`} />
              <div className="absolute inset-0 bg-assamese-pattern opacity-20" />
            </>
          )}

          {/* Bottom gradient + caption */}
          <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-3 text-center">
            <span className="font-heading text-base lg:text-lg font-bold text-white drop-shadow-lg block">
              {category.name}
            </span>
            {category.tagline && (
              <span className="text-[10px] tracking-[0.2em] text-brand-gold uppercase block mt-0.5">
                {category.tagline}
              </span>
            )}
          </div>

          {/* Slideshow dots */}
          {showSlideshow && slides.length > 1 && (
            <div className="absolute top-3 left-1/2 -translate-x-1/2 flex items-center gap-1 z-10">
              {slides.map((_, i) => (
                <span
                  key={i}
                  className={`h-1 rounded-full transition-all ${
                    i === current ? "w-4 bg-brand-gold" : "w-1 bg-white/50"
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        <p className="text-xs text-muted-foreground">
          {category.productCount > 0
            ? `${category.productCount} product${category.productCount === 1 ? "" : "s"}`
            : "Coming soon"}
        </p>
      </Link>
    </motion.div>
  );
}
