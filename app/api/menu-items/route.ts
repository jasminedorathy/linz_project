import { NextResponse } from "next/server";
import { menuItems } from "@/lib/data/menuData";

export async function GET() {
  return NextResponse.json(menuItems);
}
