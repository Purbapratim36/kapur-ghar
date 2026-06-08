"use client";

import { useState } from "react";
import toast from "react-hot-toast";

export interface AddressFormData {
  id?: string;
  name: string;
  phone: string;
  line1: string;
  line2?: string | null;
  city: string;
  state: string;
  pincode: string;
  landmark?: string | null;
  isDefault?: boolean;
}

interface Props {
  initial?: Partial<AddressFormData>;
  onSaved: (address: AddressFormData) => void;
  onCancel: () => void;
}

const empty: AddressFormData = {
  name: "",
  phone: "",
  line1: "",
  line2: "",
  city: "",
  state: "Assam",
  pincode: "",
  landmark: "",
  isDefault: false,
};

export default function AddressForm({ initial, onSaved, onCancel }: Props) {
  const [data, setData] = useState<AddressFormData>({ ...empty, ...initial });
  const [saving, setSaving] = useState(false);

  const update = <K extends keyof AddressFormData>(key: K, value: AddressFormData[K]) =>
    setData((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const isEdit = Boolean(data.id);
      const url = isEdit ? `/api/addresses/${data.id}` : "/api/addresses";
      const method = isEdit ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) {
        toast.error(json.error || "Failed to save address");
        return;
      }
      toast.success(isEdit ? "Address updated" : "Address added");
      onSaved(json.address);
    } catch (err) {
      console.error(err);
      toast.error("Network error");
    } finally {
      setSaving(false);
    }
  };

  const inputCls =
    "w-full px-3.5 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-red bg-white";

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-foreground mb-1">Full name</label>
          <input
            value={data.name}
            onChange={(e) => update("name", e.target.value)}
            placeholder="Receiver's name"
            required
            className={inputCls}
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-foreground mb-1">Phone</label>
          <input
            value={data.phone}
            onChange={(e) => update("phone", e.target.value)}
            placeholder="+91 98765 43210"
            required
            className={inputCls}
          />
        </div>
      </div>
      <div>
        <label className="block text-xs font-medium text-foreground mb-1">Address line 1</label>
        <input
          value={data.line1}
          onChange={(e) => update("line1", e.target.value)}
          placeholder="House no., street name"
          required
          className={inputCls}
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-foreground mb-1">Address line 2 (optional)</label>
        <input
          value={data.line2 || ""}
          onChange={(e) => update("line2", e.target.value)}
          placeholder="Apartment, locality"
          className={inputCls}
        />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div>
          <label className="block text-xs font-medium text-foreground mb-1">City</label>
          <input
            value={data.city}
            onChange={(e) => update("city", e.target.value)}
            required
            className={inputCls}
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-foreground mb-1">State</label>
          <input
            value={data.state}
            onChange={(e) => update("state", e.target.value)}
            required
            className={inputCls}
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-foreground mb-1">Pincode</label>
          <input
            value={data.pincode}
            onChange={(e) => update("pincode", e.target.value)}
            placeholder="6 digits"
            required
            maxLength={6}
            className={inputCls}
          />
        </div>
      </div>
      <div>
        <label className="block text-xs font-medium text-foreground mb-1">Landmark (optional)</label>
        <input
          value={data.landmark || ""}
          onChange={(e) => update("landmark", e.target.value)}
          placeholder="Near…"
          className={inputCls}
        />
      </div>
      <label className="flex items-center gap-2 text-sm text-foreground select-none">
        <input
          type="checkbox"
          checked={data.isDefault || false}
          onChange={(e) => update("isDefault", e.target.checked)}
          className="accent-brand-red h-4 w-4"
        />
        Make this my default address
      </label>
      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-2.5 border border-border rounded-lg text-sm font-medium hover:bg-muted transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={saving}
          className="flex-1 bg-brand-red hover:bg-brand-deep-red text-white py-2.5 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save address"}
        </button>
      </div>
    </form>
  );
}
