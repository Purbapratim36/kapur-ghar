"use client";

import { motion } from "framer-motion";

interface Trust {
  title: string;
  desc: string;
  icon: React.ReactNode;
}

function ShippingIcon() {
  return (
    <svg viewBox="0 0 48 48" className="w-10 h-10">
      <defs>
        <linearGradient id="ts-ship" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#C5A258" />
          <stop offset="100%" stopColor="#8B6914" />
        </linearGradient>
      </defs>
      <motion.path
        d="M5 14h22v18H10l-5-5z"
        fill="url(#ts-ship)"
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      />
      <motion.path
        d="M27 18h7l8 8v6h-3"
        fill="#CC0000"
        initial={{ x: -10, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      />
      <motion.circle
        cx="14"
        cy="34"
        r="3"
        fill="#1F2937"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2 }}
      />
      <motion.circle
        cx="34"
        cy="34"
        r="3"
        fill="#1F2937"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.3 }}
      />
      <motion.path
        d="M5 22h18"
        stroke="#FFF"
        strokeWidth="1.2"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      />
    </svg>
  );
}

function SecureIcon() {
  return (
    <svg viewBox="0 0 48 48" className="w-10 h-10">
      <defs>
        <linearGradient id="ts-shield" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#C5A258" />
          <stop offset="100%" stopColor="#7a0000" />
        </linearGradient>
      </defs>
      <motion.path
        d="M24 6l16 5v12c0 9-7 16-16 19-9-3-16-10-16-19V11z"
        fill="url(#ts-shield)"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6 }}
      />
      <motion.path
        d="M16 24l6 6 12-12"
        stroke="#fff"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.7, delay: 0.3 }}
      />
    </svg>
  );
}

function ReturnsIcon() {
  return (
    <svg viewBox="0 0 48 48" className="w-10 h-10">
      <motion.path
        d="M24 8a16 16 0 1 1-15.5 12"
        stroke="#CC0000"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
      />
      <motion.polygon
        points="6,14 12,20 14,12"
        fill="#CC0000"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5 }}
      />
      <motion.text
        x="24"
        y="30"
        textAnchor="middle"
        fontSize="13"
        fontWeight="700"
        fill="#7a0000"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
      >
        7d
      </motion.text>
    </svg>
  );
}

function AuthenticIcon() {
  return (
    <svg viewBox="0 0 48 48" className="w-10 h-10">
      <defs>
        <linearGradient id="ts-medal" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFD86E" />
          <stop offset="100%" stopColor="#C5A258" />
        </linearGradient>
      </defs>
      {/* ribbons */}
      <motion.path
        d="M16 6l4 10 4-4 4 4 4-10"
        fill="#CC0000"
        initial={{ y: -8, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      />
      <motion.circle
        cx="24"
        cy="28"
        r="13"
        fill="url(#ts-medal)"
        stroke="#7a0000"
        strokeWidth="1.5"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.3, type: "spring", stiffness: 120 }}
      />
      <motion.path
        d="M19 27l3 3 7-7"
        stroke="#7a0000"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      />
    </svg>
  );
}

const trustItems: Trust[] = [
  {
    title: "Free Shipping",
    desc: "On orders above ₹2,999",
    icon: <ShippingIcon />,
  },
  {
    title: "Secure Payment",
    desc: "100% safe via Razorpay",
    icon: <SecureIcon />,
  },
  {
    title: "Easy 7-Day Returns",
    desc: "Hassle-free exchanges",
    icon: <ReturnsIcon />,
  },
  {
    title: "Authentic Handloom",
    desc: "Direct from Assam artisans",
    icon: <AuthenticIcon />,
  },
];

export default function TrustStrip() {
  return (
    <section className="py-10 lg:py-14 bg-brand-cream/40 border-y border-brand-gold/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {trustItems.map((t, i) => (
            <motion.div
              key={t.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="flex items-center gap-4"
            >
              <div className="shrink-0">{t.icon}</div>
              <div>
                <p className="font-heading font-bold text-sm lg:text-base">
                  {t.title}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">{t.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
