"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  {
    id: 1,
    title: "Timeless Elegance",
    subtitle: "Handcrafted Mekhela Sador",
    description:
      "Discover the beauty of authentic Assamese silk, woven by master artisans",
    cta: "Explore Collection",
    href: "/categories/mekhela-sador",
    image: "/images/hero/hero-1.jpg",
    color: "from-brand-maroon/80",
  },
  {
    id: 2,
    title: "Wedding Season",
    subtitle: "Bridal Collection 2025",
    description:
      "Make your special day unforgettable with our exquisite bridal Mekhela Sador",
    cta: "Shop Bridal",
    href: "/categories/bridal-collection",
    image: "/images/hero/hero-2.jpg",
    color: "from-brand-deep-red/80",
  },
  {
    id: 3,
    title: "The Golden Thread",
    subtitle: "Muga Silk Collection",
    description:
      "The pride of Assam — natural golden Muga silk, exclusive to our region",
    cta: "View Muga Silk",
    href: "/categories/muga-silk",
    image: "/images/hero/hero-3.jpg",
    color: "from-brand-maroon/80",
  },
];

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0);

  const next = useCallback(
    () => setCurrent((c) => (c + 1) % slides.length),
    []
  );
  const prev = useCallback(
    () => setCurrent((c) => (c - 1 + slides.length) % slides.length),
    []
  );

  useEffect(() => {
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next]);

  const slide = slides[current];

  return (
    <section className="relative h-[70vh] sm:h-[80vh] lg:h-[90vh] overflow-hidden bg-brand-maroon">
      <AnimatePresence mode="wait">
        <motion.div
          key={slide.id}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0"
        >
          {/* Placeholder gradient when no image */}
          <div className="absolute inset-0 bg-gradient-to-br from-brand-maroon via-brand-deep-red to-brand-maroon" />
          <Image
            src={slide.image}
            alt={slide.title}
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
          <div
            className={`absolute inset-0 bg-gradient-to-r ${slide.color} to-transparent`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={slide.id}
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -30, opacity: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="max-w-xl"
            >
              <p className="text-brand-gold text-sm sm:text-base tracking-[0.3em] uppercase font-medium mb-3">
                {slide.subtitle}
              </p>
              <h2 className="font-heading text-4xl sm:text-5xl lg:text-7xl font-bold text-white leading-tight mb-4">
                {slide.title}
              </h2>
              <p className="text-white/80 text-base sm:text-lg mb-8 max-w-md">
                {slide.description}
              </p>
              <Link
                href={slide.href}
                className="inline-flex items-center gap-2 bg-brand-red hover:bg-brand-deep-red text-white px-8 py-3.5 rounded-full text-sm font-semibold transition-all hover:shadow-xl hover:shadow-brand-red/25 group"
              >
                {slide.cta}
                <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex items-center gap-4">
        <button
          onClick={prev}
          className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center text-white hover:bg-white/10 transition-colors"
          aria-label="Previous slide"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div className="flex items-center gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-2 rounded-full transition-all ${
                i === current
                  ? "w-8 bg-brand-gold"
                  : "w-2 bg-white/40 hover:bg-white/60"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
        <button
          onClick={next}
          className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center text-white hover:bg-white/10 transition-colors"
          aria-label="Next slide"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </section>
  );
}
