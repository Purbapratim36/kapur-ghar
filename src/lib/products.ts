import { db } from "@/lib/db";

/**
 * Fetch products for cards (home, listing, related). Returns empty array if DB
 * is unreachable or there are no products yet.
 */
export interface ProductCardData {
  id: string;
  name: string;
  slug: string;
  price: number;
  comparePrice: number | null;
  images: { url: string; alt: string | null }[];
  stock: number;
  isNew: boolean;
  isFeatured?: boolean;
  fabric: string | null;
  avgRating: number;
  _count: { reviews: number };
}

interface GetProductsOpts {
  limit?: number;
  featured?: boolean;
  isNew?: boolean;
  categorySlug?: string;
  excludeId?: string;
  // Filter values (typically from URL search params)
  fabric?: string;
  color?: string;
  occasion?: string;
  silkType?: string;
  priceBand?: string;
  sort?: string;
}

function priceBandToRange(band: string): { gte?: number; lte?: number } | null {
  switch (band) {
    case "Under ₹2,000":
      return { lte: 2000 };
    case "₹2,000 - ₹5,000":
      return { gte: 2000, lte: 5000 };
    case "₹5,000 - ₹10,000":
      return { gte: 5000, lte: 10000 };
    case "₹10,000 - ₹20,000":
      return { gte: 10000, lte: 20000 };
    case "Above ₹20,000":
      return { gte: 20000 };
    default:
      return null;
  }
}

export async function getProducts(opts: GetProductsOpts = {}): Promise<ProductCardData[]> {
  const {
    limit = 8,
    featured,
    isNew,
    categorySlug,
    excludeId,
    fabric,
    color,
    occasion,
    silkType,
    priceBand,
    sort = "newest",
  } = opts;

  const priceRange = priceBand ? priceBandToRange(priceBand) : null;

  // Build orderBy
  const orderBy =
    sort === "price-asc"
      ? { price: "asc" as const }
      : sort === "price-desc"
        ? { price: "desc" as const }
        : { createdAt: "desc" as const };

  try {
    const products = await db.product.findMany({
      where: {
        isActive: true,
        ...(featured ? { isFeatured: true } : {}),
        ...(isNew ? { isNew: true } : {}),
        ...(categorySlug ? { category: { slug: categorySlug } } : {}),
        ...(excludeId ? { id: { not: excludeId } } : {}),
        ...(fabric ? { fabric: { contains: fabric } } : {}),
        ...(color ? { color: { contains: color } } : {}),
        ...(occasion ? { occasion: { contains: occasion } } : {}),
        ...(silkType ? { silkType: { contains: silkType } } : {}),
        ...(priceRange ? { price: priceRange } : {}),
      },
      include: {
        images: { orderBy: { sortOrder: "asc" }, take: 2 },
        reviews: { select: { rating: true } },
        _count: { select: { reviews: true } },
      },
      take: limit,
      orderBy,
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
        isFeatured: p.isFeatured,
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
