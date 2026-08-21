import { NextResponse } from "next/server";

import dbConnect from "@/lib/db";
import { getAuthFromCookies } from "@/lib/auth";
import { calculateMatchScore } from "@/lib/matchScore";
import Mentor from "@/models/Mentor";
import User from "@/models/User";

const countryFlags = {
  USA: "🇺🇸",
  "United States": "🇺🇸",
  "United States of America": "🇺🇸",
  UK: "🇬🇧",
  "United Kingdom": "🇬🇧",
  Germany: "🇩🇪",
  India: "🇮🇳",
  Canada: "🇨🇦",
  Australia: "🇦🇺",
  Ireland: "🇮🇪",
};

export async function GET(req) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const countryRaw = searchParams.get("country");
    const fieldRaw = searchParams.get("field");

    const country = (countryRaw || "").trim();
    const field = (fieldRaw || "").trim();

    const query = {};
    if (country && country.toLowerCase() !== "all countries") {
      query.country = country;
    }
    if (field) {
      query.expertise = {
        $elemMatch: {
          $regex: field,
          $options: "i",
        },
      };
    }

    const mentors = await Mentor.find(query).lean();

    const payload = await getAuthFromCookies();
    let student = null;
    if (payload?.userId) {
      student = await User.findOne({ userId: payload.userId }).lean();
    }

    const enriched = mentors.map((m) => {
      const availableSlots = (m.sessions || []).filter((s) => !s.isBooked).length;
      const matchScore =
        student?.role === "student" ? calculateMatchScore(student, m) : null;

      return {
        ...m,
        availableSlots,
        matchScore,
      };
    });

    return NextResponse.json({ success: true, mentors: enriched });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err?.message || "Failed to fetch mentors" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
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

    const body = await req.json();
    const { name, country, university, avatarUrl, imageUrl } = body || {};

    const cleanName = String(name || "").trim();
    const cleanCountry = String(country || "").trim();
    const cleanUniversity = String(university || "").trim();
    const cleanAvatar = String(avatarUrl || imageUrl || "").trim();

    if (!cleanName || !cleanCountry) {
      return NextResponse.json(
        { success: false, error: "Name and Country are required" },
        { status: 400 }
      );
    }

    const mentorId = `mentor_${Date.now()}`;

    const mentor = await Mentor.create({
      mentorId,
      name: cleanName,
      country: cleanCountry,
      countryFlag: countryFlags[cleanCountry] || "",
      university: cleanUniversity || undefined,
      avatarUrl: cleanAvatar || undefined,
      degree: "",
      expertise: [cleanCountry],
      bio: "",
      isVerified: true,
      sessions: [],
    });

    return NextResponse.json({ success: true, mentor });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err?.message || "Failed to create mentor" },
      { status: 500 }
    );
  }
}
