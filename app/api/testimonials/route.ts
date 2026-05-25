import { NextResponse } from "next/server";
import { testimonials } from "@/lib/data/testimonialsData";

export async function GET() {
  return NextResponse.json(testimonials);
}
