## 🧠 About the Project
 
MentorBridge was born from a simple frustration: Indian students preparing for international graduate admissions have **no structured, AI-backed ecosystem** to guide them through the chaos of SOPs, GRE prep, visa interviews, scholarship hunting, and pre-departure logistics.
 
This platform connects **students with mentors who've been through it**, wraps the entire journey in **AI-powered intelligence** (via the Anthropic Claude API), and presents it all in a **Sci-Fi Command Center aesthetic** — because going abroad feels like launching into orbit.
 
> Built as a final-year BE capstone project (VTU), MentorBridge is a production-grade full-stack application demonstrating real-world architecture, AI integration, and UX-first thinking.
 
---
 
## 🚀 Core Features
 
### 👨‍🎓 Student Portal
| Feature | Description |
|---|---|
| **Mentor Marketplace** | Browse 50+ mentors filtered by country, university, specialization, and availability |
| **Session Booking** | Book 1:1 sessions, group coaching, or mock interview slots in real-time |
| **Session Intelligence Brief** | AI-generated prep guide tailored to your mentor's background before every session |
| **90-Day Departure Countdown** | Structured pre-departure checklist with daily task unlocks |
| **Scholarship Explorer** | Curated funding database with eligibility checker and application tracker |
| **Career & Funding Counselor** | AI-powered Q&A for funding, scholarships, and career pathway questions |
| **Deadline Tracker** | University-wise deadline management with email reminders |
| **Campus Diary** | Document your journey with private notes and milestone logs |
| **University Intelligence Cards** | Tinder-style swipe UI to explore and shortlist universities |
| **Interview Simulator** | Claude-powered mock visa and admission interview with real-time feedback |
| **Market Insights Dashboard** | D3.js-powered visualizations of admit trends, GRE scores, and job market data |
 
### 🧑‍🏫 Mentor Portal
| Feature | Description |
|---|---|
| **Availability Manager** | Set weekly slots, block dates, manage session types |
| **Session Queue** | View upcoming sessions with student profiles and pre-session notes |
| **Consultation History** | Full record of all past sessions with ratings and notes |
| **Earnings Dashboard** | Track session revenue, withdrawals, and payout history |
| **Student Progress Tracking** | View students' checklist progress and application status |
 
### 🛡️ Admin Dashboard
| Feature | Description |
|---|---|
| **Platform Overview** | Real-time KPIs — total users, sessions, revenue, and satisfaction scores |
| **User Management** | Approve/reject mentor registrations, manage student accounts |
| **Content Management** | Edit scholarship listings, department info, and platform announcements |
| **Analytics Suite** | Session trends, mentor performance, and geographic breakdowns |
| **Flagged Sessions** | Review reported sessions and dispute resolution workflow |
 
---
 
## 🛠️ Tech Stack
 
### Frontend
```
Next.js 14 (App Router)    → Full-stack React framework with SSR + RSC
Tailwind CSS 3.4           → Utility-first CSS with custom Sci-Fi design tokens
Framer Motion              → Smooth animations and page transitions
D3.js                      → Custom data visualizations (admit trends, dashboards)
Lucide React               → Icon library
```
 
### Backend
```
Next.js API Routes         → RESTful API built into the same repo (no separate server)
MongoDB (Mongoose)         → NoSQL database for flexible document storage
JWT (jsonwebtoken)         → Stateless authentication
bcryptjs                   → Password hashing
Nodemailer                 → Transactional email (appointment reminders, OTPs)
```
 
### AI / Integrations
```
Anthropic Claude API       → Session Intelligence, Interview Simulator, Career Counselor
Claude claude-sonnet-4-6          → Primary model for AI features
```
 
### DevOps & Tooling
```
Vercel                     → Deployment + serverless edge functions
MongoDB Atlas              → Cloud-hosted database
GitHub Actions (optional)  → CI/CD pipeline
ESLint + Prettier          → Code quality
```
 
---
 
## 🏗️ Architecture Overview
 
```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT (Browser)                         │
│                   Next.js App Router (RSC)                      │
│          Tailwind │ Framer Motion │ D3.js │ Lucide              │
└──────────────────────────┬──────────────────────────────────────┘
                           │ HTTP / Fetch
┌──────────────────────────▼──────────────────────────────────────┐
│                  Next.js API Routes (/api/*)                     │
│           Auth │ Mentors │ Sessions │ AI │ Dashboard             │
│                    JWT Middleware Layer                          │
└────────────┬──────────────────────────────┬─────────────────────┘
             │                              │
┌────────────▼─────────────┐  ┌────────────▼─────────────────────┐
│    MongoDB Atlas          │  │     Anthropic Claude API          │
│  Users │ Sessions        │  │  claude-sonnet-4-6 Model                │
│  Mentors │ Records       │  │  Session Briefs │ Simulator        │
│  Scholarships │ Deadlines│  │  Career Counselor │ Feedback       │
└──────────────────────────┘  └───────────────────────────────────┘
```
 
