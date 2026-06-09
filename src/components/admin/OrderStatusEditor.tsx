"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const STATUSES = [
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
  "RETURNED",
  "REFUNDED",
] as const;
const PAYMENT_STATUSES = ["PENDING", "PAID", "FAILED", "REFUNDED"] as const;

interface Props {
  orderId: string;
  status: string;
  paymentStatus: string;
  trackingNumber: string | null;
  trackingUrl: string | null;
  notes: string | null;
}

export default function OrderStatusEditor({
  orderId,
  status: initialStatus,
  paymentStatus: initialPaymentStatus,
  trackingNumber: initialTrackingNumber,
  trackingUrl: initialTrackingUrl,
  notes: initialNotes,
}: Props) {
  const router = useRouter();
  const [status, setStatus] = useState(initialStatus);
  const [paymentStatus, setPaymentStatus] = useState(initialPaymentStatus);
  const [trackingNumber, setTrackingNumber] = useState(initialTrackingNumber || "");
  const [trackingUrl, setTrackingUrl] = useState(initialTrackingUrl || "");
  const [notes, setNotes] = useState(initialNotes || "");
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status,
          paymentStatus,
          trackingNumber: trackingNumber.trim() || null,
          trackingUrl: trackingUrl.trim() || null,
          notes: notes.trim() || null,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        toast.error(data.error || "Failed to update");
        return;
      }
      toast.success("Order updated");
      router.refresh();
    } catch {
      toast.error("Network error");
    } finally {
      setSaving(false);
    }
  };

  const input =
    "w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-red bg-white";
  const label = "block text-xs font-medium text-foreground mb-1.5";

  return (
    <div className="space-y-4">
      <h2 className="font-heading text-lg font-bold mb-2">Fulfillment</h2>

      <div>
        <label className={label}>Status</label>
        <select value={status} onChange={(e) => setStatus(e.target.value)} className={input}>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className={label}>Payment status</label>
        <select
          value={paymentStatus}
          onChange={(e) => setPaymentStatus(e.target.value)}
          className={input}
        >
          {PAYMENT_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className={label}>Tracking number</label>
        <input
          value={trackingNumber}
          onChange={(e) => setTrackingNumber(e.target.value)}
          placeholder="AWB / consignment number"
          className={input}
        />
      </div>

      <div>
        <label className={label}>Tracking URL</label>
        <input
          value={trackingUrl}
          onChange={(e) => setTrackingUrl(e.target.value)}
          placeholder="https://courier.com/track/..."
          className={input}
        />
      </div>

      <div>
        <label className={label}>Internal notes</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          className={`${input} resize-y`}
          placeholder="Visible to admin only"
        />
      </div>

      <button
        onClick={save}
        disabled={saving}
        className="w-full bg-brand-red hover:bg-brand-deep-red text-white py-2.5 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50"
      >
        {saving ? "Saving…" : "Save changes"}
      </button>
    </div>
  );
}
