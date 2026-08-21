'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'

// ═══════════════════════════════════════════════════════════════════════════════
// DECISION MATRIX — Pure JS, Zero API
// Keys: background_interest_passion_geo_goal → results
// ═══════════════════════════════════════════════════════════════════════════════

const UNIVERSITIES = [
  {
    id: 'tum',
    name: 'TU Munich',
    short: 'TUM',
    country: 'Germany',
    flag: '🇩🇪',
    col: '#0066CC',
    glow: 'rgba(0,102,204,.35)',
    qsRank: 37,
    tier: 'Elite',
    tuition: '€0/yr',
    minGPA: 75,
    minIELTS: 6.5,
    weights: { gpa: 28, ielts: 22, german: 18, aps: 16, projects: 9, workExp: 7 },
    thresholds: {
      gpa:    [{ min: 90, bonus: 25 }, { min: 80, bonus: 15 }, { min: 75, bonus: 5 }, { min: 70, bonus: -10 }, { min: 0, bonus: -25 }],
      ielts:  [{ min: 8.0, bonus: 22 }, { min: 7.5, bonus: 16 }, { min: 7.0, bonus: 10 }, { min: 6.5, bonus: 2 }, { min: 0, bonus: -20 }],
      german: { none: -15, a1: -5, a2: 3, b1: 10, b2: 18, c1: 22 },
      aps:    { none: -20, inProgress: -5, cleared: 16 },
      projects: 2.2,
      workExp:  1.8,
    },
    base: 25,
    facts: ['Rudolf Diesel invented diesel engine here', '€0 tuition', 'BMW/Siemens next door'],
  },
  {
    id: 'rwth',
    name: 'RWTH Aachen',
    short: 'RWTH',
    country: 'Germany',
    flag: '🇩🇪',
    col: '#00549F',
    glow: 'rgba(0,84,159,.35)',
    qsRank: 106,
    tier: 'Top',
    tuition: '€0/yr',
    minGPA: 70,
    minIELTS: 6.5,
    weights: { gpa: 25, ielts: 20, german: 16, aps: 16, projects: 12, workExp: 11 },
    thresholds: {
      gpa:    [{ min: 85, bonus: 22 }, { min: 78, bonus: 14 }, { min: 70, bonus: 6 }, { min: 65, bonus: -5 }, { min: 0, bonus: -18 }],
      ielts:  [{ min: 7.5, bonus: 20 }, { min: 7.0, bonus: 13 }, { min: 6.5, bonus: 6 }, { min: 6.0, bonus: -3 }, { min: 0, bonus: -15 }],
      german: { none: -12, a1: -3, a2: 4, b1: 9, b2: 16, c1: 20 },
      aps:    { none: -20, inProgress: -5, cleared: 16 },
      projects: 2.8,
      workExp:  2.4,
    },
    base: 30,
    facts: ['#1 Automotive Engineering', 'VW/Ford partner', 'Volkswagen recruits here'],
  },
  {
    id: 'tuberlin',
    name: 'TU Berlin',
    short: 'TUB',
    country: 'Germany',
    flag: '🇩🇪',
    col: '#E2001A',
    glow: 'rgba(226,0,26,.3)',
    qsRank: 154,
    tier: 'Strong',
    tuition: '€0/yr',
    minGPA: 65,
    minIELTS: 6.0,
    weights: { gpa: 22, ielts: 18, german: 14, aps: 14, projects: 18, workExp: 14 },
    thresholds: {
      gpa:    [{ min: 82, bonus: 20 }, { min: 75, bonus: 13 }, { min: 65, bonus: 7 }, { min: 60, bonus: -2 }, { min: 0, bonus: -12 }],
      ielts:  [{ min: 7.5, bonus: 18 }, { min: 7.0, bonus: 12 }, { min: 6.5, bonus: 7 }, { min: 6.0, bonus: 2 }, { min: 0, bonus: -10 }],
      german: { none: -8, a1: 0, a2: 5, b1: 10, b2: 14, c1: 18 },
      aps:    { none: -18, inProgress: -4, cleared: 14 },
      projects: 3.5,
      workExp:  2.8,
    },
    base: 38,
    facts: ['Werner Siemens founded Siemens here', 'Amazon EU HQ in Berlin', 'Berlin startup capital'],
  },
  {
    id: 'kit',
    name: 'KIT Karlsruhe',
    short: 'KIT',
    country: 'Germany',
    flag: '🇩🇪',
    col: '#009682',
    glow: 'rgba(0,150,130,.3)',
    qsRank: 119,
    tier: 'Top',
    tuition: '€0/yr',
    minGPA: 68,
    minIELTS: 6.0,
    weights: { gpa: 24, ielts: 19, german: 15, aps: 14, projects: 15, workExp: 13 },
    thresholds: {
      gpa:    [{ min: 85, bonus: 22 }, { min: 76, bonus: 14 }, { min: 68, bonus: 6 }, { min: 62, bonus: -3 }, { min: 0, bonus: -14 }],
      ielts:  [{ min: 7.5, bonus: 19 }, { min: 7.0, bonus: 12 }, { min: 6.5, bonus: 6 }, { min: 6.0, bonus: 1 }, { min: 0, bonus: -12 }],
      german: { none: -10, a1: -2, a2: 4, b1: 9, b2: 15, c1: 19 },
      aps:    { none: -18, inProgress: -4, cleared: 14 },
      projects: 3.0,
      workExp:  2.5,
    },
    base: 35,
    facts: ['Karl Benz invented the automobile here', 'SAP HQ 20 min away', 'Enterprise software pipeline'],
  },
  {
    id: 'tudresden',
    name: 'TU Dresden',
    short: 'TUD',
    country: 'Germany',
    flag: '🇩🇪',
    col: '#007A53',
    glow: 'rgba(0,122,83,.3)',
    qsRank: 298,
    tier: 'Good',
    tuition: '€0/yr',
    minGPA: 62,
    minIELTS: 6.0,
    weights: { gpa: 20, ielts: 17, german: 13, aps: 13, projects: 20, workExp: 17 },
    thresholds: {
      gpa:    [{ min: 80, bonus: 18 }, { min: 72, bonus: 12 }, { min: 62, bonus: 6 }, { min: 58, bonus: 0 }, { min: 0, bonus: -8 }],
      ielts:  [{ min: 7.5, bonus: 17 }, { min: 7.0, bonus: 11 }, { min: 6.5, bonus: 6 }, { min: 6.0, bonus: 2 }, { min: 0, bonus: -8 }],
      german: { none: -6, a1: 1, a2: 5, b1: 9, b2: 13, c1: 17 },
      aps:    { none: -15, inProgress: -3, cleared: 13 },
      projects: 4.0,
      workExp:  3.2,
    },
    base: 44,
    facts: ['TSMC building fab near Dresden', 'Semiconductor hub', 'Future chip engineering'],
  },
  {
    id: 'lmu',
    name: 'LMU Munich',
    short: 'LMU',
    country: 'Germany',
    flag: '🇩🇪',
    col: '#009A44',
    glow: 'rgba(0,154,68,.3)',
    qsRank: 59,
    tier: 'Elite',
    tuition: '€0/yr',
    minGPA: 72,
    minIELTS: 6.5,
    weights: { gpa: 26, ielts: 21, german: 17, aps: 15, projects: 12, workExp: 9 },
    thresholds: {
      gpa:    [{ min: 88, bonus: 24 }, { min: 80, bonus: 16 }, { min: 72, bonus: 7 }, { min: 66, bonus: -4 }, { min: 0, bonus: -20 }],
      ielts:  [{ min: 8.0, bonus: 21 }, { min: 7.5, bonus: 15 }, { min: 7.0, bonus: 9 }, { min: 6.5, bonus: 2 }, { min: 0, bonus: -18 }],
      german: { none: -13, a1: -4, a2: 3, b1: 10, b2: 17, c1: 21 },
      aps:    { none: -18, inProgress: -4, cleared: 15 },
      projects: 2.5,
      workExp:  2.0,
    },
    base: 28,
    facts: ['Max Planck & Heisenberg studied here', 'Quantum mechanics birthplace', '42 Nobel laureates'],
  },
]

