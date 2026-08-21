'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

// ─── FLAG IMAGES ──────────────────────────────────────────────────────────────
const FlagImg = ({ iso, size = 18 }) => (
  <img src={`https://flagcdn.com/w${size * 2}/${iso}.png`}
    width={size} height={Math.round(size * 0.67)} alt={iso}
    style={{ borderRadius: 3, objectFit: 'cover', border: '1px solid rgba(255,255,255,.15)', display: 'inline-block', flexShrink: 0 }}
    onError={e => { e.currentTarget.style.display = 'none' }}
  />
)

// ─── STUDENT DATA ─────────────────────────────────────────────────────────────
const STUDENTS = [
  {
    id: 1,
    name: 'Priya Sharma',       initials: 'PS', bg: '#1a3a5c', tc: '#00D4FF',
    uni: 'TU Munich',           iso: 'de',       program: 'MSc Computer Science',
    intake: 'Winter 2026',      gpa: 7.4,        ielts: 7.0,
    probBefore: 61,             probNow: 54,      sessions: 4,
    lastSession: 21,            // days ago
    nextSession: 2,             // hours from now
    nextSessionLabel: 'Today 4:00 PM',
    status: 'danger',
    apsStatus: 'Not booked',    sopStatus: 'Overdue',       blockedAcc: 'Not opened',
    missedDeadlines: 2,         daysToDeadline: 34,
    sinceLastSession: [
      { type: 'ok',   text: 'Completed IELTS registration — score pending' },
      { type: 'ok',   text: 'Reached out to RWTH Aachen for program details' },
      { type: 'bad',  text: 'SOP first draft was due last week — not started' },
      { type: 'bad',  text: 'APS appointment still not booked — 34 days remaining' },
      { type: 'warn', text: 'TU Munich probability dropped 61% → 54% (APS + no SOP)' },
      { type: 'warn', text: 'Has not logged in for 8 days — potential motivation drop' },
    ],
    focusToday: [
      { icon: '🚨', priority: 'urgent',  title: 'APS Urgency — Book This Week', desc: 'At current pace she will miss the Winter 2026 deadline. APS must be booked by end of this month — walk her through the exact booking steps in this session.' },
      { icon: '📝', priority: 'high',    title: 'SOP — Start Today, Not Tomorrow', desc: 'She is 1 week behind on her first draft. Use the 30-minute SOP framework from Session 2. Get a 300-word draft before she leaves this call.' },
      { icon: '💬', priority: 'medium',  title: 'Address Motivation Drop', desc: 'She has not logged in for 8 days. Probability drop may be affecting confidence. Acknowledge the regression, reframe as recoverable.' },
    ],
    workedLastTime: [
      'Breaking large tasks into daily micro-goals (she responded well to specific dates)',
      'Specific deadline pressure — vague timelines do not motivate her',
      'Starting sessions with quick wins before harder conversations',
    ],
    sessionHistory: [
      { num: 4, date: '21 days ago', rating: 4.8, topic: 'University shortlist finalization + APS intro', probThen: 61, outcome: 'Agreed to book APS by April 5 — not done yet' },
      { num: 3, date: '6 weeks ago', rating: 5.0, topic: 'SOP structure + profile evaluation', probThen: 55, outcome: 'SOP framework agreed. Draft was due April 1 — not started' },
      { num: 2, date: '9 weeks ago', rating: 4.9, topic: 'IELTS strategy + German language plan', probThen: 48, outcome: 'IELTS registered. German A1 plan agreed but not started' },
      { num: 1, date: '12 weeks ago', rating: 4.7, topic: 'Introduction + Germany overview', probThen: 35, outcome: 'Germany confirmed as primary destination. 4-session plan agreed' },
    ],
    quickFacts: ['BITS Pilani · 7.4 GPA', '7.0 IELTS · No German', 'Target: TU Munich CS', '34 days to APS deadline'],
    riskLevel: 'high',
    note: '',
  },
  {
    id: 2,
    name: 'Arjun Mehta',        initials: 'AM', bg: '#2a1a4a', tc: '#8B7FFF',
    uni: 'RWTH Aachen',         iso: 'de',       program: 'MSc Data Science',
    intake: 'Winter 2026',      gpa: 7.8,        ielts: 7.5,
    probBefore: 44,             probNow: 68,      sessions: 3,
    lastSession: 14,
    nextSession: 26,
    nextSessionLabel: 'Tomorrow 10:00 AM',
    status: 'warning',
    apsStatus: 'In Progress',   sopStatus: '60% complete',  blockedAcc: 'Opened',
    missedDeadlines: 0,         daysToDeadline: 61,
    sinceLastSession: [
      { type: 'ok',   text: 'APS documents submitted — processing started' },
      { type: 'ok',   text: 'Blocked account opened at Fintiba — €11,208 deposited' },
      { type: 'ok',   text: 'SOP is 60% complete — solid progress' },
      { type: 'warn', text: 'Missing one LOR — supervisor not responding to follow-ups' },
      { type: 'warn', text: 'RWTH Aachen portal opened but form incomplete (Section 3 missing)' },
    ],
    focusToday: [
      { icon: '📧', priority: 'high',    title: 'LOR Follow-Up Strategy', desc: 'His supervisor has not responded in 2 weeks. Draft a professional follow-up email together — include a gentle deadline and a reminder of the recommendation letter template.' },
      { icon: '🖥',  priority: 'high',    title: 'Complete RWTH Application Portal', desc: 'Section 3 (Research interests) is missing. This is holding up submission. Complete it in this session — 20 minutes maximum.' },
      { icon: '✍️', priority: 'medium',  title: 'SOP Final 40% — Conclusion + Research Fit', desc: 'The research fit paragraph is the most important section for RWTH. Help him connect his data science background to specific RWTH faculty research.' },
    ],
    workedLastTime: [
      'Structured 3-session plan works well — he executes between sessions',
      'He responds to positive reinforcement + specific examples from real admits',
      'Prefers async feedback on written work rather than live editing',
    ],
    sessionHistory: [
      { num: 3, date: '14 days ago', rating: 5.0, topic: 'APS submission + Fintiba setup', probThen: 58, outcome: 'APS submitted, blocked account done. Both critical milestones cleared.' },
      { num: 2, date: '5 weeks ago', rating: 4.9, topic: 'SOP writing workshop + RWTH fit', probThen: 51, outcome: 'SOP first draft started. Research fit framework agreed.' },
      { num: 1, date: '8 weeks ago', rating: 4.8, topic: 'Germany overview + university shortlist', probThen: 44, outcome: 'RWTH as primary, TU Berlin as backup. Profile strong for both.' },
    ],
    quickFacts: ['VIT Vellore · 7.8 GPA', '7.5 IELTS · A1 German', 'Target: RWTH Aachen DS', '61 days to portal deadline'],
    riskLevel: 'medium',
    note: '',
  },
  {
    id: 3,
    name: 'Sneha Patel',        initials: 'SP', bg: '#1f4a2a', tc: '#00E5A8',
    uni: 'TU Berlin',           iso: 'de',       program: 'MSc Artificial Intelligence',
    intake: 'Summer 2026',      gpa: 8.1,        ielts: 7.5,
    probBefore: 52,             probNow: 74,      sessions: 5,
    lastSession: 7,
    nextSession: 72,
    nextSessionLabel: 'Friday 2:00 PM',
    status: 'good',
    apsStatus: 'Cleared',       sopStatus: 'Submitted',     blockedAcc: 'Opened',
    missedDeadlines: 0,         daysToDeadline: 88,
    sinceLastSession: [
      { type: 'ok',   text: 'APS cleared — certificate received (7 weeks processing)' },
      { type: 'ok',   text: 'SOP submitted to TU Berlin — acknowledged by admissions' },
      { type: 'ok',   text: 'Blocked account fully funded at Fintiba' },
      { type: 'ok',   text: 'German A2 course registered — starts next Monday' },
    ],
    focusToday: [
      { icon: '🎯', priority: 'medium',  title: 'Visa Interview Preparation Begins', desc: 'All documents are strong. Time to start preparing for the visa interview. Cover the 5 key questions that cause 80% of German student visa rejections.' },
      { icon: '🏛',  priority: 'medium',  title: 'TU Berlin Portal Follow-Up', desc: 'SOP was submitted 7 days ago. Walk her through what to expect next — acknowledgment timeline, interview possibilities, decision dates for Summer 2026.' },
      { icon: '📚', priority: 'low',     title: 'A2 German Prep Strategy', desc: 'She starts German A2 Monday. Build a 8-week study plan that fits alongside her final semester coursework.' },
    ],
    workedLastTime: [
      'She is highly self-motivated — sessions work best as check-ins + forward planning',
      'Responds well to concrete next steps with exact dates rather than general advice',
      'Good to acknowledge her progress explicitly — she under-celebrates wins',
    ],
    sessionHistory: [
      { num: 5, date: '7 days ago',  rating: 5.0, topic: 'SOP finalization + submission strategy', probThen: 68, outcome: 'SOP submitted to TU Berlin. APS clearance confirmed same day.' },
      { num: 4, date: '4 weeks ago', rating: 5.0, topic: 'APS documentation + Fintiba setup', probThen: 63, outcome: 'All documents complete. Fintiba funded.' },
      { num: 3, date: '7 weeks ago', rating: 4.9, topic: 'SOP second draft review', probThen: 58, outcome: 'Major revision to research fit section — significantly stronger now.' },
      { num: 2, date: '10 weeks ago',rating: 4.8, topic: 'University shortlist + IELTS strategy', probThen: 54, outcome: 'TU Berlin as primary. IELTS retake confirmed — score improved to 7.5.' },
      { num: 1, date: '13 weeks ago',rating: 4.7, topic: 'Initial assessment + Germany roadmap', probThen: 52, outcome: 'Profile assessed as strong for TU Berlin AI. 5-session plan created.' },
    ],
    quickFacts: ['IIT Bombay · 8.1 GPA', '7.5 IELTS · A1 German', 'Target: TU Berlin AI', '88 days — on track'],
    riskLevel: 'low',
    note: 'Strong student — focus on visa prep now. She is ready.',
  },
  {
    id: 4,
    name: 'Vikram Singh',       initials: 'VS', bg: '#4a2a1a', tc: '#FFB800',
    uni: 'LMU Munich',          iso: 'de',       program: 'MSc Data Science',
    intake: 'Winter 2026',      gpa: 7.2,        ielts: 6.5,
    probBefore: 28,             probNow: 45,      sessions: 3,
    lastSession: 30,
    nextSession: 48,
    nextSessionLabel: 'Thursday 6:00 PM',
    status: 'warning',
    apsStatus: 'Not booked',    sopStatus: 'Not started',   blockedAcc: 'Not opened',
    missedDeadlines: 3,         daysToDeadline: 28,
    sinceLastSession: [
      { type: 'bad',  text: 'No contact for 30 days — missed 2 scheduled check-ins' },
      { type: 'bad',  text: 'APS not booked — now critically urgent (28 days left)' },
      { type: 'bad',  text: 'SOP not started — 30 days since session 2 plan was agreed' },
      { type: 'warn', text: 'IELTS at 6.5 — LMU requires 7.0 minimum for DS program' },
    ],
    focusToday: [
      { icon: '⚡', priority: 'urgent',  title: 'APS — This Is Now a Crisis', desc: 'With 28 days to deadline, APS booking is at critical threshold. He must book TODAY. Have the APS website open before the call starts. Do not end the session without a booked slot.' },
      { icon: '📖', priority: 'urgent',  title: 'IELTS Retake — LMU Requires 7.0', desc: '6.5 will result in automatic rejection from LMU Munich DS. He needs to register for an IELTS retake immediately. Nearest test date: check British Council.' },
      { icon: '💬', priority: 'high',    title: 'Re-Engagement — Address the 30-Day Gap', desc: 'He went quiet for 30 days. Do not open with pressure. Open with empathy — understand what happened. Then rebuild momentum with very small, specific tasks.' },
    ],
    workedLastTime: [
      'Session 2 was productive when tasks were made very small and specific',
      'He shuts down when overwhelmed — break everything into single next actions',
      'WhatsApp follow-ups between sessions had high response rate in first month',
    ],
    sessionHistory: [
      { num: 3, date: '30 days ago', rating: 4.5, topic: 'Application portal + APS timeline', probThen: 39, outcome: 'APS booking agreed for April 5. SOP draft due April 1. Neither done.' },
      { num: 2, date: '8 weeks ago', rating: 4.7, topic: 'IELTS strategy + LMU requirements', probThen: 33, outcome: 'IELTS retake registered — test date: April 12. Waiting for score.' },
      { num: 1, date: '11 weeks ago',rating: 4.6, topic: 'Profile evaluation + Germany overview', probThen: 28, outcome: 'LMU DS as target. Noted IELTS gap. 3-session roadmap created.' },
    ],
    quickFacts: ['SRCC Delhi · 7.2 GPA', '6.5 IELTS · No German', 'Target: LMU Munich DS', '28 days — CRITICAL'],
    riskLevel: 'high',
    note: '',
  },
  {
    id: 5,
    name: 'Ananya Rao',         initials: 'AR', bg: '#1a2a4a', tc: '#00D4FF',
    uni: 'KIT Karlsruhe',       iso: 'de',       program: 'MSc Electrical Engineering',
    intake: 'Winter 2026',      gpa: 7.9,        ielts: 7.0,
    probBefore: 38,             probNow: 62,      sessions: 4,
    lastSession: 10,
    nextSession: 96,
    nextSessionLabel: 'Saturday 11:00 AM',
    status: 'good',
    apsStatus: 'Booked',        sopStatus: '40% complete',  blockedAcc: 'Opened',
    missedDeadlines: 0,         daysToDeadline: 72,
    sinceLastSession: [
      { type: 'ok',   text: 'APS appointment booked — May 14, Mumbai centre' },
      { type: 'ok',   text: 'Blocked account opened at DKB — €11,208 deposited' },
      { type: 'ok',   text: 'Started SOP draft — 40% complete' },
      { type: 'warn', text: 'KIT portal opened but missing Bachelor transcript (official copy)' },
    ],
    focusToday: [
      { icon: '📄', priority: 'high',    title: 'KIT Portal — Bachelor Transcript Gap', desc: 'Official transcript must be requested from her university with apostille. This takes 3–4 weeks. She must initiate today or it will delay submission.' },
      { icon: '✍️', priority: 'medium',  title: 'SOP Middle Section — Motivation for EE', desc: 'The current 40% is the introduction and background. The motivation section (why KIT specifically, why EE) needs to be written next session.' },
    ],
    workedLastTime: [
      'Very organised student — responds well to checklists and systems',
      'Appreciates when you explain the why behind each step',
      'Opens up more when you share examples from your own TU Munich application',
    ],
    sessionHistory: [
      { num: 4, date: '10 days ago', rating: 5.0, topic: 'APS booking + Fintiba setup', probThen: 55, outcome: 'APS booked (May 14). Fintiba funded. Very strong session.' },
      { num: 3, date: '5 weeks ago', rating: 4.9, topic: 'KIT portal walkthrough + SOP start', probThen: 49, outcome: 'KIT portal opened. SOP introduction written together.' },
      { num: 2, date: '8 weeks ago', rating: 4.8, topic: 'University shortlist refinement', probThen: 43, outcome: 'KIT as primary (EE is world-class there). TU Dresden as backup.' },
      { num: 1, date: '11 weeks ago',rating: 4.7, topic: 'Introduction + profile assessment', probThen: 38, outcome: 'Profile strong for KIT EE. Plan: APS → Fintiba → SOP → Portal.' },
    ],
    quickFacts: ['NIT Trichy · 7.9 GPA', '7.0 IELTS · No German', 'Target: KIT EE', '72 days — on track'],
    riskLevel: 'low',
    note: 'Very organised. Check on transcript apostille — this is the one blocker.',
  },
  {
    id: 6,
    name: 'Rohan Gupta',        initials: 'RG', bg: '#3a1a3a', tc: '#8B7FFF',
    uni: 'TU Munich',           iso: 'de',       program: 'MSc Robotics',
    intake: 'Winter 2026',      gpa: 8.2,        ielts: 8.0,
    probBefore: 55,             probNow: 81,      sessions: 5,
    lastSession: 5,
    nextSession: 120,
    nextSessionLabel: 'Next Monday 9:00 AM',
    status: 'good',
    apsStatus: 'Cleared',       sopStatus: 'Submitted',     blockedAcc: 'Opened',
    missedDeadlines: 0,         daysToDeadline: 104,
    sinceLastSession: [
      { type: 'ok',   text: 'APS cleared in 6 weeks — fastest in current cohort' },
      { type: 'ok',   text: 'SOP submitted to TU Munich — acknowledged same day' },
      { type: 'ok',   text: 'All LORs received and uploaded' },
      { type: 'ok',   text: 'DAAD application in progress — Aarav reviewing draft' },
    ],
    focusToday: [
      { icon: '💰', priority: 'medium',  title: 'DAAD Application Final Review', desc: 'The DAAD application draft is strong. Two things to fix: the development-relevance section needs more India-Germany connection, and the budget section is 15% over the recommended range.' },
      { icon: '🗓', priority: 'low',     title: 'Visa Interview Prep — Optional But Recommended', desc: 'With everything else complete, use the remaining session time on visa interview practice. His profile is strong enough that this is low-risk prep.' },
    ],
    workedLastTime: [
      'Exceptional student — sessions are mostly strategic, not remedial',
      'Highly motivated by comparison to peer outcomes (DAAD success stories)',
      'Prefers detailed written feedback over live commentary',
    ],
    sessionHistory: [
      { num: 5, date: '5 days ago',  rating: 5.0, topic: 'DAAD application review + SOP final', probThen: 76, outcome: 'SOP submitted. DAAD draft 90% complete.' },
      { num: 4, date: '4 weeks ago', rating: 5.0, topic: 'SOP second draft + APS clearance', probThen: 70, outcome: 'APS cleared (record 6 weeks). SOP second draft reviewed.' },
      { num: 3, date: '7 weeks ago', rating: 5.0, topic: 'DAAD scholarship strategy', probThen: 65, outcome: 'DAAD Helmut Schmidt Programme identified as best fit.' },
      { num: 2, date: '10 weeks ago',rating: 4.9, topic: 'TUM application strategy + APS booking', probThen: 59, outcome: 'APS booked (Mumbai, March 20). Fintiba funded.' },
      { num: 1, date: '13 weeks ago',rating: 4.8, topic: 'Initial assessment + Germany deep dive', probThen: 55, outcome: 'TUM Robotics confirmed as target. Profile: excellent candidate.' },
    ],
    quickFacts: ['IIT Delhi · 8.2 GPA', '8.0 IELTS · A2 German', 'Target: TUM Robotics', 'DAAD pending'],
    riskLevel: 'low',
    note: 'Star student. Focus purely on DAAD application now.',
  },
  {
    id: 7,
    name: 'Divya Nair',         initials: 'DN', bg: '#1a4a3a', tc: '#00E5A8',
    uni: 'TU Dresden',          iso: 'de',       program: 'MSc Computer Science',
    intake: 'Summer 2026',      gpa: 7.6,        ielts: 7.0,
    probBefore: 33,             probNow: 59,      sessions: 3,
    lastSession: 18,
    nextSession: 168,
    nextSessionLabel: 'Next Tuesday 7:00 PM',
    status: 'warning',
    apsStatus: 'In Progress',   sopStatus: '30% complete',  blockedAcc: 'Not opened',
    missedDeadlines: 1,         daysToDeadline: 55,
    sinceLastSession: [
      { type: 'ok',   text: 'APS appointment booked — June 2, Delhi centre' },
      { type: 'ok',   text: 'SOP introduction written — 300 words, good start' },
      { type: 'bad',  text: 'Blocked account still not opened — was due 2 weeks ago' },
      { type: 'warn', text: 'TU Dresden portal deadline: June 30 — 55 days away' },
    ],
    focusToday: [
      { icon: '🏦', priority: 'high',    title: 'Blocked Account — Do This In 24 Hours', desc: 'Blocked account was due to be opened 2 weeks ago. Fintiba takes 3–5 business days to process. If not opened this week, it becomes a visa blocker. Walk through the Fintiba process together.' },
      { icon: '✍️', priority: 'medium',  title: 'SOP Body Paragraphs — Academic Journey', desc: 'Introduction is done. Next: the academic journey section. Her internship at ISRO is her strongest differentiator — make it the centerpiece.' },
    ],
    workedLastTime: [
      'Needs more hand-holding than most — detailed step-by-step instructions work best',
      'Very responsive to positive feedback and validation',
      'APS booking happened after specific WhatsApp reminder with exact steps',
    ],
    sessionHistory: [
      { num: 3, date: '18 days ago', rating: 4.7, topic: 'APS booking walkthrough + SOP start', probThen: 52, outcome: 'APS booked (June 2). SOP intro written together. Blocked account still pending.' },
      { num: 2, date: '6 weeks ago', rating: 4.6, topic: 'Profile deep dive + university selection', probThen: 42, outcome: 'TU Dresden confirmed (strong acceptance rate for her profile). SOP plan made.' },
      { num: 1, date: '9 weeks ago', rating: 4.5, topic: 'Introduction + Germany overview', probThen: 33, outcome: 'Germany confirmed. ISRO internship identified as key differentiator.' },
    ],
    quickFacts: ['MNIT Jaipur · 7.6 GPA', '7.0 IELTS · No German', 'Target: TU Dresden CS', '55 days — watch blocked acc'],
    riskLevel: 'medium',
    note: 'Blocked account is the only blocker. Push hard on this.',
  },
  {
    id: 8,
    name: 'Karan Malhotra',     initials: 'KM', bg: '#4a1a1a', tc: '#FF5E8A',
    uni: 'RWTH Aachen',         iso: 'de',       program: 'MSc Mech Engineering',
    intake: 'Winter 2026',      gpa: 7.5,        ielts: 6.5,
    probBefore: 30,             probNow: 42,      sessions: 2,
    lastSession: 25,
    nextSession: 240,
    nextSessionLabel: 'Next Wednesday 8:00 PM',
    status: 'danger',
    apsStatus: 'Not booked',    sopStatus: 'Not started',   blockedAcc: 'Not opened',
    missedDeadlines: 3,         daysToDeadline: 22,
    sinceLastSession: [
      { type: 'bad',  text: 'APS not booked — 22 days remaining, now at crisis level' },
      { type: 'bad',  text: 'SOP not started despite agreeing to begin in session 2' },
      { type: 'bad',  text: 'Blocked account not opened (agreed 3 weeks ago)' },
      { type: 'warn', text: 'IELTS at 6.5 — RWTH requires 7.0 minimum, retake needed' },
    ],
    focusToday: [
      { icon: '🚨', priority: 'urgent',  title: 'APS — 22 Days Left, Book During This Call', desc: 'This is a genuine emergency. 22 days remaining. Have the APS portal open before the call. Do not let the session end without a confirmed appointment slot number.' },
      { icon: '📖', priority: 'urgent',  title: 'IELTS Retake — Register Today', desc: '6.5 is a hard rejection for RWTH ME. Find the next available IELTS test date during this call and register together. There must be a test in the next 4–5 weeks.' },
      { icon: '💬', priority: 'high',    title: 'Honest Conversation About Realistic Timeline', desc: 'If APS cannot be booked today, Winter 2026 may be at risk. Have an honest conversation about backup options: Summer 2027, different universities, or postponing.' },
    ],
    workedLastTime: [
      'He responds to urgency framing — he moves when he understands the stakes',
      'In-call task completion works better than homework (he does not follow through)',
      'Short messages rather than long emails between sessions',
    ],
    sessionHistory: [
      { num: 2, date: '25 days ago', rating: 4.4, topic: 'RWTH application strategy + APS', probThen: 36, outcome: 'APS agreed for April 3. Blocked account agreed for April 5. Neither done.' },
      { num: 1, date: '9 weeks ago', rating: 4.5, topic: 'Introduction + profile evaluation', probThen: 30, outcome: 'RWTH ME confirmed. Noted IELTS gap — retake needed before applying.' },
    ],
    quickFacts: ['DTU Delhi · 7.5 GPA', '6.5 IELTS · No German', 'Target: RWTH ME', '22 days — EMERGENCY'],
    riskLevel: 'high',
    note: 'Most at-risk student right now. Escalate urgency.',
  },
  {
    id: 9,
    name: 'Ishaan Verma',       initials: 'IV', bg: '#1a2a5c', tc: '#00D4FF',
    uni: 'TU Munich',           iso: 'de',       program: 'MSc Data Engineering',
    intake: 'Winter 2026',      gpa: 7.7,        ielts: 7.5,
    probBefore: 42,             probNow: 70,      sessions: 4,
    lastSession: 8,
    nextSession: 312,
    nextSessionLabel: 'Next Thursday 5:00 PM',
    status: 'good',
    apsStatus: 'Cleared',       sopStatus: 'Final review',  blockedAcc: 'Opened',
    missedDeadlines: 0,         daysToDeadline: 79,
    sinceLastSession: [
      { type: 'ok',   text: 'APS cleared — 8 weeks processing time (Mumbai centre)' },
      { type: 'ok',   text: 'SOP in final review stage — one more revision needed' },
      { type: 'ok',   text: 'Fintiba opened and funded — €11,208 confirmed' },
      { type: 'warn', text: 'Missing one project on GitHub (was agreed for portfolio strengthening)' },
    ],
    focusToday: [
      { icon: '✍️', priority: 'high',    title: 'SOP Final Revision — Research Fit Paragraph', desc: 'The SOP is 95% ready. The one weak section is the research fit paragraph — it does not name specific TUM DE faculty. Fix this together and it is ready to submit.' },
      { icon: '💻', priority: 'medium',  title: 'GitHub Project — Simple Data Pipeline Demo', desc: 'A basic ETL pipeline on GitHub would increase his profile score. 2-hour weekend project. Guide him on the right project to build for TUM DE admission committee.' },
    ],
    workedLastTime: [
      'Very coachable — implements feedback between sessions reliably',
      'Technical discussions motivate him more than strategy talks',
      'Appreciates when sessions have clear deliverables with exact due dates',
    ],
    sessionHistory: [
      { num: 4, date: '8 days ago',  rating: 5.0, topic: 'SOP review round 2 + APS clearance', probThen: 65, outcome: 'APS cleared. SOP very close to final — research fit section to fix.' },
      { num: 3, date: '5 weeks ago', rating: 4.9, topic: 'SOP writing + Fintiba setup', probThen: 56, outcome: 'Fintiba funded. SOP first draft strong.' },
      { num: 2, date: '8 weeks ago', rating: 4.8, topic: 'APS booking + IELTS verification', probThen: 49, outcome: 'APS booked (Mumbai). IELTS 7.5 verified as meeting TUM requirements.' },
      { num: 1, date: '11 weeks ago',rating: 4.7, topic: 'Introduction + TUM deep dive', probThen: 42, outcome: 'TUM Data Engineering confirmed as target. Strong profile — execution is key.' },
    ],
    quickFacts: ['NSIT Delhi · 7.7 GPA', '7.5 IELTS · No German', 'Target: TUM Data Eng', '79 days — on track'],
    riskLevel: 'low',
    note: 'SOP one revision away from submission.',
  },
  {
    id: 10,
    name: 'Meera Iyer',         initials: 'MI', bg: '#2a4a1a', tc: '#00E5A8',
    uni: 'TU Berlin',           iso: 'de',       program: 'MSc Computer Science',
    intake: 'Summer 2026',      gpa: 8.0,        ielts: 7.0,
    probBefore: 47,             probNow: 73,      sessions: 5,
    lastSession: 3,
    nextSession: 384,
    nextSessionLabel: 'Next Friday 3:00 PM',
    status: 'good',
    apsStatus: 'Cleared',       sopStatus: 'Submitted',     blockedAcc: 'Opened',
    missedDeadlines: 0,         daysToDeadline: 95,
    sinceLastSession: [
      { type: 'ok',   text: 'TU Berlin application submitted — all documents uploaded' },
      { type: 'ok',   text: 'APS clearance confirmed in portal' },
      { type: 'ok',   text: 'Acknowledgment email received from TU Berlin admissions' },
      { type: 'ok',   text: 'German B1 registration confirmed — course starts May 1' },
    ],
    focusToday: [
      { icon: '⏳', priority: 'medium',  title: 'Post-Submission: What Happens Now', desc: 'She has submitted everything. This session is about managing the waiting period — what TU Berlin\'s decision timeline looks like, what to do if waitlisted, how to handle the emotional side of waiting.' },
      { icon: '🗣', priority: 'medium',  title: 'Visa Interview Prep — Early Start', desc: 'With 3 months until likely decision, start visa interview preparation now. The earlier you prepare, the more natural the answers feel. Focus on the financial and return-to-India questions.' },
    ],
    workedLastTime: [
      'Exceptional follow-through — consistently executes every action item',
      'Prefers sessions that look forward rather than review past actions',
      'B1 German was her own initiative — highlight this in the visa interview',
    ],
    sessionHistory: [
      { num: 5, date: '3 days ago',  rating: 5.0, topic: 'Final submission review + portal check', probThen: 70, outcome: 'Application submitted successfully. All documents verified.' },
      { num: 4, date: '3 weeks ago', rating: 5.0, topic: 'SOP final review + APS verification', probThen: 65, outcome: 'SOP final version approved. APS clearance confirmed.' },
      { num: 3, date: '6 weeks ago', rating: 4.9, topic: 'SOP drafts 2 + 3 review', probThen: 59, outcome: 'Major improvement in motivation section. Research fit very strong.' },
      { num: 2, date: '9 weeks ago', rating: 4.9, topic: 'TU Berlin focus + APS strategy', probThen: 52, outcome: 'TU Berlin CS confirmed. APS booked and processing.' },
      { num: 1, date: '12 weeks ago',rating: 4.8, topic: 'Introduction + profile deep dive', probThen: 47, outcome: 'IIT Madras profile: strong for TU Berlin. Roadmap to Summer 2026 created.' },
    ],
    quickFacts: ['IIT Madras · 8.0 GPA', '7.0 IELTS · A2 German', 'Target: TU Berlin CS', 'Application submitted'],
    riskLevel: 'low',
    note: 'Application submitted. Focus on visa prep now.',
  },
  {
    id: 11,
    name: 'Aditya Kumar',       initials: 'AK', bg: '#3a2a4a', tc: '#8B7FFF',
    uni: 'KIT Karlsruhe',       iso: 'de',       program: 'MSc Computer Science',
    intake: 'Winter 2026',      gpa: 7.3,        ielts: 6.5,
    probBefore: 25,             probNow: 38,      sessions: 2,
    lastSession: 35,
    nextSession: 456,
    nextSessionLabel: 'Next Saturday 4:00 PM',
    status: 'danger',
    apsStatus: 'Not booked',    sopStatus: 'Not started',   blockedAcc: 'Not opened',
    missedDeadlines: 4,         daysToDeadline: 18,
    sinceLastSession: [
      { type: 'bad',  text: 'No contact for 35 days — missed all scheduled follow-ups' },
      { type: 'bad',  text: 'APS not booked — only 18 days remaining (EMERGENCY)' },
      { type: 'bad',  text: 'IELTS at 6.5 — KIT requires 7.0 — retake still not registered' },
      { type: 'bad',  text: '4 missed commitments from session 2 — all unaddressed' },
    ],
    focusToday: [
      { icon: '🚨', priority: 'urgent',  title: 'Honest Assessment — Is Winter 2026 Still Realistic?', desc: 'With 18 days to APS deadline, 6.5 IELTS, no SOP, and 4 missed commitments, Winter 2026 may no longer be achievable. Have an honest conversation about Summer 2027 as the better target.' },
      { icon: '🔄', priority: 'high',    title: 'Re-engage or Reset the Plan', desc: 'Understand why he went quiet for 35 days. There may be personal circumstances. Do not push if overwhelmed — a reset to Summer 2027 with a clean plan may produce better outcomes.' },
    ],
    workedLastTime: [
      'Session 1 was very productive — he was engaged and committed',
      'Something changed between session 1 and 2 — explore what happened',
      'He mentioned financial pressure in session 2 — may be the root cause',
    ],
    sessionHistory: [
      { num: 2, date: '35 days ago', rating: 4.2, topic: 'KIT requirements + APS urgency', probThen: 31, outcome: 'APS booking agreed for April 1. IELTS retake agreed. Neither completed.' },
      { num: 1, date: '10 weeks ago',rating: 4.6, topic: 'Introduction + KIT assessment', probThen: 25, outcome: 'KIT CS identified as target. Noted IELTS gap. Enthusiastic in session.' },
    ],
    quickFacts: ['Manipal · 7.3 GPA', '6.5 IELTS · No German', 'Target: KIT CS', '18 days — may need to defer'],
    riskLevel: 'high',
    note: 'Consider recommending Summer 2027 deferral. Do not push unrealistic deadlines.',
  },
  {
    id: 12,
    name: 'Pooja Sharma',       initials: 'PS', bg: '#4a3a1a', tc: '#FFB800',
    uni: 'TU Munich',           iso: 'de',       program: 'MSc Informatics',
    intake: 'Winter 2026',      gpa: 7.8,        ielts: 7.0,
    probBefore: 44,             probNow: 66,      sessions: 4,
    lastSession: 12,
    nextSession: 528,
    nextSessionLabel: 'Next Sunday 6:00 PM',
    status: 'good',
    apsStatus: 'In Progress',   sopStatus: '70% complete',  blockedAcc: 'Opened',
    missedDeadlines: 0,         daysToDeadline: 66,
    sinceLastSession: [
      { type: 'ok',   text: 'APS documents submitted — waiting for appointment slot' },
      { type: 'ok',   text: 'SOP is now 70% complete — motivation section particularly strong' },
      { type: 'ok',   text: 'Blocked account at Fintiba — funded at €11,208' },
      { type: 'warn', text: 'German A1 course only 30% complete — B1 target at risk' },
    ],
    focusToday: [
      { icon: '✍️', priority: 'high',    title: 'SOP Final 30% — Research Fit + Conclusion', desc: 'The last 30% is the most impactful: TUM faculty name-drop, specific research area, conclusion with clear career plan. This is what separates accepted SOPs from rejected ones.' },
      { icon: '🇩🇪', priority: 'medium',  title: 'German Language — Realistic Assessment', desc: 'B1 by October is ambitious if A1 is only 30% complete. Discuss: is B1 before application realistic, or should she aim for A2 certificate and continue independently?' },
    ],
    workedLastTime: [
      'Strong writer — SOP quality is above average for the cohort',
      'Responds well to real examples from admitted students',
      'German language is her weakest area — be encouraging but realistic',
    ],
    sessionHistory: [
      { num: 4, date: '12 days ago', rating: 5.0, topic: 'SOP review + APS documents', probThen: 60, outcome: 'APS documents complete. SOP motivation section written — very strong.' },
      { num: 3, date: '5 weeks ago', rating: 4.9, topic: 'SOP first draft + Fintiba', probThen: 54, outcome: 'First draft written together. Fintiba funded.' },
      { num: 2, date: '8 weeks ago', rating: 4.8, topic: 'TUM requirements + APS strategy', probThen: 49, outcome: 'TUM Informatics confirmed. APS booking plan agreed.' },
      { num: 1, date: '11 weeks ago',rating: 4.7, topic: 'Introduction + Germany deep dive', probThen: 44, outcome: 'Strong candidate for TUM. 4-session plan created.' },
    ],
    quickFacts: ['PESIT Bangalore · 7.8 GPA', '7.0 IELTS · A1 German', 'Target: TUM Informatics', '66 days — good progress'],
    riskLevel: 'low',
    note: 'SOP quality is strong. Push for final 30% this session.',
  },
]

