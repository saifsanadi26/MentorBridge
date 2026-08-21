import { NextResponse } from "next/server";

import dbConnect from "@/lib/db";
import { getAuthFromCookies } from "@/lib/auth";
import Mentor from "@/models/Mentor";
import User from "@/models/User";

function toDateKey(d) {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function getLastNDaysKeys(n) {
  const keys = [];
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  for (let i = n - 1; i >= 0; i -= 1) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    keys.push(toDateKey(d));
  }

  return keys;
}

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
    if (!user || user.role !== "mentor") {
      return NextResponse.json(
        { success: false, error: "Forbidden" },
        { status: 403 }
      );
    }

    if (!user.mentorProfile) {
      return NextResponse.json(
        { success: false, error: "Mentor profile not linked" },
        { status: 400 }
      );
    }

    const mentor = await Mentor.findOne({ mentorId: user.mentorProfile }).lean();
    if (!mentor) {
      return NextResponse.json(
        { success: false, error: "Mentor not found" },
        { status: 404 }
      );
    }

    const sessions = mentor.sessions || [];
    const totalSessions = sessions.length;
    const bookedSessions = sessions.filter((s) => s.isBooked).length;
    const availableSessions = totalSessions - bookedSessions;

    const days = 14;
    const keys = getLastNDaysKeys(days);

    const countsByDay = new Map(keys.map((k) => [k, 0]));

    for (const s of sessions) {
      if (!s.isBooked) continue;
      if (!s.bookedAt) continue;
      const d = new Date(s.bookedAt);
      const key = toDateKey(new Date(d.getFullYear(), d.getMonth(), d.getDate()));
      if (countsByDay.has(key)) {
        countsByDay.set(key, countsByDay.get(key) + 1);
      }
    }

    const bookingsOverTime = keys.map((k) => ({ date: k, count: countsByDay.get(k) }));

    return NextResponse.json({
      success: true,
      mentor: {
        mentorId: mentor.mentorId,
        name: mentor.name,
        country: mentor.country,
        countryFlag: mentor.countryFlag,
      },
      stats: {
        totalSessions,
        bookedSessions,
        availableSessions,
      },
      analytics: {
        bookingsOverTime,
      },
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err?.message || "Failed to load analytics" },
      { status: 500 }
    );
  }
}