const GERMAN_LEVELS = ['none', 'a1', 'a2', 'b1', 'b2', 'c1']
const GERMAN_LABELS = { none: 'None', a1: 'A1 Beginner', a2: 'A2 Elementary', b1: 'B1 Intermediate', b2: 'B2 Upper', c1: 'C1 Advanced' }
const APS_OPTIONS = ['none', 'inProgress', 'cleared']
const APS_LABELS = { none: 'Not Started', inProgress: 'In Progress', cleared: 'Cleared ✓' }

// ─── PURE JS PROBABILITY CALCULATOR ─────────────────────────────────────────
function calcProbability(uni, inputs) {
  const { gpa, ielts, german, aps, projects, workExp } = inputs
  let score = uni.base

  // GPA scoring
  const gpaThreshold = uni.thresholds.gpa.find(t => gpa >= t.min)
  if (gpaThreshold) score += gpaThreshold.bonus

  // IELTS scoring
  const ieltsThreshold = uni.thresholds.ielts.find(t => ielts >= t.min)
  if (ieltsThreshold) score += ieltsThreshold.bonus

  // German level
  score += uni.thresholds.german[german] || 0

  // APS status
  score += uni.thresholds.aps[aps] || 0

  // Projects (0-10 scale)
  score += Math.min(projects * uni.thresholds.projects, 18)

  // Work experience (0-5 years)
  score += Math.min(workExp * uni.thresholds.workExp, 15)

  // Hard disqualifications
  if (gpa < uni.minGPA - 5) score -= 20
  if (ielts < uni.minIELTS - 0.5) score -= 15
  if (aps === 'none') score = Math.min(score, 45)

  return Math.max(3, Math.min(97, Math.round(score)))
}

