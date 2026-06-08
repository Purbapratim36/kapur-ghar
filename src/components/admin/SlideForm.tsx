"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import SlideMediaUpload from "@/components/admin/SlideMediaUpload";

interface SlideInput {
  type: "image" | "video";
  mediaUrl: string;
  posterUrl: string | null;
  title: string;
  subtitle: string;
  description: string;
  ctaText: string;
  ctaLink: string;
  textColor: "white" | "dark";
  alignment: "left" | "center" | "right";
  overlayLevel: "none" | "light" | "medium" | "strong";
  isActive: boolean;
}

const empty: SlideInput = {
  type: "image",
  mediaUrl: "",
  posterUrl: null,
  title: "",
  subtitle: "",
  description: "",
  ctaText: "",
  ctaLink: "",
  textColor: "white",
  alignment: "left",
  overlayLevel: "medium",
  isActive: true,
};

export default function SlideForm({
  initial,
  slideId,
}: {
  initial?: Partial<SlideInput>;
  slideId?: string;
}) {
  const router = useRouter();
  const [data, setData] = useState<SlideInput>({ ...empty, ...initial });
  const [saving, setSaving] = useState(false);

  const update = <K extends keyof SlideInput>(key: K, value: SlideInput[K]) =>
    setData((p) => ({ ...p, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!data.mediaUrl) {
      toast.error("Please upload an image or video first");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        type: data.type,
        mediaUrl: data.mediaUrl,
        posterUrl: data.posterUrl || null,
        title: data.title.trim() || null,
        subtitle: data.subtitle.trim() || null,
        description: data.description.trim() || null,
        ctaText: data.ctaText.trim() || null,
        ctaLink: data.ctaLink.trim() || null,
        textColor: data.textColor,
        alignment: data.alignment,
        overlayLevel: data.overlayLevel,
        isActive: data.isActive,
      };

      const url = slideId ? `/api/admin/slides/${slideId}` : "/api/admin/slides";
      const method = slideId ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) {
        toast.error(json.error || "Failed to save slide");
        return;
      }
      toast.success(slideId ? "Slide updated" : "Slide added");
      router.push("/admin/slides");
      router.refresh();
    } catch (err) {
      console.error(err);
      toast.error("Network error");
    } finally {
      setSaving(false);
    }
  };

  const input =
    "w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-red bg-white";
  const label = "block text-xs font-medium text-foreground mb-1.5";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Media */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="font-heading text-lg font-bold mb-1">Media</h2>
        <p className="text-xs text-muted-foreground mb-5">
          Upload a photo or video. Videos auto-play (muted) and loop. Max 100MB for video, 10MB for image.
        </p>
        <SlideMediaUpload
          type={data.type}
          mediaUrl={data.mediaUrl}
          posterUrl={data.posterUrl}
          onChange={({ type, mediaUrl, posterUrl }) => {
            setData((p) => ({ ...p, type, mediaUrl, posterUrl }));
          }}
        />
      </div>

      {/* Text content */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h2 className="font-heading text-lg font-bold">Text Overlay</h2>
        <div>
          <label className={label}>Eyebrow / subtitle</label>
          <input
            value={data.subtitle}
            onChange={(e) => update("subtitle", e.target.value)}
            placeholder="Wedding Collection 2025"
            className={input}
            maxLength={120}
          />
        </div>
        <div>
          <label className={label}>Title</label>
          <input
            value={data.title}
            onChange={(e) => update("title", e.target.value)}
            placeholder="Timeless Elegance"
            className={input}
            maxLength={120}
          />
        </div>
        <div>
          <label className={label}>Description</label>
          <textarea
            value={data.description}
            onChange={(e) => update("description", e.target.value)}
            placeholder="Discover handcrafted Assamese silk woven by master artisans"
            className={`${input} resize-y`}
            rows={3}
            maxLength={400}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={label}>Call-to-action button text</label>
            <input
              value={data.ctaText}
              onChange={(e) => update("ctaText", e.target.value)}
              placeholder="Shop Collection"
              className={input}
              maxLength={40}
            />
          </div>
          <div>
            <label className={label}>Call-to-action link</label>
            <input
              value={data.ctaLink}
              onChange={(e) => update("ctaLink", e.target.value)}
              placeholder="/categories/wedding-collection"
              className={input}
            />
          </div>
        </div>
      </div>

      {/* Styling */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h2 className="font-heading text-lg font-bold">Appearance</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className={label}>Text color</label>
            <select
              value={data.textColor}
              onChange={(e) => update("textColor", e.target.value as SlideInput["textColor"])}
              className={input}
            >
              <option value="white">White (for dark images)</option>
              <option value="dark">Dark (for light images)</option>
            </select>
          </div>
          <div>
            <label className={label}>Text alignment</label>
            <select
              value={data.alignment}
              onChange={(e) => update("alignment", e.target.value as SlideInput["alignment"])}
              className={input}
            >
              <option value="left">Left</option>
              <option value="center">Center</option>
              <option value="right">Right</option>
            </select>
          </div>
          <div>
            <label className={label}>Overlay darkness</label>
            <select
              value={data.overlayLevel}
              onChange={(e) =>
                update("overlayLevel", e.target.value as SlideInput["overlayLevel"])
              }
              className={input}
            >
              <option value="none">None</option>
              <option value="light">Light</option>
              <option value="medium">Medium (recommended)</option>
              <option value="strong">Strong</option>
            </select>
          </div>
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={data.isActive}
            onChange={(e) => update("isActive", e.target.checked)}
            className="accent-brand-red h-4 w-4"
          />
          Active (visible on the home page)
        </label>
      </div>

      <div className="flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-5 py-2.5 border border-border rounded-lg text-sm font-semibold hover:bg-muted transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={saving}
          className="bg-brand-red hover:bg-brand-deep-red text-white px-6 py-2.5 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50"
        >
          {saving ? "Saving…" : slideId ? "Update slide" : "Add slide"}
        </button>
      </div>
    </form>
  );
}
