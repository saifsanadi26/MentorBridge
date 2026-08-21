'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

// ── 56 PARTNER UNIVERSITIES ──
const UNIS = [
  {n:"TU Munich",          c:"Germany",     f:"🇩🇪", t:"Public",   col:"#38bdf8", lat:48.262, lng:11.668},
  {n:"RWTH Aachen",        c:"Germany",     f:"🇩🇪", t:"Public",   col:"#38bdf8", lat:50.778, lng:6.084},
  {n:"TU Berlin",          c:"Germany",     f:"🇩🇪", t:"Public",   col:"#38bdf8", lat:52.511, lng:13.326},
  {n:"KIT Karlsruhe",      c:"Germany",     f:"🇩🇪", t:"Public",   col:"#38bdf8", lat:49.012, lng:8.416},
  {n:"TU Dresden",         c:"Germany",     f:"🇩🇪", t:"Public",   col:"#38bdf8", lat:51.026, lng:13.722},
  {n:"Univ. of Stuttgart", c:"Germany",     f:"🇩🇪", t:"Public",   col:"#38bdf8", lat:48.745, lng:9.106},
  {n:"TU Darmstadt",       c:"Germany",     f:"🇩🇪", t:"Public",   col:"#38bdf8", lat:49.878, lng:8.654},
  {n:"LMU Munich",         c:"Germany",     f:"🇩🇪", t:"Research", col:"#a78bfa", lat:48.150, lng:11.580},
  {n:"Heidelberg Univ.",   c:"Germany",     f:"🇩🇪", t:"Research", col:"#a78bfa", lat:49.410, lng:8.710},
  {n:"TUHH Hamburg",       c:"Germany",     f:"🇩🇪", t:"Public",   col:"#38bdf8", lat:53.460, lng:9.970},
  {n:"Leibniz Hannover",   c:"Germany",     f:"🇩🇪", t:"Public",   col:"#38bdf8", lat:52.382, lng:9.718},
  {n:"FAU Erlangen",       c:"Germany",     f:"🇩🇪", t:"Public",   col:"#38bdf8", lat:49.597, lng:11.003},
  {n:"Univ. Freiburg",     c:"Germany",     f:"🇩🇪", t:"Research", col:"#a78bfa", lat:47.996, lng:7.842},
  {n:"Mannheim B-School",  c:"Germany",     f:"🇩🇪", t:"Public",   col:"#38bdf8", lat:49.487, lng:8.466},
  {n:"Harvard University", c:"USA",         f:"🇺🇸", t:"Private",  col:"#fbbf24", lat:42.377, lng:-71.117},
  {n:"Stanford University",c:"USA",         f:"🇺🇸", t:"Private",  col:"#fbbf24", lat:37.427, lng:-122.170},
  {n:"MIT",                c:"USA",         f:"🇺🇸", t:"Private",  col:"#fbbf24", lat:42.360, lng:-71.094},
  {n:"Carnegie Mellon",    c:"USA",         f:"🇺🇸", t:"Private",  col:"#fbbf24", lat:40.443, lng:-79.942},
  {n:"UT Dallas",          c:"USA",         f:"🇺🇸", t:"Public",   col:"#38bdf8", lat:32.988, lng:-96.750},
  {n:"Northeastern Univ.", c:"USA",         f:"🇺🇸", t:"Private",  col:"#fbbf24", lat:42.338, lng:-71.090},
  {n:"Arizona State Univ.",c:"USA",         f:"🇺🇸", t:"Public",   col:"#38bdf8", lat:33.421, lng:-111.934},
  {n:"Univ. of Washington",c:"USA",         f:"🇺🇸", t:"Public",   col:"#38bdf8", lat:47.654, lng:-122.308},
  {n:"UC Berkeley",        c:"USA",         f:"🇺🇸", t:"Public",   col:"#38bdf8", lat:37.872, lng:-122.260},
  {n:"Georgia Tech",       c:"USA",         f:"🇺🇸", t:"Public",   col:"#38bdf8", lat:33.775, lng:-84.397},
  {n:"Univ. of Michigan",  c:"USA",         f:"🇺🇸", t:"Public",   col:"#38bdf8", lat:42.277, lng:-83.739},
  {n:"Princeton Univ.",    c:"USA",         f:"🇺🇸", t:"Private",  col:"#fbbf24", lat:40.343, lng:-74.651},
  {n:"Univ. of Oxford",    c:"UK",          f:"🇬🇧", t:"Public",   col:"#38bdf8", lat:51.755, lng:-1.254},
  {n:"Univ. of Cambridge", c:"UK",          f:"🇬🇧", t:"Public",   col:"#38bdf8", lat:52.205, lng:0.122},
  {n:"Imperial College",   c:"UK",          f:"🇬🇧", t:"Public",   col:"#38bdf8", lat:51.499, lng:-0.175},
  {n:"Univ. Manchester",   c:"UK",          f:"🇬🇧", t:"Public",   col:"#38bdf8", lat:53.468, lng:-2.234},
  {n:"Univ. Edinburgh",    c:"UK",          f:"🇬🇧", t:"Research", col:"#a78bfa", lat:55.945, lng:-3.189},
  {n:"Univ. of Bristol",   c:"UK",          f:"🇬🇧", t:"Public",   col:"#38bdf8", lat:51.458, lng:-2.604},
  {n:"Univ. of Leeds",     c:"UK",          f:"🇬🇧", t:"Public",   col:"#38bdf8", lat:53.805, lng:-1.555},
  {n:"UCL London",         c:"UK",          f:"🇬🇧", t:"Public",   col:"#38bdf8", lat:51.524, lng:-0.134},
  {n:"Univ. of Toronto",   c:"Canada",      f:"🇨🇦", t:"Public",   col:"#38bdf8", lat:43.663, lng:-79.397},
  {n:"UBC Vancouver",      c:"Canada",      f:"🇨🇦", t:"Public",   col:"#38bdf8", lat:49.261, lng:-123.246},
  {n:"Univ. of Waterloo",  c:"Canada",      f:"🇨🇦", t:"Public",   col:"#38bdf8", lat:43.472, lng:-80.545},
  {n:"McGill University",  c:"Canada",      f:"🇨🇦", t:"Research", col:"#a78bfa", lat:45.504, lng:-73.577},
  {n:"Univ. of Alberta",   c:"Canada",      f:"🇨🇦", t:"Public",   col:"#38bdf8", lat:53.523, lng:-113.526},
  {n:"Simon Fraser Univ.", c:"Canada",      f:"🇨🇦", t:"Public",   col:"#38bdf8", lat:49.278, lng:-122.919},
  {n:"Univ. of Melbourne", c:"Australia",   f:"🇦🇺", t:"Public",   col:"#38bdf8", lat:-37.798, lng:144.960},
  {n:"Monash University",  c:"Australia",   f:"🇦🇺", t:"Public",   col:"#38bdf8", lat:-37.908, lng:145.134},
  {n:"Univ. of Sydney",    c:"Australia",   f:"🇦🇺", t:"Research", col:"#a78bfa", lat:-33.889, lng:151.188},
  {n:"UNSW Sydney",        c:"Australia",   f:"🇦🇺", t:"Public",   col:"#38bdf8", lat:-33.917, lng:151.231},
  {n:"ANU Canberra",       c:"Australia",   f:"🇦🇺", t:"Research", col:"#a78bfa", lat:-35.278, lng:149.119},
  {n:"IIT Bombay",         c:"India",       f:"🇮🇳", t:"Public",   col:"#38bdf8", lat:19.133, lng:72.913},
  {n:"IIT Delhi",          c:"India",       f:"🇮🇳", t:"Public",   col:"#38bdf8", lat:28.545, lng:77.193},
  {n:"IIT Madras",         c:"India",       f:"🇮🇳", t:"Public",   col:"#38bdf8", lat:12.991, lng:80.234},
  {n:"IIT Kanpur",         c:"India",       f:"🇮🇳", t:"Public",   col:"#38bdf8", lat:26.520, lng:80.234},
  {n:"IIT Roorkee",        c:"India",       f:"🇮🇳", t:"Research", col:"#a78bfa", lat:29.865, lng:77.893},
  {n:"ETH Zurich",         c:"Switzerland", f:"🇨🇭", t:"Research", col:"#a78bfa", lat:47.377, lng:8.542},
  {n:"EPFL Lausanne",      c:"Switzerland", f:"🇨🇭", t:"Research", col:"#a78bfa", lat:46.519, lng:6.566},
  {n:"NUS Singapore",      c:"Singapore",   f:"🇸🇬", t:"Public",   col:"#38bdf8", lat:1.297,  lng:103.776},
  {n:"Univ. of Tokyo",     c:"Japan",       f:"🇯🇵", t:"Research", col:"#a78bfa", lat:35.713, lng:139.761},
  {n:"Trinity Dublin",     c:"Ireland",     f:"🇮🇪", t:"Public",   col:"#38bdf8", lat:53.344, lng:-6.254},
  {n:"TU Delft",           c:"Netherlands", f:"🇳🇱", t:"Public",   col:"#38bdf8", lat:51.998, lng:4.374},
]

