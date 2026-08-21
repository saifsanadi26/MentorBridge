'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

// ─── FLAG IMAGES ──────────────────────────────────────────────────────────────
const FlagImg = ({ iso, size = 22 }) => (
  <img src={`https://flagcdn.com/w${size * 2}/${iso}.png`}
    width={size} height={Math.round(size * 0.67)} alt={iso}
    style={{ borderRadius: 3, objectFit: 'cover', border: '1px solid rgba(255,255,255,.15)', display: 'inline-block', flexShrink: 0 }}
    onError={e => { e.currentTarget.style.display = 'none' }}
  />
)

// ─── FAKE STUDENT DATA (14 students) ─────────────────────────────────────────
const STUDENTS = [
  { id:1,  name:'Rahul Sharma',    initials:'RS', bg:'#1a3a5c', tc:'#00D4FF', uni:'TU Munich',      iso:'de', program:'MSc Computer Science',      intake:'Winter 2024', status:'admitted',    sessions:6, probBefore:29, probAfter:74, scholarship:'DAAD Scholarship',       schVal:'€12,000', achievement:'First TUM CS offer in our cohort — received Jan 15, 2024', city:'Munich' },
  { id:2,  name:'Priya Kapoor',    initials:'PK', bg:'#3a1f5c', tc:'#8B7FFF', uni:'RWTH Aachen',    iso:'de', program:'MSc Data Science',           intake:'Winter 2024', status:'admitted',    sessions:5, probBefore:35, probAfter:68, scholarship:'RWTH Merit Award',        schVal:'€8,400',  achievement:'Top 12% of RWTH international applicants in 2024', city:'Aachen' },
  { id:3,  name:'Arjun Mehta',     initials:'AM', bg:'#1f4a2a', tc:'#00E5A8', uni:'TU Berlin',      iso:'de', program:'MSc Artificial Intelligence', intake:'Summer 2025', status:'admitted',    sessions:4, probBefore:41, probAfter:78, scholarship:'TU Berlin Scholarship',   schVal:'€6,000',  achievement:'Received offer 3 weeks faster than expected timeline', city:'Berlin' },
  { id:4,  name:'Sneha Patel',     initials:'SP', bg:'#4a2a1f', tc:'#FFB800', uni:'KIT Karlsruhe',  iso:'de', program:'MSc Computer Science',      intake:'Winter 2025', status:'admitted',    sessions:7, probBefore:27, probAfter:65, scholarship:'KIT Excellence Grant',    schVal:'€9,600',  achievement:'Profile transformed from 27% to 65% in 8 weeks', city:'Karlsruhe' },
  { id:5,  name:'Vikram Singh',    initials:'VS', bg:'#2a1a4a', tc:'#8B7FFF', uni:'LMU Munich',     iso:'de', program:'MSc Data Science',           intake:'Winter 2025', status:'admitted',    sessions:5, probBefore:33, probAfter:72, scholarship:'None (tuition-free)',     schVal:'€0/yr',   achievement:'Secured LMU DS — admitted despite GPA below median', city:'Munich' },
  { id:6,  name:'Ananya Rao',      initials:'AR', bg:'#1f3a3a', tc:'#00D4FF', uni:'TU Munich',      iso:'de', program:'MSc Robotics',               intake:'Summer 2025', status:'admitted',    sessions:6, probBefore:38, probAfter:76, scholarship:'DAAD Study Scholarship',  schVal:'€15,600', achievement:'One of 8 Indian students admitted to TUM Robotics 2025', city:'Munich' },
  { id:7,  name:'Rohan Gupta',     initials:'RG', bg:'#3a3a1f', tc:'#FFB800', uni:'TU Munich',      iso:'de', program:'MSc Computer Science',      intake:'Winter 2026', status:'progress',    sessions:3, probBefore:31, probAfter:58, scholarship:'Pending DAAD review',    schVal:'TBD',     achievement:'APS cleared in 6 weeks — on track for Winter 2026', city:'Munich' },
  { id:8,  name:'Divya Nair',      initials:'DN', bg:'#1a4a3a', tc:'#00E5A8', uni:'RWTH Aachen',    iso:'de', program:'MSc Mechanical Engineering', intake:'Winter 2025', status:'admitted',    sessions:4, probBefore:44, probAfter:81, scholarship:'RWTH Engineering Award', schVal:'€7,200',  achievement:'Highest probability increase in our cohort (+37 points)', city:'Aachen' },
  { id:9,  name:'Karan Malhotra',  initials:'KM', bg:'#4a1f1f', tc:'#FF5E8A', uni:'TU Berlin',      iso:'de', program:'MSc Artificial Intelligence', intake:'Summer 2026', status:'progress',    sessions:2, probBefore:28, probAfter:51, scholarship:'Applying for DAAD',      schVal:'TBD',     achievement:'SOP completed — university application submitted', city:'Berlin' },
  { id:10, name:'Ishaan Verma',    initials:'IV', bg:'#1f2a4a', tc:'#00D4FF', uni:'TU Munich',      iso:'de', program:'MSc Data Engineering',       intake:'Winter 2024', status:'admitted',    sessions:5, probBefore:36, probAfter:69, scholarship:'None (tuition-free)',     schVal:'€0/yr',   achievement:'Converted from waitlist to full admit in 3 weeks', city:'Munich' },
  { id:11, name:'Meera Iyer',      initials:'MI', bg:'#2a4a1f', tc:'#00E5A8', uni:'KIT Karlsruhe',  iso:'de', program:'MSc Electrical Engineering',  intake:'Summer 2025', status:'admitted',    sessions:4, probBefore:42, probAfter:77, scholarship:'KIT Spark Scholarship',   schVal:'€8,000',  achievement:'KIT offer received 2 months before intake deadline', city:'Karlsruhe' },
  { id:12, name:'Aditya Kumar',    initials:'AK', bg:'#3a1a3a', tc:'#8B7FFF', uni:'TU Munich',      iso:'de', program:'MSc Informatics',             intake:'Winter 2024', status:'admitted',    sessions:6, probBefore:30, probAfter:67, scholarship:'DAAD Development Aid',   schVal:'€11,400', achievement:'DAAD + TUM admission — fully funded degree secured', city:'Munich' },
  { id:13, name:'Pooja Sharma',    initials:'PS', bg:'#4a3a1f', tc:'#FFB800', uni:'RWTH Aachen',    iso:'de', program:'MSc Computer Science',      intake:'Winter 2026', status:'progress',    sessions:2, probBefore:35, probAfter:54, scholarship:'Researching options',    schVal:'TBD',     achievement:'Language barrier resolved — now applying B1 German', city:'Aachen' },
  { id:14, name:'Nikhil Joshi',    initials:'NJ', bg:'#1f4a4a', tc:'#00D4FF', uni:'TU Dresden',     iso:'de', program:'MSc Computer Science',      intake:'Summer 2025', status:'admitted',    sessions:3, probBefore:48, probAfter:82, scholarship:'TU Dresden Merit',       schVal:'€5,400',  achievement:'Fastest admit in cohort — 11 weeks from first session to offer', city:'Dresden' },
]

