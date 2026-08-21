import mongoose from "mongoose";

const BookedSessionSchema = new mongoose.Schema(
  {
    sessionId: { type: String, required: true },
    mentorId: { type: String, required: true },
    mentorName: { type: String, required: true },
    mentorAvatar: { type: String },
    country: { type: String },
    university: { type: String },
    sessionDay: { type: String, required: true },
    sessionTime: { type: String, required: true },
    timezone: { type: String },
    meetLink: { type: String, required: true },
    bookedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const UserSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, unique: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    passwordHash: { type: String, required: true },
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50,
      match: /^[A-Za-z ]+$/,
    },
    role: {
      type: String,
      enum: ["student", "mentor", "admin"],
      required: true,
    },

    targetCountry: { type: String },
    targetField: { type: String },
    targetDegree: { type: String, enum: ["Bachelors", "Masters", "PhD"] },

    bookedSessions: [BookedSessionSchema],

    mentorProfile: { type: String },

    createdAt: { type: Date, default: Date.now },
    lastLogin: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", UserSchema);
