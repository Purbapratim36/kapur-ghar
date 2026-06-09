import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

const couponSchema = z.object({
  code: z.string().trim().min(3).max(40).toUpperCase(),
  description: z.string().trim().max(200).nullable().optional(),
  type: z.enum(["percentage", "fixed"]).default("percentage"),
  value: z.number().positive(),
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

export async function GET() {
  const gate = await ensureAdmin();
  if (!gate.ok) return NextResponse.json({ error: gate.error }, { status: gate.status });
  const coupons = await db.coupon.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json({ coupons });
}

export async function POST(req: NextRequest) {
  const gate = await ensureAdmin();
  if (!gate.ok) return NextResponse.json({ error: gate.error }, { status: gate.status });

  try {
    const body = await req.json();
    const parsed = couponSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid input" },
        { status: 400 }
      );
    }
    const d = parsed.data;
    const existing = await db.coupon.findUnique({ where: { code: d.code } });
    if (existing) {
      return NextResponse.json(
        { error: "A coupon with this code already exists" },
        { status: 409 }
      );
    }
    const coupon = await db.coupon.create({
      data: {
        code: d.code,
        description: d.description ?? null,
        type: d.type,
        value: d.value,
        minOrder: d.minOrder ?? null,
        maxDiscount: d.maxDiscount ?? null,
        usageLimit: d.usageLimit ?? null,
        isActive: d.isActive ?? true,
        expiresAt: d.expiresAt ? new Date(d.expiresAt) : null,
      },
    });
    revalidatePath("/admin/coupons");
    return NextResponse.json({ coupon }, { status: 201 });
  } catch (error) {
    console.error("Coupon POST error:", error);
    return NextResponse.json({ error: "Failed to create coupon" }, { status: 500 });
  }
}
