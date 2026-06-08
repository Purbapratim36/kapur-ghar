"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Plus, Trash2 } from "lucide-react";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface ProductInput {
  name: string;
  description: string;
  shortDesc: string;
  price: string;
  comparePrice: string;
  stock: string;
  sku: string;
  categoryId: string;
  fabric: string;
  color: string;
  occasion: string;
  silkType: string;
  weight: string;
  dimensions: string;
  careInstructions: string;
  isActive: boolean;
  isFeatured: boolean;
  isNew: boolean;
  images: string[];
}

const empty: ProductInput = {
  name: "",
  description: "",
  shortDesc: "",
  price: "",
  comparePrice: "",
  stock: "10",
  sku: "",
  categoryId: "",
  fabric: "",
  color: "",
  occasion: "",
  silkType: "",
  weight: "",
  dimensions: "",
  careInstructions: "",
  isActive: true,
  isFeatured: false,
  isNew: true,
  images: [""],
};

export default function ProductForm({
  categories,
  initial,
  productId,
}: {
  categories: Category[];
  initial?: Partial<ProductInput>;
  productId?: string;
}) {
  const router = useRouter();
  const [data, setData] = useState<ProductInput>({ ...empty, ...initial });
  const [saving, setSaving] = useState(false);

  const update = <K extends keyof ProductInput>(key: K, value: ProductInput[K]) =>
    setData((p) => ({ ...p, [key]: value }));

  const updateImage = (idx: number, value: string) =>
    setData((p) => {
      const next = [...p.images];
      next[idx] = value;
      return { ...p, images: next };
    });

  const addImageField = () => setData((p) => ({ ...p, images: [...p.images, ""] }));
  const removeImage = (idx: number) =>
    setData((p) => ({ ...p, images: p.images.filter((_, i) => i !== idx) }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!data.name.trim() || !data.price || !data.categoryId) {
      toast.error("Name, price and category are required");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        name: data.name.trim(),
        description: data.description.trim(),
        shortDesc: data.shortDesc.trim() || null,
        price: parseFloat(data.price),
        comparePrice: data.comparePrice ? parseFloat(data.comparePrice) : null,
        stock: parseInt(data.stock || "0", 10),
        sku: data.sku.trim() || null,
        categoryId: data.categoryId,
        fabric: data.fabric.trim() || null,
        color: data.color.trim() || null,
        occasion: data.occasion.trim() || null,
        silkType: data.silkType.trim() || null,
        weight: data.weight.trim() || null,
        dimensions: data.dimensions.trim() || null,
        careInstructions: data.careInstructions.trim() || null,
        isActive: data.isActive,
        isFeatured: data.isFeatured,
        isNew: data.isNew,
        images: data.images.map((u) => u.trim()).filter(Boolean),
      };

      const url = productId ? `/api/admin/products/${productId}` : "/api/admin/products";
      const method = productId ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) {
        toast.error(json.error || "Failed to save product");
        return;
      }
      toast.success(productId ? "Product updated" : "Product created");
      router.push("/admin/products");
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
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h2 className="font-heading text-lg font-bold">Basic Info</h2>

        <div>
          <label className={label}>Product name *</label>
          <input
            value={data.name}
            onChange={(e) => update("name", e.target.value)}
            placeholder="e.g. Golden Muga Silk Mekhela Sador"
            required
            className={input}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className={label}>Price (₹) *</label>
            <input
              type="number"
              value={data.price}
              onChange={(e) => update("price", e.target.value)}
              placeholder="8999"
              step="0.01"
              required
              className={input}
            />
          </div>
          <div>
            <label className={label}>Compare price (₹)</label>
            <input
              type="number"
              value={data.comparePrice}
              onChange={(e) => update("comparePrice", e.target.value)}
              placeholder="11999"
              step="0.01"
              className={input}
            />
          </div>
          <div>
            <label className={label}>Stock *</label>
            <input
              type="number"
              value={data.stock}
              onChange={(e) => update("stock", e.target.value)}
              required
              className={input}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={label}>Category *</label>
            <select
              value={data.categoryId}
              onChange={(e) => update("categoryId", e.target.value)}
              required
              className={input}
            >
              <option value="">Select a category…</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            {categories.length === 0 && (
              <p className="mt-1 text-xs text-amber-600">
                No categories yet. Run the seed script (see README) or add categories first.
              </p>
            )}
          </div>
          <div>
            <label className={label}>SKU</label>
            <input
              value={data.sku}
              onChange={(e) => update("sku", e.target.value)}
              placeholder="KG-MS-001"
              className={input}
            />
          </div>
        </div>

        <div>
          <label className={label}>Short description</label>
          <input
            value={data.shortDesc}
            onChange={(e) => update("shortDesc", e.target.value)}
            placeholder="A short tagline shown on cards"
            className={input}
          />
        </div>

        <div>
          <label className={label}>Full description *</label>
          <textarea
            value={data.description}
            onChange={(e) => update("description", e.target.value)}
            placeholder="Detailed description of the product…"
            required
            rows={6}
            className={`${input} resize-y`}
          />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h2 className="font-heading text-lg font-bold">Fabric & Style</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={label}>Fabric</label>
            <input
              value={data.fabric}
              onChange={(e) => update("fabric", e.target.value)}
              placeholder="Muga Silk / Cotton / …"
              className={input}
            />
          </div>
          <div>
            <label className={label}>Silk type</label>
            <input
              value={data.silkType}
              onChange={(e) => update("silkType", e.target.value)}
              placeholder="Muga / Pat / Eri / Tussar"
              className={input}
            />
          </div>
          <div>
            <label className={label}>Color</label>
            <input
              value={data.color}
              onChange={(e) => update("color", e.target.value)}
              placeholder="Golden, Maroon, etc."
              className={input}
            />
          </div>
          <div>
            <label className={label}>Occasion</label>
            <input
              value={data.occasion}
              onChange={(e) => update("occasion", e.target.value)}
              placeholder="Wedding, Festival, Casual"
              className={input}
            />
          </div>
          <div>
            <label className={label}>Weight</label>
            <input
              value={data.weight}
              onChange={(e) => update("weight", e.target.value)}
              placeholder="500g"
              className={input}
            />
          </div>
          <div>
            <label className={label}>Dimensions</label>
            <input
              value={data.dimensions}
              onChange={(e) => update("dimensions", e.target.value)}
              placeholder="5m x 1.2m"
              className={input}
            />
          </div>
        </div>
        <div>
          <label className={label}>Care instructions</label>
          <textarea
            value={data.careInstructions}
            onChange={(e) => update("careInstructions", e.target.value)}
            placeholder="Dry clean only, do not bleach…"
            rows={3}
            className={`${input} resize-y`}
          />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <div>
          <h2 className="font-heading text-lg font-bold">Images</h2>
          <p className="text-xs text-muted-foreground mt-1">
            Paste image URLs (use Cloudinary, Unsplash, or any public URL). The first image is the cover.
          </p>
        </div>
        <div className="space-y-2">
          {data.images.map((url, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                value={url}
                onChange={(e) => updateImage(i, e.target.value)}
                placeholder="https://res.cloudinary.com/…/product.jpg"
                className={input}
              />
              <button
                type="button"
                onClick={() => removeImage(i)}
                disabled={data.images.length === 1}
                className="p-2.5 hover:bg-red-50 rounded-lg disabled:opacity-50"
                title="Remove"
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addImageField}
          className="flex items-center gap-1.5 text-sm text-brand-red hover:underline font-medium"
        >
          <Plus className="h-4 w-4" />
          Add another image
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-3">
        <h2 className="font-heading text-lg font-bold">Visibility</h2>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={data.isActive}
            onChange={(e) => update("isActive", e.target.checked)}
            className="accent-brand-red h-4 w-4"
          />
          Active (visible to customers)
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={data.isFeatured}
            onChange={(e) => update("isFeatured", e.target.checked)}
            className="accent-brand-red h-4 w-4"
          />
          Featured (shows in Best Sellers carousel)
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={data.isNew}
            onChange={(e) => update("isNew", e.target.checked)}
            className="accent-brand-red h-4 w-4"
          />
          Mark as new arrival
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
          {saving ? "Saving…" : productId ? "Update product" : "Create product"}
        </button>
      </div>
    </form>
  );
}
