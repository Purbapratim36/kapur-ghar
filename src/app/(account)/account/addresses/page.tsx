"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { MapPin, Plus, Pencil, Trash2, Star } from "lucide-react";
import toast from "react-hot-toast";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AddressForm, { type AddressFormData } from "@/components/account/AddressForm";

interface Address extends AddressFormData {
  id: string;
}

export default function AddressesPage() {
  const router = useRouter();
  const { status } = useSession();

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Address | null>(null);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login?callbackUrl=/account/addresses");
    }
  }, [status, router]);

  const fetchAddresses = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/addresses");
      if (res.status === 401) return;
      const data = await res.json();
      setAddresses(data.addresses || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === "authenticated") fetchAddresses();
  }, [status]);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this address?")) return;
    const res = await fetch(`/api/addresses/${id}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("Address deleted");
      setAddresses((prev) => prev.filter((a) => a.id !== id));
    } else {
      toast.error("Failed to delete");
    }
  };

  const handleMakeDefault = async (id: string) => {
    const res = await fetch(`/api/addresses/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isDefault: true }),
    });
    if (res.ok) {
      toast.success("Default address updated");
      fetchAddresses();
    }
  };

  if (status === "loading") {
    return (
      <>
        <AnnouncementBar />
        <Header />
        <main className="min-h-screen flex items-center justify-center">
          <p className="text-muted-foreground">Loading…</p>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <AnnouncementBar />
      <Header />
      <main className="min-h-screen bg-brand-cream/20 py-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="font-heading text-2xl font-bold">My Addresses</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Manage your saved delivery addresses
              </p>
            </div>
            {!adding && !editing && (
              <button
                onClick={() => setAdding(true)}
                className="flex items-center gap-2 bg-brand-red hover:bg-brand-deep-red text-white px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors"
              >
                <Plus className="h-4 w-4" />
                Add address
              </button>
            )}
          </div>

          {(adding || editing) && (
            <div className="bg-white rounded-xl border border-border p-5 mb-6">
              <h2 className="font-heading text-lg font-bold mb-4">
                {editing ? "Edit address" : "Add new address"}
              </h2>
              <AddressForm
                initial={editing || undefined}
                onSaved={(saved) => {
                  setAdding(false);
                  setEditing(null);
                  fetchAddresses();
                  void saved;
                }}
                onCancel={() => {
                  setAdding(false);
                  setEditing(null);
                }}
              />
            </div>
          )}

          {loading ? (
            <p className="text-muted-foreground">Loading addresses…</p>
          ) : addresses.length === 0 && !adding ? (
            <div className="bg-white rounded-xl border border-border p-10 text-center">
              <MapPin className="h-12 w-12 text-brand-gold/40 mx-auto mb-3" />
              <h3 className="font-heading text-lg font-bold mb-1">
                No saved addresses yet
              </h3>
              <p className="text-sm text-muted-foreground mb-5">
                Add a delivery address to place your first order.
              </p>
              <button
                onClick={() => setAdding(true)}
                className="bg-brand-red hover:bg-brand-deep-red text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors"
              >
                Add your first address
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {addresses.map((addr) => (
                <div
                  key={addr.id}
                  className="bg-white rounded-xl border border-border p-5 flex flex-col"
                >
                  <div className="flex items-start justify-between mb-2">
                    <p className="font-semibold text-sm">
                      {addr.name}
                      {addr.isDefault && (
                        <span className="ml-2 inline-flex items-center gap-1 text-[10px] bg-brand-gold/20 text-brand-muga px-2 py-0.5 rounded-full font-medium uppercase">
                          <Star className="h-3 w-3" /> Default
                        </span>
                      )}
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground">{addr.phone}</p>
                  <p className="text-sm text-foreground mt-2 leading-relaxed">
                    {addr.line1}
                    {addr.line2 && <>, {addr.line2}</>}
                    <br />
                    {addr.city}, {addr.state} {addr.pincode}
                    {addr.landmark && (
                      <>
                        <br />
                        <span className="text-muted-foreground text-xs">
                          Landmark: {addr.landmark}
                        </span>
                      </>
                    )}
                  </p>
                  <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border">
                    {!addr.isDefault && (
                      <button
                        onClick={() => handleMakeDefault(addr.id)}
                        className="text-xs font-medium text-brand-red hover:underline"
                      >
                        Make default
                      </button>
                    )}
                    <div className="ml-auto flex items-center gap-1">
                      <button
                        onClick={() => setEditing(addr)}
                        className="p-1.5 hover:bg-muted rounded-md"
                        title="Edit"
                      >
                        <Pencil className="h-4 w-4 text-muted-foreground" />
                      </button>
                      <button
                        onClick={() => handleDelete(addr.id)}
                        className="p-1.5 hover:bg-red-50 rounded-md"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
