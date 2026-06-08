import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import slugify from "slugify";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

const productSchema = z.object({
  name: z.string().trim().min(2).max(160),
  description: z.string().trim().min(10),
  shortDesc: z.string().trim().max(280).nullable().optional(),
  price: z.number().positive(),
  comparePrice: z.number().positive().nullable().optional(),
  stock: z.number().int().min(0),
  sku: z.string().trim().nullable().optional(),
  categoryId: z.string(),
  fabric: z.string().nullable().optional(),
  color: z.string().nullable().optional(),
  occasion: z.string().nullable().optional(),
  silkType: z.string().nullable().optional(),
  weight: z.string().nullable().optional(),
  dimensions: z.string().nullable().optional(),
  careInstructions: z.string().nullable().optional(),
  isActive: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  isNew: z.boolean().optional(),
  images: z.array(z.string().url("Each image must be a valid URL")).max(10).optional(),
});

async function ensureAdmin() {
  const session = await auth();
  if (!session?.user) return { ok: false as const, status: 401, error: "Unauthorized" };
  if (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN") {
    return { ok: false as const, status: 403, error: "Admin access required" };
  }
  return { ok: true as const, session };
}

async function uniqueSlug(base: string) {
  const root = slugify(base, { lower: true, strict: true });
  let slug = root;
  let i = 1;
  // Ensure uniqueness
  while (await db.product.findUnique({ where: { slug } })) {
    slug = `${root}-${i++}`;
  }
  return slug;
}

export async function POST(req: NextRequest) {
  const gate = await ensureAdmin();
  if (!gate.ok) return NextResponse.json({ error: gate.error }, { status: gate.status });

  try {
    const body = await req.json();
    const parsed = productSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid input" },
        { status: 400 }
      );
    }
    const d = parsed.data;
    const slug = await uniqueSlug(d.name);
    const images = d.images || [];

    const product = await db.product.create({
      data: {
        name: d.name,
        slug,
        description: d.description,
        shortDesc: d.shortDesc ?? null,
        price: d.price,
        comparePrice: d.comparePrice ?? null,
        stock: d.stock,
        sku: d.sku ?? null,
        categoryId: d.categoryId,
        fabric: d.fabric ?? null,
        color: d.color ?? null,
        occasion: d.occasion ?? null,
        silkType: d.silkType ?? null,
        weight: d.weight ?? null,
        dimensions: d.dimensions ?? null,
        careInstructions: d.careInstructions ?? null,
        isActive: d.isActive ?? true,
        isFeatured: d.isFeatured ?? false,
        isNew: d.isNew ?? true,
        images: {
          create: images.map((url, i) => ({ url, sortOrder: i })),
        },
      },
    });

    return NextResponse.json({ product }, { status: 201 });
  } catch (error) {
    console.error("Admin product POST error:", error);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}

export async function GET() {
  const gate = await ensureAdmin();
  if (!gate.ok) return NextResponse.json({ error: gate.error }, { status: gate.status });

  const products = await db.product.findMany({
    include: {
      category: { select: { name: true } },
      images: { take: 1, orderBy: { sortOrder: "asc" } },
    },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ products });
}
