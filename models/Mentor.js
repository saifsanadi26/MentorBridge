import mongoose from "mongoose";

const SessionSchema = new mongoose.Schema(
  {
    sessionId: { type: String, required: true },
    day: { type: String, required: true },
    time: { type: String, required: true },
    timezone: { type: String, required: true },
    isBooked: { type: Boolean, default: false },
    menteeId: { type: String, default: null },
    bookedAt: { type: Date },
  },
  { _id: false }
);

const MentorSchema = new mongoose.Schema(
  {
    mentorId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    avatarUrl: { type: String },
    country: { type: String, required: true },
    countryFlag: { type: String },
    university: { type: String },
    degree: { type: String },
    expertise: [{ type: String }],
    bio: { type: String },
    badges: [{ type: String }],
    currentStudies: { type: String },
    academicBackground: { type: String },
    scholarships: [{ type: String }],
    activities: [{ type: String }],
    futurePlans: { type: String },
    isVerified: { type: Boolean, default: false },
    sessions: [SessionSchema],
  },
  { timestamps: true }
);

export default mongoose.models.Mentor || mongoose.model("Mentor", MentorSchema);
