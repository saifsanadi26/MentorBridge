'use client'

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Triangle, LogOut } from 'lucide-react';

// ════════════════════════════════════════════════════════════════════════════════
// 1. DATA CONSTANTS
// ════════════════════════════════════════════════════════════════════════════════
const MENTEES = [
  {n:'Kaif Malik',    dest:'TU Munich → CS',    score:94, img:'https://randomuser.me/api/portraits/men/45.jpg',  status:'online', prog:60},
  {n:'Priya Sharma',   dest:'RWTH → Data Sci',   score:88, img:'https://randomuser.me/api/portraits/women/55.jpg',status:'online', prog:45},
  {n:'Arjun Nair',     dest:'TU Berlin → CS',    score:82, img:'https://randomuser.me/api/portraits/men/32.jpg',  status:'away',   prog:30},
  {n:'Riya Mehta',     dest:'KIT → Mech Eng',    score:79, img:'https://randomuser.me/api/portraits/women/24.jpg',status:'offline',prog:20},
  {n:'Vikram Kumar',   dest:'TU Dresden → AI',   score:76, img:'https://randomuser.me/api/portraits/men/66.jpg',  status:'online', prog:15},
  {n:'Ananya Iyer',    dest:'LMU → CS',          score:91, img:'https://randomuser.me/api/portraits/women/31.jpg',status:'online', prog:70},
  {n:'Dev Patel',      dest:'Heidelberg → Data', score:85, img:'https://randomuser.me/api/portraits/men/22.jpg',  status:'away',   prog:55},
  {n:'Sneha Banerjee', dest:'Stuttgart → Cyber', score:87, img:'https://randomuser.me/api/portraits/women/65.jpg',status:'online', prog:40},
  {n:'Rahul Joshi',    dest:'FAU → EE',          score:73, img:'https://randomuser.me/api/portraits/men/54.jpg',  status:'offline',prog:10},
  {n:'Meera Reddy',    dest:'TU Munich → AI',    score:90, img:'https://randomuser.me/api/portraits/women/88.jpg',status:'online', prog:65},
  {n:'Kabir Singh',    dest:'RWTH → Mech',       score:81, img:'https://randomuser.me/api/portraits/men/33.jpg',  status:'away',   prog:35},
  {n:'Ishaan Das',     dest:'TU Berlin → Soft',  score:83, img:'https://randomuser.me/api/portraits/men/77.jpg',  status:'online', prog:50},
  {n:'Tanvi Gupta',    dest:'KIT → CS',          score:86, img:'https://randomuser.me/api/portraits/women/62.jpg',status:'online', prog:45},
  {n:'Nikhil Verma',   dest:'Freiburg → BioInf', score:78, img:'https://randomuser.me/api/portraits/men/91.jpg',  status:'offline',prog:25},
];

const INITIAL_REQUESTS = [
  {id: 1, n:'Neha Agarwal', msg:'Hi, I am targeting TU Munich CS. Can you review my SOP?', img:'https://randomuser.me/api/portraits/women/41.jpg', time:'2h ago'},
  {id: 2, n:'Karan Malhotra',msg:'Need help with DAAD scholarship motivation letter urgently.', img:'https://randomuser.me/api/portraits/men/57.jpg', time:'4h ago'},
];

const SESSIONS = [
  {n:'Saif Sanadi',   dest:'TU Munich', img:'https://randomuser.me/api/portraits/men/45.jpg',   day:'Monday',   hrs:'07:00–07:30', countdown:'2 days'},
  {n:'Priya Sharma',  dest:'RWTH', img:'https://randomuser.me/api/portraits/women/55.jpg',        day:'Tuesday',  hrs:'18:00–18:30', countdown:'3 days'},
  {n:'Ananya Iyer',   dest:'LMU Munich', img:'https://randomuser.me/api/portraits/women/31.jpg', day:'Thursday', hrs:'09:00–10:00', countdown:'5 days'},
];

const LEDGER = [
  {n:'Saif Sanadi',   img:'https://randomuser.me/api/portraits/men/45.jpg',   type:'Session',   amt:'+₹1,600', date:'22 Feb',  status:'ls-paid', slbl:'PAID'},
  {n:'Priya Sharma',  img:'https://randomuser.me/api/portraits/women/55.jpg', type:'Session',   amt:'+₹1,600', date:'21 Feb',  status:'ls-paid', slbl:'PAID'},
  {n:'Ananya Iyer',   img:'https://randomuser.me/api/portraits/women/31.jpg', type:'Session',   amt:'+₹2,000', date:'20 Feb',  status:'ls-paid', slbl:'PAID'},
  {n:'MentorBridge',  img:'', type:'Platform Fee', amt:'-₹320', date:'20 Feb',  status:'ls-paid', slbl:'DEDUCTED'},
  {n:'Neha Agarwal',  img:'https://randomuser.me/api/portraits/women/41.jpg', type:'Booking',   amt:'+₹2,000', date:'Pending', status:'ls-pend', slbl:'PENDING'},
  {n:'Bank Transfer', img:'', type:'Withdrawal',   amt:'-₹18,000',date:'15 Feb', status:'ls-proc', slbl:'PROCESSED'},
  {n:'Dev Patel',     img:'https://randomuser.me/api/portraits/men/22.jpg',   type:'Session',   amt:'+₹1,600', date:'14 Feb',  status:'ls-paid', slbl:'PAID'},
  {n:'Meera Reddy',   img:'https://randomuser.me/api/portraits/women/88.jpg', type:'Session',   amt:'+₹2,400', date:'13 Feb',  status:'ls-paid', slbl:'PAID'},
];

const THREADS = [
  {n:'Saif Sanadi',  img:'https://randomuser.me/api/portraits/men/45.jpg',   preview:'That makes sense! I will start with the APS appointment...', time:'10m', unread:true},
  {n:'Priya Sharma', img:'https://randomuser.me/api/portraits/women/55.jpg', preview:'Can we reschedule Tuesday to Wednesday same time?', time:'1h', unread:true},
  {n:'Ananya Iyer',  img:'https://randomuser.me/api/portraits/women/31.jpg', preview:'Thank you for the SOP feedback, revising now.', time:'3h', unread:false},
  {n:'Dev Patel',    img:'https://randomuser.me/api/portraits/men/22.jpg',   preview:'My APS certificate arrived! What is next?', time:'1d', unread:true},
  {n:'Meera Reddy',  img:'https://randomuser.me/api/portraits/women/88.jpg', preview:'Got the TU Munich admission! Thank you so much!', time:'2d', unread:false},
];

const MESSAGES_DB = {
  'Saif Sanadi':[
    {id:1, type:'recv',text:'Hi Aarav, I booked the session for Monday. I have questions about the APS process.',time:'10:30'},
    {id:2, type:'sent',text:'Great timing! APS usually takes 10-12 weeks so we need to start immediately. Do you have all your translated documents ready?',time:'10:32'},
    {id:3, type:'recv',text:'I have my 10th and 12th certificates but still waiting for my semester marksheets to be translated.',time:'10:35'},
    {id:4, type:'sent',text:'Get those translations done this week — use a certified translator. Meanwhile I will share the exact document checklist for APS Delhi.',time:'10:37'},
    {id:5, type:'recv',text:'That makes sense! I will start with the APS appointment booking today.',time:'10:41'},
  ]
};

