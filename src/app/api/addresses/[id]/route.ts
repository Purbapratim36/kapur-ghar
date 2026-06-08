import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

const updateSchema = z.object({
  name: z.string().trim().min(2).max(60).optional(),
  phone: z.string().trim().regex(/^(\+?\d{10,15})$/).optional(),
  line1: z.string().trim().min(3).max(200).optional(),
  line2: z.string().trim().max(200).optional().or(z.literal("")).nullable(),
  city: z.string().trim().min(2).max(60).optional(),
  state: z.string().trim().min(2).max(60).optional(),
  pincode: z.string().trim().regex(/^\d{6}$/).optional(),
  landmark: z.string().trim().max(120).optional().or(z.literal("")).nullable(),
  isDefault: z.boolean().optional(),
});

async function getOwnedAddress(id: string, userId: string) {
  return db.address.findFirst({ where: { id, userId } });
}

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const owned = await getOwnedAddress(id, session.user.id);
  if (!owned) {
    return NextResponse.json({ error: "Address not found" }, { status: 404 });
  }

  try {
    const body = await req.json();
    const parsed = updateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid input" },
        { status: 400 }
      );
    }

    const data = parsed.data;
    if (data.isDefault) {
      await db.address.updateMany({
        where: { userId: session.user.id, NOT: { id } },
        data: { isDefault: false },
      });
    }

    const address = await db.address.update({
      where: { id },
      data: {
        ...data,
        line2: data.line2 === "" ? null : data.line2,
        landmark: data.landmark === "" ? null : data.landmark,
      },
    });

    return NextResponse.json({ address });
  } catch (error) {
    console.error("Address PATCH error:", error);
    return NextResponse.json({ error: "Failed to update address" }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const owned = await getOwnedAddress(id, session.user.id);
  if (!owned) {
    return NextResponse.json({ error: "Address not found" }, { status: 404 });
  }

  await db.address.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
