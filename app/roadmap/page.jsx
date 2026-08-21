'use client'

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Triangle } from 'lucide-react';

// ════════════════════════════════════════════════════════════════════════════════
// 1. DATA: QUESTIONS & ROADMAP CONTENT
// ════════════════════════════════════════════════════════════════════════════════
const QS = [
  { id:'dest', type:'country', required:true, title:<>WHERE DO YOU WANT TO <em>STUDY?</em></>,
    sub:'Each country has a completely different pathway. We\'ll build yours step by step.',
    opts:[
      {v:'germany',   ico:'🇩🇪', label:'Germany',    desc:'€0 tuition · DAAD · APS required',      badge:'#1 for Indian students'},
      {v:'usa',       ico:'🇺🇸', label:'USA',        desc:'OPT/CPT · GRE · High salaries',         badge:'Highest ROI'},
      {v:'uk',        ico:'🇬🇧', label:'UK',         desc:'1-year MSc · Grad Visa · IELTS',        badge:'Fastest completion'},
      {v:'canada',    ico:'🇨🇦', label:'Canada',     desc:'PGWP · Express Entry · PR path',        badge:'Best PR route'},
      {v:'australia', ico:'🇦🇺', label:'Australia',  desc:'485 Visa · Strong IT sector',           badge:'Sunny + strong'},
      {v:'ireland',   ico:'🇮🇪', label:'Ireland',    desc:'EU gateway · Stamp 1G · Tech hubs',     badge:'EU access'},
    ]},
  { id:'field', type:'field', required:true, title:<>WHAT WILL YOU <em>STUDY?</em></>,
    sub:'Your field shapes document requirements, scholarships, visa options, and the job market.',
    opts:[
      {v:'cs_ai',    ico:'💻', label:'CS / AI / ML',       desc:'Most in-demand worldwide',   demand:98, col:'var(--cyan)'},
      {v:'data',     ico:'📊', label:'Data Science',       desc:'Analytics & business intel', demand:92, col:'var(--teal)'},
      {v:'mech',     ico:'⚙️', label:'Mechanical / Auto',  desc:'Strong in Germany & Canada', demand:76, col:'var(--gold)'},
      {v:'business', ico:'📈', label:'MBA / Business',     desc:'Finance, consulting, MBB',   demand:74, col:'var(--purple)'},
      {v:'cyber',    ico:'🔐', label:'Cybersecurity',      desc:'Fastest growing sector',     demand:95, col:'var(--red)'},
      {v:'life_sci', ico:'🧬', label:'Life Sciences',      desc:'Biotech, pharma, health',    demand:71, col:'var(--green)'},
    ]},
  { id:'edu', type:'single', required:true, title:<>YOUR CURRENT <em>EDUCATION?</em></>,
    sub:'This determines which programs and scholarships you qualify for.',
    opts:[
      {v:'btech_cs',    ico:'🎓', label:'B.Tech / B.E. (CS/IT)',   desc:'Engineering background'},
      {v:'btech_other', ico:'🎓', label:'B.Tech / B.E. (Non-CS)',  desc:'Mech, Civil, EE etc.'},
      {v:'bsc',         ico:'📚', label:'B.Sc / BCA / BBA',        desc:'Science or business grad'},
      {v:'masters',     ico:'🏛', label:'Already have Master\'s',  desc:'Looking for PhD or 2nd MS'},
      {v:'diploma',     ico:'📋', label:'Diploma + Work Exp',      desc:'Non-traditional path'},
    ]},
  { id:'gpa', type:'slider', required:true,
    title:<>YOUR GPA / <em>PERCENTAGE?</em></>,
    sub:'Honest self-assessment gives the most accurate roadmap. We strategize — not judge.',
    min:55, max:100, step:1, def:75, unit:'%',
    lbl:'Current Percentage / CGPA Equivalent',
    marks:['55%','65%','75%','85%','95%+']},
  { id:'workex', type:'single', required:true, title:<>WORK <em>EXPERIENCE?</em></>,
    sub:'Work experience affects profile strength and scholarship eligibility significantly.',
    opts:[
      {v:'none',   ico:'🌱', label:'None (Fresher)',     desc:'Straight out of college'},
      {v:'intern', ico:'💼', label:'Internship Only',    desc:'1–3 internships, no full-time'},
      {v:'1yr',    ico:'⭐', label:'1 Year',             desc:'Some professional experience'},
      {v:'2_3yr',  ico:'⭐⭐',label:'2–3 Years',         desc:'Mid-level experience'},
      {v:'4plus',  ico:'🚀', label:'4+ Years',           desc:'Strong industry profile'},
    ]},
  { id:'intake', type:'single', required:true, title:<>WHEN DO YOU WANT TO <em>START?</em></>,
    sub:'Your target intake is the anchor for your entire timeline. We work backwards from it.',
    opts:[
      {v:'win25',  ico:'❄️', label:'Winter 2025',       desc:'3–4 months — very urgent'},
      {v:'sum26',  ico:'🌸', label:'Summer / Spring 26',desc:'~6 months — tight but doable'},
      {v:'win26',  ico:'🍂', label:'Winter 2026',       desc:'~10 months — solid runway'},
      {v:'sum27',  ico:'☀️', label:'Summer 2027',       desc:'1.5 years — ideal prep time'},
    ]},
  { id:'scholarship', type:'single', required:false, skippable:true,
    title:<>SCHOLARSHIP <em>GOAL?</em></>,
    sub:'Scholarships change your entire strategy — different deadlines, different requirements.',
    opts:[
      {v:'govt',    ico:'🏅', label:'DAAD / Government',  desc:'Fully-funded, highly competitive'},
      {v:'merit',   ico:'🎓', label:'University Merit',   desc:'Partial, merit-based awards'},
      {v:'any',     ico:'💡', label:'Any Funding',        desc:'Maximum financial aid focus'},
      {v:'self',    ico:'💰', label:'Self-Funded',        desc:'Focus purely on strong apps'},
    ]},
  { id:'lang', type:'single', required:false, skippable:true,
    title:<>ENGLISH / LANGUAGE <em>STATUS?</em></>,
    sub:'Test timelines add 2–4 months. We\'ll factor this into your critical path.',
    opts:[
      {v:'ielts',  ico:'✅', label:'IELTS Done (7.0+)',   desc:'Ready to apply now'},
      {v:'toefl',  ico:'✅', label:'TOEFL Done (100+)',   desc:'Ready to apply now'},
      {v:'plan',   ico:'📝', label:'Planning to Test',    desc:'Add 6–8 weeks to timeline'},
      {v:'de_b2',  ico:'🇩🇪', label:'German B2+',        desc:'Unlocks many more programs'},
      {v:'de_no',  ico:'🇩🇪', label:'No German (yet)',   desc:'German programs still open'},
    ]},
];

