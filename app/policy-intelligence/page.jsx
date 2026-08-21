'use client'

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

// ════════════════════════════════════════════════════════════════
// 0. FLAG HELPER
// ════════════════════════════════════════════════════════════════
const FlagImg = ({ code, size = 16 }) => {
  const iso = code === 'uk' ? 'gb' : code;
  return (
    <img
      src={`https://flagcdn.com/w${size * 2}/${iso}.png`}
      width={size}
      height={Math.round(size * 0.67)}
      alt={code}
      style={{ borderRadius: 3, objectFit: 'cover', border: '1px solid rgba(255,255,255,.2)', display: 'inline-block', verticalAlign: 'middle' }}
      onError={e => { e.currentTarget.style.display = 'none' }}
    />
  )
}

// ════════════════════════════════════════════════════════════════
// 1. DATA CONSTANTS 
// ════════════════════════════════════════════════════════════════
const META = {
  de: { name: 'Germany', iso: 'de', col: '#00F5FF', crit: 1, warn: 2, ok: 3 },
  us: { name: 'USA', iso: 'us', col: '#FF4D6D', crit: 1, warn: 1, ok: 2 },
  uk: { name: 'UK', iso: 'uk', col: '#A855F7', crit: 0, warn: 1, ok: 2 },
  ca: { name: 'Canada', iso: 'ca', col: '#F59E0B', crit: 0, warn: 1, ok: 2 },
  au: { name: 'Australia', iso: 'au', col: '#00E5A8', crit: 0, warn: 1, ok: 2 },
  ie: { name: 'Ireland', iso: 'ie', col: '#22D3A0', crit: 0, warn: 0, ok: 3 }
};

const POLICIES = {
  de: [
    { s: 'critical', ico: '🚨', title: 'APS Processing Time: 6 → 10 Weeks (Jan 2025)', date: 'Jan 2025', desc: 'APS India increased processing time from 6 to 10 weeks effective January 2025 due to increased application volumes.', impact: ['With 10-week processing + 6-week backlog = 16 weeks total lead time minimum', 'For Winter 2026 intake: must book APS appointment by March 2026 — not May', 'Delhi centre is significantly more backlogged than Mumbai'], deadline: 'Book APS by end of March 2026', action: 'Book APS Appointment' },
    { s: 'critical', ico: '💶', title: 'Blocked Account Updated: €10,332 → €11,208', date: 'Jan 2025', desc: 'Germany updated the required Sperrkonto amount. Students with old amount will face visa rejection.', impact: ['Old amount (€10,332) is a verified visa rejection reason in 2025', 'Must deposit exactly €11,208 — Fintiba and DKB both support top-ups', 'Apply: €934 × 12 months = €11,208 as per BMAS circular December 2024'], deadline: 'Top up before visa appointment', action: 'Top Up Fintiba/DKB Account' },
    { s: 'warning', ico: '⏱', title: 'APS Interview Backlog: 6–8 Week Wait', date: 'Dec 2024', desc: 'Separate from processing time — getting an appointment slot itself takes 6–8 weeks.', impact: ['Book appointment slots now — do not wait for admission letter', 'Mumbai centre has shorter wait than Delhi', 'Total APS timeline = 16–18 weeks for most students'], deadline: 'Book immediately', action: 'Check APS Availability' },
    { s: 'ok', ico: '✅', title: '18-Month Job Seeker Visa Confirmed Unchanged', date: 'Sep 2024', desc: 'Germany\'s Aufenthaltserlaubnis zur Jobsuche (job seeker visa) remains at 18 months post-graduation. No changes announced.', impact: ['Your post-study work rights are fully secure', 'This is a legal right — mention it confidently in your visa interview'], deadline: null, action: null },
    { s: 'ok', ico: '✅', title: 'Zero Tuition at Public Universities Stands', date: 'Jan 2025', desc: 'Germany\'s public universities (outside Baden-Württemberg) remain free for international students.', impact: ['Baden-Württemberg charges €1,500/semester — factor this in for KIT/Stuttgart applications', 'All other TU9 universities: €0 tuition confirmed for 2025-26'], deadline: null, action: null },
    { s: 'ok', ico: '✅', title: 'DAAD Scholarships Open for 2025-26', date: 'Oct 2024', desc: 'DAAD has opened scholarship applications for 2025-26 academic year. Indian applicants eligible for multiple streams.', impact: ['Helmut Schmidt Programme and Development-Related Postgraduate Courses both open', 'Applications close March 1, 2025 for most programmes'], deadline: 'March 1, 2025', action: 'Apply DAAD Scholarship' },
  ],
  us: [
    { s: 'critical', ico: '🚨', title: 'STEM OPT 3-Year Extension Under Senate Review', date: 'Jan 2025', desc: 'Senate Bill S.143 introduced to reduce STEM OPT from 36 to 24 months. No changes yet — but politically credible threat.', impact: ['Plan for 24-month OPT minimum when building post-US career plan', 'Current STEM OPT remains 36 months for graduating class of 2025', 'Monitor quarterly — most credible threat to STEM OPT in years'], deadline: 'Monitor quarterly', action: 'Track Senate Bill S.143' },
    { s: 'warning', ico: '⚠️', title: 'F-1 Visa Appointment Backlog: 3–4 Months', date: 'Nov 2024', desc: 'US Embassy New Delhi experiencing 3–4 month F-1 visa appointment wait times.', impact: ['Apply for appointment immediately upon receiving I-20 — do not wait', 'For Fall 2026 intake: book appointment by January 2026 at the latest', 'Expedited appointments available for documented urgent cases'], deadline: 'Book by January 2026 for Fall 2026', action: 'Book F-1 Appointment' },
    { s: 'ok', ico: '✅', title: 'SEVIS Fee Unchanged at $350', date: 'Jan 2025', desc: 'No changes to SEVIS I-901 fee for 2025.', impact: ['Standard $350 payment applies — no financial impact'], deadline: null, action: null },
  ],
  uk: [
    { s: 'warning', ico: '⚠️', title: 'UKVI IELTS Required — Not Standard IELTS', date: 'Ongoing', desc: 'Critical ongoing rule: UK Student Visa requires UKVI-approved IELTS. Standard Academic IELTS causes visa rejection.', impact: ['~8% of Indian applicants book wrong test — instant visa rejection', 'Must take UKVI IELTS at British Council authorised centre only', 'Check your test certificate for "UKVI" designation before applying'], deadline: 'Before visa application', action: 'Verify IELTS is UKVI-Approved' },
    { s: 'ok', ico: '✅', title: 'Graduate Route (2-Year Post-Study Work) Confirmed Safe', date: 'Jan 2025', desc: 'UK Government confirmed Graduate Route will not be abolished. Confirmed for 2025 and 2026 graduating cohorts.', impact: ['All students graduating 2025–2026 retain full 2-year Graduate Route rights', 'Future restrictions possible for 2027+ — monitor if graduation is later'], deadline: null, action: null },
    { s: 'ok', ico: '✅', title: 'UK Tuition Fees Stable for 2025-26', date: 'Jan 2025', desc: 'International student tuition fees remain in normal range. No increases announced.', impact: ['No financial impact for current applicants'], deadline: null, action: null },
  ],
  ca: [
    { s: 'warning', ico: '⚠️', title: 'Study Permits Cut by 35% for 2025', date: 'Jan 2025', desc: 'IRCC announced 437,000 study permits for 2025 — down 35% from 2024. Provincial caps also introduced.', impact: ['Apply as early as possible in quarterly windows — early applicants have higher odds', 'Ensure your DLI has a strong IRCC compliance record', 'Financial proof scrutiny significantly increased in 2025'], deadline: 'Apply immediately on LOA receipt', action: 'Check DLI Compliance Record' },
    { s: 'ok', ico: '✅', title: 'PGWP Still Tied to Program Length (Up to 3 Years)', date: 'Ongoing', desc: 'PGWP remains: 2-year program → 3-year PGWP. No changes announced.', impact: ['For a 2-year MSc: you qualify for 3-year PGWP — Canada\'s strongest advantage', 'Ensure program length is 2+ years if 3-year PGWP is important to you'], deadline: null, action: null },
    { s: 'ok', ico: '✅', title: 'Express Entry: CRS Scores Stabilising', date: 'Dec 2024', desc: 'Express Entry CRS draw scores have stabilised after 2024 volatility.', impact: ['International students with Canadian work experience remain strong candidates', 'Canadian work experience (via PGWP) still provides significant CRS boost'], deadline: null, action: null },
  ],
  au: [
    { s: 'warning', ico: '⚠️', title: 'Engineering Programme Caps: 30% Reduction', date: 'Nov 2024', desc: 'Australian universities introduced 30% international student cap reductions for Engineering programmes.', impact: ['Apply early — places are genuinely more limited in 2025', 'Non-engineering programmes (CS, Data Science, Business) largely unaffected', 'Submit applications by February 2025 to maximise chances'], deadline: 'Apply by February 2025', action: 'Submit Early Application' },
    { s: 'ok', ico: '✅', title: '485 Graduate Visa: 4 Years for STEM Confirmed', date: 'Jan 2025', desc: 'Subclass 485 provides 4 years post-study work for STEM graduates. Unchanged for 2025.', impact: ['4-year 485 is Australia\'s unique advantage over UK (2 years) and Canada (3 years max)'], deadline: null, action: null },
    { s: 'ok', ico: '✅', title: '48-Hour Fortnightly Work Limit Confirmed', date: 'Jan 2025', desc: 'Student visa work conditions unchanged: 48 hours per fortnight during study, unlimited during official breaks.', impact: ['No changes. Mention this precisely in your visa interview to show preparation'], deadline: null, action: null },
  ],
  ie: [
    { s: 'ok', ico: '✅', title: 'Stamp 1G: 2-Year Post-Study Work Confirmed', date: 'Jan 2025', desc: 'Ireland\'s Stamp 1G remains 2 years of unrestricted post-study work authorization. No changes.', impact: ['Use this confidently in visa interviews — it is Ireland\'s strongest immigration benefit'], deadline: null, action: null },
    { s: 'ok', ico: '✅', title: 'Work Hours: 20/Week Term, Full-Time Holidays', date: 'Ongoing', desc: 'Standard conditions confirmed: 20 hours/week during term, unlimited during official college holidays.', impact: ['No changes. State this exactly in interviews to show you\'ve read your visa conditions'], deadline: null, action: null },
    { s: 'ok', ico: '✅', title: 'Critical Skills Permit Pathway Active', date: 'Jan 2025', desc: 'Graduates in STEM and other eligible fields can apply for Critical Skills Employment Permit after graduation.', impact: ['Provides a direct pathway to Irish permanent residency after 2 years on Stamp 1G', 'Higher salary threshold required: €32,000+ for Critical Skills eligible roles'], deadline: null, action: null },
  ]
};