const HUB = { lat: 28.614, lng: 77.209 } // New Delhi

const INIT_LOGS = [
  { t: '10:42', col: 'var(--cyan)',   msg: 'SmartMatch recalculated',  detail: 'score 84%',        detailCol: 'var(--teal)' },
  { t: 'YEST',  col: 'var(--teal)',   msg: 'Uploaded transcript_v2.pdf', detail: '✓',                detailCol: 'var(--teal)' },
  { t: 'YEST',  col: 'var(--violet)', msg: 'Session with Aarav Mehta',   detail: 'notes saved',       detailCol: 'var(--violet)' },
  { t: 'MON',   col: 'var(--amber)',  msg: 'RWTH application',           detail: 'submitted',          detailCol: 'var(--amber)' },
  { t: 'NOW',   col: 'var(--cyan)',   msg: 'Awaiting command',           detail: '',                   detailCol: 'var(--cyan)', cursor: true },
]

const CSS = `
  .student-dash-wrapper {
    --bg:#020509; --bg1:#05080f; --bg2:#080d1a; --bg3:#0c1222; --bg4:#101828;
    --border:rgba(0,245,255,0.07); --bh:rgba(0,245,255,0.18); --bb:rgba(0,245,255,0.4);
    --cyan:#00F5FF; --cyan2:#00c8d4; --teal:#00E5A8;
    --amber:#FFB347; --rose:#FF4D6D; --violet:#7C6FFF; --sky:#38bdf8;
    --text:#BDD0EE; --text2:#4A6080; --text3:#1E2E44;
    --ffh:'Rajdhani',sans-serif; --ffb:'DM Sans',sans-serif; --ffm:'JetBrains Mono',monospace;
    --sb:220px;
    background: var(--bg); color: var(--text); font-family: var(--ffb);
    min-height: 100vh; display: flex; overflow: hidden; position: relative;
  }
  .student-dash-wrapper * { box-sizing: border-box; }
  .student-dash-wrapper a { text-decoration: none; color: inherit; }
  .student-dash-wrapper ::-webkit-scrollbar { width: 4px; background: transparent; }
  .student-dash-wrapper ::-webkit-scrollbar-thumb { background: rgba(0,245,255,.1); border-radius: 4px; }
  .student-dash-wrapper ::-webkit-scrollbar-thumb:hover { background: rgba(0,245,255,.2); }

  /* AMBIENT */
  .bg-ambient { position:absolute; inset:0; z-index:0; pointer-events:none;
    background: radial-gradient(ellipse 90% 60% at 60% 20%,rgba(0,245,255,.035) 0%,transparent 65%),
      radial-gradient(ellipse 60% 70% at 15% 85%,rgba(124,111,255,.04) 0%,transparent 55%),
      radial-gradient(ellipse 45% 45% at 85% 75%,rgba(0,229,168,.028) 0%,transparent 55%); }
  .hex-grid { position:absolute; inset:0; z-index:0; pointer-events:none; opacity:.028;
    background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='96'%3E%3Cpolygon points='28,2 54,16 54,44 28,58 2,44 2,16' fill='none' stroke='%2300F5FF' stroke-width='0.7'/%3E%3Cpolygon points='28,50 54,64 54,92 28,106 2,92 2,64' fill='none' stroke='%2300F5FF' stroke-width='0.7'/%3E%3C/svg%3E"); }
  .scanlines { position:absolute; inset:0; z-index:1; pointer-events:none;
    background:repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,.045) 2px,rgba(0,0,0,.045) 4px); }
  .sweep { position:absolute; top:0; left:0; right:0; z-index:1; pointer-events:none;
    height:1.5px; background:linear-gradient(90deg,transparent 0%,var(--cyan) 50%,transparent 100%);
    opacity:.18; animation:sweep 12s ease-in-out infinite; }
  @keyframes sweep { 0%{transform:translateY(-10px);opacity:0}8%{opacity:.28}92%{opacity:.28}100%{transform:translateY(100vh);opacity:0} }

  /* SIDEBAR */
  .sidebar { width:var(--sb); flex-shrink:0; height:100vh;
    background:linear-gradient(180deg,#060b16 0%,#040810 100%);
    border-right:1px solid var(--border); display:flex; flex-direction:column;
    position:relative; z-index:100; }
  .sidebar::after { content:''; position:absolute; top:8px; left:8px; right:8px;
    height:1.5px; background:linear-gradient(90deg,var(--cyan),transparent); opacity:.35; }
  .sb-logo { padding:20px 18px 16px; border-bottom:1px solid var(--border);
    display:flex; align-items:center; gap:10px; }
  .sb-logo-mark { width:30px; height:30px; background:linear-gradient(135deg,var(--cyan),var(--violet));
    border-radius:7px; display:flex; align-items:center; justify-content:center;
    font-size:14px; color:#000; box-shadow:0 0 14px rgba(0,245,255,.3);
    animation:logoPulse 3.5s ease-in-out infinite; }
  @keyframes logoPulse { 0%,100%{box-shadow:0 0 14px rgba(0,245,255,.3)}50%{box-shadow:0 0 28px rgba(0,245,255,.6)} }
  .sb-logo-text { font-family:var(--ffh); font-size:17px; font-weight:700; letter-spacing:.07em; color:#fff; }
  .sb-logo-text em { font-style:normal; color:var(--cyan); }
  .sb-search { padding:12px 14px; border-bottom:1px solid var(--border); }
  .sb-search-inner { background:rgba(255,255,255,.03); border:1px solid var(--border);
    border-radius:8px; padding:7px 11px; display:flex; align-items:center; gap:7px; transition:border-color .2s; }
  .sb-search-inner:focus-within { border-color:rgba(0,245,255,.28); }
  .sb-search input { background:none; border:none; outline:none;
    font-family:var(--ffm); font-size:10.5px; color:var(--text2); width:100%; }
  .sb-search input::placeholder { color:var(--text3); }
  .sb-nav { flex:1; padding:10px 0; overflow-y:auto; }
  .sb-section { font-family:var(--ffm); font-size:8.5px; letter-spacing:.2em; text-transform:uppercase;
    color:var(--text3); padding:12px 18px 5px; }
  .sb-item { display:flex; align-items:center; gap:9px; padding:8.5px 18px;
    font-size:13px; font-weight:500; color:var(--text2); cursor:pointer;
    transition:all .18s; position:relative; border-left:2px solid transparent; text-decoration:none; }
  .sb-item:hover { color:var(--text); background:rgba(0,245,255,.03); }
  .sb-item.active { color:var(--cyan); background:rgba(0,245,255,.06); border-left-color:var(--cyan); }
  .sb-item.active::after { content:''; position:absolute; right:0; top:0; bottom:0;
    width:1px; background:linear-gradient(180deg,transparent,var(--cyan),transparent); }
  .sb-item-ico { font-size:14px; width:17px; text-align:center; opacity:.85; }
  .sb-item-badge { margin-left:auto; font-family:var(--ffm); font-size:9px;
    background:rgba(255,179,71,.14); color:var(--amber);
    border:1px solid rgba(255,179,71,.28); padding:1px 6px; border-radius:10px; }
  .sb-user { padding:13px 14px; border-top:1px solid var(--border);
    display:flex; align-items:center; gap:9px; position:relative; }
  .sb-user::before { content:''; position:absolute; top:0; left:14px; right:14px;
    height:1px; background:linear-gradient(90deg,var(--cyan),transparent); opacity:.25; }
  .sb-av { width:33px; height:33px; border-radius:50%;
    background:linear-gradient(135deg,#0a2040,#1a4060);
    border:1.5px solid rgba(0,245,255,.4); display:flex; align-items:center;
    justify-content:center; font-family:var(--ffh); font-size:14px;
    font-weight:700; color:var(--cyan); flex-shrink:0; position:relative; }
  .sb-av-dot { position:absolute; bottom:-1px; right:-1px; width:8px; height:8px;
    border-radius:50%; background:var(--teal); border:1.5px solid var(--bg1);
    animation:dotPulse 2.2s ease-in-out infinite; }
  @keyframes dotPulse { 0%,100%{box-shadow:0 0 4px var(--teal)}50%{box-shadow:0 0 10px var(--teal)} }
  .sb-user-name { font-family:var(--ffh); font-size:14px; font-weight:600; color:#fff; }
  .sb-user-rank { font-family:var(--ffm); font-size:9px; color:var(--teal); letter-spacing:.06em; }

  /* MAIN */
  .main { flex:1; height:100vh; overflow-y:auto; overflow-x:hidden;
    position:relative; z-index:2; display:flex; flex-direction:column; }
  .topbar { height:50px; background:rgba(4,7,14,.9); backdrop-filter:blur(20px);
    border-bottom:1px solid var(--border); padding:0 26px;
    display:flex; align-items:center; justify-content:space-between;
    flex-shrink:0; position:sticky; top:0; z-index:80; }
  .topbar-left { display:flex; align-items:center; gap:16px; }
  .topbar-crumb { font-family:var(--ffm); font-size:10.5px; color:var(--text3);
    display:flex; align-items:center; gap:5px; text-transform:uppercase; }
  .topbar-crumb em { font-style:normal; color:var(--cyan); }
  .topbar-live { display:flex; align-items:center; gap:6px; font-family:var(--ffm);
    font-size:9.5px; color:var(--teal); background:rgba(0,229,168,.06);
    border:1px solid rgba(0,229,168,.2); padding:3px 9px; border-radius:20px; }
  .live-dot { width:6px; height:6px; border-radius:50%; background:var(--teal);
    box-shadow:0 0 8px var(--teal); animation:dotPulse 1.6s infinite; flex-shrink:0; }
  .topbar-right { display:flex; align-items:center; gap:12px; }
  .topbar-time { font-family:var(--ffm); font-size:11.5px; color:var(--text2); letter-spacing:.06em; }
  .topbar-ico { width:31px; height:31px; background:var(--bg2); border:1px solid var(--border);
    border-radius:8px; display:flex; align-items:center; justify-content:center;
    font-size:13px; cursor:pointer; transition:all .2s; position:relative; }
  .topbar-ico:hover { border-color:var(--bh); background:var(--bg3); }
  .notif-badge { position:absolute; top:-3px; right:-3px; width:7px; height:7px;
    border-radius:50%; background:var(--rose); border:1.5px solid var(--bg1); }

  /* CONTENT */
  .content { padding:20px 24px 40px; display:flex; flex-direction:column; gap:18px; min-width:0; }

  /* ── COMPACT HERO ── */
  .hero {
    background:var(--bg1); border:1px solid var(--border);
    border-radius:16px; padding:12px 20px;
    display:flex; align-items:center; justify-content:space-between;
    gap:20px; position:relative; overflow:hidden;
    animation:fadeUp .5s ease both; flex-shrink:0;
  }
  .hero::before { content:''; position:absolute; left:0; top:0; bottom:0;
    width:3px; background:linear-gradient(180deg,var(--cyan),var(--teal),var(--violet)); }
  .hero::after { content:''; position:absolute; inset:0;
    background:radial-gradient(ellipse 55% 100% at 0% 50%,rgba(0,245,255,.04),transparent 55%);
    pointer-events:none; }
  .hero-corner { position:absolute; top:8px; right:16px;
    font-family:var(--ffm); font-size:7px; color:var(--text3);
    letter-spacing:.15em; text-transform:uppercase;
    display:flex; align-items:center; gap:6px; }
  .hero-corner::before { content:''; width:20px; height:1px;
    background:linear-gradient(90deg,transparent,var(--text3)); }
  .hero-main { flex:1; min-width:0; }
  .hero-status { display:inline-flex; align-items:center; gap:7px;
    font-family:var(--ffm); font-size:8px; letter-spacing:.14em;
    text-transform:uppercase; color:var(--teal); margin-bottom:2px; }
  .hero-title { font-family:var(--ffh); font-size:18px;
    font-weight:800; letter-spacing:.02em; line-height:1;
    color:#fff; margin-bottom:2px; text-transform:uppercase; }
  .hero-title em { font-style:normal; color:var(--cyan); }
  .hero-sub { font-size:10.5px; color:var(--text2); line-height:1.3; max-width:460px; }
  .hero-sub b { color:var(--amber); font-weight:500; }
  .hero-stats { display:flex; gap:8px; flex-shrink:0; align-items:center; z-index:2; position:relative; }

  .ring-stat { display:flex; flex-direction:column; align-items:center; justify-content:center;
    gap:2px; background:var(--bg2); border:1px solid var(--border); border-radius:10px;
    padding:6px 10px; min-width:76px; transition:all .25s; cursor:default; }
  .ring-stat:hover { border-color:var(--bh); transform:translateY(-1px); }
  .ring-wrap { position:relative; width:40px; height:40px; margin-bottom:1px; }
  .ring-svg { width:40px; height:40px; transform:rotate(-90deg); }
  .ring-bg { fill:none; stroke:rgba(0,245,255,.07); stroke-width:3; }
  .ring-fill { fill:none; stroke:var(--cyan); stroke-width:3; stroke-linecap:round;
    stroke-dasharray:100; stroke-dashoffset:100;
    filter:drop-shadow(0 0 4px rgba(0,245,255,.5));
    transition: stroke-dashoffset 1.4s cubic-bezier(.4,0,.2,1); }
  .ring-val { position:absolute; inset:0; display:flex; flex-direction:column;
    align-items:center; justify-content:center; }
  .ring-num { font-family:var(--ffh); font-size:14px; font-weight:700; color:var(--cyan); line-height:1; }
  .ring-pct { font-family:var(--ffm); font-size:6px; color:var(--text2); }
  .ring-label { font-family:var(--ffm); font-size:7px; color:var(--text2);
    letter-spacing:.08em; text-transform:uppercase; text-align:center; line-height:1.2; }
  
  .num-stat { display:flex; flex-direction:column; align-items:center; justify-content:center;
    gap:2px; background:var(--bg2); border:1px solid var(--border); border-radius:10px;
    padding:6px 10px; min-width:70px; transition:all .25s; cursor:default; }
  .num-stat:hover { border-color:var(--bh); transform:translateY(-1px); }
  .num-val { font-family:var(--ffh); font-size:18px; font-weight:700; line-height:1; margin-bottom:1px; }
  .num-label { font-family:var(--ffm); font-size:7px; color:var(--text2);
    letter-spacing:.08em; text-transform:uppercase; text-align:center; line-height:1.2; }
  .num-sub { font-family:var(--ffm); font-size:6.5px; color:var(--text3); }

  /* GLOBE CARD */
  .globe-card { background:var(--bg1); border:1px solid var(--border);
    border-radius:16px; overflow:hidden; position:relative; animation:fadeUp .5s .06s ease both; }
  .globe-head { padding:12px 20px; border-bottom:1px solid var(--border);
    display:flex; align-items:center; justify-content:space-between; gap:12px; flex-wrap:wrap; }
  .globe-title { font-family:var(--ffh); font-size:15px; font-weight:600;
    letter-spacing:.07em; color:#fff; display:flex; align-items:center; gap:8px; }
  .globe-title-ico { color:var(--cyan); }
  .globe-meta-row { display:flex; align-items:center; gap:14px; }
  .globe-count { display:flex; align-items:center; gap:6px; font-family:var(--ffm);
    font-size:9.5px; color:var(--teal); background:rgba(0,229,168,.07);
    border:1px solid rgba(0,229,168,.2); padding:3px 10px; border-radius:20px; }
  .globe-legend { display:flex; gap:14px; }
  .gl-item { display:flex; align-items:center; gap:5px; font-family:var(--ffm); font-size:9.5px; color:var(--text2); }
  .gl-dot { width:7px; height:7px; border-radius:50%; flex-shrink:0; }
  .globe-body { display:grid; grid-template-columns:1fr 270px; height:420px; }
  .globe-canvas-wrap { position:relative; overflow:hidden; background:#000; height:100%; min-height:300px; }
  .globe-canvas { display:block; cursor:grab; width:100%; height:100%; }
  .globe-canvas:active { cursor:grabbing; }
  #gtt { position:absolute; background:rgba(8,14,28,.95); border:1px solid var(--bb);
    border-radius:10px; padding:9px 13px; pointer-events:none; z-index:60;
    font-family:var(--ffm); font-size:10.5px; white-space:nowrap;
    box-shadow:0 8px 32px rgba(0,0,0,.6); backdrop-filter:blur(8px); display:none; }
  .gtt-name { color:var(--cyan); font-size:11.5px; font-weight:600; margin-bottom:2px; }
  .gtt-meta { color:var(--text2); font-size:9.5px; margin-bottom:5px; }
  .gtt-badge { font-size:8.5px; padding:2px 7px; border-radius:8px; display:inline-block; }
  .globe-panel { border-left:1px solid var(--border); display:flex; flex-direction:column; overflow:hidden; }
  .globe-panel-head { padding:10px 13px; border-bottom:1px solid var(--border);
    font-family:var(--ffm); font-size:9px; color:var(--text3);
    letter-spacing:.12em; text-transform:uppercase;
    display:flex; align-items:center; justify-content:space-between; }
  .globe-panel-filter { display:flex; gap:4px; }
  .gp-filter { font-family:var(--ffm); font-size:8px; padding:2px 7px;
    border-radius:5px; cursor:pointer; transition:all .18s;
    border:1px solid var(--border); color:var(--text3); background:none; }
  .gp-filter:hover,.gp-filter.active { background:rgba(0,245,255,.08); color:var(--cyan); border-color:rgba(0,245,255,.25); }
  .uni-list { flex:1; overflow-y:auto; padding:4px 0; }
  .uni-item { display:flex; align-items:center; gap:9px; padding:7px 11px;
    cursor:pointer; transition:all .18s; border-left:2px solid transparent; }
  .uni-item:hover { background:rgba(0,245,255,.04); border-left-color:rgba(0,245,255,.3); }
  .uni-item.lit { background:rgba(0,245,255,.07); border-left-color:var(--cyan); }
  .ui-dot { width:8px; height:8px; border-radius:50%; flex-shrink:0; }
  .ui-info { flex:1; min-width:0; }
  .ui-name { font-size:11.5px; font-weight:500; color:var(--text); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  .ui-sub { font-family:var(--ffm); font-size:9px; color:var(--text2); margin-top:1px; }
  .ui-flag { font-size:13px; flex-shrink:0; }

  /* TWO-COL */
  .two-col { display:grid; grid-template-columns:1fr 300px; gap:18px; animation:fadeUp .5s .12s ease both; }
  .card { background:var(--bg1); border:1px solid var(--border); border-radius:14px; overflow:hidden; position:relative; }
  .card-head { padding:13px 18px 12px; border-bottom:1px solid var(--border);
    display:flex; align-items:center; justify-content:space-between; }
  .card-title { font-family:var(--ffh); font-size:15px; font-weight:600;
    letter-spacing:.06em; color:#fff; display:flex; align-items:center; gap:7px; }
  .card-ico { font-size:13px; opacity:.8; }
  .card-action { font-family:var(--ffm); font-size:9.5px; color:var(--cyan); cursor:pointer;
    letter-spacing:.08em; text-transform:uppercase; transition:opacity .2s;
    text-decoration:none; background:none; border:none; }
  .card-action:hover { opacity:.65; }

  /* ROADMAP */
  .roadmap-wrap { padding:20px 18px; }
  .roadmap-steps { display:flex; align-items:flex-start; position:relative; }
  .roadmap-steps::before { content:''; position:absolute; top:19px; left:19px; right:19px;
    height:1px; background:linear-gradient(90deg,var(--cyan) 38%,var(--text3) 38%); }
  .rm-step { flex:1; display:flex; flex-direction:column; align-items:center; gap:9px; position:relative; z-index:1; }
  .rm-node { width:38px; height:38px; border-radius:50%; border:2px solid;
    display:flex; align-items:center; justify-content:center; font-size:15px;
    position:relative; transition:all .3s; cursor:pointer; }
  .rm-node:hover { transform:scale(1.1); }
  .rm-node.done { background:rgba(0,245,255,.1); border-color:var(--cyan); box-shadow:0 0 14px rgba(0,245,255,.3); }
  .rm-node.done .rm-chk { display:flex; }
  .rm-node.active { background:rgba(255,179,71,.09); border-color:var(--amber); animation:pulseAmber 2.2s ease-in-out infinite; }
  @keyframes pulseAmber { 0%,100%{box-shadow:0 0 10px rgba(255,179,71,.3)}50%{box-shadow:0 0 22px rgba(255,179,71,.55)} }
  .rm-node.pending { background:var(--bg2); border-color:var(--text3); }
  .rm-chk { display:none; width:19px; height:19px; border-radius:50%; background:var(--cyan);
    color:#040a15; font-size:10px; font-weight:700; align-items:center; justify-content:center; }
  .rm-label { font-family:var(--ffm); font-size:9px; text-align:center; letter-spacing:.05em; text-transform:uppercase; }
  .rm-label.done { color:var(--cyan); } .rm-label.active { color:var(--amber); } .rm-label.pending { color:var(--text3); }
  .rm-sub { font-size:10px; color:var(--text2); text-align:center; line-height:1.35; }

  /* MENTORS */
  .mentors-body { padding:4px 0; }
  .mentor-row { display:flex; align-items:center; gap:12px; padding:11px 18px;
    border-bottom:1px solid var(--border); cursor:pointer; transition:all .2s; position:relative; }
  .mentor-row:last-child { border-bottom:none; }
  .mentor-row::before { content:''; position:absolute; left:0; top:0; bottom:0;
    width:0; background:var(--cyan); transition:width .28s; }
  .mentor-row:hover { background:rgba(0,245,255,.025); }
  .mentor-row:hover::before { width:2px; }
  .m-av-wrap { position:relative; flex-shrink:0; }
  .m-av { width:42px; height:42px; border-radius:50%; overflow:hidden; border:2px solid var(--bh); }
  .m-av img { width:100%; height:100%; object-fit:cover; }
  .m-status { position:absolute; bottom:0; right:0; width:10px; height:10px;
    border-radius:50%; border:2px solid var(--bg1); box-shadow:0 0 6px currentColor; }
  .m-info { flex:1; min-width:0; }
  .m-name { font-family:var(--ffh); font-size:15px; font-weight:600; color:#fff; margin-bottom:1px; }
  .m-meta { font-size:11px; color:var(--text2); }
  .m-tags { display:flex; gap:4px; margin-top:5px; flex-wrap:wrap; }
  .m-tag { font-family:var(--ffm); font-size:8.5px; padding:2px 7px;
    border-radius:20px; border:1px solid; letter-spacing:.04em; }
  .m-right { display:flex; flex-direction:column; align-items:flex-end; gap:5px; }
  .m-ring-wrap { position:relative; width:42px; height:42px; }
  .m-ring-svg { width:42px; height:42px; transform:rotate(-90deg); }
  .m-ring-bg { fill:none; stroke:rgba(0,245,255,.07); stroke-width:3.5; }
  .m-ring-arc { fill:none; stroke-width:3.5; stroke-linecap:round; transition:stroke-dashoffset 1.2s ease; }
  .m-ring-num { position:absolute; inset:0; display:flex; align-items:center;
    justify-content:center; font-family:var(--ffh); font-size:12px; font-weight:700; }
  .m-book { font-family:var(--ffm); font-size:9px; color:var(--cyan);
    letter-spacing:.06em; text-transform:uppercase; opacity:0; transition:opacity .2s;
    text-decoration:none; }
  .mentor-row:hover .m-book { opacity:1; }

  /* TARGETS */
  .targets-body { padding:12px 14px; display:flex; flex-direction:column; gap:9px; }
  .target-item { background:var(--bg2); border:1px solid var(--border); border-radius:11px;
    padding:12px 13px; display:flex; align-items:center; gap:11px;
    cursor:pointer; transition:all .22s; position:relative; overflow:hidden; }
  .target-item::after { content:''; position:absolute; top:0; left:0; right:0;
    height:1px; background:linear-gradient(90deg,transparent,rgba(255,255,255,.06),transparent); }
  .target-item:hover { border-color:var(--bh); transform:translateX(2px); }
  .t-flag { font-size:19px; flex-shrink:0; }
  .t-info { flex:1; min-width:0; }
  .t-uni { font-family:var(--ffh); font-size:14px; font-weight:600; color:#fff; margin-bottom:1px; }
  .t-prog { font-size:11px; color:var(--text2); }
  .t-bar { margin-top:7px; height:2.5px; background:rgba(255,255,255,.06); border-radius:2px; overflow:hidden; }
  .t-fill { height:100%; border-radius:2px; transition:width 1.1s .6s ease; }
  .t-status { font-family:var(--ffm); font-size:9px; padding:3px 8px;
    border-radius:20px; border:1px solid; white-space:nowrap; flex-shrink:0; letter-spacing:.04em; }
  .s-prog { color:var(--amber); border-color:rgba(255,179,71,.28); background:rgba(255,179,71,.07); }
  .s-sub { color:var(--teal); border-color:rgba(0,229,168,.28); background:rgba(0,229,168,.07); }
  .s-q { color:var(--text3); border-color:var(--border); }
  .add-target { background:transparent; border:1px dashed var(--border); border-radius:10px;
    padding:10px; width:100%; display:flex; align-items:center; justify-content:center;
    gap:7px; font-family:var(--ffm); font-size:10.5px; color:var(--text3);
    cursor:pointer; transition:all .2s; letter-spacing:.06em; }
  .add-target:hover { border-color:rgba(0,245,255,.22); color:var(--cyan); background:rgba(0,245,255,.03); }

  /* QUICK ACTIONS */
  .actions-body { padding:12px; display:grid; grid-template-columns:1fr 1fr; gap:8px; }
  .action-btn { background:var(--bg2); border:1px solid var(--border); border-radius:10px;
    padding:12px 9px; display:flex; flex-direction:column; align-items:center;
    justify-content:center; gap:6px; cursor:pointer; transition:all .22s;
    text-align:center; text-decoration:none; }
  .action-btn:hover { border-color:var(--bh); background:var(--bg3); transform:translateY(-2px); }
  .action-ico { font-size:20px; }
  .action-lbl { font-family:var(--ffm); font-size:9.5px; color:var(--text2);
    letter-spacing:.05em; text-transform:uppercase; }

  /* LOGS */
  .logs-body { padding:12px 14px; font-family:var(--ffm); font-size:10.5px;
    overflow-y:auto; max-height:190px; }
  .log-row { display:flex; gap:7px; margin-bottom:8px; align-items:flex-start; line-height:1.5; }
  .log-t { color:var(--text3); flex-shrink:0; font-size:9.5px; min-width:30px; }
  .log-s { flex-shrink:0; }
  .log-msg { color:var(--text2); }
  .log-cursor { display:inline-block; width:6px; height:11px; background:var(--cyan);
    vertical-align:middle; margin-left:2px; animation:blink .9s step-end infinite; }
  @keyframes blink { 0%,100%{opacity:1}50%{opacity:0} }

  /* CORNER BRACKETS */
  .cbr,.ctl { position:absolute; width:14px; height:14px; pointer-events:none; }
  .ctl { top:6px; left:6px; border-top:1.5px solid rgba(0,245,255,.3); border-left:1.5px solid rgba(0,245,255,.3); }
  .cbr { bottom:6px; right:6px; border-bottom:1.5px solid rgba(0,245,255,.3); border-right:1.5px solid rgba(0,245,255,.3); }

  @keyframes fadeUp { from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)} }
`

