'use client'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { Triangle } from 'lucide-react'

// ════════════════════════════════════════════════════════════
//  DATA
// ════════════════════════════════════════════════════════════
const CAREERS = [
  { icon: '💻', role: 'Software Engineer', domain: 'CS / TECH', tags: ['Python','Cloud','FAANG'],
    salaries: [{ c:'🇩🇪', v:'€58k' }, { c:'🇺🇸', v:'$110k' }, { c:'🇬🇧', v:'£55k' }], demand: 92 },
  { icon: '📊', role: 'Data Scientist', domain: 'DATA / ML', tags: ['ML','SQL','PyTorch'],
    salaries: [{ c:'🇩🇪', v:'€62k' }, { c:'🇺🇸', v:'$115k' }, { c:'🇬🇧', v:'£58k' }], demand: 95 },
  { icon: '🔒', role: 'Cyber Security Analyst', domain: 'SECURITY / IT', tags: ['CISSP','Cloud','DevSecOps'],
    salaries: [{ c:'🇦🇺', v:'A$90k' }, { c:'🇺🇸', v:'$95k' }, { c:'🇬🇧', v:'£52k' }], demand: 88 },
  { icon: '🤖', role: 'ML / AI Engineer', domain: 'AI / RESEARCH', tags: ['TensorFlow','LLMs','Research'],
    salaries: [{ c:'🇨🇦', v:'C$95k' }, { c:'🇺🇸', v:'$130k' }, { c:'🇩🇪', v:'€70k' }], demand: 98 },
  { icon: '⚙️', role: 'Mechanical Engineer', domain: 'ENGINEERING', tags: ['CAD','R&D','AutoMotive'],
    salaries: [{ c:'🇩🇪', v:'€52k' }, { c:'🇦🇺', v:'A$75k' }, { c:'🇨🇦', v:'C$70k' }], demand: 76 },
  { icon: '📈', role: 'Business Analyst', domain: 'ANALYTICS / MGMT', tags: ['Tableau','Strategy','MBA'],
    salaries: [{ c:'🇬🇧', v:'£48k' }, { c:'🇺🇸', v:'$80k' }, { c:'🇦🇺', v:'A$78k' }], demand: 82 },
  { icon: '🏗️', role: 'Data Engineer', domain: 'DATA INFRA', tags: ['Spark','Kafka','dbt'],
    salaries: [{ c:'🇩🇪', v:'€60k' }, { c:'🇺🇸', v:'$105k' }, { c:'🇨🇦', v:'C$88k' }], demand: 90 },
  { icon: '🧬', role: 'PhD / Researcher', domain: 'ACADEMIA / R&D', tags: ['Publications','Grants','PostDoc'],
    salaries: [{ c:'🇨🇦', v:'C$32k' }, { c:'🇩🇪', v:'€26k' }, { c:'🇺🇸', v:'$38k' }], demand: 65 },
];

const COUNTRIES = {
  de: {
    flag: '🇩🇪', name: 'GERMANY', sub: 'Top for CS, Data, Engineering, Robotics',
    glow: 'rgba(0,245,212,.06)',
    metrics: [
      { label: 'AVG SALARY', value: '€52-70k', cls: 'teal' },
      { label: 'VISA TYPE', value: 'Job Seeker', cls: 'green' },
      { label: 'PR TIMELINE', value: '5 Years', cls: 'purple' },
      { label: 'TUITION', value: '€0-500/sem', cls: 'gold' },
      { label: 'LIVING COST', value: '€800-1.2k/mo', cls: 'teal' },
      { label: 'ENGLISH JOBS', value: 'Yes (Tech)', cls: 'green' },
    ],
    jobs: [
      { name: 'Software Engineer', demand: 'HIGH', salary: '€55-70k' },
      { name: 'Data Scientist', demand: 'HIGH', salary: '€58-72k' },
      { name: 'Mechanical Eng.', demand: 'MED', salary: '€48-60k' },
      { name: 'Robotics Engineer', demand: 'HIGH', salary: '€52-68k' },
      { name: 'Data Engineer', demand: 'HIGH', salary: '€56-72k' },
    ]
  },
  us: {
    flag: '🇺🇸', name: 'USA', sub: 'Highest salaries, FAANG culture, OPT/H1B pathway',
    glow: 'rgba(168,85,247,.06)',
    metrics: [
      { label: 'AVG SALARY', value: '$90-130k', cls: 'teal' },
      { label: 'VISA TYPE', value: 'OPT + H1B', cls: 'purple' },
      { label: 'PR TIMELINE', value: '10-15 Yrs', cls: 'gold' },
      { label: 'TUITION', value: '$25-55k/yr', cls: 'gold' },
      { label: 'LIVING COST', value: '$2-3.5k/mo', cls: 'purple' },
      { label: 'GRE NEEDED', value: 'Often Yes', cls: 'teal' },
    ],
    jobs: [
      { name: 'Software Engineer', demand: 'HIGH', salary: '$110-145k' },
      { name: 'ML / AI Engineer', demand: 'HIGH', salary: '$125-160k' },
      { name: 'Data Scientist', demand: 'HIGH', salary: '$105-135k' },
      { name: 'Business Analyst', demand: 'MED', salary: '$75-100k' },
      { name: 'Finance Analyst', demand: 'MED', salary: '$80-110k' },
    ]
  },
  uk: {
    flag: '🇬🇧', name: 'UK', sub: 'Strong for analytics, finance, management programs',
    glow: 'rgba(245,158,11,.05)',
    metrics: [
      { label: 'AVG SALARY', value: '£45-58k', cls: 'teal' },
      { label: 'VISA TYPE', value: 'Graduate Visa', cls: 'green' },
      { label: 'PR TIMELINE', value: '5 Years', cls: 'purple' },
      { label: 'TUITION', value: '£15-25k/yr', cls: 'gold' },
      { label: 'LIVING COST', value: '£1-2k/mo', cls: 'purple' },
      { label: 'DURATION', value: '1 Year MSc', cls: 'green' },
    ],
    jobs: [
      { name: 'Business Analyst', demand: 'HIGH', salary: '£48-65k' },
      { name: 'Finance Analyst', demand: 'HIGH', salary: '£52-72k' },
      { name: 'Software Engineer', demand: 'HIGH', salary: '£52-70k' },
      { name: 'Data Scientist', demand: 'MED', salary: '£52-68k' },
      { name: 'Marketing Mgr.', demand: 'MED', salary: '£42-58k' },
    ]
  },
  ca: {
    flag: '🇨🇦', name: 'CANADA', sub: 'AI research hub, strong PR pathway via Express Entry',
    glow: 'rgba(52,211,153,.05)',
    metrics: [
      { label: 'AVG SALARY', value: 'C$75-100k', cls: 'teal' },
      { label: 'VISA TYPE', value: 'PGWP 3yr', cls: 'green' },
      { label: 'PR TIMELINE', value: '1-3 Years', cls: 'green' },
      { label: 'TUITION', value: 'C$15-35k/yr', cls: 'gold' },
      { label: 'LIVING COST', value: 'C$1.2-2k/mo', cls: 'purple' },
      { label: 'RESEARCH', value: 'World Class', cls: 'teal' },
    ],
    jobs: [
      { name: 'ML / AI Engineer', demand: 'HIGH', salary: 'C$95-125k' },
      { name: 'Software Engineer', demand: 'HIGH', salary: 'C$85-115k' },
      { name: 'Data Engineer', demand: 'HIGH', salary: 'C$82-110k' },
      { name: 'Economics Analyst', demand: 'MED', salary: 'C$70-95k' },
      { name: 'Policy Analyst', demand: 'MED', salary: 'C$65-85k' },
    ]
  },
  au: {
    flag: '🇦🇺', name: 'AUSTRALIA', sub: 'Strong IT & cyber security market, PR-friendly',
    glow: 'rgba(245,158,11,.05)',
    metrics: [
      { label: 'AVG SALARY', value: 'A$75-95k', cls: 'teal' },
      { label: 'VISA TYPE', value: 'TSS + PR', cls: 'green' },
      { label: 'PR TIMELINE', value: '2-4 Years', cls: 'green' },
      { label: 'TUITION', value: 'A$28-48k/yr', cls: 'gold' },
      { label: 'LIVING COST', value: 'A$1.8-2.5k/mo', cls: 'purple' },
      { label: 'PART-TIME', value: '48 hrs/fort', cls: 'green' },
    ],
    jobs: [
      { name: 'Cyber Security', demand: 'HIGH', salary: 'A$88-115k' },
      { name: 'Software Engineer', demand: 'HIGH', salary: 'A$82-108k' },
      { name: 'Data Scientist', demand: 'MED', salary: 'A$80-105k' },
      { name: 'Business Analyst', demand: 'MED', salary: 'A$72-95k' },
      { name: 'IS Consultant', demand: 'HIGH', salary: 'A$85-112k' },
    ]
  }
};

