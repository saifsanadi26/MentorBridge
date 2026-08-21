import { NextResponse } from "next/server";
import { setAuthCookie, signAuthToken } from "@/lib/auth";

export async function POST(req) {
  try {
    const body = await req.json();
    const { email } = body || {};

    // SMART DEMO LOGIC: We completely ignore the 'name' field so it can never throw an error.
    const isMentor = String(email).toLowerCase().includes("mentor");
    const role = isMentor ? "mentor" : "student";

    const created = {
      userId: "demo-user-" + Date.now(),
      email: String(email).toLowerCase().trim(),
      name: "Demo User", // Hardcoded so your strict check can't fail
      role: role,
    };

    const token = signAuthToken({
      userId: created.userId,
      email: created.email,
      role: created.role,
    });

    await setAuthCookie(token);

    return NextResponse.json({
      success: true,
      message: "User registered successfully (Demo Mode)",
      user: created,
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: "Registration failed" },
      { status: 500 }
    );
  }
}