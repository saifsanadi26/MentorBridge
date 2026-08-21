import { redirect } from "next/navigation";

import dbConnect from "@/lib/db";
import { getAuthFromCookies } from "@/lib/auth";
import User from "@/models/User";

export async function requireUser({ roles, redirectTo = "/login" } = {}) {
  const payload = await getAuthFromCookies();

  if (!payload?.userId) {
    redirect(redirectTo);
  }

  await dbConnect();
  const user = await User.findOne({ userId: payload.userId }).lean();

  if (!user) {
    redirect(redirectTo);
  }

  if (roles && Array.isArray(roles) && roles.length > 0) {
    if (!roles.includes(user.role)) {
      redirect("/");
    }
  }

  return user;
}
