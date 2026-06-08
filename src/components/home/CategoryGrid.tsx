"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const categories = [
  {
    name: "Mekhela Sador",
    slug: "mekhela-sador",
    image: "/images/categories/mekhela-sador.jpg",
    description: "Traditional two-piece",
  },
  {
    name: "Muga Silk",
    slug: "muga-silk",
    image: "/images/categories/muga-silk.jpg",
    description: "Golden heritage silk",
  },
  {
    name: "Pat Silk",
    slug: "pat-silk",
    image: "/images/categories/pat-silk.jpg",
    description: "Mulberry silk weaves",
  },
  {
    name: "Eri Silk",
    slug: "eri-silk",
    image: "/images/categories/eri-silk.jpg",
    description: "Peace silk fabric",
  },
  {
    name: "Wedding Collection",
    slug: "wedding-collection",
    image: "/images/categories/wedding.jpg",
    description: "Bridal elegance",
  },
  {
    name: "Handloom",
    slug: "handloom",
    image: "/images/categories/handloom.jpg",
    description: "Artisan crafted",
  },
];

export default function CategoryGrid() {
  return (
    <section className="py-16 lg:py-20 bg-brand-cream bg-assamese-pattern">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground">
            Shop by Category
          </h2>
          <div className="flex items-center justify-center gap-3 mt-3">
            <div className="h-[1px] w-12 bg-brand-gold" />
            <div className="w-2 h-2 rounded-full bg-brand-gold" />
            <div className="h-[1px] w-12 bg-brand-gold" />
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 lg:gap-6">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Link
                href={`/categories/${cat.slug}`}
                className="group block text-center"
              >
                <div className="relative aspect-[3/4] rounded-2xl overflow-hidden border-2 border-brand-gold/20 group-hover:border-brand-gold transition-colors mb-3">
                  <div className="absolute inset-0 bg-gradient-to-br from-brand-maroon via-brand-deep-red to-brand-maroon" />
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 16vw"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <h3 className="font-heading text-sm lg:text-base font-semibold text-foreground uppercase tracking-wide">
                  {cat.name}
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {cat.description}
                </p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