const IMPACT_DATA = [
  { s: 'critical', iso: 'de', country: 'Germany', title: 'APS Processing Extended — You Are Behind Schedule', affects: 'You are targeting Winter 2026 with APS status "Not booked."', rows: [{ ico: '⏱', text: '10-week processing + 6-week appointment backlog = <b>16 weeks minimum</b>' }, { ico: '📅', text: 'Winter 2026 starts October 2026. APS must complete by <b>July 2026</b>' }, { ico: '🚨', text: 'Book appointment by <b>March 2026</b> — that is less than 30 days away' }], deadline: 'Book APS by end of March 2026 — URGENT', actions: ['Book APS Appointment →', 'Add Reminder to Calendar'] },
  { s: 'critical', iso: 'de', country: 'Germany', title: 'Blocked Account: You Need €11,208 (Not Yet Opened)', affects: 'Your blocked account status is "Not opened." New amount required: €11,208.', rows: [{ ico: '💶', text: 'New amount: <b>€11,208</b> — up from €10,332 (changed January 2025)' }, { ico: '🏦', text: 'Open with <b>Fintiba or DKB</b> — both embassy-verified providers' }, { ico: '⚠️', text: 'Applications with old amount cause <b>visa rejection</b> — verified failure point' }], deadline: 'Open 6 months before visa appointment', actions: ['Open Fintiba Account →', 'Compare Fintiba vs DKB'] },
  { s: 'critical', iso: 'de', country: 'Germany', title: 'University Applications: Not Started', affects: 'German application deadlines are strict and approaching.', rows: [{ ico: '📋', text: 'TU Munich Winter 2026 deadline: <b>January 15, 2026</b> via Uni-Assist' }, { ico: '📋', text: 'RWTH Aachen Winter 2026: <b>March 1, 2026</b> via own portal' }, { ico: '🚨', text: 'Uni-Assist takes 4–6 weeks — submit <b>6 weeks before deadline</b>' }], deadline: 'Submit applications by December 1, 2025 latest', actions: ['Open Uni-Assist Portal →', 'View All German Deadlines'] },
  { s: 'warning', iso: 'de', country: 'Germany', title: 'IELTS: Verify Score Meets Program Requirements', affects: 'Your IELTS is 7.0–7.5. Most German programs require 6.5 minimum.', rows: [{ ico: '✅', text: 'Your score <b>meets all German public university requirements</b>' }, { ico: '⚠️', text: 'Some programs require specific <b>individual band scores</b> — verify per program' }, { ico: '📋', text: 'Ensure certificate is less than <b>2 years old</b> at time of submission' }], deadline: 'Check certificate expiry', actions: ['Verify per Program →'] },
  { s: 'ok', iso: 'de', country: 'Germany', title: '18-Month Job Seeker Visa: Post-Study Rights Secure', affects: 'This policy has not changed. Your rights are safe.', rows: [{ ico: '✅', text: 'Germany\'s 18-month Job Seeker Visa unchanged for 2025 graduates' }, { ico: '✅', text: 'You can legally work and seek employment for 18 months after graduation' }], notAffected: true, actions: [] },
];

const TL_DATA = [
  { country: 'ca', iso: 'ca', s: 'critical', title: 'Canada Cuts Study Permits by 35%', date: 'January 2025', desc: 'IRCC confirmed 437,000 study permits for 2025 — 35% below 2024. Provincial caps introduced for first time.', impact: 'Approval rates dropping. Early applicants with strong DLI records have better odds.', cls: 'tl-crit' },
  { country: 'de', iso: 'de', s: 'critical', title: 'Germany APS: 6 → 10 Weeks Processing', date: 'January 2025', desc: 'APS India increased processing time. Students targeting Winter 2026 must now book by March 2026.', impact: 'Students relying on old timeline will miss their intake. Act immediately.', cls: 'tl-crit' },
  { country: 'de', iso: 'de', s: 'warning', title: 'Germany Blocked Account: €10,332 → €11,208', date: 'January 2025', desc: 'Sperrkonto amount increased. Students with old amount must top up immediately.', impact: 'Old amount causes visa rejection. Fintiba and DKB top-ups available.', cls: 'tl-warn' },
  { country: 'us', iso: 'us', s: 'warning', title: 'STEM OPT Extension Legislation Introduced in Senate', date: 'January 2025', desc: 'Senate Bill S.143 proposes reducing STEM OPT from 36 to 24 months.', impact: 'No change yet. Students should plan for 24-month contingency.', cls: 'tl-warn' },
  { country: 'uk', iso: 'uk', s: 'ok', title: 'UK Graduate Route: Confirmed NOT Abolished', date: 'January 2025', desc: 'Home Secretary confirmed 2-year Graduate Route remains intact for 2025–26 cohorts.', impact: 'Positive. Students can proceed with UK applications with full confidence.', cls: 'tl-ok' },
  { country: 'au', iso: 'au', s: 'warning', title: 'Australia Engineering Caps: 30% Reduction', date: 'November 2024', desc: 'New per-programme international student caps. Engineering hit hardest.', impact: 'Engineering applicants face higher competition. Apply as early as possible.', cls: 'tl-warn' },
  { country: 'ca', iso: 'ca', s: 'critical', title: 'Canada Agents Still Selling Pre-Cap Data', date: 'October 2024', desc: 'Agents documented using 85% approval rate data from 2021. Current rates far lower.', impact: 'Students losing deposits based on false information. Verify with IRCC directly.', cls: 'tl-crit' },
  { country: 'uk', iso: 'uk', s: 'critical', title: 'UK Graduate Route Panic — 50K Students Affected', date: 'May 2024', desc: 'Threatened abolition of Graduate Route caused mass panic among enrolled students.', impact: 'Route kept intact. But students made emergency decisions — many lost deposits.', cls: 'tl-crit' },
  { country: 'ca', iso: 'ca', s: 'critical', title: 'Canada First Announced Study Permit Cap', date: 'January 2024', desc: 'Canada announced 360,000 permits for 2024 (down from 519,000). Entire India pipeline disrupted.', impact: 'Agents caught off guard. Students lost deposits. Consultants blamed.', cls: 'tl-crit' },
  { country: 'ie', iso: 'ie', s: 'ok', title: 'Ireland Stamp 1G Extended to 2 Years', date: 'November 2023', desc: 'Stamp 1G post-study work authorization extended from 1 to 2 years.', impact: 'Significant improvement. Made Ireland more competitive than UK on post-study work.', cls: 'tl-ok' },
];

const MYTHS = [
  { ico: '🇨🇦', title: '"Canada is the easiest country right now"', dangerous: true, source: 'Told by: Education consultants (still common in 2025)', claim: 'Canada has the most straightforward and accessible student visa — ideal for Indian students.', reality: 'Canada has <b>slashed permits by 35%</b> in 2025. Some colleges see below 50% approval rates. The 85% approval rate myth is based on 2021 data.', evidence: '<b>IRCC January 2025:</b> cap of 437,000 study permits for 2025. Indian students now face scrutiny comparable to the US F-1 process.', danger: 'Students buying Canada packages for ₹3–5 lakh based on agents quoting 2021 data. Many getting rejected and losing deposits.' },
  { ico: '🇬🇧', title: '"The UK Graduate Route is being abolished"', dangerous: false, source: 'WhatsApp groups, YouTube channels (May 2024)', claim: 'The UK government is abolishing the Graduate Route. Students will be deported after graduation.', reality: 'Graduate Route was <b>confirmed intact January 2025</b>. Students graduating 2025–2026 are fully protected. It\'s under review for future cohorts, not abolished.', evidence: '<b>Home Secretary statement, Jan 7, 2025:</b> "The Graduate Route will be maintained in its current form for 2024–25 and 2025–26 cohorts."', danger: 'Students abandoned Russell Group offers in 2024. Some lost non-refundable deposits based on this myth.' },
  { ico: '🇩🇪', title: '"Just deposit €10,000 for Germany — it\'s fine"', dangerous: true, source: 'Old advice still circulating from agents trained pre-2025', claim: 'The blocked account requirement is a formality — deposit approximately €10,000 and your visa will be approved.', reality: 'Must be exactly <b>€11,208</b> (updated January 2025). Applications with €10,332 (old amount) are being rejected. The exact figure is verified against the current BMAS circular.', evidence: '<b>BMAS circular December 2024:</b> §2 (3) AufenthV — €934 × 12 = €11,208 minimum.', danger: 'Students who opened accounts with old amount (₹8.5 lakh) face rejection unless they top up.' },
  { ico: '🇩🇪', title: '"Book APS 2 months before deadline — that\'s enough"', dangerous: true, source: 'YouTube guides from 2022–2023 still ranking highly', claim: 'APS takes 6 weeks. Book 2 months before your application deadline.', reality: 'APS now takes <b>10 weeks processing + 6–8 weeks appointment wait = 16–18 weeks total</b>. Booking 2 months before deadline guarantees you miss your intake.', evidence: '<b>APS India official update, January 2025:</b> "Processing times extended to approximately 10 weeks due to increased volumes."', danger: 'Students targeting Winter 2026 who follow this advice and book in April/May 2026 will miss the July deadline.' },
  { ico: '🇺🇸', title: '"STEM OPT gives you a guaranteed 3 years in the US"', dangerous: true, source: 'Indian universities, coaching institutes, study abroad fairs (2024)', claim: 'After an MS in a STEM field, you automatically get 3 years of OPT.', reality: 'STEM OPT gives 3 years <b>currently</b> — but Senate Bill S.143 (January 2025) proposes reducing it to 2 years. Never build a fixed 4-year plan on current OPT duration.', evidence: '<b>Senate Bill S.143 (January 2025):</b> "STEM OPT Modernization Act" — proposes 24-month cap. Status: Committee review.', danger: 'Students choosing USA over Canada specifically for 3-year OPT may find this advantage reduced or eliminated.' },
  { ico: '🇦🇺', title: '"A template GTE statement is fine for Australia"', dangerous: true, source: 'Quora, Reddit, student forums (template GTE statements widely shared)', claim: 'GTE is a formality. Download a template, fill in your name, you\'re fine.', reality: 'DIBP issued new guidance in September 2024 — <b>template GTE statements are now identified and scored significantly lower</b>. Officers require specific, personalised narratives.', evidence: '<b>DIBP internal guidance, Sept 2024:</b> Template detection mentioned specifically. GTE-related rejection rates rose 12% in Q4 2024.', danger: 'Students submitting boilerplate GTE face significantly higher rejection rates in 2025 than in previous years.' },
];

const ALERTS = [
  { name: 'Aarav Mehta', iso: 'de', img: 'https://randomuser.me/api/portraits/men/11.jpg', country: 'Germany', time: '2 min ago', text: '<b>URGENT — APS:</b> All my Germany-bound students: APS is now 10 weeks. Winter 2026 target means you must book this week. Do not delay. Message me and I will guide you through.', sev: 'crit' },
  { name: 'Priya Sharma', iso: 'uk', img: 'https://randomuser.me/api/portraits/women/55.jpg', country: 'UK', time: '1 hr ago', text: 'For my UK students: the Graduate Route is confirmed safe for 2025 and 2026. The panic from May 2024 is over. Proceed with UCL/Imperial/Edinburgh applications with full confidence. <b>The 2-year post-study work right stands.</b>', sev: 'ok' },
  { name: 'Dev Patel', iso: 'ca', img: 'https://randomuser.me/api/portraits/men/22.jpg', country: 'Canada', time: '3 hrs ago', text: '<b>Canada reality check:</b> I am getting calls from students whose agents quoted 85% approval rates. Current rate for some colleges is below 50%. Verify your institution\'s IRCC compliance record before signing anything.', sev: 'warn' },
  { name: 'Neha Singh', iso: 'de', img: 'https://randomuser.me/api/portraits/women/33.jpg', country: 'Germany', time: 'Yesterday', text: 'Just confirmed: blocked account at €10,332 caused a visa rejection this week. <b>The new amount is €11,208.</b> If you opened your account before January 2025, log into Fintiba or DKB and top up today.', sev: 'crit' },
];

const SC = { crit: 'sev-crit', warn: 'sev-warn', ok: 'sev-ok', info: 'sev-info' };
const SL = { crit: '🚨 CRITICAL', warn: '⚠ WARNING', ok: '✅ STABLE', info: 'ℹ INFO' };
const DC = { crit: 'var(--rose)', warn: 'var(--amber)', ok: 'var(--teal)', info: 'var(--sky)' };
const SEC_META = {
  radar: { eyebrow: 'REAL-TIME INTELLIGENCE', title: 'POLICY RADAR', sub: 'Live tracking of critical policies across 6 countries. Click any policy to see full impact.' },
  impact: { eyebrow: 'PERSONALISED ASSESSMENT', title: 'IMPACT ENGINE', sub: 'Every policy change evaluated against your profile. Only what affects you — zero noise.' },
  timeline: { eyebrow: 'POLICY HISTORY', title: 'POLICY TIMELINE', sub: '3-year history of how policies have changed. See trends — is the UK tightening or loosening?' },
  myths: { eyebrow: 'MYTH INTELLIGENCE', title: 'MYTH BUSTER', sub: 'The 6 most dangerous myths circulating right now. Show students the current reality vs outdated advice.' },
  alerts: { eyebrow: 'MENTOR NETWORK', title: 'MENTOR ALERTS', sub: 'Brief your students before they hear policy changes from the wrong source. Post targeted alerts.' },
  log: { eyebrow: 'SYSTEM INTELLIGENCE', title: 'SYSTEM LOG', sub: 'Real-time log of all policy changes, verifications, and mentor flags.' },
};

