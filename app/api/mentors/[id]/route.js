import { NextResponse } from "next/server";

import dbConnect from "@/lib/db";
import { getAuthFromCookies } from "@/lib/auth";
import { calculateMatchScore } from "@/lib/matchScore";
import Mentor from "@/models/Mentor";
import User from "@/models/User";

export async function GET(_req, { params }) {
  try {
    await dbConnect();

    const mentorId = params?.id;
    const mentor = await Mentor.findOne({ mentorId }).lean();

    if (!mentor) {
      return NextResponse.json(
        { success: false, error: "Mentor not found" },
        { status: 404 }
      );
    }

    const availableSlots = (mentor.sessions || []).filter((s) => !s.isBooked).length;

    const payload = await getAuthFromCookies();
    let matchScore = null;
    if (payload?.userId) {
      const student = await User.findOne({ userId: payload.userId }).lean();
      if (student?.role === "student") {
        matchScore = calculateMatchScore(student, mentor);
      }
    }

    return NextResponse.json({
      success: true,
      mentor: {
        ...mentor,
        availableSlots,
        matchScore,
      },
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err?.message || "Failed to fetch mentor" },
      { status: 500 }
    );
  }
}