---
 
## 🗂️ Project Structure
 
```
mentorbridge/
├── app/                           # Next.js App Router
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.jsx
│   │   └── register/
│   │       └── page.jsx
│   ├── (dashboard)/
│   │   ├── admin/
│   │   │   ├── page.jsx           # Admin Overview
│   │   │   ├── users/page.jsx
│   │   │   └── analytics/page.jsx
│   │   ├── mentor/
│   │   │   ├── page.jsx           # Mentor Dashboard
│   │   │   ├── sessions/page.jsx
│   │   │   └── earnings/page.jsx
│   │   └── student/
│   │       ├── page.jsx           # Student Dashboard
│   │       ├── marketplace/page.jsx
│   │       ├── sessions/page.jsx
│   │       ├── scholarships/page.jsx
│   │       ├── deadlines/page.jsx
│   │       ├── campus-diary/page.jsx
│   │       ├── interview-sim/page.jsx
│   │       └── departure/page.jsx
│   ├── api/                       # API Routes (Backend)
│   │   ├── auth/
│   │   │   ├── register/route.js
│   │   │   ├── login/route.js
│   │   │   └── me/route.js
│   │   ├── mentors/
│   │   │   ├── route.js
│   │   │   └── [id]/route.js
│   │   ├── sessions/
│   │   │   ├── route.js
│   │   │   └── [id]/route.js
│   │   ├── ai/
│   │   │   ├── session-brief/route.js
│   │   │   ├── interview/route.js
│   │   │   └── counselor/route.js
│   │   ├── scholarships/route.js
│   │   ├── deadlines/route.js
│   │   └── dashboard/
│   │       ├── admin/route.js
│   │       ├── mentor/route.js
│   │       └── student/route.js
│   ├── layout.jsx                 # Root Layout
│   └── page.jsx                   # Landing Page
│
├── components/
│   ├── ui/                        # Reusable UI components
│   │   ├── Button.jsx
│   │   ├── Card.jsx
│   │   ├── Modal.jsx
│   │   ├── Badge.jsx
│   │   └── Spinner.jsx
│   ├── charts/                    # D3.js visualizations
│   │   ├── AdmitTrendChart.jsx
│   │   ├── SalaryMap.jsx
│   │   └── SessionAnalytics.jsx
│   ├── Navbar.jsx
│   ├── UniversityCard.jsx         # Tinder-style swipe card
│   ├── MentorCard.jsx
│   ├── SessionIntelligence.jsx
│   └── InterviewSimulator.jsx
│
├── context/
│   └── AuthContext.jsx            # Global auth state
│
├── lib/
│   ├── mongodb.js                 # DB connection singleton
│   ├── auth.js                    # JWT helpers
│   ├── claude.js                  # Anthropic API wrapper
│   └── emailService.js            # Nodemailer setup
│
├── models/                        # Mongoose Schemas
│   ├── User.js
│   ├── Mentor.js
│   ├── Session.js
│   ├── Scholarship.js
│   ├── Deadline.js
│   └── DiaryEntry.js
│
├── middleware.js                  # Next.js middleware (auth guard)
├── .env.local                     # Environment variables (not committed)
├── .env.example                   # Template for env vars
├── .gitignore
├── next.config.js
├── tailwind.config.js
├── package.json
└── README.md
```
 
---
 
## 📋 Prerequisites
 
Make sure you have the following installed:
 
