'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Triangle } from 'lucide-react'

// ════════════════════════════════════════════════════════════
//  DATA & CONSTANTS
// ════════════════════════════════════════════════════════════
const CITIES = {
  berlin:    { id:'berlin', name:'BERLIN',    sub:'Germany · Public Transport City · Student-Friendly',        currency:'€',   stipend:861,  parttime:520, rentDef:500,  transDef:86,  healthDef:110, uniDef:40,  tipsKey:'de' },
  munich:    { id:'munich', name:'MUNICH',    sub:'Germany · Higher COL · Tech & Engineering Hub',        currency:'€',   stipend:861,  parttime:580, rentDef:780,  transDef:86,  healthDef:110, uniDef:40,  tipsKey:'de' },
  nyc:       { id:'nyc', name:'NEW YORK',  sub:'USA · Highest COL · FAANG & Finance Capital',          currency:'$',   stipend:0,    parttime:1200,rentDef:1400, transDef:132, healthDef:0,   uniDef:0,   tipsKey:'us' },
  boston:    { id:'boston', name:'BOSTON',    sub:'USA · Student City · Top Universities',                currency:'$',   stipend:0,    parttime:1000,rentDef:1100, transDef:90,  healthDef:0,   uniDef:0,   tipsKey:'us' },
  london:    { id:'london', name:'LONDON',    sub:'UK · Finance & Tech · High COL',                       currency:'£',   stipend:0,    parttime:900, rentDef:850,  transDef:160, healthDef:0,   uniDef:0,   tipsKey:'uk' },
  toronto:   { id:'toronto', name:'TORONTO',   sub:'Canada · Diverse · Strong PR Pathway',                 currency:'C$',  stipend:0,    parttime:1100,rentDef:900,  transDef:120, healthDef:0,   uniDef:0,   tipsKey:'ca' },
  melbourne: { id:'melbourne', name:'MELBOURNE', sub:'Australia · Liveable · Cyber & IT Hub',                currency:'A$',  stipend:0,    parttime:1000,rentDef:950,  transDef:130, healthDef:0,   uniDef:0,   tipsKey:'au' },
  dublin:    { id:'dublin', name:'DUBLIN',    sub:'Ireland · EU Jobs Access · Growing Tech Hub',          currency:'€',   stipend:0,    parttime:900, rentDef:900,  transDef:110, healthDef:80,  uniDef:0,   tipsKey:'ie' },
};

const TIPS = {
  de: [
    { icon:'🚇', title:'Semester Ticket = Free Transport', desc:'The ~€300 semester fee includes a full-city transit pass. Never buy a separate monthly ticket.', tag:'save', tl:'SAVES €80/mo' },
    { icon:'🛒', title:'Aldi + Lidl are your best friends', desc:'German discount supermarkets have excellent quality. Budget €120–150/month for groceries easily.', tag:'save', tl:'SAVES €60/mo' },
    { icon:'📋', title:'Anmeldung on Day 1', desc:'Register your address within 14 days of arrival. You need it for bank account, uni enrollment, and tax ID.', tag:'warn', tl:'MANDATORY' },
    { icon:'💼', title:'HiWi Jobs Pay Well', desc:'Student worker (HiWi) roles at uni labs pay €12–15/hr. Great income and excellent for your CV.', tag:'info', tl:'UP TO €520/mo' },
  ],
  us: [
    { icon:'💳', title:'Build Credit Immediately', desc:'No credit score = no apartment lease. Get a secured card on day 1. Pay in full every single month.', tag:'warn', tl:'CRITICAL' },
    { icon:'🛒', title:'Asian Grocery Stores Win', desc:'H-Mart, 99 Ranch, Patel Brothers beat Whole Foods by 50%. Essential for Indian cooking on a budget.', tag:'save', tl:'SAVES $150/mo' },
    { icon:'🩺', title:'University Health Plan First', desc:'External insurance costs $400+/month. Enroll in the subsidized uni plan. Use campus clinic first.', tag:'save', tl:'SAVES $200/mo' },
    { icon:'💼', title:'CPT/OPT Timing is Critical', desc:'Talk to your DSO in Semester 1. Missing the CPT window means losing an entire internship cycle.', tag:'warn', tl:'DON\'T MISS IT' },
  ],
  uk: [
    { icon:'🏠', title:'Book Housing 3 Months Early', desc:'London rooms go in hours. Use SpareRoom.co.uk. Avoid estate agents — fees will hurt.', tag:'warn', tl:'ACT EARLY' },
    { icon:'🚌', title:'18+ Oyster Card = 30% Off', desc:'Register before you arrive — takes 10 days to arrive by post. Huge savings on Zone 1–3 travel.', tag:'save', tl:'SAVES £40/mo' },
    { icon:'⏱️', title:'1 Year Goes FAST', desc:'UK MSc is intense. Job applications open in Week 6 of Term 1. Miss it, miss the whole hiring cycle.', tag:'warn', tl:'NO GRACE PERIOD' },
    { icon:'📄', title:'Graduate Visa = 2 Free Years', desc:'After graduation you get an automatic 2-year Graduate Visa with full work rights. Use it strategically.', tag:'info', tl:'PLAN FOR THIS' },
  ],
  ca: [
    { icon:'🥶', title:'Winter Gear is Expensive', desc:'Invest $300–500 in proper winter gear before your first Canadian winter. Frostbite is not theoretical.', tag:'info', tl:'FIRST-YEAR LESSON' },
    { icon:'🏥', title:'OHIP Takes 3 Months', desc:'Ontario health coverage has a 3-month waiting period. Get travel insurance for months 1–3. Don\'t skip it.', tag:'warn', tl:'BRIDGE THE GAP' },
    { icon:'💼', title:'20 hrs/week During Study', desc:'Your student visa allows 20 hrs work during semesters. C$400–600/month in income + Canadian experience.', tag:'save', tl:'C$400–600/mo' },
    { icon:'🛂', title:'PGWP = 3-Year Work Visa', desc:'Post-Graduation Work Permit lets you work anywhere in Canada for up to 3 years. The fastest PR path.', tag:'info', tl:'PLAN FOR THIS' },
  ],
  au: [
    { icon:'⏱️', title:'48 hrs/Fortnight Work Limit', desc:'Upgraded from 40 — use it fully. International students can now earn more during their degree.', tag:'info', tl:'A$900+/fort' },
    { icon:'💰', title:'Superannuation on Exit', desc:'Employers contribute 11% of pay to a super fund. You can likely reclaim it when you leave Australia.', tag:'save', tl:'CLAIM ON EXIT' },
    { icon:'📱', title:'Aldi Mobile = A$18/month', desc:'Uses the Telstra network for A$18/mo with solid data. Far cheaper than direct Telstra or Optus plans.', tag:'save', tl:'SAVES A$30/mo' },
    { icon:'🛂', title:'485 Graduate Visa = 2–4 Yrs', desc:'Temporary Graduate Visa gives 2–4 years post-study work rights. Strong PR pathway through state nominations.', tag:'info', tl:'PLAN FOR THIS' },
  ],
  ie: [
    { icon:'🏠', title:'Dublin Housing Crisis is Real', desc:'Dublin has one of Europe\'s worst housing shortages. Budget €1,000+ for a city center room. Apply early.', tag:'warn', tl:'BOOK EARLY' },
    { icon:'💼', title:'20 hrs During Term + Full-Time Holidays', desc:'Irish student visa allows 20hrs/week during term and full-time during holidays. Use it.', tag:'info', tl:'€200–300/wk' },
    { icon:'🌍', title:'EU Job Market Access', desc:'Ireland is your gateway to EU employment. After graduation, move freely to Germany, Netherlands, France.', tag:'info', tl:'UNIQUE ADVANTAGE' },
    { icon:'🛂', title:'Stamp 1G = 2-Year Full Work Rights', desc:'After graduation you get Stamp 1G — 2-year stay with unlimited work rights. One of Europe\'s best post-study visas.', tag:'save', tl:'2-YR WORK RIGHT' },
  ],
};

