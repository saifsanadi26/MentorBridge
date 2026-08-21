import { NextResponse } from "next/server";
import { setAuthCookie, signAuthToken } from "@/lib/auth";

export async function POST(req) {
  try {
    const body = await req.json();
    // 👇 ADDED 'name' here so it grabs what the user actually types
    const { email, name } = body || {}; 

    const isMentor = String(email).toLowerCase().includes("mentor");
    const role = isMentor ? "mentor" : "student";

    const user = {
      userId: "demo-user-123",
      email: String(email).toLowerCase().trim(),
      // 👇 FIXED: Uses the real name if provided, otherwise falls back smoothly
      name: name || (isMentor ? "Demo Mentor" : "Demo Student"), 
      role: role,
      targetCountry: "USA",
      targetField: "Computer Science",
      targetDegree: "Masters",
    };

    const token = signAuthToken({
      userId: user.userId,
      email: user.email,
      name: user.name,   // ← FIXED: name now in token
      role: user.role,
    });

    await setAuthCookie(token);

    const redirectTo = role === "mentor" ? "/dashboard/mentor" : "/dashboard/student";

    return NextResponse.json({ success: true, user, redirectTo });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: "Login failed" },
      { status: 500 }
    );
  }
}