import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    message: "Linz Baking Backend (Next.js APIs) is running 🍰",
  });
}
