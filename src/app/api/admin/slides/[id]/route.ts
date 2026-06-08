import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

const updateSchema = z.object({
  type: z.enum(["image", "video"]).optional(),
  mediaUrl: z.string().url().optional(),
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
  sortOrder: z.number().int().min(0).optional(),
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

export async function PATCH(
  req: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  const gate = await ensureAdmin();
  if (!gate.ok) return NextResponse.json({ error: gate.error }, { status: gate.status });

  const { id } = await ctx.params;
  try {
    const body = await req.json();
    const parsed = updateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid input" },
        { status: 400 }
      );
    }

    const slide = await db.heroSlide.update({
      where: { id },
      data: parsed.data,
    });

    revalidatePath("/");
    return NextResponse.json({ slide });
  } catch (error) {
    console.error("Slide PATCH error:", error);
    return NextResponse.json({ error: "Failed to update slide" }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  const gate = await ensureAdmin();
  if (!gate.ok) return NextResponse.json({ error: gate.error }, { status: gate.status });

  const { id } = await ctx.params;
  try {
    await db.heroSlide.delete({ where: { id } });
    revalidatePath("/");
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Slide DELETE error:", error);
    return NextResponse.json({ error: "Failed to delete slide" }, { status: 500 });
  }
}