// ─── BADGES DATA ──────────────────────────────────────────────────────────────
const BADGES = [
  { id:'tum',    earned:true,  icon:'🏆', title:'TU Munich Specialist',    desc:'5 students admitted to TU Munich',         col:'#00D4FF', count:'5 Admits',      detail:'Highest admit rate: 83%' },
  { id:'aps',    earned:true,  icon:'⚡', title:'APS Expert',              desc:'9 students cleared APS under guidance',    col:'#FFB800', count:'9 Cleared',     detail:'Avg processing: 7 weeks' },
  { id:'daad',   earned:true,  icon:'💰', title:'DAAD Scholarship Coach',  desc:'4 students funded via DAAD',               col:'#00E5A8', count:'€48,000 Won',   detail:'100% application success' },
  { id:'trans',  earned:true,  icon:'🚀', title:'Profile Transformer',     desc:'Avg probability increase of +34 points',   col:'#8B7FFF', count:'Avg +34 pts',   detail:'Max improvement: +45 pts' },
  { id:'top10',  earned:true,  icon:'⭐', title:'Top 10 Mentor',           desc:'Platform-wide top 10 for 3 months',        col:'#FF5E8A', count:'#3 Overall',    detail:'Rated 4.97 / 5.0' },
  { id:'speed',  earned:false, icon:'⚡', title:'Lightning Closer',        desc:'3 admits in under 8 weeks each',           col:'#00D4FF', count:'1 of 3 done',   detail:'Need 2 more quick admits' },
  { id:'intl',   earned:false, icon:'🌍', title:'Multi-Country Specialist', desc:'Help students in 3+ different countries', col:'#8B7FFF', count:'1 of 3 done',   detail:'Currently: Germany only' },
  { id:'100k',   earned:false, icon:'💎', title:'Million Maker',           desc:'Help students unlock €1M+ scholarships',  col:'#FFB800', count:'€86K / €1M',    detail:'Keep going — you are close' },
]

// ─── MONTHLY CHART DATA ───────────────────────────────────────────────────────
const MONTHLY = [
  { month:'May',  sessions:3, admits:1 },
  { month:'Jun',  sessions:4, admits:2 },
  { month:'Jul',  sessions:5, admits:1 },
  { month:'Aug',  sessions:6, admits:3 },
  { month:'Sep',  sessions:7, admits:2 },
  { month:'Oct',  sessions:8, admits:3 },
  { month:'Nov',  sessions:9, admits:2 },
  { month:'Dec',  sessions:7, admits:2 },
  { month:'Jan',  sessions:10,admits:4 },
  { month:'Feb',  sessions:11,admits:3 },
  { month:'Mar',  sessions:12,admits:4 },
  { month:'Apr',  sessions:9, admits:3 },
]

// ─── LEADERBOARD DATA ─────────────────────────────────────────────────────────
const LEADERBOARD = [
  { rank:1, name:'Kavya Reddy',    specialty:'UK / Ireland', admits:19, rating:4.99, you:false },
  { rank:2, name:'Rohan Desai',    specialty:'Germany',      admits:17, rating:4.98, you:false },
  { rank:3, name:'Aarav Mehta',    specialty:'Germany',      admits:14, rating:4.97, you:true  },
  { rank:4, name:'Priyanka Nair',  specialty:'USA / Canada', admits:13, rating:4.95, you:false },
  { rank:5, name:'Sameer Patel',   specialty:'Australia',    admits:12, rating:4.94, you:false },
]

// ─── TIMELINE MILESTONES ─────────────────────────────────────────────────────
const TIMELINE = [
  { date:'Apr 2026', icon:'⭐', col:'#FFB800', title:'Ranked #3 of 47 Germany Mentors', desc:'Highest monthly sessions record: 12 in March 2026' },
  { date:'Mar 2026', icon:'🏆', col:'#00D4FF', title:'5th TU Munich Admit Unlocked', desc:'Ananya Rao admitted to TUM Robotics — fully DAAD-funded' },
  { date:'Feb 2026', icon:'💰', col:'#00E5A8', title:'€86,000 Total Scholarship Value Crossed', desc:'Aditya Kumar\'s DAAD grant pushed total over this milestone' },
  { date:'Jan 2026', icon:'🚀', col:'#8B7FFF', title:'Profile Transformer Badge Earned', desc:'Average probability increase across all students crossed +34 points' },
  { date:'Dec 2025', icon:'✅', col:'#00E5A8', title:'10th Student Admitted', desc:'Ishaan Verma converted from TU Munich waitlist to full admit' },
  { date:'Oct 2025', icon:'⚡', col:'#FFB800', title:'APS Expert Badge Earned', desc:'9th student cleared APS under guidance — Divya Nair in 5 weeks' },
  { date:'Aug 2025', icon:'💰', col:'#00D4FF', title:'DAAD Coach Badge Earned', desc:'4th DAAD application approved — 100% DAAD success rate' },
  { date:'Jun 2025', icon:'🎓', col:'#00E5A8', title:'First 5 Admits Milestone', desc:'Half the cohort admitted — across 4 different German universities' },
]

// ─── UNIVERSITY BREAKDOWN ─────────────────────────────────────────────────────
const UNI_BREAKDOWN = [
  { name:'TU Munich',     iso:'de', admits:5, inProgress:1, total:6, col:'#00D4FF' },
  { name:'RWTH Aachen',   iso:'de', admits:2, inProgress:2, total:4, col:'#8B7FFF' },
  { name:'KIT Karlsruhe', iso:'de', admits:2, inProgress:0, total:2, col:'#00E5A8' },
  { name:'TU Berlin',     iso:'de', admits:1, inProgress:1, total:2, col:'#FF5E8A' },
  { name:'LMU Munich',    iso:'de', admits:1, inProgress:0, total:1, col:'#FFB800' },
  { name:'TU Dresden',    iso:'de', admits:1, inProgress:0, total:1, col:'#A78BFA' },
]

// ─── ANIMATED COUNTER HOOK ────────────────────────────────────────────────────
function useCounter(target, duration = 1800, delay = 0) {
  const [count, setCount] = useState(0)
  const started = useRef(false)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (started.current) return
      started.current = true
      let start = null
      const step = (ts) => {
        if (!start) start = ts
        const p = Math.min((ts - start) / duration, 1)
        const eased = 1 - Math.pow(1 - p, 3)
        setCount(Math.round(eased * target))
        if (p < 1) requestAnimationFrame(step)
      }
      requestAnimationFrame(step)
    }, delay)
    return () => clearTimeout(timer)
  }, [target, duration, delay])
  return count
}

// ─── CSS ──────────────────────────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&family=JetBrains+Mono:wght@400;500&display=swap');

.mis {
  --bg:#07090F; --bg2:#0B0E18; --bg3:#10131E; --bgc:#0E1120;
  --b:rgba(255,255,255,.07); --b2:rgba(255,255,255,.13);
  --cyan:#00D4FF; --teal:#00E5A8; --violet:#8B7FFF;
  --gold:#FFB800; --rose:#FF5E8A; --purple:#A78BFA;
  --tx:#E8EAF6; --tx2:#7A7F99; --tx3:#40455C;
  --ffh:'Syne',sans-serif; --ffb:'DM Sans',sans-serif; --ffm:'JetBrains Mono',monospace;
  background:var(--bg); color:var(--tx); font-family:var(--ffb);
  min-height:100vh; overflow-x:hidden; -webkit-font-smoothing:antialiased;
}
.mis *, .mis *::before, .mis *::after { box-sizing:border-box; margin:0; padding:0; }
.mis a { text-decoration:none; color:inherit; }
.mis button { cursor:pointer; font-family:var(--ffb); border:none; }
.mis img { display:block; }
.mis ::-webkit-scrollbar { width:5px; background:var(--bg); }
.mis ::-webkit-scrollbar-thumb { background:rgba(255,255,255,.1); border-radius:4px; }

