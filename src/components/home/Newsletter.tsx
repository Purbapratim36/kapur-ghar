"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send } from "lucide-react";
import toast from "react-hot-toast";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        toast.success("Welcome to the Kapur Ghar family!");
        setEmail("");
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-16 lg:py-20 bg-brand-maroon relative overflow-hidden">
      {/* Decorative pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-assamese-pattern" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
      >
        <h2 className="font-heading text-3xl sm:text-4xl font-bold text-white mb-3">
          Join the Kapur Ghar Family
        </h2>
        <p className="text-white/70 text-base mb-8">
          Subscribe for exclusive offers, new arrivals, and stories from Assam&apos;s
          handloom heritage. Get 10% off your first order!
        </p>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
        >
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            className="flex-1 px-5 py-3 rounded-full bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-brand-gold text-sm"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-brand-gold hover:bg-brand-muga text-white rounded-full text-sm font-semibold flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
          >
            {loading ? "Subscribing..." : "Subscribe"}
            <Send className="h-4 w-4" />
          </button>
        </form>

        <p className="text-white/40 text-xs mt-4">
          No spam, unsubscribe anytime. We respect your privacy.
        </p>
      </motion.div>
    </section>
  );
}
