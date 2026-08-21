"use client";
import React, { useState, useEffect } from 'react';

/* ══════════════════════════════════════════════════════════════
   DATA
══════════════════════════════════════════════════════════════ */
const BANKS = [
  {
    id: 'sbi', name: 'SBI Ed-Vantage', shortName: 'SBI', domain: 'sbi.co.in', type: 'PSB',
    maxAmount: 15000000, rate: 11.15, rateType: 'Floating (MCLR+2%)',
    collReq: true, collThresh: 750000, coAppReq: 'yes',
    processingFee: '₹10,000', processingTime: 18, moratorium: 6,
    tenure: 15, support: ['all'], url: 'https://sbi.co.in/',
    bestFor: ['Large loan amounts', 'Property collateral', 'Govt. institution students'],
    highlight: 'Highest loan ceiling in India', highlightColor: '#34d399',
    taxBenefit: true, prepayPenalty: false,
    warning: 'Processing takes 15–20 days. Collateral valuation adds another week.',
  },
  {
    id: 'bob', name: 'Bank of Baroda Scholar', shortName: 'BoB', domain: 'bankofbaroda.in', type: 'PSB',
    maxAmount: 8000000, rate: 9.7, rateType: 'Floating (Repo+4.25%)',
    collReq: true, collThresh: 750000, coAppReq: 'yes',
    processingFee: 'Nil', processingTime: 20, moratorium: 6,
    tenure: 15, support: ['all'], url: 'https://www.bankofbaroda.in/',
    bestFor: ['Lowest interest rate', 'Nil processing fee', 'Germany & Canada'],
    highlight: 'Lowest rate among PSBs — 9.7%', highlightColor: '#00f5d4',
    taxBenefit: true, prepayPenalty: false,
    warning: 'Dedicated foreign education loan. Collateral mandatory above ₹7.5L.',
  },
  {
    id: 'pnb', name: 'PNB Udaan', shortName: 'PNB', domain: 'pnbindia.in', type: 'PSB',
    maxAmount: 2000000, rate: 11.5, rateType: 'Floating',
    collReq: false, collThresh: 2000000, coAppReq: 'yes',
    processingFee: 'Nil', processingTime: 20, moratorium: 6,
    tenure: 15, support: ['all'], url: 'https://www.pnbindia.in/',
    bestFor: ['No collateral up to ₹20L', 'First-time borrowers', 'Lower amounts'],
    highlight: 'Fully unsecured up to ₹20L', highlightColor: '#a855f7',
    taxBenefit: true, prepayPenalty: false,
    warning: 'Cap of ₹20L may not cover full tuition for USA/UK.',
  },
  {
    id: 'canara', name: 'Canara IBA Model', shortName: 'Canara', domain: 'canarabank.com', type: 'PSB',
    maxAmount: 4000000, rate: 11.5, rateType: 'Floating',
    collReq: true, collThresh: 750000, coAppReq: 'yes',
    processingFee: '₹5,000', processingTime: 20, moratorium: 6,
    tenure: 15, support: ['all'], url: 'https://canarabank.com/',
    bestFor: ['Govt. approved schemes', 'IBA model loans', 'Stable institutions'],
    highlight: 'IBA-approved standardized scheme', highlightColor: '#f59e0b',
    taxBenefit: true, prepayPenalty: false,
    warning: 'Strict documentation. IBA model requires CGPA 50%+ consistently.',
  },
  {
    id: 'boi', name: 'Bank of India Star', shortName: 'BoI', domain: 'bankofindia.co.in', type: 'PSB',
    maxAmount: 3000000, rate: 11.0, rateType: 'Floating',
    collReq: true, collThresh: 750000, coAppReq: 'yes',
    processingFee: 'Nil', processingTime: 15, moratorium: 6,
    tenure: 15, support: ['all'], url: 'https://bankofindia.co.in/',
    bestFor: ['Fast PSB processing', 'Nil processing fee', 'Good CGPA profiles'],
    highlight: 'Fastest PSB — 15 days average', highlightColor: '#38bdf8',
    taxBenefit: true, prepayPenalty: false,
    warning: '11% rate but max ₹30L limits utility for high-cost destinations.',
  },
  {
    id: 'hdfc', name: 'HDFC Credila', shortName: 'Credila', domain: 'hdfccredila.com', type: 'Private',
    maxAmount: 7500000, rate: 11.5, rateType: 'Floating (HDFC PLR linked)',
    collReq: false, collThresh: 4000000, coAppReq: 'yes',
    processingFee: '1% + GST', processingTime: 7, moratorium: 6,
    tenure: 12, support: ['all'], url: 'https://www.hdfccredila.com/',
    bestFor: ['Fastest approval', 'Unsecured up to ₹40L', '500+ universities'],
    highlight: 'Fastest approval — 5–7 days', highlightColor: '#00f5d4',
    taxBenefit: true, prepayPenalty: true,
    warning: '1% processing fee on ₹50L = ₹59K deducted before disbursal.',
  },
  {
    id: 'icici', name: 'ICICI Bank', shortName: 'ICICI', domain: 'icicibank.com', type: 'Private',
    maxAmount: 10000000, rate: 11.0, rateType: 'Floating',
    collReq: true, collThresh: 2000000, coAppReq: 'yes',
    processingFee: '0.5–1%', processingTime: 10, moratorium: 6,
    tenure: 12, support: ['all'], url: 'https://www.icicibank.com/',
    bestFor: ['High loan amount', 'Top-ranked universities', 'Fast private bank'],
    highlight: 'Up to ₹1 Crore for premier institutes', highlightColor: '#f59e0b',
    taxBenefit: true, prepayPenalty: true,
    warning: 'Compounding interest during moratorium inflates principal.',
  },
  {
    id: 'axis', name: 'Axis Bank', shortName: 'Axis', domain: 'axisbank.com', type: 'Private',
    maxAmount: 7500000, rate: 11.2, rateType: 'Floating',
    collReq: false, collThresh: 4000000, coAppReq: 'yes',
    processingFee: '1%', processingTime: 7, moratorium: 6,
    tenure: 12, support: ['all'], url: 'https://www.axisbank.com/',
    bestFor: ['No collateral up to ₹40L', 'Good credit score profiles', 'Quick disbursal'],
    highlight: 'Flexible collateral structure', highlightColor: '#a855f7',
    taxBenefit: true, prepayPenalty: true,
    warning: 'Rate can increase post-admission if RBI repo changes.',
  },
  {
    id: 'avanse', name: 'Avanse Financial', shortName: 'Avanse', domain: 'avanse.com', type: 'NBFC',
    maxAmount: 7500000, rate: 12.0, rateType: 'Fixed or Floating',
    collReq: false, collThresh: 7500000, coAppReq: 'yes',
    processingFee: '1–2% + GST', processingTime: 4, moratorium: 6,
    tenure: 12, support: ['all'], url: 'https://www.avanse.com/',
    bestFor: ['No collateral any amount', 'Lower-ranked universities', 'Urgent disbursals'],
    highlight: '100% unsecured — zero collateral needed', highlightColor: '#34d399',
    taxBenefit: true, prepayPenalty: true,
    warning: '2% fee + GST = ₹1.18L taken from ₹50L loan before you see it.',
  },
  {
    id: 'incred', name: 'InCred Finance', shortName: 'InCred', domain: 'incred.com', type: 'NBFC',
    maxAmount: 6000000, rate: 12.5, rateType: 'Fixed',
    collReq: false, collThresh: 6000000, coAppReq: 'yes',
    processingFee: '1.5% + GST', processingTime: 5, moratorium: 6,
    tenure: 10, support: ['all'], url: 'https://www.incred.com/',
    bestFor: ['Non-ranked universities', 'Flexible eligibility', 'Tier-2 city applications'],
    highlight: 'Accepts 1,000+ global universities', highlightColor: '#fb4d6d',
    taxBenefit: true, prepayPenalty: true,
    warning: 'Fixed rate sounds safer but you lose the benefit if rates drop.',
  },
  {
    id: 'auxilo', name: 'Auxilo', shortName: 'Auxilo', domain: 'auxilo.com', type: 'NBFC',
    maxAmount: 7500000, rate: 12.5, rateType: 'Fixed or Floating',
    collReq: false, collThresh: 7500000, coAppReq: 'yes',
    processingFee: '1–2%', processingTime: 5, moratorium: 6,
    tenure: 12, support: ['all'], url: 'https://www.auxilo.com/',
    bestFor: ['500+ universities', '15-day approval guarantee', 'Unsecured large amounts'],
    highlight: '15-day guaranteed approval on complete documents', highlightColor: '#f59e0b',
    taxBenefit: true, prepayPenalty: false,
    warning: 'Rate higher than PSBs — total interest paid over 12 years is ₹30L+ more.',
  },
  {
    id: 'mpower', name: 'MPOWER Financing', shortName: 'MPOWER', domain: 'mpowerfinancing.com', type: 'Global',
    maxAmount: 8300000, rate: 13.0, rateType: 'Fixed (USD-based)',
    collReq: false, collThresh: 10000000, coAppReq: 'no',
    processingFee: '5% origination', processingTime: 10, moratorium: 0,
    tenure: 10, support: ['USA', 'Canada'], url: 'https://www.mpowerfinancing.com/',
    bestFor: ['No Indian co-signer', 'No collateral', 'Admitted to USA/Canada university'],
    highlight: 'Zero co-signer needed — truly independent', highlightColor: '#a855f7',
    taxBenefit: false, prepayPenalty: false,
    warning: '5% origination fee + USD rate = higher effective cost. Repayment starts during study.',
  },
  {
    id: 'prodigy', name: 'Prodigy Finance', shortName: 'Prodigy', domain: 'prodigyfinance.com', type: 'Global',
    maxAmount: 8300000, rate: 12.5, rateType: 'Variable (SOFR+margin)',
    collReq: false, collThresh: 10000000, coAppReq: 'no',
    processingFee: '5% admin fee', processingTime: 10, moratorium: 6,
    tenure: 10, support: ['all'], url: 'https://prodigyfinance.com/',
    bestFor: ['Top-ranked global universities', 'No co-signer required', 'MBA/MS programs'],
    highlight: 'Lends based on future earnings potential', highlightColor: '#38bdf8',
    taxBenefit: false, prepayPenalty: false,
    warning: 'Only for top 500 QS-ranked programs. Variable SOFR rate can rise significantly.',
  },
  {
    id: 'leap', name: 'Leap Finance', shortName: 'Leap', domain: 'leapfinance.com', type: 'Global',
    maxAmount: 5000000, rate: 11.0, rateType: 'Floating',
    collReq: false, collThresh: 5000000, coAppReq: 'yes',
    processingFee: 'Nil', processingTime: 5, moratorium: 6,
    tenure: 10, support: ['USA', 'Canada', 'UK', 'Australia', 'Ireland'], url: 'https://leapfinance.com/',
    bestFor: ['India-based lender globally', 'No collateral', 'Fastest disbursal abroad'],
    highlight: 'India-based global lender — best of both worlds', highlightColor: '#00f5d4',
    taxBenefit: true, prepayPenalty: false,
    warning: 'Max ₹50L cap may not cover full 2-year USA programs.',
  },
];

