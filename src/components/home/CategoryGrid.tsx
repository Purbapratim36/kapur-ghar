"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const categories = [
  {
    name: "Mekhela Sador",
    slug: "mekhela-sador",
    description: "Traditional two-piece",
    gradient: "from-rose-900 via-brand-deep-red to-amber-900",
  },
  {
    name: "Muga Silk",
    slug: "muga-silk",
    description: "Golden heritage silk",
    gradient: "from-amber-800 via-yellow-700 to-orange-900",
  },
  {
    name: "Pat Silk",
    slug: "pat-silk",
    description: "Mulberry silk weaves",
    gradient: "from-brand-deep-red via-rose-800 to-pink-900",
  },
  {
    name: "Eri Silk",
    slug: "eri-silk",
    description: "Peace silk fabric",
    gradient: "from-amber-700 via-stone-700 to-amber-900",
  },
  {
    name: "Wedding Collection",
    slug: "wedding-collection",
    description: "Bridal elegance",
    gradient: "from-brand-red via-brand-deep-red to-rose-900",
  },
  {
    name: "Handloom",
    slug: "handloom",
    description: "Artisan crafted",
    gradient: "from-brand-maroon via-purple-900 to-brand-maroon",
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
                  <div className={`absolute inset-0 bg-gradient-to-br ${cat.gradient} group-hover:scale-110 transition-transform duration-500`} />
                  <div className="absolute inset-0 bg-assamese-pattern opacity-20" />
                  <div className="absolute inset-x-0 bottom-0 p-3 text-center">
                    <span className="font-heading text-base lg:text-lg font-bold text-brand-gold drop-shadow-lg">
                      {cat.name.split(" ")[0]}
                    </span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
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