const HEATMAP_ROLES = ['SWE', 'Data Sci', 'ML Eng', 'Biz Analyst', 'Cyber Sec'];
const HEATMAP_COUNTRIES = ['🇩🇪 DE', '🇺🇸 US', '🇬🇧 UK', '🇨🇦 CA', '🇦🇺 AU'];
const HEATMAP_DATA = [
  ['€58k', '€62k', '€70k', '€45k', '€55k'],  // DE
  ['$110k', '$115k', '$130k', '$80k', '$95k'],  // US
  ['£55k', '£58k', '£62k', '£48k', '£52k'],   // UK
  ['C$88k', 'C$90k', 'C$95k', 'C$72k', 'C$82k'],  // CA
  ['A$85k', 'A$80k', 'A$88k', 'A$75k', 'A$90k'],  // AU
];
const HEATMAP_LEVELS = [
  [2,3,4,1,2],
  [4,4,4,2,3],
  [2,3,3,1,2],
  [3,3,4,2,3],
  [3,3,3,2,4],
];

const ROI_DATA = [
  { flag:'🇩🇪', country:'Germany', program:'MS CS (Public)', rank:1,
    rows: [['Total Tuition','€1-2k'],['Living (2 yrs)','€24k'],['Total Cost','~€26k'],['Avg Start Salary','€58k/yr'],['5-Yr Earnings','€290k']],
    breakeven: '0.5 YRS' },
  { flag:'🇺🇸', country:'USA', program:'MS CS (Private)', rank:2,
    rows: [['Total Tuition','$90k'],['Living (2 yrs)','$70k'],['Total Cost','~$160k'],['Avg Start Salary','$110k/yr'],['5-Yr Earnings','$550k']],
    breakeven: '2.3 YRS' },
  { flag:'🇬🇧', country:'United Kingdom', program:'MSc (1 Year)', rank:3,
    rows: [['Total Tuition','£25k'],['Living (1 yr)','£18k'],['Total Cost','~£43k'],['Avg Start Salary','£52k/yr'],['5-Yr Earnings','£260k']],
    breakeven: '1.8 YRS' },
];

const TIMELINES = {
  cs: [
    { month: 'NOW → M+1', title: 'Profile Audit', desc: 'Assess GPA, projects, work ex, LORs. Identify gaps in your profile vs. target universities.', tags: ['SOP Draft','GRE Decide'], done: true },
    { month: 'M+1 → M+4', title: 'Test Prep + Research', desc: 'GRE/IELTS if needed. Deep research into 8-12 target programs. Connect with a mentor who\'s been there.', tags: ['GRE Prep','University Research'], done: true },
    { month: 'M+4 → M+7', title: 'Applications Open', desc: 'Finalize your shortlist. Write SOPs for each university. Get LoRs. Submit rolling applications.', tags: ['SOP','LoR','Applications'], done: false },
    { month: 'M+7 → M+10', title: 'Await Decisions', desc: 'Receive admits. Compare funding packages. Make your final choice. Apply for visa.', tags: ['Visa','Admit Compare'], done: false },
    { month: 'M+10 → M+12', title: 'Pre-Departure', desc: 'Accommodation search, blocked account (Germany), flights, health insurance, and arrival prep.', tags: ['Housing','Bank','Insurance'], done: false },
    { month: 'M+18', title: 'First Job Offer', desc: 'Internship during semester or job hunt begins. Leverage your mentor\'s network. Average time to first offer: 4-6 months.', tags: ['LinkedIn','Internship','Networking'], done: false },
  ],
  mba: [
    { month: 'NOW → M+2', title: 'GMAT / GRE Prep', desc: 'Analytics programs increasingly accept GRE. Focus on quant. Build a data portfolio (Tableau, SQL).', tags: ['GMAT','SQL Portfolio'], done: true },
    { month: 'M+2 → M+5', title: 'Shortlist Programs', desc: 'Compare MS Business Analytics vs MBA vs MSBA. Match career goals to program ROI.', tags: ['Program Research','ROI Calc'], done: true },
    { month: 'M+5 → M+8', title: 'Applications', desc: 'Analytics SOPs need a quantified narrative. Show impact with numbers. Submit to 6-8 schools.', tags: ['SOP','Quantified Story'], done: false },
    { month: 'M+8 → M+10', title: 'Interviews + Admits', desc: 'Some UK/US schools have video/panel interviews. Prep behavioral + data case questions.', tags: ['Mock Interview','Case Prep'], done: false },
    { month: 'M+10 → M+14', title: 'Start Program', desc: 'Hit the ground running. Build consulting/BI projects. Network hard. Seek internship via career services.', tags: ['Networking','Internship'], done: false },
    { month: 'M+18', title: 'Career Placement', desc: 'Target BI, analytics consulting, or supply chain. Average UK analytics salary: £48k. US: $80k.', tags: ['BI Analyst','Consulting','Supply Chain'], done: false },
  ],
  eng: [
    { month: 'NOW → M+3', title: 'APS Certification (DE)', desc: 'For Germany, start APS immediately — it takes 4-8 weeks. For Canada/AU, skip this step.', tags: ['APS','Uni Docs'], done: true },
    { month: 'M+1 → M+4', title: 'Language + Research', desc: 'German B2 is strongly preferred even for English programs. Research TU9 universities for your field.', tags: ['German B2','TU9 List'], done: true },
    { month: 'M+4 → M+7', title: 'Apply to Engineering Programs', desc: 'Submit to RWTH, TU Munich, TU Berlin, KIT. Strong motivation letter is more important than GPA alone.', tags: ['Motivation Letter','Apply'], done: false },
    { month: 'M+7 → M+10', title: 'Visa + Blocked Account', desc: 'German student visa requires a blocked account of ~€11,208. Apply at embassy 3 months early.', tags: ['Blocked Account','Visa'], done: false },
    { month: 'M+10 → M+18', title: 'HiWi + Network', desc: 'Get a HiWi (student worker) role at a lab or company. This is Germany\'s version of industry networking.', tags: ['HiWi','Industry Network'], done: false },
    { month: 'M+24', title: 'Job Seeker Visa', desc: 'After graduation, 18-month job seeker visa. Average time to first engineering offer in Germany: 3-5 months.', tags: ['Job Seeker Visa','Offer'], done: false },
  ]
};

