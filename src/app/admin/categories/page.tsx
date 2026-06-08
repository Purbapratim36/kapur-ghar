import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import AdminCategoriesGrid from "@/components/admin/AdminCategoriesGrid";

export default async function AdminCategoriesPage() {
  const session = await auth();
  if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
    redirect("/login?callbackUrl=/admin/categories");
  }

  const categories = await db.category.findMany({
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    include: { _count: { select: { products: true } } },
  });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Categories</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Edit cover images, descriptions, and visibility for the category cards on your storefront
        </p>
      </div>
      <AdminCategoriesGrid
        categories={categories.map((c) => ({
          id: c.id,
          name: c.name,
          slug: c.slug,
          description: c.description,
          tagline: c.tagline,
          coverImage: c.coverImage,
          bannerImage: c.bannerImage,
          isActive: c.isActive,
          productCount: c._count.products,
        }))}
      />
    </div>
  );
}