| Tool | Version | Download |
|------|---------|----------|
| Node.js | v18.0 or higher | [nodejs.org](https://nodejs.org/) |
| npm | v9.0 or higher | Comes with Node.js |
| Git | Latest | [git-scm.com](https://git-scm.com/) |
| MongoDB Atlas Account | Free tier | [mongodb.com/atlas](https://mongodb.com/atlas) |
| Anthropic API Key | - | [console.anthropic.com](https://console.anthropic.com/) |
 
---
 
## 🔧 Installation & Setup
 
### Step 1 — Clone the Repository
 
```bash
git clone https://github.com/yourusername/mentorbridge.git
cd mentorbridge
```
 
### Step 2 — Install Dependencies
 
```bash
npm install
```
 
### Step 3 — Configure Environment Variables
 
```bash
cp .env.example .env.local
```
 
Now open `.env.local` and fill in your values (see [Environment Variables](#-environment-variables) section below).
 
### Step 4 — Set Up MongoDB Atlas
 
1. Go to [mongodb.com/atlas](https://mongodb.com/atlas) and create a free cluster
2. Under **Database Access**, create a DB user with read/write permissions
3. Under **Network Access**, add `0.0.0.0/0` (or your IP) to the allowlist
4. Click **Connect** → **Connect your application** → Copy the URI
5. Paste it as `MONGODB_URI` in your `.env.local`
### Step 5 — Get Your Anthropic API Key
 
1. Go to [console.anthropic.com](https://console.anthropic.com/)
2. Create an account or log in
3. Navigate to **API Keys** → Generate new key
4. Copy and paste as `ANTHROPIC_API_KEY` in your `.env.local`
### Step 6 — Run the Development Server
 
```bash
npm run dev
```
 
App will be live at → **http://localhost:3000** 🎉
 
### Step 7 — Seed Initial Admin Account (First Time Only)
 
After running the app, register a user, then update their role to admin directly in MongoDB:
 
```javascript
// In MongoDB Atlas → Collections → users
// Find your user document and update:
{ $set: { role: "admin" } }
```
 
Or use the seed script if available:
 
```bash
npm run seed
```
 
---
 
## 🔐 Environment Variables
 
Create a `.env.local` file in the root directory. **Never commit this file to Git.**
 
```env
# ─── App ───────────────────────────────────────────────────────
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
 
# ─── MongoDB ───────────────────────────────────────────────────
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/mentorbridge?retryWrites=true&w=majority
 
# ─── Authentication ────────────────────────────────────────────
JWT_SECRET=your_super_secret_key_min_32_chars_change_in_production
JWT_EXPIRE=7d
 
# ─── Anthropic Claude API ──────────────────────────────────────
ANTHROPIC_API_KEY=sk-ant-api03-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
 
# ─── Email (Nodemailer + Gmail SMTP) ───────────────────────────
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_gmail_app_password       # Google App Password (not your regular password)
EMAIL_FROM=MentorBridge <your_email@gmail.com>
 
# ─── Optional: Cloudinary (for profile/document uploads) ───────
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```
 
> 💡 **Gmail App Password Setup:**
> 1. Enable 2-Factor Authentication on your Google account
> 2. Go to **Google Account → Security → 2-Step Verification → App Passwords**
> 3. Generate a password for "Mail" → use it as `EMAIL_PASSWORD`
 
---
 
## 📡 API Endpoints
 
All routes are prefixed with `/api`
 
### 🔑 Authentication
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new user (student/mentor) | ❌ |
| POST | `/api/auth/login` | Login and receive JWT | ❌ |
| GET | `/api/auth/me` | Get current authenticated user | ✅ |
| POST | `/api/auth/logout` | Invalidate session | ✅ |
 
### 🧑‍🏫 Mentors
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/mentors` | List all mentors (with filters) | ❌ |
| GET | `/api/mentors/:id` | Get single mentor profile | ❌ |
| POST | `/api/mentors` | Create mentor profile | ✅ Mentor |
| PUT | `/api/mentors/:id` | Update mentor profile | ✅ Mentor/Admin |
| DELETE | `/api/mentors/:id` | Remove mentor | ✅ Admin |
 
### 📅 Sessions
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/sessions` | Get all sessions (role-filtered) | ✅ |
| GET | `/api/sessions/:id` | Get single session details | ✅ |
| POST | `/api/sessions` | Book a new session | ✅ Student |
| PUT | `/api/sessions/:id` | Update session (confirm/cancel/complete) | ✅ Mentor/Admin |
| DELETE | `/api/sessions/:id` | Cancel/delete session | ✅ |
 
### 🤖 AI Features
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/ai/session-brief` | Generate pre-session intelligence brief | ✅ Student |
| POST | `/api/ai/interview` | Start/continue interview simulation | ✅ Student |
| POST | `/api/ai/counselor` | Career & funding counselor Q&A | ✅ Student |
 
### 🎓 Scholarships
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/scholarships` | Browse all scholarships | ✅ |
| GET | `/api/scholarships/:id` | Get scholarship details | ✅ |
| POST | `/api/scholarships` | Add new scholarship | ✅ Admin |
| PUT | `/api/scholarships/:id` | Update scholarship | ✅ Admin |
 
### ⏰ Deadlines
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/deadlines` | Get student's tracked deadlines | ✅ Student |
| POST | `/api/deadlines` | Add new deadline | ✅ Student |
| PUT | `/api/deadlines/:id` | Update deadline status | ✅ Student |
| DELETE | `/api/deadlines/:id` | Remove deadline | ✅ Student |
 
### 📊 Dashboards
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/dashboard/admin` | Admin KPIs and stats | ✅ Admin |
| GET | `/api/dashboard/mentor` | Mentor session stats | ✅ Mentor |
| GET | `/api/dashboard/student` | Student journey progress | ✅ Student |
 
---
 
## 🗄️ Database Schema
 
### User
```js
{
  name: String,
  email: { type: String, unique: true },
  password: String,            // bcrypt hashed
  role: { enum: ["student", "mentor", "admin"] },
  avatar: String,
  phone: String,
  createdAt: Date
}
```
 
### Mentor
```js
{
  userId: ObjectId (ref: User),
  university: String,          // e.g. "TU Munich"
  country: String,             // e.g. "Germany"
  specialization: String,      // e.g. "Data Science"
  degree: String,              // e.g. "MSc"
  gre: Number,
  ielts: Number,
  bio: String,
  sessionRate: Number,         // per session in INR
  rating: Number,              // avg from reviews
  totalSessions: Number,
  availability: [{ day: String, slots: [String] }],
  isVerified: Boolean
}
```
 
### Session
```js
{
  studentId: ObjectId (ref: User),
  mentorId: ObjectId (ref: Mentor),
  sessionType: { enum: ["1:1", "group", "mock-interview"] },
  date: Date,
  slot: String,
  status: { enum: ["pending", "confirmed", "completed", "cancelled"] },
  reasonForBooking: String,
  mentorNotes: String,
  rating: Number,
  review: String,
  amount: Number
}
```
 
### Scholarship
```js
{
  name: String,
  provider: String,
  country: String,
  amount: String,
  deadline: Date,
  eligibility: String,
  link: String,
  tags: [String]
}
```
 
---
 
## 🤖 AI Features (Claude API)
 
MentorBridge uses the **Anthropic Claude API (claude-sonnet-4-6)** for three core AI features:
 
### 1. Session Intelligence Brief
Before every booked session, Claude generates a personalized prep guide:
- Mentor's university culture and program strengths
- Likely questions the student should prepare
- Top 5 things to get out of the session
- Suggested talking points
### 2. Interview Simulator
A multi-turn conversation simulating:
- University admission interviews
- Visa officer conversations (Germany/Canada/USA)
- Real-time feedback on each answer
- Final performance report with scores
### 3. Career & Funding Counselor
Natural language Q&A powered by Claude:
- Scholarship eligibility checks
- Career pathway advice for international markets
- Funding options for specific countries/programs
```js
// Example Claude API call (lib/claude.js)
import Anthropic from "@anthropic-ai/sdk";
 
const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
 
export async function generateSessionBrief(mentorProfile, studentGoals) {
  const message = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 1024,
    messages: [
      {
        role: "user",
        content: `You are a study-abroad advisor. 
        Generate a pre-session intelligence brief for a student meeting their mentor.
        Mentor Profile: ${JSON.stringify(mentorProfile)}
        Student Goals: ${studentGoals}
        Format: structured, actionable, encouraging.`
      }
    ]
  });
  return message.content[0].text;
}
```
 
---
 
## 🚀 Deployment
 
### Deploy Frontend + API to Vercel (Recommended)
 
Since MentorBridge uses Next.js, the frontend and API routes deploy together on Vercel.
 
1. Push your code to GitHub (see section below)
2. Go to [vercel.com](https://vercel.com) and sign in with GitHub
3. Click **"Add New Project"** → Import your `mentorbridge` repo
4. Under **Environment Variables**, add all keys from your `.env.local`
5. Click **Deploy** 🚀
Your app will be live at `https://mentorbridge.vercel.app` (or your custom domain)
 
> ⚠️ Make sure `NEXT_PUBLIC_APP_URL` is updated to your Vercel domain in production environment variables.
 
### MongoDB Atlas (Production)
 
- Use a dedicated cluster (M10 or higher for production)
- Enable **IP Whitelist**: Vercel uses dynamic IPs, so add `0.0.0.0/0` or use Atlas VPC peering
- Enable **Backup** on your cluster
---
 
## 📤 Git Setup & Push Guide
 
### First Time (New Repository)
 
**Step 1 — Initialize Git in your project folder**
```bash
cd "C:\Users\SAIF SANADI\Desktop\MentorBridge"
git init
```
 
**Step 2 — Create a `.gitignore` file** (very important — keeps secrets out of GitHub)
```bash
# Create .gitignore manually or run:
echo "node_modules/
.next/
.env.local
.env
*.env
.DS_Store
npm-debug.log*
yarn-debug.log*
yarn-error.log*
.vercel
out/
build/" > .gitignore
```
 
**Step 3 — Stage all your files**
```bash
git add .
```
 
**Step 4 — Make your first commit**
```bash
git commit -m "feat: initial commit - MentorBridge MVP"
```
 
**Step 5 — Create a new repo on GitHub**
1. Go to [github.com](https://github.com)
2. Click **"+"** → **"New Repository"**
3. Name it `mentorbridge`
4. Leave it **Public** (for portfolio) or **Private**
5. **Do NOT** initialize with README, .gitignore, or license (you already have them)
6. Click **"Create repository"**
**Step 6 — Connect your local repo to GitHub**
```bash
git remote add origin https://github.com/yourusername/mentorbridge.git
```
 
**Step 7 — Push your code**
```bash
git branch -M main
git push -u origin main
```
 
Done! Refresh your GitHub page — your code is live 🎉
 
---
 
### Subsequent Pushes (After Making Changes)
 
```bash
# Stage your changes
git add .
 
# Commit with a descriptive message
git commit -m "feat: add interview simulator UI"
 
# Push to GitHub
git push
```
 
### Useful Git Commands
 
```bash
# Check what files changed
git status
 
# See commit history
git log --oneline
 
# Create and switch to a new branch (for features)
git checkout -b feature/ai-counselor
 
# Push a new branch
git push -u origin feature/ai-counselor
 
# Merge branch back to main (after PR review)
git checkout main
git merge feature/ai-counselor
```
 
### Commit Message Convention (Good Practice)
```
feat: add new feature
fix: bug fix
docs: update README
style: formatting, no logic change
refactor: code restructure
chore: dependency updates
```
 
---
 
## 🔮 Future Enhancements
 
- [ ] **AI SOP Review** — Claude reviews and scores your Statement of Purpose draft
- [ ] **Group Cohorts** — Batch sessions with 5-10 students going to the same country
- [ ] **Payment Integration** — Razorpay for Indian students, Stripe for international
- [ ] **Mobile App** — React Native companion app
- [ ] **Real-time Chat** — WebSocket-based messaging between students and mentors
- [ ] **Video Consultations** — Integrated WebRTC or Zoom SDK
- [ ] **University Comparison Engine** — Side-by-side program comparison with AI insights
- [ ] **Alumni Network** — Connect with past students at your target universities
- [ ] **Document Vault** — Cloudinary-powered secure document storage (LORs, SOPs, transcripts)
- [ ] **Gamification** — Streak tracking, badges, and departure countdown milestones
- [ ] **Multi-language Support** — Hindi, Kannada, Tamil interfaces
---
 
## 🤝 Contributing
 
Contributions are what make the open-source community such an amazing place. Any contributions you make are **greatly appreciated**.
 
1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'feat: add AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
---
 
## 🎯 MVP Completion Checklist
 
- ✅ User Authentication (JWT + bcrypt)
- ✅ Role-based Access Control (Student / Mentor / Admin)
- ✅ Mentor Marketplace with filters
- ✅ Session Booking System
- ✅ Session Intelligence Brief (Claude API)
- ✅ Interview Simulator (Claude API)
- ✅ Career & Funding Counselor (Claude API)
- ✅ University Intelligence Cards (Tinder-style swipe UI)
- ✅ 90-Day Departure Countdown
- ✅ Scholarship Explorer
- ✅ Deadline Tracker
- ✅ Role-based Dashboards (3 views)
- ✅ D3.js Data Visualizations
- ✅ Email Notifications (Nodemailer)
- ✅ MongoDB Database Integration
- ✅ RESTful API Architecture
- ✅ Responsive UI (Tailwind CSS)
- ✅ Sci-Fi Command Center Design Aesthetic
- ✅ Deployed on Vercel
---
 
## 📄 License
 
Distributed under the MIT License. See `LICENSE` for more information.
 
---
<div align="center">
Built with ❤️ and a lot of ☕ to make studying abroad less overwhelming
 
⭐ Star this repo if it helped you!
 
</div>
 