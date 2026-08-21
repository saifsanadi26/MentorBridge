'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';

/* ══════════════════════════════════════════════════════════════
   CSS STYLES
══════════════════════════════════════════════════════════════ */
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Mono:wght@400;500&family=Syne:wght@400;600;700;800&family=Lora:ital,wght@0,400;0,500;1,400&display=swap');

  :root {
    --bg:#03060E; --bg1:#060B18; --bg2:#090F1F; --bg3:#0D1628; --bg4:#111E35;
    --cyan:#00F5FF; --teal:#00E5A8; --amber:#F59E0B; --purple:#A855F7;
    --rose:#FB4D6D; --sky:#38BDF8; --green:#22D3A0;
    --b:rgba(0,245,255,.07); --bh:rgba(0,245,255,.18); --bb:rgba(0,245,255,.4);
    --t:#BDD0EE; --t2:#4A6080; --t3:#1C2C44;
    --ffh:'Bebas Neue',sans-serif; --ffb:'Syne',sans-serif;
    --ffm:'DM Mono',monospace; --ffsop:'Lora',serif;
  }

  .sop-root { background:var(--bg); color:var(--t); font-family:var(--ffb); min-height:100vh; position:relative; overflow-x:hidden; }
  .sop-root * { box-sizing:border-box; margin:0; padding:0; }
  .sop-root ::-webkit-scrollbar { width:3px; background:transparent; }
  .sop-root ::-webkit-scrollbar-thumb { background:rgba(0,245,255,.1); border-radius:3px; }

  /* ── AMBIENCE ── */
  .sop-amb { position:fixed; inset:0; z-index:0; pointer-events:none;
    background:radial-gradient(ellipse 70% 50% at 20% 10%,rgba(0,245,255,.04),transparent 60%),
               radial-gradient(ellipse 55% 60% at 85% 85%,rgba(168,85,247,.035),transparent 60%),
               radial-gradient(ellipse 40% 40% at 60% 30%,rgba(0,229,168,.025),transparent 55%); }
  .sop-hex { position:fixed; inset:0; z-index:0; pointer-events:none; opacity:.017;
    background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='104'%3E%3Cpolygon points='30,2 58,17 58,47 30,62 2,47 2,17' fill='none' stroke='%2300F5FF' stroke-width='.8'/%3E%3Cpolygon points='30,54 58,69 58,99 30,114 2,99 2,69' fill='none' stroke='%2300F5FF' stroke-width='.8'/%3E%3C/svg%3E"); }
  .sop-scan { position:fixed; inset:0; z-index:0; pointer-events:none;
    background:repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,.03) 2px,rgba(0,0,0,.03) 4px);
    animation:scanMove 18s linear infinite; }
  @keyframes scanMove{100%{background-position:0 200px}}

  /* ── TOPBAR ── */
  .sop-topbar { position:sticky; top:0; z-index:200; height:58px;
    background:rgba(3,6,14,.92); backdrop-filter:blur(24px);
    border-bottom:1px solid var(--b); display:flex; align-items:center; padding:0 28px; gap:14px; }
  .sop-logo { display:flex; align-items:center; gap:9px; font-family:var(--ffh); font-size:17px; color:#fff; letter-spacing:.05em; cursor:pointer; }
  .sop-logo-gem { width:30px; height:30px; border-radius:8px; background:linear-gradient(135deg,rgba(0,245,255,.15),rgba(168,85,247,.12)); border:1.5px solid rgba(0,245,255,.35); display:flex; align-items:center; justify-content:center; font-size:14px; box-shadow:0 0 16px rgba(0,245,255,.2); animation:gemGlow 4s ease-in-out infinite; }
  @keyframes gemGlow{0%,100%{box-shadow:0 0 16px rgba(0,245,255,.2)}50%{box-shadow:0 0 28px rgba(0,245,255,.45)}}
  .sop-logo em { font-style:normal; color:var(--cyan); }
  .sop-tb-sep { width:1px; height:22px; background:var(--b); }
  .sop-tb-title { font-family:var(--ffh); font-size:1.1rem; letter-spacing:.07em; color:#fff; }
  .sop-tb-sub { font-family:var(--ffm); font-size:.62rem; color:var(--t2); }
  .sop-tb-sp { flex:1; }
  .sop-tb-phase { font-family:var(--ffm); font-size:.62rem; color:var(--cyan); background:rgba(0,245,255,.07); border:1px solid rgba(0,245,255,.18); padding:4px 12px; border-radius:20px; letter-spacing:.08em; }
  .sop-tb-btn { width:32px; height:32px; background:var(--bg2); border:1px solid var(--b); border-radius:7px; display:flex; align-items:center; justify-content:center; cursor:pointer; font-size:12px; transition:all .2s; }
  .sop-tb-btn:hover { border-color:var(--bh); background:var(--bg3); }

  /* ── PHASE INDICATOR ── */
  .phase-bar { height:2px; background:rgba(255,255,255,.04); position:relative; z-index:1; }
  .phase-fill { height:100%; background:linear-gradient(90deg,var(--cyan),var(--teal),var(--purple)); transition:width .6s ease; }
  .phase-steps { display:flex; align-items:center; justify-content:center; gap:0; padding:14px 28px; background:rgba(6,11,24,.6); border-bottom:1px solid var(--b); position:relative; z-index:1; }
  .phase-step { display:flex; align-items:center; gap:8px; }
  .phase-step-dot { width:28px; height:28px; border-radius:50%; border:2px solid; display:flex; align-items:center; justify-content:center; font-family:var(--ffm); font-size:.65rem; font-weight:600; transition:all .3s; }
  .phase-step-dot.done { background:var(--teal); border-color:var(--teal); color:#020a12; }
  .phase-step-dot.active { background:rgba(0,245,255,.1); border-color:var(--cyan); color:var(--cyan); box-shadow:0 0 14px rgba(0,245,255,.25); }
  .phase-step-dot.future { background:transparent; border-color:var(--t3); color:var(--t3); }
  .phase-step-label { font-family:var(--ffm); font-size:.62rem; letter-spacing:.07em; text-transform:uppercase; }
  .phase-step-label.active { color:var(--cyan); }
  .phase-step-label.done { color:var(--teal); }
  .phase-step-label.future { color:var(--t3); }
  .phase-connector { width:60px; height:1px; background:var(--t3); margin:0 6px; }
  .phase-connector.done { background:var(--teal); }

  /* ── QUIZ PHASE ── */
  .quiz-outer { position:relative; z-index:2; max-width:780px; margin:0 auto; padding:44px 28px 80px; }
  .quiz-progress { margin-bottom:36px; }
  .qp-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:8px; }
  .qp-label { font-family:var(--ffm); font-size:.62rem; color:var(--t2); letter-spacing:.1em; text-transform:uppercase; }
  .qp-num { font-family:var(--ffm); font-size:.72rem; color:var(--cyan); }
  .qp-track { height:3px; background:rgba(255,255,255,.05); border-radius:2px; overflow:hidden; }
  .qp-fill { height:100%; background:linear-gradient(90deg,var(--cyan),var(--teal)); border-radius:2px; transition:width .5s ease; }
  .qp-dots { display:flex; gap:5px; margin-top:10px; }
  .qp-dot { width:6px; height:6px; border-radius:50%; background:var(--t3); transition:all .3s; }
  .qp-dot.done { background:var(--teal); }
  .qp-dot.active { background:var(--cyan); box-shadow:0 0 7px var(--cyan); }

  /* Question card */
  .question-card { animation:qCardIn .4s cubic-bezier(.16,1,.3,1) both; }
  @keyframes qCardIn{from{opacity:0;transform:translateY(20px) scale(.97)}to{opacity:1;transform:translateY(0) scale(1)}}
  .q-meta { display:flex; align-items:center; gap:9px; margin-bottom:14px; }
  .q-tag { font-family:var(--ffm); font-size:.58rem; padding:3px 9px; border-radius:5px; border:1px solid; letter-spacing:.06em; text-transform:uppercase; }
  .q-category { font-family:var(--ffm); font-size:.6rem; color:var(--t3); letter-spacing:.1em; text-transform:uppercase; }
  .q-title { font-family:var(--ffh); font-size:clamp(28px,4vw,52px); letter-spacing:.03em; color:#fff; line-height:.95; margin-bottom:10px; }
  .q-title em { font-style:normal; background:linear-gradient(135deg,var(--cyan),var(--teal)); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
  .q-sub { font-size:.9rem; color:var(--t2); line-height:1.65; margin-bottom:28px; max-width:560px; }
  .q-sub b { color:var(--t); font-weight:600; }

  /* Answer inputs */
  .q-textarea { width:100%; background:rgba(9,15,31,.8); border:1px solid var(--b); border-radius:14px; padding:16px 18px; font-family:var(--ffb); font-size:.95rem; color:#fff; outline:none; resize:none; line-height:1.65; transition:border-color .2s, box-shadow .2s; min-height:120px; }
  .q-textarea:focus { border-color:rgba(0,245,255,.3); box-shadow:0 0 0 3px rgba(0,245,255,.05); }
  .q-textarea::placeholder { color:var(--t3); }
  .q-input { width:100%; background:rgba(9,15,31,.8); border:1px solid var(--b); border-radius:10px; padding:13px 16px; font-family:var(--ffb); font-size:.95rem; color:#fff; outline:none; transition:border-color .2s, box-shadow .2s; }
  .q-input:focus { border-color:rgba(0,245,255,.3); box-shadow:0 0 0 3px rgba(0,245,255,.05); }
  .q-input::placeholder { color:var(--t3); }
  .q-char-count { font-family:var(--ffm); font-size:.6rem; color:var(--t3); margin-top:6px; text-align:right; transition:color .2s; }
  .q-char-count.warn { color:var(--amber); }
  .q-char-count.good { color:var(--teal); }

  /* Choice grid */
  .choice-grid { display:grid; gap:10px; }
  .choice-grid.g2 { grid-template-columns:1fr 1fr; }
  .choice-grid.g3 { grid-template-columns:1fr 1fr 1fr; }
  .choice-opt { background:rgba(9,15,31,.8); border:1px solid var(--b); border-radius:12px; padding:14px 16px; cursor:pointer; transition:all .2s; display:flex; align-items:center; gap:11px; position:relative; overflow:hidden; }
  .choice-opt:hover { border-color:var(--bh); transform:translateY(-2px); box-shadow:0 8px 24px rgba(0,0,0,.3); }
  .choice-opt.selected { background:rgba(0,245,255,.06); border-color:rgba(0,245,255,.4); box-shadow:0 0 20px rgba(0,245,255,.1); }
  .choice-opt.selected::before { content:''; position:absolute; inset:0; background:linear-gradient(135deg,rgba(0,245,255,.03),transparent); pointer-events:none; }
  .choice-ico { font-size:1.4rem; flex-shrink:0; }
  .choice-label { font-size:.9rem; font-weight:600; color:#fff; margin-bottom:2px; }
  .choice-desc { font-family:var(--ffm); font-size:.65rem; color:var(--t2); line-height:1.4; }
  .choice-check { position:absolute; top:10px; right:10px; width:18px; height:18px; border-radius:50%; border:1.5px solid var(--t3); display:flex; align-items:center; justify-content:center; font-size:.55rem; transition:all .2s; }
  .choice-opt.selected .choice-check { background:var(--cyan); border-color:var(--cyan); color:#020a12; }

  /* Slider question */
  .q-slider-wrap { padding:8px 0; }
  .q-slider-display { font-family:var(--ffh); font-size:3rem; color:var(--cyan); letter-spacing:.04em; text-align:center; margin:10px 0; }
  .q-range { width:100%; height:4px; -webkit-appearance:none; appearance:none; background:rgba(255,255,255,.08); border-radius:2px; outline:none; cursor:pointer; margin:12px 0; }
  .q-range::-webkit-slider-thumb { -webkit-appearance:none; width:20px; height:20px; border-radius:50%; background:var(--cyan); cursor:pointer; box-shadow:0 0 10px rgba(0,245,255,.5); }
  .q-range::-moz-range-thumb { width:20px; height:20px; border-radius:50%; background:var(--cyan); cursor:pointer; border:none; }
  .q-range-marks { display:flex; justify-content:space-between; font-family:var(--ffm); font-size:.62rem; color:var(--t3); }

  /* Insight box */
  .q-insight { background:rgba(0,245,255,.04); border:1px solid rgba(0,245,255,.12); border-radius:12px; padding:12px 16px; margin-top:18px; display:flex; gap:9px; align-items:flex-start; }
  .q-insight-ico { font-size:.85rem; flex-shrink:0; margin-top:1px; }
  .q-insight-text { font-family:var(--ffm); font-size:.68rem; color:var(--t2); line-height:1.55; }
  .q-insight-text b { color:var(--cyan); font-weight:500; }

  /* Nav buttons */
  .q-nav { display:flex; align-items:center; gap:10px; margin-top:28px; }
  .btn-back { padding:11px 20px; border-radius:10px; border:1px solid var(--b); background:none; color:var(--t2); font-family:var(--ffb); font-size:.88rem; font-weight:600; cursor:pointer; transition:all .2s; }
  .btn-back:hover { color:var(--t); border-color:var(--bh); }
  .btn-next { padding:12px 28px; border-radius:10px; border:none; background:linear-gradient(135deg,var(--cyan),var(--teal)); color:#020a12; font-family:var(--ffb); font-size:.9rem; font-weight:800; cursor:pointer; transition:all .22s; letter-spacing:.01em; }
  .btn-next:hover:not(:disabled) { transform:translateY(-2px); box-shadow:0 12px 30px rgba(0,245,255,.28); }
  .btn-next:disabled { opacity:.3; cursor:not-allowed; }
  .btn-skip { margin-left:auto; font-family:var(--ffm); font-size:.68rem; color:var(--t2); cursor:pointer; letter-spacing:.06em; background:none; border:none; transition:color .2s; }
  .btn-skip:hover { color:var(--t); }

  /* ── GENERATING PHASE ── */
  .gen-outer { position:relative; z-index:2; max-width:680px; margin:0 auto; padding:80px 28px; display:flex; flex-direction:column; align-items:center; text-align:center; gap:24px; }
  .gen-globe { width:120px; height:120px; position:relative; flex-shrink:0; }
  .gen-ring { position:absolute; inset:0; border-radius:50%; border:2px solid transparent; animation:genSpin 2s linear infinite; }
  .gen-ring-1 { border-top-color:var(--cyan); animation-duration:1.8s; }
  .gen-ring-2 { inset:12px; border-right-color:var(--teal); animation-duration:2.6s; animation-direction:reverse; }
  .gen-ring-3 { inset:24px; border-bottom-color:var(--purple); animation-duration:3.4s; }
  .gen-core { position:absolute; inset:36px; border-radius:50%; background:radial-gradient(circle,rgba(0,245,255,.15),rgba(0,245,255,.04)); border:1px solid rgba(0,245,255,.25); animation:corePulse 2s ease-in-out infinite; display:flex; align-items:center; justify-content:center; font-size:16px; }
  @keyframes genSpin{100%{transform:rotate(360deg)}}
  @keyframes corePulse{0%,100%{box-shadow:0 0 10px rgba(0,245,255,.18)}50%{box-shadow:0 0 28px rgba(0,245,255,.5)}}
  .gen-title { font-family:var(--ffh); font-size:2.4rem; letter-spacing:.04em; color:#fff; }
  .gen-sub { font-family:var(--ffm); font-size:.72rem; color:var(--t2); letter-spacing:.1em; margin-top:-12px; }
  .gen-steps { display:flex; flex-direction:column; gap:9px; width:360px; }
  .gen-step { display:flex; align-items:center; gap:10px; font-family:var(--ffm); font-size:.72rem; opacity:0; transition:opacity .35s; }
  .gen-step.visible { opacity:.7; }
  .gen-step.done { opacity:1; color:var(--teal); }
  .gen-step.active { opacity:1; color:var(--cyan); }
  .gen-step-dot { width:6px; height:6px; border-radius:50%; background:currentColor; flex-shrink:0; }
  .gen-step.active .gen-step-dot { animation:blink .8s infinite; }
  @keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
  .gen-progress-bar { width:100%; height:3px; background:rgba(255,255,255,.06); border-radius:2px; overflow:hidden; }
  .gen-progress-fill { height:100%; background:linear-gradient(90deg,var(--cyan),var(--teal)); border-radius:2px; transition:width .5s ease; }
  .gen-quality-label { font-family:var(--ffm); font-size:.65rem; color:var(--amber); letter-spacing:.08em; background:rgba(245,158,11,.07); border:1px solid rgba(245,158,11,.2); padding:6px 14px; border-radius:20px; animation:qualityPulse 2s ease-in-out infinite; }
  @keyframes qualityPulse{0%,100%{opacity:.7}50%{opacity:1}}

  /* ── EDITOR PHASE ── */
  .editor-outer { position:relative; z-index:2; display:grid; grid-template-columns:1fr 340px; gap:0; min-height:calc(100vh - 120px); }
  @media(max-width:1100px){.editor-outer{grid-template-columns:1fr;}}

  /* Left: editor */
  .editor-main { padding:28px; border-right:1px solid var(--b); overflow-y:auto; }
  .editor-header { display:flex; align-items:flex-start; justify-content:space-between; gap:16px; margin-bottom:24px; padding-bottom:20px; border-bottom:1px solid var(--b); }
  .editor-title-area { flex:1; }
  .editor-eyebrow { font-family:var(--ffm); font-size:.6rem; color:var(--teal); letter-spacing:.16em; text-transform:uppercase; margin-bottom:5px; display:flex; align-items:center; gap:7px; }
  .editor-eyebrow::before { content:'⬡'; color:var(--teal); }
  .editor-h1 { font-family:var(--ffh); font-size:2.2rem; letter-spacing:.04em; color:#fff; margin-bottom:3px; }
  .editor-meta { display:flex; gap:10px; flex-wrap:wrap; }
  .editor-chip { font-family:var(--ffm); font-size:.62rem; padding:3px 10px; border-radius:6px; border:1px solid; display:flex; align-items:center; gap:5px; }
  .editor-actions { display:flex; gap:8px; align-items:flex-start; flex-wrap:wrap; }
  .ea-btn { padding:9px 16px; border-radius:9px; font-family:var(--ffb); font-size:.78rem; font-weight:700; cursor:pointer; transition:all .2s; border:1px solid; display:flex; align-items:center; gap:6px; white-space:nowrap; }
  .ea-primary { background:linear-gradient(135deg,var(--cyan),var(--teal)); color:#020a12; border-color:transparent; }
  .ea-primary:hover { transform:translateY(-1px); box-shadow:0 8px 20px rgba(0,245,255,.25); }
  .ea-ghost { background:none; color:var(--t2); border-color:var(--b); }
  .ea-ghost:hover { border-color:var(--bh); color:var(--t); }
  .ea-purple { background:rgba(168,85,247,.08); color:var(--purple); border-color:rgba(168,85,247,.25); }
  .ea-purple:hover { background:rgba(168,85,247,.14); }

  /* Score bar */
  .score-banner { background:linear-gradient(135deg,rgba(0,245,255,.04),rgba(0,229,168,.03)); border:1px solid rgba(0,245,255,.12); border-radius:14px; padding:16px 20px; margin-bottom:22px; display:flex; gap:24px; align-items:center; flex-wrap:wrap; }
  .score-item { display:flex; flex-direction:column; gap:4px; min-width:80px; }
  .score-label { font-family:var(--ffm); font-size:.58rem; color:var(--t3); letter-spacing:.1em; text-transform:uppercase; }
  .score-val { font-family:var(--ffh); font-size:1.6rem; letter-spacing:.04em; line-height:1; }
  .score-bar-wrap { flex:1; min-width:160px; }
  .score-bar-label { font-family:var(--ffm); font-size:.6rem; color:var(--t2); margin-bottom:5px; }
  .score-bar-track { height:4px; background:rgba(255,255,255,.06); border-radius:2px; overflow:hidden; }
  .score-bar-fill { height:100%; border-radius:2px; transition:width 1.2s ease; }

  /* SOP Content */
  .sop-document { background:rgba(9,15,31,.5); border:1px solid var(--b); border-radius:16px; overflow:hidden; }
  .sop-doc-header { padding:20px 24px; border-bottom:1px solid var(--b); display:flex; align-items:center; justify-content:space-between; }
  .sop-doc-title { font-family:var(--ffm); font-size:.65rem; color:var(--teal); letter-spacing:.14em; text-transform:uppercase; display:flex; align-items:center; gap:8px; }
  .sop-doc-title::before { content:''; width:6px; height:6px; border-radius:50%; background:var(--teal); box-shadow:0 0 8px var(--teal); }
  .sop-word-count { font-family:var(--ffm); font-size:.65rem; color:var(--t3); }
  .sop-section { padding:0 24px; }
  .sop-section-label { font-family:var(--ffm); font-size:.58rem; color:var(--t3); letter-spacing:.14em; text-transform:uppercase; margin:20px 0 8px; display:flex; align-items:center; gap:8px; }
  .sop-section-label::after { content:''; flex:1; height:1px; background:rgba(255,255,255,.05); }
  .sop-editable { font-family:var(--ffsop); font-size:1rem; line-height:1.85; color:var(--t); outline:none; min-height:60px; padding:8px 0; white-space:pre-wrap; word-break:break-word; }
  .sop-editable:focus { color:#fff; }
  .sop-editable:empty::before { content:attr(data-placeholder); color:var(--t3); font-style:italic; }
  .sop-section-divider { height:1px; background:rgba(255,255,255,.04); margin:4px 24px; }
  .sop-doc-footer { padding:16px 24px; border-top:1px solid var(--b); display:flex; align-items:center; justify-content:space-between; }
  .sop-footer-label { font-family:var(--ffm); font-size:.6rem; color:var(--t3); letter-spacing:.08em; }
  .sop-footer-ai { font-family:var(--ffm); font-size:.6rem; color:var(--purple); background:rgba(168,85,247,.08); border:1px solid rgba(168,85,247,.2); padding:3px 9px; border-radius:5px; letter-spacing:.06em; }

  /* Highlight annotation */
  .annotation-highlight { background:rgba(245,158,11,.15); border-bottom:2px solid var(--amber); cursor:pointer; transition:background .15s; position:relative; }
  .annotation-highlight:hover { background:rgba(245,158,11,.25); }
  .mentor-note-marker { background:rgba(168,85,247,.15); border-bottom:2px solid var(--purple); cursor:pointer; }

  /* ── RIGHT SIDEBAR ── */
  .editor-sidebar { display:flex; flex-direction:column; overflow:hidden; background:rgba(6,11,24,.8); }
  .sidebar-tabs { display:flex; border-bottom:1px solid var(--b); }
  .sb-tab { flex:1; padding:12px 8px; font-family:var(--ffm); font-size:.62rem; color:var(--t2); cursor:pointer; text-align:center; letter-spacing:.07em; text-transform:uppercase; border-bottom:2px solid transparent; transition:all .18s; }
  .sb-tab:hover { color:var(--t); }
  .sb-tab.active { color:var(--cyan); border-bottom-color:var(--cyan); background:rgba(0,245,255,.03); }
  .sidebar-body { flex:1; overflow-y:auto; padding:16px; }

  /* Analysis panel */
  .analysis-section { margin-bottom:20px; }
  .analysis-title { font-family:var(--ffm); font-size:.6rem; color:var(--t3); letter-spacing:.14em; text-transform:uppercase; margin-bottom:10px; display:flex; align-items:center; gap:6px; }
  .analysis-title::after { content:''; flex:1; height:1px; background:var(--b); }
  .metric-row { display:flex; align-items:center; justify-content:space-between; padding:8px 0; border-bottom:1px solid rgba(255,255,255,.04); }
  .metric-row:last-child { border-bottom:none; }
  .metric-name { font-family:var(--ffm); font-size:.68rem; color:var(--t2); }
  .metric-badge { font-family:var(--ffm); font-size:.6rem; padding:2px 8px; border-radius:5px; border:1px solid; }
  .mb-good { color:var(--teal); border-color:rgba(0,229,168,.25); background:rgba(0,229,168,.07); }
  .mb-warn { color:var(--amber); border-color:rgba(245,158,11,.25); background:rgba(245,158,11,.07); }
  .mb-bad { color:var(--rose); border-color:rgba(251,77,109,.25); background:rgba(251,77,109,.07); }
  .mb-info { color:var(--cyan); border-color:rgba(0,245,255,.25); background:rgba(0,245,255,.07); }

  /* Suggestions */
  .suggestion-card { background:var(--bg2); border:1px solid var(--b); border-radius:11px; padding:13px; margin-bottom:9px; cursor:pointer; transition:all .18s; position:relative; overflow:hidden; }
  .suggestion-card::before { content:''; position:absolute; left:0; top:0; bottom:0; width:3px; }
  .suggestion-card.critical::before { background:var(--rose); }
  .suggestion-card.improve::before { background:var(--amber); }
  .suggestion-card.good::before { background:var(--teal); }
  .suggestion-card:hover { border-color:var(--bh); background:var(--bg3); }
  .sug-type { font-family:var(--ffm); font-size:.56rem; letter-spacing:.1em; text-transform:uppercase; margin-bottom:4px; }
  .sug-text { font-family:var(--ffm); font-size:.68rem; color:var(--t2); line-height:1.5; }
  .sug-text b { font-weight:500; }
  .sug-action { font-family:var(--ffm); font-size:.6rem; color:var(--cyan); margin-top:7px; cursor:pointer; }
  .sug-action:hover { opacity:.75; }

  /* Mentor annotations */
  .annotation-item { background:var(--bg2); border:1px solid rgba(168,85,247,.2); border-radius:11px; padding:13px; margin-bottom:9px; }
  .ann-header { display:flex; align-items:center; gap:8px; margin-bottom:8px; }
  .ann-av { width:26px; height:26px; border-radius:50%; overflow:hidden; border:1.5px solid rgba(168,85,247,.35); flex-shrink:0; }
  .ann-av img { width:100%; height:100%; object-fit:cover; }
  .ann-name { font-size:.78rem; font-weight:600; color:#fff; }
  .ann-time { font-family:var(--ffm); font-size:.58rem; color:var(--t3); margin-left:auto; }
  .ann-text { font-family:var(--ffm); font-size:.67rem; color:var(--t2); line-height:1.55; }
  .ann-text b { color:var(--purple); font-weight:500; }
  .ann-tag { font-family:var(--ffm); font-size:.56rem; padding:2px 7px; border-radius:4px; background:rgba(168,85,247,.1); border:1px solid rgba(168,85,247,.2); color:var(--purple); margin-top:6px; display:inline-block; letter-spacing:.05em; }
  .ann-reply { font-family:var(--ffm); font-size:.62rem; color:var(--cyan); cursor:pointer; margin-top:7px; display:flex; align-items:center; gap:4px; }
  .ann-reply:hover { opacity:.75; }

  /* Version history */
  .version-item { background:var(--bg2); border:1px solid var(--b); border-radius:10px; padding:12px; margin-bottom:8px; cursor:pointer; transition:all .18s; }
  .version-item:hover { border-color:var(--bh); }
  .version-item.current { border-color:rgba(0,245,255,.3); background:rgba(0,245,255,.04); }
  .ver-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:5px; }
  .ver-num { font-family:var(--ffh); font-size:.95rem; color:#fff; letter-spacing:.04em; }
  .ver-badge { font-family:var(--ffm); font-size:.55rem; padding:2px 7px; border-radius:4px; background:rgba(0,245,255,.08); border:1px solid rgba(0,245,255,.18); color:var(--cyan); }
  .ver-meta { font-family:var(--ffm); font-size:.62rem; color:var(--t2); }
  .ver-score { font-family:var(--ffm); font-size:.6rem; color:var(--teal); }

  /* Add annotation input */
  .add-ann-wrap { border-top:1px solid var(--b); padding:14px; }
  .add-ann-label { font-family:var(--ffm); font-size:.6rem; color:var(--t3); letter-spacing:.1em; text-transform:uppercase; margin-bottom:8px; }
  .add-ann-input { width:100%; background:var(--bg3); border:1px solid var(--b); border-radius:8px; padding:9px 12px; font-family:var(--ffm); font-size:.72rem; color:#fff; outline:none; resize:none; min-height:60px; transition:border-color .2s; }
  .add-ann-input:focus { border-color:rgba(0,245,255,.25); }
  .add-ann-input::placeholder { color:var(--t3); }
  .add-ann-btn { width:100%; margin-top:8px; padding:8px; border-radius:7px; border:1px solid rgba(168,85,247,.3); background:rgba(168,85,247,.08); color:var(--purple); font-family:var(--ffb); font-size:.78rem; font-weight:700; cursor:pointer; transition:all .2s; }
  .add-ann-btn:hover { background:rgba(168,85,247,.15); }

  /* Toast */
  .sop-toast { position:fixed; bottom:24px; right:28px; z-index:600; display:flex; flex-direction:column; gap:8px; pointer-events:none; }
  .toast-item { background:rgba(6,11,24,.97); backdrop-filter:blur(24px); border:1px solid rgba(0,245,255,.2); border-radius:11px; padding:11px 16px; width:300px; pointer-events:all; display:flex; gap:9px; align-items:center; font-family:var(--ffm); font-size:.72rem; color:var(--t); box-shadow:0 14px 44px rgba(0,0,0,.6); animation:toastIn .3s cubic-bezier(.21,1.02,.73,1) both; }
  @keyframes toastIn{from{opacity:0;transform:translateX(100%)}to{opacity:1;transform:translateX(0)}}
  .toast-item.out{animation:toastOut .25s ease forwards}
  @keyframes toastOut{to{opacity:0;transform:translateX(100%)}}

  /* Utility */
  @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
  .fade-up{animation:fadeUp .45s ease both}
`;

/* ══════════════════════════════════════════════════════════════
   QUIZ QUESTIONS
══════════════════════════════════════════════════════════════ */
const QUESTIONS = [
  {
    id: 'destination',
    category: 'DESTINATION',
    tag: 'STEP 1 OF 12', tagColor: 'rgba(0,245,255,.1)', tagBorder: 'rgba(0,245,255,.2)', tagText: 'var(--cyan)',
    title: <span>WHERE ARE YOU <em>APPLYING?</em></span>,
    sub: 'Different countries need fundamentally different SOP styles. German motivation letters are academic and concise. US SOPs are narrative and personal. We\'ll adapt accordingly.',
    type: 'choice',
    required: true,
    grid: 'g3',
    opts: [
      { v: 'Germany', ico: '🇩🇪', label: 'Germany', desc: 'Concise, academic, research-focused' },
      { v: 'USA', ico: '🇺🇸', label: 'USA', desc: 'Narrative, personal story, ambition-driven' },
      { v: 'UK', ico: '🇬🇧', label: 'UK', desc: 'Direct, goal-oriented, concise' },
      { v: 'Canada', ico: '🇨🇦', label: 'Canada', desc: 'Research interest + career goals' },
      { v: 'Australia', ico: '🇦🇺', label: 'Australia', desc: 'Goals-focused, practical' },
      { v: 'Ireland', ico: '🇮🇪', label: 'Ireland', desc: 'Brief, direct, professional' },
    ],
    insight: { ico: '💡', text: '<b>Why this matters:</b> A German ML reads completely differently from a US SOP. German universities want academic precision. US universities want your personal narrative and growth story.' },
  },
  {
    id: 'program',
    category: 'PROGRAM',
    tag: 'STEP 2 OF 12', tagColor: 'rgba(0,229,168,.1)', tagBorder: 'rgba(0,229,168,.2)', tagText: 'var(--teal)',
    title: <span>WHAT WILL YOU <em>STUDY?</em></span>,
    sub: 'Be specific — "Computer Science" is weak. "Machine Learning with a focus on NLP research" is strong. The more specific, the more the SOP resonates.',
    type: 'textarea',
    placeholder: 'e.g. Masters in Computer Science with specialization in Machine Learning / AI. Interested in NLP and computer vision research.',
    minChars: 30, maxChars: 200, required: true,
    insight: { ico: '🎯', text: '<b>Tip:</b> Mention 1–2 specific research areas or sub-fields you\'re passionate about. This shows you\'ve done your research and increases admission chances significantly.' },
  },
  {
    id: 'university',
    category: 'TARGET',
    tag: 'STEP 3 OF 12', tagColor: 'rgba(168,85,247,.1)', tagBorder: 'rgba(168,85,247,.2)', tagText: 'var(--purple)',
    title: <span>WHICH <em>UNIVERSITY?</em></span>,
    sub: 'Name the specific university and program. We\'ll customize the SOP to mention their unique offerings, faculty, or research groups.',
    type: 'textarea',
    placeholder: 'e.g. TU Munich — MSc Informatics (CS specialization). Interested in Prof. Bernt Schiele\'s computer vision research group.',
    minChars: 20, maxChars: 250, required: true,
    insight: { ico: '🏫', text: '<b>Pro move:</b> Name a specific professor or research group you want to work with. Admission committees love this — it shows genuine interest, not just a mass application.' },
  },
  {
    id: 'background',
    category: 'ACADEMIC BACKGROUND',
    tag: 'STEP 4 OF 12', tagColor: 'rgba(0,245,255,.1)', tagBorder: 'rgba(0,245,255,.2)', tagText: 'var(--cyan)',
    title: <span>YOUR ACADEMIC <em>BACKGROUND?</em></span>,
    sub: 'Tell us about your degree, CGPA, any notable academic achievements, honours, or research you\'ve done at university.',
    type: 'textarea',
    placeholder: 'e.g. B.Tech Computer Science from VIT Pune (2024). CGPA 8.4/10. Completed coursework in ML, algorithms, distributed systems. Undergraduate thesis on federated learning.',
    minChars: 60, maxChars: 400, required: true,
    insight: { ico: '📊', text: '<b>Be honest:</b> If your CGPA is lower than average, we\'ll help you frame it strategically — emphasizing an upward trend, strong final-year performance, or compensating strengths.' },
  },
  {
    id: 'projects',
    category: 'PROJECTS & RESEARCH',
    tag: 'STEP 5 OF 12', tagColor: 'rgba(0,229,168,.1)', tagBorder: 'rgba(0,229,168,.2)', tagText: 'var(--teal)',
    title: <span>YOUR BEST <em>PROJECTS?</em></span>,
    sub: 'Describe your 2–3 strongest technical projects, internships, or research work. Include what you built, what problem it solved, and what you learned.',
    type: 'textarea',
    placeholder: 'e.g. 1. Built a Transformer-based sentiment analysis model achieving 94% accuracy on 500K tweet dataset — deployed as API serving 1,200 daily requests.\n2. Research intern at IIT Bombay — worked on adversarial robustness in CNNs, co-authored 1 conference paper.\n3. Led team of 4 to win Smart India Hackathon 2023 with an NLP tool for legal document summarization.',
    minChars: 100, maxChars: 600, required: true,
    insight: { ico: '🔬', text: '<b>Impact > description:</b> Don\'t just say what you built — say what it achieved. Numbers are powerful. "Improved accuracy by 12%" is 10x stronger than "improved the model".' },
  },
  {
    id: 'workex',
    category: 'WORK EXPERIENCE',
    tag: 'STEP 6 OF 12', tagColor: 'rgba(168,85,247,.1)', tagBorder: 'rgba(168,85,247,.2)', tagText: 'var(--purple)',
    title: <span>WORK <em>EXPERIENCE?</em></span>,
    sub: 'Include internships, part-time roles, or full-time jobs. If you have none, describe extracurriculars or leadership roles instead.',
    type: 'textarea',
    placeholder: 'e.g. Software Engineering Intern at TCS (6 months) — worked on microservices architecture for banking system. Reduced API response time by 40% through caching optimization.\n\nOr: No formal work experience, but led the college coding club for 2 years, organizing 3 hackathons with 400+ participants.',
    minChars: 30, maxChars: 400, required: false, skippable: true,
    insight: { ico: '💼', text: '<b>No experience?</b> Don\'t skip — extracurriculars, open source contributions, freelance projects, and leadership roles all count and strengthen your narrative.' },
  },
  {
    id: 'whyThisUni',
    category: 'MOTIVATION',
    tag: 'STEP 7 OF 12', tagColor: 'rgba(245,158,11,.1)', tagBorder: 'rgba(245,158,11,.2)', tagText: 'var(--amber)',
    title: <span>WHY <em>THIS UNIVERSITY</em> SPECIFICALLY?</span>,
    sub: 'This is often the most-skimped section — and the most important. What specifically attracts you to this program over 100 others? Be concrete.',
    type: 'textarea',
    placeholder: 'e.g. TU Munich\'s MSCS consistently ranks #1 in Germany. Prof. Schiele\'s computer vision research on scene understanding directly aligns with my thesis work. The curriculum\'s focus on theory + implementation is rare — most programs pick one. Munich\'s proximity to BMW and Siemens means real industry research opportunities.',
    minChars: 80, maxChars: 500, required: true,
    insight: { ico: '🎯', text: '<b>The #1 SOP mistake:</b> Writing generic "the university is world-renowned" content. Admission committees can spot copy-paste. Name a specific professor, course module, lab, or research collaboration that excites you.' },
  },
  {
    id: 'careerGoal',
    category: 'FUTURE VISION',
    tag: 'STEP 8 OF 12', tagColor: 'rgba(0,245,255,.1)', tagBorder: 'rgba(0,245,255,.2)', tagText: 'var(--cyan)',
    title: <span>WHERE ARE YOU GOING <em>AFTER?</em></span>,
    sub: 'Short-term (2 years post-graduation) and long-term (10 years). Be specific — vague aspirations weaken the SOP. "AI researcher at a European tech company" is better than "work in tech".',
    type: 'textarea',
    placeholder: 'e.g. Short-term: Join as ML Engineer at a Munich or Berlin AI startup or research lab — specifically interested in autonomous systems teams at BMW or DeepMind Berlin.\n\nLong-term: Build AI tools that address healthcare in India. Eventually return and launch a startup applying computer vision to disease detection in rural settings.',
    minChars: 80, maxChars: 400, required: true,
    insight: { ico: '🌍', text: '<b>The India angle:</b> Many German and European SOP experts suggest a mention of bringing skills back to contribute to your home country. It resonates well and shows bigger purpose.' },
  },
  {
    id: 'pivotMoment',
    category: 'YOUR STORY',
    tag: 'STEP 9 OF 12', tagColor: 'rgba(0,229,168,.1)', tagBorder: 'rgba(0,229,168,.2)', tagText: 'var(--teal)',
    title: <span>THE MOMENT THAT <em>CHANGED EVERYTHING?</em></span>,
    sub: 'For US SOPs especially: what was the defining experience that made you choose this field? A project failure, a problem you witnessed, a book, a conversation? This becomes your opening hook.',
    type: 'textarea',
    placeholder: 'e.g. During my 2nd year, I watched my grandmother wait 3 months for a brain scan analysis that an AI model I\'d built could have done in seconds. That gap — between what technology can do and what people in India actually have access to — became the reason I need to study at the best ML program I can find.',
    minChars: 50, maxChars: 400, required: false, skippable: true,
    insight: { ico: '✨', text: '<b>The hook:</b> The opening sentence of a US SOP is everything. Admission readers scan hundreds of "I have always been passionate about computers" openers. A specific, vivid story sets yours apart immediately.' },
  },
  {
    id: 'challenges',
    category: 'RESILIENCE',
    tag: 'STEP 10 OF 12', tagColor: 'rgba(251,77,109,.1)', tagBorder: 'rgba(251,77,109,.2)', tagText: 'var(--rose)',
    title: <span>ANY GAPS OR <em>WEAKNESSES</em> TO ADDRESS?</span>,
    sub: 'Low CGPA in 2nd year? Semester gap? Backlogs? Better to address head-on with context than let the admissions committee form their own story. Skip if nothing to address.',
    type: 'textarea',
    placeholder: 'e.g. My CGPA dropped to 6.8 in Semester 4 due to a family medical situation. By Semester 5, I refocused and scored 9.2, 9.4, and 9.1 in the following three semesters, demonstrating both resilience and capability when operating under normal conditions.',
    minChars: 0, maxChars: 300, required: false, skippable: true,
    insight: { ico: '🛡', text: '<b>Owning weaknesses is strength:</b> Addressing a low semester proactively — with context and a demonstrated upward trend — shows maturity and self-awareness. Leaving it unexplained is worse.' },
  },
  {
    id: 'tone',
    category: 'STYLE',
    tag: 'STEP 11 OF 12', tagColor: 'rgba(168,85,247,.1)', tagBorder: 'rgba(168,85,247,.2)', tagText: 'var(--purple)',
    title: <span>WHAT TONE DO YOU <em>PREFER?</em></span>,
    sub: 'How should the SOP read? Different programs and countries respond to different voices.',
    type: 'choice',
    required: true,
    grid: 'g2',
    opts: [
      { v: 'Professional & Academic', ico: '📐', label: 'Professional & Academic', desc: 'Formal, structured, research-oriented. Best for Germany/Europe.' },
      { v: 'Personal & Narrative', ico: '📖', label: 'Personal & Narrative', desc: 'Story-driven, warm, impactful. Best for USA/UK.' },
      { v: 'Confident & Ambitious', ico: '🚀', label: 'Confident & Ambitious', desc: 'Bold, clear, achievement-focused. Good for business programs.' },
      { v: 'Balanced & Thoughtful', ico: '⚖️', label: 'Balanced & Thoughtful', desc: 'Mix of personal insight and professional achievement.' },
    ],
    insight: { ico: '✍️', text: '<b>Country default:</b> Germany/Europe prefer formal-academic. USA/UK prefer personal-narrative. We\'ll blend your chosen tone with the destination-appropriate style.' },
  },
  {
    id: 'wordLimit',
    category: 'PARAMETERS',
    tag: 'STEP 12 OF 12', tagColor: 'rgba(0,245,255,.1)', tagBorder: 'rgba(0,245,255,.2)', tagText: 'var(--cyan)',
    title: <span>WORD LIMIT <em>TARGET?</em></span>,
    sub: 'Different programs have different requirements. If you\'re unsure, 700 words is the universally safe target.',
    type: 'slider',
    min: 400, max: 1200, step: 50, defaultVal: 700,
    marks: ['400', '600', '800', '1000', '1200'],
    unit: ' words',
    required: true,
    insight: { ico: '📏', text: '<b>Rule of thumb:</b> Germany 500–800 words (concise). USA 700–1000 words. UK 500–700 words. PhD programs: up to 1200 words. Always check the specific program requirement.' },
  },
];

const GEN_STEPS = [
  'Analyzing your academic profile…',
  'Mapping destination-specific requirements…',
  'Crafting your opening hook…',
  'Building narrative arc and structure…',
  'Weaving in university-specific details…',
  'Calibrating tone and voice…',
  'Optimizing for readability and flow…',
  'Final quality pass — polishing…',
  'SOP generated. Applying analysis…',
];

const MENTOR_ANNOTATIONS = [
  {
    id: 1,
    mentorName: 'Aarav Mehta',
    mentorImg: 'https://randomuser.me/api/portraits/men/11.jpg',
    time: '2 min ago',
    text: 'Your opening paragraph is <b>strong</b> — the personal hook about your grandmother is exactly what TU Munich admissions won\'t have read today. Keep this.',
    tag: '✓ EXCELLENT',
    section: 'intro',
  },
  {
    id: 2,
    mentorName: 'Aarav Mehta',
    mentorImg: 'https://randomuser.me/api/portraits/men/11.jpg',
    time: '3 min ago',
    text: 'In the "Why TU Munich" section, mention <b>Prof. Schiele by full name</b> and reference one specific paper from his lab. This single change can meaningfully improve your admission odds.',
    tag: '⚠ IMPROVE',
    section: 'whyUni',
  },
  {
    id: 3,
    mentorName: 'Aarav Mehta',
    mentorImg: 'https://randomuser.me/api/portraits/men/11.jpg',
    time: '5 min ago',
    text: 'The career goals section is a bit vague. Replace "work in AI" with a specific role — <b>"ML Engineer in autonomous systems at a Munich-based company"</b>. Concrete = credible.',
    tag: '⚠ REVISE',
    section: 'goals',
  },
];

/* ══════════════════════════════════════════════════════════════
   ANALYSIS HELPERS
══════════════════════════════════════════════════════════════ */
function analyzeText(text) {
  if (!text) return { words: 0, sentences: 0, readability: 0, specific: false, hasNumbers: false, hasProfessor: false, hasResearch: false };
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const sentences = (text.match(/[.!?]+/g) || []).length;
  const avgWordsPerSentence = sentences > 0 ? words / sentences : 0;
  const readability = Math.max(0, Math.min(100, Math.round(100 - avgWordsPerSentence * 1.5)));
  const specific = words > 80;
  const hasNumbers = /\d/.test(text);
  const hasProfessor = /prof(\.|essor)/i.test(text);
  const hasResearch = /research|lab|study|thesis|paper|publish/i.test(text);
  const hasHook = /when|moment|realized|discovered|watching|saw/i.test(text.substring(0, 200));
  return { words, sentences, readability, specific, hasNumbers, hasProfessor, hasResearch, hasHook };
}

function calcOverallScore(sections) {
  const combined = Object.values(sections).join(' ');
  const a = analyzeText(combined);
  let score = 50;
  if (a.hasNumbers) score += 8;
  if (a.hasProfessor) score += 10;
  if (a.hasResearch) score += 7;
  if (a.hasHook) score += 10;
  if (a.words > 400) score += 5;
  if (a.words > 600) score += 5;
  if (a.readability > 60) score += 5;
  return Math.min(99, score);
}

function getSuggestions(answers, sections) {
  const sugs = [];
  const combined = Object.values(sections).join(' ');
  const a = analyzeText(combined);
  if (!a.hasProfessor) sugs.push({ type: 'critical', text: 'No professor mentioned. Add a specific professor\'s name from your target university — this single change dramatically improves admission odds.', action: 'Add professor name →' });
  if (!a.hasNumbers) sugs.push({ type: 'critical', text: 'No specific numbers or metrics found. Quantify at least 2 achievements: accuracy %, team size, downloads, performance improvement.', action: 'Add metrics →' });
  if (!a.hasHook && answers.destination !== 'Germany') sugs.push({ type: 'improve', text: 'Opening lacks a personal hook. Start with a specific moment or experience that sparked your passion. Avoid "I have always been passionate about…"', action: 'Improve opening →' });
  if (!a.hasResearch) sugs.push({ type: 'improve', text: 'Research experience not prominent enough. Ensure at least one dedicated section highlighting academic/project research with measurable outcomes.', action: 'Strengthen research →' });
  const words = a.words;
  const target = answers.wordLimit || 700;
  if (words < target * 0.85) sugs.push({ type: 'improve', text: `Current draft (${words} words) is below your target (${target} words). Expand your research alignment and career vision sections.`, action: 'Expand content →' });
  if (words > target * 1.1) sugs.push({ type: 'improve', text: `Draft (${words} words) exceeds your target (${target} words). Trim redundant phrases in the background section.`, action: 'Trim content →' });
  sugs.push({ type: 'good', text: 'Country-specific tone applied correctly. SOP uses appropriate formality level for ' + (answers.destination || 'your destination') + '.', action: null });
  return sugs;
}

/* ══════════════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════════════ */
export default function SOPBuilder() {
  const router = useRouter(); // <-- Used to navigate back to dashboard
  const [phase, setPhase] = useState('quiz');
  const [curQ, setCurQ] = useState(0);
  const [answers, setAnswers] = useState({ wordLimit: 700 });
  const [genStep, setGenStep] = useState(-1);
  const [genProgress, setGenProgress] = useState(0);
  const [sopSections, setSopSections] = useState({});
  const [rawSOP, setRawSOP] = useState('');
  const [activeSideTab, setActiveSideTab] = useState('analysis');
  const [annotationInput, setAnnotationInput] = useState('');
  const [userAnnotations, setUserAnnotations] = useState([]);
  const [toasts, setToasts] = useState([]);
  const [versions, setVersions] = useState([]);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [overallScore, setOverallScore] = useState(0);
  const textareaRef = useRef(null);
  const sopRef = useRef(null);

  /* CLOCK */
  const [timeStr, setTimeStr] = useState('');
  useEffect(() => {
    const t = setInterval(() => {
      const n = new Date();
      setTimeStr(`${String(n.getHours()).padStart(2,'0')}:${String(n.getMinutes()).padStart(2,'0')}:${String(n.getSeconds()).padStart(2,'0')}`);
    }, 1000);
    return () => clearInterval(t);
  }, []);

  /* TOAST */
  const toast = useCallback((msg, ico = '✅') => {
    const id = Date.now();
    setToasts(p => [...p, { id, msg, ico }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 4000);
  }, []);

  /* QUIZ LOGIC */
  const currentQ = QUESTIONS[curQ];
  const progress = Math.round(((curQ) / QUESTIONS.length) * 100);

  const handleAnswer = (val) => setAnswers(p => ({ ...p, [currentQ.id]: val }));

  const nextQ = () => {
    if (!answers[currentQ.id] && currentQ.required) return;
    if (curQ < QUESTIONS.length - 1) { setCurQ(p => p + 1); }
    else { startGeneration(); }
  };

  const prevQ = () => { if (curQ > 0) setCurQ(p => p - 1); };
  const skipQ = () => { if (curQ < QUESTIONS.length - 1) setCurQ(p => p + 1); else startGeneration(); };

  /* GENERATION */
  const startGeneration = async () => {
    setPhase('generating');
    setGenStep(0);
    setGenProgress(0);

    const stepInterval = setInterval(() => {
      setGenStep(p => {
        const next = p + 1;
        setGenProgress(Math.round((next / GEN_STEPS.length) * 100));
        if (next >= GEN_STEPS.length) clearInterval(stepInterval);
        return next;
      });
    }, 600);

    try {
      const systemPrompt = buildSystemPrompt(answers);
      const userPrompt = buildUserPrompt(answers);

      const res = await fetch('/api/anthropic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 2000,
          system: systemPrompt,
          messages: [{ role: 'user', content: userPrompt }],
        }),
      });

      const data = await res.json();
      const sopText = data?.content?.[0]?.text || generateFallbackSOP(answers);

      clearInterval(stepInterval);
      setGenStep(GEN_STEPS.length);
      setGenProgress(100);

      setTimeout(() => {
        const sections = parseSections(sopText);
        setSopSections(sections);
        setRawSOP(sopText);
        const score = calcOverallScore(sections);
        setOverallScore(score);
        setVersions([{ num: 'v1.0', label: 'Initial Draft', time: 'Just now', score, current: true }]);
        setPhase('editor');
      }, 600);

    } catch {
      clearInterval(stepInterval);
      const fallback = generateFallbackSOP(answers);
      const sections = parseSections(fallback);
      setSopSections(sections);
      setRawSOP(fallback);
      const score = calcOverallScore(sections);
      setOverallScore(score);
      setVersions([{ num: 'v1.0', label: 'Initial Draft', time: 'Just now', score, current: true }]);
      setTimeout(() => setPhase('editor'), 400);
    }
  };

  const regenerate = async () => {
    setIsRegenerating(true);
    toast('🔄 Regenerating with fresh approach…', '🔄');
    setTimeout(() => {
      const newSOP = generateFallbackSOP(answers, true);
      const sections = parseSections(newSOP);
      setSopSections(sections);
      const score = calcOverallScore(sections);
      setOverallScore(score);
      setVersions(p => [{ num: `v${(p.length + 1).toFixed(1)}`, label: 'Regenerated', time: 'Just now', score, current: true }, ...p.map(v => ({ ...v, current: false }))]);
      setIsRegenerating(false);
      toast('✨ New version generated!', '✨');
    }, 2200);
  };

  const addAnnotation = () => {
    if (!annotationInput.trim()) return;
    const ann = {
      id: Date.now(), mentorName: 'You (Student)', mentorImg: 'https://randomuser.me/api/portraits/men/45.jpg',
      time: 'Just now', text: annotationInput, tag: '📝 NOTE', section: 'general',
    };
    setUserAnnotations(p => [...p, ann]);
    setAnnotationInput('');
    toast('📝 Note added successfully', '📝');
  };

  const exportSOP = () => {
    const text = Object.entries(sopSections).map(([k, v]) => `${k.toUpperCase()}\n${'─'.repeat(40)}\n${v}\n`).join('\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `SOP_${answers.destination || 'draft'}_MentorBridge.txt`;
    a.click();
    toast('📄 SOP exported successfully', '📄');
  };

  const analysis = analyzeText(Object.values(sopSections).join(' '));
  const suggestions = getSuggestions(answers, sopSections);

  /* PHASE LABELS */
  const PHASES = [
    { key: 'quiz', label: 'Profile' },
    { key: 'generating', label: 'Generating' },
    { key: 'editor', label: 'Edit & Review' },
  ];
  const phaseIdx = PHASES.findIndex(p => p.key === phase);

  /* ── RENDER ── */
  return (
    <div className="sop-root">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="sop-amb" />
      <div className="sop-hex" />
      <div className="sop-scan" />

      {/* TOPBAR */}
      <div className="sop-topbar">
        {/* Added cursor:pointer and onClick routing back to dashboard */}
        <div className="sop-logo" onClick={() => router.push('/dashboard/student')} style={{ cursor: 'pointer' }}>
          <div className="sop-logo-gem">🌉</div>
          Mentor<em>Bridge</em>
        </div>
        <div className="sop-tb-sep" />
        <div>
          <div className="sop-tb-title">SMART SOP BUILDER</div>
          <div className="sop-tb-sub">AI-POWERED · MENTOR-REVIEWED</div>
        </div>
        <div className="sop-tb-sp" />
        {phase === 'editor' && (
          <div className="sop-tb-phase">
            Score: {overallScore}/100 · {analysis.words} words
          </div>
        )}
        <div style={{ fontFamily: 'var(--ffm)', fontSize: '.72rem', color: 'var(--t2)', background: 'var(--bg2)', border: '1px solid var(--b)', padding: '3px 10px', borderRadius: '6px' }}>{timeStr}</div>
        <div className="sop-tb-btn" onClick={exportSOP} title="Export SOP">📄</div>
      </div>

      {/* PHASE STEPS */}
      <div className="phase-bar"><div className="phase-fill" style={{ width: phase === 'quiz' ? `${progress * 0.33}%` : phase === 'generating' ? `${33 + genProgress * 0.33}%` : '100%' }} /></div>
      <div className="phase-steps">
        {PHASES.map((p, i) => (
          <React.Fragment key={p.key}>
            {i > 0 && <div className={`phase-connector ${i <= phaseIdx ? 'done' : ''}`} />}
            <div className="phase-step">
              <div className={`phase-step-dot ${i < phaseIdx ? 'done' : i === phaseIdx ? 'active' : 'future'}`}>
                {i < phaseIdx ? '✓' : i + 1}
              </div>
              <span className={`phase-step-label ${i < phaseIdx ? 'done' : i === phaseIdx ? 'active' : 'future'}`}>{p.label}</span>
            </div>
          </React.Fragment>
        ))}
      </div>

      {/* ════════ QUIZ PHASE ════════ */}
      {phase === 'quiz' && (
        <div className="quiz-outer">
          <div className="quiz-progress">
            <div className="qp-header">
              <span className="qp-label">Building Your Profile</span>
              <span className="qp-num">{curQ + 1} of {QUESTIONS.length}</span>
            </div>
            <div className="qp-track"><div className="qp-fill" style={{ width: `${((curQ + 1) / QUESTIONS.length) * 100}%` }} /></div>
            <div className="qp-dots">
              {QUESTIONS.map((_, i) => (
                <div key={i} className={`qp-dot ${i < curQ ? 'done' : i === curQ ? 'active' : ''}`} />
              ))}
            </div>
          </div>

          <div className="question-card" key={curQ}>
            <div className="q-meta">
              <span className="q-tag" style={{ background: currentQ.tagColor, borderColor: currentQ.tagBorder, color: currentQ.tagText }}>{currentQ.tag}</span>
              <span className="q-category">{currentQ.category}</span>
            </div>
            <div className="q-title">{currentQ.title}</div>
            
            <div className="q-sub" dangerouslySetInnerHTML={{ __html: currentQ.sub ? currentQ.sub.replace(/\*\*(.+?)\*\*/g, '<b>$1</b>') : '' }} />

            {/* Choice */}
            {currentQ.type === 'choice' && (
              <div className={`choice-grid ${currentQ.grid}`}>
                {currentQ.opts.map(opt => (
                  <div
                    key={opt.v}
                    className={`choice-opt ${answers[currentQ.id] === opt.v ? 'selected' : ''}`}
                    onClick={() => { handleAnswer(opt.v); setTimeout(nextQ, 200); }}
                  >
                    <div className="choice-ico">{opt.ico}</div>
                    <div style={{ flex: 1 }}>
                      <div className="choice-label">{opt.label}</div>
                      {opt.desc && <div className="choice-desc">{opt.desc}</div>}
                    </div>
                    <div className="choice-check">{answers[currentQ.id] === opt.v ? '✓' : ''}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Textarea */}
            {currentQ.type === 'textarea' && (
              <div>
                <textarea
                  ref={textareaRef}
                  className="q-textarea"
                  placeholder={currentQ.placeholder}
                  value={answers[currentQ.id] || ''}
                  onChange={e => handleAnswer(e.target.value)}
                  rows={5}
                  maxLength={currentQ.maxChars}
                />
                <div className={`q-char-count ${(answers[currentQ.id] || '').length >= (currentQ.minChars || 0) ? 'good' : ''}`}>
                  {(answers[currentQ.id] || '').length} / {currentQ.maxChars} chars
                  {currentQ.minChars && (answers[currentQ.id] || '').length < currentQ.minChars
                    ? ` · ${currentQ.minChars - (answers[currentQ.id] || '').length} more to unlock`
                    : ' · ✓ Sufficient'}
                </div>
              </div>
            )}

            {/* Slider */}
            {currentQ.type === 'slider' && (
              <div className="q-slider-wrap">
                <div className="q-slider-display">{answers[currentQ.id] || currentQ.defaultVal}{currentQ.unit}</div>
                <input
                  type="range" className="q-range"
                  min={currentQ.min} max={currentQ.max} step={currentQ.step}
                  value={answers[currentQ.id] || currentQ.defaultVal}
                  onChange={e => handleAnswer(parseInt(e.target.value))}
                />
                <div className="q-range-marks">{currentQ.marks.map(m => <span key={m}>{m}</span>)}</div>
              </div>
            )}

            {/* Insight */}
            {currentQ.insight && (
              <div className="q-insight">
                <span className="q-insight-ico">{currentQ.insight.ico}</span>
                <span className="q-insight-text" dangerouslySetInnerHTML={{ __html: currentQ.insight.text }} />
              </div>
            )}

            {/* Nav */}
            <div className="q-nav">
              {curQ > 0 && <button className="btn-back" onClick={prevQ}>← Back</button>}
              {currentQ.type !== 'choice' && (
                <button
                  className="btn-next"
                  disabled={currentQ.required && !(answers[currentQ.id]) && currentQ.type !== 'slider'}
                  onClick={nextQ}
                >
                  {curQ === QUESTIONS.length - 1 ? '✨ Generate My SOP →' : 'Continue →'}
                </button>
              )}
              {currentQ.skippable && <button className="btn-skip" onClick={skipQ}>Skip →</button>}
            </div>
          </div>
        </div>
      )}

      {/* ════════ GENERATING PHASE ════════ */}
      {phase === 'generating' && (
        <div className="gen-outer">
          <div className="gen-globe">
            <div className="gen-ring gen-ring-1" />
            <div className="gen-ring gen-ring-2" />
            <div className="gen-ring gen-ring-3" />
            <div className="gen-core">✍️</div>
          </div>
          <div className="gen-title">CRAFTING YOUR SOP</div>
          <div className="gen-sub">PERSONALIZING EVERY SENTENCE FOR YOU</div>
          <div className="gen-quality-label">⚡ AI Analysis + Mentor Intelligence = Your Best Draft</div>
          <div style={{ width: '100%', maxWidth: '360px' }}>
            <div className="gen-progress-bar"><div className="gen-progress-fill" style={{ width: `${genProgress}%` }} /></div>
          </div>
          <div className="gen-steps">
            {GEN_STEPS.map((s, i) => (
              <div key={i} className={`gen-step ${i < genStep ? 'done' : i === genStep ? 'active' : i === genStep + 1 ? 'visible' : ''}`}>
                <div className="gen-step-dot" />{s}
              </div>
            ))}
          </div>
          <div style={{ fontFamily: 'var(--ffm)', fontSize: '.65rem', color: 'var(--t3)', marginTop: '8px' }}>
            Destination: <span style={{ color: 'var(--cyan)' }}>{answers.destination}</span> · Target: <span style={{ color: 'var(--teal)' }}>{answers.wordLimit} words</span>
          </div>
        </div>
      )}

      {/* ════════ EDITOR PHASE ════════ */}
      {phase === 'editor' && (
        <div className="editor-outer">

          {/* LEFT: EDITOR */}
          <div className="editor-main">

            {/* Header */}
            <div className="editor-header fade-up">
              <div className="editor-title-area">
                <div className="editor-eyebrow">YOUR STATEMENT OF PURPOSE · AI DRAFT v1.0</div>
                <div className="editor-h1">SOP — {answers.destination}</div>
                <div className="editor-meta">
                  <div className="editor-chip" style={{ color: 'var(--teal)', borderColor: 'rgba(0,229,168,.2)', background: 'rgba(0,229,168,.07)' }}>
                    🎓 {answers.destination}
                  </div>
                  <div className="editor-chip" style={{ color: 'var(--cyan)', borderColor: 'rgba(0,245,255,.2)', background: 'rgba(0,245,255,.07)' }}>
                    📝 {analysis.words} words
                  </div>
                  <div className="editor-chip" style={{ color: overallScore >= 80 ? 'var(--teal)' : overallScore >= 65 ? 'var(--amber)' : 'var(--rose)', borderColor: 'rgba(0,229,168,.2)', background: 'rgba(0,229,168,.07)' }}>
                    ⭐ Score: {overallScore}/100
                  </div>
                  <div className="editor-chip" style={{ color: 'var(--purple)', borderColor: 'rgba(168,85,247,.2)', background: 'rgba(168,85,247,.07)' }}>
                    🤖 AI Generated
                  </div>
                </div>
              </div>
              <div className="editor-actions">
                <button className="ea-btn ea-purple" onClick={() => setActiveSideTab('mentor')}>
                  👨‍🏫 Mentor Review
                </button>
                <button className="ea-btn ea-ghost" onClick={regenerate} disabled={isRegenerating}>
                  {isRegenerating ? '⏳ Regenerating…' : '🔄 Regenerate'}
                </button>
                <button className="ea-btn ea-primary" onClick={exportSOP}>
                  📄 Export SOP
                </button>
              </div>
            </div>

            {/* Score Banner */}
            <div className="score-banner fade-up">
              <div className="score-item">
                <div className="score-label">OVERALL</div>
                <div className="score-val" style={{ color: overallScore >= 80 ? 'var(--teal)' : overallScore >= 65 ? 'var(--amber)' : 'var(--rose)' }}>{overallScore}</div>
              </div>
              <div className="score-item">
                <div className="score-label">WORDS</div>
                <div className="score-val" style={{ color: 'var(--cyan)' }}>{analysis.words}</div>
              </div>
              <div className="score-item">
                <div className="score-label">READABILITY</div>
                <div className="score-val" style={{ color: analysis.readability > 70 ? 'var(--teal)' : 'var(--amber)' }}>{analysis.readability}</div>
              </div>
              <div className="score-bar-wrap">
                <div className="score-bar-label" style={{ fontFamily: 'var(--ffm)', fontSize: '.6rem', color: 'var(--t2)' }}>Quality Score</div>
                <div className="score-bar-track">
                  <div className="score-bar-fill" style={{ width: `${overallScore}%`, background: `linear-gradient(90deg,${overallScore >= 80 ? 'var(--teal)' : 'var(--amber)'},var(--cyan))` }} />
                </div>
              </div>
              <div className="score-bar-wrap">
                <div className="score-bar-label" style={{ fontFamily: 'var(--ffm)', fontSize: '.6rem', color: 'var(--t2)' }}>Target Progress ({answers.wordLimit}w)</div>
                <div className="score-bar-track">
                  <div className="score-bar-fill" style={{ width: `${Math.min(100, Math.round((analysis.words / (answers.wordLimit || 700)) * 100))}%`, background: 'linear-gradient(90deg,var(--purple),var(--cyan))' }} />
                </div>
              </div>
            </div>

            {/* SOP Document */}
            <div className="sop-document fade-up" ref={sopRef}>
              <div className="sop-doc-header">
                <div className="sop-doc-title">STATEMENT OF PURPOSE · {answers.destination?.toUpperCase()} · {answers.tone || 'PROFESSIONAL'} TONE</div>
                <div className="sop-word-count">{analysis.words} words · ~{analysis.sentences} sentences</div>
              </div>

              {[
                { key: 'intro', label: 'OPENING / HOOK', placeholder: 'Your compelling opening paragraph…' },
                { key: 'background', label: 'ACADEMIC BACKGROUND', placeholder: 'Your academic journey and achievements…' },
                { key: 'projects', label: 'RESEARCH & PROJECTS', placeholder: 'Your key technical projects and research…' },
                { key: 'whyProgram', label: 'WHY THIS PROGRAM', placeholder: 'Why this specific program and university…' },
                { key: 'goals', label: 'CAREER GOALS', placeholder: 'Your short-term and long-term career vision…' },
                { key: 'closing', label: 'CLOSING', placeholder: 'Your compelling closing statement…' },
              ].map((sec, idx) => (
                <div key={sec.key} className="sop-section">
                  <div className="sop-section-label">{sec.label}</div>
                  <div
                    className="sop-editable"
                    contentEditable
                    suppressContentEditableWarning
                    data-placeholder={sec.placeholder}
                    onInput={e => {
                      const updated = { ...sopSections, [sec.key]: e.currentTarget.textContent || '' };
                      setSopSections(updated);
                      setOverallScore(calcOverallScore(updated));
                    }}
                    dangerouslySetInnerHTML={{ __html: sopSections[sec.key] || '' }}
                  />
                  {idx < 5 && <div className="sop-section-divider" />}
                </div>
              ))}

              <div className="sop-doc-footer">
                <div className="sop-footer-label">Click any section to edit directly · Changes save automatically</div>
                <div className="sop-footer-ai">⚡ CLAUDE AI + MENTORBRIDGE INTELLIGENCE</div>
              </div>
            </div>

          </div>

          {/* RIGHT: SIDEBAR */}
          <div className="editor-sidebar">
            <div className="sidebar-tabs">
              {[
                { key: 'analysis', label: 'Analysis' },
                { key: 'mentor', label: 'Mentor' },
                { key: 'history', label: 'History' },
              ].map(t => (
                <div key={t.key} className={`sb-tab ${activeSideTab === t.key ? 'active' : ''}`} onClick={() => setActiveSideTab(t.key)}>{t.label}</div>
              ))}
            </div>

            <div className="sidebar-body">

              {/* ANALYSIS TAB */}
              {activeSideTab === 'analysis' && (
                <>
                  <div className="analysis-section">
                    <div className="analysis-title">Document Metrics</div>
                    {[
                      { name: 'Word Count', val: analysis.words, badge: analysis.words >= (answers.wordLimit * 0.9) ? 'good' : 'warn', label: analysis.words >= (answers.wordLimit * 0.9) ? 'ON TARGET' : 'BELOW TARGET' },
                      { name: 'Sentences', val: analysis.sentences, badge: 'info', label: analysis.sentences + ' total' },
                      { name: 'Readability', val: analysis.readability + '/100', badge: analysis.readability > 70 ? 'good' : 'warn', label: analysis.readability > 70 ? 'CLEAR' : 'DENSE' },
                      { name: 'Specific Numbers', val: '', badge: analysis.hasNumbers ? 'good' : 'bad', label: analysis.hasNumbers ? 'PRESENT ✓' : 'MISSING ✗' },
                      { name: 'Professor Named', val: '', badge: analysis.hasProfessor ? 'good' : 'bad', label: analysis.hasProfessor ? 'PRESENT ✓' : 'ADD THIS ✗' },
                      { name: 'Research Focus', val: '', badge: analysis.hasResearch ? 'good' : 'warn', label: analysis.hasResearch ? 'STRONG ✓' : 'WEAK' },
                      { name: 'Personal Hook', val: '', badge: analysis.hasHook ? 'good' : 'warn', label: analysis.hasHook ? 'PRESENT ✓' : 'ADD HOOK' },
                    ].map(m => (
                      <div key={m.name} className="metric-row">
                        <span className="metric-name">{m.name}</span>
                        <span className={`metric-badge mb-${m.badge}`}>{m.val} {m.label}</span>
                      </div>
                    ))}
                  </div>

                  <div className="analysis-section">
                    <div className="analysis-title">AI Suggestions ({suggestions.length})</div>
                    {suggestions.map((s, i) => (
                      <div key={i} className={`suggestion-card ${s.type}`}>
                        <div className="sug-type" style={{ color: s.type === 'critical' ? 'var(--rose)' : s.type === 'improve' ? 'var(--amber)' : 'var(--teal)' }}>
                          {s.type === 'critical' ? '🔴 CRITICAL' : s.type === 'improve' ? '🟡 IMPROVE' : '🟢 GOOD'}
                        </div>
                        <div className="sug-text" dangerouslySetInnerHTML={{ __html: s.text }} />
                        {s.action && <div className="sug-action" onClick={() => toast('✏️ Click the relevant section in the editor to update it', '✏️')}>{s.action}</div>}
                      </div>
                    ))}
                  </div>

                  <div className="analysis-section">
                    <div className="analysis-title">Country-Specific Tips</div>
                    <div className="suggestion-card good" style={{ cursor: 'default' }}>
                      <div className="sug-type" style={{ color: 'var(--cyan)' }}>🌍 {answers.destination?.toUpperCase() || 'GENERAL'}</div>
                      <div className="sug-text">
                        {answers.destination === 'Germany' && 'German ML is academic, concise, and research-focused. Avoid personal anecdotes. Focus on academic merit, research alignment, and professional precision.'}
                        {answers.destination === 'USA' && 'US SOP = your personal narrative. Open with a specific story. Show intellectual growth. Connect every dot from past to future goal.'}
                        {answers.destination === 'UK' && 'UK personal statement: 500–700 words max. Direct, no fluff. Why this program specifically, what you bring, and your clear career goals.'}
                        {answers.destination === 'Canada' && 'Canadian SOP: emphasize research interests prominently. Name specific labs, professors, and research groups. Connect to long-term career explicitly.'}
                        {answers.destination === 'Australia' && 'Australian statement: goal-oriented and practical. Why Australia? What will you study? What will you do with it? Clean structure, no filler.'}
                        {answers.destination === 'Ireland' && 'Irish personal statement: 300–500 words. Extremely concise. One clear purpose, one clear fit. Quality over quantity.'}
                        {!answers.destination && 'Set your destination to get country-specific tips.'}
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* MENTOR TAB */}
              {activeSideTab === 'mentor' && (
                <>
                  <div className="analysis-section">
                    <div className="analysis-title">Mentor Annotations</div>
                    {MENTOR_ANNOTATIONS.map(ann => (
                      <div key={ann.id} className="annotation-item">
                        <div className="ann-header">
                          <div className="ann-av"><img src={ann.mentorImg} alt={ann.mentorName} /></div>
                          <div className="ann-name">{ann.mentorName}</div>
                          <div className="ann-time">{ann.time}</div>
                        </div>
                        <div className="ann-text" dangerouslySetInnerHTML={{ __html: ann.text }} />
                        <div className="ann-tag">{ann.tag}</div>
                        <div className="ann-reply" onClick={() => toast('💬 Reply sent to mentor', '💬')}>↩ Reply to mentor</div>
                      </div>
                    ))}
                    {userAnnotations.map(ann => (
                      <div key={ann.id} className="annotation-item" style={{ borderColor: 'rgba(0,245,255,.2)' }}>
                        <div className="ann-header">
                          <div className="ann-av"><img src={ann.mentorImg} alt="" /></div>
                          <div className="ann-name">{ann.mentorName}</div>
                          <div className="ann-time">{ann.time}</div>
                        </div>
                        <div className="ann-text">{ann.text}</div>
                        <div className="ann-tag" style={{ background: 'rgba(0,245,255,.08)', border: '1px solid rgba(0,245,255,.2)', color: 'var(--cyan)' }}>{ann.tag}</div>
                      </div>
                    ))}
                  </div>

                  <div style={{ background: 'rgba(0,245,255,.03)', border: '1px solid rgba(0,245,255,.1)', borderRadius: '12px', padding: '14px', marginBottom: '16px' }}>
                    <div style={{ fontFamily: 'var(--ffm)', fontSize: '.62rem', color: 'var(--teal)', letterSpacing: '.1em', marginBottom: '8px' }}>REQUEST MENTOR REVIEW</div>
                    <div style={{ fontFamily: 'var(--ffm)', fontSize: '.68rem', color: 'var(--t2)', marginBottom: '12px', lineHeight: '1.55' }}>
                      Your assigned mentor <b style={{ color: 'var(--cyan)' }}>Aarav Mehta</b> can review your SOP and provide detailed annotations within 24 hours.
                    </div>
                    <button
                      onClick={() => toast('📨 Mentor review requested! Aarav will respond within 24h', '📨')}
                      style={{ width: '100%', padding: '9px', borderRadius: '8px', border: 'none', background: 'linear-gradient(135deg,var(--cyan),var(--teal))', color: '#020a12', fontFamily: 'var(--ffb)', fontSize: '.8rem', fontWeight: '800', cursor: 'pointer' }}>
                      📨 Request Review from Aarav
                    </button>
                  </div>
                </>
              )}

              {/* HISTORY TAB */}
              {activeSideTab === 'history' && (
                <div className="analysis-section">
                  <div className="analysis-title">Version History</div>
                  {versions.map((v, i) => (
                    <div key={i} className={`version-item ${v.current ? 'current' : ''}`} onClick={() => toast(`📋 Loaded ${v.num}`, '📋')}>
                      <div className="ver-header">
                        <div className="ver-num">{v.num}</div>
                        {v.current && <div className="ver-badge">CURRENT</div>}
                      </div>
                      <div className="ver-meta">{v.label} · {v.time}</div>
                      <div className="ver-score">Quality Score: {v.score}/100</div>
                    </div>
                  ))}
                  {versions.length === 0 && (
                    <div style={{ fontFamily: 'var(--ffm)', fontSize: '.68rem', color: 'var(--t3)', textAlign: 'center', padding: '24px' }}>No versions yet</div>
                  )}
                  <div style={{ marginTop: '12px' }}>
                    <button onClick={regenerate} disabled={isRegenerating} style={{ width: '100%', padding: '9px', borderRadius: '8px', border: '1px solid var(--b)', background: 'transparent', color: 'var(--t2)', fontFamily: 'var(--ffb)', fontSize: '.8rem', fontWeight: '600', cursor: 'pointer', transition: 'all .2s' }}>
                      {isRegenerating ? '⏳ Regenerating…' : '🔄 Generate New Version'}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Add note input (always visible) */}
            {activeSideTab === 'mentor' && (
              <div className="add-ann-wrap">
                <div className="add-ann-label">Add Your Note</div>
                <textarea
                  className="add-ann-input"
                  placeholder="Highlight a section and add your note here…"
                  value={annotationInput}
                  onChange={e => setAnnotationInput(e.target.value)}
                  rows={3}
                />
                <button className="add-ann-btn" onClick={addAnnotation}>+ Add Note</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TOAST ZONE */}
      <div className="sop-toast">
        {toasts.map(t => (
          <div key={t.id} className="toast-item">
            <span style={{ fontSize: '1rem', flexShrink: 0 }}>{t.ico}</span>
            <span>{t.msg}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   PROMPT BUILDERS
══════════════════════════════════════════════════════════════ */
function buildSystemPrompt(answers) {
  const dest = answers.destination || 'Germany';
  const tone = answers.tone || 'Professional & Academic';

  const destGuide = {
    Germany: 'German Motivation Letter: 500–800 words. Formal, academic, research-focused. Avoid personal anecdotes unless very relevant. Emphasize academic achievements, technical skills, and research alignment. Mention specific professors or research groups. No flowery language.',
    USA: 'US Statement of Purpose: 700–1000 words. Personal narrative is essential. Open with a specific, vivid moment or story (the hook). Show intellectual growth and self-awareness. Connect past → present → future goals in a clear arc. Be specific about the program and why this university over others.',
    UK: 'UK Personal Statement: 500–700 words. Direct, structured, no filler. Clearly state why this program, what relevant experience you have, and your career goals. Concise and impactful.',
    Canada: 'Canadian SOP: 700–900 words. Emphasize research interests prominently. Name specific labs, professors, and research groups. Connect academic background to research and career goals explicitly.',
    Australia: 'Australian Statement: 600–800 words. Goals-focused and practical. Why Australia, why this program, practical career plan, and what you contribute.',
    Ireland: 'Irish Personal Statement: 300–500 words. Extremely concise. Clear purpose, clear fit, clear goals. Quality over quantity.',
  }[dest] || '';

  return `You are an expert SOP (Statement of Purpose) writer specializing in graduate school applications. You write compelling, authentic, and strategically crafted SOPs that genuinely represent the student.

DESTINATION GUIDE:
${destGuide}

TONE: ${tone}

CRITICAL RULES:
1. Do NOT use placeholder text like [INSERT NAME] or [UNIVERSITY NAME] — use the actual information provided
2. Structure the SOP with clear sections: Opening/Hook, Academic Background, Research & Projects, Why This Program, Career Goals, Closing
3. Each section should be separated by exactly: "==SECTION:intro==", "==SECTION:background==", "==SECTION:projects==", "==SECTION:whyProgram==", "==SECTION:goals==", "==SECTION:closing=="
4. Write in the student's authentic voice — not corporate or generic
5. Include specific details from the student's answers
6. Quantify achievements where possible
7. The opening paragraph must be compelling and specific — never start with "I have always been passionate about"
8. Aim for approximately ${answers.wordLimit || 700} words total`;
}

function buildUserPrompt(answers) {
  return `Please write an SOP for a student with the following profile:

DESTINATION: ${answers.destination || 'Germany'}
PROGRAM: ${answers.program || 'MS Computer Science'}
TARGET UNIVERSITY: ${answers.university || 'TU Munich'}
ACADEMIC BACKGROUND: ${answers.background || 'B.Tech Computer Science, CGPA 8.4'}
PROJECTS & RESEARCH: ${answers.projects || 'Machine learning projects, hackathon winner'}
WORK EXPERIENCE: ${answers.workex || 'Software engineering internship'}
WHY THIS PROGRAM: ${answers.whyThisUni || 'Strong research program, faculty alignment'}
CAREER GOALS: ${answers.careerGoal || 'ML Engineer, then research'}
DEFINING MOMENT/HOOK: ${answers.pivotMoment || ''}
CHALLENGES TO ADDRESS: ${answers.challenges || 'None'}
PREFERRED TONE: ${answers.tone || 'Professional & Academic'}
TARGET WORD COUNT: ${answers.wordLimit || 700}

Write a complete, polished SOP using the section markers specified.`;
}

/* ══════════════════════════════════════════════════════════════
   SECTION PARSER
══════════════════════════════════════════════════════════════ */
function parseSections(text) {
  const sectionMap = { intro: '', background: '', projects: '', whyProgram: '', goals: '', closing: '' };
  const markers = ['intro', 'background', 'projects', 'whyProgram', 'goals', 'closing'];

  markers.forEach((marker, i) => {
    const startTag = `==SECTION:${marker}==`;
    const nextTag = i < markers.length - 1 ? `==SECTION:${markers[i + 1]}==` : null;
    const startIdx = text.indexOf(startTag);
    if (startIdx === -1) return;
    const contentStart = startIdx + startTag.length;
    const endIdx = nextTag ? text.indexOf(nextTag) : text.length;
    sectionMap[marker] = text.substring(contentStart, endIdx === -1 ? text.length : endIdx).trim();
  });

  // If no markers found, distribute text evenly
  const hasContent = Object.values(sectionMap).some(v => v.length > 0);
  if (!hasContent) {
    const paragraphs = text.split(/\n{2,}/).filter(p => p.trim());
    const keys = Object.keys(sectionMap);
    paragraphs.forEach((p, i) => {
      if (i < keys.length) sectionMap[keys[i]] = p.trim();
      else sectionMap[keys[keys.length - 1]] += '\n\n' + p.trim();
    });
  }

  return sectionMap;
}

/* ══════════════════════════════════════════════════════════════
   FALLBACK SOP GENERATOR (used if API unavailable)
══════════════════════════════════════════════════════════════ */
function generateFallbackSOP(answers, alt = false) {
  const dest = answers.destination || 'Germany';
  const program = answers.program || 'Master of Science in Computer Science';
  const uni = answers.university || 'TU Munich';
  const background = answers.background || 'B.Tech Computer Science with a CGPA of 8.4';
  const projects = answers.projects || 'multiple machine learning projects and research work';
  const workex = answers.workex || 'software engineering internship experience';
  const whyUni = answers.whyThisUni || 'the university\'s strong research focus and industry connections';
  const goals = answers.careerGoal || 'contribute to cutting-edge AI research and then apply it in industry';
  const hook = answers.pivotMoment || '';

  if (dest === 'Germany') {
    return `==SECTION:intro==
${hook ? `${hook}\n\nThis experience crystallized my academic direction: I would pursue advanced studies in ${program} to develop the technical depth required to address such challenges at scale.` : `The intersection of theoretical foundations and applied impact has defined my academic journey. Having completed my ${background}, I am motivated to deepen my expertise through graduate study in ${program} at ${uni}.`}

==SECTION:background==
My academic foundation in computer science has been both rigorous and purposeful. ${background}. My curriculum encompassed advanced coursework in machine learning, algorithms, distributed systems, and software engineering — providing the theoretical grounding essential for graduate-level research. Consistently strong performance in analytical and quantitative courses reflects my capacity for the demands of a research-intensive program.

==SECTION:projects==
${projects} These experiences were formative. Working on complex technical challenges required not only programming proficiency but the ability to formulate problems precisely, survey relevant literature, and design methodologically sound experiments — skills I look forward to applying in a research environment of ${uni}'s calibre. ${workex ? `My professional exposure through ${workex} further strengthened my understanding of how theoretical advances translate to real-world systems.` : ''}

==SECTION:whyProgram==
My decision to apply to ${uni} is deliberate and well-researched. ${whyUni}. The program's structure — combining rigorous theoretical coursework with hands-on research — is rare among graduate programs globally. I am particularly drawn to the research groups working at the intersection of machine learning and systems, and I am eager to contribute to this intellectual environment while being based in one of Europe's most innovation-dense cities.

==SECTION:goals==
In the near term, I aim to join a research team in Munich or Berlin working on applied machine learning, ideally at the intersection of AI systems and real-world deployment challenges. ${goals}. This graduate program represents the precise bridge between my current capabilities and my long-term ambitions — providing the academic depth, research network, and international perspective that will define my professional trajectory.

==SECTION:closing==
I am confident that my academic preparation, research experience, and clarity of purpose make me a strong candidate for this program. I am excited about the prospect of contributing to the intellectual community at ${uni} and am grateful for the committee's consideration of my application.`;
  }

  return `==SECTION:intro==
${hook ? `${hook}\n\nThat moment changed everything. It showed me precisely what I want to spend my career building — and exactly why I need the world-class training that ${uni}'s ${program} offers.` : `There is a particular kind of problem that keeps me awake at night: not because it frightens me, but because I can see the solution — and I can see that building it will require more than I currently know. Pursuing a ${program} at ${uni} is how I intend to close that gap.`}

==SECTION:background==
My foundation is built on ${background}. Rather than treating my coursework as a series of disconnected requirements, I pursued it as a coherent preparation for research: every project was an opportunity to ask a harder question, and every course was a lens through which to examine the same underlying problems from a different angle. This integrative approach to learning is what I bring to graduate study.

==SECTION:projects==
The work I am most proud of reflects this philosophy. ${projects}. In each case, I was not simply implementing known methods — I was asking whether those methods were the right ones, and occasionally discovering that they were not. ${workex ? `This pattern continued in my professional experience: ${workex}, where I learned that real systems surface the limitations of theory in ways that are deeply instructive.` : ''}

==SECTION:whyProgram==
I applied to ${uni} because of ${whyUni}. This specificity matters. I have studied the research coming out of this program carefully, and I see genuine alignment between my interests and the work being done here. I am not looking for a prestigious credential — I am looking for the specific intellectual community, mentorship, and resources that will allow me to make a meaningful research contribution.

==SECTION:goals==
After completing this program, I intend to ${goals}. This is not an abstract aspiration — it is a concrete plan built on a realistic assessment of where the field is heading and what role I am positioned to play in it. Every component of my application — my choice of courses, my research projects, my professional experience — has been directed toward making this plan executable.

==SECTION:closing==
I am applying to ${uni} because I believe it is the right place, at the right time, for the work I want to do. I hope the admissions committee sees in my application not just a capable student, but someone who will make the most of this extraordinary opportunity.`;
}