const CDATA = {
  germany:{
    label:'Germany', flag:'🇩🇪', accentVar:'--cyan',
    stats:[
      {val:'€0–500', lbl:'Tuition/Semester', c:'var(--cyan)'},
      {val:'5 Yrs',  lbl:'Avg PR Timeline',  c:'var(--teal)'},
      {val:'€861',   lbl:'DAAD Stipend/Mo',  c:'var(--gold)'},
      {val:'18 Mo',  lbl:'Job Seeker Visa',  c:'var(--purple)'},
    ],
    phases:[
      {icon:'🔍', title:'Profile Assessment', sub:'Understand where you stand before spending time or money', node:'active', status:'s-now', status_lbl:'CURRENT',
       timing:'Month 0–2',
       tasks:[
         {i:'📊',t:'APS Eligibility Check',d:'German universities require APS certification for Indian students — this is step one before anything else.',tag:'CRITICAL',tc:'rgba(244,63,94,.1)',tb:'rgba(244,63,94,.25)',tv:'#fda4af',pc:'var(--red)'},
         {i:'🎯',t:'Profile Score Calculation',d:'GPA, projects, publications, work ex — understand your real competitiveness per university before applying.',tag:'HIGH PRIORITY',tc:'rgba(0,245,255,.08)',tb:'rgba(0,245,255,.2)',tv:'var(--cyan)',pc:'var(--cyan)'},
         {i:'🏫',t:'Research TU9 vs H+ Universities',d:'TU Munich, RWTH Aachen, TU Berlin, KIT, TU Dresden — each has different profiles and acceptance rates for Indians.',tag:'RESEARCH',tc:'rgba(168,85,247,.07)',tb:'rgba(168,85,247,.2)',tv:'#d8b4fe',pc:'var(--purple)'},
         {i:'💡',t:'Book a Mentor Session',d:'A 30-min call with a current TU Munich or RWTH student saves you 3 months of wasted prep. Highest ROI action.',tag:'RECOMMENDED',tc:'rgba(0,229,168,.07)',tb:'rgba(0,229,168,.2)',tv:'var(--teal)',pc:'var(--teal)'},
       ]},
      {icon:'🇩🇪', title:'Language & Test Prep', sub:'German programs need B2/C1 or IELTS 6.5+ — plan 4–6 months minimum', node:'soon', status:'s-soon', status_lbl:'UPCOMING',
       timing:'Month 1–4',
       tasks:[
         {i:'🗣',t:'IELTS / TOEFL Preparation',d:'Target IELTS 7.0+ for competitive programs. Many German unis accept English-taught programs without German language.',tag:'REQUIRED',tc:'rgba(0,245,255,.08)',tb:'rgba(0,245,255,.2)',tv:'var(--cyan)',pc:'var(--cyan)'},
         {i:'🇩🇪',t:'German Language (B2 — optional boost)',d:'B2 German unlocks 3x more programs, cheaper housing, and dramatically improves job prospects after graduation.',tag:'OPTIONAL',tc:'rgba(245,158,11,.07)',tb:'rgba(245,158,11,.2)',tv:'var(--gold)',pc:'var(--gold)'},
         {i:'🎖',t:'DAAD Scholarship Timeline',d:'DAAD applications open Oct–Nov for the following year. Start your motivation letter 3 months before deadline.',tag:'SCHOLARSHIP',tc:'rgba(0,229,168,.07)',tb:'rgba(0,229,168,.2)',tv:'var(--teal)',pc:'var(--teal)'},
         {i:'📜',t:'GRE — Check If Required',d:'Most German public universities do NOT require GRE. Save the prep time for your SOP and profile building instead.',tag:'CHECK',tc:'rgba(168,85,247,.07)',tb:'rgba(168,85,247,.2)',tv:'#d8b4fe',pc:'var(--purple)'},
       ]},
      {icon:'📋', title:'APS Certification', sub:'The mandatory step unique to Indian students — start 12 weeks before you need it', node:'soon', status:'s-soon', status_lbl:'UPCOMING',
       timing:'Month 2–5',
       tasks:[
         {i:'📁',t:'Prepare APS Document Bundle',d:'Originals + certified translations: 10th, 12th, all semester marksheets, degree certificate. Takes 3–4 weeks.',tag:'MANDATORY',tc:'rgba(244,63,94,.1)',tb:'rgba(244,63,94,.25)',tv:'#fda4af',pc:'var(--red)'},
         {i:'🏛',t:'Book APS Appointment (Delhi/Mumbai)',d:'New Delhi APS office: book 4–8 weeks ahead. Processing takes 4–6 weeks after submission. Total: ~10 weeks.',tag:'BOOK EARLY',tc:'rgba(0,245,255,.08)',tb:'rgba(0,245,255,.2)',tv:'var(--cyan)',pc:'var(--cyan)'},
         {i:'💬',t:'APS Interview Preparation',d:'Short interview in German or English about your academic background. Prepare a 2-minute self-introduction in German.',tag:'PREP NEEDED',tc:'rgba(245,158,11,.07)',tb:'rgba(245,158,11,.2)',tv:'var(--gold)',pc:'var(--gold)'},
         {i:'⏱',t:'Total APS Timeline: ~10 Weeks',d:'Start appointment booking exactly 12 weeks before your application deadline. Never underestimate this step.',tag:'CRITICAL PATH',tc:'rgba(168,85,247,.07)',tb:'rgba(168,85,247,.2)',tv:'#d8b4fe',pc:'var(--purple)'},
       ]},
      {icon:'✉️', title:'Applications', sub:'Germany has rolling and fixed deadlines — know each university\'s exact dates', node:'later', status:'s-later', status_lbl:'FUTURE',
       timing:'Month 4–7',
       tasks:[
         {i:'📝',t:'Motivation Letter (NOT SOP)',d:'German unis use "Motivation Letter" — focus on academic reasons, not personal story. 1–1.5 pages, academic tone.',tag:'HIGH IMPACT',tc:'rgba(244,63,94,.1)',tb:'rgba(244,63,94,.25)',tv:'#fda4af',pc:'var(--red)'},
         {i:'🧑‍🏫',t:'Secure 2 Academic LORs',d:'Academic LORs outweigh industry references for German MS. Request from professors 3 months before your deadline.',tag:'REQUIRED',tc:'rgba(0,245,255,.08)',tb:'rgba(0,245,255,.2)',tv:'var(--cyan)',pc:'var(--cyan)'},
         {i:'📋',t:'Uni-Assist or Direct Application',d:'Some German unis use Uni-Assist portal, others accept direct applications. Check each university\'s system.',tag:'ADMIN',tc:'rgba(0,229,168,.07)',tb:'rgba(0,229,168,.2)',tv:'var(--teal)',pc:'var(--teal)'},
         {i:'🎯',t:'Apply to 5–8 Programs',d:'2 reaches (TU Munich, RWTH) + 3 matches (TU Berlin, KIT) + 2 safeties (TU Dresden, Hannover). Spread risk.',tag:'STRATEGY',tc:'rgba(168,85,247,.07)',tb:'rgba(168,85,247,.2)',tv:'#d8b4fe',pc:'var(--purple)'},
       ]},
      {icon:'✈️', title:'Visa & Pre-Departure', sub:'German student visa requires a blocked account — start the moment you receive admission', node:'later', status:'s-later', status_lbl:'FUTURE',
       timing:'Month 7–10',
       tasks:[
         {i:'🏦',t:'Open Blocked Account (€11,208)',d:'Fintiba or DKB takes 2–4 weeks. Required for your visa application. Start immediately after receiving admission.',tag:'FINANCIAL',tc:'rgba(245,158,11,.07)',tb:'rgba(245,158,11,.2)',tv:'var(--gold)',pc:'var(--gold)'},
         {i:'🏥',t:'German Health Insurance',d:'TK or AOK student insurance (~€110/month). Must be arranged before arriving. Many unis require proof upfront.',tag:'REQUIRED',tc:'rgba(0,245,255,.08)',tb:'rgba(0,245,255,.2)',tv:'var(--cyan)',pc:'var(--cyan)'},
         {i:'🏠',t:'Housing: Apply to Studentenwerk',d:'Student dormitories (€200–400/mo) are gold — apply as soon as you have admission. Use WG-Gesucht for private rooms.',tag:'HOUSING',tc:'rgba(0,229,168,.07)',tb:'rgba(0,229,168,.2)',tv:'var(--teal)',pc:'var(--teal)'},
         {i:'📄',t:'Book Visa Appointment Early',d:'German embassy appointments in India book 6–8 weeks out. Book as soon as blocked account is confirmed.',tag:'URGENT',tc:'rgba(244,63,94,.1)',tb:'rgba(244,63,94,.25)',tv:'#fda4af',pc:'var(--red)'},
       ]},
    ],
    resources:[
      {i:'🏛',t:'DAAD Scholarship Database',d:'Official German scholarship database. Filter by field, level, and deadline.', link:'daad.de/en'},
      {i:'📋',t:'APS India Official',d:'Book your APS appointment, check document requirements, interview prep.', link:'aps.org.in'},
      {i:'🏫',t:'Uni-Assist Portal',d:'Central application platform for 180+ German universities.', link:'uni-assist.de'},
      {i:'🏦',t:'Fintiba Blocked Account',d:'Fastest way to open a German blocked account. 2 weeks, fully digital.', link:'fintiba.com'},
      {i:'🗣',t:'Goethe-Institut India',d:'Official German language courses and B2 exam bookings across India.', link:'goethe.de/en/ins/ind'},
      {i:'🧠',t:'MentorBridge Germany Hub',d:'Verified mentors at TU Munich, RWTH, TU Berlin, KIT — book now.', link:'mentorbridge.app'},
    ],
    mentors:[
      {n:'Aarav Mehta',    r:'MS CS @ TU Munich',    s:94, img:'https://randomuser.me/api/portraits/men/11.jpg', c:'var(--cyan)'},
      {n:'Siddharth Jain', r:'MS Mech @ RWTH Aachen', s:88, img:'https://randomuser.me/api/portraits/men/41.jpg', c:'var(--teal)'},
      {n:'Mohit Aggarwal', r:'MS Data @ TU Berlin',   s:82, img:'https://randomuser.me/api/portraits/men/64.jpg', c:'var(--purple)'},
    ],
  },
  usa:{
    label:'USA', flag:'🇺🇸', accentVar:'--gold',
    stats:[
      {val:'$40–70K',lbl:'Avg Annual Tuition',  c:'var(--cyan)'},
      {val:'3 Yrs',  lbl:'OPT Extension STEM',  c:'var(--teal)'},
      {val:'$110K',  lbl:'Avg Starting Salary',  c:'var(--gold)'},
      {val:'2.3 Yrs',lbl:'ROI Breakeven',        c:'var(--purple)'},
    ],
    phases:[
      {icon:'🎯', title:'Profile & Test Strategy', sub:'GRE scores and GPA determine almost everything in the US admissions system', node:'active', status:'s-now', status_lbl:'CURRENT',
       timing:'Month 0–3',
       tasks:[
         {i:'📊',t:'Calculate GPA on 4.0 Scale',d:'US universities use 4.0 GPA. Use WES evaluation or calculate manually — 7.5+ CGPA ≈ 3.5+ GPA typically.',tag:'CRITICAL',tc:'rgba(244,63,94,.1)',tb:'rgba(244,63,94,.25)',tv:'#fda4af',pc:'var(--red)'},
         {i:'📝',t:'GRE Target: 320+ for Top Schools',d:'Quant 165+ expected for CS/Engineering. Verbal 155+ for competitive apps. AWA 4.0 minimum.',tag:'REQUIRED',tc:'rgba(245,158,11,.07)',tb:'rgba(245,158,11,.2)',tv:'var(--gold)',pc:'var(--gold)'},
         {i:'💼',t:'Build Internship Portfolio',d:'2+ strong internships + 2 notable projects = competitive profile. US MS values demonstrated work over pure GPA.',tag:'PROFILE',tc:'rgba(0,245,255,.08)',tb:'rgba(0,245,255,.2)',tv:'var(--cyan)',pc:'var(--cyan)'},
         {i:'🏫',t:'Research T20 vs T50 Programs',d:'FAANG feeders: CMU, UIUC, Cornell. Strong ROI: UT Dallas, NEU, ASU. Safeties: Stevens, NU.',tag:'SHORTLIST',tc:'rgba(0,229,168,.07)',tb:'rgba(0,229,168,.2)',tv:'var(--teal)',pc:'var(--teal)'},
       ]},
      {icon:'📝', title:'Tests & Proficiency', sub:'GRE + TOEFL is a 4–6 month investment — plan it carefully', node:'soon', status:'s-soon', status_lbl:'UPCOMING',
       timing:'Month 1–5',
       tasks:[
         {i:'📚',t:'GRE Preparation (3–4 Months)',d:'Magoosh or Manhattan Prep for structure. Target 165Q / 155V. Take official ETS practice tests last.',tag:'HIGH IMPACT',tc:'rgba(244,63,94,.1)',tb:'rgba(244,63,94,.25)',tv:'#fda4af',pc:'var(--red)'},
         {i:'🗣',t:'TOEFL Target: 100+ (IELTS 7.5+)',d:'Most US universities require TOEFL. Some accept IELTS. Always check your specific target university.',tag:'REQUIRED',tc:'rgba(0,245,255,.08)',tb:'rgba(0,245,255,.2)',tv:'var(--cyan)',pc:'var(--cyan)'},
         {i:'🎖',t:'TA/RA Positions — Email Professors',d:'Research assistant positions cover tuition + stipend. Contact professors directly 6 months before enrollment.',tag:'FUNDING',tc:'rgba(0,229,168,.07)',tb:'rgba(0,229,168,.2)',tv:'var(--teal)',pc:'var(--teal)'},
         {i:'💡',t:'Scholarship Windows: Oct–Jan',d:'Merit scholarships from universities are awarded automatically with application. External: Fulbright, SN Bose.',tag:'FUNDING',tc:'rgba(168,85,247,.07)',tb:'rgba(168,85,247,.2)',tv:'#d8b4fe',pc:'var(--purple)'},
       ]},
      {icon:'✍️', title:'SOP & Application Docs', sub:'The US SOP is personal and narrative — very different from a German Motivation Letter', node:'soon', status:'s-soon', status_lbl:'UPCOMING',
       timing:'Month 4–7',
       tasks:[
         {i:'✍️',t:'Write a Narrative-Driven SOP',d:'US SOPs want YOUR story — why this field, a pivotal moment, specific research interest, why THIS exact program.',tag:'CRITICAL',tc:'rgba(244,63,94,.1)',tb:'rgba(244,63,94,.25)',tv:'#fda4af',pc:'var(--red)'},
         {i:'🧑‍🏫',t:'3 LORs — Mix Academic + Industry',d:'2 academic + 1 strong industry reference. Ask 3 months ahead. Give them your SOP draft for alignment.',tag:'REQUIRED',tc:'rgba(0,245,255,.08)',tb:'rgba(0,245,255,.2)',tv:'var(--cyan)',pc:'var(--cyan)'},
         {i:'💼',t:'Resume: 1-Page, Results-Focused',d:'Maximum 1 page. Lead with impact: "Built X that improved Y by Z%". No photos, no personal info.',tag:'DOCUMENT',tc:'rgba(0,229,168,.07)',tb:'rgba(0,229,168,.2)',tv:'var(--teal)',pc:'var(--teal)'},
         {i:'🎯',t:'Apply to 10–14 Programs',d:'US apps cost $75–150 each. Strategy: 2–3 reach + 5–6 match + 3–4 safety. Don\'t go too narrow.',tag:'STRATEGY',tc:'rgba(168,85,247,.07)',tb:'rgba(168,85,247,.2)',tv:'#d8b4fe',pc:'var(--purple)'},
       ]},
      {icon:'🛂', title:'F-1 Visa & Pre-Departure', sub:'F-1 is straightforward but requires careful financial documentation', node:'later', status:'s-later', status_lbl:'FUTURE',
       timing:'Month 7–10',
       tasks:[
         {i:'📄',t:'I-20 From University',d:'Commit to one university and pay deposit. I-20 is issued and initiates all visa processes.',tag:'FIRST STEP',tc:'rgba(244,63,94,.1)',tb:'rgba(244,63,94,.25)',tv:'#fda4af',pc:'var(--red)'},
         {i:'💰',t:'Financial Proof: $50,000+',d:'Bank statements + financial affidavit for first year. Loans, grants, and parental support all count.',tag:'FINANCIAL',tc:'rgba(245,158,11,.07)',tb:'rgba(245,158,11,.2)',tv:'var(--gold)',pc:'var(--gold)'},
         {i:'💳',t:'Build Credit Score from Day 1',d:'Apply for Deserve Edu or Discover Secured Card immediately. No credit = no apartment lease.',tag:'LIFE HACK',tc:'rgba(0,229,168,.07)',tb:'rgba(0,229,168,.2)',tv:'var(--teal)',pc:'var(--teal)'},
         {i:'💼',t:'CPT/OPT Planning from Semester 1',d:'Talk to your DSO in Week 1 about CPT eligibility. Missing this window means missing the internship cycle.',tag:'CAREER',tc:'rgba(0,245,255,.08)',tb:'rgba(0,245,255,.2)',tv:'var(--cyan)',pc:'var(--cyan)'},
       ]},
    ],
    resources:[
      {i:'📊',t:'GRE Official Prep (ETS)',d:'Official practice tests, PowerPrep software, and test registration.', link:'ets.org/gre'},
      {i:'🎖',t:'Fulbright-Nehru Fellowship',d:'Fully-funded prestigious scholarship. Applications open in November.', link:'usief.org.in'},
      {i:'🏫',t:'Grad Café Database',d:'Historical acceptance data for 5,000+ programs. Filter by GRE/GPA profile.', link:'thegradcafe.com'},
      {i:'📋',t:'F-1 Visa Guide (Official)',d:'US State Department F-1 student visa application guide.', link:'travel.state.gov'},
      {i:'💼',t:'Handshake Student Platform',d:'Most US universities use Handshake for internships and jobs. Register before arriving.', link:'joinhandshake.com'},
      {i:'🧠',t:'MentorBridge USA Hub',d:'Mentors at CMU, NEU, ASU, UT Dallas, UW — real strategies, real people.', link:'mentorbridge.app'},
    ],
    mentors:[
      {n:'Ritika Sharma',  r:'MS Data @ Arizona State', s:91, img:'https://randomuser.me/api/portraits/women/55.jpg', c:'var(--gold)'},
      {n:'Ananya Iyer',    r:'MS CS @ Northeastern',    s:87, img:'https://randomuser.me/api/portraits/women/24.jpg', c:'var(--teal)'},
      {n:'Aditya Rao',     r:'MS Analytics @ UT Dallas',s:85, img:'https://randomuser.me/api/portraits/men/53.jpg',  c:'var(--purple)'},
    ],
  },
  uk:{
    label:'UK', flag:'🇬🇧', accentVar:'--purple',
    stats:[
      {val:'£15–30K',lbl:'Avg Annual Tuition', c:'var(--cyan)'},
      {val:'1 Year', lbl:'MSc Completion',     c:'var(--teal)'},
      {val:'2 Years',lbl:'Graduate Visa',      c:'var(--gold)'},
      {val:'1.8 Yrs',lbl:'ROI Breakeven',      c:'var(--purple)'},
    ],
    phases:[
      {icon:'📚', title:'Program Research', sub:'UK 1-year MSc moves fast — shortlisting and applying must begin immediately', node:'active', status:'s-now', status_lbl:'CURRENT',
       timing:'Month 0–2',
       tasks:[
         {i:'🏫',t:'Shortlist Russell Group Unis',d:'Imperial, UCL, Edinburgh, Manchester, Bristol, Leeds — strong brand + Graduate Visa eligibility after completion.',tag:'SHORTLIST',tc:'rgba(168,85,247,.07)',tb:'rgba(168,85,247,.2)',tv:'#d8b4fe',pc:'var(--purple)'},
         {i:'📊',t:'Check Entry Requirements',d:'UK unis publish minimums publicly. CGPA 7.0+ for mid-tier, 7.5+ for Russell Group. Work experience helps a lot.',tag:'RESEARCH',tc:'rgba(0,245,255,.08)',tb:'rgba(0,245,255,.2)',tv:'var(--cyan)',pc:'var(--cyan)'},
         {i:'🎖',t:'Chevening Window: Aug–Jan',d:'Chevening Scholarship opens in August each year. Requires 2 years work experience. Apply in parallel with uni applications.',tag:'SCHOLARSHIP',tc:'rgba(245,158,11,.07)',tb:'rgba(245,158,11,.2)',tv:'var(--gold)',pc:'var(--gold)'},
         {i:'💡',t:'Job Applications Start Week 6',d:'UK hiring cycle moves extremely fast. Consulting and banking apps open just 2 months into your program. Plan NOW.',tag:'CAREER',tc:'rgba(0,229,168,.07)',tb:'rgba(0,229,168,.2)',tv:'var(--teal)',pc:'var(--teal)'},
       ]},
      {icon:'📝', title:'Docs & Applications', sub:'Rolling admissions mean early applicants get more scholarship consideration', node:'soon', status:'s-soon', status_lbl:'UPCOMING',
       timing:'Month 1–4',
       tasks:[
         {i:'🗣',t:'IELTS Academic: Target 7.0+',d:'UKVI IELTS required for visa purposes. No band below 6.0. Book your test 8 weeks before your application deadline.',tag:'REQUIRED',tc:'rgba(244,63,94,.1)',tb:'rgba(244,63,94,.25)',tv:'#fda4af',pc:'var(--red)'},
         {i:'📋',t:'Personal Statement: 500–1000 Words',d:'Concise, academic-focused. Explain why this specific program at THIS university — not generic statements.',tag:'KEY DOCUMENT',tc:'rgba(168,85,247,.07)',tb:'rgba(168,85,247,.2)',tv:'#d8b4fe',pc:'var(--purple)'},
         {i:'🧑‍🏫',t:'2 Academic LORs (Email Format)',d:'UK unis ask referees directly via email. Send your referees the application link 4 weeks before deadline.',tag:'REQUIRED',tc:'rgba(0,245,255,.08)',tb:'rgba(0,245,255,.2)',tv:'var(--cyan)',pc:'var(--cyan)'},
         {i:'🎓',t:'Rolling Admissions — Apply Early',d:'Many UK programs are first-come-first-served for merit scholarships. Apply in October for September intake.',tag:'URGENT',tc:'rgba(244,63,94,.1)',tb:'rgba(244,63,94,.25)',tv:'#fda4af',pc:'var(--red)'},
       ]},
      {icon:'🛂', title:'CAS & Student Visa', sub:'UK Student Visa requires a CAS number — issued only after you pay your tuition deposit', node:'later', status:'s-later', status_lbl:'FUTURE',
       timing:'Month 5–8',
       tasks:[
         {i:'📄',t:'CAS From University',d:'Confirmation of Acceptance for Studies — issued after deposit payment. Required to start visa application.',tag:'REQUIRED',tc:'rgba(244,63,94,.1)',tb:'rgba(244,63,94,.25)',tv:'#fda4af',pc:'var(--red)'},
         {i:'🚇',t:'18+ Oyster Card (Apply Before Arriving)',d:'Register before leaving India — takes 10 days by post. Saves 30% on all Zone 1–3 transport in London.',tag:'SAVE £40/MO',tc:'rgba(0,229,168,.07)',tb:'rgba(0,229,168,.2)',tv:'var(--teal)',pc:'var(--teal)'},
         {i:'🏠',t:'Book Housing 3 Months Ahead',d:'London accommodation goes in hours. SpareRoom.co.uk. Budget £800–1200/month for Zone 2 room.',tag:'URGENT',tc:'rgba(245,158,11,.07)',tb:'rgba(245,158,11,.2)',tv:'var(--gold)',pc:'var(--gold)'},
         {i:'📄',t:'Graduate Visa — 2-Year Work Rights',d:'Automatic after graduation. No employer sponsorship needed. Use it strategically while job searching.',tag:'CAREER',tc:'rgba(168,85,247,.07)',tb:'rgba(168,85,247,.2)',tv:'#d8b4fe',pc:'var(--purple)'},
       ]},
    ],
    resources:[
      {i:'🎖',t:'Chevening Scholarship',d:'Fully-funded UK scholarship for future leaders. Applications open August.', link:'chevening.org'},
      {i:'🏫',t:'UCAS Postgraduate Search',d:'Search and apply to UK postgraduate programs officially.', link:'ucas.com'},
      {i:'🗣',t:'British Council IELTS India',d:'IELTS Academic test booking, test centres across India.', link:'britishcouncil.in/exam/ielts'},
      {i:'🚇',t:'TfL 18+ Oyster Card',d:'Register for discounted Oyster card before arriving in London.', link:'tfl.gov.uk'},
      {i:'💼',t:'Prospects UK Careers',d:'UK\'s largest graduate career database used by all Russell Group universities.', link:'prospects.ac.uk'},
      {i:'🧠',t:'MentorBridge UK Hub',d:'Mentors at Oxford, Manchester, Bristol, Leeds — real insights.', link:'mentorbridge.app'},
    ],
    mentors:[
      {n:'Maanya Singh',     r:'MS Analytics @ Manchester', s:93, img:'https://randomuser.me/api/portraits/women/31.jpg', c:'var(--purple)'},
      {n:'Tanvi Deshpande',  r:'MS Finance @ Bristol',      s:88, img:'https://randomuser.me/api/portraits/women/65.jpg', c:'var(--teal)'},
      {n:'Simran Kaur',      r:'MS Marketing @ Leeds',      s:82, img:'https://randomuser.me/api/portraits/women/62.jpg', c:'var(--gold)'},
    ],
  },
  canada:{
    label:'Canada', flag:'🇨🇦', accentVar:'--teal',
    stats:[
      {val:'C$20–35K',lbl:'Avg Annual Tuition', c:'var(--cyan)'},
      {val:'3 Years', lbl:'PGWP Duration',       c:'var(--teal)'},
      {val:'C$85K',   lbl:'Avg Starting Salary', c:'var(--gold)'},
      {val:'2.1 Yrs', lbl:'ROI Breakeven',       c:'var(--purple)'},
    ],
    phases:[
      {icon:'🍁', title:'Profile & Research', sub:'Canada rewards research profiles and strong GPA — know your numbers first', node:'active', status:'s-now', status_lbl:'CURRENT',
       timing:'Month 0–3',
       tasks:[
         {i:'🏫',t:'Target Top Canadian Universities',d:'U of T, UBC, Waterloo, McGill, U of Alberta — each has different specializations and acceptance profiles.',tag:'SHORTLIST',tc:'rgba(0,229,168,.07)',tb:'rgba(0,229,168,.2)',tv:'var(--teal)',pc:'var(--teal)'},
         {i:'🔬',t:'Research-Based vs Coursework MS',d:'Research MASc → PhD path + TA funding. MEng/MCS is coursework-only but faster to industry. Choose deliberately.',tag:'STRATEGY',tc:'rgba(0,245,255,.08)',tb:'rgba(0,245,255,.2)',tv:'var(--cyan)',pc:'var(--cyan)'},
         {i:'📧',t:'Email Professors for RA Positions',d:'For research MS: securing a professor agreement is often MORE important than the formal application itself.',tag:'CRITICAL',tc:'rgba(244,63,94,.1)',tb:'rgba(244,63,94,.25)',tv:'#fda4af',pc:'var(--red)'},
         {i:'🎖',t:'Ontario Grad Scholarship Deadlines',d:'OGS, NSERC (research) — various provincial scholarships available. Deadlines vary by university.',tag:'FUNDING',tc:'rgba(245,158,11,.07)',tb:'rgba(245,158,11,.2)',tv:'var(--gold)',pc:'var(--gold)'},
       ]},
      {icon:'📝', title:'Tests & Applications', sub:'IELTS/TOEFL + CGPA are the main filters — GRE usually not required in Canada', node:'soon', status:'s-soon', status_lbl:'UPCOMING',
       timing:'Month 2–6',
       tasks:[
         {i:'🗣',t:'IELTS 6.5–7.0 (Most Programs)',d:'U of T requires 7.0. Waterloo accepts 6.5. Most use IELTS Academic. Always verify per-program.',tag:'REQUIRED',tc:'rgba(0,245,255,.08)',tb:'rgba(0,245,255,.2)',tv:'var(--cyan)',pc:'var(--cyan)'},
         {i:'📝',t:'SOP: Research-Focused',d:'Canadian SOPs highlight research interest and career goals. Mention specific labs/professors you want to work with.',tag:'KEY DOCUMENT',tc:'rgba(0,229,168,.07)',tb:'rgba(0,229,168,.2)',tv:'var(--teal)',pc:'var(--teal)'},
         {i:'🎯',t:'Apply to 6–10 Programs',d:'App fees are C$100–150. Strategy: 2 reach (U of T, UBC) + 4 match (Waterloo, McGill) + 2 safety.',tag:'STRATEGY',tc:'rgba(168,85,247,.07)',tb:'rgba(168,85,247,.2)',tv:'#d8b4fe',pc:'var(--purple)'},
         {i:'🥶',t:'Prepare for Canadian Winter NOW',d:'Buy proper winter gear before arriving — not in Canada. Quality parka + boots costs C$400–600.',tag:'LIFE PREP',tc:'rgba(245,158,11,.07)',tb:'rgba(245,158,11,.2)',tv:'var(--gold)',pc:'var(--gold)'},
       ]},
      {icon:'🛂', title:'Study Permit & PR Path', sub:'Canadian immigration is clear and points-based — understand the system from Day 1', node:'later', status:'s-later', status_lbl:'FUTURE',
       timing:'Month 6–9',
       tasks:[
         {i:'📄',t:'Study Permit (Apply via IRCC)',d:'Canada issues Study Permits, not student visas. Online through IRCC. Processing: 4–8 weeks.',tag:'REQUIRED',tc:'rgba(244,63,94,.1)',tb:'rgba(244,63,94,.25)',tv:'#fda4af',pc:'var(--red)'},
         {i:'🏥',t:'OHIP Has 3-Month Waiting Period',d:'Provincial health coverage in Ontario takes 3 months. Get travel insurance to bridge the gap.',tag:'IMPORTANT',tc:'rgba(0,245,255,.08)',tb:'rgba(0,245,255,.2)',tv:'var(--cyan)',pc:'var(--cyan)'},
         {i:'📋',t:'PGWP: Plan from Semester 1',d:'Post-Graduation Work Permit = 3 years work anywhere in Canada. Leads directly to Express Entry PR.',tag:'PR PATH',tc:'rgba(0,229,168,.07)',tb:'rgba(0,229,168,.2)',tv:'var(--teal)',pc:'var(--teal)'},
         {i:'💼',t:'20 Hrs/Week During Semester',d:'Study Permit allows 20hrs/week during term and full-time during scheduled breaks. Use this income.',tag:'INCOME',tc:'rgba(168,85,247,.07)',tb:'rgba(168,85,247,.2)',tv:'#d8b4fe',pc:'var(--purple)'},
       ]},
    ],
    resources:[
      {i:'🍁',t:'IRCC Immigration Canada',d:'Study permits, PGWP applications, and Express Entry information.', link:'canada.ca/immigration'},
      {i:'🎖',t:'Vanier Canada Graduate Scholarship',d:'$50,000/year for doctoral students. Master\'s: university-internal and OGS.', link:'vanier.gc.ca'},
      {i:'🏫',t:'EduCanada University Finder',d:'Official Government of Canada portal to search all programs.', link:'educanada.ca'},
      {i:'🗣',t:'British Council IELTS India',d:'IELTS Academic — accepted at 99% of Canadian universities.', link:'britishcouncil.in/exam/ielts'},
      {i:'🏦',t:'Express Entry CRS Calculator',d:'Calculate your Comprehensive Ranking Score for Canadian PR.', link:'canada.ca/express-entry'},
      {i:'🧠',t:'MentorBridge Canada Hub',d:'Mentors at U of T, UBC, Waterloo, McGill — experienced, India-background.', link:'mentorbridge.app'},
    ],
    mentors:[
      {n:'Kunal Verma',    r:'MS AI @ U of Toronto', s:94, img:'https://randomuser.me/api/portraits/men/32.jpg',   c:'var(--teal)'},
      {n:'Sneha Banerjee', r:'MS CS @ UBC Vancouver', s:87, img:'https://randomuser.me/api/portraits/women/4.jpg',  c:'var(--cyan)'},
      {n:'Vikram Nair',    r:'MS CS @ Waterloo',      s:84, img:'https://randomuser.me/api/portraits/men/33.jpg',   c:'var(--purple)'},
    ],
  },
  australia:{
    label:'Australia', flag:'🇦🇺', accentVar:'--gold',
    stats:[
      {val:'A$35–48K',lbl:'Avg Annual Tuition', c:'var(--cyan)'},
      {val:'2–4 Yrs', lbl:'485 Visa Duration',  c:'var(--teal)'},
      {val:'A$95K',   lbl:'Avg Starting Salary', c:'var(--gold)'},
      {val:'2.5 Yrs', lbl:'ROI Breakeven',       c:'var(--purple)'},
    ],
    phases:[
      {icon:'🦘', title:'Program & City Research', sub:'Australia has 8 strong universities in 5 cities — location shapes career outcomes', node:'active', status:'s-now', status_lbl:'CURRENT',
       timing:'Month 0–3',
       tasks:[
         {i:'🏫',t:'Target Go8 Universities',d:'Group of 8: Melbourne, Sydney, UNSW, ANU, UQ, Monash, Adelaide, UWA. Best research and employment outcomes.',tag:'SHORTLIST',tc:'rgba(245,158,11,.07)',tb:'rgba(245,158,11,.2)',tv:'var(--gold)',pc:'var(--gold)'},
         {i:'🌏',t:'Choose City Based on Industry',d:'Sydney/Melbourne: Finance, IT, Consulting. Canberra (ANU): Government, Defence. Brisbane: Mining, Energy.',tag:'STRATEGY',tc:'rgba(0,245,255,.08)',tb:'rgba(0,245,255,.2)',tv:'var(--cyan)',pc:'var(--cyan)'},
         {i:'🎖',t:'Australia Awards Scholarship',d:'Fully-funded government scholarship. Opens March–April each year for Indian students.',tag:'SCHOLARSHIP',tc:'rgba(0,229,168,.07)',tb:'rgba(0,229,168,.2)',tv:'var(--teal)',pc:'var(--teal)'},
         {i:'💼',t:'48 Hours/Fortnight Work Rights',d:'Student visa allows 48hrs per fortnight during study — significantly more than most countries allow.',tag:'INCOME',tc:'rgba(168,85,247,.07)',tb:'rgba(168,85,247,.2)',tv:'#d8b4fe',pc:'var(--purple)'},
       ]},
      {icon:'📝', title:'Applications & Tests', sub:'IELTS 6.5 is the standard floor — most Go8 programs want 7.0+', node:'soon', status:'s-soon', status_lbl:'UPCOMING',
       timing:'Month 2–6',
       tasks:[
         {i:'🗣',t:'IELTS: 6.5–7.0 Required',d:'Melbourne and UNSW require 7.0 with no band below 6.5. ANU accepts 6.5. Book 8 weeks before deadline.',tag:'REQUIRED',tc:'rgba(244,63,94,.1)',tb:'rgba(244,63,94,.25)',tv:'#fda4af',pc:'var(--red)'},
         {i:'📝',t:'Personal Statement: Goals-Driven',d:'Australian unis want a concise, direct personal statement focused on your career goals and why Australia.',tag:'KEY DOCUMENT',tc:'rgba(245,158,11,.07)',tb:'rgba(245,158,11,.2)',tv:'var(--gold)',pc:'var(--gold)'},
         {i:'🎯',t:'Apply to 4–6 Australian Programs',d:'Two main intakes: February and July. Apply at least 4 months before your target intake date.',tag:'STRATEGY',tc:'rgba(0,245,255,.08)',tb:'rgba(0,245,255,.2)',tv:'var(--cyan)',pc:'var(--cyan)'},
         {i:'💰',t:'Superannuation — Claim It Back',d:'Employers contribute 11% to your super. When you leave Australia, claim it back via ATO. Track from Day 1.',tag:'MONEY HACK',tc:'rgba(0,229,168,.07)',tb:'rgba(0,229,168,.2)',tv:'var(--teal)',pc:'var(--teal)'},
       ]},
      {icon:'🛂', title:'Visa 500 & 485 Planning', sub:'Australian visas are granted quickly but require detailed financial documentation', node:'later', status:'s-later', status_lbl:'FUTURE',
       timing:'Month 5–8',
       tasks:[
         {i:'📄',t:'Subclass 500 Student Visa',d:'Apply via ImmiAccount. Processing: 1–4 weeks. Requires GTE statement (Genuine Temporary Entrant).',tag:'REQUIRED',tc:'rgba(244,63,94,.1)',tb:'rgba(244,63,94,.25)',tv:'#fda4af',pc:'var(--red)'},
         {i:'🏠',t:'Book Housing 3 Months Ahead',d:'Melbourne/Sydney rental markets are extremely tight. Use REA Group. Budget A$200–350/week.',tag:'HOUSING',tc:'rgba(245,158,11,.07)',tb:'rgba(245,158,11,.2)',tv:'var(--gold)',pc:'var(--gold)'},
         {i:'📱',t:'Aldi Mobile SIM: A$18/Month',d:'Runs on Telstra network at fraction of price. Best prepaid for students. Order online before arriving.',tag:'SAVE A$35/MO',tc:'rgba(0,229,168,.07)',tb:'rgba(0,229,168,.2)',tv:'var(--teal)',pc:'var(--teal)'},
         {i:'📋',t:'Subclass 485 Graduate Visa',d:'2–4 year work rights anywhere in Australia. Apply before student visa expires. Key step to PR.',tag:'PR PATHWAY',tc:'rgba(168,85,247,.07)',tb:'rgba(168,85,247,.2)',tv:'#d8b4fe',pc:'var(--purple)'},
       ]},
    ],
    resources:[
      {i:'🦘',t:'Study Australia (Govt)',d:'Official portal — search programs, scholarships, and visa information.', link:'studyaustralia.gov.au'},
      {i:'🎖',t:'Australia Awards Scholarships',d:'Fully-funded for students from South and South-East Asia.', link:'australiaawards.gov.au'},
      {i:'📄',t:'DIBP ImmiAccount',d:'Australian visa application portal for Student Visa Subclass 500.', link:'immi.homeaffairs.gov.au'},
      {i:'💰',t:'ATO Super Reclaim (DASP)',d:'Claim your superannuation back after leaving Australia via the ATO.', link:'ato.gov.au'},
      {i:'🏠',t:'REA Group Property Search',d:'Australia\'s largest property portal for rental listings.', link:'realestate.com.au'},
      {i:'🧠',t:'MentorBridge Australia Hub',d:'Mentors at Melbourne, Monash, UNSW, Sydney — studying or working now.', link:'mentorbridge.app'},
    ],
    mentors:[
      {n:'Priya Malhotra', r:'MS IS @ Melbourne',  s:92, img:'https://randomuser.me/api/portraits/women/88.jpg', c:'var(--gold)'},
      {n:'Naveen Reddy',   r:'MS Cyber @ Monash',  s:87, img:'https://randomuser.me/api/portraits/men/91.jpg',  c:'var(--teal)'},
      {n:'Riya Mehta',     r:'MS IT @ UNSW',       s:82, img:'https://randomuser.me/api/portraits/women/89.jpg',c:'var(--purple)'},
    ],
  },
  ireland:{
    label:'Ireland', flag:'🇮🇪', accentVar:'--green',
    stats:[
      {val:'€10–22K', lbl:'Avg Annual Tuition',  c:'var(--cyan)'},
      {val:'2 Years', lbl:'Stamp 1G Work Rights', c:'var(--teal)'},
      {val:'€65K',    lbl:'Avg Starting Salary',  c:'var(--gold)'},
      {val:'1.6 Yrs', lbl:'ROI Breakeven',        c:'var(--purple)'},
    ],
    phases:[
      {icon:'☘️', title:'Program & EU Strategy', sub:'Ireland is your gateway to EU employment — leverage it strategically from Day 1', node:'active', status:'s-now', status_lbl:'CURRENT',
       timing:'Month 0–2',
       tasks:[
         {i:'🏫',t:'Target Trinity, UCD, DCU, UCC',d:'Trinity College Dublin, UCD, DCU (tech-focused), UCC — all well-regarded with strong industry links to EU.',tag:'SHORTLIST',tc:'rgba(52,211,153,.07)',tb:'rgba(52,211,153,.2)',tv:'var(--green)',pc:'var(--green)'},
         {i:'🌍',t:'Plan for EU Job Market Access',d:'Ireland is the only English-speaking EU country. With Stamp 1G you can freely move to Germany, Netherlands, France.',tag:'EU STRATEGY',tc:'rgba(0,245,255,.08)',tb:'rgba(0,245,255,.2)',tv:'var(--cyan)',pc:'var(--cyan)'},
         {i:'🏢',t:'Dublin Tech Hub: Google, Meta, Apple',d:'Dublin hosts EMEA HQs of most major tech companies. Internship and job access for CS/Tech is exceptional.',tag:'CAREER',tc:'rgba(168,85,247,.07)',tb:'rgba(168,85,247,.2)',tv:'#d8b4fe',pc:'var(--purple)'},
         {i:'🏠',t:'Dublin Housing Crisis — Start Early',d:'Dublin has Europe\'s worst housing shortage. Start looking 4 months before arrival. Budget €1,000+ for a city room.',tag:'URGENT',tc:'rgba(244,63,94,.1)',tb:'rgba(244,63,94,.25)',tv:'#fda4af',pc:'var(--red)'},
       ]},
      {icon:'✍️', title:'Applications & Docs', sub:'Irish applications are streamlined — housing and competition are the real challenges', node:'soon', status:'s-soon', status_lbl:'UPCOMING',
       timing:'Month 1–4',
       tasks:[
         {i:'🗣',t:'IELTS 6.5+ (TOEFL Accepted)',d:'Trinity requires 7.0, UCD accepts 6.5. Check per-program. Rolling admissions — apply early for best chances.',tag:'REQUIRED',tc:'rgba(244,63,94,.1)',tb:'rgba(244,63,94,.25)',tv:'#fda4af',pc:'var(--red)'},
         {i:'📝',t:'Personal Statement: 300–500 Words',d:'Irish programs want concise, direct statements. Why Ireland? Why this program? Concrete career goals only.',tag:'DOCUMENT',tc:'rgba(0,245,255,.08)',tb:'rgba(0,245,255,.2)',tv:'var(--cyan)',pc:'var(--cyan)'},
         {i:'🎖',t:'Government of Ireland Scholarship',d:'Fully-funded: fees + €10,000 stipend. Competitive but worth applying. Deadline: April each year.',tag:'SCHOLARSHIP',tc:'rgba(52,211,153,.07)',tb:'rgba(52,211,153,.2)',tv:'var(--green)',pc:'var(--green)'},
         {i:'🎯',t:'Apply to 3–6 Irish Programs',d:'Fewer but quality programs. Recommend: 2 reach (Trinity, UCD) + 2 match (DCU, UCC) + 1 safety.',tag:'STRATEGY',tc:'rgba(168,85,247,.07)',tb:'rgba(168,85,247,.2)',tv:'#d8b4fe',pc:'var(--purple)'},
       ]},
      {icon:'🛂', title:'Visa & Stamp 1G Planning', sub:'The real prize is the Stamp 1G after graduation — plan for it from the start', node:'later', status:'s-later', status_lbl:'FUTURE',
       timing:'Month 5–8',
       tasks:[
         {i:'📄',t:'Irish Study Visa (Stamp 2)',d:'Apply via AVATS online. Processing: 4–8 weeks. Requires acceptance letter + proof of €7,000+ funds.',tag:'REQUIRED',tc:'rgba(244,63,94,.1)',tb:'rgba(244,63,94,.25)',tv:'#fda4af',pc:'var(--red)'},
         {i:'💼',t:'20hrs Work During Term + Full-Time Breaks',d:'Irish student visa allows 20hrs/week during term and unlimited hours during official academic holidays.',tag:'INCOME',tc:'rgba(52,211,153,.07)',tb:'rgba(52,211,153,.2)',tv:'var(--green)',pc:'var(--green)'},
         {i:'🌍',t:'Stamp 1G = 2-Year Unlimited Work',d:'Automatic after graduation from Irish institution. Best post-study visa in Europe for tech workers.',tag:'KEY BENEFIT',tc:'rgba(0,245,255,.08)',tb:'rgba(0,245,255,.2)',tv:'var(--cyan)',pc:'var(--cyan)'},
         {i:'🇪🇺',t:'EU Blue Card Pathway',d:'After 1 year working in Ireland, apply for EU Blue Card — gives mobility across most EU member states.',tag:'EU PR PATH',tc:'rgba(168,85,247,.07)',tb:'rgba(168,85,247,.2)',tv:'#d8b4fe',pc:'var(--purple)'},
       ]},
    ],
    resources:[
      {i:'☘️',t:'Education Ireland (Govt)',d:'Official Irish government study portal — programs, scholarships, visa.', link:'educationinireland.com'},
      {i:'🎖',t:'Govt of Ireland Scholarship',d:'Fully-funded postgraduate scholarships. Applications open January.', link:'irishscholarships.ie'},
      {i:'🏛',t:'Qualifax Program Finder',d:'Ireland\'s national learner database — search all accredited programs.', link:'qualifax.ie'},
      {i:'🏠',t:'Daft.ie Property Listings',d:'Ireland\'s largest property portal. Set alerts immediately for Dublin rooms.', link:'daft.ie'},
      {i:'🌍',t:'EU Blue Card Info',d:'European Commission guide to the EU Blue Card highly-skilled permit.', link:'ec.europa.eu'},
      {i:'🧠',t:'MentorBridge Ireland Hub',d:'Mentors at Trinity Dublin, UCD, DCU — currently studying or working.', link:'mentorbridge.app'},
    ],
    mentors:[
      {n:'Rohan Patel',  r:'MS CS @ Trinity Dublin', s:90, img:'https://randomuser.me/api/portraits/men/86.jpg',   c:'var(--green)'},
      {n:'Priya K.',     r:'MS IT @ UCD Dublin',     s:85, img:'https://randomuser.me/api/portraits/women/77.jpg', c:'var(--cyan)'},
      {n:'Arjun N.',     r:'MS Fintech @ DCU',       s:80, img:'https://randomuser.me/api/portraits/men/22.jpg',   c:'var(--purple)'},
    ],
  },
};

