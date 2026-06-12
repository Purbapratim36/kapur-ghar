"use client";

import Link from "next/link";
import { motion } from "framer-motion";

type IllustrationKind = "cart" | "wishlist" | "search" | "orders" | "address" | "products";

interface EmptyStateProps {
  kind?: IllustrationKind;
  title: string;
  description?: string;
  ctaLabel?: string;
  ctaHref?: string;
  className?: string;
}

function Illustration({ kind }: { kind: IllustrationKind }) {
  const baseProps = {
    viewBox: "0 0 240 180",
    className: "w-44 lg:w-56 h-auto",
  };
  const id = `g-${kind}`;

  return (
    <svg {...baseProps}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFF8E7" />
          <stop offset="100%" stopColor="#F5E4C1" />
        </linearGradient>
      </defs>
      {/* floor circle */}
      <ellipse cx="120" cy="160" rx="80" ry="8" fill="#F0E0B5" />

      {kind === "cart" && (
        <>
          {/* simple bag */}
          <motion.path
            d="M70 70h100l-10 80H80z"
            fill={`url(#${id})`}
            stroke="#C5A258"
            strokeWidth="2"
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          />
          <motion.path
            d="M95 70c0-15 12-25 25-25s25 10 25 25"
            stroke="#7a0000"
            strokeWidth="3"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          />
          <motion.circle
            cx="100"
            cy="110"
            r="3"
            fill="#CC0000"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.6 }}
          />
          <motion.circle
            cx="140"
            cy="110"
            r="3"
            fill="#CC0000"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.7 }}
          />
          <motion.path
            d="M105 125q15 12 30 0"
            stroke="#7a0000"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 0.9 }}
          />
        </>
      )}

      {kind === "wishlist" && (
        <>
          <motion.path
            d="M120 140C70 110 40 90 40 60c0-17 13-30 30-30 15 0 25 8 30 18 5-10 15-18 30-18 17 0 30 13 30 30 0 30-30 50-80 80z"
            fill={`url(#${id})`}
            stroke="#CC0000"
            strokeWidth="3"
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, type: "spring" }}
          />
          {/* sparkle */}
          <motion.g
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <path
              d="M180 50l3 8 8 3-8 3-3 8-3-8-8-3 8-3z"
              fill="#C5A258"
            />
          </motion.g>
        </>
      )}

      {kind === "search" && (
        <>
          <motion.circle
            cx="100"
            cy="85"
            r="35"
            fill={`url(#${id})`}
            stroke="#7a0000"
            strokeWidth="4"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, type: "spring" }}
          />
          <motion.line
            x1="128"
            y1="113"
            x2="160"
            y2="145"
            stroke="#7a0000"
            strokeWidth="8"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          />
          <motion.text
            x="100"
            y="92"
            textAnchor="middle"
            fontSize="32"
            fontWeight="700"
            fill="#C5A258"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            ?
          </motion.text>
        </>
      )}

      {kind === "orders" && (
        <>
          <motion.path
            d="M70 70h100v80H70z"
            fill={`url(#${id})`}
            stroke="#C5A258"
            strokeWidth="2"
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          />
          <motion.path
            d="M70 70l50 30 50-30"
            fill="none"
            stroke="#7a0000"
            strokeWidth="3"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          />
          <motion.rect
            x="100"
            y="110"
            width="40"
            height="6"
            rx="3"
            fill="#CC0000"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.4, delay: 0.7 }}
            style={{ transformOrigin: "100px 113px" }}
          />
        </>
      )}

      {kind === "address" && (
        <>
          <motion.path
            d="M120 30c-22 0-40 18-40 40 0 30 40 70 40 70s40-40 40-70c0-22-18-40-40-40z"
            fill={`url(#${id})`}
            stroke="#CC0000"
            strokeWidth="3"
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          />
          <motion.circle
            cx="120"
            cy="68"
            r="14"
            fill="#fff"
            stroke="#7a0000"
            strokeWidth="2"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.4, type: "spring" }}
          />
        </>
      )}

      {kind === "products" && (
        <>
          <motion.rect
            x="60"
            y="60"
            width="50"
            height="70"
            rx="6"
            fill={`url(#${id})`}
            stroke="#C5A258"
            strokeWidth="2"
            initial={{ x: -40, opacity: 0 }}
            animate={{ x: 60, opacity: 1 }}
            transition={{ duration: 0.5 }}
          />
          <motion.rect
            x="130"
            y="60"
            width="50"
            height="70"
            rx="6"
            fill={`url(#${id})`}
            stroke="#C5A258"
            strokeWidth="2"
            initial={{ x: 40, opacity: 0 }}
            animate={{ x: 130, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.15 }}
          />
          <motion.text
            x="85"
            y="100"
            fill="#7a0000"
            fontSize="28"
            fontWeight="700"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            ?
          </motion.text>
          <motion.text
            x="155"
            y="100"
            fill="#7a0000"
            fontSize="28"
            fontWeight="700"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            ?
          </motion.text>
        </>
      )}
    </svg>
  );
}

export default function EmptyState({
  kind = "products",
  title,
  description,
  ctaLabel,
  ctaHref,
  className = "",
}: EmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center py-12 px-4 ${className}`}
    >
      <Illustration kind={kind} />
      <motion.h3
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="font-heading text-xl font-bold mt-2"
      >
        {title}
      </motion.h3>
      {description && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-sm text-muted-foreground mt-1 max-w-sm"
        >
          {description}
        </motion.p>
      )}
      {ctaLabel && ctaHref && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Link
            href={ctaHref}
            className="inline-flex bg-brand-red hover:bg-brand-deep-red text-white px-6 py-2.5 rounded-lg text-sm font-semibold transition-colors mt-5"
          >
            {ctaLabel}
          </Link>
        </motion.div>
      )}
    </div>
  );
}
