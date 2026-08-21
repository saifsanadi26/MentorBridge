// ============================================================
//  MentorBridge — THE ULTIMATE MASTER SEED SCRIPT
//  Run: node seed.js
// ============================================================

const fs = require("fs");
const path = require("path");

// ── 1. LOAD ENVIRONMENT VARIABLES ──
function loadEnvLocal() {
  try {
    const envPath = path.join(process.cwd(), ".env.local");
    if (!fs.existsSync(envPath)) return;

    const content = fs.readFileSync(envPath, "utf8");
    const lines = content.split(/\r?\n/);

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;
      if (trimmed.startsWith("#")) continue;

      const idx = trimmed.indexOf("=");
      if (idx === -1) continue;

      const key = trimmed.slice(0, idx).trim();
      let val = trimmed.slice(idx + 1).trim();

      if (
        (val.startsWith('"') && val.endsWith('"')) ||
        (val.startsWith("'") && val.endsWith("'"))
      ) {
        val = val.slice(1, -1);
      }

      if (!process.env[key]) process.env[key] = val;
    }
  } catch {
    // ignore
  }
}

loadEnvLocal();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("❌ Missing MONGODB_URI in .env.local");
}

// ── 2. MONGOOSE SCHEMAS ──
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
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    name: { type: String, required: true, trim: true },
    role: { type: String, enum: ["student", "mentor", "admin"], required: true },
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
    meetLink: { type: String },
    sessions: [SessionSchema],
  },
  { timestamps: true }
);

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

