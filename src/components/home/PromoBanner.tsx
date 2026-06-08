"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

function isValidImageUrl(url: string | undefined): url is string {
  if (!url) return false;
  // Reject local placeholder paths that aren't actually shipped in /public
  if (url.startsWith("/images/")) return false;
  return url.startsWith("http://") || url.startsWith("https://");
}

interface PromoBannerProps {
  title: string;
  subtitle: string;
  discount: string;
  href: string;
  image?: string;
  ctaText?: string;
}

export default function PromoBanner({
  title,
  subtitle,
  discount,
  href,
  image,
  ctaText = "Grab Deal",
}: PromoBannerProps) {
  return (
    <section className="py-8 lg:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Link
            href={href}
            className="block relative overflow-hidden rounded-2xl bg-brand-maroon min-h-[200px] lg:min-h-[280px] group"
          >
            {/* Background — only render Image for real URLs, gradient otherwise */}
            {isValidImageUrl(image) && (
              <Image
                src={image}
                alt={title}
                fill
                className="object-cover opacity-30 group-hover:scale-105 transition-transform duration-700"
              />
            )}
            <div className="absolute inset-0 bg-assamese-pattern opacity-20" />
            <div className="absolute inset-0 bg-gradient-to-r from-brand-maroon via-brand-maroon/90 to-transparent" />

            {/* Ornate corners */}
            <div className="absolute top-0 left-0 w-24 h-24 border-t-2 border-l-2 border-brand-gold/30 rounded-tl-2xl" />
            <div className="absolute bottom-0 right-0 w-24 h-24 border-b-2 border-r-2 border-brand-gold/30 rounded-br-2xl" />

            {/* Content */}
            <div className="relative z-10 p-8 lg:p-12 flex flex-col justify-center h-full">
              <p className="text-brand-gold text-xs tracking-[0.3em] uppercase font-medium mb-2">
                Ending Soon
              </p>
              <h3 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-white italic mb-2">
                {title}
              </h3>
              <p className="text-white/80 text-lg mb-1">{subtitle}</p>
              <p className="text-white text-2xl lg:text-3xl font-bold mb-6">
                Get <span className="text-brand-gold text-4xl lg:text-5xl">{discount}</span> off
              </p>
              <span className="inline-flex items-center self-start px-6 py-2.5 bg-brand-cream text-brand-maroon rounded-full text-sm font-semibold hover:bg-white transition-colors">
                {ctaText}
              </span>
            </div>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
