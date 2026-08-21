import { NextResponse } from "next/server";

import dbConnect from "@/lib/db";
import { getAuthFromCookies } from "@/lib/auth";
import Mentor from "@/models/Mentor";
import User from "@/models/User";

export async function POST() {
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
    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { success: false, error: "Forbidden" },
        { status: 403 }
      );
    }

    await Mentor.updateMany(
      {},
      {
        $set: {
          "sessions.$[].isBooked": false,
          "sessions.$[].menteeId": null,
          "sessions.$[].bookedAt": null,
        },
      }
    );

    await User.updateMany(
      { role: "student" },
      {
        $set: {
          bookedSessions: [],
        },
      }
    );

    return NextResponse.json({
      success: true,
      message: "All bookings have been reset successfully",
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err?.message || "Reset failed" },
      { status: 500 }
    );
  }
}
