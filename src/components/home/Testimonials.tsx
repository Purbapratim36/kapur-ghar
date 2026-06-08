"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Star, Quote } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Priyanka Baruah",
    location: "Guwahati, Assam",
    image: "",
    rating: 5,
    text: "The Muga Silk Mekhela Sador I ordered was absolutely stunning. The quality and craftsmanship exceeded my expectations. It was perfect for my sister's wedding!",
  },
  {
    id: 2,
    name: "Ankita Sharma",
    location: "Delhi",
    image: "",
    rating: 5,
    text: "I've been looking for authentic Assamese handloom for years. Kapur Ghar delivered exactly what I wanted. The Pat Silk is gorgeous and the packaging was premium.",
  },
  {
    id: 3,
    name: "Ritu Borah",
    location: "Jorhat, Assam",
    image: "",
    rating: 5,
    text: "The bridal collection is breathtaking. The Eri Silk piece I purchased has such a luxurious feel. The customer service was also very helpful with size guidance.",
  },
  {
    id: 4,
    name: "Deepshikha Kalita",
    location: "Bengaluru",
    image: "",
    rating: 5,
    text: "As an Assamese living away from home, finding genuine Mekhela Sador online was always a challenge until I discovered Kapur Ghar. They bring Assam's heritage to my doorstep.",
  },
];

export default function Testimonials() {
  const [current, setCurrent] = useState(0);

  const next = () => setCurrent((c) => (c + 1) % testimonials.length);
  const prev = () =>
    setCurrent((c) => (c - 1 + testimonials.length) % testimonials.length);

  return (
    <section className="py-16 lg:py-20 bg-brand-cream bg-assamese-pattern">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Header */}
        <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground mb-2">
          What Our Customers Say
        </h2>
        <div className="flex items-center justify-center gap-3 mb-12">
          <div className="h-[1px] w-12 bg-brand-gold" />
          <div className="w-2 h-2 rounded-full bg-brand-gold" />
          <div className="h-[1px] w-12 bg-brand-gold" />
        </div>

        {/* Testimonial */}
        <AnimatePresence mode="wait">
          <motion.div
            key={testimonials[current].id}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.4 }}
            className="relative"
          >
            <Quote className="h-10 w-10 text-brand-gold/30 mx-auto mb-4" />

            <div className="flex items-center justify-center gap-1 mb-6">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${
                    i < testimonials[current].rating
                      ? "text-brand-gold fill-brand-gold"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>

            <blockquote className="text-lg sm:text-xl text-foreground/80 italic leading-relaxed max-w-2xl mx-auto mb-8">
              &ldquo;{testimonials[current].text}&rdquo;
            </blockquote>

            <div className="flex items-center justify-center gap-3">
              <div className="w-12 h-12 rounded-full bg-brand-maroon flex items-center justify-center text-white font-heading text-lg">
                {testimonials[current].name[0]}
              </div>
              <div className="text-left">
                <p className="font-semibold text-foreground">
                  {testimonials[current].name}
                </p>
                <p className="text-sm text-muted-foreground">
                  {testimonials[current].location}
                </p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-center gap-4 mt-10">
          <button
            onClick={prev}
            className="w-10 h-10 rounded-full border border-brand-gold/30 flex items-center justify-center hover:bg-brand-gold/10 transition-colors"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="h-5 w-5 text-brand-gold" />
          </button>
          <div className="flex items-center gap-2">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`h-2 rounded-full transition-all ${
                  i === current
                    ? "w-6 bg-brand-gold"
                    : "w-2 bg-brand-gold/30"
                }`}
              />
            ))}
          </div>
          <button
            onClick={next}
            className="w-10 h-10 rounded-full border border-brand-gold/30 flex items-center justify-center hover:bg-brand-gold/10 transition-colors"
            aria-label="Next testimonial"
          >
            <ChevronRight className="h-5 w-5 text-brand-gold" />
          </button>
        </div>
      </div>
    </section>
  );
}
