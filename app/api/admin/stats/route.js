import { NextResponse } from "next/server";

import dbConnect from "@/lib/db";
import { getAuthFromCookies } from "@/lib/auth";
import Mentor from "@/models/Mentor";
import User from "@/models/User";

const topDestinations = [
  { country: "Germany", flag: "🇩🇪", count: 45 },
  { country: "USA", flag: "🇺🇸", count: 30 },
  { country: "UK", flag: "🇬🇧", count: 15 },
  { country: "Canada", flag: "🇨🇦", count: 10 },
];

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
    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { success: false, error: "Forbidden" },
        { status: 403 }
      );
    }

    const totalUsers = await User.countDocuments();
    const activeMentors = await Mentor.countDocuments({ isVerified: true });

    const mentors = await Mentor.find({}, { sessions: 1 }).lean();
    const totalSessions = mentors.reduce(
      (acc, m) => acc + (m.sessions ? m.sessions.length : 0),
      0
    );
    const bookedSessions = mentors.reduce(
      (acc, m) =>
        acc + (m.sessions ? m.sessions.filter((s) => s.isBooked).length : 0),
      0
    );

    return NextResponse.json({
      success: true,
      stats: {
        totalUsers,
        activeMentors,
        totalSessions,
        bookedSessions,
        topDestinations,
      },
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err?.message || "Failed to load stats" },
      { status: 500 }
    );
  }
}
