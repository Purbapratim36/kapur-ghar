"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Pencil, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";

interface Coupon {
  id: string;
  code: string;
  description: string | null;
  type: string;
  value: number;
  minOrder: number | null;
  maxDiscount: number | null;
  usageLimit: number | null;
  usedCount: number;
  isActive: boolean;
  expiresAt: string | null;
}

interface FormState {
  code: string;
  description: string;
  type: "percentage" | "fixed";
  value: string;
  minOrder: string;
  maxDiscount: string;
  usageLimit: string;
  isActive: boolean;
  expiresAt: string;
}

const emptyForm: FormState = {
  code: "",
  description: "",
  type: "percentage",
  value: "",
  minOrder: "",
  maxDiscount: "",
  usageLimit: "",
  isActive: true,
  expiresAt: "",
};

export default function CouponsManager({
  initialCoupons,
}: {
  initialCoupons: Coupon[];
}) {
  const router = useRouter();
  const [coupons, setCoupons] = useState(initialCoupons);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const reset = () => {
    setForm(emptyForm);
    setShowForm(false);
  };

  const create = async () => {
    if (!form.code.trim() || !form.value) {
      toast.error("Code and value are required");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        code: form.code.trim().toUpperCase(),
        description: form.description.trim() || null,
        type: form.type,
        value: parseFloat(form.value),
        minOrder: form.minOrder ? parseFloat(form.minOrder) : null,
        maxDiscount: form.maxDiscount ? parseFloat(form.maxDiscount) : null,
        usageLimit: form.usageLimit ? parseInt(form.usageLimit, 10) : null,
        isActive: form.isActive,
        expiresAt: form.expiresAt
          ? new Date(form.expiresAt).toISOString()
          : null,
      };
      const res = await fetch("/api/admin/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Failed to create");
        return;
      }
      toast.success("Coupon created");
      setCoupons((cs) => [data.coupon, ...cs]);
      reset();
      router.refresh();
    } catch {
      toast.error("Network error");
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (id: string, current: boolean) => {
    const res = await fetch(`/api/admin/coupons/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !current }),
    });
    if (res.ok) {
      setCoupons((cs) => cs.map((c) => (c.id === id ? { ...c, isActive: !current } : c)));
      toast.success(current ? "Coupon hidden" : "Coupon active");
    } else {
      toast.error("Update failed");
    }
  };

  const remove = async (id: string, code: string) => {
    if (!confirm(`Delete coupon ${code}?`)) return;
    const res = await fetch(`/api/admin/coupons/${id}`, { method: "DELETE" });
    if (res.ok) {
      setCoupons((cs) => cs.filter((c) => c.id !== id));
      toast.success("Coupon deleted");
    } else {
      toast.error("Delete failed");
    }
  };

  const input =
    "w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-red bg-white";
  const lbl = "block text-xs font-medium text-foreground mb-1.5";

  return (
    <div className="space-y-4">
      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-brand-red hover:bg-brand-deep-red text-white px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add coupon
        </button>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-3">
          <h2 className="font-heading font-bold">New coupon</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className={lbl}>Code *</label>
              <input
                value={form.code}
                onChange={(e) => update("code", e.target.value.toUpperCase())}
                placeholder="FESTIVE25"
                className={input}
              />
            </div>
            <div>
              <label className={lbl}>Type</label>
              <select
                value={form.type}
                onChange={(e) =>
                  update("type", e.target.value as FormState["type"])
                }
                className={input}
              >
                <option value="percentage">Percentage off</option>
                <option value="fixed">Flat ₹ off</option>
              </select>
            </div>
            <div>
              <label className={lbl}>
                {form.type === "percentage" ? "% off *" : "₹ off *"}
              </label>
              <input
                type="number"
                value={form.value}
                onChange={(e) => update("value", e.target.value)}
                placeholder={form.type === "percentage" ? "25" : "500"}
                className={input}
              />
            </div>
            <div>
              <label className={lbl}>Description</label>
              <input
                value={form.description}
                onChange={(e) => update("description", e.target.value)}
                placeholder="Get 25% off this Diwali"
                className={input}
              />
            </div>
            <div>
              <label className={lbl}>Min order ₹</label>
              <input
                type="number"
                value={form.minOrder}
                onChange={(e) => update("minOrder", e.target.value)}
                placeholder="1499"
                className={input}
              />
            </div>
            {form.type === "percentage" && (
              <div>
                <label className={lbl}>Max discount ₹</label>
                <input
                  type="number"
                  value={form.maxDiscount}
                  onChange={(e) => update("maxDiscount", e.target.value)}
                  placeholder="2000"
                  className={input}
                />
              </div>
            )}
            <div>
              <label className={lbl}>Usage limit</label>
              <input
                type="number"
                value={form.usageLimit}
                onChange={(e) => update("usageLimit", e.target.value)}
                placeholder="100"
                className={input}
              />
            </div>
            <div>
              <label className={lbl}>Expires at</label>
              <input
                type="datetime-local"
                value={form.expiresAt}
                onChange={(e) => update("expiresAt", e.target.value)}
                className={input}
              />
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) => update("isActive", e.target.checked)}
              className="accent-brand-red h-4 w-4"
            />
            Active immediately
          </label>
          <div className="flex gap-2 pt-2">
            <button
              onClick={reset}
              className="flex-1 py-2.5 border border-border rounded-lg text-sm font-medium hover:bg-muted"
            >
              Cancel
            </button>
            <button
              onClick={create}
              disabled={saving}
              className="flex-1 bg-brand-red hover:bg-brand-deep-red text-white py-2.5 rounded-lg text-sm font-semibold disabled:opacity-50"
            >
              {saving ? "Saving…" : "Create coupon"}
            </button>
          </div>
        </div>
      )}

      {/* Coupon list */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {coupons.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground text-sm">
            No coupons yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50 text-left">
                  <th className="px-5 py-3 text-muted-foreground font-medium">Code</th>
                  <th className="px-5 py-3 text-muted-foreground font-medium">Discount</th>
                  <th className="px-5 py-3 text-muted-foreground font-medium">Min order</th>
                  <th className="px-5 py-3 text-muted-foreground font-medium">Used</th>
                  <th className="px-5 py-3 text-muted-foreground font-medium">Expires</th>
                  <th className="px-5 py-3 text-muted-foreground font-medium">Status</th>
                  <th className="px-5 py-3 text-muted-foreground font-medium text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {coupons.map((c) => (
                  <tr key={c.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="px-5 py-3">
                      <p className="font-mono font-bold text-brand-red">{c.code}</p>
                      {c.description && (
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {c.description}
                        </p>
                      )}
                    </td>
                    <td className="px-5 py-3 font-semibold">
                      {c.type === "percentage"
                        ? `${c.value}%`
                        : `₹${c.value.toLocaleString("en-IN")}`}
                      {c.type === "percentage" && c.maxDiscount && (
                        <p className="text-[10px] text-muted-foreground font-normal">
                          (max ₹{c.maxDiscount.toLocaleString("en-IN")})
                        </p>
                      )}
                    </td>
                    <td className="px-5 py-3">
                      {c.minOrder ? `₹${c.minOrder.toLocaleString("en-IN")}` : "—"}
                    </td>
                    <td className="px-5 py-3">
                      {c.usedCount}
                      {c.usageLimit ? ` / ${c.usageLimit}` : ""}
                    </td>
                    <td className="px-5 py-3 text-xs">
                      {c.expiresAt
                        ? new Intl.DateTimeFormat("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          }).format(new Date(c.expiresAt))
                        : "—"}
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          c.isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {c.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => toggleActive(c.id, c.isActive)}
                          className="p-1.5 hover:bg-gray-100 rounded-md"
                          title={c.isActive ? "Disable" : "Enable"}
                        >
                          {c.isActive ? (
                            <EyeOff className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <Eye className="h-4 w-4 text-muted-foreground" />
                          )}
                        </button>
                        <button
                          onClick={() => remove(c.id, c.code)}
                          className="p-1.5 hover:bg-red-50 rounded-md"
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
    </div>
  );
}
