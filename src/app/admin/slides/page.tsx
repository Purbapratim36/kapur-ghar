import { redirect } from "next/navigation";
import Link from "next/link";
import { Plus } from "lucide-react";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import SlidesAdminList from "@/components/admin/SlidesAdminList";

export default async function AdminSlidesPage() {
  const session = await auth();
  if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
    redirect("/login?callbackUrl=/admin/slides");
  }

  const slides = await db.heroSlide.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Hero Slides</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage the photos and videos shown at the top of the home page
          </p>
        </div>
        <Link
          href="/admin/slides/new"
          className="flex items-center gap-2 bg-brand-red text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-brand-deep-red transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add Slide
        </Link>
      </div>

      <SlidesAdminList initialSlides={slides} />
    </div>
  );
}
