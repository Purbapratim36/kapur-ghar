import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const category = searchParams.get("category");
    const fabric = searchParams.get("fabric");
    const color = searchParams.get("color");
    const occasion = searchParams.get("occasion");
    const silkType = searchParams.get("silkType");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const sort = searchParams.get("sort") || "newest";
    const search = searchParams.get("search");

    const where: Record<string, unknown> = { isActive: true };

    if (category) where.category = { slug: category };
    if (fabric) where.fabric = { contains: fabric };
    if (color) where.color = { contains: color };
    if (occasion) where.occasion = { contains: occasion };
    if (silkType) where.silkType = { contains: silkType };
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) (where.price as Record<string, unknown>).gte = parseFloat(minPrice);
      if (maxPrice) (where.price as Record<string, unknown>).lte = parseFloat(maxPrice);
    }
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
        { fabric: { contains: search } },
      ];
    }

    const orderBy = (() => {
      switch (sort) {
        case "price-asc": return { price: "asc" as const };
        case "price-desc": return { price: "desc" as const };
        case "popular": return { createdAt: "desc" as const };
        default: return { createdAt: "desc" as const };
      }
    })();

    const [products, total] = await Promise.all([
      db.product.findMany({
        where,
        include: {
          images: { orderBy: { sortOrder: "asc" }, take: 2 },
          category: { select: { name: true, slug: true } },
          _count: { select: { reviews: true } },
        },
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
      }),
      db.product.count({ where }),
    ]);

    return NextResponse.json({
      products,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Products API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
