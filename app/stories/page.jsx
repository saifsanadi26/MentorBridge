'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Triangle } from 'lucide-react'

// ── YOUR EXACT DATABASE ──
const STORIES = [
  {
    storyId: "story_01",
    name: "Rohit",
    background: "Final-year engineering student with average profile",
    targetCountry: "Germany",
    countryFlag: "🇩🇪",
    targetProgram: "MS Computer Science",
    mentorHelpedWith: ["Shortlisting", "Profile Evaluation"],
    result: "Admitted to TU Berlin",
    story: "I was confused about German public universities. My mentor helped me understand which universities matched my profile perfectly.",
    mentorCountry: "Germany",
    mentorImg: "https://randomuser.me/api/portraits/men/11.jpg",
    mentorName: "Aarav Mehta",
    initial: "R"
  },
  {
    storyId: "story_02",
    name: "Panchi",
    background: "CS graduate unsure about US admissions",
    targetCountry: "USA",
    countryFlag: "🇺🇸",
    targetProgram: "MS Data Science",
    mentorHelpedWith: ["GRE Strategy", "SOP Review"],
    result: "Admitted to NYU",
    story: "I didn't know how competitive my profile was. My mentor broke everything down honestly and helped me focus on the right programs.",
    mentorCountry: "USA",
    mentorImg: "https://randomuser.me/api/portraits/women/55.jpg",
    mentorName: "Ritika Sharma",
    initial: "P"
  },
  {
    storyId: "story_03",
    name: "Sneha",
    background: "Commerce graduate aiming for analytics",
    targetCountry: "UK",
    countryFlag: "🇬🇧",
    targetProgram: "MS Business Analytics",
    mentorHelpedWith: ["SOP Structure", "Program Selection"],
    result: "Admitted to U of Manchester",
    story: "Connecting my commerce background to analytics was hard. My mentor helped me reshape my SOP to tell a convincing story.",
    mentorCountry: "UK",
    mentorImg: "https://randomuser.me/api/portraits/women/31.jpg",
    mentorName: "Maanya",
    initial: "S"
  },
  {
    storyId: "story_04",
    name: "Karan",
    background: "Mechanical Engineer worried about APS",
    targetCountry: "Germany",
    countryFlag: "🇩🇪",
    targetProgram: "MS Mechanical Eng",
    mentorHelpedWith: ["APS Process", "Timeline"],
    result: "APS Cleared in 2 Weeks",
    story: "The APS process felt overwhelming. My mentor explained every step in simple terms and helped me plan my timeline.",
    mentorCountry: "Germany",
    mentorImg: "https://randomuser.me/api/portraits/men/41.jpg",
    mentorName: "Siddharth Jain",
    initial: "K"
  },
  {
    storyId: "story_05",
    name: "Imran",
    background: "First-gen student with limited budget",
    targetCountry: "Canada",
    countryFlag: "🇨🇦",
    targetProgram: "MS Economics",
    mentorHelpedWith: ["Funding Options", "Budgeting"],
    result: "Secured Full Funding",
    story: "I was worried about expenses. MentorBridge helped me understand realistic costs and funding possibilities in Canada.",
    mentorCountry: "Canada",
    mentorImg: "https://randomuser.me/api/portraits/women/4.jpg",
    mentorName: "Sneha Banerjee",
    initial: "I"
  },
  {
    storyId: "story_06",
    name: "Ayesha",
    background: "BCA graduate pivoting into Business Analytics",
    targetCountry: "UK",
    countryFlag: "🇬🇧",
    targetProgram: "MSc Business Analytics",
    mentorHelpedWith: ["SOP Review", "Program Shortlist", "Interview Prep"],
    result: "Admitted to University of Leeds",
    story: "My mentor helped me translate my projects into impact-focused bullet points and build a shortlist that balanced rankings with employability.",
    mentorCountry: "UK",
    mentorImg: "https://randomuser.me/api/portraits/women/62.jpg",
    mentorName: "Simran Kaur",
    initial: "A"
  },
  {
    storyId: "story_07",
    name: "Dev",
    background: "Working professional targeting Germany public universities",
    targetCountry: "Germany",
    countryFlag: "🇩🇪",
    targetProgram: "MS Data Engineering",
    mentorHelpedWith: ["University Fit", "APS Guidance", "Timeline Planning"],
    result: "Received admits from 2 public universities",
    story: "The process felt unclear until my mentor broke it down week-by-week. I applied with confidence and received admits without wasting money on wrong programs.",
    mentorCountry: "Germany",
    mentorImg: "https://randomuser.me/api/portraits/men/64.jpg",
    mentorName: "Mohit Aggarwal",
    initial: "D"
  },
  {
    storyId: "story_08",
    name: "Maria",
    background: "Economics graduate searching for scholarship pathways",
    targetCountry: "USA",
    countryFlag: "🇺🇸",
    targetProgram: "MS Data Science",
    mentorHelpedWith: ["Scholarship Strategy", "Essay Storytelling", "Profile Positioning"],
    result: "Secured a partial scholarship",
    story: "I learned how to position my background and write essays that felt authentic. The scholarship strategy changed my entire approach.",
    mentorCountry: "USA",
    mentorImg: "https://randomuser.me/api/portraits/women/24.jpg",
    mentorName: "Ananya Iyer",
    initial: "M"
  },
]

