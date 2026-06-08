import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

const schema = z.object({
  order: z.array(z.string()),
});

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { order } = schema.parse(body);

    await db.$transaction(
      order.map((id, idx) =>
        db.heroSlide.update({ where: { id }, data: { sortOrder: idx } })
      )
    );

    revalidatePath("/");
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Slide reorder error:", error);
    return NextResponse.json({ error: "Failed to reorder slides" }, { status: 500 });
  }
}
