import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

const updateSchema = z.object({
  description: z.string().trim().max(200).nullable().optional(),
  type: z.enum(["percentage", "fixed"]).optional(),
  value: z.number().positive().optional(),
  minOrder: z.number().nonnegative().nullable().optional(),
  maxDiscount: z.number().positive().nullable().optional(),
  usageLimit: z.number().int().positive().nullable().optional(),
  isActive: z.boolean().optional(),
  expiresAt: z.string().datetime().nullable().optional(),
});

async function ensureAdmin() {
  const session = await auth();
  if (!session?.user) return { ok: false as const, status: 401, error: "Unauthorized" };
  if (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN") {
    return { ok: false as const, status: 403, error: "Admin access required" };
  }
  return { ok: true as const };
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
    const { expiresAt, ...rest } = parsed.data;
    const coupon = await db.coupon.update({
      where: { id },
      data: {
        ...rest,
        ...(expiresAt !== undefined
          ? { expiresAt: expiresAt ? new Date(expiresAt) : null }
          : {}),
      },
    });
    revalidatePath("/admin/coupons");
    return NextResponse.json({ coupon });
  } catch (error) {
    console.error("Coupon PATCH error:", error);
    return NextResponse.json({ error: "Failed to update coupon" }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  const gate = await ensureAdmin();
  if (!gate.ok) return NextResponse.json({ error: gate.error }, { status: gate.status });
  const { id } = await ctx.params;
  await db.coupon.delete({ where: { id } });
  revalidatePath("/admin/coupons");
  return NextResponse.json({ success: true });
}