// SVG Flow Setup
const NODES = {
  source: { label: '🇮🇳 B.Tech\nGrads', col: 0, row: 2 },
  de: { label: '🇩🇪 Germany', col: 1, row: 0, color: '#00f5d4' },
  us: { label: '🇺🇸 USA', col: 1, row: 1, color: '#a855f7' },
  uk: { label: '🇬🇧 UK', col: 1, row: 2, color: '#f59e0b' },
  ca: { label: '🇨🇦 Canada', col: 1, row: 3, color: '#34d399' },
  au: { label: '🇦🇺 Australia', col: 1, row: 4, color: '#f472b6' },
  swe: { label: '💻 SWE', col: 2, row: 0, color: '#00f5d4' },
  data: { label: '📊 Data Sci', col: 2, row: 1, color: '#818cf8' },
  ml: { label: '🤖 ML/AI', col: 2, row: 2, color: '#a855f7' },
  mgmt: { label: '🏢 Management', col: 2, row: 3, color: '#f59e0b' },
  phd: { label: '🎓 Research', col: 2, row: 4, color: '#34d399' },
};

const LINKS = [
  { from: 'source', to: 'de', value: 50, country: 'de' },
  { from: 'source', to: 'us', value: 35, country: 'us' },
  { from: 'source', to: 'uk', value: 15, country: 'uk' },
  { from: 'source', to: 'ca', value: 20, country: 'ca' },
  { from: 'source', to: 'au', value: 10, country: 'au' },
  { from: 'de', to: 'swe', value: 20, country: 'de' },
  { from: 'de', to: 'data', value: 18, country: 'de' },
  { from: 'de', to: 'ml', value: 12, country: 'de' },
  { from: 'us', to: 'swe', value: 20, country: 'us' },
  { from: 'us', to: 'ml', value: 10, country: 'us' },
  { from: 'us', to: 'mgmt', value: 5, country: 'us' },
  { from: 'uk', to: 'mgmt', value: 8, country: 'uk' },
  { from: 'uk', to: 'data', value: 7, country: 'uk' },
  { from: 'ca', to: 'ml', value: 12, country: 'ca' },
  { from: 'ca', to: 'phd', value: 8, country: 'ca' },
  { from: 'au', to: 'swe', value: 5, country: 'au' },
  { from: 'au', to: 'mgmt', value: 5, country: 'au' },
];