const STATUS_MAP = {
  danger:  { col:'#FF5E8A', bg:'rgba(255,94,138,.1)',  bdr:'rgba(255,94,138,.3)',  dot:'#FF5E8A', label:'⚠ NEEDS ATTENTION' },
  warning: { col:'#FFB800', bg:'rgba(255,184,0,.1)',   bdr:'rgba(255,184,0,.3)',   dot:'#FFB800', label:'📋 MONITOR CLOSELY' },
  good:    { col:'#00E5A8', bg:'rgba(0,229,168,.08)',  bdr:'rgba(0,229,168,.25)', dot:'#00E5A8', label:'✅ ON TRACK' },
}

const RISK_MAP = {
  high:   { col:'#FF5E8A', label:'High Risk' },
  medium: { col:'#FFB800', label:'Watch' },
  low:    { col:'#00E5A8', label:'Low Risk' },
}

const PRIORITY_MAP = {
  urgent: { col:'#FF5E8A', bg:'rgba(255,94,138,.08)',  bdr:'rgba(255,94,138,.25)', label:'🚨 URGENT' },
  high:   { col:'#FFB800', bg:'rgba(255,184,0,.08)',   bdr:'rgba(255,184,0,.25)',  label:'⚠ HIGH' },
  medium: { col:'#00D4FF', bg:'rgba(0,212,255,.07)',   bdr:'rgba(0,212,255,.2)',   label:'📋 MEDIUM' },
  low:    { col:'#00E5A8', bg:'rgba(0,229,168,.07)',   bdr:'rgba(0,229,168,.2)',   label:'✅ LOW' },
}

