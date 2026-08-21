'use client'

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Triangle, Search, ChevronDown, ChevronRight, Globe, Award, HelpCircle, MapPin, BookOpen, Banknote, ShieldCheck } from 'lucide-react';

// ════════════════════════════════════════════════════════════════════════════════
// 1. INTEL & FAQ DATA
// ════════════════════════════════════════════════════════════════════════════════

const CATEGORIES = [
  { id: 'de', label: 'Germany', icon: '🇩🇪', type: 'destination' },
  { id: 'us', label: 'USA', icon: '🇺🇸', type: 'destination' },
  { id: 'uk', label: 'United Kingdom', icon: '🇬🇧', type: 'destination' },
  { id: 'ca', label: 'Canada', icon: '🇨🇦', type: 'destination' },
  { id: 'au', label: 'Australia', icon: '🇦🇺', type: 'destination' },
  { id: 'ie', label: 'Ireland', icon: '🇮🇪', type: 'destination' },
  { id: 'scholarships', label: 'Scholarships & Funding', icon: '💰', type: 'topic' },
  { id: 'general', label: 'General Application', icon: '🎓', type: 'topic' },
];

const INTEL_DATA = {
  de: {
    color: '#00F5FF', rgb: '0,245,255',
    brief: { capital: 'Berlin', currency: 'Euro (€)', tuition: '€0 - €3,000 / year (Public)', psw: '18 Months', topUnis: 'TU Munich, RWTH Aachen, LMU Munich' },
    faqs: [
      { q: "How do I apply to German public universities?", a: "German public universities mostly use the 'uni-assist' platform. You'll need: Notarized transcripts, an APS Certificate (mandatory for Indian applicants), language proof (IELTS/TOEFL for English-taught, Goethe/Telc for German-taught), a Motivation Letter, and a European-format CV. Always check the specific program's website as some require direct portal applications." },
      { q: "What is the APS certificate and how long does it take?", a: "The APS (Academic Evaluation Centre) certificate verifies the authenticity of your Indian academic documents. It is mandatory before you can apply for a German student visa. Currently, processing takes 4 to 8 weeks, so apply for it the moment you get your final transcripts or provisional degree." },
      { q: "Do I absolutely need to learn German?", a: "For your coursework? No, if you choose a 100% English-taught program. For your life and career? YES. Knowing German at an A2/B1 level is critical for landing part-time jobs (HiWi/Werkstudent), securing internships, and integrating into society. Start learning on Duolingo or Goethe Institute before you fly." },
      { q: "What is a Blocked Account (Sperrkonto)?", a: "To get a student visa, Germany requires proof that you can support yourself. You must deposit €11,208 (as of recent updates) into a German blocked account (like Fintiba, Coracle, or Expatrio). You are allowed to withdraw a maximum of €934 per month to cover rent, food, and insurance." },
      { q: "Can I work part-time while studying?", a: "Yes. International students in Germany are legally allowed to work 140 full days or 280 half days per year. Most students work as 'Werkstudenten' (working students) in companies or as 'HiWis' (Research Assistants) at the university, earning between €12 to €15 per hour." },
      { q: "Is education really 'free' in Germany?", a: "Public universities in 15 out of 16 German states do not charge tuition fees for international students. However, you must pay a 'Semester Contribution' (Semesterbeitrag) of €150 to €350 per semester, which usually includes a transit ticket for free public transport in your region." }
    ]
  },
  us: {
    color: '#FFB347', rgb: '255,179,71',
    brief: { capital: 'Washington, D.C.', currency: 'US Dollar ($)', tuition: '$25,000 - $65,000 / year', psw: '1-3 Years (OPT/STEM)', topUnis: 'MIT, Stanford, CMU, UC Berkeley' },
    faqs: [
      { q: "What GRE score do I actually need?", a: "For Top 20 engineering/CS programs, aim for a 320+ overall with a 165+ in Quant. For mid-tier universities, 310+ is usually safe. Note: Many programs have become 'GRE Optional' post-pandemic, but submitting a strong Quant score heavily boosts your profile, especially for STEM degrees." },
      { q: "How much does it truly cost to study in the USA?", a: "Tuition varies wildly. Public universities (like Texas A&M, ASU) cost $25k-$40k/year. Private universities (like USC, NYU) can be $50k-$70k/year. Living expenses add $12k-$20k/year. The total 2-year cost is typically $60k to $100k+, but this can be drastically reduced through TA/RA funding or on-campus jobs." },
      { q: "What is the difference between CPT and OPT?", a: "CPT (Curricular Practical Training) allows you to work off-campus (like summer internships) while you are still studying. OPT (Optional Practical Training) allows you to work full-time after graduation. Standard OPT is 12 months, but if your degree is STEM-designated, you get a 24-month extension (36 months total)." },
      { q: "How do TA (Teaching Assistant) and RA (Research Assistant) roles work?", a: "TAs help professors grade papers and teach labs; RAs help with research projects. If you secure a TA/RA position, the university usually waives your tuition fees and pays you a monthly stipend ($1,500 - $2,500) for your work. You apply for these after getting admitted, or by emailing professors directly." },
      { q: "What is the H-1B Visa lottery?", a: "After your OPT expires, you need an H-1B work visa to stay in the US. Employers sponsor this visa, but because demand exceeds the 85,000 annual cap, the government runs a random lottery. Having a US Master's degree gives you an extra entry in the lottery, improving your odds." },
      { q: "Do US universities care more about GPA or Extracurriculars?", a: "US admissions are 'holistic'. A high GPA is a baseline, but they care deeply about your Statement of Purpose (SOP), Letters of Recommendation (LORs), and projects/research. A student with an 8.0 CGPA and published research can beat a student with a 9.5 CGPA and no projects." }
    ]
  },
  uk: {
    color: '#00E5A8', rgb: '0,229,168',
    brief: { capital: 'London', currency: 'Pound Sterling (£)', tuition: '£18,000 - £35,000 / year', psw: '2 Years (Graduate Route)', topUnis: 'Oxford, Cambridge, Imperial, UCL' },
    faqs: [
      { q: "Is a 1-year Master's degree globally recognized?", a: "Yes, absolutely. The UK educational system is designed to be highly intensive, packing a standard 2-year curriculum into 12 straight months (including a summer dissertation). It is recognized globally, including in India and the US, for employment and PhD prospects." },
      { q: "What is the Graduate Route (Post-Study Work) visa?", a: "The Graduate Route visa allows international students to stay in the UK for 2 years after completing their Master's degree to look for work or work at any skill level. You do not need a job offer to apply for this visa. For PhD graduates, the duration is 3 years." },
      { q: "Are there part-time work opportunities in the UK?", a: "Yes, international students on a Tier 4 (General) student visa can work up to 20 hours per week during term time and full-time during university holidays. Minimum wage laws apply, ensuring fair pay (currently around £10.42 to £11.44 per hour depending on age)." },
      { q: "Do I need to pay the NHS Surcharge?", a: "Yes. When applying for your UK student visa, you must pay the Immigration Health Surcharge (IHS). This gives you full access to the UK's National Health Service (NHS) for free medical care during your stay. It currently costs £776 per year of your visa." },
      { q: "What are Russell Group universities?", a: "The Russell Group is a collection of 24 prestigious, research-intensive UK universities (similar to the Ivy League in the US). They receive the majority of research grants and have excellent employer reputations, making them highly competitive." },
      { q: "How important is the Personal Statement for the UK?", a: "Crucial. Unlike US SOPs which can be narrative and emotional, UK Personal Statements should be highly academic and direct. Focus 80% on why you want to study the course, your academic background, and your specific career trajectory." }
    ]
  },
  ca: {
    color: '#A78BFA', rgb: '167,139,250',
    brief: { capital: 'Ottawa', currency: 'Canadian Dollar (C$)', tuition: 'C$20,000 - C$45,000 / year', psw: 'Up to 3 Years (PGWP)', topUnis: 'U of Toronto, UBC, McGill, Waterloo' },
    faqs: [
      { q: "What are the recent changes to the PGWP (Post-Graduation Work Permit)?", a: "Canada recently updated PGWP rules. Graduates of Master's degree programs that are less than 2 years (e.g., 8-month or 12-month programs) are now eligible for a full 3-year PGWP, provided they meet all other eligibility criteria. Always check official IRCC updates." },
      { q: "What is the difference between SDS and Non-SDS visa categories?", a: "The Student Direct Stream (SDS) is an expedited visa process for students from specific countries (including India). It requires an upfront payment of 1 year's tuition, a GIC (Guaranteed Investment Certificate) of C$20,635, and an IELTS score of 6.0+. Processing is generally much faster than Non-SDS." },
      { q: "What is a Co-op program?", a: "Co-operative education (Co-op) alternates academic terms with paid, full-time work terms in your field of study. It's essentially built-in internships. Canadian universities like Waterloo are famous for this. It gives you local work experience, making post-graduation job hunting much easier." },
      { q: "How does studying in Canada help with PR (Permanent Residency)?", a: "Canada uses a points-based system called Express Entry for PR. Completing a Canadian degree, gaining Canadian work experience on a PGWP, and having strong English scores significantly boosts your CRS (Comprehensive Ranking System) points, making PR highly attainable." },
      { q: "Should I choose a Thesis-based or Course-based Master's?", a: "Thesis-based (MASc/MSc) is heavily research-focused, requires securing a supervisor before applying, and is often fully funded. Course-based (MEng/Master of Applied Science) is coursework-heavy, mostly self-funded, and designed for students entering the industry rather than academia." },
      { q: "What is a GIC (Guaranteed Investment Certificate)?", a: "A GIC is a mandatory requirement for the SDS visa route. You must deposit C$20,635 into an approved Canadian bank. Upon arrival, you receive an initial payout, and the rest is paid in monthly installments over 12 months to cover your living expenses." }
    ]
  },
  au: {
    color: '#FB7185', rgb: '251,113,133',
    brief: { capital: 'Canberra', currency: 'Aust. Dollar (A$)', tuition: 'A$35,000 - A$55,000 / year', psw: '2-4 Years', topUnis: 'U of Melbourne, UNSW, USyd, ANU' },
    faqs: [
      { q: "What is the Subclass 500 Student Visa?", a: "The Subclass 500 visa allows you to live and study in Australia for up to 5 years. It requires a Confirmation of Enrolment (CoE) from your university, proof of Overseas Student Health Cover (OSHC), financial capacity, and a Genuine Temporary Entrant (GTE) statement." },
      { q: "What are the Post-Study Work rights in Australia?", a: "Graduates with a Master's by Coursework receive a 2-year Temporary Graduate visa (Subclass 485). Master's by Research graduates receive 3 years. If you study in designated 'Regional Areas' (like Adelaide or Perth), you can get an additional 1-2 years of post-study work rights." },
      { q: "What is the Group of Eight (Go8)?", a: "The Group of Eight is a coalition of Australia's leading research-intensive universities (including Melbourne, UNSW, Sydney, Monash, ANU, UQ, UWA, and Adelaide). They are highly ranked globally and very popular among international students." },
      { q: "How important is the GTE (Genuine Temporary Entrant) requirement?", a: "CRITICAL. The GTE statement is an essay proving you are coming to Australia genuinely to study, not just to immigrate. You must explain the value of the course to your future career in your home country. A weak GTE is the #1 cause of Australian visa rejections." },
      { q: "Can I work while studying in Australia?", a: "Yes. International students can work up to 48 hours per fortnight (two weeks) during the semester, and unlimited hours during scheduled university breaks. Australia has one of the highest minimum wages in the world, helping offset living costs." }
    ]
  },
  ie: {
    color: '#4ADE80', rgb: '74,222,128',
    brief: { capital: 'Dublin', currency: 'Euro (€)', tuition: '€12,000 - €25,000 / year', psw: '2 Years (Stamp 1G)', topUnis: 'Trinity College, UCD, Univ. of Galway' },
    faqs: [
      { q: "Why is Ireland becoming popular for tech/IT students?", a: "Dublin is known as the 'Silicon Valley of Europe'. Tech giants like Google, Meta, Apple, Microsoft, and Intel have their European headquarters there. This creates massive networking and employment opportunities for tech and data graduates." },
      { q: "What is the Stamp 1G Visa?", a: "Stamp 1G is Ireland's post-study work visa. Upon completing a Master's degree (Level 9), you are granted permission to stay and work full-time in Ireland for 24 months. You do not need an employer sponsor during this period." },
      { q: "What is the Critical Skills Employment Permit?", a: "If you secure a job in a highly skilled sector (like IT, Engineering, or Data Analytics) after your Stamp 1G, your employer can apply for a Critical Skills Employment Permit. This is the fastest route to Irish permanent residency (Stamp 4), requiring only 2 years on this permit." },
      { q: "How expensive is living in Dublin?", a: "Dublin is experiencing a severe housing shortage, making rent expensive. Expect to pay €800 - €1,200 per month for a shared room/apartment. Total living expenses are generally €12,000 - €15,000 per year. Apply for student accommodation the moment you get accepted." },
      { q: "Do Irish universities require GRE/GMAT?", a: "Most Irish universities (Trinity, UCD, Galway) do NOT require GRE or GMAT for standard MSc programs like Computer Science or Data Analytics. However, MBA and specific Finance programs at top schools may ask for a GMAT score." }
    ]
  },
  scholarships: {
    color: '#FFD84D', rgb: '255,216,77',
    brief: { title: 'Global Funding Matrix', overview: 'Billions of dollars go unclaimed every year. Knowing where to look is 80% of the battle.', topAwards: 'DAAD, Fulbright, Chevening, Vanier' },
    faqs: [
      { q: "What is the difference between Merit-based and Need-based scholarships?", a: "Merit-based scholarships are awarded strictly on academic excellence, leadership, or extracurricular achievements (e.g., DAAD, Chevening). Need-based scholarships are awarded based on your family's financial situation; you usually must submit tax returns to prove financial hardship." },
      { q: "How do I apply for the DAAD Scholarship (Germany)?", a: "DAAD offers the 'Development-Related Postgraduate Courses' (EPOS) scholarship for students from developing countries with 2+ years of professional experience. It covers full tuition, flights, and a monthly stipend of €934. You apply directly to the university, indicating you are a DAAD applicant." },
      { q: "What is the Chevening Scholarship (UK)?", a: "Chevening is the UK government's fully-funded global scholarship program. It requires a minimum of 2 years of work experience and undeniable leadership potential. It covers full tuition, living expenses, and flights. Note: You must return to your home country for 2 years after graduation." },
      { q: "How can I secure a Graduate Assistantship in the USA/Canada?", a: "Teaching Assistantships (TA) and Research Assistantships (RA) are mostly granted by individual professors or departments. To secure one: 1) Have a stellar academic and research profile. 2) Email professors 3-6 months before applying, showing you have read their recent research and can contribute." },
      { q: "Do universities offer automatic scholarships upon admission?", a: "Yes, many universities offer 'Entrance Scholarships' or 'Dean's Awards'. You are automatically considered for these when you submit your application (no extra essay required). They typically range from $2,000 to $10,000 and act as tuition discounts." }
    ]
  },
  general: {
    color: '#E8EAF6', rgb: '232,234,246',
    brief: { title: 'Application Masterclass', overview: 'The strategic timeline and documentation needed to breach top-tier admissions committees.', timeline: '10-12 months before intake' },
    faqs: [
      { q: "When should I start the application process?", a: "For Fall (September) intakes, you should start 12 months in advance. \n• Aug-Sep: Take GRE/IELTS.\n• Oct-Nov: Finalize SOP and LORs.\n• Dec-Jan: Submit applications.\n• Feb-Apr: Receive decisions.\n• May-Jul: Visa processing." },
      { q: "What makes a strong Statement of Purpose (SOP)?", a: "A winning SOP is a cohesive narrative, not a timeline of your resume. Formula: 1) A specific 'hook' or triggering event that sparked your interest. 2) What you have done to pursue it (projects/work). 3) The 'Why Now / Why This Uni' factor. 4) Your concrete 5-year post-graduation goal." },
      { q: "Who should I ask for Letters of Recommendation (LORs)?", a: "Choose recommenders who know you deeply, not just those with high titles. A detailed letter from an Assistant Professor who supervised your final year project is 10x better than a generic two-line letter from the College Principal or a CEO who barely knows you." },
      { q: "What is WES Evaluation and do I need it?", a: "World Education Services (WES) converts your Indian grading system (out of 10 or 100) into the US/Canadian 4.0 GPA scale. You only need it if the specific university strictly demands a 'Course-by-Course Credential Evaluation'. Otherwise, avoid it as it costs ~$200." },
      { q: "How do I secure an education loan without collateral?", a: "Non-Banking Financial Companies (NBFCs) like Prodigy Finance, MPOWER Financing, or Avanse offer no-collateral, no-cosigner loans based on your future earning potential. They look at the ranking of your admitted university and the average salary of its graduates." }
    ]
  }
};