const styles = `
  .career-paths-wrapper {
    --teal: #00f5d4; --teal-dim: #00c9ac; --purple: #a855f7; --gold: #f59e0b;
    --bg: #060c14; --bg2: #0d1520; --bg3: #111c2e; --border: rgba(255,255,255,0.07);
    --text: #e2e8f0; --muted: #64748b;
    background: var(--bg); color: var(--text); font-family: 'Syne', sans-serif;
    overflow-x: hidden; min-height: 100vh; position: relative;
  }
  .career-paths-wrapper * { box-sizing: border-box; }
  .career-paths-wrapper a { text-decoration: none; }

  /* NAV */
  nav { position: fixed; top: 0; left: 0; right: 0; z-index: 100; display: flex; align-items: center; justify-content: space-between; padding: 0 40px; height: 64px; background: rgba(6,12,20,0.85); backdrop-filter: blur(16px); border-bottom: 1px solid var(--border); }
  .nav-logo { display: flex; align-items: center; gap: 10px; font-size: 1.1rem; font-weight: 700; color: #fff; text-decoration: none; }
  .nav-logo .logo-icon { width: 34px; height: 34px; border-radius: 9px; background: linear-gradient(135deg, #00f5d4, #a855f7); display: flex; align-items: center; justify-content: center; font-size: 16px; color: #000; }
  .nav-logo span em { font-style: normal; color: var(--teal); }
  .nav-links { display: flex; gap: 28px; }
  .nav-links a { color: var(--muted); text-decoration: none; font-size: 0.85rem; font-weight: 600; transition: color .2s; letter-spacing: .04em; }
  .nav-links a:hover, .nav-links a.active { color: #fff; }
  .nav-links a.active { color: var(--teal); }
  .nav-cta { display: flex; gap: 10px; }
  .btn-ghost { padding: 8px 18px; border: 1px solid var(--border); border-radius: 8px; color: #fff; font-size: 0.82rem; font-weight: 600; cursor: pointer; background: none; font-family: 'Syne', sans-serif; transition: border-color .2s; }
  .btn-ghost:hover { border-color: rgba(255,255,255,.3); }
  .btn-primary { padding: 8px 20px; border-radius: 8px; border: none; background: var(--teal); color: #060c14; font-size: 0.82rem; font-weight: 700; cursor: pointer; font-family: 'Syne', sans-serif; transition: opacity .2s; }
  .btn-primary:hover { opacity: .85; }

  /* BG */
  .grid-bg { position: absolute; inset: 0; z-index: 0; pointer-events: none; background-image: linear-gradient(rgba(0,245,212,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(0,245,212,0.025) 1px, transparent 1px); background-size: 60px 60px; }
  .glow-orb { position: absolute; border-radius: 50%; pointer-events: none; z-index: 0; filter: blur(100px); opacity: 0.12; }
  .orb1 { width: 600px; height: 600px; background: var(--teal); top: -150px; left: -150px; }
  .orb2 { width: 400px; height: 400px; background: var(--purple); bottom: 100px; right: -100px; }

  main { position: relative; z-index: 1; padding-top: 64px; }

  /* HERO */
  .hero { padding: 80px 60px 60px; max-width: 1400px; margin: 0 auto; }
  .hero-badge { display: inline-flex; align-items: center; gap: 8px; padding: 6px 14px; border-radius: 100px; border: 1px solid rgba(0,245,212,.3); font-size: 0.72rem; font-family: 'JetBrains Mono', monospace; color: var(--teal); letter-spacing: .12em; font-weight: 500; margin-bottom: 24px; }
  .hero-badge::before { content: ''; width: 7px; height: 7px; border-radius: 50%; background: var(--teal); animation: pulse 2s infinite; }
  @keyframes pulse { 0%,100%{opacity:1;box-shadow:0 0 0 0 rgba(0,245,212,.4)} 50%{opacity:.7;box-shadow:0 0 0 6px rgba(0,245,212,0)} }
  .hero-title { font-family: 'Bebas Neue', sans-serif; font-size: clamp(60px, 8vw, 110px); line-height: .95; letter-spacing: .02em; color: #fff; margin-bottom: 16px; }
  .hero-title .accent { color: var(--teal); display: block; }
  .hero-sub { font-size: 1.05rem; color: var(--muted); max-width: 500px; line-height: 1.7; margin-bottom: 40px; }
  .hero-stats { display: flex; gap: 40px; flex-wrap: wrap; }
  .stat-num { font-family: 'Bebas Neue', sans-serif; font-size: 2.4rem; color: var(--teal); letter-spacing: .05em; }
  .stat-label { font-size: 0.75rem; color: var(--muted); font-family: 'JetBrains Mono', monospace; letter-spacing: .08em; }

  /* SECTION */
  .section { max-width: 1400px; margin: 0 auto; padding: 60px 60px; }
  .section-label { font-size: 0.7rem; font-family: 'JetBrains Mono', monospace; color: var(--teal); letter-spacing: .15em; font-weight: 500; padding: 5px 12px; border: 1px solid rgba(0,245,212,.25); border-radius: 4px; display: inline-block; margin-bottom: 20px; }
  .section-title { font-family: 'Bebas Neue', sans-serif; font-size: clamp(36px, 4vw, 58px); letter-spacing: .02em; line-height: 1; color: #fff; margin-bottom: 10px; }
  .section-sub { color: var(--muted); font-size: 0.95rem; margin-bottom: 48px; max-width: 600px; line-height: 1.6; }

  /* FLOW CANVAS */
  .flow-container { background: var(--bg2); border: 1px solid var(--border); border-radius: 20px; padding: 40px; margin-bottom: 48px; position: relative; overflow: hidden; }
  .flow-container::before { content: ''; position: absolute; inset: 0; border-radius: 20px; background: radial-gradient(ellipse at 50% 0%, rgba(0,245,212,.04), transparent 60%); pointer-events: none; }
  .flow-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px; flex-wrap: wrap; gap: 16px; }
  .flow-title { font-size: 1.1rem; font-weight: 700; color: #fff; }
  .flow-subtitle { font-size: 0.8rem; color: var(--muted); margin-top: 3px; }
  .country-pills { display: flex; gap: 10px; flex-wrap: wrap; }
  .pill { padding: 8px 16px; border-radius: 100px; border: 1px solid var(--border); font-size: 0.8rem; font-weight: 600; cursor: pointer; transition: all .2s; color: var(--muted); display: flex; align-items: center; gap: 6px; background: transparent; font-family: 'Syne', sans-serif; }
  .pill:hover { border-color: rgba(0,245,212,.4); color: var(--teal); }
  .pill.active { background: rgba(0,245,212,.1); border-color: rgba(0,245,212,.5); color: var(--teal); box-shadow: 0 0 16px rgba(0,245,212,.12); }
  #flow-canvas { width: 100%; height: 420px; display: block; border-radius: 12px; }

  /* CAREERS GRID */
  .careers-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px; margin-bottom: 60px; }
  .career-card { background: var(--bg2); border: 1px solid var(--border); border-radius: 16px; padding: 24px; transition: all .25s; position: relative; overflow: hidden; }
  .career-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; background: var(--teal); transform: scaleX(0); transform-origin: left; transition: transform .3s; }
  .career-card:hover { border-color: rgba(0,245,212,.25); background: var(--bg3); transform: translateY(-2px); box-shadow: 0 16px 40px rgba(0,0,0,.4); }
  .career-card:hover::before { transform: scaleX(1); }
  .card-icon { font-size: 2rem; margin-bottom: 12px; }
  .card-role { font-size: 1rem; font-weight: 700; color: #fff; margin-bottom: 4px; }
  .card-domain { font-size: 0.75rem; color: var(--muted); font-family: 'JetBrains Mono', monospace; letter-spacing: .05em; margin-bottom: 16px; }
  .card-salary { display: flex; gap: 20px; margin-bottom: 16px; }
  .salary-item .s-country { font-size: 0.7rem; color: var(--muted); font-family: 'JetBrains Mono', monospace; }
  .salary-item .s-val { font-size: 1rem; font-weight: 700; color: var(--teal); }
  .card-demand { display: flex; align-items: center; gap: 8px; font-size: 0.72rem; color: var(--muted); }
  .demand-bar { flex: 1; height: 4px; background: rgba(255,255,255,.07); border-radius: 2px; overflow: hidden; }
  .demand-fill { height: 100%; border-radius: 2px; background: linear-gradient(90deg, var(--teal), #a855f7); }
  .card-tags { display: flex; gap: 6px; flex-wrap: wrap; margin-top: 12px; }
  .tag { padding: 3px 9px; border-radius: 4px; font-size: 0.68rem; font-family: 'JetBrains Mono', monospace; background: rgba(255,255,255,.05); color: var(--muted); border: 1px solid var(--border); }

  /* COUNTRY DEEP DIVE */
  .country-section { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 60px; }
  @media (max-width: 900px) { .country-section { grid-template-columns: 1fr; } }
  .country-card { background: var(--bg2); border: 1px solid var(--border); border-radius: 20px; padding: 32px; transition: all .25s; position: relative; overflow: hidden; }
  .country-card::after { content: ''; position: absolute; top: -60px; right: -60px; width: 200px; height: 200px; border-radius: 50%; background: var(--glow, rgba(0,245,212,.03)); filter: blur(40px); }
  .country-card:hover { border-color: rgba(255,255,255,.14); transform: translateY(-2px); }
  .cc-top { display: flex; align-items: center; gap: 16px; margin-bottom: 24px; }
  .cc-flag { font-size: 2.8rem; }
  .cc-name { font-family: 'Bebas Neue', sans-serif; font-size: 2rem; color: #fff; letter-spacing: .04em; }
  .cc-sub { font-size: 0.75rem; color: var(--muted); font-family: 'JetBrains Mono', monospace; }
  .cc-metrics { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; margin-bottom: 24px; }
  .metric-box { background: rgba(255,255,255,.03); border-radius: 10px; padding: 12px; border: 1px solid var(--border); }
  .metric-label { font-size: 0.65rem; color: var(--muted); font-family: 'JetBrains Mono', monospace; letter-spacing: .08em; margin-bottom: 4px; }
  .metric-value { font-size: 1.1rem; font-weight: 700; }
  .metric-value.green { color: #34d399; }
  .metric-value.teal { color: var(--teal); }
  .metric-value.purple { color: var(--purple); }
  .metric-value.gold { color: var(--gold); }
  .cc-jobs-title { font-size: 0.72rem; color: var(--muted); font-family: 'JetBrains Mono', monospace; letter-spacing: .1em; margin-bottom: 12px; }
  .job-row { display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid var(--border); font-size: 0.85rem; }
  .job-row:last-child { border-bottom: none; }
  .job-name { color: var(--text); font-weight: 600; }
  .job-demand { font-size: 0.7rem; font-family: 'JetBrains Mono', monospace; padding: 2px 8px; border-radius: 4px; }
  .job-demand.high { color: #34d399; background: rgba(52,211,153,.1); border: 1px solid rgba(52,211,153,.2); }
  .job-demand.med { color: var(--gold); background: rgba(245,158,11,.1); border: 1px solid rgba(245,158,11,.2); }
  .job-salary { font-size: 0.8rem; color: var(--teal); font-family: 'JetBrains Mono', monospace; font-weight: 500; }

  /* HEATMAP */
  .heatmap-section { margin-bottom: 60px; }
  .heatmap-grid { display: grid; grid-template-columns: 120px repeat(5,1fr); gap: 4px; font-size: 0.72rem; }
  .hm-header { background: transparent; padding: 10px 12px; font-family: 'JetBrains Mono', monospace; color: var(--muted); text-align: center; letter-spacing: .05em; }
  .hm-row-label { background: var(--bg2); border-radius: 8px; padding: 14px 12px; font-weight: 600; color: var(--text); display: flex; align-items: center; gap: 6px; border: 1px solid var(--border); }
  .hm-cell { border-radius: 8px; padding: 14px 8px; display: flex; flex-direction: column; align-items: center; justify-content: center; font-family: 'JetBrains Mono', monospace; font-weight: 500; border: 1px solid transparent; transition: transform .2s, box-shadow .2s; cursor: default; }
  .hm-cell:hover { transform: scale(1.05); z-index: 2; box-shadow: 0 8px 24px rgba(0,0,0,.4); }
  .hm-cell .hm-val { font-size: 0.85rem; }
  .hm-cell .hm-sub { font-size: 0.6rem; color: rgba(255,255,255,.5); margin-top: 2px; }
  .heat-0 { background: rgba(0,245,212,.05); color: var(--muted); }
  .heat-1 { background: rgba(0,245,212,.1); color: #5eead4; }
  .heat-2 { background: rgba(0,245,212,.2); color: #2dd4bf; }
  .heat-3 { background: rgba(0,245,212,.3); color: #00f5d4; }
  .heat-4 { background: rgba(0,245,212,.45); color: #fff; border-color: rgba(0,245,212,.3); box-shadow: 0 0 20px rgba(0,245,212,.15); }

  /* ROI */
  .roi-section { margin-bottom: 80px; }
  .roi-cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
  @media (max-width: 800px) { .roi-cards { grid-template-columns: 1fr; } }
  .roi-card { background: var(--bg2); border: 1px solid var(--border); border-radius: 16px; padding: 28px; position: relative; overflow: hidden; transition: border-color .25s; }
  .roi-card:hover { border-color: rgba(0,245,212,.3); }
  .roi-rank { position: absolute; top: 20px; right: 20px; font-family: 'Bebas Neue', sans-serif; font-size: 5rem; color: rgba(255,255,255,.03); line-height: 1; pointer-events: none; }
  .roi-flag { font-size: 2rem; margin-bottom: 12px; }
  .roi-country { font-family: 'Bebas Neue', sans-serif; font-size: 1.6rem; color: #fff; letter-spacing: .04em; margin-bottom: 4px; }
  .roi-program { font-size: 0.75rem; color: var(--muted); font-family: 'JetBrains Mono', monospace; margin-bottom: 20px; }
  .roi-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid var(--border); }
  .roi-row:last-of-type { border: none; }
  .roi-key { font-size: 0.78rem; color: var(--muted); }
  .roi-val { font-size: 0.82rem; font-weight: 700; color: var(--text); }
  .roi-breakeven { margin-top: 16px; padding: 12px; background: rgba(0,245,212,.06); border-radius: 8px; border: 1px solid rgba(0,245,212,.15); display: flex; align-items: center; justify-content: space-between; }
  .roi-breakeven-label { font-size: 0.7rem; color: var(--teal); font-family: 'JetBrains Mono', monospace; letter-spacing: .08em; }
  .roi-breakeven-val { font-size: 1.4rem; font-family: 'Bebas Neue', sans-serif; color: var(--teal); letter-spacing: .05em; }

  /* TIMELINE */
  .timeline-section { margin-bottom: 60px; }
  .timeline { position: relative; padding-left: 40px; }
  .timeline::before { content: ''; position: absolute; left: 14px; top: 8px; bottom: 8px; width: 2px; background: linear-gradient(180deg, var(--teal), var(--purple), transparent); border-radius: 1px; }
  .tl-item { position: relative; margin-bottom: 32px; opacity: 0; transform: translateX(-20px); animation: slideIn .5s forwards; }
  @keyframes slideIn { to { opacity: 1; transform: translateX(0); } }
  .tl-dot { position: absolute; left: -34px; top: 6px; width: 14px; height: 14px; border-radius: 50%; border: 2px solid var(--teal); background: var(--bg); box-shadow: 0 0 12px rgba(0,245,212,.3); }
  .tl-dot.done { background: var(--teal); }
  .tl-month { font-size: 0.68rem; font-family: 'JetBrains Mono', monospace; color: var(--teal); letter-spacing: .1em; margin-bottom: 4px; }
  .tl-title { font-size: 1rem; font-weight: 700; color: #fff; margin-bottom: 4px; }
  .tl-desc { font-size: 0.82rem; color: var(--muted); line-height: 1.5; }
  .tl-tags { display: flex; gap: 6px; margin-top: 8px; flex-wrap: wrap; }

  /* TABS */
  .tabs { display: flex; gap: 4px; margin-bottom: 28px; padding: 4px; background: var(--bg2); border-radius: 12px; border: 1px solid var(--border); width: fit-content; }
  .tab { padding: 8px 20px; border-radius: 9px; border: none; cursor: pointer; font-family: 'Syne', sans-serif; font-size: 0.82rem; font-weight: 600; color: var(--muted); background: none; transition: all .2s; }
  .tab.active { background: var(--teal); color: #060c14; }
  .tab:hover:not(.active) { color: #fff; }

  /* CTA */
  .cta-section { background: linear-gradient(135deg, rgba(0,245,212,.06), rgba(168,85,247,.06)); border: 1px solid rgba(0,245,212,.15); border-radius: 24px; padding: 64px; text-align: center; margin: 0 60px 80px; position: relative; overflow: hidden; }
  .cta-section::before { content: ''; position: absolute; inset: 0; background: radial-gradient(ellipse at 50% -30%, rgba(0,245,212,.08), transparent 60%); }
  .cta-title { font-family: 'Bebas Neue', sans-serif; font-size: clamp(36px, 4vw, 64px); color: #fff; letter-spacing: .02em; margin-bottom: 16px; position: relative; }
  .cta-title .gradient-text { background: linear-gradient(90deg, var(--teal), var(--purple)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
  .cta-sub { color: var(--muted); font-size: 1rem; margin-bottom: 32px; position: relative; }
  .cta-buttons { display: flex; gap: 16px; justify-content: center; flex-wrap: wrap; position: relative; }
  .cta-btn-main { padding: 16px 36px; border-radius: 10px; border: none; background: var(--teal); color: #060c14; font-family: 'Syne', sans-serif; font-size: 0.95rem; font-weight: 700; cursor: pointer; transition: all .2s; letter-spacing: .02em; text-decoration: none; }
  .cta-btn-main:hover { transform: translateY(-2px); box-shadow: 0 12px 32px rgba(0,245,212,.3); }
  .cta-btn-ghost { padding: 16px 36px; border-radius: 10px; border: 1px solid rgba(255,255,255,.15); background: none; color: #fff; font-family: 'Syne', sans-serif; font-size: 0.95rem; font-weight: 600; cursor: pointer; transition: all .2s; text-decoration: none; }
  .cta-btn-ghost:hover { border-color: rgba(255,255,255,.3); background: rgba(255,255,255,.04); }
  .cta-micro { font-size: 0.72rem; color: var(--muted); margin-top: 16px; position: relative; letter-spacing: .05em; }

  .fade-up { opacity: 0; transform: translateY(24px); transition: opacity .6s ease, transform .6s ease; }
  .fade-up.visible { opacity: 1; transform: translateY(0); }
`

