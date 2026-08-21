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

function fillSeries(keys, rows, valueField) {
  const map = new Map(rows.map((r) => [r._id, r[valueField] ?? 0]));
  return keys.map((k) => ({ date: k, count: map.get(k) ?? 0 }));
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

    const days = 14;
    const keys = getLastNDaysKeys(days);
    const start = new Date(keys[0]);

    const userGrowthRows = await User.aggregate([
      { $match: { createdAt: { $gte: start } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const bookingRows = await Mentor.aggregate([
      { $unwind: "$sessions" },
      {
        $match: {
          "sessions.isBooked": true,
          "sessions.bookedAt": { $gte: start },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$sessions.bookedAt",
            },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const popularMentors = await Mentor.aggregate([
      { $unwind: "$sessions" },
      { $match: { "sessions.isBooked": true } },
      {
        $group: {
          _id: "$mentorId",
          name: { $first: "$name" },
          country: { $first: "$country" },
          countryFlag: { $first: "$countryFlag" },
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]);

    const bookingsByCountry = await Mentor.aggregate([
      { $unwind: "$sessions" },
      { $match: { "sessions.isBooked": true } },
      {
        $group: {
          _id: "$country",
          countryFlag: { $first: "$countryFlag" },
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    return NextResponse.json({
      success: true,
      stats: {
        totalUsers,
        activeMentors,
        totalSessions,
        bookedSessions,
      },
      analytics: {
        userGrowth: fillSeries(keys, userGrowthRows, "count"),
        bookingsOverTime: fillSeries(keys, bookingRows, "count"),
        popularMentors: popularMentors.map((m) => ({
          mentorId: m._id,
          name: m.name,
          country: m.country,
          countryFlag: m.countryFlag,
          count: m.count,
        })),
        bookingsByCountry: bookingsByCountry.map((c) => ({
          country: c._id,
          flag: c.countryFlag,
          count: c.count,
        })),
      },
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err?.message || "Failed to load analytics" },
      { status: 500 }
    );
  }
}
