"use client";

import Link from "next/link";
import { Globe, Heart, MessageCircle, Play, Mail, Phone, MapPin } from "lucide-react";

const footerLinks = {
  shop: [
    { label: "Mekhela Sador", href: "/categories/mekhela-sador" },
    { label: "Muga Silk", href: "/categories/muga-silk" },
    { label: "Pat Silk", href: "/categories/pat-silk" },
    { label: "Eri Silk", href: "/categories/eri-silk" },
    { label: "Wedding Collection", href: "/categories/wedding-collection" },
    { label: "New Arrivals", href: "/categories/new-arrivals" },
  ],
  help: [
    { label: "Track Order", href: "/orders" },
    { label: "Shipping Policy", href: "/shipping-policy" },
    { label: "Return & Exchange", href: "/return-policy" },
    { label: "FAQs", href: "/faq" },
    { label: "Size Guide", href: "/size-guide" },
    { label: "Contact Us", href: "/contact" },
  ],
  company: [
    { label: "About Us", href: "/about" },
    { label: "Our Story", href: "/about#story" },
    { label: "Artisan Partners", href: "/about#artisans" },
    { label: "Blog", href: "/blog" },
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Terms of Service", href: "/terms" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-brand-maroon text-white">
      {/* Ornate border */}
      <div className="h-1 bg-gradient-to-r from-brand-gold/0 via-brand-gold to-brand-gold/0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block">
              <h2 className="font-heading text-3xl font-bold text-white">
                Kapur Ghar
              </h2>
              <p className="text-brand-gold text-xs tracking-[0.3em] uppercase mt-1">
                Traditional Assamese Fashion
              </p>
            </Link>
            <p className="mt-4 text-sm text-white/70 leading-relaxed max-w-md">
              Celebrating the rich heritage of Assamese handloom. Each piece is
              a testament to centuries-old weaving traditions, crafted by skilled
              artisans from the heart of Assam.
            </p>

            <div className="mt-6 space-y-2.5">
              <a
                href="mailto:hello@kapurghar.com"
                className="flex items-center gap-2.5 text-sm text-white/70 hover:text-brand-gold transition-colors"
              >
                <Mail className="h-4 w-4 shrink-0" />
                hello@kapurghar.com
              </a>
              <a
                href="tel:+919876543210"
                className="flex items-center gap-2.5 text-sm text-white/70 hover:text-brand-gold transition-colors"
              >
                <Phone className="h-4 w-4 shrink-0" />
                +91 98765 43210
              </a>
              <p className="flex items-start gap-2.5 text-sm text-white/70">
                <MapPin className="h-4 w-4 shrink-0 mt-0.5" />
                Guwahati, Assam, India
              </p>
            </div>

            <div className="flex items-center gap-3 mt-6">
              {[
                { icon: Heart, href: "#", label: "Instagram" },
                { icon: Globe, href: "#", label: "Facebook" },
                { icon: MessageCircle, href: "#", label: "Twitter" },
                { icon: Play, href: "#", label: "Youtube" },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center hover:bg-brand-gold hover:border-brand-gold transition-all"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="font-heading text-lg font-semibold text-brand-gold mb-4 capitalize">
                {title === "help" ? "Customer Care" : title}
              </h3>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/70 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Payment & Copyright */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-white/50">
              © {new Date().getFullYear()} Kapur Ghar. All rights reserved. Handcrafted with ❤️ in Assam.
            </p>
            <div className="flex items-center gap-3">
              <span className="text-xs text-white/50">We accept:</span>
              <div className="flex items-center gap-2 text-xs text-white/70">
                <span className="px-2 py-1 border border-white/20 rounded">UPI</span>
                <span className="px-2 py-1 border border-white/20 rounded">Cards</span>
                <span className="px-2 py-1 border border-white/20 rounded">Net Banking</span>
                <span className="px-2 py-1 border border-white/20 rounded">COD</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
