import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import ProductForm from "@/components/admin/ProductForm";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
    redirect(`/login?callbackUrl=/admin/products/${id}/edit`);
  }

  const [product, categories] = await Promise.all([
    db.product.findUnique({
      where: { id },
      include: { images: { orderBy: { sortOrder: "asc" } } },
    }),
    db.category.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
      select: { id: true, name: true, slug: true },
    }),
  ]);

  if (!product) notFound();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Edit Product</h1>
        <p className="text-sm text-muted-foreground mt-1">Update product details</p>
      </div>
      <ProductForm
        categories={categories}
        productId={product.id}
        initial={{
          name: product.name,
          description: product.description,
          shortDesc: product.shortDesc || "",
          price: String(product.price),
          comparePrice: product.comparePrice != null ? String(product.comparePrice) : "",
          stock: String(product.stock),
          sku: product.sku || "",
          categoryId: product.categoryId,
          fabric: product.fabric || "",
          color: product.color || "",
          occasion: product.occasion || "",
          silkType: product.silkType || "",
          weight: product.weight || "",
          dimensions: product.dimensions || "",
          careInstructions: product.careInstructions || "",
          isActive: product.isActive,
          isFeatured: product.isFeatured,
          isNew: product.isNew,
          images: product.images.map((i) => i.url),
        }}
      />
    </div>
  );
}
