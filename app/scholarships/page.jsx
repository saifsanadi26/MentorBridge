'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Triangle } from 'lucide-react'

// ── YOUR EXACT DATABASE ──
const SCHOLS = [
  { scholarshipId:"sch_01", name:"DAAD Development-Related Postgraduate Scholarships", country:"Germany", countryFlag:"🇩🇪", degreeLevel:["Masters"], field:["Engineering","CS","Economics"], fundingType:"Fully Funded", amount:"€934/month + benefits", deadline:"Varies by course", eligibility:"2 years work experience required", officialLink:"https://www.daad.de/en/", urgency:"open", icon:"🎓" },
  { scholarshipId:"sch_02", name:"Fulbright Foreign Student Program", country:"USA", countryFlag:"🇺🇸", degreeLevel:["Masters"], field:["All fields"], fundingType:"Fully Funded", amount:"Tuition + living expenses", deadline:"June–July", eligibility:"Leadership potential & academic excellence", officialLink:"https://foreign.fulbrightonline.org/", urgency:"soon", icon:"🦅" },
  { scholarshipId:"sch_03", name:"Chevening Scholarships", country:"UK", countryFlag:"🇬🇧", degreeLevel:["Masters"], field:["All fields"], fundingType:"Fully Funded", amount:"Full tuition + living costs", deadline:"November", eligibility:"2 years work experience + leadership", officialLink:"https://www.chevening.org/", urgency:"open", icon:"🎖️" },
  { scholarshipId:"sch_04", name:"Vanier Canada Graduate Scholarships", country:"Canada", countryFlag:"🇨🇦", degreeLevel:["PhD"], field:["Research-based programs"], fundingType:"Fully Funded", amount:"CAD 50,000/year", deadline:"November", eligibility:"Academic excellence + research potential", officialLink:"https://vanier.gc.ca/", urgency:"open", icon:"🍁" },
  { scholarshipId:"sch_05", name:"Australia Awards", country:"Australia", countryFlag:"🇦🇺", degreeLevel:["Masters"], field:["Development fields"], fundingType:"Fully Funded", amount:"Tuition + living + flights", deadline:"April", eligibility:"Citizens of participating countries", officialLink:"https://www.dfat.gov.au/people-to-people/australia-awards", urgency:"urgent", icon:"🦘" },
  { scholarshipId:"sch_06", name:"Deutschlandstipendium", country:"Germany", countryFlag:"🇩🇪", degreeLevel:["Masters","Bachelors"], field:["All fields"], fundingType:"Partial", amount:"€300/month", deadline:"Varies by University", eligibility:"High achieving students", officialLink:"https://www.deutschlandstipendium.de/", urgency:"open", icon:"🏛️" },
]

const SCHOL_MENTORS = [
  { mentorId:"mentor_01", name:"Aarav Mehta",     avatarUrl:"https://randomuser.me/api/portraits/men/11.jpg",    university:"TU Munich",        degree:"MS CS",          tag:"DAAD Scholar",       country:"Germany",   flag:"🇩🇪" },
  { mentorId:"mentor_05", name:"Siddharth Jain",  avatarUrl:"https://randomuser.me/api/portraits/men/41.jpg",    university:"RWTH Aachen",      degree:"MS Mech Eng",    tag:"Deutschlandstip.",   country:"Germany",   flag:"🇩🇪" },
  { mentorId:"mentor_03", name:"Kunal Verma",     avatarUrl:"https://randomuser.me/api/portraits/men/32.jpg",    university:"U of Toronto",     degree:"MS AI",          tag:"Ontario Scholar",    country:"Canada",    flag:"🇨🇦" },
  { mentorId:"mentor_04", name:"Maanya",          avatarUrl:"https://randomuser.me/api/portraits/women/31.jpg",  university:"U of Manchester",  degree:"MS Analytics",   tag:"Merit Scholar",      country:"UK",        flag:"🇬🇧" },
  { mentorId:"mentor_08", name:"Priya Malhotra",  avatarUrl:"https://randomuser.me/api/portraits/women/88.jpg", university:"U of Melbourne",   degree:"MS Info Sys",    tag:"Aus. Award Mentor",  country:"Australia", flag:"🇦🇺" },
]

const MENTOR_AVS_BY_COUNTRY = {
  "Germany":   ["https://randomuser.me/api/portraits/men/11.jpg","https://randomuser.me/api/portraits/men/41.jpg","https://randomuser.me/api/portraits/men/64.jpg"],
  "USA":       ["https://randomuser.me/api/portraits/women/55.jpg","https://randomuser.me/api/portraits/women/24.jpg","https://randomuser.me/api/portraits/men/53.jpg"],
  "UK":        ["https://randomuser.me/api/portraits/women/31.jpg","https://randomuser.me/api/portraits/women/62.jpg","https://randomuser.me/api/portraits/women/65.jpg"],
  "Canada":    ["https://randomuser.me/api/portraits/men/32.jpg","https://randomuser.me/api/portraits/women/4.jpg"],
  "Australia": ["https://randomuser.me/api/portraits/women/88.jpg","https://randomuser.me/api/portraits/men/91.jpg"],
}

