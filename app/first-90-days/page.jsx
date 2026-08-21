'use client';

import { useState, useEffect, useCallback } from 'react';

/* ══════════════════════════════════════════════════════════
   CSS
══════════════════════════════════════════════════════════ */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Syne:wght@400;600;700;800&family=DM+Mono:wght@400;500&display=swap');

:root {
  --bg:#03060E; --bg1:#060B18; --bg2:#090F1F; --bg3:#0D1628; --bg4:#111E35;
  --cyan:#00F5FF; --teal:#00E5A8; --amber:#F59E0B; --purple:#A855F7;
  --rose:#FB4D6D; --sky:#38BDF8; --green:#22C55E;
  --b:rgba(0,245,255,.07); --bh:rgba(0,245,255,.18);
  --t:#BDD0EE; --t2:#4A6080; --t3:#1C2C44;
  --ffh:'Bebas Neue',sans-serif;
  --ffb:'Syne',sans-serif;
  --ffm:'DM Mono',monospace;
}
.f90-root { background:var(--bg); color:var(--t); font-family:var(--ffb); min-height:100vh; overflow-x:hidden; }
.f90-root * { box-sizing:border-box; margin:0; padding:0; }
.f90-root a { text-decoration:none; color:inherit; }
.f90-root button { cursor:pointer; font-family:var(--ffb); border:none; background:none; }
.f90-root ::-webkit-scrollbar { width:3px; background:transparent; }
.f90-root ::-webkit-scrollbar-thumb { background:rgba(0,245,255,.1); border-radius:3px; }

