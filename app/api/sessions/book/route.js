import { NextResponse } from "next/server";

import dbConnect from "@/lib/db";
import { getAuthFromCookies } from "@/lib/auth";
import { UNIVERSAL_MEET_LINK } from "@/lib/constants";
import Mentor from "@/models/Mentor";
import User from "@/models/User";

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

    const body = await req.json();
    const { mentorId, sessionId, userId } = body || {};

    if (userId && userId !== payload.userId) {
      return NextResponse.json(
        { success: false, error: "Forbidden" },
        { status: 403 }
      );
    }

    if (!mentorId || !sessionId) {
      return NextResponse.json(
        { success: false, error: "mentorId and sessionId are required" },
        { status: 400 }
      );
    }

    const user = await User.findOne({ userId: payload.userId }).lean();
    if (!user || user.role !== "student") {
      return NextResponse.json(
        { success: false, error: "Only students can book sessions" },
        { status: 403 }
      );
    }

    const mentor = await Mentor.findOneAndUpdate(
      {
        mentorId,
        "sessions.sessionId": sessionId,
        "sessions.isBooked": false,
      },
      {
        $set: {
          "sessions.$.isBooked": true,
          "sessions.$.menteeId": payload.userId,
          "sessions.$.bookedAt": new Date(),
        },
      },
      { new: true }
    );

    if (!mentor) {
      return NextResponse.json(
        {
          success: false,
          error: "This session is already booked or does not exist",
        },
        { status: 400 }
      );
    }

    const bookedSession = (mentor.sessions || []).find(
      (s) => s.sessionId === sessionId
    );

    if (!bookedSession) {
      return NextResponse.json(
        { success: false, error: "Session not found after booking" },
        { status: 500 }
      );
    }

    await User.findOneAndUpdate(
      { userId: payload.userId },
      {
        $push: {
          bookedSessions: {
            sessionId,
            mentorId: mentor.mentorId,
            mentorName: mentor.name,
            mentorAvatar: mentor.avatarUrl,
            country: mentor.country,
            university: mentor.university,
            sessionDay: bookedSession.day,
            sessionTime: bookedSession.time,
            timezone: bookedSession.timezone,
            meetLink: UNIVERSAL_MEET_LINK,
            bookedAt: new Date(),
          },
        },
      }
    );

    return NextResponse.json({
      success: true,
      message: "Session booked successfully!",
      booking: {
        mentorName: mentor.name,
        sessionTime: `${bookedSession.day}, ${bookedSession.time}`,
        meetLink: UNIVERSAL_MEET_LINK,
      },
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err?.message || "Booking failed" },
      { status: 500 }
    );
  }
}