/* BG */
.mis-canvas { position:fixed; inset:0; z-index:0; pointer-events:none; overflow:hidden; }
.mis-orb { position:absolute; border-radius:50%; filter:blur(130px); animation:misDrift 20s ease-in-out infinite alternate; }
.mis-o1 { width:700px; height:700px; background:radial-gradient(circle,rgba(0,212,255,.14),transparent 70%); top:-200px; left:-150px; }
.mis-o2 { width:600px; height:600px; background:radial-gradient(circle,rgba(139,127,255,.12),transparent 70%); bottom:-100px; right:-100px; animation-delay:-8s; }
.mis-o3 { width:400px; height:400px; background:radial-gradient(circle,rgba(0,229,168,.08),transparent 70%); top:40%; left:40%; animation-delay:-4s; }
@keyframes misDrift { 0%{transform:translate(0,0) scale(1)} 100%{transform:translate(40px,30px) scale(1.05)} }
.mis-grid { position:fixed; inset:0; z-index:0; pointer-events:none;
  background-image:linear-gradient(rgba(255,255,255,.025) 1px,transparent 1px),
    linear-gradient(90deg,rgba(255,255,255,.025) 1px,transparent 1px);
  background-size:60px 60px;
  mask-image:radial-gradient(ellipse 80% 60% at 50% 0%,black 40%,transparent 100%); }
