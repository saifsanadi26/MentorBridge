import mongoose from "mongoose";

const StorySchema = new mongoose.Schema(
  {
    storyId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    imageUrl: { type: String },
    background: { type: String },
    targetCountry: { type: String },
    countryFlag: { type: String },
    targetProgram: { type: String },
    mentorHelpedWith: [{ type: String }],
    result: { type: String },
    story: { type: String },
    mentorCountry: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.Story || mongoose.model("Story", StorySchema);