const WARNINGS = [
  { icon: '📄', title: 'Processing Fee Trap', coverTitle: 'The "Admin Fee"',
    desc: 'NBFCs charge 1–2% processing fees + GST. On a ₹50L loan, that is <strong>₹1.18 Lakhs deducted before you receive a rupee</strong>. Always negotiate. PSBs often waive it entirely.', color: '#ef4444' },
  { icon: '💱', title: 'Forex Markup on Disbursal', coverTitle: 'The Exchange Rate Lie',
    desc: 'When Indian banks wire INR to your university in USD/EUR, they apply their own rate — <strong>1–2% worse than Google rate</strong>. On ₹50L, that\'s ₹50,000–1,00,000 lost silently.', color: '#f59e0b' },
  { icon: '📈', title: 'Compound Moratorium Trap', coverTitle: 'Interest During Studies',
    desc: 'PSBs charge simple interest during your study period. <strong>Private banks and NBFCs compound it</strong> — your principal on day of graduation is significantly higher than what you borrowed.', color: '#ef4444' },
  { icon: '🛡️', title: 'Forced Insurance Bundle', coverTitle: 'The Insurance Upsell',
    desc: 'Banks will pressure you to buy their term insurance (₹50K–₹1L premium). <strong>You have the legal right</strong> under RBI guidelines to purchase external cheaper insurance and use it for the loan.', color: '#f59e0b' },
  { icon: '⚡', title: 'Prepayment Penalty', coverTitle: 'Punished for Paying Early',
    desc: 'Got a high-paying job abroad? Some private banks and NBFCs charge <strong>2–4% penalty just for paying back early</strong>. PSBs are legally barred from this. NBFC contracts are ruthless.', color: '#ef4444' },
  { icon: '⚖️', title: 'Co-Signer Liability Reality', coverTitle: 'Your Parents Are On the Hook',
    desc: 'Miss one EMI while on OPT job hunting — <strong>recovery agents call your Indian co-signer the same week</strong>. Their CIBIL score is destroyed. Build a 6-month EMI emergency fund before graduation.', color: '#fb4d6d' },
];

const DOC_LISTS = {
  PSB: [
    { emoji: '🪪', doc: 'KYC — Aadhar + PAN for student and co-applicant' },
    { emoji: '🏠', doc: 'Property title deed + recent valuation report from bank-approved valuer' },
    { emoji: '💰', doc: 'Income Tax Returns — last 3 years of co-applicant' },
    { emoji: '🏦', doc: 'Bank statements — last 12 months of co-applicant' },
    { emoji: '🎓', doc: 'Confirmed university admission letter (unconditional)' },
    { emoji: '📋', doc: 'Official fee structure from university registrar' },
    { emoji: '📚', doc: 'Academic marksheets — 10th, 12th, all semesters' },
    { emoji: '✈️', doc: 'Visa copy (if received) or passport copy' },
  ],
  Private: [
    { emoji: '🪪', doc: 'KYC — Aadhar + PAN (student and co-applicant)' },
    { emoji: '💰', doc: 'ITR — last 2 years with Form 16 (co-applicant)' },
    { emoji: '🏦', doc: 'Bank statements — last 6 months (co-applicant)' },
    { emoji: '🎓', doc: 'Admission letter from university' },
    { emoji: '📋', doc: 'Cost of attendance / fee structure document' },
    { emoji: '📚', doc: 'All academic transcripts and certificates' },
    { emoji: '📊', doc: 'GRE/GMAT/IELTS score cards' },
    { emoji: '💼', doc: 'Employment proof if co-applicant is salaried (salary slip, offer letter)' },
  ],
  NBFC: [
    { emoji: '🪪', doc: 'KYC — Aadhar + PAN (student and co-applicant)' },
    { emoji: '💰', doc: 'ITR — last 2 years OR Form 16 (co-applicant)' },
    { emoji: '🏦', doc: 'Bank statements — 6 months' },
    { emoji: '🎓', doc: 'Admission letter — conditional accepted for most NBFCs' },
    { emoji: '📋', doc: 'University cost of attendance official document' },
    { emoji: '📊', doc: 'GRE/IELTS scores (optional but strengthens file)' },
    { emoji: '📚', doc: 'Academic marksheets' },
    { emoji: '⚡', doc: 'NBFCs often waive some docs — ask specifically at application' },
  ],
  Global: [
    { emoji: '🛂', doc: 'Valid passport (minimum 2 years validity)' },
    { emoji: '🎓', doc: 'Unconditional admission offer letter — mandatory' },
    { emoji: '📋', doc: 'Official Cost of Attendance from university financial aid office' },
    { emoji: '📊', doc: 'GRE/GMAT/IELTS score reports (uploaded digitally)' },
    { emoji: '✅', doc: 'No Indian co-applicant or collateral required' },
    { emoji: '📱', doc: 'Valid email and phone — all communication digital' },
    { emoji: '🏦', doc: 'US/UK/CA bank account details for disbursal (some lenders)' },
    { emoji: '📝', doc: 'Enrollment verification letter from university registrar' },
  ],
};

const TIMELINE_STAGES = [
  { label: 'Apply for Loan', icon: '📝', days: '1–3', color: '#00f5d4' },
  { label: 'Bank Processing', icon: '⚙️', days: '5–20', color: '#f59e0b' },
  { label: 'Loan Approval', icon: '✅', days: '1', color: '#34d399' },
  { label: 'Visa Process', icon: '🛂', days: '30–60', color: '#a855f7' },
  { label: 'Disbursal to Uni', icon: '💸', days: '3–7', color: '#00f5d4' },
  { label: 'Study Period', icon: '🎓', days: '12–24 mo', color: '#38bdf8' },
  { label: 'Moratorium', icon: '⏳', days: '6 mo', color: '#f59e0b' },
  { label: 'First EMI', icon: '🏦', days: 'Month 1', color: '#fb4d6d' },
];

