"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Pencil, ExternalLink } from "lucide-react";
import toast from "react-hot-toast";
import ImageUpload from "@/components/admin/ImageUpload";

interface AdminCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  tagline: string | null;
  coverImage: string | null;
  bannerImage: string | null;
  isActive: boolean;
  productCount: number;
}

export default function AdminCategoriesGrid({
  categories,
}: {
  categories: AdminCategory[];
}) {
  const router = useRouter();
  const [editing, setEditing] = useState<AdminCategory | null>(null);

  const handleSave = async (data: Partial<AdminCategory>) => {
    if (!editing) return;
    const res = await fetch(`/api/admin/categories/${editing.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) {
      toast.error(json.error || "Failed to save");
      return;
    }
    toast.success("Category updated");
    setEditing(null);
    router.refresh();
  };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="bg-white rounded-xl border border-gray-200 overflow-hidden flex flex-col"
          >
            <div className="relative aspect-[3/2] bg-muted">
              {cat.coverImage ? (
                <Image
                  src={cat.coverImage}
                  alt={cat.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-brand-maroon via-brand-deep-red to-brand-maroon flex items-center justify-center">
                  <span className="font-heading text-2xl text-brand-gold/60">
                    {cat.name}
                  </span>
                </div>
              )}
              <div className="absolute top-2 right-2">
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    cat.isActive
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  {cat.isActive ? "Active" : "Hidden"}
                </span>
              </div>
            </div>
            <div className="p-4 flex-1 flex flex-col">
              <div className="flex items-start justify-between gap-2 mb-1">
                <h3 className="font-heading font-semibold text-foreground">
                  {cat.name}
                </h3>
                <Link
                  href={`/categories/${cat.slug}`}
                  target="_blank"
                  className="shrink-0 p-1 hover:bg-muted rounded"
                  title="View on storefront"
                >
                  <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
                </Link>
              </div>
              {cat.tagline && (
                <p className="text-xs text-brand-gold uppercase tracking-wider font-medium mb-1.5">
                  {cat.tagline}
                </p>
              )}
              <p className="text-xs text-muted-foreground line-clamp-2 flex-1">
                {cat.description || "No description yet"}
              </p>
              <div className="flex items-center justify-between gap-2 mt-3 pt-3 border-t border-border">
                <span className="text-xs text-muted-foreground">
                  {cat.productCount} product{cat.productCount === 1 ? "" : "s"}
                </span>
                <button
                  onClick={() => setEditing(cat)}
                  className="flex items-center gap-1.5 text-xs text-brand-red hover:underline font-medium"
                >
                  <Pencil className="h-3.5 w-3.5" />
                  Edit cover
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <EditModal
          category={editing}
          onClose={() => setEditing(null)}
          onSave={handleSave}
        />
      )}
    </>
  );
}

function EditModal({
  category,
  onClose,
  onSave,
}: {
  category: AdminCategory;
  onClose: () => void;
  onSave: (data: Partial<AdminCategory>) => Promise<void>;
}) {
  const [coverImages, setCoverImages] = useState<string[]>(
    category.coverImage ? [category.coverImage] : []
  );
  const [bannerImages, setBannerImages] = useState<string[]>(
    category.bannerImage ? [category.bannerImage] : []
  );
  const [description, setDescription] = useState(category.description || "");
  const [tagline, setTagline] = useState(category.tagline || "");
  const [isActive, setIsActive] = useState(category.isActive);
  const [saving, setSaving] = useState(false);

  const input =
    "w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-red bg-white";
  const label = "block text-xs font-medium text-foreground mb-1.5";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave({
        coverImage: coverImages[0] || null,
        bannerImage: bannerImages[0] || null,
        description: description.trim() || null,
        tagline: tagline.trim() || null,
        isActive,
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl my-10 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white border-b border-border px-6 py-4 z-10">
          <h2 className="font-heading text-xl font-bold">
            Edit category: {category.name}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className={label}>Cover image (square / portrait)</label>
            <p className="text-xs text-muted-foreground mb-2">
              Shown on the home page category card. Recommended: 600×800 portrait.
            </p>
            <ImageUpload images={coverImages} onChange={setCoverImages} max={1} />
          </div>

          <div>
            <label className={label}>Banner image (wide)</label>
            <p className="text-xs text-muted-foreground mb-2">
              Shown at the top of the category landing page. Recommended: 1600×600 landscape.
            </p>
            <ImageUpload images={bannerImages} onChange={setBannerImages} max={1} />
          </div>

          <div>
            <label className={label}>Tagline</label>
            <input
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="e.g. Golden heritage silk"
              className={input}
            />
          </div>

          <div>
            <label className={label}>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe this category for SEO and storefront…"
              rows={4}
              className={`${input} resize-y`}
            />
          </div>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="accent-brand-red h-4 w-4"
            />
            Active (visible to customers)
          </label>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 border border-border rounded-lg text-sm font-semibold hover:bg-muted transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="bg-brand-red hover:bg-brand-deep-red text-white px-6 py-2.5 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50"
            >
              {saving ? "Saving…" : "Save changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