const COUNTRY_MAP = {
  "Germany":   { stripe:"stripe-de", av:"av-de", admit:"admit-de", color:"var(--cyan)" },
  "USA":       { stripe:"stripe-us", av:"av-us", admit:"admit-us", color:"var(--violet)" },
  "UK":        { stripe:"stripe-uk", av:"av-uk", admit:"admit-uk", color:"var(--teal)" },
  "Canada":    { stripe:"stripe-ca", av:"av-ca", admit:"admit-ca", color:"var(--gold)" },
  "Australia": { stripe:"stripe-au", av:"av-au", admit:"admit-au", color:"var(--rose)" },
}

const ALL_COUNTRIES = ['All', ...new Set(STORIES.map(s=>s.targetCountry))].sort((a,b)=>a==='All'?-1:b==='All'?1:a.localeCompare(b))
const ALL_TOPICS    = ['All', ...new Set(STORIES.flatMap(s=>s.mentorHelpedWith))]

const styles = `
  .stories-wrapper {
    --bg: #07090F; --bg-2: #0B0E18; --bg-3: #0F1219; --bg-4: #131720;
    --border: rgba(255,255,255,0.065); --border-h: rgba(255,255,255,0.12);
    --cyan: #00D4FF; --teal: #00E5A8; --violet: #8B7FFF;
    --gold: #FFB800; --gold-2: #FFD84D; --rose: #FF5E8A;
    --text: #E8EAF6; --text-2: #7A7F99; --text-3: #3E4460;
    --ff-head: 'Syne', sans-serif; --ff-body: 'DM Sans', sans-serif; --ff-mono: 'JetBrains Mono', monospace;
    --r: 16px;
    background: var(--bg); font-family: var(--ff-body); color: var(--text); -webkit-font-smoothing: antialiased; overflow-x: hidden; min-height: 100vh; position: relative;
  }
  .stories-wrapper a { text-decoration: none; color: inherit; }

  /* BG */
  .bg-wrap { position: absolute; inset: 0; z-index: 0; pointer-events: none; overflow: hidden; }
  .orb { position: absolute; border-radius: 50%; filter: blur(120px); animation: orb-drift 22s ease-in-out infinite alternate; }
  .orb-1 { width: 800px; height: 800px; background: radial-gradient(circle, rgba(0,229,168,.08) 0%, transparent 65%); top: -300px; left: -200px; }
  .orb-2 { width: 600px; height: 600px; background: radial-gradient(circle, rgba(139,127,255,.07) 0%, transparent 65%); bottom: -150px; right: -100px; animation-delay: -9s; }
  .orb-3 { width: 500px; height: 500px; background: radial-gradient(circle, rgba(0,212,255,.06) 0%, transparent 65%); top: 40%; left: 35%; animation-delay: -5s; }
  @keyframes orb-drift { 0%{transform:translate(0,0)} 100%{transform:translate(50px,35px)} }
  .grid-bg { position: absolute; inset: 0; z-index: 0; pointer-events: none; background: linear-gradient(rgba(255,255,255,.018) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.018) 1px, transparent 1px); background-size: 56px 56px; -webkit-mask-image: radial-gradient(ellipse 80% 60% at 50% 0%, black 30%, transparent 100%); }
  
  /* NAV */
  .nav { position: fixed; top: 0; left: 0; right: 0; z-index: 900; height: 62px; background: rgba(7,9,15,.82); backdrop-filter: blur(24px); border-bottom: 1px solid var(--border); display: flex; align-items: center; padding: 0 44px; }
  .brand { display: flex; align-items: center; gap: 9px; margin-right: 36px; }
  .brand-ico { width: 32px; height: 32px; background: linear-gradient(135deg, var(--cyan), var(--teal)); border-radius: 9px; display: flex; align-items: center; justify-content: center; font-size: 16px; box-shadow: 0 0 18px rgba(0,212,255,.3); color: #000; }
  .brand-name { font-family: var(--ff-head); font-size: 16px; font-weight: 700; letter-spacing: -.03em; background: linear-gradient(135deg, #fff 30%, var(--cyan)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
  .nav-links { display: flex; align-items: center; gap: 1px; flex: 1; justify-content: center;}
  .nav-links a { font-size: 13px; color: var(--text-2); padding: 6px 12px; border-radius: 8px; transition: all .18s; }
  .nav-links a:hover { color: var(--text); background: rgba(255,255,255,.05); }
  .nav-links a.active { color: var(--teal); background: rgba(0,229,168,.07); }
  .nav-end { display: flex; gap: 8px; }
  .btn { display: inline-flex; align-items: center; gap: 6px; border-radius: 10px; font-family: var(--ff-body); font-weight: 500; cursor: pointer; transition: all .2s; border: none; font-size: 13.5px; }
  .btn-sm { padding: 8px 17px; }
  .btn-md { padding: 11px 22px; font-size: 14px; }
  .btn-ghost { background: transparent; border: 1px solid var(--border-h); color: var(--text); }
  .btn-ghost:hover { border-color: rgba(255,255,255,.25); background: rgba(255,255,255,.05); }
  .btn-primary { background: linear-gradient(135deg, var(--cyan), var(--teal)); color: #050C12; font-weight: 700; box-shadow: 0 0 22px rgba(0,212,255,.28); }
  .btn-primary:hover { box-shadow: 0 0 36px rgba(0,212,255,.48); transform: translateY(-1px); }
  .btn-teal { background: linear-gradient(135deg, var(--teal), #00FFB2); color: #050C0A; font-weight: 700; box-shadow: 0 0 22px rgba(0,229,168,.28); }
  .btn-teal:hover { box-shadow: 0 0 36px rgba(0,229,168,.48); transform: translateY(-1px); }

  /* PAGE */
  .page { max-width: 1280px; margin: 0 auto; padding: 96px 44px 96px; position: relative; z-index: 1; }

  /* HEADER */
  .hero-head { margin-bottom: 48px; animation: up .65s ease both; }
  .eyebrow { display: inline-flex; align-items: center; gap: 8px; font-family: var(--ff-mono); font-size: 10.5px; letter-spacing: .15em; text-transform: uppercase; padding: 5px 13px; border-radius: 30px; margin-bottom: 18px; }
  .ey-teal { color: var(--teal); background: rgba(0,229,168,.07); border: 1px solid rgba(0,229,168,.2); }
  .ey-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--teal); box-shadow: 0 0 8px var(--teal); animation: blink 2s infinite; }
  @keyframes blink { 0%,100%{opacity:1} 50%{opacity:.25} }
  .page-title { font-family: var(--ff-head); font-size: clamp(34px,4.5vw,58px); font-weight: 800; letter-spacing: -.04em; line-height: 1.06; margin-bottom: 14px; }
  .page-title .grad { background: linear-gradient(135deg, var(--teal) 0%, var(--cyan) 60%, #A0F0FF 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
  .page-sub { font-size: 16px; color: var(--text-2); line-height: 1.7; max-width: 560px; }

  /* IMPACT STRIP */
  .impact-strip { margin-bottom: 44px; background: var(--bg-2); border: 1px solid var(--border); border-radius: 18px; padding: 28px 36px; display: grid; grid-template-columns: repeat(4,1fr); gap: 0; animation: up .65s .1s ease both; position: relative; overflow: hidden; }
  .impact-strip::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; background: linear-gradient(90deg, var(--teal), var(--cyan), var(--violet), var(--gold)); }
  .impact-item { text-align: center; padding: 8px; border-right: 1px solid var(--border); }
  .impact-item:last-child { border-right: none; }
  .impact-num { font-family: var(--ff-head); font-size: 36px; font-weight: 800; letter-spacing: -.04em; line-height: 1; margin-bottom: 6px; }
  .impact-label { font-size: 13px; color: var(--text-2); }
  .impact-sub { font-family: var(--ff-mono); font-size: 10px; color: var(--text-3); margin-top: 4px; letter-spacing: .05em; }

  /* FEATURED STORY */
  .feat-wrap { margin-bottom: 36px; animation: up .65s .14s ease both; }
  .feat-card { background: var(--bg-2); border: 1px solid rgba(0,229,168,.22); border-radius: 20px; overflow: hidden; position: relative; }
  .feat-card::before { content: ''; position: absolute; inset: 0; background: radial-gradient(ellipse 70% 100% at 0% 50%, rgba(0,229,168,.05) 0%, transparent 60%); pointer-events: none; }
  .feat-card::after { content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 3px; background: linear-gradient(180deg, var(--teal), var(--cyan)); }
  .feat-topbar { background: linear-gradient(90deg, rgba(0,229,168,.12), rgba(0,229,168,.03)); border-bottom: 1px solid rgba(0,229,168,.12); padding: 9px 26px; display: flex; align-items: center; gap: 10px; }
  .feat-topbar-label { font-family: var(--ff-mono); font-size: 10px; letter-spacing: .15em; text-transform: uppercase; color: var(--teal); }
  .feat-pulse { width: 7px; height: 7px; border-radius: 50%; background: var(--teal); box-shadow: 0 0 8px var(--teal); animation: blink 1.5s infinite; }
  .feat-topbar-badge { margin-left: auto; font-family: var(--ff-mono); font-size: 9.5px; padding: 3px 10px; border-radius: 20px; background: rgba(0,229,168,.12); border: 1px solid rgba(0,229,168,.25); color: var(--teal); }
  .feat-body { display: flex; align-items: center; padding: 28px 28px 28px 32px; gap: 28px; flex-wrap: wrap; }
  .feat-av { width: 72px; height: 72px; border-radius: 50%; border: 3px solid rgba(0,229,168,.35); background: linear-gradient(135deg,#0a2030,#1a4040); display: flex; align-items: center; justify-content: center; font-family: var(--ff-head); font-size: 26px; font-weight: 800; color: var(--teal); flex-shrink: 0; position: relative; }
  .feat-av::after { content: ''; position: absolute; inset: -5px; border-radius: 50%; border: 1px solid rgba(0,229,168,.18); animation: spin 9s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }
  .feat-admit-ring { position: absolute; top: -4px; right: -4px; background: var(--teal); color: #050C0A; font-family: var(--ff-mono); font-size: 8px; font-weight: 700; padding: 2px 6px; border-radius: 10px; border: 2px solid var(--bg-2); white-space: nowrap; }
  .feat-info { flex: 1; min-width: 220px; }
  .feat-name { font-family: var(--ff-head); font-size: 20px; font-weight: 800; letter-spacing: -.03em; margin-bottom: 4px; }
  .feat-dest { font-size: 13px; color: var(--text-2); margin-bottom: 14px; display: flex; align-items: center; gap: 7px; flex-wrap: wrap; }
  .feat-quote { font-size: 15px; color: var(--text); line-height: 1.7; font-style: italic; max-width: 480px; position: relative; padding-left: 18px; }
  .feat-quote::before { content: '"'; position: absolute; left: 0; top: -5px; font-size: 28px; color: var(--teal); opacity: .5; font-family: Georgia, serif; line-height: 1; }
  .feat-divider { width: 1px; height: 100px; background: var(--border); flex-shrink: 0; }
  .feat-result-box { min-width: 200px; padding: 0 24px; }
  .feat-res-label { font-family: var(--ff-mono); font-size: 9px; letter-spacing: .13em; text-transform: uppercase; color: var(--text-3); margin-bottom: 8px; }
  .feat-res-val { font-family: var(--ff-head); font-size: 17px; font-weight: 800; color: var(--teal); line-height: 1.3; margin-bottom: 14px; }
  .feat-helped { display: flex; flex-direction: column; gap: 5px; }
  .feat-helped-label { font-family: var(--ff-mono); font-size: 9px; letter-spacing: .13em; text-transform: uppercase; color: var(--text-3); margin-bottom: 4px; }
  .helped-chip { font-size: 11.5px; padding: 3px 10px; border-radius: 20px; background: rgba(0,229,168,.07); border: 1px solid rgba(0,229,168,.2); color: var(--teal); display: inline-flex; align-items: center; gap: 5px; }

  /* SEARCH + FILTER */
  .controls-wrap { margin-bottom: 24px; animation: up .65s .2s ease both; }
  .search-row { display: flex; gap: 11px; margin-bottom: 16px; }
  .search-box { flex: 1; position: relative; }
  .search-ico { position: absolute; left: 15px; top: 50%; transform: translateY(-50%); font-size: 15px; color: var(--text-3); pointer-events: none; }
  .search-input { width: 100%; background: var(--bg-2); border: 1px solid var(--border); color: var(--text); font-family: var(--ff-body); font-size: 13.5px; padding: 12px 15px 12px 42px; border-radius: 12px; outline: none; transition: all .2s; }
  .search-input::placeholder { color: var(--text-3); }
  .search-input:focus { border-color: rgba(0,229,168,.5); box-shadow: 0 0 0 3px rgba(0,229,168,.08); }
  .sort-sel { background: var(--bg-2); border: 1px solid var(--border); color: var(--text); font-family: var(--ff-body); font-size: 13px; padding: 12px 15px; border-radius: 12px; outline: none; cursor: pointer; min-width: 200px; }
  .sort-sel:focus { border-color: rgba(0,229,168,.4); }
  .filter-row { display: flex; align-items: center; gap: 7px; flex-wrap: wrap; }
  .f-label { font-family: var(--ff-mono); font-size: 9.5px; letter-spacing: .13em; text-transform: uppercase; color: var(--text-3); flex-shrink: 0; }
  .f-chip { background: var(--bg-2); border: 1px solid var(--border); color: var(--text-2); font-family: var(--ff-body); font-size: 12.5px; font-weight: 500; padding: 6px 13px; border-radius: 25px; cursor: pointer; transition: all .18s; }
  .f-chip:hover { border-color: var(--border-h); color: var(--text); }
  .f-chip.on { background: rgba(0,229,168,.1); border-color: rgba(0,229,168,.38); color: var(--teal); }
  .f-sep { width: 1px; height: 18px; background: var(--border); flex-shrink: 0; margin: 0 3px; }

  /* META */
  .meta-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 18px; }
  .meta-txt { font-family: var(--ff-mono); font-size: 11.5px; color: var(--text-2); }
  .meta-txt strong { color: var(--text); font-weight: 600; }

  /* GRID */
  .stories-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; }
  @media(max-width:1020px){ .stories-grid { grid-template-columns: repeat(2,1fr); } }
  @media(max-width:640px) { .stories-grid { grid-template-columns: 1fr; } }

  /* STORY CARD */
  .sc { background: var(--bg-2); border: 1px solid var(--border); border-radius: var(--r); overflow: hidden; display: flex; flex-direction: column; transition: all .28s; position: relative; animation: up .5s ease forwards; }
  .sc::before { content: ''; position: absolute; inset: 0; background: linear-gradient(135deg, rgba(255,255,255,.018) 0%, transparent 55%); pointer-events: none; border-radius: var(--r); }
  .sc:hover { border-color: var(--border-h); transform: translateY(-5px); box-shadow: 0 28px 64px rgba(0,0,0,.5); }

  .sc-stripe { height: 3px; flex-shrink: 0; }
  .stripe-de { background: linear-gradient(90deg,#00D4FF,rgba(0,212,255,.3)); }
  .stripe-us { background: linear-gradient(90deg,#8B7FFF,rgba(139,127,255,.3)); }
  .stripe-uk { background: linear-gradient(90deg,#00E5A8,rgba(0,229,168,.3)); }
  .stripe-ca { background: linear-gradient(90deg,#FFB800,rgba(255,184,0,.3)); }
  .stripe-au { background: linear-gradient(90deg,#FF5E8A,rgba(255,94,138,.3)); }

  .sc-head { padding: 18px 20px 14px; border-bottom: 1px solid var(--border); }
  .sc-head-row { display: flex; align-items: flex-start; justify-content: space-between; gap: 10px; }
  .sc-av { width: 50px; height: 50px; border-radius: 50%; border: 2.5px solid; display: flex; align-items: center; justify-content: center; font-family: var(--ff-head); font-size: 18px; font-weight: 800; flex-shrink: 0; }
  .av-de { border-color: rgba(0,212,255,.4); background: linear-gradient(135deg,#0a2040,#1a4060); color: var(--cyan); }
  .av-us { border-color: rgba(139,127,255,.4); background: linear-gradient(135deg,#1a1040,#3a2070); color: var(--violet); }
  .av-uk { border-color: rgba(0,229,168,.4); background: linear-gradient(135deg,#0a2830,#1a4840); color: var(--teal); }
  .av-ca { border-color: rgba(255,184,0,.4); background: linear-gradient(135deg,#2a1f00,#4a3800); color: var(--gold); }
  .av-au { border-color: rgba(255,94,138,.4); background: linear-gradient(135deg,#2a0a18,#4a1830); color: var(--rose); }
  
  .sc-admit { font-family: var(--ff-mono); font-size: 9.5px; padding: 4px 10px; border-radius: 20px; font-weight: 500; letter-spacing: .04em; white-space: nowrap; }
  .admit-de { background: rgba(0,212,255,.1); color: var(--cyan); border: 1px solid rgba(0,212,255,.25); }
  .admit-us { background: rgba(139,127,255,.1); color: var(--violet); border: 1px solid rgba(139,127,255,.25); }
  .admit-uk { background: rgba(0,229,168,.1); color: var(--teal); border: 1px solid rgba(0,229,168,.25); }
  .admit-ca { background: rgba(255,184,0,.1); color: var(--gold); border: 1px solid rgba(255,184,0,.25); }
  .admit-au { background: rgba(255,94,138,.1); color: var(--rose); border: 1px solid rgba(255,94,138,.25); }

  .sc-name { font-family: var(--ff-head); font-size: 16px; font-weight: 700; letter-spacing: -.02em; margin-top: 12px; margin-bottom: 3px; }
  .sc-bg { font-size: 12px; color: var(--text-2); margin-bottom: 3px; }
  .sc-dest { font-size: 12px; color: var(--text-3); display: flex; align-items: center; gap: 5px; }

  .sc-body { padding: 16px 20px; flex: 1; display: flex; flex-direction: column; gap: 12px; }

  .sc-quote { font-size: 13.5px; color: var(--text-2); line-height: 1.7; font-style: italic; position: relative; padding-left: 16px; }
  .sc-quote::before { content: '"'; position: absolute; left: 0; top: -5px; font-size: 24px; line-height: 1; font-family: Georgia, serif; color: var(--teal); opacity: .45; }

  .sc-result-box { background: var(--bg-3); border: 1px solid var(--border); border-radius: 10px; padding: 10px 13px; }
  .sc-res-label { font-family: var(--ff-mono); font-size: 8.5px; letter-spacing: .12em; text-transform: uppercase; color: var(--text-3); margin-bottom: 4px; }
  .sc-res-val { font-size: 13px; font-weight: 700; }

  .sc-helped-label { font-family: var(--ff-mono); font-size: 8.5px; letter-spacing: .12em; text-transform: uppercase; color: var(--text-3); margin-bottom: 7px; }
  .sc-helped-chips { display: flex; flex-wrap: wrap; gap: 5px; }
  .helped-chip { font-size: 11px; padding: 3px 10px; border-radius: 20px; background: rgba(255,255,255,.04); border: 1px solid var(--border-h); color: var(--text-2); display: flex; align-items: center; gap: 4px; }

  .sc-mentor-row { background: rgba(255,255,255,.02); border: 1px solid var(--border); border-radius: 10px; padding: 9px 12px; display: flex; align-items: center; gap: 10px; text-decoration: none; cursor: pointer; transition: border-color .2s; }
  .sc-mentor-row:hover { border-color: rgba(0,229,168,.3); }
  .sc-mentor-av { width: 32px; height: 32px; border-radius: 50%; overflow: hidden; border: 1.5px solid rgba(0,229,168,.3); flex-shrink: 0; }
  .sc-mentor-av img { width: 100%; height: 100%; object-fit: cover; }
  .sc-mentor-txt { font-size: 12px; color: var(--text-2); }
  .sc-mentor-name { font-weight: 600; color: var(--text); }

  .sc-foot { padding: 12px 18px; border-top: 1px solid var(--border); display: flex; gap: 8px; align-items: center; }
  .sc-foot-country { font-size: 16px; }
  .btn-read { flex: 1; padding: 9px; text-align: center; border-radius: 10px; background: rgba(0,229,168,.08); border: 1px solid rgba(0,229,168,.2); color: var(--teal); font-size: 13px; font-weight: 600; cursor: pointer; font-family: var(--ff-body); transition: all .22s; display: block; }
  .btn-read:hover { background: rgba(0,229,168,.15); box-shadow: 0 0 18px rgba(0,229,168,.2); }
  .btn-save { width: 38px; height: 38px; border-radius: 10px; background: rgba(255,255,255,.03); border: 1px solid var(--border); color: var(--text-2); font-size: 15px; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all .2s; flex-shrink: 0; }
  .btn-save:hover, .btn-save.saved { border-color: rgba(255,94,138,.4); color: var(--rose); background: rgba(255,94,138,.07); }

  .load-wrap { display: flex; justify-content: center; margin-top: 52px; }

  .empty-state { grid-column: span 3; text-align: center; padding: 80px 20px; }
  .empty-ico { font-size: 52px; margin-bottom: 16px; }
  .empty-t { font-family: var(--ff-head); font-size: 22px; font-weight: 700; margin-bottom: 8px; }
  .empty-s { font-size: 14px; color: var(--text-2); }

  /* CTA BANNER */
  .cta-banner { margin-top: 80px; background: var(--bg-2); border: 1px solid rgba(0,229,168,.18); border-radius: 20px; padding: 56px; text-align: center; position: relative; overflow: hidden; animation: up .65s ease both; }
  .cta-banner::before { content: ''; position: absolute; inset: 0; background: radial-gradient(ellipse 80% 60% at 50% 0%, rgba(0,229,168,.06) 0%, transparent 60%); }
  .cta-banner::after { content: ''; position: absolute; top: 0; left: 50%; transform: translateX(-50%); width: 260px; height: 1px; background: linear-gradient(90deg, transparent, var(--teal), transparent); }
  .cta-title { font-family: var(--ff-head); font-size: clamp(28px,4vw,42px); font-weight: 800; letter-spacing: -.04em; margin-bottom: 14px; }
  .cta-title span { background: linear-gradient(135deg, var(--teal), var(--cyan)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
  .cta-sub { font-size: 16px; color: var(--text-2); max-width: 420px; margin: 0 auto 32px; line-height: 1.65; }
  .cta-actions { display: flex; align-items: center; gap: 12px; justify-content: center; }
  .cta-note { margin-top: 16px; font-family: var(--ff-mono); font-size: 11px; color: var(--text-3); }

  .sep { height: 1px; background: linear-gradient(90deg, transparent, var(--border-h) 25%, rgba(0,229,168,.12) 50%, var(--border-h) 75%, transparent); margin: 72px 0 0; position: relative; z-index: 1; }

  @keyframes up { from{opacity:0;transform:translateY(22px)} to{opacity:1;transform:translateY(0)} }
`

