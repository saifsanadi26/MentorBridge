'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'

// ─── FULLY DETAILED DATA FOR ALL 15 MENTORS ───
const MENTORS = [
  { 
    id:"mentor_01", name:"Aarav Mehta", role:"MS CS", uni:"TU Munich", country:"Germany", flag:"🇩🇪", tier:"Elite", match:94, 
    img:"https://randomuser.me/api/portraits/men/11.jpg", hex:"#00f5d4", rgb:"0,245,212", 
    sessions:143, rating:4.97, admitRate:"96%",
    badges:["DAAD Scholar", "CS", "APS Process", "Public Unis"],
    bio:"I help students realistically shortlist German public universities — not sell them dreams. I've been through the APS maze, survived two German winters on an €861 stipend, and landed a research HiWi at TU Munich. If your profile has gaps, I'll tell you honestly. If it's strong, I'll show you exactly where to aim.",
    timeline: [
      { status: "done", tag: "Origin · India", text: "B.Tech in Computer Engineering", sub: "Strong fundamentals in systems and algorithms. GPA: 8.4/10. No tier-1 institution — got in on merit and an exceptional SOP." },
      { status: "done", tag: "Current · TU Munich", text: "MS Computer Science — Distributed Systems & ML Systems", sub: "DAAD scholarship recipient. Working as a HiWi researcher in the Systems group. Deep-dived into German academic culture, APS, and blocked accounts." },
      { status: "future", tag: "Target · Germany", text: "Senior Software Engineer at a German tech company", sub: "Planning to leverage the 18-month Job Seeker Visa. Companies on radar: Celonis, Personio, Siemens Digital Industries." }
    ],
    expertise: [
      { icon: "🏛", title: "German Public Universities", sub: "TU9, H+ rankings, Uni-Assist realities", pct: "98%" },
      { icon: "📄", title: "APS Certification", sub: "Document checklist, interview prep", pct: "95%" },
      { icon: "🏅", title: "DAAD Scholarship", sub: "Motivation letter review, success factors", pct: "88%" },
      { icon: "✍️", title: "SOP / Motivation Letter", sub: "German-style vs US-style positioning", pct: "92%" },
      { icon: "💻", title: "CS Profile Building", sub: "Projects, GitHub for German MS applications", pct: "85%" },
      { icon: "🇩🇪", title: "Life in Germany", sub: "Housing, Anmeldung, blocked account, HiWi", pct: "90%" }
    ],
    achievements: [
      { icon: "🏅", type: "gold", text: "DAAD Scholarship Recipient — Full funding for MS studies", sub: "Competitive award granted to <5% of international applicants annually" },
      { icon: "🔬", type: "teal", text: "Research HiWi at TU Munich — Distributed Systems Group", sub: "Paid research assistantship alongside MS studies · €14/hr" },
      { icon: "📋", type: "purple", text: "DAAD Scholarship Strategy Guidance", sub: "Guided 40+ students through DAAD applications with 78% acceptance rate" },
      { icon: "🎓", type: "gold", text: "Public Uni Specialist — Zero-tuition pathway navigator", sub: "Germany's public unis charge €0–500/semester. The ROI math is extraordinary." }
    ],
    helpTags: ["🏛 Uni Shortlisting", "📄 APS Process", "🏅 DAAD Strategy", "✍️ SOP Review", "📊 Profile Evaluation", "🗺 Timeline", "💼 HiWi Jobs", "🏠 Housing", "💰 Budgeting"]
  },
  { 
    id:"mentor_02", name:"Ritika Sharma", role:"MS Data Science", uni:"Arizona State", country:"USA", flag:"🇺🇸", tier:"Verified", match:79, 
    img:"https://randomuser.me/api/portraits/women/55.jpg", hex:"#FFB800", rgb:"255,184,0", 
    sessions:86, rating:4.88, admitRate:"92%",
    badges:["Top 2% Admit", "GRE Strategy", "TA/RA Roles", "USA"],
    bio:"I guide students on US admissions, specifically targeting Data Science and AI programs. I cracked the GRE with a 330+ score and secured a TA position in my first semester. I'll help you craft an SOP that appeals to US admission committees and show you how to hunt for funding.",
    timeline: [
      { status: "done", tag: "Origin · India", text: "B.Tech in IT", sub: "GPA: 9.1/10. Heavy focus on statistical modeling and DB management." },
      { status: "done", tag: "Current · Arizona State", text: "MS in Data Science", sub: "Top 2% admit. Secured Teaching Assistantship covering 50% tuition." },
      { status: "future", tag: "Target · USA", text: "Data Scientist at a FAANG company", sub: "Utilizing 3-year STEM OPT extension for US tech industry placement." }
    ],
    expertise: [
      { icon: "🎯", title: "GRE Strategy", sub: "Study plans, mock analysis, score targeting", pct: "96%" },
      { icon: "🇺🇸", title: "US Admissions", sub: "Safe/Target/Reach university mapping", pct: "92%" },
      { icon: "📝", title: "SOP Crafting", sub: "Storytelling for American universities", pct: "95%" },
      { icon: "💰", title: "TA/RA Applications", sub: "Cold emailing professors, funding hunt", pct: "88%" },
      { icon: "📊", title: "Data Science Portfolios", sub: "Kaggle, end-to-end ML projects", pct: "90%" },
      { icon: "🛂", title: "F-1 Visa Prep", sub: "Mock interviews, DS-160 guidance", pct: "85%" }
    ],
    achievements: [
      { icon: "🎯", type: "gold", text: "GRE 332/340 Scorer", sub: "Quant 170, Verbal 162. Developed custom frameworks for Indian test-takers." },
      { icon: "👩‍🏫", type: "teal", text: "Teaching Assistant — Advanced Databases", sub: "Secured in semester 1, covering significant tuition costs." },
      { icon: "📈", type: "purple", text: "Admissions Success Rate", sub: "Helped 20+ students get into Top 50 US Data Science programs." },
      { icon: "💻", type: "gold", text: "Summer Data Intern at Tech Startup", sub: "Successfully navigated the CPT internship search process." }
    ],
    helpTags: ["🇺🇸 US Shortlisting", "🎯 GRE Prep", "💰 TA/RA Funding", "📝 SOP Review", "📊 Data Portfolios", "✉️ Cold Emailing", "🛂 F-1 Visa Prep", "💼 CPT Internships"]
  },
  { 
    id:"mentor_03", name:"Kunal Verma", role:"MS AI", uni:"University of Toronto", country:"Canada", flag:"🇨🇦", tier:"Elite", match:88, 
    img:"https://randomuser.me/api/portraits/men/32.jpg", hex:"#a855f7", rgb:"168,85,247", 
    sessions:112, rating:4.95, admitRate:"94%",
    badges:["Vector Institute", "Research AI", "Full Funding", "Canada"],
    bio:"I focus exclusively on research-oriented AI programs in Canada (UofT, UBC, McGill). Admission to these is brutal. You don't just need a good GPA; you need a rock-solid research proposal and strategic LoRs. I'll help you structure your academic profile to catch the eye of top Canadian professors.",
    timeline: [
      { status: "done", tag: "Origin · India", text: "B.Tech Computer Science — IIT Delhi", sub: "Strong foundation in ML. 2 published papers in undergrad." },
      { status: "done", tag: "Current · UofT", text: "MSc in Applied Computing (AI Focus)", sub: "Fully funded researcher affiliated with the Vector Institute." },
      { status: "future", tag: "Target · Canada", text: "AI Research Scientist", sub: "Targeting DeepMind Toronto or similar applied research labs." }
    ],
    expertise: [
      { icon: "🧠", title: "AI/ML Profiles", sub: "Highlighting research potential", pct: "98%" },
      { icon: "🇨🇦", title: "Canadian Top Tier", sub: "UofT, UBC, McGill specific requirements", pct: "95%" },
      { icon: "🔬", title: "Research Proposals", sub: "Writing proposals that get funding", pct: "92%" },
      { icon: "✉️", title: "Professor Outreach", sub: "How to get a Canadian PI to reply", pct: "90%" },
      { icon: "📜", title: "LoR Strategy", sub: "Drafting academic recommendations", pct: "88%" },
      { icon: "🍁", title: "PGWP & PR Pathways", sub: "Long-term Canadian immigration strategy", pct: "85%" }
    ],
    achievements: [
      { icon: "🔬", type: "purple", text: "Vector Institute Researcher", sub: "Working at Canada's premier AI institute alongside top teams." },
      { icon: "💰", type: "gold", text: "Fully Funded Master's", sub: "Secured C$35,000/yr research stipend." },
      { icon: "📝", type: "teal", text: "Published at NeurIPS", sub: "Co-authored a paper accepted at top AI conference." },
      { icon: "🍁", type: "purple", text: "Express Entry Expert", sub: "Deep understanding of how MS degrees translate to CRS points." }
    ],
    helpTags: ["🧠 AI Research Profile", "🔬 Proposals", "✉️ Professor Emails", "🇨🇦 UofT/UBC Admits", "💰 Funding", "📜 LoR Drafting", "🍁 PGWP Strategy", "📊 Publishing"]
  },
  { 
    id:"mentor_04", name:"Maanya", role:"MS Business Analytics", uni:"Manchester", country:"UK", flag:"🇬🇧", tier:"Verified", match:76, 
    img:"https://randomuser.me/api/portraits/women/31.jpg", hex:"#3b82f6", rgb:"59,130,246", 
    sessions:45, rating:4.82, admitRate:"88%",
    badges:["95% Scholar", "Analytics", "Russell Group", "UK"],
    bio:"I help students craft strong SOPs for 1-year UK Master's programs. UK admissions rely heavily on your personal statement. I secured a 95% merit scholarship at Manchester, and I'll help you find programs that balance high Russell Group rankings with actual employability in the UK market.",
    timeline: [
      { status: "done", tag: "Origin · India", text: "B.B.A. & Data Analytics", sub: "GPA: 8.8. Blended business acumen with coding skills." },
      { status: "done", tag: "Current · Manchester", text: "MSc Business Analytics", sub: "Studying at Alliance Manchester Business School on a massive scholarship." },
      { status: "future", tag: "Target · UK", text: "Data Consultant in London", sub: "Leveraging the 2-year UK Graduate Route visa for City of London roles." }
    ],
    expertise: [
      { icon: "🇬🇧", title: "Russell Group Admissions", sub: "Navigating top UK university criteria", pct: "95%" },
      { icon: "📝", title: "UK Personal Statements", sub: "Structuring the perfect 500 words", pct: "98%" },
      { icon: "💷", title: "UK Scholarships", sub: "GREAT, Chevening, and Uni-specific funds", pct: "90%" },
      { icon: "📊", title: "Analytics vs Data Science", sub: "Choosing the right degree hybrid", pct: "92%" },
      { icon: "⏱", title: "1-Year MS Pacing", sub: "Surviving the intense UK academic year", pct: "85%" },
      { icon: "🛂", title: "Graduate Visa (PSW)", sub: "Rules and job hunting strategies", pct: "88%" }
    ],
    achievements: [
      { icon: "💷", type: "teal", text: "95% Merit Scholarship", sub: "Slashed £28,000 tuition to practically zero based on profile strength." },
      { icon: "📊", type: "purple", text: "Analytics Consultant Intern", sub: "Working with a Manchester fintech firm during the dissertation phase." },
      { icon: "📝", type: "gold", text: "SOP Whisperer", sub: "Reviewed and transformed over 30 UK personal statements." },
      { icon: "🇬🇧", type: "teal", text: "UK Visa Expert", sub: "Flawless track record helping mentees with CAS and Tier 4 visa prep." }
    ],
    helpTags: ["🇬🇧 UK Shortlisting", "💷 Scholarships", "⏱ 1-Year MS Survival", "📝 Personal Statements", "📊 Analytics Profiles", "🏢 Russell Group", "🛂 Graduate Visa"]
  },
  { 
    id:"mentor_05", name:"Siddharth Jain", role:"MS Mech Eng", uni:"RWTH Aachen", country:"Germany", flag:"🇩🇪", tier:"Elite", match:91, 
    img:"https://randomuser.me/api/portraits/men/41.jpg", hex:"#00f5d4", rgb:"0,245,212", 
    sessions:156, rating:4.98, admitRate:"97%",
    badges:["APS Expert", "Mechanical", "RWTH Alumni", "Germany"],
    bio:"Mechanical engineering in Germany is the gold standard, but getting into RWTH Aachen or TUM requires mathematical precision in your application. I'll help you map your Indian bachelor's credits to German ECTS requirements to ensure you don't get rejected on technicalities.",
    timeline: [
      { status: "done", tag: "Origin · India", text: "B.Tech Mechanical Engineering", sub: "Gold Medalist. Heavy focus on Thermodynamics and Fluid Mechanics." },
      { status: "done", tag: "Current · RWTH Aachen", text: "MSc Automotive Engineering", sub: "Studying at Europe's premier mechanical hub. Interning at a major German OEM." },
      { status: "future", tag: "Target · Germany", text: "R&D Engineer at Porsche/BMW", sub: "Transitioning internship into a full-time role in Munich or Stuttgart." }
    ],
    expertise: [
      { icon: "⚙️", title: "Core Engineering Profiles", sub: "Positioning Mech/Auto/Aero applicants", pct: "99%" },
      { icon: "📐", title: "ECTS Credit Matching", sub: "The #1 reason Indian students get rejected", pct: "98%" },
      { icon: "🏛", title: "TU9 Admissions", sub: "Cracking RWTH, TUM, KIT, TU Berlin", pct: "95%" },
      { icon: "📄", title: "APS & VPD", sub: "Navigating the German bureaucracy", pct: "92%" },
      { icon: "🚗", title: "German Auto Industry", sub: "Getting internships at VW, BMW, Bosch", pct: "90%" },
      { icon: "🗣", title: "German Language", sub: "Balancing English MS with German B1/B2", pct: "85%" }
    ],
    achievements: [
      { icon: "🏛", type: "teal", text: "Admitted to 5/5 TU9 Universities", sub: "Cracked the toughest mechanical engineering programs in Europe." },
      { icon: "🚗", type: "gold", text: "R&D Intern at German OEM", sub: "Secured a highly coveted 6-month internship in automotive design." },
      { icon: "📐", type: "purple", text: "Credit Mapping Master", sub: "Developed a proprietary tool to map Indian credits to ECTS." },
      { icon: "🇩🇪", type: "teal", text: "Goethe B2 Certified", sub: "Mastered the language while managing a brutal engineering curriculum." }
    ],
    helpTags: ["⚙️ Core Engineering", "🏛 TU9 Applications", "📐 ECTS Mapping", "📄 APS / Uni-Assist", "✍️ Technical SOPs", "🚗 OEM Internships", "🗣 Language Strategy"]
  },
  { 
    id:"mentor_06", name:"Ananya Iyer", role:"MS Software Eng", uni:"Northeastern", country:"USA", flag:"🇺🇸", tier:"Verified", match:83, 
    img:"https://randomuser.me/api/portraits/women/24.jpg", hex:"#FFB800", rgb:"255,184,0", 
    sessions:72, rating:4.85, admitRate:"89%",
    badges:["Co-op Programs", "Software Eng", "Amazon", "USA"],
    bio:"I help students understand US Co-op programs and industry-focused degrees. I chose Northeastern over higher-ranked academic schools purely for the Co-op, which landed me an Amazon role. I'll show you how to pick schools that actually get you a job in the US tech market.",
    timeline: [
      { status: "done", tag: "Origin · India", text: "B.E. Computer Engineering", sub: "Solid coder, average GPA. Focus was on building full-stack applications." },
      { status: "done", tag: "Current · Boston", text: "MS Software Engineering @ NEU", sub: "Leveraged NEU's legendary Co-op program to bypass standard internship hunting." },
      { status: "future", tag: "Target · USA", text: "SDE II at Amazon Web Services", sub: "Converting Co-op into a full-time H1-B sponsored role." }
    ],
    expertise: [
      { icon: "🤝", title: "Co-op Universities", sub: "NEU, RIT, SJSU — maximizing job chances", pct: "98%" },
      { icon: "💻", title: "Software Engineering", sub: "Building a dev-focused application", pct: "95%" },
      { icon: "📝", title: "Tech Resumes", sub: "Converting Indian CVs to ATS-friendly US formats", pct: "92%" },
      { icon: "🇺🇸", title: "F-1 & CPT Strategy", sub: "Rules for working while studying", pct: "90%" },
      { icon: "🏢", title: "Big Tech Interviews", sub: "LeetCode, System Design prep timelines", pct: "88%" },
      { icon: "🏙", title: "Boston Ecosystem", sub: "Living and networking in the East Coast tech hub", pct: "85%" }
    ],
    achievements: [
      { icon: "🏢", type: "gold", text: "Amazon Co-op Secured", sub: "Bypassed the brutal US job market through university channels." },
      { icon: "📝", type: "teal", text: "Resume Wizard", sub: "Helped 30+ students clear initial ATS screens for US internships." },
      { icon: "🤝", type: "purple", text: "NEU Admissions Expert", sub: "Deep understanding of Northeastern's rolling admissions and campus choices." },
      { icon: "💻", type: "gold", text: "Full-Stack Portfolio", sub: "Built a US-grade GitHub portfolio that offsets average undergrad grades." }
    ],
    helpTags: ["🤝 Co-op Programs", "🇺🇸 US Shortlisting", "💻 SDE Profiles", "📝 US Resumes", "🏢 Big Tech Prep", "🏙 Boston Life", "🛂 CPT / OPT Rules"]
  },
  { 
    id:"mentor_07", name:"Rohan Patel", role:"MS CS", uni:"Trinity Dublin", country:"Ireland", flag:"🇮🇪", tier:"Elite", match:82, 
    img:"https://randomuser.me/api/portraits/men/86.jpg", hex:"#FF5E8A", rgb:"255,94,138", 
    sessions:64, rating:4.91, admitRate:"90%",
    badges:["Ireland", "EU Jobs", "Visa Guidance", "Stripe Network"],
    bio:"I guide students interested in studying and working in Ireland and the EU tech market. TCD is a launchpad into European Big Tech. I'll help you build a realistic path to roles like mine and navigate the Irish Stamp 1G visa.",
    timeline: [
      { status: "done", tag: "Origin · India", text: "B.Tech IT", sub: "GPA: 8.5/10. Multiple internships in backend development." },
      { status: "done", tag: "Current · Dublin", text: "MSc Computer Science @ TCD", sub: "Graduated with Distinction. Secured role at Stripe EMEA HQ." },
      { status: "future", tag: "Target · Europe", text: "Senior Engineer at Stripe", sub: "Leveraging Stamp 1G visa to transition into Critical Skills Employment Permit." }
    ],
    expertise: [
      { icon: "🇮🇪", title: "Irish Admissions", sub: "Cracking TCD, UCD, and Galway", pct: "98%" },
      { icon: "🛂", title: "Stamp 1G Visa", sub: "Navigating post-study work rules in Ireland", pct: "95%" },
      { icon: "💻", title: "EU Tech Market", sub: "Getting hired at Google, Meta, Stripe in Dublin", pct: "92%" },
      { icon: "📝", title: "European CVs", sub: "Tailoring resumes for the Irish market", pct: "90%" },
      { icon: "🏠", title: "Dublin Housing", sub: "Surviving the brutal Dublin rental market", pct: "88%" },
      { icon: "💰", title: "Cost & ROI", sub: "Calculating actual living costs in Ireland", pct: "85%" }
    ],
    achievements: [
      { icon: "💻", type: "purple", text: "Stripe Engineer", sub: "Secured a highly competitive role at Stripe's European HQ." },
      { icon: "🇮🇪", type: "gold", text: "TCD Global Excellence Scholar", sub: "Awarded €5,000 scholarship based on academic merit." },
      { icon: "🛂", type: "teal", text: "Visa Strategy", sub: "Successfully navigated the transition from student to critical skills visa." },
      { icon: "🎓", type: "purple", text: "Distinction Graduate", sub: "Top 5% of MSc Computer Science cohort at Trinity College." }
    ],
    helpTags: ["🇮🇪 Ireland Unis", "🛂 Stamp 1G Visa", "💻 EU Tech Jobs", "📝 Euro CVs", "🏠 Dublin Housing", "💰 ROI Math", "🎓 TCD Admissions"]
  },
  { 
    id:"mentor_08", name:"Priya Malhotra", role:"MS Info Systems", uni:"U of Melbourne", country:"Australia", flag:"🇦🇺", tier:"Verified", match:77, 
    img:"https://randomuser.me/api/portraits/women/88.jpg", hex:"#00D4FF", rgb:"0,212,255", 
    sessions:58, rating:4.84, admitRate:"87%",
    badges:["Australia", "IT", "PR Points", "Visa Strategy"],
    bio:"I help students plan Australian education with absolute clarity on visas and job pathways. I'll show you how to calculate your PR points, which degrees maximise your chances, and how to land part-time roles that actually pay well.",
    timeline: [
      { status: "done", tag: "Origin · India", text: "BSc Computer Science", sub: "GPA: 8.2/10. 2 years work experience at Infosys." },
      { status: "done", tag: "Current · Melbourne", text: "Master of Information Systems", sub: "Balancing studies with a professional part-time role at a local tech firm." },
      { status: "future", tag: "Target · Australia", text: "IT Consultant", sub: "Aiming for subclass 189/190 PR pathways post-graduation." }
    ],
    expertise: [
      { icon: "🇦🇺", title: "Aussie Admissions", sub: "Group of 8 shortlisting (UniMelb, UNSW, USyd)", pct: "96%" },
      { icon: "🧮", title: "PR Points Strategy", sub: "Calculating and maximizing immigration points", pct: "94%" },
      { icon: "🛂", title: "Subclass 500 Visa", sub: "GTE (Genuine Temporary Entrant) statements", pct: "92%" },
      { icon: "💼", title: "Part-time Jobs", sub: "Finding professional roles over retail jobs", pct: "88%" },
      { icon: "🎓", title: "Info Systems Profiles", sub: "Bridging business and tech", pct: "85%" },
      { icon: "🏙", title: "Life in Melbourne", sub: "Housing, transport, and networking", pct: "82%" }
    ],
    achievements: [
      { icon: "🇦🇺", type: "teal", text: "Group of 8 Admit", sub: "Received offers from top 3 universities in Australia." },
      { icon: "💼", type: "purple", text: "Professional Part-time", sub: "Secured a relevant IT consulting part-time job paying $35/hr." },
      { icon: "🧮", type: "gold", text: "PR Strategy Planner", sub: "Mapped out exact state-sponsorship pathways for IT graduates." },
      { icon: "📝", type: "teal", text: "GTE Expert", sub: "Helped 15+ students draft flawless Genuine Temporary Entrant letters." }
    ],
    helpTags: ["🇦🇺 Go8 Admissions", "🧮 PR Points Calc", "🛂 GTE Statements", "💼 Aussie Jobs", "🎓 Info Systems", "🏙 Melbourne Life", "💰 Scholarships"]
  },
  { 
    id:"mentor_09", name:"Mohit Aggarwal", role:"MS Data Engineering", uni:"TU Berlin", country:"Germany", flag:"🇩🇪", tier:"Verified", match:85, 
    img:"https://randomuser.me/api/portraits/men/64.jpg", hex:"#00E5A8", rgb:"0,229,168", 
    sessions:42, rating:4.79, admitRate:"85%",
    badges:["Data Engineering", "Public Unis", "Work Ex", "Germany"],
    bio:"Focused on data engineering programs in Germany and public university admissions. I help students with 1–3 years work experience navigate realistic German MS pathways and convert their Indian tech experience into European job offers.",
    timeline: [
      { status: "done", tag: "Origin · India", text: "B.Tech + 2 Yrs Work Ex", sub: "Worked as Data Engineer at TCS. Wanted a global career." },
      { status: "done", tag: "Current · Berlin", text: "MSc Computer Science (Data Focus)", sub: "Got into TU Berlin. Working as a Werkstudent (working student) at a Berlin startup." },
      { status: "future", tag: "Target · Germany", text: "Data Architect", sub: "Converting Werkstudent role into full-time sponsorship." }
    ],
    expertise: [
      { icon: "🏛", title: "TU Berlin Admits", sub: "Cracking the complex admission rubrics", pct: "95%" },
      { icon: "📊", title: "Data Engineering", sub: "Positioning profiles for data-heavy roles", pct: "92%" },
      { icon: "💼", title: "Werkstudent Roles", sub: "Finding working student jobs in Berlin", pct: "90%" },
      { icon: "📝", title: "Work Ex Translation", sub: "Making Indian experience count in the EU", pct: "88%" },
      { icon: "📄", title: "VPD & Uni-Assist", sub: "Navigating document bureaucracy", pct: "85%" },
      { icon: "🗣", title: "Berlin Life", sub: "Surviving the housing crisis in the capital", pct: "82%" }
    ],
    achievements: [
      { icon: "💼", type: "teal", text: "Startup Werkstudent", sub: "Secured a data engineering role at a hot Berlin fintech startup." },
      { icon: "🏛", type: "purple", text: "TU Berlin Admit", sub: "Successfully mapped Indian B.Tech credits to strict TU requirements." },
      { icon: "📊", type: "gold", text: "Data Stack Master", sub: "Built cloud data pipelines using Kafka, Spark, and AWS." },
      { icon: "🏠", type: "teal", text: "WG Finder", sub: "Cracked the impossible Berlin housing market within 2 weeks." }
    ],
    helpTags: ["🏛 TU Berlin", "📊 Data Eng", "💼 Werkstudent Jobs", "📝 Indian Work Ex", "📄 Uni-Assist", "🏠 Berlin Housing", "🗣 German A1/A2"]
  },
  { 
    id:"mentor_10", name:"Simran Kaur", role:"MS Marketing", uni:"University of Leeds", country:"UK", flag:"🇬🇧", tier:"Verified", match:74, 
    img:"https://randomuser.me/api/portraits/women/62.jpg", hex:"#00D4FF", rgb:"0,212,255", 
    sessions:35, rating:4.88, admitRate:"90%",
    badges:["Marketing", "Portfolio Review", "Scholarships", "UK"],
    bio:"I guide students applying to marketing and management programs in the UK. I'll help you build a strong portfolio and translate your profile into a compelling UK application that stands out to Russell Group business schools.",
    timeline: [
      { status: "done", tag: "Origin · India", text: "BBA Marketing", sub: "GPA: 8.5/10. Digital marketing internships at 2 agencies." },
      { status: "done", tag: "Current · Leeds", text: "MA Digital Marketing", sub: "Studying at Leeds University Business School. Awarded International Excellence Scholarship." },
      { status: "future", tag: "Target · UK", text: "Brand Manager", sub: "Targeting FMCG companies in London post-graduation." }
    ],
    expertise: [
      { icon: "📱", title: "Digital Marketing", sub: "Positioning creative & analytical skills", pct: "96%" },
      { icon: "🇬🇧", title: "UK Business Schools", sub: "Leeds, Manchester, Warwick admissions", pct: "94%" },
      { icon: "🎨", title: "Portfolio Building", sub: "Showcasing campaigns and ROI", pct: "90%" },
      { icon: "💷", title: "Excellence Scholarships", sub: "Writing essays that win funding", pct: "88%" },
      { icon: "📝", title: "Personal Statements", sub: "Storytelling for creative programs", pct: "85%" },
      { icon: "💼", title: "UK Placements", sub: "Navigating graduate schemes", pct: "80%" }
    ],
    achievements: [
      { icon: "💷", type: "gold", text: "Excellence Scholarship", sub: "Awarded £5,000 merit scholarship from Leeds Business School." },
      { icon: "📱", type: "purple", text: "Agency Experience", sub: "Parleyed Indian internship experience into UK interview calls." },
      { icon: "🎨", type: "teal", text: "Portfolio Reviewer", sub: "Helped 15+ students revamp their digital marketing portfolios." },
      { icon: "🇬🇧", type: "gold", text: "Russell Group Admits", sub: "Received offers from 4 top-tier UK business schools." }
    ],
    helpTags: ["📱 Marketing MS", "🇬🇧 UK Business Schools", "🎨 Portfolios", "💷 Scholarships", "📝 Personal Statements", "💼 Graduate Schemes"]
  },
  { 
    id:"mentor_11", name:"Aditya Rao", role:"MS Business Analytics", uni:"UT Dallas", country:"USA", flag:"🇺🇸", tier:"Elite", match:86, 
    img:"https://randomuser.me/api/portraits/men/53.jpg", hex:"#FFB800", rgb:"255,184,0", 
    sessions:92, rating:4.94, admitRate:"93%",
    badges:["Analytics", "STEM OPT", "Supply Chain", "USA"],
    bio:"Helping students choose analytics programs with strong career outcomes. I know exactly which programs have strong STEM OPT placement records and supply-chain industry connections. UT Dallas is an ROI powerhouse if played right.",
    timeline: [
      { status: "done", tag: "Origin · India", text: "B.Tech + Supply Chain Exp", sub: "Worked 2 years in operations before pivoting to data." },
      { status: "done", tag: "Current · Texas", text: "MS Business Analytics @ UTD", sub: "Secured Dean's Excellence Scholarship giving in-state tuition." },
      { status: "future", tag: "Target · USA", text: "Supply Chain Data Scientist", sub: "Interning at a major logistics firm in Texas." }
    ],
    expertise: [
      { icon: "📊", title: "Business Analytics", sub: "UTD, UIUC, Purdue admissions", pct: "98%" },
      { icon: "💰", title: "In-State Tuition Hacks", sub: "Getting scholarships that slash fees", pct: "96%" },
      { icon: "🇺🇸", title: "Texas Tech Boom", sub: "Leveraging the Austin/Dallas job market", pct: "92%" },
      { icon: "🚚", title: "Supply Chain Tech", sub: "Niche positioning for jobs", pct: "90%" },
      { icon: "📝", title: "Analytics SOPs", sub: "Blending business logic with coding", pct: "88%" },
      { icon: "🛂", title: "STEM OPT Rules", sub: "Navigating the 3-year work visa extension", pct: "85%" }
    ],
    achievements: [
      { icon: "💰", type: "gold", text: "In-State Tuition Waiver", sub: "Secured $1,000 scholarship which unlocked a $15,000 tuition reduction." },
      { icon: "🚚", type: "teal", text: "Logistics Data Intern", sub: "Landed a high-paying internship in the Dallas supply chain hub." },
      { icon: "📊", type: "purple", text: "UTD JSOM Expert", sub: "Deep knowledge of Jindal School of Management course tracking." },
      { icon: "🇺🇸", type: "gold", text: "Texas Networking", sub: "Built a strong pipeline to recruiters in the growing Texas market." }
    ],
    helpTags: ["📊 MSBA Programs", "💰 In-State Tuition", "🇺🇸 Texas Job Market", "🚚 Supply Chain", "📝 Analytics SOPs", "🛂 STEM OPT", "💼 Internships"]
  },
  { 
    id:"mentor_12", name:"Sneha Banerjee", role:"MA Economics", uni:"UBC Vancouver", country:"Canada", flag:"🇨🇦", tier:"Verified", match:72, 
    img:"https://randomuser.me/api/portraits/women/4.jpg", hex:"#8B7FFF", rgb:"139,127,255", 
    sessions:28, rating:4.81, admitRate:"82%",
    badges:["Economics", "Funding", "Research Proposal", "Canada"],
    bio:"I help economics and social science students plan admissions and funding in Canada. Secured full International Tuition Award at UBC. Research proposal writing is often the key — I'll help you nail it.",
    timeline: [
      { status: "done", tag: "Origin · India", text: "BA Economics", sub: "Top of class at Delhi University. Strong math background." },
      { status: "done", tag: "Current · Vancouver", text: "MA Economics @ UBC", sub: "Fully funded via TA roles and International Tuition Award." },
      { status: "future", tag: "Target · Canada", text: "Economic Consultant", sub: "Targeting public sector and consulting roles in BC." }
    ],
    expertise: [
      { icon: "📈", title: "Economics Masters", sub: "UBC, UofT, McGill admissions", pct: "95%" },
      { icon: "💰", title: "Full Funding Paths", sub: "Securing TA/RA roles in Arts", pct: "92%" },
      { icon: "🔬", title: "Research Proposals", sub: "Writing compelling econ thesis pitches", pct: "90%" },
      { icon: "🇨🇦", title: "Canadian Top Tier", sub: "Navigating strict GPA cutoffs", pct: "88%" },
      { icon: "📝", title: "Academic Writing", sub: "Polishing writing samples", pct: "85%" },
      { icon: "🍁", title: "BC PNP Pathways", sub: "Provincial Nominee Program for grads", pct: "82%" }
    ],
    achievements: [
      { icon: "💰", type: "purple", text: "International Tuition Award", sub: "Secured funding that completely offsets international fees." },
      { icon: "👩‍🏫", type: "teal", text: "Lead TA for Microeconomics", sub: "Earning a stipend while building academic credentials." },
      { icon: "📈", type: "gold", text: "UBC VSE Scholar", sub: "Admitted to one of the world's top 25 economics departments." },
      { icon: "🍁", type: "purple", text: "Immigration Planner", sub: "Clear roadmap mapped for British Columbia PR." }
    ],
    helpTags: ["📈 Econ Masters", "💰 Full Funding", "🔬 Research Proposals", "🇨🇦 Top Tier Canada", "📝 Writing Samples", "🍁 BC PNP"]
  },
  { 
    id:"mentor_13", name:"Yash Kulkarni", role:"MS Robotics", uni:"KIT Karlsruhe", country:"Germany", flag:"🇩🇪", tier:"Verified", match:80, 
    img:"https://randomuser.me/api/portraits/men/36.jpg", hex:"#00E5A8", rgb:"0,229,168", 
    sessions:54, rating:4.89, admitRate:"91%",
    badges:["Robotics", "Automation", "HiWi Research", "Germany"],
    bio:"Focused on robotics and automation programs in Germany. KIT is THE place for robotics in Germany. I'll help you build the technical SOP that gets you past the initial profile screening and guide you on finding research assistantships.",
    timeline: [
      { status: "done", tag: "Origin · India", text: "B.Tech Mechatronics", sub: "Built custom drones and rovers. Heavy hardware + software portfolio." },
      { status: "done", tag: "Current · Karlsruhe", text: "MSc Robotics & Automation @ KIT", sub: "Working as a HiWi at the Institute for Anthropomatics." },
      { status: "future", tag: "Target · Germany", text: "Robotics Engineer", sub: "Targeting roles at KUKA, Bosch, or Munich startups." }
    ],
    expertise: [
      { icon: "🤖", title: "Robotics Admissions", sub: "KIT, TUM, Stuttgart shortlisting", pct: "96%" },
      { icon: "💻", title: "Tech Portfolios", sub: "Showcasing ROS, C++, and hardware projects", pct: "94%" },
      { icon: "🔬", title: "HiWi Assistantships", sub: "Landing research jobs in German institutes", pct: "90%" },
      { icon: "⚙️", title: "Mechatronics Pivot", sub: "Moving from Mech/EE to pure Robotics", pct: "88%" },
      { icon: "📄", title: "APS for Engineers", sub: "Technical interview prep for APS", pct: "85%" },
      { icon: "🇩🇪", title: "Baden-Württemberg", sub: "Living in the engineering heartland", pct: "82%" }
    ],
    achievements: [
      { icon: "🤖", type: "teal", text: "KIT Robotics Admit", sub: "Cracked one of Europe's most selective robotics programs." },
      { icon: "🔬", type: "purple", text: "Institute HiWi", sub: "Working on computer vision for autonomous robots." },
      { icon: "💻", type: "gold", text: "ROS Expert", sub: "Built a GitHub portfolio that bypassed average grades." },
      { icon: "⚙️", type: "teal", text: "Industry Network", sub: "Strong connections to automation companies in South Germany." }
    ],
    helpTags: ["🤖 Robotics MS", "💻 GitHub Portfolio", "🔬 HiWi Jobs", "⚙️ Mechatronics", "📄 APS Tech Prep", "🇩🇪 KIT Admissions"]
  },
  { 
    id:"mentor_14", name:"Tanvi Deshpande", role:"MS Finance", uni:"University of Bristol", country:"UK", flag:"🇬🇧", tier:"Verified", match:78, 
    img:"https://randomuser.me/api/portraits/women/65.jpg", hex:"#00D4FF", rgb:"0,212,255", 
    sessions:48, rating:4.86, admitRate:"88%",
    badges:["Finance", "CFA L1", "Think Big Scholar", "UK Banking"],
    bio:"I guide finance applicants with strong SOP and profile alignment. CFA L1 + B.Com background. I specialize in getting students into UK Finance MSc programs that actually lead to corporate banking and analyst roles.",
    timeline: [
      { status: "done", tag: "Origin · India", text: "B.Com + CFA Level 1", sub: "Strong quant background. Cleared CFA L1 in final year." },
      { status: "done", tag: "Current · Bristol", text: "MSc Finance & Investment", sub: "Think Big Scholarship recipient. Active in the investment society." },
      { status: "future", tag: "Target · UK", text: "Investment Banking Analyst", sub: "Navigating London graduate schemes." }
    ],
    expertise: [
      { icon: "📈", title: "Finance Admissions", sub: "Bristol, Warwick, Bayes shortlisting", pct: "95%" },
      { icon: "💷", title: "Think Big Scholarship", sub: "Writing winning scholarship essays", pct: "92%" },
      { icon: "📊", title: "CFA Leverage", sub: "Using professional certs for admission", pct: "90%" },
      { icon: "📝", title: "Finance SOPs", sub: "Showing quant readiness", pct: "88%" },
      { icon: "💼", title: "UK Banking Jobs", sub: "Spring weeks and grad schemes", pct: "85%" },
      { icon: "🇬🇧", title: "UK Tier 4 Visa", sub: "Financial proof documentation", pct: "82%" }
    ],
    achievements: [
      { icon: "💷", type: "gold", text: "Think Big Scholar", sub: "Awarded £10,000 scholarship from Bristol University." },
      { icon: "📊", type: "teal", text: "CFA integration", sub: "Successfully leveraged CFA L1 to offset average B.Com grades." },
      { icon: "💼", type: "purple", text: "Grad Scheme Interviews", sub: "Secured interviews with top 4 UK banks." },
      { icon: "🇬🇧", type: "teal", text: "Finance Network", sub: "Active leadership in university investment fund." }
    ],
    helpTags: ["📈 MS Finance", "💷 Scholarships", "📊 CFA Advantage", "📝 Finance SOPs", "💼 Grad Schemes", "🇬🇧 UK Visa Proof"]
  },
  { 
    id:"mentor_15", name:"Naveen Reddy", role:"MS Cyber Security", uni:"Monash University", country:"Australia", flag:"🇦🇺", tier:"Verified", match:75, 
    img:"https://randomuser.me/api/portraits/men/91.jpg", hex:"#FF5E8A", rgb:"255,94,138", 
    sessions:39, rating:4.78, admitRate:"84%",
    badges:["Cyber Security", "Certifications", "Monash Scholar", "PR"],
    bio:"I help students planning cybersecurity careers in Australia. Monash Intl Leadership Scholar. I'll guide you on which certifications (Security+, CEH) to pursue alongside your degree to land security roles in Melbourne or Sydney.",
    timeline: [
      { status: "done", tag: "Origin · India", text: "B.Tech CS + 1 Yr Exp", sub: "Worked in IT support, self-studied security certs." },
      { status: "done", tag: "Current · Melbourne", text: "Master of Cybersecurity @ Monash", sub: "Secured International Study Grant. Interning as SOC Analyst." },
      { status: "future", tag: "Target · Australia", text: "Security Engineer", sub: "Aiming for 189 PR visa with cyber security occupation code." }
    ],
    expertise: [
      { icon: "🔐", title: "Cyber Sec Admissions", sub: "Monash, RMIT, UNSW shortlisting", pct: "96%" },
      { icon: "📜", title: "Certifications Strategy", sub: "Balancing degree with CompTIA/CISSP", pct: "94%" },
      { icon: "🇦🇺", title: "Australian IT Jobs", sub: "Landing SOC Analyst roles as a student", pct: "90%" },
      { icon: "🧮", title: "Cyber PR Pathways", sub: "ACS skill assessment guidelines", pct: "88%" },
      { icon: "💰", title: "Monash Grants", sub: "Securing international study grants", pct: "85%" },
      { icon: "🏙", title: "Melbourne Tech Scene", sub: "Networking in the security community", pct: "82%" }
    ],
    achievements: [
      { icon: "💰", type: "purple", text: "Monash Study Grant", sub: "Awarded A$10,000 grant based on academic profile." },
      { icon: "🔐", type: "teal", text: "SOC Analyst Intern", sub: "Secured a highly relevant part-time role in a security operations center." },
      { icon: "📜", type: "gold", text: "Security+ Certified", sub: "Passed key industry certs alongside university coursework." },
      { icon: "🧮", type: "purple", text: "ACS Strategy", sub: "Clear roadmap for Australian Computer Society skill assessment." }
    ],
    helpTags: ["🔐 Cyber Security MS", "📜 IT Certifications", "🇦🇺 Aussie Tech Jobs", "🧮 ACS Assessment", "💰 Monash Grants", "🏙 Melbourne Network"]
  }
];