const CHART_DATA = {
  '7d':{labels:['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],earnings:[1600,3200,0,1600,2000,0,1600],sessions:[1,2,0,1,1,0,1]},
  '1m':{labels:['W1','W2','W3','W4'],earnings:[6400,8000,4800,9600],sessions:[4,5,3,6]},
  '3m':{labels:['Dec','Jan','Feb'],earnings:[18400,21600,24800],sessions:[11,14,16]},
};
const CHART_TOTALS = {'7d':'₹10,000','1m':'₹28,800','3m':'₹64,800'};

// ════════════════════════════════════════════════════════════════════════════════
// 2. CSS STYLES (Fixed layout stretching)
// ════════════════════════════════════════════════════════════════════════════════
const styles = `
  .mentor-dash-root {
    --bg:#03060E;--bg1:#060B18;--bg2:#090F1F;--bg3:#0D1628;--bg4:#111E35;
    --cyan:#00F5FF;--cyan2:#00C8D4;--teal:#00E5A8;--amber:#F59E0B;
    --purple:#A855F7;--rose:#FB4D6D;--sky:#38BDF8;--green:#22D3A0;
    --b:rgba(0,245,255,.07);--bh:rgba(0,245,255,.18);--bb:rgba(0,245,255,.4);
    --t:#BDD0EE;--t2:#4A6080;--t3:#1C2C44;
    --ffh:'Bebas Neue',sans-serif;
    --ffb:'Syne',sans-serif;
    --ffm:'DM Mono',monospace;
    --sb:245px;
    height: 100vh; background: var(--bg); font-family: var(--ffb); color: var(--t);
    -webkit-font-smoothing: antialiased; overflow: hidden; display: flex; position: relative;
  }
  .mentor-dash-root * { box-sizing: border-box; }
  .mentor-dash-root a { text-decoration: none; color: inherit; }
  .mentor-dash-root ::-webkit-scrollbar { width: 3px; background: transparent; }
  .mentor-dash-root ::-webkit-scrollbar-thumb { background: rgba(0,245,255,.1); border-radius: 3px; }

  /* AMBIENT */
  .amb { position:absolute; inset:0; z-index:0; pointer-events:none;
    background: radial-gradient(ellipse 70% 50% at 70% 10%, rgba(0,245,255,.03), transparent 60%),
                radial-gradient(ellipse 55% 55% at 5% 90%, rgba(168,85,247,.035), transparent 55%),
                radial-gradient(ellipse 40% 40% at 95% 70%, rgba(0,229,168,.025), transparent 55%); }
  .hex-bg { position:absolute; inset:0; z-index:0; pointer-events:none; opacity:.018;
    background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='104'%3E%3Cpolygon points='30,2 58,17 58,47 30,62 2,47 2,17' fill='none' stroke='%2300F5FF' stroke-width='.8'/%3E%3Cpolygon points='30,54 58,69 58,99 30,114 2,99 2,69' fill='none' stroke='%2300F5FF' stroke-width='.8'/%3E%3C/svg%3E"); }
  .scan { position:absolute; inset:0; z-index:1; pointer-events:none;
    background:repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,.035) 2px,rgba(0,0,0,.035) 4px);
    animation:scanMove 18s linear infinite; }
  @keyframes scanMove { 100%{background-position:0 200px} }
  .sweep { position:absolute; top:0; left:0; right:0; z-index:1; pointer-events:none; height:1.5px;
    background:linear-gradient(90deg,transparent,var(--cyan),transparent);
    opacity:.14; animation:sweep 16s ease-in-out infinite; }
  @keyframes sweep { 0%{transform:translateY(-5px);opacity:0} 8%{opacity:.22} 92%{opacity:.22} 100%{transform:translateY(100vh);opacity:0} }

  /* SIDEBAR */
  .sb { width:var(--sb); height:100vh; background:#040810; border-right:1px solid var(--b); display:flex; flex-direction:column; position:relative; z-index:200; flex-shrink:0; }
  .sb::before { content:''; position:absolute; top:0; left:0; right:0; height:1px; background:linear-gradient(90deg,var(--cyan),transparent); opacity:.3; }
  .sb-logo { padding:18px 18px 14px; border-bottom:1px solid var(--b); display:flex; align-items:center; gap:10px; }
  .sb-logo-icon { width:34px; height:34px; border-radius:9px; flex-shrink:0; background:linear-gradient(135deg,rgba(0,245,255,.15),rgba(168,85,247,.12)); border:1.5px solid rgba(0,245,255,.35); display:flex; align-items:center; justify-content:center; color:#000; box-shadow:0 0 20px rgba(0,245,255,.2),inset 0 0 10px rgba(0,245,255,.05); animation:logoGlow 4s ease-in-out infinite; }
  @keyframes logoGlow { 0%,100%{box-shadow:0 0 18px rgba(0,245,255,.2)} 50%{box-shadow:0 0 32px rgba(0,245,255,.45)} }
  .sb-logo-text { font-family:var(--ffh); font-size:18px; letter-spacing:.08em; color:#fff; }
  .sb-logo-text em { font-style:normal; color:var(--cyan); }
  .sb-status { padding:10px 16px; background:rgba(0,229,168,.04); border-bottom:1px solid var(--b); display:flex; align-items:center; gap:8px; font-family:var(--ffm); font-size:.65rem; color:var(--teal); letter-spacing:.06em; }
  .sb-status-dot { width:6px; height:6px; border-radius:50%; background:var(--teal); box-shadow:0 0 8px var(--teal); animation:pulse 2s ease-in-out infinite; flex-shrink:0; }
  @keyframes pulse { 0%,100%{box-shadow:0 0 5px var(--teal)} 50%{box-shadow:0 0 14px var(--teal)} }
  .sb-status span { margin-left:auto; color:var(--t3); font-size:.6rem; }
  .sb-nav { flex:1; padding:8px 0; overflow-y:auto; }
  .sb-sect { padding:12px 18px 4px; font-family:var(--ffm); font-size:.6rem; letter-spacing:.2em; text-transform:uppercase; color:var(--t3); }
  .sb-item { display:flex; align-items:center; gap:10px; padding:9px 18px; font-size:.87rem; font-weight:500; color:var(--t2); cursor:pointer; transition:all .18s; border-left:2.5px solid transparent; position:relative; white-space:nowrap; }
  .sb-item:hover { color:var(--t); background:rgba(0,245,255,.028); border-left-color:rgba(0,245,255,.2); }
  .sb-item.active { color:var(--cyan); background:rgba(0,245,255,.055); border-left-color:var(--cyan); }
  .sb-item.active::after { content:''; position:absolute; right:0; top:15%; bottom:15%; width:1px; background:var(--cyan); opacity:.4; }
  .sb-ico { font-size:13px; width:18px; text-align:center; flex-shrink:0; }
  .sb-badge { margin-left:auto; font-family:var(--ffm); font-size:.58rem; padding:1.5px 6px; border-radius:8px; font-weight:500; }
  .badge-cyan { background:rgba(0,245,255,.1); color:var(--cyan); border:1px solid rgba(0,245,255,.2); }
  .badge-rose { background:rgba(251,77,109,.1); color:var(--rose); border:1px solid rgba(251,77,109,.2); animation:badgeBlink 2s ease-in-out infinite; }
  @keyframes badgeBlink { 0%,100%{opacity:1} 50%{opacity:.55} }
  .sb-user { padding:12px 14px; border-top:1px solid var(--b); display:flex; align-items:center; gap:10px; position:relative; }
  .sb-user::before { content:''; position:absolute; top:0; left:14px; right:14px; height:1px; background:linear-gradient(90deg,rgba(0,245,255,.2),transparent); }
  .sb-av { width:36px; height:36px; border-radius:50%; border:2px solid rgba(0,245,255,.35); overflow:hidden; flex-shrink:0; position:relative; }
  .sb-av img { width:100%; height:100%; object-fit:cover; }
  .sb-av-ring { position:absolute; inset:-3px; border-radius:50%; border:1px solid rgba(0,245,255,.2); animation:avSpin 8s linear infinite; }
  @keyframes avSpin { 100%{transform:rotate(360deg)} }
  .sb-uname { font-family:var(--ffh); font-size:14.5px; letter-spacing:.04em; color:#fff; margin-bottom:1px; }
  .sb-urole { font-family:var(--ffm); font-size:.6rem; color:var(--teal); letter-spacing:.06em; }
  .sb-uico { margin-left:auto; cursor:pointer; color:var(--t3); transition: color 0.2s; display: flex; align-items: center;}
  .sb-uico:hover { color: var(--rose); }

  /* MAIN AREA */
  .main { flex:1; height:100vh; overflow-y:auto; overflow-x:hidden; position:relative; z-index:2; display:flex; flex-direction:column; }
  .topbar { height:54px; background:rgba(4,8,18,.92); backdrop-filter:blur(24px); border-bottom:1px solid var(--b); padding:0 28px; display:flex; align-items:center; gap:14px; position:sticky; top:0; z-index:150; flex-shrink:0; }
  .tb-breadcrumb { font-family:var(--ffm); font-size:.68rem; color:var(--t3); display:flex; align-items:center; gap:6px; letter-spacing:.06em; }
  .tb-bc-sep { color:rgba(0,245,255,.25); }
  .tb-bc-cur { color:var(--cyan); text-transform: uppercase; }
  .tb-spacer { flex:1; }
  .tb-time { font-family:var(--ffm); font-size:.75rem; color:var(--t2); background:var(--bg2); border:1px solid var(--b); padding:4px 12px; border-radius:6px; letter-spacing:.08em; }
  .tb-btn { width:34px; height:34px; background:var(--bg2); border:1px solid var(--b); border-radius:8px; display:flex; align-items:center; justify-content:center; cursor:pointer; transition:all .2s; font-size:13px; position:relative; }
  .tb-btn:hover { border-color:var(--bh); background:var(--bg3); }
  .tb-notif-badge { position:absolute; top:-3px; right:-3px; width:8px; height:8px; border-radius:50%; background:var(--rose); border:1.5px solid var(--bg); animation:badgeBlink 1.5s infinite; }
  .tb-live { display:flex; align-items:center; gap:6px; font-family:var(--ffm); font-size:.65rem; color:var(--teal); background:rgba(0,229,168,.06); border:1px solid rgba(0,229,168,.18); padding:4px 11px; border-radius:20px; }
  .live-dot { width:5px; height:5px; border-radius:50%; background:var(--teal); box-shadow:0 0 7px var(--teal); animation:pulse 1.8s infinite; flex-shrink:0; }

  /* NOTIFICATION PANEL */
  .notif-panel { position:fixed; top:62px; right:28px; width:360px; background:rgba(6,11,24,.97); backdrop-filter:blur(28px); border:1px solid rgba(0,245,255,.15); border-radius:14px; z-index:500; overflow:hidden; box-shadow:0 24px 60px rgba(0,0,0,.7),0 0 0 1px rgba(0,245,255,.05); display: none;}
  .notif-panel.show { display:block; animation:panelIn .22s ease; }
  @keyframes panelIn { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }
  .np-head { padding:14px 16px; border-bottom:1px solid var(--b); display:flex; align-items:center; justify-content:space-between; }
  .np-title { font-family:var(--ffh); font-size:1.1rem; letter-spacing:.06em; color:#fff; }
  .np-clear { font-family:var(--ffm); font-size:.62rem; color:var(--cyan); cursor:pointer; letter-spacing:.06em; opacity:.7; }
  .np-clear:hover { opacity:1; }
  .np-list { max-height:340px; overflow-y:auto; }

  /* CONTENT AREA */
  .content { padding:22px 26px 40px; display:flex; flex-direction:column; gap:20px; flex:1; }
  .section { display: none; animation: fadeIn 0.4s ease; }
  .section.active { display: block; }

  /* HERO (FIXED: Added flex bounds, fit-content, and removed massive padding) */
  .hero { 
    background:linear-gradient(135deg,rgba(0,245,255,.04),rgba(168,85,247,.03)); 
    border:1px solid var(--b); border-radius:18px; 
    padding:24px 28px; position:relative; overflow:hidden; 
    display:flex; gap:24px; align-items:center; /* Changed from stretch to center */
    animation:fadeUp .45s ease both; 
    
    /* THE FIX FOR MASSIVE STRETCHING */
    flex: 0 0 auto;
    height: fit-content !important;
    min-height: 0;
  }
  .hero::before { content:''; position:absolute; left:0; top:0; bottom:0; width:3px; background:linear-gradient(180deg,var(--cyan),var(--teal) 50%,var(--purple)); }
  .hero::after { content:''; position:absolute; inset:0; pointer-events:none; background:radial-gradient(ellipse 50% 100% at 0% 50%,rgba(0,245,255,.04),transparent 60%); }
  .hero-corner-tag { position:absolute; top:14px; right:22px; font-family:var(--ffm); font-size:.62rem; color:var(--t3); letter-spacing:.14em; text-transform:uppercase; display:flex; align-items:center; gap:8px; }
  .hero-corner-tag::before { content:''; width:30px; height:1px; background:linear-gradient(90deg,transparent,var(--t3)); }
  .hero-av-zone { position:relative; flex-shrink:0; }
  .hero-av { width:72px; height:72px; border-radius:50%; border:2.5px solid rgba(0,245,255,.4); overflow:hidden; box-shadow:0 0 28px rgba(0,245,255,.2); }
  .hero-av img { width:100%; height:100%; object-fit:cover; }
  .hero-av-online { position:absolute; bottom:2px; right:2px; width:14px; height:14px; border-radius:50%; background:var(--teal); border:2px solid var(--bg1); box-shadow:0 0 10px var(--teal); }
  .hero-main { flex:1; }
  .hero-sup { font-family:var(--ffm); font-size:.65rem; color:var(--teal); letter-spacing:.14em; text-transform:uppercase; margin-bottom:6px; display:flex; align-items:center; gap:8px; }
  .hero-sup::before { content:'⊛'; color:var(--teal); }
  .hero-name { font-family:var(--ffh); font-size:clamp(32px,3vw,48px); letter-spacing:.04em; color:#fff; line-height:1; margin-bottom:8px; text-transform: uppercase;}
  .hero-name em { font-style:normal; color:var(--cyan); }
  .hero-meta { font-size:.85rem; color:var(--t2); display:flex; align-items:center; gap:14px; flex-wrap:wrap; }
  .hero-meta-item { display:flex; align-items:center; gap:5px; }
  .hero-meta-item span { font-family:var(--ffm); font-size:.65rem; }
  .hero-kpis { display:flex; gap:12px; flex-shrink:0; align-items:center; }
  .kpi { background:var(--bg2); border:1px solid var(--b); border-radius:13px; padding:14px 17px; text-align:center; min-width:88px; transition:all .25s; cursor:default; position:relative; overflow:hidden; }
  .kpi:hover { border-color:var(--bh); transform:translateY(-2px); }
  .kpi::after { content:''; position:absolute; bottom:0; left:0; right:0; height:1.5px; }
  .kpi:nth-child(1)::after { background:linear-gradient(90deg,transparent,var(--cyan),transparent); }
  .kpi:nth-child(2)::after { background:linear-gradient(90deg,transparent,var(--teal),transparent); }
  .kpi:nth-child(3)::after { background:linear-gradient(90deg,transparent,var(--amber),transparent); }
  .kpi:nth-child(4)::after { background:linear-gradient(90deg,transparent,var(--purple),transparent); }
  .kpi-val { font-family:var(--ffh); font-size:1.7rem; letter-spacing:.04em; line-height:1; margin-bottom:3px; }
  .kpi-lbl { font-family:var(--ffm); font-size:.6rem; color:var(--t2); letter-spacing:.08em; text-transform:uppercase; line-height:1.4; }
  .kpi-delta { font-family:var(--ffm); font-size:.62rem; margin-top:3px; }
  .kpi-delta.up { color:var(--teal); } .kpi-delta.dn { color:var(--rose); }

  /* GRIDS & CARDS */
  .grid-2 { display:grid; grid-template-columns:1fr 380px; gap:20px; animation:fadeUp .45s .06s ease both; }
  .grid-3 { display:grid; grid-template-columns:1fr 1fr 1fr; gap:20px; animation:fadeUp .45s .12s ease both; }
  .card { background:var(--bg1); border:1px solid var(--b); border-radius:14px; overflow:hidden; position:relative; }
  .card-head { padding:14px 18px 13px; border-bottom:1px solid var(--b); display:flex; align-items:center; gap:8px; justify-content:space-between; }
  .card-title { font-family:var(--ffh); font-size:1.05rem; letter-spacing:.07em; color:#fff; display:flex; align-items:center; gap:8px; }
  .card-title-ico { font-size:13px; opacity:.8; }
  .card-action { font-family:var(--ffm); font-size:.62rem; color:var(--cyan); cursor:pointer; letter-spacing:.07em; text-transform:uppercase; transition:opacity .2s; display:flex; align-items:center; gap:4px; }
  .card-action:hover { opacity:.65; }
  .card-tabs { display:flex; gap:2px; background:var(--bg); border-radius:8px; padding:3px; }
  .tab-btn { font-family:var(--ffm); font-size:.62rem; padding:4px 12px; border-radius:6px; cursor:pointer; transition:all .18s; color:var(--t3); letter-spacing:.05em; }
  .tab-btn.active { background:rgba(0,245,255,.1); color:var(--cyan); border:1px solid rgba(0,245,255,.18); }

  /* SESSIONS */
  .sessions-list { padding:4px 0; }
  .session-row { padding:13px 18px; border-bottom:1px solid var(--b); display:flex; align-items:center; gap:13px; position:relative; transition:background .18s; cursor:pointer; }
  .session-row:last-child { border-bottom:none; }
  .session-row::before { content:''; position:absolute; left:0; top:0; bottom:0; width:0; background:var(--cyan); transition:width .25s; }
  .session-row:hover { background:rgba(0,245,255,.025); }
  .session-row:hover::before { width:2.5px; }
  .session-av { width:40px; height:40px; border-radius:50%; overflow:hidden; flex-shrink:0; border:2px solid var(--bh); }
  .session-av img { width:100%; height:100%; object-fit:cover; }
  .session-info { flex:1; min-width:0; }
  .session-name { font-family:var(--ffh); font-size:1rem; letter-spacing:.03em; color:#fff; margin-bottom:1px; }
  .session-meta { font-family:var(--ffm); font-size:.67rem; color:var(--t2); display:flex; align-items:center; gap:8px; flex-wrap:wrap; }
  .session-meta .tag { font-size:.6rem; padding:1px 6px; border-radius:4px; background:rgba(0,229,168,.08); border:1px solid rgba(0,229,168,.2); color:var(--teal); }
  .session-time { display:flex; flex-direction:column; align-items:flex-end; gap:5px; flex-shrink:0; }
  .session-day { font-family:var(--ffm); font-size:.7rem; color:var(--t2); letter-spacing:.04em; }
  .session-hrs { font-family:var(--ffh); font-size:.9rem; letter-spacing:.04em; color:#fff; }
  .session-launch { padding:7px 14px; border-radius:8px; border:none; background:linear-gradient(135deg,var(--cyan),var(--teal)); color:#020a12; font-family:var(--ffb); font-size:.72rem; font-weight:800; cursor:pointer; transition:all .2s; letter-spacing:.02em; white-space:nowrap; }
  .session-launch:hover { transform:scale(1.04); box-shadow:0 8px 22px rgba(0,245,255,.3); }
  .session-countdown { font-family:var(--ffm); font-size:.6rem; padding:3px 8px; border-radius:5px; background:rgba(0,245,255,.08); border:1px solid rgba(0,245,255,.18); color:var(--cyan); letter-spacing:.04em; }
  .meet-link-row { display:flex; align-items:center; gap:8px; padding:9px 18px; background:rgba(0,245,255,.03); border-top:1px solid var(--b); }
  .meet-link-url { font-family:var(--ffm); font-size:.65rem; color:var(--t2); flex:1; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  .meet-link-copy { font-family:var(--ffm); font-size:.6rem; color:var(--cyan); cursor:pointer; padding:3px 8px; border-radius:5px; border:1px solid rgba(0,245,255,.18); transition:background .15s; flex-shrink:0; }
  .meet-link-copy:hover { background:rgba(0,245,255,.1); }

  /* CHART */
  .chart-wrap { padding:16px 18px 12px; position:relative; }
  .chart-meta { display:flex; align-items:flex-start; justify-content:space-between; margin-bottom:14px; }
  .chart-total { font-family:var(--ffh); font-size:2.4rem; letter-spacing:.04em; color:var(--teal); line-height:1; }
  .chart-sub { font-family:var(--ffm); font-size:.65rem; color:var(--t2); margin-top:3px; }
  .chart-badge { font-family:var(--ffm); font-size:.65rem; padding:4px 10px; border-radius:8px; background:rgba(0,229,168,.08); border:1px solid rgba(0,229,168,.2); color:var(--teal); }
  .chart-legend { display:flex; gap:12px; margin-bottom:10px; }
  .cl-item { display:flex; align-items:center; gap:5px; font-family:var(--ffm); font-size:.63rem; color:var(--t2); }
  .cl-dot { width:7px; height:7px; border-radius:50%; flex-shrink:0; }
  canvas#earningsChart { width:100%; display:block; cursor:crosshair; }
  .chart-tooltip { position:absolute; background:rgba(6,11,24,.95); border:1px solid var(--bb); border-radius:9px; padding:8px 12px; pointer-events:none; font-family:var(--ffm); font-size:.68rem; white-space:nowrap; box-shadow:0 8px 28px rgba(0,0,0,.5); z-index: 50;}
  .chart-tooltip-date { color:var(--t2); margin-bottom:4px; }
  .chart-tooltip-val { color:var(--teal); font-size:.8rem; font-weight:600; }
  .chart-tooltip-sess { color:var(--cyan); font-size:.65rem; margin-top:2px; }

  /* ROSTER PREVIEW */
  .roster-body { padding:4px 0; }
  .roster-row { padding:10px 16px; border-bottom:1px solid var(--b); display:flex; align-items:center; gap:11px; cursor:pointer; transition:all .18s; position:relative; }
  .roster-row:last-child { border-bottom:none; }
  .roster-row:hover { background:rgba(0,245,255,.025); }
  .roster-av { width:36px; height:36px; border-radius:50%; overflow:hidden; border:1.5px solid var(--b); flex-shrink:0; }
  .roster-av img { width:100%; height:100%; object-fit:cover; }
  .roster-info { flex:1; min-width:0; }
  .roster-name { font-size:.85rem; font-weight:600; color:#fff; margin-bottom:1px; }
  .roster-dest { font-family:var(--ffm); font-size:.63rem; color:var(--t2); }
  .roster-score-wrap { display:flex; flex-direction:column; align-items:flex-end; gap:3px; }
  .roster-score { font-family:var(--ffh); font-size:1.1rem; letter-spacing:.04em; }
  .roster-prog { width:60px; height:3px; background:var(--t3); border-radius:2px; overflow:hidden; }
  .roster-prog-fill { height:100%; border-radius:2px; }
  .roster-status-dot { width:7px; height:7px; border-radius:50%; flex-shrink:0; }

  /* PENDING REQUESTS */
  .dossier-body { padding:8px 0; }
  .dossier-empty { padding:28px 18px; text-align:center; font-family:var(--ffm); font-size:.72rem; color:var(--t3); letter-spacing:.08em; }
  .dossier-item { padding:12px 16px; border-bottom:1px solid var(--b); display:flex; gap:11px; align-items:flex-start; transition:background .15s; }
  .dossier-item:last-child { border-bottom:none; }
  .dossier-item:hover { background:rgba(0,245,255,.025); }
  .dossier-av { width:36px; height:36px; border-radius:50%; overflow:hidden; border:1.5px solid var(--bh); flex-shrink:0; }
  .dossier-av img { width:100%; height:100%; object-fit:cover; }
  .dossier-info { flex:1; min-width:0; }
  .dossier-name { font-size:.83rem; font-weight:600; color:#fff; margin-bottom:2px; }
  .dossier-msg { font-family:var(--ffm); font-size:.67rem; color:var(--t2); line-height:1.45; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:180px; }
  .dossier-actions { display:flex; gap:6px; margin-top:7px; }
  .d-btn { font-family:var(--ffm); font-size:.6rem; padding:4px 10px; border-radius:6px; cursor:pointer; border:1px solid; letter-spacing:.04em; transition:all .15s; }
  .d-btn.accept { background:rgba(0,229,168,.08); color:var(--teal); border-color:rgba(0,229,168,.22); }
  .d-btn.accept:hover { background:rgba(0,229,168,.16); }
  .d-btn.decline { background:none; color:var(--t2); border-color:var(--b); }
  .d-btn.decline:hover { color:var(--rose); border-color:rgba(251,77,109,.2); }
  .dossier-time { font-family:var(--ffm); font-size:.6rem; color:var(--t3); white-space:nowrap; flex-shrink:0; }

  /* SMARTMATCH SCORE */
  .smartmatch-body { padding:16px 18px; }
  .sm-score-main { display:flex; align-items:center; gap:18px; margin-bottom:14px; }
  .sm-ring { position:relative; width:80px; height:80px; flex-shrink:0; }
  .sm-ring svg { width:80px; height:80px; transform:rotate(-90deg); }
  .sm-ring .track { fill:none; stroke:rgba(0,245,255,.07); stroke-width:6; }
  .sm-ring .fill { fill:none; stroke:url(#sm-grad); stroke-width:6; stroke-linecap:round; stroke-dasharray:220; stroke-dashoffset:220; animation:smFill 1.6s .5s ease forwards; }
  @keyframes smFill { to{stroke-dashoffset:33} }
  .sm-ring-val { position:absolute; inset:0; display:flex; flex-direction:column; align-items:center; justify-content:center; }
  .sm-ring-num { font-family:var(--ffh); font-size:1.45rem; color:var(--cyan); letter-spacing:.04em; line-height:1; }
  .sm-ring-pct { font-family:var(--ffm); font-size:.55rem; color:var(--t2); }
  .sm-text h3 { font-family:var(--ffh); font-size:1.1rem; color:#fff; letter-spacing:.04em; margin-bottom:3px; }
  .sm-text p { font-family:var(--ffm); font-size:.67rem; color:var(--t2); line-height:1.5; }
  .sm-bars { display:flex; flex-direction:column; gap:8px; }
  .sm-bar-row { display:flex; align-items:center; gap:10px; font-family:var(--ffm); font-size:.65rem; color:var(--t2); }
  .sm-bar-label { min-width:80px; }
  .sm-bar-track { flex:1; height:4px; background:var(--t3); border-radius:2px; overflow:hidden; }
  .sm-bar-fill { height:100%; border-radius:2px; animation:barFill 1.4s ease both; }
  @keyframes barFill { from{width:0!important} }
  .sm-bar-val { min-width:28px; text-align:right; color:var(--t); }

  /* LOGS */
  .logs-body { padding:10px 14px; font-family:var(--ffm); font-size:.68rem; overflow-y:auto; max-height:200px; }
  .log-row { display:flex; gap:8px; margin-bottom:9px; align-items:flex-start; line-height:1.55; }
  .log-t { color:var(--t3); flex-shrink:0; min-width:36px; font-size:.62rem; padding-top:1px; }
  .log-icon { flex-shrink:0; font-size:.75rem; }
  .log-text { color:var(--t2); flex:1; }
  .log-text b { color:var(--cyan); font-weight:500; }
  .log-text .ok { color:var(--teal); }
  .log-cur { display:inline-block; width:6px; height:11px; background:var(--cyan); vertical-align:middle; margin-left:2px; animation:blink .85s step-end infinite; }
  @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }

  /* COMMS */
  .comms-layout { display:grid; grid-template-columns:240px 1fr; height:calc(100vh - 180px); gap:0; }
  .comms-threads { border-right:1px solid var(--b); overflow-y:auto; }
  .thread-item { padding:12px 14px; border-bottom:1px solid var(--b); cursor:pointer; transition:background .15s; display:flex; gap:10px; align-items:flex-start; position:relative; }
  .thread-item:hover { background:rgba(0,245,255,.025); }
  .thread-item.active { background:rgba(0,245,255,.05); border-left:2px solid var(--cyan); }
  .thread-item.unread::after { content:''; position:absolute; top:14px; right:12px; width:7px; height:7px; border-radius:50%; background:var(--cyan); box-shadow:0 0 8px var(--cyan); }
  .thread-av { width:34px; height:34px; border-radius:50%; overflow:hidden; border:1.5px solid var(--b); flex-shrink:0; }
  .thread-av img { width:100%; height:100%; object-fit:cover; }
  .thread-name { font-size:.82rem; font-weight:600; color:#fff; margin-bottom:2px; }
  .thread-preview { font-family:var(--ffm); font-size:.63rem; color:var(--t2); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:145px; }
  .thread-time { font-family:var(--ffm); font-size:.58rem; color:var(--t3); }
  .comms-main { display:flex; flex-direction:column; overflow:hidden; }
  .comms-tbar { padding:13px 18px; border-bottom:1px solid var(--b); display:flex; align-items:center; gap:12px; }
  .comms-tbar-av { width:36px; height:36px; border-radius:50%; overflow:hidden; border:1.5px solid var(--bh); }
  .comms-tbar-av img { width:100%; height:100%; object-fit:cover; }
  .comms-tbar-info { flex:1; }
  .comms-tbar-name { font-family:var(--ffh); font-size:1rem; color:#fff; letter-spacing:.04em; }
  .comms-tbar-status { font-family:var(--ffm); font-size:.62rem; color:var(--teal); display:flex; align-items:center; gap:5px; }
  .comms-tbar-actions { display:flex; gap:8px; }
  .comms-tbar-btn { width:32px; height:32px; background:var(--bg2); border:1px solid var(--b); border-radius:8px; display:flex; align-items:center; justify-content:center; font-size:12px; cursor:pointer; transition:all .15s; }
  .comms-tbar-btn:hover { border-color:var(--bh); }
  .comms-msgs { flex:1; overflow-y:auto; padding:16px 18px; display:flex; flex-direction:column; gap:12px; }
  .msg { display:flex; gap:9px; align-items:flex-end; max-width:75%; }
  .msg.sent { align-self:flex-end; flex-direction:row-reverse; }
  .msg-av { width:28px; height:28px; border-radius:50%; overflow:hidden; flex-shrink:0; border:1.5px solid var(--b); }
  .msg-av img { width:100%; height:100%; object-fit:cover; }
  .msg-bubble { padding:10px 14px; border-radius:12px; font-size:.82rem; line-height:1.55; max-width:100%; }
  .msg.recv .msg-bubble { background:var(--bg3); border:1px solid var(--b); color:var(--t); border-bottom-left-radius:3px; }
  .msg.sent .msg-bubble { background:linear-gradient(135deg,rgba(0,245,255,.1),rgba(0,229,168,.08)); border:1px solid rgba(0,245,255,.2); color:#fff; border-bottom-right-radius:3px; }
  .msg-time { font-family:var(--ffm); font-size:.58rem; color:var(--t3); margin-bottom:2px; flex-shrink:0; align-self:flex-end; }
  .comms-input-area { padding:14px 18px; border-top:1px solid var(--b); display:flex; gap:10px; align-items:flex-end; }
  .comms-input { flex:1; background:var(--bg2); border:1px solid var(--b); border-radius:11px; padding:11px 14px; font-family:var(--ffb); font-size:.85rem; color:#fff; outline:none; resize:none; min-height:42px; max-height:120px; transition:border-color .2s; line-height:1.5; }
  .comms-input:focus { border-color:rgba(0,245,255,.28); }
  .comms-input::placeholder { color:var(--t3); }
  .comms-send { width:42px; height:42px; border-radius:10px; border:none; flex-shrink:0; background:linear-gradient(135deg,var(--cyan),var(--teal)); color:#020a12; cursor:pointer; font-size:16px; transition:all .2s; display:flex; align-items:center; justify-content:center; }
  .comms-send:hover { transform:scale(1.06); box-shadow:0 6px 18px rgba(0,245,255,.3); }

  /* FINANCIAL LEDGER */
  .finance-stats { display:grid; grid-template-columns:repeat(4,1fr); gap:14px; margin-bottom:20px; }
  .fin-stat { background:var(--bg1); border:1px solid var(--b); border-radius:13px; padding:16px 14px; position:relative; overflow:hidden; }
  .fin-stat::after { content:''; position:absolute; bottom:0; left:0; right:0; height:1.5px; }
  .fin-stat:nth-child(1)::after { background:linear-gradient(90deg,transparent,var(--teal),transparent); }
  .fin-stat:nth-child(2)::after { background:linear-gradient(90deg,transparent,var(--cyan),transparent); }
  .fin-stat:nth-child(3)::after { background:linear-gradient(90deg,transparent,var(--amber),transparent); }
  .fin-stat:nth-child(4)::after { background:linear-gradient(90deg,transparent,var(--purple),transparent); }
  .fin-stat-val { font-family:var(--ffh); font-size:1.9rem; letter-spacing:.04em; line-height:1; margin-bottom:4px; }
  .fin-stat-lbl { font-family:var(--ffm); font-size:.62rem; color:var(--t2); letter-spacing:.08em; text-transform:uppercase; }
  .fin-stat-sub { font-family:var(--ffm); font-size:.62rem; margin-top:4px; }
  .ledger-table { background:var(--bg1); border:1px solid var(--b); border-radius:14px; overflow:hidden; }
  .ledger-head-row { display:grid; grid-template-columns:2fr 1.2fr 1fr 1fr .8fr; gap:0; padding:10px 18px; background:var(--bg2); border-bottom:1px solid var(--b); font-family:var(--ffm); font-size:.62rem; color:var(--t3); letter-spacing:.1em; text-transform:uppercase; }
  .ledger-row { display:grid; grid-template-columns:2fr 1.2fr 1fr 1fr .8fr; gap:0; padding:12px 18px; border-bottom:1px solid var(--b); cursor:pointer; transition:background .15s; align-items:center; }
  .ledger-row:last-child { border-bottom:none; }
  .ledger-row:hover { background:rgba(0,245,255,.025); }
  .ledger-row-name { display:flex; align-items:center; gap:9px; }
  .lr-av { width:28px; height:28px; border-radius:50%; overflow:hidden; border:1px solid var(--b); flex-shrink:0; }
  .lr-av img { width:100%; height:100%; object-fit:cover; }
  .lr-info-name { font-size:.82rem; font-weight:600; color:#fff; }
  .lr-info-date { font-family:var(--ffm); font-size:.62rem; color:var(--t2); }
  .ledger-cell { font-family:var(--ffm); font-size:.72rem; color:var(--t); }
  .ledger-cell.amount { color:var(--teal); font-size:.8rem; font-weight:500; }
  .ledger-cell.amount.out { color:var(--rose); }
  .ledger-status { font-family:var(--ffm); font-size:.6rem; padding:3px 9px; border-radius:6px; border:1px solid; white-space:nowrap; display:inline-block; }
  .ls-paid { color:var(--teal); border-color:rgba(0,229,168,.25); background:rgba(0,229,168,.07); }
  .ls-pend { color:var(--amber); border-color:rgba(245,158,11,.25); background:rgba(245,158,11,.07); }
  .ls-proc { color:var(--cyan); border-color:rgba(0,245,255,.25); background:rgba(0,245,255,.07); }

  /* SCHEDULE */
  .schedule-layout { display:grid; grid-template-columns:1fr 320px; gap:20px; }
  .calendar-card { background:var(--bg1); border:1px solid var(--b); border-radius:14px; overflow:hidden; }
  .cal-head { padding:14px 18px; border-bottom:1px solid var(--b); display:flex; align-items:center; justify-content:space-between; }
  .cal-month { font-family:var(--ffh); font-size:1.2rem; letter-spacing:.06em; color:#fff; }
  .cal-nav { display:flex; gap:6px; }
  .cal-nav-btn { width:28px; height:28px; background:var(--bg2); border:1px solid var(--b); border-radius:6px; cursor:pointer; transition:all .15s; font-size:11px; display:flex; align-items:center; justify-content:center; color:var(--t2); }
  .cal-nav-btn:hover { border-color:var(--bh); color:var(--t); }
  .cal-grid { padding:14px 16px; }
  .cal-days { display:grid; grid-template-columns:repeat(7,1fr); gap:4px; margin-bottom:6px; }
  .cal-day-label { text-align:center; font-family:var(--ffm); font-size:.6rem; color:var(--t3); padding:4px; letter-spacing:.05em; }
  .cal-cell { aspect-ratio:1; display:flex; align-items:center; justify-content:center; border-radius:7px; font-family:var(--ffm); font-size:.72rem; color:var(--t2); cursor:pointer; transition:all .18s; position:relative; }
  .cal-cell:hover { background:rgba(0,245,255,.07); color:var(--t); }
  .cal-cell.today { background:rgba(0,245,255,.1); border:1px solid rgba(0,245,255,.3); color:var(--cyan); }
  .cal-cell.has-session::after { content:''; position:absolute; bottom:3px; left:50%; transform:translateX(-50%); width:4px; height:4px; border-radius:50%; background:var(--teal); }
  .cal-cell.sel { background:rgba(0,245,255,.15); border:1px solid var(--cyan); color:#fff; }
  .cal-cell.other-month { opacity:.28; }
  .slots-card { background:var(--bg1); border:1px solid var(--b); border-radius:14px; overflow:hidden; }
  .slots-list { padding:8px 0; }
  .slot-item { padding:11px 16px; border-bottom:1px solid var(--b); display:flex; align-items:center; gap:12px; cursor:pointer; transition:background .15s; }
  .slot-item:last-child { border-bottom:none; }
  .slot-item:hover { background:rgba(0,245,255,.025); }
  .slot-time-block { text-align:center; min-width:65px; }
  .slot-time-val { font-family:var(--ffh); font-size:.95rem; color:var(--cyan); letter-spacing:.04em; }
  .slot-time-dur { font-family:var(--ffm); font-size:.6rem; color:var(--t3); }
  .slot-info { flex:1; }
  .slot-name { font-size:.82rem; font-weight:600; color:#fff; margin-bottom:1px; }
  .slot-dest { font-family:var(--ffm); font-size:.63rem; color:var(--t2); }
  .slot-open { font-family:var(--ffm); font-size:.63rem; color:var(--t3); font-style:italic; }
  .slot-badge { font-family:var(--ffm); font-size:.6rem; padding:3px 8px; border-radius:5px; border:1px solid; white-space:nowrap; }
  .sb-booked { color:var(--cyan); border-color:rgba(0,245,255,.2); background:rgba(0,245,255,.07); }
  .sb-open { color:var(--t3); border-color:var(--b); background:none; }

  /* PROFILE SETUP */
  .profile-layout { display:grid; grid-template-columns:340px 1fr; gap:20px; }
  .profile-card { background:var(--bg1); border:1px solid var(--b); border-radius:14px; overflow:hidden; }
  .profile-cover { height:90px; background:linear-gradient(135deg,rgba(0,245,255,.08),rgba(168,85,247,.07)); position:relative; overflow:hidden; }
  .profile-cover::after { content:''; position:absolute; inset:0; background:repeating-linear-gradient(45deg,transparent,transparent 12px,rgba(0,245,255,.02) 12px,rgba(0,245,255,.02) 13px); }
  .profile-av-area { padding:0 18px; position:relative; margin-top:-28px; margin-bottom:14px; display:flex; align-items:flex-end; gap:12px; }
  .profile-av-big { width:56px; height:56px; border-radius:50%; border:2.5px solid rgba(0,245,255,.4); overflow:hidden; box-shadow:0 0 22px rgba(0,245,255,.2); flex-shrink:0; }
  .profile-av-big img { width:100%; height:100%; object-fit:cover; }
  .profile-info-name { font-family:var(--ffh); font-size:1.35rem; letter-spacing:.04em; color:#fff; }
  .profile-info-role { font-family:var(--ffm); font-size:.65rem; color:var(--teal); letter-spacing:.06em; }
  .profile-body { padding:0 18px 18px; }
  .profile-field { margin-bottom:12px; }
  .profile-field-label { font-family:var(--ffm); font-size:.62rem; color:var(--t3); letter-spacing:.1em; text-transform:uppercase; margin-bottom:5px; }
  .profile-field-val { font-size:.85rem; color:var(--t); }
  .profile-tag-list { display:flex; gap:6px; flex-wrap:wrap; }
  .profile-tag { padding:4px 10px; border-radius:6px; font-family:var(--ffm); font-size:.65rem; background:rgba(0,245,255,.06); border:1px solid rgba(0,245,255,.15); color:var(--cyan); letter-spacing:.04em; }
  .profile-edit-btn { width:100%; padding:10px; border-radius:9px; border:1px solid var(--bh); background:rgba(0,245,255,.05); color:var(--cyan); font-family:var(--ffb); font-size:.82rem; font-weight:700; cursor:pointer; transition:all .2s; letter-spacing:.02em; }
  .profile-edit-btn:hover { background:rgba(0,245,255,.1); }
  .stats-grid { display:grid; grid-template-columns:1fr 1fr; gap:12px; }
  .stats-card { background:var(--bg1); border:1px solid var(--b); border-radius:13px; padding:16px; position:relative; overflow:hidden; }
  .stats-card::after { content:''; position:absolute; bottom:0; left:0; right:0; height:1.5px; background:linear-gradient(90deg,transparent,var(--cyan),transparent); }

  /* DECORATIONS */
  .ctl { position:absolute; top:6px; left:6px; width:12px; height:12px; border-top:1.5px solid rgba(0,245,255,.25); border-left:1.5px solid rgba(0,245,255,.25); }
  .cbr { position:absolute; bottom:6px; right:6px; width:12px; height:12px; border-bottom:1.5px solid rgba(0,245,255,.25); border-right:1.5px solid rgba(0,245,255,.25); }
  @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
  @keyframes fadeIn { from{opacity:0} to{opacity:1} }
  .au0 { animation:fadeUp .45s .0s ease both; }
  .au1 { animation:fadeUp .45s .06s ease both; }
  .au2 { animation:fadeUp .45s .12s ease both; }
`;

// ════════════════════════════════════════════════════════════════════════════════
// 3. REACT COMPONENT
// ════════════════════════════════════════════════════════════════════════════════
export default function MentorDashboard() {
  const router = useRouter();
  const canvasRef = useRef(null);

  const [mounted, setMounted] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [timeStr, setTimeStr] = useState('00:00:00');
  const [notifPanelOpen, setNotifPanelOpen] = useState(false);

  const [mentees, setMentees] = useState(MENTEES);
  const [requests, setRequests] = useState(INITIAL_REQUESTS);
  const [activeThread, setActiveThread] = useState(0);
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState(MESSAGES_DB);

  const [chartRange, setChartRange] = useState('7d');
  const [tooltip, setTooltip] = useState({ show: false, x: 0, y: 0, date: '', val: '', sess: '' });

  useEffect(() => {
    setMounted(true);
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Mono:ital,wght@0,400;0,500;1,400&family=Syne:wght@400;500;600;700;800&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    const timer = setInterval(() => {
      const n = new Date();
      setTimeStr(
        String(n.getHours()).padStart(2,'0') + ':' +
        String(n.getMinutes()).padStart(2,'0') + ':' +
        String(n.getSeconds()).padStart(2,'0')
      );
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (activeSection !== 'dashboard') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.offsetWidth, H = 150;
    canvas.width = W * window.devicePixelRatio;
    canvas.height = H * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    const data = CHART_DATA[chartRange];
    const N = data.earnings.length;
    const maxE = Math.max(...data.earnings) * 1.2;
    const maxS = Math.max(...data.sessions) * 1.2;
    const pad = { l:30, r:14, t:10, b:24 };
    const W2 = W - pad.l - pad.r, H2 = H - pad.t - pad.b;

    ctx.clearRect(0, 0, W, H);

    for (let i = 0; i <= 4; i++) {
      const y = pad.t + H2 * (1 - i / 4);
      ctx.beginPath(); ctx.moveTo(pad.l, y); ctx.lineTo(W - pad.r, y);
      ctx.strokeStyle = 'rgba(255,255,255,.04)'; ctx.lineWidth = 1; ctx.stroke();
      const lbl = Math.round(maxE * i / 4 / 400) * 400;
      ctx.fillStyle = 'rgba(74,96,128,.7)';
      ctx.font = `9px "DM Mono",monospace`;
      ctx.textAlign = 'right';
      ctx.fillText('₹' + lbl, pad.l - 5, y + 3);
    }

    ctx.textAlign = 'center'; ctx.fillStyle = 'rgba(74,96,128,.7)';
    data.labels.forEach((lbl, i) => {
      const x = pad.l + (i / (N - 1)) * W2;
      ctx.fillText(lbl, x, H - 4);
    });

    function plotSeries(values, maxVal, strokeColor, lineWidth = 2) {
      const pts = values.map((v, i) => ({
        x: pad.l + (i / (N - 1)) * W2,
        y: pad.t + H2 * (1 - v / maxVal)
      }));
      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      for (let i = 1; i < pts.length; i++) {
        const cp1x = (pts[i - 1].x + pts[i].x) / 2;
        ctx.bezierCurveTo(cp1x, pts[i - 1].y, cp1x, pts[i].y, pts[i].x, pts[i].y);
      }
      ctx.strokeStyle = strokeColor; ctx.lineWidth = lineWidth;
      ctx.shadowBlur = 8; ctx.shadowColor = strokeColor; ctx.stroke(); ctx.shadowBlur = 0;
      ctx.lineTo(pts[pts.length - 1].x, pad.t + H2);
      ctx.lineTo(pts[0].x, pad.t + H2); ctx.closePath();
      const grad = ctx.createLinearGradient(0, pad.t, 0, pad.t + H2);
      const baseCol = strokeColor === '#00E5A8' ? '0,229,168' : '0,245,255';
      grad.addColorStop(0, `rgba(${baseCol},.3)`);
      grad.addColorStop(1, `rgba(${baseCol},0)`);
      ctx.fillStyle = grad; ctx.fill();
      return pts;
    }

    const ptsE = plotSeries(data.earnings, maxE, '#00E5A8', 2.5);
    plotSeries(data.sessions.map(v => v / maxS * maxE), maxE, '#00F5FF', 1.5);

    ptsE.forEach(p => {
      ctx.beginPath(); ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#00E5A8'; ctx.fill();
      ctx.beginPath(); ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
      ctx.fillStyle = '#020a12'; ctx.fill();
    });

    canvas._pts = ptsE;
    canvas._data = data;
  }, [activeSection, chartRange]);

  const handleChartHover = (e) => {
    const canvas = canvasRef.current;
    if (!canvas || !canvas._pts) return;
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const pts = canvas._pts;
    const d = canvas._data;
    let nearest = 0, minDist = Infinity;
    pts.forEach((p, i) => {
      const dist = Math.abs(p.x - mx);
      if (dist < minDist) { minDist = dist; nearest = i; }
    });
    const p = pts[nearest];
    setTooltip({
      show: true, x: p.x + 10, y: p.y - 50,
      date: d.labels[nearest],
      val: '₹' + d.earnings[nearest].toLocaleString(),
      sess: d.sessions[nearest] + ' session' + (d.sessions[nearest] !== 1 ? 's' : '')
    });
  };

  const acceptDossier = (req) => {
    setRequests(prev => prev.filter(r => r.id !== req.id));
    setMentees(prev => [
      { n: req.n, dest: 'TU Munich → CS', score: 72, img: req.img, status: 'online', prog: 5 },
      ...prev
    ]);
  };

  const sendMsg = () => {
    if (!chatInput.trim()) return;
    const tName = THREADS[activeThread].n;
    const newMsg = { id: Date.now(), type: 'sent', text: chatInput, time: timeStr.substring(0, 5) };
    setMessages(prev => ({
      ...prev,
      [tName]: [...(prev[tName] || []), newMsg]
    }));
    setChatInput('');
  };

  if (!mounted) return null;

  return (
    <div className="mentor-dash-root">
      <style dangerouslySetInnerHTML={{ __html: styles }} />

      <div className="amb" />
      <div className="hex-bg" />
      <div className="scan" />
      <div className="sweep" />

      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          <linearGradient id="sm-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00F5FF" />
            <stop offset="100%" stopColor="#00E5A8" />
          </linearGradient>
        </defs>
      </svg>

      {/* ── SIDEBAR ── */}
      <aside className="sb">
        <Link href="/" className="sb-logo">
          <div className="sb-logo-icon">
            <Triangle size={16} fill="currentColor" strokeWidth={2} />
          </div>
          <div className="sb-logo-text">Mentor<em>Bridge</em></div>
        </Link>
        <div className="sb-status">
          <div className="sb-status-dot" />
          HANDLER TERMINAL ACTIVE
          <span>v2.4.1</span>
        </div>
        <nav className="sb-nav">
          <div className="sb-sect">Operations</div>
          <div className={`sb-item ${activeSection === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveSection('dashboard')}>
            <span className="sb-ico">⬡</span>Command Center
          </div>
          <div className={`sb-item ${activeSection === 'roster' ? 'active' : ''}`} onClick={() => setActiveSection('roster')}>
            <span className="sb-ico">👥</span>My Roster
            <span className="sb-badge badge-cyan">{mentees.length}</span>
          </div>
          <div className={`sb-item ${activeSection === 'schedule' ? 'active' : ''}`} onClick={() => setActiveSection('schedule')}>
            <span className="sb-ico">📅</span>Schedule &amp; Slots
          </div>
          <div className="sb-sect">Intelligence</div>
          <div className={`sb-item ${activeSection === 'comms' ? 'active' : ''}`} onClick={() => setActiveSection('comms')}>
            <span className="sb-ico">💬</span>Secure Comms
            <span className="sb-badge badge-rose">3</span>
          </div>
          <Link href="/mentor-impact" className="sb-item"><span className="sb-ico">🌟</span> Mentor Impact</Link>
          <Link href="/session-intelligence" className="sb-item"><span className="sb-ico">📊</span> Session Intelligence</Link>

          <div className={`sb-item ${activeSection === 'finance' ? 'active' : ''}`} onClick={() => setActiveSection('finance')}>
            <span className="sb-ico">₹</span>Financial Ledger
          </div>
          <div className="sb-sect">System</div>
          <div className={`sb-item ${activeSection === 'profile' ? 'active' : ''}`} onClick={() => setActiveSection('profile')}>
            <span className="sb-ico">⚙</span>Profile Setup
          </div>
        </nav>
        <div className="sb-user">
          <div className="sb-av">
            <img src="https://randomuser.me/api/portraits/men/11.jpg" alt="Aarav" />
            <div className="sb-av-ring" />
          </div>
          <div>
            <div className="sb-uname">Aarav Mehta</div>
            <div className="sb-urole">⬡ VERIFIED MENTOR</div>
          </div>
          <div className="sb-uico" onClick={() => router.push('/login')} title="Log Out">
            <LogOut size={14} />
          </div>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <main className="main">
        <div className="topbar">
          <div className="tb-breadcrumb">
            MENTORBRIDGE
            <span className="tb-bc-sep">/</span>
            HANDLER
            <span className="tb-bc-sep">/</span>
            <span className="tb-bc-cur">{activeSection.replace('-', ' ').toUpperCase()}</span>
          </div>
          <div className="tb-spacer" />
          <div className="tb-live"><div className="live-dot" /> SYSTEM ONLINE</div>
          <div className="tb-time">{timeStr}</div>
          <div className="tb-btn" onClick={() => setNotifPanelOpen(o => !o)}>
            🔔
            <div className="tb-notif-badge" />
          </div>
          <div className="tb-btn">⚙</div>
        </div>

        {notifPanelOpen && (
          <div className="notif-panel show">
            <div className="np-head">
              <div className="np-title">TRANSMISSIONS</div>
              <div className="np-clear" onClick={() => setNotifPanelOpen(false)}>CLOSE</div>
            </div>
            <div className="np-list">
              <div style={{ padding: '28px', textAlign: 'center', fontFamily: 'var(--ffm)', fontSize: '.72rem', color: 'var(--t3)', letterSpacing: '.08em' }}>
                [ NO NEW TRANSMISSIONS ]
              </div>
            </div>
          </div>
        )}

        <div className="content">

          {/* ════ DASHBOARD ════ */}
          {activeSection === 'dashboard' && (
            <div className="section active">

              {/* HERO (FIXED STRETCHING) */}
              <div className="hero au0">
                <div className="ctl" /><div className="cbr" />
                <div className="hero-corner-tag">SECURE HANDLER TERMINAL</div>
                <div className="hero-av-zone">
                  <div className="hero-av"><img src="https://randomuser.me/api/portraits/men/11.jpg" alt="" /></div>
                  <div className="hero-av-online" />
                </div>
                <div className="hero-main">
                  <div className="hero-sup">HANDLER STATUS: ONLINE</div>
                  <div className="hero-name">WELCOME BACK, <em>AARAV.</em></div>
                  <div className="hero-meta">
                    <div className="hero-meta-item">🏛 <span>MS CS @ TU Munich</span></div>
                    <div className="hero-meta-item">📍 <span>Munich, Germany</span></div>
                    <div className="hero-meta-item">🎯 <span>Germany · CS/AI Specialization</span></div>
                  </div>
                </div>
                <div className="hero-kpis">
                  <div className="kpi">
                    <div className="kpi-val" style={{ color: 'var(--cyan)' }}>{mentees.length}</div>
                    <div className="kpi-lbl">Active<br />Mentees</div>
                    <div className="kpi-delta up">↑ 2 this month</div>
                  </div>
                  <div className="kpi">
                    <div className="kpi-val" style={{ color: 'var(--teal)' }}>₹24k</div>
                    <div className="kpi-lbl">Monthly<br />Revenue</div>
                    <div className="kpi-delta up">↑ ₹3.2k</div>
                  </div>
                  <div className="kpi">
                    <div className="kpi-val" style={{ color: 'var(--amber)' }}>4.9</div>
                    <div className="kpi-lbl">Session<br />Rating</div>
                    <div className="kpi-delta up">★ Exceptional</div>
                  </div>
                  <div className="kpi">
                    <div className="kpi-val" style={{ color: 'var(--purple)' }}>47</div>
                    <div className="kpi-lbl">Sessions<br />Completed</div>
                    <div className="kpi-delta up">↑ 8 this month</div>
                  </div>
                </div>
              </div>

              {/* ROW 1 */}
              <div className="grid-2 au1">
                <div className="card">
                  <div className="card-head">
                    <div className="card-title"><span className="card-title-ico">📡</span> UPCOMING SESSIONS</div>
                    <div className="card-action" onClick={() => setActiveSection('schedule')}>VIEW CALENDAR →</div>
                  </div>
                  <div className="sessions-list">
                    {SESSIONS.map((s, i) => (
                      <div key={i} className="session-row">
                        <div className="session-av"><img src={s.img} alt="" /></div>
                        <div className="session-info">
                          <div className="session-name">{s.n}</div>
                          <div className="session-meta">
                            <span>🎯 {s.dest}</span>
                            <span className="tag">TU9 TARGET</span>
                          </div>
                        </div>
                        <div className="session-time">
                          <div className="session-day">{s.day}</div>
                          <div className="session-hrs">{s.hrs}</div>
                          <div className="session-countdown">in {s.countdown}</div>
                        </div>
                        <button className="session-launch" onClick={() => window.open('https://meet.jit.si/MentorBridge-aarav-01', '_blank')}>⚡ LAUNCH</button>
                      </div>
                    ))}
                  </div>
                  <div className="meet-link-row">
                    <span style={{ fontSize: '11px', color: 'var(--cyan)' }}>🔗</span>
                    <div className="meet-link-url">https://meet.jit.si/MentorBridge-aarav-01</div>
                    <div className="meet-link-copy" onClick={() => navigator.clipboard.writeText('https://meet.jit.si/MentorBridge-aarav-01')}>COPY</div>
                  </div>
                </div>

                <div className="card">
                  <div className="card-head">
                    <div className="card-title"><span className="card-title-ico">📈</span> REVENUE STREAM</div>
                    <div className="card-tabs">
                      <div className={`tab-btn ${chartRange === '7d' ? 'active' : ''}`} onClick={() => setChartRange('7d')}>7D</div>
                      <div className={`tab-btn ${chartRange === '1m' ? 'active' : ''}`} onClick={() => setChartRange('1m')}>1M</div>
                      <div className={`tab-btn ${chartRange === '3m' ? 'active' : ''}`} onClick={() => setChartRange('3m')}>3M</div>
                    </div>
                  </div>
                  <div className="chart-wrap">
                    <div className="chart-meta">
                      <div>
                        <div className="chart-total">{CHART_TOTALS[chartRange]}</div>
                        <div className="chart-sub">Revenue this period</div>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' }}>
                        <div className="chart-badge">+18.4% ↑</div>
                        <div className="chart-legend">
                          <div className="cl-item"><div className="cl-dot" style={{ background: 'var(--teal)' }} />Earnings</div>
                          <div className="cl-item"><div className="cl-dot" style={{ background: 'var(--cyan)' }} />Sessions</div>
                        </div>
                      </div>
                    </div>
                    <canvas
                      id="earningsChart"
                      ref={canvasRef}
                      onMouseMove={handleChartHover}
                      onMouseLeave={() => setTooltip(t => ({ ...t, show: false }))}
                    />
                    {tooltip.show && (
                      <div className="chart-tooltip" style={{ display: 'block', left: tooltip.x, top: tooltip.y }}>
                        <div className="chart-tooltip-date">{tooltip.date}</div>
                        <div className="chart-tooltip-val">{tooltip.val}</div>
                        <div className="chart-tooltip-sess">{tooltip.sess}</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* ROW 2 */}
              <div className="grid-3 au2">

                {/* ROSTER PREVIEW */}
                <div className="card">
                  <div className="card-head">
                    <div className="card-title"><span className="card-title-ico">👥</span> ACTIVE ROSTER</div>
                    <div className="card-action" onClick={() => setActiveSection('roster')}>SEE ALL →</div>
                  </div>
                  <div className="roster-body">
                    {mentees.slice(0, 5).map((m, i) => {
                      const sc = m.status === 'online' ? 'var(--teal)' : m.status === 'away' ? 'var(--amber)' : 'var(--t3)';
                      return (
                        <div key={i} className="roster-row">
                          <div className="roster-status-dot" style={{ background: sc, boxShadow: `0 0 6px ${sc}` }} />
                          <div className="roster-av"><img src={m.img} alt="" /></div>
                          <div className="roster-info">
                            <div className="roster-name">{m.n}</div>
                            <div className="roster-dest">{m.dest}</div>
                          </div>
                          <div className="roster-score-wrap">
                            <div className="roster-score" style={{ color: 'var(--cyan)' }}>{m.score}</div>
                            <div className="roster-prog">
                              <div className="roster-prog-fill" style={{ width: `${m.score}%`, background: 'var(--cyan)' }} />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* PENDING REQUESTS */}
                <div className="card">
                  <div className="card-head">
                    <div className="card-title"><span className="card-title-ico">📁</span> PENDING REQUESTS</div>
                    <span style={{ fontFamily: 'var(--ffm)', fontSize: '.6rem', padding: '2px 8px', borderRadius: '5px', background: 'rgba(251,77,109,.1)', color: 'var(--rose)', border: '1px solid rgba(251,77,109,.2)' }}>
                      {requests.length} NEW
                    </span>
                  </div>
                  <div className="dossier-body">
                    {requests.length === 0 ? (
                      <div className="dossier-empty">[ NO PENDING REQUESTS ]</div>
                    ) : requests.map(d => (
                      <div key={d.id} className="dossier-item">
                        <div className="dossier-av"><img src={d.img} alt="" /></div>
                        <div className="dossier-info">
                          <div className="dossier-name">{d.n}</div>
                          <div className="dossier-msg">{d.msg}</div>
                          <div className="dossier-actions">
                            <div className="d-btn accept" onClick={() => acceptDossier(d)}>ACCEPT ✓</div>
                            <div className="d-btn decline" onClick={() => setRequests(r => r.filter(x => x.id !== d.id))}>DECLINE</div>
                          </div>
                        </div>
                        <div className="dossier-time">{d.time}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* SMARTMATCH + LOGS */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div className="card">
                    <div className="card-head">
                      <div className="card-title"><span className="card-title-ico">🎯</span> SMARTMATCH INDEX</div>
                    </div>
                    <div className="smartmatch-body">
                      <div className="sm-score-main">
                        <div className="sm-ring">
                          <svg viewBox="0 0 80 80">
                            <circle className="track" cx="40" cy="40" r="35" />
                            <circle className="fill" cx="40" cy="40" r="35" />
                          </svg>
                          <div className="sm-ring-val">
                            <div className="sm-ring-num">85</div>
                            <div className="sm-ring-pct">SCORE</div>
                          </div>
                        </div>
                        <div className="sm-text">
                          <h3>TOP 12% MENTOR</h3>
                          <p>Your profile is visible to <b style={{ color: 'var(--cyan)' }}>2,840</b> searching students this week.</p>
                        </div>
                      </div>
                      <div className="sm-bars">
                        <div className="sm-bar-row"><span className="sm-bar-label">Profile Strength</span><div className="sm-bar-track"><div className="sm-bar-fill" style={{ width: '88%', background: 'linear-gradient(90deg,var(--cyan),var(--teal))' }} /></div><span className="sm-bar-val">88%</span></div>
                        <div className="sm-bar-row"><span className="sm-bar-label">Response Rate</span><div className="sm-bar-track"><div className="sm-bar-fill" style={{ width: '96%', background: 'var(--teal)' }} /></div><span className="sm-bar-val">96%</span></div>
                        <div className="sm-bar-row"><span className="sm-bar-label">Session Rating</span><div className="sm-bar-track"><div className="sm-bar-fill" style={{ width: '98%', background: 'var(--amber)' }} /></div><span className="sm-bar-val">4.9★</span></div>
                        <div className="sm-bar-row"><span className="sm-bar-label">Completion</span><div className="sm-bar-track"><div className="sm-bar-fill" style={{ width: '100%', background: 'var(--purple)' }} /></div><span className="sm-bar-val">100%</span></div>
                      </div>
                    </div>
                  </div>

                  <div className="card">
                    <div className="card-head">
                      <div className="card-title"><span className="card-title-ico" style={{ color: 'var(--teal)' }}>■</span> SYSTEM LOGS</div>
                      <div className="card-action">CLEAR</div>
                    </div>
                    <div className="logs-body">
                      <div className="log-row"><span className="log-t">10:42</span><span className="log-icon">💰</span><span className="log-text">System processed <b>₹2,000</b> payout to bank account</span></div>
                      <div className="log-row"><span className="log-t">09:15</span><span className="log-icon">🎯</span><span className="log-text">SmartMatch index updated — visibility <span className="ok">NORMAL</span></span></div>
                      <div className="log-row"><span className="log-t">YEST</span><span className="log-icon">✓</span><span className="log-text">Session with <b>Saif Sanadi</b> marked <span className="ok">COMPLETED</span></span></div>
                      <div className="log-row"><span className="log-t">MON</span><span className="log-icon">📁</span><span className="log-text">New mentee request received.</span></div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* ════ ROSTER ════ */}
          {activeSection === 'roster' && (
            <div className="section active">
              <div style={{ fontFamily: 'var(--ffh)', fontSize: '1.8rem', letterSpacing: '.05em', color: '#fff', marginBottom: '20px' }}>
                ACTIVE ROSTER <em style={{ fontStyle: 'normal', color: 'var(--cyan)' }}>— {mentees.length} MENTEES</em>
              </div>
              <div className="card">
                <div className="card-head">
                  <div className="card-title"><span className="card-title-ico">👥</span> ALL MENTEES</div>
                  <div style={{ display: 'flex', gap: '8px', fontFamily: 'var(--ffm)', fontSize: '.65rem' }}>
                    <span style={{ padding: '4px 10px', borderRadius: '7px', background: 'rgba(0,245,255,.07)', border: '1px solid rgba(0,245,255,.18)', color: 'var(--cyan)', cursor: 'pointer' }}>ALL</span>
                    <span style={{ padding: '4px 10px', borderRadius: '7px', background: 'none', border: '1px solid var(--b)', color: 'var(--t3)', cursor: 'pointer' }}>ACTIVE</span>
                    <span style={{ padding: '4px 10px', borderRadius: '7px', background: 'none', border: '1px solid var(--b)', color: 'var(--t3)', cursor: 'pointer' }}>NEW</span>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '12px', padding: '16px' }}>
                  {mentees.map((m, i) => {
                    const c = ['var(--cyan)', 'var(--teal)', 'var(--amber)', 'var(--purple)'][i % 4];
                    const sc = m.status === 'online' ? 'var(--teal)' : m.status === 'away' ? 'var(--amber)' : 'var(--t3)';
                    const slbl = m.status === 'online' ? 'ONLINE' : m.status === 'away' ? 'AWAY' : 'OFFLINE';
                    return (
                      <div key={i} style={{ background: 'var(--bg2)', border: '1px solid var(--b)', borderRadius: '12px', padding: '14px', cursor: 'pointer' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                          <div style={{ position: 'relative' }}>
                            <img src={m.img} alt="" style={{ width: '42px', height: '42px', borderRadius: '50%', border: `2px solid ${c}` }} />
                            <div style={{ position: 'absolute', bottom: 0, right: 0, width: '10px', height: '10px', borderRadius: '50%', background: sc, border: '2px solid var(--bg2)' }} />
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: '.85rem', fontWeight: '600', color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{m.n}</div>
                            <div style={{ fontFamily: 'var(--ffm)', fontSize: '.62rem', color: 'var(--t2)' }}>{m.dest}</div>
                          </div>
                          <div style={{ fontFamily: 'var(--ffm)', fontSize: '.58rem', padding: '2px 6px', borderRadius: '4px', color: sc, background: `${sc}18`, border: `1px solid ${sc}44` }}>{slbl}</div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                          <span style={{ fontFamily: 'var(--ffm)', fontSize: '.62rem', color: 'var(--t3)' }}>MATCH SCORE</span>
                          <span style={{ fontFamily: 'var(--ffh)', fontSize: '1.1rem', color: c }}>{m.score}</span>
                        </div>
                        <div style={{ height: '3px', background: 'var(--t3)', borderRadius: '2px', overflow: 'hidden' }}>
                          <div style={{ width: `${m.score}%`, height: '100%', background: c, borderRadius: '2px' }} />
                        </div>
                        <div style={{ display: 'flex', gap: '6px', marginTop: '10px' }}>
                          <button onClick={() => setActiveSection('comms')} style={{ flex: 1, padding: '6px', borderRadius: '7px', border: '1px solid rgba(0,245,255,.18)', background: 'rgba(0,245,255,.05)', color: 'var(--cyan)', fontFamily: 'var(--ffb)', fontSize: '.7rem', fontWeight: '700', cursor: 'pointer' }}>💬 MSG</button>
                          <button onClick={() => window.open('https://meet.jit.si/MentorBridge-aarav-01', '_blank')} style={{ flex: 1, padding: '6px', borderRadius: '7px', border: 'none', background: 'linear-gradient(135deg,var(--cyan),var(--teal))', color: '#020a12', fontFamily: 'var(--ffb)', fontSize: '.7rem', fontWeight: '800', cursor: 'pointer' }}>⚡ MEET</button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ════ SCHEDULE ════ */}
          {activeSection === 'schedule' && (
            <div className="section active">
              <div style={{ fontFamily: 'var(--ffh)', fontSize: '1.8rem', letterSpacing: '.05em', color: '#fff', marginBottom: '20px' }}>
                SCHEDULE &amp; <em style={{ fontStyle: 'normal', color: 'var(--cyan)' }}>SLOTS</em>
              </div>
              <div className="schedule-layout">
                <div className="calendar-card">
                  <div className="cal-head">
                    <div className="cal-month">FEBRUARY 2026</div>
                    <div className="cal-nav">
                      <div className="cal-nav-btn">‹</div>
                      <div className="cal-nav-btn">›</div>
                    </div>
                  </div>
                  <div className="cal-grid">
                    <div className="cal-days">
                      {['MON','TUE','WED','THU','FRI','SAT','SUN'].map(d => <div key={d} className="cal-day-label">{d}</div>)}
                    </div>
                    <div className="cal-days">
                      {[26,27,28,29].map(d => <div key={d} className="cal-cell other-month">{d}</div>)}
                      {Array.from({ length: 28 }, (_, i) => i + 1).map(d => (
                        <div key={d} className={`cal-cell ${d === 22 ? 'today' : ''} ${[3,8,10,15,17,22,24].includes(d) ? 'has-session' : ''}`}>{d}</div>
                      ))}
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div className="slots-card">
                    <div className="card-head">
                      <div className="card-title"><span className="card-title-ico">⏰</span> TODAY&apos;S SLOTS</div>
                      <div className="card-action">ADD SLOT +</div>
                    </div>
                    <div className="slots-list">
                      {[
                        { time: '07:00', dur: '30 min', n: 'Saif Sanadi', dest: 'TU Munich', booked: true },
                        { time: '09:00', dur: '30 min', n: null, dest: null, booked: false },
                        { time: '15:00', dur: '60 min', n: 'Priya Sharma', dest: 'RWTH', booked: true },
                        { time: '18:00', dur: '30 min', n: null, dest: null, booked: false },
                      ].map((s, i) => (
                        <div key={i} className="slot-item">
                          <div className="slot-time-block">
                            <div className="slot-time-val">{s.time}</div>
                            <div className="slot-time-dur">{s.dur}</div>
                          </div>
                          <div className="slot-info">
                            {s.booked ? (
                              <><div className="slot-name">{s.n}</div><div className="slot-dest">{s.dest}</div></>
                            ) : (
                              <div className="slot-open">Open slot</div>
                            )}
                          </div>
                          <div className={`slot-badge ${s.booked ? 'sb-booked' : 'sb-open'}`}>{s.booked ? 'BOOKED' : 'OPEN'}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="card">
                    <div className="card-head">
                      <div className="card-title"><span className="card-title-ico">🔗</span> COMM LINK</div>
                    </div>
                    <div style={{ padding: '14px 16px' }}>
                      <div style={{ background: 'var(--bg2)', border: '1px solid var(--b)', borderRadius: '9px', padding: '10px 13px' }}>
                        <div style={{ fontFamily: 'var(--ffm)', fontSize: '.6rem', color: 'var(--t3)', letterSpacing: '.08em', marginBottom: '4px' }}>PRIMARY MEET LINK</div>
                        <div style={{ fontFamily: 'var(--ffm)', fontSize: '.68rem', color: 'var(--cyan)', marginBottom: '8px' }}>meet.jit.si/MentorBridge-aarav-01</div>
                        <button onClick={() => navigator.clipboard.writeText('https://meet.jit.si/MentorBridge-aarav-01')} style={{ width: '100%', padding: '6px', borderRadius: '6px', border: '1px solid rgba(0,245,255,.2)', background: 'rgba(0,245,255,.06)', color: 'var(--cyan)', fontFamily: 'var(--ffb)', fontSize: '.72rem', fontWeight: '700', cursor: 'pointer' }}>COPY LINK</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ════ COMMS ════ */}
          {activeSection === 'comms' && (
            <div className="section active">
              <div style={{ fontFamily: 'var(--ffh)', fontSize: '1.8rem', letterSpacing: '.05em', color: '#fff', marginBottom: '20px' }}>
                SECURE <em style={{ fontStyle: 'normal', color: 'var(--cyan)' }}>COMMS</em>
              </div>
              <div className="card" style={{ overflow: 'hidden' }}>
                <div className="comms-layout">
                  <div className="comms-threads">
                    {THREADS.map((t, i) => (
                      <div key={i} className={`thread-item ${t.unread ? 'unread' : ''} ${activeThread === i ? 'active' : ''}`} onClick={() => setActiveThread(i)}>
                        <div className="thread-av"><img src={t.img} alt="" /></div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div className="thread-name">{t.n}</div>
                          <div className="thread-preview">{t.preview}</div>
                          <div className="thread-time">{t.time} ago</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="comms-main">
                    <div className="comms-tbar">
                      <div className="comms-tbar-av"><img src={THREADS[activeThread].img} alt="" /></div>
                      <div className="comms-tbar-info">
                        <div className="comms-tbar-name">{THREADS[activeThread].n}</div>
                        <div className="comms-tbar-status"><div className="live-dot" style={{ width: '5px', height: '5px' }} /> Online · Target: TU Munich</div>
                      </div>
                      <div className="comms-tbar-actions">
                        <div className="comms-tbar-btn">🎙</div>
                        <div className="comms-tbar-btn" onClick={() => window.open('https://meet.jit.si/MentorBridge-aarav-01', '_blank')}>🚀</div>
                        <div className="comms-tbar-btn">👤</div>
                      </div>
                    </div>
                    <div className="comms-msgs">
                      {(messages[THREADS[activeThread].n] || []).map(m => (
                        <div key={m.id} className={`msg ${m.type}`}>
                          {m.type === 'recv' && <div className="msg-av"><img src={THREADS[activeThread].img} alt="" /></div>}
                          <div className="msg-bubble">{m.text}</div>
                          <div className="msg-time">{m.time}</div>
                        </div>
                      ))}
                    </div>
                    <div className="comms-input-area">
                      <textarea
                        className="comms-input"
                        placeholder="Send encrypted message…"
                        rows="1"
                        value={chatInput}
                        onChange={e => setChatInput(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMsg(); } }}
                      />
                      <button className="comms-send" onClick={sendMsg}>↑</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ════ FINANCE ════ */}
          {activeSection === 'finance' && (
            <div className="section active">
              <div style={{ fontFamily: 'var(--ffh)', fontSize: '1.8rem', letterSpacing: '.05em', color: '#fff', marginBottom: '20px' }}>
                FINANCIAL <em style={{ fontStyle: 'normal', color: 'var(--teal)' }}>LEDGER</em>
              </div>
              <div className="finance-stats">
                <div className="fin-stat"><div className="fin-stat-val" style={{ color: 'var(--teal)' }}>₹24,800</div><div className="fin-stat-lbl">This Month</div><div className="fin-stat-sub" style={{ color: 'var(--teal)' }}>↑ +₹3,200 vs last</div></div>
                <div className="fin-stat"><div className="fin-stat-val" style={{ color: 'var(--cyan)' }}>₹1,86,400</div><div className="fin-stat-lbl">Total Earned</div><div className="fin-stat-sub" style={{ color: 'var(--t2)' }}>47 sessions lifetime</div></div>
                <div className="fin-stat"><div className="fin-stat-val" style={{ color: 'var(--amber)' }}>₹2,000</div><div className="fin-stat-lbl">Pending Payout</div><div className="fin-stat-sub" style={{ color: 'var(--amber)' }}>Processing: 2–3 days</div></div>
                <div className="fin-stat"><div className="fin-stat-val" style={{ color: 'var(--purple)' }}>₹1,600</div><div className="fin-stat-lbl">Avg Per Session</div><div className="fin-stat-sub" style={{ color: 'var(--t2)' }}>₹800–₹3,000 range</div></div>
              </div>
              <div className="ledger-table">
                <div className="card-head" style={{ background: 'var(--bg1)' }}>
                  <div className="card-title"><span className="card-title-ico">💳</span> TRANSACTION LOG</div>
                  <div className="card-action">EXPORT CSV →</div>
                </div>
                <div className="ledger-head-row">
                  <div>Student</div><div>Type</div><div>Amount</div><div>Date</div><div>Status</div>
                </div>
                <div>
                  {LEDGER.map((r, i) => (
                    <div key={i} className="ledger-row">
                      <div className="ledger-row-name">
                        {r.img
                          ? <div className="lr-av"><img src={r.img} alt="" /></div>
                          : <div className="lr-av" style={{ background: 'var(--bg3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}>₹</div>
                        }
                        <div><div className="lr-info-name">{r.n}</div><div className="lr-info-date">{r.date}</div></div>
                      </div>
                      <div className="ledger-cell">{r.type}</div>
                      <div className={`ledger-cell amount ${r.amt.startsWith('-') ? 'out' : ''}`}>{r.amt}</div>
                      <div className="ledger-cell">{r.date}</div>
                      <div className="ledger-cell"><span className={`ledger-status ${r.status}`}>{r.slbl}</span></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ════ PROFILE ════ */}
          {activeSection === 'profile' && (
            <div className="section active">
              <div style={{ fontFamily: 'var(--ffh)', fontSize: '1.8rem', letterSpacing: '.05em', color: '#fff', marginBottom: '20px' }}>
                PROFILE <em style={{ fontStyle: 'normal', color: 'var(--purple)' }}>SETUP</em>
              </div>
              <div className="profile-layout">
                <div className="profile-card">
                  <div className="profile-cover" />
                  <div className="profile-av-area">
                    <div className="profile-av-big"><img src="https://randomuser.me/api/portraits/men/11.jpg" alt="" /></div>
                    <div>
                      <div className="profile-info-name">Aarav Mehta</div>
                      <div className="profile-info-role">⬡ VERIFIED MENTOR</div>
                    </div>
                  </div>
                  <div className="profile-body">
                    <div className="profile-field"><div className="profile-field-label">University</div><div className="profile-field-val">TU Munich — MS Computer Science</div></div>
                    <div className="profile-field"><div className="profile-field-label">Graduation</div><div className="profile-field-val">March 2026 (Expected)</div></div>
                    <div className="profile-field">
                      <div className="profile-field-label">Specialization</div>
                      <div className="profile-tag-list">
                        {['Germany', 'CS / AI', 'DAAD Scholar', 'APS Expert', 'Public Unis'].map(tag => (
                          <div key={tag} className="profile-tag">{tag}</div>
                        ))}
                      </div>
                    </div>
                    <div className="profile-field" style={{ marginTop: '10px' }}>
                      <div className="profile-field-label">Session Rate</div>
                      <div className="profile-field-val" style={{ color: 'var(--teal)', fontFamily: 'var(--ffh)', fontSize: '1.3rem' }}>₹1,600 / hour</div>
                    </div>
                    <div className="profile-field">
                      <div className="profile-field-label">Meet Link</div>
                      <div className="profile-field-val" style={{ fontFamily: 'var(--ffm)', fontSize: '.72rem', color: 'var(--cyan)' }}>meet.jit.si/MentorBridge-aarav-01</div>
                    </div>
                    <button className="profile-edit-btn" style={{ marginTop: '14px' }}>EDIT PROFILE →</button>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div className="stats-grid">
                    <div className="stats-card"><div style={{ fontFamily: 'var(--ffh)', fontSize: '2rem', color: 'var(--cyan)' }}>{mentees.length}</div><div style={{ fontFamily: 'var(--ffm)', fontSize: '.62rem', color: 'var(--t2)', letterSpacing: '.08em', marginTop: '3px' }}>ACTIVE MENTEES</div></div>
                    <div className="stats-card"><div style={{ fontFamily: 'var(--ffh)', fontSize: '2rem', color: 'var(--teal)' }}>47</div><div style={{ fontFamily: 'var(--ffm)', fontSize: '.62rem', color: 'var(--t2)', letterSpacing: '.08em', marginTop: '3px' }}>SESSIONS DONE</div></div>
                    <div className="stats-card"><div style={{ fontFamily: 'var(--ffh)', fontSize: '2rem', color: 'var(--amber)' }}>4.9★</div><div style={{ fontFamily: 'var(--ffm)', fontSize: '.62rem', color: 'var(--t2)', letterSpacing: '.08em', marginTop: '3px' }}>AVERAGE RATING</div></div>
                    <div className="stats-card"><div style={{ fontFamily: 'var(--ffh)', fontSize: '2rem', color: 'var(--purple)' }}>85</div><div style={{ fontFamily: 'var(--ffm)', fontSize: '.62rem', color: 'var(--t2)', letterSpacing: '.08em', marginTop: '3px' }}>SMARTMATCH SCORE</div></div>
                  </div>
                  <div className="card">
                    <div className="card-head"><div className="card-title"><span className="card-title-ico">🔐</span> SECURITY</div></div>
                    <div style={{ padding: '14px 18px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {[
                        { label: 'Two-Factor Auth', sub: '✓ ENABLED', color: 'var(--teal)', badge: 'ACTIVE', bc: 'rgba(0,229,168,.08)', bb: 'rgba(0,229,168,.2)', lc: 'var(--teal)' },
                        { label: 'Comm Encryption', sub: '✓ AES-256 END-TO-END', color: 'var(--teal)', badge: 'ACTIVE', bc: 'rgba(0,229,168,.08)', bb: 'rgba(0,229,168,.2)', lc: 'var(--teal)' },
                        { label: 'Payment Verification', sub: 'Bank Account: SBI ••••4821', color: 'var(--amber)', badge: 'VERIFIED', bc: 'rgba(245,158,11,.08)', bb: 'rgba(245,158,11,.2)', lc: 'var(--amber)' },
                      ].map((item, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 13px', background: 'var(--bg2)', border: '1px solid var(--b)', borderRadius: '9px' }}>
                          <div>
                            <div style={{ fontSize: '.83rem', fontWeight: '600', color: '#fff', marginBottom: '2px' }}>{item.label}</div>
                            <div style={{ fontFamily: 'var(--ffm)', fontSize: '.65rem', color: item.color }}>{item.sub}</div>
                          </div>
                          <div style={{ fontFamily: 'var(--ffm)', fontSize: '.65rem', color: item.lc, padding: '4px 10px', borderRadius: '6px', background: item.bc, border: `1px solid ${item.bb}` }}>{item.badge}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}