const EXPENSE_COLORS = {
  rent:     { color:'#a855f7', label:'Rent' },
  grocery:  { color:'#00f5d4', label:'Groceries' },
  transport:{ color:'#3b82f6', label:'Transport' },
  phone:    { color:'#f59e0b', label:'Phone/Net' },
  fun:      { color:'#f43f5e', label:'Fun/Dining' },
  health:   { color:'#34d399', label:'Health Ins.' },
  uni:      { color:'#818cf8', label:'Uni Fees' },
  savings:  { color:'#fb923c', label:'Travel Fund' },
};

const PPP_DATA = {
  de:{ id:'de', flag:'🇩🇪', name:'Germany',   prefix:'€',   ppp:1.00, tax:0.19 },
  us:{ id:'us', flag:'🇺🇸', name:'USA',       prefix:'$',   ppp:1.55, tax:0.28 },
  uk:{ id:'uk', flag:'🇬🇧', name:'UK',        prefix:'£',   ppp:1.22, tax:0.32 },
  ca:{ id:'ca', flag:'🇨🇦', name:'Canada',    prefix:'C$',  ppp:1.18, tax:0.30 },
  au:{ id:'au', flag:'🇦🇺', name:'Australia', prefix:'A$',  ppp:1.25, tax:0.27 },
  in:{ id:'in', flag:'🇮🇳', name:'India',     prefix:'₹',   ppp:0.30, tax:0.10 },
};

const MONTHS = ['JANUARY','FEBRUARY','MARCH','APRIL','MAY','JUNE','JULY','AUGUST','SEPTEMBER','OCTOBER','NOVEMBER','DECEMBER'];

