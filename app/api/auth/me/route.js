import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { getAuthFromCookies } from "@/lib/auth";
import User from "@/models/User";

export async function GET() {
  try {
    await dbConnect();

    const payload = await getAuthFromCookies();
    if (!payload?.userId) {
      return NextResponse.json({ success: true, user: null });
    }

    // Try DB first — fall back to token payload for demo users
    const dbUser = await User.findOne({ userId: payload.userId }).lean();

    const user = dbUser ?? {
      userId: payload.userId,
      email: payload.email,
      name: payload.name,   // ← FIXED: reads name from token
      role: payload.role,
    };

    return NextResponse.json({ success: true, user });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err?.message || "Failed to fetch user" },
      { status: 500 }
    );
  }
}