/* ══════════════════════════════════════════════════════════════
   CSS
══════════════════════════════════════════════════════════════ */
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=JetBrains+Mono:wght@400;500&family=Syne:wght@400;600;700;800&display=swap');
  :root {
    --teal:#00f5d4; --teal-dim:#00c9ac; --purple:#a855f7; --gold:#f59e0b;
    --bg:#060c14; --bg2:#0d1520; --bg3:#111c2e; --border:rgba(255,255,255,0.07);
    --text:#e2e8f0; --muted:#64748b; --danger:#ef4444; --green:#34d399;
  }

  /* ── BASE ── */
  .fw { background:var(--bg); color:var(--text); font-family:'Syne',sans-serif; overflow-x:hidden; min-height:100vh; padding-bottom:80px; }
  .fw * { box-sizing:border-box; margin:0; padding:0; }
  .fw ::-webkit-scrollbar { width:4px; background:var(--bg); }
  .fw ::-webkit-scrollbar-thumb { background:rgba(0,245,212,.15); border-radius:4px; }

  /* ── GRID BG ── */
  .fw-grid { position:fixed; inset:0; z-index:0; pointer-events:none;
    background-image:linear-gradient(rgba(0,245,212,.025) 1px,transparent 1px),linear-gradient(90deg,rgba(0,245,212,.025) 1px,transparent 1px);
    background-size:60px 60px; }
  .fw-orb { position:fixed; border-radius:50%; pointer-events:none; z-index:0; filter:blur(100px); opacity:.12; }
  .fw-orb1 { width:600px; height:600px; background:var(--teal); top:-150px; left:-150px; }
  .fw-orb2 { width:500px; height:500px; background:var(--purple); bottom:0; right:-100px; }
  .fw-orb3 { width:300px; height:300px; background:var(--gold); top:40%; left:40%; opacity:.05; }
  .fw-scan { position:fixed; inset:0; z-index:0; pointer-events:none;
    background:repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,.03) 2px,rgba(0,0,0,.03) 4px);
    animation:scanMove 18s linear infinite; }
  @keyframes scanMove { 100%{background-position:0 200px} }

  .fw-main { position:relative; z-index:1; }

  /* ── HERO ── */
  .fw-hero { padding:80px 60px 56px; max-width:1400px; margin:0 auto; }
  .fw-badge { display:inline-flex; align-items:center; gap:8px; padding:6px 14px; border-radius:100px;
    border:1px solid rgba(0,245,212,.3); font-size:.72rem; font-family:'JetBrains Mono',monospace;
    color:var(--teal); letter-spacing:.12em; margin-bottom:24px; }
  .fw-badge::before { content:''; width:7px; height:7px; border-radius:50%; background:var(--teal); animation:hpulse 2s infinite; }
  @keyframes hpulse { 0%,100%{opacity:1;box-shadow:0 0 0 0 rgba(0,245,212,.4)} 50%{opacity:.7;box-shadow:0 0 0 6px rgba(0,245,212,0)} }
  .fw-title { font-family:'Bebas Neue',sans-serif; font-size:clamp(60px,8vw,108px); line-height:.93; letter-spacing:.02em; color:#fff; margin-bottom:16px; }
  .fw-title .accent { color:var(--teal); }
  .fw-sub { font-size:1.02rem; color:var(--muted); max-width:540px; line-height:1.7; margin-bottom:44px; }
  .fw-stats { display:flex; gap:44px; flex-wrap:wrap; padding-top:4px; border-top:1px solid var(--border); }
  .fw-stat-num { font-family:'Bebas Neue',sans-serif; font-size:2.4rem; color:var(--teal); letter-spacing:.05em; line-height:1; }
  .fw-stat-lbl { font-size:.72rem; color:var(--muted); font-family:'JetBrains Mono',monospace; letter-spacing:.08em; margin-top:2px; }

  /* ── STICKY FILTER BAR ── */
  .fw-filter-bar { position:sticky; top:0; z-index:80; background:rgba(6,12,20,.92); backdrop-filter:blur(20px);
    border-bottom:1px solid var(--border); padding:0 60px; display:flex; align-items:center; gap:16px;
    height:58px; flex-wrap:nowrap; overflow-x:auto; }
  .fw-filter-bar::-webkit-scrollbar { display:none; }
  .fw-fbar-label { font-family:'JetBrains Mono',monospace; font-size:.65rem; color:var(--teal); letter-spacing:.1em; white-space:nowrap; flex-shrink:0; }
  .fw-fbar-sep { width:1px; height:22px; background:var(--border); flex-shrink:0; }
  .fw-fbar-pill { padding:5px 14px; border-radius:100px; border:1px solid var(--border); background:transparent;
    font-size:.75rem; font-weight:600; color:var(--muted); cursor:pointer; transition:all .18s; white-space:nowrap;
    font-family:'Syne',sans-serif; flex-shrink:0; }
  .fw-fbar-pill:hover { border-color:rgba(0,245,212,.4); color:var(--teal); }
  .fw-fbar-pill.active { background:rgba(0,245,212,.1); border-color:rgba(0,245,212,.5); color:var(--teal); }
  .fw-fbar-count { margin-left:auto; font-family:'JetBrains Mono',monospace; font-size:.7rem; color:var(--teal);
    background:rgba(0,245,212,.08); border:1px solid rgba(0,245,212,.2); padding:3px 10px; border-radius:100px; white-space:nowrap; flex-shrink:0; }

  /* ── SECTION ── */
  .fw-sec { max-width:1400px; margin:0 auto; padding:60px 60px; }
  .fw-sec-label { font-size:.7rem; font-family:'JetBrains Mono',monospace; color:var(--teal); letter-spacing:.15em;
    padding:5px 12px; border:1px solid rgba(0,245,212,.25); border-radius:4px; display:inline-block; margin-bottom:20px; }
  .fw-sec-title { font-family:'Bebas Neue',sans-serif; font-size:clamp(36px,4vw,58px); color:#fff; margin-bottom:10px; line-height:1; }
  .fw-sec-sub { color:var(--muted); font-size:.93rem; margin-bottom:44px; max-width:600px; line-height:1.65; }

  /* ── FINDER ENGINE ── */
  .fw-engine { background:var(--bg2); border:1px solid var(--border); border-radius:20px; padding:40px;
    margin-bottom:28px; position:relative; overflow:hidden; box-shadow:0 20px 60px rgba(0,0,0,.4); }
  .fw-engine::before { content:''; position:absolute; inset:0; border-radius:20px;
    background:radial-gradient(ellipse at 50% 0%,rgba(0,245,212,.04),transparent 60%); pointer-events:none; }
  .fw-form-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(190px,1fr)); gap:22px; margin-bottom:32px; }
  .fw-ig { display:flex; flex-direction:column; gap:7px; }
  .fw-ig label { font-size:.68rem; color:var(--muted); font-family:'JetBrains Mono',monospace; letter-spacing:.06em; text-transform:uppercase; }
  .fw-ig select, .fw-ig input[type=number] { background:var(--bg3); border:1px solid var(--border); border-radius:10px;
    padding:11px 14px; color:#fff; font-family:'Syne',sans-serif; font-size:.9rem; outline:none;
    transition:border-color .2s; width:100%; }
  .fw-ig select:focus, .fw-ig input:focus { border-color:var(--teal); box-shadow:0 0 0 2px rgba(0,245,212,.08); }
  .fw-ig option { background:var(--bg2); }

  .fw-sliders { display:grid; grid-template-columns:1fr 1fr; gap:28px; margin-bottom:32px; }
  @media(max-width:680px) { .fw-sliders { grid-template-columns:1fr; } }
  .fw-slider-wrap { background:var(--bg3); border:1px solid var(--border); border-radius:12px; padding:20px 22px; }
  .fw-slider-head { display:flex; justify-content:space-between; align-items:baseline; margin-bottom:6px; }
  .fw-slider-label { font-family:'JetBrains Mono',monospace; font-size:.65rem; color:var(--muted); letter-spacing:.1em; text-transform:uppercase; }
  .fw-slider-val { font-family:'Bebas Neue',sans-serif; font-size:1.4rem; color:var(--teal); letter-spacing:.04em; }
  .fw-slider-sub { font-size:.65rem; color:var(--muted); font-family:'JetBrains Mono',monospace; margin-bottom:12px; }
  .fw-range { -webkit-appearance:none; width:100%; height:4px; background:rgba(255,255,255,.08); border-radius:2px; outline:none; cursor:pointer; }
  .fw-range::-webkit-slider-thumb { -webkit-appearance:none; height:18px; width:18px; border-radius:50%; background:var(--teal); cursor:pointer; box-shadow:0 0 12px rgba(0,245,212,.5); margin-top:-7px; }
  .fw-range::-webkit-slider-runnable-track { width:100%; height:4px; background:rgba(255,255,255,.08); border-radius:2px; }
  .fw-range::-moz-range-thumb { height:18px; width:18px; border-radius:50%; background:var(--teal); cursor:pointer; border:none; }
  .fw-slider-marks { display:flex; justify-content:space-between; margin-top:6px; font-family:'JetBrains Mono',monospace; font-size:.58rem; color:var(--muted); }

  /* ── PROFILE STRENGTH ── */
  .fw-profile { display:flex; justify-content:space-between; align-items:center;
    padding:18px 24px; border-radius:14px; margin-bottom:44px; flex-wrap:wrap; gap:16px;
    position:relative; overflow:hidden; }
  .fw-profile.elite { background:rgba(0,245,212,.05); border:1px solid rgba(0,245,212,.25); }
  .fw-profile.strong { background:rgba(245,158,11,.05); border:1px solid rgba(245,158,11,.25); }
  .fw-profile.dev { background:rgba(255,255,255,.03); border:1px solid var(--border); }
  .fw-profile-left { display:flex; flex-direction:column; gap:4px; }
  .fw-profile-label { font-size:.68rem; font-family:'JetBrains Mono',monospace; color:var(--muted); letter-spacing:.1em; text-transform:uppercase; }
  .fw-profile-title { font-size:1.05rem; font-weight:700; color:#fff; }
  .fw-profile-desc { font-size:.78rem; color:var(--muted); margin-top:2px; }
  .fw-profile-score { display:flex; flex-direction:column; align-items:flex-end; gap:6px; }
  .fw-profile-num { font-family:'Bebas Neue',sans-serif; font-size:2.8rem; letter-spacing:.04em; line-height:1; }
  .fw-profile-badge { font-family:'JetBrains Mono',monospace; font-size:.65rem; padding:4px 12px; border-radius:100px; font-weight:600; }
  .fw-profile-badge.elite { color:var(--teal); background:rgba(0,245,212,.12); border:1px solid rgba(0,245,212,.3); }
  .fw-profile-badge.strong { color:var(--gold); background:rgba(245,158,11,.12); border:1px solid rgba(245,158,11,.3); }
  .fw-profile-badge.dev { color:var(--muted); background:rgba(255,255,255,.05); border:1px solid var(--border); }
  .fw-profile-bar-wrap { position:absolute; bottom:0; left:0; right:0; height:2px; background:rgba(255,255,255,.05); }
  .fw-profile-bar { height:100%; border-radius:2px; transition:width 1s ease; }

  /* ── TYPE FILTER TABS ── */
  .fw-type-tabs { display:flex; gap:10px; flex-wrap:wrap; margin-bottom:32px; }
  .fw-type-tab { padding:7px 18px; border-radius:100px; border:1px solid var(--border); background:transparent;
    font-size:.78rem; font-weight:600; color:var(--muted); cursor:pointer; transition:all .18s; font-family:'Syne',sans-serif; }
  .fw-type-tab:hover { border-color:rgba(0,245,212,.35); color:var(--teal); }
  .fw-type-tab.active { background:rgba(0,245,212,.1); border-color:rgba(0,245,212,.5); color:var(--teal); }

  /* ── BANK GRID ── */
  .fw-bank-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(360px,1fr)); gap:24px; }

  /* ── BANK CARD ── */
  .fw-card { background:var(--bg2); border:1px solid var(--border); border-radius:18px; padding:0;
    transition:all .25s; position:relative; overflow:hidden; display:flex; flex-direction:column;
    cursor:default; }
  .fw-card:hover { border-color:rgba(0,245,212,.35); background:var(--bg3); transform:translateY(-4px); box-shadow:0 24px 48px rgba(0,0,0,.5); }
  .fw-card.top-pick { border-color:rgba(0,245,212,.5); box-shadow:0 0 30px rgba(0,245,212,.1); }
  .fw-card.compare-sel { border-color:rgba(168,85,247,.6); box-shadow:0 0 24px rgba(168,85,247,.15); }
  .fw-card-best-ribbon { position:absolute; top:0; right:0; background:var(--teal); color:#060c14;
    font-size:.58rem; font-weight:800; padding:4px 12px; border-bottom-left-radius:10px; font-family:'JetBrains Mono',monospace; letter-spacing:.08em; }
  .fw-card-compare-ribbon { position:absolute; top:0; left:0; background:var(--purple); color:#fff;
    font-size:.58rem; font-weight:700; padding:4px 12px; border-bottom-right-radius:10px; font-family:'JetBrains Mono',monospace; letter-spacing:.06em; }
  .fw-card-top-bar { height:3px; width:100%; }
  .fw-card-body { padding:22px 22px 0; }
  .fw-card-header { display:flex; align-items:flex-start; gap:13px; margin-bottom:16px; }
  .fw-logo-wrap { width:46px; height:46px; border-radius:12px; overflow:hidden; border:1px solid var(--border); background:#fff; flex-shrink:0; display:flex; align-items:center; justify-content:center; }
  .fw-logo-img { width:100%; height:100%; object-fit:contain; padding:4px; }
  .fw-logo-fallback { font-family:'Bebas Neue',sans-serif; font-size:1.4rem; color:#fff; display:none; }
  .fw-card-title-grp { flex:1; min-width:0; }
  .fw-card-name { font-size:1.05rem; font-weight:700; color:#fff; margin-bottom:4px; }
  .fw-card-type-badges { display:flex; gap:5px; align-items:center; }
  .fw-type-badge { font-size:.58rem; font-family:'JetBrains Mono',monospace; padding:2px 7px; border-radius:4px; text-transform:uppercase; font-weight:600; }
  .fw-type-psb { color:#34d399; background:rgba(52,211,153,.1); border:1px solid rgba(52,211,153,.2); }
  .fw-type-private { color:var(--teal); background:rgba(0,245,212,.1); border:1px solid rgba(0,245,212,.2); }
  .fw-type-nbfc { color:var(--gold); background:rgba(245,158,11,.1); border:1px solid rgba(245,158,11,.2); }
  .fw-type-global { color:var(--purple); background:rgba(168,85,247,.1); border:1px solid rgba(168,85,247,.2); }
  .fw-badge-tax { font-size:.55rem; font-family:'JetBrains Mono',monospace; padding:2px 6px; border-radius:4px;
    color:#34d399; background:rgba(52,211,153,.08); border:1px solid rgba(52,211,153,.15); }
  .fw-card-rate { font-family:'Bebas Neue',sans-serif; font-size:2rem; letter-spacing:.04em; line-height:1; flex-shrink:0; }

  /* EMI BOX */
  .fw-emi-box { background:rgba(0,245,212,.04); border:1px solid rgba(0,245,212,.15); border-radius:10px;
    padding:12px 16px; display:flex; justify-content:space-between; align-items:center; margin-bottom:14px; }
  .fw-emi-meta { display:flex; flex-direction:column; gap:2px; }
  .fw-emi-label { font-size:.6rem; color:var(--teal); font-family:'JetBrains Mono',monospace; letter-spacing:.1em; text-transform:uppercase; }
  .fw-emi-sub { font-size:.58rem; color:var(--muted); font-family:'JetBrains Mono',monospace; }
  .fw-emi-val { font-family:'Bebas Neue',sans-serif; font-size:1.75rem; color:var(--teal); letter-spacing:.04em; }
  .fw-total-interest { font-family:'JetBrains Mono',monospace; font-size:.62rem; color:var(--muted); }
  .fw-total-interest span { color:var(--danger); }

  /* CHART */
  .fw-chart { margin-bottom:14px; }
  .fw-chart-head { display:flex; justify-content:space-between; font-size:.58rem; font-family:'JetBrains Mono',monospace; color:var(--muted); margin-bottom:5px; }
  .fw-chart-wrap { position:relative; height:50px; width:100%; }
  .fw-chart-canvas { width:100%; height:50px; display:block; }

  /* METRICS ROW */
  .fw-metrics { display:grid; grid-template-columns:repeat(3,1fr); gap:8px; margin-bottom:14px; }
  .fw-metric { background:rgba(255,255,255,.03); border:1px solid var(--border); border-radius:8px; padding:10px; }
  .fw-metric-label { font-size:.58rem; color:var(--muted); font-family:'JetBrains Mono',monospace; letter-spacing:.06em; text-transform:uppercase; margin-bottom:3px; }
  .fw-metric-val { font-size:.85rem; font-weight:700; color:var(--text); }

  /* PROCESSING TIMELINE BAR */
  .fw-proc-wrap { margin-bottom:14px; }
  .fw-proc-label { display:flex; justify-content:space-between; font-size:.6rem; font-family:'JetBrains Mono',monospace; color:var(--muted); margin-bottom:5px; letter-spacing:.06em; }
  .fw-proc-track { height:5px; background:rgba(255,255,255,.06); border-radius:3px; overflow:hidden; }
  .fw-proc-fill { height:100%; border-radius:3px; transition:width 1s ease; }

  /* BEST FOR TAGS */
  .fw-bestfor { display:flex; flex-wrap:wrap; gap:5px; margin-bottom:14px; }
  .fw-bestfor-tag { font-size:.6rem; padding:3px 8px; border-radius:4px; background:rgba(255,255,255,.04);
    color:var(--muted); border:1px solid var(--border); font-family:'JetBrains Mono',monospace; }

  /* HIGHLIGHT */
  .fw-highlight { display:flex; align-items:center; gap:6px; margin-bottom:14px;
    font-size:.7rem; font-family:'JetBrains Mono',monospace; }
  .fw-hl-dot { width:6px; height:6px; border-radius:50%; flex-shrink:0; }

  /* WARNING STRIP */
  .fw-warn-strip { background:rgba(239,68,68,.04); border:1px solid rgba(239,68,68,.12); border-radius:8px;
    padding:8px 12px; font-size:.65rem; color:var(--muted); font-family:'JetBrains Mono',monospace;
    line-height:1.45; margin-bottom:16px; display:flex; gap:6px; align-items:flex-start; }

  /* FOOTER BUTTONS */
  .fw-card-footer { padding:16px 22px 20px; margin-top:auto; display:flex; flex-direction:column; gap:8px; }
  .fw-compare-toggle { width:100%; padding:8px; border-radius:7px; border:1px solid var(--border);
    background:transparent; color:var(--muted); font-family:'Syne',sans-serif; font-size:.75rem;
    font-weight:600; cursor:pointer; transition:all .18s; }
  .fw-compare-toggle:hover { border-color:rgba(168,85,247,.4); color:var(--purple); }
  .fw-compare-toggle.sel { border-color:rgba(168,85,247,.5); color:var(--purple); background:rgba(168,85,247,.07); }
  .fw-card-btns { display:flex; gap:8px; }
  .fw-btn-doc { flex:1; padding:11px; border-radius:8px; border:1px dashed var(--border);
    background:transparent; color:var(--muted); font-family:'Syne',sans-serif; font-size:.78rem; font-weight:600;
    cursor:pointer; transition:all .18s; }
  .fw-btn-doc:hover { border-color:var(--teal); color:var(--teal); background:rgba(0,245,212,.04); }
  .fw-btn-apply { flex:1; padding:11px; border-radius:8px; border:none; background:var(--teal);
    color:#060c14; font-family:'Syne',sans-serif; font-size:.82rem; font-weight:800; cursor:pointer;
    transition:opacity .2s; text-align:center; text-decoration:none; display:flex; align-items:center; justify-content:center; gap:5px; }
  .fw-btn-apply:hover { opacity:.85; }

  /* ── COMPARE PANEL ── */
  .fw-compare-panel { position:fixed; bottom:0; left:0; right:0; z-index:90;
    background:rgba(6,12,20,.96); backdrop-filter:blur(20px); border-top:1px solid rgba(168,85,247,.3);
    padding:14px 60px; display:flex; align-items:center; gap:16px; transform:translateY(100%);
    transition:transform .3s ease; }
  .fw-compare-panel.show { transform:translateY(0); }
  .fw-cp-label { font-family:'JetBrains Mono',monospace; font-size:.68rem; color:var(--purple); letter-spacing:.1em; }
  .fw-cp-items { display:flex; gap:10px; flex:1; }
  .fw-cp-item { display:flex; align-items:center; gap:8px; background:rgba(168,85,247,.08); border:1px solid rgba(168,85,247,.25); border-radius:8px; padding:7px 12px; }
  .fw-cp-item-name { font-size:.8rem; font-weight:600; color:#fff; }
  .fw-cp-item-rate { font-family:'JetBrains Mono',monospace; font-size:.7rem; color:var(--purple); }
  .fw-cp-remove { background:none; border:none; color:var(--muted); cursor:pointer; font-size:12px; padding:0; }
  .fw-cp-btn { padding:10px 24px; border-radius:8px; border:none; background:var(--purple); color:#fff;
    font-family:'Syne',sans-serif; font-size:.85rem; font-weight:700; cursor:pointer; transition:opacity .2s; }
  .fw-cp-btn:hover { opacity:.85; }
  .fw-cp-clear { padding:8px 16px; border-radius:8px; border:1px solid var(--border); background:transparent;
    color:var(--muted); font-family:'Syne',sans-serif; font-size:.8rem; cursor:pointer; transition:all .18s; }
  .fw-cp-clear:hover { border-color:var(--danger); color:var(--danger); }

  /* ── LOAN TIMELINE ── */
  .fw-timeline-wrap { background:var(--bg2); border:1px solid var(--border); border-radius:20px; padding:36px 40px; margin-bottom:24px; }
  .fw-timeline-title { font-family:'Bebas Neue',sans-serif; font-size:1.5rem; color:#fff; margin-bottom:28px; letter-spacing:.04em; }
  .fw-tl { display:flex; align-items:flex-start; gap:0; overflow-x:auto; padding-bottom:12px; }
  .fw-tl::-webkit-scrollbar { height:3px; }
  .fw-tl-step { display:flex; flex-direction:column; align-items:center; flex:1; min-width:100px; position:relative; }
  .fw-tl-step:not(:last-child)::after { content:''; position:absolute; top:22px; left:50%; right:-50%; height:1.5px; background:linear-gradient(90deg,var(--tl-c,var(--teal)),rgba(255,255,255,.1)); z-index:0; }
  .fw-tl-ico-wrap { width:44px; height:44px; border-radius:50%; display:flex; align-items:center; justify-content:center;
    font-size:1.1rem; border:2px solid; margin-bottom:8px; z-index:1; position:relative; background:var(--bg2); }
  .fw-tl-label { font-family:'JetBrains Mono',monospace; font-size:.6rem; color:var(--muted); text-align:center; letter-spacing:.04em; line-height:1.35; margin-bottom:3px; }
  .fw-tl-days { font-family:'Bebas Neue',sans-serif; font-size:.9rem; color:#fff; text-align:center; letter-spacing:.04em; }

  /* ── TRAP CARDS (WARNINGS) ── */
  .fw-traps { display:grid; grid-template-columns:repeat(auto-fit,minmax(300px,1fr)); gap:20px; }
  .fw-trap { position:relative; background:rgba(239,68,68,.03); border:1px solid rgba(239,68,68,.12);
    border-radius:16px; overflow:hidden; cursor:crosshair; transition:all .35s; min-height:180px; }
  .fw-trap:hover { border-color:rgba(239,68,68,.5); box-shadow:0 0 28px rgba(239,68,68,.12); background:rgba(239,68,68,.07); }
  .fw-trap-cover { position:absolute; inset:0; background:var(--bg2); z-index:2; display:flex; flex-direction:column;
    align-items:center; justify-content:center; padding:28px; text-align:center;
    transition:opacity .35s ease,transform .35s ease; border-radius:16px; border:1px solid var(--border); }
  .fw-trap:hover .fw-trap-cover { opacity:0; transform:scale(1.04); pointer-events:none; }
  .fw-trap-cover-ico { font-size:2rem; margin-bottom:12px; filter:grayscale(1); opacity:.4; }
  .fw-trap-cover-title { font-size:1rem; font-weight:700; color:var(--text); margin-bottom:10px; }
  .fw-trap-hint { font-size:.65rem; color:var(--danger); font-family:'JetBrains Mono',monospace; letter-spacing:.12em;
    padding:5px 12px; border:1px dashed rgba(239,68,68,.4); border-radius:4px; background:rgba(239,68,68,.05); }
  .fw-trap-content { position:relative; z-index:1; opacity:0; transform:translateY(8px); padding:28px;
    transition:opacity .45s ease .1s,transform .45s ease .1s; }
  .fw-trap:hover .fw-trap-content { opacity:1; transform:translateY(0); }
  .fw-trap-content-ico { font-size:1.6rem; margin-bottom:14px; }
  .fw-trap-content-title { color:#fff; font-size:1.05rem; font-weight:800; margin-bottom:10px; letter-spacing:.04em; border-bottom:1px solid rgba(239,68,68,.25); padding-bottom:8px; }
  .fw-trap-content-desc { color:var(--text); font-size:.83rem; line-height:1.65; }
  .fw-trap-content-desc strong { color:var(--danger); font-family:'JetBrains Mono',monospace; font-size:.78rem; }

  /* ── EMI CALCULATOR SECTION ── */
  .fw-calc-layout { display:grid; grid-template-columns:1fr 1fr; gap:28px; align-items:start; }
  @media(max-width:900px) { .fw-calc-layout { grid-template-columns:1fr; } }
  .fw-calc-inputs { background:var(--bg2); border:1px solid var(--border); border-radius:18px; padding:32px; }
  .fw-calc-result { background:var(--bg2); border:1px solid var(--border); border-radius:18px; padding:32px; position:sticky; top:70px; }
  .fw-calc-result-main { text-align:center; margin-bottom:28px; padding-bottom:28px; border-bottom:1px solid var(--border); }
  .fw-calc-emi-label { font-size:.68rem; color:var(--muted); font-family:'JetBrains Mono',monospace; letter-spacing:.12em; text-transform:uppercase; margin-bottom:8px; }
  .fw-calc-emi-val { font-family:'Bebas Neue',sans-serif; font-size:3.4rem; color:var(--teal); letter-spacing:.04em; line-height:1; margin-bottom:4px; }
  .fw-calc-emi-sub { font-size:.72rem; color:var(--muted); font-family:'JetBrains Mono',monospace; }
  .fw-calc-breakdown { display:flex; flex-direction:column; gap:12px; }
  .fw-cb-row { display:flex; justify-content:space-between; align-items:center; }
  .fw-cb-label { font-size:.78rem; color:var(--muted); }
  .fw-cb-val { font-size:.9rem; font-weight:700; color:var(--text); font-family:'JetBrains Mono',monospace; }
  .fw-cb-val.teal { color:var(--teal); }
  .fw-cb-val.danger { color:var(--danger); }
  .fw-cb-val.gold { color:var(--gold); }
  .fw-donut-wrap { display:flex; justify-content:center; margin:20px 0; }

  /* ── COMPARE MODAL ── */
  .fw-modal-overlay { position:fixed; inset:0; background:rgba(6,12,20,.85); backdrop-filter:blur(12px);
    z-index:200; display:flex; align-items:center; justify-content:center; padding:24px;
    opacity:0; pointer-events:none; transition:opacity .3s; }
  .fw-modal-overlay.open { opacity:1; pointer-events:all; }
  .fw-modal { background:var(--bg2); border:1px solid var(--border); border-radius:22px; width:100%; max-width:880px;
    max-height:90vh; overflow-y:auto; transform:translateY(20px); transition:transform .3s; }
  .fw-modal-overlay.open .fw-modal { transform:translateY(0); }
  .fw-modal-head { padding:28px 32px; border-bottom:1px solid var(--border); display:flex; align-items:center; justify-content:space-between; position:sticky; top:0; background:var(--bg2); z-index:10; }
  .fw-modal-title { font-family:'Bebas Neue',sans-serif; font-size:2rem; color:#fff; letter-spacing:.04em; }
  .fw-modal-close { background:none; border:none; color:var(--muted); font-size:1.4rem; cursor:pointer; transition:color .2s; }
  .fw-modal-close:hover { color:#fff; }
  .fw-modal-body { padding:28px 32px; }
  .fw-compare-grid { display:grid; grid-template-columns:1fr 120px 1fr; gap:0; }
  .fw-compare-col { display:flex; flex-direction:column; gap:0; }
  .fw-compare-mid-col { display:flex; flex-direction:column; gap:0; align-items:center; justify-content:flex-start; padding-top:70px; }
  .fw-cmp-row { padding:14px 0; border-bottom:1px solid var(--border); }
  .fw-cmp-row:last-child { border-bottom:none; }
  .fw-cmp-key { font-size:.6rem; color:var(--muted); font-family:'JetBrains Mono',monospace; letter-spacing:.1em; text-transform:uppercase; margin-bottom:4px; }
  .fw-cmp-val { font-size:.95rem; font-weight:700; color:#fff; }
  .fw-cmp-mid { height:calc(14px + 1px + 14px + 23px); display:flex; align-items:center; justify-content:center; border-bottom:1px solid var(--border); font-family:'JetBrains Mono',monospace; font-size:.6rem; color:var(--muted); }
  .fw-cmp-mid:last-child { border-bottom:none; }
  .fw-cmp-head { padding:20px 0; border-bottom:1px solid var(--border); }
  .fw-cmp-name { font-family:'Bebas Neue',sans-serif; font-size:1.5rem; color:#fff; letter-spacing:.04em; margin-bottom:4px; }
  .fw-cmp-rate { font-family:'Bebas Neue',sans-serif; font-size:2.2rem; letter-spacing:.04em; }
  .fw-cmp-mid-head { padding:20px 0; border-bottom:1px solid var(--border); font-family:'JetBrains Mono',monospace; font-size:.6rem; color:var(--muted); letter-spacing:.1em; text-align:center; }

  /* ── DOC MODAL ── */
  .fw-doc-overlay { position:fixed; inset:0; background:rgba(6,12,20,.85); backdrop-filter:blur(12px);
    z-index:200; display:flex; align-items:center; justify-content:center; padding:24px;
    opacity:0; pointer-events:none; transition:opacity .3s; }
  .fw-doc-overlay.open { opacity:1; pointer-events:all; }
  .fw-doc-modal { background:var(--bg2); border:1px solid var(--teal); border-radius:22px; width:100%; max-width:500px;
    padding:0; transform:translateY(20px); transition:transform .3s; overflow:hidden; }
  .fw-doc-overlay.open .fw-doc-modal { transform:translateY(0); }
  .fw-doc-modal-head { background:rgba(0,245,212,.05); padding:24px 28px; border-bottom:1px solid rgba(0,245,212,.2); display:flex; justify-content:space-between; align-items:flex-start; }
  .fw-doc-modal-title { font-family:'Bebas Neue',sans-serif; font-size:2rem; color:#fff; letter-spacing:.04em; line-height:1; margin-bottom:4px; }
  .fw-doc-modal-sub { font-size:.75rem; color:var(--muted); font-family:'JetBrains Mono',monospace; }
  .fw-doc-list { list-style:none; padding:20px 28px; display:flex; flex-direction:column; gap:0; }
  .fw-doc-item { display:flex; align-items:center; gap:12px; padding:12px 0; border-bottom:1px solid var(--border); font-size:.87rem; color:var(--text); animation:slideInDoc .3s ease both; }
  .fw-doc-item:last-child { border-bottom:none; }
  @keyframes slideInDoc { from{opacity:0;transform:translateX(-10px)} to{opacity:1;transform:translateX(0)} }
  .fw-doc-emoji { font-size:1.1rem; flex-shrink:0; }
  .fw-doc-modal-footer { padding:16px 28px 24px; display:flex; gap:10px; }
  .fw-doc-dl-btn { flex:1; padding:13px; background:rgba(0,245,212,.1); border:1px solid var(--teal); color:var(--teal);
    border-radius:10px; font-weight:700; cursor:pointer; transition:all .2s; font-family:'Syne',sans-serif; font-size:.85rem; }
  .fw-doc-dl-btn:hover { background:var(--teal); color:#060c14; }
  .fw-doc-close-btn { padding:13px 20px; background:transparent; border:1px solid var(--border); color:var(--muted);
    border-radius:10px; cursor:pointer; transition:all .2s; font-family:'Syne',sans-serif; font-size:.82rem; }
  .fw-doc-close-btn:hover { border-color:rgba(255,255,255,.2); color:#fff; }

  /* ── UTILS ── */
  .no-results { grid-column:1/-1; padding:52px; text-align:center; color:var(--muted);
    border:1px dashed var(--border); border-radius:16px; background:var(--bg2); }
  .no-results h3 { font-family:'Bebas Neue',sans-serif; font-size:1.5rem; color:#fff; margin-bottom:8px; letter-spacing:.04em; }
  .no-results p { font-size:.85rem; line-height:1.6; }

  @keyframes fadeUp { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
  .fade-up { opacity:0; transform:translateY(18px); transition:opacity .55s ease,transform .55s ease; }
  .fade-up.visible { opacity:1; transform:none; }
`;

/* ══════════════════════════════════════════════════════════════
   HELPERS
══════════════════════════════════════════════════════════════ */
const fmtINR = n =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

const calcEMI = (p, r, y) => {
  const mr = r / 12 / 100;
  const n = y * 12;
  return (p * mr * Math.pow(1 + mr, n)) / (Math.pow(1 + mr, n) - 1);
};

const calcAmort = (principal, rate, years) => {
  const mr = rate / 12 / 100;
  const n = years * 12;
  const emi = calcEMI(principal, rate, years);
  const pts = [];
  let bal = principal;
  const step = Math.max(1, Math.floor(n / 24));
  for (let m = 0; m <= n; m += step) {
    const x = (m / n) * 400;
    const y = 50 - (bal / principal) * 50;
    pts.push(`${x.toFixed(1)},${y.toFixed(1)}`);
    const B = principal * Math.pow(1 + mr, m) - (emi / mr) * (Math.pow(1 + mr, m) - 1);
    bal = B > 0 ? B : 0;
  }
  pts.push('400,50', '0,50');
  return { poly: pts.join(' '), line: pts.slice(0, -2).join(' ') };
};

/* ══════════════════════════════════════════════════════════════
   AMORTIZATION CHART (pure SVG inline)
══════════════════════════════════════════════════════════════ */
function AmortChart({ principal, rate, tenure, cardIdx }) {
  const { poly, line } = calcAmort(principal, rate, tenure);
  const id = `g${cardIdx}`;
  return (
    <svg viewBox="0 0 400 50" preserveAspectRatio="none" style={{ width: '100%', height: '50px', display: 'block' }}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(0,245,212,0.28)" />
          <stop offset="100%" stopColor="rgba(0,245,212,0)" />
        </linearGradient>
      </defs>
      <polygon points={poly} fill={`url(#${id})`} />
      <polyline points={line} fill="none" stroke="var(--teal)" strokeWidth="1.8" />
    </svg>
  );
}

/* ══════════════════════════════════════════════════════════════
   DONUT CHART
══════════════════════════════════════════════════════════════ */
function DonutChart({ principal, totalInterest, size = 140 }) {
  const total = principal + totalInterest;
  const pPct = principal / total;
  const iPct = totalInterest / total;
  const r = 50, cx = 70, cy = 70;
  const circ = 2 * Math.PI * r;
  const pDash = pPct * circ;
  const iDash = iPct * circ;
  return (
    <svg width={size} height={size} viewBox="0 0 140 140">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,.06)" strokeWidth="18" />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#00f5d4" strokeWidth="18"
        strokeDasharray={`${pDash} ${circ - pDash}`} strokeDashoffset={circ / 4}
        strokeLinecap="butt" />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#ef4444" strokeWidth="18"
        strokeDasharray={`${iDash} ${circ - iDash}`} strokeDashoffset={circ / 4 - pDash}
        strokeLinecap="butt" />
      <text x="70" y="65" textAnchor="middle" fontFamily="'Bebas Neue'" fontSize="16" fill="#fff" letterSpacing="0.04em">RATIO</text>
      <text x="70" y="82" textAnchor="middle" fontFamily="'JetBrains Mono'" fontSize="9" fill="#64748b">Principal vs Interest</text>
    </svg>
  );
}

/* ══════════════════════════════════════════════════════════════
   BANK CARD
══════════════════════════════════════════════════════════════ */
function BankCard({ bank, idx, amount, tenure, isTopPick, compareList, onCompareToggle, onDocOpen }) {
  const emi = calcEMI(amount, bank.rate, tenure);
  const totalPaid = emi * tenure * 12;
  const totalInterest = totalPaid - amount;
  const isInCompare = compareList.includes(bank.id);
  const typeKey = bank.type.toLowerCase();
  const procPct = Math.min(100, Math.round((21 - bank.processingTime) / 20 * 100));

  return (
    <div className={`fw-card ${isTopPick ? 'top-pick' : ''} ${isInCompare ? 'compare-sel' : ''}`}
      style={{ animation: `fadeUp .45s ease ${idx * 0.05}s both` }}>

      {/* Top accent bar */}
      <div className="fw-card-top-bar" style={{ background: `linear-gradient(90deg,${bank.highlightColor},transparent)` }} />

      {/* Ribbons */}
      {isTopPick && <div className="fw-card-best-ribbon">BEST RATE</div>}
      {isInCompare && <div className="fw-card-compare-ribbon">COMPARING</div>}

      <div className="fw-card-body">
        {/* Header */}
        <div className="fw-card-header">
          <div className="fw-logo-wrap">
            <img
              className="fw-logo-img"
              src={`https://logo.clearbit.com/${bank.domain}`}
              alt={bank.name}
              onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
            />
            <div className="fw-logo-fallback" style={{ display: 'none', background: bank.type === 'PSB' ? 'linear-gradient(135deg,#10b981,#047857)' : bank.type === 'NBFC' ? 'linear-gradient(135deg,#f59e0b,#b45309)' : bank.type === 'Global' ? 'linear-gradient(135deg,#a855f7,#7e22ce)' : 'linear-gradient(135deg,#00f5d4,#00897b)', width: '100%', height: '100%', borderRadius: '10px', alignItems: 'center', justifyContent: 'center', fontFamily: 'Bebas Neue', fontSize: '1.3rem', color: '#fff' }}>
              {bank.shortName.charAt(0)}
            </div>
          </div>
          <div className="fw-card-title-grp">
            <div className="fw-card-name">{bank.name}</div>
            <div className="fw-card-type-badges">
              <span className={`fw-type-badge fw-type-${typeKey}`}>{bank.type}</span>
              {bank.taxBenefit && <span className="fw-badge-tax">80E Tax</span>}
            </div>
          </div>
          <div className="fw-card-rate" style={{ color: bank.highlightColor }}>{bank.rate}%</div>
        </div>

        {/* Highlight */}
        <div className="fw-highlight">
          <div className="fw-hl-dot" style={{ background: bank.highlightColor, boxShadow: `0 0 6px ${bank.highlightColor}` }} />
          <span style={{ color: bank.highlightColor, fontFamily: "'JetBrains Mono',monospace", fontSize: '.65rem', letterSpacing: '.06em' }}>{bank.highlight}</span>
        </div>

        {/* EMI Box */}
        <div className="fw-emi-box">
          <div className="fw-emi-meta">
            <div className="fw-emi-label">Est. Monthly EMI</div>
            <div className="fw-emi-sub">{tenure}yr tenure · {bank.rateType}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div className="fw-emi-val">{fmtINR(emi)}</div>
            <div className="fw-total-interest">Total interest: <span>{fmtINR(totalInterest)}</span></div>
          </div>
        </div>

        {/* Amortization Chart */}
        <div className="fw-chart">
          <div className="fw-chart-head"><span>START</span><span style={{ letterSpacing: '.08em', fontFamily: "'JetBrains Mono',monospace", fontSize: '.58rem' }}>LOAN BALANCE CURVE</span><span>YEAR {tenure}</span></div>
          <AmortChart principal={amount} rate={bank.rate} tenure={tenure} cardIdx={idx} />
        </div>

        {/* Processing Timeline */}
        <div className="fw-proc-wrap">
          <div className="fw-proc-label">
            <span>APPROVAL SPEED</span>
            <span style={{ color: bank.processingTime <= 7 ? '#34d399' : bank.processingTime <= 14 ? '#f59e0b' : '#ef4444' }}>{bank.time}</span>
          </div>
          <div className="fw-proc-track">
            <div className="fw-proc-fill" style={{ width: `${procPct}%`, background: bank.processingTime <= 7 ? '#34d399' : bank.processingTime <= 14 ? '#f59e0b' : '#ef4444' }} />
          </div>
        </div>

        {/* Metrics */}
        <div className="fw-metrics">
          <div className="fw-metric">
            <div className="fw-metric-label">Max Loan</div>
            <div className="fw-metric-val" style={{ fontSize: '.78rem' }}>{fmtINR(bank.maxAmount)}</div>
          </div>
          <div className="fw-metric">
            <div className="fw-metric-label">Collateral</div>
            <div className="fw-metric-val" style={{ color: !bank.collReq || amount <= bank.collThresh ? '#34d399' : '#ef4444' }}>
              {!bank.collReq || amount <= bank.collThresh ? 'No' : 'Required'}
            </div>
          </div>
          <div className="fw-metric">
            <div className="fw-metric-label">Processing</div>
            <div className="fw-metric-val" style={{ fontSize: '.75rem' }}>{bank.processingFee}</div>
          </div>
        </div>

        {/* Best For */}
        <div className="fw-bestfor">
          {bank.bestFor.map((t, i) => (
            <span key={i} className="fw-bestfor-tag">✓ {t}</span>
          ))}
        </div>

        {/* Warning */}
        <div className="fw-warn-strip">
          <span style={{ color: '#f59e0b', flexShrink: 0 }}>⚠</span>
          <span>{bank.warning}</span>
        </div>
      </div>

      {/* Footer */}
      <div className="fw-card-footer">
        <button
          className={`fw-compare-toggle ${isInCompare ? 'sel' : ''}`}
          onClick={() => onCompareToggle(bank.id)}>
          {isInCompare ? '✓ Added to Compare' : '+ Add to Compare'}
        </button>
        <div className="fw-card-btns">
          <button className="fw-btn-doc" onClick={() => onDocOpen(bank)}>📄 Checklist</button>
          <a href={bank.url} target="_blank" rel="noreferrer" className="fw-btn-apply">Apply ↗</a>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════════════ */
export default function FundingPage() {
  // Loan Finder State
  const [amount, setAmount] = useState(4000000);
  const [tenure, setTenure] = useState(10);
  const [country, setCountry] = useState('all');
  const [admit, setAdmit] = useState('planning');
  const [collateral, setCollateral] = useState('yes');
  const [coapp, setCoapp] = useState('yes');
  const [gre, setGre] = useState('');
  const [ielts, setIelts] = useState('7');
  const [typeFilter, setTypeFilter] = useState('all');

  // Compare state
  const [compareList, setCompareList] = useState([]);
  const [showCompareModal, setShowCompareModal] = useState(false);

  // Doc modal
  const [docModal, setDocModal] = useState({ open: false, bank: null });

  // Standalone calc state
  const [calcAmount, setCalcAmount] = useState(5000000);
  const [calcRate, setCalcRate] = useState(11.15);
  const [calcTenure, setCalcTenure] = useState(10);

  // Scroll animations
  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
    }, { threshold: 0.08 });
    document.querySelectorAll('.fade-up').forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  /* PROFILE STRENGTH */
  const numGre = parseInt(gre) || 0;
  const numIelts = parseInt(ielts) || 0;
  let strength = 'dev';
  let profileScore = 40;
  let profileTitle = 'Developing Profile';
  let profileDesc = 'Strengthen your profile with test scores and confirmed admission for better options.';
  if (numGre >= 320 && numIelts >= 7 && admit === 'admitted') {
    strength = 'elite'; profileScore = 95; profileTitle = 'Elite Profile';
    profileDesc = 'Outstanding. You qualify for the best unsecured rates from global lenders.';
  } else if ((numGre >= 305 || numIelts >= 7) && admit !== 'planning') {
    strength = 'strong'; profileScore = 72; profileTitle = 'Strong Profile';
    profileDesc = 'Good standing. Most private and NBFC lenders will process you quickly.';
  }

  /* FILTER */
  const filtered = BANKS.filter(b => {
    if (amount > b.maxAmount) return false;
    if (collateral === 'no' && b.collReq && amount > b.collThresh) return false;
    if (coapp === 'no' && b.coAppReq === 'yes') return false;
    if (country !== 'all' && b.support[0] !== 'all' && !b.support.includes(country)) return false;
    if (b.type === 'Global' && admit === 'planning') return false;
    if (typeFilter !== 'all' && b.type !== typeFilter) return false;
    return true;
  }).sort((a, b) => a.rate - b.rate);

  /* COMPARE TOGGLE */
  const toggleCompare = id => {
    setCompareList(prev => {
      if (prev.includes(id)) return prev.filter(x => x !== id);
      if (prev.length >= 2) return prev; // max 2
      return [...prev, id];
    });
  };

  /* CALC VALUES */
  const calcEMIVal = calcEMI(calcAmount, calcRate, calcTenure);
  const calcTotal = calcEMIVal * calcTenure * 12;
  const calcInterest = calcTotal - calcAmount;

  /* COMPARE BANKS */
  const cmpBanks = compareList.map(id => BANKS.find(b => b.id === id)).filter(Boolean);
  const CMP_FIELDS = [
    { label: 'Interest Rate', key: b => `${b.rate}%`, cmp: (a, b) => a.rate < b.rate },
    { label: 'Max Loan Amount', key: b => fmtINR(b.maxAmount), cmp: (a, b) => a.maxAmount > b.maxAmount },
    { label: 'Processing Time', key: b => b.time, cmp: (a, b) => a.processingTime < b.processingTime },
    { label: 'Processing Fee', key: b => b.processingFee },
    { label: 'Collateral Need', key: b => !b.collReq || calcAmount <= b.collThresh ? 'Not required' : 'Required' },
    { label: 'Co-Applicant', key: b => b.coAppReq === 'yes' ? 'Required' : 'Not required' },
    { label: 'Moratorium', key: b => `${b.moratorium} months` },
    { label: 'Max Tenure', key: b => `${b.tenure} years` },
    { label: 'Tax Benefit (80E)', key: b => b.taxBenefit ? '✓ Yes' : '✗ No' },
    { label: 'Prepay Penalty', key: b => b.prepayPenalty ? '✗ Yes' : '✓ None' },
    { label: 'Monthly EMI', key: b => fmtINR(calcEMI(amount, b.rate, tenure)), cmp: (a, b) => a.rate < b.rate },
    { label: 'Total Interest Paid', key: b => { const e = calcEMI(amount, b.rate, tenure); return fmtINR(e * tenure * 12 - amount); }, cmp: (a, b) => a.rate < b.rate },
  ];

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="fw">
        {/* BG */}
        <div className="fw-grid" />
        <div className="fw-orb fw-orb1" />
        <div className="fw-orb fw-orb2" />
        <div className="fw-orb fw-orb3" />
        <div className="fw-scan" />

        <div className="fw-main">

          {/* ══ HERO ══ */}
          <div className="fw-hero">
            <div className="fw-badge">LIVE RATES · 15 LENDERS · ZERO BIAS</div>
            <h1 className="fw-title">
              FUND YOUR<br />
              <span className="accent">EDUCATION</span>
            </h1>
            <p className="fw-sub">
              The most complete loan comparison for Indian students going abroad. Adjust your profile below — your options update instantly.
            </p>
            <div className="fw-stats">
              <div><div className="fw-stat-num">15</div><div className="fw-stat-lbl">Verified Lenders</div></div>
              <div><div className="fw-stat-num">₹1.5Cr</div><div className="fw-stat-lbl">Max Available</div></div>
              <div><div className="fw-stat-num">9.7%</div><div className="fw-stat-lbl">Lowest Rate</div></div>
              <div><div className="fw-stat-num">5 Days</div><div className="fw-stat-lbl">Fastest Approval</div></div>
            </div>
          </div>

          {/* ══ STICKY FILTER BAR ══ */}
          <div className="fw-filter-bar">
            <span className="fw-fbar-label">DESTINATION</span>
            {[
              { v: 'all', l: 'All Countries' }, { v: 'USA', l: '🇺🇸 USA' },
              { v: 'UK', l: '🇬🇧 UK' }, { v: 'Canada', l: '🇨🇦 Canada' },
              { v: 'Germany', l: '🇩🇪 Germany' }, { v: 'Australia', l: '🇦🇺 Australia' },
              { v: 'Ireland', l: '🇮🇪 Ireland' },
            ].map(({ v, l }) => (
              <button key={v} className={`fw-fbar-pill ${country === v ? 'active' : ''}`} onClick={() => setCountry(v)}>{l}</button>
            ))}
            <div className="fw-fbar-sep" />
            <span className="fw-fbar-count">{filtered.length} matches</span>
          </div>

          {/* ══ FINDER ENGINE ══ */}
          <div className="fw-sec fade-up">
            <div className="fw-sec-label">THE MATCH ENGINE</div>
            <h2 className="fw-sec-title">SMART LOAN FINDER</h2>
            <p className="fw-sec-sub">Your profile determines which lenders you're eligible for. Higher test scores and confirmed admission unlock premium unsecured global options.</p>

            <div className="fw-engine">
              <div className="fw-form-grid">
                <div className="fw-ig">
                  <label>GRE Score</label>
                  <input type="number" placeholder="e.g. 315" min="260" max="340" value={gre} onChange={e => setGre(e.target.value)} />
                </div>
                <div className="fw-ig">
                  <label>IELTS / TOEFL</label>
                  <select value={ielts} onChange={e => setIelts(e.target.value)}>
                    <option value="8">8.0+ (Exceptional)</option>
                    <option value="7">7.0–7.5 (Strong)</option>
                    <option value="6">6.0–6.5 (Average)</option>
                    <option value="0">Not taken yet</option>
                  </select>
                </div>
                <div className="fw-ig">
                  <label>Admission Status</label>
                  <select value={admit} onChange={e => setAdmit(e.target.value)}>
                    <option value="admitted">Admitted — Offer in Hand</option>
                    <option value="applied">Applied — Awaiting Decision</option>
                    <option value="planning">Just Planning / Researching</option>
                  </select>
                </div>
                <div className="fw-ig">
                  <label>Property Collateral?</label>
                  <select value={collateral} onChange={e => setCollateral(e.target.value)}>
                    <option value="yes">Yes — I have property</option>
                    <option value="no">No — Need unsecured loan</option>
                  </select>
                </div>
                <div className="fw-ig">
                  <label>Indian Co-Applicant?</label>
                  <select value={coapp} onChange={e => setCoapp(e.target.value)}>
                    <option value="yes">Yes — Parents / Guardian</option>
                    <option value="no">No — No Indian co-signer</option>
                  </select>
                </div>
              </div>

              <div className="fw-sliders">
                <div className="fw-slider-wrap">
                  <div className="fw-slider-head">
                    <span className="fw-slider-label">Loan Amount Needed</span>
                    <span className="fw-slider-val">{fmtINR(amount)}</span>
                  </div>
                  <div className="fw-slider-sub">Drag to set — cards update in real-time</div>
                  <input type="range" className="fw-range" min="500000" max="15000000" step="500000"
                    value={amount} onChange={e => setAmount(Number(e.target.value))} />
                  <div className="fw-slider-marks">
                    <span>₹5L</span><span>₹35L</span><span>₹75L</span><span>₹1.15Cr</span><span>₹1.5Cr</span>
                  </div>
                </div>
                <div className="fw-slider-wrap">
                  <div className="fw-slider-head">
                    <span className="fw-slider-label">Repayment Tenure</span>
                    <span className="fw-slider-val">{tenure} Years</span>
                  </div>
                  <div className="fw-slider-sub">Longer tenure = lower EMI but more total interest</div>
                  <input type="range" className="fw-range" min="5" max="15" step="1"
                    value={tenure} onChange={e => setTenure(Number(e.target.value))} />
                  <div className="fw-slider-marks">
                    <span>5yr</span><span>7yr</span><span>10yr</span><span>12yr</span><span>15yr</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Strength */}
            <div className={`fw-profile ${strength}`}>
              <div className="fw-profile-left">
                <div className="fw-profile-label">MentorBridge Profile Strength</div>
                <div className="fw-profile-title">{profileTitle}</div>
                <div className="fw-profile-desc">{profileDesc}</div>
              </div>
              <div className="fw-profile-score">
                <div className="fw-profile-num" style={{ color: strength === 'elite' ? 'var(--teal)' : strength === 'strong' ? 'var(--gold)' : 'var(--muted)' }}>{profileScore}</div>
                <div className={`fw-profile-badge ${strength}`}>
                  {strength === 'elite' ? '✦ ELITE PROFILE' : strength === 'strong' ? '◈ STRONG PROFILE' : '◌ DEVELOPING'}
                </div>
              </div>
              <div className="fw-profile-bar-wrap">
                <div className="fw-profile-bar" style={{ width: `${profileScore}%`, background: strength === 'elite' ? 'var(--teal)' : strength === 'strong' ? 'var(--gold)' : 'rgba(255,255,255,.15)' }} />
              </div>
            </div>

            {/* Type Tabs */}
            <div className="fw-type-tabs">
              {[
                { v: 'all', l: 'All Types' }, { v: 'PSB', l: '🏛 Public Banks' },
                { v: 'Private', l: '🏦 Private Banks' }, { v: 'NBFC', l: '⚡ NBFCs' }, { v: 'Global', l: '🌍 Global Lenders' },
              ].map(({ v, l }) => (
                <button key={v} className={`fw-type-tab ${typeFilter === v ? 'active' : ''}`} onClick={() => setTypeFilter(v)}>{l}</button>
              ))}
              <span style={{ marginLeft: 'auto', fontFamily: "'JetBrains Mono',monospace", fontSize: '.68rem', color: 'var(--teal)' }}>
                {filtered.length} lender{filtered.length !== 1 ? 's' : ''} matched
              </span>
            </div>

            {/* Bank Cards */}
            <div className="fw-bank-grid">
              {filtered.length === 0 ? (
                <div className="no-results">
                  <h3>No lenders match your criteria</h3>
                  <p>Try allowing a Co-Applicant or Property Collateral. Global lenders require confirmed admission.</p>
                </div>
              ) : filtered.map((b, i) => (
                <BankCard
                  key={b.id} bank={b} idx={i}
                  amount={amount} tenure={tenure}
                  isTopPick={i === 0}
                  compareList={compareList}
                  onCompareToggle={toggleCompare}
                  onDocOpen={bank => setDocModal({ open: true, bank })}
                />
              ))}
            </div>
          </div>

          {/* ══ LOAN TIMELINE ══ */}
          <div className="fw-sec fade-up" style={{ paddingTop: 0 }}>
            <div className="fw-sec-label">LOAN JOURNEY</div>
            <h2 className="fw-sec-title">FROM APPLICATION TO FIRST EMI</h2>
            <p className="fw-sec-sub">The complete timeline every student must understand before applying. Know every step and never be caught off guard.</p>

            <div className="fw-timeline-wrap">
              <div className="fw-timeline-title">Typical Loan Lifecycle — {filtered[0]?.name || 'Best Match'}</div>
              <div className="fw-tl">
                {TIMELINE_STAGES.map((s, i) => (
                  <div key={i} className="fw-tl-step" style={{ '--tl-c': s.color }}>
                    <div className="fw-tl-ico-wrap" style={{ borderColor: s.color, boxShadow: `0 0 12px ${s.color}20` }}>
                      {s.icon}
                    </div>
                    <div className="fw-tl-label">{s.label}</div>
                    <div className="fw-tl-days" style={{ color: s.color }}>{s.days}</div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: '20px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                {[
                  { label: 'PSB Average', val: '45–65 days application to disbursal', color: '#34d399' },
                  { label: 'NBFC Average', val: '10–20 days application to disbursal', color: '#f59e0b' },
                  { label: 'Global Lenders', val: '7–15 days post-admission', color: '#a855f7' },
                ].map((t, i) => (
                  <div key={i} style={{ padding: '8px 14px', borderRadius: '8px', background: 'rgba(255,255,255,.03)', border: `1px solid ${t.color}30`, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: t.color, boxShadow: `0 0 6px ${t.color}` }} />
                    <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.65rem', color: 'var(--muted)' }}>
                      <span style={{ color: t.color }}>{t.label}:</span> {t.val}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ══ EMI CALCULATOR ══ */}
          <div className="fw-sec fade-up" style={{ paddingTop: 0 }}>
            <div className="fw-sec-label">FINANCIAL PLANNING TOOL</div>
            <h2 className="fw-sec-title">STANDALONE EMI CALCULATOR</h2>
            <p className="fw-sec-sub">Plug in any lender's rate and see your exact repayment breakdown — principal vs interest, total cost, and monthly EMI.</p>

            <div className="fw-calc-layout">
              <div className="fw-calc-inputs">
                <div style={{ marginBottom: '28px' }}>
                  <div className="fw-slider-wrap">
                    <div className="fw-slider-head">
                      <span className="fw-slider-label">Loan Principal</span>
                      <span className="fw-slider-val">{fmtINR(calcAmount)}</span>
                    </div>
                    <input type="range" className="fw-range" min="500000" max="15000000" step="100000"
                      value={calcAmount} onChange={e => setCalcAmount(Number(e.target.value))} style={{ marginTop: '12px' }} />
                  </div>
                </div>
                <div style={{ marginBottom: '28px' }}>
                  <div className="fw-slider-wrap">
                    <div className="fw-slider-head">
                      <span className="fw-slider-label">Interest Rate (%)</span>
                      <span className="fw-slider-val">{calcRate.toFixed(2)}%</span>
                    </div>
                    <input type="range" className="fw-range" min="9" max="16" step="0.05"
                      value={calcRate} onChange={e => setCalcRate(Number(e.target.value))} style={{ marginTop: '12px' }} />
                    <div className="fw-slider-marks">
                      <span>9% (BoB)</span><span>11% (SBI)</span><span>12.5% (NBFC)</span><span>15%+</span>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="fw-slider-wrap">
                    <div className="fw-slider-head">
                      <span className="fw-slider-label">Repayment Tenure</span>
                      <span className="fw-slider-val">{calcTenure} Years</span>
                    </div>
                    <input type="range" className="fw-range" min="5" max="15" step="1"
                      value={calcTenure} onChange={e => setCalcTenure(Number(e.target.value))} style={{ marginTop: '12px' }} />
                  </div>
                </div>

                {/* Quick Rate Presets */}
                <div style={{ marginTop: '24px' }}>
                  <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.62rem', color: 'var(--muted)', marginBottom: '10px', letterSpacing: '.1em', textTransform: 'uppercase' }}>Quick Presets</div>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {[
                      { l: 'BoB 9.7%', r: 9.7 }, { l: 'SBI 11.15%', r: 11.15 },
                      { l: 'HDFC 11.5%', r: 11.5 }, { l: 'Avanse 12%', r: 12.0 },
                      { l: 'MPOWER 13%', r: 13.0 },
                    ].map(({ l, r }) => (
                      <button key={r} onClick={() => setCalcRate(r)}
                        style={{ padding: '5px 12px', borderRadius: '100px', border: `1px solid ${calcRate === r ? 'var(--teal)' : 'var(--border)'}`, background: calcRate === r ? 'rgba(0,245,212,.1)' : 'transparent', color: calcRate === r ? 'var(--teal)' : 'var(--muted)', fontSize: '.72rem', cursor: 'pointer', fontFamily: "'Syne',sans-serif", transition: 'all .15s' }}>
                        {l}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="fw-calc-result">
                <div className="fw-calc-result-main">
                  <div className="fw-calc-emi-label">MONTHLY EMI</div>
                  <div className="fw-calc-emi-val">{fmtINR(calcEMIVal)}</div>
                  <div className="fw-calc-emi-sub">per month for {calcTenure} years</div>
                </div>

                <div className="fw-donut-wrap">
                  <DonutChart principal={calcAmount} totalInterest={calcInterest} />
                </div>

                <div className="fw-calc-breakdown">
                  <div className="fw-cb-row">
                    <span className="fw-cb-label">Principal Amount</span>
                    <span className="fw-cb-val teal">{fmtINR(calcAmount)}</span>
                  </div>
                  <div className="fw-cb-row">
                    <span className="fw-cb-label">Total Interest Paid</span>
                    <span className="fw-cb-val danger">{fmtINR(calcInterest)}</span>
                  </div>
                  <div className="fw-cb-row" style={{ borderTop: '1px solid var(--border)', paddingTop: '12px', marginTop: '4px' }}>
                    <span className="fw-cb-label" style={{ fontWeight: 700, color: 'var(--text)' }}>Total Amount Repaid</span>
                    <span className="fw-cb-val gold">{fmtINR(calcTotal)}</span>
                  </div>
                  <div className="fw-cb-row">
                    <span className="fw-cb-label">Interest as % of Principal</span>
                    <span className="fw-cb-val" style={{ color: 'var(--muted)' }}>{Math.round((calcInterest / calcAmount) * 100)}%</span>
                  </div>
                </div>

                <div style={{ marginTop: '20px', padding: '12px', background: 'rgba(0,245,212,.04)', border: '1px solid rgba(0,245,212,.15)', borderRadius: '10px', fontFamily: "'JetBrains Mono',monospace", fontSize: '.65rem', color: 'var(--muted)', lineHeight: '1.55' }}>
                  💡 Choosing Bank of Baroda (9.7%) over an NBFC (12.5%) on ₹{(calcAmount / 100000).toFixed(0)}L saves approximately{' '}
                  <span style={{ color: 'var(--teal)' }}>
                    {fmtINR(Math.round((calcEMI(calcAmount, 12.5, calcTenure) - calcEMI(calcAmount, 9.7, calcTenure)) * calcTenure * 12))}
                  </span>{' '}over {calcTenure} years.
                </div>
              </div>
            </div>
          </div>

          {/* ══ WARNINGS ══ */}
          <div className="fw-sec fade-up" style={{ paddingTop: 0 }}>
            <div className="fw-sec-label" style={{ color: 'var(--danger)', borderColor: 'rgba(239,68,68,.35)' }}>CLASSIFIED INTEL</div>
            <h2 className="fw-sec-title">WHAT BANKS DON'T TELL YOU</h2>
            <p className="fw-sec-sub">Hover over the classified cards below to reveal the hidden financial traps our mentors have flagged from real loan experiences.</p>
            <div className="fw-traps">
              {WARNINGS.map((w, i) => (
                <div key={i} className="fw-trap">
                  <div className="fw-trap-cover">
                    <div className="fw-trap-cover-ico">{w.icon}</div>
                    <div className="fw-trap-cover-title">{w.coverTitle}</div>
                    <div className="fw-trap-hint">HOVER TO DECLASSIFY ↗</div>
                  </div>
                  <div className="fw-trap-content">
                    <div className="fw-trap-content-ico">{w.icon}</div>
                    <div className="fw-trap-content-title">{w.title}</div>
                    <div className="fw-trap-content-desc" dangerouslySetInnerHTML={{ __html: w.desc }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* ══ COMPARE STICKY PANEL ══ */}
        <div className={`fw-compare-panel ${compareList.length > 0 ? 'show' : ''}`}>
          <span className="fw-cp-label">⚖ COMPARE MODE</span>
          <div className="fw-cp-items">
            {cmpBanks.map(b => (
              <div key={b.id} className="fw-cp-item">
                <span className="fw-cp-item-name">{b.name}</span>
                <span className="fw-cp-item-rate">{b.rate}%</span>
                <button className="fw-cp-remove" onClick={() => toggleCompare(b.id)}>✕</button>
              </div>
            ))}
            {compareList.length === 1 && (
              <div style={{ padding: '7px 12px', border: '1px dashed rgba(168,85,247,.3)', borderRadius: '8px', fontFamily: "'JetBrains Mono',monospace", fontSize: '.65rem', color: 'rgba(168,85,247,.5)' }}>
                + Select one more
              </div>
            )}
          </div>
          <button className="fw-cp-btn" onClick={() => setShowCompareModal(true)} disabled={compareList.length < 2}
            style={{ opacity: compareList.length < 2 ? 0.4 : 1 }}>
            Compare Now →
          </button>
          <button className="fw-cp-clear" onClick={() => setCompareList([])}>Clear</button>
        </div>

        {/* ══ COMPARE MODAL ══ */}
        <div className={`fw-modal-overlay ${showCompareModal ? 'open' : ''}`} onClick={e => { if (e.target === e.currentTarget) setShowCompareModal(false); }}>
          <div className="fw-modal">
            <div className="fw-modal-head">
              <div className="fw-modal-title">HEAD-TO-HEAD COMPARISON</div>
              <button className="fw-modal-close" onClick={() => setShowCompareModal(false)}>✕</button>
            </div>
            <div className="fw-modal-body">
              {cmpBanks.length === 2 && (
                <div className="fw-compare-grid">
                  {/* Left */}
                  <div className="fw-compare-col">
                    <div className="fw-cmp-row fw-cmp-head">
                      <div className="fw-cmp-name">{cmpBanks[0].name}</div>
                      <div className="fw-cmp-rate" style={{ color: cmpBanks[0].highlightColor }}>{cmpBanks[0].rate}%</div>
                    </div>
                    {CMP_FIELDS.map((f, i) => {
                      const valA = f.key(cmpBanks[0]);
                      const valB = f.key(cmpBanks[1]);
                      const isWinner = f.cmp ? f.cmp(cmpBanks[0], cmpBanks[1]) : false;
                      return (
                        <div key={i} className="fw-cmp-row" style={{ background: isWinner ? 'rgba(0,245,212,.03)' : 'transparent' }}>
                          <div className="fw-cmp-key">{f.label}</div>
                          <div className="fw-cmp-val" style={{ color: isWinner ? 'var(--teal)' : 'inherit' }}>
                            {isWinner ? '✓ ' : ''}{valA}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  {/* Mid */}
                  <div className="fw-compare-col">
                    <div className="fw-cmp-mid-head">VS</div>
                    {CMP_FIELDS.map((f, i) => (
                      <div key={i} className="fw-cmp-mid">{f.label.length > 12 ? '—' : f.label.split(' ')[0]}</div>
                    ))}
                  </div>
                  {/* Right */}
                  <div className="fw-compare-col">
                    <div className="fw-cmp-row fw-cmp-head">
                      <div className="fw-cmp-name">{cmpBanks[1].name}</div>
                      <div className="fw-cmp-rate" style={{ color: cmpBanks[1].highlightColor }}>{cmpBanks[1].rate}%</div>
                    </div>
                    {CMP_FIELDS.map((f, i) => {
                      const isWinner = f.cmp ? f.cmp(cmpBanks[1], cmpBanks[0]) : false;
                      return (
                        <div key={i} className="fw-cmp-row" style={{ background: isWinner ? 'rgba(0,245,212,.03)' : 'transparent' }}>
                          <div className="fw-cmp-key">{f.label}</div>
                          <div className="fw-cmp-val" style={{ color: isWinner ? 'var(--teal)' : 'inherit' }}>
                            {isWinner ? '✓ ' : ''}{f.key(cmpBanks[1])}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
              <div style={{ marginTop: '28px', display: 'flex', gap: '12px' }}>
                <button onClick={() => setShowCompareModal(false)}
                  style={{ flex: 1, padding: '13px', borderRadius: '10px', border: '1px solid var(--border)', background: 'transparent', color: 'var(--muted)', fontFamily: "'Syne',sans-serif", fontSize: '.88rem', fontWeight: 600, cursor: 'pointer' }}>
                  Close
                </button>
                {cmpBanks[0] && (
                  <a href={cmpBanks[0].url} target="_blank" rel="noreferrer"
                    style={{ flex: 1, padding: '13px', borderRadius: '10px', border: 'none', background: 'var(--teal)', color: '#060c14', fontFamily: "'Syne',sans-serif", fontSize: '.88rem', fontWeight: 800, cursor: 'pointer', textAlign: 'center', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    Apply — {cmpBanks[0].name} ↗
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ══ DOC MODAL ══ */}
        <div className={`fw-doc-overlay ${docModal.open ? 'open' : ''}`} onClick={e => { if (e.target === e.currentTarget) setDocModal({ open: false, bank: null }); }}>
          <div className="fw-doc-modal">
            {docModal.bank && (
              <>
                <div className="fw-doc-modal-head">
                  <div>
                    <div className="fw-doc-modal-title">DOCUMENT VAULT</div>
                    <div className="fw-doc-modal-sub">{docModal.bank.name} · {docModal.bank.type} Lender · Required Documents</div>
                  </div>
                  <button className="fw-modal-close" onClick={() => setDocModal({ open: false, bank: null })}>✕</button>
                </div>
                <ul className="fw-doc-list">
                  {(DOC_LISTS[docModal.bank.type] || DOC_LISTS.PSB).map((item, i) => (
                    <li key={i} className="fw-doc-item" style={{ animationDelay: `${i * 0.06}s` }}>
                      <span className="fw-doc-emoji">{item.emoji}</span>
                      <span>{item.doc}</span>
                    </li>
                  ))}
                </ul>
                <div className="fw-doc-modal-footer">
                  <button className="fw-doc-dl-btn">↓ Download PDF Checklist</button>
                  <button className="fw-doc-close-btn" onClick={() => setDocModal({ open: false, bank: null })}>Close</button>
                </div>
              </>
            )}
          </div>
        </div>

      </div>
    </>
  );
}