const styles = `
  .sim-wrapper {
    --teal: #00f5d4; --teal-dim: #00c9ac; --purple: #a855f7; --gold: #f59e0b;
    --red: #f43f5e; --green: #34d399; --bg: #060c14; --bg2: #0d1520; --bg3: #111c2e;
    --border: rgba(255,255,255,0.07); --text: #e2e8f0; --muted: #64748b;
    background: var(--bg); color: var(--text); font-family: 'Syne', sans-serif;
    overflow-x: hidden; min-height: 100vh; position: relative;
  }
  .sim-wrapper * { box-sizing: border-box; }
  .sim-wrapper a { text-decoration: none; color: inherit; }

  /* NAV */
  nav { position: fixed; top: 0; left: 0; right: 0; z-index: 100; display: flex; align-items: center; justify-content: space-between; padding: 0 40px; height: 64px; background: rgba(6,12,20,0.9); backdrop-filter: blur(16px); border-bottom: 1px solid var(--border); }
  .nav-logo { display: flex; align-items: center; gap: 10px; font-size: 1.1rem; font-weight: 700; color: #fff; text-decoration: none; }
  .nav-logo .logo-icon { width: 34px; height: 34px; border-radius: 9px; background: linear-gradient(135deg, #00f5d4, #a855f7); display: flex; align-items: center; justify-content: center; font-size: 16px; color: #000; }
  .nav-logo span em { font-style: normal; color: var(--teal); }
  .nav-links { display: flex; gap: 28px; }
  .nav-links a { color: var(--muted); text-decoration: none; font-size: 0.85rem; font-weight: 600; transition: color .2s; letter-spacing: .04em; }
  .nav-links a.active { color: var(--purple); }
  .nav-links a:hover { color: #fff; }
  .btn-ghost { padding: 8px 18px; border: 1px solid var(--border); border-radius: 8px; color: #fff; font-size: 0.82rem; font-weight: 600; cursor: pointer; background: none; font-family: 'Syne', sans-serif; transition: border-color .2s; }
  .btn-ghost:hover { border-color: rgba(255,255,255,.3); }
  .btn-primary { padding: 8px 20px; border-radius: 8px; border: none; background: var(--teal); color: #060c14; font-size: 0.82rem; font-weight: 700; cursor: pointer; font-family: 'Syne', sans-serif; transition: opacity .2s; }
  .btn-primary:hover { opacity: .85; }

  /* BG */
  .grid-bg { position: absolute; inset: 0; z-index: 0; pointer-events: none; background-image: linear-gradient(rgba(168,85,247,0.018) 1px, transparent 1px), linear-gradient(90deg, rgba(168,85,247,0.018) 1px, transparent 1px); background-size: 60px 60px; }
  .glow-orb { position: absolute; border-radius: 50%; pointer-events: none; z-index: 0; filter: blur(120px); opacity: 0.1; }
  .orb1 { width: 700px; height: 700px; background: var(--purple); top: -200px; left: -200px; }
  .orb2 { width: 500px; height: 500px; background: var(--teal); bottom: -150px; right: -100px; }
  .orb3 { width: 350px; height: 350px; background: var(--gold); top: 60vh; right: 25%; opacity: 0.05; }

  /* HERO */
  .hero { padding: 100px 60px 48px; max-width: 1400px; margin: 0 auto; position: relative; z-index: 1; }
  .hero-badge { display: inline-flex; align-items: center; gap: 8px; padding: 6px 14px; border-radius: 100px; border: 1px solid rgba(168,85,247,.35); font-size: 0.72rem; font-family: 'JetBrains Mono', monospace; color: var(--purple); letter-spacing: .12em; margin-bottom: 24px; }
  .hero-badge::before { content: ''; width: 7px; height: 7px; border-radius: 50%; background: var(--purple); animation: pulse-p 2s infinite; }
  @keyframes pulse-p { 0%,100%{box-shadow:0 0 0 0 rgba(168,85,247,.5)} 50%{box-shadow:0 0 0 6px rgba(168,85,247,0)} }
  .hero-title { font-family: 'Bebas Neue', sans-serif; font-size: clamp(60px, 8vw, 112px); line-height: .93; letter-spacing: .02em; color: #fff; margin-bottom: 16px; }
  .hero-title .a1 { color: var(--purple); }
  .hero-title .a2 { color: var(--teal); }
  .hero-sub { font-size: 1.05rem; color: var(--muted); max-width: 540px; line-height: 1.7; margin-bottom: 32px; }
  .hero-alert { display: inline-flex; align-items: center; gap: 10px; padding: 12px 20px; border-radius: 10px; background: rgba(244,63,94,.07); border: 1px solid rgba(244,63,94,.18); font-size: 0.82rem; color: #fda4af; }

  /* SECTION */
  .section { max-width: 1400px; margin: 0 auto; padding: 20px 60px 60px; position: relative; z-index: 1; }
  .section-label { font-size: 0.7rem; font-family: 'JetBrains Mono', monospace; color: var(--purple); letter-spacing: .15em; padding: 5px 12px; border: 1px solid rgba(168,85,247,.25); border-radius: 4px; display: inline-block; margin-bottom: 20px; }
  .section-title { font-family: 'Bebas Neue', sans-serif; font-size: clamp(36px, 4vw, 56px); letter-spacing: .02em; line-height: 1; color: #fff; margin-bottom: 10px; }
  .section-sub { color: var(--muted); font-size: 0.95rem; margin-bottom: 36px; max-width: 600px; line-height: 1.6; }

  /* ═══ MAIN SIM SHELL ═══ */
  .sim-shell { background: var(--bg2); border: 1px solid var(--border); border-radius: 24px; overflow: hidden; box-shadow: 0 48px 120px rgba(0,0,0,.55); position: relative; }
  .sim-shell::before { content: ''; position: absolute; inset: 0; background: radial-gradient(ellipse at 50% 0%, rgba(168,85,247,.05), transparent 55%); pointer-events: none; }
  .sim-topbar { display: flex; align-items: center; justify-content: space-between; padding: 18px 32px; border-bottom: 1px solid var(--border); background: rgba(255,255,255,.015); flex-wrap: wrap; gap: 12px; }
  .sim-indicator { display: flex; align-items: center; gap: 8px; font-size: 0.78rem; font-family: 'JetBrains Mono', monospace; color: var(--muted); }
  .sim-dot { width: 8px; height: 8px; border-radius: 50%; animation: pulse-p 2s infinite; }
  .sim-dot.green { background: var(--green); }
  .sim-dot.purple { background: var(--purple); }
  .budget-bar-wrap { display: flex; align-items: center; gap: 10px; font-size: 0.72rem; font-family: 'JetBrains Mono', monospace; color: var(--muted); }
  .budget-track { width: 180px; height: 6px; background: rgba(255,255,255,.07); border-radius: 3px; overflow: hidden; }
  .budget-fill { height: 100%; border-radius: 3px; transition: width .5s, background .5s; }
  .city-selector { padding: 20px 32px; border-bottom: 1px solid var(--border); }
  .city-selector-label { font-size: 0.65rem; font-family: 'JetBrains Mono', monospace; color: var(--muted); letter-spacing: .1em; margin-bottom: 12px; }
  .city-pills { display: flex; gap: 8px; flex-wrap: wrap; }
  .city-pill { padding: 9px 16px; border-radius: 100px; border: 1px solid var(--border); cursor: pointer; background: transparent; font-family: 'Syne', sans-serif; font-size: 0.8rem; font-weight: 600; color: var(--muted); transition: all .2s; display: flex; align-items: center; gap: 7px; }
  .city-pill:hover { border-color: rgba(168,85,247,.4); color: var(--purple); }
  .city-pill.active { background: rgba(168,85,247,.12); border-color: rgba(168,85,247,.5); color: var(--purple); box-shadow: 0 0 20px rgba(168,85,247,.1); }
  .cost-badge { font-size: 0.62rem; font-family: 'JetBrains Mono', monospace; padding: 2px 6px; border-radius: 3px; background: rgba(255,255,255,.05); }
  .city-pill.active .cost-badge { background: rgba(168,85,247,.2); color: #d8b4fe; }
  
  .sim-body { display: grid; grid-template-columns: 370px 1fr; min-height: 580px; }
  @media(max-width:900px){ .sim-body { grid-template-columns: 1fr; } }
  .sim-left { border-right: 1px solid var(--border); padding: 26px; }
  .sim-right { padding: 26px; }
  .sim-section-title { font-size: 0.65rem; font-family: 'JetBrains Mono', monospace; color: var(--muted); letter-spacing: .1em; margin-bottom: 14px; }
  
  /* INCOME BOX */
  .income-box { background: rgba(0,245,212,.04); border: 1px solid rgba(0,245,212,.12); border-radius: 14px; padding: 16px; margin-bottom: 20px; }
  .income-box-title { font-size: 0.65rem; font-family: 'JetBrains Mono', monospace; color: var(--teal); letter-spacing: .1em; margin-bottom: 12px; }
  .income-toggle { display: flex; gap: 5px; margin-bottom: 12px; }
  .income-btn { flex: 1; padding: 7px 6px; border-radius: 8px; border: 1px solid var(--border); font-family: 'Syne', sans-serif; font-size: 0.72rem; font-weight: 600; cursor: pointer; background: none; color: var(--muted); transition: all .2s; }
  .income-btn.active { background: rgba(0,245,212,.12); border-color: rgba(0,245,212,.3); color: var(--teal); }
  .stipend-val { font-family: 'Bebas Neue', sans-serif; font-size: 2rem; color: var(--teal); letter-spacing: .04em; }
  .stipend-unit { font-size: 0.65rem; color: var(--muted); font-family: 'JetBrains Mono', monospace; }
  .income-breakdown { display: grid; grid-template-columns: 1fr 1fr; gap: 7px; margin-top: 10px; }
  .ib-item { background: rgba(255,255,255,.03); border-radius: 8px; padding: 10px; border: 1px solid var(--border); }
  .ib-label { font-size: 0.58rem; color: var(--muted); font-family: 'JetBrains Mono', monospace; letter-spacing: .06em; margin-bottom: 3px; }
  .ib-val { font-size: 0.88rem; font-weight: 700; color: var(--text); }
  
  /* SLIDERS */
  .budget-item { margin-bottom: 18px; }
  .budget-item-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 7px; }
  .budget-label { font-size: 0.85rem; font-weight: 600; color: var(--text); display: flex; align-items: center; gap: 7px; }
  .budget-amount { font-family: 'JetBrains Mono', monospace; font-size: 0.85rem; font-weight: 600; color: var(--purple); }
  input[type="range"] { -webkit-appearance: none; width: 100%; height: 4px; background: rgba(255,255,255,.08); border-radius: 2px; outline: none; cursor: pointer; }
  input[type="range"]::-webkit-slider-thumb { -webkit-appearance: none; width: 15px; height: 15px; border-radius: 50%; background: var(--purple); cursor: pointer; border: 2px solid #fff; box-shadow: 0 0 8px rgba(168,85,247,.5); }

  /* RIGHT PANEL */
  .result-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 10px; }
  .result-city { font-family: 'Bebas Neue', sans-serif; font-size: 2rem; color: #fff; letter-spacing: .03em; }
  .result-sub { font-size: 0.7rem; color: var(--muted); font-family: 'JetBrains Mono', monospace; margin-top: 2px; }
  .sm-status { font-size: 0.82rem; font-weight: 700; padding: 5px 14px; border-radius: 7px; }
  .sm-status.thriving { background: rgba(52,211,153,.12); color: var(--green); border: 1px solid rgba(52,211,153,.2); }
  .sm-status.surviving { background: rgba(245,158,11,.12); color: var(--gold); border: 1px solid rgba(245,158,11,.2); }
  .sm-status.struggling { background: rgba(244,63,94,.12); color: var(--red); border: 1px solid rgba(244,63,94,.2); }
  
  .survival-meter { background: var(--bg3); border: 1px solid var(--border); border-radius: 16px; padding: 22px; margin-bottom: 18px; }
  .sm-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 14px; }
  .sm-score-label { font-size: 0.62rem; font-family: 'JetBrains Mono', monospace; color: var(--muted); letter-spacing: .1em; margin-bottom: 4px; }
  .sm-score { font-family: 'Bebas Neue', sans-serif; font-size: 3.2rem; line-height: 1; letter-spacing: .03em; transition: color .4s; }
  .sm-bars { display: flex; gap: 3px; margin-bottom: 14px; }
  .sm-bar-seg { flex: 1; height: 7px; border-radius: 2px; transition: background .4s; }
  .sm-balance { display: flex; justify-content: space-between; }
  .sm-balance-item .b-label { font-size: 0.6rem; font-family: 'JetBrains Mono', monospace; color: var(--muted); letter-spacing: .06em; }
  .sm-balance-item .b-val { font-size: 1rem; font-weight: 700; }
  
  .stacked-bar-section { background: var(--bg3); border: 1px solid var(--border); border-radius: 16px; padding: 20px; margin-bottom: 18px; }
  .sb-label { font-size: 0.62rem; font-family: 'JetBrains Mono', monospace; color: var(--muted); letter-spacing: .1em; margin-bottom: 14px; }
  .stacked-bar { display: flex; height: 28px; border-radius: 7px; overflow: hidden; margin-bottom: 14px; }
  .stacked-seg { transition: flex .4s ease; position: relative; }
  .stacked-seg:hover::after { content: attr(data-tip); position: absolute; top: -34px; left: 50%; transform: translateX(-50%); background: #1e293b; color: #fff; font-size: 0.68rem; padding: 4px 8px; border-radius: 4px; white-space: nowrap; font-family: 'JetBrains Mono', monospace; z-index: 10; }
  .legend-items { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; }
  .legend-item { display: flex; align-items: center; gap: 7px; font-size: 0.78rem; }
  .legend-dot { width: 9px; height: 9px; border-radius: 2px; flex-shrink: 0; }
  .legend-name { color: var(--muted); flex: 1; font-size: 0.75rem; }
  .legend-pct { font-family: 'JetBrains Mono', monospace; font-size: 0.72rem; color: var(--text); }
  .legend-amt { font-family: 'JetBrains Mono', monospace; font-size: 0.72rem; color: var(--purple); }
  
  .tips-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
  @media(max-width:600px){ .tips-grid{ grid-template-columns: 1fr; } }
  .tip-card { background: var(--bg3); border: 1px solid var(--border); border-radius: 12px; padding: 14px; transition: border-color .2s; }
  .tip-card:hover { border-color: rgba(168,85,247,.3); }
  .tip-icon { font-size: 1.3rem; margin-bottom: 7px; }
  .tip-title { font-size: 0.82rem; font-weight: 700; color: #fff; margin-bottom: 4px; }
  .tip-desc { font-size: 0.72rem; color: var(--muted); line-height: 1.5; }
  .tip-tag { font-size: 0.6rem; font-family: 'JetBrains Mono', monospace; padding: 2px 7px; border-radius: 3px; display: inline-block; margin-top: 6px; }
  .tip-tag.save { background: rgba(52,211,153,.1); color: var(--green); }
  .tip-tag.warn { background: rgba(244,63,94,.1); color: #fda4af; }
  .tip-tag.info { background: rgba(168,85,247,.1); color: #d8b4fe; }

  /* PPP */
  .ppp-shell { background: var(--bg2); border: 1px solid var(--border); border-radius: 24px; overflow: hidden; box-shadow: 0 24px 80px rgba(0,0,0,.4); }
  .ppp-header { padding: 26px 32px; border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px; }
  .ppp-title { font-family: 'Bebas Neue', sans-serif; font-size: 1.6rem; color: #fff; letter-spacing: .04em; }
  .ppp-sub { font-size: 0.72rem; color: var(--muted); font-family: 'JetBrains Mono', monospace; margin-top: 2px; }
  .ppp-badge { display: inline-flex; align-items: center; gap: 6px; padding: 5px 12px; border-radius: 6px; background: rgba(0,245,212,.07); border: 1px solid rgba(0,245,212,.18); font-size: 0.7rem; font-family: 'JetBrains Mono', monospace; color: var(--teal); }
  .ppp-body { display: grid; grid-template-columns: 340px 1fr; }
  @media(max-width:800px){.ppp-body {grid-template-columns:1fr}}
  .ppp-left { padding: 26px; border-right: 1px solid var(--border); }
  .ppp-right { padding: 26px; }
  .ppp-input-label { font-size: 0.65rem; font-family: 'JetBrains Mono', monospace; color: var(--muted); letter-spacing: .1em; margin-bottom: 10px; display: block; }
  .country-select-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 7px; margin-bottom: 22px; }
  .country-select-btn { padding: 10px; border-radius: 10px; border: 1px solid var(--border); background: none; cursor: pointer; font-family: 'Syne', sans-serif; font-size: 0.8rem; font-weight: 600; color: var(--muted); transition: all .2s; text-align: left; display: flex; align-items: center; gap: 7px; }
  .country-select-btn:hover { border-color: rgba(0,245,212,.3); color: #fff; }
  .country-select-btn.active { background: rgba(0,245,212,.08); border-color: rgba(0,245,212,.4); color: var(--teal); }
  .salary-input-wrap { position: relative; margin-bottom: 18px; }
  .salary-prefix { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); font-family: 'JetBrains Mono', monospace; font-size: 1.2rem; color: var(--teal); font-weight: 700; }
  input.salary-input { width: 100%; padding: 13px 13px 13px 38px; background: var(--bg3); border: 1px solid var(--border); border-radius: 12px; color: #fff; font-family: 'JetBrains Mono', monospace; font-size: 1.4rem; font-weight: 700; outline: none; transition: border-color .2s; }
  input.salary-input:focus { border-color: rgba(0,245,212,.4); }
  .ppp-insight { background: rgba(168,85,247,.06); border: 1px solid rgba(168,85,247,.14); border-radius: 12px; padding: 14px; }
  .ppp-insight-title { font-size: 0.74rem; font-weight: 700; color: #d8b4fe; margin-bottom: 6px; }
  .ppp-insight-text { font-size: 0.74rem; color: var(--muted); line-height: 1.6; }
  .ppp-insight-text strong { color: #fff; }
  .ppp-bars { display: flex; flex-direction: column; gap: 14px; }
  .ppp-bar-item { }
  .ppp-bar-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; }
  .ppp-bar-country { display: flex; align-items: center; gap: 8px; font-size: 0.86rem; font-weight: 600; }
  .ppp-bar-value { font-family: 'JetBrains Mono', monospace; font-size: 0.86rem; font-weight: 700; }
  .ppp-track { height: 28px; background: rgba(255,255,255,.04); border-radius: 6px; overflow: hidden; }
  .ppp-fill { height: 100%; border-radius: 6px; display: flex; align-items: center; justify-content: flex-end; padding-right: 10px; font-size: 0.65rem; font-family: 'JetBrains Mono', monospace; font-weight: 600; transition: width .7s cubic-bezier(.34,1.56,.64,1); min-width: 36px; white-space: nowrap; }
  .ppp-net { font-size: 0.6rem; color: var(--muted); margin-top: 3px; font-family: 'JetBrains Mono', monospace; }

  /* CALENDAR */
  .calendar-shell { background: var(--bg2); border: 1px solid var(--border); border-radius: 24px; overflow: hidden; }
  .cal-header { padding: 22px 32px; border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; }
  .cal-title { font-family: 'Bebas Neue', sans-serif; font-size: 1.5rem; color: #fff; letter-spacing: .04em; }
  .cal-nav { display: flex; gap: 8px; align-items: center; }
  .cal-btn { padding: 6px 14px; border: 1px solid var(--border); border-radius: 8px; background: none; color: var(--muted); cursor: pointer; font-size: 0.8rem; font-family: 'Syne', sans-serif; font-weight: 600; transition: all .2s; }
  .cal-btn:hover { color: #fff; border-color: rgba(255,255,255,.2); }
  .cal-month-label { font-family: 'JetBrains Mono', monospace; font-size: 0.82rem; color: #fff; min-width: 100px; text-align: center; }
  .cal-body { padding: 22px 32px; }
  .cal-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 12px; }
  @media(max-width:800px){ .cal-grid{grid-template-columns:1fr; } }
  .cal-week { background: var(--bg3); border: 1px solid var(--border); border-radius: 12px; padding: 14px; }
  .cw-label { font-size: 0.6rem; font-family: 'JetBrains Mono', monospace; color: var(--muted); letter-spacing: .08em; margin-bottom: 10px; }
  .cw-item { display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; font-size: 0.76rem; }
  .cw-name { color: var(--muted); }
  .cw-amt { font-family: 'JetBrains Mono', monospace; font-weight: 600; font-size: 0.76rem; }
  .cw-amt.exp { color: #fda4af; }
  .cw-amt.inc { color: var(--green); }
  .cw-total { margin-top: 10px; padding-top: 10px; border-top: 1px solid var(--border); display: flex; justify-content: space-between; }
  .cw-total-label { font-size: 0.6rem; color: var(--muted); font-family: 'JetBrains Mono', monospace; letter-spacing: .05em; }

  /* CULTURAL TIPS (FULL GRID SECTION) */
  .ctips-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 16px; }
  @media(max-width:900px){.ctips-grid{grid-template-columns:1fr}}
  .ctip-card { background: var(--bg2); border: 1px solid var(--border); border-radius: 16px; overflow: hidden; transition: all .2s; }
  .ctip-card:hover { transform: translateY(-2px); border-color: rgba(168,85,247,.25); }
  .ctip-card-header { padding: 18px 22px; border-bottom: 1px solid var(--border); display: flex; align-items: center; gap: 12px; }
  .ctip-flag { font-size: 2.2rem; }
  .ctip-country { font-family: 'Bebas Neue', sans-serif; font-size: 1.4rem; color: #fff; letter-spacing: .04em; }
  .ctip-city { font-size: 0.65rem; color: var(--muted); font-family: 'JetBrains Mono', monospace; }
  .ctip-body { padding: 18px 22px; }
  .ctip-row { display: flex; gap: 11px; margin-bottom: 13px; }
  .ctip-row:last-child { margin-bottom: 0; }
  .ctip-icon { font-size: 1rem; flex-shrink: 0; margin-top: 1px; }
  .ctip-text { font-size: 0.78rem; color: var(--muted); line-height: 1.55; }
  .ctip-text strong { color: var(--text); }

  /* CTA */
  .cta-section { background: linear-gradient(135deg, rgba(168,85,247,.08), rgba(0,245,212,.05)); border: 1px solid rgba(168,85,247,.18); border-radius: 24px; padding: 60px; text-align: center; margin: 0 60px 80px; position: relative; overflow: hidden; }
  .cta-section::before { content: ''; position: absolute; inset: 0; background: radial-gradient(ellipse at 50% -20%, rgba(168,85,247,.1), transparent 60%); }
  .cta-title { font-family: 'Bebas Neue', sans-serif; font-size: clamp(32px, 4vw, 60px); color: #fff; letter-spacing: .02em; margin-bottom: 14px; position: relative; }
  .cta-title .g { background: linear-gradient(90deg, var(--purple), var(--teal)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
  .cta-sub { color: var(--muted); font-size: 1rem; margin-bottom: 28px; position: relative; }
  .cta-buttons { display: flex; gap: 14px; justify-content: center; flex-wrap: wrap; position: relative; }
  .cta-btn-main { padding: 15px 34px; border-radius: 10px; border: none; background: var(--teal); color: #060c14; font-family: 'Syne', sans-serif; font-size: 0.92rem; font-weight: 700; cursor: pointer; transition: all .2s; }
  .cta-btn-main:hover { transform: translateY(-2px); box-shadow: 0 12px 32px rgba(0,245,212,.3); }
  .cta-btn-ghost { padding: 15px 34px; border-radius: 10px; border: 1px solid rgba(255,255,255,.14); background: none; color: #fff; font-family: 'Syne', sans-serif; font-size: 0.92rem; font-weight: 600; cursor: pointer; }
  .cta-btn-ghost:hover { border-color: rgba(168,85,247,.4); }
  .cta-micro { font-size: 0.7rem; color: var(--muted); margin-top: 14px; position: relative; letter-spacing: .05em; }

  .fade-up { opacity: 0; transform: translateY(24px); transition: opacity .6s ease, transform .6s ease; }
  .fade-up.visible { opacity: 1; transform: translateY(0); }
`

