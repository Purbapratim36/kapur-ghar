import { db } from "@/lib/db";

export interface CategoryCard {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  tagline: string | null;
  coverImage: string | null;
  productCount: number;
  // First N product images in this category — used for the rotating slideshow cover
  productImages: string[];
}

/**
 * Fetch top-level categories with a sample of product images for slideshow covers.
 * Returns an empty array if DB is unreachable.
 */
export async function getHomeCategories(limit = 6): Promise<CategoryCard[]> {
  try {
    const categories = await db.category.findMany({
      where: { isActive: true, parentId: null },
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      take: limit,
      include: {
        _count: { select: { products: { where: { isActive: true } } } },
        products: {
          where: { isActive: true },
          orderBy: { createdAt: "desc" },
          take: 4,
          include: {
            images: { orderBy: { sortOrder: "asc" }, take: 1 },
          },
        },
      },
    });

    return categories.map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      description: c.description,
      tagline: c.tagline,
      coverImage: c.coverImage,
      productCount: c._count.products,
      productImages: c.products
        .map((p) => p.images[0]?.url)
        .filter((url): url is string => Boolean(url)),
    }));
  } catch (err) {
    console.warn("getHomeCategories failed:", (err as Error).message);
    return [];
  }
}
