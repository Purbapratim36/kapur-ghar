"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useSession, signOut } from "next-auth/react";
import {
  Search,
  Heart,
  ShoppingBag,
  User,
  Menu,
  X,
  ChevronDown,
  LogOut,
  Package,
  MapPin,
  UserCircle,
} from "lucide-react";
import { useCartStore } from "@/store/cart";
import { useWishlistStore } from "@/store/wishlist";
import { useSearchStore } from "@/store/search";
import SearchModal from "@/components/shared/SearchModal";

const navLinks = [
  { href: "/", label: "Home" },
  {
    href: "/products",
    label: "Shop",
    children: [
      { href: "/categories/mekhela-sador", label: "Mekhela Sador" },
      { href: "/categories/muga-silk", label: "Muga Silk" },
      { href: "/categories/pat-silk", label: "Pat Silk" },
      { href: "/categories/eri-silk", label: "Eri Silk" },
      { href: "/categories/wedding-collection", label: "Wedding Collection" },
      { href: "/categories/bridal-collection", label: "Bridal Collection" },
      { href: "/categories/handloom", label: "Handloom" },
      { href: "/categories/blouses", label: "Blouses" },
      { href: "/categories/dupattas", label: "Dupattas" },
      { href: "/categories/accessories", label: "Accessories" },
    ],
  },
  { href: "/categories/wedding-collection", label: "Wedding" },
  { href: "/categories/new-arrivals", label: "New Arrivals" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const itemCount = useCartStore((s) => s.getItemCount());
  const wishlistCount = useWishlistStore((s) => s.items.length);
  const openSearch = useSearchStore((s) => s.open);
  const isSearchOpen = useSearchStore((s) => s.isOpen);

  // Click outside to close user menu
  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    if (userMenuOpen) document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [userMenuOpen]);

  useEffect(() => {
    setUserMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <>
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          isScrolled
            ? "bg-white/95 backdrop-blur-md shadow-md"
            : "bg-white"
        }`}
      >
        {/* Gold ornate border */}
        <div className="h-[2px] bg-gradient-to-r from-transparent via-brand-gold to-transparent" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Mobile menu button */}
            <button
              className="lg:hidden p-2 -ml-2"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 shrink-0">
              <div className="w-10 h-10 rounded-full bg-brand-red flex items-center justify-center">
                <span className="text-white font-heading text-lg font-bold">
                  K
                </span>
              </div>
              <div className="hidden sm:block">
                <h1 className="font-heading text-xl lg:text-2xl font-bold text-brand-red leading-tight">
                  Kapur Ghar
                </h1>
                <p className="text-[10px] tracking-[0.2em] text-brand-gold uppercase -mt-0.5">
                  Assamese Ethnic Wear
                </p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <div
                  key={link.href}
                  className="relative"
                  onMouseEnter={() =>
                    link.children && setActiveDropdown(link.label)
                  }
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <Link
                    href={link.href}
                    className={`flex items-center gap-1 px-3 py-2 text-sm font-medium transition-colors rounded-md hover:text-brand-red ${
                      pathname === link.href
                        ? "text-brand-red"
                        : "text-foreground"
                    }`}
                  >
                    {link.label}
                    {link.children && (
                      <ChevronDown className="h-3.5 w-3.5" />
                    )}
                  </Link>

                  {/* Dropdown */}
                  {link.children && (
                    <AnimatePresence>
                      {activeDropdown === link.label && (
                        <motion.div
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 8 }}
                          transition={{ duration: 0.2 }}
                          className="absolute top-full left-0 w-64 bg-white rounded-lg shadow-xl border border-border/50 py-2 mt-1"
                        >
                          {link.children.map((child) => (
                            <Link
                              key={child.href}
                              href={child.href}
                              className="block px-4 py-2.5 text-sm hover:bg-brand-cream hover:text-brand-red transition-colors"
                            >
                              {child.label}
                            </Link>
                          ))}
                          <div className="border-t border-border/50 mt-1 pt-1">
                            <Link
                              href="/products"
                              className="block px-4 py-2.5 text-sm font-medium text-brand-red hover:bg-brand-cream transition-colors"
                            >
                              View All Products →
                            </Link>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  )}
                </div>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-1 sm:gap-2">
              <button
                onClick={openSearch}
                className="p-2.5 hover:bg-brand-cream rounded-full transition-colors"
                aria-label="Search"
              >
                <Search className="h-5 w-5" />
              </button>

              <Link
                href="/wishlist"
                className="relative p-2.5 hover:bg-brand-cream rounded-full transition-colors"
                aria-label="Wishlist"
              >
                <Heart className="h-5 w-5" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-brand-red text-white text-[10px] font-bold rounded-full h-4.5 w-4.5 flex items-center justify-center min-w-[18px] px-1">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              <Link
                href="/cart"
                className="relative p-2.5 hover:bg-brand-cream rounded-full transition-colors"
                aria-label="Cart"
              >
                <ShoppingBag className="h-5 w-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-brand-red text-white text-[10px] font-bold rounded-full h-4.5 w-4.5 flex items-center justify-center min-w-[18px] px-1">
                    {itemCount}
                  </span>
                )}
              </Link>

              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen((v) => !v)}
                  className="p-2.5 hover:bg-brand-cream rounded-full transition-colors flex items-center gap-1"
                  aria-label="Account"
                >
                  <User className="h-5 w-5" />
                </button>
                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 w-60 bg-white rounded-xl shadow-xl border border-border/50 py-2 z-50"
                    >
                      {status === "authenticated" && session?.user ? (
                        <>
                          <div className="px-4 py-3 border-b border-border">
                            <p className="text-sm font-semibold truncate">
                              {session.user.name || "Welcome"}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">
                              {session.user.email}
                            </p>
                          </div>
                          <Link
                            href="/account/orders"
                            className="flex items-center gap-2.5 px-4 py-2.5 text-sm hover:bg-brand-cream transition-colors"
                          >
                            <Package className="h-4 w-4" />
                            My Orders
                          </Link>
                          <Link
                            href="/account/addresses"
                            className="flex items-center gap-2.5 px-4 py-2.5 text-sm hover:bg-brand-cream transition-colors"
                          >
                            <MapPin className="h-4 w-4" />
                            Addresses
                          </Link>
                          <Link
                            href="/account"
                            className="flex items-center gap-2.5 px-4 py-2.5 text-sm hover:bg-brand-cream transition-colors"
                          >
                            <UserCircle className="h-4 w-4" />
                            Profile
                          </Link>
                          {session.user.role === "ADMIN" ||
                          session.user.role === "SUPER_ADMIN" ? (
                            <Link
                              href="/admin"
                              className="flex items-center gap-2.5 px-4 py-2.5 text-sm hover:bg-brand-cream transition-colors text-brand-red font-medium"
                            >
                              Admin Panel
                            </Link>
                          ) : null}
                          <div className="border-t border-border my-1" />
                          <button
                            onClick={() => signOut({ callbackUrl: "/" })}
                            className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                          >
                            <LogOut className="h-4 w-4" />
                            Sign out
                          </button>
                        </>
                      ) : (
                        <>
                          <Link
                            href="/login"
                            className="block px-4 py-2.5 text-sm font-semibold text-brand-red hover:bg-brand-cream transition-colors"
                          >
                            Sign in
                          </Link>
                          <Link
                            href="/register"
                            className="block px-4 py-2.5 text-sm hover:bg-brand-cream transition-colors"
                          >
                            Create account
                          </Link>
                          <div className="border-t border-border my-1" />
                          <p className="px-4 py-2 text-xs text-muted-foreground">
                            Sign in to view orders, wishlist & checkout faster
                          </p>
                        </>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>

        <div className="h-[1px] bg-gradient-to-r from-transparent via-brand-gold/30 to-transparent" />
      </header>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="fixed top-0 left-0 bottom-0 w-80 bg-white z-50 lg:hidden overflow-y-auto"
            >
              <div className="p-5 border-b border-border">
                <div className="flex items-center justify-between">
                  <Link
                    href="/"
                    className="font-heading text-xl font-bold text-brand-red"
                  >
                    Kapur Ghar
                  </Link>
                  <button
                    onClick={() => setMobileOpen(false)}
                    className="p-2"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>
              <nav className="p-4 space-y-1">
                {navLinks.map((link) => (
                  <div key={link.href}>
                    <Link
                      href={link.href}
                      className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                        pathname === link.href
                          ? "bg-brand-cream text-brand-red"
                          : "hover:bg-brand-cream"
                      }`}
                    >
                      {link.label}
                    </Link>
                    {link.children && (
                      <div className="pl-6 space-y-0.5 mt-1">
                        {link.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            className="block px-4 py-2 text-sm text-muted-foreground hover:text-brand-red transition-colors"
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {isSearchOpen && <SearchModal />}
    </>
  );
}