// ─── CSS ──────────────────────────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&family=JetBrains+Mono:wght@400;500&display=swap');

.sib{--bg:#07090F;--bg2:#0B0E18;--bg3:#10131E;--bgc:#0E1120;--b:rgba(255,255,255,.07);--b2:rgba(255,255,255,.13);--cyan:#00D4FF;--teal:#00E5A8;--violet:#8B7FFF;--gold:#FFB800;--rose:#FF5E8A;--tx:#E8EAF6;--tx2:#7A7F99;--tx3:#40455C;--ffh:'Syne',sans-serif;--ffb:'DM Sans',sans-serif;--ffm:'JetBrains Mono',monospace;background:var(--bg);color:var(--tx);font-family:var(--ffb);min-height:100vh;overflow-x:hidden;-webkit-font-smoothing:antialiased}
.sib *,.sib *::before,.sib *::after{box-sizing:border-box;margin:0;padding:0}
.sib a{text-decoration:none;color:inherit}
.sib button{cursor:pointer;font-family:var(--ffb);border:none;background:none}
.sib ::-webkit-scrollbar{width:4px;background:transparent}
.sib ::-webkit-scrollbar-thumb{background:rgba(255,255,255,.1);border-radius:4px}

.sib-bg{position:fixed;inset:0;z-index:0;pointer-events:none;overflow:hidden}
.sib-orb{position:absolute;border-radius:50%;filter:blur(130px);animation:sibDrift 20s ease-in-out infinite alternate}
.sib-o1{width:700px;height:700px;background:radial-gradient(circle,rgba(0,212,255,.14),transparent 70%);top:-200px;left:-150px}
.sib-o2{width:600px;height:600px;background:radial-gradient(circle,rgba(139,127,255,.12),transparent 70%);bottom:-100px;right:-100px;animation-delay:-8s}
.sib-o3{width:400px;height:400px;background:radial-gradient(circle,rgba(0,229,168,.08),transparent 70%);top:40%;left:40%;animation-delay:-4s}
@keyframes sibDrift{0%{transform:translate(0,0) scale(1)}100%{transform:translate(40px,30px) scale(1.05)}}
.sib-grid{position:fixed;inset:0;z-index:0;pointer-events:none;background-image:linear-gradient(rgba(255,255,255,.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.025) 1px,transparent 1px);background-size:60px 60px;mask-image:radial-gradient(ellipse 80% 60% at 50% 0%,black 40%,transparent 100%)}
.sib-noise{position:fixed;inset:0;z-index:0;pointer-events:none;opacity:.03;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")}

/* NAV */
.sib-nav{position:sticky;top:0;z-index:300;height:62px;display:flex;align-items:center;padding:0 32px;background:rgba(7,9,15,.9);backdrop-filter:blur(24px) saturate(160%);border-bottom:1px solid var(--b);gap:14px}
.sib-brand{display:flex;align-items:center;gap:10px;text-decoration:none}
.sib-brand-icon{width:34px;height:34px;background:linear-gradient(135deg,var(--cyan),var(--teal));border-radius:10px;display:flex;align-items:center;justify-content:center;box-shadow:0 0 20px rgba(0,212,255,.35);flex-shrink:0}
.sib-brand-name{font-family:var(--ffh);font-size:17px;font-weight:700;letter-spacing:-.03em;background:linear-gradient(135deg,#fff 30%,rgba(0,212,255,.8));-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.sib-nav-div{width:1px;height:22px;background:var(--b);flex-shrink:0}
.sib-nav-title{font-family:var(--ffh);font-size:1.05rem;font-weight:700;color:#fff;letter-spacing:.02em}
.sib-nav-sub{font-family:var(--ffm);font-size:10px;color:var(--tx2);letter-spacing:.08em;margin-top:1px}
.sib-nav-sp{flex:1}
.sib-nav-live{display:flex;align-items:center;gap:6px;font-family:var(--ffm);font-size:11px;color:var(--teal);background:rgba(0,229,168,.07);border:1px solid rgba(0,229,168,.2);padding:5px 13px;border-radius:20px;letter-spacing:.08em}
.sib-live-dot{width:6px;height:6px;border-radius:50%;background:var(--rose);box-shadow:0 0 7px var(--rose);animation:sibPulse 1.5s infinite;flex-shrink:0}
@keyframes sibPulse{0%,100%{box-shadow:0 0 4px var(--rose)}50%{box-shadow:0 0 14px var(--rose)}}
.sib-btn{display:inline-flex;align-items:center;gap:7px;padding:8px 18px;border-radius:10px;font-size:13.5px;font-weight:600;transition:all .2s}
.sib-btn-ghost{background:transparent;border:1px solid var(--b2);color:var(--tx)}
.sib-btn-ghost:hover{border-color:rgba(255,255,255,.28);background:rgba(255,255,255,.06)}
.sib-btn-primary{background:linear-gradient(135deg,var(--cyan),var(--teal));color:#060A12;font-weight:700;box-shadow:0 0 20px rgba(0,212,255,.3);border:none}
.sib-btn-primary:hover{box-shadow:0 0 36px rgba(0,212,255,.5);transform:translateY(-1px)}
.sib-btn-rose{background:rgba(255,94,138,.1);color:var(--rose);border:1px solid rgba(255,94,138,.35)}
.sib-btn-rose:hover{background:rgba(255,94,138,.18)}

/* LAYOUT */
.sib-layout{position:relative;z-index:2;display:flex;height:calc(100vh - 62px);overflow:hidden}

/* LEFT SIDEBAR — STUDENT LIST */
.sib-left{width:320px;flex-shrink:0;background:rgba(7,9,15,.95);border-right:1px solid var(--b);display:flex;flex-direction:column;overflow:hidden}
.sib-left-head{padding:16px 18px;border-bottom:1px solid var(--b);flex-shrink:0}
.sib-left-title{font-family:var(--ffh);font-size:1.05rem;font-weight:800;color:#fff;margin-bottom:8px;letter-spacing:.02em}
.sib-search{display:flex;align-items:center;gap:8px;background:var(--bg2);border:1px solid var(--b);border-radius:9px;padding:8px 12px}
.sib-search input{background:transparent;border:none;outline:none;color:var(--tx);font-family:var(--ffb);font-size:13px;flex:1}
.sib-search input::placeholder{color:var(--tx3)}
.sib-filter-row{display:flex;gap:6px;margin-top:10px;flex-wrap:wrap}
.sib-filter{padding:4px 11px;border-radius:7px;font-family:var(--ffm);font-size:10px;border:1px solid var(--b);color:var(--tx2);transition:all .18s;letter-spacing:.05em}
.sib-filter:hover{border-color:var(--b2);color:var(--tx)}
.sib-filter.on{border-color:rgba(0,212,255,.4);background:rgba(0,212,255,.07);color:var(--cyan)}
.sib-student-list{overflow-y:auto;flex:1}
.sib-sl-item{padding:13px 18px;border-bottom:1px solid var(--b);cursor:pointer;transition:all .18s;position:relative;display:flex;gap:11px;align-items:flex-start}
.sib-sl-item:hover{background:rgba(255,255,255,.03)}
.sib-sl-item.active{background:rgba(0,212,255,.06);border-left:2px solid var(--cyan)}
.sib-sl-av{width:38px;height:38px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-family:var(--ffh);font-size:.9rem;flex-shrink:0;border:1.5px solid rgba(255,255,255,.1)}
.sib-sl-info{flex:1;min-width:0}
.sib-sl-name{font-size:13.5px;font-weight:600;color:#fff;margin-bottom:2px}
.sib-sl-uni{font-family:var(--ffm);font-size:10px;color:var(--tx2);margin-bottom:4px;display:flex;align-items:center;gap:5px}
.sib-sl-next{font-family:var(--ffm);font-size:10px;display:flex;align-items:center;gap:4px}
.sib-sl-dot{width:6px;height:6px;border-radius:50%;flex-shrink:0;animation:sibPulse 2s infinite}
.sib-sl-badges{display:flex;gap:4px;margin-top:4px;flex-wrap:wrap}
.sib-sl-badge{font-family:var(--ffm);font-size:9px;padding:2px 6px;border-radius:4px;border:1px solid}
.sib-missed-badge{font-family:var(--ffm);font-size:9px;padding:2px 7px;border-radius:10px;background:rgba(255,94,138,.12);border:1px solid rgba(255,94,138,.3);color:var(--rose);margin-left:auto;align-self:flex-start;flex-shrink:0;white-space:nowrap}

/* RIGHT PANEL */
.sib-right{flex:1;overflow-y:auto;display:flex;flex-direction:column}
.sib-empty{flex:1;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:14px;text-align:center;padding:40px}
.sib-empty-ico{font-size:3.5rem;opacity:.2}
.sib-empty-title{font-family:var(--ffh);font-size:1.4rem;color:var(--tx2);letter-spacing:.04em}
.sib-empty-sub{font-family:var(--ffm);font-size:12px;color:var(--tx3);line-height:1.6}

/* BRIEF */
.sib-brief{padding:24px 28px;animation:sibFadeUp .4s ease}
@keyframes sibFadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}

/* BRIEF HEADER */
.sib-brief-head{background:var(--bgc);border:1px solid var(--b);border-radius:18px;overflow:hidden;margin-bottom:18px}
.sib-brief-head-top{padding:20px 24px;display:flex;align-items:center;gap:16px;position:relative;overflow:hidden}
.sib-brief-head-bg{position:absolute;inset:0;pointer-events:none}
.sib-brief-av{width:56px;height:56px;border-radius:14px;display:flex;align-items:center;justify-content:center;font-family:var(--ffh);font-size:1.4rem;flex-shrink:0;border:2px solid rgba(255,255,255,.1);position:relative;z-index:1}
.sib-brief-info{flex:1;position:relative;z-index:1}
.sib-brief-name{font-family:var(--ffh);font-size:1.5rem;font-weight:800;color:#fff;letter-spacing:-.02em;margin-bottom:3px}
.sib-brief-meta{display:flex;align-items:center;gap:10px;flex-wrap:wrap}
.sib-brief-right{position:relative;z-index:1;display:flex;flex-direction:column;align-items:flex-end;gap:8px;flex-shrink:0}

/* COUNTDOWN */
.sib-countdown{background:rgba(0,212,255,.08);border:1px solid rgba(0,212,255,.25);border-radius:12px;padding:10px 16px;text-align:center}
.sib-countdown-val{font-family:var(--ffh);font-size:1.8rem;color:var(--cyan);line-height:1;text-shadow:0 0 20px rgba(0,212,255,.4)}
.sib-countdown-lbl{font-family:var(--ffm);font-size:9px;color:var(--tx2);letter-spacing:.1em;text-transform:uppercase;margin-top:1px}
.sib-countdown-time{font-family:var(--ffm);font-size:10.5px;color:var(--tx2);margin-top:2px}

/* QUICK FACTS ROW */
.sib-brief-facts{padding:12px 24px;border-top:1px solid var(--b);display:flex;gap:6px;flex-wrap:wrap;background:rgba(255,255,255,.015)}
.sib-fact{font-family:var(--ffm);font-size:10.5px;padding:4px 10px;border-radius:6px;background:rgba(255,255,255,.04);border:1px solid var(--b);color:var(--tx2)}

/* SECTION CARDS */
.sib-card{background:var(--bgc);border:1px solid var(--b);border-radius:16px;overflow:hidden;margin-bottom:16px}
.sib-card-head{padding:14px 20px;border-bottom:1px solid var(--b);display:flex;align-items:center;gap:10px}
.sib-card-title{font-family:var(--ffh);font-size:1rem;font-weight:700;color:#fff;letter-spacing:.02em}
.sib-card-sub{font-family:var(--ffm);font-size:10.5px;color:var(--tx2);margin-left:auto}
.sib-card-body{padding:16px 20px}

/* SINCE LAST SESSION */
.sib-sl-row{display:flex;gap:10px;align-items:flex-start;padding:8px 0;border-bottom:1px solid rgba(255,255,255,.04)}
.sib-sl-row:last-child{border-bottom:none}
.sib-sl-ico{font-size:.85rem;flex-shrink:0;margin-top:1px}
.sib-sl-text{font-size:13.5px;line-height:1.55;color:var(--tx2)}
.sib-sl-text.ok{color:rgba(0,229,168,.85)}
.sib-sl-text.bad{color:rgba(255,94,138,.85)}
.sib-sl-text.warn{color:rgba(255,184,0,.85)}

/* FOCUS ITEMS */
.sib-focus{background:var(--bg2);border:1px solid var(--b);border-radius:12px;padding:14px 16px;margin-bottom:10px;position:relative;overflow:hidden;transition:all .2s}
.sib-focus:hover{border-color:var(--b2)}
.sib-focus:last-child{margin-bottom:0}
.sib-focus::before{content:'';position:absolute;left:0;top:0;bottom:0;width:3px;border-radius:3px 0 0 3px}
.sib-focus-top{display:flex;align-items:flex-start;gap:10px;margin-bottom:6px}
.sib-focus-ico{font-size:1.1rem;flex-shrink:0;margin-top:1px}
.sib-focus-title{font-family:var(--ffh);font-size:.95rem;font-weight:700;color:#fff;flex:1;line-height:1.3}
.sib-focus-pri{font-family:var(--ffm);font-size:9.5px;padding:2px 8px;border-radius:4px;border:1px solid;letter-spacing:.07em;font-weight:600;flex-shrink:0}
.sib-focus-desc{font-size:13px;color:var(--tx2);line-height:1.6;padding-left:30px}

/* WORKED LAST TIME */
.sib-worked-item{display:flex;gap:9px;align-items:flex-start;padding:7px 0;border-bottom:1px solid rgba(255,255,255,.04);font-size:13px;color:var(--tx2);line-height:1.55}
.sib-worked-item:last-child{border-bottom:none}
.sib-worked-dot{width:5px;height:5px;border-radius:50%;background:var(--cyan);margin-top:6px;flex-shrink:0}

/* SESSION HISTORY */
.sib-hist-item{background:var(--bg2);border:1px solid var(--b);border-radius:11px;padding:13px 15px;margin-bottom:8px;transition:all .18s}
.sib-hist-item:hover{border-color:var(--b2)}
.sib-hist-item:last-child{margin-bottom:0}
.sib-hist-top{display:flex;align-items:center;gap:10px;margin-bottom:5px;flex-wrap:wrap}
.sib-hist-num{font-family:var(--ffh);font-size:1.1rem;color:var(--tx3);min-width:22px}
.sib-hist-topic{font-size:13px;font-weight:600;color:#fff;flex:1}
.sib-hist-date{font-family:var(--ffm);font-size:10px;color:var(--tx2)}
.sib-hist-rating{font-family:var(--ffm);font-size:10px;color:var(--gold)}
.sib-hist-prob{font-family:var(--ffm);font-size:10px;color:var(--cyan)}
.sib-hist-outcome{font-family:var(--ffm);font-size:11.5px;color:var(--tx2);line-height:1.5;padding:6px 9px;background:rgba(255,255,255,.025);border-radius:7px;border-left:2px solid rgba(0,212,255,.2)}

/* PROB METER */
.sib-prob-meter{background:var(--bg2);border:1px solid var(--b);border-radius:12px;padding:14px 16px;margin-bottom:16px}
.sib-pm-row{display:flex;align-items:center;gap:12px;margin-bottom:8px}
.sib-pm-label{font-family:var(--ffm);font-size:11px;color:var(--tx2);letter-spacing:.08em;white-space:nowrap;min-width:130px}
.sib-pm-track{flex:1;height:8px;background:rgba(255,255,255,.06);border-radius:4px;overflow:hidden;position:relative}
.sib-pm-before{position:absolute;top:0;left:0;height:100%;background:rgba(255,255,255,.15);border-radius:4px}
.sib-pm-after{position:absolute;top:0;left:0;height:100%;border-radius:4px;transition:width 1.2s cubic-bezier(.4,0,.2,1)}
.sib-pm-val{font-family:var(--ffh);font-size:1.2rem;line-height:1;min-width:50px;text-align:right}
.sib-pm-delta{font-family:var(--ffm);font-size:10px;color:var(--teal);margin-left:4px}

/* STATUS + APS + NOTES ROW */
.sib-status-row{display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin-bottom:16px}
.sib-status-box{background:var(--bg2);border:1px solid var(--b);border-radius:12px;padding:13px 14px;text-align:center}
.sib-status-box-val{font-family:var(--ffh);font-size:1rem;line-height:1.2;margin-bottom:4px;color:#fff}
.sib-status-box-lbl{font-family:var(--ffm);font-size:9.5px;color:var(--tx2);letter-spacing:.09em;text-transform:uppercase}

/* NOTES */
.sib-notes-wrap{position:relative}
.sib-notes-ta{width:100%;background:var(--bg2);border:1px solid var(--b);border-radius:10px;padding:11px 13px;color:var(--tx);font-family:var(--ffm);font-size:12.5px;line-height:1.6;outline:none;resize:none;min-height:80px;transition:border-color .2s}
.sib-notes-ta:focus{border-color:rgba(0,212,255,.35)}
.sib-notes-ta::placeholder{color:var(--tx3)}
.sib-notes-save{position:absolute;bottom:9px;right:10px;font-family:var(--ffm);font-size:10px;color:var(--cyan);background:rgba(0,212,255,.08);border:1px solid rgba(0,212,255,.25);padding:4px 11px;border-radius:6px;cursor:pointer;transition:all .2s}
.sib-notes-save:hover{background:rgba(0,212,255,.16)}

/* BADGE PILL */
.sib-pill{font-family:var(--ffm);font-size:10px;padding:3px 9px;border-radius:5px;border:1px solid;letter-spacing:.07em;display:inline-flex;align-items:center;gap:4px}

/* SESSION START CTA */
.sib-start-cta{background:linear-gradient(135deg,rgba(0,212,255,.08),rgba(0,229,168,.04));border:1px solid rgba(0,212,255,.2);border-radius:16px;padding:20px 24px;display:flex;align-items:center;justify-content:space-between;gap:16px;margin-bottom:16px}
.sib-start-info{}
.sib-start-title{font-family:var(--ffh);font-size:1.1rem;color:#fff;margin-bottom:4px;letter-spacing:.02em}
.sib-start-sub{font-family:var(--ffm);font-size:11.5px;color:var(--tx2);line-height:1.5}
.sib-start-actions{display:flex;gap:9px;flex-shrink:0}

@keyframes sibUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
.sib-a{animation:sibUp .38s ease both}
.sd1{animation-delay:.03s}.sd2{animation-delay:.06s}.sd3{animation-delay:.09s}
.sd4{animation-delay:.12s}.sd5{animation-delay:.15s}.sd6{animation-delay:.18s}

@media(max-width:900px){.sib-layout{flex-direction:column;height:auto}.sib-left{width:100%;height:auto;max-height:320px}.sib-right{min-height:60vh}}
`

// ─── COMPONENT ────────────────────────────────────────────────────────────────
export default function SessionIntelligenceBrief() {
  const [selected,  setSelected]  = useState(null)
  const [search,    setSearch]    = useState('')
  const [filter,    setFilter]    = useState('all')
  const [notes,     setNotes]     = useState({})
  const [savedNotes,setSavedNotes]= useState({})
  const [barAnim,   setBarAnim]   = useState(false)
  const [clock,     setClock]     = useState('')
  const topRef = useRef(null)

  useEffect(() => {
    const t = setInterval(() => {
      const n = new Date()
      setClock(`${String(n.getHours()).padStart(2,'0')}:${String(n.getMinutes()).padStart(2,'0')}:${String(n.getSeconds()).padStart(2,'0')}`)
    }, 1000)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    if (selected) {
      setBarAnim(false)
      setTimeout(() => setBarAnim(true), 200)
      topRef.current?.scrollTo(0, 0)
    }
  }, [selected])

  const filtered = STUDENTS.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) ||
                        s.uni.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'all' ? true :
                        filter === 'danger' ? s.status === 'danger' :
                        filter === 'warning' ? s.status === 'warning' :
                        filter === 'good' ? s.status === 'good' : true
    return matchSearch && matchFilter
  })

  const danger  = STUDENTS.filter(s => s.status === 'danger').length
  const warning = STUDENTS.filter(s => s.status === 'warning').length
  const good    = STUDENTS.filter(s => s.status === 'good').length

  const formatCountdown = (hours) => {
    if (hours < 1) return `${Math.round(hours * 60)} min`
    if (hours < 24) return `${Math.round(hours)}h`
    return `${Math.round(hours / 24)}d`
  }

  const st = selected ? STUDENTS.find(s => s.id === selected) : null
  const stStatus = st ? STATUS_MAP[st.status] : null

  return (
    <div className="sib">
      <style dangerouslySetInnerHTML={{ __html: CSS }}/>
      <div className="sib-bg"><div className="sib-orb sib-o1"/><div className="sib-orb sib-o2"/><div className="sib-orb sib-o3"/></div>
      <div className="sib-grid"/><div className="sib-noise"/>

      {/* NAV */}
      <nav className="sib-nav">
        <Link href="/dashboard/mentor" className="sib-brand">
          <div className="sib-brand-icon">
            <svg width="15" height="15" viewBox="0 0 18 18" fill="none">
              <path d="M9 2L16 9L9 16L2 9Z" fill="white" fillOpacity=".92"/>
            </svg>
          </div>
          <span className="sib-brand-name">MentorBridge</span>
        </Link>
        <div className="sib-nav-div"/>
        <div>
          <div className="sib-nav-title">SESSION INTELLIGENCE</div>
          <div className="sib-nav-sub">MENTOR BRIEFING SYSTEM · {STUDENTS.length} ACTIVE STUDENTS</div>
        </div>
        <div className="sib-nav-sp"/>
        <div className="sib-nav-live"><div className="sib-live-dot"/>LIVE · {clock}</div>
        {danger > 0 && (
          <div className="sib-pill" style={{color:'var(--rose)',background:'rgba(255,94,138,.1)',borderColor:'rgba(255,94,138,.3)',animation:'sibPulse 2s infinite'}}>
            ⚠ {danger} Needs Attention
          </div>
        )}
        <Link href="/dashboard/mentor" className="sib-btn sib-btn-ghost sib-btn-sm" style={{fontSize:13}}>← Dashboard</Link>
      </nav>

      <div className="sib-layout">

        {/* ── LEFT: STUDENT LIST ── */}
        <aside className="sib-left">
          <div className="sib-left-head">
            <div className="sib-left-title">Your Students</div>
            <div className="sib-search">
              <span style={{color:'var(--tx3)',fontSize:12}}>🔍</span>
              <input placeholder="Search by name or university..." value={search}
                onChange={e => setSearch(e.target.value)}/>
            </div>
            <div className="sib-filter-row">
              {[
                ['all',    `All (${STUDENTS.length})`],
                ['danger', `⚠ ${danger}`],
                ['warning',`📋 ${warning}`],
                ['good',   `✅ ${good}`],
              ].map(([v,l]) => (
                <button key={v} className={`sib-filter${filter===v?' on':''}`} onClick={() => setFilter(v)}>{l}</button>
              ))}
            </div>
          </div>

          <div className="sib-student-list">
            {filtered.map(s => {
              const sm = STATUS_MAP[s.status]
              return (
                <div key={s.id} className={`sib-sl-item${selected===s.id?' active':''}`}
                  onClick={() => setSelected(s.id)}>
                  <div className="sib-sl-av" style={{background:s.bg,color:s.tc}}>{s.initials}</div>
                  <div className="sib-sl-info">
                    <div style={{display:'flex',alignItems:'center',gap:6}}>
                      <div className="sib-sl-name">{s.name}</div>
                      {s.missedDeadlines > 0 && (
                        <span className="sib-missed-badge">{s.missedDeadlines} missed</span>
                      )}
                    </div>
                    <div className="sib-sl-uni">
                      <FlagImg iso={s.iso} size={12}/>
                      <span>{s.uni}</span>
                    </div>
                    <div className="sib-sl-next" style={{color:sm.col}}>
                      <div className="sib-sl-dot" style={{background:sm.col,boxShadow:`0 0 5px ${sm.col}`}}/>
                      {s.nextSessionLabel}
                    </div>
                    <div className="sib-sl-badges">
                      <span className="sib-sl-badge" style={{color:sm.col,borderColor:`${sm.col}44`,background:`${sm.col}0f`}}>
                        {sm.label}
                      </span>
                      <span className="sib-sl-badge" style={{color:'var(--tx3)',borderColor:'var(--b)',background:'transparent'}}>
                        Session {s.sessions}
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </aside>

        {/* ── RIGHT: BRIEF PANEL ── */}
        <div className="sib-right" ref={topRef}>
          {!st ? (
            <div className="sib-empty">
              <div className="sib-empty-ico">🧠</div>
              <div className="sib-empty-title">Select a Student</div>
              <div className="sib-empty-sub">
                Click any student on the left to see their full<br/>
                session intelligence brief — generated automatically<br/>
                from their progress, deadlines, and risk profile.
              </div>
              <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:12,marginTop:16,maxWidth:480}}>
                {[
                  {ico:'⚠',n:danger,lbl:'Need Attention',col:'var(--rose)'},
                  {ico:'📋',n:warning,lbl:'Monitor Closely',col:'var(--gold)'},
                  {ico:'✅',n:good,lbl:'On Track',col:'var(--teal)'},
                ].map(x=>(
                  <div key={x.lbl} style={{background:'var(--bgc)',border:'1px solid var(--b)',borderRadius:12,padding:'14px',textAlign:'center'}}>
                    <div style={{fontFamily:'var(--ffh)',fontSize:'2rem',color:x.col,lineHeight:1,marginBottom:4}}>{x.n}</div>
                    <div style={{fontFamily:'var(--ffm)',fontSize:10,color:'var(--tx2)',letterSpacing:'.08em'}}>{x.lbl}</div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="sib-brief">

              {/* START SESSION CTA */}
              <div className={`sib-start-cta sib-a sd1`}>
                <div className="sib-start-info">
                  <div className="sib-start-title">
                    Session with {st.name} — {st.nextSessionLabel}
                  </div>
                  <div className="sib-start-sub">
                    Session #{st.sessions + 1} · {st.sessions > 0 ? `Last session: ${st.lastSession} days ago` : 'First session'} · {st.program}
                  </div>
                </div>
                <div className="sib-start-actions">
                  <button className="sib-btn sib-btn-ghost" style={{fontSize:13,padding:'8px 16px'}}>📋 Copy Brief</button>
                  <button className="sib-btn sib-btn-primary" style={{fontSize:13,padding:'8px 18px'}}>🎥 Start Session →</button>
                </div>
              </div>

              {/* HEADER CARD */}
              <div className={`sib-brief-head sib-a sd1`}>
                <div className="sib-brief-head-top">
                  <div className="sib-brief-head-bg" style={{background:`radial-gradient(ellipse at 0% 50%,${st.tc}12,transparent 60%)`}}/>
                  <div className="sib-brief-av" style={{background:st.bg,color:st.tc}}>{st.initials}</div>
                  <div className="sib-brief-info">
                    <div className="sib-brief-name">{st.name}</div>
                    <div className="sib-brief-meta">
                      <FlagImg iso={st.iso} size={16}/>
                      <span style={{fontSize:13,color:'var(--tx2)'}}>{st.uni} · {st.program}</span>
                      <span className="sib-pill" style={{color:stStatus.col,background:stStatus.bg,borderColor:stStatus.bdr}}>
                        {stStatus.label}
                      </span>
                      <span className="sib-pill" style={{color:RISK_MAP[st.riskLevel].col,background:`${RISK_MAP[st.riskLevel].col}10`,borderColor:`${RISK_MAP[st.riskLevel].col}35`}}>
                        {RISK_MAP[st.riskLevel].label}
                      </span>
                    </div>
                  </div>
                  <div className="sib-brief-right">
                    <div className="sib-countdown">
                      <div className="sib-countdown-val">{formatCountdown(st.nextSession)}</div>
                      <div className="sib-countdown-lbl">Until Session</div>
                      <div className="sib-countdown-time">{st.nextSessionLabel}</div>
                    </div>
                    <div style={{fontFamily:'var(--ffm)',fontSize:10,color:'var(--tx2)',textAlign:'right',lineHeight:1.6}}>
                      Session #{st.sessions + 1} of plan<br/>
                      {st.intake} intake<br/>
                      {st.daysToDeadline} days to deadline
                    </div>
                  </div>
                </div>
                <div className="sib-brief-facts">
                  {st.quickFacts.map((f,i) => <span key={i} className="sib-fact">{f}</span>)}
                </div>
              </div>

              {/* PROBABILITY METER */}
              <div className={`sib-prob-meter sib-a sd2`}>
                <div style={{fontFamily:'var(--ffm)',fontSize:10,color:st.tc,letterSpacing:'.12em',textTransform:'uppercase',marginBottom:12,display:'flex',alignItems:'center',gap:8}}>
                  <span>📈</span> ADMISSION PROBABILITY TRACKER
                </div>
                <div className="sib-pm-row">
                  <div className="sib-pm-label">Current Probability</div>
                  <div className="sib-pm-track">
                    <div className="sib-pm-before" style={{width:`${st.probBefore}%`}}/>
                    <div className="sib-pm-after" style={{width:barAnim?`${st.probNow}%`:'0%',background:`linear-gradient(90deg,${st.tc}88,${st.tc})`}}/>
                  </div>
                  <div className="sib-pm-val" style={{color:st.tc}}>{st.probNow}%
                    <span className="sib-pm-delta"> +{st.probNow - st.probBefore}</span>
                  </div>
                </div>
                <div style={{display:'flex',justifyContent:'space-between',fontFamily:'var(--ffm)',fontSize:10.5,color:'var(--tx2)',marginTop:6}}>
                  <span>Session 1: {st.probBefore}% → Now: {st.probNow}% — improved by <strong style={{color:'var(--teal)'}}>+{st.probNow - st.probBefore} points</strong> across {st.sessions} sessions</span>
                  <span style={{color:st.daysToDeadline < 30 ? 'var(--rose)' : 'var(--tx2)'}}>{st.daysToDeadline} days to next deadline</span>
                </div>
              </div>

              {/* STATUS ROW */}
              <div className={`sib-status-row sib-a sd2`}>
                {[
                  { lbl:'APS Status',    val:st.apsStatus,  ok:st.apsStatus==='Cleared', warn:st.apsStatus==='In Progress' },
                  { lbl:'SOP Status',    val:st.sopStatus,  ok:st.sopStatus==='Submitted'||st.sopStatus==='Final review', warn:st.sopStatus?.includes('%') },
                  { lbl:'Blocked Acct', val:st.blockedAcc, ok:st.blockedAcc==='Opened'||st.blockedAcc?.includes('€'), warn:false },
                ].map((b,i) => {
                  const col = b.ok ? 'var(--teal)' : b.warn ? 'var(--gold)' : 'var(--rose)'
                  return (
                    <div key={i} className="sib-status-box" style={{borderColor:b.ok?'rgba(0,229,168,.2)':b.warn?'rgba(255,184,0,.2)':'rgba(255,94,138,.2)'}}>
                      <div className="sib-status-box-val" style={{color:col}}>{b.val}</div>
                      <div className="sib-status-box-lbl">{b.lbl}</div>
                    </div>
                  )
                })}
              </div>

              {/* SINCE LAST SESSION */}
              <div className={`sib-card sib-a sd3`}>
                <div className="sib-card-head">
                  <span style={{fontSize:'1rem'}}>📡</span>
                  <div className="sib-card-title">Since Your Last Session</div>
                  <div className="sib-card-sub">{st.lastSession} days ago</div>
                </div>
                <div className="sib-card-body">
                  {st.sinceLastSession.map((item, i) => (
                    <div key={i} className="sib-sl-row">
                      <span className="sib-sl-ico">
                        {item.type==='ok'?'✅':item.type==='bad'?'❌':'⚠️'}
                      </span>
                      <span className={`sib-sl-text ${item.type}`}>{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* SUGGESTED FOCUS */}
              <div className={`sib-card sib-a sd3`}>
                <div className="sib-card-head">
                  <span style={{fontSize:'1rem'}}>🎯</span>
                  <div className="sib-card-title">Suggested Focus Today</div>
                  <div className="sib-card-sub">{st.focusToday.length} priorities</div>
                </div>
                <div className="sib-card-body">
                  {st.focusToday.map((f, i) => {
                    const pm = PRIORITY_MAP[f.priority]
                    return (
                      <div key={i} className="sib-focus" style={{'--f-col':pm.col}}>
                        <div style={{position:'absolute',left:0,top:0,bottom:0,width:3,background:pm.col,borderRadius:'3px 0 0 3px'}}/>
                        <div style={{paddingLeft:8}}>
                          <div className="sib-focus-top">
                            <span className="sib-focus-ico">{f.icon}</span>
                            <div className="sib-focus-title">{f.title}</div>
                            <span className="sib-focus-pri" style={{color:pm.col,background:pm.bg,borderColor:pm.bdr}}>
                              {pm.label}
                            </span>
                          </div>
                          <div className="sib-focus-desc">{f.desc}</div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* WHAT WORKED + SESSION HISTORY */}
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16,marginBottom:16}}>
                <div className={`sib-card sib-a sd4`} style={{marginBottom:0}}>
                  <div className="sib-card-head">
                    <span style={{fontSize:'1rem'}}>💡</span>
                    <div className="sib-card-title">What Worked Last Time</div>
                  </div>
                  <div className="sib-card-body">
                    {st.workedLastTime.map((w, i) => (
                      <div key={i} className="sib-worked-item">
                        <div className="sib-worked-dot"/>
                        <span>{w}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className={`sib-card sib-a sd4`} style={{marginBottom:0}}>
                  <div className="sib-card-head">
                    <span style={{fontSize:'1rem'}}>📋</span>
                    <div className="sib-card-title">Mentor Notes</div>
                    <div className="sib-card-sub">Private — only you see this</div>
                  </div>
                  <div className="sib-card-body">
                    {st.note && !notes[st.id] && (
                      <div style={{fontFamily:'var(--ffm)',fontSize:11.5,color:'rgba(0,212,255,.75)',padding:'8px 10px',background:'rgba(0,212,255,.04)',border:'1px solid rgba(0,212,255,.12)',borderRadius:8,marginBottom:9,lineHeight:1.55}}>
                        💡 {st.note}
                      </div>
                    )}
                    <div className="sib-notes-wrap">
                      <textarea
                        className="sib-notes-ta"
                        placeholder="Add private notes about this student — strategy, observations, follow-ups..."
                        value={notes[st.id] || ''}
                        onChange={e => setNotes(p => ({...p,[st.id]:e.target.value}))}
                        rows={4}
                      />
                      {notes[st.id] && (
                        <button className="sib-notes-save"
                          onClick={() => {
                            setSavedNotes(p => ({...p,[st.id]:notes[st.id]}))
                          }}>
                          {savedNotes[st.id] === notes[st.id] ? '✓ Saved' : 'Save →'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* SESSION HISTORY */}
              <div className={`sib-card sib-a sd5`}>
                <div className="sib-card-head">
                  <span style={{fontSize:'1rem'}}>⏱</span>
                  <div className="sib-card-title">Session History</div>
                  <div className="sib-card-sub">{st.sessions} sessions completed</div>
                </div>
                <div className="sib-card-body">
                  {st.sessionHistory.map((h, i) => (
                    <div key={i} className="sib-hist-item">
                      <div className="sib-hist-top">
                        <div className="sib-hist-num" style={{color:i===0?st.tc:'var(--tx3)'}}>#{h.num}</div>
                        <div className="sib-hist-topic">{h.topic}</div>
                        <div className="sib-hist-date">{h.date}</div>
                        <div className="sib-hist-rating">★ {h.rating}</div>
                        <div className="sib-hist-prob">{h.probThen}% then</div>
                      </div>
                      <div className="sib-hist-outcome">{h.outcome}</div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  )
}