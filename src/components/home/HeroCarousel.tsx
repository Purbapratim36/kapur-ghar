"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Volume2, VolumeX, Play, Pause } from "lucide-react";

export interface HeroSlide {
  id: string;
  type: string; // "image" | "video"
  mediaUrl: string;
  posterUrl: string | null;
  title: string | null;
  subtitle: string | null;
  description: string | null;
  ctaText: string | null;
  ctaLink: string | null;
  textColor: string; // "white" | "dark"
  alignment: string; // "left" | "center" | "right"
  overlayLevel: string; // "none" | "light" | "medium" | "strong"
}

const DEFAULT_SLIDES: HeroSlide[] = [
  {
    id: "default-1",
    type: "image",
    mediaUrl: "",
    posterUrl: null,
    title: "Timeless Elegance",
    subtitle: "Handcrafted Mekhela Sador",
    description:
      "Discover the beauty of authentic Assamese silk, woven by master artisans",
    ctaText: "Explore Collection",
    ctaLink: "/categories/mekhela-sador",
    textColor: "white",
    alignment: "left",
    overlayLevel: "medium",
  },
  {
    id: "default-2",
    type: "image",
    mediaUrl: "",
    posterUrl: null,
    title: "The Golden Thread",
    subtitle: "Muga Silk Collection",
    description: "The pride of Assam — natural golden Muga silk",
    ctaText: "View Muga Silk",
    ctaLink: "/categories/muga-silk",
    textColor: "white",
    alignment: "left",
    overlayLevel: "medium",
  },
];

const AUTO_ADVANCE_IMAGE = 6000;

const overlayClass: Record<string, string> = {
  none: "",
  light: "bg-black/20",
  medium: "bg-gradient-to-r from-black/60 via-black/30 to-transparent",
  strong: "bg-gradient-to-r from-black/80 via-black/50 to-black/20",
};

const alignmentClass: Record<string, string> = {
  left: "items-center justify-start text-left",
  center: "items-center justify-center text-center",
  right: "items-center justify-end text-right",
};