const pulseItems = [
  { ico: '📡', msg: 'Policy engine polling — all 6 country feeds nominal' },
  { ico: '🇩🇪', msg: 'Germany: APS processing time confirmed at 10 weeks' },
  { ico: '🇬🇧', msg: 'UK Home Office: no changes to Graduate Route this week' },
  { ico: '🇨🇦', msg: 'IRCC: next quarterly permit window opens February 15, 2026' },
];

const INITIAL_LOGS = [
  { t: 'NOW', ico: '🔄', html: 'Policy engine initialised — <span class="log-ok">6 countries active</span><span class="log-cur"></span>' },
  { t: '09:44', ico: '🚨', html: '<span class="log-crit">CRITICAL</span> — Germany APS: 6 → 10 weeks processing time' },
  { t: '09:41', ico: '⚠️', html: '<span class="log-warn">WARNING</span> — Canada study permit quota cut 35% for 2025-26' },
  { t: '08:22', ico: 'ℹ️', html: 'UK Graduate Route confirmed intact — 2-year post-study work stands' },
  { t: 'YEST', ico: '⚠️', html: '<span class="log-warn">WARNING</span> — Australia student intake caps tightened for Engineering' },
  { t: 'YEST', ico: '✅', html: '<span class="log-ok">VERIFIED</span> — Germany blocked account confirmed at €11,208 for 2025' },
  { t: '2d', ico: '🚨', html: '<span class="log-crit">CRITICAL</span> — USA STEM OPT extension under Senate review — monitor' },
  { t: '3d', ico: '📡', html: 'Mentor <b>Priya Sharma</b> flagged UK TB test update — <span class="log-ok">verified</span>' },
];

// ════════════════════════════════════════════════════════════════
// 2. CSS INJECTION 
// ════════════════════════════════════════════════════════════════
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Mono:wght@400;500&family=Syne:wght@400;600;700;800&display=swap');

.pi-root {
  --bg:#030508; --bg1:#070B14; --bg2:#0A101D; --bg3:#10182B;
  --cyan:#00F5FF; --teal:#00E5A8; --amber:#FFB347; --purple:#A855F7;
  --rose:#FF4D6D; --sky:#38BDF8;
  --b:rgba(255,255,255,.12); --bh:rgba(0,245,255,.4);
  --t:#FFFFFF; --t2:#94A3B8; --t3:#475569;
  --ffh:'Bebas Neue',sans-serif; --ffb:'Syne',sans-serif; --ffm:'DM Mono',monospace;
  background: var(--bg); color: var(--t); font-family: var(--ffb);
  -webkit-font-smoothing: antialiased; min-height: 100vh; overflow-x: hidden;
}

.pi-root *, .pi-root *::before, .pi-root *::after { box-sizing: border-box; margin: 0; padding: 0; }
.pi-root ::-webkit-scrollbar { width: 4px; background: transparent; }
.pi-root ::-webkit-scrollbar-thumb { background: rgba(0,245,255,.2); border-radius: 4px; }

/* BACKGROUND AMBIENCE */
.amb { position:fixed; inset:0; z-index:0; pointer-events:none; background: radial-gradient(ellipse 60% 50% at 15% 10%, rgba(0,245,255,.05), transparent 60%), radial-gradient(ellipse 50% 55% at 85% 85%, rgba(168,85,247,.04), transparent 60%); }
.hex { position:fixed; inset:0; z-index:0; pointer-events:none; opacity:.02; background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='104'%3E%3Cpolygon points='30,2 58,17 58,47 30,62 2,47 2,17' fill='none' stroke='%2300F5FF' stroke-width='1'/%3E%3C/svg%3E"); }
.scan { position:fixed; inset:0; z-index:0; pointer-events:none; background:repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,.03) 2px,rgba(0,0,0,.03) 4px); animation:scanMove 15s linear infinite; }
@keyframes scanMove { 100% { background-position:0 200px; } }

