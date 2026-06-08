"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowUp,
  ArrowDown,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  Film,
  ImageIcon,
} from "lucide-react";
import toast from "react-hot-toast";

interface Slide {
  id: string;
  type: string;
  mediaUrl: string;
  posterUrl: string | null;
  title: string | null;
  subtitle: string | null;
  description: string | null;
  ctaText: string | null;
  ctaLink: string | null;
  sortOrder: number;
  isActive: boolean;
}

export default function SlidesAdminList({
  initialSlides,
}: {
  initialSlides: Slide[];
}) {
  const router = useRouter();
  const [slides, setSlides] = useState(initialSlides);
  const [saving, setSaving] = useState(false);

  const move = async (idx: number, direction: -1 | 1) => {
    const target = idx + direction;
    if (target < 0 || target >= slides.length) return;
    const next = [...slides];
    [next[idx], next[target]] = [next[target], next[idx]];
    setSlides(next);

    setSaving(true);
    try {
      const res = await fetch("/api/admin/slides/reorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order: next.map((s) => s.id) }),
      });
      if (!res.ok) throw new Error("Reorder failed");
      router.refresh();
    } catch (err) {
      toast.error((err as Error).message);
      setSlides(initialSlides);
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (id: string, current: boolean) => {
    const res = await fetch(`/api/admin/slides/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !current }),
    });
    if (res.ok) {
      setSlides((prev) =>
        prev.map((s) => (s.id === id ? { ...s, isActive: !current } : s))
      );
      toast.success(current ? "Slide hidden" : "Slide visible");
      router.refresh();
    } else {
      toast.error("Update failed");
    }
  };

  const remove = async (id: string, title: string | null) => {
    if (!confirm(`Delete slide${title ? ` "${title}"` : ""}? This cannot be undone.`))
      return;
    const res = await fetch(`/api/admin/slides/${id}`, { method: "DELETE" });
    if (res.ok) {
      setSlides((prev) => prev.filter((s) => s.id !== id));
      toast.success("Slide deleted");
      router.refresh();
    } else {
      toast.error("Delete failed");
    }
  };

  if (slides.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
        <Film className="h-12 w-12 text-brand-gold/40 mx-auto mb-3" />
        <h3 className="font-heading text-lg font-bold mb-1">No hero slides yet</h3>
        <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
          Add your first hero slide to greet visitors with a photo or video. You can
          mix images and videos, and rearrange them anytime.
        </p>
        <Link
          href="/admin/slides/new"
          className="inline-flex bg-brand-red hover:bg-brand-deep-red text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors"
        >
          Add your first slide
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {slides.map((slide, idx) => (
        <div
          key={slide.id}
          className={`bg-white rounded-xl border ${
            slide.isActive ? "border-gray-200" : "border-gray-200 opacity-60"
          } overflow-hidden flex flex-col sm:flex-row`}
        >
          {/* Preview */}
          <div className="relative w-full sm:w-64 aspect-video sm:aspect-auto sm:h-auto bg-muted shrink-0">
            {slide.type === "video" ? (
              <>
                {slide.posterUrl ? (
                  <Image
                    src={slide.posterUrl}
                    alt={slide.title || "Slide"}
                    fill
                    className="object-cover"
                    sizes="256px"
                  />
                ) : (
                  <video
                    src={slide.mediaUrl}
                    className="absolute inset-0 w-full h-full object-cover"
                    muted
                    playsInline
                  />
                )}
                <div className="absolute top-2 left-2 bg-black/70 text-white text-[10px] font-semibold px-2 py-0.5 rounded flex items-center gap-1">
                  <Film className="h-3 w-3" />
                  VIDEO
                </div>
              </>
            ) : (
              <>
                <Image
                  src={slide.mediaUrl}
                  alt={slide.title || "Slide"}
                  fill
                  className="object-cover"
                  sizes="256px"
                />
                <div className="absolute top-2 left-2 bg-black/70 text-white text-[10px] font-semibold px-2 py-0.5 rounded flex items-center gap-1">
                  <ImageIcon className="h-3 w-3" />
                  IMAGE
                </div>
              </>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 p-4 flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex-1 min-w-0">
              {slide.subtitle && (
                <p className="text-[10px] tracking-[0.3em] uppercase text-brand-gold font-semibold">
                  {slide.subtitle}
                </p>
              )}
              <h3 className="font-heading text-lg font-bold text-foreground truncate">
                {slide.title || "(no title)"}
              </h3>
              {slide.description && (
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                  {slide.description}
                </p>
              )}
              {slide.ctaText && (
                <p className="text-xs text-muted-foreground mt-1.5">
                  <span className="font-medium">CTA:</span> {slide.ctaText}
                  {slide.ctaLink && (
                    <span className="text-brand-red ml-1">→ {slide.ctaLink}</span>
                  )}
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1 shrink-0">
              <button
                disabled={saving || idx === 0}
                onClick={() => move(idx, -1)}
                className="p-2 hover:bg-gray-100 rounded-md disabled:opacity-30"
                title="Move up"
              >
                <ArrowUp className="h-4 w-4 text-muted-foreground" />
              </button>
              <button
                disabled={saving || idx === slides.length - 1}
                onClick={() => move(idx, 1)}
                className="p-2 hover:bg-gray-100 rounded-md disabled:opacity-30"
                title="Move down"
              >
                <ArrowDown className="h-4 w-4 text-muted-foreground" />
              </button>
              <button
                onClick={() => toggleActive(slide.id, slide.isActive)}
                className="p-2 hover:bg-gray-100 rounded-md"
                title={slide.isActive ? "Hide" : "Show"}
              >
                {slide.isActive ? (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                )}
              </button>
              <Link
                href={`/admin/slides/${slide.id}/edit`}
                className="p-2 hover:bg-gray-100 rounded-md"
                title="Edit"
              >
                <Pencil className="h-4 w-4 text-muted-foreground" />
              </Link>
              <button
                onClick={() => remove(slide.id, slide.title)}
                className="p-2 hover:bg-red-50 rounded-md"
                title="Delete"
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
