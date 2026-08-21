MentorBridge

A full-stack platform built with Next.js to help Indian students navigate the international graduate education journey — from visa prep to the first few months abroad.

🚀 Features
Mentor Booking Marketplace
Separate Student, Mentor, and Admin dashboards
Browse and book sessions with mentors, manage schedules and rosters
Mentor-side analytics, revenue tracking, and client communication
Visa Interview Simulator
Practice mock visa interview questions in a realistic, guided flow
Get structured feedback on answers before the real interview
Session Intelligence Brief
Consolidated, digestible briefs summarizing key prep sessions
Helps students track what's been covered and what's next
Policy Intelligence Engine
Surfaces relevant, up-to-date immigration and visa policy information
Reduces reliance on scattered forum threads and outdated advice
First 90 Days Survival Guide
Practical guidance for the first few months after landing abroad
Covers the early logistics students consistently get stuck on
Career & Funding Tools
Career Compass and ROI Matrix for evaluating program/career paths
Scholarship explorer and cost calculator
Roadmap generator and market insights dashboard
Success stories from past applicants
🛠️ Tech Stack
Frontend
Next.js (App Router) — framework
React — UI library
Tailwind CSS — styling (dark theme)
Backend
Next.js API Routes — server-side logic
MongoDB with Mongoose — database and models (Mentor, Scholarship, Story, User)
JWT-based authentication — custom auth via lib/auth.js
📋 Prerequisites

Before you begin, ensure you have the following installed:

Node.js (v18 or higher recommended)
npm or yarn
(Your database's local setup, if applicable)
🔧 Installation & Setup
1. Clone the repository
git clone https://github.com/saifsanadi26/mymentorbridge.git
cd mymentorbridge
2. Install dependencies
npm install
3. Configure environment variables

Create a .env.local file in the project root:

NEXT_PUBLIC_APP_URL=http://localhost:3000

# Add your database connection string, API keys, etc.
DATABASE_URL=
4. Run the development server
npm run dev

The app will run on http://localhost:3000

📱 Usage
Open the app and explore the core modules from the dashboard
Run through the Visa Interview Simulator to practice common questions
Check the Policy Intelligence Engine for current visa/immigration updates
Review your Session Intelligence Brief after each prep session
Use the First 90 Days Survival Guide once you're preparing to depart
🗂️ Project Structure
mentorbridge/
├── app/
│   ├── (auth)/          # login, signup
│   ├── (dashboard)/     # student, mentor, admin dashboards
│   ├── api/             # auth, mentors, sessions, scholarships, admin routes
│   ├── admin/           # content management (mentors, stories)
│   ├── visa-simulator/, session-intelligence/, policy-intelligence/,
│   │   first-90-days/, career-compass/, roadmap/, scholarships/, ...
│   ├── layout.jsx
│   └── page.jsx
├── components/          # shared UI (Navbar, Footer, MentorCard, dashboards, etc.)
├── lib/                 # auth, db connection, match scoring, validation, utils
├── models/               # Mongoose models: Mentor, Scholarship, Story, User
├── scripts/              # e.g. seed.js
├── .env.example
├── package.json
└── README.md
🔮 Future Enhancements
Personalized university/program recommendations
Community Q&A between admitted and prospective students
Application deadline tracker with reminders
Mobile-friendly PWA support
📄 License

This project is open source and available under the MIT License.

👥 Support

For issues or questions, please open an issue in the repository.

Built to make the journey abroad a little less overwhelming