export default function CareerPathsPage() {
  const [activeCountry, setActiveCountry] = useState('all')
  const [selectedCountryTab, setSelectedCountryTab] = useState('de')
  const [selectedTimeline, setSelectedTimeline] = useState('cs')
  const canvasRef = useRef(null)

  useEffect(() => {
    // Inject Fonts
    const link1 = document.createElement('link')
    link1.href = 'https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Syne:wght@400;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap'
    link1.rel = 'stylesheet'
    document.head.appendChild(link1)

    // Scroll Observer
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible') })
    }, { threshold: 0.1 })
    document.querySelectorAll('.fade-up').forEach(el => observer.observe(el))
    
    return () => observer.disconnect()
  }, [])

  // Canvas Animation Logic
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animFrame;
    let t = 0;

    const resize = () => {
      const container = canvas.parentElement;
      canvas.width = container.clientWidth - 80;
      canvas.height = 380;
    }
    window.addEventListener('resize', resize);
    resize();

    function getNodePos(key, W, H) {
      const n = NODES[key];
      const cols = [0.1, 0.42, 0.75];
      const x = cols[n.col] * W;
      let rowCount = n.col === 0 ? 1 : 5;
      let rowIndex = n.col === 0 ? 0 : n.row;
      const y = (rowIndex + 1) * (H / (rowCount + 1));
      return { x, y };
    }

    function hexToRgb(hex) {
      if (hex.startsWith('#')) {
        const r = parseInt(hex.slice(1,3),16);
        const g = parseInt(hex.slice(3,5),16);
        const b = parseInt(hex.slice(5,7),16);
        return `${r},${g},${b}`;
      }
      return '0,245,212';
    }

    function bezier(time, p0, p1, p2, p3) {
      return Math.pow(1-time,3)*p0 + 3*Math.pow(1-time,2)*time*p1 + 3*(1-time)*time*time*p2 + Math.pow(time,3)*p3;
    }

    function drawFlow() {
      const W = canvas.width, H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      LINKS.forEach(link => {
        const isActive = activeCountry === 'all' || link.country === activeCountry;
        const from = getNodePos(link.from, W, H);
        const to = getNodePos(link.to, W, H);
        const color = NODES[link.to]?.color || NODES[link.from]?.color || '#00f5d4';
        const rgb = hexToRgb(color);
        const w = Math.max(1, link.value * 0.3);
        const alpha = isActive ? 0.35 : 0.04;

        ctx.beginPath();
        ctx.moveTo(from.x, from.y);
        const cx1 = from.x + (to.x - from.x) * 0.45;
        const cx2 = from.x + (to.x - from.x) * 0.55;
        ctx.bezierCurveTo(cx1, from.y, cx2, to.y, to.x, to.y);
        ctx.lineWidth = w;
        ctx.strokeStyle = `rgba(${rgb},${alpha})`;
        ctx.stroke();

        if (isActive) {
          const speed = 0.0008 + (link.value * 0.00003);
          const progress = (t * speed * 1000) % 1;
          const px = bezier(progress, from.x, cx1, cx2, to.x);
          const py = bezier(progress, from.y, from.y, to.y, to.y);

          const grad = ctx.createRadialGradient(px, py, 0, px, py, w * 2);
          grad.addColorStop(0, `rgba(${rgb},1)`);
          grad.addColorStop(1, `rgba(${rgb},0)`);
          ctx.beginPath();
          ctx.arc(px, py, w * 2, 0, Math.PI * 2);
          ctx.fillStyle = grad;
          ctx.fill();
        }
      });

      Object.entries(NODES).forEach(([key, node]) => {
        const pos = getNodePos(key, W, H);
        const isHighlighted = activeCountry === 'all' || key === 'source' || key === activeCountry ||
          LINKS.some(l => (l.from === activeCountry || l.to === activeCountry) && (l.from === key || l.to === key));
        
        const color = node.color || '#00f5d4';
        const rgb = hexToRgb(color);
        const r = isHighlighted ? 22 : 14;

        if (isHighlighted) {
          const glow = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, r * 3);
          glow.addColorStop(0, `rgba(${rgb},0.2)`);
          glow.addColorStop(1, `rgba(${rgb},0)`);
          ctx.beginPath();
          ctx.arc(pos.x, pos.y, r * 3, 0, Math.PI * 2);
          ctx.fillStyle = glow;
          ctx.fill();
        }

        ctx.beginPath();
        ctx.arc(pos.x, pos.y, r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${rgb},${isHighlighted ? 0.15 : 0.05})`;
        ctx.fill();
        ctx.strokeStyle = `rgba(${rgb},${isHighlighted ? 0.8 : 0.15})`;
        ctx.lineWidth = isHighlighted ? 2 : 1;
        ctx.stroke();

        ctx.fillStyle = `rgba(255,255,255,${isHighlighted ? 0.9 : 0.25})`;
        ctx.font = `${isHighlighted ? 600 : 400} ${isHighlighted ? 11 : 10}px Syne, sans-serif`;
        ctx.textAlign = node.col === 2 ? 'left' : node.col === 0 ? 'right' : 'center';
        const labelX = node.col === 2 ? pos.x + r + 6 : node.col === 0 ? pos.x - r - 6 : pos.x;
        const labelY = node.col === 1 ? pos.y - r - 8 : pos.y + 4;
        const lines = node.label.split('\n');
        lines.forEach((line, i) => {
          ctx.fillText(line, labelX, labelY + i * 14);
        });
      });

      t += 0.01;
      animFrame = requestAnimationFrame(drawFlow);
    }

    drawFlow()
    return () => { cancelAnimationFrame(animFrame); window.removeEventListener('resize', resize) }
  }, [activeCountry])

  const countryData = COUNTRIES[selectedCountryTab]
  const timelineData = TIMELINES[selectedTimeline]

  return (
    <div className="career-paths-wrapper">
      <style>{styles}</style>
      <div className="grid-bg"></div>
      <div className="glow-orb orb1"></div>
      <div className="glow-orb orb2"></div>

      <nav>
        <Link href="/" className="nav-logo">
          <div className="logo-icon">
            <Triangle size={18} fill="currentColor" strokeWidth={2} className="rotate-180" />
          </div>
          <span>Mentor<em>Bridge</em></span>
        </Link>
        <div className="nav-links">
          <Link href="/mentors">Mentors</Link>
          <Link href="/scholarships">Scholarships</Link>
          <Link href="/stories">Stories</Link>
          <Link href="/career-paths" className="active">Career Paths</Link>
          <Link href="/survival-sim">Survival Sim</Link>
          <Link href="/market-insights">Market Data</Link>
          <Link href="/roi-matrix">ROI Matrix</Link>
        </div>
        <div className="nav-cta">
          <Link href="/dashboard/student" className="btn-ghost">Log in</Link>
          <Link href="/signup" className="btn-primary">Sign up →</Link>
        </div>
      </nav>

      <main>
        <div className="hero">
          <div className="hero-badge">CAREER INTELLIGENCE · UPDATED LIVE</div>
          <h1 className="hero-title">
            MAP YOUR
            <span className="accent">CAREER DNA</span>
          </h1>
          <p className="hero-sub">From B.Tech to your dream role abroad — visualize every pathway, salary, and timeline before you commit to anything.</p>
          <div className="hero-stats">
            <div className="stat-item">
              <div className="stat-num">38</div>
              <div className="stat-label">COUNTRIES TRACKED</div>
            </div>
            <div className="stat-item">
              <div className="stat-num">120+</div>
              <div className="stat-label">CAREER PATHS</div>
            </div>
            <div className="stat-item">
              <div className="stat-num">$4.2M</div>
              <div className="stat-label">AVG 10-YR EARNINGS</div>
            </div>
            <div className="stat-item">
              <div className="stat-num">1.5y</div>
              <div className="stat-label">FASTEST ROI (GERMANY)</div>
            </div>
          </div>
        </div>

        {/* FLOW MAP */}
        <div className="section fade-up">
          <div className="section-label">LIVE TRAJECTORY MAP</div>
          <h2 className="section-title">SEE WHERE STUDENTS GO</h2>
          <p className="section-sub">Click any country to explore how Indian students flow from their degree into real careers. Live data from 10,000+ journeys.</p>

          <div className="flow-container">
            <div className="flow-header">
              <div>
                <div className="flow-title">Student Journey Visualizer</div>
                <div className="flow-subtitle">Select a destination to highlight the career flow</div>
              </div>
              <div className="country-pills">
                <button className={`pill ${activeCountry === 'all' ? 'active' : ''}`} onClick={() => setActiveCountry('all')}>🌐 All</button>
                <button className={`pill ${activeCountry === 'de' ? 'active' : ''}`} onClick={() => setActiveCountry('de')}>🇩🇪 Germany</button>
                <button className={`pill ${activeCountry === 'us' ? 'active' : ''}`} onClick={() => setActiveCountry('us')}>🇺🇸 USA</button>
                <button className={`pill ${activeCountry === 'uk' ? 'active' : ''}`} onClick={() => setActiveCountry('uk')}>🇬🇧 UK</button>
                <button className={`pill ${activeCountry === 'ca' ? 'active' : ''}`} onClick={() => setActiveCountry('ca')}>🇨🇦 Canada</button>
                <button className={`pill ${activeCountry === 'au' ? 'active' : ''}`} onClick={() => setActiveCountry('au')}>🇦🇺 Australia</button>
              </div>
            </div>
            <canvas id="flow-canvas" ref={canvasRef}></canvas>
          </div>
        </div>

        {/* TOP CAREERS */}
        <div className="section fade-up">
          <div className="section-label">TOP CAREER OUTCOMES</div>
          <h2 className="section-title">IN-DEMAND ROLES ABROAD</h2>
          <p className="section-sub">The most common destinations for Indian MS graduates, with real salary benchmarks and market demand signals.</p>

          <div className="careers-grid">
            {CAREERS.map((c, i) => (
              <div className="career-card" key={i} style={{animationDelay: `${i*0.06}s`}}>
                <div className="card-icon">{c.icon}</div>
                <div className="card-role">{c.role}</div>
                <div className="card-domain">{c.domain}</div>
                <div className="card-salary">
                  {c.salaries.map((s, j) => (
                    <div className="salary-item" key={j}>
                      <div className="s-country">{s.c}</div>
                      <div className="s-val">{s.v}</div>
                    </div>
                  ))}
                </div>
                <div className="card-demand">
                  <span style={{fontSize:'.65rem', fontFamily:'JetBrains Mono', color:'var(--muted)'}}>DEMAND</span>
                  <div className="demand-bar"><div className="demand-fill" style={{width: `${c.demand}%`}}></div></div>
                  <span style={{fontSize:'.7rem', fontFamily:'JetBrains Mono', color:'var(--teal)'}}>{c.demand}%</span>
                </div>
                <div className="card-tags">
                  {c.tags.map((t, j) => <span className="tag" key={j}>{t}</span>)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* COUNTRY DEEP DIVE */}
        <div className="section fade-up">
          <div className="section-label">DESTINATION INTEL</div>
          <h2 className="section-title">COUNTRY DEEP DIVE</h2>
          <p className="section-sub">Every major destination decoded — jobs, salaries, visa timelines, and PR pathways.</p>

          <div className="tabs">
            {Object.keys(COUNTRIES).map(key => (
              <button key={key} className={`tab ${selectedCountryTab === key ? 'active' : ''}`} onClick={() => setSelectedCountryTab(key)}>
                {COUNTRIES[key].flag} {COUNTRIES[key].name}
              </button>
            ))}
          </div>

          <div className="country-section">
            <div className="country-card" style={{'--glow': countryData.glow}}>
              <div className="cc-top">
                <div className="cc-flag">{countryData.flag}</div>
                <div><div className="cc-name">{countryData.name}</div><div className="cc-sub">{countryData.sub}</div></div>
              </div>
              <div className="cc-metrics">
                {countryData.metrics.map((m, i) => (
                  <div className="metric-box" key={i}>
                    <div className="metric-label">{m.label}</div>
                    <div className={`metric-value ${m.cls}`}>{m.value}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="country-card" style={{'--glow': countryData.glow}}>
              <div className="cc-jobs">
                <div className="cc-jobs-title">TOP JOB ROLES IN {countryData.name}</div>
                {countryData.jobs.map((j, i) => (
                  <div className="job-row" key={i}>
                    <span className="job-name">{j.name}</span>
                    <span className={`job-demand ${j.demand === 'HIGH' ? 'high' : 'med'}`}>{j.demand}</span>
                    <span className="job-salary">{j.salary}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* HEATMAP */}
        <div className="section fade-up">
          <div className="section-label">SALARY INTELLIGENCE</div>
          <h2 className="section-title">STARTING SALARY HEATMAP</h2>
          <p className="section-sub">First-year salaries (USD equivalent) across roles and destinations. Darker = higher earning potential.</p>
          <div className="heatmap-grid">
            <div className="hm-header"></div>
            {HEATMAP_ROLES.map((r, i) => <div className="hm-header" key={i}>{r}</div>)}
            {HEATMAP_COUNTRIES.map((c, ci) => (
              <div key={ci} style={{display:'contents'}}>
                <div className="hm-row-label">
                  <span style={{fontSize:'1.1rem'}}>{c.split(' ')[0]}</span>{c.split(' ')[1]}
                </div>
                {HEATMAP_ROLES.map((_, ri) => {
                  const lvl = HEATMAP_LEVELS[ci][ri];
                  return (
                    <div className={`hm-cell heat-${lvl}`} key={`${ci}-${ri}`}>
                      <div className="hm-val">{HEATMAP_DATA[ci][ri]}</div>
                      <div className="hm-sub">starting</div>
                    </div>
                  )
                })}
              </div>
            ))}
          </div>
        </div>

        {/* ROI */}
        <div className="section fade-up roi-section">
          <div className="section-label">RETURN ON INVESTMENT</div>
          <h2 className="section-title">THE ROI BREAKDOWN</h2>
          <p className="section-sub">Total cost vs. 5-year earnings. See exactly when your investment pays off.</p>
          <div className="roi-cards">
            {ROI_DATA.map((r, i) => (
              <div className="roi-card" key={i}>
                <div className="roi-rank">{r.rank}</div>
                <div className="roi-flag">{r.flag}</div>
                <div className="roi-country">{r.country}</div>
                <div className="roi-program">{r.program}</div>
                {r.rows.map((row, j) => (
                  <div className="roi-row" key={j}>
                    <span className="roi-key">{row[0]}</span>
                    <span className="roi-val">{row[1]}</span>
                  </div>
                ))}
                <div className="roi-breakeven">
                  <span className="roi-breakeven-label">BREAKEVEN POINT</span>
                  <span className="roi-breakeven-val">{r.breakeven}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* TIMELINE */}
        <div className="section fade-up timeline-section">
          <div className="section-label">THE ROADMAP</div>
          <h2 className="section-title">YOUR 18-MONTH PLAN</h2>
          <p className="section-sub">A realistic month-by-month breakdown from profile building to your first paycheck abroad.</p>

          <div className="tabs">
            <button className={`tab ${selectedTimeline === 'cs' ? 'active' : ''}`} onClick={() => setSelectedTimeline('cs')}>💻 CS / Data</button>
            <button className={`tab ${selectedTimeline === 'mba' ? 'active' : ''}`} onClick={() => setSelectedTimeline('mba')}>📊 Analytics / MBA</button>
            <button className={`tab ${selectedTimeline === 'eng' ? 'active' : ''}`} onClick={() => setSelectedTimeline('eng')}>⚙️ Engineering</button>
          </div>

          <div className="timeline">
            {timelineData.map((item, i) => (
              <div className="tl-item" key={i} style={{animationDelay: `${i*0.1}s`}}>
                <div className={`tl-dot ${item.done ? 'done' : ''}`}></div>
                <div className="tl-month">{item.month}</div>
                <div className="tl-title">{item.title}</div>
                <div className="tl-desc">{item.desc}</div>
                <div className="tl-tags">
                  {item.tags.map((t, j) => <span className="tag" key={j}>{t}</span>)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="cta-section fade-up">
          <h2 className="cta-title">READY TO <span className="gradient-text">CLAIM YOUR PATH?</span></h2>
          <p className="cta-sub">Talk to a mentor who's already walked the road you want to take.</p>
          <div className="cta-buttons">
            <Link href="/mentors" className="cta-btn-main">Find My Mentor →</Link>
            <Link href="/mentors" className="cta-btn-ghost">Browse All Mentors</Link>
          </div>
          <p className="cta-micro">FREE TO BROWSE · NO CREDIT CARD · MATCH IN UNDER 2 MINUTES</p>
        </div>

      </main>
    </div>
  )
}