export default function StudentDashboard() {
  const router = useRouter()

  const canvasRef          = useRef(null)
  const tooltipRef         = useRef(null)
  const ttNameRef          = useRef(null)
  const ttMetaRef          = useRef(null)
  const ttBadgeRef         = useRef(null)
  const spinGlobeRef       = useRef(null)

  const [mounted,       setMounted]       = useState(false)
  const [timeStr,       setTimeStr]       = useState('00:00:00')
  const [activeFilter,  setActiveFilter]  = useState('all')
  const [activeUni,     setActiveUni]     = useState(null)
  const [targetAdded,   setTargetAdded]   = useState(false)
  const [ringOffset,    setRingOffset]    = useState(100)
  const [mentorOffsets, setMentorOffsets] = useState({ 1: 107, 2: 107, 3: 107 })
  const [barWidths,     setBarWidths]     = useState({ 1: '0%', 2: '0%', 3: '0%' })

  useEffect(() => {
    setMounted(true)

    const tick = () => {
      const n = new Date()
      setTimeStr(
        String(n.getHours()).padStart(2,'0') + ':' +
        String(n.getMinutes()).padStart(2,'0') + ':' +
        String(n.getSeconds()).padStart(2,'0')
      )
    }
    tick()
    const clock = setInterval(tick, 1000)

    const animTimer = setTimeout(() => {
      setRingOffset(16)
      setMentorOffsets({ 1: 6, 2: 12, 3: 19 })
      setBarWidths({ 1: '60%', 2: '100%', 3: '8%' })
    }, 500)

    let isMounted = true;
    function loadThree() {
      if (window.THREE) {
          if (isMounted) initGlobe();
          return;
      }
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
      script.onload = () => {
          if (isMounted && window.THREE) initGlobe();
      };
      document.head.appendChild(script);
    }
    // Slight delay ensures the DOM container has its width/height calculated
    setTimeout(loadThree, 100);

    return () => {
      isMounted = false;
      clearInterval(clock)
      clearTimeout(animTimer)
      if (spinGlobeRef.current?.cleanup) {
          spinGlobeRef.current.cleanup();
      }
    }
  }, [])

  function initGlobe() {
    if (!canvasRef.current || !window.THREE) return
    const canvas = canvasRef.current
    const wrap   = canvas.parentElement
    const THREE  = window.THREE

    const scene    = new THREE.Scene()
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x000000, 0)

    let W = wrap.clientWidth, H = wrap.clientHeight || 420

    const camera = new THREE.PerspectiveCamera(45, W / H, 0.1, 1000)
    camera.position.set(0, 0, 2.8)

    const onResize = () => {
      W = wrap.clientWidth; H = wrap.clientHeight || 420
      renderer.setSize(W, H)
      camera.aspect = W / H
      camera.updateProjectionMatrix()
    }
    onResize()
    window.addEventListener('resize', onResize)

    const globe = new THREE.Group()
    scene.add(globe)

    const texLoader = new THREE.TextureLoader()
    texLoader.crossOrigin = 'Anonymous'
    const earthMat  = new THREE.MeshPhongMaterial({
      color:       0x050814,
      map:         texLoader.load('https://unpkg.com/three-globe/example/img/earth-dark.jpg'),
      bumpMap:     texLoader.load('https://unpkg.com/three-globe/example/img/earth-topology.png'),
      bumpScale:   0.012,
      specular:    new THREE.Color(0x00f5ff),
      specularMap: texLoader.load('https://unpkg.com/three-globe/example/img/earth-water.png'),
      shininess:   14,
    })
    globe.add(new THREE.Mesh(new THREE.SphereGeometry(1, 64, 64), earthMat))

    const mkShader = (front, fs, bs) => new THREE.ShaderMaterial({
      vertexShader: `varying vec3 vNormal;void main(){vNormal=normalize(normalMatrix*normal);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}`,
      fragmentShader: fs,
      side: bs || THREE.FrontSide,
      blending: THREE.AdditiveBlending, transparent: true,
    })

    globe.add(new THREE.Mesh(new THREE.SphereGeometry(1.06,64,64), mkShader(true,
      `varying vec3 vNormal;void main(){float i=pow(0.7-dot(vNormal,vec3(0,0,1.0)),2.0);gl_FragColor=vec4(0.0,0.96,1.0,i*0.55);}`)))
    globe.add(new THREE.Mesh(new THREE.SphereGeometry(1.025,64,64), mkShader(false,
      `varying vec3 vNormal;void main(){float i=pow(0.65-dot(vNormal,vec3(0,0,1.0)),3.0);gl_FragColor=vec4(0.05,0.7,1.0,i*0.3);}`,
      THREE.BackSide)))

    scene.add(new THREE.AmbientLight(0x111122, 0.8))
    const sun = new THREE.DirectionalLight(0xffffff, 1.1); sun.position.set(5,3,5); scene.add(sun)
    const rim = new THREE.DirectionalLight(0x00f5ff, 0.25); rim.position.set(-5,-2,-3); scene.add(rim)

    const ll2v = (lat, lng, r = 1) => {
      const phi   = (90 - lat) * Math.PI / 180
      const theta = (lng + 180) * Math.PI / 180
      return new THREE.Vector3(-r*Math.sin(phi)*Math.cos(theta), r*Math.cos(phi), r*Math.sin(phi)*Math.sin(theta))
    }

    const DOT_R = 0.014
    const dotMeshes = []

    UNIS.forEach(u => {
      const col = new THREE.Color(u.col)
      const mesh = new THREE.Mesh(new THREE.SphereGeometry(DOT_R,10,10), new THREE.MeshBasicMaterial({color:col}))
      const pos  = ll2v(u.lat, u.lng, 1.01)
      mesh.position.copy(pos)
      globe.add(mesh)
      const halo = new THREE.Mesh(new THREE.SphereGeometry(DOT_R*2.4,10,10),
        new THREE.MeshBasicMaterial({color:col, transparent:true, opacity:.15, side:THREE.BackSide}))
      halo.position.copy(pos)
      globe.add(halo)
      dotMeshes.push({ mesh, halo, uni: u, pos, col })
    })

    const hubPos = ll2v(HUB.lat, HUB.lng, 1.012)
    const hubMesh = new THREE.Mesh(new THREE.SphereGeometry(DOT_R*1.6,12,12),
      new THREE.MeshBasicMaterial({color:0x00E5A8}))
    hubMesh.position.copy(hubPos); globe.add(hubMesh)
    const hubRingMat = new THREE.MeshBasicMaterial({color:0x00E5A8, transparent:true, opacity:.1, side:THREE.BackSide})
    const hubRing = new THREE.Mesh(new THREE.SphereGeometry(DOT_R*4,12,12), hubRingMat)
    hubRing.position.copy(hubPos); globe.add(hubRing)

    const ARC_SEGS = 60
    const arcLines = UNIS.map((u, idx) => {
      const pts = []
      for (let i = 0; i <= ARC_SEGS; i++) {
        const t   = i / ARC_SEGS
        const lat = HUB.lat + (u.lat - HUB.lat) * t
        const lng = HUB.lng + (u.lng - HUB.lng) * t
        pts.push(ll2v(lat, lng, 1.02 + 0.14 * Math.sin(Math.PI * t)))
      }
      const mat = new THREE.LineBasicMaterial({ color: new THREE.Color(u.col),
        transparent: true, opacity: 0, linewidth: 1, blending: THREE.AdditiveBlending })
      const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), mat)
      globe.add(line)
      return { line, mat, phase: idx * (1 / UNIS.length), uni: u }
    })

    const starV = []
    for (let i = 0; i < 3000; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi   = Math.acos(2*Math.random()-1)
      const r     = 8 + Math.random() * 4
      starV.push(r*Math.sin(phi)*Math.cos(theta), r*Math.cos(phi), r*Math.sin(phi)*Math.sin(theta))
    }
    const starGeo = new THREE.BufferGeometry()
    starGeo.setAttribute('position', new THREE.Float32BufferAttribute(starV, 3))
    scene.add(new THREE.Points(starGeo,
      new THREE.PointsMaterial({color:0xffffff, size:.022, transparent:true, opacity:.55})))

    const raycaster = new THREE.Raycaster()
    raycaster.params.Points.threshold = 0.05
    const pointer = new THREE.Vector2()
    let hoveredDot = null

    canvas.addEventListener('mousemove', e => {
      const rect = canvas.getBoundingClientRect()
      pointer.x =  ((e.clientX - rect.left) / W) * 2 - 1
      pointer.y = -((e.clientY - rect.top)  / H) * 2 + 1
      raycaster.setFromCamera(pointer, camera)
      const hits = raycaster.intersectObjects(dotMeshes.map(d => d.mesh))
      if (hits.length && tooltipRef.current) {
        const d = dotMeshes.find(x => x.mesh === hits[0].object)
        if (d) {
          hoveredDot = d
          const u = d.uni
          ttNameRef.current.textContent  = u.n
          ttMetaRef.current.textContent  = `${u.f} ${u.c}`
          ttBadgeRef.current.textContent = u.t
          const tCol = u.t==='Private'?'#fbbf24':u.t==='Research'?'#a78bfa':'#38bdf8'
          ttBadgeRef.current.style.cssText = `color:${tCol};background:${tCol}18;border:1px solid ${tCol}55;font-size:8.5px;padding:2px 7px;border-radius:8px;display:inline-block;`
          tooltipRef.current.style.display = 'block'
          tooltipRef.current.style.left = `${e.clientX - rect.left + 14}px`
          tooltipRef.current.style.top  = `${e.clientY - rect.top  - 10}px`
          setActiveUni(u.n)
        }
      } else {
        hoveredDot = null
        if (tooltipRef.current) tooltipRef.current.style.display = 'none'
        setActiveUni(null)
      }
    })
    canvas.addEventListener('mouseleave', () => {
      if (tooltipRef.current) tooltipRef.current.style.display = 'none'
    })

    let isDrag = false, lx = 0, ly = 0, velX = 0, velY = 0, autoRot = true

    canvas.addEventListener('mousedown', e => {
      isDrag = true; autoRot = false; lx = e.clientX; ly = e.clientY; velX = velY = 0
    })
    window.addEventListener('mouseup', () => {
      isDrag = false
      setTimeout(() => { autoRot = true }, 2500)
    })
    window.addEventListener('mousemove', e => {
      if (!isDrag) return
      const dx = e.clientX - lx, dy = e.clientY - ly
      globe.rotation.y += dx * 0.005
      globe.rotation.x  = Math.max(-1.2, Math.min(1.2, globe.rotation.x + dy * 0.005))
      velX = dx * 0.005; velY = dy * 0.005; lx = e.clientX; ly = e.clientY
    })

    let animationId;
    let t = 0;
    const animate = () => {
      animationId = requestAnimationFrame(animate); t += 0.016
      if (autoRot) globe.rotation.y += 0.0028
      else { globe.rotation.y += velX*0.92; globe.rotation.x += velY*0.92; velX*=0.88; velY*=0.88 }
      arcLines.forEach(a => {
        const p = ((t*0.22 + a.phase) % 1)
        a.mat.opacity = Math.max(0, Math.min(0.55, Math.sin(p*Math.PI)*0.55))
      })
      hubRingMat.opacity = 0.08 + 0.07*Math.sin(t*2.5)
      hubRing.scale.setScalar(1 + 0.12*Math.sin(t*2))
      dotMeshes.forEach(d => {
        const sc = d === hoveredDot ? 1.9 : 1.0
        d.mesh.scale.lerp(new THREE.Vector3(sc,sc,sc), 0.14)
        d.halo.material.opacity = d===hoveredDot ? 0.35 : 0.12+0.06*Math.abs(Math.sin(t*1.5+d.pos.x))
      })
      renderer.render(scene, camera)
    }
    animate()

    spinGlobeRef.current = {
      spin: (lat, lng) => {
        autoRot = false
        const t = ll2v(lat, lng)
        globe.rotation.y = -Math.atan2(-t.x, -t.z)
        globe.rotation.x = Math.asin(t.y) * -0.55
        setTimeout(() => { autoRot = true }, 3000)
      },
      cleanup: () => {
        cancelAnimationFrame(animationId)
        renderer.dispose()
        scene.clear()
      }
    }
  }

  const filteredUnis = activeFilter === 'all' ? UNIS : UNIS.filter(u => u.t === activeFilter)

  if (!mounted) return null

  return (
    <div className="student-dash-wrapper">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <div className="bg-ambient"/>
      <div className="hex-grid"/>
      <div className="scanlines"/>
      <div className="sweep"/>

      {/* ── SIDEBAR ── */}
      <aside className="sidebar">
        <div className="sb-logo">
          <div className="sb-logo-mark">
            <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
              <path d="M9 2L16 9L9 16L2 9Z" fill="currentColor"/>
            </svg>
          </div>
          <span className="sb-logo-text">Mentor<em>Bridge</em></span>
        </div>

        <div className="sb-search">
          <div className="sb-search-inner">
            <span style={{color:'var(--text3)',fontSize:'11px'}}>⌕</span>
            <input placeholder="Query intelligence database…" readOnly/>
          </div>
        </div>

        <nav className="sb-nav">
          <div className="sb-section">Operations</div>
          <Link href="/dashboard/student" className="sb-item active"><span className="sb-item-ico">⬡</span> Command Center</Link>
          <Link href="/mentors" className="sb-item"><span className="sb-item-ico">◈</span> Network (Mentors) <span className="sb-item-badge">15</span></Link>
          <Link href="/dashboard/student/sop" className="sb-item"><span className="sb-item-ico">✍️</span> SOP Builder</Link>

          <div className="sb-section">Intelligence</div>
          <Link href="/career-paths" className="sb-item"><span className="sb-item-ico">◉</span> Career Paths</Link>
          {/* 👉 NEW SIMULATORS ADDED HERE */}
          <Link href="/what-if" className="sb-item"><span className="sb-item-ico">🔮</span> What-If Engine <span className="sb-item-badge">NEW</span></Link>
          <Link href="/visa-simulator" className="sb-item"><span className="sb-item-ico">🛂</span> Visa Simulator</Link>
          <Link href="/funding" className="sb-item"><span className="sb-item-ico">💰</span> Funding Engine</Link>
          <Link href='/career-compass' className="sb-item"><span className="sb-item-ico">🧭</span> Career Compass</Link>
          <Link href='/policy-intelligence' className="sb-item"><span className="sb-item-ico">📰</span> Policy Intelligence</Link>
          <Link href='/first-90-days' className="sb-item"><span className="sb-item-ico">📅</span> First 90 Days</Link>
          <Link href='/country-intelligence' className="sb-item"><span className="sb-item-ico">🌍</span> Country Intelligence</Link>
          <Link href='/funding' className="sb-item"><span className="sb-item-ico">💰</span> Funding Engine</Link>
          
          <div className="sb-section">System</div>
          <Link href="/dashboard/student/settings" className="sb-item"><span className="sb-item-ico">⚙</span> Settings & Vault</Link>
        </nav>

        <div className="sb-user">
          <div className="sb-av">S<div className="sb-av-dot"/></div>
          <div>
            <div className="sb-user-name">Saif Sanadi</div>
            <div className="sb-user-rank">▲ OPERATIVE LEVEL 1</div>
          </div>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <main className="main">
        <div className="topbar">
          <div className="topbar-left">
            <div className="topbar-crumb">
              DASHBOARD <em>/</em> STUDENT <em>/</em> <em>COMMAND CENTER</em>
            </div>
            <div className="topbar-live"><div className="live-dot"/> SYSTEM ONLINE</div>
          </div>
          <div className="topbar-right">
            <div className="topbar-time">{timeStr}</div>
            <div className="topbar-ico">📊</div>
            <div className="topbar-ico">
              🔔<div className="notif-badge"/>
            </div>
            <button
              className="topbar-ico"
              onClick={() => router.push('/dashboard/student/settings')}
              style={{border:'none',background:'var(--bg2)'}}
            >
              ⚙
            </button>
          </div>
        </div>

        <div className="content">

          {/* ── COMPACT HERO ── */}
          <div className="hero">
            <div className="ctl"/><div className="cbr"/>
            
            {/* 👉 COMPACT HERO CORNER TEXT */}
            <div className="hero-corner">OPERATIVE PROFILE</div>

            <div className="hero-main">
              <div className="hero-status"><div className="live-dot"/> SYSTEM ONLINE · TARGET: GERMANY</div>
              
              {/* 👉 REDUCED HERO TITLE SIZE */}
              <div className="hero-title">WELCOME BACK, <em>SAIF.</em></div>
              
              <div className="hero-sub">
                Profile active. Destination: <b>Germany</b> → MS Computer Science.
                Next milestone: <b>University Shortlisting</b> — 3 targets queued.
              </div>
            </div>

            <div className="hero-stats">
              <div className="ring-stat">
                <div className="ring-wrap">
                  <svg className="ring-svg" viewBox="0 0 40 40">
                    <circle className="ring-bg" cx="20" cy="20" r="16"/>
                    <circle className="ring-fill" cx="20" cy="20" r="16"
                      style={{ strokeDashoffset: ringOffset }}/>
                  </svg>
                  <div className="ring-val">
                    <div className="ring-num">84</div>
                    <div className="ring-pct">%</div>
                  </div>
                </div>
                <div className="ring-label">Profile<br/>Readiness</div>
              </div>
              <div className="num-stat">
                <div className="num-val" style={{color:'var(--amber)'}}>2</div>
                <div className="num-label">Active<br/>Missions</div>
                <div className="num-sub">↑ 1 this week</div>
              </div>
              <div className="num-stat">
                <div className="num-val" style={{color:'var(--teal)'}}>3</div>
                <div className="num-label">Sessions<br/>Done</div>
                <div className="num-sub">Next: Monday</div>
              </div>
              <div className="num-stat">
                <div className="num-val" style={{color:'var(--violet)'}}>47</div>
                <div className="num-label">Days to<br/>Deadline</div>
                <div className="num-sub">TU Munich</div>
              </div>
              <div className="num-stat">
                <div className="num-val" style={{color:'var(--sky)'}}>56</div>
                <div className="num-label">Partner<br/>Unis</div>
                <div className="num-sub">Worldwide</div>
              </div>
            </div>
          </div>

          {/* ── GLOBE ── */}
          <div className="globe-card">
            <div className="globe-head">
              <div className="globe-title">
                <span className="globe-title-ico">🌐</span> PARTNER UNIVERSITY NETWORK
              </div>
              <div className="globe-meta-row">
                <div className="globe-count"><div className="live-dot"/> 56 Universities · 14 Countries</div>
                <div className="globe-legend">
                  <div className="gl-item"><div className="gl-dot" style={{background:'#38bdf8'}}/> Public</div>
                  <div className="gl-item"><div className="gl-dot" style={{background:'#fbbf24'}}/> Private</div>
                  <div className="gl-item"><div className="gl-dot" style={{background:'#a78bfa'}}/> Research</div>
                </div>
              </div>
            </div>
            <div className="globe-body">
              <div className="globe-canvas-wrap">
                <canvas className="globe-canvas" ref={canvasRef}/>
                <div id="gtt" ref={tooltipRef}>
                  <div className="gtt-name"  ref={ttNameRef}/>
                  <div className="gtt-meta"  ref={ttMetaRef}/>
                  <div className="gtt-badge" ref={ttBadgeRef}/>
                </div>
              </div>
              <div className="globe-panel">
                <div className="globe-panel-head">
                  INSTITUTIONS
                  <div className="globe-panel-filter">
                    {['all','Public','Private','Research'].map(f => (
                      <button
                        key={f}
                        className={`gp-filter${activeFilter===f?' active':''}`}
                        onClick={() => setActiveFilter(f)}
                      >
                        {f==='all'?'All':f}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="uni-list">
                  {filteredUnis.map(u => (
                    <div
                      key={u.n}
                      className={`uni-item${activeUni===u.n?' lit':''}`}
                      onClick={() => {
                        setActiveUni(u.n)
                        spinGlobeRef.current?.spin(u.lat, u.lng)
                      }}
                    >
                      <div className="ui-dot" style={{background:u.col}}/>
                      <div className="ui-info">
                        <div className="ui-name">{u.n}</div>
                        <div className="ui-sub">{u.t}</div>
                      </div>
                      <div className="ui-flag">{u.f}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ── TWO COL ── */}
          <div className="two-col">
            <div style={{display:'flex',flexDirection:'column',gap:'18px'}}>

              {/* ROADMAP */}
              <div className="card">
                <div className="card-head">
                  <div className="card-title"><span className="card-ico">⬡</span> MISSION ROADMAP</div>
                  <Link href="/roadmap" className="card-action">VIEW FULL TRACK →</Link>
                </div>
                <div className="roadmap-wrap">
                  <div className="roadmap-steps">
                    {[
                      { status:'done',    label:'Profile Eval', sub:'Complete'    },
                      { status:'done',    label:'APS Cert',     sub:'Cleared'     },
                      { status:'active',  label:'Shortlist',    sub:'In Progress' },
                      { status:'pending', label:'SOP & LOR',    sub:'Locked'      },
                      { status:'pending', label:'Apply',        sub:'Locked'      },
                      { status:'pending', label:'Visa ✈️',      sub:'Locked'      },
                    ].map((step, i) => (
                      <div className="rm-step" key={i}>
                        <div className={`rm-node ${step.status}`}>
                          {step.status==='done'
                            ? <div className="rm-chk">✓</div>
                            : step.status==='active'
                            ? <span style={{fontSize:14}}>⊙</span>
                            : <span style={{fontSize:14,opacity:.35}}>◎</span>}
                        </div>
                        <div className={`rm-label ${step.status}`}>{step.label}</div>
                        <div className="rm-sub">{step.sub}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* MENTORS */}
              <div className="card">
                <div className="card-head">
                  <div className="card-title"><span className="card-ico">◈</span> AI-VERIFIED HANDLERS</div>
                  <Link href="/mentors" className="card-action">VIEW DIRECTORY →</Link>
                </div>
                <div className="mentors-body">
                  {[
                    { name:'Aarav Mehta',    sub:'MS CS @ TU Munich',     img:'https://randomuser.me/api/portraits/men/11.jpg',  status:'var(--teal)',   match:94, arc:'var(--cyan)',   ringOff: mentorOffsets[1], tags:[{l:'Germany',c:'#4FC3F7'},{l:'Public Unis',c:'var(--violet)'},{l:'DAAD Scholar',c:'var(--teal)'}]},
                    { name:'Siddharth Jain', sub:'MS Mech @ RWTH Aachen', img:'https://randomuser.me/api/portraits/men/41.jpg',  status:'var(--teal)',   match:88, arc:'var(--teal)',   ringOff: mentorOffsets[2], tags:[{l:'Germany',c:'#4FC3F7'},{l:'APS Expert',c:'var(--amber)'}]},
                    { name:'Rohan Patel',    sub:'MS CS @ Trinity Dublin', img:'https://randomuser.me/api/portraits/men/86.jpg',  status:'var(--amber)',  match:82, arc:'var(--violet)', ringOff: mentorOffsets[3], tags:[{l:'Ireland',c:'#60A0FF'},{l:'EU Jobs',c:'var(--violet)'}]},
                  ].map((m, i) => (
                    <div className="mentor-row" key={i}>
                      <div className="m-av-wrap">
                        <div className="m-av"><img src={m.img} alt={m.name}/></div>
                        <div className="m-status" style={{background:m.status,color:m.status}}/>
                      </div>
                      <div className="m-info">
                        <div className="m-name">{m.name}</div>
                        <div className="m-meta">{m.sub}</div>
                        <div className="m-tags">
                          {m.tags.map((tg,j) => (
                            <span key={j} className="m-tag" style={{color:tg.c,borderColor:`${tg.c}40`,background:`${tg.c}0f`}}>
                              {tg.l}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="m-right">
                        <div className="m-ring-wrap">
                          <svg className="m-ring-svg" viewBox="0 0 42 42">
                            <circle className="m-ring-bg" cx="21" cy="21" r="17"/>
                            <circle className="m-ring-arc" cx="21" cy="21" r="17"
                              stroke={m.arc} strokeDasharray="107" strokeDashoffset={m.ringOff}
                              filter={`drop-shadow(0 0 3px ${m.arc})`}/>
                          </svg>
                          <div className="m-ring-num" style={{color:m.arc}}>{m.match}</div>
                        </div>
                        <Link href="/mentors" className="m-book">BOOK →</Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div style={{display:'flex',flexDirection:'column',gap:'18px'}}>

              {/* TARGETS */}
              <div className="card">
                <div className="card-head">
                  <div className="card-title"><span className="card-ico">◎</span> TARGETS</div>
                  <span className="card-action">EDIT →</span>
                </div>
                <div className="targets-body">
                  {[
                    { flag:'🇩🇪', uni:'TU Munich',   prog:'MS Computer Science', w: barWidths[1], bg:'linear-gradient(90deg,var(--amber),rgba(255,179,71,.4))', bc:'rgba(255,179,71,.2)', status:'IN PROG',   sc:'s-prog' },
                    { flag:'🇩🇪', uni:'RWTH Aachen', prog:'MS Data Science',      w: barWidths[2], bg:'linear-gradient(90deg,var(--teal),rgba(0,229,168,.4))',   bc:'rgba(0,229,168,.2)',  status:'SUBMITTED', sc:'s-sub' },
                    { flag:'🇩🇪', uni:'TU Berlin',   prog:'MS Software Eng.',     w: barWidths[3], bg:'var(--text3)',                                           bc:'var(--border)',       status:'QUEUED',    sc:'s-q' },
                  ].map((t, i) => (
                    <div className="target-item" key={i} style={{borderColor:t.bc}}>
                      <div className="t-flag">{t.flag}</div>
                      <div className="t-info">
                        <div className="t-uni">{t.uni}</div>
                        <div className="t-prog">{t.prog}</div>
                        <div className="t-bar">
                          <div className="t-fill" style={{width:t.w,background:t.bg}}/>
                        </div>
                      </div>
                      <div className={`t-status ${t.sc}`}>{t.status}</div>
                    </div>
                  ))}
                  <button
                    className="add-target"
                    style={targetAdded?{color:'var(--teal)',borderColor:'rgba(0,229,168,.25)'}:{}}
                    onClick={() => setTargetAdded(true)}
                  >
                    {targetAdded ? '+ TARGET ADDED ✓' : '+ ADD TARGET UNIVERSITY'}
                  </button>
                </div>
              </div>

              {/* 👉 NEW QUICK ACTIONS WITH SIMULATORS */}
              <div className="card">
                <div className="card-head">
                  <div className="card-title"><span className="card-ico">⚡</span> QUICK ACTIONS</div>
                </div>
                <div className="actions-body">
                  <Link href="/mentors" className="action-btn"
                    style={{border:'1px solid rgba(0,245,255,.2)',background:'rgba(0,245,255,.03)'}}>
                    <div className="action-ico">📅</div>
                    <div className="action-lbl" style={{color:'var(--cyan)'}}>Book Session</div>
                  </Link>
                  <Link href="/dashboard/student/sop" className="action-btn">
                    <div className="action-ico">📄</div>
                    <div className="action-lbl" style={{color:'var(--teal)'}}>Build SOP</div>
                  </Link>
                  <Link href="/what-if" className="action-btn">
                    <div className="action-ico">🔮</div>
                    <div className="action-lbl" style={{color:'var(--amber)'}}>What-If Engine</div>
                  </Link>
                  <Link href="/visa-simulator" className="action-btn">
                    <div className="action-ico">🛂</div>
                    <div className="action-lbl" style={{color:'var(--violet)'}}>Visa Sim</div>
                  </Link>
                </div>
              </div>

              {/* SYSTEM LOGS */}
              <div className="card">
                <div className="card-head">
                  <div className="card-title">
                    <span className="card-ico" style={{color:'var(--teal)'}}>■</span> SYSTEM LOGS
                  </div>
                  <span className="card-action">CLEAR</span>
                </div>
                <div className="logs-body">
                  {INIT_LOGS.map((log, i) => (
                    <div className="log-row" key={i}>
                      <span className="log-t">{log.t}</span>
                      <span className="log-s" style={{color:log.col}}>›</span>
                      <span className="log-msg">
                        {log.msg}
                        {log.detail && (
                          <> — <span style={{color:log.detailCol}}>{log.detail}</span></>
                        )}
                        {log.cursor && <span className="log-cursor"/>}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      </main>
    </div>
  )
}