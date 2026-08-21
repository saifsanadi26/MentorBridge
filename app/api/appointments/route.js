import { NextResponse } from "next/server";

// This is the handler for POST requests to /api/appointments
export async function POST(req) {
  try {
    const body = await req.json();
    const { mentorId, slot, date } = body;

    // This simulates a database save. 
    // In an interview, you'd say: "I built this as a stateless handler ready for MongoDB integration."
    console.log(`BATTLE PLAN: Booking confirmed for Mentor ${mentorId} on ${date} at ${slot}`);

    return NextResponse.json({ 
      success: true, 
      message: "Sync Complete. Session Secured." 
    });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ success: false, error: "Database Sync Failed" }, { status: 500 });
  }
}