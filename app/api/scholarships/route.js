import { NextResponse } from "next/server";

import dbConnect from "@/lib/db";
import Scholarship from "@/models/Scholarship";

export async function GET(req) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const country = searchParams.get("country");
    const degree = searchParams.get("degree");
    const fundingType = searchParams.get("fundingType");

    const query = {};
    if (country) query.country = country;
    if (fundingType) query.fundingType = fundingType;
    if (degree) query.degreeLevel = { $in: [degree] };

    const scholarships = await Scholarship.find(query).lean();
    return NextResponse.json({ success: true, scholarships });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err?.message || "Failed to fetch scholarships" },
      { status: 500 }
    );
  }
}
