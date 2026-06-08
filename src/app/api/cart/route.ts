import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ message: "Cart API - client-side state via Zustand" });
}
