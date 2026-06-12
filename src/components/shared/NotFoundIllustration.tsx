"use client";

import { motion } from "framer-motion";

export default function NotFoundIllustration() {
  return (
    <div className="flex items-center justify-center mx-auto w-full max-w-sm">
      <svg viewBox="0 0 320 200" className="w-full h-auto">
        <defs>
          <linearGradient id="nf-bg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFF8E7" />
            <stop offset="100%" stopColor="#F0E0B5" />
          </linearGradient>
          <linearGradient id="nf-gold" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFD86E" />
            <stop offset="100%" stopColor="#C5A258" />
          </linearGradient>
        </defs>

        {/* ground shadow */}
        <ellipse cx="160" cy="178" rx="120" ry="6" fill="#E5C97B" opacity="0.5" />

        {/* big 4 */}
        <motion.text
          x="48"
          y="140"
          fontFamily="serif"
          fontSize="140"
          fontWeight="700"
          fill="url(#nf-gold)"
          stroke="#7a0000"
          strokeWidth="2"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, type: "spring" }}
        >
          4
        </motion.text>

        {/* spool of thread = 0 */}
        <motion.g
          initial={{ scale: 0, rotate: -90 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.6, delay: 0.15, type: "spring" }}
        >
          <circle cx="160" cy="100" r="42" fill="url(#nf-bg)" stroke="#7a0000" strokeWidth="3" />
          <circle cx="160" cy="100" r="34" fill="none" stroke="#CC0000" strokeWidth="2" strokeDasharray="3 4" />
          <circle cx="160" cy="100" r="26" fill="none" stroke="#C5A258" strokeWidth="2" strokeDasharray="2 3" />
          <circle cx="160" cy="100" r="14" fill="#7a0000" />
          <circle cx="160" cy="100" r="4" fill="#FFD86E" />
        </motion.g>

        {/* big 4 (mirrored) */}
        <motion.text
          x="218"
          y="140"
          fontFamily="serif"
          fontSize="140"
          fontWeight="700"
          fill="url(#nf-gold)"
          stroke="#7a0000"
          strokeWidth="2"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3, type: "spring" }}
        >
          4
        </motion.text>

        {/* loose thread drifting away */}
        <motion.path
          d="M118 116 Q90 130 70 150 T20 180"
          stroke="#CC0000"
          strokeWidth="2"
          fill="none"
          strokeDasharray="2 4"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.2, delay: 0.6 }}
        />
      </svg>
    </div>
  );
}