export default function SurvivalSimPage() {
  // Simulator State
  const [activeCityKey, setActiveCityKey] = useState('berlin')
  const [incomeType, setIncomeType] = useState('stipend')
  
  // Dynamic Expenses based on city defaults
  const [rent, setRent] = useState(CITIES['berlin'].rentDef)
  const [grocery, setGrocery] = useState(150)
  const [transport, setTransport] = useState(CITIES['berlin'].transDef)
  const [phone, setPhone] = useState(25)
  const [fun, setFun] = useState(80)
  const [health, setHealth] = useState(CITIES['berlin'].healthDef)
  const [uni, setUni] = useState(CITIES['berlin'].uniDef)
  const [savings, setSavings] = useState(0)

  // PPP State
  const [pppBase, setPppBase] = useState('de')
  const [pppSalary, setPppSalary] = useState(60000)

  // Calendar State
  const [calMonth, setCalMonth] = useState(0) // 0 = January

  useEffect(() => {
    // Inject Fonts
    const link = document.createElement('link')
    link.href = 'https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Syne:wght@400;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap'
    link.rel = 'stylesheet'
    document.head.appendChild(link)

    // Scroll Observer
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible') })
    }, { threshold: 0.08 })
    document.querySelectorAll('.fade-up').forEach(el => observer.observe(el))
    
    return () => observer.disconnect()
  }, [])

  // Derived Logic for Simulator
  const city = CITIES[activeCityKey]
  const c = city.currency
  const inc = incomeType === 'stipend' ? city.stipend : incomeType === 'hiwi' ? city.parttime : (city.stipend + city.parttime)
  const sp = rent + grocery + transport + phone + fun + health + uni + savings
  const bal = inc - sp

  const survivalScore = () => {
    if (inc === 0) return Math.max(0, Math.round(50 - (sp / 40)))
    const r = inc / sp
    if (r >= 1.3) return Math.min(99, Math.round(55 + r * 16))
    if (r >= 1.0) return Math.round(35 + r * 30)
    return Math.max(0, Math.round(r * 35))
  }

  const score = survivalScore()
  const statusFor = () => {
    if (score >= 72) return { label: 'Thriving', cls: 'thriving', color: '#34d399' }
    if (score >= 45) return { label: 'Surviving', cls: 'surviving', color: '#f59e0b' }
    return { label: 'Struggling', cls: 'struggling', color: '#f43f5e' }
  }
  const st = statusFor()

  const stiDisp = incomeType === 'combined' || incomeType === 'stipend' ? city.stipend : 0
  const wkDisp = incomeType === 'combined' || incomeType === 'hiwi' ? city.parttime : 0

  const budgetPct = inc > 0 ? Math.min(100, Math.round((sp / inc) * 100)) : 100

  const expenseItems = [
    { key: 'rent', val: rent }, { key: 'grocery', val: grocery }, { key: 'transport', val: transport },
    { key: 'phone', val: phone }, { key: 'fun', val: fun }, { key: 'health', val: health },
    { key: 'uni', val: uni }, { key: 'savings', val: savings }
  ].filter(i => i.val > 0)
  const totalExpenses = expenseItems.reduce((a, b) => a + b.val, 0) || 1

  // Handle City Change
  const handleCityChange = (key) => {
    setActiveCityKey(key)
    const newCity = CITIES[key]
    setRent(newCity.rentDef)
    setTransport(newCity.transDef)
    setHealth(newCity.healthDef)
    setUni(newCity.uniDef)
  }

  // PPP Logic
  const pppBaseData = PPP_DATA[pppBase]
  const pppGlobal = pppSalary / pppBaseData.ppp
  const pppMaxV = Math.max(...Object.values(PPP_DATA).map(country => pppGlobal * country.ppp))
  const usE = Math.round((pppSalary / pppBaseData.ppp) * PPP_DATA['us'].ppp)
  const inE = Math.round((pppSalary / pppBaseData.ppp) * PPP_DATA['in'].ppp)

  // Calendar Logic
  const weeks = [
    { label:'WEEK 1', items:[ {n:'Rent Due',a:-rent,e:true}, ...(inc>0?[{n:'Stipend / Pay',a:inc,e:false}]:[]), {n:'Groceries',a:-Math.round(grocery*.3),e:true} ] },
    { label:'WEEK 2', items:[ {n:'Transport',a:-transport,e:true}, {n:'Groceries',a:-Math.round(grocery*.3),e:true}, {n:'Dining Out',a:-Math.round(fun*.5),e:true} ] },
    { label:'WEEK 3', items:[ {n:'Health Ins.',a:-health,e:true}, {n:'Phone / Net',a:-phone,e:true}, {n:'Groceries',a:-Math.round(grocery*.2),e:true}, {n:'Fun / Social',a:-Math.round(fun*.3),e:true} ] },
    { label:'WEEK 4', items:[ {n:'Groceries',a:-Math.round(grocery*.2),e:true}, ...(uni>0?[{n:'Uni Semester',a:-Math.round(uni*6/12),e:true}]:[]), {n:'Misc / Buffer',a:-Math.round(fun*.2),e:true} ] },
  ]

  return (
    <div className="sim-wrapper">
      <style>{styles}</style>
      <div className="grid-bg"></div>
      <div className="glow-orb orb1"></div>
      <div className="glow-orb orb2"></div>
      <div className="glow-orb orb3"></div>

      <nav>
        <Link href="/" className="nav-logo">
          <div className="logo-icon"><Triangle size={18} fill="currentColor" strokeWidth={2} className="rotate-180" /></div>
          <span>Mentor<em>Bridge</em></span>
        </Link>
        <div className="nav-links">
          <Link href="/mentors">Mentors</Link>
          <Link href="/scholarships">Scholarships</Link>
          <Link href="/stories">Stories</Link>
          <Link href="/career-paths">Career Paths</Link>
          <Link href="/survival-sim" className="active">Survival Sim</Link>
          <Link href="/market-insights">Market Data</Link>
          <Link href="/roi-matrix">ROI Matrix</Link>
        </div>
        <div style={{display:'flex', gap:'10px'}}>
          <Link href="/dashboard/student" className="btn-ghost">Log in</Link>
          <Link href="/signup" className="btn-primary">Sign up →</Link>
        </div>
      </nav>

      <main>
        <div className="hero">
          <div className="hero-badge">INTERACTIVE BUDGET ENGINE · REAL STUDENT DATA</div>
          <h1 className="hero-title">SURVIVAL<br/><span className="a1">SIM</span><span className="a2">ULATOR</span></h1>
          <p className="hero-sub">Can you actually afford life abroad? Drag. Simulate. Discover the truth before you commit to anything.</p>
          <div className="hero-alert">⚡ Based on real data from 4,800+ students — not a financial guarantee. Your mileage will vary.</div>
        </div>

        {/* SIMULATOR */}
        <div className="section fade-up" style={{paddingTop: 0}}>
          <div className="section-label">DRAG · SIMULATE · DECIDE</div>
          <h2 className="section-title">BUILD YOUR BUDGET</h2>
          <p className="section-sub">Select your city, adjust every expense with a slider, and watch your Survival Score update live.</p>
          
          <div className="sim-shell">
            <div className="sim-topbar">
              <div style={{display:'flex', alignItems:'center', gap:'20px'}}>
                <div className="sim-indicator"><div className="sim-dot green"></div>Live Simulation</div>
                <div className="sim-indicator"><div className="sim-dot purple"></div><span>{city.name.charAt(0)}{city.name.slice(1).toLowerCase()}, {city.sub.split('·')[0].trim()}</span></div>
              </div>
              <div className="budget-bar-wrap">
                <span>BUDGET USAGE</span>
                <div className="budget-track">
                  <div className="budget-fill" style={{width: `${budgetPct}%`, background: budgetPct > 95 ? 'var(--red)' : budgetPct > 75 ? 'var(--gold)' : 'var(--green)'}}></div>
                </div>
                <span style={{color:'var(--text)', fontWeight:700}}>{budgetPct}%</span>
              </div>
            </div>

            <div className="city-selector">
              <div className="city-selector-label">SELECT YOUR CITY</div>
              <div className="city-pills">
                {Object.keys(CITIES).map(key => (
                  <button key={key} className={`city-pill ${activeCityKey === key ? 'active' : ''}`} onClick={() => handleCityChange(key)}>
                    {key === 'berlin' ? '🇩🇪 Berlin' : key === 'munich' ? '🇩🇪 Munich' : key === 'nyc' ? '🇺🇸 New York' : key === 'boston' ? '🇺🇸 Boston' : key === 'london' ? '🇬🇧 London' : key === 'toronto' ? '🇨🇦 Toronto' : key === 'melbourne' ? '🇦🇺 Melbourne' : '🇮🇪 Dublin'} 
                    <span className="cost-badge">{key==='berlin'?'€900–1.3k':key==='munich'?'€1.1–1.6k':key==='nyc'?'$2.2–3.2k':key==='boston'?'$1.8–2.6k':key==='london'?'£1.4–2.0k':key==='toronto'?'C$1.6–2.2k':key==='melbourne'?'A$1.8–2.5k':'€1.2–1.8k'}/mo</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="sim-body">
              {/* LEFT COLUMN: SLIDERS */}
              <div className="sim-left">
                <div className="income-box">
                  <div className="income-box-title">YOUR MONTHLY INCOME</div>
                  <div className="income-toggle">
                    <button className={`income-btn ${incomeType === 'stipend' ? 'active' : ''}`} onClick={() => setIncomeType('stipend')}>🎓 Scholarship</button>
                    <button className={`income-btn ${incomeType === 'hiwi' ? 'active' : ''}`} onClick={() => setIncomeType('hiwi')}>💼 Part-time</button>
                    <button className={`income-btn ${incomeType === 'combined' ? 'active' : ''}`} onClick={() => setIncomeType('combined')}>✨ Both</button>
                  </div>
                  <div className="stipend-val">{c}{inc.toLocaleString()}</div>
                  <div className="stipend-unit">PER MONTH (AFTER TAX)</div>
                  <div className="income-breakdown">
                    <div className="ib-item"><div className="ib-label">SCHOLARSHIP</div><div className="ib-val">{c}{stiDisp.toLocaleString()}</div></div>
                    <div className="ib-item"><div className="ib-label">PART-TIME</div><div className="ib-val">{c}{wkDisp.toLocaleString()}</div></div>
                    <div className="ib-item"><div className="ib-label">TOTAL</div><div className="ib-val" style={{color:'var(--teal)'}}>{c}{inc.toLocaleString()}</div></div>
                    <div className="ib-item"><div className="ib-label">BALANCE</div><div className="ib-val" style={{color: bal >= 0 ? 'var(--green)' : 'var(--red)'}}>{bal >= 0 ? '+' : ''}{c}{Math.abs(bal).toLocaleString()}</div></div>
                  </div>
                </div>

                <div className="sim-section-title">MONTHLY EXPENSES — DRAG TO ADJUST</div>
                
                <div className="budget-item"><div className="budget-item-top"><div className="budget-label">🏠 Rent / Housing</div><div className="budget-amount">{c}{rent}</div></div><input type="range" min="200" max="2500" value={rent} step="25" onChange={(e)=>setRent(parseInt(e.target.value))}/></div>
                <div className="budget-item"><div className="budget-item-top"><div className="budget-label">🛒 Groceries</div><div className="budget-amount">{c}{grocery}</div></div><input type="range" min="50" max="600" value={grocery} step="10" onChange={(e)=>setGrocery(parseInt(e.target.value))}/></div>
                <div className="budget-item"><div className="budget-item-top"><div className="budget-label">🚇 Transport</div><div className="budget-amount">{c}{transport}</div></div><input type="range" min="0" max="300" value={transport} step="5" onChange={(e)=>setTransport(parseInt(e.target.value))}/></div>
                <div className="budget-item"><div className="budget-item-top"><div className="budget-label">📱 Phone + Internet</div><div className="budget-amount">{c}{phone}</div></div><input type="range" min="0" max="150" value={phone} step="5" onChange={(e)=>setPhone(parseInt(e.target.value))}/></div>
                <div className="budget-item"><div className="budget-item-top"><div className="budget-label">🎉 Eating Out / Fun</div><div className="budget-amount">{c}{fun}</div></div><input type="range" min="0" max="500" value={fun} step="10" onChange={(e)=>setFun(parseInt(e.target.value))}/></div>
                <div className="budget-item"><div className="budget-item-top"><div className="budget-label">🏥 Health Insurance</div><div className="budget-amount">{c}{health}</div></div><input type="range" min="0" max="400" value={health} step="5" onChange={(e)=>setHealth(parseInt(e.target.value))}/></div>
                <div className="budget-item"><div className="budget-item-top"><div className="budget-label">🎓 Uni Semester Fee</div><div className="budget-amount">{c}{uni}</div></div><input type="range" min="0" max="500" value={uni} step="5" onChange={(e)=>setUni(parseInt(e.target.value))}/></div>
                <div className="budget-item"><div className="budget-item-top"><div className="budget-label">✈️ Travel / Savings</div><div className="budget-amount">{c}{savings}</div></div><input type="range" min="0" max="500" value={savings} step="10" onChange={(e)=>setSavings(parseInt(e.target.value))}/></div>
              </div>

              {/* RIGHT COLUMN: RESULTS */}
              <div className="sim-right">
                <div className="result-header">
                  <div>
                    <div className="result-city">{city.name}</div>
                    <div className="result-sub">{city.sub}</div>
                  </div>
                  <div className={`sm-status ${st.cls}`}>{st.label}</div>
                </div>

                <div className="survival-meter">
                  <div className="sm-top">
                    <div>
                      <div className="sm-score-label">SURVIVAL SCORE</div>
                      <div className="sm-score" style={{color: st.color}}>{score}</div>
                    </div>
                    <div style={{textAlign:'right'}}>
                      <div style={{fontSize:'.6rem', color:'var(--muted)', fontFamily:'JetBrains Mono', marginBottom:'4px'}}>MONTHLY BALANCE</div>
                      <div style={{fontSize:'1.7rem', fontFamily:'Bebas Neue', letterSpacing:'.04em', color: bal >= 0 ? 'var(--teal)' : 'var(--red)'}}>{bal >= 0 ? '+' : ''}{c}{Math.abs(bal).toLocaleString()}</div>
                    </div>
                  </div>
                  <div className="sm-bars">
                    {Array.from({length: 20}).map((_, i) => (
                      <div key={i} className="sm-bar-seg" style={{background: i < Math.round((score/100)*20) ? st.color : 'rgba(255,255,255,.06)'}}></div>
                    ))}
                  </div>
                  <div className="sm-balance">
                    <div className="sm-balance-item"><div className="b-label">TOTAL INCOME</div><div className="b-val" style={{color:'var(--green)'}}>{c}{inc.toLocaleString()}</div></div>
                    <div className="sm-balance-item" style={{textAlign:'center'}}><div className="b-label">TOTAL SPEND</div><div className="b-val" style={{color:'#fda4af'}}>{c}{sp.toLocaleString()}</div></div>
                    <div className="sm-balance-item" style={{textAlign:'right'}}><div className="b-label">BALANCE</div><div className="b-val" style={{color: bal >= 0 ? 'var(--teal)' : 'var(--red)'}}>{bal >= 0 ? '+' : ''}{c}{Math.abs(bal).toLocaleString()}</div></div>
                  </div>
                </div>

                <div className="stacked-bar-section">
                  <div className="sb-label">WHERE YOUR MONEY GOES</div>
                  <div className="stacked-bar">
                    {expenseItems.map((item, i) => (
                      <div key={i} className="stacked-seg" style={{flex: item.val, background: EXPENSE_COLORS[item.key].color}} data-tip={`${EXPENSE_COLORS[item.key].label}: ${c}${item.val}`}></div>
                    ))}
                  </div>
                  <div className="legend-items">
                    {expenseItems.map((item, i) => (
                      <div key={i} className="legend-item">
                        <div className="legend-dot" style={{background: EXPENSE_COLORS[item.key].color}}></div>
                        <span className="legend-name">{EXPENSE_COLORS[item.key].label}</span>
                        <span className="legend-pct">{((item.val/totalExpenses)*100).toFixed(0)}%</span>
                        <span className="legend-amt">{c}{item.val}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>

        {/* PPP EQUALIZER */}
        <div className="section fade-up">
          <div className="section-label">PURCHASING POWER PARITY</div>
          <h2 className="section-title">THE LIFESTYLE EQUALIZER</h2>
          <p className="section-sub">Don't compare raw salaries. See what an offer is actually worth after adjusting for real cost of living.</p>
          
          <div className="ppp-shell">
            <div className="ppp-header">
              <div><div className="ppp-title">OFFER REALITY CHECK</div><div className="ppp-sub">Enter any salary. See its true lifestyle value everywhere.</div></div>
              <div className="ppp-badge">⚡ PPP-Adjusted · Real-Time</div>
            </div>
            <div className="ppp-body">
              <div className="ppp-left">
                <span className="ppp-input-label">I HAVE AN OFFER IN...</span>
                <div className="country-select-grid">
                  {Object.keys(PPP_DATA).map(k => (
                    <button key={k} className={`country-select-btn ${pppBase === k ? 'active' : ''}`} onClick={() => setPppBase(k)}>{PPP_DATA[k].flag} {PPP_DATA[k].name}</button>
                  ))}
                </div>
                <span className="ppp-input-label">ANNUAL SALARY</span>
                <div className="salary-input-wrap">
                  <div className="salary-prefix">{pppBaseData.prefix}</div>
                  <input type="number" className="salary-input" value={pppSalary} onChange={(e)=>setPppSalary(e.target.value)} />
                </div>
                <div className="ppp-insight">
                  <div className="ppp-insight-title">💡 Why PPP Changes Everything</div>
                  <div className="ppp-insight-text">A <strong>{pppBaseData.prefix}{parseInt(pppSalary).toLocaleString()}</strong> salary in {pppBaseData.name} buys the same lifestyle as <strong>${usE.toLocaleString()}</strong> in the USA — but only <strong>₹{inE.toLocaleString()}</strong> if you returned to India. Raw numbers lie. PPP tells the truth.</div>
                </div>
              </div>
              <div className="ppp-right">
                <div style={{fontSize:'.62rem', fontFamily:'JetBrains Mono', color:'var(--muted)', letterSpacing:'.1em', marginBottom:'18px'}}>EQUIVALENT LIFESTYLE VALUE (PPP-ADJUSTED ANNUAL)</div>
                <div className="ppp-bars">
                  {Object.entries(PPP_DATA).map(([k, c]) => {
                    const equiv = Math.round(pppGlobal * c.ppp)
                    const net = Math.round(equiv * (1 - c.tax))
                    const bpct = Math.min(100, (equiv / pppMaxV) * 100)
                    const isBase = k === pppBase
                    return (
                      <div key={k} className="ppp-bar-item">
                        <div className="ppp-bar-top">
                          <div className="ppp-bar-country">
                            <span>{c.flag}</span>
                            <span style={{color: isBase ? 'var(--teal)' : 'var(--text)'}}>{c.name}</span>
                            {isBase && <span style={{fontSize:'.58rem', color:'var(--teal)', fontFamily:'JetBrains Mono', padding:'1px 6px', borderRadius:'3px', background:'rgba(0,245,212,.1)', border:'1px solid rgba(0,245,212,.2)'}}>BASE</span>}
                          </div>
                          <div className="ppp-bar-value" style={{color: isBase ? 'var(--teal)' : 'var(--text)'}}>{c.prefix}{equiv.toLocaleString()}</div>
                        </div>
                        <div className="ppp-track">
                          <div className="ppp-fill" style={{width: `${bpct}%`, background: isBase ? 'linear-gradient(90deg,#00f5d4,#2dd4bf)' : 'linear-gradient(90deg,rgba(168,85,247,.55),rgba(99,102,241,.55))', color: isBase ? '#065f46' : 'rgba(255,255,255,.65)'}}>
                            {bpct > 18 ? `net ~${c.prefix}${net.toLocaleString()}` : ''}
                          </div>
                        </div>
                        <div className="ppp-net">After-tax equivalent: {c.prefix}{net.toLocaleString()} / year</div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CALENDAR */}
        <div className="section fade-up">
          <div className="section-label">WEEK-BY-WEEK VIEW</div>
          <h2 className="section-title">YOUR MONTH IN NUMBERS</h2>
          <p className="section-sub">See exactly when money flows in and out. No nasty surprises at week 3.</p>
          <div className="calendar-shell">
            <div className="cal-header">
              <div className="cal-title">MONTHLY CASHFLOW</div>
              <div className="cal-nav">
                <button className="cal-btn" onClick={() => setCalMonth((calMonth-1+12)%12)}>←</button>
                <div className="cal-month-label">{MONTHS[calMonth]} 2026</div>
                <button className="cal-btn" onClick={() => setCalMonth((calMonth+1)%12)}>→</button>
              </div>
            </div>
            <div className="cal-body">
              <div className="cal-grid">
                {weeks.map((w, i) => {
                  const net = w.items.reduce((a,b)=>a+b.a,0)
                  return (
                    <div key={i} className="cal-week">
                      <div className="cw-label">{w.label}</div>
                      {w.items.map((it, j) => (
                        <div key={j} className="cw-item">
                          <span className="cw-name">{it.n}</span>
                          <span className={`cw-amt ${it.a < 0 ? 'exp' : 'inc'}`}>{it.a < 0 ? '-' : '+'}{c}{Math.abs(it.a).toLocaleString()}</span>
                        </div>
                      ))}
                      <div className="cw-total">
                        <span className="cw-total-label">WEEK NET</span>
                        <span style={{color: net >= 0 ? 'var(--green)' : 'var(--red)', fontFamily:'JetBrains Mono', fontSize:'.78rem'}}>{net >= 0 ? '+' : ''}{c}{net.toLocaleString()}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        {/* CULTURAL TIPS (RESTORED GRID SECTION) */}
        <div className="section fade-up">
          <div className="section-label">INSIDER INTELLIGENCE</div>
          <h2 className="section-title">WHAT NOBODY TELLS YOU</h2>
          <p className="section-sub">The unwritten rules that mentors share in private chats — now public.</p>
          <div className="ctips-grid">
            
            <div className="ctip-card">
              <div className="ctip-card-header"><div className="ctip-flag">🇩🇪</div><div><div className="ctip-country">GERMANY</div><div className="ctip-city">Berlin · Munich · Hamburg · Aachen</div></div></div>
              <div className="ctip-body">
                <div className="ctip-row"><span className="ctip-icon">💳</span><div className="ctip-text"><strong>Cash is still king.</strong> Many German restaurants, local shops, and kiosks don't accept card. Always carry €40+ in cash — you will need it.</div></div>
                <div className="ctip-row"><span className="ctip-icon">🏦</span><div className="ctip-text"><strong>Blocked account first.</strong> You need €11,208 in a German blocked account before visa approval. DKB or Fintiba take 2–4 weeks to set up. Start early.</div></div>
                <div className="ctip-row"><span className="ctip-icon">🚇</span><div className="ctip-text"><strong>Semester ticket = free transport.</strong> Your ~€300 semester fee often includes an all-city transit pass. Never buy a separate monthly ticket.</div></div>
                <div className="ctip-row"><span className="ctip-icon">🏠</span><div className="ctip-text"><strong>WG is the way.</strong> Shared apartments are 40% cheaper. Use WG-Gesucht.de, not Immobilienscout24. Message 20 listings and expect 2 replies.</div></div>
              </div>
            </div>

            <div className="ctip-card">
              <div className="ctip-card-header"><div className="ctip-flag">🇺🇸</div><div><div className="ctip-country">USA</div><div className="ctip-city">NYC · Boston · Seattle · Austin</div></div></div>
              <div className="ctip-body">
                <div className="ctip-row"><span className="ctip-icon">💳</span><div className="ctip-text"><strong>Build credit from day 1.</strong> No credit score = no apartment lease. Get a secured card (Discover It) immediately. Pay it in full every month.</div></div>
                <div className="ctip-row"><span className="ctip-icon">🩺</span><div className="ctip-text"><strong>Use the university health plan.</strong> It's subsidized. External plans cost $300–500/month. Use campus clinics first — always. They're free for enrolled students.</div></div>
                <div className="ctip-row"><span className="ctip-icon">🛒</span><div className="ctip-text"><strong>Asian grocery stores save lives.</strong> H-Mart, 99 Ranch, Patel Brothers beat Whole Foods by 50%. Essential for Indian cooking on a student budget.</div></div>
                <div className="ctip-row"><span className="ctip-icon">💼</span><div className="ctip-text"><strong>CPT/OPT timing is everything.</strong> Talk to your DSO in semester 1 about CPT eligibility. Missing the window costs you an entire internship cycle.</div></div>
              </div>
            </div>

            <div className="ctip-card">
              <div className="ctip-card-header"><div className="ctip-flag">🇬🇧</div><div><div className="ctip-country">UK</div><div className="ctip-city">London · Manchester · Bristol · Leeds</div></div></div>
              <div className="ctip-body">
                <div className="ctip-row"><span className="ctip-icon">🏠</span><div className="ctip-text"><strong>Book housing 3 months early.</strong> London rooms go in hours. Use SpareRoom.co.uk. Avoid estate agents for short lets — fees are brutal.</div></div>
                <div className="ctip-row"><span className="ctip-icon">🚌</span><div className="ctip-text"><strong>18+ Oyster card = 30% off.</strong> Register before you arrive — it takes 10 days by post. Huge savings on daily Zone 1–3 commutes.</div></div>
                <div className="ctip-row"><span className="ctip-icon">⏱️</span><div className="ctip-text"><strong>1-year MSc moves terrifyingly fast.</strong> Job applications open in Week 6 of Term 1. Miss that window and you miss the entire hiring cycle.</div></div>
                <div className="ctip-row"><span className="ctip-icon">📄</span><div className="ctip-text"><strong>Graduate Visa = 2 free years.</strong> After graduation you get an automatic 2-year Graduate Visa with full work rights. Use it strategically.</div></div>
              </div>
            </div>

          </div>
        </div>

        {/* CTA */}
        <div className="cta-section fade-up">
          <h2 className="cta-title">STOP GUESSING.<br/><span className="g">TALK TO SOMEONE WHO LIVED IT.</span></h2>
          <p className="cta-sub">Numbers are one thing. A mentor who survived year 1 in Berlin or Boston is another story entirely.</p>
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