export default function StoriesPage() {
  const [search, setSearch] = useState('')
  const [country, setCountry] = useState('All')
  const [topic, setTopic] = useState('All')
  const [sort, setSort] = useState('default')
  const [saved, setSaved] = useState([])
  const [visible, setVisible] = useState(6)

  const toggleSave = (id) => setSaved(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id])

  const filtered = STORIES.filter(s => {
    const q = search.toLowerCase()
    const txt = [s.name, s.targetCountry, s.targetProgram, s.background, ...s.mentorHelpedWith, s.result].join(' ').toLowerCase()
    return (
      txt.includes(q) &&
      (country === 'All' || s.targetCountry === country) &&
      (topic === 'All' || s.mentorHelpedWith.includes(topic))
    )
  }).sort((a,b) => 
    sort === 'alpha' ? a.name.localeCompare(b.name) :
    sort === 'country' ? a.targetCountry.localeCompare(b.targetCountry) :
    0
  )

  const feat = STORIES.find(s => s.storyId === 'story_07') // Dev's Germany Story
  const fc = COUNTRY_MAP[feat.targetCountry] || COUNTRY_MAP['Germany']

  return (
    <div className="stories-wrapper">
      <style>{styles}</style>
      <div className="bg-wrap"><div className="orb orb-1"></div><div className="orb orb-2"></div><div className="orb orb-3"></div></div>
      <div className="grid-bg"></div>
      <div className="noise"></div>

      <nav className="nav">
        <Link className="brand" href="/">
          <div className="brand-ico">
            <Triangle size={16} fill="currentColor" strokeWidth={2} className="rotate-180" />
          </div>
          <span className="brand-name">MentorBridge</span>
        </Link>
        <div className="nav-links">
          <Link href="/mentors">Mentors</Link>
          <Link href="/scholarships">Scholarships</Link>
          <Link href="/stories" className="active">Stories</Link>
          <Link href="/career-paths">Career Paths</Link>
          <Link href="/market-insights">Market Data</Link>
          <Link href="/roi-matrix">ROI Matrix</Link>
        </div>
        <div className="nav-end">
          <Link href="/dashboard/student" className="btn btn-ghost btn-sm">Log in</Link>
          <Link href="/signup" className="btn btn-primary btn-sm">Sign up →</Link>
        </div>
      </nav>

      <div className="page">
        <div className="hero-head">
          <div className="eyebrow ey-teal"><div className="ey-dot"></div>8 Real Stories · Real Admits</div>
          <h1 className="page-title">Stories That <span className="grad">Prove It Works</span></h1>
          <p className="page-sub">Real students. Real mentors. Real outcomes — from confused applicants to top university admits, every story is from your MentorBridge community.</p>
        </div>

        <div className="impact-strip">
          <div className="impact-item">
            <div className="impact-num" style={{color:'var(--teal)'}}>8</div>
            <div className="impact-label">Success Stories</div>
            <div className="impact-sub">In your database</div>
          </div>
          <div className="impact-item">
            <div className="impact-num" style={{color:'var(--cyan)'}}>5</div>
            <div className="impact-label">Countries</div>
            <div className="impact-sub">DE · US · UK · CA · AU</div>
          </div>
          <div className="impact-item">
            <div className="impact-num" style={{color:'var(--violet)'}}>100%</div>
            <div className="impact-label">Got Admitted</div>
            <div className="impact-sub">All stories end in success</div>
          </div>
          <div className="impact-item">
            <div className="impact-num" style={{color:'var(--gold)'}}>4.9★</div>
            <div className="impact-label">Avg Mentor Rating</div>
            <div className="impact-sub">From verified students</div>
          </div>
        </div>

        {feat && (
          <div className="feat-wrap">
            <div className="feat-card">
              <div className="feat-topbar">
                <div className="feat-pulse"></div>
                <span className="feat-topbar-label">Featured Story · Community Favourite</span>
                <span className="feat-topbar-badge">✓ Verified Admit</span>
              </div>
              <div className="feat-body">
                <div className={`feat-av ${fc.av}`}>
                  {feat.initial}
                  <span className="feat-admit-ring">{feat.countryFlag} Admitted</span>
                </div>
                <div className="feat-info">
                  <div className="feat-name">{feat.name}</div>
                  <div className="feat-dest"><span>{feat.countryFlag}</span>{feat.targetCountry} · {feat.targetProgram} · <span style={{color:'var(--text-3)'}}>{feat.background}</span></div>
                  <div className="feat-quote">{feat.story}</div>
                </div>
                <div className="feat-divider"></div>
                <div className="feat-result-box">
                  <div className="feat-res-label">Result</div>
                  <div className="feat-res-val">{feat.result}</div>
                  <div className="feat-helped-label">Mentor helped with</div>
                  <div className="feat-helped">
                    {feat.mentorHelpedWith.map((h, i) => <span key={i} className="helped-chip">✓ {h}</span>)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="controls-wrap">
          <div className="search-row">
            <div className="search-box">
              <span className="search-ico">🔍</span>
              <input className="search-input" placeholder="Search by name, country, program, or what helped..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <select className="sort-sel" value={sort} onChange={e => setSort(e.target.value)}>
              <option value="default">Sort: Default</option>
              <option value="alpha">Sort: A → Z</option>
              <option value="country">By Country</option>
            </select>
          </div>
          <div className="filter-row">
            <span className="f-label">Country:</span>
            {ALL_COUNTRIES.map(c => (
              <button key={c} className={`f-chip ${country === c ? 'on' : ''}`} onClick={() => setCountry(c)}>{c === 'All' ? 'All' : c}</button>
            ))}
            <div className="f-sep"></div>
            <span className="f-label">Helped with:</span>
            {ALL_TOPICS.map(t => (
              <button key={t} className={`f-chip ${topic === t ? 'on' : ''}`} onClick={() => setTopic(t)}>{t === 'All' ? 'All Topics' : t}</button>
            ))}
          </div>
        </div>

        <div className="meta-row">
          <span className="meta-txt">Showing <strong>{Math.min(visible, filtered.length)}</strong> of <strong>{filtered.length}</strong> stories</span>
        </div>

        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-ico">🔍</div>
            <div className="empty-t">No stories found</div>
            <div className="empty-s">Try clearing your filters</div>
          </div>
        ) : (
          <div className="stories-grid">
            {filtered.slice(0, visible).map((s, i) => {
              const cm = COUNTRY_MAP[s.targetCountry] || COUNTRY_MAP['Germany']
              const isSaved = saved.includes(s.storyId)
              const resArr = s.result.split(' ')
              const admitTxt = resArr.length > 3 ? resArr.slice(0, 3).join(' ') + '...' : s.result

              return (
                <div className="sc" key={s.storyId} style={{animationDelay: `${i*0.08}s`}}>
                  <div className={`sc-stripe ${cm.stripe}`}></div>

                  <div className="sc-head">
                    <div className="sc-head-row">
                      <div className={`sc-av ${cm.av}`}>{s.initial}</div>
                      <span className={`sc-admit ${cm.admit}`}>✓ {admitTxt}</span>
                    </div>
                    <div className="sc-name">{s.name}</div>
                    <div className="sc-bg">{s.background}</div>
                    <div className="sc-dest"><span>{s.countryFlag}</span>{s.targetCountry} · {s.targetProgram}</div>
                  </div>

                  <div className="sc-body">
                    <div className="sc-quote">{s.story}</div>

                    <div className="sc-result-box">
                      <div className="sc-res-label">🎉 Final Result</div>
                      <div className="sc-res-val" style={{color: cm.color}}>{s.result}</div>
                    </div>

                    <div>
                      <div className="sc-helped-label">Mentor Helped With</div>
                      <div className="sc-helped-chips">
                        {s.mentorHelpedWith.map((h, j) => <span key={j} className="helped-chip">✓ {h}</span>)}
                      </div>
                    </div>

                    {/* THIS NOW CLICKS THROUGH TO THE MENTORS PAGE */}
                    <Link href="/mentors" className="sc-mentor-row">
                      <div className="sc-mentor-av">
                        <img src={s.mentorImg} alt={s.mentorName} />
                      </div>
                      <div className="sc-mentor-txt">Mentored by <span className="sc-mentor-name">{s.mentorName}</span></div>
                    </Link>
                  </div>

                  <div className="sc-foot">
                    <span className="sc-foot-country">{s.countryFlag}</span>
                    <button className="btn-read">Read Full Story →</button>
                    <button className={`btn-save ${isSaved ? 'saved' : ''}`} onClick={() => toggleSave(s.storyId)}>{isSaved ? '♥' : '♡'}</button>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {visible < filtered.length && (
          <div className="load-wrap">
            <button className="btn btn-ghost btn-md" onClick={() => setVisible(v => v + 3)}>Load More Stories ({filtered.length - visible} remaining)</button>
          </div>
        )}

        <div className="sep"></div>
        <div className="cta-banner">
          <div className="cta-title">Ready to Write <span>Your Story?</span></div>
          <p className="cta-sub">Join thousands of students who turned confusion into clarity — with the right mentor by their side.</p>
          <div className="cta-actions">
            <Link href="/mentors" className="btn btn-teal btn-md">Find My Mentor →</Link>
            <Link href="/mentors" className="btn btn-ghost btn-md">Browse Mentors</Link>
          </div>
          <p className="cta-note">Free to browse · No credit card · Match in under 2 minutes</p>
        </div>

      </div>
    </div>
  )
}