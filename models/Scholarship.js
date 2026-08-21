import mongoose from "mongoose";

const ScholarshipSchema = new mongoose.Schema(
  {
    scholarshipId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    country: { type: String, required: true },
    countryFlag: { type: String },
    degreeLevel: [{ type: String }],
    field: [{ type: String }],
    fundingType: { type: String },
    amount: { type: String },
    deadline: { type: String },
    eligibility: { type: String },
    officialLink: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.Scholarship ||
  mongoose.model("Scholarship", ScholarshipSchema);