.mis-noise { position:fixed; inset:0; z-index:0; pointer-events:none; opacity:.03;
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E"); }

/* NAV */
.mis-nav { position:sticky; top:0; z-index:200; height:62px; display:flex; align-items:center;
  padding:0 48px; background:rgba(7,9,15,.85); backdrop-filter:blur(24px) saturate(160%);
  border-bottom:1px solid var(--b); gap:0; }
.mis-brand { display:flex; align-items:center; gap:10px; margin-right:28px; text-decoration:none; }
.mis-brand-icon { width:34px; height:34px; background:linear-gradient(135deg,var(--cyan),var(--teal));
  border-radius:10px; display:flex; align-items:center; justify-content:center;
  box-shadow:0 0 20px rgba(0,212,255,.35); flex-shrink:0; }
.mis-brand-name { font-family:var(--ffh); font-size:17px; font-weight:700; letter-spacing:-.03em;
  background:linear-gradient(135deg,#fff 30%,rgba(0,212,255,.8));
  -webkit-background-clip:text; -webkit-text-fill-color:transparent; }
.mis-nav-sp { flex:1; }
.mis-nav-btn { display:inline-flex; align-items:center; gap:7px; padding:8px 18px;
  border-radius:10px; font-size:13.5px; font-weight:500; transition:all .2s; }
.mis-nav-ghost { background:transparent; border:1px solid var(--b2); color:var(--tx); }
.mis-nav-ghost:hover { border-color:rgba(255,255,255,.28); background:rgba(255,255,255,.06); }
.mis-nav-primary { background:linear-gradient(135deg,var(--cyan),var(--teal)); color:#060A12; font-weight:700; box-shadow:0 0 24px rgba(0,212,255,.3); }
.mis-nav-primary:hover { box-shadow:0 0 40px rgba(0,212,255,.5); transform:translateY(-1px); }

/* WRAP */
.mis-wrap { position:relative; z-index:1; max-width:1280px; margin:0 auto; padding:0 48px 80px; }

/* ── HERO SECTION ── */
.mis-hero { padding:52px 0 44px; }
.mis-hero-top { display:grid; grid-template-columns:auto 1fr; gap:32px; align-items:start; margin-bottom:44px; }
.mis-mentor-card { background:var(--bgc); border:1px solid var(--b); border-radius:20px; padding:24px; width:280px; position:relative; overflow:hidden; }
.mis-mentor-card::before { content:''; position:absolute; top:0; left:0; right:0; height:2px;
  background:linear-gradient(90deg,var(--cyan),var(--teal),var(--violet)); }
.mis-mentor-av { width:64px; height:64px; border-radius:16px; background:linear-gradient(135deg,#1a3a5c,#2a6090);
  display:flex; align-items:center; justify-content:center; font-family:var(--ffh); font-size:1.6rem; color:var(--cyan);
  box-shadow:0 0 20px rgba(0,212,255,.25); margin-bottom:14px; }
.mis-mentor-name { font-family:var(--ffh); font-size:1.4rem; font-weight:800; color:#fff; letter-spacing:-.02em; margin-bottom:3px; }
.mis-mentor-role { font-size:13px; color:var(--tx2); margin-bottom:12px; }
.mis-mentor-tags { display:flex; flex-wrap:wrap; gap:6px; margin-bottom:14px; }
.mis-mentor-tag { font-family:var(--ffm); font-size:10px; padding:3px 9px; border-radius:20px;
  border:1px solid; letter-spacing:.06em; }
.mis-mentor-stars { display:flex; gap:2px; align-items:center; margin-bottom:4px; }
.mis-star { color:var(--gold); font-size:.85rem; }
.mis-rating-txt { font-family:var(--ffm); font-size:12px; color:var(--tx2); margin-left:6px; }
.mis-joined { font-family:var(--ffm); font-size:11px; color:var(--tx3); }
.mis-hero-right { display:flex; flex-direction:column; gap:16px; }
.mis-eyebrow { font-family:var(--ffm); font-size:11px; letter-spacing:.14em; text-transform:uppercase;
  color:var(--teal); display:flex; align-items:center; gap:8px; margin-bottom:6px; }
.mis-eyebrow::before { content:''; width:20px; height:1px; background:var(--teal); }
.mis-hero-title { font-family:var(--ffh); font-size:clamp(32px,4vw,56px); font-weight:800; line-height:1.04; letter-spacing:-.04em; margin-bottom:8px; }
.mis-hero-title-w { color:#fff; display:block; }
.mis-hero-title-g { display:block;
  background:linear-gradient(135deg,var(--cyan) 0%,var(--teal) 50%,var(--violet) 100%);
  -webkit-background-clip:text; -webkit-text-fill-color:transparent;
  background-size:200% auto; animation:misGS 4s ease infinite alternate; }
@keyframes misGS { 0%{background-position:0% center} 100%{background-position:100% center} }
.mis-hero-sub { font-size:15px; color:var(--tx2); line-height:1.65; max-width:480px; }

/* STAT CARDS */
.mis-stats { display:grid; grid-template-columns:repeat(5,1fr); gap:14px; }
.mis-stat { background:var(--bgc); border:1px solid var(--b); border-radius:16px; padding:20px;
  position:relative; overflow:hidden; transition:all .25s; }
.mis-stat:hover { transform:translateY(-3px); border-color:var(--b2); box-shadow:0 12px 32px rgba(0,0,0,.4); }
.mis-stat::after { content:''; position:absolute; bottom:0; left:0; right:0; height:2px; border-radius:0 0 16px 16px; }
.mis-stat-val { font-family:var(--ffh); font-size:2.2rem; font-weight:800; letter-spacing:-.02em; line-height:1; margin-bottom:4px; }
.mis-stat-lbl { font-family:var(--ffm); font-size:10.5px; color:var(--tx2); letter-spacing:.1em; text-transform:uppercase; margin-bottom:8px; }
.mis-stat-delta { display:inline-flex; align-items:center; gap:4px; font-family:var(--ffm); font-size:10px;
  padding:3px 8px; border-radius:20px; border:1px solid; letter-spacing:.05em; }

/* RANK SECTION */
.mis-two-col { display:grid; grid-template-columns:1fr 1fr; gap:20px; margin-bottom:36px; }
.mis-section-box { background:var(--bgc); border:1px solid var(--b); border-radius:18px; overflow:hidden; }
.mis-section-head { padding:18px 22px; border-bottom:1px solid var(--b); display:flex; align-items:center; justify-content:space-between; }
.mis-section-title { font-family:var(--ffh); font-size:1.1rem; font-weight:800; letter-spacing:.02em; color:#fff; display:flex; align-items:center; gap:9px; }
.mis-section-sub { font-family:var(--ffm); font-size:11px; color:var(--tx2); letter-spacing:.08em; }
.mis-section-body { padding:20px 22px; }

/* RANK DISPLAY */
.mis-rank-hero { display:flex; align-items:center; gap:20px; margin-bottom:18px; }
.mis-rank-num { font-family:var(--ffh); font-size:5rem; font-weight:800; color:var(--gold); line-height:1; text-shadow:0 0 40px rgba(255,184,0,.4); }
.mis-rank-info { }
.mis-rank-of { font-family:var(--ffh); font-size:1.5rem; font-weight:800; color:#fff; margin-bottom:2px; }
.mis-rank-lbl { font-family:var(--ffm); font-size:11px; color:var(--tx2); letter-spacing:.1em; }
.mis-rank-bar-wrap { margin-bottom:14px; }
.mis-rank-bar-lbl { display:flex; justify-content:space-between; font-family:var(--ffm); font-size:10px; color:var(--tx2); margin-bottom:5px; }
.mis-rank-track { height:7px; background:rgba(255,255,255,.06); border-radius:4px; overflow:hidden; }
.mis-rank-fill { height:100%; border-radius:4px; transition:width 1.4s cubic-bezier(.4,0,.2,1); }

/* LEADERBOARD */
.mis-lb-row { display:flex; align-items:center; gap:10px; padding:9px 0; border-bottom:1px solid var(--b); }
.mis-lb-row:last-child { border-bottom:none; }
.mis-lb-row.you { background:rgba(0,212,255,.04); margin:0 -4px; padding:9px 4px; border-radius:8px; border-color:transparent; }
.mis-lb-rank { font-family:var(--ffh); font-size:1.1rem; color:var(--tx3); width:22px; text-align:center; flex-shrink:0; }
.mis-lb-rank.top1 { color:var(--gold); }
.mis-lb-rank.top3 { color:var(--cyan); }
.mis-lb-name { font-weight:600; font-size:13.5px; flex:1; }
.mis-lb-spec { font-family:var(--ffm); font-size:10px; color:var(--tx2); }
.mis-lb-admits { font-family:var(--ffh); font-size:1.1rem; font-weight:800; min-width:28px; text-align:right; }
.mis-you-tag { font-family:var(--ffm); font-size:9px; padding:2px 7px; border-radius:10px;
  background:rgba(0,212,255,.1); border:1px solid rgba(0,212,255,.3); color:var(--cyan); letter-spacing:.06em; }

/* BADGES */
.mis-badges-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:12px; margin-bottom:36px; }
.mis-badge { background:var(--bgc); border:1px solid var(--b); border-radius:16px; padding:18px; text-align:center;
  transition:all .22s; position:relative; overflow:hidden; }
.mis-badge.earned:hover { transform:translateY(-3px); box-shadow:0 12px 32px rgba(0,0,0,.4); }
.mis-badge.locked { opacity:.45; filter:grayscale(.6); }
.mis-badge::before { content:''; position:absolute; top:0; left:0; right:0; height:2px; opacity:0; }
.mis-badge.earned::before { opacity:1; }
.mis-badge-ico { font-size:2rem; margin-bottom:10px; display:block; }
.mis-badge-title { font-family:var(--ffh); font-size:.95rem; font-weight:700; color:#fff; margin-bottom:4px; line-height:1.2; }
.mis-badge-desc { font-size:11.5px; color:var(--tx2); margin-bottom:8px; line-height:1.5; }
.mis-badge-count { font-family:var(--ffm); font-size:10px; padding:3px 9px; border-radius:20px; border:1px solid; display:inline-block; letter-spacing:.06em; font-weight:600; }
.mis-badge-detail { font-family:var(--ffm); font-size:10px; color:var(--tx3); margin-top:5px; }
.mis-badge-locked-tag { font-family:var(--ffm); font-size:9px; padding:2px 8px; border-radius:10px;
  background:rgba(255,255,255,.04); border:1px solid var(--b); color:var(--tx3); margin-top:6px; display:inline-block; }

/* STUDENT CARDS */
.mis-students-head { display:flex; align-items:center; gap:12px; margin-bottom:20px; }
.mis-filter-tabs { display:flex; gap:8px; margin-left:auto; }
.mis-filter-tab { padding:6px 16px; border-radius:8px; font-family:var(--ffm); font-size:11px;
  border:1px solid var(--b); color:var(--tx2); transition:all .18s; letter-spacing:.05em; background:transparent; }
.mis-filter-tab:hover { border-color:var(--b2); color:var(--tx); }
.mis-filter-tab.on { border-color:rgba(0,212,255,.4); background:rgba(0,212,255,.07); color:var(--cyan); }
.mis-students-grid { display:grid; grid-template-columns:repeat(2,1fr); gap:16px; margin-bottom:36px; }
.mis-sc { background:var(--bgc); border:1px solid var(--b); border-radius:16px; overflow:hidden;
  transition:all .22s; }
.mis-sc:hover { border-color:var(--b2); transform:translateY(-2px); box-shadow:0 14px 36px rgba(0,0,0,.4); }
.mis-sc-top { height:3px; width:100%; }
.mis-sc-body { padding:18px 20px; }
.mis-sc-header { display:flex; align-items:center; gap:12px; margin-bottom:14px; }
.mis-sc-av { width:44px; height:44px; border-radius:12px; display:flex; align-items:center;
  justify-content:center; font-family:var(--ffh); font-size:1.1rem; flex-shrink:0; border:1.5px solid rgba(255,255,255,.1); }
.mis-sc-info { flex:1; min-width:0; }
.mis-sc-name { font-family:var(--ffh); font-size:1rem; font-weight:700; color:#fff; margin-bottom:2px; }
.mis-sc-meta { font-family:var(--ffm); font-size:10.5px; color:var(--tx2); display:flex; align-items:center; gap:6px; }
.mis-sc-status { display:inline-flex; align-items:center; gap:4px; font-family:var(--ffm); font-size:10px;
  padding:3px 9px; border-radius:20px; border:1px solid; letter-spacing:.06em; font-weight:600; }
.mis-sc-uni-row { display:flex; align-items:center; gap:8px; padding:9px 11px;
  background:rgba(255,255,255,.03); border:1px solid var(--b); border-radius:9px; margin-bottom:11px; }
.mis-sc-uni-name { font-size:13px; font-weight:600; color:#fff; }
.mis-sc-uni-prog { font-family:var(--ffm); font-size:10px; color:var(--tx2); }
.mis-sc-pills { display:flex; gap:6px; flex-wrap:wrap; margin-bottom:11px; }
.mis-sc-pill { font-family:var(--ffm); font-size:10px; padding:3px 9px; border-radius:6px;
  border:1px solid var(--b); color:var(--tx2); }
.mis-sc-prob { margin-bottom:8px; }
.mis-sc-prob-lbl { display:flex; justify-content:space-between; align-items:center;
  font-family:var(--ffm); font-size:10px; color:var(--tx2); margin-bottom:4px; }
.mis-sc-prob-nums { font-family:var(--ffh); font-size:.9rem; font-weight:700; }
.mis-sc-prob-track { height:6px; background:rgba(255,255,255,.06); border-radius:3px; overflow:hidden; position:relative; }
.mis-sc-prob-before { position:absolute; top:0; left:0; height:100%; background:rgba(255,255,255,.12); border-radius:3px; }
.mis-sc-prob-after { position:absolute; top:0; left:0; height:100%; border-radius:3px; transition:width 1.2s cubic-bezier(.4,0,.2,1); }
.mis-sc-achieve { font-family:var(--ffm); font-size:11px; color:var(--tx2); line-height:1.5;
  padding:7px 10px; background:rgba(0,212,255,.04); border:1px solid rgba(0,212,255,.1); border-radius:7px; display:flex; gap:6px; }
.mis-sc-sch { display:flex; align-items:center; justify-content:space-between; margin-top:8px;
  padding:7px 10px; background:rgba(0,229,168,.04); border:1px solid rgba(0,229,168,.12); border-radius:7px; }
.mis-sc-sch-name { font-family:var(--ffm); font-size:10px; color:var(--teal); }
.mis-sc-sch-val { font-family:var(--ffh); font-size:.95rem; color:var(--teal); }

/* UNI + CHART ROW */
.mis-three-col { display:grid; grid-template-columns:1fr 1.6fr; gap:20px; margin-bottom:36px; }
.mis-uni-list { display:flex; flex-direction:column; gap:11px; }
.mis-uni-row { display:flex; align-items:center; gap:10px; }
.mis-uni-name { font-size:13px; font-weight:500; color:var(--tx); min-width:130px; flex-shrink:0; }
.mis-uni-bar-wrap { flex:1; }
.mis-uni-track { height:7px; background:rgba(255,255,255,.06); border-radius:4px; overflow:hidden; }
.mis-uni-fill { height:100%; border-radius:4px; transition:width 1.2s cubic-bezier(.4,0,.2,1); }
.mis-uni-count { font-family:var(--ffh); font-size:1rem; color:var(--tx2); min-width:36px; text-align:right; }

/* CHART */
.mis-chart-wrap { padding:4px 0; }
.mis-chart-legend { display:flex; gap:16px; margin-bottom:12px; }
.mis-chart-leg-item { display:flex; align-items:center; gap:6px; font-family:var(--ffm); font-size:10.5px; color:var(--tx2); }
.mis-chart-leg-dot { width:8px; height:8px; border-radius:2px; flex-shrink:0; }

/* TIMELINE */
.mis-tl { position:relative; padding-left:44px; }
.mis-tl::before { content:''; position:absolute; left:20px; top:0; bottom:0;
  width:1.5px; background:linear-gradient(180deg,var(--cyan),var(--violet),var(--teal)); opacity:.2; }
.mis-tl-item { position:relative; margin-bottom:18px; padding:14px 16px;
  background:var(--bg2); border:1px solid var(--b); border-radius:12px; transition:all .18s; }
.mis-tl-item:hover { border-color:var(--b2); background:var(--bg3); }
.mis-tl-dot { position:absolute; left:-33px; top:18px; width:12px; height:12px;
  border-radius:50%; border:2px solid; background:var(--bg); z-index:2; }
.mis-tl-head { display:flex; align-items:flex-start; justify-content:space-between; margin-bottom:4px; gap:10px; }
.mis-tl-title { font-size:.88rem; font-weight:600; color:#fff; }
.mis-tl-date { font-family:var(--ffm); font-size:10.5px; color:var(--tx2); flex-shrink:0; }
.mis-tl-desc { font-family:var(--ffm); font-size:11.5px; color:var(--tx2); line-height:1.55; }

/* CTA */
.mis-cta { background:linear-gradient(135deg,rgba(0,212,255,.06),rgba(139,127,255,.04));
  border:1px solid rgba(0,212,255,.18); border-radius:20px; padding:36px; text-align:center; margin-top:36px; }
.mis-cta-title { font-family:var(--ffh); font-size:1.8rem; font-weight:800; color:#fff; letter-spacing:-.02em; margin-bottom:8px; }
.mis-cta-sub { font-size:14px; color:var(--tx2); margin-bottom:20px; line-height:1.6; }
.mis-cta-actions { display:flex; gap:12px; justify-content:center; flex-wrap:wrap; }
.mis-btn { display:inline-flex; align-items:center; gap:7px; border-radius:10px; font-family:var(--ffb);
  font-size:14px; font-weight:600; cursor:pointer; transition:all .2s; border:none; padding:11px 24px; }
.mis-btn-primary { background:linear-gradient(135deg,var(--cyan),var(--teal)); color:#060A12; font-weight:700; box-shadow:0 0 24px rgba(0,212,255,.3); }
.mis-btn-primary:hover { box-shadow:0 0 40px rgba(0,212,255,.5); transform:translateY(-1px); }
.mis-btn-ghost { background:transparent; border:1px solid var(--b2); color:var(--tx); }
.mis-btn-ghost:hover { border-color:rgba(255,255,255,.28); background:rgba(255,255,255,.06); }

/* ANIMS */
@keyframes misUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:none} }
.mis-fade { animation:misUp .55s ease both; }
.d1{animation-delay:.05s}.d2{animation-delay:.1s}.d3{animation-delay:.15s}
.d4{animation-delay:.2s}.d5{animation-delay:.25s}.d6{animation-delay:.3s}

@media(max-width:1100px){ .mis-stats{grid-template-columns:repeat(3,1fr)} .mis-badges-grid{grid-template-columns:repeat(3,1fr)} }
@media(max-width:900px){ .mis-wrap{padding:0 24px 60px} .mis-nav{padding:0 24px} .mis-hero-top{grid-template-columns:1fr} .mis-mentor-card{width:100%} .mis-two-col{grid-template-columns:1fr} .mis-students-grid{grid-template-columns:1fr} .mis-three-col{grid-template-columns:1fr} .mis-stats{grid-template-columns:1fr 1fr} .mis-badges-grid{grid-template-columns:1fr 1fr} }
`

// ─── COMPONENT ────────────────────────────────────────────────────────────────
export default function MentorImpactScoreboard() {
  const [filter,     setFilter]     = useState('all')
  const [barAnim,    setBarAnim]    = useState(false)
  const [chartAnim,  setChartAnim]  = useState(false)

  // Animated counters
  const cStudents = useCounter(14, 1600, 200)
  const cAdmits   = useCounter(11, 1600, 350)
  const cProb     = useCounter(34, 1600, 500)
  const cSchol    = useCounter(86, 1600, 650)
  const cSuccess  = useCounter(79, 1600, 800)

  useEffect(() => {
    const t1 = setTimeout(() => setBarAnim(true),  600)
    const t2 = setTimeout(() => setChartAnim(true), 900)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  const filtered = STUDENTS.filter(s =>
    filter === 'all'      ? true :
    filter === 'admitted' ? s.status === 'admitted' :
    filter === 'progress' ? s.status === 'progress' : true
  )

  const maxUni = Math.max(...UNI_BREAKDOWN.map(u => u.total))
  const maxSessions = Math.max(...MONTHLY.map(m => m.sessions))
  const maxAdmits   = Math.max(...MONTHLY.map(m => m.admits))
  const chartW = 480
  const chartH = 140
  const barW   = chartW / MONTHLY.length - 4

  return (
    <div className="mis">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      {/* BG */}
      <div className="mis-canvas">
        <div className="mis-orb mis-o1"/><div className="mis-orb mis-o2"/><div className="mis-orb mis-o3"/>
      </div>
      <div className="mis-grid"/><div className="mis-noise"/>

      {/* NAV */}
      <nav className="mis-nav">
        <Link href="/dashboard/mentor" className="mis-brand">
          <div className="mis-brand-icon">
            <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
              <path d="M9 2L16 9L9 16L2 9Z" fill="white" fillOpacity=".92"/>
            </svg>
          </div>
          <span className="mis-brand-name">MentorBridge</span>
        </Link>
        <div className="mis-nav-sp"/>
        <Link href="/mentors" className={`mis-nav-btn mis-nav-ghost`} style={{marginRight:10}}>Browse Mentors</Link>
        <Link href="/dashboard/mentor" className="mis-nav-btn mis-nav-primary">← My Dashboard</Link>
      </nav>

      <div className="mis-wrap">

        {/* ── HERO ── */}
        <div className="mis-hero">
          <div className="mis-hero-top">

            {/* Mentor card */}
            <div className={`mis-mentor-card mis-fade d1`}>
              <div className="mis-mentor-av">AM</div>
              <div className="mis-mentor-name">Aarav Mehta</div>
              <div className="mis-mentor-role">MSc Computer Science · TU Munich, 2022<br/>Germany Specialist · 4 years mentoring</div>
              <div className="mis-mentor-tags">
                {['Germany','TU Munich','APS Expert','DAAD Coach'].map(t => (
                  <span key={t} className="mis-mentor-tag"
                    style={{color:'var(--cyan)',borderColor:'rgba(0,212,255,.3)',background:'rgba(0,212,255,.06)'}}>
                    {t}
                  </span>
                ))}
              </div>
              <div className="mis-mentor-stars">
                {[1,2,3,4,5].map(i => <span key={i} className="mis-star">★</span>)}
                <span className="mis-rating-txt">4.97 / 5.0</span>
              </div>
              <div className="mis-joined">Joined MentorBridge · May 2024</div>
            </div>

            {/* Hero text */}
            <div className={`mis-fade d2`}>
              <div className="mis-eyebrow">Verified Mentor Impact Report</div>
              <h1 className="mis-hero-title">
                <span className="mis-hero-title-w">You Changed</span>
                <span className="mis-hero-title-g">14 Lives.</span>
              </h1>
              <p className="mis-hero-sub">
                Every number below is verified from real student outcomes —
                not self-claimed, not estimated. This is what you actually built
                since joining MentorBridge. It cannot be purchased.
              </p>
            </div>
          </div>

          {/* STAT CARDS */}
          <div className="mis-stats">
            {[
              { val:cStudents, lbl:'Students Helped',       col:'#00D4FF', delta:'+3 this month',   suffix:'',  bg:'rgba(0,212,255,.1)',  bdr:'rgba(0,212,255,.3)',  after:'rgba(0,212,255,.1)',  afterBdr:'rgba(0,212,255,.25)' },
              { val:cAdmits,   lbl:'University Admits',     col:'#00E5A8', delta:'+2 this month',   suffix:'',  bg:'rgba(0,229,168,.1)',  bdr:'rgba(0,229,168,.3)',  after:'rgba(0,229,168,.1)',  afterBdr:'rgba(0,229,168,.25)' },
              { val:cProb,     lbl:'Avg Probability Gain',  col:'#8B7FFF', delta:'Max: +45 pts',    suffix:' pts', bg:'rgba(139,127,255,.1)', bdr:'rgba(139,127,255,.3)', after:'rgba(139,127,255,.1)', afterBdr:'rgba(139,127,255,.25)' },
              { val:cSchol,    lbl:'Scholarships Unlocked', col:'#FFB800', delta:'4 DAAD awards',   suffix:'K', prefix:'€', bg:'rgba(255,184,0,.1)', bdr:'rgba(255,184,0,.3)', after:'rgba(255,184,0,.1)', afterBdr:'rgba(255,184,0,.25)' },
              { val:cSuccess,  lbl:'Student Success Rate',  col:'#FF5E8A', delta:'11 of 14 admits', suffix:'%', bg:'rgba(255,94,138,.1)', bdr:'rgba(255,94,138,.3)', after:'rgba(255,94,138,.1)', afterBdr:'rgba(255,94,138,.25)' },
            ].map((s, i) => (
              <div key={i} className={`mis-stat mis-fade d${i+1}`}
                style={{['--stat-col']: s.col}}>
                <div style={{position:'absolute',bottom:0,left:0,right:0,height:2,borderRadius:'0 0 16px 16px',background:`linear-gradient(90deg,transparent,${s.col},transparent)`}}/>
                <div className="mis-stat-val" style={{color:s.col}}>
                  {s.prefix||''}{s.val}{s.suffix}
                </div>
                <div className="mis-stat-lbl">{s.lbl}</div>
                <span className="mis-stat-delta" style={{color:s.col,background:s.bg,borderColor:s.bdr}}>
                  ↑ {s.delta}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ── RANK + LEADERBOARD ── */}
        <div className={`mis-two-col mis-fade d2`}>

          {/* Rank */}
          <div className="mis-section-box">
            <div className="mis-section-head">
              <div className="mis-section-title">🏆 Your Platform Rank</div>
              <span className="mis-section-sub">Germany Mentors · April 2026</span>
            </div>
            <div className="mis-section-body">
              <div className="mis-rank-hero">
                <div className="mis-rank-num">#3</div>
                <div className="mis-rank-info">
                  <div className="mis-rank-of">of 47 Germany Mentors</div>
                  <div className="mis-rank-lbl">Platform-wide rank: #8 of 214</div>
                </div>
              </div>
              <div className="mis-rank-bar-wrap">
                <div className="mis-rank-bar-lbl">
                  <span>Your position</span><span>Top 6.4%</span>
                </div>
                <div className="mis-rank-track">
                  <div className="mis-rank-fill" style={{
                    width: barAnim ? '93.6%' : '0%',
                    background: 'linear-gradient(90deg,#00D4FF,#00E5A8)'
                  }}/>
                </div>
              </div>
              <div style={{display:'flex',gap:12,flexWrap:'wrap'}}>
                {[
                  { lbl:'Sessions / Month', val:'12', col:'#00D4FF' },
                  { lbl:'Avg Rating',       val:'4.97', col:'#FFB800' },
                  { lbl:'Response Rate',    val:'98%',  col:'#00E5A8' },
                ].map((m,i) => (
                  <div key={i} style={{background:'rgba(255,255,255,.03)',border:'1px solid var(--b)',borderRadius:10,padding:'10px 14px',textAlign:'center',flex:1}}>
                    <div style={{fontFamily:'var(--ffh)',fontSize:'1.4rem',color:m.col,lineHeight:1,marginBottom:3}}>{m.val}</div>
                    <div style={{fontFamily:'var(--ffm)',fontSize:10,color:'var(--tx2)',letterSpacing:'.08em'}}>{m.lbl}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Leaderboard */}
          <div className="mis-section-box">
            <div className="mis-section-head">
              <div className="mis-section-title">🥇 Top Mentors Leaderboard</div>
              <span className="mis-section-sub">By verified admits</span>
            </div>
            <div className="mis-section-body">
              {LEADERBOARD.map((m, i) => (
                <div key={i} className={`mis-lb-row${m.you ? ' you' : ''}`}>
                  <div className={`mis-lb-rank${i===0?' top1':i<2?' top3':''}`}>
                    {i === 0 ? '🥇' : i === 1 ? '🥈' : m.rank}
                  </div>
                  <div style={{flex:1}}>
                    <div style={{display:'flex',alignItems:'center',gap:7}}>
                      <span className="mis-lb-name" style={m.you?{color:'var(--cyan)'}:{}}>{m.name}</span>
                      {m.you && <span className="mis-you-tag">YOU</span>}
                    </div>
                    <div className="mis-lb-spec">{m.specialty} · ★ {m.rating}</div>
                  </div>
                  <div className="mis-lb-admits" style={{color: m.you?'var(--cyan)':i===0?'var(--gold)':'var(--tx2)'}}>{m.admits}</div>
                </div>
              ))}
              <div style={{marginTop:12,padding:'9px 12px',background:'rgba(0,212,255,.04)',border:'1px solid rgba(0,212,255,.12)',borderRadius:9,fontFamily:'var(--ffm)',fontSize:11,color:'rgba(0,212,255,.8)',lineHeight:1.55}}>
                💡 Get 3 more admits this month to reach #1 position.
              </div>
            </div>
          </div>
        </div>

        {/* ── BADGES ── */}
        <div className={`mis-fade d3`} style={{marginBottom:36}}>
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:18}}>
            <div>
              <div className="mis-eyebrow" style={{marginBottom:4}}>Verified Achievements</div>
              <div style={{fontFamily:'var(--ffh)',fontSize:'1.4rem',fontWeight:800,color:'#fff',letterSpacing:'-.02em'}}>
                Your Earned Badges
              </div>
            </div>
            <div style={{fontFamily:'var(--ffm)',fontSize:11,color:'var(--tx2)',padding:'6px 14px',border:'1px solid var(--b)',borderRadius:8}}>
              5 Earned · 3 Locked
            </div>
          </div>
          <div className="mis-badges-grid">
            {BADGES.map((b, i) => (
              <div key={b.id} className={`mis-badge${b.earned ? ' earned' : ' locked'}`}
                style={{'--badge-col': b.col}}>
                {b.earned && <div style={{position:'absolute',top:0,left:0,right:0,height:2,background:`linear-gradient(90deg,transparent,${b.col},transparent)`}}/>}
                {b.earned && <div style={{position:'absolute',inset:0,background:`radial-gradient(ellipse at 50% 0%,${b.col}0d,transparent 65%)`,pointerEvents:'none'}}/>}
                <span className="mis-badge-ico">{b.icon}</span>
                <div className="mis-badge-title">{b.title}</div>
                <div className="mis-badge-desc">{b.desc}</div>
                <span className="mis-badge-count" style={{color:b.col,borderColor:`${b.col}44`,background:`${b.col}10`}}>
                  {b.count}
                </span>
                {b.earned
                  ? <div className="mis-badge-detail">{b.detail}</div>
                  : <div className="mis-badge-locked-tag">🔒 LOCKED — {b.detail}</div>
                }
              </div>
            ))}
          </div>
        </div>

        {/* ── STUDENT OUTCOMES ── */}
        <div className={`mis-fade d3`}>
          <div className="mis-students-head">
            <div>
              <div className="mis-eyebrow" style={{marginBottom:4}}>Verified Outcomes</div>
              <div style={{fontFamily:'var(--ffh)',fontSize:'1.4rem',fontWeight:800,color:'#fff',letterSpacing:'-.02em'}}>
                Student Outcomes — All 14
              </div>
            </div>
            <div className="mis-filter-tabs">
              {[['all','All 14'],['admitted','✅ Admitted (11)'],['progress','⏳ In Progress (3)']].map(([v,l]) => (
                <button key={v} className={`mis-filter-tab${filter===v?' on':''}`} onClick={() => setFilter(v)}>{l}</button>
              ))}
            </div>
          </div>

          <div className="mis-students-grid">
            {filtered.map((s, i) => {
              const isAdmitted = s.status === 'admitted'
              const probW = barAnim ? `${s.probAfter}%` : '0%'
              return (
                <div key={s.id} className="mis-sc" style={{animationDelay:`${i*.04}s`}}>
                  <div className="mis-sc-top" style={{background:`linear-gradient(90deg,${s.tc},${s.tc}44,transparent)`}}/>
                  <div className="mis-sc-body">
                    <div className="mis-sc-header">
                      <div className="mis-sc-av" style={{background:s.bg,color:s.tc}}>{s.initials}</div>
                      <div className="mis-sc-info">
                        <div className="mis-sc-name">{s.name}</div>
                        <div className="mis-sc-meta">
                          <FlagImg iso={s.iso} size={14}/>
                          <span>{s.uni}</span>
                          <span>·</span>
                          <span>{s.sessions} sessions</span>
                        </div>
                      </div>
                      <span className="mis-sc-status" style={{
                        color: isAdmitted ? 'var(--teal)' : 'var(--gold)',
                        borderColor: isAdmitted ? 'rgba(0,229,168,.3)' : 'rgba(255,184,0,.3)',
                        background: isAdmitted ? 'rgba(0,229,168,.08)' : 'rgba(255,184,0,.08)',
                      }}>
                        {isAdmitted ? '✅ Admitted' : '⏳ In Progress'}
                      </span>
                    </div>

                    <div className="mis-sc-uni-row">
                      <FlagImg iso={s.iso} size={18}/>
                      <div>
                        <div className="mis-sc-uni-name">{s.uni}</div>
                        <div className="mis-sc-uni-prog">{s.program} · {s.intake}</div>
                      </div>
                    </div>

                    <div className="mis-sc-pills">
                      <span className="mis-sc-pill">{s.sessions} Sessions</span>
                      <span className="mis-sc-pill">{s.city}</span>
                      {isAdmitted && <span className="mis-sc-pill" style={{color:'var(--teal)',borderColor:'rgba(0,229,168,.25)',background:'rgba(0,229,168,.06)'}}>Offer Received</span>}
                    </div>

                    {/* Probability bar */}
                    <div className="mis-sc-prob">
                      <div className="mis-sc-prob-lbl">
                        <span>Admission Probability</span>
                        <span className="mis-sc-prob-nums" style={{color:s.tc}}>
                          {s.probBefore}% → {s.probAfter}%
                          <span style={{color:'var(--teal)',marginLeft:6,fontSize:'10px'}}>+{s.probAfter-s.probBefore} pts</span>
                        </span>
                      </div>
                      <div className="mis-sc-prob-track">
                        <div className="mis-sc-prob-before" style={{width:`${s.probBefore}%`}}/>
                        <div className="mis-sc-prob-after" style={{width:probW,background:`linear-gradient(90deg,${s.tc}99,${s.tc})`}}/>
                      </div>
                    </div>

                    <div className="mis-sc-achieve">
                      <span style={{flexShrink:0,fontSize:'.8rem'}}>💡</span>
                      <span>{s.achievement}</span>
                    </div>

                    {isAdmitted && s.schVal !== '€0/yr' && (
                      <div className="mis-sc-sch">
                        <span className="mis-sc-sch-name">🎓 {s.scholarship}</span>
                        <span className="mis-sc-sch-val">{s.schVal}</span>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* ── UNIVERSITY BREAKDOWN + CHART ── */}
        <div className={`mis-three-col mis-fade d4`}>

          {/* Uni breakdown */}
          <div className="mis-section-box">
            <div className="mis-section-head">
              <div className="mis-section-title">🏛 University Breakdown</div>
            </div>
            <div className="mis-section-body">
              <div className="mis-uni-list">
                {UNI_BREAKDOWN.map((u, i) => (
                  <div key={i} className="mis-uni-row">
                    <div style={{display:'flex',alignItems:'center',gap:7,minWidth:140,flexShrink:0}}>
                      <FlagImg iso={u.iso} size={16}/>
                      <span className="mis-uni-name" style={{fontSize:12.5}}>{u.name}</span>
                    </div>
                    <div className="mis-uni-bar-wrap">
                      <div className="mis-uni-track">
                        <div className="mis-uni-fill" style={{
                          width: barAnim ? `${(u.total/maxUni)*100}%` : '0%',
                          background: u.col
                        }}/>
                      </div>
                    </div>
                    <div className="mis-uni-count" style={{color:u.col}}>{u.admits}</div>
                  </div>
                ))}
              </div>
              <div style={{marginTop:16,padding:'11px 13px',background:'rgba(0,212,255,.04)',border:'1px solid rgba(0,212,255,.12)',borderRadius:9}}>
                <div style={{fontFamily:'var(--ffm)',fontSize:10,color:'var(--cyan)',letterSpacing:'.1em',marginBottom:6}}>SNAPSHOT</div>
                <div style={{display:'flex',gap:16}}>
                  {[['6','Universities'],['11','Admits'],['€86K','Scholarships']].map(([v,l]) => (
                    <div key={l} style={{textAlign:'center'}}>
                      <div style={{fontFamily:'var(--ffh)',fontSize:'1.3rem',color:'#fff',lineHeight:1}}>{v}</div>
                      <div style={{fontFamily:'var(--ffm)',fontSize:9.5,color:'var(--tx2)',letterSpacing:'.08em'}}>{l}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Monthly chart */}
          <div className="mis-section-box">
            <div className="mis-section-head">
              <div className="mis-section-title">📈 Monthly Performance</div>
              <span className="mis-section-sub">May 2025 — Apr 2026</span>
            </div>
            <div className="mis-section-body">
              <div className="mis-chart-legend">
                <div className="mis-chart-leg-item">
                  <div className="mis-chart-leg-dot" style={{background:'rgba(0,212,255,.5)'}}/>
                  Sessions
                </div>
                <div className="mis-chart-leg-item">
                  <div className="mis-chart-leg-dot" style={{background:'var(--teal)'}}/>
                  Admits
                </div>
              </div>
              <svg viewBox={`0 0 ${chartW} ${chartH}`} width="100%" style={{overflow:'visible'}}>
                {MONTHLY.map((m, i) => {
                  const x = i * (chartW / MONTHLY.length) + 4
                  const sH = chartAnim ? ((m.sessions / maxSessions) * (chartH - 24)) : 0
                  const aH = chartAnim ? ((m.admits   / maxAdmits)   * (chartH - 24)) : 0
                  return (
                    <g key={i}>
                      <rect x={x} y={chartH - sH - 18} width={barW * 0.52} height={sH}
                        rx="3" fill="rgba(0,212,255,.35)"
                        style={{transition:`height 0.8s ${i*0.05}s ease,y 0.8s ${i*0.05}s ease`}}/>
                      <rect x={x + barW * 0.54} y={chartH - aH - 18} width={barW * 0.44} height={aH}
                        rx="3" fill="var(--teal)"
                        style={{transition:`height 0.8s ${i*0.05}s ease,y 0.8s ${i*0.05}s ease`}}/>
                      <text x={x + barW * 0.48} y={chartH - 4} textAnchor="middle"
                        fontFamily="'JetBrains Mono',monospace" fontSize="8" fill="var(--tx3)">
                        {m.month}
                      </text>
                    </g>
                  )
                })}
              </svg>
              <div style={{display:'flex',justifyContent:'space-between',marginTop:10}}>
                {[['96','Total Sessions'],['30','Total Admits'],['4.1x','Growth (YoY)']].map(([v,l])=>(
                  <div key={l} style={{textAlign:'center'}}>
                    <div style={{fontFamily:'var(--ffh)',fontSize:'1.2rem',color:'var(--cyan)',lineHeight:1}}>{v}</div>
                    <div style={{fontFamily:'var(--ffm)',fontSize:9.5,color:'var(--tx2)',letterSpacing:'.07em'}}>{l}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── IMPACT TIMELINE ── */}
        <div className={`mis-section-box mis-fade d5`} style={{marginBottom:36}}>
          <div className="mis-section-head">
            <div className="mis-section-title">⏱ Impact Timeline</div>
            <span className="mis-section-sub">Key milestones since joining</span>
          </div>
          <div style={{padding:'20px 22px'}}>
            <div className="mis-tl">
              {TIMELINE.map((t, i) => (
                <div key={i} className="mis-tl-item">
                  <div className="mis-tl-dot" style={{borderColor:t.col,background:t.col,boxShadow:`0 0 8px ${t.col}`}}/>
                  <div className="mis-tl-head">
                    <div className="mis-tl-title">{t.icon} {t.title}</div>
                    <div className="mis-tl-date">{t.date}</div>
                  </div>
                  <div className="mis-tl-desc">{t.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── CTA ── */}
        <div className={`mis-cta mis-fade d6`}>
          <div style={{fontFamily:'var(--ffm)',fontSize:11,color:'var(--teal)',letterSpacing:'.14em',textTransform:'uppercase',marginBottom:10,display:'flex',alignItems:'center',justifyContent:'center',gap:8}}>
            <span style={{display:'block',width:20,height:1,background:'var(--teal)'}}/>
            Keep Going
            <span style={{display:'block',width:20,height:1,background:'var(--teal)'}}/>
          </div>
          <div className="mis-cta-title">You Are 3 Admits Away From #1</div>
          <p className="mis-cta-sub">
            Kavya Reddy leads with 19 admits. You have 14. Three more students like Rahul and Divya<br/>
            and you take the top spot. Your next session could be the one that changes everything.
          </p>
          <div className="mis-cta-actions">
            <Link href="/dashboard/mentor" className="mis-btn mis-btn-primary">
              View My Students <span>→</span>
            </Link>
            <Link href="/mentors/profile" className="mis-btn mis-btn-ghost">
              Edit Public Profile
            </Link>
          </div>
        </div>

      </div>
    </div>
  )
}