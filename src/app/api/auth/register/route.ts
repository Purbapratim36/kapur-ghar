import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { sendMail, welcomeEmail } from "@/lib/mail";

const registerSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(60),
  email: z.string().trim().toLowerCase().email("Invalid email address"),
  phone: z
    .string()
    .trim()
    .regex(/^(\+?\d{10,15})$/, "Phone must be 10–15 digits, optionally starting with +"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password too long"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid input" },
        { status: 400 }
      );
    }

    const { name, email, phone, password } = parsed.data;

    // Normalize phone: strip leading + and country code logic done at validation
    const normalizedPhone = phone.replace(/\s/g, "");

    // Check uniqueness for both email and phone
    const existing = await db.user.findFirst({
      where: {
        OR: [{ email }, { phone: normalizedPhone }],
      },
      select: { email: true, phone: true },
    });

    if (existing) {
      if (existing.email === email) {
        return NextResponse.json(
          { error: "An account with this email already exists" },
          { status: 409 }
        );
      }
      return NextResponse.json(
        { error: "An account with this phone number already exists" },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await db.user.create({
      data: {
        name,
        email,
        phone: normalizedPhone,
        password: passwordHash,
        role: "USER",
      },
      select: { id: true, name: true, email: true },
    });

    // Fire welcome email (best-effort, never blocks the response)
    sendMail({
      to: user.email,
      subject: "Welcome to Kapur Ghar 🪷",
      html: welcomeEmail(user.name),
    }).catch(() => {});

    return NextResponse.json(
      { message: "Account created successfully", user },
      { status: 201 }
    );
  } catch (error) {
    console.error("Register API error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