const ALL_COUNTRIES = ['All', ...new Set(SCHOLS.map(s => s.country))].sort((a,b) => a==='All' ? -1 : b==='All' ? 1 : a.localeCompare(b))
const ALL_FUNDINGS  = ['All', 'Fully Funded', 'Partial']
const ALL_DEGREES   = ['All', 'Bachelors', 'Masters', 'PhD']

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&family=JetBrains+Mono:wght@400;500;600&display=swap');

  .schol-wrapper {
    --bg:#07090F; --bg-2:#0B0E18; --bg-3:#0F1219; --bg-4:#131720;
    --border:rgba(255,255,255,0.065); --border-h:rgba(255,255,255,0.12);
    --cyan:#00D4FF; --teal:#00E5A8; --violet:#8B7FFF;
    --gold:#FFB800; --gold-2:#FFD84D; --rose:#FF5E8A;
    --text:#E8EAF6; --text-2:#7A7F99; --text-3:#3E4460;
    --ff-head:'Syne',sans-serif; --ff-body:'DM Sans',sans-serif; --ff-mono:'JetBrains Mono',monospace;
    --r:16px;
    background:var(--bg); font-family:var(--ff-body); color:var(--text);
    -webkit-font-smoothing:antialiased; overflow-x:hidden; min-height:100vh; position:relative;
  }
  .schol-wrapper a { text-decoration:none; color:inherit; }

  /* BG */
  .bg-wrap { position:absolute; inset:0; z-index:0; pointer-events:none; overflow:hidden; }
  .orb { position:absolute; border-radius:50%; filter:blur(120px); animation:orb-drift 22s ease-in-out infinite alternate; }
  .orb-1 { width:800px; height:800px; background:radial-gradient(circle,rgba(255,184,0,.09) 0%,transparent 65%); top:-300px; left:-200px; }
  .orb-2 { width:600px; height:600px; background:radial-gradient(circle,rgba(0,229,168,.07) 0%,transparent 65%); bottom:-150px; right:-100px; animation-delay:-9s; }
  .orb-3 { width:500px; height:500px; background:radial-gradient(circle,rgba(139,127,255,.07) 0%,transparent 65%); top:35%; left:35%; animation-delay:-5s; }
  @keyframes orb-drift { 0%{transform:translate(0,0)} 100%{transform:translate(50px,35px)} }
  .grid-bg { position:absolute; inset:0; z-index:0; pointer-events:none; background:linear-gradient(rgba(255,255,255,.018) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.018) 1px,transparent 1px); background-size:56px 56px; -webkit-mask-image:radial-gradient(ellipse 80% 60% at 50% 0%,black 30%,transparent 100%); }

  /* NAV */
  .nav { position:fixed; top:0; left:0; right:0; z-index:900; height:62px; background:rgba(7,9,15,.82); backdrop-filter:blur(24px); border-bottom:1px solid var(--border); display:flex; align-items:center; padding:0 44px; gap:0; }
  .brand { display:flex; align-items:center; gap:9px; margin-right:36px; }
  .brand-ico { width:32px; height:32px; background:linear-gradient(135deg,var(--cyan),var(--teal)); border-radius:9px; display:flex; align-items:center; justify-content:center; font-size:16px; box-shadow:0 0 18px rgba(0,212,255,.3); flex-shrink:0; color:#000; }
  .brand-name { font-family:var(--ff-head); font-size:16px; font-weight:700; letter-spacing:-.03em; background:linear-gradient(135deg,#fff 30%,var(--cyan)); -webkit-background-clip:text; -webkit-text-fill-color:transparent; }
  .nav-links { display:flex; align-items:center; gap:1px; flex:1; justify-content:center; }
  .nav-links a { font-size:13px; color:var(--text-2); padding:6px 12px; border-radius:8px; transition:all .18s; }
  .nav-links a:hover { color:var(--text); background:rgba(255,255,255,.05); }
  .nav-links a.active { color:var(--gold); background:rgba(255,184,0,.07); }
  .nav-end { display:flex; gap:8px; }
  .btn { display:inline-flex; align-items:center; gap:6px; border-radius:10px; font-family:var(--ff-body); font-weight:500; cursor:pointer; transition:all .2s; border:none; font-size:13.5px; }
  .btn-sm { padding:8px 17px; }
  .btn-md { padding:11px 22px; font-size:14px; }
  .btn-ghost { background:transparent; border:1px solid var(--border-h); color:var(--text); }
  .btn-ghost:hover { border-color:rgba(255,255,255,.25); background:rgba(255,255,255,.05); }
  .btn-primary { background:linear-gradient(135deg,var(--cyan),var(--teal)); color:#050C12; font-weight:700; box-shadow:0 0 22px rgba(0,212,255,.28); }
  .btn-primary:hover { box-shadow:0 0 36px rgba(0,212,255,.48); transform:translateY(-1px); }
  .btn-gold { background:linear-gradient(135deg,var(--gold),var(--gold-2)); color:#0A0800; font-weight:700; box-shadow:0 0 22px rgba(255,184,0,.28); }
  .btn-gold:hover { box-shadow:0 0 36px rgba(255,184,0,.48); transform:translateY(-1px); }

  /* PAGE */
  .page { max-width:1280px; margin:0 auto; padding:96px 44px 96px; position:relative; z-index:1; }

  /* HEADER */
  .hero-head { margin-bottom:48px; animation:up .65s ease both; }
  .eyebrow { display:inline-flex; align-items:center; gap:8px; font-family:var(--ff-mono); font-size:10.5px; letter-spacing:.15em; text-transform:uppercase; padding:5px 13px; border-radius:30px; margin-bottom:18px; }
  .ey-gold { color:var(--gold); background:rgba(255,184,0,.07); border:1px solid rgba(255,184,0,.2); }
  .ey-dot { width:6px; height:6px; border-radius:50%; animation:blink 2s infinite; }
  @keyframes blink { 0%,100%{opacity:1} 50%{opacity:.25} }
  .page-title { font-family:var(--ff-head); font-size:clamp(34px,4.5vw,58px); font-weight:800; letter-spacing:-.04em; line-height:1.06; margin-bottom:14px; }
  .page-title .grad { background:linear-gradient(135deg,var(--gold) 0%,var(--gold-2) 60%,#FFEC9E 100%); -webkit-background-clip:text; -webkit-text-fill-color:transparent; }
  .page-sub { font-size:16px; color:var(--text-2); line-height:1.7; max-width:540px; }

  /* STATS */
  .stats-row { display:flex; gap:12px; margin-bottom:44px; flex-wrap:wrap; animation:up .65s .08s ease both; }
  .stat-pill { display:flex; align-items:center; gap:13px; background:var(--bg-2); border:1px solid var(--border); border-radius:14px; padding:14px 20px; transition:all .22s; cursor:default; }
  .stat-pill:hover { border-color:var(--border-h); transform:translateY(-2px); }
  .stat-ico { font-size:24px; flex-shrink:0; }
  .stat-num { font-family:var(--ff-head); font-size:22px; font-weight:800; line-height:1; }
  .stat-lab { font-size:11.5px; color:var(--text-2); margin-top:3px; }

  /* FEATURED */
  .feat-wrap { margin-bottom:32px; animation:up .65s .14s ease both; }
  .feat-card { background:var(--bg-2); border:1px solid rgba(255,184,0,.22); border-radius:20px; overflow:hidden; position:relative; }
  .feat-card::before { content:''; position:absolute; inset:0; background:radial-gradient(ellipse 70% 100% at 0% 50%,rgba(255,184,0,.05) 0%,transparent 60%); pointer-events:none; }
  .feat-card::after { content:''; position:absolute; left:0; top:0; bottom:0; width:3px; background:linear-gradient(180deg,var(--gold),var(--gold-2)); }
  .feat-topbar { background:linear-gradient(90deg,rgba(255,184,0,.12),rgba(255,184,0,.03)); border-bottom:1px solid rgba(255,184,0,.12); padding:9px 26px; display:flex; align-items:center; gap:10px; }
  .feat-topbar-label { font-family:var(--ff-mono); font-size:10px; letter-spacing:.15em; text-transform:uppercase; color:var(--gold); }
  .feat-pulse { width:7px; height:7px; border-radius:50%; background:var(--gold); box-shadow:0 0 8px var(--gold); animation:blink 1.5s infinite; }
  .feat-topbar-badge { margin-left:auto; font-family:var(--ff-mono); font-size:9.5px; padding:3px 10px; border-radius:20px; background:rgba(255,184,0,.12); border:1px solid rgba(255,184,0,.25); color:var(--gold); }
  .feat-body { display:flex; align-items:center; padding:26px 26px 26px 30px; gap:24px; flex-wrap:wrap; }
  .feat-icon { width:68px; height:68px; border-radius:16px; background:rgba(255,184,0,.1); border:1px solid rgba(255,184,0,.22); display:flex; align-items:center; justify-content:center; font-size:34px; flex-shrink:0; }
  .feat-info { flex:1; min-width:220px; }
  .feat-name { font-family:var(--ff-head); font-size:19px; font-weight:800; letter-spacing:-.03em; margin-bottom:5px; }
  .feat-meta { font-size:13px; color:var(--text-2); margin-bottom:12px; display:flex; align-items:center; gap:7px; flex-wrap:wrap; }
  .feat-chips { display:flex; gap:6px; flex-wrap:wrap; }
  .deg-chip { font-size:11px; padding:3px 10px; border-radius:20px; background:rgba(0,212,255,.07); border:1px solid rgba(0,212,255,.2); color:var(--cyan); }
  .field-chip { font-family:var(--ff-mono); font-size:10px; padding:3px 9px; border-radius:20px; border:1px solid rgba(139,127,255,.3); color:var(--violet); background:rgba(139,127,255,.07); }
  .feat-divider { width:1px; height:80px; background:var(--border); flex-shrink:0; }
  .feat-stats { display:flex; flex-direction:column; gap:12px; padding:0 20px; min-width:180px; }
  .feat-stat-row { display:flex; flex-direction:column; gap:2px; }
  .feat-stat-lbl { font-family:var(--ff-mono); font-size:9px; letter-spacing:.12em; text-transform:uppercase; color:var(--text-3); }
  .feat-stat-val { font-size:14px; font-weight:600; color:var(--text); }
  .feat-stat-val.gold { font-family:var(--ff-head); font-size:16px; font-weight:800; color:var(--teal); }
  .feat-cta { display:flex; flex-direction:column; gap:8px; align-items:flex-end; min-width:140px; }
  .feat-cta-note { font-size:11px; color:var(--text-3); text-align:center; }

  /* SEARCH */
  .controls-wrap { margin-bottom:24px; animation:up .65s .2s ease both; }
  .search-row { display:flex; gap:11px; margin-bottom:16px; }
  .search-box { flex:1; position:relative; }
  .search-ico { position:absolute; left:15px; top:50%; transform:translateY(-50%); font-size:15px; color:var(--text-3); pointer-events:none; }
  .search-input { width:100%; background:var(--bg-2); border:1px solid var(--border); color:var(--text); font-family:var(--ff-body); font-size:13.5px; padding:12px 15px 12px 42px; border-radius:12px; outline:none; transition:all .2s; }
  .search-input::placeholder { color:var(--text-3); }
  .search-input:focus { border-color:rgba(255,184,0,.5); box-shadow:0 0 0 3px rgba(255,184,0,.08); }
  .sort-sel { background:var(--bg-2); border:1px solid var(--border); color:var(--text); font-family:var(--ff-body); font-size:13px; padding:12px 15px; border-radius:12px; outline:none; cursor:pointer; transition:border-color .2s; min-width:180px; }
  .sort-sel:focus { border-color:rgba(255,184,0,.4); }

  /* FILTERS */
  .filter-row { display:flex; align-items:center; gap:7px; flex-wrap:wrap; }
  .f-label { font-family:var(--ff-mono); font-size:9.5px; letter-spacing:.13em; text-transform:uppercase; color:var(--text-3); flex-shrink:0; }
  .f-chip { background:var(--bg-2); border:1px solid var(--border); color:var(--text-2); font-family:var(--ff-body); font-size:12.5px; font-weight:500; padding:6px 13px; border-radius:25px; cursor:pointer; transition:all .18s; }
  .f-chip:hover { border-color:var(--border-h); color:var(--text); }
  .f-chip.on { background:rgba(255,184,0,.1); border-color:rgba(255,184,0,.38); color:var(--gold); }
  .f-sep { width:1px; height:18px; background:var(--border); flex-shrink:0; margin:0 3px; }

  /* META */
  .meta-row { display:flex; align-items:center; justify-content:space-between; margin-bottom:18px; }
  .meta-txt { font-family:var(--ff-mono); font-size:11.5px; color:var(--text-2); }
  .meta-txt strong { color:var(--text); font-weight:600; }

  /* GRID */
  .schol-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:18px; }
  @media(max-width:1020px){ .schol-grid { grid-template-columns:repeat(2,1fr); } }
  @media(max-width:640px)  { .schol-grid { grid-template-columns:1fr; } }

  /* SCHOLARSHIP CARD */
  .sc { background:var(--bg-2); border:1px solid var(--border); border-radius:var(--r); overflow:hidden; display:flex; flex-direction:column; transition:all .28s; position:relative; animation:up .5s ease forwards; }
  .sc::before { content:''; position:absolute; inset:0; background:linear-gradient(135deg,rgba(255,255,255,.018) 0%,transparent 55%); pointer-events:none; border-radius:var(--r); }
  .sc:hover { border-color:var(--border-h); transform:translateY(-5px); box-shadow:0 28px 64px rgba(0,0,0,.5); }
  .sc-stripe { height:3px; flex-shrink:0; }
  .stripe-full    { background:linear-gradient(90deg,var(--teal),rgba(0,229,168,.3)); }
  .stripe-partial { background:linear-gradient(90deg,var(--cyan),rgba(0,212,255,.3)); }
  .stripe-merit   { background:linear-gradient(90deg,var(--gold),rgba(255,184,0,.3)); }
  .sc-head { padding:18px 20px 14px; border-bottom:1px solid var(--border); }
  .sc-head-top { display:flex; align-items:flex-start; justify-content:space-between; margin-bottom:10px; gap:10px; }
  .sc-icon { width:46px; height:46px; border-radius:12px; display:flex; align-items:center; justify-content:center; font-size:22px; border:1px solid; flex-shrink:0; }
  .ico-full    { background:rgba(0,229,168,.08); border-color:rgba(0,229,168,.2); }
  .ico-partial { background:rgba(0,212,255,.08); border-color:rgba(0,212,255,.2); }
  .ico-merit   { background:rgba(255,184,0,.08); border-color:rgba(255,184,0,.2); }
  .sc-badges { display:flex; flex-direction:column; align-items:flex-end; gap:5px; }
  .sc-badge { font-family:var(--ff-mono); font-size:9.5px; padding:3px 9px; border-radius:20px; font-weight:500; letter-spacing:.04em; white-space:nowrap; }
  .badge-full    { background:rgba(0,229,168,.1); color:var(--teal); border:1px solid rgba(0,229,168,.25); }
  .badge-partial { background:rgba(0,212,255,.1); color:var(--cyan); border:1px solid rgba(0,212,255,.25); }
  .badge-merit   { background:rgba(255,184,0,.1); color:var(--gold); border:1px solid rgba(255,184,0,.25); }
  .sc-name { font-family:var(--ff-head); font-size:14.5px; font-weight:700; letter-spacing:-.02em; line-height:1.3; margin-bottom:6px; }
  .sc-country { font-size:12px; color:var(--text-2); display:flex; align-items:center; gap:5px; }
  .sc-body { padding:14px 20px; flex:1; display:flex; flex-direction:column; gap:12px; }
  .sc-info-grid { display:grid; grid-template-columns:1fr 1fr; gap:8px; }
  .info-box { background:var(--bg-3); border:1px solid var(--border); border-radius:10px; padding:9px 11px; }
  .info-lbl { font-family:var(--ff-mono); font-size:8.5px; letter-spacing:.12em; text-transform:uppercase; color:var(--text-3); margin-bottom:4px; }
  .info-val { font-size:12.5px; font-weight:600; color:var(--text); line-height:1.3; }
  .info-val.money { font-family:var(--ff-head); font-size:13.5px; font-weight:800; color:var(--teal); }
  .urgency-top { display:flex; justify-content:space-between; margin-bottom:5px; }
  .urgency-key { font-family:var(--ff-mono); font-size:9px; letter-spacing:.1em; text-transform:uppercase; color:var(--text-3); }
  .urgency-val { font-family:var(--ff-mono); font-size:9px; font-weight:500; }
  .u-open   { color:var(--teal); }
  .u-soon   { color:var(--gold); }
  .u-urgent { color:var(--rose); }
  .urgency-bar { height:4px; background:rgba(255,255,255,.06); border-radius:2px; overflow:hidden; }
  .urgency-fill { height:100%; border-radius:2px; }
  .uf-open   { background:linear-gradient(90deg,var(--teal),rgba(0,229,168,.35)); width:28%; }
  .uf-soon   { background:linear-gradient(90deg,var(--gold),rgba(255,184,0,.35)); width:55%; }
  .uf-urgent { background:linear-gradient(90deg,var(--rose),rgba(255,94,138,.35)); width:88%; }
  .sc-fields-lbl { font-family:var(--ff-mono); font-size:8.5px; letter-spacing:.12em; text-transform:uppercase; color:var(--text-3); margin-bottom:5px; }
  .sc-fields { display:flex; flex-wrap:wrap; gap:5px; }
  .elig-box { background:rgba(255,255,255,.018); border:1px solid var(--border); border-radius:10px; padding:9px 11px; }
  .elig-lbl { font-family:var(--ff-mono); font-size:8.5px; letter-spacing:.12em; text-transform:uppercase; color:var(--text-3); margin-bottom:4px; }
  .elig-txt { font-size:12px; color:var(--text-2); line-height:1.55; }
  .sc-degrees { display:flex; gap:5px; flex-wrap:wrap; }
  .mentors-linked { background:var(--bg-3); border:1px solid var(--border); border-radius:10px; padding:9px 11px; }
  .ml-lbl { font-family:var(--ff-mono); font-size:8.5px; letter-spacing:.12em; text-transform:uppercase; color:var(--text-3); margin-bottom:6px; }
  .ml-avatars { display:flex; align-items:center; }
  .ml-av { width:26px; height:26px; border-radius:50%; border:2px solid var(--bg-3); margin-left:-7px; overflow:hidden; flex-shrink:0; }
  .ml-av:first-child { margin-left:0; }
  .ml-av img { width:100%; height:100%; object-fit:cover; }
  .ml-count { font-family:var(--ff-mono); font-size:10px; color:var(--text-2); margin-left:10px; }
  .sc-foot { padding:12px 18px; border-top:1px solid var(--border); display:flex; gap:8px; }
  .btn-apply { flex:1; padding:10px; text-align:center; border-radius:10px; background:linear-gradient(135deg,var(--gold),var(--gold-2)); color:#060800; font-size:13px; font-weight:700; cursor:pointer; border:none; font-family:var(--ff-body); transition:all .22s; display:block; }
  .btn-apply:hover { box-shadow:0 0 20px rgba(255,184,0,.42); transform:translateY(-1px); }
  .btn-save { width:38px; height:38px; border-radius:10px; background:rgba(255,255,255,.03); border:1px solid var(--border); color:var(--text-2); font-size:15px; display:flex; align-items:center; justify-content:center; cursor:pointer; transition:all .2s; flex-shrink:0; }
  .btn-save:hover, .btn-save.saved { border-color:rgba(255,94,138,.4); color:var(--rose); background:rgba(255,94,138,.07); }

  /* EMPTY */
  .empty-state { grid-column:span 3; text-align:center; padding:80px 20px; }
  .empty-ico { font-size:52px; margin-bottom:16px; }
  .empty-t { font-family:var(--ff-head); font-size:22px; font-weight:700; margin-bottom:8px; }
  .empty-s { font-size:14px; color:var(--text-2); }

  /* LOAD MORE */
  .load-wrap { display:flex; justify-content:center; margin-top:52px; }

  /* MENTORS SECTION */
  .mentors-section { margin-top:80px; animation:up .65s ease both; }
  .section-head { display:flex; align-items:flex-end; justify-content:space-between; flex-wrap:wrap; gap:16px; margin-bottom:32px; }
  .section-title { font-family:var(--ff-head); font-size:clamp(22px,3vw,32px); font-weight:800; letter-spacing:-.03em; margin-bottom:6px; }
  .section-sub { font-size:14px; color:var(--text-2); }
  .mentor-mini-grid { display:grid; grid-template-columns:repeat(5,1fr); gap:12px; }
  @media(max-width:900px){ .mentor-mini-grid { grid-template-columns:repeat(3,1fr); } }
  .mentor-mini { background:var(--bg-2); border:1px solid var(--border); border-radius:14px; padding:16px; text-align:center; transition:all .25s; cursor:pointer; animation:up .5s ease both; }
  .mentor-mini:hover { border-color:rgba(255,184,0,.3); transform:translateY(-3px); box-shadow:0 20px 50px rgba(0,0,0,.4); }
  .mm-av { width:52px; height:52px; border-radius:50%; border:2px solid rgba(255,184,0,.3); overflow:hidden; margin:0 auto 10px; }
  .mm-av img { width:100%; height:100%; object-fit:cover; }
  .mm-name { font-family:var(--ff-head); font-size:13px; font-weight:700; letter-spacing:-.01em; margin-bottom:3px; }
  .mm-role { font-size:11px; color:var(--text-2); margin-bottom:6px; line-height:1.4; }
  .mm-tag { display:inline-block; font-family:var(--ff-mono); font-size:9px; padding:2px 8px; border-radius:20px; background:rgba(255,184,0,.08); border:1px solid rgba(255,184,0,.2); color:var(--gold); }

  .sep { height:1px; background:linear-gradient(90deg,transparent,var(--border-h) 25%,rgba(255,184,0,.15) 50%,var(--border-h) 75%,transparent); margin:72px 0 0; position:relative; z-index:1; }

  @keyframes up { from{opacity:0;transform:translateY(22px)} to{opacity:1;transform:translateY(0)} }
`

export default function ScholarshipsPage() {
  const [search,  setSearch]  = useState('')
  const [country, setCountry] = useState('All')
  const [funding, setFunding] = useState('All')
  const [degree,  setDegree]  = useState('All')
  const [sort,    setSort]    = useState('name')
  const [saved,   setSaved]   = useState([])
  const [visible, setVisible] = useState(6)

  const toggleSave = (id) =>
    setSaved(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id])

  const filtered = SCHOLS.filter(s => {
    const q   = search.toLowerCase()
    const txt = [s.name, s.country, ...s.field, ...s.degreeLevel, s.fundingType].join(' ').toLowerCase()
    return (
      txt.includes(q) &&
      (country === 'All' || s.country === country) &&
      (funding === 'All' || s.fundingType === funding) &&
      (degree  === 'All' || s.degreeLevel.includes(degree))
    )
  }).sort((a, b) =>
    sort === 'full_first' ? (a.fundingType === 'Fully Funded' ? -1 : 1) :
    sort === 'country'    ? a.country.localeCompare(b.country) :
    a.name.localeCompare(b.name)
  )

  const feat = SCHOLS[0]

  const urgencyLabel = (u) =>
    u === 'urgent' ? 'Closing Soon!' : u === 'soon' ? 'Upcoming' : 'Open Now'

  const linkedMentors = (c) => {
    const avs = MENTOR_AVS_BY_COUNTRY[c] || []
    if (!avs.length) return null
    return (
      <div className="mentors-linked">
        <div className="ml-lbl">Mentors Who Know This Scholarship</div>
        <div className="ml-avatars">
          {avs.map((u, i) => (
            <div key={i} className="ml-av">
              <img src={u} alt="mentor" />
            </div>
          ))}
          <span className="ml-count">{avs.length} mentor{avs.length > 1 ? 's' : ''} available</span>
        </div>
      </div>
    )
  }

  return (
    <div className="schol-wrapper">
      <style>{styles}</style>

      {/* ── BG ORBS — className NOT class ── */}
      <div className="bg-wrap">
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
        <div className="orb orb-3"></div>
      </div>
      <div className="grid-bg"></div>

      {/* ── NAV ── */}
      <nav className="nav">
        <Link className="brand" href="/">
          <div className="brand-ico">
            <Triangle size={16} fill="currentColor" strokeWidth={2} className="rotate-180" />
          </div>
          <span className="brand-name">MentorBridge</span>
        </Link>
        <div className="nav-links">
          <Link href="/mentors">Mentors</Link>
          <Link href="/scholarships" className="active">Scholarships</Link>
          <Link href="/stories">Stories</Link>
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

        {/* ── HERO HEADER ── */}
        <div className="hero-head">
          <div className="eyebrow ey-gold">
            <div className="ey-dot" style={{ background:'var(--gold)', boxShadow:'0 0 8px var(--gold)' }}></div>
            {SCHOLS.length} Scholarships · Live Database
          </div>
          <h1 className="page-title">Fund Your <span className="grad">Global Education</span></h1>
          <p className="page-sub">
            From DAAD to Fulbright to Chevening — every scholarship curated from your database
            with real deadlines, real amounts, and mentor connections.
          </p>
        </div>

        {/* ── STATS ── */}
        <div className="stats-row">
          {[
            { val: SCHOLS.length,                                        lab:'Total Scholarships',    col:'var(--gold)',   ico:'🏅' },
            { val: SCHOLS.filter(s => s.fundingType==='Fully Funded').length, lab:'Fully Funded',    col:'var(--teal)',   ico:'💰' },
            { val: [...new Set(SCHOLS.map(s => s.country))].length,     lab:'Countries Covered',     col:'var(--cyan)',   ico:'🌍' },
            { val: '$2.4M+',                                             lab:'Secured by Students',   col:'var(--violet)', ico:'🎓' },
          ].map((s, i) => (
            <div className="stat-pill" key={i}>
              <span className="stat-ico">{s.ico}</span>
              <div>
                <div className="stat-num" style={{ color: s.col }}>{s.val}</div>
                <div className="stat-lab">{s.lab}</div>
              </div>
            </div>
          ))}
        </div>

        {/* ── FEATURED CARD ── */}
        <div className="feat-wrap">
          <div className="feat-card">
            <div className="feat-topbar">
              <div className="feat-pulse"></div>
              <span className="feat-topbar-label">Featured · Most Applied This Month</span>
              <span className="feat-topbar-badge">🏅 {feat.fundingType}</span>
            </div>
            <div className="feat-body">
              <div className="feat-icon">{feat.icon}</div>
              <div className="feat-info">
                <div className="feat-name">{feat.name}</div>
                <div className="feat-meta">{feat.countryFlag} {feat.country} &nbsp;·&nbsp; For International Students</div>
                <div className="feat-chips">
                  {feat.degreeLevel.map((d, i) => <span key={i} className="deg-chip">{d}</span>)}
                  {feat.field.map((f, i) => <span key={i} className="field-chip">{f}</span>)}
                </div>
              </div>
              <div className="feat-divider"></div>
              <div className="feat-stats">
                <div className="feat-stat-row"><div className="feat-stat-lbl">Amount</div><div className="feat-stat-val gold">{feat.amount}</div></div>
                <div className="feat-stat-row"><div className="feat-stat-lbl">Deadline</div><div className="feat-stat-val">{feat.deadline}</div></div>
                <div className="feat-stat-row"><div className="feat-stat-lbl">Eligibility</div><div className="feat-stat-val" style={{ fontSize:'12.5px', color:'var(--text-2)' }}>{feat.eligibility}</div></div>
              </div>
              <div className="feat-divider"></div>
              <div className="feat-cta">
                <a href={feat.officialLink} target="_blank" rel="noopener noreferrer" className="btn btn-gold btn-md">Apply Now →</a>
                <span className="feat-cta-note">Opens official site</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── SEARCH + FILTERS ── */}
        <div className="controls-wrap">
          <div className="search-row">
            <div className="search-box">
              <span className="search-ico">🔍</span>
              <input
                className="search-input"
                placeholder="Search by name, country, field, degree level..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <select className="sort-sel" value={sort} onChange={e => setSort(e.target.value)}>
              <option value="name">Sort: A → Z</option>
              <option value="full_first">Fully Funded First</option>
              <option value="country">By Country</option>
            </select>
          </div>

          <div className="filter-row">
            <span className="f-label">Country:</span>
            {ALL_COUNTRIES.map(c => (
              <button key={c} className={`f-chip${country === c ? ' on' : ''}`} onClick={() => setCountry(c)}>{c}</button>
            ))}
            <div className="f-sep"></div>
            <span className="f-label">Funding:</span>
            {ALL_FUNDINGS.map(f => (
              <button key={f} className={`f-chip${funding === f ? ' on' : ''}`} onClick={() => setFunding(f)}>{f}</button>
            ))}
            <div className="f-sep"></div>
            <span className="f-label">Degree:</span>
            {ALL_DEGREES.map(d => (
              <button key={d} className={`f-chip${degree === d ? ' on' : ''}`} onClick={() => setDegree(d)}>{d}</button>
            ))}
          </div>
        </div>

        {/* ── META ROW ── */}
        <div className="meta-row">
          <span className="meta-txt">
            Showing <strong>{Math.min(visible, filtered.length)}</strong> of <strong>{filtered.length}</strong> scholarships
          </span>
        </div>

        {/* ── SCHOLARSHIP GRID ── */}
        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-ico">🔍</div>
            <div className="empty-t">No scholarships found</div>
            <div className="empty-s">Try clearing some filters</div>
          </div>
        ) : (
          <div className="schol-grid">
            {filtered.slice(0, visible).map((s, i) => {
              const isSaved = saved.includes(s.scholarshipId)
              const stripeC = s.fundingType === 'Fully Funded' ? 'stripe-full' : s.fundingType === 'Partial' ? 'stripe-partial' : 'stripe-merit'
              const icoC    = s.fundingType === 'Fully Funded' ? 'ico-full'    : s.fundingType === 'Partial' ? 'ico-partial'    : 'ico-merit'
              const badC    = s.fundingType === 'Fully Funded' ? 'badge-full'  : s.fundingType === 'Partial' ? 'badge-partial'  : 'badge-merit'
              const urgC    = s.urgency === 'urgent' ? 'u-urgent' : s.urgency === 'soon' ? 'u-soon' : 'u-open'
              const fillC   = s.urgency === 'urgent' ? 'uf-urgent' : s.urgency === 'soon' ? 'uf-soon' : 'uf-open'

              return (
                <div className="sc" key={s.scholarshipId} style={{ animationDelay:`${i * 0.08}s` }}>
                  <div className={`sc-stripe ${stripeC}`}></div>

                  <div className="sc-head">
                    <div className="sc-head-top">
                      <div className={`sc-icon ${icoC}`}>{s.icon}</div>
                      <div className="sc-badges">
                        <span className={`sc-badge ${badC}`}>{s.fundingType}</span>
                        {s.fundingType === 'Fully Funded' && (
                          <span className="sc-badge badge-full">✓ No Tuition</span>
                        )}
                      </div>
                    </div>
                    <div className="sc-name">{s.name}</div>
                    <div className="sc-country"><span>{s.countryFlag}</span>{s.country}</div>
                  </div>

                  <div className="sc-body">
                    <div className="sc-info-grid">
                      <div className="info-box">
                        <div className="info-lbl">Amount</div>
                        <div className="info-val money">{s.amount}</div>
                      </div>
                      <div className="info-box">
                        <div className="info-lbl">Deadline</div>
                        <div className={`info-val ${urgC}`} style={{ fontFamily:'var(--ff-mono)', fontSize:'12px' }}>{s.deadline}</div>
                      </div>
                    </div>

                    <div>
                      <div className="urgency-top">
                        <span className="urgency-key">Application Window</span>
                        <span className={`urgency-val ${urgC}`}>{urgencyLabel(s.urgency)}</span>
                      </div>
                      <div className="urgency-bar"><div className={`urgency-fill ${fillC}`}></div></div>
                    </div>

                    <div>
                      <div className="sc-fields-lbl">Fields of Study</div>
                      <div className="sc-fields">
                        {s.field.map((f, j) => <span key={j} className="field-chip">{f}</span>)}
                      </div>
                    </div>

                    <div className="elig-box">
                      <div className="elig-lbl">Eligibility</div>
                      <div className="elig-txt">{s.eligibility}</div>
                    </div>

                    <div className="sc-degrees">
                      {s.degreeLevel.map((d, j) => <span key={j} className="deg-chip">{d}</span>)}
                    </div>

                    {linkedMentors(s.country)}
                  </div>

                  <div className="sc-foot">
                    <a
                      href={s.officialLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-apply"
                    >
                      Apply Now →
                    </a>
                    <button
                      className={`btn-save${isSaved ? ' saved' : ''}`}
                      onClick={() => toggleSave(s.scholarshipId)}
                    >
                      {isSaved ? '♥' : '♡'}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* ── LOAD MORE ── */}
        {visible < filtered.length && (
          <div className="load-wrap">
            <button className="btn btn-ghost btn-md" onClick={() => setVisible(v => v + 3)}>
              Load More ({filtered.length - visible} more)
            </button>
          </div>
        )}

        <div className="sep"></div>

        {/* ── MENTORS SECTION ── */}
        <div className="mentors-section">
          <div className="section-head">
            <div>
              <div className="eyebrow ey-gold" style={{ marginBottom:'10px' }}>
                <div className="ey-dot" style={{ background:'var(--gold)', boxShadow:'0 0 8px var(--gold)' }}></div>
                Scholarship Mentors
              </div>
              <div className="section-title">Mentors Who Won These Scholarships</div>
              <div className="section-sub">Book a session with mentors who have firsthand experience with these exact programs.</div>
            </div>
            <Link href="/mentors" className="btn btn-gold btn-md">Browse All Mentors →</Link>
          </div>

          <div className="mentor-mini-grid">
            {SCHOL_MENTORS.map((m, i) => (
              <Link href={`/mentors/${m.mentorId}`} key={m.mentorId} className="mentor-mini" style={{ animationDelay:`${i * 0.08}s` }}>
                <div className="mm-av"><img src={m.avatarUrl} alt="mentor" /></div>
                <div className="mm-name">{m.name}</div>
                <div className="mm-role">{m.degree}<br />{m.university}</div>
                <span className="mm-tag">{m.tag}</span>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}