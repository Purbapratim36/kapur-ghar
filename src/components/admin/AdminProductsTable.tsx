"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Search, Edit, Trash2, Eye } from "lucide-react";
import toast from "react-hot-toast";

interface AdminProduct {
  id: string;
  name: string;
  slug: string;
  sku: string | null;
  price: number;
  stock: number;
  isActive: boolean;
  category: string;
  image: string | null;
}

export default function AdminProductsTable({ products }: { products: AdminProduct[] }) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.sku || "").toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json();
        toast.error(data.error || "Failed to delete");
        return;
      }
      toast.success("Product deleted");
      router.refresh();
    } catch (err) {
      console.error(err);
      toast.error("Network error");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <>
      <div className="bg-white rounded-xl border border-gray-200 mb-4">
        <div className="p-4 flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, SKU, or category…"
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-red"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-16 text-center">
            <p className="text-muted-foreground mb-4">
              {products.length === 0
                ? "No products yet — add your first product to get started."
                : "No products match your search."}
            </p>
            {products.length === 0 && (
              <Link
                href="/admin/products/new"
                className="inline-flex bg-brand-red hover:bg-brand-deep-red text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors"
              >
                Add product
              </Link>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50 text-left">
                  <th className="px-5 py-3 text-muted-foreground font-medium">Product</th>
                  <th className="px-5 py-3 text-muted-foreground font-medium">SKU</th>
                  <th className="px-5 py-3 text-muted-foreground font-medium">Category</th>
                  <th className="px-5 py-3 text-muted-foreground font-medium">Price</th>
                  <th className="px-5 py-3 text-muted-foreground font-medium">Stock</th>
                  <th className="px-5 py-3 text-muted-foreground font-medium">Status</th>
                  <th className="px-5 py-3 text-muted-foreground font-medium text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr
                    key={p.id}
                    className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-12 rounded-lg bg-muted overflow-hidden shrink-0 flex items-center justify-center text-brand-gold/40 font-heading text-xs">
                          {p.image ? (
                            <Image
                              src={p.image}
                              alt={p.name}
                              width={40}
                              height={48}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            "KG"
                          )}
                        </div>
                        <span className="font-medium line-clamp-1">{p.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-muted-foreground font-mono text-xs">
                      {p.sku || "—"}
                    </td>
                    <td className="px-5 py-3">{p.category}</td>
                    <td className="px-5 py-3 font-semibold">
                      ₹{p.price.toLocaleString("en-IN")}
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={
                          p.stock === 0
                            ? "text-red-600 font-medium"
                            : p.stock <= 5
                              ? "text-orange-600 font-medium"
                              : ""
                        }
                      >
                        {p.stock === 0 ? "Out of stock" : p.stock}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          p.isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {p.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          href={`/products/${p.slug}`}
                          target="_blank"
                          className="p-1.5 hover:bg-gray-100 rounded-md"
                          title="View on storefront"
                        >
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        </Link>
                        <Link
                          href={`/admin/products/${p.id}/edit`}
                          className="p-1.5 hover:bg-gray-100 rounded-md"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4 text-muted-foreground" />
                        </Link>
                        <button
                          disabled={deletingId === p.id}
                          onClick={() => handleDelete(p.id, p.name)}
                          className="p-1.5 hover:bg-red-50 rounded-md disabled:opacity-50"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