const FIELD_NAMES = {cs_ai:'CS / AI / ML',data:'Data Science',mech:'Mechanical Engineering',business:'Business / MBA',cyber:'Cybersecurity',life_sci:'Life Sciences'};
const INTAKE_NAMES = {win25:'Winter 2025',sum26:'Summer 2026',win26:'Winter 2026',sum27:'Summer 2027'};

// ════════════════════════════════════════════════════════════════════════════════
// 2. CSS STYLES (Injected dynamically)
// ════════════════════════════════════════════════════════════════════════════════
const styles = `
  .roadmap-tool {
    --bg:#030610;--bg1:#070c18;--bg2:#0b1120;--bg3:#101828;
    --cyan:#00F5FF;--teal:#00E5A8;--purple:#a855f7;
    --gold:#f59e0b;--red:#f43f5e;--green:#34d399;
    --border:rgba(0,245,255,.07);--bh:rgba(0,245,255,.2);
    --text:#c8d8f0;--muted:#4a6080;--dim:#1e2e44;
    --ffh:'Bebas Neue',sans-serif;--ffb:'Syne',sans-serif;--ffm:'JetBrains Mono',monospace;
    background: var(--bg); color: var(--text); font-family: var(--ffb); min-height: 100vh; overflow-x: hidden; position: relative;
  }
  .roadmap-tool * { box-sizing: border-box; }
  .roadmap-tool a { text-decoration: none; color: inherit; }

  /* BACKGROUND EFFECTS */
  .bg-ambient { position:fixed; inset:0; z-index:0; pointer-events:none; background:radial-gradient(ellipse 80% 60% at 50% 0%,rgba(0,245,255,.04),transparent 60%), radial-gradient(ellipse 60% 60% at 10% 80%,rgba(168,85,247,.04),transparent 55%), radial-gradient(ellipse 50% 50% at 90% 60%,rgba(0,229,168,.03),transparent 55%); }
  .hex-grid { position:fixed; inset:0; z-index:0; pointer-events:none; opacity:.025; background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='96'%3E%3Cpolygon points='28,2 54,16 54,44 28,58 2,44 2,16' fill='none' stroke='%2300F5FF' stroke-width='0.7'/%3E%3C/svg%3E"); }
  .scanlines { position:fixed; inset:0; z-index:1; pointer-events:none; background:repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,.04) 2px,rgba(0,0,0,.04) 4px); }
  .sweep { position:fixed; top:0; left:0; right:0; z-index:1; pointer-events:none; height:1.5px; background:linear-gradient(90deg,transparent,var(--cyan),transparent); opacity:.15; animation:sweep 14s ease-in-out infinite; }
  @keyframes sweep { 0%{transform:translateY(-5px);opacity:0} 8%{opacity:.2} 92%{opacity:.2} 100%{transform:translateY(100vh);opacity:0} }

  /* NAV */
  .top-nav { position:fixed; top:0; left:0; right:0; z-index:100; height:60px; display:flex; align-items:center; justify-content:space-between; padding:0 40px; background:rgba(3,6,16,.9); backdrop-filter:blur(20px); border-bottom:1px solid var(--border); }
  .nav-logo { display:flex; align-items:center; gap:9px; font-family:var(--ffh); font-size:19px; letter-spacing:.06em; color:#fff; }
  .logo-mk { width:32px; height:32px; border-radius:8px; background:linear-gradient(135deg,var(--cyan),var(--purple)); display:flex; align-items:center; justify-content:center; font-size:14px; box-shadow:0 0 18px rgba(0,245,255,.3); color: #000;}
  .nav-logo em { font-style:normal; color:var(--cyan); }
  .nav-prog-wrap { display:flex; align-items:center; gap:10px; font-family:var(--ffm); font-size:10px; color:var(--muted); }
  .nav-bar { width:180px; height:3px; background:rgba(255,255,255,.07); border-radius:2px; overflow:hidden; }
  .nav-fill { height:100%; background:linear-gradient(90deg,var(--cyan),var(--teal)); border-radius:2px; transition:width .5s ease; }
  .nav-pct { color:var(--cyan); font-weight:600; min-width:28px; }

  /* SHELL */
  .shell { position:relative; z-index:2; min-height:100vh; display:flex; flex-direction:column; align-items:center; justify-content:center; padding:80px 20px 60px; }

  /* QUIZ SCREEN */
  .quiz-screen { width:100%; max-width:760px; animation:fadeIn .4s ease; }
  .q-meta { display:flex; align-items:center; gap:10px; margin-bottom:16px; flex-wrap:wrap; }
  .q-badge { font-family:var(--ffm); font-size:9px; color:var(--cyan); background:rgba(0,245,255,.07); border:1px solid rgba(0,245,255,.18); padding:3px 10px; border-radius:20px; letter-spacing:.12em; text-transform:uppercase; }
  .q-of-lbl { font-family:var(--ffm); font-size:9px; color:var(--muted); letter-spacing:.08em; text-transform:uppercase; }
  .q-dots { display:flex; gap:5px; margin-left:auto; }
  .qdot { width:6px; height:6px; border-radius:50%; background:var(--dim); transition:all .3s; }
  .qdot.done { background:var(--teal); } .qdot.cur { background:var(--cyan); box-shadow:0 0 6px var(--cyan); }
  .prog-bars { display:flex; gap:4px; margin-bottom:22px; }
  .pbar { height:3px; flex:1; border-radius:2px; background:var(--dim); transition:background .3s; }
  .pbar.done { background:var(--teal); } .pbar.cur { background:var(--cyan); }

  .q-content { opacity: 1; transform: translateY(0); transition: opacity 0.3s, transform 0.3s; }
  .q-title { font-family:var(--ffh); font-size:clamp(34px,5vw,60px); line-height:.95; letter-spacing:.02em; color:#fff; margin-bottom:10px; text-transform: uppercase;}
  .q-title em { font-style:normal; color:var(--cyan); }
  .q-sub { font-size:.9rem; color:var(--muted); margin-bottom:28px; line-height:1.65; max-width:580px; }

  /* OPTIONS GRID */
  .opt-grid { display:grid; gap:11px; }
  .g2 { grid-template-columns:1fr 1fr; }
  .g3 { grid-template-columns:1fr 1fr 1fr; }
  @media(max-width:580px) { .g3,.g2 { grid-template-columns:1fr; } }

  .opt { background:var(--bg1); border:1px solid var(--border); border-radius:14px; padding:15px 17px; cursor:pointer; transition:all .2s; position:relative; overflow:hidden; display:flex; align-items:center; gap:12px; animation:fadeUp .35s ease both; }
  .opt::before { content:''; position:absolute; inset:0; background:linear-gradient(135deg,rgba(0,245,255,.03),transparent 60%); opacity:0; transition:opacity .2s; }
  .opt:hover { border-color:var(--bh); transform:translateY(-2px); }
  .opt:hover::before { opacity:1; }
  .opt.sel { background:rgba(0,245,255,.06); border-color:rgba(0,245,255,.4); box-shadow:0 0 20px rgba(0,245,255,.1); }
  .opt.sel::before { opacity:1; }
  .opt-ico { font-size:1.75rem; flex-shrink:0; width:40px; text-align:center; }
  .opt-body { flex:1; min-width:0; }
  .opt-label { font-size:.93rem; font-weight:700; color:#fff; margin-bottom:1px; }
  .opt-desc { font-size:.73rem; color:var(--muted); line-height:1.4; }
  .opt-chk { width:19px; height:19px; border-radius:50%; border:1.5px solid var(--dim); display:flex; align-items:center; justify-content:center; flex-shrink:0; transition:all .2s; margin-left:auto; font-size:10px; font-weight:800; color: transparent;}
  .opt.sel .opt-chk { background:var(--cyan); border-color:var(--cyan); color:#040a14; }

  /* COUNTRY OPTIONS */
  .opt.copt { flex-direction:column; text-align:center; padding:18px 12px; gap:7px; align-items:center; }
  .opt.copt .opt-ico { width:auto; font-size:2.4rem; }
  .opt.copt .opt-chk { display:none; }
  .cbadge { font-family:var(--ffm); font-size:7.5px; padding:2px 8px; border-radius:8px; background:rgba(255,255,255,.04); border:1px solid var(--border); color:var(--muted); margin-top:2px; letter-spacing:.05em; }
  .opt.sel .cbadge { background:rgba(0,245,255,.09); border-color:rgba(0,245,255,.22); color:var(--cyan); }

  /* FIELD OPTIONS (BAR) */
  .fbar-wrap { height:3px; background:var(--dim); border-radius:2px; margin-top:7px; overflow:hidden; }
  .fbar { height:100%; border-radius:2px; transition:width .5s .1s ease; }

  /* SLIDER */
  .slider-wrap { padding:6px 0; }
  .slider-lbl { font-family:var(--ffm); font-size:.65rem; color:var(--muted); letter-spacing:.1em; text-transform:uppercase; margin-bottom:6px; display:block; }
  .slider-display { font-family:var(--ffh); font-size:3.5rem; color:var(--cyan); letter-spacing:.04em; text-align:center; margin:10px 0; }
  .range-inp { width:100%; height:5px; -webkit-appearance:none; appearance:none; background:var(--dim); border-radius:3px; outline:none; cursor:pointer; margin:14px 0; }
  .range-inp::-webkit-slider-thumb { -webkit-appearance:none; width:20px; height:20px; border-radius:50%; background:var(--cyan); cursor:pointer; border:2px solid #fff; box-shadow:0 0 10px rgba(0,245,255,.5); }
  .slider-marks { display:flex; justify-content:space-between; font-family:var(--ffm); font-size:.65rem; color:var(--muted); }

  /* NAV BUTTONS */
  .q-nav { display:flex; align-items:center; gap:10px; margin-top:26px; }
  .btn-back { padding:11px 20px; border:1px solid var(--border); border-radius:10px; background:none; color:var(--muted); font-family:var(--ffb); font-size:.87rem; font-weight:600; cursor:pointer; transition:all .2s; display:flex; align-items:center; gap:5px; }
  .btn-back:hover { color:#fff; border-color:rgba(255,255,255,.18); }
  .btn-next { padding:12px 28px; border-radius:10px; border:none; background:linear-gradient(135deg,var(--cyan),var(--teal)); color:#030a12; font-family:var(--ffb); font-size:.9rem; font-weight:800; cursor:pointer; transition:all .22s; display:flex; align-items:center; gap:7px; }
  .btn-next:hover:not(:disabled) { transform:translateY(-2px); box-shadow:0 12px 30px rgba(0,245,255,.28); }
  .btn-next:disabled { opacity:.3; cursor:not-allowed; }
  .btn-skip { margin-left:auto; font-family:var(--ffm); font-size:.72rem; color:var(--muted); cursor:pointer; letter-spacing:.06em; transition:color .2s; border:none; background:none; }
  .btn-skip:hover { color:var(--text); }

  /* LOADING SCREEN */
  .loading-screen { display:flex; flex-direction:column; align-items:center; justify-content:center; min-height:70vh; gap:22px; animation:fadeIn .4s ease; }
  .loader-globe { width:110px; height:110px; position:relative; margin-bottom:8px; }
  .lr { position:absolute; inset:0; border-radius:50%; border:2px solid transparent; animation:spin 2s linear infinite; }
  .lr:nth-child(1) { border-top-color:var(--cyan); animation-duration:1.8s; }
  .lr:nth-child(2) { inset:10px; border-right-color:var(--teal); animation-duration:2.5s; animation-direction:reverse; }
  .lr:nth-child(3) { inset:22px; border-bottom-color:var(--purple); animation-duration:3.2s; }
  .lr-core { position:absolute; inset:34px; border-radius:50%; background:radial-gradient(circle,rgba(0,245,255,.18),rgba(0,245,255,.04)); border:1px solid rgba(0,245,255,.28); animation:corePulse 2s ease-in-out infinite; }
  @keyframes spin { 100%{transform:rotate(360deg)} }
  @keyframes corePulse { 0%,100%{box-shadow:0 0 10px rgba(0,245,255,.18)} 50%{box-shadow:0 0 26px rgba(0,245,255,.45)} }
  .loader-title { font-family:var(--ffh); font-size:1.9rem; letter-spacing:.07em; color:#fff; }
  .loader-sub { font-family:var(--ffm); font-size:.72rem; color:var(--muted); letter-spacing:.1em; margin-top:-10px; }
  .ls-list { display:flex; flex-direction:column; gap:7px; width:300px; }
  .ls-row { display:flex; align-items:center; gap:9px; font-family:var(--ffm); font-size:.75rem; color:var(--muted); opacity:0; transition:opacity .35s; }
  .ls-row.vis { opacity:1; } .ls-row.done { color:var(--teal); }
  .ls-dot { width:6px; height:6px; border-radius:50%; background:currentColor; flex-shrink:0; }
  .ls-row.cur .ls-dot { background:var(--cyan); animation:blink .8s infinite; }
  .ls-row.cur { color:var(--cyan); }
  @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }

  /* ROADMAP SCREEN */
  .roadmap-screen { width:100%; max-width:1000px; animation:fadeIn .6s ease; }
  .rm-top { text-align:center; margin-bottom:44px; }
  .rm-live-badge { display:inline-flex; align-items:center; gap:7px; padding:5px 14px; background:rgba(0,229,168,.07); border:1px solid rgba(0,229,168,.2); border-radius:20px; font-family:var(--ffm); font-size:.68rem; color:var(--teal); letter-spacing:.1em; margin-bottom:18px; }
  .rm-live-dot { width:6px; height:6px; border-radius:50%; background:var(--teal); animation:livePulse 1.6s infinite; box-shadow:0 0 6px var(--teal); }
  @keyframes livePulse { 0%,100%{box-shadow:0 0 4px var(--teal)} 50%{box-shadow:0 0 12px var(--teal)} }
  .rm-main-title { font-family:var(--ffh); font-size:clamp(42px,6vw,82px); line-height:.92; letter-spacing:.02em; color:#fff; margin-bottom:14px; }
  .rm-chips { display:flex; gap:9px; justify-content:center; flex-wrap:wrap; margin-bottom:8px; }
  .rm-chip { padding:5px 13px; border-radius:8px; font-family:var(--ffm); font-size:.68rem; font-weight:600; border:1px solid; display:flex; align-items:center; gap:5px; }

  /* Stats Grid */
  .rm-stats { display:grid; grid-template-columns:repeat(4,1fr); gap:13px; margin-bottom:42px; }
  @media(max-width:640px) { .rm-stats { grid-template-columns:1fr 1fr; } }
  .rm-stat { background:var(--bg1); border:1px solid var(--border); border-radius:13px; padding:17px 14px; text-align:center; position:relative; overflow:hidden; animation:fadeUp .5s ease both; }
  .rm-stat-val { font-family:var(--ffh); font-size:2rem; letter-spacing:.04em; line-height:1; margin-bottom:5px; }
  .rm-stat-lbl { font-family:var(--ffm); font-size:.62rem; color:var(--muted); letter-spacing:.1em; text-transform:uppercase; line-height:1.4; }

  /* Timeline */
  .timeline { position:relative; padding-left:0; margin-bottom:46px; }
  .tl-spine { position:absolute; left:27px; top:16px; bottom:16px; width:2px; background:linear-gradient(180deg,var(--cyan),var(--teal) 45%,var(--purple) 75%,rgba(168,85,247,0)); }

  .phase { position:relative; padding-left:68px; margin-bottom:34px; animation:fadeUp .5s ease both; }
  .phase:last-child { margin-bottom:0; }
  .ph-node { position:absolute; left:13px; top:0; width:28px; height:28px; border-radius:50%; border:2px solid; display:flex; align-items:center; justify-content:center; font-size:.85rem; z-index:2; background:var(--bg); }
  .ph-node.done { border-color:var(--teal); background:rgba(0,229,168,.07); box-shadow:0 0 12px rgba(0,229,168,.28); }
  .ph-node.active { border-color:var(--cyan); background:rgba(0,245,255,.07); animation:nodeActive 2s ease-in-out infinite; }
  @keyframes nodeActive { 0%,100%{box-shadow:0 0 10px rgba(0,245,255,.28)} 50%{box-shadow:0 0 22px rgba(0,245,255,.55)} }
  .ph-node.soon { border-color:var(--gold); background:rgba(245,158,11,.06); }
  .ph-node.later { border-color:var(--dim); background:var(--bg2); }

  .ph-head { display:flex; align-items:flex-start; gap:12px; margin-bottom:13px; flex-wrap:wrap; }
  .ph-timing { font-family:var(--ffm); font-size:.62rem; color:var(--muted); letter-spacing:.1em; text-transform:uppercase; white-space:nowrap; padding-top:4px; min-width:80px; }
  .ph-title-block { flex:1; }
  .ph-title { font-family:var(--ffh); font-size:1.4rem; letter-spacing:.04em; color:#fff; line-height:1; margin-bottom:3px; }
  .ph-sub { font-size:.78rem; color:var(--muted); line-height:1.5; }
  .ph-status { margin-left:auto; font-family:var(--ffm); font-size:.62rem; padding:3px 9px; border-radius:6px; border:1px solid; white-space:nowrap; align-self:flex-start; }
  .s-done { color:var(--teal); border-color:rgba(0,229,168,.25); background:rgba(0,229,168,.07); }
  .s-now { color:var(--cyan); border-color:rgba(0,245,255,.25); background:rgba(0,245,255,.07); }
  .s-soon { color:var(--gold); border-color:rgba(245,158,11,.25); background:rgba(245,158,11,.07); }
  .s-later { color:var(--muted); border-color:var(--dim); }

  .tasks { display:grid; grid-template-columns:1fr 1fr; gap:9px; }
  @media(max-width:600px) { .tasks { grid-template-columns:1fr; } }
  .task { background:var(--bg1); border:1px solid var(--border); border-radius:11px; padding:12px 14px; display:flex; gap:10px; align-items:flex-start; transition:border-color .2s; cursor:default; position:relative; overflow:hidden; }
  .task:hover { border-color:rgba(255,255,255,.1); }
  .task-ico { font-size:.95rem; flex-shrink:0; margin-top:1px; }
  .task-body { flex:1; min-width:0; }
  .task-title { font-size:.83rem; font-weight:700; color:#fff; margin-bottom:2px; }
  .task-desc { font-size:.71rem; color:var(--muted); line-height:1.5; }
  .task-tag { display:inline-flex; align-items:center; margin-top:6px; font-family:var(--ffm); font-size:.58rem; padding:2px 7px; border-radius:4px; letter-spacing:.05em; border:1px solid; }
  .task-pri { position:absolute; top:0; right:0; bottom:0; width:3px; }

  /* Resources */
  .res-section { margin-bottom:42px; }
  .sec-title { font-family:var(--ffm); font-size:.62rem; color:var(--muted); letter-spacing:.14em; text-transform:uppercase; margin-bottom:14px; display:flex; align-items:center; gap:10px; }
  .sec-title::after { content:''; flex:1; height:1px; background:var(--border); }
  .res-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:11px; }
  @media(max-width:560px) { .res-grid { grid-template-columns:1fr; } }
  .res-card { background:var(--bg1); border:1px solid var(--border); border-radius:12px; padding:15px; transition:all .2s; cursor:pointer; animation:fadeUp .5s ease both; }
  .res-card:hover { border-color:var(--bh); transform:translateY(-2px); }
  .res-ico { font-size:1.4rem; margin-bottom:7px; }
  .res-title { font-size:.83rem; font-weight:700; color:#fff; margin-bottom:3px; }
  .res-desc { font-size:.71rem; color:var(--muted); line-height:1.5; }
  .res-link { font-family:var(--ffm); font-size:.62rem; color:var(--cyan); margin-top:7px; display:block; letter-spacing:.05em; }

  /* Mentor Match */
  .mentor-sec { background:var(--bg1); border:1px solid var(--border); border-radius:16px; padding:24px; margin-bottom:42px; position:relative; overflow:hidden; }
  .mentor-glow { position:absolute; top:-50px; right:-50px; width:220px; height:220px; background:radial-gradient(circle,rgba(168,85,247,.07),transparent 65%); pointer-events:none; }
  .mentor-head { display:flex; align-items:center; justify-content:space-between; margin-bottom:16px; flex-wrap:wrap; gap:8px; }
  .mentor-hed-title { font-family:var(--ffh); font-size:1.45rem; color:#fff; letter-spacing:.04em; }
  .mentor-hed-badge { font-family:var(--ffm); font-size:.62rem; color:var(--purple); background:rgba(168,85,247,.08); border:1px solid rgba(168,85,247,.2); padding:3px 9px; border-radius:6px; }
  .mentor-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:11px; }
  @media(max-width:560px) { .mentor-grid { grid-template-columns:1fr; } }
  .m-card { background:var(--bg2); border:1px solid var(--border); border-radius:12px; padding:14px; text-align:center; transition:all .2s; cursor:pointer; }
  .m-card:hover { border-color:rgba(168,85,247,.3); transform:translateY(-2px); }
  .m-av { width:50px; height:50px; border-radius:50%; margin:0 auto 8px; border:2px solid rgba(0,245,255,.28); overflow:hidden; }
  .m-av img { width:100%; height:100%; object-fit:cover; }
  .m-name { font-family:var(--ffh); font-size:1.05rem; color:#fff; letter-spacing:.03em; margin-bottom:1px; }
  .m-role { font-size:.7rem; color:var(--muted); margin-bottom:8px; line-height:1.4; }
  .m-score-row { display:flex; align-items:center; justify-content:center; gap:5px; }
  .m-score { font-family:var(--ffm); font-size:.72rem; font-weight:600; }
  .m-bar { flex:1; height:3px; background:var(--dim); border-radius:2px; overflow:hidden; max-width:55px; }
  .m-fill { height:100%; border-radius:2px; }
  .m-btn { width:100%; margin-top:10px; padding:7px; border-radius:8px; border:1px solid rgba(0,245,255,.2); background:rgba(0,245,255,.04); font-family:var(--ffb); font-size:.72rem; font-weight:700; color:var(--cyan); cursor:pointer; transition:all .2s; }
  .m-btn:hover { background:rgba(0,245,255,.1); border-color:rgba(0,245,255,.35); }

  /* CTA */
  .rm-cta { background:linear-gradient(135deg,rgba(0,245,255,.04),rgba(168,85,247,.05)); border:1px solid rgba(168,85,247,.2); border-radius:16px; padding:38px; text-align:center; position:relative; overflow:hidden; }
  .rm-cta::before { content:''; position:absolute; inset:0; background:radial-gradient(ellipse at 50% 0%,rgba(168,85,247,.07),transparent 60%); pointer-events:none; }
  .cta-title { font-family:var(--ffh); font-size:clamp(26px,3.5vw,50px); color:#fff; letter-spacing:.02em; margin-bottom:11px; position:relative; }
  .cta-title em { font-style:normal; background:linear-gradient(90deg,var(--cyan),var(--teal)); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
  .cta-sub { color:var(--muted); font-size:.9rem; margin-bottom:22px; position:relative; }
  .cta-btns { display:flex; gap:11px; justify-content:center; flex-wrap:wrap; position:relative; }
  .cta-btn-main { padding:13px 26px; border-radius:10px; border:none; background:linear-gradient(135deg,var(--cyan),var(--teal)); color:#030a12; font-family:var(--ffb); font-size:.88rem; font-weight:800; cursor:pointer; transition:all .2s; letter-spacing:.01em; }
  .cta-btn-main:hover { transform:translateY(-2px); box-shadow:0 12px 28px rgba(0,245,255,.28); }
  .cta-btn-ghost { padding:13px 26px; border-radius:10px; border:1px solid rgba(255,255,255,.13); background:none; color:#fff; font-family:var(--ffb); font-size:.88rem; font-weight:600; cursor:pointer; transition:all .2s; }
  .cta-btn-ghost:hover { border-color:rgba(255,255,255,.28); background:rgba(255,255,255,.04); }

  @keyframes fadeIn { from { opacity:0 } to { opacity:1 } }
  @keyframes fadeUp { from { opacity:0; transform:translateY(14px) } to { opacity:1; transform:translateY(0) } }
`;