function getProbColor(prob) {
  if (prob >= 70) return '#00E5A8'
  if (prob >= 50) return '#FFB347'
  if (prob >= 30) return '#FF9500'
  return '#FF4D6D'
}

function getProbLabel(prob) {
  if (prob >= 80) return { label: 'VERY LIKELY', col: '#00E5A8' }
  if (prob >= 65) return { label: 'GOOD CHANCE', col: '#00D4FF' }
  if (prob >= 50) return { label: 'POSSIBLE',    col: '#FFB347' }
  if (prob >= 35) return { label: 'REACH',        col: '#FF9500' }
  return                 { label: 'VERY REACH',   col: '#FF4D6D' }
}

function getBiggestBoost(inputs) {
  const tips = []
  if (inputs.ielts < 7.0)   tips.push({ action: 'Raise IELTS to 7.0', impact: '+12–22% across all unis' })
  if (inputs.gpa < 78)      tips.push({ action: 'GPA already set — focus on other factors', impact: 'GPA fixed' })
  if (inputs.aps === 'none') tips.push({ action: 'Book APS appointment NOW', impact: '+13–16% (mandatory)' })
  if (inputs.german === 'none' || inputs.german === 'a1') tips.push({ action: 'Learn German to B1', impact: '+10–18% across all unis' })
  if (inputs.projects < 3)  tips.push({ action: 'Add 2 more GitHub projects', impact: '+6–8% immediately' })
  return tips.slice(0, 3)
}

// ─── CSS ─────────────────────────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Syne:wght@400;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');

.wim-root {
  --bg: #07090F; --bg1: #0B0E1A; --bg2: #0E1220; --bg3: #121828;
  --border: rgba(255,255,255,.07); --border2: rgba(255,255,255,.13);
  --cyan: #00D4FF; --teal: #00E5A8; --violet: #8B7FFF;
  --gold: #FFB347; --rose: #FF4D6D;
  --tx: #E2E8F4; --muted: #4A6080; --dim: #1E2E44;
  --ffh: 'Bebas Neue', sans-serif;
  --ffb: 'Syne', sans-serif;
  --ffm: 'JetBrains Mono', monospace;
  background: var(--bg); color: var(--tx); font-family: var(--ffb);
  min-height: 100vh; padding: 0;
}
.wim-root * { box-sizing: border-box; margin: 0; padding: 0; }
.wim-root a { text-decoration: none; color: inherit; }
.wim-root button { cursor: pointer; font-family: var(--ffb); border: none; background: none; }
.wim-root ::-webkit-scrollbar { width: 4px; }
.wim-root ::-webkit-scrollbar-thumb { background: rgba(255,255,255,.1); border-radius: 4px; }

/* BG */
.wim-bg { position: fixed; inset: 0; z-index: 0; pointer-events: none; overflow: hidden; }
.wim-orb { position: absolute; border-radius: 50%; filter: blur(120px); }
.wim-orb-1 { width: 600px; height: 600px; background: radial-gradient(circle, rgba(0,212,255,.08), transparent); top: -100px; left: -100px; animation: orbFloat 18s ease-in-out infinite alternate; }
.wim-orb-2 { width: 500px; height: 500px; background: radial-gradient(circle, rgba(139,127,255,.06), transparent); bottom: -80px; right: -80px; animation: orbFloat 22s ease-in-out infinite alternate-reverse; }
@keyframes orbFloat { 0%{transform:translate(0,0)} 100%{transform:translate(30px,20px)} }

/* LAYOUT */
.wim-wrap { position: relative; z-index: 2; max-width: 1360px; margin: 0 auto; padding: 0 24px 60px; }