/* TOP NAV */
.topbar { position:sticky; top:0; z-index:500; height:64px; background:rgba(3,5,8,.85); backdrop-filter:blur(24px); border-bottom:1px solid var(--b); display:flex; align-items:center; padding:0 32px; gap:16px; box-shadow: 0 4px 24px rgba(0,0,0,0.4); }
.logo { display:flex; align-items:center; gap:10px; font-family:var(--ffb); font-weight:800; font-size:1.1rem; color:#fff; text-decoration:none; }
.logo-gem { width:34px; height:34px; border-radius:10px; background:linear-gradient(135deg, var(--cyan), var(--teal)); display:flex; align-items:center; justify-content:center; font-size:16px; color:#000; box-shadow:0 0 20px rgba(0,245,255,.3); }
.logo em { font-style:normal; color:var(--teal); }
.tb-div { width:1px; height:24px; background:var(--b); flex-shrink:0; margin: 0 8px; }
.tb-title { font-family:var(--ffh); font-size:1.3rem; letter-spacing:.06em; color:#fff; line-height: 1.1; }
.tb-sub { font-family:var(--ffm); font-size:.65rem; color:var(--t2); letter-spacing: 0.05em; font-weight:500; }
.tb-sp { flex:1; }
.tb-live { display:flex; align-items:center; gap:8px; font-family:var(--ffm); font-size:.65rem; color:var(--teal); background:rgba(0,229,168,.1); border:1px solid rgba(0,229,168,.3); padding:6px 14px; border-radius:20px; letter-spacing:.1em; font-weight: 700; }
.live-dot { width:8px; height:8px; border-radius:50%; background:var(--rose); box-shadow:0 0 10px var(--rose); animation:livePulse 1.5s infinite; flex-shrink:0; }
@keyframes livePulse { 0%,100%{box-shadow:0 0 6px var(--rose)} 50%{box-shadow:0 0 16px var(--rose)} }
.tb-time { font-family:var(--ffm); font-size:.75rem; color:var(--t); background:rgba(255,255,255,0.05); border:1px solid var(--b); padding:6px 12px; border-radius:8px; }

/* ── AAA HERO SECTION ── */
.pi-hero { display: flex; align-items: center; justify-content: center; gap: 60px; padding: 120px 40px; min-height: 80vh; max-width: 1400px; margin: 0 auto; position: relative; z-index: 10; }
.ph-col1 { flex-shrink: 0; }
.ph-pill { border: 1px solid rgba(0,245,255,0.3); border-radius: 40px; padding: 16px 24px; font-family: var(--ffm); font-size: 0.7rem; color: var(--cyan); letter-spacing: 0.1em; line-height: 1.6; display: flex; align-items: flex-start; gap: 12px; background: rgba(0,245,255,0.05); box-shadow: 0 0 30px rgba(0,245,255,0.1); }
.ph-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--cyan); box-shadow: 0 0 10px var(--cyan); margin-top: 4px; animation: livePulse 2s infinite; }
.ph-col2 { flex-shrink: 0; }
.ph-title { font-family: var(--ffh); font-size: clamp(50px, 7vw, 100px); line-height: 0.9; color: #fff; letter-spacing: 0.03em; text-transform: uppercase; margin-bottom: 20px;}
.ph-cyan { color: var(--cyan); } 
.ph-rose { color: var(--rose); text-shadow: 0 0 20px rgba(255,77,109,0.4); } 
.ph-col3 { max-width: 340px; }
.ph-desc { font-family: var(--ffb); font-size: 0.95rem; color: var(--t2); line-height: 1.7; margin-bottom: 32px; font-weight: 500;}
.ph-col4 { display: flex; flex-direction: column; gap: 32px; flex-shrink: 0; }
.ph-stat-val { font-family: var(--ffh); font-size: 2.8rem; color: var(--teal); line-height: 1; letter-spacing: 0.05em; margin-bottom: 4px; }
.ph-stat-lbl { font-family: var(--ffm); font-size: 0.7rem; color: var(--t3); letter-spacing: 0.1em; text-transform: uppercase; font-weight: 500;}

@media(max-width: 1100px) {
  .pi-hero { flex-direction: column; align-items: flex-start; gap: 40px; padding: 80px 24px; min-height: auto;}
  .ph-col3 { max-width: 100%; }
  .ph-col4 { flex-direction: row; flex-wrap: wrap; gap: 24px; }
}

.hero-divider { height: 1px; background: linear-gradient(90deg, transparent, rgba(0,245,255,0.3), transparent); margin-bottom: 0; position: relative; z-index: 10; }

/* ── SCROLLABLE DASHBOARD LAYOUT ── */
.layout { position:relative; z-index:2; display:flex; align-items: flex-start; padding-bottom: 80px; max-width: 1600px; margin: 0 auto;}
.sidebar { width:260px; flex-shrink:0; background:rgba(7,11,20,0.6); backdrop-filter: blur(20px); border-right:1px solid var(--b); display:flex; flex-direction:column; position: sticky; top: 64px; height: calc(100vh - 64px); overflow-y: auto; }
.sb-sect { padding:24px 20px 8px; font-family:var(--ffm); font-size:.65rem; letter-spacing:.15em; text-transform:uppercase; color:var(--t3); font-weight: 500;}
.sb-item { display:flex; align-items:center; gap:12px; padding:12px 20px; font-size:.85rem; font-weight:600; color:var(--t2); cursor:pointer; transition:all .2s; border-left:3px solid transparent; white-space:nowrap; }
.sb-item:hover { color:#fff; background:rgba(255,255,255,.03); }
.sb-item.active { color:var(--cyan); background:linear-gradient(90deg, rgba(0,245,255,.1), transparent); border-left-color:var(--cyan); text-shadow: 0 0 10px rgba(0,245,255,0.3); }
.sb-ico { font-size:14px; width:18px; text-align:center; flex-shrink:0; }
.sb-badge { margin-left:auto; font-family:var(--ffm); font-size:.6rem; padding:2px 8px; border-radius:6px; font-weight:600;}

.bc { background:rgba(0,245,255,.15); color:var(--cyan); border:1px solid rgba(0,245,255,.3); }
.br { background:rgba(251,77,109,.15); color:var(--rose); border:1px solid rgba(251,77,109,.3); animation:badgeBlink 2s infinite; }
.bg { background:rgba(0,229,168,.15); color:var(--teal); border:1px solid rgba(0,229,168,.3); }
.ba { background:rgba(245,158,11,.15); color:var(--amber); border:1px solid rgba(245,158,11,.3); }
@keyframes badgeBlink { 0%,100%{opacity:1} 50%{opacity:.5} }

.profile-mini{margin:20px 16px;background:rgba(0,245,255,.05);border:1px solid rgba(0,245,255,.2);border-radius:14px;padding:16px; box-shadow: inset 0 0 20px rgba(0,245,255,0.02);}
.pm-title{font-family:var(--ffm);font-size:.65rem;color:var(--cyan);letter-spacing:.1em;text-transform:uppercase;margin-bottom:12px; font-weight:500;}
.pm-row{display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;padding-bottom:8px;border-bottom:1px solid rgba(255,255,255,.06)}
.pm-row:last-child{margin-bottom:0;padding-bottom:0;border-bottom:none}
.pm-label{font-family:var(--ffm);font-size:.65rem;color:var(--t2)}
.pm-val{font-family:var(--ffb);font-size:.8rem;color:#fff;font-weight:700}
.pm-edit{font-family:var(--ffb);font-size:.75rem;color:var(--cyan);cursor:pointer;margin-top:14px;text-align:center; font-weight:700; padding: 8px; background: rgba(0,245,255,0.1); border-radius:8px; transition:all .2s;}
.pm-edit:hover{background:rgba(0,245,255,.2)}

.main { flex:1; display:flex; flex-direction:column; min-height: calc(100vh - 64px); max-width: 1200px; padding: 0 40px;}
.sec-head { padding:40px 0 24px; display:flex; align-items:flex-end; justify-content:space-between; gap:24px; border-bottom: 1px solid var(--b); }
.sec-eyebrow { font-family:var(--ffm); font-size:.65rem; color:var(--teal); letter-spacing:.2em; text-transform:uppercase; margin-bottom:8px; display:flex; align-items:center; gap:8px; font-weight:500;}
.sec-eyebrow::before { content:'⬡'; color:var(--teal); font-size:14px;}
.sec-title { font-family:var(--ffh); font-size:clamp(32px,4vw,48px); letter-spacing:.05em; color:#fff; line-height:1; }
.sec-sub { font-size:.95rem; color:var(--t2); margin-top:8px; max-width:600px; line-height:1.6; }
.content { padding:32px 0 80px; }

.section { display:none; animation:fadeUp .4s ease; }
.section.active { display:block; }
@keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:none}}

/* ✨ BUTTONS (High Visibility) */
.btn{padding:10px 20px;border-radius:10px;font-family:var(--ffb);font-size:.85rem;font-weight:800;cursor:pointer;transition:all .25s;border:none;display:inline-flex;align-items:center;gap:8px;text-transform:uppercase;letter-spacing:0.05em;}

.btn-primary{background:var(--cyan);color:#000 !important; box-shadow:0 6px 20px rgba(0,245,255,.3);}
.btn-primary:hover{background:var(--teal); transform:translateY(-2px);box-shadow:0 10px 25px rgba(0,229,168,.5)}

.btn-ghost{background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.4);color:#fff !important;}
.btn-ghost:hover{border-color:var(--cyan);background:var(--cyan);color:#000 !important; box-shadow:0 6px 20px rgba(0,245,255,.3);}

.btn-amber{background:var(--amber); color:#000 !important; box-shadow:0 6px 20px rgba(245,158,11,.3);}
.btn-amber:hover{background:#FFC645; transform:translateY(-2px); box-shadow:0 10px 25px rgba(245,158,11,.5);}

.btn-sm{padding:8px 16px;font-size:.75rem}
.btn-xs{padding:6px 12px;font-size:.7rem;border-radius:8px}

/* SEV TAGS */
.sev { font-family:var(--ffm); font-size:.6rem; padding:4px 10px; border-radius:6px; border:1px solid; letter-spacing:.1em; text-transform:uppercase; display:inline-flex; align-items:center; gap:6px; white-space:nowrap; font-weight:700; }
.sev-crit { color:var(--rose); border-color:var(--rose); background:rgba(251,77,109,.15); box-shadow: inset 0 0 10px rgba(251,77,109,0.2);}
.sev-warn { color:var(--amber); border-color:var(--amber); background:rgba(245,158,11,.15); box-shadow: inset 0 0 10px rgba(245,158,11,0.2);}
.sev-info { color:var(--sky); border-color:var(--sky); background:rgba(56,189,248,.15); }
.sev-ok { color:var(--teal); border-color:var(--teal); background:rgba(0,229,168,.15); }

/* STATS GRID */
.stats-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:16px; margin-bottom:24px; }
.stat-card { background:rgba(10,16,29,0.8); backdrop-filter:blur(16px); border:1px solid var(--b); border-radius:16px; padding:20px; position:relative; overflow:hidden; box-shadow: 0 8px 32px rgba(0,0,0,0.3);}
.stat-card::after { content:''; position:absolute; bottom:0; left:0; right:0; height:3px; }
.stat-card:nth-child(1)::after { background:var(--rose); box-shadow: 0 -4px 12px rgba(255,77,109,0.5);}
.stat-card:nth-child(2)::after { background:var(--amber); box-shadow: 0 -4px 12px rgba(255,179,71,0.5);}
.stat-card:nth-child(3)::after { background:var(--cyan); box-shadow: 0 -4px 12px rgba(0,245,255,0.5);}
.stat-card:nth-child(4)::after { background:var(--teal); box-shadow: 0 -4px 12px rgba(0,229,168,0.5);}
.stat-val { font-family:var(--ffh); font-size:2.8rem; letter-spacing:.04em; line-height:1; margin-bottom:4px; text-shadow:0 4px 12px rgba(0,0,0,0.5);}
.stat-lbl { font-family:var(--ffm); font-size:.65rem; color:var(--t2); letter-spacing:.1em; text-transform:uppercase; font-weight:600;}

/* COUNTRY TABS */
.country-tabs { display:flex; gap:0; background:rgba(10,16,29,0.8); backdrop-filter:blur(16px); border:1px solid var(--b); border-radius:16px 16px 0 0; overflow:hidden; border-bottom:none; }
.ctab { flex:1; padding:16px 8px; font-family:var(--ffb); font-size:.85rem; color:var(--t2); cursor:pointer; text-align:center; border-bottom:3px solid transparent; transition:all .2s; text-transform:uppercase; display:flex; align-items:center; justify-content:center; gap:10px; border-right:1px solid var(--b); position:relative; font-weight:700;}
.ctab:last-child { border-right:none; }
.ctab:hover { color:#fff; background:rgba(255,255,255,.05); }
.ctab.active { color:var(--cyan); background:rgba(0,245,255,.08); border-bottom-color:var(--cyan); text-shadow:0 0 12px rgba(0,245,255,0.4);}
.ctab-crit::after, .ctab-warn::after { content:''; position:absolute; top:12px; right:12px; width:8px; height:8px; border-radius:50%; animation:livePulse 1.5s infinite; }
.ctab-crit::after { background:var(--rose); box-shadow:0 0 8px var(--rose); }
.ctab-warn::after { background:var(--amber); box-shadow:0 0 8px var(--amber); }

/* POLICY PANEL */
.country-panel { background:rgba(10,16,29,0.8); backdrop-filter:blur(16px); border:1px solid var(--b); border-radius:0 0 16px 16px; border-top:none; box-shadow: 0 12px 40px rgba(0,0,0,0.4);}
.country-panel.active { display:block; }
.cp-header { padding:24px 32px; border-bottom:1px solid var(--b); display:flex; align-items:center; gap:24px; position:relative; overflow:hidden; }
.cp-hbg { position:absolute; inset:0; opacity:.06; }
.cp-flag { font-size:2rem; flex-shrink:0; position:relative; z-index:1; }
.cp-info { flex:1; position:relative; z-index:1; }
.cp-name { font-family:var(--ffh); font-size:1.6rem; letter-spacing:.05em; color:#fff; text-shadow:0 2px 10px rgba(0,0,0,0.5);}
.cp-sub { font-family:var(--ffm); font-size:.65rem; color:var(--t2); margin-top:4px; letter-spacing:0.05em;}
.cp-stats { display:flex; gap:24px; align-items:center; position:relative; z-index:1; flex-shrink:0; }
.cp-stat { text-align:center; }
.cp-stat-val { font-family:var(--ffh); font-size:1.8rem; letter-spacing:.04em; line-height:1; text-shadow:0 2px 10px rgba(0,0,0,0.5);}
.cp-stat-lbl { font-family:var(--ffm); font-size:.6rem; color:var(--t2); letter-spacing:.1em; font-weight:600; margin-top:4px;}

.policy-item { padding:20px 32px; border-bottom:1px solid var(--b); display:flex; gap:20px; align-items:flex-start; transition:background .2s; cursor:pointer; }
.policy-item:last-child { border-bottom:none; }
.policy-item:hover { background:rgba(0,245,255,.04); }
.pi-icon { font-size:1.5rem; flex-shrink:0; margin-top:2px; }
.pi-main { flex:1; min-width:0; }
.pi-top { display:flex; align-items:center; gap:12px; margin-bottom:8px; flex-wrap:wrap; }
.pi-title { font-size:1.05rem; font-weight:700; color:#fff; flex:1; min-width:0; }
.pi-date { font-family:var(--ffm); font-size:.65rem; color:var(--t2); flex-shrink:0; font-weight:600;}
.pi-desc { font-family:var(--ffb); font-size:.9rem; color:#BDD0EE; line-height:1.6; margin-top:4px; }
.pi-expand { display:none; margin-top:16px; padding:20px; background:rgba(0,0,0,0.3); border-radius:12px; border:1px solid rgba(255,255,255,.1); box-shadow: inset 0 0 20px rgba(0,0,0,0.5);}
.pi-expand.show { display:block; animation:fadeUp .3s ease; }
.pi-impact-title { font-family:var(--ffm); font-size:.65rem; color:var(--cyan); letter-spacing:.15em; text-transform:uppercase; margin-bottom:12px; font-weight:700;}
.pi-row { display:flex; align-items:flex-start; gap:10px; padding:8px 0; border-bottom:1px solid rgba(255,255,255,.05); font-family:var(--ffb); font-size:.9rem; color:#E2E8F4; line-height:1.5; }
.pi-row:last-child { border-bottom:none; }
.pi-deadline { display:flex; align-items:center; gap:10px; margin-top:16px; padding:12px 16px; background:rgba(251,77,109,.15); border:1px solid var(--rose); border-radius:10px; font-family:var(--ffb); font-size:.9rem; color:#fff; font-weight:700;}
.pi-actions { display:flex; gap:12px; margin-top:16px; flex-wrap:wrap; }

/* IMPACT ENGINE */
.impact-hero { background:linear-gradient(135deg, rgba(0,245,255,.1), rgba(168,85,247,.08)); border:1px solid rgba(0,245,255,.3); border-radius:20px; padding:32px; margin-bottom:24px; position:relative; overflow:hidden; box-shadow:0 16px 40px rgba(0,0,0,0.4); backdrop-filter:blur(20px);}
.impact-hero::before { content:''; position:absolute; left:0; top:0; bottom:0; width:4px; background:linear-gradient(180deg, var(--cyan), var(--teal), var(--purple)); }
.impact-hero-title { font-family:var(--ffh); font-size:2rem; letter-spacing:.05em; color:#fff; margin-bottom:8px; text-shadow:0 4px 12px rgba(0,0,0,0.5);}
.impact-hero-sub { font-family:var(--ffb); font-size:.95rem; color:#BDD0EE; line-height:1.6; margin-bottom:24px; max-width:700px;}
.impact-scores-row { display:flex; gap:32px; align-items:center; flex-wrap:wrap; background:rgba(0,0,0,0.3); padding:20px; border-radius:16px; border:1px solid rgba(255,255,255,0.1);}
.impact-score-item { display:flex; flex-direction:column; align-items:center; gap:4px; min-width:70px; }
.isv { font-family:var(--ffh); font-size:3rem; letter-spacing:.04em; line-height:1; text-shadow:0 4px 16px rgba(0,0,0,0.6);}
.isl { font-family:var(--ffm); font-size:.65rem; color:var(--t2); letter-spacing:.1em; font-weight:700;}
.readiness-wrap { flex:1; min-width:250px; }
.readiness-lbl { font-family:var(--ffm); font-size:.7rem; color:#fff; margin-bottom:10px; font-weight:700; letter-spacing:0.05em;}
.readiness-track { height:10px; background:rgba(255,255,255,.1); border-radius:5px; overflow:hidden; box-shadow:inset 0 2px 6px rgba(0,0,0,0.5);}
.readiness-fill { height:100%; border-radius:5px; transition:width 1s cubic-bezier(0.2,0.8,0.2,1); box-shadow:0 0 15px rgba(255,77,109,0.8);}
.impact-card { background:rgba(10,16,29,0.8); backdrop-filter:blur(16px); border:1px solid rgba(255,255,255,.15); border-radius:16px; padding:24px; margin-bottom:16px; position:relative; overflow:hidden; cursor:pointer; transition:all .2s; box-shadow:0 8px 24px rgba(0,0,0,0.3);}
.impact-card::before { content:''; position:absolute; left:0; top:0; bottom:0; width:4px; border-radius:0; }
.impact-card:hover { transform:translateY(-3px); box-shadow:0 16px 40px rgba(0,0,0,.5); border-color:rgba(255,255,255,0.3);}
.ic-crit::before { background:var(--rose); box-shadow:0 0 20px var(--rose);}
.ic-warn::before { background:var(--amber); box-shadow:0 0 20px var(--amber);}
.ic-info::before { background:var(--sky); }
.ic-ok::before { background:var(--teal); }
.ic-head { display:flex; align-items:center; justify-content:space-between; gap:16px; margin-bottom:12px; }
.ic-meta { display:flex; align-items:center; gap:12px; }
.ic-title { font-size:1.15rem; font-weight:800; color:#fff; flex:1; line-height:1.4; letter-spacing:0.02em;}
.ic-affects { font-family:var(--ffb); font-size:.9rem; color:#BDD0EE; line-height:1.6; margin-bottom:16px; }
.ic-affects b { color:#fff; font-weight:800;}
.ic-assessment { background:rgba(0,0,0,0.4); border:1px solid rgba(255,255,255,.1); border-radius:12px; padding:16px 20px; box-shadow:inset 0 4px 12px rgba(0,0,0,0.3);}
.ic-ass-title { font-family:var(--ffm); font-size:.6rem; color:var(--cyan); letter-spacing:.15em; text-transform:uppercase; margin-bottom:12px; font-weight:700;}
.ic-ass-row { display:flex; align-items:flex-start; gap:12px; font-family:var(--ffb); font-size:.9rem; color:#E2E8F4; line-height:1.6; padding:8px 0; border-bottom:1px solid rgba(255,255,255,.05); }
.ic-ass-row:last-child { border-bottom:none; }
.ic-ass-row b { color:var(--cyan); font-weight:800;}
.ic-deadline { display:flex; align-items:center; gap:10px; margin-top:16px; padding:12px 16px; background:rgba(251,77,109,.15); border:1px solid var(--rose); border-radius:10px; font-family:var(--ffb); font-size:.9rem; color:#fff; }
.ic-deadline b { font-weight:800;}
.ic-action-row { display:flex; gap:12px; margin-top:16px; flex-wrap:wrap; }
.ic-ok-tag { background:rgba(0,229,168,.1); border:1px solid var(--teal); border-radius:10px; padding:12px 16px; font-family:var(--ffb); font-size:.9rem; color:#fff; margin-top:12px; font-weight:700;}

/* TIMELINE */
.tl-filters { display:flex; gap:12px; margin-bottom:24px; flex-wrap:wrap; }
.tf-btn { padding:10px 20px; border-radius:10px; font-family:var(--ffb); font-size:.85rem; font-weight:700; cursor:pointer; transition:all .2s; border:1px solid rgba(255,255,255,0.3); background:rgba(0,0,0,0.3); color:var(--t2); letter-spacing:.05em; text-transform:uppercase;}
.tf-btn:hover { border-color:rgba(255,255,255,0.4); color:#fff; }
.tf-btn.active { border-color:var(--cyan); background:rgba(0,245,255,.1); color:var(--cyan); box-shadow:0 0 15px rgba(0,245,255,0.2); }

.cpill-row { display:flex; gap:10px; flex-wrap:wrap; margin-bottom:20px; }
.cpill { padding:8px 16px; border-radius:100px; border:1px solid rgba(255,255,255,0.3); background:rgba(0,0,0,0.3); color:var(--t2); font-family:var(--ffb); font-size:.85rem; font-weight:700; cursor:pointer; transition:all .18s; display:flex; align-items:center; gap:8px; }
.cpill:hover { border-color:rgba(255,255,255,0.4); color:#fff; }
.cpill.active { background:rgba(0,245,255,.15); border-color:var(--cyan); color:#fff; box-shadow:0 0 15px rgba(0,245,255,0.2); }

.timeline { position:relative; padding-left:48px; margin-top:32px;}
.timeline::before { content:''; position:absolute; left:21px; top:0; bottom:0; width:2px; background:linear-gradient(180deg, var(--cyan), var(--purple), var(--teal)); opacity:.4; }
.tl-group { margin-bottom:32px; }
.tl-year { font-family:var(--ffh); font-size:1.5rem; letter-spacing:.08em; color:#fff; margin-bottom:16px; display:flex; align-items:center; gap:12px; }
.tl-year::after { content:''; flex:1; height:1px; background:rgba(255,255,255,.15); }
.tl-item { position:relative; margin-bottom:16px; padding:20px 24px; background:rgba(10,16,29,0.8); backdrop-filter:blur(16px); border:1px solid var(--b); border-radius:16px; transition:all .2s; cursor:pointer; box-shadow:0 4px 15px rgba(0,0,0,0.2);}
.tl-item:hover { border-color:rgba(255,255,255,0.3); transform:translateX(4px); background:rgba(255,255,255,0.03); }
.tl-dot { position:absolute; left:-33px; top:24px; width:14px; height:14px; border-radius:50%; border:2px solid; background:var(--bg); z-index:2; }
.tl-head { display:flex; align-items:center; gap:12px; margin-bottom:8px; flex-wrap:wrap; }
.tl-title { font-size:1.05rem; font-weight:800; color:#fff; flex:1; }
.tl-date { font-family:var(--ffm); font-size:.7rem; color:var(--t2); flex-shrink:0; font-weight:700; }
.tl-desc { font-family:var(--ffb); font-size:.9rem; color:#BDD0EE; line-height:1.6; }
.tl-impact { font-family:var(--ffb); font-size:.85rem; font-weight:600; margin-top:12px; padding:10px 16px; border-radius:10px; display:flex; align-items:flex-start; gap:10px; line-height:1.5;}

/* MYTHS */
.myth-grid { display:grid; grid-template-columns:1fr 1fr; gap:20px; }
.myth-card { background:rgba(10,16,29,0.8); backdrop-filter:blur(16px); border:1px solid var(--b); border-radius:16px; overflow:hidden; transition:all .2s; box-shadow:0 8px 24px rgba(0,0,0,0.3);}
.myth-card:hover { border-color:rgba(255,255,255,0.3); }
.myth-card.open { border-color:var(--cyan); box-shadow:0 0 20px rgba(0,245,255,0.15); }
.mc-head { padding:20px 24px; display:flex; align-items:center; gap:16px; cursor:pointer; }
.mc-ico { font-size:1.8rem; flex-shrink:0; }
.mc-info { flex:1; }
.mc-title { font-size:1.05rem; font-weight:800; color:#fff; margin-bottom:6px; line-height:1.3;}
.mc-meta { font-family:var(--ffm); font-size:.65rem; color:var(--t2); display:flex; align-items:center; gap:10px; flex-wrap:wrap; font-weight:600;}
.mc-arrow { font-size:.8rem; color:var(--t2); transition:transform .3s; flex-shrink:0; }
.myth-card.open .mc-arrow { transform:rotate(180deg); color:var(--cyan);}
.mc-body { display:none; padding:0 24px 24px; }
.myth-card.open .mc-body { display:block; animation:fadeUp .3s ease; }
.mc-claim { background:rgba(251,77,109,.1); border:1px solid var(--rose); border-radius:12px; padding:16px 20px; margin-bottom:16px; }
.mc-claim-lbl { font-family:var(--ffm); font-size:.6rem; color:var(--rose); letter-spacing:.15em; text-transform:uppercase; margin-bottom:8px; font-weight:700;}
.mc-claim-text { font-size:.95rem; color:#fff; font-style:italic; line-height:1.6; font-weight:600;}
.mc-reality { background:rgba(0,229,168,.1); border:1px solid var(--teal); border-radius:12px; padding:16px 20px; margin-bottom:16px; }
.mc-real-lbl { font-family:var(--ffm); font-size:.6rem; color:var(--teal); letter-spacing:.15em; text-transform:uppercase; margin-bottom:8px; font-weight:700;}
.mc-real-text { font-size:.9rem; color:#fff; line-height:1.6; }
.mc-real-text b { color:var(--teal); font-weight:800;}
.mc-evidence { font-family:var(--ffm); font-size:.7rem; color:#BDD0EE; line-height:1.6; padding:12px 16px; background:rgba(0,0,0,0.4); border:1px solid rgba(255,255,255,0.1); border-radius:10px; }
.mc-evidence b { color:#fff; }
.mc-danger { font-family:var(--ffb); font-size:.85rem; color:#000; font-weight:700; padding:12px 16px; background:var(--amber); border-radius:10px; margin-top:16px; display:flex; gap:10px; align-items:flex-start; box-shadow:0 4px 15px rgba(245,158,11,0.4);}

/* ALERTS */
.alert-compose { background:linear-gradient(135deg, rgba(168,85,247,.1), rgba(0,245,255,.05)); border:1px solid rgba(168,85,247,.3); border-radius:20px; padding:32px; margin-bottom:24px; box-shadow:0 12px 30px rgba(0,0,0,0.3); backdrop-filter:blur(16px);}
.alert-compose-title { font-family:var(--ffh); font-size:1.8rem; letter-spacing:.05em; color:#fff; margin-bottom:8px; text-shadow:0 2px 10px rgba(0,0,0,0.5);}
.alert-compose-sub { font-family:var(--ffb); font-size:.9rem; color:#BDD0EE; margin-bottom:24px; line-height:1.6; }
.alert-form { display:grid; grid-template-columns:1fr 1fr; gap:16px; }
.af-group { display:flex; flex-direction:column; gap:8px; }
.af-group.full { grid-column:1/-1; }
.af-label { font-family:var(--ffm); font-size:.65rem; color:#fff; letter-spacing:.1em; text-transform:uppercase; font-weight:700;}
.af-input,.af-sel,.af-ta{background:rgba(0,0,0,0.4);border:1px solid rgba(255,255,255,0.3);border-radius:10px;padding:12px 16px;color:#fff;font-family:var(--ffb);font-size:.9rem;outline:none;transition:border-color .2s;width:100%}
.af-input:focus,.af-sel:focus,.af-ta:focus{border-color:var(--cyan);box-shadow:0 0 10px rgba(0,245,255,.2)}
.af-input::placeholder,.af-ta::placeholder{color:var(--t3)}
.af-sel option{background:var(--bg2)}
.af-ta{resize:none;min-height:100px;}
.alert-feed { display:flex; flex-direction:column; gap:12px; }
.alert-item { background:rgba(10,16,29,0.8); backdrop-filter:blur(16px); border:1px solid var(--b); border-radius:16px; padding:20px; display:flex; gap:16px; align-items:flex-start; transition:all .2s; box-shadow:0 4px 15px rgba(0,0,0,0.2);}
.alert-item:hover { border-color:rgba(255,255,255,0.3); transform:translateY(-2px); }
.ai-av { width:48px; height:48px; border-radius:50%; overflow:hidden; flex-shrink:0; border:2px solid rgba(255,255,255,0.2); }
.ai-av img { width:100%; height:100%; object-fit:cover; }
.ai-info { flex:1; }
.ai-head { display:flex; align-items:center; gap:12px; margin-bottom:8px; flex-wrap:wrap; }
.ai-name { font-size:1.05rem; font-weight:800; color:#fff; }
.ai-country { font-family:var(--ffm); font-size:.65rem; color:var(--t2); font-weight:600;}
.ai-time { font-family:var(--ffm); font-size:.6rem; color:var(--t3); margin-left:auto; font-weight:700;}
.ai-text { font-family:var(--ffb); font-size:.9rem; color:#BDD0EE; line-height:1.6; }
.ai-text b { color:#fff; font-weight:800; }

/* MODALS */
.modal-overlay { position:fixed; inset:0; z-index:500; background:rgba(3,5,8,.9); backdrop-filter:blur(24px); display:flex; align-items:center; justify-content:center; padding:20px; opacity:0; pointer-events:none; transition:opacity .3s; }
.modal-overlay.open { opacity:1; pointer-events:all; }
.modal { background:var(--bg2); border:1px solid rgba(0,245,255,.3); border-radius:24px; width:100%; max-width:600px; overflow:hidden; transform:translateY(20px); transition:transform .3s cubic-bezier(0.2,0.8,0.2,1); box-shadow:0 24px 80px rgba(0,0,0,0.6), inset 0 0 40px rgba(0,245,255,0.05);}
.modal-overlay.open .modal { transform:translateY(0); }
.modal-head { padding:24px 32px; border-bottom:1px solid var(--b); display:flex; align-items:center; justify-content:space-between; background:rgba(255,255,255,0.02);}
.modal-title { font-family:var(--ffh); font-size:1.5rem; letter-spacing:.05em; color:#fff; }
.modal-close { background:rgba(255,255,255,.05); border:1px solid rgba(255,255,255,0.2); border-radius:10px; width:36px; height:36px; display:flex; align-items:center; justify-content:center; cursor:pointer; font-size:14px; color:#fff; transition:all .2s; }
.modal-close:hover { background:var(--rose); border-color:var(--rose); color:#000; }
.modal-body { padding:32px; }
.modal-foot { padding:20px 32px; border-top:1px solid var(--b); display:flex; gap:12px; justify-content:flex-end; background:rgba(0,0,0,0.2);}
.pm-grid { display:grid; grid-template-columns:1fr 1fr; gap:20px; }

/* LOGS */
.log-body { padding:20px 24px; font-family:var(--ffm); font-size:.7rem; max-height:300px; overflow-y:auto; }
.log-row { display:flex; gap:12px; margin-bottom:12px; align-items:flex-start; line-height:1.6; }
.log-t { color:var(--t3); flex-shrink:0; min-width:50px; font-size:.65rem; padding-top:2px; font-weight:700;}
.log-icon { flex-shrink:0; font-size:.85rem; }
.log-text { color:var(--t2); flex:1; }
.log-text b { color:var(--cyan); font-weight:700;}
.log-cur { display:inline-block; width:8px; height:12px; background:var(--cyan); vertical-align:middle; margin-left:4px; animation:blinkC .85s step-end infinite; box-shadow:0 0 8px var(--cyan);}
@keyframes blinkC { 0%,100%{opacity:1} 50%{opacity:0} }

/* TOASTS */
.toast-zone { position:fixed; bottom:32px; right:32px; z-index:600; display:flex; flex-direction:column; gap:12px; pointer-events:none; }
.toast { background:rgba(10,16,29,0.95); backdrop-filter:blur(24px); border:1px solid rgba(0,245,255,.3); border-radius:14px; padding:16px 20px; width:340px; pointer-events:all; display:flex; gap:12px; align-items:center; font-family:var(--ffb); font-size:.85rem; font-weight:600; color:#fff; box-shadow:0 16px 40px rgba(0,0,0,.6), inset 0 0 20px rgba(0,245,255,0.05); animation:toastIn .3s cubic-bezier(0.2,0.8,0.2,1) both; }
@keyframes toastIn { from{opacity:0; transform:translateX(100%) scale(0.9)} to{opacity:1; transform:none} }
.toast.out { animation:toastOut .25s ease forwards; }
@keyframes toastOut { to{opacity:0; transform:translateX(100%) scale(0.9)} }

.empty-state { text-align:center; padding:48px; display:flex; flex-direction:column; align-items:center; gap:16px; }
.empty-ico { font-size:3rem; opacity:.2; }
.empty-text { font-family:var(--ffb); font-size:1rem; font-weight:600; color:var(--t3); }

/* Responsive adjustments */
@media(max-width:900px) {
  .layout { flex-direction: column; overflow: visible; height: auto; }
  .sidebar { width: 100%; border-right: none; border-bottom: 1px solid var(--b); flex-direction: row; overflow-x: auto; padding: 10px; height: auto; position: relative; top: 0;}
  .sb-sect { display: none; }
  .profile-mini { display: none; }
  .stats-grid { grid-template-columns: 1fr 1fr; }
  .impact-scores-row { justify-content: center; }
  .readiness-wrap { width: 100%; }
}
`;

export default function PolicyIntelligence() {
  const [mounted, setMounted] = useState(false);
  const [activeSec, setActiveSec] = useState('radar');
  const [radarCtry, setRadarCtry] = useState('de');
  const [expPolicies, setExpPolicies] = useState([]);
  const [openImpacts, setOpenImpacts] = useState([]);
  const [tlCtry, setTlCtry] = useState('all');
  const [tlSev, setTlSev] = useState('all');
  const [openMyths, setOpenMyths] = useState([]);
  const [modal, setModal] = useState(null); // 'flag', 'profile', null
  const [toasts, setToasts] = useState([]);
  const [timeStr, setTimeStr] = useState('--:--:--');
  const [syslogs, setSyslogs] = useState(INITIAL_LOGS);

  const [profile, setProfile] = useState({
    country: 'Germany',
    intake: 'Winter 2026',
    aps: 'Not booked',
    blocked: 'Not opened'
  });
  const [tempProfile, setTempProfile] = useState({ ...profile });

  useEffect(() => {
    setMounted(true);
    
    // Clock
    const timer = setInterval(() => {
      const n = new Date();
      setTimeStr(
        String(n.getHours()).padStart(2, '0') + ':' +
        String(n.getMinutes()).padStart(2, '0') + ':' +
        String(n.getSeconds()).padStart(2, '0')
      );
    }, 1000);

    // Live Pulse
    let pi = 0;
    const pulser = setInterval(() => {
      const item = pulseItems[pi % pulseItems.length];
      pi++;
      const n = new Date();
      const t = String(n.getHours()).padStart(2, '0') + ':' + String(n.getMinutes()).padStart(2, '0');
      
      setSyslogs(prev => {
        const newLog = { t, ico: item.ico, html: `${item.msg}<span class="log-cur"></span>` };
        const updated = [newLog, ...prev.map(l => ({...l, html: l.html.replace('<span class="log-cur"></span>', '')}))];
        if (updated.length > 15) updated.pop();
        return updated;
      });
    }, 42000);

    return () => {
      clearInterval(timer);
      clearInterval(pulser);
    };
  }, []);

  const addToast = (ico, msg) => {
    const id = Date.now() + Math.random();
    setToasts(p => [...p, { id, ico, msg, out: false }]);
    setTimeout(() => {
      setToasts(p => p.map(t => t.id === id ? { ...t, out: true } : t));
      setTimeout(() => {
        setToasts(p => p.filter(t => t.id !== id));
      }, 280);
    }, 4000);
  };

  const handleFlagSubmit = () => {
    setModal(null);
    addToast('🚩', 'Policy flag submitted — under review by Intelligence Team');
  };

  const handleProfileSave = () => {
    setProfile(tempProfile);
    setModal(null);
    addToast('⚡', 'Profile updated — impact assessment recalculated');
  };

  const togglePolicy = (id) => {
    setExpPolicies(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);
  };

  const toggleImpact = (idx) => {
    setOpenImpacts(p => p.includes(idx) ? p.filter(x => x !== idx) : [...p, idx]);
  };

  const toggleMyth = (idx) => {
    setOpenMyths(p => p.includes(idx) ? p.filter(x => x !== idx) : [...p, idx]);
  };

  const scrollToDashboard = () => {
    document.getElementById('dashboard-start').scrollIntoView({ behavior: 'smooth' });
  };

  if (!mounted) return null;

  const m = META[radarCtry];
  const ps = POLICIES[radarCtry] || [];
  const okN = ps.filter(p => p.s === 'ok').length;
  const pct = Math.round((okN / Math.max(ps.length, 1)) * 100);
  const circ = 2 * Math.PI * 26;
  const dash = (pct / 100) * circ;

  const tlFiltered = TL_DATA.filter(t => (tlCtry === 'all' || t.iso === tlCtry) && (tlSev === 'all' || t.s === tlSev));
  const tlGrp = {};
  tlFiltered.forEach(t => {
    const y = t.date.split(' ').pop();
    if (!tlGrp[y]) tlGrp[y] = [];
    tlGrp[y].push(t);
  });
  const sortedYears = Object.keys(tlGrp).sort((a, b) => b - a);

  return (
    <div className="pi-root">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <div className="amb"></div>
      <div className="hex"></div>
      <div className="scan"></div>
      
      <div className="toast-zone" id="toastZone">
        {toasts.map(t => (
          <div key={t.id} className={`toast ${t.out ? 'out' : ''}`}>
            <span style={{ fontSize: '1.2rem', flexShrink: 0 }}>{t.ico}</span>
            <span>{t.msg}</span>
          </div>
        ))}
      </div>

      {/* FLAG MODAL */}
      <div className={`modal-overlay ${modal === 'flag' ? 'open' : ''}`} onClick={() => setModal(null)}>
        <div className="modal" onClick={e => e.stopPropagation()}>
          <div className="modal-head">
            <div className="modal-title">🚩 FLAG A POLICY UPDATE</div>
            <div className="modal-close" onClick={() => setModal(null)}>✕</div>
          </div>
          <div className="modal-body">
            <div className="pm-grid">
              <div className="af-group">
                <label className="af-label">Country</label>
                <select className="af-sel"><option>Germany</option><option>USA</option><option>UK</option><option>Canada</option><option>Australia</option><option>Ireland</option></select>
              </div>
              <div className="af-group">
                <label className="af-label">Severity</label>
                <select className="af-sel"><option>Info</option><option>Warning</option><option>Critical</option></select>
              </div>
              <div className="af-group full"><label className="af-label">Policy Area</label><input className="af-input" placeholder="e.g. Blocked Account, PGWP, Graduate Route..."/></div>
              <div className="af-group full"><label className="af-label">What Changed</label><textarea className="af-ta" placeholder="Describe the change and how it affects students..."></textarea></div>
              <div className="af-group full"><label className="af-label">Source</label><input className="af-input" placeholder="Official source URL or reference..."/></div>
            </div>
          </div>
          <div className="modal-foot">
            <button className="btn btn-ghost" onClick={() => setModal(null)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleFlagSubmit}>Submit Flag →</button>
          </div>
        </div>
      </div>

      {/* PROFILE MODAL */}
      <div className={`modal-overlay ${modal === 'profile' ? 'open' : ''}`} onClick={() => setModal(null)}>
        <div className="modal" onClick={e => e.stopPropagation()}>
          <div className="modal-head">
            <div className="modal-title">⚙ UPDATE YOUR PROFILE</div>
            <div className="modal-close" onClick={() => setModal(null)}>✕</div>
          </div>
          <div className="modal-body">
            <div className="pm-grid">
              <div className="af-group">
                <label className="af-label">Target Country</label>
                <select className="af-sel" value={tempProfile.country} onChange={e => setTempProfile({...tempProfile, country: e.target.value})}>
                  <option>Germany</option><option>USA</option><option>UK</option><option>Canada</option><option>Australia</option><option>Ireland</option>
                </select>
              </div>
              <div className="af-group">
                <label className="af-label">Target Intake</label>
                <select className="af-sel" value={tempProfile.intake} onChange={e => setTempProfile({...tempProfile, intake: e.target.value})}>
                  <option>Winter 2025</option><option>Winter 2026</option><option>Summer 2026</option><option>Fall 2026</option>
                </select>
              </div>
              <div className="af-group">
                <label className="af-label">APS Status</label>
                <select className="af-sel" value={tempProfile.aps} onChange={e => setTempProfile({...tempProfile, aps: e.target.value})}>
                  <option>Not booked</option><option>Booked</option><option>Completed</option><option>Not required</option>
                </select>
              </div>
              <div className="af-group">
                <label className="af-label">Blocked Account</label>
                <select className="af-sel" value={tempProfile.blocked} onChange={e => setTempProfile({...tempProfile, blocked: e.target.value})}>
                  <option>Not opened</option><option>Opened (old amount)</option><option>Opened (€11,208)</option><option>Not applicable</option>
                </select>
              </div>
              <div className="af-group">
                <label className="af-label">IELTS Status</label>
                <select className="af-sel">
                  <option>Not taken</option><option>Score 6.0-6.5</option><option>Score 7.0-7.5</option><option>Score 8.0+</option>
                </select>
              </div>
              <div className="af-group">
                <label className="af-label">University Applications</label>
                <select className="af-sel">
                  <option>Not started</option><option>In progress</option><option>Submitted</option><option>Offer received</option>
                </select>
              </div>
            </div>
          </div>
          <div className="modal-foot">
            <button className="btn btn-ghost" onClick={() => setModal(null)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleProfileSave}>Save & Recalculate →</button>
          </div>
        </div>
      </div>

      {/* TOPBAR */}
      <div className="topbar">
        <Link href="/dashboard/student" className="logo">
          <div className="logo-gem">🌉</div>Mentor<em>Bridge</em>
        </Link>
        <div className="tb-div"></div>
        <div>
          <div className="tb-title">POLICY INTELLIGENCE ENGINE</div>
          <div className="tb-sub">REAL-TIME IMPACT ASSESSMENT · 6 COUNTRIES</div>
        </div>
        <div className="tb-sp"></div>
        <div className="tb-live"><div className="live-dot"></div>LIVE MONITORING</div>
        <div className="tb-time">{timeStr}</div>
        <div className="tb-btn" onClick={() => setModal('flag')} title="Flag policy update">🚩</div>
        <div className="tb-btn" onClick={() => addToast('📢', 'All mentors in affected countries have been notified')} title="Alert mentors">📢</div>
      </div>

      {/* ── AAA HERO SECTION ── */}
      <div className="pi-hero">
        <div className="ph-col1">
          <div className="ph-pill">
            <div className="ph-dot"></div>
            <div>
              SYSTEM ACTIVE · REAL-TIME TRACKING<br/>
              6 COUNTRIES · 34+ POLICIES<br/>
              LIVE DATA STREAM
            </div>
          </div>
        </div>
        <div className="ph-col2">
          <h1 className="ph-title">
            IMMIGRATION<br/>
            & POLICY<br/>
            <span className="ph-cyan">INTELLIGENCE</span><br/>
            <span className="ph-rose">RADAR</span>
          </h1>
        </div>
        <div className="ph-col3">
          <p className="ph-desc">
            Stop relying on outdated consultant advice. Track live visa changes, post-study work rights, and admission policies across 6 top destinations. Know exactly how global shifts impact your application before they happen.
          </p>
          <button className="btn btn-primary" onClick={scrollToDashboard}>INITIALIZE DASHBOARD ↓</button>
        </div>
      </div>

      <div className="hero-divider" id="dashboard-start"></div>

      {/* LAYOUT */}
      <div className="layout">
        <aside className="sidebar">
          <div className="sb-sect">Intelligence</div>
          <div className={`sb-item ${activeSec === 'radar' ? 'active' : ''}`} onClick={() => setActiveSec('radar')}>
            <span className="sb-ico">📡</span>Policy Radar<span className="sb-badge br">2</span>
          </div>
          <div className={`sb-item ${activeSec === 'impact' ? 'active' : ''}`} onClick={() => setActiveSec('impact')}>
            <span className="sb-ico">⚡</span>Impact Engine<span className="sb-badge br">3</span>
          </div>
          <div className={`sb-item ${activeSec === 'timeline' ? 'active' : ''}`} onClick={() => setActiveSec('timeline')}>
            <span className="sb-ico">📊</span>Policy Timeline
          </div>
          
          <div className="sb-sect">Analysis</div>
          <div className={`sb-item ${activeSec === 'myths' ? 'active' : ''}`} onClick={() => setActiveSec('myths')}>
            <span className="sb-ico">💡</span>Myth Buster<span className="sb-badge ba">6</span>
          </div>
          <div className={`sb-item ${activeSec === 'alerts' ? 'active' : ''}`} onClick={() => setActiveSec('alerts')}>
            <span className="sb-ico">🔔</span>Mentor Alerts<span className="sb-badge bc">4</span>
          </div>
          <div className={`sb-item ${activeSec === 'log' ? 'active' : ''}`} onClick={() => setActiveSec('log')}>
            <span className="sb-ico">■</span>System Log
          </div>
          
          <div className="sb-sect" style={{marginTop: 'auto'}}>Your Profile</div>
          <div className="profile-mini">
            <div className="pm-title">Active Profile</div>
            <div className="pm-row"><span className="pm-label">Country</span><span className="pm-val">{profile.country}</span></div>
            <div className="pm-row"><span className="pm-label">Intake</span><span className="pm-val">{profile.intake}</span></div>
            <div className="pm-row"><span className="pm-label">APS</span><span className="pm-val">{profile.aps}</span></div>
            <div className="pm-row"><span className="pm-label">Blocked Acc.</span><span className="pm-val">{profile.blocked}</span></div>
            <div className="pm-edit" onClick={() => { setTempProfile(profile); setModal('profile'); }}>⚙ Edit Profile</div>
          </div>
        </aside>

        <main className="main">
          <div className="sec-head">
            <div>
              <div className="sec-eyebrow">{SEC_META[activeSec]?.eyebrow}</div>
              <div className="sec-title">{SEC_META[activeSec]?.title}</div>
              <div className="sec-sub">{SEC_META[activeSec]?.sub}</div>
            </div>
            <div style={{ display: 'flex', gap: '12px', flexShrink: 0, alignItems: 'center' }}>
              <button className="btn btn-amber" onClick={() => setModal('flag')}>🚩 Flag Update</button>
              <button className="btn btn-primary" onClick={() => setActiveSec('impact')}>⚡ My Impact →</button>
            </div>
          </div>
          <div className="content">

            {/* RADAR */}
            <div className={`section ${activeSec === 'radar' ? 'active' : ''}`}>
              <div className="stats-grid">
                <div className="stat-card"><div className="stat-val" style={{ color: 'var(--rose)' }}>2</div><div className="stat-lbl">Critical Alerts</div></div>
                <div className="stat-card"><div className="stat-val" style={{ color: 'var(--amber)' }}>4</div><div className="stat-lbl">Active Warnings</div></div>
                <div className="stat-card"><div className="stat-val" style={{ color: 'var(--cyan)' }}>6</div><div className="stat-lbl">Countries Tracked</div></div>
                <div className="stat-card"><div className="stat-val" style={{ color: 'var(--teal)' }}>34</div><div className="stat-lbl">Policies Monitored</div></div>
              </div>
              <div className="country-tabs">
                {Object.keys(META).map(code => (
                  <div 
                    key={code} 
                    className={`ctab ${radarCtry === code ? 'active' : ''} ${META[code].crit > 0 ? 'ctab-crit' : META[code].warn > 0 ? 'ctab-warn' : ''}`} 
                    onClick={() => setRadarCtry(code)}
                  >
                    <FlagImg code={META[code].iso} size={20} /> {META[code].name}
                  </div>
                ))}
              </div>
              
              <div className="country-panel active">
                <div className="cp-header">
                  <div className="cp-hbg" style={{ background: m.col }}></div>
                  <div className="cp-flag"><FlagImg code={m.iso} size={40} /></div>
                  <div className="cp-info">
                    <div className="cp-name">{m.name} — Policy Status</div>
                    <div className="cp-sub">Tracking {ps.length} policies · Last verified: Today</div>
                  </div>
                  <div className="cp-stats">
                    <div className="cp-stat"><div className="cp-stat-val" style={{ color: 'var(--rose)' }}>{m.crit}</div><div className="cp-stat-lbl">Critical</div></div>
                    <div className="cp-stat"><div className="cp-stat-val" style={{ color: 'var(--amber)' }}>{m.warn}</div><div className="cp-stat-lbl">Warnings</div></div>
                    <div className="cp-stat"><div className="cp-stat-val" style={{ color: 'var(--teal)' }}>{okN}</div><div className="cp-stat-lbl">Stable</div></div>
                    <div style={{ width: '60px', height: '60px', flexShrink: 0 }}>
                      <svg viewBox="0 0 60 60" style={{ width: '100%', height: '100%' }}>
                        <circle cx="30" cy="30" r="26" fill="none" stroke="rgba(255,255,255,.07)" strokeWidth="4"/>
                        <circle cx="30" cy="30" r="26" fill="none" stroke={m.col} strokeWidth="4" strokeLinecap="round" strokeDasharray={`${dash.toFixed(1)} ${circ.toFixed(1)}`} transform="rotate(-90 30 30)"/>
                        <text x="30" y="35" textAnchor="middle" fontFamily="'Bebas Neue',sans-serif" fontSize="14" fill={m.col}>{pct}%</text>
                      </svg>
                    </div>
                  </div>
                </div>
                {ps.map((p, i) => {
                  const pId = `${radarCtry}-${i}`;
                  const isExp = expPolicies.includes(pId);
                  return (
                    <div key={i} className="policy-item" onClick={() => togglePolicy(pId)}>
                      <div className="pi-icon">{p.ico}</div>
                      <div className="pi-main">
                        <div className="pi-top">
                          <div className="pi-title">{p.title}</div>
                          <span className={`sev ${SC[p.s]}`}>{SL[p.s]}</span>
                          <div className="pi-date">{p.date}</div>
                        </div>
                        <div className="pi-desc">{p.desc}</div>
                        <div className={`pi-expand ${isExp ? 'show' : ''}`}>
                          <div className="pi-impact-title">IMPACT ASSESSMENT</div>
                          {p.impact.map((imp, idx) => (
                            <div key={idx} className="pi-row"><span>→</span><span>{imp}</span></div>
                          ))}
                          {p.deadline && <div className="pi-deadline"><span>🗓</span><span>Action by: <b>{p.deadline}</b></span></div>}
                          {p.action && (
                            <div className="pi-actions">
                              <button className="btn btn-primary btn-sm" onClick={(e) => { e.stopPropagation(); addToast('✅', `Opening: ${p.action}`); }}>{p.action} →</button>
                              <button className="btn btn-ghost btn-sm" onClick={(e) => { e.stopPropagation(); addToast('📋', 'Added to your action list'); }}>+ My List</button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* IMPACT ENGINE */}
            <div className={`section ${activeSec === 'impact' ? 'active' : ''}`}>
              <div className="impact-hero">
                <div className="impact-hero-title">YOUR PERSONAL IMPACT ASSESSMENT</div>
                <div className="impact-hero-sub">Every policy change evaluated against YOUR profile — <strong>{profile.country} · {profile.intake}</strong>. Only what affects you. Zero noise.</div>
                <div className="impact-scores-row">
                  <div className="impact-score-item"><div className="isv" style={{ color: 'var(--rose)' }}>3</div><div className="isl">CRITICAL</div></div>
                  <div className="impact-score-item"><div className="isv" style={{ color: 'var(--amber)' }}>2</div><div className="isl">WARNINGS</div></div>
                  <div className="impact-score-item"><div className="isv" style={{ color: 'var(--teal)' }}>4</div><div className="isl">CLEARED</div></div>
                  <div className="readiness-wrap">
                    <div className="readiness-lbl">Application Readiness</div>
                    <div className="readiness-track"><div className="readiness-fill" style={{ width: '38%', background: 'linear-gradient(90deg,var(--rose),var(--amber))' }}></div></div>
                    <div style={{ fontFamily: 'var(--ffm)', fontSize: '.7rem', color: '#BDD0EE', marginTop: '8px', fontWeight:'600' }}>38% — Action required on 3 critical items</div>
                  </div>
                </div>
              </div>
              
              {IMPACT_DATA.map((c, i) => (
                <div key={i} className={`impact-card ic-${c.s} ${openImpacts.includes(i) ? 'open' : ''}`} onClick={() => toggleImpact(i)}>
                  <div className="ic-head">
                    <div className="ic-meta">
                      <FlagImg code={c.iso} size={24} />
                      <span style={{ fontFamily: 'var(--ffm)', fontSize: '.75rem', color: 'var(--t2)', fontWeight:'700', textTransform:'uppercase' }}>{c.country}</span>
                    </div>
                    <span className={`sev ${SC[c.s]}`}>{SL[c.s]}</span>
                  </div>
                  <div className="ic-title">{c.title}</div>
                  <div className="ic-affects" dangerouslySetInnerHTML={{ __html: c.affects.replace('Not booked', '<b>Not booked</b>') }} />
                  {c.notAffected ? (
                    <div className="ic-ok-tag">✓ You are not affected by this change. No action required.</div>
                  ) : (
                    <>
                      <div className="ic-assessment">
                        <div className="ic-ass-title">YOUR IMPACT ASSESSMENT</div>
                        {c.rows.map((r, ri) => (
                          <div key={ri} className="ic-ass-row"><span>{r.ico}</span><span dangerouslySetInnerHTML={{ __html: r.text }} /></div>
                        ))}
                      </div>
                      {c.deadline && <div className="ic-deadline"><span>🗓</span><span>Action required by: <b>{c.deadline}</b></span></div>}
                      {c.actions && c.actions.length > 0 && (
                        <div className="ic-action-row">
                          {c.actions.map((a, ai) => (
                            <button key={ai} className={`btn ${a.includes('→') ? 'btn-primary' : 'btn-ghost'} btn-sm`} onClick={(e) => { e.stopPropagation(); addToast('✅', a.replace(/→/g, '').trim()); }}>
                              {a}
                            </button>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>

            {/* TIMELINE */}
            <div className={`section ${activeSec === 'timeline' ? 'active' : ''}`}>
              <div style={{ marginBottom: '24px' }}>
                <div style={{ fontFamily: 'var(--ffm)', fontSize: '.7rem', color: 'var(--t2)', marginBottom: '12px', letterSpacing:'0.1em', fontWeight:'700', textTransform:'uppercase' }}>Filter by Country</div>
                <div className="cpill-row">
                  <button className={`cpill ${tlCtry === 'all' ? 'active' : ''}`} onClick={() => setTlCtry('all')}>All</button>
                  <button className={`cpill ${tlCtry === 'de' ? 'active' : ''}`} onClick={() => setTlCtry('de')}><FlagImg code="de" size={16}/> Germany</button>
                  <button className={`cpill ${tlCtry === 'us' ? 'active' : ''}`} onClick={() => setTlCtry('us')}><FlagImg code="us" size={16}/> USA</button>
                  <button className={`cpill ${tlCtry === 'uk' ? 'active' : ''}`} onClick={() => setTlCtry('uk')}><FlagImg code="uk" size={16}/> UK</button>
                  <button className={`cpill ${tlCtry === 'ca' ? 'active' : ''}`} onClick={() => setTlCtry('ca')}><FlagImg code="ca" size={16}/> Canada</button>
                  <button className={`cpill ${tlCtry === 'au' ? 'active' : ''}`} onClick={() => setTlCtry('au')}><FlagImg code="au" size={16}/> Australia</button>
                  <button className={`cpill ${tlCtry === 'ie' ? 'active' : ''}`} onClick={() => setTlCtry('ie')}><FlagImg code="ie" size={16}/> Ireland</button>
                </div>
                <div className="tl-filters">
                  <button className={`tf-btn ${tlSev === 'all' ? 'active' : ''}`} onClick={() => setTlSev('all')}>All</button>
                  <button className={`tf-btn ${tlSev === 'critical' ? 'active' : ''}`} onClick={() => setTlSev('critical')} style={{ color: 'var(--rose)' }}>🚨 Critical</button>
                  <button className={`tf-btn ${tlSev === 'warning' ? 'active' : ''}`} onClick={() => setTlSev('warning')} style={{ color: 'var(--amber)' }}>⚠ Warning</button>
                  <button className={`tf-btn ${tlSev === 'ok' ? 'active' : ''}`} onClick={() => setTlSev('ok')} style={{ color: 'var(--teal)' }}>✅ Positive</button>
                </div>
              </div>
              <div className="timeline">
                {sortedYears.length > 0 ? sortedYears.map(y => (
                  <div key={y} className="tl-group">
                    <div className="tl-year">{y}</div>
                    {tlGrp[y].map((t, i) => (
                      <div key={i} className="tl-item">
                        <div className="tl-dot" style={{ background: DC[t.s], borderColor: DC[t.s], boxShadow: `0 0 12px ${DC[t.s]}` }}></div>
                        <div className="tl-head">
                          <span className="tl-flag"><FlagImg code={t.iso} size={20}/></span>
                          <span className="tl-title">{t.title}</span>
                          <span className={`sev ${SC[t.s]}`} style={{ fontSize: '.6rem' }}>{SL[t.s]}</span>
                          <span className="tl-date">{t.date}</span>
                        </div>
                        <div className="tl-desc">{t.desc}</div>
                        <div className={`tl-impact ${t.cls}`}><span>⚡</span><span>{t.impact}</span></div>
                      </div>
                    ))}
                  </div>
                )) : (
                  <div className="empty-state"><div className="empty-ico">🔍</div><div className="empty-text">No entries match current filters.</div></div>
                )}
              </div>
            </div>

            {/* MYTHS */}
            <div className={`section ${activeSec === 'myths' ? 'active' : ''}`}>
              <div style={{ marginBottom: '24px', background: 'rgba(245,158,11,.1)', border: '1px solid rgba(245,158,11,.3)', borderRadius: '16px', padding: '20px', fontFamily: 'var(--ffb)', fontSize: '.95rem', color: '#fff', lineHeight: 1.6, display: 'flex', gap: '16px', boxShadow: '0 8px 24px rgba(245,158,11,0.1)' }}>
                <span style={{ fontSize: '1.5rem', flexShrink: 0 }}>⚠</span>
                <span>The most dangerous thing in study abroad is <b style={{ color: 'var(--amber)' }}>outdated advice</b>. Below: 6 myths actively causing students irreversible harm right now.</span>
              </div>
              <div className="myth-grid">
                {MYTHS.map((m, i) => (
                  <div key={i} className={`myth-card ${openMyths.includes(i) ? 'open' : ''}`}>
                    <div className="mc-head" onClick={() => toggleMyth(i)}>
                      <div className="mc-ico">{m.ico}</div>
                      <div className="mc-info">
                        <div className="mc-title">{m.title}</div>
                        <div className="mc-meta">
                          {m.dangerous ? <span className="sev sev-crit" style={{ fontSize: '.6rem' }}>DANGEROUS MYTH</span> : <span className="sev sev-ok" style={{ fontSize: '.6rem' }}>DEBUNKED</span>}
                          <span style={{ color: 'var(--t2)' }}>{m.source}</span>
                        </div>
                      </div>
                      <div className="mc-arrow">▼</div>
                    </div>
                    <div className="mc-body">
                      <div className="mc-claim"><div className="mc-claim-lbl">THE MYTH</div><div className="mc-claim-text">"{m.claim}"</div></div>
                      <div className="mc-reality"><div className="mc-real-lbl">THE REALITY</div><div className="mc-real-text" dangerouslySetInnerHTML={{ __html: m.reality }}></div></div>
                      <div className="mc-evidence"><b>📋 Evidence: </b><span dangerouslySetInnerHTML={{ __html: m.evidence }} /></div>
                      {m.dangerous && <div className="mc-danger"><span>⚠</span><span>{m.danger}</span></div>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ALERTS */}
            <div className={`section ${activeSec === 'alerts' ? 'active' : ''}`}>
              <div className="alert-compose">
                <div className="alert-compose-title">📢 SEND MENTOR ALERT</div>
                <div className="alert-compose-sub">Brief your students before they hear it from the wrong source. Post an alert to all mentees in the affected country.</div>
                <div className="alert-form">
                  <div className="af-group">
                    <label className="af-label">Country</label>
                    <select className="af-sel"><option>🇩🇪 Germany</option><option>🇺🇸 USA</option><option>🇬🇧 UK</option><option>🇨🇦 Canada</option><option>🇦🇺 Australia</option><option>🇮🇪 Ireland</option></select>
                  </div>
                  <div className="af-group">
                    <label className="af-label">Priority</label>
                    <select className="af-sel" defaultValue="🚨 Critical"><option>ℹ Info</option><option>⚠ Warning</option><option>🚨 Critical</option></select>
                  </div>
                  <div className="af-group full"><label className="af-label">Alert Message</label><textarea className="af-ta" placeholder="Describe the change and what students must do immediately..."></textarea></div>
                </div>
                <div style={{ marginTop: '20px', display: 'flex', gap: '12px' }}>
                  <button className="btn btn-primary" onClick={() => addToast('📢', 'Alert sent to 14 active mentees')}>Send to My Mentees →</button>
                  <button className="btn btn-ghost" onClick={() => addToast('📋', 'Draft saved')}>Save Draft</button>
                </div>
              </div>
              <div style={{ background: 'rgba(10,16,29,0.9)', backdropFilter: 'blur(16px)', border: '1px solid var(--b)', borderRadius: '16px 16px 0 0', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ fontFamily: 'var(--ffh)', fontSize: '1.4rem', letterSpacing: '.06em', color: '#fff' }}>🔔 RECENT MENTOR ALERTS</div>
                <span className="sev sev-info">4 NEW</span>
              </div>
              <div className="alert-feed" style={{ background: 'rgba(10,16,29,0.7)', border: '1px solid var(--b)', borderTop: 'none', borderRadius: '0 0 16px 16px', padding: '16px' }}>
                {ALERTS.map((a, i) => (
                  <div key={i} className="alert-item">
                    <div className="ai-av"><img src={a.img} alt=""/></div>
                    <div className="ai-info">
                      <div className="ai-head">
                        <span className="ai-name">{a.name}</span>
                        <span className="ai-country"><FlagImg code={a.iso} size={16}/> {a.country}</span>
                        <span className={`sev ${SC[a.sev]}`} style={{ fontSize: '.6rem' }}>{SL[a.sev].split(' ')[1]}</span>
                        <span className="ai-time">{a.time}</span>
                      </div>
                      <div className="ai-text" dangerouslySetInnerHTML={{ __html: a.text }}></div>
                      <div className="ai-actions">
                        <button className="btn btn-ghost btn-sm" onClick={() => addToast('👍', 'Helpful marked')}>👍 Helpful</button>
                        <button className="btn btn-ghost btn-sm" onClick={() => addToast('💬', 'Opening session...')}>Book Session →</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* LOG */}
            <div className={`section ${activeSec === 'log' ? 'active' : ''}`}>
              <div className="card">
                <div className="card-head">
                  <div className="card-title">■ <span style={{ color: 'var(--teal)' }}>SYSTEM INTELLIGENCE LOG</span></div>
                  <div className="card-action" onClick={() => addToast('📋', 'Log exported')}>EXPORT LOG</div>
                </div>
                <div className="log-body">
                  {syslogs.map((l, i) => (
                    <div key={i} className="log-row">
                      <span className="log-t">{l.t}</span><span className="log-icon">{l.ico}</span>
                      <span className="log-text" dangerouslySetInnerHTML={{ __html: l.html }}></span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}