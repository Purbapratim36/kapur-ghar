import { db } from "@/lib/db";

export interface ProductCardData {
  id: string;
  name: string;
  slug: string;
  price: number;
  comparePrice: number | null;
  images: { url: string; alt: string | null }[];
  stock: number;
  isNew: boolean;
  fabric: string | null;
  avgRating: number;
  _count: { reviews: number };
}

/**
 * Fetch products for cards (home, listing, related). Returns empty array if DB
 * is unreachable or there are no products yet.
 */
export async function getProducts(opts: {
  limit?: number;
  featured?: boolean;
  isNew?: boolean;
  categorySlug?: string;
  excludeId?: string;
} = {}): Promise<ProductCardData[]> {
  const { limit = 8, featured, isNew, categorySlug, excludeId } = opts;
  try {
    const products = await db.product.findMany({
      where: {
        isActive: true,
        ...(featured ? { isFeatured: true } : {}),
        ...(isNew ? { isNew: true } : {}),
        ...(categorySlug ? { category: { slug: categorySlug } } : {}),
        ...(excludeId ? { id: { not: excludeId } } : {}),
      },
      include: {
        images: { orderBy: { sortOrder: "asc" }, take: 2 },
        reviews: { select: { rating: true } },
        _count: { select: { reviews: true } },
      },
      take: limit,
      orderBy: { createdAt: "desc" },
    });

    return products.map((p) => {
      const ratings = p.reviews.map((r) => r.rating);
      const avg = ratings.length
        ? ratings.reduce((s, n) => s + n, 0) / ratings.length
        : 0;
      return {
        id: p.id,
        name: p.name,
        slug: p.slug,
        price: p.price,
        comparePrice: p.comparePrice,
        images: p.images.map((i) => ({ url: i.url, alt: i.alt })),
        stock: p.stock,
        isNew: p.isNew,
        fabric: p.fabric,
        avgRating: Number(avg.toFixed(1)),
        _count: { reviews: p._count.reviews },
      };
    });
  } catch (err) {
    console.warn("getProducts failed (DB likely not initialized):", (err as Error).message);
    return [];
  }
}

export async function getCategories() {
  try {
    return await db.category.findMany({
      where: { isActive: true, parentId: null },
      orderBy: { sortOrder: "asc" },
      include: { _count: { select: { products: true } } },
    });
  } catch {
    return [];
  }
}
