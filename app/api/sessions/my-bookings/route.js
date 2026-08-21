import { NextResponse } from "next/server";

import dbConnect from "@/lib/db";
import { getAuthFromCookies } from "@/lib/auth";
import User from "@/models/User";

export async function GET() {
  try {
    await dbConnect();

    const payload = await getAuthFromCookies();
    if (!payload?.userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = await User.findOne({ userId: payload.userId }).lean();
    if (!user || user.role !== "student") {
      return NextResponse.json(
        { success: false, error: "Only students can view bookings" },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      bookings: user.bookedSessions || [],
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err?.message || "Failed to fetch bookings" },
      { status: 500 }
    );
  }
}