export default function HeroCarousel({
  slides: providedSlides,
}: {
  slides?: HeroSlide[];
}) {
  const hasReal = Boolean(providedSlides && providedSlides.length > 0);
  const slides = hasReal ? providedSlides! : DEFAULT_SLIDES;

  const [current, setCurrent] = useState(0);
  const [muted, setMuted] = useState(true);
  const [paused, setPaused] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const slide = slides[current];

  const next = useCallback(
    () => setCurrent((c) => (c + 1) % slides.length),
    [slides.length]
  );
  const prev = useCallback(
    () => setCurrent((c) => (c - 1 + slides.length) % slides.length),
    [slides.length]
  );

  // Auto-advance: images on a timer, videos on `ended` event
  useEffect(() => {
    if (paused || slides.length <= 1) return;
    if (slide.type === "video") {
      // Let the video drive advancement via `onEnded`
      return;
    }
    advanceTimer.current = setTimeout(next, AUTO_ADVANCE_IMAGE);
    return () => {
      if (advanceTimer.current) clearTimeout(advanceTimer.current);
    };
  }, [current, paused, slide.type, slides.length, next]);

  // When the slide changes, restart the video if any
  useEffect(() => {
    if (slide.type === "video" && videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {
        /* autoplay can be blocked when not muted */
      });
    }
  }, [current, slide.type]);

  const textColorClass = slide.textColor === "dark" ? "text-foreground" : "text-white";
  const accentClass = slide.textColor === "dark" ? "text-brand-red" : "text-brand-gold";

  return (
    <section className="relative h-[70vh] sm:h-[80vh] lg:h-[90vh] overflow-hidden bg-brand-maroon">
      <AnimatePresence mode="wait">
        <motion.div
          key={slide.id}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="absolute inset-0"
        >
          {/* Fallback gradient (always behind) */}
          <div className="absolute inset-0 bg-gradient-to-br from-brand-maroon via-brand-deep-red to-brand-maroon" />
          <div className="absolute inset-0 bg-assamese-pattern opacity-15" />

          {/* Media */}
          {slide.type === "video" && slide.mediaUrl ? (
            <video
              ref={videoRef}
              src={slide.mediaUrl}
              poster={slide.posterUrl || undefined}
              autoPlay
              muted={muted}
              loop={slides.length === 1}
              playsInline
              onEnded={() => slides.length > 1 && next()}
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : slide.mediaUrl ? (
            <Image
              src={slide.mediaUrl}
              alt={slide.title || "Hero slide"}
              fill
              priority={current === 0}
              className="object-cover"
              sizes="100vw"
            />
          ) : null}

          {/* Overlay */}
          <div
            className={`absolute inset-0 ${overlayClass[slide.overlayLevel] || overlayClass.medium}`}
          />
          {slide.overlayLevel !== "none" && (
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div
        className={`relative z-10 h-full flex ${
          alignmentClass[slide.alignment] || alignmentClass.left
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={slide.id}
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -30, opacity: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className={`max-w-xl ${
                slide.alignment === "center"
                  ? "mx-auto"
                  : slide.alignment === "right"
                    ? "ml-auto"
                    : ""
              } ${textColorClass}`}
            >
              {slide.subtitle && (
                <p
                  className={`text-sm sm:text-base tracking-[0.3em] uppercase font-medium mb-3 ${accentClass}`}
                >
                  {slide.subtitle}
                </p>
              )}
              {slide.title && (
                <h2 className="font-heading text-4xl sm:text-5xl lg:text-7xl font-bold leading-tight mb-4">
                  {slide.title}
                </h2>
              )}
              {slide.description && (
                <p
                  className={`text-base sm:text-lg mb-8 max-w-md ${
                    slide.alignment === "center" ? "mx-auto" : ""
                  } ${slide.textColor === "dark" ? "text-foreground/80" : "text-white/80"}`}
                >
                  {slide.description}
                </p>
              )}
              {slide.ctaText && slide.ctaLink && (
                <Link
                  href={slide.ctaLink}
                  className="inline-flex items-center gap-2 bg-brand-red hover:bg-brand-deep-red text-white px-8 py-3.5 rounded-full text-sm font-semibold transition-all hover:shadow-xl hover:shadow-brand-red/25 group"
                >
                  {slide.ctaText}
                  <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Controls — only when more than one slide */}
      {slides.length > 1 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex items-center gap-3">
          <button
            onClick={prev}
            className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center text-white hover:bg-white/10 transition-colors backdrop-blur-sm"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`h-2 rounded-full transition-all ${
                  i === current
                    ? "w-8 bg-brand-gold"
                    : "w-2 bg-white/40 hover:bg-white/60"
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
          <button
            onClick={next}
            className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center text-white hover:bg-white/10 transition-colors backdrop-blur-sm"
            aria-label="Next slide"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      )}

      {/* Video-specific controls */}
      {slide.type === "video" && slide.mediaUrl && (
        <div className="absolute top-6 right-6 z-10 flex items-center gap-2">
          <button
            onClick={() => {
              if (!videoRef.current) return;
              if (paused) {
                videoRef.current.play();
              } else {
                videoRef.current.pause();
              }
              setPaused((p) => !p);
            }}
            className="w-10 h-10 rounded-full border border-white/30 bg-black/40 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/60 transition-colors"
            aria-label={paused ? "Play video" : "Pause video"}
          >
            {paused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
          </button>
          <button
            onClick={() => setMuted((m) => !m)}
            className="w-10 h-10 rounded-full border border-white/30 bg-black/40 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/60 transition-colors"
            aria-label={muted ? "Unmute video" : "Mute video"}
          >
            {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </button>
        </div>
      )}
    </section>
  );
}