// ════════════════════════════════════════════════════════════════════════════════
// 2. CSS STYLES (Safely converted for React)
// ════════════════════════════════════════════════════════════════════════════════

const styles = `
  .intel-root {
    --bg: #030508; --bg2: #060912; --bg3: #0A0F1E;
    --b0: rgba(0,245,255,.06); --b1: rgba(0,245,255,.15);
    --c: #00F5FF; --t: #00E5A8; --a: #FFB347; --r: #FF4D6D; --v: #A78BFA; --g: #FFB800;
    --t1: #C8D8F0; --t2: #5A7090; --t3: #2A3A55;
    --ff-h: 'Syne', sans-serif; --ff-b: 'DM Sans', sans-serif; --ff-m: 'JetBrains Mono', monospace;
    background: var(--bg); color: var(--t1); font-family: var(--ff-b);
    -webkit-font-smoothing: antialiased; min-height: 100vh; overflow-x: hidden; position: relative;
    display: flex; flex-direction: column;
  }
  .intel-root * { box-sizing: border-box; }
  .intel-root ::-webkit-scrollbar { width: 4px; background: transparent; }
  .intel-root ::-webkit-scrollbar-thumb { background: rgba(0,245,255,.15); border-radius: 4px; }

  /* AMBIENT BG */
  .bg-wrap { position: fixed; inset: 0; z-index: 0; pointer-events: none; overflow: hidden; }
  .orb { position: absolute; border-radius: 50%; filter: blur(120px); animation: orb-drift 25s ease-in-out infinite alternate; }
  .o1 { width: 700px; height: 700px; background: radial-gradient(circle, rgba(0,245,255,.05) 0%, transparent 60%); top: -20%; left: -10%; }
  .o2 { width: 600px; height: 600px; background: radial-gradient(circle, rgba(167,139,250,.04) 0%, transparent 60%); bottom: -20%; right: -10%; animation-delay: -7s; }
  .grid-bg { position: fixed; inset: 0; z-index: 0; pointer-events: none; background: linear-gradient(rgba(255,255,255,.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.015) 1px, transparent 1px); background-size: 40px 40px; -webkit-mask-image: radial-gradient(ellipse 80% 60% at 50% 30%, black 20%, transparent 100%); }
  .scanline { position: fixed; inset: 0; z-index: 0; pointer-events: none; background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,.05) 2px, rgba(0,0,0,.05) 4px); }

  /* NAV (Consistent with app) */
  .nav { position: fixed; top: 0; left: 0; right: 0; z-index: 900; height: 62px; background: rgba(3,5,8,.85); backdrop-filter: blur(24px); border-bottom: 1px solid var(--b0); display: flex; align-items: center; padding: 0 44px; gap: 0; }
  .brand { display: flex; align-items: center; gap: 9px; margin-right: 36px; text-decoration: none; }
  .brand-ico { width: 32px; height: 32px; border-radius: 9px; background: linear-gradient(135deg, rgba(0,245,255,.1), rgba(0,229,168,.1)); border: 1px solid rgba(0,245,255,.3); display: flex; align-items: center; justify-content: center; color: var(--c); box-shadow: 0 0 12px rgba(0,245,255,.2); }
  .brand-name { font-family: var(--ff-h); font-size: 16px; font-weight: 700; letter-spacing: -.02em; color: #fff; }
  .brand-name span { color: var(--c); }
  .nav-links { display: flex; align-items: center; gap: 2px; flex: 1; justify-content: center; }
  .nav-links a { font-size: 13px; color: var(--t2); padding: 6px 12px; border-radius: 8px; transition: all .18s; font-weight: 500; text-decoration: none; }
  .nav-links a:hover { color: var(--t1); background: rgba(255,255,255,.05); }
  .nav-links a.active { color: var(--c); background: rgba(0,245,255,.07); }
  .nav-end { display: flex; gap: 8px; }
  .btn-ghost { background: transparent; border: 1px solid var(--b1); color: var(--t1); padding: 7px 16px; border-radius: 8px; font-family: var(--ff-b); font-size: 12.5px; font-weight: 600; cursor: pointer; transition: all .2s; }
  .btn-ghost:hover { border-color: rgba(255,255,255,.3); background: rgba(255,255,255,.05); }
  .btn-primary { background: linear-gradient(135deg, var(--c), var(--t)); color: #030508; border: none; padding: 8px 18px; border-radius: 8px; font-family: var(--ff-b); font-size: 12.5px; font-weight: 700; cursor: pointer; transition: all .2s; box-shadow: 0 0 20px rgba(0,245,255,.2); }
  .btn-primary:hover { box-shadow: 0 0 30px rgba(0,245,255,.4); transform: translateY(-1px); }

  /* PAGE CONTAINER */
  .page-container { flex: 1; margin-top: 62px; padding: 40px 48px; position: relative; z-index: 1; display: flex; flex-direction: column; align-items: center; }
  
  .hero-zone { text-align: center; margin-bottom: 40px; animation: fadeUp .5s ease both; }
  .hero-badge { display: inline-flex; align-items: center; gap: 8px; font-family: var(--ff-m); font-size: 10px; letter-spacing: .16em; text-transform: uppercase; color: var(--t); background: rgba(0,229,168,.08); border: 1px solid rgba(0,229,168,.25); padding: 5px 14px; border-radius: 20px; margin-bottom: 16px; }
  .h-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--t); box-shadow: 0 0 8px var(--t); animation: pulse 2s infinite; }
  .hero-title { font-family: var(--ff-h); font-size: clamp(32px, 4vw, 48px); font-weight: 800; letter-spacing: -.02em; color: #fff; margin-bottom: 12px; }
  .hero-title span { background: linear-gradient(135deg, var(--c), var(--v)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
  .hero-sub { font-size: 15px; color: var(--t2); max-width: 540px; margin: 0 auto; line-height: 1.6; }

  /* TERMINAL LAYOUT */
  .terminal { width: 100%; max-width: 1200px; display: grid; grid-template-columns: 280px 1fr; background: rgba(6,9,18,.7); backdrop-filter: blur(20px); border: 1px solid var(--b0); border-radius: 20px; overflow: hidden; box-shadow: 0 40px 100px rgba(0,0,0,.5); animation: fadeUp .6s .1s ease both; min-height: 600px; }
  
  /* SIDEBAR */
  .t-side { border-right: 1px solid var(--b0); background: rgba(3,5,8,.5); padding: 24px 0; display: flex; flex-direction: column; }
  .side-label { font-family: var(--ff-m); font-size: 10px; color: var(--t3); letter-spacing: .16em; text-transform: uppercase; padding: 0 24px; margin-bottom: 12px; }
  .cat-list { display: flex; flex-direction: column; gap: 4px; padding: 0 12px; margin-bottom: 30px; }
  .cat-btn { display: flex; align-items: center; gap: 12px; width: 100%; padding: 12px 14px; background: transparent; border: 1px solid transparent; border-radius: 12px; cursor: pointer; transition: all .2s; color: var(--t2); font-family: var(--ff-b); font-size: 14px; font-weight: 500; text-align: left; }
  .cat-btn:hover { background: rgba(255,255,255,.03); color: var(--t1); }
  .cat-btn.active { background: rgba(0,245,255,.06); border-color: rgba(0,245,255,.15); color: #fff; box-shadow: inset 4px 0 0 var(--c); }
  .cat-ico { font-size: 18px; filter: grayscale(50%); transition: filter .2s; width: 24px; text-align: center; }
  .cat-btn.active .cat-ico { filter: grayscale(0%); }
  
  /* MAIN CONTENT AREA */
  .t-main { display: flex; flex-direction: column; position: relative; overflow: hidden; background: linear-gradient(180deg, rgba(255,255,255,.01) 0%, transparent 100%); }
  
  /* INTEL HEADER (Dynamic) */
  .intel-head { padding: 30px 40px; border-bottom: 1px solid var(--b0); position: relative; overflow: hidden; }
  .ih-glow { position: absolute; inset: 0; pointer-events: none; opacity: .15; }
  .ih-top { display: flex; align-items: center; gap: 16px; margin-bottom: 24px; position: relative; z-index: 1; }
  .ih-flag { font-size: 42px; line-height: 1; filter: drop-shadow(0 4px 12px rgba(0,0,0,.5)); }
  .ih-title { font-family: var(--ff-h); font-size: 28px; font-weight: 700; color: #fff; letter-spacing: -.02em; }
  .ih-badge { font-family: var(--ff-m); font-size: 9px; padding: 4px 10px; border-radius: 6px; border: 1px solid; letter-spacing: .1em; text-transform: uppercase; }
  
  /* Brief Grid */
  .brief-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 16px; position: relative; z-index: 1; }
  .brief-box { background: rgba(0,0,0,.3); border: 1px solid var(--b0); border-radius: 12px; padding: 14px 16px; }
  .bb-label { display: flex; align-items: center; gap: 6px; font-family: var(--ff-m); font-size: 9px; color: var(--t3); letter-spacing: .12em; text-transform: uppercase; margin-bottom: 6px; }
  .bb-val { font-family: var(--ff-h); font-size: 16px; font-weight: 600; color: var(--t1); }
  .bb-val-long { font-size: 13px; font-weight: 500; color: var(--t2); line-height: 1.5; }

  /* FAQ LIST */
  .faq-container { flex: 1; overflow-y: auto; padding: 30px 40px 60px; scroll-behavior: smooth; }
  .faq-list { display: flex; flex-direction: column; gap: 12px; }
  
  .q-card { background: rgba(255,255,255,.015); border: 1px solid var(--b0); border-radius: 14px; transition: all .3s; overflow: hidden; }
  .q-card:hover { border-color: rgba(255,255,255,.1); background: rgba(255,255,255,.03); }
  .q-card.open { border-color: var(--ac); background: rgba(3,5,8,.6); box-shadow: 0 10px 30px rgba(0,0,0,.3); }
  
  .q-head { width: 100%; padding: 20px 24px; display: flex; align-items: center; justify-content: space-between; gap: 20px; background: transparent; border: none; cursor: pointer; text-align: left; }
  .q-text { font-family: var(--ff-b); font-size: 15px; font-weight: 600; color: var(--t1); line-height: 1.4; transition: color .2s; }
  .q-card.open .q-text { color: #fff; }
  .q-icon { color: var(--t3); transition: all .3s; flex-shrink: 0; display: flex; align-items: center; justify-content: center; width: 24px; height: 24px; border-radius: 50%; background: rgba(255,255,255,.03); }
  .q-card:hover .q-icon { color: var(--t2); background: rgba(255,255,255,.08); }
  .q-card.open .q-icon { transform: rotate(180deg); color: var(--ac); background: var(--ac-bg); border: 1px solid var(--ac-border); }

  .q-body-wrap { display: grid; grid-template-rows: 0fr; transition: grid-template-rows .3s ease; }
  .q-card.open .q-body-wrap { grid-template-rows: 1fr; }
  .q-body { overflow: hidden; }
  .q-body-inner { padding: 0 24px 24px; display: flex; gap: 16px; align-items: flex-start; }
  .a-line { width: 2px; align-self: stretch; border-radius: 2px; background: linear-gradient(180deg, var(--ac), transparent); flex-shrink: 0; opacity: .6; margin-top: 4px; }
  .a-text { font-size: 14px; color: var(--t2); line-height: 1.7; font-weight: 400; }

  /* BOTTOM ACTION BAR */
  .bot-bar { padding: 20px 40px; background: rgba(6,9,18,.9); border-top: 1px solid var(--b0); display: flex; align-items: center; justify-content: space-between; }
  .bb-text { font-family: var(--ff-m); font-size: 11px; color: var(--t2); letter-spacing: .05em; }
  .bb-actions { display: flex; gap: 12px; }

  @keyframes fadeUp { from{opacity:0; transform:translateY(20px)} to{opacity:1; transform:translateY(0)} }
  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} }
  @keyframes orb-drift { 0%{transform:translate(0,0)} 100%{transform:translate(30px,20px)} }

  @media(max-width: 900px) {
    .terminal { grid-template-columns: 1fr; display: flex; flex-direction: column; min-height: 80vh; }
    .t-side { border-right: none; border-bottom: 1px solid var(--b0); padding: 16px; flex-shrink: 0; }
    .cat-list { flex-direction: row; overflow-x: auto; margin-bottom: 0; padding-bottom: 8px; }
    .cat-btn { width: auto; white-space: nowrap; padding: 10px 16px; }
    .page-container { padding: 24px 16px; }
    .intel-head { padding: 24px 20px; }
    .faq-container { padding: 20px 20px 40px; }
    .bot-bar { flex-direction: column; gap: 16px; text-align: center; padding: 20px; }
  }
`;

