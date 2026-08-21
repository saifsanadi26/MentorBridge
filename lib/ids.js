import User from "@/models/User";

export async function generateNextUserId() {
  const last = await User.findOne({}, { userId: 1 }).sort({ userId: -1 }).lean();

  if (!last?.userId) return "user_001";

  const match = /^user_(\d+)$/.exec(last.userId);
  const lastNum = match ? Number(match[1]) : 0;
  const nextNum = lastNum + 1;

  return `user_${String(nextNum).padStart(3, "0")}`;
}