/* BG LAYERS */
.f90-orb { position:fixed; border-radius:50%; filter:blur(160px); opacity:.08; pointer-events:none; z-index:0; }
.f90-orb-a { width:700px; height:700px; top:-180px; right:-120px; background:#003A5C; animation:orbFloat 22s ease-in-out infinite alternate; }
.f90-orb-b { width:500px; height:500px; bottom:-100px; left:-80px; background:#2A0A40; animation:orbFloat 28s ease-in-out infinite alternate-reverse; }
.f90-orb-c { width:300px; height:300px; top:40%; left:40%; background:#1A0010; animation:orbFloat 18s ease-in-out infinite; }
@keyframes orbFloat { 0%{transform:translate(0,0)} 100%{transform:translate(30px,20px)} }
.f90-grid { position:fixed; inset:0; z-index:0; pointer-events:none;
  background-image:linear-gradient(rgba(0,245,255,.018) 1px,transparent 1px),linear-gradient(90deg,rgba(0,245,255,.018) 1px,transparent 1px);
  background-size:56px 56px;
  -webkit-mask-image:radial-gradient(ellipse 85% 85% at 50% 50%,black 30%,transparent 100%);
  mask-image:radial-gradient(ellipse 85% 85% at 50% 50%,black 30%,transparent 100%); }
.f90-scan { position:fixed; inset:0; z-index:0; pointer-events:none;
  background:repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,.022) 2px,rgba(0,0,0,.022) 4px); }
.f90-sweep { position:fixed; top:0; left:0; right:0; z-index:1; pointer-events:none; height:1.5px;
  background:linear-gradient(90deg,transparent,var(--cyan),transparent);
  opacity:.1; animation:sweepAnim 16s ease-in-out infinite; }
@keyframes sweepAnim { 0%{transform:translateY(-5px);opacity:0} 8%{opacity:.18} 92%{opacity:.18} 100%{transform:translateY(100vh);opacity:0} }

/* TOPBAR */
.f90-top { position:sticky; top:0; z-index:200; height:58px; background:rgba(3,6,14,.93);
  backdrop-filter:blur(24px); border-bottom:1px solid var(--b);
  display:flex; align-items:center; padding:0 28px; gap:12px; }
.f90-logo { display:flex; align-items:center; gap:9px; font-family:var(--ffb); font-weight:800; font-size:.95rem; color:#fff; }
.f90-logo-gem { width:30px; height:30px; border-radius:8px;
  background:linear-gradient(135deg,rgba(0,245,255,.15),rgba(168,85,247,.12));
  border:1.5px solid rgba(0,245,255,.35); display:flex; align-items:center; justify-content:center;
  font-size:13px; box-shadow:0 0 18px rgba(0,245,255,.22); animation:gemGlow 4s ease-in-out infinite; }
@keyframes gemGlow { 0%,100%{box-shadow:0 0 18px rgba(0,245,255,.22)} 50%{box-shadow:0 0 30px rgba(0,245,255,.5)} }
.f90-logo em { font-style:normal; color:var(--cyan); }
.tb-div { width:1px; height:22px; background:var(--b); flex-shrink:0; }
.tb-sp { flex:1; }
.tb-pill { font-family:var(--ffm); font-size:.62rem; color:var(--teal); background:rgba(0,229,168,.07);
  border:1px solid rgba(0,229,168,.2); padding:4px 12px; border-radius:20px; letter-spacing:.08em;
  display:flex; align-items:center; gap:6px; }
.tb-pulse { width:5px; height:5px; border-radius:50%; background:var(--teal); animation:dotPulse 1.8s infinite; }
@keyframes dotPulse { 0%,100%{box-shadow:0 0 4px var(--teal)} 50%{box-shadow:0 0 12px var(--teal)} }
.tb-back { font-family:var(--ffm); font-size:.7rem; color:var(--t2); padding:6px 14px;
  border:1px solid var(--b); border-radius:8px; transition:all .2s; }
.tb-back:hover { border-color:var(--bh); color:var(--t); }

/* WRAP */
.f90-wrap { position:relative; z-index:2; max-width:1200px; margin:0 auto; padding:0 24px 80px; }

/* HERO */
.f90-hero { text-align:center; padding:52px 0 44px; }
.f90-eyebrow { font-family:var(--ffm); font-size:.62rem; color:var(--purple); letter-spacing:.2em;
  text-transform:uppercase; margin-bottom:14px; display:flex; align-items:center; justify-content:center; gap:12px; }
.f90-eyebrow::before,.f90-eyebrow::after { content:''; flex:1; max-width:80px; height:1px; }
.f90-eyebrow::before { background:linear-gradient(90deg,transparent,var(--purple)); }
.f90-eyebrow::after { background:linear-gradient(90deg,var(--purple),transparent); }
.f90-h1 { font-family:var(--ffh); font-size:clamp(52px,9vw,110px); color:#fff; letter-spacing:.04em; line-height:.88; margin-bottom:14px; }
.f90-h1 .grad { background:linear-gradient(135deg,var(--amber),#ff9500); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
.f90-sub { font-size:.95rem; color:var(--t2); max-width:560px; margin:0 auto 28px; line-height:1.7; }
.f90-hero-stats { display:flex; align-items:center; justify-content:center; gap:24px; flex-wrap:wrap; margin-bottom:32px; }
.fhs { display:flex; flex-direction:column; align-items:center; gap:3px; }
.fhs-n { font-family:var(--ffh); font-size:2.4rem; color:var(--teal); letter-spacing:.04em; line-height:1; }
.fhs-l { font-family:var(--ffm); font-size:.56rem; color:var(--t2); letter-spacing:.1em; }
.fhs-div { width:1px; height:32px; background:var(--b); }
.f90-progress-global { max-width:440px; margin:0 auto; }
.fpg-label { font-family:var(--ffm); font-size:.62rem; color:var(--t2); margin-bottom:7px; display:flex; justify-content:space-between; }
.fpg-track { height:5px; background:rgba(255,255,255,.06); border-radius:3px; overflow:hidden; }
.fpg-fill { height:100%; background:linear-gradient(90deg,var(--cyan),var(--teal)); border-radius:3px; transition:width .6s ease; }

/* COUNTRY SELECTOR */
.f90-cs { display:grid; grid-template-columns:repeat(5,1fr); gap:12px; margin-bottom:40px; }
@media(max-width:860px){.f90-cs{grid-template-columns:repeat(3,1fr);}}
@media(max-width:520px){.f90-cs{grid-template-columns:repeat(2,1fr);}}
.f90-cc { position:relative; border-radius:16px; padding:18px 12px; text-align:center; cursor:pointer;
  overflow:hidden; border:2px solid transparent; background:var(--bg2);
  transition:transform .25s,box-shadow .25s,border-color .25s; display:flex; flex-direction:column; align-items:center; gap:6px; }
.f90-cc:hover { transform:translateY(-4px); }
.f90-cc.sel { transform:translateY(-5px); }
.f90-cc-shine { position:absolute; top:-50%; left:-50%; width:200%; height:200%;
  background:radial-gradient(ellipse at 50% 0%,rgba(255,255,255,.06),transparent 60%); pointer-events:none; }
.f90-cc-flag { width:44px; height:44px; border-radius:50%; overflow:hidden; flex-shrink:0; margin-bottom:4px; border:2.5px solid rgba(255,255,255,.1); }
.f90-cc-flag img { width:100%; height:100%; object-fit:cover; }
.f90-cc-name { font-family:var(--ffh); font-size:1rem; letter-spacing:.04em; color:#fff; }
.f90-cc-city { font-family:var(--ffm); font-size:.54rem; color:var(--t2); letter-spacing:.04em; }
.f90-cc-pct { font-family:var(--ffm); font-size:.6rem; padding:2px 8px; border-radius:10px; display:inline-block; font-weight:600; }
.f90-cc-ring { position:absolute; bottom:8px; right:8px; }

/* TABS */
.f90-tabs { display:flex; gap:4px; background:var(--bg2); border:1px solid var(--b); border-radius:14px; padding:5px; margin-bottom:24px; flex-wrap:wrap; }
.f90-tab { padding:9px 16px; border-radius:10px; font-family:var(--ffm); font-size:.65rem; color:var(--t2);
  cursor:pointer; transition:all .18s; letter-spacing:.07em; text-transform:uppercase; display:flex; align-items:center; gap:6px; white-space:nowrap; }
.f90-tab:hover { color:var(--t); background:rgba(0,245,255,.03); }
.f90-tab.active { color:var(--cyan); background:rgba(0,245,255,.08); border:1px solid rgba(0,245,255,.2); }
.f90-tab-badge { font-size:.55rem; padding:1px 5px; border-radius:5px; background:rgba(251,77,109,.15); color:var(--rose); border:1px solid rgba(251,77,109,.25); }

/* PHASE BLOCKS */
.phase-block { background:var(--bg1); border:1px solid var(--b); border-radius:14px; overflow:hidden; margin-bottom:14px; }
.phase-head { padding:16px 20px; cursor:pointer; display:flex; align-items:center; gap:14px; transition:background .15s; }
.phase-head:hover { background:rgba(0,245,255,.025); }
.phase-num { font-family:var(--ffh); font-size:1.8rem; letter-spacing:.04em; line-height:1; flex-shrink:0; width:52px; text-align:center; }
.phase-meta { flex:1; }
.phase-title { font-family:var(--ffh); font-size:1.1rem; letter-spacing:.05em; color:#fff; margin-bottom:3px; }
.phase-sub { font-family:var(--ffm); font-size:.62rem; color:var(--t2); letter-spacing:.04em; }
.phase-stats { display:flex; gap:12px; align-items:center; flex-shrink:0; }
.phase-pct { font-family:var(--ffh); font-size:1.2rem; letter-spacing:.04em; }
.phase-arrow { font-size:.65rem; color:var(--t2); transition:transform .25s; flex-shrink:0; }
.phase-arrow.open { transform:rotate(180deg); }
.phase-body { display:none; }
.phase-body.open { display:block; animation:slideDown .28s ease; }
@keyframes slideDown { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:none} }

/* TASK ITEMS */
.tasks-grid { display:flex; flex-direction:column; gap:0; }
.task-item { padding:13px 20px; border-bottom:1px solid rgba(255,255,255,.04); display:flex; align-items:flex-start; gap:12px; transition:background .15s; cursor:pointer; }
.task-item:last-child { border-bottom:none; }
.task-item:hover { background:rgba(0,245,255,.022); }
.task-item.done { opacity:.55; }
.task-cb { width:20px; height:20px; border-radius:6px; border:2px solid var(--t3); flex-shrink:0; margin-top:1px; display:flex; align-items:center; justify-content:center; transition:all .2s; background:transparent; }
.task-cb.checked { background:var(--teal); border-color:var(--teal); }
.task-cb-inner { font-size:10px; color:#020a12; }
.task-content { flex:1; }
.task-title { font-size:.88rem; font-weight:600; color:#fff; margin-bottom:3px; line-height:1.4; }
.task-item.done .task-title { text-decoration:line-through; color:var(--t2); }
.task-desc { font-family:var(--ffm); font-size:.66rem; color:var(--t2); line-height:1.55; }
.task-badges { display:flex; gap:6px; flex-wrap:wrap; margin-top:6px; }
.urg-today { font-family:var(--ffm); font-size:.55rem; padding:2px 7px; border-radius:5px; background:rgba(251,77,109,.1); color:var(--rose); border:1px solid rgba(251,77,109,.25); letter-spacing:.05em; animation:urgBlink 2s infinite; }
@keyframes urgBlink { 0%,100%{opacity:1} 50%{opacity:.6} }
.urg-week { font-family:var(--ffm); font-size:.55rem; padding:2px 7px; border-radius:5px; background:rgba(245,158,11,.08); color:var(--amber); border:1px solid rgba(245,158,11,.22); letter-spacing:.05em; }
.urg-month { font-family:var(--ffm); font-size:.55rem; padding:2px 7px; border-radius:5px; background:rgba(56,189,248,.08); color:var(--sky); border:1px solid rgba(56,189,248,.2); letter-spacing:.05em; }
.urg-nice { font-family:var(--ffm); font-size:.55rem; padding:2px 7px; border-radius:5px; background:rgba(0,229,168,.07); color:var(--teal); border:1px solid rgba(0,229,168,.18); letter-spacing:.05em; }
.task-link { font-family:var(--ffm); font-size:.6rem; color:var(--cyan); letter-spacing:.04em; display:inline-flex; align-items:center; gap:3px; }

/* CITY MAP SECTION */
.city-map-wrap { background:var(--bg1); border:1px solid var(--b); border-radius:14px; overflow:hidden; margin-bottom:16px; }
.cm-head { padding:16px 20px; border-bottom:1px solid var(--b); display:flex; align-items:center; justify-content:space-between; gap:12px; }
.cm-title { font-family:var(--ffh); font-size:1.1rem; letter-spacing:.05em; color:#fff; display:flex; align-items:center; gap:9px; }
.cm-body { display:grid; grid-template-columns:1fr 1fr; gap:0; }
.cm-map { padding:0; position:relative; background:var(--bg3); min-height:340px; overflow:hidden; }
.cm-iframe { width:100%; height:340px; border:none; filter:invert(.88) hue-rotate(180deg) saturate(1.3) brightness(.82); }
.cm-info { padding:18px; display:flex; flex-direction:column; gap:10px; overflow-y:auto; max-height:340px; border-left:1px solid var(--b); }
.nbh-item { background:var(--bg2); border:1px solid var(--b); border-radius:10px; padding:12px; cursor:pointer; transition:all .18s; }
.nbh-item:hover { border-color:rgba(0,245,255,.18); }
.nbh-item.active { border-color:rgba(0,245,255,.3); background:rgba(0,245,255,.04); }
.nbh-name { font-family:var(--ffh); font-size:.95rem; letter-spacing:.04em; color:#fff; margin-bottom:3px; }
.nbh-tags { display:flex; gap:5px; flex-wrap:wrap; margin-bottom:5px; }
.nbh-tag { font-family:var(--ffm); font-size:.55rem; padding:2px 7px; border-radius:4px; background:rgba(0,245,255,.07); color:var(--sky); border:1px solid rgba(0,245,255,.14); }
.nbh-desc { font-family:var(--ffm); font-size:.66rem; color:var(--t2); line-height:1.5; }
.nbh-rent { font-family:var(--ffm); font-size:.68rem; color:var(--teal); font-weight:600; margin-top:4px; }

/* EMERGENCY NUMBERS */
.emg-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:10px; }
.emg-card { background:var(--bg2); border:1px solid var(--b); border-radius:12px; padding:14px; position:relative; overflow:hidden; transition:all .18s; }
.emg-card:hover { border-color:rgba(251,77,109,.25); transform:translateY(-2px); }
.emg-card::before { content:''; position:absolute; top:0; left:0; right:0; height:2.5px; }
.emg-crit::before { background:var(--rose); }
.emg-info::before { background:var(--sky); }
.emg-ok::before { background:var(--teal); }
.emg-ico { font-size:1.6rem; margin-bottom:8px; }
.emg-name { font-family:var(--ffh); font-size:.95rem; letter-spacing:.04em; color:#fff; margin-bottom:4px; }
.emg-num { font-family:var(--ffm); font-size:1.2rem; color:var(--rose); font-weight:600; margin-bottom:3px; }
.emg-ok .emg-num { color:var(--teal); }
.emg-info .emg-num { color:var(--sky); }
.emg-desc { font-family:var(--ffm); font-size:.6rem; color:var(--t2); line-height:1.5; }

/* TRANSPORT */
.transport-grid { display:grid; grid-template-columns:1fr 1fr; gap:14px; }
.transport-card { background:var(--bg2); border:1px solid var(--b); border-radius:12px; padding:15px; transition:all .18s; }
.transport-card:hover { border-color:rgba(0,245,255,.18); }
.tc-head { display:flex; align-items:center; gap:10px; margin-bottom:10px; }
.tc-ico { width:36px; height:36px; border-radius:9px; display:flex; align-items:center; justify-content:center; font-size:1.2rem; flex-shrink:0; }
.tc-name { font-family:var(--ffh); font-size:.95rem; letter-spacing:.04em; color:#fff; }
.tc-type { font-family:var(--ffm); font-size:.58rem; color:var(--t2); letter-spacing:.04em; }
.tc-rows { display:flex; flex-direction:column; gap:5px; }
.tc-row { display:flex; justify-content:space-between; align-items:center; padding:5px 0; border-bottom:1px solid rgba(255,255,255,.04); font-family:var(--ffm); font-size:.68rem; }
.tc-row:last-child { border-bottom:none; }
.tc-label { color:var(--t2); }
.tc-val { color:var(--t); font-weight:500; }
.tc-pro { color:var(--teal); }

/* COST TRACKER */
.cost-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:10px; margin-bottom:16px; }
.cost-card { background:var(--bg2); border:1px solid var(--b); border-radius:11px; padding:13px; text-align:center; }
.cost-ico { font-size:1.4rem; margin-bottom:6px; }
.cost-val { font-family:var(--ffh); font-size:1.5rem; letter-spacing:.04em; color:var(--t); line-height:1; margin-bottom:2px; }
.cost-lbl { font-family:var(--ffm); font-size:.58rem; color:var(--t2); letter-spacing:.06em; }
.cost-sub { font-family:var(--ffm); font-size:.56rem; color:var(--t3); margin-top:2px; }
.budget-bar-wrap { background:var(--bg1); border:1px solid var(--b); border-radius:12px; padding:16px; margin-bottom:14px; }
.bb-title { font-family:var(--ffh); font-size:1rem; letter-spacing:.05em; color:#fff; margin-bottom:14px; display:flex; align-items:center; justify-content:space-between; }
.bb-row { display:flex; align-items:center; gap:12px; margin-bottom:10px; }
.bb-label { font-family:var(--ffm); font-size:.68rem; color:var(--t2); min-width:110px; }
.bb-track { flex:1; height:5px; background:rgba(255,255,255,.06); border-radius:3px; overflow:hidden; }
.bb-fill { height:100%; border-radius:3px; }
.bb-val { font-family:var(--ffm); font-size:.7rem; color:var(--t); min-width:55px; text-align:right; font-weight:600; }

/* APPS */
.apps-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:10px; }
.app-card { background:var(--bg2); border:1px solid var(--b); border-radius:12px; padding:13px; text-align:center; transition:all .18s; cursor:pointer; }
.app-card:hover { border-color:rgba(0,245,255,.18); transform:translateY(-2px); }
.app-ico { font-size:1.8rem; margin-bottom:7px; }
.app-name { font-family:var(--ffh); font-size:.88rem; letter-spacing:.04em; color:#fff; margin-bottom:3px; }
.app-cat { font-family:var(--ffm); font-size:.56rem; color:var(--t2); letter-spacing:.05em; margin-bottom:5px; }
.app-desc { font-family:var(--ffm); font-size:.62rem; color:var(--t2); line-height:1.5; }
.app-badge { font-family:var(--ffm); font-size:.55rem; padding:2px 7px; border-radius:4px; display:inline-block; margin-top:6px; background:rgba(0,229,168,.08); color:var(--teal); border:1px solid rgba(0,229,168,.18); }

/* CULTURE */
.culture-grid { display:grid; grid-template-columns:1fr 1fr; gap:14px; margin-bottom:14px; }
.culture-card { background:var(--bg2); border:1px solid var(--b); border-radius:12px; overflow:hidden; }
.cc-head { padding:12px 15px; border-bottom:1px solid var(--b); display:flex; align-items:center; gap:8px; }
.cc-head-ico { font-size:1.1rem; }
.cc-head-title { font-family:var(--ffh); font-size:.95rem; letter-spacing:.04em; color:#fff; }
.cc-items { padding:10px; display:flex; flex-direction:column; gap:6px; }
.cc-item { display:flex; align-items:flex-start; gap:8px; padding:7px 9px; border-radius:8px; font-family:var(--ffm); font-size:.7rem; line-height:1.5; }
.cc-do { background:rgba(0,229,168,.05); border:1px solid rgba(0,229,168,.14); color:var(--t); }
.cc-dont { background:rgba(251,77,109,.05); border:1px solid rgba(251,77,109,.14); color:var(--t); }
.cc-item-ico { flex-shrink:0; font-size:.8rem; margin-top:1px; }

/* SURVIVAL KIT */
.kit-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:12px; }
.kit-card { background:var(--bg2); border:1px solid var(--b); border-radius:12px; padding:14px; }
.kit-head { display:flex; align-items:center; gap:8px; margin-bottom:10px; }
.kit-ico { font-size:1.2rem; flex-shrink:0; }
.kit-title { font-family:var(--ffh); font-size:.92rem; letter-spacing:.04em; color:#fff; }
.kit-items { display:flex; flex-direction:column; gap:5px; }
.kit-item { display:flex; align-items:center; gap:8px; padding:5px 0; border-bottom:1px solid rgba(255,255,255,.04); font-family:var(--ffm); font-size:.68rem; color:var(--t2); }
.kit-item:last-child { border-bottom:none; }
.kit-cb { width:14px; height:14px; border-radius:3px; border:1px solid var(--t3); flex-shrink:0; display:flex; align-items:center; justify-content:center; cursor:pointer; transition:all .15s; }
.kit-cb.on { background:var(--teal); border-color:var(--teal); }

/* COMMUNITY */
.community-grid { display:grid; grid-template-columns:1fr 1fr; gap:12px; }
.comm-card { background:var(--bg2); border:1px solid var(--b); border-radius:12px; padding:14px; transition:all .18s; }
.comm-card:hover { border-color:rgba(0,245,255,.18); }
.comm-head { display:flex; align-items:center; gap:9px; margin-bottom:8px; }
.comm-ico { font-size:1.3rem; flex-shrink:0; }
.comm-name { font-family:var(--ffh); font-size:.92rem; letter-spacing:.04em; color:#fff; }
.comm-type { font-family:var(--ffm); font-size:.58rem; color:var(--t2); }
.comm-desc { font-family:var(--ffm); font-size:.68rem; color:var(--t2); line-height:1.55; margin-bottom:8px; }
.comm-btn { font-family:var(--ffm); font-size:.62rem; color:var(--cyan); padding:5px 12px; border:1px solid rgba(0,245,255,.2); border-radius:7px; background:rgba(0,245,255,.05); cursor:pointer; transition:all .18s; }
.comm-btn:hover { background:rgba(0,245,255,.1); }

/* WEATHER */
.weather-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:10px; }
.weather-card { background:var(--bg2); border:1px solid var(--b); border-radius:12px; padding:13px; text-align:center; }
.wc-month { font-family:var(--ffm); font-size:.62rem; color:var(--t2); letter-spacing:.08em; text-transform:uppercase; margin-bottom:6px; }
.wc-ico { font-size:1.6rem; margin-bottom:5px; }
.wc-temp { font-family:var(--ffh); font-size:1.3rem; color:var(--t); margin-bottom:3px; }
.wc-desc { font-family:var(--ffm); font-size:.6rem; color:var(--t3); }
.wc-tip { font-family:var(--ffm); font-size:.58rem; color:var(--amber); margin-top:5px; line-height:1.4; }

/* MENTAL HEALTH */
.mh-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:12px; }
.mh-card { background:var(--bg2); border:1px solid rgba(168,85,247,.2); border-radius:12px; padding:14px; position:relative; overflow:hidden; }
.mh-card::after { content:''; position:absolute; bottom:0; left:0; right:0; height:2px; background:linear-gradient(90deg,transparent,var(--purple),transparent); }
.mh-ico { font-size:1.5rem; margin-bottom:8px; }
.mh-title { font-family:var(--ffh); font-size:.92rem; letter-spacing:.04em; color:#fff; margin-bottom:5px; }
.mh-desc { font-family:var(--ffm); font-size:.68rem; color:var(--t2); line-height:1.55; margin-bottom:8px; }
.mh-contact { font-family:var(--ffm); font-size:.7rem; color:var(--purple); padding:5px 10px; background:rgba(168,85,247,.07); border:1px solid rgba(168,85,247,.2); border-radius:7px; display:inline-block; }

/* BANK GUIDE */
.bank-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:12px; }
.bank-card { background:var(--bg2); border:1px solid var(--b); border-radius:12px; padding:14px; transition:all .18s; }
.bank-card:hover { border-color:rgba(0,229,168,.2); }
.bank-head { display:flex; align-items:center; gap:9px; margin-bottom:10px; }
.bank-ico { font-size:1.3rem; }
.bank-name { font-family:var(--ffh); font-size:.92rem; letter-spacing:.04em; color:#fff; }
.bank-badge { font-family:var(--ffm); font-size:.55rem; padding:2px 7px; border-radius:4px; border:1px solid; margin-left:auto; }
.bank-rec { color:var(--teal); border-color:rgba(0,229,168,.3); background:rgba(0,229,168,.07); }
.bank-ok { color:var(--sky); border-color:rgba(56,189,248,.25); background:rgba(56,189,248,.06); }
.bank-rows { display:flex; flex-direction:column; gap:4px; }
.bank-row { display:flex; justify-content:space-between; padding:4px 0; border-bottom:1px solid rgba(255,255,255,.04); font-family:var(--ffm); font-size:.67rem; }
.bank-row:last-child { border-bottom:none; }
.bank-k { color:var(--t2); }
.bank-v { color:var(--t); }

/* PHRASE BOOK */
.phrase-grid { display:grid; grid-template-columns:1fr 1fr; gap:12px; }
.phrase-card { background:var(--bg2); border:1px solid var(--b); border-radius:12px; overflow:hidden; }
.pc-head { padding:11px 14px; border-bottom:1px solid var(--b); font-family:var(--ffh); font-size:.88rem; letter-spacing:.04em; color:#fff; display:flex; align-items:center; gap:7px; }
.pc-items { padding:8px; display:flex; flex-direction:column; gap:0; }
.pc-item { display:flex; align-items:center; gap:10px; padding:8px 7px; border-bottom:1px solid rgba(255,255,255,.04); cursor:pointer; transition:background .15s; border-radius:6px; }
.pc-item:last-child { border-bottom:none; }
.pc-item:hover { background:rgba(0,245,255,.025); }
.pc-en { font-family:var(--ffm); font-size:.7rem; color:var(--t2); flex:1; }
.pc-translated { font-family:var(--ffm); font-size:.72rem; color:var(--cyan); font-weight:500; flex:1; }
.pc-romanized { font-family:var(--ffm); font-size:.62rem; color:var(--t3); flex:1; font-style:italic; }

/* UTIL */
.section-divider { height:1px; background:linear-gradient(90deg,transparent,rgba(0,245,255,.12),transparent); margin:28px 0; }
.section-title { font-family:var(--ffh); font-size:clamp(22px,3vw,32px); letter-spacing:.04em; color:#fff; margin-bottom:6px; display:flex; align-items:center; gap:10px; }
.section-sub { font-family:var(--ffm); font-size:.72rem; color:var(--t2); margin-bottom:18px; line-height:1.6; }
.btn { padding:9px 18px; border-radius:9px; font-family:var(--ffb); font-size:.82rem; font-weight:700; cursor:pointer; transition:all .2s; }
.btn-primary { background:linear-gradient(135deg,var(--cyan),var(--teal)); color:#020a12; border:none; }
.btn-primary:hover { transform:translateY(-1px); box-shadow:0 8px 20px rgba(0,245,255,.28); }
.btn-ghost { background:none; border:1px solid var(--b); color:var(--t2); }
.btn-ghost:hover { border-color:var(--bh); color:var(--t); }
.btn-sm { padding:6px 13px; font-size:.75rem; border-radius:7px; }
.tag { font-family:var(--ffm); font-size:.58rem; padding:2px 8px; border-radius:5px; border:1px solid; display:inline-flex; align-items:center; gap:4px; }
.tag-cyan { color:var(--cyan); border-color:rgba(0,245,255,.25); background:rgba(0,245,255,.07); }
.tag-teal { color:var(--teal); border-color:rgba(0,229,168,.25); background:rgba(0,229,168,.07); }
.tag-amber { color:var(--amber); border-color:rgba(245,158,11,.25); background:rgba(245,158,11,.07); }
.card-wrap { background:var(--bg1); border:1px solid var(--b); border-radius:14px; padding:18px; margin-bottom:14px; }
.card-head-bar { display:flex; align-items:center; justify-content:space-between; margin-bottom:16px; }

@keyframes fadeUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:none} }
.fu { animation:fadeUp .4s ease both; }
@media(max-width:700px) {
  .transport-grid,.culture-grid,.community-grid,.phrase-grid { grid-template-columns:1fr; }
  .emg-grid,.kit-grid { grid-template-columns:1fr 1fr; }
  .apps-grid,.bank-grid { grid-template-columns:1fr 1fr; }
  .cost-grid,.weather-grid { grid-template-columns:1fr 1fr; }
  .cm-body { grid-template-columns:1fr; }
}
`;

/* ══════════════════════════════════════════════════════════
   DATA
══════════════════════════════════════════════════════════ */
const COUNTRIES = {
  de: {
    name:'Germany', city:'Munich', flag:'https://flagcdn.com/de.svg', col:'#00AAFF', glow:'rgba(0,170,255,.35)',
    mapSrc:'https://maps.google.com/maps?q=Munich,Germany&z=13&output=embed',
    currency:'EUR €', timezone:'CET (UTC+1)', language:'German',
    neighborhoods:[
      { name:'Maxvorstadt', tags:['Student Zone','Cultural Hub'], desc:'Home to TU Munich, LMU, and 3 major museums. Most international students live here. Cafés everywhere.', rent:'€700–1,100/mo' },
      { name:'Schwabing', tags:['Lively','English-Friendly'], desc:'Young, international feel. Lots of English speakers. Good supermarkets. 15 min to TU Munich.', rent:'€850–1,300/mo' },
      { name:'Neuhausen', tags:['Quiet','Family-Safe'], desc:'Calmer neighbourhood west of centre. Good value, well-connected by U-Bahn. Nymphenburg Palace nearby.', rent:'€800–1,200/mo' },
      { name:'Sendling', tags:['Budget','Local'], desc:'Less touristy, genuinely local. Cheaper than central Munich. 20 min to TU Munich by bike.', rent:'€650–950/mo' },
    ],
    emergency:[
      { ico:'🚨', name:'Emergency', num:'112', desc:'Fire, medical, police emergency', type:'crit' },
      { ico:'👮', name:'Police (non-emg)', num:'110', desc:'Non-emergency police line', type:'crit' },
      { ico:'🏥', name:'Medical Advice', num:'116 117', desc:'KVB medical helpline — 24/7', type:'info' },
      { ico:'🧠', name:'Crisis Line', num:'0800 111 0111', desc:'Free 24/7 psychological crisis support', type:'ok' },
      { ico:'🇮🇳', name:'Indian Consulate', num:'+49 89 2102090', desc:'Munich Consulate — visa, passport, emergency', type:'info' },
      { ico:'🏦', name:'Bank Fraud', num:'116 116', desc:'Block all bank cards across Germany', type:'ok' },
    ],
    transport:[
      { ico:'🚇', name:'S-Bahn / U-Bahn', type:'Metro & Rail', col:'#0066CC', rows:[
        { k:'Day Ticket', v:'€9.20' }, { k:'Weekly Pass', v:'€28.10' },
        { k:'Semester Ticket', v:'~€84 bundled' }, { k:'App', v:'MVV Fahrinfo' },
      ]},
      { ico:'🚲', name:'Cycling', type:'Most popular student option', col:'#00E5A8', rows:[
        { k:'Buy used bike', v:'€80–150 (Flohmarkt)' }, { k:'MVG Mietradd', v:'€1.50/30 min' },
        { k:'Bike lanes', v:'Extensive city-wide' }, { k:'Pro tip', v:'Lock always — theft common', pro:true },
      ]},
      { ico:'🚌', name:'Bus / Tram', type:'MVV network', col:'#A855F7', rows:[
        { k:'Night Bus', v:'Fri–Sun till 3am' }, { k:'Best line', v:'Tram 27 (Maxvorstadt)' },
        { k:'Google Maps', v:'Works perfectly' }, { k:'Validate ticket', v:'Always — fine €60', pro:true },
      ]},
      { ico:'🚗', name:'Car Sharing', type:'For day trips', col:'#F59E0B', rows:[
        { k:'SIXT Share', v:'€0.28/min' }, { k:'Miles', v:'€0.29/min' },
        { k:'ADAC Mitfahren', v:'Long-distance rideshare' }, { k:'Parking', v:'Expensive — avoid in city', pro:true },
      ]},
    ],
    costs:{ rent:950, food:280, transport:90, health:110, misc:120, total:1550,
      items:[
        { ico:'🏠', label:'Rent (WG room)', val:'€750–1,200', col:'var(--cyan)' },
        { ico:'🛒', label:'Groceries/month', val:'€200–320', col:'var(--teal)' },
        { ico:'🚇', label:'Transport pass', val:'€84–90', col:'var(--purple)' },
        { ico:'🏥', label:'Health insurance', val:'€110/mo (TK)', col:'var(--amber)' },
        { ico:'📱', label:'SIM card', val:'€10–20/mo', col:'var(--sky)' },
        { ico:'📚', label:'Semester fee', val:'~€150', col:'var(--rose)' },
        { ico:'🍔', label:'Dining out avg', val:'€8–14/meal', col:'var(--teal)' },
        { ico:'☕', label:'Coffee', val:'€2.50–4.50', col:'var(--amber)' },
      ],
    },
    apps:[
      { ico:'🚇', name:'MVV Fahrinfo', cat:'Transport', desc:'Official Munich transit app. Journey planner + buy tickets.', badge:'Essential' },
      { ico:'🏠', name:'WG-Gesucht', cat:'Housing', desc:'Germany\'s biggest flatshare platform. Start here.', badge:'Essential' },
      { ico:'🛒', name:'Too Good To Go', cat:'Food', desc:'Collect restaurant/bakery leftover food for €2–4. Huge savings.', badge:'Save Money' },
      { ico:'🏦', name:'N26 / Fintiba', cat:'Banking', desc:'Best digital banks for international students. Open in days.', badge:'Essential' },
      { ico:'📱', name:'Kleinanzeigen', cat:'Marketplace', desc:'German Craigslist. Buy used furniture, bikes, everything.', badge:'Useful' },
      { ico:'🌐', name:'DeepL', cat:'Language', desc:'Way better than Google Translate for German. Use daily.', badge:'Daily Use' },
      { ico:'🍕', name:'Wolt / Lieferando', cat:'Food', desc:'Food delivery. Lieferando = German version of Deliveroo.', badge:'Comfort' },
      { ico:'📋', name:'Splittable', cat:'Finance', desc:'Split bills with flatmates. Much better than WhatsApp calculations.', badge:'Flatshare' },
    ],
    culture:{
      dos:[
        { ico:'✅', text:'Always arrive on time — 5 minutes late is considered rude in Germany' },
        { ico:'✅', text:'Separate recycling: Restmüll, Papier, Biomüll, Gelber Sack (yellow bag for plastic)' },
        { ico:'✅', text:'Register your address at the Bürgeramt within 2 weeks — it is legally required (Anmeldung)' },
        { ico:'✅', text:'Speak quietly on public transport — Germans are very aware of noise in shared spaces' },
        { ico:'✅', text:'Pay cash at small businesses — many still don\'t accept cards' },
        { ico:'✅', text:'Say Guten Morgen/Tag/Abend when entering small shops or lifts' },
      ],
      donts:[
        { ico:'❌', text:'Don\'t jaywalk — Germans take pedestrian signals seriously, and fines apply' },
        { ico:'❌', text:'Don\'t do laundry on Sundays — Ruhezeit (quiet hours) law is enforced in most buildings' },
        { ico:'❌', text:'Don\'t throw parties without telling neighbours first — noise after 10pm will get police called' },
        { ico:'❌', text:'Don\'t share someone\'s personal data or photos without permission — GDPR culture is strict' },
        { ico:'❌', text:'Don\'t open a bank account the day you arrive — you need Anmeldung (registration) first' },
        { ico:'❌', text:'Don\'t assume everyone speaks English — always try "Sprechen Sie Englisch?" first' },
      ],
    },
    phrases:[
      { en:'Where is the registration office?', tr:'Wo ist das Einwohnermeldeamt?', rom:'Voh ist das Ain-voh-ner-mel-de-amt?' },
      { en:'I need to open a bank account', tr:'Ich möchte ein Konto eröffnen', rom:'Ikh merkh-te ain Kon-to er-uff-nen' },
      { en:'How much does this cost?', tr:'Wie viel kostet das?', rom:'Vee feel kos-tet das?' },
      { en:'Can you help me?', tr:'Können Sie mir helfen?', rom:'Kur-nen zee meer hel-fen?' },
      { en:'I am a student', tr:'Ich bin Student/in', rom:'Ikh bin Shtu-dent/in' },
      { en:'Do you have a student discount?', tr:'Gibt es eine Studentenermäßigung?', rom:'Gipt es ai-ne Shtu-den-ten-er-mas-i-goong?' },
      { en:'Thank you very much', tr:'Vielen Dank', rom:'Fee-len Dank' },
      { en:'I don\'t understand German well', tr:'Ich spreche nicht gut Deutsch', rom:'Ikh shpreh-khe nikht goot Doytsh' },
    ],
    banks:[
      { ico:'🏦', name:'N26', badge:'rec', rows:[{ k:'Account open', v:'Online, 10 min' },{ k:'Card', v:'Free Mastercard' },{ k:'Fee', v:'€0/month' },{ k:'Needs', v:'Passport only' }] },
      { ico:'💚', name:'DKB', badge:'rec', rows:[{ k:'Account open', v:'Online, 3–5 days' },{ k:'Card', v:'Free Visa' },{ k:'Fee', v:'€0/month' },{ k:'Best for', v:'Blocked account too' }] },
      { ico:'🔵', name:'Sparkasse', badge:'ok', rows:[{ k:'Account open', v:'In-branch' },{ k:'Card', v:'Girocard' },{ k:'Fee', v:'€3–6/month' },{ k:'Good for', v:'Cash, local ATMs' }] },
    ],
    weather:[
      { month:'Jan–Feb', ico:'❄️', temp:'-2°C to 4°C', desc:'Very cold, possible snow', tip:'Heavy coat, thermal layers' },
      { month:'Mar–May', ico:'🌤', temp:'8°C to 18°C', desc:'Warming, unpredictable', tip:'Light jacket + umbrella' },
      { month:'Jun–Aug', ico:'☀️', temp:'18°C to 28°C', desc:'Warm and sunny', tip:'Sunscreen, enjoy Biergartens' },
      { month:'Sep–Dec', ico:'🍂', temp:'5°C to 16°C', desc:'Autumn, quickly gets cold', tip:'Layering essential. Rain often' },
    ],
    community:[
      { ico:'🇮🇳', name:'Indian Students Munich', type:'WhatsApp / Facebook Group', desc:'Largest Indian student group in Munich. Share accommodation, buy/sell, events, visa tips.', action:'Join Group' },
      { ico:'🎓', name:'TU Munich International Office', type:'Official university support', desc:'ISC (International Students Center) runs orientation, buddy programs, and integration events every semester.', action:'Book Appointment' },
      { ico:'🌍', name:'InterNations Munich', type:'Expat community', desc:'Monthly events for internationals in Munich. Good for networking beyond your university bubble.', action:'View Events' },
      { ico:'🏃', name:'Munich Hash House Harriers', type:'Running club', desc:'International running group — fun, social, beer at the end. Best way to meet non-Indians and practice German.', action:'Join Next Run' },
    ],
    mental:[
      { ico:'💬', name:'Psychological Counselling (TU Munich)', desc:'Free counselling for TU Munich students. Up to 10 sessions at no cost. Book online via the Studierendenwerk.', contact:'studierendenwerk.de' },
      { ico:'🌿', name:'TelefonSeelsorge', desc:'24/7 free crisis helpline in German and English. Completely anonymous. 0800 111 0111 or 0800 111 0222.', contact:'0800 111 0111' },
      { ico:'🧘', name:'Calm / Headspace', desc:'Both apps have German content. TU Munich student discount available. Use during exam season especially.', contact:'app.headspace.com' },
    ],
    kit:[
      { ico:'📄', name:'Documents Folder', items:['Passport (original + 3 copies)','Visa sticker page copy','University admission letter','Blocked account confirmation','APS certificate','Health insurance proof (TK/AOK)'] },
      { ico:'🏠', name:'First Week Essentials', items:['Sleeping bag (before bed arrives)','Towels (2)','Basic cookware set','Shower curtain','Adaptor plug (Type F Germany)','Euro cash €300'] },
      { ico:'💊', name:'Health Kit', items:['Prescription medicines (3-month supply)','Paracetamol / Ibuprofen','Vitamin D (critical in German winter)','Health insurance card','GP registration (Hausarzt)','Medical history in German (Arztbrief)'] },
    ],
    phases:[
      { phase:'WEEK 1', num:'01', col:'var(--rose)', tasks:[
        { title:'Do Anmeldung (Address Registration)', desc:'Bürgeramt registration — mandatory by law within 2 weeks. Book appointment online before you arrive if possible.', urg:'today', link:'muenchen.de/buergerservice' },
        { title:'Open a German Bank Account (N26 or DKB)', desc:'N26 only needs passport. DKB needs Anmeldung. Both are free, digital, and accepted everywhere.', urg:'today' },
        { title:'Get a German SIM Card', desc:'Aldi Talk (€10), Congstar, or Lebara. Buy at supermarket. Aldi Talk is cheapest for data.', urg:'today' },
        { title:'Register at Your University', desc:'Immatrikulationsbüro — bring admission letter, proof of payment, health insurance certificate.', urg:'today' },
        { title:'Apply for Studentenwerk Housing', desc:'If not already in WG — apply for Studentenwerk dorms. Wait list is long, apply immediately.', urg:'week' },
        { title:'Find Your Nearest Supermarket', desc:'ALDI and LIDL are cheapest. REWE is premium. Penny is mid. Kaufland for bulk.', urg:'today' },
        { title:'Set Up TK or AOK Health Insurance', desc:'Required for enrollment. TK is most recommended for international students. Apply online.', urg:'today' },
      ]},
      { phase:'MONTH 1', num:'02', col:'var(--amber)', tasks:[
        { title:'Buy a Used Bicycle', desc:'Facebook Marketplace or Kleinanzeigen — €80–150. Best investment in Munich. Get a U-lock (Kryptonite brand).', urg:'week' },
        { title:'Get Your Student ID (Immatrikulationsbescheinigung)', desc:'Download from TUMonline / TU portal. Needed for discounts everywhere — cinema, transit, museums.', urg:'week' },
        { title:'Apply for BAFÖG or University Scholarships', desc:'International students can apply for certain grants. Check Deutschlandstipendium at TU Munich.', urg:'month' },
        { title:'Set Up Waste Separation', desc:'Germany takes recycling seriously. Get 4 bins: Restmüll (grey), Papier (blue), Bio (brown), Gelber Sack (yellow bags for plastic).', urg:'week' },
        { title:'Find a German Language Course', desc:'TU Munich Language Center offers subsidised courses. A2/B1 German will transform your experience.', urg:'month' },
        { title:'Get MVV Semester Ticket', desc:'Bundled into semester fee (~€84 in Munich) — covers all S-Bahn/U-Bahn/Bus within Munich.', urg:'week' },
        { title:'Join an International Students Group', desc:'WhatsApp groups for Indian Students Munich + TU International Student events. First month is key for friendships.', urg:'month' },
      ]},
      { phase:'MONTH 2–3', num:'03', col:'var(--teal)', tasks:[
        { title:'Open Blocked Account Top-Up Planning', desc:'Track spending against the €934/month Sperrkonto release schedule. Set up automatic withdrawals.', urg:'month' },
        { title:'Explore Munich by Bike', desc:'Marienplatz → Englischer Garten → Olympic Park → Nymphenburg Palace. Do this in Month 2 before it gets cold.', urg:'nice' },
        { title:'Tax ID (Steueridentifikationsnummer)', desc:'Automatically mailed after Anmeldung. File it away — needed for any part-time work (Werkstudent jobs).', urg:'month' },
        { title:'Attend University Research Events', desc:'First semester connect with professors and PhD students. TU Munich has strong research networking.', urg:'month' },
        { title:'Find Werkstudent (Part-Time) Jobs', desc:'Up to 20hr/week during term. TU Job Portal, LinkedIn, Stepstone. Most pay €12–17/hr.', urg:'nice' },
        { title:'Connect with DAAD Scholarship Mentors', desc:'If you didn\'t apply before arriving, some DAAD scholarships are available to enrolled students.', urg:'nice' },
        { title:'Plan Weekend Travel in Europe', desc:'Munich → Paris, Prague, Vienna, Rome all under €100 by Flixbus or Ryanair. Do this in Month 3.', urg:'nice' },
      ]},
    ],
  },
  us: {
    name:'USA', city:'Boston / NYC / Bay Area', flag:'https://flagcdn.com/us.svg', col:'#FF4D6D', glow:'rgba(255,77,109,.35)',
    mapSrc:'https://maps.google.com/maps?q=Boston,MA,USA&z=13&output=embed',
    currency:'USD $', timezone:'EST/PST/CST', language:'English',
    neighborhoods:[
      { name:'Allston (Boston)', tags:['Student Zone','Budget'], desc:'The unofficial Harvard/BU student neighborhood. Cheap, lively, lots of Indian food. T-accessible.', rent:'$1,200–1,800/mo' },
      { name:'Flushing (NYC)', tags:['Asian Hub','Budget'], desc:'Largest Asian neighborhood in USA. Incredible food diversity. Direct subway to Manhattan.', rent:'$1,400–2,000/mo' },
      { name:'Inner Sunset (SF)', tags:['Quiet','UCSF Area'], desc:'Foggy, residential, very close to UCSF and Stanford shuttle. Large Indian community.', rent:'$2,000–2,800/mo' },
      { name:'Hyde Park (Chicago)', tags:['UChicago','Safe'], desc:'University of Chicago\'s home neighborhood. Academic bubble. Safe and walkable.', rent:'$1,000–1,600/mo' },
    ],
    emergency:[
      { ico:'🚨', name:'Emergency (Police/Fire/EMS)', num:'911', desc:'All emergencies — call 911', type:'crit' },
      { ico:'🏥', name:'Poison Control', num:'1-800-222-1222', desc:'24/7 poison control national line', type:'info' },
      { ico:'🧠', name:'Mental Health Crisis', num:'988', desc:'Suicide & Crisis Lifeline — call or text 988', type:'ok' },
      { ico:'🇮🇳', name:'Indian Embassy DC', num:'+1 202-939-7000', desc:'Embassy of India, Washington DC', type:'info' },
      { ico:'🚑', name:'Non-Emergency Medical', num:'311', desc:'Local city services, non-emergency', type:'info' },
      { ico:'💳', name:'Card Fraud', num:'Back of card', desc:'Call your bank\'s 24/7 fraud line immediately', type:'ok' },
    ],
    transport:[
      { ico:'🚇', name:'Subway / Metro', type:'Boston: MBTA · NYC: MTA · SF: BART', col:'#FF4D6D', rows:[
        { k:'NYC Monthly', v:'$132/month' }, { k:'Boston Monthly', v:'$90/month' },
        { k:'Student discount', v:'Check university' }, { k:'App', v:'Citymapper' },
      ]},
      { ico:'🚗', name:'Uber / Lyft', type:'Most practical', col:'#F59E0B', rows:[
        { k:'Avg short trip', v:'$12–18' }, { k:'Surge times', v:'Fri/Sat 10pm–2am' },
        { k:'Tip expected', v:'15–20%' }, { k:'Shared option', v:'Uber Pool (cheap)' },
      ]},
      { ico:'🚌', name:'Bus Networks', type:'Free with student ID at most universities', col:'#38BDF8', rows:[
        { k:'Campus shuttle', v:'Usually free' }, { k:'City bus', v:'$1.50–2.75/ride' },
        { k:'Google Maps', v:'Accurate real-time' }, { k:'Night service', v:'Limited after 11pm' },
      ]},
      { ico:'🛴', name:'Bike / Scooter Share', type:'City-wide', col:'#00E5A8', rows:[
        { k:'Citi Bike (NYC)', v:'$19.99/month' }, { k:'Bluebikes (Boston)', v:'$10/month student' },
        { k:'Lime / Bird', v:'$1 + $0.39/min' }, { k:'Helmet', v:'Required in most states', pro:true },
      ]},
    ],
    costs:{ rent:1800, food:400, transport:100, health:0, misc:200, total:2500,
      items:[
        { ico:'🏠', label:'Rent (shared room)', val:'$1,200–2,500', col:'var(--cyan)' },
        { ico:'🛒', label:'Groceries/month', val:'$300–450', col:'var(--teal)' },
        { ico:'🚌', label:'Transit pass', val:'$90–132/mo', col:'var(--purple)' },
        { ico:'🏥', label:'Health insurance', val:'Via university/TA', col:'var(--amber)' },
        { ico:'📱', label:'Phone plan', val:'$30–50/mo', col:'var(--sky)' },
        { ico:'🍔', label:'Dining out avg', val:'$15–25/meal', col:'var(--rose)' },
        { ico:'☕', label:'Coffee', val:'$4–7', col:'var(--amber)' },
        { ico:'💡', label:'Utilities', val:'Often included in rent', col:'var(--teal)' },
      ],
    },
    apps:[
      { ico:'🚇', name:'Citymapper', cat:'Transport', desc:'Best transit app in US cities. Better than Google Maps for public transit.', badge:'Essential' },
      { ico:'🏠', name:'Zillow / Craigslist', cat:'Housing', desc:'Start housing search 3 months before arrival for US cities.', badge:'Essential' },
      { ico:'💳', name:'Venmo / Zelle', cat:'Payments', desc:'Everyone uses Venmo to split bills and pay friends.', badge:'Essential' },
      { ico:'🏦', name:'Chase / Bank of America', cat:'Banking', desc:'Open with passport + I-20. Chase is most accessible. Free student account.', badge:'Essential' },
      { ico:'🛒', name:'Trader Joe\'s / Costco', cat:'Shopping', desc:'Trader Joe\'s for quality affordable food. Costco for bulk with other students.', badge:'Save Money' },
      { ico:'📱', name:'Mint Mobile', cat:'SIM', desc:'Cheapest reliable US SIM. $15/month for 5GB. Buy online, activate on arrival.', badge:'Save Money' },
      { ico:'🍱', name:'DoorDash / Instacart', cat:'Food', desc:'Use student discounts. Instacart is better for grocery delivery.', badge:'Comfort' },
      { ico:'📚', name:'Chegg / Course Hero', cat:'Study', desc:'Rent textbooks for fraction of retail. Essential — don\'t buy new textbooks.', badge:'Study' },
    ],
    culture:{
      dos:[
        { ico:'✅', text:'Tip 18–22% at restaurants, coffee shops, taxis, haircuts — it\'s not optional socially' },
        { ico:'✅', text:'Say "How are you?" as a greeting without expecting a real answer — just say "Good, thanks"' },
        { ico:'✅', text:'Smile and make small talk in elevators, checkout lines, and common areas — it\'s expected' },
        { ico:'✅', text:'Register to vote once you have a green card — civic participation is respected' },
        { ico:'✅', text:'Always use crosswalks — jaywalking tickets are real, especially in cities like San Francisco' },
        { ico:'✅', text:'Build credit from Day 1 — apply for a Secured Credit Card (Discover It or Capital One)' },
      ],
      donts:[
        { ico:'❌', text:'Don\'t ask someone\'s age, salary, or political affiliation casually — very rude in US culture' },
        { ico:'❌', text:'Don\'t skip OPT/CPT applications — they take 3–5 months. Start before you think you need to' },
        { ico:'❌', text:'Don\'t work off-campus without CPT/OPT authorization — immediate visa violation' },
        { ico:'❌', text:'Don\'t stay silent about mental health issues — therapists are normalized and accessible' },
        { ico:'❌', text:'Don\'t drive without a US license — get a state ID or license in first month if you drive' },
        { ico:'❌', text:'Don\'t ignore health insurance enrollment windows — missing them is a very expensive mistake' },
      ],
    },
    phrases:[
      { en:'Where is the SSN office?', tr:'Where\'s the Social Security office?', rom:'You will need SSN for work — not issued before 90 days' },
      { en:'I need to open a bank account', tr:'I\'d like to open a student checking account', rom:'Bring: passport + I-20 + university letter' },
      { en:'Is this area safe?', tr:'Is this neighborhood generally safe at night?', rom:'Ask locals directly — they appreciate the question' },
      { en:'Where do I pay taxes?', tr:'How do I file my F-1 taxes?', rom:'Use Sprintax — designed for international students' },
      { en:'I am on F-1 visa', tr:'I\'m an international student on an F-1 visa', rom:'Say this when asked about employment eligibility' },
      { en:'What\'s the cheapest grocery store?', tr:'Where\'s the nearest Trader Joe\'s / Aldi?', rom:'Trader Joe\'s and Aldi beat Whole Foods dramatically' },
    ],
    banks:[
      { ico:'🏦', name:'Chase', badge:'rec', rows:[{ k:'Open with', v:'Passport + I-20' },{ k:'Fee', v:'$0 student account' },{ k:'ATM', v:'Largest US network' },{ k:'App', v:'Excellent' }] },
      { ico:'💳', name:'Bank of America', badge:'ok', rows:[{ k:'Open with', v:'Passport + I-20' },{ k:'Fee', v:'$0 with student status' },{ k:'ATM', v:'Widespread' },{ k:'Good for', v:'Zelle built-in' }] },
      { ico:'🔵', name:'Wise (for INR→USD)', badge:'rec', rows:[{ k:'Use for', v:'Receiving money from India' },{ k:'Rate', v:'Mid-market (best available)' },{ k:'Fee', v:'0.5–0.8%' },{ k:'Better than', v:'Wire transfer fees' }] },
    ],
    weather:[
      { month:'Sep–Nov', ico:'🍂', temp:'10°C to 22°C', desc:'Fall — beautiful, mild', tip:'Perfect studying weather. Layer up.' },
      { month:'Dec–Feb', ico:'❄️', temp:'-5°C to 5°C', desc:'Harsh winter (Boston/NYC)', tip:'Heavy coat essential. SF is mild.' },
      { month:'Mar–May', ico:'🌸', temp:'8°C to 20°C', desc:'Spring — variable', tip:'Rain jacket useful. Cherry blossoms!' },
      { month:'Jun–Aug', ico:'☀️', temp:'24°C to 36°C', desc:'Hot and humid (east coast)', tip:'AC is everywhere. Sunscreen daily.' },
    ],
    community:[
      { ico:'🇮🇳', name:'Indian Student Association (ISA)', type:'University chapter', desc:'Nearly every US university has an ISA. First event to attend. Holi, Diwali, cultural nights.', action:'Find Your Chapter' },
      { ico:'🏏', name:'Cricket Leagues USA', type:'Weekend sport', desc:'Major US cities have active cricket leagues on weekends. Best way to meet Indians from other universities.', action:'Find Local League' },
      { ico:'🌐', name:'LinkedIn Alumni Network', type:'Professional', desc:'Connect with Indian alumni at your university on Day 1. They answer questions honestly.', action:'Search Alumni' },
      { ico:'💼', name:'Toastmasters', type:'Professional development', desc:'Free or cheap public speaking club. Improves US communication style dramatically. Great networking.', action:'Find Nearest Club' },
    ],
    mental:[
      { ico:'💬', name:'University Counseling Center', desc:'Free sessions for enrolled students. Typically 6–12 sessions at no cost. Book in first month — slots fill fast.', contact:'Your university portal' },
      { ico:'📱', name:'988 Suicide & Crisis Lifeline', desc:'Call or text 988. Available 24/7. Completely confidential. Specifically trained for international students.', contact:'Text or call 988' },
      { ico:'🧘', name:'Calm / Headspace', desc:'Many US universities offer free Calm or Headspace subscriptions to students. Check your student benefits portal.', contact:'Student benefits portal' },
    ],
    kit:[
      { ico:'📄', name:'Documents Folder', items:['Passport + all US visa stamps','I-20 (keep original safe)','Admission letter','I-94 printout (customs.cbp.dhs.gov)','Health insurance card','Social Security Number (when issued)'] },
      { ico:'🏠', name:'Apartment Essentials', items:['Photo ID for lease signing','1–2 months rent as deposit (in cash/cashier check)','Renter\'s insurance ($10–15/mo, required by many)','US-compatible appliances (110V)','US power strips','Local area rug (apartments are cold)'] },
      { ico:'💊', name:'Health Prep', items:['Prescriptions + generic names (US brands differ)','Vaccination records (MMR, Varicella often required)','Dental check before departure','Vision prescription','Primary care physician registration','FSA/HSA enrollment if TA package includes it'] },
    ],
    phases:[
      { phase:'WEEK 1', num:'01', col:'var(--rose)', tasks:[
        { title:'Print and Protect Your I-94', desc:'Print from i94.cbp.dhs.gov. This is your official entry record — needed for OPT, CPT, taxes, and re-entry.', urg:'today' },
        { title:'Open Bank Account (Chase or Bank of America)', desc:'Bring passport + I-20. Chase is most accessible. Get a debit card same day. Credit card application later.', urg:'today' },
        { title:'Get a US SIM Card', desc:'Mint Mobile ($15/mo, buy online before departure) or T-Mobile (buy at airport store). Data is expensive — get 5GB+.', urg:'today' },
        { title:'Register with Your International Students Office', desc:'Check-in is mandatory. They verify your SEVIS record. Do this Day 1 or Day 2.', urg:'today' },
        { title:'Locate Your Nearest Urgent Care', desc:'Not a hospital ER — urgent care for non-emergencies. Know the address before you need it.', urg:'week' },
        { title:'Set Up Venmo / Zelle', desc:'You cannot function socially without Venmo in the US. Link to your bank account immediately.', urg:'week' },
        { title:'Find Indian Grocery Store', desc:'Every major US city has one. Patel Brothers, India Bazaar, or local equivalents. Home cooking is dramatically cheaper.', urg:'week' },
      ]},
      { phase:'MONTH 1', num:'02', col:'var(--amber)', tasks:[
        { title:'Apply for Social Security Number (if eligible to work)', desc:'TAs and RAs with on-campus jobs need SSN. Apply at local SSA office with I-20, I-94, job offer letter.', urg:'week' },
        { title:'Apply for a Secured Credit Card', desc:'Discover It Secured or Capital One Secured. Build US credit score from Month 1 — you will need it for apartments.', urg:'week' },
        { title:'Understand Your Health Insurance Plan', desc:'Read your university health insurance booklet. Know the deductible, copay, and network before you get sick.', urg:'week' },
        { title:'Get Your State ID or Driver\'s License', desc:'Even if you don\'t drive — ID is needed for bars, purchases, everything. DMV appointment often 2–4 weeks wait.', urg:'month' },
        { title:'Find Your Campus Gym and Free Resources', desc:'Most US universities include gym in tuition. Also: free tutoring, free software licenses, free mental health sessions.', urg:'month' },
        { title:'File Your SEVIS Check-In Each Semester', desc:'Must report full-time enrollment each term. Your DSO at the International Office handles this.', urg:'week' },
        { title:'Attend Department Orientation / Social Events', desc:'Week 1–2 department socials are where you make your core PhD/Masters cohort connections.', urg:'today' },
      ]},
      { phase:'MONTH 2–3', num:'03', col:'var(--teal)', tasks:[
        { title:'Plan Your OPT / CPT Timeline Now', desc:'OPT applications take 3–5 months. If you plan to work after graduation, understand your timeline in Month 2.', urg:'month' },
        { title:'File US Taxes (After Jan 1)', desc:'Use Sprintax — designed for F-1 students. File by April 15. Even if you had no income, file Form 8843.', urg:'month' },
        { title:'Explore Your City on Weekends', desc:'Amtrak and Greyhound are cheap for nearby cities. NYC → Philadelphia → DC is an easy weekend loop.', urg:'nice' },
        { title:'Connect with Industry via LinkedIn', desc:'US alumni are very responsive to genuine messages. Connect with Indians at Google, Meta, Amazon in your city.', urg:'month' },
        { title:'Research STEM OPT Eligible Employers', desc:'Build your list of employers enrolled in E-Verify. Needed for STEM OPT extension — plan 12 months out.', urg:'nice' },
        { title:'Indian Community Events', desc:'Diwali celebrations on US campuses are massive — October/November. Best cross-university networking event.', urg:'nice' },
      ]},
    ],
  },
  uk: {
    name:'UK', city:'London', flag:'https://flagcdn.com/gb.svg', col:'#A855F7', glow:'rgba(168,85,247,.35)',
    mapSrc:'https://maps.google.com/maps?q=London,UK&z=12&output=embed',
    currency:'GBP £', timezone:'GMT (UTC+0/+1)', language:'English',
    neighborhoods:[
      { name:'Stratford (London)', tags:['Budget','Diverse'], desc:'Post-Olympics regeneration. Westfield mall, excellent transport. Many international students. Zone 2–3.', rent:'£900–1,400/mo' },
      { name:'Tooting (London)', tags:['Indian Hub','Budget'], desc:'London\'s South Asian food and cultural centre. Authentic Indian food, affordable rent, community feel.', rent:'£800–1,200/mo' },
      { name:'Bethnal Green', tags:['East London','Trendy'], desc:'Near UCL/Queen Mary. Young, international, great cafés and transport. Gentrifying but still affordable.', rent:'£950–1,500/mo' },
      { name:'Leeds City Centre', tags:['Leeds Uni','Best Value'], desc:'For students at Leeds. Headingley is the student suburb — cheap, lively, 20 min to campus.', rent:'£450–750/mo' },
    ],
    emergency:[
      { ico:'🚨', name:'Emergency', num:'999', desc:'Police, fire, ambulance', type:'crit' },
      { ico:'🏥', name:'NHS Non-Emergency', num:'111', desc:'Medical advice, urgent but not emergency', type:'info' },
      { ico:'🧠', name:'Samaritans', num:'116 123', desc:'24/7 emotional support. Free, anonymous.', type:'ok' },
      { ico:'🇮🇳', name:'Indian High Commission', num:'+44 20 7836 8484', desc:'Indian High Commission, London', type:'info' },
      { ico:'👮', name:'Non-Emergency Police', num:'101', desc:'Non-urgent police matters', type:'info' },
      { ico:'💳', name:'Bank Emergency', num:'159', desc:'Secure banking hotline — fraud, lost cards', type:'ok' },
    ],
    transport:[
      { ico:'🚇', name:'London Underground', type:'TfL — best in UK', col:'#A855F7', rows:[
        { k:'Monthly (Zone 1-2)', v:'£157.30' }, { k:'Student Railcard', v:'1/3 off all rail' },
        { k:'18+ Oyster', v:'Capped daily spending' }, { k:'App', v:'Citymapper' },
      ]},
      { ico:'🚲', name:'Santander Cycles', type:'London bike share', col:'#FF4D6D', rows:[
        { k:'Day pass', v:'£2 for 24hr' }, { k:'Annual member', v:'£90/year' },
        { k:'Per 30 min', v:'Free first 30min (member)' }, { k:'Coverage', v:'Central London only' },
      ]},
      { ico:'🚌', name:'National Rail', type:'Intercity travel', col:'#F59E0B', rows:[
        { k:'16-25 Railcard', v:'£30/year → 1/3 off' }, { k:'Advance tickets', v:'Book 6+ weeks ahead' },
        { k:'London → Manchester', v:'From £15 advance' }, { k:'App', v:'Trainline or Avanti' },
      ]},
      { ico:'🚌', name:'Bus Network', type:'TfL Buses (London)', col:'#38BDF8', rows:[
        { k:'Single fare', v:'£1.75 flat' }, { k:'Daily cap', v:'£5.25 (all buses)' },
        { k:'Night Bus', v:'N-routes, very reliable' }, { k:'Always tap in', v:'Use Oyster or contactless' },
      ]},
    ],
    costs:{ rent:1200, food:300, transport:160, health:0, misc:200, total:1860,
      items:[
        { ico:'🏠', label:'Rent (London room)', val:'£900–1,800', col:'var(--cyan)' },
        { ico:'🛒', label:'Groceries/month', val:'£200–350', col:'var(--teal)' },
        { ico:'🚇', label:'TfL monthly pass', val:'£157 (Zone 1-2)', col:'var(--purple)' },
        { ico:'🏥', label:'NHS (IHS paid on visa)', val:'£0 at point of care', col:'var(--amber)' },
        { ico:'📱', label:'SIM card', val:'£10–20/mo', col:'var(--sky)' },
        { ico:'🍔', label:'Dining out avg', val:'£12–18/meal', col:'var(--rose)' },
        { ico:'☕', label:'Coffee', val:'£3.50–5.50', col:'var(--amber)' },
        { ico:'💡', label:'Council Tax', val:'Exempt as full-time student', col:'var(--teal)' },
      ],
    },
    apps:[
      { ico:'🚇', name:'Citymapper', cat:'Transport', desc:'The definitive London transit app. Real-time, multi-modal, works offline.', badge:'Essential' },
      { ico:'🏠', name:'SpareRoom', cat:'Housing', desc:'UK\'s best flatshare site. Flat2let and Zoopla for full flats.', badge:'Essential' },
      { ico:'🏦', name:'Monzo / Starling', cat:'Banking', desc:'Best UK digital banks for students. Open with passport. No monthly fee.', badge:'Essential' },
      { ico:'📺', name:'BBC iPlayer', cat:'Entertainment', desc:'Free with TV licence (check if your uni accommodation pays). Best news + culture.', badge:'Free' },
      { ico:'🛒', name:'Lidl / Aldi UK', cat:'Food', desc:'Dramatically cheaper than Tesco/Sainsbury\'s. Most UK cities well covered.', badge:'Save Money' },
      { ico:'📱', name:'Giffgaff / Smarty', cat:'SIM', desc:'Best value UK SIMs. Giffgaff £10/mo for 15GB. No contract.', badge:'Save Money' },
      { ico:'🍛', name:'Too Good To Go', cat:'Food', desc:'Restaurant surplus food for £2–4. Works brilliantly in London.', badge:'Save Money' },
      { ico:'📚', name:'SCONUL Access', cat:'Study', desc:'Access other UK university libraries with your student card. Massive resource.', badge:'Study' },
    ],
    culture:{
      dos:[
        { ico:'✅', text:'Queue properly — cutting in queues is a serious social offence in the UK. Always queue.' },
        { ico:'✅', text:'Say "sorry" and "excuse me" constantly — British people apologise even when it\'s not their fault' },
        { ico:'✅', text:'Hold the door open for the person behind you — universal UK courtesy rule' },
        { ico:'✅', text:'Take your council tax exemption letter — as a full-time student you are completely exempt' },
        { ico:'✅', text:'Get the 16–25 Railcard (£30/year) — saves 1/3 on all rail travel across UK' },
        { ico:'✅', text:'Explore charity shops (Oxfam, BHF) for cheap furniture, clothes, and books' },
      ],
      donts:[
        { ico:'❌', text:'Don\'t talk loudly on quiet train carriages — there are silent zones, respected strictly' },
        { ico:'❌', text:'Don\'t ask someone how much they earn or what they pay in rent — very rude in UK culture' },
        { ico:'❌', text:'Don\'t forget to apply for council tax exemption letter from your university' },
        { ico:'❌', text:'Don\'t use your US/Indian credit card without telling your bank — it will be blocked for fraud' },
        { ico:'❌', text:'Don\'t underestimate London cost of living — it is significantly more expensive than other UK cities' },
        { ico:'❌', text:'Don\'t wait until you\'re sick to register with a GP — NHS registration can take 2 weeks' },
      ],
    },
    phrases:[
      { en:'Where is the GP surgery?', tr:'Where\'s the nearest NHS GP practice?', rom:'Register immediately — don\'t wait until sick' },
      { en:'Council tax exemption?', tr:'I need a council tax exemption certificate', rom:'Request from your university Student Services' },
      { en:'Do you have student discount?', tr:'Do you do student discount? I have an NUS card.', rom:'NUS card from your students\' union — worth £15/year' },
      { en:'Cheapest train option?', tr:'What\'s the cheapest advance fare to [city]?', rom:'Book 6+ weeks ahead on Trainline for best prices' },
      { en:'National Insurance Number?', tr:'How do I apply for a National Insurance number?', rom:'NINo required for any UK employment — apply at HMRC' },
      { en:'NHS emergency?', tr:'Should I call 111 or go to A&E?', rom:'111 for advice. A&E only for genuine emergencies.' },
    ],
    banks:[
      { ico:'🏦', name:'Monzo', badge:'rec', rows:[{ k:'Open with', v:'Passport + selfie' },{ k:'Fee', v:'£0/month' },{ k:'Card', v:'Coral Mastercard' },{ k:'Best for', v:'Spending insights, pots' }] },
      { ico:'🌟', name:'Starling', badge:'rec', rows:[{ k:'Open with', v:'Passport + proof of address' },{ k:'Fee', v:'£0/month' },{ k:'Card', v:'Mastercard' },{ k:'Best for', v:'Overdraft, savings' }] },
      { ico:'🏛', name:'HSBC Student', badge:'ok', rows:[{ k:'Open with', v:'Passport + CAS letter' },{ k:'Fee', v:'£0/month' },{ k:'Card', v:'Visa Debit' },{ k:'Good for', v:'International transfers' }] },
    ],
    weather:[
      { month:'Oct–Nov', ico:'🌧', temp:'8°C to 16°C', desc:'Grey and rainy, your first UK autumn', tip:'Buy a good waterproof immediately' },
      { month:'Dec–Feb', ico:'🌬', temp:'2°C to 9°C', desc:'Cold, rarely snows in London', tip:'Layers. Central heating in most flats.' },
      { month:'Mar–May', ico:'🌸', temp:'10°C to 17°C', desc:'Spring — random warm days', tip:'Enjoy parks. Seasons change fast.' },
      { month:'Jun–Aug', ico:'⛅', temp:'18°C to 28°C', desc:'British summer — brief but real', tip:'Join every outdoor event. It won\'t last.' },
    ],
    community:[
      { ico:'🇮🇳', name:'Indian Society (InSoc)', type:'University society', desc:'Every UK Russell Group university has one. Massive Diwali and Holi events draw hundreds.', action:'Find Your InSoc' },
      { ico:'🏏', name:'Southall / Wembley', type:'Cultural hub London', desc:'Southall is London\'s Little Punjab. Wembley has incredible Indian restaurants and shops. Both easily accessible.', action:'Explore Southall' },
      { ico:'🎭', name:'Students\' Union Events', type:'Weekly social events', desc:'UK SUs are genuinely excellent. Free weekly events, clubs, and societies for every interest.', action:'Browse Your SU' },
      { ico:'💼', name:'Target Jobs India Network', type:'Career networking', desc:'UK employers actively recruit from Indian universities. Build your UK LinkedIn from Month 1.', action:'Explore Platform' },
    ],
    mental:[
      { ico:'💬', name:'University Counselling Service', desc:'Free for enrolled students. First session typically within 1–2 weeks. Actively used by UK students — no stigma.', contact:'Your student portal' },
      { ico:'📞', name:'Samaritans', desc:'116 123 — Free, 24/7, anonymous. For any emotional distress, not just crisis. Particularly helpful in exam periods.', contact:'116 123 (free)' },
      { ico:'📱', name:'Student Minds', desc:'UK\'s student mental health charity. Resources, workshops, and peer support specifically designed for international students.', contact:'studentminds.org.uk' },
    ],
    kit:[
      { ico:'📄', name:'Documents', items:['Passport (all pages copied)','BRP card when issued (within 10 days of arrival)','CAS letter and university admission letter','IHS (Immigration Health Surcharge) payment confirmation','IELTS certificate','UK National Insurance Number (apply week 1)'] },
      { ico:'🏠', name:'Accommodation', items:['Renter\'s inventory (photograph everything before moving in)','Tenancy agreement (read clause 14–16)','TV licence consideration','Council Tax exemption letter (request from university)','Oyster card or contactless setup','Contents insurance (£3–8/month, worth it)'] },
      { ico:'💊', name:'Health', items:['Register with NHS GP in first week (don\'t wait)','Prescription medicines (UK drugs may have different names)','Dental treatment before arriving (NHS dental is limited)','NHS app downloaded','Emergency contacts list (with Indian High Commission number)','Mental health resources bookmarked'] },
    ],
    phases:[
      { phase:'WEEK 1', num:'01', col:'var(--rose)', tasks:[
        { title:'Collect Your BRP Card', desc:'Biometric Residence Permit — collect at the Post Office specified in your visa. Must be done within 10 days of arrival.', urg:'today' },
        { title:'Register with a GP (Doctor)', desc:'Find your nearest NHS GP surgery (via nhs.uk) and register. Don\'t wait until you\'re ill — registration takes 2 weeks.', urg:'today' },
        { title:'Open Monzo or Starling Bank Account', desc:'Both open with just passport and selfie. Free, instant, and widely accepted. Get the free card.', urg:'today' },
        { title:'Get a UK SIM (Giffgaff or Smarty)', desc:'Giffgaff £10/month for 15GB. Buy the SIM at WH Smith or Tesco. Activate online.', urg:'today' },
        { title:'Register with University International Office', desc:'Mandatory check-in for UKVI reporting purposes. Bring BRP card, CAS letter, and passport.', urg:'today' },
        { title:'Get Council Tax Exemption Certificate', desc:'Request from Student Services. Saves you £1,500–2,000/year if you\'re in private accommodation.', urg:'week' },
        { title:'Set Up Oyster Card', desc:'Add at TfL machines, stations, or online. Oyster has daily spending caps that are cheaper than pay-per-ride.', urg:'today' },
      ]},
      { phase:'MONTH 1', num:'02', col:'var(--amber)', tasks:[
        { title:'Apply for National Insurance Number', desc:'Needed for any UK employment including Werkstudent-equivalent work. Apply at HMRC.gov.uk.', urg:'week' },
        { title:'Get 16–25 Railcard', desc:'£30/year = 1/3 off all rail travel in the UK. Payback in 1 single long-distance trip.', urg:'week' },
        { title:'Explore NUS Card Benefits', desc:'National Union of Students card — discounts at ASOS, Spotify, Deliveroo, Co-op. £15/year.', urg:'month' },
        { title:'Find Indian Grocery Shops', desc:'Tooting, Southall, Wembley, Leicester Square — all have Indian food. Most cities have an Asian supermarket.', urg:'week' },
        { title:'Join Indian Society + Student Union', desc:'InSoc first meeting usually Week 2. Students\' Union societies cover every interest.', urg:'month' },
        { title:'Check Your Graduate Route Status', desc:'Graduate Route (2-year post-study work) is confirmed. Understand the application window — apply after graduation.', urg:'month' },
        { title:'Understand Your Academic Calendar', desc:'UK terms differ from India. Know your Reading Week (exam prep break), Formative/Summative deadlines.', urg:'week' },
      ]},
      { phase:'MONTH 2–3', num:'03', col:'var(--teal)', tasks:[
        { title:'Get National Express / Trainline App', desc:'Advance rail tickets 6+ weeks ahead are dramatically cheaper. London to Edinburgh: £30 advance vs £150 walk-up.', urg:'month' },
        { title:'Explore Free London Museums', desc:'British Museum, Natural History, V&A, Tate Modern — all completely free. Essential cultural education.', urg:'nice' },
        { title:'Plan Graduate Route Application Timeline', desc:'Graduate Route applies after graduation — not during study. Costs £715. Plan budget 12 months out.', urg:'month' },
        { title:'LinkedIn UK Network Building', desc:'Connect with Indian alumni at UK companies. UK professionals respond well to well-written LinkedIn messages.', urg:'month' },
        { title:'Attend University Career Fair', desc:'UK university career fairs in October/November are major recruitment events. Bring CV, dress professionally.', urg:'nice' },
      ]},
    ],
  },
  ca: {
    name:'Canada', city:'Toronto / Vancouver', flag:'https://flagcdn.com/ca.svg', col:'#F59E0B', glow:'rgba(245,158,11,.35)',
    mapSrc:'https://maps.google.com/maps?q=Toronto,Canada&z=12&output=embed',
    currency:'CAD C$', timezone:'EST/PST', language:'English + French',
    neighborhoods:[
      { name:'Kensington Market (Toronto)', tags:['Diverse','Student'], desc:'Bohemian, multi-cultural, close to U of T. Market, cafés, great international food. Walkable.', rent:'C$1,200–1,800/mo' },
      { name:'Little India, Toronto', tags:['South Asian Hub'], desc:'Gerrard Street East. Indian groceries, restaurants, clothes. Strong community support for new arrivals.', rent:'C$1,100–1,600/mo' },
      { name:'Commercial Drive (Vancouver)', tags:['Student','Café Culture'], desc:'Near UBC bus corridor. Lively, international feel, great food scene, cycling infrastructure.', rent:'C$1,600–2,200/mo' },
      { name:'Waterloo Uptown', tags:['Tech Hub','UW Students'], desc:'5 min walk to UWaterloo. Tech company offices everywhere. Many Indian students. Safe and walkable.', rent:'C$900–1,400/mo' },
    ],
    emergency:[
      { ico:'🚨', name:'Emergency (all)', num:'911', desc:'Police, fire, ambulance — all emergencies', type:'crit' },
      { ico:'🧠', name:'Mental Health Crisis', num:'988', desc:'Suicide crisis — call or text 24/7', type:'ok' },
      { ico:'🏥', name:'Telehealth Ontario', num:'1-866-797-0000', desc:'Free 24/7 medical advice by phone (Ontario)', type:'info' },
      { ico:'🇮🇳', name:'Indian High Commission', num:'+1 613-744-3751', desc:'Indian High Commission Ottawa', type:'info' },
      { ico:'🌡', name:'Health 811', num:'811', desc:'BC non-emergency health line', type:'info' },
      { ico:'💳', name:'Bank Fraud', num:'Back of your card', desc:'Bank fraud lines — call immediately', type:'ok' },
    ],
    transport:[
      { ico:'🚇', name:'TTC (Toronto)', type:'Subway + streetcar + bus', col:'#F59E0B', rows:[
        { k:'Monthly pass', v:'C$156' }, { k:'Student 12-month', v:'C$128/month' },
        { k:'Presto card', v:'Required for all transit' }, { k:'App', v:'Transit App' },
      ]},
      { ico:'🚌', name:'GO Transit (Toronto)', type:'Regional commuter rail', col:'#22C55E', rows:[
        { k:'Airport express', v:'Union Station' }, { k:'Monthly GO Pass', v:'Varies by zone' },
        { k:'Student discount', v:'25% off monthly' }, { k:'To suburbs', v:'Faster than TTC' },
      ]},
      { ico:'🚲', name:'Bixi / Mobi', type:'Bike share', col:'#38BDF8', rows:[
        { k:'Bixi (Montreal)', v:'C$21/month' }, { k:'Mobi (Vancouver)', v:'C$19.50/month' },
        { k:'Helmet required', v:'By law in BC' }, { k:'Annual deal', v:'Much cheaper per year' },
      ]},
      { ico:'🚗', name:'Rideshare', type:'Uber/Lyft both active', col:'#A855F7', rows:[
        { k:'Uber/Lyft', v:'Both available' }, { k:'Average short trip', v:'C$12–18' },
        { k:'Tip expected', v:'15–20%' }, { k:'Taxi', v:'More expensive, avoid' },
      ]},
    ],
    costs:{ rent:1400, food:400, transport:130, health:80, misc:200, total:2210,
      items:[
        { ico:'🏠', label:'Rent (shared room)', val:'C$900–1,800', col:'var(--cyan)' },
        { ico:'🛒', label:'Groceries/month', val:'C$300–450', col:'var(--teal)' },
        { ico:'🚇', label:'Transit monthly', val:'C$128–156', col:'var(--purple)' },
        { ico:'🏥', label:'Health insurance', val:'C$80–120 (provincial)', col:'var(--amber)' },
        { ico:'📱', label:'Phone plan', val:'C$35–55/mo', col:'var(--sky)' },
        { ico:'🍔', label:'Dining out avg', val:'C$15–25/meal', col:'var(--rose)' },
        { ico:'☕', label:'Coffee', val:'C$5–7 (Tim Hortons C$2)', col:'var(--amber)' },
        { ico:'❄️', label:'Winter gear', val:'C$150–300 once', col:'var(--teal)' },
      ],
    },
    apps:[
      { ico:'🚇', name:'Transit App', cat:'Transport', desc:'Best Canadian transit app. Works in every major Canadian city.', badge:'Essential' },
      { ico:'🏠', name:'PadMapper / Kijiji', cat:'Housing', desc:'Best Canadian housing search. Start 3 months before arrival.', badge:'Essential' },
      { ico:'🏦', name:'Scotiabank / TD', cat:'Banking', desc:'Both have dedicated international student packages. Book appointment before arrival.', badge:'Essential' },
      { ico:'📱', name:'Public Mobile / Chatr', cat:'SIM', desc:'Cheapest reliable Canadian SIMs. Public Mobile $25/mo for 4GB.', badge:'Save Money' },
      { ico:'🛒', name:'No Frills / FoodBasics', cat:'Food', desc:'Cheapest grocery stores in Ontario. Dramatically cheaper than Loblaws/Metro.', badge:'Save Money' },
      { ico:'💸', name:'Wise (Transferwise)', cat:'Finance', desc:'Best INR to CAD transfer. Mid-market rate vs bank\'s 3–4% markup.', badge:'Save Money' },
      { ico:'🍁', name:'Kijiji', cat:'Marketplace', desc:'Canadian Craigslist. Buy furniture, bikes, everything for cheap when arriving.', badge:'Useful' },
      { ico:'🎓', name:'My CRA Account', cat:'Taxes', desc:'Canada Revenue Agency portal. Register for your SIN first, then file taxes by April 30.', badge:'Taxes' },
    ],
    culture:{
      dos:[
        { ico:'✅', text:'Say "sorry" constantly — Canadians apologise reflexively. It\'s a cultural norm, not weakness.' },
        { ico:'✅', text:'Explore provincial health card registration in first month — free healthcare after 3-month wait in most provinces' },
        { ico:'✅', text:'Tip 15–20% at restaurants. In Canada this is socially mandatory, not optional.' },
        { ico:'✅', text:'Canadians love outdoor activities year-round — skating in winter, hiking in summer. Join in.' },
        { ico:'✅', text:'Learn the difference between federal and provincial programs — OHIP (Ontario), MSP (BC) etc.' },
        { ico:'✅', text:'Acknowledge the land acknowledgment at events — shows respect for Indigenous culture' },
      ],
      donts:[
        { ico:'❌', text:'Don\'t compare Canada to the USA in a dismissive way — Canadians are very proud of the distinction' },
        { ico:'❌', text:'Don\'t forget to apply for provincial health card in first week — 3-month wait period before it activates' },
        { ico:'❌', text:'Don\'t ignore winter — -20°C windchill in Toronto is real. Dress in proper layers or it\'s dangerous.' },
        { ico:'❌', text:'Don\'t use US dollars — Canada has its own currency and prices are noticeably different' },
        { ico:'❌', text:'Don\'t assume all Canadian food prices are reasonable — Canada has some of the highest grocery costs in G7' },
        { ico:'❌', text:'Don\'t skip your SIN (Social Insurance Number) application — needed for banking, taxes, and work' },
      ],
    },
    phrases:[
      { en:'Where is the Service Canada office?', tr:'Service Canada — apply for SIN here', rom:'Bring passport + study permit' },
      { en:'I need my provincial health card', tr:'Where do I apply for OHIP / MSP?', rom:'ServiceOntario or HIBC office, bring ID' },
      { en:'What is Double-Double?', tr:'Tim Hortons double cream, double sugar', rom:'National coffee institution. Order immediately.' },
      { en:'What does "Give\'r" mean?', tr:'Go for it / give it everything', rom:'Canadian slang — shows you\'re integrating well' },
      { en:'Is this marked up?', tr:'Is this on sale? Do you price match?', rom:'Canadians love coupons and price matching — ask always' },
      { en:'What is a study permit condition?', tr:'My study permit says I must study full-time', rom:'Violation means deportation — always take required credits' },
    ],
    banks:[
      { ico:'🏦', name:'Scotiabank', badge:'rec', rows:[{ k:'Student package', v:'No-fee account' },{ k:'Open with', v:'Passport + study permit' },{ k:'Card', v:'SCENE Visa' },{ k:'Good for', v:'International student focus' }] },
      { ico:'🍁', name:'TD Bank', badge:'rec', rows:[{ k:'Student account', v:'No-fee chequing' },{ k:'Open with', v:'Passport + SIN (or without)' },{ k:'Card', v:'Visa Debit' },{ k:'Good for', v:'Widespread ATMs' }] },
      { ico:'💚', name:'Tangerine', badge:'ok', rows:[{ k:'Type', v:'Online-only bank' },{ k:'Fee', v:'$0 always' },{ k:'Referral', v:'$50 sign-up bonus' },{ k:'Good for', v:'Savings interest rates' }] },
    ],
    weather:[
      { month:'Sep–Oct', ico:'🍁', temp:'8°C to 20°C', desc:'Perfect Canadian autumn. Iconic colours.', tip:'Explore national parks before winter.' },
      { month:'Nov–Mar', ico:'🥶', temp:'-20°C to -5°C', desc:'Harsh winter. Windchill is real.', tip:'Canada Goose or equivalent coat essential.' },
      { month:'Apr–May', ico:'🌷', temp:'5°C to 18°C', desc:'Spring thaw — exciting but muddy', tip:'Waterproof boots. Sudden warm days.' },
      { month:'Jun–Aug', ico:'☀️', temp:'20°C to 32°C', desc:'Beautiful Canadian summer', tip:'Use provincial parks. Patio season.' },
    ],
    community:[
      { ico:'🇮🇳', name:'Students\' Association of Indians in Canada (SAIC)', type:'National network', desc:'Find the Indian student chapter at your university. Most run Diwali and Holi events.', action:'Find Chapter' },
      { ico:'🍁', name:'CISSA (Canadian Indian Student Society)', type:'Pan-university', desc:'Cross-university network. Job fairs, networking nights, cultural events. Valuable for career connections.', action:'Connect' },
      { ico:'💼', name:'Waterloo Alumni / UofT Network', type:'LinkedIn network', desc:'Canadian universities have extremely active alumni networks. Reach out to Indian alumni in your city.', action:'LinkedIn Search' },
      { ico:'🏒', name:'Skating Rinks (Free)', type:'Winter activity', desc:'Most Canadian cities have free outdoor skating rinks in winter. Join coworkers and classmates.', action:'Find Nearest Rink' },
    ],
    mental:[
      { ico:'💬', name:'University Mental Health Services', desc:'All major Canadian universities have free counselling. Students often wait 2–3 weeks — book early.', contact:'Your university portal' },
      { ico:'📞', name:'Good2Talk (Ontario)', desc:'Free, confidential helpline for post-secondary students. 1-866-925-5454. Available 24/7 in English and French.', contact:'1-866-925-5454' },
      { ico:'📱', name:'Wellness Together Canada', desc:'Government of Canada free mental health portal. Professional support, self-guided programs, available in 7 languages.', contact:'wellnesstogether.ca' },
    ],
    kit:[
      { ico:'📄', name:'Immigration Documents', items:['Study permit (keep original safe)','Passport with valid visa','SIN card / number (apply week 1)','Provincial health card application receipt','University enrollment proof','Emergency contact list (Indian High Commission + family)'] },
      { ico:'❄️', name:'Winter Survival', items:['Insulated waterproof coat (Canada Goose alternative: Uniqlo)','Thermal base layers (2 sets minimum)','Waterproof winter boots','Warm gloves, hat, scarf','Snow boots with grip (icy sidewalks)','Winter tires if driving'] },
      { ico:'🏦', name:'Financial Setup', items:['Bank account (Scotiabank recommended)','Presto card (Toronto) or Compass card (Vancouver)','SIN number for banking and taxes','Wise account for India transfers','Emergency CAD cash (C$500)','Insurance documents'] },
    ],
    phases:[
      { phase:'WEEK 1', num:'01', col:'var(--rose)', tasks:[
        { title:'Apply for SIN (Social Insurance Number)', desc:'Service Canada office — bring passport + study permit. Free, takes 20 minutes. Needed for banking and work.', urg:'today' },
        { title:'Apply for Provincial Health Card', desc:'Ontario: ServiceOntario. BC: HIBC. 3-month waiting period before it activates — apply Day 1.', urg:'today' },
        { title:'Open Bank Account (Scotiabank or TD)', desc:'Both have international student packages. Bring passport + study permit. No SIN required to open basic account.', urg:'today' },
        { title:'Buy a Canadian SIM Card', desc:'Public Mobile ($25/4GB) or Chatr ($15). Buy at Walmart or Canadian Tire. Activate online.', urg:'today' },
        { title:'Get a PRESTO / Compass Card', desc:'Toronto: PRESTO card for TTC. Vancouver: Compass card for TransLink. Buy at any transit station.', urg:'today' },
        { title:'Find Your International Student Advisor', desc:'Book an appointment at your university\'s international student office. They have province-specific guidance.', urg:'week' },
        { title:'Buy Winter Gear (if arriving in Fall)', desc:'Canadian Tire, Sport Chek, or Uniqlo. Winter coat, boots, gloves non-negotiable. Do this before first snowfall.', urg:'week' },
      ]},
      { phase:'MONTH 1', num:'02', col:'var(--amber)', tasks:[
        { title:'Understand Your Study Permit Conditions', desc:'Full-time enrollment is mandatory. Changing program requires new study permit. Know your conditions.', urg:'week' },
        { title:'Register for PGWP-Eligible Program', desc:'Verify your program is eligible for PGWP before enrolling. DLI list changes. Confirm with international office.', urg:'week' },
        { title:'Apply for Scholarships', desc:'Universities have internal scholarships for enrolled students. Deadline often in Month 2. Check your university portal.', urg:'month' },
        { title:'Get No Frills or Freshco Loyalty Card', desc:'PC Optimum points at No Frills/Loblaws. Dramatic savings over time on groceries.', urg:'month' },
        { title:'Find Indian Grocery (No Frills on Gerrard, T&T)', desc:'T&T Supermarket, Nations Fresh Foods — much cheaper than Indian restaurants. Stock spices once.', urg:'week' },
        { title:'Open Credit Card (Secured)', desc:'Scotia Passport Visa or TD First Class. Build Canadian credit score from Month 1 — needed for apartments.', urg:'month' },
        { title:'Connect with Indian Student Association', desc:'Diwali events in November are massive at Canadian universities. Best Indian community networking event.', urg:'month' },
      ]},
      { phase:'MONTH 2–3', num:'03', col:'var(--teal)', tasks:[
        { title:'Understand Canadian Tax System', desc:'File taxes by April 30 even with zero income — build tax history for credit score and future PR application.', urg:'month' },
        { title:'Build Your Express Entry Points Strategy', desc:'Canadian work experience (via PGWP) adds massive CRS points. Understand the system now, plan backwards.', urg:'nice' },
        { title:'Explore Co-op / Internship Programs', desc:'Waterloo co-op is world-class. Other universities have excellent work-integrated learning. Apply early.', urg:'month' },
        { title:'Explore Canadian Nature', desc:'Banff, Niagara, Algonquin, Pacific Rim. National parks are extraordinary. Student passes available.', urg:'nice' },
        { title:'Attend Career Fair and Hackathons', desc:'Canadian tech companies recruit heavily at university career fairs. Bring resume, dress semi-professionally.', urg:'month' },
      ]},
    ],
  },
  au: {
    name:'Australia', city:'Melbourne', flag:'https://flagcdn.com/au.svg', col:'#00E5A8', glow:'rgba(0,229,168,.35)',
    mapSrc:'https://maps.google.com/maps?q=Melbourne,Australia&z=13&output=embed',
    currency:'AUD A$', timezone:'AEST (UTC+10/+11)', language:'English',
    neighborhoods:[
      { name:'Carlton (Melbourne)', tags:['Student Zone','Lygon St'], desc:'The student suburb for University of Melbourne. Lygon Street = Italian food + cafés. 15 min walk to campus.', rent:'A$900–1,400/mo' },
      { name:'Footscray', tags:['Affordable','Vietnamese'], desc:'Multicultural, very affordable. Vietnamese food scene. Great value. 15 min to CBD by train.', rent:'A$700–1,100/mo' },
      { name:'Newtown (Sydney)', tags:['Student Zone','Arty'], desc:'Near UTS and UNSW. Vibrant, young, multicultural. King Street has excellent independent food.', rent:'A$1,200–1,800/mo' },
      { name:'St Lucia (Brisbane)', tags:['UQ Campus','Quiet'], desc:'Literally on the University of Queensland campus. Safe, beautiful, river walks. Best campus-suburb in Australia.', rent:'A$800–1,200/mo' },
    ],
    emergency:[
      { ico:'🚨', name:'Emergency (all)', num:'000', desc:'Police, fire, ambulance — Australia\'s 999/911', type:'crit' },
      { ico:'🏥', name:'Nurse-On-Call', num:'1300 60 60 24', desc:'24/7 nurse advice line (Victoria)', type:'info' },
      { ico:'🧠', name:'Lifeline', num:'13 11 14', desc:'Crisis support 24/7. Call or text.', type:'ok' },
      { ico:'🇮🇳', name:'Indian High Commission', num:'+61 2 6273 3999', desc:'Indian High Commission, Canberra', type:'info' },
      { ico:'👮', name:'Police (non-emergency)', num:'131 444', desc:'Non-urgent police assistance', type:'info' },
      { ico:'💳', name:'IDCARE', num:'1800 595 160', desc:'Australia\'s national identity fraud support', type:'ok' },
    ],
    transport:[
      { ico:'🚇', name:'Myki (Melbourne)', type:'Tram + train + bus network', col:'#00E5A8', rows:[
        { k:'Daily cap', v:'A$10.60 (Metro)' }, { k:'Weekly cap', v:'A$50.40' },
        { k:'Free tram zone', v:'CBD trams are free' }, { k:'App', v:'PTV (Public Transport Vic)' },
      ]},
      { ico:'🚆', name:'Opal Card (Sydney)', type:'Train + ferry + bus', col:'#38BDF8', rows:[
        { k:'Daily cap', v:'A$17.80' }, { k:'Weekly cap', v:'A$50' },
        { k:'Sunday Cap', v:'A$2.80 all day' }, { k:'App', v:'Opal Travel app' },
      ]},
      { ico:'🚲', name:'Bike Share', type:'Lime / Neuron in most cities', col:'#A855F7', rows:[
        { k:'Lime bike', v:'A$1 + A$0.40/min' }, { k:'Helmet required', v:'By law — Lime provides one' },
        { k:'Cycling paths', v:'Excellent in Melbourne' }, { k:'Own bike', v:'Best investment A$150–250' },
      ]},
      { ico:'🚗', name:'Car / Rideshare', type:'Uber common', col:'#F59E0B', rows:[
        { k:'Uber', v:'Most common rideshare' }, { k:'Short trip avg', v:'A$12–20' },
        { k:'Car rental', v:'Needed for regional' }, { k:'Drive on left', v:'Same as India — easy' },
      ]},
    ],
    costs:{ rent:1200, food:400, transport:80, health:70, misc:200, total:1950,
      items:[
        { ico:'🏠', label:'Rent (shared room)', val:'A$900–1,600', col:'var(--cyan)' },
        { ico:'🛒', label:'Groceries/month', val:'A$300–450', col:'var(--teal)' },
        { ico:'🚇', label:'Transit weekly cap', val:'A$50.40/week', col:'var(--purple)' },
        { ico:'🏥', label:'OSHC health cover', val:'A$70–90/month', col:'var(--amber)' },
        { ico:'📱', label:'SIM card', val:'A$15–30/mo', col:'var(--sky)' },
        { ico:'🍔', label:'Dining out avg', val:'A$15–25/meal', col:'var(--rose)' },
        { ico:'☕', label:'Coffee', val:'A$4.50–6.50', col:'var(--amber)' },
        { ico:'🌞', label:'Sunscreen (must)', val:'A$15–20/bottle', col:'var(--teal)' },
      ],
    },
    apps:[
      { ico:'🚇', name:'PTV / Opal', cat:'Transport', desc:'PTV for Melbourne, Opal for Sydney. Official transit apps with journey planning.', badge:'Essential' },
      { ico:'🏠', name:'Domain / REA Group', cat:'Housing', desc:'Australia\'s top real estate platforms. Domain is preferred in Melbourne.', badge:'Essential' },
      { ico:'🏦', name:'Up Bank / Commonwealth', cat:'Banking', desc:'Up Bank (best digital bank Australia). Commonwealth for in-person service.', badge:'Essential' },
      { ico:'📱', name:'Woolworths Mobile', cat:'SIM', desc:'A$15/month for 20GB. Woolworths supermarket SIM. Best value in Australia.', badge:'Save Money' },
      { ico:'🛒', name:'Aldi Australia', cat:'Food', desc:'Dramatically cheaper than Woolworths and Coles. Find your nearest one.', badge:'Save Money' },
      { ico:'💸', name:'Wise', cat:'Finance', desc:'INR to AUD transfers at mid-market rate. Much better than bank wire.', badge:'Save Money' },
      { ico:'🌞', name:'UV Index (BoM)', cat:'Safety', desc:'Bureau of Meteorology UV alert. Australia has the world\'s highest UV. Check daily.', badge:'Safety' },
      { ico:'🦘', name:'Gumtree', cat:'Marketplace', desc:'Australian buy/sell platform. Buy furniture, bikes, and appliances cheap on arrival.', badge:'Useful' },
    ],
    culture:{
      dos:[
        { ico:'✅', text:'Wear sunscreen daily — Australia has the highest UV radiation on earth. SPF 50+ is standard.' },
        { ico:'✅', text:'Expect blunt, friendly communication — Australians value direct honesty without British politeness layers' },
        { ico:'✅', text:'Understand "arvo" = afternoon, "brekkie" = breakfast, "servo" = service station. Use them.' },
        { ico:'✅', text:'Register with OSHC (Overseas Student Health Cover) before arrival — it\'s mandatory and useful' },
        { ico:'✅', text:'Tip is optional in Australia (unlike USA/Canada) — service is included. Tip only if genuinely exceptional.' },
        { ico:'✅', text:'Respect outdoor culture — beach safety flags, swimming between flags, rip current awareness is genuinely critical' },
      ],
      donts:[
        { ico:'❌', text:'Don\'t underestimate Australian wildlife — always check shoes before wearing, watch for snakes on paths' },
        { ico:'❌', text:'Don\'t swim outside the flagged area at beaches — rip currents kill multiple people every year' },
        { ico:'❌', text:'Don\'t work more than 48 hours per fortnight during term — visa violation with serious consequences' },
        { ico:'❌', text:'Don\'t bring food through customs — Australia\'s biosecurity laws are among the strictest in the world' },
        { ico:'❌', text:'Don\'t assume CBD accommodation is affordable — Melbourne and Sydney are expensive, explore suburbs' },
        { ico:'❌', text:'Don\'t ignore bushfire alerts — check Vic Emergency or NSW RFS apps during fire season (Nov–Mar)' },
      ],
    },
    phrases:[
      { en:'How are you?', tr:'How ya going?', rom:'Standard Australian greeting. Answer: "Yeah good, you?"' },
      { en:'Afternoon', tr:'Arvo', rom:'"See you this arvo" = see you this afternoon' },
      { en:'Where is the bottle shop?', tr:'Where\'s the bottle-o?', rom:'Bottle shop = liquor store. Every suburb has one.' },
      { en:'I need to file a tax return', tr:'I need to lodge my tax return with the ATO', rom:'Australian Tax Office — lodge online via myTax. July 1 is tax year start.' },
      { en:'Which beach is safe?', tr:'Is this beach patrolled? Are the flags up?', rom:'Swim between yellow-red flags ONLY at patrolled beaches' },
      { en:'Student discount?', tr:'Do you have a student price? I have my student card.', rom:'Show University Student ID. Many places give 10–20% off.' },
    ],
    banks:[
      { ico:'🏦', name:'Up Bank', badge:'rec', rows:[{ k:'Open with', v:'Passport (app only)' },{ k:'Fee', v:'A$0/month' },{ k:'Card', v:'Visa Debit' },{ k:'Best for', v:'2% savings interest' }] },
      { ico:'🏛', name:'Commonwealth', badge:'ok', rows:[{ k:'Open with', v:'Passport + visa' },{ k:'Fee', v:'A$0 student' },{ k:'Card', v:'Visa/Mastercard' },{ k:'Good for', v:'Widest branch/ATM network' }] },
      { ico:'💚', name:'ING Australia', badge:'ok', rows:[{ k:'Open with', v:'Passport' },{ k:'Fee', v:'A$0' },{ k:'Perks', v:'ATM fee rebates' },{ k:'Best for', v:'Savings and spending' }] },
    ],
    weather:[
      { month:'Mar–May', ico:'🍂', temp:'14°C to 24°C', desc:'Melbourne autumn — gorgeous', tip:'Layers. Melbourne changes 4 times a day.' },
      { month:'Jun–Aug', ico:'🌧', temp:'8°C to 15°C', desc:'Melbourne "winter" — mild but wet', tip:'Waterproof jacket. No central heating in old homes!' },
      { month:'Sep–Nov', ico:'🌺', temp:'15°C to 26°C', desc:'Spring — footy finals, gardens bloom', tip:'Best time to arrive. Beautiful city.' },
      { month:'Dec–Feb', ico:'🔥', temp:'22°C to 42°C', desc:'Summer — hot, UV extreme', tip:'SPF 50+ daily. Bushfire smoke possible.' },
    ],
    community:[
      { ico:'🇮🇳', name:'Indian Student Association Australia', type:'University & national', desc:'ISAA events across Melbourne, Sydney, Brisbane. Diwali, cricket tournaments, cultural events.', action:'Find Chapter' },
      { ico:'🏏', name:'Indian Cricket Leagues', type:'Weekend sport', desc:'Every Australian city has active Indian cricket leagues. Best way to build community fast.', action:'Find Nearby League' },
      { ico:'🌍', name:'InterNations Melbourne', type:'Expat networking', desc:'Monthly events for internationals. Good for meeting non-Indians and industry professionals.', action:'View Events' },
      { ico:'🌱', name:'Vic Indian Farmers / Food Coop', type:'Community food', desc:'Indian grocery co-ops in Melbourne (Dandenong area). Bulk spices, fresh ingredients at Indian prices.', action:'Find Dandenong Markets' },
    ],
    mental:[
      { ico:'💬', name:'University Counselling', desc:'All Australian universities offer free counselling. Melbourne, UNSW, UQ all have excellent services. Book in orientation week.', contact:'Your university portal' },
      { ico:'📞', name:'Lifeline', desc:'13 11 14 — 24/7 crisis support. Available by phone, text (0477 13 11 14), and online chat. Free.', contact:'13 11 14' },
      { ico:'🌐', name:'ReachOut Australia', desc:'Australia\'s leading youth mental health platform. Built specifically for 16–25 year olds. Content available in multiple languages.', contact:'au.reachout.com' },
    ],
    kit:[
      { ico:'📄', name:'Critical Documents', items:['Passport + all visa stamps','Student visa (subclass 500) grant letter','OSHC health insurance certificate','CoE (Confirmation of Enrolment)','University acceptance letter','Emergency contacts (Indian High Commission Canberra)'] },
      { ico:'🌞', name:'Australia Survival', items:['SPF 50+ sunscreen (seriously)','Sunglasses (polarised — UV is real)','Wide-brim hat','Insect repellent (DEET-based)','Reusable water bottle (tap water is drinkable)','Flyscreen check in accommodation'] },
      { ico:'💊', name:'Health Setup', items:['OSHC card (download after activation)','Prescriptions + generic names','Nearest bulk-billing GP (free with Medicare — check after visa)','Dental check before departure','Register with campus health service','Mental health resources list'] },
    ],
    phases:[
      { phase:'WEEK 1', num:'01', col:'var(--rose)', tasks:[
        { title:'Activate OSHC Health Insurance', desc:'Download your AHM/Bupa/Medibank OSHC app. Your card is needed for GP and hospital visits.', urg:'today' },
        { title:'Open Up Bank or Commonwealth Bank Account', desc:'Up Bank: download app, passport selfie. Commonwealth: visit branch with passport + visa. Both are free.', urg:'today' },
        { title:'Get an Australian SIM', desc:'Woolworths Mobile (A$15/20GB) is best value. Buy at Woolworths supermarket. Activate with passport.', urg:'today' },
        { title:'Register with Your University International Office', desc:'Mandatory orientation session. CoE and visa are checked. Pick up student ID.', urg:'today' },
        { title:'Apply for Tax File Number (TFN)', desc:'Do this online at ATO.gov.au. Takes 28 days. Needed before you can work or lodge tax returns.', urg:'today' },
        { title:'Find Nearest Bulk Billing GP', desc:'Bulk billing = free doctor visits. Find via HotDoc app. Register before you get sick.', urg:'week' },
        { title:'Get Myki / Opal Card', desc:'Melbourne: 7-Eleven or online. Sydney: train stations. Load A$20 to start.', urg:'today' },
      ]},
      { phase:'MONTH 1', num:'02', col:'var(--amber)', tasks:[
        { title:'Apply for Medicare (if eligible)', desc:'Some visa types qualify for Medicare after 6 months. Check with your international office. Significant cost saving.', urg:'week' },
        { title:'Find Indian Grocery Near You', desc:'Dandenong (Melbourne) and Parramatta (Sydney) are the main Indian hubs. Stock up on spices once a month.', urg:'week' },
        { title:'Understand Your 48-Hour Fortnightly Work Limit', desc:'Max 48 hours work per fortnight during study. Unlimited during official university holidays. Violations are serious.', urg:'week' },
        { title:'Find a Casual Job (if desired)', desc:'Most Indian students work in restaurants, retail, or tutoring. Seek or Indeed for casual work. Min wage A$23.23/hr.', urg:'month' },
        { title:'Register for Gym / Campus Sports', desc:'Most Australian universities have excellent and cheap gym access. Melbourne Uni gym is A$100/semester.', urg:'month' },
        { title:'Connect with Indian Student Association', desc:'ISAA chapter at your university. Cricket tournament usually in Month 2–3. Indian Diwali in October/November.', urg:'month' },
        { title:'Explore Melbourne or Sydney by Foot', desc:'City Circle Tram (Melbourne, free). Sydney Ferry (cheapest way to see harbour). Do this in Month 1.', urg:'month' },
      ]},
      { phase:'MONTH 2–3', num:'03', col:'var(--teal)', tasks:[
        { title:'Understand 485 Graduate Visa Timeline', desc:'Apply within 6 months of course completion. 4 years for STEM in Australia. Start planning now.', urg:'month' },
        { title:'File Australian Tax Return (after June 30)', desc:'ATO\'s myTax is simple. Indian students working casually often get partial tax refund. Lodge by October 31.', urg:'month' },
        { title:'Explore the Great Ocean Road', desc:'Melbourne → Great Ocean Road → 12 Apostles. Rent car with friends. Best weekend trip in Australia.', urg:'nice' },
        { title:'Apply for Permanent Residency Research', desc:'PGWP + PR pathway exists. Partner with migration agent in Month 3 to understand your specific pathway.', urg:'nice' },
        { title:'LinkedIn Australian Network', desc:'Connect with Indian alumni at Melbourne/Sydney companies — ANZ, Atlassian, Canva, Afterpay all active recruiters.', urg:'month' },
      ]},
    ],
  },
};

const SECTION_TABS = [
  { key:'tasks', label:'Phase Tasks', ico:'✅' },
  { key:'map', label:'City Guide', ico:'🗺️' },
  { key:'emergency', label:'Emergency', ico:'🚨' },
  { key:'transport', label:'Transport', ico:'🚇' },
  { key:'costs', label:'Cost Tracker', ico:'💰' },
  { key:'apps', label:'Apps to Get', ico:'📱' },
  { key:'culture', label:'Culture Tips', ico:'🎭' },
  { key:'banks', label:'Banking', ico:'🏦' },
  { key:'phrases', label:'Phrasebook', ico:'💬' },
  { key:'weather', label:'Weather', ico:'🌤' },
  { key:'community', label:'Community', ico:'👥' },
  { key:'mental', label:'Wellbeing', ico:'🧠' },
  { key:'kit', label:'Survival Kit', ico:'🎒' },
];

/* ══════════════════════════════════════════════════════════
   MINI PROGRESS RING
══════════════════════════════════════════════════════════ */
function Ring({ pct, col, size = 36 }) {
  const r = (size - 6) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,.06)" strokeWidth="3"/>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={col} strokeWidth="3"
        strokeLinecap="round" strokeDasharray={`${dash.toFixed(1)} ${circ.toFixed(1)}`}
        transform={`rotate(-90 ${size/2} ${size/2})`}/>
      <text x={size/2} y={size/2 + 4} textAnchor="middle"
        fontFamily="'Bebas Neue',sans-serif" fontSize="9" fill={col}>{pct}%</text>
    </svg>
  );
}

/* ══════════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════════ */
export default function First90Days() {
  const [selCountry, setSelCountry] = useState('de');
  const [activeSection, setActiveSection] = useState('tasks');
  const [openPhases, setOpenPhases] = useState({ 0: true });
  const [checked, setChecked] = useState({});
  const [kitChecked, setKitChecked] = useState({});

  const C = COUNTRIES[selCountry];

  // Load/save from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('f90-checked');
      if (saved) setChecked(JSON.parse(saved));
      const savedKit = localStorage.getItem('f90-kit');
      if (savedKit) setKitChecked(JSON.parse(savedKit));
    } catch {}
  }, []);

  useEffect(() => {
    try { localStorage.setItem('f90-checked', JSON.stringify(checked)); } catch {}
  }, [checked]);

  useEffect(() => {
    try { localStorage.setItem('f90-kit', JSON.stringify(kitChecked)); } catch {}
  }, [kitChecked]);

  const toggleTask = useCallback((key) => {
    setChecked(p => ({ ...p, [key]: !p[key] }));
  }, []);

  const toggleKit = useCallback((key) => {
    setKitChecked(p => ({ ...p, [key]: !p[key] }));
  }, []);

  const togglePhase = (i) => setOpenPhases(p => ({ ...p, [i]: !p[i] }));

  // Compute totals
  const allTasks = C.phases.flatMap((ph, pi) => ph.tasks.map((_, ti) => `${selCountry}-${pi}-${ti}`));
  const doneCount = allTasks.filter(k => checked[k]).length;
  const globalPct = allTasks.length ? Math.round((doneCount / allTasks.length) * 100) : 0;

  const phasePcts = C.phases.map((ph, pi) => {
    const keys = ph.tasks.map((_, ti) => `${selCountry}-${pi}-${ti}`);
    const done = keys.filter(k => checked[k]).length;
    return keys.length ? Math.round((done / keys.length) * 100) : 0;
  });

  const urgMap = { today: 'today', week: 'week', month: 'month', nice: 'nice' };
  const urgLabel = { today: '⚡ TODAY', week: '⚠ THIS WEEK', month: '📋 THIS MONTH', nice: '✅ NICE TO HAVE' };

  return (
    <div className="f90-root">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="f90-orb f90-orb-a" />
      <div className="f90-orb f90-orb-b" />
      <div className="f90-orb f90-orb-c" />
      <div className="f90-grid" />
      <div className="f90-scan" />
      <div className="f90-sweep" />

      {/* TOPBAR */}
      <div className="f90-top">
        <div className="f90-logo">
          <div className="f90-logo-gem">🌉</div>
          Mentor<em>Bridge</em>
        </div>
        <div className="tb-div" />
        <div>
          <div style={{ fontFamily:'var(--ffh)', fontSize:'1.1rem', letterSpacing:'.06em', color:'#fff' }}>FIRST 90 DAYS</div>
          <div style={{ fontFamily:'var(--ffm)', fontSize:'.58rem', color:'var(--t2)' }}>SURVIVAL INTELLIGENCE · 5 COUNTRIES</div>
        </div>
        <div className="tb-sp" />
        <div className="tb-pill">
          <div className="tb-pulse" />
          {doneCount} OF {allTasks.length} TASKS DONE
        </div>
        <button className="tb-back" onClick={() => {}}>← Dashboard</button>
      </div>

      <div className="f90-wrap">

        {/* HERO */}
        <div className="f90-hero fu">
          <div className="f90-eyebrow">Your Complete Relocation Intelligence System</div>
          <div className="f90-h1">FIRST <span className="grad">90</span><br/>DAYS</div>
          <p className="f90-sub">
            Everything you need to land, settle, and thrive — broken into phases, personalised per country,
            with city maps, cost trackers, transport guides, cultural intelligence, and community connections.
          </p>
          <div className="f90-hero-stats">
            <div className="fhs"><div className="fhs-n">5</div><div className="fhs-l">Countries</div></div>
            <div className="fhs-div" />
            <div className="fhs"><div className="fhs-n">85+</div><div className="fhs-l">Tasks</div></div>
            <div className="fhs-div" />
            <div className="fhs"><div className="fhs-n">3</div><div className="fhs-l">Phases</div></div>
            <div className="fhs-div" />
            <div className="fhs"><div className="fhs-n">12</div><div className="fhs-l">Sections</div></div>
            <div className="fhs-div" />
            <div className="fhs" style={{ minWidth: 80 }}>
              <div className="fhs-n" style={{ color: globalPct > 70 ? 'var(--teal)' : globalPct > 30 ? 'var(--amber)' : 'var(--rose)' }}>{globalPct}%</div>
              <div className="fhs-l">Complete</div>
            </div>
          </div>
          <div className="f90-progress-global">
            <div className="fpg-label">
              <span>Overall Progress — {C.name}</span>
              <span style={{ color: 'var(--teal)' }}>{doneCount}/{allTasks.length} tasks</span>
            </div>
            <div className="fpg-track"><div className="fpg-fill" style={{ width: `${globalPct}%` }} /></div>
          </div>
        </div>

        {/* COUNTRY SELECTOR */}
        <div className="f90-cs fu">
          {Object.entries(COUNTRIES).map(([key, c]) => {
            const tasks = c.phases.flatMap((ph, pi) => ph.tasks.map((_, ti) => `${key}-${pi}-${ti}`));
            const done = tasks.filter(k => checked[k]).length;
            const pct = tasks.length ? Math.round((done / tasks.length) * 100) : 0;
            const sel = selCountry === key;
            return (
              <div key={key} className={`f90-cc${sel ? ' sel' : ''}`}
                style={{
                  borderColor: sel ? c.col : `${c.col}30`,
                  boxShadow: sel ? `0 0 28px ${c.glow}, inset 0 0 28px ${c.col}08` : '0 4px 20px rgba(0,0,0,.3)',
                  background: sel ? `linear-gradient(160deg,${c.col}14,${c.col}06,var(--bg2))` : undefined,
                }}
                onClick={() => { setSelCountry(key); setActiveSection('tasks'); setOpenPhases({ 0: true }); }}>
                <div className="f90-cc-shine" />
                <div style={{ position:'absolute', inset:0, background:`radial-gradient(ellipse at 50% 0%,${c.col}18,transparent 65%)`, pointerEvents:'none', borderRadius:14 }} />
                <div className="f90-cc-flag"><img src={c.flag} alt={c.name} /></div>
                <div className="f90-cc-name">{c.name}</div>
                <div className="f90-cc-city">{c.city}</div>
                <div className="f90-cc-pct" style={{ background:`${c.col}18`, border:`1px solid ${c.col}44`, color:c.col }}>{pct}% done</div>
                <div className="f90-cc-ring"><Ring pct={pct} col={c.col} /></div>
              </div>
            );
          })}
        </div>

        {/* SECTION TABS */}
        <div className="f90-tabs fu">
          {SECTION_TABS.map(t => (
            <div key={t.key} className={`f90-tab${activeSection === t.key ? ' active' : ''}`}
              onClick={() => setActiveSection(t.key)}>
              {t.ico} {t.label}
            </div>
          ))}
        </div>

        {/* ══ TASKS ══ */}
        {activeSection === 'tasks' && (
          <div className="fu">
            {/* Mark all / reset row */}
            <div style={{ display:'flex', gap:10, marginBottom:14, flexWrap:'wrap' }}>
              <button className="btn btn-ghost btn-sm" onClick={() => {
                const updates = {};
                C.phases.forEach((ph, pi) => ph.tasks.forEach((_, ti) => { updates[`${selCountry}-${pi}-${ti}`] = true; }));
                setChecked(p => ({ ...p, ...updates }));
              }}>✅ Mark All Done</button>
              <button className="btn btn-ghost btn-sm" onClick={() => {
                const updates = {};
                C.phases.forEach((ph, pi) => ph.tasks.forEach((_, ti) => { updates[`${selCountry}-${pi}-${ti}`] = false; }));
                setChecked(p => ({ ...p, ...updates }));
              }}>↺ Reset {C.name}</button>
              <div style={{ marginLeft:'auto', fontFamily:'var(--ffm)', fontSize:'.68rem', color:'var(--t2)', display:'flex', alignItems:'center', gap:6 }}>
                <img src={C.flag} alt="" style={{ width:20, height:20, borderRadius:'50%', objectFit:'cover' }} />
                {C.name} · {C.city} · {C.currency} · {C.timezone}
              </div>
            </div>

            {C.phases.map((phase, pi) => (
              <div key={pi} className="phase-block">
                <div className="phase-head" onClick={() => togglePhase(pi)}>
                  <div className="phase-num" style={{ color: phase.col }}>{phase.num}</div>
                  <div className="phase-meta">
                    <div className="phase-title">{phase.phase}</div>
                    <div className="phase-sub">{phase.tasks.length} tasks · {phasePcts[pi]}% complete</div>
                  </div>
                  <div className="phase-stats">
                    <Ring pct={phasePcts[pi]} col={phase.col} />
                    <div className="phase-pct" style={{ color: phase.col }}>{phasePcts[pi]}%</div>
                  </div>
                  <div className={`phase-arrow${openPhases[pi] ? ' open' : ''}`}>▼</div>
                </div>
                <div className={`phase-body${openPhases[pi] ? ' open' : ''}`}>
                  <div className="tasks-grid">
                    {phase.tasks.map((task, ti) => {
                      const key = `${selCountry}-${pi}-${ti}`;
                      const done = checked[key];
                      return (
                        <div key={ti} className={`task-item${done ? ' done' : ''}`} onClick={() => toggleTask(key)}>
                          <div className={`task-cb${done ? ' checked' : ''}`}>
                            {done && <span className="task-cb-inner">✓</span>}
                          </div>
                          <div className="task-content">
                            <div className="task-title">{task.title}</div>
                            <div className="task-desc">{task.desc}</div>
                            <div className="task-badges">
                              {task.urg === 'today' && <span className="urg-today">⚡ TODAY</span>}
                              {task.urg === 'week' && <span className="urg-week">⚠ THIS WEEK</span>}
                              {task.urg === 'month' && <span className="urg-month">📋 THIS MONTH</span>}
                              {task.urg === 'nice' && <span className="urg-nice">✅ NICE TO HAVE</span>}
                              {task.link && <span className="task-link">🔗 {task.link}</span>}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ══ CITY MAP ══ */}
        {activeSection === 'map' && (
          <div className="fu">
            <div className="city-map-wrap">
              <div className="cm-head">
                <div className="cm-title">
                  <img src={C.flag} alt="" style={{ width:24, height:24, borderRadius:'50%', objectFit:'cover' }} />
                  {C.name} — {C.city} · Neighbourhood Guide
                </div>
                <span className="tag tag-cyan">{C.neighborhoods.length} neighbourhoods</span>
              </div>
              <div className="cm-body">
                <div className="cm-map">
                  <iframe src={C.mapSrc} className="cm-iframe" allowFullScreen loading="lazy" />
                </div>
                <div className="cm-info">
                  <div style={{ fontFamily:'var(--ffm)', fontSize:'.6rem', color:'var(--t2)', letterSpacing:'.1em', textTransform:'uppercase', marginBottom:8 }}>Top Neighbourhoods for Students</div>
                  {C.neighborhoods.map((n, i) => (
                    <div key={i} className="nbh-item">
                      <div className="nbh-name">{n.name}</div>
                      <div className="nbh-tags">{n.tags.map(t => <span key={t} className="nbh-tag">{t}</span>)}</div>
                      <div className="nbh-desc">{n.desc}</div>
                      <div className="nbh-rent">💰 {n.rent}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ══ EMERGENCY ══ */}
        {activeSection === 'emergency' && (
          <div className="fu">
            <div className="section-title">🚨 Emergency Numbers — {C.name}</div>
            <div className="section-sub">Save these in your phone before you land. Screenshot this page.</div>
            <div className="emg-grid">
              {C.emergency.map((e, i) => (
                <div key={i} className={`emg-card emg-${e.type}`}>
                  <div className="emg-ico">{e.ico}</div>
                  <div className="emg-name">{e.name}</div>
                  <div className="emg-num">{e.num}</div>
                  <div className="emg-desc">{e.desc}</div>
                </div>
              ))}
            </div>
            <div className="card-wrap" style={{ marginTop:16 }}>
              <div style={{ fontFamily:'var(--ffm)', fontSize:'.68rem', color:'var(--amber)', lineHeight:1.65 }}>
                ⚠ <strong style={{ color:'var(--t)' }}>Before you land:</strong> Save ALL these numbers. Screenshot this page. Email it to yourself.
                Add "Indian Embassy {C.name}" as a contact in your phone. This takes 3 minutes and could save your life or trip.
              </div>
            </div>
          </div>
        )}

        {/* ══ TRANSPORT ══ */}
        {activeSection === 'transport' && (
          <div className="fu">
            <div className="section-title">🚇 Getting Around — {C.name}</div>
            <div className="section-sub">How to move efficiently and affordably in {C.city}.</div>
            <div className="transport-grid">
              {C.transport.map((t, i) => (
                <div key={i} className="transport-card">
                  <div className="tc-head">
                    <div className="tc-ico" style={{ background:`${t.col}18`, border:`1px solid ${t.col}44` }}>{t.ico}</div>
                    <div><div className="tc-name">{t.name}</div><div className="tc-type">{t.type}</div></div>
                  </div>
                  <div className="tc-rows">
                    {t.rows.map((r, j) => (
                      <div key={j} className="tc-row">
                        <span className="tc-label">{r.k}</span>
                        <span className={`tc-val${r.pro ? ' tc-pro' : ''}`}>{r.v}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ══ COSTS ══ */}
        {activeSection === 'costs' && (
          <div className="fu">
            <div className="section-title">💰 Cost Tracker — {C.name}</div>
            <div className="section-sub">Real monthly budget breakdown for {C.city} as a student. No sugarcoating.</div>
            <div className="cost-grid">
              {C.costs.items.map((item, i) => (
                <div key={i} className="cost-card">
                  <div className="cost-ico">{item.ico}</div>
                  <div className="cost-val">{item.val}</div>
                  <div className="cost-lbl">{item.label}</div>
                </div>
              ))}
            </div>
            <div className="budget-bar-wrap">
              <div className="bb-title">
                <span>Monthly Budget Breakdown</span>
                <span style={{ fontFamily:'var(--ffm)', fontSize:'.8rem', color:'var(--teal)' }}>
                  ~{C.currency.split(' ')[1]}{C.costs.total.toLocaleString()}/mo total
                </span>
              </div>
              {[
                { label:'Rent', val: C.costs.rent, max: C.costs.total, col:'var(--cyan)' },
                { label:'Food', val: C.costs.food, max: C.costs.total, col:'var(--teal)' },
                { label:'Transport', val: C.costs.transport, max: C.costs.total, col:'var(--purple)' },
                { label:'Health', val: C.costs.health, max: C.costs.total, col:'var(--amber)' },
                { label:'Misc', val: C.costs.misc, max: C.costs.total, col:'var(--sky)' },
              ].map((b, i) => (
                <div key={i} className="bb-row">
                  <div className="bb-label">{b.label}</div>
                  <div className="bb-track"><div className="bb-fill" style={{ width:`${(b.val/b.max)*100}%`, background:b.col }} /></div>
                  <div className="bb-val">{C.currency.split(' ')[1]}{b.val}</div>
                </div>
              ))}
            </div>
            <div className="card-wrap">
              <div style={{ fontFamily:'var(--ffm)', fontSize:'.68rem', color:'var(--t2)', lineHeight:1.7 }}>
                💡 <strong style={{ color:'var(--t)' }}>Money-saving rule:</strong> Cook 5 days a week. Students who cook save
                {' '}<strong style={{ color:'var(--teal)' }}>30–40%</strong> compared to those who eat out daily.
                Indian food is the cheapest cuisine to cook at home almost everywhere.
              </div>
            </div>
          </div>
        )}

        {/* ══ APPS ══ */}
        {activeSection === 'apps' && (
          <div className="fu">
            <div className="section-title">📱 Essential Apps — {C.name}</div>
            <div className="section-sub">Download these before or immediately after landing. They will save you time and money.</div>
            <div className="apps-grid">
              {C.apps.map((app, i) => (
                <div key={i} className="app-card">
                  <div className="app-ico">{app.ico}</div>
                  <div className="app-name">{app.name}</div>
                  <div className="app-cat">{app.cat}</div>
                  <div className="app-desc">{app.desc}</div>
                  <div className="app-badge">{app.badge}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ══ CULTURE ══ */}
        {activeSection === 'culture' && (
          <div className="fu">
            <div className="section-title">🎭 Culture Guide — {C.name}</div>
            <div className="section-sub">What no university brochure tells you. Read before your first week.</div>
            <div className="culture-grid">
              <div className="culture-card">
                <div className="cc-head"><div className="cc-head-ico">✅</div><div className="cc-head-title">Do These</div></div>
                <div className="cc-items">
                  {C.culture.dos.map((d, i) => (
                    <div key={i} className="cc-item cc-do"><div className="cc-item-ico">{d.ico}</div><div>{d.text}</div></div>
                  ))}
                </div>
              </div>
              <div className="culture-card">
                <div className="cc-head"><div className="cc-head-ico">❌</div><div className="cc-head-title">Never Do These</div></div>
                <div className="cc-items">
                  {C.culture.donts.map((d, i) => (
                    <div key={i} className="cc-item cc-dont"><div className="cc-item-ico">{d.ico}</div><div>{d.text}</div></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ══ BANKS ══ */}
        {activeSection === 'banks' && (
          <div className="fu">
            <div className="section-title">🏦 Banking Setup — {C.name}</div>
            <div className="section-sub">Best bank accounts for Indian students — ranked by ease of opening and value.</div>
            <div className="bank-grid">
              {C.banks.map((b, i) => (
                <div key={i} className="bank-card">
                  <div className="bank-head">
                    <div className="bank-ico">{b.ico}</div>
                    <div className="bank-name">{b.name}</div>
                    <div className={`bank-badge bank-${b.badge}`}>{b.badge === 'rec' ? '⭐ RECOMMENDED' : '✓ GOOD'}</div>
                  </div>
                  <div className="bank-rows">
                    {b.rows.map((r, j) => (
                      <div key={j} className="bank-row">
                        <span className="bank-k">{r.k}</span>
                        <span className="bank-v">{r.v}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="card-wrap" style={{ marginTop:14 }}>
              <div style={{ fontFamily:'var(--ffm)', fontSize:'.68rem', color:'var(--t2)', lineHeight:1.7 }}>
                💡 <strong style={{ color:'var(--t)' }}>INR → {C.currency.split(' ')[0]} transfers:</strong> Always use{' '}
                <strong style={{ color:'var(--cyan)' }}>Wise (TransferWise)</strong> instead of your Indian bank's wire transfer.
                Savings: 2–4% on every transfer. On ₹10 lakh that's ₹20,000–40,000 saved per year.
              </div>
            </div>
          </div>
        )}

        {/* ══ PHRASES ══ */}
        {activeSection === 'phrases' && (
          <div className="fu">
            <div className="section-title">💬 Phrasebook — {C.language}</div>
            <div className="section-sub">The most important phrases for your first 90 days. Pronunciation included.</div>
            <div className="phrase-grid">
              <div className="phrase-card">
                <div className="pc-head">🗣 Essential Phrases</div>
                <div className="pc-items">
                  {C.phrases.slice(0, Math.ceil(C.phrases.length/2)).map((p, i) => (
                    <div key={i} className="pc-item">
                      <div className="pc-en">{p.en}</div>
                      <div className="pc-translated">{p.tr}</div>
                      <div className="pc-romanized">{p.rom}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="phrase-card">
                <div className="pc-head">🏛 Official & Practical</div>
                <div className="pc-items">
                  {C.phrases.slice(Math.ceil(C.phrases.length/2)).map((p, i) => (
                    <div key={i} className="pc-item">
                      <div className="pc-en">{p.en}</div>
                      <div className="pc-translated">{p.tr}</div>
                      <div className="pc-romanized">{p.rom}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ══ WEATHER ══ */}
        {activeSection === 'weather' && (
          <div className="fu">
            <div className="section-title">🌤 Weather & Packing — {C.name}</div>
            <div className="section-sub">What to pack, when to wear it, and what surprises first-time arrivals.</div>
            <div className="weather-grid">
              {C.weather.map((w, i) => (
                <div key={i} className="weather-card">
                  <div className="wc-month">{w.month}</div>
                  <div className="wc-ico">{w.ico}</div>
                  <div className="wc-temp">{w.temp}</div>
                  <div className="wc-desc">{w.desc}</div>
                  <div className="wc-tip">💡 {w.tip}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ══ COMMUNITY ══ */}
        {activeSection === 'community' && (
          <div className="fu">
            <div className="section-title">👥 Community — {C.name}</div>
            <div className="section-sub">Your people are already there. Connect in your first month — it gets dramatically harder after.</div>
            <div className="community-grid">
              {C.community.map((c, i) => (
                <div key={i} className="comm-card">
                  <div className="comm-head">
                    <div className="comm-ico">{c.ico}</div>
                    <div><div className="comm-name">{c.name}</div><div className="comm-type">{c.type}</div></div>
                  </div>
                  <div className="comm-desc">{c.desc}</div>
                  <button className="comm-btn">{c.action} →</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ══ MENTAL HEALTH ══ */}
        {activeSection === 'mental' && (
          <div className="fu">
            <div className="section-title">🧠 Mental Wellbeing — {C.name}</div>
            <div className="section-sub">International students face loneliness, academic pressure, and culture shock simultaneously. These resources exist for exactly this. Use them early, not as a last resort.</div>
            <div className="mh-grid">
              {C.mental.map((m, i) => (
                <div key={i} className="mh-card">
                  <div className="mh-ico">{m.ico}</div>
                  <div className="mh-title">{m.name}</div>
                  <div className="mh-desc">{m.desc}</div>
                  <div className="mh-contact">{m.contact}</div>
                </div>
              ))}
            </div>
            <div className="card-wrap" style={{ marginTop:14, borderColor:'rgba(168,85,247,.2)' }}>
              <div style={{ fontFamily:'var(--ffm)', fontSize:'.7rem', color:'var(--t2)', lineHeight:1.7 }}>
                🌿 <strong style={{ color:'#fff' }}>Culture shock is real.</strong> Most students feel it between Month 1 and Month 3.
                Symptoms: homesickness, irritability, exhaustion, and questioning your decision. This is{' '}
                <strong style={{ color:'var(--purple)' }}>completely normal</strong> and passes. The students who reach out to support resources
                in Month 1 perform significantly better academically in Month 6.
              </div>
            </div>
          </div>
        )}

        {/* ══ SURVIVAL KIT ══ */}
        {activeSection === 'kit' && (
          <div className="fu">
            <div className="section-title">🎒 Survival Kit — {C.name}</div>
            <div className="section-sub">Pack and check these before departure. Items marked with a checkbox — tick them off as you prepare.</div>
            <div className="kit-grid">
              {C.kit.map((k, ki) => (
                <div key={ki} className="kit-card">
                  <div className="kit-head"><div className="kit-ico">{k.ico}</div><div className="kit-title">{k.name}</div></div>
                  <div className="kit-items">
                    {k.items.map((item, ii) => {
                      const key = `${selCountry}-kit-${ki}-${ii}`;
                      return (
                        <div key={ii} className="kit-item" onClick={() => toggleKit(key)}>
                          <div className={`kit-cb${kitChecked[key] ? ' on' : ''}`}>
                            {kitChecked[key] && <span style={{ fontSize:8, color:'#020a12' }}>✓</span>}
                          </div>
                          <span style={{ textDecoration: kitChecked[key] ? 'line-through' : 'none', color: kitChecked[key] ? 'var(--t3)' : 'var(--t2)' }}>{item}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}