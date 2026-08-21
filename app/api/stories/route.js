import { NextResponse } from "next/server";

import dbConnect from "@/lib/db";
import { getAuthFromCookies } from "@/lib/auth";
import Story from "@/models/Story";
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

export async function GET() {
  try {
    await dbConnect();
    const stories = await Story.find({}).lean();
    return NextResponse.json({ success: true, stories });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err?.message || "Failed to fetch stories" },
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
    const {
      studentName,
      name,
      targetCountry,
      country,
      targetUniversityCountry,
      target,
      quote,
      successQuote,
      studentImageUrl,
      imageUrl,
    } = body || {};

    const cleanName = String(studentName || name || "").trim();
    const rawTarget = String(targetUniversityCountry || targetCountry || country || target || "").trim();
    const cleanQuote = String(successQuote || quote || "").trim();
    const cleanImageUrl = String(studentImageUrl || imageUrl || "").trim();

    let cleanCountry = rawTarget;
    let cleanProgram = "";

    const separators = ["/", "|", ",", "-"]; // University / Country
    const sep = separators.find((s) => rawTarget.includes(s));
    if (sep) {
      const parts = rawTarget
        .split(sep)
        .map((p) => p.trim())
        .filter(Boolean);
      if (parts.length >= 2) {
        const maybeCountry = parts[parts.length - 1];
        const maybeProgram = parts.slice(0, -1).join(" ");
        if (countryFlags[maybeCountry]) {
          cleanCountry = maybeCountry;
          cleanProgram = maybeProgram;
        }
      }
    }

    if (!cleanName || !cleanCountry || !cleanQuote) {
      return NextResponse.json(
        {
          success: false,
          error: "Student Name, Target Country, and Quote are required",
        },
        { status: 400 }
      );
    }

    const storyId = `story_${Date.now()}`;
    const created = await Story.create({
      storyId,
      name: cleanName,
      targetCountry: cleanCountry,
      countryFlag: countryFlags[cleanCountry] || "",
      targetProgram: cleanProgram,
      imageUrl: cleanImageUrl,
      story: cleanQuote,
      result: "Added via Admin CMS",
      mentorHelpedWith: [],
    });

    return NextResponse.json({ success: true, story: created });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err?.message || "Failed to create story" },
      { status: 500 }
    );
  }
}