const LOADING_STEPS = [
  'Analyzing destination profile…',
  'Mapping academic requirements…',
  'Calculating deadline critical path…',
  'Matching mentor profiles…',
  'Building personalized timeline…',
  'Generating document checklist…',
  'Roadmap ready. Rendering…'
];

// ════════════════════════════════════════════════════════════════════════════════
// 3. REACT COMPONENT
// ════════════════════════════════════════════════════════════════════════════════
export default function CareerPathsPage() {
  const [mounted, setMounted] = useState(false);
  const [phase, setPhase] = useState('quiz'); // 'quiz' | 'loading' | 'roadmap'
  const [curQ, setCurQ] = useState(0);
  const [answers, setAnswers] = useState({ gpa: 75 });
  const [loadingStep, setLoadingStep] = useState(-1);

  useEffect(() => {
    setMounted(true);
    // Inject Fonts
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Syne:wght@400;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }, []);

  // Loading Animation Hook
  useEffect(() => {
    if (phase === 'loading') {
      if (loadingStep < LOADING_STEPS.length) {
        const timer = setTimeout(() => {
          setLoadingStep(prev => prev + 1);
        }, 380);
        return () => clearTimeout(timer);
      } else {
        const timer = setTimeout(() => {
          setPhase('roadmap');
        }, 500);
        return () => clearTimeout(timer);
      }
    }
  }, [phase, loadingStep]);

  if (!mounted) return null;

  const currentQuestion = QS[curQ];
  const pct = phase === 'quiz' ? Math.round((curQ / QS.length) * 100) : 100;
  const navLabel = phase === 'quiz' ? 'Building your profile' : 'Generating roadmap';

  const handleSelect = (qId, value) => {
    setAnswers(prev => ({ ...prev, [qId]: value }));
  };

  const handleNext = () => {
    if (!answers[currentQuestion.id] && currentQuestion.required) return;
    if (curQ < QS.length - 1) {
      setCurQ(prev => prev + 1);
    } else {
      setPhase('loading');
      setLoadingStep(0);
    }
  };

  const handleBack = () => {
    if (curQ > 0) setCurQ(prev => prev - 1);
  };

  const handleSkip = () => {
    if (!answers[currentQuestion.id]) {
      setAnswers(prev => ({ ...prev, [currentQuestion.id]: 'skipped' }));
    }
    if (curQ < QS.length - 1) {
      setCurQ(prev => prev + 1);
    } else {
      setPhase('loading');
      setLoadingStep(0);
    }
  };

  // Safe roadmap vars
  const dest = answers.dest && CDATA[answers.dest] ? answers.dest : 'germany';
  const cd = CDATA[dest];
  const field = answers.field || 'cs_ai';
  const intake = answers.intake || 'win26';
  const gpa = answers.gpa || 75;
  const schol = answers.scholarship || 'any';
  const acc = `var(${cd.accentVar})`;

  const gpaMsg = gpa >= 85 ? "Strong GPA — you're competitive for top programs." :
                 gpa >= 75 ? "Solid GPA — focus on SOP and LOR quality." :
                             "Lower GPA — we'll compensate with strong extras.";
  const scholMsg = schol === 'govt' ? "Targeting government scholarship — deadlines will shape your timeline." :
                   schol === 'self' ? "Self-funded — maximize application strength." : "";

  return (
    <div className="roadmap-tool">
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      
      {/* BACKGROUND ELEMENTS */}
      <div className="bg-ambient" />
      <div className="hex-grid" />
      <div className="scanlines" />
      <div className="sweep" />

      {/* NAVBAR */}
      <nav className="top-nav">
        <Link href="/dashboard/student" className="nav-logo">
          <div className="logo-mk">
            <Triangle size={16} fill="#000" strokeWidth={2} className="rotate-180" />
          </div>
          Mentor<em>Bridge</em>
        </Link>
        <div className="nav-prog-wrap">
          <span>{navLabel}</span>
          <div className="nav-bar">
            <div className="nav-fill" style={{ width: `${pct}%` }}></div>
          </div>
          <span className="nav-pct">{pct}%</span>
        </div>
      </nav>

      {/* SHELL */}
      <div className="shell">
        
        {/* ===================== QUIZ PHASE ===================== */}
        {phase === 'quiz' && (
          <div className="quiz-screen">
            <div className="q-meta">
              <div className="q-badge">Step {curQ + 1} of {QS.length}</div>
              <span className="q-of-lbl">{currentQuestion.id.replace('_', ' ')}</span>
              <div className="q-dots">
                {QS.map((_, i) => (
                  <div key={i} className={`qdot ${i < curQ ? 'done' : i === curQ ? 'cur' : ''}`} />
                ))}
              </div>
            </div>
            
            <div className="prog-bars">
              {QS.map((_, i) => (
                <div key={i} className={`pbar ${i < curQ ? 'done' : i === curQ ? 'cur' : ''}`} />
              ))}
            </div>

            <div className="q-content">
              <div className="q-title">{currentQuestion.title}</div>
              <div className="q-sub">{currentQuestion.sub}</div>

              {/* RENDER OPTIONS BASED ON TYPE */}
              {currentQuestion.type === 'country' && (
                <div className="opt-grid g3">
                  {currentQuestion.opts.map((o, i) => {
                    const isSel = answers[currentQuestion.id] === o.v;
                    return (
                      <div key={o.v} className={`opt copt ${isSel ? 'sel' : ''}`} style={{ animationDelay: `${i * 0.05}s` }} onClick={() => handleSelect(currentQuestion.id, o.v)}>
                        <div className="opt-ico">{o.ico}</div>
                        <div className="opt-label">{o.label}</div>
                        <div className="opt-desc" style={{fontSize: '.72rem', color: 'var(--muted)'}}>{o.desc}</div>
                        <div className="cbadge">{o.badge}</div>
                      </div>
                    );
                  })}
                </div>
              )}

              {currentQuestion.type === 'field' && (
                <div className="opt-grid g2">
                  {currentQuestion.opts.map((o, i) => {
                    const isSel = answers[currentQuestion.id] === o.v;
                    return (
                      <div key={o.v} className={`opt ${isSel ? 'sel' : ''}`} style={{ animationDelay: `${i * 0.05}s` }} onClick={() => handleSelect(currentQuestion.id, o.v)}>
                        <div className="opt-ico">{o.ico}</div>
                        <div className="opt-body">
                          <div className="opt-label">{o.label}</div>
                          <div className="opt-desc">{o.desc}</div>
                          <div className="fbar-wrap">
                            <div className="fbar" style={{ background: o.col, width: isSel ? `${o.demand}%` : '0%' }}></div>
                          </div>
                        </div>
                        <div className="opt-chk">{isSel ? '✓' : ''}</div>
                      </div>
                    );
                  })}
                </div>
              )}

              {currentQuestion.type === 'single' && (
                <div className="opt-grid g2">
                  {currentQuestion.opts.map((o, i) => {
                    const isSel = answers[currentQuestion.id] === o.v;
                    return (
                      <div key={o.v} className={`opt ${isSel ? 'sel' : ''}`} style={{ animationDelay: `${i * 0.05}s` }} onClick={() => handleSelect(currentQuestion.id, o.v)}>
                        <div className="opt-ico">{o.ico}</div>
                        <div className="opt-body">
                          <div className="opt-label">{o.label}</div>
                          <div className="opt-desc">{o.desc}</div>
                        </div>
                        <div className="opt-chk">{isSel ? '✓' : ''}</div>
                      </div>
                    );
                  })}
                </div>
              )}

              {currentQuestion.type === 'slider' && (
                <div className="slider-wrap">
                  <label className="slider-lbl">{currentQuestion.lbl}</label>
                  <div className="slider-display">{answers[currentQuestion.id] || currentQuestion.def}{currentQuestion.unit}</div>
                  <input 
                    type="range" 
                    className="range-inp" 
                    min={currentQuestion.min} 
                    max={currentQuestion.max} 
                    step={currentQuestion.step} 
                    value={answers[currentQuestion.id] || currentQuestion.def} 
                    onChange={(e) => handleSelect(currentQuestion.id, parseInt(e.target.value))}
                  />
                  <div className="slider-marks">
                    {currentQuestion.marks.map((m, i) => <span key={i}>{m}</span>)}
                  </div>
                </div>
              )}

            </div>

            <div className="q-nav">
              <button className="btn-back" style={{ display: curQ > 0 ? 'flex' : 'none' }} onClick={handleBack}>← Back</button>
              <button className="btn-next" disabled={!answers[currentQuestion.id] && currentQuestion.required} onClick={handleNext}>Continue →</button>
              {currentQuestion.skippable && (
                <button className="btn-skip" onClick={handleSkip}>Skip →</button>
              )}
            </div>
          </div>
        )}

        {/* ===================== LOADING PHASE ===================== */}
        {phase === 'loading' && (
          <div className="loading-screen">
            <div className="loader-globe">
              <div className="lr" /><div className="lr" /><div className="lr" />
              <div className="lr-core" />
            </div>
            <div className="loader-title">BUILDING ROADMAP</div>
            <div className="loader-sub">PERSONALIZING EVERY STEP FOR YOU</div>
            <div className="ls-list">
              {LOADING_STEPS.map((s, i) => {
                let cls = "ls-row";
                if (i < loadingStep) cls += " done vis";
                else if (i === loadingStep) cls += " cur vis";
                
                return (
                  <div key={i} className={cls}>
                    <div className="ls-dot" />{s}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ===================== ROADMAP PHASE ===================== */}
        {phase === 'roadmap' && (
          <div className="roadmap-screen">
            
            {/* HERO */}
            <div className="rm-top">
              <div className="rm-live-badge"><div className="rm-live-dot" /> YOUR PERSONALIZED ROADMAP — READY</div>
              <div className="rm-main-title">
                YOUR <span style={{ color: acc }}>{cd.flag} {cd.label.toUpperCase()}</span><br />
                <span style={{ fontSize: '.75em', color: 'var(--muted)' }}>
                  MS {FIELD_NAMES[field] || 'Program'} · {INTAKE_NAMES[intake] || 'Intake'}
                </span>
              </div>
              <div className="rm-chips">
                <div className="rm-chip" style={{ color: acc, borderColor: 'rgba(0, 245, 255, 0.3)', backgroundColor: 'rgba(0, 245, 255, 0.05)' }}>{cd.flag} {cd.label}</div>
                <div className="rm-chip" style={{ color: 'var(--teal)', borderColor: 'rgba(0,229,168,.25)', backgroundColor: 'rgba(0,229,168,.07)' }}>{FIELD_NAMES[field] || 'Field'}</div>
                <div className="rm-chip" style={{ color: 'var(--gold)', borderColor: 'rgba(245,158,11,.25)', backgroundColor: 'rgba(245,158,11,.07)' }}>🎓 GPA {gpa}%</div>
                <div className="rm-chip" style={{ color: 'var(--purple)', borderColor: 'rgba(168,85,247,.25)', backgroundColor: 'rgba(168,85,247,.07)' }}>📅 {INTAKE_NAMES[intake]}</div>
              </div>
              {gpaMsg && (
                <p style={{ fontFamily: 'var(--ffm)', fontSize: '.72rem', color: 'var(--muted)', marginTop: '8px' }}>
                  {gpaMsg}{scholMsg ? ' · ' + scholMsg : ''}
                </p>
              )}
            </div>

            {/* STATS */}
            <div className="rm-stats">
              {cd.stats.map((s, i) => (
                <div key={i} className="rm-stat" style={{ animationDelay: `${i * 0.08}s` }}>
                  <div className="rm-stat-val" style={{ color: s.c }}>{s.val}</div>
                  <div className="rm-stat-lbl">{s.lbl}</div>
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '2px', background: `linear-gradient(90deg,transparent,${s.c},transparent)` }}></div>
                </div>
              ))}
            </div>

            {/* TIMELINE */}
            <div className="sec-title">YOUR STEP-BY-STEP TIMELINE</div>
            <div className="timeline">
              <div className="tl-spine" />
              {cd.phases.map((ph, pi) => (
                <div key={pi} className="phase" style={{ animationDelay: `${pi * 0.1}s` }}>
                  <div className={`ph-node ${ph.node}`}>{ph.icon}</div>
                  <div className="ph-head">
                    <div className="ph-timing">{ph.timing}</div>
                    <div className="ph-title-block">
                      <div className="ph-title">{ph.title}</div>
                      <div className="ph-sub">{ph.sub}</div>
                    </div>
                    <div className={`ph-status ${ph.status}`}>{ph.status_lbl}</div>
                  </div>
                  <div className="tasks">
                    {ph.tasks.map((t, ti) => (
                      <div key={ti} className="task">
                        <div className="task-pri" style={{ background: t.pc }}></div>
                        <div className="task-ico">{t.i}</div>
                        <div className="task-body">
                          <div className="task-title">{t.t}</div>
                          <div className="task-desc">{t.d}</div>
                          <div className="task-tag" style={{ background: t.tc, borderColor: t.tb, color: t.tv }}>{t.tag}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* RESOURCES */}
            <div className="res-section">
              <div className="sec-title">KEY RESOURCES FOR {cd.label.toUpperCase()}</div>
              <div className="res-grid">
                {cd.resources.map((r, i) => (
                  <div key={i} className="res-card" style={{ animationDelay: `${i * 0.06}s` }}>
                    <div className="res-ico">{r.i}</div>
                    <div className="res-title">{r.t}</div>
                    <div className="res-desc">{r.d}</div>
                    <span className="res-link">↗ {r.link}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* MENTORS */}
            <div className="mentor-sec">
              <div className="mentor-glow" />
              <div className="mentor-head">
                <div className="mentor-hed-title">YOUR MATCHED MENTORS</div>
                <div className="mentor-hed-badge">AI SMARTMATCH · {dest.toUpperCase()}</div>
              </div>
              <div className="mentor-grid">
                {cd.mentors.map((m, i) => (
                  <Link href="/mentors" key={i} className="m-card">
                    <div className="m-av"><img src={m.img} alt={m.n} /></div>
                    <div className="m-name">{m.n}</div>
                    <div className="m-role">{m.r}</div>
                    <div className="m-score-row">
                      <span className="m-score" style={{ color: m.c }}>{m.s}%</span>
                      <div className="m-bar"><div className="m-fill" style={{ width: `${m.s}%`, background: m.c }}></div></div>
                      <span style={{ fontFamily: 'var(--ffm)', fontSize: '.62rem', color: 'var(--muted)' }}>MATCH</span>
                    </div>
                    <div className="m-btn">VIEW PROFILE</div>
                  </Link>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="rm-cta">
              <div className="cta-title">READY TO START YOUR <em>JOURNEY?</em></div>
              <div className="cta-sub">Your roadmap is personalized and ready. Book a mentor session to go from planning to action.</div>
              <div className="cta-btns">
                <Link href="/mentors" className="cta-btn-main">BOOK FIRST SESSION →</Link>
                <button className="cta-btn-ghost" onClick={() => window.location.reload()}>REBUILD ROADMAP ↺</button>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}