const StorySchema = new mongoose.Schema(
  {
    storyId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
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

const User = mongoose.models.User || mongoose.model("User", UserSchema);
const Mentor = mongoose.models.Mentor || mongoose.model("Mentor", MentorSchema);
const Scholarship = mongoose.models.Scholarship || mongoose.model("Scholarship", ScholarshipSchema);
const Story = mongoose.models.Story || mongoose.model("Story", StorySchema);

// ── 3. FULL UNCUT MENTOR DATABASE (16 MENTORS) ──
const mentorsData = [
  { 
    mentorId: "mentor_barca", 
    name: "Mateo Garcia", 
    avatarUrl: "https://randomuser.me/api/portraits/men/33.jpg", 
    country: "Spain", 
    countryFlag: "🇪🇸", 
    university: "FC Barcelona", 
    degree: "Director of Football Analytics", 
    expertise: ["Spain", "Data Analytics", "Sports Tech"], 
    bio: "I lead the data analytics division at FC Barcelona. If your goal is to break into European football as a technical director or data scientist, I can show you the exact portfolio required.", 
    badges: ["FCB Staff", "Sports Analytics Pro"], 
    academicBackground: "B.Sc Mathematics & Computer Science.", 
    currentStudies: "Lead Data Scientist at FC Barcelona.", 
    futurePlans: "Head of Global Scouting Analytics.", 
    isVerified: true, 
    activities: ["Portfolio Review", "Tech Interview Prep"], 
    scholarships: ["Club Sponsored"], 
    meetLink: "https://meet.jit.si/MentorBridge-mentor_barca", 
    sessions: [
      { sessionId: "mb_s1", day: "Friday", time: "16:00-16:30", timezone: "Europe/Madrid", isBooked: false }
    ] 
  },
  { 
    mentorId: "mentor_01", 
    name: "Aarav Mehta", 
    avatarUrl: "https://randomuser.me/api/portraits/men/11.jpg", 
    country: "Germany", 
    countryFlag: "🇩🇪", 
    university: "TU Munich", 
    degree: "MS Computer Science", 
    expertise: ["Germany", "CS", "Public Universities"], 
    bio: "I help students realistically shortlist German public universities and navigate the APS process. I've been through the APS maze, survived two German winters on an €861 stipend, and landed a research HiWi at TU Munich.", 
    badges: ["DAAD Scholar", "Public Uni Specialist"], 
    academicBackground: "B.Tech in Computer Engineering. Strong emphasis on fundamentals.", 
    currentStudies: "MS Computer Science at TU Munich (focus: distributed systems & ML systems).", 
    futurePlans: "Working as a software engineer in Germany.", 
    isVerified: true, 
    activities: ["Reviewing SOPs and shortlists weekly", "Helping with APS timelines"], 
    scholarships: ["DAAD scholarship strategy guidance", "Profile-based shortlist"], 
    meetLink: "https://meet.jit.si/MentorBridge-mentor_01", 
    sessions: [
      { sessionId: "m01_s1", day: "Monday", time: "07:00-07:30", timezone: "Europe/Berlin", isBooked: false }, 
      { sessionId: "m01_s2", day: "Monday", time: "18:00-18:30", timezone: "Europe/Berlin", isBooked: false }
    ] 
  },
  { 
    mentorId: "mentor_02", 
    name: "Ritika Sharma", 
    avatarUrl: "https://randomuser.me/api/portraits/women/55.jpg", 
    country: "USA", 
    countryFlag: "🇺🇸", 
    university: "Arizona State University", 
    degree: "MS Data Science", 
    expertise: ["USA", "Data Science", "GRE"], 
    bio: "I guide students on US admissions and GRE strategy. Navigating the tech job market in the US requires extreme precision. I'll help you craft a profile that stands out to both admissions committees and future tech recruiters.", 
    badges: ["TA", "Top 2% Admit"], 
    academicBackground: "CS graduate with a focus on data foundations.", 
    currentStudies: "MS Data Science at ASU, working on applied ML projects.", 
    futurePlans: "Transition into product analytics roles.", 
    isVerified: true, 
    activities: ["Mock interviews for US admits", "GRE strategy"], 
    scholarships: ["University scholarship planning", "SOP narrative for Data/ML"], 
    meetLink: "https://meet.jit.si/MentorBridge-mentor_02", 
    sessions: [
      { sessionId: "m02_s1", day: "Monday", time: "07:00-07:30", timezone: "America/Phoenix", isBooked: false }, 
      { sessionId: "m02_s2", day: "Tuesday", time: "18:00-18:30", timezone: "America/Phoenix", isBooked: false }
    ] 
  },
  { 
    mentorId: "mentor_03", 
    name: "Kunal Verma", 
    avatarUrl: "https://randomuser.me/api/portraits/men/32.jpg", 
    country: "Canada", 
    countryFlag: "🇨🇦", 
    university: "University of Toronto", 
    degree: "MS Artificial Intelligence", 
    expertise: ["AI", "Canada", "Research"], 
    bio: "Focused on research-oriented AI programs and academic profile building. Canada's PR pathway is great, but getting into a top-tier research program requires a specific kind of academic narrative. I can help you build that.", 
    badges: ["Research Pro"], 
    academicBackground: "B.Tech CS from IIT Delhi.", 
    currentStudies: "MS in Applied Computing (AI Concentration).", 
    futurePlans: "AI Researcher at Google DeepMind Toronto.", 
    isVerified: true, 
    activities: ["Research Paper Guidance"], 
    scholarships: ["Ontario Graduate Scholarship"], 
    meetLink: "https://meet.jit.si/MentorBridge-mentor_03", 
    sessions: [
      { sessionId: "m03_s1", day: "Monday", time: "07:00-07:30", timezone: "America/Toronto", isBooked: false }, 
      { sessionId: "m03_s2", day: "Wednesday", time: "18:00-18:30", timezone: "America/Toronto", isBooked: false }
    ] 
  },
  { 
    mentorId: "mentor_04", 
    name: "Maanya", 
    avatarUrl: "https://randomuser.me/api/portraits/women/31.jpg", 
    country: "UK", 
    countryFlag: "🇬🇧", 
    university: "University of Manchester", 
    degree: "MS Business Analytics", 
    expertise: ["UK", "Analytics", "SOP"], 
    bio: "I help students craft strong SOPs and select analytics programs in the UK. The 1-year master's goes by in a flash. I'll teach you how to start applying for roles the moment you land so you don't miss the cycle.", 
    badges: ["Salutatorian", "95% Merit Scholarship"], 
    academicBackground: "Top-ranked undergraduate with a strong academic record.", 
    currentStudies: "MS Business Analytics at the University of Manchester.", 
    futurePlans: "Work in the UK as a data analyst/BI consultant.", 
    isVerified: true, 
    activities: ["Leading student analytics club workshops"], 
    scholarships: ["Merit scholarship applications", "UK university shortlist"], 
    meetLink: "https://meet.jit.si/MentorBridge-mentor_04", 
    sessions: [
      { sessionId: "m04_s1", day: "Monday", time: "09:00-09:30", timezone: "Europe/London", isBooked: false }, 
      { sessionId: "m04_s2", day: "Tuesday", time: "19:00-19:30", timezone: "Europe/London", isBooked: false }
    ] 
  },
  { 
    mentorId: "mentor_05", 
    name: "Siddharth Jain", 
    avatarUrl: "https://randomuser.me/api/portraits/men/41.jpg", 
    country: "Germany", 
    countryFlag: "🇩🇪", 
    university: "RWTH Aachen", 
    degree: "MS Mechanical Engineering", 
    expertise: ["Germany", "Mechanical", "APS"], 
    bio: "I guide mechanical engineering students through German applications and the APS process. RWTH Aachen is highly competitive, but with the right motivation letter and language prep, it's highly attainable.", 
    badges: ["Auto Expert"], 
    academicBackground: "B.Tech Mechanical (Gold Medalist).", 
    currentStudies: "MSc Production Engineering at RWTH.", 
    futurePlans: "R&D Engineer at Porsche.", 
    isVerified: true, 
    activities: ["German Language Tips", "APS Checklist"], 
    scholarships: ["Deutschlandstipendium"], 
    meetLink: "https://meet.jit.si/MentorBridge-mentor_05", 
    sessions: [
      { sessionId: "m05_s1", day: "Monday", time: "09:00-09:30", timezone: "Europe/Berlin", isBooked: false }, 
      { sessionId: "m05_s2", day: "Wednesday", time: "19:00-19:30", timezone: "Europe/Berlin", isBooked: false }
    ] 
  },
  { 
    mentorId: "mentor_06", 
    name: "Ananya Iyer", 
    avatarUrl: "https://randomuser.me/api/portraits/women/24.jpg", 
    country: "USA", 
    countryFlag: "🇺🇸", 
    university: "Northeastern University", 
    degree: "MS Software Engineering", 
    expertise: ["USA", "Software", "Co-op"], 
    bio: "I help students understand co-op programs and industry-focused US degrees. Getting an admit is just step one; securing a high-paying co-op is step two. I'll show you how to structure your resume for the US market.", 
    badges: ["Job Hunter"], 
    academicBackground: "B.Tech IT from VIT.", 
    currentStudies: "MS Software Engineering Systems.", 
    futurePlans: "SDE II at Amazon.", 
    isVerified: true, 
    activities: ["Networking on LinkedIn"], 
    scholarships: ["Dean's Scholarship"], 
    meetLink: "https://meet.jit.si/MentorBridge-mentor_06", 
    sessions: [
      { sessionId: "m06_s1", day: "Tuesday", time: "09:00-09:30", timezone: "America/New_York", isBooked: false }, 
      { sessionId: "m06_s2", day: "Friday", time: "19:00-19:30", timezone: "America/New_York", isBooked: false }
    ] 
  },
  { 
    mentorId: "mentor_07", 
    name: "Rohan Patel", 
    avatarUrl: "https://randomuser.me/api/portraits/men/86.jpg", 
    country: "Ireland", 
    countryFlag: "🇮🇪", 
    university: "Trinity College Dublin", 
    degree: "MS Computer Science", 
    expertise: ["Ireland", "CS", "EU Jobs"], 
    bio: "I guide students interested in studying and working in Ireland and navigating the EU tech market. Dublin is a massive hub for tech HQs, and the Stamp 1G visa is incredibly powerful if used correctly.", 
    badges: ["Tech Hub"], 
    academicBackground: "B.E. Computer Engineering.", 
    currentStudies: "MSc Computer Science (Intelligent Systems).", 
    futurePlans: "Software Engineer at Stripe Dublin.", 
    isVerified: true, 
    activities: ["Visa Guidance"], 
    scholarships: ["Global Excellence Award"], 
    meetLink: "https://meet.jit.si/MentorBridge-mentor_07", 
    sessions: [
      { sessionId: "m07_s1", day: "Monday", time: "11:00-11:30", timezone: "Europe/Dublin", isBooked: false }, 
      { sessionId: "m07_s2", day: "Monday", time: "20:00-20:30", timezone: "Europe/Dublin", isBooked: false }
    ] 
  },
  { 
    mentorId: "mentor_08", 
    name: "Priya Malhotra", 
    avatarUrl: "https://randomuser.me/api/portraits/women/88.jpg", 
    country: "Australia", 
    countryFlag: "🇦🇺", 
    university: "University of Melbourne", 
    degree: "MS Information Systems", 
    expertise: ["Australia", "IT", "Visa"], 
    bio: "I help students plan Australian education with clarity on visas and job pathways. The point system for PR can be confusing, but I can help you reverse-engineer your degree to maximize your chances.", 
    badges: ["PR Expert"], 
    academicBackground: "B.Sc Computer Science.", 
    currentStudies: "Master of Information Systems.", 
    futurePlans: "Business Analyst at Canva.", 
    isVerified: true, 
    activities: ["PR Points Calculation"], 
    scholarships: ["Melbourne International Fee Remission"], 
    meetLink: "https://meet.jit.si/MentorBridge-mentor_08", 
    sessions: [
      { sessionId: "m08_s1", day: "Tuesday", time: "11:00-11:30", timezone: "Australia/Melbourne", isBooked: false }, 
      { sessionId: "m08_s2", day: "Tuesday", time: "20:00-20:30", timezone: "Australia/Melbourne", isBooked: false }
    ] 
  },
  { 
    mentorId: "mentor_09", 
    name: "Mohit Aggarwal", 
    avatarUrl: "https://randomuser.me/api/portraits/men/64.jpg", 
    country: "Germany", 
    countryFlag: "🇩🇪", 
    university: "TU Berlin", 
    degree: "MS Data Engineering", 
    expertise: ["Germany", "Data", "Public Universities"], 
    bio: "Focused on data engineering programs in Germany and public university admissions. I can help you tailor your CV strictly to the German standard and ace your university interviews.", 
    badges: ["Data Eng"], 
    academicBackground: "B.Tech CS with 2 years work ex.", 
    currentStudies: "MSc Data Engineering at TU Berlin.", 
    futurePlans: "Data Engineer at Zalando.", 
    isVerified: true, 
    activities: ["Resume for German Market"], 
    scholarships: ["No tuition (Public Uni)"], 
    meetLink: "https://meet.jit.si/MentorBridge-mentor_09", 
    sessions: [
      { sessionId: "m09_s1", day: "Monday", time: "11:00-11:30", timezone: "Europe/Berlin", isBooked: false }, 
      { sessionId: "m09_s2", day: "Wednesday", time: "20:00-20:30", timezone: "Europe/Berlin", isBooked: false }
    ] 
  },
  { 
    mentorId: "mentor_10", 
    name: "Simran Kaur", 
    avatarUrl: "https://randomuser.me/api/portraits/women/62.jpg", 
    country: "UK", 
    countryFlag: "🇬🇧", 
    university: "University of Leeds", 
    degree: "MS Marketing", 
    expertise: ["UK", "Marketing", "Scholarships"], 
    bio: "I guide students applying to marketing and management programs in the UK. I specialize in helping non-tech backgrounds secure high-value scholarships and craft compelling personal statements.", 
    badges: ["Brand Pro"], 
    academicBackground: "BBA Marketing.", 
    currentStudies: "MSc International Marketing Management.", 
    futurePlans: "Brand Manager at Unilever UK.", 
    isVerified: true, 
    activities: ["Portfolio Review"], 
    scholarships: ["Leeds University Business School Scholarship"], 
    meetLink: "https://meet.jit.si/MentorBridge-mentor_10", 
    sessions: [
      { sessionId: "m10_s1", day: "Monday", time: "14:00-14:30", timezone: "Europe/London", isBooked: false }, 
      { sessionId: "m10_s2", day: "Monday", time: "21:00-21:30", timezone: "Europe/London", isBooked: false }
    ] 
  },
  { 
    mentorId: "mentor_11", 
    name: "Aditya Rao", 
    avatarUrl: "https://randomuser.me/api/portraits/men/53.jpg", 
    country: "USA", 
    countryFlag: "🇺🇸", 
    university: "UT Dallas", 
    degree: "MS Business Analytics", 
    expertise: ["USA", "Analytics", "STEM"], 
    bio: "Helping students choose analytics programs with strong career outcomes and OPT extensions. Business analytics is competitive, so your profile needs to highlight business value, not just code.", 
    badges: ["ROI King"], 
    academicBackground: "B.Tech Mechanical + 3 Years Analytics Work Ex.", 
    currentStudies: "MS Business Analytics (Supply Chain Track).", 
    futurePlans: "Supply Chain Analyst at Tesla.", 
    isVerified: true, 
    activities: ["Visa Interview Prep"], 
    scholarships: ["Dean's Excellence Scholarship"], 
    meetLink: "https://meet.jit.si/MentorBridge-mentor_11", 
    sessions: [
      { sessionId: "m11_s1", day: "Tuesday", time: "14:00-14:30", timezone: "America/Chicago", isBooked: false }, 
      { sessionId: "m11_s2", day: "Wednesday", time: "21:00-21:30", timezone: "America/Chicago", isBooked: false }
    ] 
  },
  { 
    mentorId: "mentor_12", 
    name: "Sneha Banerjee", 
    avatarUrl: "https://randomuser.me/api/portraits/women/4.jpg", 
    country: "Canada", 
    countryFlag: "🇨🇦", 
    university: "UBC", 
    degree: "MS Economics", 
    expertise: ["Canada", "Economics", "Funding"], 
    bio: "I help economics students plan admissions and funding in Canada. Graduate funding can be tricky to navigate, but I can help you secure RA/TA positions early.", 
    badges: ["Econ Wiz"], 
    academicBackground: "BA Economics (Honors).", 
    currentStudies: "MA Economics at UBC.", 
    futurePlans: "Policy Analyst for Canadian Government.", 
    isVerified: true, 
    activities: ["Research Proposal Help"], 
    scholarships: ["International Tuition Award"], 
    meetLink: "https://meet.jit.si/MentorBridge-mentor_12", 
    sessions: [
      { sessionId: "m12_s1", day: "Monday", time: "14:00-14:30", timezone: "America/Vancouver", isBooked: false }
    ] 
  },
  { 
    mentorId: "mentor_13", 
    name: "Yash Kulkarni", 
    avatarUrl: "https://randomuser.me/api/portraits/men/36.jpg", 
    country: "Germany", 
    countryFlag: "🇩🇪", 
    university: "KIT Karlsruhe", 
    degree: "MS Robotics", 
    expertise: ["Germany", "Robotics", "Research"], 
    bio: "Focused on robotics and automation programs in Germany. KIT is rigorous, and the focus on theoretical foundations catches many international students off guard. I will prepare you.", 
    badges: ["Robot Dev"], 
    academicBackground: "B.E. Electronics.", 
    currentStudies: "MSc Robotics and Autonomous Systems.", 
    futurePlans: "Robotics Engineer at Siemens.", 
    isVerified: true, 
    activities: ["Technical SOP Review"], 
    scholarships: ["Research Assistantship (HiWi)"], 
    meetLink: "https://meet.jit.si/MentorBridge-mentor_13", 
    sessions: [
      { sessionId: "m13_s1", day: "Wednesday", time: "22:00-22:30", timezone: "Europe/Berlin", isBooked: false }
    ] 
  },
  { 
    mentorId: "mentor_14", 
    name: "Tanvi Deshpande", 
    avatarUrl: "https://randomuser.me/api/portraits/women/65.jpg", 
    country: "UK", 
    countryFlag: "🇬🇧", 
    university: "U of Bristol", 
    degree: "MS Finance", 
    expertise: ["UK", "Finance", "SOP"], 
    bio: "I guide finance applicants with strong SOP and profile alignment. Breaking into UK investment banking requires starting your prep before you even land in the country.", 
    badges: ["Fin Tech"], 
    academicBackground: "B.Com + CFA Level 1.", 
    currentStudies: "MSc Finance and Investment.", 
    futurePlans: "Investment Analyst at Barclays.", 
    isVerified: true, 
    activities: ["Interview Prep for Banks"], 
    scholarships: ["Think Big Scholarship"], 
    meetLink: "https://meet.jit.si/MentorBridge-mentor_14", 
    sessions: [
      { sessionId: "m14_s1", day: "Friday", time: "22:00-22:30", timezone: "Europe/London", isBooked: false }
    ] 
  },
  { 
    mentorId: "mentor_15", 
    name: "Naveen Reddy", 
    avatarUrl: "https://randomuser.me/api/portraits/men/91.jpg", 
    country: "Australia", 
    countryFlag: "🇦🇺", 
    university: "Monash", 
    degree: "MS Cyber Security", 
    expertise: ["Cyber Security", "Australia", "IT"], 
    bio: "I help students planning cybersecurity careers in Australia. The landscape here is booming for security professionals with the right certifications.", 
    badges: ["White Hat"], 
    academicBackground: "B.Tech CS.", 
    currentStudies: "Master of Cybersecurity.", 
    futurePlans: "Security Consultant in Melbourne.", 
    isVerified: true, 
    activities: ["Certifications Guide"], 
    scholarships: ["Monash International Leadership Scholarship"], 
    meetLink: "https://meet.jit.si/MentorBridge-mentor_15", 
    sessions: [
      { sessionId: "m15_s1", day: "Thursday", time: "22:00-22:30", timezone: "Australia/Melbourne", isBooked: false }
    ] 
  },
];

// ── 4. FULL UNCUT SCHOLARSHIPS ──
const scholarshipsData = [
  { scholarshipId: "sch_01", name: "DAAD Development-Related Postgraduate Scholarships", country: "Germany", countryFlag: "🇩🇪", degreeLevel: ["Masters"], field: ["Engineering", "CS", "Economics"], fundingType: "Fully Funded", amount: "€934/month + benefits", deadline: "Varies by course", eligibility: "2 years work experience required", officialLink: "https://www.daad.de/en/" },
  { scholarshipId: "sch_02", name: "Fulbright Foreign Student Program", country: "USA", countryFlag: "🇺🇸", degreeLevel: ["Masters"], field: ["All fields"], fundingType: "Fully Funded", amount: "Tuition + living expenses", deadline: "June-July", eligibility: "Leadership potential & academic excellence", officialLink: "https://foreign.fulbrightonline.org/" },
  { scholarshipId: "sch_03", name: "Chevening Scholarships", country: "UK", countryFlag: "🇬🇧", degreeLevel: ["Masters"], field: ["All fields"], fundingType: "Fully Funded", amount: "Full tuition + living costs", deadline: "November", eligibility: "2 years work experience + leadership", officialLink: "https://www.chevening.org/" },
  { scholarshipId: "sch_04", name: "Vanier Canada Graduate Scholarships", country: "Canada", countryFlag: "🇨🇦", degreeLevel: ["PhD"], field: ["Research-based programs"], fundingType: "Fully Funded", amount: "CAD 50,000/year", deadline: "November", eligibility: "Academic excellence + research potential", officialLink: "https://vanier.gc.ca/" },
  { scholarshipId: "sch_05", name: "Australia Awards", country: "Australia", countryFlag: "🇦🇺", degreeLevel: ["Masters"], field: ["Development fields"], fundingType: "Fully Funded", amount: "Tuition + living + flights", deadline: "April", eligibility: "Citizens of participating countries", officialLink: "https://www.dfat.gov.au/people-to-people/australia-awards" },
  { scholarshipId: "sch_06", name: "Deutschlandstipendium", country: "Germany", countryFlag: "🇩🇪", degreeLevel: ["Masters", "Bachelors"], field: ["All fields"], fundingType: "Partial", amount: "€300/month", deadline: "Varies by University", eligibility: "High achieving students", officialLink: "https://www.deutschlandstipendium.de/" },
];

// ── 5. FULL UNCUT STORIES ──
const storiesData = [
  { storyId: "story_01", name: "Rohit", background: "Final-year engineering student with average profile", targetCountry: "Germany", countryFlag: "🇩🇪", targetProgram: "MS Computer Science", mentorHelpedWith: ["Shortlisting", "Profile Evaluation"], result: "Admitted to TU Berlin", story: "I was confused about German public universities. My mentor helped me understand which universities matched my profile perfectly.", mentorCountry: "Germany" },
  { storyId: "story_02", name: "Panchi", background: "CS graduate unsure about US admissions", targetCountry: "USA", countryFlag: "🇺🇸", targetProgram: "MS Data Science", mentorHelpedWith: ["GRE Strategy", "SOP Review"], result: "Admitted to NYU", story: "I didn't know how competitive my profile was. My mentor broke everything down honestly and helped me focus on the right programs.", mentorCountry: "USA" },
  { storyId: "story_03", name: "Sneha", background: "Commerce graduate aiming for analytics", targetCountry: "UK", countryFlag: "🇬🇧", targetProgram: "MS Business Analytics", mentorHelpedWith: ["SOP Structure", "Program Selection"], result: "Admitted to U of Manchester", story: "Connecting my commerce background to analytics was hard. My mentor helped me reshape my SOP to tell a convincing story.", mentorCountry: "UK" },
  { storyId: "story_04", name: "Karan", background: "Mechanical Engineer worried about APS", targetCountry: "Germany", countryFlag: "🇩🇪", targetProgram: "MS Mechanical Eng", mentorHelpedWith: ["APS Process", "Timeline"], result: "APS Cleared in 2 Weeks", story: "The APS process felt overwhelming. My mentor explained every step in simple terms and helped me plan my timeline.", mentorCountry: "Germany" },
  { storyId: "story_05", name: "Imran", background: "First-gen student with limited budget", targetCountry: "Canada", countryFlag: "🇨🇦", targetProgram: "MS Economics", mentorHelpedWith: ["Funding Options", "Budgeting"], result: "Secured Full Funding", story: "I was worried about expenses. MentorBridge helped me understand realistic costs and funding possibilities in Canada.", mentorCountry: "Canada" },
  { storyId: "story_06", name: "Ayesha", background: "BCA graduate pivoting into Business Analytics", targetCountry: "UK", countryFlag: "🇬🇧", targetProgram: "MSc Business Analytics", mentorHelpedWith: ["SOP Review", "Program Shortlist", "Interview Prep"], result: "Admitted to University of Leeds", story: "My mentor helped me translate my projects into impact-focused bullet points and build a shortlist that balanced rankings with employability.", mentorCountry: "UK" },
  { storyId: "story_07", name: "Dev", background: "Working professional targeting Germany public universities", targetCountry: "Germany", countryFlag: "🇩🇪", targetProgram: "MS Data Engineering", mentorHelpedWith: ["University Fit", "APS Guidance", "Timeline Planning"], result: "Received admits from 2 public universities", story: "The process felt unclear until my mentor broke it down week-by-week. I applied with confidence and received admits without wasting money on wrong programs.", mentorCountry: "Germany" },
  { storyId: "story_08", name: "Maria", background: "Economics graduate searching for scholarship pathways", targetCountry: "USA", countryFlag: "🇺🇸", targetProgram: "MS Data Science", mentorHelpedWith: ["Scholarship Strategy", "Essay Storytelling", "Profile Positioning"], result: "Secured a partial scholarship", story: "I learned how to position my background and write essays that felt authentic. The scholarship strategy changed my entire approach.", mentorCountry: "USA" },
];

// ── 6. EXECUTE MASTER SEEDING ──
async function main() {
  await mongoose.connect(MONGODB_URI);
  console.log("✅ Connected to MongoDB\n");

  // Wipe Database
  await Promise.all([
    User.deleteMany({}),
    Mentor.deleteMany({}),
    Scholarship.deleteMany({}),
    Story.deleteMany({}),
  ]);
  console.log("🗑️  Cleared existing database collections\n");

  // Insert Core Content
  await Mentor.insertMany(mentorsData);
  await Scholarship.insertMany(scholarshipsData);
  await Story.insertMany(storiesData);
  console.log("✅ Successfully seeded 16 Mentors (with Jitsi Links), Scholarships, and Stories\n");

  // Prepare Users Array
  const passwordHash = await bcrypt.hash("Test@123", 10);
  const usersToInsert = [
    { userId: "user_admin", email: "admin@example.com", passwordHash, name: "System Admin", role: "admin" },
    { userId: "user_001", email: "student@test.com", passwordHash, name: "Saif Sanadi", role: "student", targetCountry: "Germany", targetField: "Computer Science", targetDegree: "Masters", bookedSessions: [] }
  ];

  // Dynamically generate User Accounts for ALL 16 Mentors
  mentorsData.forEach((m) => {
    let cleanEmail = "";
    
    if (m.mentorId === "mentor_barca") {
      cleanEmail = "mateo@fcbarcelona.com";
    } else {
      // Extracts "01", "02", etc. from "mentor_01"
      const num = m.mentorId.split("_")[1];
      cleanEmail = `mentor${num}@test.com`;
    }

    usersToInsert.push({
      userId: `user_${m.mentorId}`,
      email: cleanEmail,
      passwordHash,
      name: m.name,
      role: "mentor",
      mentorProfile: m.mentorId // Hooks the User Account to the Mentor Profile
    });
  });

  await User.insertMany(usersToInsert);

  // ── 7. HACKER TERMINAL OUTPUT ──
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("  🚀 MENTORBRIDGE: PHASE 1 SETUP COMPLETE");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("  ROLE     EMAIL                      PASSWORD");
  console.log("  ──────   ───────────────────────    ─────────────────");
  console.log("  admin    admin@example.com          Test@123");
  console.log("  student  student@test.com           Test@123");
  console.log("  ──────   ───────────────────────    ─────────────────");
  
  usersToInsert.filter(u => u.role === "mentor").forEach((u) => {
    console.log(`  mentor   ${u.email.padEnd(26)} Test@123   [${u.name}]`);
  });
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  await mongoose.disconnect();
  process.exit(0);
}

main().catch(async (err) => {
  try { await mongoose.disconnect(); } catch {}
  console.error("❌ Error:", err.message);
  process.exit(1);
});