/* TOP NAV */
.wim-nav { height: 58px; display: flex; align-items: center; justify-content: space-between; margin-bottom: 32px; border-bottom: 1px solid var(--border); }
.wim-nav-logo { display: flex; align-items: center; gap: 10px; font-family: var(--ffb); font-weight: 700; font-size: 1rem; color: #fff; }
.wim-nav-logo-icon { width: 32px; height: 32px; border-radius: 8px; background: linear-gradient(135deg, var(--cyan), var(--teal)); display: flex; align-items: center; justify-content: center; box-shadow: 0 0 16px rgba(0,212,255,.3); flex-shrink: 0; }
.wim-nav-logo em { font-style: normal; color: var(--teal); }
.wim-nav-badge { font-family: var(--ffm); font-size: .62rem; padding: 4px 12px; border: 1px solid rgba(0,212,255,.3); border-radius: 20px; background: rgba(0,212,255,.06); color: var(--cyan); letter-spacing: .1em; display: flex; align-items: center; gap: 6px; }
.wim-nav-dot { width: 5px; height: 5px; border-radius: 50%; background: var(--cyan); box-shadow: 0 0 6px var(--cyan); animation: navPulse 2s infinite; }
@keyframes navPulse { 0%,100%{box-shadow:0 0 4px var(--cyan)} 50%{box-shadow:0 0 14px var(--cyan)} }
.wim-back { font-family: var(--ffm); font-size: .68rem; color: var(--muted); letter-spacing: .08em; padding: 6px 14px; border: 1px solid var(--border); border-radius: 8px; transition: all .2s; }
.wim-back:hover { border-color: var(--border2); color: var(--tx); }

/* HERO */
.wim-hero { text-align: center; margin-bottom: 40px; }
.wim-hero-tag { font-family: var(--ffm); font-size: .65rem; color: var(--violet); letter-spacing: .16em; text-transform: uppercase; margin-bottom: 12px; }
.wim-hero-title { font-family: var(--ffh); font-size: clamp(44px, 6vw, 80px); color: #fff; letter-spacing: .04em; line-height: .95; margin-bottom: 12px; }
.wim-hero-title span { background: linear-gradient(135deg, var(--cyan), var(--teal)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
.wim-hero-sub { font-size: 1rem; color: var(--muted); max-width: 520px; margin: 0 auto; line-height: 1.6; }

/* MAIN GRID */
.wim-grid { display: grid; grid-template-columns: 380px 1fr; gap: 24px; align-items: start; }

/* SLIDERS PANEL */
.wim-sliders { background: rgba(11,14,26,.8); border: 1px solid var(--border); border-radius: 18px; padding: 24px; backdrop-filter: blur(20px); position: sticky; top: 24px; }
.wim-sliders-title { font-family: var(--ffh); font-size: 1.3rem; letter-spacing: .06em; color: #fff; margin-bottom: 4px; }
.wim-sliders-sub { font-family: var(--ffm); font-size: .6rem; color: var(--muted); letter-spacing: .1em; margin-bottom: 22px; }

/* SLIDER ITEM */
.wim-sl-item { margin-bottom: 20px; }
.wim-sl-item:last-of-type { margin-bottom: 0; }
.wim-sl-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; }
.wim-sl-label { font-family: var(--ffm); font-size: .62rem; color: var(--muted); letter-spacing: .1em; text-transform: uppercase; }
.wim-sl-val { font-family: var(--ffh); font-size: 1.4rem; line-height: 1; }
.wim-sl-impact { font-family: var(--ffm); font-size: .58rem; padding: 2px 7px; border-radius: 4px; letter-spacing: .06em; }
.wim-range { -webkit-appearance: none; appearance: none; width: 100%; height: 4px; border-radius: 2px; outline: none; cursor: pointer; background: rgba(255,255,255,.08); }

/* ✨ FIXED THE THUMB BACKGROUND COLOR SO IT IS VISIBLE ✨ */
.wim-range::-webkit-slider-thumb { 
  -webkit-appearance: none; 
  width: 18px; 
  height: 18px; 
  border-radius: 50%; 
  cursor: pointer; 
  background: #ffffff; 
  border: 2px solid #07090F; 
  box-shadow: 0 0 10px #ffffff; 
  transition: transform .15s; 
}

.wim-range::-webkit-slider-thumb:hover { transform: scale(1.2); }
.wim-range-marks { display: flex; justify-content: space-between; margin-top: 4px; }
.wim-range-mark { font-family: var(--ffm); font-size: .55rem; color: var(--dim); }
.wim-divider { height: 1px; background: var(--border); margin: 18px 0; }

/* TOGGLE ROW */
.wim-toggle-row { display: flex; gap: 6px; flex-wrap: wrap; }
.wim-toggle-btn { padding: 6px 12px; border-radius: 8px; font-family: var(--ffm); font-size: .6rem; letter-spacing: .08em; border: 1px solid var(--border); color: var(--muted); transition: all .18s; }
.wim-toggle-btn:hover { border-color: var(--border2); color: var(--tx); }
.wim-toggle-btn.on { border-color: rgba(0,212,255,.4); background: rgba(0,212,255,.08); color: var(--cyan); }

/* RESULTS PANEL */
.wim-results { display: flex; flex-direction: column; gap: 16px; }

/* UNI CARD */
.wim-uni-card { background: rgba(11,14,26,.8); border: 1px solid var(--border); border-radius: 16px; padding: 20px 22px; backdrop-filter: blur(16px); transition: border-color .2s, transform .15s; position: relative; overflow: hidden; }
.wim-uni-card:hover { border-color: var(--border2); transform: translateX(4px); }
.wim-uni-card::before { content: ''; position: absolute; top: 0; left: 0; bottom: 0; width: 3px; }

.wim-uc-top { display: flex; align-items: center; gap: 14px; margin-bottom: 14px; }
.wim-uc-flag { font-size: 1.6rem; flex-shrink: 0; }
.wim-uc-info { flex: 1; min-width: 0; }
.wim-uc-name { font-family: var(--ffh); font-size: 1.4rem; color: #fff; letter-spacing: .03em; line-height: 1; margin-bottom: 3px; }
.wim-uc-meta { font-family: var(--ffm); font-size: .6rem; color: var(--muted); display: flex; align-items: center; gap: 8px; }
.wim-uc-meta span { display: flex; align-items: center; gap: 3px; }
.wim-uc-right { text-align: right; flex-shrink: 0; }
.wim-uc-pct { font-family: var(--ffh); font-size: 2.8rem; line-height: 1; letter-spacing: .02em; }
.wim-uc-verdict { font-family: var(--ffm); font-size: .6rem; letter-spacing: .1em; margin-top: 2px; }

/* PROBABILITY BAR */
.wim-prob-bar { margin-bottom: 12px; }
.wim-prob-bar-bg { height: 8px; background: rgba(255,255,255,.06); border-radius: 4px; overflow: hidden; }
.wim-prob-bar-fill { height: 100%; border-radius: 4px; transition: width 0.8s cubic-bezier(.4,0,.2,1); position: relative; }
.wim-prob-bar-fill::after { content: ''; position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,.2) 50%, transparent 100%); animation: shimmer 2s infinite; }
@keyframes shimmer { 0%{transform:translateX(-100%)} 100%{transform:translateX(200%)} }

/* FACTORS */
.wim-factors { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; }
.wim-factor { background: rgba(255,255,255,.025); border: 1px solid var(--border); border-radius: 8px; padding: 8px 10px; }
.wim-factor-label { font-family: var(--ffm); font-size: .55rem; color: var(--muted); letter-spacing: .08em; text-transform: uppercase; margin-bottom: 3px; }
.wim-factor-bar { height: 3px; background: rgba(255,255,255,.06); border-radius: 2px; overflow: hidden; margin-bottom: 3px; }
.wim-factor-fill { height: 100%; border-radius: 2px; transition: width 0.6s ease; }
.wim-factor-val { font-family: var(--ffm); font-size: .62rem; font-weight: 600; }

/* SUMMARY CARD */
.wim-summary { background: rgba(11,14,26,.8); border: 1px solid var(--border); border-radius: 16px; padding: 22px; backdrop-filter: blur(16px); }
.wim-sum-title { font-family: var(--ffh); font-size: 1.2rem; color: #fff; letter-spacing: .06em; margin-bottom: 16px; }
.wim-sum-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 18px; }
.wim-sum-stat { background: rgba(255,255,255,.03); border: 1px solid var(--border); border-radius: 10px; padding: 12px; text-align: center; }
.wim-sum-stat-val { font-family: var(--ffh); font-size: 1.8rem; margin-bottom: 3px; line-height: 1; }
.wim-sum-stat-lbl { font-family: var(--ffm); font-size: .58rem; color: var(--muted); letter-spacing: .08em; }

/* TIPS */
.wim-tips { }
.wim-tips-title { font-family: var(--ffm); font-size: .62rem; color: var(--cyan); letter-spacing: .12em; text-transform: uppercase; margin-bottom: 10px; display: flex; align-items: center; gap: 6px; }
.wim-tip { display: flex; gap: 10px; padding: 10px 12px; background: rgba(255,255,255,.025); border: 1px solid var(--border); border-radius: 9px; margin-bottom: 7px; align-items: flex-start; }
.wim-tip:last-child { margin-bottom: 0; }
.wim-tip-ico { font-size: 1rem; flex-shrink: 0; }
.wim-tip-action { font-size: .82rem; font-weight: 600; color: #fff; margin-bottom: 2px; }
.wim-tip-impact { font-family: var(--ffm); font-size: .62rem; color: var(--teal); }

/* TOP UNI HIGHLIGHT */
.wim-top-uni { background: linear-gradient(135deg, rgba(0,212,255,.08), rgba(0,229,168,.04)); border: 1px solid rgba(0,212,255,.25); border-radius: 12px; padding: 14px 16px; margin-bottom: 16px; display: flex; align-items: center; gap: 12px; }
.wim-top-uni-crown { font-size: 1.6rem; }
.wim-top-uni-text { flex: 1; }
.wim-top-uni-label { font-family: var(--ffm); font-size: .58rem; color: var(--cyan); letter-spacing: .12em; text-transform: uppercase; margin-bottom: 2px; }
.wim-top-uni-name { font-family: var(--ffh); font-size: 1.2rem; color: #fff; letter-spacing: .04em; }
.wim-top-uni-pct { font-family: var(--ffh); font-size: 2rem; color: var(--teal); letter-spacing: .02em; }

/* CHANGE INDICATOR */
.wim-change { font-family: var(--ffm); font-size: .62rem; padding: 2px 7px; border-radius: 4px; display: inline-flex; align-items: center; gap: 3px; }
.wim-change.up { background: rgba(0,229,168,.1); color: var(--teal); border: 1px solid rgba(0,229,168,.25); }
.wim-change.down { background: rgba(255,77,109,.1); color: var(--rose); border: 1px solid rgba(255,77,109,.25); }
.wim-change.same { background: rgba(255,255,255,.04); color: var(--muted); border: 1px solid var(--border); }

/* ANIMS */
@keyframes fadeUp { from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)} }
.wim-fade { animation: fadeUp .5s ease both; }
.wd1{animation-delay:.04s}.wd2{animation-delay:.08s}.wd3{animation-delay:.12s}
.wd4{animation-delay:.16s}.wd5{animation-delay:.2s}.wd6{animation-delay:.24s}

@media(max-width:900px){ .wim-grid{grid-template-columns:1fr} .wim-sliders{position:static} .wim-factors{grid-template-columns:1fr 1fr} .wim-sum-grid{grid-template-columns:1fr 1fr} }
@media(max-width:600px){ .wim-factors{grid-template-columns:1fr} .wim-sum-grid{grid-template-columns:1fr} }
`

// ─── COMPONENT ────────────────────────────────────────────────────────────────
export default function WhatIfMachine() {
  const [inputs, setInputs] = useState({
    gpa:     75,
    ielts:   6.5,
    german:  'none',
    aps:     'none',
    projects: 2,
    workExp:  0,
  })

  const [prevProbs, setPrevProbs] = useState({})
  const [animated, setAnimated] = useState(false)

  useEffect(() => { setAnimated(true) }, [])

  const probs = UNIVERSITIES.reduce((acc, uni) => {
    acc[uni.id] = calcProbability(uni, inputs)
    return acc
  }, {})

  const sortedUnis = [...UNIVERSITIES].sort((a, b) => probs[b.id] - probs[a.id])
  const bestUni = sortedUnis[0]
  const avgProb = Math.round(Object.values(probs).reduce((a, b) => a + b, 0) / UNIVERSITIES.length)
  const highChance = Object.values(probs).filter(p => p >= 60).length
  const tips = getBiggestBoost(inputs)

  const updateInput = useCallback((key, val) => {
    setPrevProbs({ ...probs })
    setInputs(prev => ({ ...prev, [key]: val }))
  }, [probs])

  const getFactorPct = (uni, factor) => {
    const { gpa, ielts, german, aps, projects, workExp } = inputs
    switch (factor) {
      case 'gpa':      return Math.min(100, Math.max(0, ((gpa - 55) / 45) * 100))
      case 'ielts':    return Math.min(100, Math.max(0, ((ielts - 5) / 4) * 100))
      case 'german':   return ({ none: 0, a1: 20, a2: 40, b1: 60, b2: 80, c1: 100 })[german]
      case 'aps':      return ({ none: 0, inProgress: 50, cleared: 100 })[aps]
      case 'projects': return Math.min(100, (projects / 10) * 100)
      case 'workExp':  return Math.min(100, (workExp / 5) * 100)
      default:         return 50
    }
  }

  const getChangeIcon = (uniId) => {
    if (!prevProbs[uniId]) return null
    const diff = probs[uniId] - prevProbs[uniId]
    if (diff > 0) return <span className="wim-change up">↑ +{diff}%</span>
    if (diff < 0) return <span className="wim-change down">↓ {diff}%</span>
    return <span className="wim-change same">—</span>
  }

  return (
    <div className="wim-root">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      {/* BG */}
      <div className="wim-bg">
        <div className="wim-orb wim-orb-1"/>
        <div className="wim-orb wim-orb-2"/>
      </div>

      <div className="wim-wrap">
        {/* NAV */}
        <nav className="wim-nav">
          <div className="wim-nav-logo">
            <div className="wim-nav-logo-icon">
              <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
                <path d="M9 2L16 9L9 16L2 9Z" fill="white" fillOpacity=".92"/>
              </svg>
            </div>
            Mentor<em>Bridge</em>
          </div>
          <div className="wim-nav-badge">
            <div className="wim-nav-dot"/>
            LIVE PROBABILITY ENGINE
          </div>
          <Link href="/dashboard/student" className="wim-back">← Dashboard</Link>
        </nav>

        {/* HERO */}
        <div className={`wim-hero wim-fade`}>
          <div className="wim-hero-tag">✦ Zero API · Pure Intelligence · Real-Time</div>
          <div className="wim-hero-title">THE <span>WHAT-IF</span><br/>MACHINE</div>
          <p className="wim-hero-sub">
            Move one slider. Watch 6 university probabilities update live.
            Discover exactly which improvement has the biggest impact on your chances.
          </p>
        </div>

        {/* MAIN GRID */}
        <div className="wim-grid">

          {/* ── SLIDERS ── */}
          <div className={`wim-sliders wim-fade wd1`}>
            <div className="wim-sliders-title">YOUR PROFILE</div>
            <div className="wim-sliders-sub">DRAG TO SEE INSTANT IMPACT →</div>

            {/* GPA */}
            <div className="wim-sl-item">
              <div className="wim-sl-header">
                <span className="wim-sl-label">📊 GPA / Percentage</span>
                <span className="wim-sl-val" style={{color:'#00D4FF'}}>{inputs.gpa}%</span>
              </div>
              <input type="range" className="wim-range" min={55} max={100} step={1} value={inputs.gpa}
                onChange={e => updateInput('gpa', +e.target.value)}
                style={{'--thumb-color':'#00D4FF', accentColor:'#00D4FF'}}
              />
              <div className="wim-range-marks">
                <span className="wim-range-mark">55%</span>
                <span className="wim-range-mark">70%</span>
                <span className="wim-range-mark">80%</span>
                <span className="wim-range-mark">90%</span>
                <span className="wim-range-mark">100%</span>
              </div>
            </div>

            {/* IELTS */}
            <div className="wim-sl-item">
              <div className="wim-sl-header">
                <span className="wim-sl-label">🗣 IELTS Score</span>
                <div style={{display:'flex',alignItems:'center',gap:8}}>
                  {inputs.ielts < 6.5 && <span className="wim-sl-impact" style={{background:'rgba(255,77,109,.1)',color:'#FF4D6D',border:'1px solid rgba(255,77,109,.3)'}}>LOW</span>}
                  {inputs.ielts >= 7.0 && <span className="wim-sl-impact" style={{background:'rgba(0,229,168,.1)',color:'#00E5A8',border:'1px solid rgba(0,229,168,.3)'}}>GOOD</span>}
                  <span className="wim-sl-val" style={{color:'#00E5A8'}}>{inputs.ielts.toFixed(1)}</span>
                </div>
              </div>
              <input type="range" className="wim-range" min={50} max={90} step={5} value={inputs.ielts * 10}
                onChange={e => updateInput('ielts', +e.target.value / 10)}
                style={{accentColor:'#00E5A8'}}
              />
              <div className="wim-range-marks">
                <span className="wim-range-mark">5.0</span>
                <span className="wim-range-mark">6.0</span>
                <span className="wim-range-mark">7.0</span>
                <span className="wim-range-mark">8.0</span>
                <span className="wim-range-mark">9.0</span>
              </div>
            </div>

            {/* PROJECTS */}
            <div className="wim-sl-item">
              <div className="wim-sl-header">
                <span className="wim-sl-label">💻 GitHub Projects</span>
                <span className="wim-sl-val" style={{color:'#8B7FFF'}}>{inputs.projects}</span>
              </div>
              <input type="range" className="wim-range" min={0} max={10} step={1} value={inputs.projects}
                onChange={e => updateInput('projects', +e.target.value)}
                style={{accentColor:'#8B7FFF'}}
              />
              <div className="wim-range-marks">
                <span className="wim-range-mark">0</span>
                <span className="wim-range-mark">3</span>
                <span className="wim-range-mark">5</span>
                <span className="wim-range-mark">8</span>
                <span className="wim-range-mark">10</span>
              </div>
            </div>

            {/* WORK EXP */}
            <div className="wim-sl-item">
              <div className="wim-sl-header">
                <span className="wim-sl-label">🏢 Work Experience</span>
                <span className="wim-sl-val" style={{color:'#FFB347'}}>{inputs.workExp} yr{inputs.workExp !== 1 ? 's' : ''}</span>
              </div>
              <input type="range" className="wim-range" min={0} max={5} step={1} value={inputs.workExp}
                onChange={e => updateInput('workExp', +e.target.value)}
                style={{accentColor:'#FFB347'}}
              />
              <div className="wim-range-marks">
                {[0,1,2,3,4,5].map(v => <span key={v} className="wim-range-mark">{v}yr</span>)}
              </div>
            </div>

            <div className="wim-divider"/>

            {/* GERMAN LEVEL */}
            <div className="wim-sl-item">
              <div className="wim-sl-header">
                <span className="wim-sl-label">🇩🇪 German Level</span>
                <span style={{fontFamily:'var(--ffm)',fontSize:'.68rem',color: inputs.german==='none'?'var(--rose)':inputs.german==='c1'?'var(--teal)':'var(--gold)'}}>
                  {GERMAN_LABELS[inputs.german]}
                </span>
              </div>
              <div className="wim-toggle-row">
                {GERMAN_LEVELS.map(lv => (
                  <button key={lv} className={`wim-toggle-btn${inputs.german === lv ? ' on' : ''}`}
                    onClick={() => updateInput('german', lv)}>
                    {lv.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            <div className="wim-divider"/>

            {/* APS STATUS */}
            <div className="wim-sl-item">
              <div className="wim-sl-header">
                <span className="wim-sl-label">📋 APS Status</span>
                <span style={{fontFamily:'var(--ffm)',fontSize:'.65rem',color:inputs.aps==='none'?'var(--rose)':inputs.aps==='cleared'?'var(--teal)':'var(--gold)'}}>
                  {APS_LABELS[inputs.aps]}
                </span>
              </div>
              <div className="wim-toggle-row">
                {APS_OPTIONS.map(opt => (
                  <button key={opt} className={`wim-toggle-btn${inputs.aps === opt ? ' on' : ''}`}
                    onClick={() => updateInput('aps', opt)}>
                    {APS_LABELS[opt]}
                  </button>
                ))}
              </div>
              {inputs.aps === 'none' && (
                <div style={{marginTop:8,padding:'8px 10px',background:'rgba(255,77,109,.07)',border:'1px solid rgba(255,77,109,.2)',borderRadius:8,fontFamily:'var(--ffm)',fontSize:'.6rem',color:'var(--rose)'}}>
                  ⚠️ APS is mandatory for German universities. Book immediately — it takes 6–8 weeks.
                </div>
              )}
            </div>
          </div>

          {/* ── RESULTS ── */}
          <div className="wim-results">

            {/* Best pick highlight */}
            <div className={`wim-top-uni wim-fade wd2`}>
              <div className="wim-top-uni-crown">👑</div>
              <div className="wim-top-uni-text">
                <div className="wim-top-uni-label">BEST MATCH FOR YOUR PROFILE</div>
                <div className="wim-top-uni-name">{bestUni.name} — {bestUni.facts[0]}</div>
              </div>
              <div className="wim-top-uni-pct">{probs[bestUni.id]}%</div>
            </div>

            {/* University cards */}
            {sortedUnis.map((uni, i) => {
              const prob = probs[uni.id]
              const pCol = getProbColor(prob)
              const { label, col } = getProbLabel(prob)
              const factorPcts = ['gpa', 'ielts', 'german', 'aps', 'projects', 'workExp'].map(f => ({
                key: f,
                label: { gpa: 'GPA', ielts: 'IELTS', german: 'German', aps: 'APS', projects: 'Projects', workExp: 'Exp' }[f],
                pct: getFactorPct(uni, f),
                col: { gpa: '#00D4FF', ielts: '#00E5A8', german: '#FFB347', aps: '#FF9500', projects: '#8B7FFF', workExp: '#38bdf8' }[f],
              }))

              return (
                <div key={uni.id} className={`wim-uni-card wim-fade`} style={{animationDelay:`${.04 + i * .06}s`}}>
                  <div style={{position:'absolute',top:0,left:0,bottom:0,width:3,background:uni.col,boxShadow:`0 0 12px ${uni.glow}`}}/>

                  <div className="wim-uc-top">
                    <div className="wim-uc-flag">{uni.flag}</div>
                    <div className="wim-uc-info">
                      <div className="wim-uc-name">{uni.name}</div>
                      <div className="wim-uc-meta">
                        <span>QS #{uni.qsRank}</span>
                        <span>·</span>
                        <span style={{color:uni.col}}>{uni.tier}</span>
                        <span>·</span>
                        <span style={{color:'#00E5A8'}}>{uni.tuition}</span>
                        <span>·</span>
                        <span>{getChangeIcon(uni.id)}</span>
                      </div>
                    </div>
                    <div className="wim-uc-right">
                      <div className="wim-uc-pct" style={{color: pCol}}>{prob}%</div>
                      <div className="wim-uc-verdict" style={{color: col}}>{label}</div>
                    </div>
                  </div>

                  {/* Main probability bar */}
                  <div className="wim-prob-bar">
                    <div className="wim-prob-bar-bg">
                      <div className="wim-prob-bar-fill" style={{width:`${animated ? prob : 0}%`, background:`linear-gradient(90deg, ${uni.col}, ${pCol})`}}/>
                    </div>
                  </div>

                  {/* Factor breakdown */}
                  <div className="wim-factors">
                    {factorPcts.map(f => (
                      <div key={f.key} className="wim-factor">
                        <div className="wim-factor-label">{f.label}</div>
                        <div className="wim-factor-bar">
                          <div className="wim-factor-fill" style={{width:`${animated ? f.pct : 0}%`, background: f.col}}/>
                        </div>
                        <div className="wim-factor-val" style={{color: f.col}}>{Math.round(f.pct)}%</div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}

            {/* Summary + Tips */}
            <div className={`wim-summary wim-fade wd6`}>
              <div className="wim-sum-title">PROFILE INTELLIGENCE REPORT</div>
              <div className="wim-sum-grid">
                <div className="wim-sum-stat">
                  <div className="wim-sum-stat-val" style={{color:'var(--cyan)'}}>{avgProb}%</div>
                  <div className="wim-sum-stat-lbl">AVG PROBABILITY</div>
                </div>
                <div className="wim-sum-stat">
                  <div className="wim-sum-stat-val" style={{color:'var(--teal)'}}>{highChance}</div>
                  <div className="wim-sum-stat-lbl">UNIS ABOVE 60%</div>
                </div>
                <div className="wim-sum-stat">
                  <div className="wim-sum-stat-val" style={{color:'var(--violet)'}}>{probs[bestUni.id]}%</div>
                  <div className="wim-sum-stat-lbl">BEST CHANCE</div>
                </div>
              </div>

              {tips.length > 0 && (
                <div className="wim-tips">
                  <div className="wim-tips-title">
                    <span>⚡</span> HIGHEST IMPACT ACTIONS FOR YOU
                  </div>
                  {tips.map((tip, i) => (
                    <div key={i} className="wim-tip">
                      <div className="wim-tip-ico">{i === 0 ? '🎯' : i === 1 ? '📋' : '💡'}</div>
                      <div>
                        <div className="wim-tip-action">{tip.action}</div>
                        <div className="wim-tip-impact">{tip.impact}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}