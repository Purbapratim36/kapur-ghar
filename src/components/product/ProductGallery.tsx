"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ZoomIn, X } from "lucide-react";

interface ProductGalleryProps {
  images: { url: string; alt: string | null; isVideo?: boolean }[];
  productName: string;
}

export default function ProductGallery({
  images,
  productName,
}: ProductGalleryProps) {
  const [selected, setSelected] = useState(0);
  const [zoomed, setZoomed] = useState(false);

  const displayImages =
    images.length > 0
      ? images
      : [{ url: "", alt: productName, isVideo: false }];

  return (
    <>
      <div className="flex flex-col-reverse lg:flex-row gap-4">
        {/* Thumbnails */}
        <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-y-auto lg:max-h-[600px]">
          {displayImages.map((img, i) => (
            <button
              key={i}
              onClick={() => setSelected(i)}
              className={`shrink-0 w-16 h-20 lg:w-20 lg:h-24 rounded-lg overflow-hidden border-2 transition-colors ${
                selected === i
                  ? "border-brand-red"
                  : "border-transparent hover:border-brand-gold/50"
              }`}
            >
              {img.url ? (
                <Image
                  src={img.url}
                  alt={img.alt || `${productName} ${i + 1}`}
                  width={80}
                  height={96}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              ) : (
                <div className="w-full h-full bg-brand-cream flex items-center justify-center">
                  <span className="text-brand-gold/40 text-xs font-heading">KG</span>
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Main Image */}
        <div className="relative flex-1 aspect-[3/4] rounded-2xl overflow-hidden bg-muted group">
          <AnimatePresence mode="wait">
            <motion.div
              key={selected}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0"
            >
              {displayImages[selected]?.url ? (
                <Image
                  src={displayImages[selected].url}
                  alt={
                    displayImages[selected].alt ||
                    `${productName} ${selected + 1}`
                  }
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-brand-cream to-muted flex items-center justify-center">
                  <span className="font-heading text-6xl text-brand-gold/20">
                    KG
                  </span>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Zoom button */}
          <button
            onClick={() => setZoomed(true)}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label="Zoom image"
          >
            <ZoomIn className="h-5 w-5" />
          </button>

          {/* Nav arrows */}
          {displayImages.length > 1 && (
            <>
              <button
                onClick={() =>
                  setSelected(
                    (selected - 1 + displayImages.length) %
                      displayImages.length
                  )
                }
                className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={() =>
                  setSelected((selected + 1) % displayImages.length)
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Next image"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Zoom Modal */}
      <AnimatePresence>
        {zoomed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] bg-black/90 flex items-center justify-center"
            onClick={() => setZoomed(false)}
          >
            <button
              className="absolute top-4 right-4 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white"
              onClick={() => setZoomed(false)}
              aria-label="Close zoom"
            >
              <X className="h-6 w-6" />
            </button>
            {displayImages[selected]?.url && (
              <Image
                src={displayImages[selected].url}
                alt={productName}
                width={1200}
                height={1600}
                className="max-w-[90vw] max-h-[90vh] object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