const SESSIONS = [
  { day: 'Monday', time: '07:00–07:30', tz: 'Local Time', id: 's1' },
  { day: 'Monday', time: '18:00–18:30', tz: 'Local Time', id: 's2' },
]

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Syne:wght@400;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');

.mp-root {
  --purple:#a855f7; --gold:#f59e0b; --green:#34d399; 
  --bg:#060c14; --bg2:#0d1520; --bg3:#111c2e;
  --border:rgba(255,255,255,0.07); --text:#e2e8f0; --muted:#64748b;
  background: var(--bg); color: var(--text); font-family: 'Syne', sans-serif;
  min-height: 100vh; overflow-x: hidden; position: relative;
}

.mp-root * { box-sizing: border-box; margin: 0; padding: 0; }
.mp-root a { text-decoration: none; color: inherit; }
.mp-root button { cursor: pointer; font-family: 'Syne', sans-serif; }

/* ── GRID + ORBS ── */
.mp-grid-bg { position: fixed; inset: 0; z-index: 0; pointer-events: none; background-image: linear-gradient(rgba(255,255,255,.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.015) 1px, transparent 1px); background-size: 60px 60px; }
.mp-orb { position: fixed; border-radius: 50%; pointer-events: none; z-index: 0; filter: blur(130px); opacity: .12; }
.mp-orb1 { width: 700px; height: 700px; top: -200px; right: -100px; }
.mp-orb2 { width: 500px; height: 500px; background: var(--purple); bottom: -100px; left: -150px; }

