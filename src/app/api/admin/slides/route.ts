import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

const slideSchema = z.object({
  type: z.enum(["image", "video"]),
  mediaUrl: z.string().url(),
  publicId: z.string().nullable().optional(),
  posterUrl: z.string().url().nullable().optional(),
  title: z.string().trim().max(120).nullable().optional(),
  subtitle: z.string().trim().max(120).nullable().optional(),
  description: z.string().trim().max(400).nullable().optional(),
  ctaText: z.string().trim().max(40).nullable().optional(),
  ctaLink: z.string().trim().max(400).nullable().optional(),
  textColor: z.enum(["white", "dark"]).optional(),
  alignment: z.enum(["left", "center", "right"]).optional(),
  overlayLevel: z.enum(["none", "light", "medium", "strong"]).optional(),
  isActive: z.boolean().optional(),
});

async function ensureAdmin() {
  const session = await auth();
  if (!session?.user) return { ok: false as const, status: 401, error: "Unauthorized" };
  if (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN") {
    return { ok: false as const, status: 403, error: "Admin access required" };
  }
  return { ok: true as const, session };
}

export async function GET() {
  const gate = await ensureAdmin();
  if (!gate.ok) return NextResponse.json({ error: gate.error }, { status: gate.status });

  const slides = await db.heroSlide.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });
  return NextResponse.json({ slides });
}

export async function POST(req: NextRequest) {
  const gate = await ensureAdmin();
  if (!gate.ok) return NextResponse.json({ error: gate.error }, { status: gate.status });

  try {
    const body = await req.json();
    const parsed = slideSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid input" },
        { status: 400 }
      );
    }

    // Next sortOrder = current max + 1
    const last = await db.heroSlide.findFirst({
      orderBy: { sortOrder: "desc" },
      select: { sortOrder: true },
    });
    const sortOrder = (last?.sortOrder ?? -1) + 1;

    const slide = await db.heroSlide.create({
      data: {
        ...parsed.data,
        sortOrder,
        isActive: parsed.data.isActive ?? true,
      },
    });

    revalidatePath("/");
    return NextResponse.json({ slide }, { status: 201 });
  } catch (error) {
    console.error("Slide POST error:", error);
    return NextResponse.json({ error: "Failed to create slide" }, { status: 500 });
  }
}
