import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import slugify from "slugify";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

const createSchema = z.object({
  name: z.string().trim().min(2).max(80),
  description: z.string().trim().max(500).optional().nullable(),
  tagline: z.string().trim().max(80).optional().nullable(),
  coverImage: z.string().url().optional().nullable(),
  bannerImage: z.string().url().optional().nullable(),
  sortOrder: z.number().int().optional(),
  isActive: z.boolean().optional(),
});

async function ensureAdmin() {
  const session = await auth();
  if (!session?.user) return { ok: false as const, status: 401, error: "Unauthorized" };
  if (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN") {
    return { ok: false as const, status: 403, error: "Admin access required" };
  }
  return { ok: true as const };
}

export async function GET() {
  const gate = await ensureAdmin();
  if (!gate.ok) return NextResponse.json({ error: gate.error }, { status: gate.status });

  const categories = await db.category.findMany({
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    include: { _count: { select: { products: true } } },
  });
  return NextResponse.json({ categories });
}

export async function POST(req: NextRequest) {
  const gate = await ensureAdmin();
  if (!gate.ok) return NextResponse.json({ error: gate.error }, { status: gate.status });

  try {
    const body = await req.json();
    const parsed = createSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid input" },
        { status: 400 }
      );
    }
    const d = parsed.data;
    let slug = slugify(d.name, { lower: true, strict: true });
    let i = 1;
    while (await db.category.findUnique({ where: { slug } })) {
      slug = `${slug}-${i++}`;
    }

    const category = await db.category.create({
      data: {
        name: d.name,
        slug,
        description: d.description ?? null,
        tagline: d.tagline ?? null,
        coverImage: d.coverImage ?? null,
        bannerImage: d.bannerImage ?? null,
        sortOrder: d.sortOrder ?? 0,
        isActive: d.isActive ?? true,
      },
    });
    revalidatePath("/");
    revalidatePath(`/categories/${slug}`);
    return NextResponse.json({ category }, { status: 201 });
  } catch (error) {
    console.error("Category POST error:", error);
    return NextResponse.json({ error: "Failed to create category" }, { status: 500 });
  }
}