/* ── NAV ── */
.mp-nav { position: fixed; top: 0; left: 0; right: 0; z-index: 200; height: 64px; display: flex; align-items: center; justify-content: space-between; padding: 0 48px; background: rgba(6,12,20,.88); backdrop-filter: blur(20px); border-bottom: 1px solid var(--border); }
.mp-nav-logo { display: flex; align-items: center; gap: 10px; font-size: 1.1rem; font-weight: 700; color: #fff; }
.mp-logo-icon { width: 34px; height: 34px; border-radius: 9px; display: flex; align-items: center; justify-content: center; font-size: 16px; }
.mp-nav-logo em { font-style: normal; }
.mp-back-pill { display: inline-flex; align-items: center; gap: 6px; padding: 7px 14px; border: 1px solid var(--border); border-radius: 100px; color: var(--muted); font-size: .78rem; font-weight: 600; transition: all .2s; }
.mp-back-pill:hover { color: #fff; border-color: rgba(255,255,255,.2); }

/* AUTH BUTTONS */
.mp-nav-r { display: flex; align-items: center; gap: 14px; }
.mp-btn-g { padding: 8px 18px; border: 1px solid var(--border); border-radius: 8px; color: #fff; font-size: .82rem; font-weight: 600; background: none; transition: border-color .2s; }
.mp-btn-g:hover { border-color: rgba(255,255,255,.25); }
.mp-btn-p { padding: 8px 20px; border-radius: 8px; border: none; color: #060c14; font-size: .82rem; font-weight: 700; }

/* ── MAIN LAYOUT ── */
.mp-main { position: relative; z-index: 1; padding-top: 64px; }
.mp-page-wrap { max-width: 1400px; margin: 0 auto; padding: 48px 48px 80px; }

/* ── BREADCRUMB ── */
.mp-crumb { display: flex; align-items: center; gap: 8px; font-size: .72rem; font-family: 'JetBrains Mono', monospace; color: var(--muted); margin-bottom: 40px; letter-spacing: .06em; }
.mp-crumb a:hover { color: var(--theme-col); }
.mp-crumb-sep { color: rgba(255,255,255,.15); }
.mp-crumb-cur { color: var(--theme-col); }

/* ── HERO STRIP ── */
.mp-hero-strip { position: relative; margin-bottom: 36px; padding: 40px; background: var(--bg2); border: 1px solid var(--border); border-radius: 24px; overflow: hidden; display: flex; gap: 40px; align-items: flex-end; }
.mp-hs-bg-pattern { position: absolute; inset: 0; opacity: .04; background-size: 20px 20px; pointer-events: none; }
.mp-hs-glow { position: absolute; top: -80px; left: 160px; width: 400px; height: 400px; pointer-events: none; }

/* AVATAR */
.mp-av-wrap { position: relative; width: 160px; height: 160px; flex-shrink: 0; }
.mp-av-ring-outer { position: absolute; inset: -10px; border-radius: 50%; animation: ring-spin 5s linear infinite; }
.mp-av-ring-outer::after { content: ''; position: absolute; inset: 5px; background: var(--bg2); border-radius: 50%; }
.mp-av-ring-inner { position: absolute; inset: -4px; border-radius: 50%; animation: ring-spin 3s linear infinite reverse; }
.mp-av-ring-inner::after { content: ''; position: absolute; inset: 3px; background: var(--bg2); border-radius: 50%; }
.mp-av-img { position: absolute; inset: 12px; width: calc(100% - 24px); height: calc(100% - 24px); border-radius: 50%; object-fit: cover; z-index: 2; border: 2px solid rgba(255,255,255,.1); }
.mp-av-status { position: absolute; bottom: 14px; right: 14px; width: 14px; height: 14px; border-radius: 50%; background: var(--green); border: 2px solid var(--bg2); z-index: 3; box-shadow: 0 0 8px var(--green); }
@keyframes ring-spin { 100% { transform: rotate(360deg); } }

/* HERO META */
.mp-hs-meta { flex: 1; position: relative; z-index: 1; }
.mp-hs-badges { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 14px; }
.mp-hb { display: inline-flex; align-items: center; gap: 5px; padding: 4px 10px; border-radius: 100px; font-size: .65rem; font-family: 'JetBrains Mono', monospace; letter-spacing: .08em; font-weight: 600; }
.mp-hb-verified { border: 1px solid; }
.mp-hb-country { background: rgba(255,255,255,.05); border: 1px solid var(--border); color: var(--muted); }
.mp-hs-name { font-family: 'Bebas Neue', sans-serif; font-size: clamp(56px, 6vw, 88px); line-height: .9; color: #fff; letter-spacing: .02em; margin-bottom: 10px; }
.mp-hs-role { font-size: 1rem; color: var(--muted); display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
.mp-hs-role strong { color: var(--text); }
.mp-hs-role .mp-dot { width: 4px; height: 4px; border-radius: 50%; background: var(--border); flex-shrink: 0; }

/* HERO RIGHT STATS */
.mp-hs-stats { display: flex; flex-direction: column; gap: 12px; flex-shrink: 0; align-self: center; }
.mp-hstat { background: rgba(255,255,255,.03); border: 1px solid var(--border); border-radius: 12px; padding: 14px 20px; text-align: center; min-width: 100px; }
.mp-hstat-num { font-family: 'Bebas Neue', sans-serif; font-size: 1.8rem; letter-spacing: .04em; line-height: 1; }
.mp-hstat-lbl { font-size: .6rem; font-family: 'JetBrains Mono', monospace; color: var(--muted); letter-spacing: .08em; margin-top: 3px; }

/* ── BODY GRID ── */
.mp-body-grid { display: grid; grid-template-columns: 1fr 380px; gap: 28px; align-items: start; }
@media(max-width:1100px) { .mp-body-grid { grid-template-columns: 1fr; } }

/* ── CARDS ── */
.mp-card { background: var(--bg2); border: 1px solid var(--border); border-radius: 20px; padding: 28px; position: relative; overflow: hidden; transition: border-color .25s; }
.mp-card:hover { border-color: rgba(255,255,255,.12); }
.mp-card-label { font-size: .62rem; font-family: 'JetBrains Mono', monospace; letter-spacing: .12em; margin-bottom: 14px; display: flex; align-items: center; gap: 6px; text-transform: uppercase; }
.mp-card-label::before { content: ''; width: 18px; height: 1px; }
.mp-card-title { font-family: 'Bebas Neue', sans-serif; font-size: 1.5rem; color: #fff; letter-spacing: .04em; margin-bottom: 20px; text-transform: uppercase; }

/* BIO TERMINAL */
.mp-term { background: #040910; border: 1px solid rgba(255,255,255,.1); border-radius: 14px; padding: 22px; font-family: 'JetBrains Mono', monospace; font-size: .82rem; color: #6b7280; line-height: 1.8; position: relative; overflow: hidden; margin-bottom: 24px; }
.mp-term::before { content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 3px; }
.mp-term-line { display: block; }
.mp-term-output { color: #c4b5fd; font-size: .85rem; }
.mp-term-bio { color: #fff; line-height: 1.7; margin-top: 8px; font-family: 'Syne', sans-serif; font-size: .88rem; }
.mp-cursor { display: inline-block; width: 8px; height: 14px; animation: blink .9s infinite; vertical-align: middle; margin-left: 2px; }
@keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }

/* TIMELINE */
.mp-timeline { position: relative; padding-left: 28px; }
.mp-timeline::before { content: ''; position: absolute; left: 7px; top: 10px; bottom: 10px; width: 2px; background: linear-gradient(180deg, var(--theme-col) 0%, var(--purple) 60%, rgba(168,85,247,0) 100%); }
.mp-tl-item { position: relative; margin-bottom: 28px; }
.mp-tl-item:last-child { margin-bottom: 0; }
.mp-tl-dot { position: absolute; left: -28px; top: 5px; width: 16px; height: 16px; border-radius: 50%; border: 2px solid var(--theme-col); background: var(--bg); display: flex; align-items: center; justify-content: center; }
.mp-tl-dot-inner { width: 6px; height: 6px; border-radius: 50%; background: var(--theme-col); }
.mp-tl-dot.future { border-color: var(--purple); box-shadow: none; }
.mp-tl-dot.future .mp-tl-dot-inner { background: var(--purple); }
.mp-tl-tag { font-size: .6rem; font-family: 'JetBrains Mono', monospace; color: var(--muted); letter-spacing: .1em; margin-bottom: 5px; text-transform: uppercase; }
.mp-tl-text { font-size: .9rem; color: var(--text); line-height: 1.5; font-weight: 500; }
.mp-tl-sub { font-size: .76rem; color: var(--muted); margin-top: 4px; line-height: 1.5; }

/* EXPERTISE GRID */
.mp-exp-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.mp-exp-item { background: rgba(255,255,255,.02); border: 1px solid var(--border); border-radius: 12px; padding: 16px; transition: all .2s; position: relative; overflow: hidden; }
.mp-exp-item:hover { border-color: rgba(255,255,255,.2); }
.mp-ei-icon { font-size: 1.4rem; margin-bottom: 8px; }
.mp-ei-title { font-size: .88rem; font-weight: 700; color: #fff; margin-bottom: 3px; }
.mp-ei-sub { font-size: .7rem; color: var(--muted); line-height: 1.4; }
.mp-ei-bar { height: 3px; background: rgba(255,255,255,.05); border-radius: 2px; margin-top: 10px; overflow: hidden; }
.mp-ei-fill { height: 100%; background: linear-gradient(90deg, var(--theme-col), var(--purple)); border-radius: 2px; }

/* ACHIEVEMENTS */
.mp-ach-list { display: flex; flex-direction: column; gap: 10px; }
.mp-ach-item { display: flex; align-items: flex-start; gap: 12px; padding: 12px 14px; background: rgba(255,255,255,.02); border: 1px solid var(--border); border-radius: 12px; transition: border-color .2s; }
.mp-ach-item:hover { border-color: rgba(255,255,255,.15); }
.mp-ach-icon { width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: .9rem; flex-shrink: 0; }
.mp-ach-text { font-size: .82rem; color: var(--text); line-height: 1.45; }
.mp-ach-text span { font-size: .65rem; font-family: 'JetBrains Mono', monospace; color: var(--muted); display: block; margin-top: 2px; }

/* WHAT I HELP WITH */
.mp-help-tags { display: flex; flex-wrap: wrap; gap: 8px; }
.mp-help-tag { padding: 7px 14px; border-radius: 8px; font-size: .78rem; font-weight: 600; display: flex; align-items: center; gap: 6px; border: 1px solid; transition: all .2s; cursor: default; }

/* ── SIDEBAR: BOOKING ENGINE ── */
.mp-sidebar { position: sticky; top: 88px; }
.mp-booking-card { background: var(--bg2); border: 1px solid var(--border); border-radius: 24px; overflow: hidden; box-shadow: 0 48px 100px rgba(0,0,0,.5); }
.mp-bc-hero { padding: 28px; border-bottom: 1px solid var(--border); position: relative; overflow: hidden; }
.mp-bc-hero-name { font-family: 'Bebas Neue', sans-serif; font-size: 1.5rem; color: #fff; letter-spacing: .04em; margin-bottom: 4px; text-transform: uppercase; }
.mp-bc-hero-role { font-size: .75rem; color: var(--muted); font-family: 'JetBrains Mono', monospace; text-transform: uppercase; }
.mp-bc-match { margin-top: 16px; display: flex; align-items: center; gap: 14px; }
.mp-match-ring { position: relative; width: 72px; height: 72px; flex-shrink: 0; }
.mp-match-ring svg { position: absolute; inset: 0; transform: rotate(-90deg); }
.mp-match-ring-num { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; font-family: 'Bebas Neue', sans-serif; font-size: 1.5rem; letter-spacing: .02em; }

.mp-bc-body { padding: 24px; }
.mp-session-slot { display: flex; align-items: center; background: var(--bg3); border: 1px solid var(--border); border-radius: 12px; overflow: hidden; cursor: pointer; transition: all .2s; margin-bottom: 8px; }
.mp-session-slot:hover, .mp-session-slot.selected { background: rgba(255,255,255,.04); }
.mp-ss-day { padding: 12px 14px; border-right: 1px solid var(--border); font-size: .82rem; font-weight: 700; color: #fff; min-width: 88px; }
.mp-ss-time { padding: 12px 14px; flex: 1; font-family: 'JetBrains Mono', monospace; font-size: .8rem; }
.mp-slot-check { padding: 12px; opacity: 0; }
.mp-session-slot.selected .mp-slot-check { opacity: 1; }

.mp-book-btn { width: 100%; padding: 16px; border-radius: 14px; border: none; color: #040910; font-family: 'Syne', sans-serif; font-size: 1rem; font-weight: 800; margin-top: 16px; transition: all .2s; text-transform: uppercase; }
.mp-book-btn:hover { transform: translateY(-2px); }
`;

export default function MentorProfile() {
  const router = useRouter()
  const params = useParams()
  
  const [mounted, setMounted] = useState(false)
  const [selectedSlot, setSelectedSlot] = useState(null)
  
  // Add user state for authentication tracking
  const [user, setUser] = useState(null)

  useEffect(() => { 
    setMounted(true) 
    
    // Check if the user is actually logged in
    const storedUser = localStorage.getItem('mentorBridgeUser')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('mentorBridgeUser');
    setUser(null);
    router.push('/login');
  };

  // Find mentor dynamically
  const mentorId = params?.id || 'mentor_01';
  const mentor = MENTORS.find(m => m.id === mentorId) || MENTORS[0];

  const handleBookSession = () => {
    if (!selectedSlot) {
      alert("Please select a time slot first!");
      return;
    }
    
    // Auth Check: If not logged in, redirect to login page!
    if (!user) {
      router.push(`/login?redirect=/book/${mentor.id}`);
      return;
    }
    
    // If logged in, proceed to booking
    router.push(`/book/${mentor.id}`); 
  }

  if (!mounted) return null;

  return (
    <div className="mp-root" style={{
      '--theme-col': mentor.hex,
      '--theme-rgb': mentor.rgb
    }}>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      
      <div className="mp-grid-bg"></div>
      <div className="mp-orb mp-orb1" style={{background: mentor.hex}}></div>
      <div className="mp-orb mp-orb2"></div>

      {/* TOP NAVIGATION WITH AUTH BUTTONS */}
      <nav className="mp-nav">
        <div style={{display:'flex', alignItems:'center', gap:'20px'}}>
          <Link href="/dashboard/student" className="mp-nav-logo">
            <div className="mp-logo-icon" style={{background: `linear-gradient(135deg, ${mentor.hex}, var(--purple))`}}>🌉</div>
            <span>Mentor<em style={{color: mentor.hex}}>Bridge</em></span>
          </Link>
          <Link href="/mentors" className="mp-back-pill">← Back to Directory</Link>
        </div>
        
        {/* DYNAMIC AUTHENTICATION UI */}
        <div className="mp-nav-r" style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          {user ? (
            <>
              <span style={{fontFamily:'var(--ffb)', fontSize:'14px', fontWeight:'700', color: mentor.hex}}>{user.name}</span>
              <button className="mp-btn-g" onClick={handleLogout}>Log out</button>
            </>
          ) : (
            <>
              <button className="mp-btn-g" onClick={() => router.push('/login')}>Log in</button>
              <button className="mp-btn-p" style={{background: mentor.hex}} onClick={() => router.push('/signup')}>Sign up →</button>
            </>
          )}
        </div>
      </nav>

      <main className="mp-main">
        <div className="mp-page-wrap">
          
          {/* BREADCRUMB */}
          <div className="mp-crumb">
            <Link href="/dashboard/student">Home</Link>
            <span className="mp-crumb-sep">/</span>
            <Link href="/mentors">Mentors</Link>
            <span className="mp-crumb-sep">/</span>
            <span className="mp-crumb-cur">{mentor.flag} {mentor.country}</span>
            <span className="mp-crumb-sep">/</span>
            <span className="mp-crumb-cur">{mentor.name}</span>
          </div>

          {/* HERO STRIP */}
          <div className="mp-hero-strip">
            <div className="mp-hs-bg-pattern" style={{backgroundImage: `repeating-linear-gradient(45deg, ${mentor.hex} 0, ${mentor.hex} 1px, transparent 0, transparent 50%)`}}></div>
            <div className="mp-hs-glow" style={{background: `radial-gradient(ellipse, rgba(${mentor.rgb},.12), transparent 65%)`}}></div>

            <div className="mp-av-wrap">
              <div className="mp-av-ring-outer" style={{background: `conic-gradient(from 0deg, transparent 0%, ${mentor.hex} 30%, transparent 50%, var(--purple) 80%, transparent 100%)`}}></div>
              <div className="mp-av-ring-inner" style={{background: `conic-gradient(from 180deg, transparent 0%, rgba(${mentor.rgb},.3) 50%, transparent 100%)`}}></div>
              <img className="mp-av-img" src={mentor.img} alt={mentor.name}/>
              <div className="mp-av-status"></div>
            </div>

            <div className="mp-hs-meta">
              <div className="mp-hs-badges">
                <div className="mp-hb mp-hb-verified" style={{background: `rgba(${mentor.rgb},.08)`, borderColor: `rgba(${mentor.rgb},.25)`, color: mentor.hex}}>✦ {mentor.tier.toUpperCase()} MENTOR</div>
                <div className="mp-hb mp-hb-country">{mentor.flag} {mentor.country} · {mentor.uni}</div>
              </div>
              <h1 className="mp-hs-name">{mentor.name}</h1>
              <div className="mp-hs-role">
                <strong>{mentor.role}</strong>
                <div className="mp-dot"></div>
                <span>{mentor.uni}</span>
              </div>
            </div>

            <div className="mp-hs-stats">
              <div className="mp-hstat"><div className="mp-hstat-num" style={{color:mentor.hex}}>{mentor.sessions}</div><div className="mp-hstat-lbl">SESSIONS</div></div>
              <div className="mp-hstat"><div className="mp-hstat-num" style={{color:'var(--gold)'}}>{mentor.rating}</div><div className="mp-hstat-lbl">RATING</div></div>
              <div className="mp-hstat"><div className="mp-hstat-num" style={{color:'var(--green)'}}>{mentor.admitRate}</div><div className="mp-hstat-lbl">ADMIT RATE</div></div>
            </div>
          </div>

          {/* BODY */}
          <div className="mp-body-grid">
            
            {/* LEFT SIDE CONTENT */}
            <div style={{display:'flex', flexDirection:'column', gap:'24px'}}>

              {/* BIO TERMINAL */}
              <div className="mp-card">
                <div className="mp-card-label" style={{color: mentor.hex}}><span style={{background: mentor.hex, width:'18px', height:'1px', display:'inline-block'}}></span> OPERATIVE BRIEF</div>
                <div className="mp-term">
                  <div style={{position:'absolute', left:0, top:0, bottom:0, width:'3px', background:`linear-gradient(180deg, ${mentor.hex}, var(--purple))`}}></div>
                  <span className="mp-term-line"><span className="mp-term-prompt" style={{color: mentor.hex}}>$ </span>mentor --query {mentor.name.split(' ')[0].toLowerCase()}.bio --decrypt</span>
                  <span className="mp-term-line" style={{color:'#374151'}}>Connecting to dossier node... encrypted tunnel established</span>
                  <span className="mp-term-line" style={{color:'#374151'}}>Decrypting profile... ████████████████ 100%</span>
                  <div className="mp-term-bio">
                    {mentor.bio}
                  </div>
                  <span className="mp-term-line" style={{marginTop:'8px'}}><span className="mp-cursor" style={{background: mentor.hex}}></span></span>
                </div>
              </div>

              {/* TRAJECTORY TIMELINE */}
              <div className="mp-card">
                <div className="mp-card-label" style={{color: mentor.hex}}><span style={{background: mentor.hex, width:'18px', height:'1px', display:'inline-block'}}></span> CAREER TRAJECTORY</div>
                <div className="mp-card-title">THE JOURNEY SO FAR</div>
                <div className="mp-timeline">
                  {mentor.timeline.map((t, i) => (
                    <div key={i} className="mp-tl-item">
                      <div className={`mp-tl-dot ${t.status === 'future' ? 'future' : 'done'}`} style={{boxShadow: t.status==='done'?`0 0 12px rgba(${mentor.rgb},.25)`:'none'}}>
                        <div className="mp-tl-dot-inner"></div>
                      </div>
                      <div className="mp-tl-tag">{t.tag}</div>
                      <div className="mp-tl-text">{t.text}</div>
                      <div className="mp-tl-sub">{t.sub}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* EXPERTISE GRID */}
              <div className="mp-card">
                <div className="mp-card-label" style={{color: mentor.hex}}><span style={{background: mentor.hex, width:'18px', height:'1px', display:'inline-block'}}></span> CORE COMPETENCIES</div>
                <div className="mp-card-title">WHERE I ACTUALLY HELP</div>
                <div className="mp-exp-grid">
                  {mentor.expertise.map((e, i) => (
                    <div key={i} className="mp-exp-item">
                      <div className="mp-ei-icon">{e.icon}</div>
                      <div className="mp-ei-title">{e.title}</div>
                      <div className="mp-ei-sub">{e.sub}</div>
                      <div className="mp-ei-bar"><div className="mp-ei-fill" style={{width: e.pct}}></div></div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ACHIEVEMENTS */}
              <div className="mp-card">
                <div className="mp-card-label" style={{color: mentor.hex}}><span style={{background: mentor.hex, width:'18px', height:'1px', display:'inline-block'}}></span> ACHIEVEMENTS & CREDENTIALS</div>
                <div className="mp-card-title">TROPHY ROOM</div>
                <div className="mp-ach-list">
                  {mentor.achievements.map((a, i) => {
                    const bg = a.type === 'teal' ? 'rgba(0,245,212,.1)' : a.type === 'purple' ? 'rgba(168,85,247,.1)' : 'rgba(245,158,11,.1)';
                    const br = a.type === 'teal' ? 'rgba(0,245,212,.2)' : a.type === 'purple' ? 'rgba(168,85,247,.2)' : 'rgba(245,158,11,.2)';
                    return (
                      <div key={i} className="mp-ach-item">
                        <div className="mp-ach-icon" style={{background: bg, border: `1px solid ${br}`}}>{a.icon}</div>
                        <div className="mp-ach-text">{a.text}<span>{a.sub}</span></div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* WHAT I HELP WITH */}
              <div className="mp-card">
                <div className="mp-card-label" style={{color: mentor.hex}}><span style={{background: mentor.hex, width:'18px', height:'1px', display:'inline-block'}}></span> TOPICS</div>
                <div className="mp-card-title">WHAT WE'LL COVER IN YOUR SESSION</div>
                <div className="mp-help-tags">
                  {mentor.helpTags.map((h, i) => {
                    const types = ['teal', 'purple', 'gold'];
                    const type = types[i % 3]; 
                    const bColor = type === 'teal' ? 'rgba(0,245,212,.18)' : type === 'purple' ? 'rgba(168,85,247,.18)' : 'rgba(245,158,11,.18)';
                    const bg = type === 'teal' ? 'rgba(0,245,212,.06)' : type === 'purple' ? 'rgba(168,85,247,.06)' : 'rgba(245,158,11,.06)';
                    const tColor = type === 'teal' ? '#2dd4bf' : type === 'purple' ? '#c084fc' : '#fbbf24';
                    
                    return (
                      <div key={i} className="mp-help-tag" style={{borderColor: bColor, background: bg, color: tColor}}>
                        {h}
                      </div>
                    )
                  })}
                </div>
              </div>

            </div>

            {/* SIDEBAR: BOOKING ENGINE */}
            <div className="mp-sidebar">
              <div className="mp-booking-card">
                <div className="mp-bc-hero" style={{background:`linear-gradient(135deg, rgba(${mentor.rgb},.06), rgba(168,85,247,.06))`}}>
                  <div style={{position:'absolute', top:'-60px', right:'-60px', width:'200px', height:'200px', background:`radial-gradient(circle, rgba(${mentor.rgb},.08), transparent 65%)`}}></div>
                  <div className="mp-bc-hero-name">Book a Session</div>
                  <div className="mp-bc-hero-role">{mentor.name} · {mentor.uni}</div>
                  <div className="mp-bc-match">
                    <div className="mp-match-ring">
                      <svg viewBox="0 0 72 72" width="72" height="72" style={{transform:'rotate(-90deg)'}}>
                        <circle cx="36" cy="36" r="30" fill="none" stroke={`rgba(${mentor.rgb},.1)`} strokeWidth="4"/>
                        <circle cx="36" cy="36" r="30" fill="none" stroke={mentor.hex} strokeWidth="4" strokeLinecap="round" strokeDasharray="188" strokeDashoffset={188 - (188 * mentor.match)/100}/>
                      </svg>
                      <div className="mp-match-ring-num" style={{color: mentor.hex}}>{mentor.match}</div>
                    </div>
                    <div>
                      <div className="mp-match-info-lbl" style={{color: mentor.hex, fontSize:'10px', fontFamily:'var(--ffm)', letterSpacing:'.1em', marginBottom:'4px'}}>SMARTMATCH SCORE</div>
                      <div className="mp-match-info-desc" style={{fontSize:'12px', color:'var(--muted)'}}>High compatibility based on your profile</div>
                    </div>
                  </div>
                </div>

                {/* BODY */}
                <div className="mp-bc-body">
                  <div style={{fontSize:'10px', fontFamily:'var(--ffm)', color:'var(--muted)', letterSpacing:'.12em', marginBottom:'10px', display:'flex', justifyContent:'space-between'}}>
                    <span>AVAILABLE SLOTS</span>
                    <span style={{color:'var(--green)'}}>● 2 open this week</span>
                  </div>
                  <div style={{display:'flex', flexDirection:'column', gap:'8px', marginBottom:'22px'}}>
                    {SESSIONS.map(s => {
                      const isSel = selectedSlot === s.id;
                      return (
                        <div 
                          key={s.id} 
                          className={`mp-session-slot ${isSel ? 'selected' : ''}`}
                          style={{ borderColor: isSel ? `rgba(${mentor.rgb},.4)` : 'var(--border)' }}
                          onClick={() => setSelectedSlot(s.id)}
                        >
                          <div className="mp-ss-day">📅 {s.day}</div>
                          <div className="mp-ss-time" style={{color: isSel ? mentor.hex : 'var(--text)'}}>⏱ {s.time}</div>
                          <div className="mp-slot-check" style={{color: mentor.hex, opacity: isSel ? 1 : 0}}>✓</div>
                        </div>
                      )
                    })}
                  </div>

                  <button 
                    className="mp-book-btn" 
                    style={{
                      background: `linear-gradient(135deg, ${mentor.hex}, var(--purple))`,
                      boxShadow: selectedSlot ? `0 16px 40px rgba(${mentor.rgb},.35)` : 'none'
                    }}
                    onClick={handleBookSession}
                  >
                    {selectedSlot 
                      ? `CONFIRM ${SESSIONS.find(s=>s.id===selectedSlot).day.toUpperCase()} ${SESSIONS.find(s=>s.id===selectedSlot).time} →` 
                      : 'REQUEST SESSION →'
                    }
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}