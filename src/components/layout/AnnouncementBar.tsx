"use client";

import { useState } from "react";
import { X } from "lucide-react";

export default function AnnouncementBar() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="relative bg-brand-red text-white text-center py-2 px-4 text-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-2">
        <span className="text-brand-gold">✦</span>
        <p>
          Free shipping on orders above ₹2,999 |{" "}
          <span className="font-medium text-brand-gold">Extra 20% off</span> on
          first order with code{" "}
          <span className="font-bold tracking-wide">KAPURGHAR20</span>
        </p>
        <span className="text-brand-gold">✦</span>
      </div>
      <button
        onClick={() => setIsVisible(false)}
        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-white/10 rounded-full transition-colors"
        aria-label="Close announcement"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