// ════════════════════════════════════════════════════════════════════════════════
// 3. REACT COMPONENT
// ════════════════════════════════════════════════════════════════════════════════

export default function CountryIntelPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [activeCat, setActiveCat] = useState('de');
  const [expandedQ, setExpandedQ] = useState(0); // Index of expanded question

  useEffect(() => {
    setMounted(true);
    // Inject Fonts specifically for this page to guarantee rendering
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:opsz,wght@9..40,400;500;600&family=JetBrains+Mono:wght@400;500;600&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }, []);

  if (!mounted) return null;

  const currentData = INTEL_DATA[activeCat];
  const isDest = CATEGORIES.find(c => c.id === activeCat)?.type === 'destination';
  const accent = currentData.color;
  const accentRgb = currentData.rgb;

  return (
    <div className="intel-root">
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      
      {/* BACKGROUND FX */}
      <div className="bg-wrap">
        <div className="orb o1"></div>
        <div className="orb o2"></div>
      </div>
      <div className="grid-bg"></div>
      <div className="scanline"></div>

      {/* NAVBAR */}
      <nav className="nav">
        <Link href="/" className="brand">
          <div className="brand-ico">
            <Triangle size={16} fill="currentColor" strokeWidth={2} className="rotate-180" />
          </div>
          <span className="brand-name">Mentor<span>Bridge</span></span>
        </Link>
        <div className="nav-links">
          <Link href="/mentors">Mentors</Link>
          <Link href="/scholarships">Scholarships</Link>
          <Link href="/chat" className="active">Country Intel</Link>
          <Link href="/career-paths">Career Paths</Link>
        </div>
        <div className="nav-end">
          <button className="btn-ghost" onClick={() => router.push('/login')}>Log in</button>
          <button className="btn-primary" onClick={() => router.push('/signup')}>Sign up →</button>
        </div>
      </nav>

      {/* MAIN CONTAINER */}
      <div className="page-container">
        
        {/* HERO ZONE */}
        <div className="hero-zone">
          <div className="hero-badge"><div className="h-dot"></div> INTELLIGENCE DATABASE ACTIVE</div>
          <h1 className="hero-title">Global <span>Intel Terminal</span></h1>
          <p className="hero-sub">Access classified admission protocols, financial requirements, and visa strategies for top study destinations worldwide.</p>
        </div>

        {/* TERMINAL UI */}
        <div className="terminal">
          
          {/* SIDEBAR */}
          <div className="t-side">
            <div className="side-label">Destinations</div>
            <div className="cat-list">
              {CATEGORIES.filter(c => c.type === 'destination').map(cat => (
                <button 
                  key={cat.id} 
                  className={`cat-btn ${activeCat === cat.id ? 'active' : ''}`}
                  onClick={() => { setActiveCat(cat.id); setExpandedQ(0); }}
                >
                  <span className="cat-ico">{cat.icon}</span>
                  {cat.label}
                </button>
              ))}
            </div>
            <div className="side-label">Operations</div>
            <div className="cat-list">
              {CATEGORIES.filter(c => c.type === 'topic').map(cat => (
                <button 
                  key={cat.id} 
                  className={`cat-btn ${activeCat === cat.id ? 'active' : ''}`}
                  onClick={() => { setActiveCat(cat.id); setExpandedQ(0); }}
                >
                  <span className="cat-ico">{cat.icon}</span>
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* MAIN CONTENT */}
          <div className="t-main">
            
            {/* DYNAMIC INTEL HEADER */}
            <div className="intel-head" key={`head-${activeCat}`}>
              <div className="ih-glow" style={{ background: `radial-gradient(circle at top right, rgba(${accentRgb},.4) 0%, transparent 70%)` }}></div>
              
              <div className="ih-top">
                <div className="ih-flag">{CATEGORIES.find(c=>c.id===activeCat)?.icon}</div>
                <div>
                  <div className="ih-title">{CATEGORIES.find(c=>c.id===activeCat)?.label} Profile</div>
                  <div className="ih-badge" style={{ color: accent, borderColor: `rgba(${accentRgb},.4)`, background: `rgba(${accentRgb},.1)` }}>
                    {isDest ? 'Sovereign Data' : 'Protocol Data'}
                  </div>
                </div>
              </div>

              {isDest ? (
                <div className="brief-grid">
                  <div className="brief-box">
                    <div className="bb-label"><MapPin size={12}/> Capital</div>
                    <div className="bb-val">{currentData.brief.capital}</div>
                  </div>
                  <div className="brief-box">
                    <div className="bb-label"><Banknote size={12}/> Avg. Tuition</div>
                    <div className="bb-val" style={{color: accent}}>{currentData.brief.tuition}</div>
                  </div>
                  <div className="brief-box">
                    <div className="bb-label"><ShieldCheck size={12}/> Post-Study Work</div>
                    <div className="bb-val">{currentData.brief.psw}</div>
                  </div>
                  <div className="brief-box">
                    <div className="bb-label"><Award size={12}/> Target Hubs</div>
                    <div className="bb-val-long">{currentData.brief.topUnis}</div>
                  </div>
                </div>
              ) : (
                <div className="brief-grid">
                  <div className="brief-box" style={{ gridColumn: 'span 2' }}>
                    <div className="bb-label"><BookOpen size={12}/> Protocol Overview</div>
                    <div className="bb-val-long" style={{ fontSize: '14px', color: '#fff' }}>{currentData.brief.overview}</div>
                  </div>
                  <div className="brief-box">
                    <div className="bb-label"><ShieldCheck size={12}/> Key Targets</div>
                    <div className="bb-val" style={{color: accent}}>{currentData.brief.topAwards || currentData.brief.timeline}</div>
                  </div>
                </div>
              )}
            </div>

            {/* FAQ ACCORDION LIST */}
            <div className="faq-container" key={`faq-${activeCat}`}>
              <div className="faq-list">
                {currentData.faqs.map((faq, i) => {
                  const isOpen = expandedQ === i;
                  return (
                    <div 
                      key={i} 
                      className={`q-card ${isOpen ? 'open' : ''}`}
                      style={{ 
                        '--ac': accent, 
                        '--ac-bg': `rgba(${accentRgb},.1)`, 
                        '--ac-border': `rgba(${accentRgb},.3)` 
                      }}
                    >
                      <button className="q-head" onClick={() => setExpandedQ(isOpen ? null : i)}>
                        <div className="q-text">{faq.q}</div>
                        <div className="q-icon"><ChevronDown size={16} /></div>
                      </button>
                      <div className="q-body-wrap">
                        <div className="q-body">
                          <div className="q-body-inner">
                            <div className="a-line"></div>
                            {/* Render answer, handling line breaks if any exist */}
                            <div className="a-text">
                              {faq.a.split('\n').map((line, idx) => (
                                <React.Fragment key={idx}>
                                  {line}
                                  {idx !== faq.a.split('\n').length - 1 && <><br/><br/></>}
                                </React.Fragment>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* BOTTOM CTA BAR */}
            <div className="bot-bar">
              <div className="bb-text">Need personalized clearance for {CATEGORIES.find(c=>c.id===activeCat)?.label}?</div>
              <div className="bb-actions">
                <button className="btn-ghost" onClick={() => router.push('/tools/cost-calculator')} style={{ fontSize: '11px', padding: '8px 14px' }}>
                  Use ROI Calculator
                </button>
                <button className="btn-primary" onClick={() => router.push('/mentors')} style={{ fontSize: '11px', padding: '8px 16px', background: `linear-gradient(135deg, ${accent}, #fff)`, color: '#000', boxShadow: `0 0 16px rgba(${accentRgb},.3)` }}>
                  Speak to a Mentor →
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}