'use client'

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

// ════════════════════════════════════════════════════════════════════════════════
// 1. DATA CONSTANTS: ALL 15 MENTORS
// ════════════════════════════════════════════════════════════════════════════════
const MENTORS = [
  { id: "mentor_01", name: "Aarav Mehta", role: "MS CS", uni: "TU Munich", country: "Germany", hex: "#00F5FF", rgb: "0,245,255", img: "https://randomuser.me/api/portraits/men/11.jpg", rate: "₹1,600", slots: [{t:"07:00",d:30,tz:"CET"},{t:"09:00",d:30,tz:"CET"},{t:"18:00",d:30,tz:"CET"},{t:"20:00",d:45,tz:"CET"}] },
  { id: "mentor_02", name: "Ritika Sharma", role: "MS Data Science", uni: "Arizona State", country: "USA", hex: "#FFB347", rgb: "255,179,71", img: "https://randomuser.me/api/portraits/women/55.jpg", rate: "₹1,600", slots: [{t:"07:00",d:30,tz:"MST"},{t:"16:00",d:30,tz:"MST"},{t:"18:00",d:45,tz:"MST"},{t:"21:00",d:30,tz:"MST"}] },
  { id: "mentor_03", name: "Kunal Verma", role: "MS AI", uni: "University of Toronto", country: "Canada", hex: "#A78BFA", rgb: "167,139,250", img: "https://randomuser.me/api/portraits/men/32.jpg", rate: "₹2,400", slots: [{t:"07:00",d:30,tz:"EST"},{t:"18:00",d:45,tz:"EST"}] },
  { id: "mentor_04", name: "Maanya", role: "MS Business Analytics", uni: "Manchester", country: "UK", hex: "#00E5A8", rgb: "0,229,168", img: "https://randomuser.me/api/portraits/women/31.jpg", rate: "₹1,600", slots: [{t:"09:00",d:30,tz:"GMT"},{t:"14:00",d:30,tz:"GMT"}] },
  { id: "mentor_05", name: "Siddharth Jain", role: "MS Mech Eng", uni: "RWTH Aachen", country: "Germany", hex: "#00F5FF", rgb: "0,245,255", img: "https://randomuser.me/api/portraits/men/41.jpg", rate: "₹2,400", slots: [{t:"09:00",d:30,tz:"CET"},{t:"11:00",d:30,tz:"CET"},{t:"19:00",d:30,tz:"CET"}] },
  { id: "mentor_06", name: "Ananya Iyer", role: "MS Software Eng", uni: "Northeastern", country: "USA", hex: "#FFB347", rgb: "255,179,71", img: "https://randomuser.me/api/portraits/women/24.jpg", rate: "₹1,600", slots: [{t:"09:00",d:30,tz:"EST"},{t:"14:00",d:30,tz:"EST"},{t:"19:00",d:30,tz:"EST"}] },
  { id: "mentor_07", name: "Rohan Patel", role: "MS CS", uni: "Trinity Dublin", country: "Ireland", hex: "#4ADE80", rgb: "74,222,128", img: "https://randomuser.me/api/portraits/men/86.jpg", rate: "₹2,400", slots: [{t:"11:00",d:30,tz:"GMT"},{t:"14:00",d:45,tz:"GMT"},{t:"20:00",d:30,tz:"GMT"}] },
  { id: "mentor_08", name: "Priya Malhotra", role: "MS Info Systems", uni: "U of Melbourne", country: "Australia", hex: "#FB7185", rgb: "251,113,133", img: "https://randomuser.me/api/portraits/women/88.jpg", rate: "₹1,600", slots: [{t:"11:00",d:30,tz:"AEST"},{t:"15:00",d:30,tz:"AEST"},{t:"20:00",d:45,tz:"AEST"}] },
  { id: "mentor_09", name: "Mohit Aggarwal", role: "MS Data Engineering", uni: "TU Berlin", country: "Germany", hex: "#00F5FF", rgb: "0,245,255", img: "https://randomuser.me/api/portraits/men/64.jpg", rate: "₹1,600", slots: [{t:"11:00",d:30,tz:"CET"},{t:"16:00",d:30,tz:"CET"},{t:"20:00",d:30,tz:"CET"}] },
  { id: "mentor_10", name: "Simran Kaur", role: "MS Marketing", uni: "University of Leeds", country: "UK", hex: "#00E5A8", rgb: "0,229,168", img: "https://randomuser.me/api/portraits/women/62.jpg", rate: "₹1,600", slots: [{t:"14:00",d:30,tz:"GMT"},{t:"18:00",d:30,tz:"GMT"},{t:"21:00",d:30,tz:"GMT"}] },
  { id: "mentor_11", name: "Aditya Rao", role: "MS Business Analytics", uni: "UT Dallas", country: "USA", hex: "#FFB347", rgb: "255,179,71", img: "https://randomuser.me/api/portraits/men/53.jpg", rate: "₹2,400", slots: [{t:"14:00",d:30,tz:"CST"},{t:"18:00",d:30,tz:"CST"},{t:"21:00",d:30,tz:"CST"}] },
  { id: "mentor_12", name: "Sneha Banerjee", role: "MA Economics", uni: "UBC Vancouver", country: "Canada", hex: "#A78BFA", rgb: "167,139,250", img: "https://randomuser.me/api/portraits/women/4.jpg", rate: "₹1,600", slots: [{t:"09:00",d:30,tz:"PST"},{t:"14:00",d:30,tz:"PST"},{t:"19:00",d:30,tz:"PST"}] },
  { id: "mentor_13", name: "Yash Kulkarni", role: "MS Robotics", uni: "KIT Karlsruhe", country: "Germany", hex: "#00F5FF", rgb: "0,245,255", img: "https://randomuser.me/api/portraits/men/36.jpg", rate: "₹1,600", slots: [{t:"10:00",d:30,tz:"CET"},{t:"16:00",d:30,tz:"CET"},{t:"22:00",d:30,tz:"CET"}] },
  { id: "mentor_14", name: "Tanvi Deshpande", role: "MS Finance", uni: "University of Bristol", country: "UK", hex: "#00E5A8", rgb: "0,229,168", img: "https://randomuser.me/api/portraits/women/65.jpg", rate: "₹1,600", slots: [{t:"10:00",d:30,tz:"GMT"},{t:"16:00",d:30,tz:"GMT"},{t:"22:00",d:30,tz:"GMT"}] },
  { id: "mentor_15", name: "Naveen Reddy", role: "MS Cyber Security", uni: "Monash University", country: "Australia", hex: "#FB7185", rgb: "251,113,133", img: "https://randomuser.me/api/portraits/men/91.jpg", rate: "₹1,600", slots: [{t:"10:00",d:30,tz:"AEST"},{t:"16:00",d:30,tz:"AEST"},{t:"22:00",d:30,tz:"AEST"}] }
];

const DAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// Helper: Build next 14 days
function buildDays() {
  const today = new Date();
  const out = [];
  for (let i = 0; i < 14; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    out.push(d);
  }
  return out;
}

// Fake slot availability check
function hasSlots(date) {
  const d = date.getDay();
  return d === 1 || d === 3 || d === 5; // Mon, Wed, Fri have slots
}

// ════════════════════════════════════════════════════════════════════════════════
// 2. CSS STYLES (Safely Converted for React)
// ════════════════════════════════════════════════════════════════════════════════
const styles = `
  .booking-page-root {
    --bg:#030508; --bg1:#060912; --bg2:#0A0F1E;
    --b0:rgba(0,245,255,.08); --b1:rgba(0,245,255,.18);
    --c:#00F5FF; --t:#00E5A8; --a:#FFB347; --r:#FF4D6D; --v:#A78BFA;
    --t1:#C8D8F0; --t2:#5A7090; --t3:#2A3A55;
    --ff-h:'Rajdhani',sans-serif; --ff-b:'DM Sans',sans-serif; --ff-m:'JetBrains Mono',monospace;
    background: var(--bg); color: var(--t1); font-family: var(--ff-b);
    -webkit-font-smoothing: antialiased; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh;
    background-color: #030508;
    position: relative;
    padding: 60px 20px;
  }
  .booking-page-root::before {
    content:''; position:fixed; inset:0;
    background:radial-gradient(ellipse 80% 50% at 50% -5%,rgba(0,245,255,.05),transparent 55%),#030508;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='104'%3E%3Cpolygon points='30,2 58,17 58,47 30,62 2,47 2,17' fill='none' stroke='%2300F5FF' stroke-width='0.5' opacity='0.08'/%3E%3C/svg%3E");
    z-index:0; pointer-events:none;
  }
  .booking-page-root * { box-sizing: border-box; }
  
  .nav-back {
    position: absolute; top: 30px; left: 40px; z-index: 10;
    font-family: var(--ff-m); font-size: 11px; color: var(--t2); letter-spacing: .1em;
    text-transform: uppercase; text-decoration: none; display: flex; align-items: center; gap: 8px;
    background: rgba(255,255,255,.03); border: 1px solid var(--b0); padding: 8px 16px; border-radius: 8px;
    transition: all .2s;
  }
  .nav-back:hover { color: var(--t1); background: rgba(255,255,255,.07); border-color: rgba(255,255,255,.15); }

  .b-modal {
    position: relative; width: 100%; max-width: 780px; z-index: 5;
    background: linear-gradient(145deg,#060912 0%,#0A0F1E 100%);
    border: 1px solid rgba(0,245,255,.12); border-radius: 20px;
    overflow: hidden; display: flex; flex-direction: column;
    box-shadow: 0 0 80px rgba(0,245,255,.07), 0 40px 80px rgba(0,0,0,.6);
    animation: modalIn .4s cubic-bezier(.25,.46,.45,.94);
  }
  .b-modal-glow { position: absolute; inset: 0; pointer-events: none; background: radial-gradient(ellipse 70% 50% at 50% 0%, rgba(0,245,255,.07) 0%, transparent 60%); }

  .accent-line { height: 3px; flex-shrink: 0; background: linear-gradient(90deg, transparent, var(--accent), transparent); }

  /* HEADER */
  .m-head { padding: 18px 24px 14px; flex-shrink: 0; border-bottom: 1px solid rgba(0,245,255,.08); display: flex; align-items: center; gap: 16px; position: relative; z-index: 1; }
  .av-wrap { position: relative; flex-shrink: 0; }
  .av-ring { position: absolute; inset: -4px; border-radius: 50%; border: 1.5px solid var(--accent); opacity: .5; animation: ringPulse 3s ease-in-out infinite; }
  .av-ring2 { position: absolute; inset: -9px; border-radius: 50%; border: 1px dashed var(--accent); opacity: .15; animation: spin 8s linear infinite; }
  .av-img { width: 52px; height: 52px; border-radius: 50%; object-fit: cover; border: 2px solid rgba(0,0,0,.5); position: relative; z-index: 1; }
  .av-online { position: absolute; bottom: -1px; right: -1px; width: 10px; height: 10px; border-radius: 50%; background: #00E5A8; border: 2px solid #060912; box-shadow: 0 0 6px #00E5A8; z-index: 2; }
  .m-name { font-family: var(--ff-h); font-size: 22px; font-weight: 700; color: #fff; letter-spacing: .03em; display: flex; align-items: center; gap: 10px; margin-bottom: 3px; text-transform: uppercase; }
  .m-ctry { font-family: var(--ff-m); font-size: 9px; letter-spacing: .1em; padding: 2px 9px; border-radius: 20px; background: rgba(0,245,255,.1); border: 1px solid rgba(0,245,255,.3); color: var(--accent); }
  .m-role { font-family: var(--ff-m); font-size: 10px; color: var(--t2); letter-spacing: .06em; }

  /* STEPS */
  .steps { padding: 14px 24px; flex-shrink: 0; border-bottom: 1px solid rgba(0,245,255,.06); display: flex; align-items: center; position: relative; z-index: 1; }
  .step-item { display: flex; align-items: center; flex: 1; }
  .step-item:last-child { flex: none; }
  .step-num { width: 26px; height: 26px; border-radius: 50%; flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-family: var(--ff-m); font-size: 11px; font-weight: 600; transition: all .3s; border: 1.5px solid; }
  .step-num.done { background: var(--accent); border-color: var(--accent); color: #030508; }
  .step-num.active { background: rgba(0,245,255,.12); border-color: var(--accent); color: var(--accent); box-shadow: 0 0 12px rgba(0,245,255,.3); }
  .step-num.idle { background: rgba(255,255,255,.04); border-color: rgba(255,255,255,.1); color: var(--t3); }
  .step-label { font-family: var(--ff-m); font-size: 9.5px; letter-spacing: .12em; text-transform: uppercase; margin-left: 8px; transition: color .3s; }
  .step-label.active { color: var(--accent); }
  .step-label.done { color: var(--t2); }
  .step-label.idle { color: var(--t3); }
  .step-line { flex: 1; height: 1px; margin: 0 12px; transition: background .4s; }
  .step-line.done { background: var(--accent); }
  .step-line.idle { background: rgba(255,255,255,.06); }

  /* BODY */
  .m-body { flex: 1; padding: 24px; position: relative; z-index: 1; min-height: 400px; display: flex; flex-direction: column; }
  .sec-label { margin-bottom: 16px; }
  .sec-title { font-family: var(--ff-m); font-size: 9.5px; letter-spacing: .2em; text-transform: uppercase; color: var(--accent); display: flex; align-items: center; gap: 8px; margin-bottom: 3px; }
  .sec-title::before { content: ''; display: inline-block; width: 14px; height: 1.5px; background: var(--accent); }
  .sec-sub { font-size: 13px; color: var(--t2); font-family: var(--ff-b); }

  /* DATE GRID */
  .date-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 8px; }
  .date-btn { background: rgba(255,255,255,.03); border: 1px solid rgba(255,255,255,.08); border-radius: 10px; padding: 10px 4px; cursor: pointer; display: flex; flex-direction: column; align-items: center; gap: 4px; transition: all .18s; }
  .date-btn:hover { border-color: rgba(0,245,255,.35); }
  .date-btn.selected { background: rgba(0,245,255,.1); border-color: var(--accent); box-shadow: 0 0 14px rgba(0,245,255,.2); }
  .date-btn.no-slots { opacity: .25; cursor: not-allowed; }
  .date-day { font-family: var(--ff-m); font-size: 8.5px; color: var(--t3); letter-spacing: .08em; }
  .date-btn.selected .date-day { color: var(--accent); }
  .date-num { font-family: var(--ff-h); font-size: 20px; font-weight: 700; color: var(--t1); line-height: 1; }
  .date-btn.selected .date-num { color: var(--accent); }
  .date-btn.no-slots .date-num { color: var(--t3); }
  .date-mon { font-family: var(--ff-m); font-size: 7.5px; color: var(--t3); letter-spacing: .06em; }
  .date-dot { width: 4px; height: 4px; border-radius: 50%; background: #00E5A8; opacity: .6; }
  .date-today-dot { width: 4px; height: 4px; border-radius: 50%; background: var(--accent); }

  .continue-bar { margin-top: auto; padding: 12px 16px; background: rgba(0,245,255,.05); border: 1px solid rgba(0,245,255,.18); border-radius: 10px; display: flex; align-items: center; justify-content: space-between; }
  .continue-info { font-family: var(--ff-m); font-size: 11px; color: var(--accent); letter-spacing: .06em; }
  .cta-btn { font-family: var(--ff-m); font-size: 10px; letter-spacing: .1em; background: var(--accent); color: #030508; border: none; padding: 7px 18px; border-radius: 8px; cursor: pointer; font-weight: 600; transition: all .2s; }
  .cta-btn:hover { box-shadow: 0 0 20px rgba(0,245,255,.4); }

  /* SLOTS */
  .step-toprow { display: flex; align-items: center; justify-content: space-between; margin-bottom: 18px; }
  .back-btn { font-family: var(--ff-m); font-size: 9.5px; color: var(--t2); background: transparent; border: 1px solid rgba(255,255,255,.08); padding: 5px 12px; border-radius: 8px; cursor: pointer; letter-spacing: .08em; transition: all .18s; }
  .back-btn:hover { border-color: rgba(255,255,255,.2); color: var(--t1); }
  
  .slots-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(170px, 1fr)); gap: 10px; margin-bottom: 20px; }
  .slot-btn { background: rgba(255,255,255,.03); border: 1px solid rgba(255,255,255,.08); border-radius: 12px; padding: 16px 18px; cursor: pointer; transition: all .2s; text-align: left; position: relative; overflow: hidden; }
  .slot-btn:hover { border-color: rgba(0,245,255,.3); }
  .slot-btn.selected { background: rgba(0,245,255,.1); border-color: var(--accent); box-shadow: 0 0 16px rgba(0,245,255,.2); }
  .slot-accent-bar { position: absolute; top: 0; left: 0; right: 0; height: 2px; background: linear-gradient(90deg, var(--accent), transparent); display: none; }
  .slot-btn.selected .slot-accent-bar { display: block; }
  .slot-time { font-family: var(--ff-h); font-size: 24px; font-weight: 700; color: var(--t1); line-height: 1; margin-bottom: 5px; transition: color .2s; }
  .slot-btn.selected .slot-time { color: var(--accent); }
  .slot-meta { font-family: var(--ff-m); font-size: 9.5px; color: var(--t2); letter-spacing: .08em; }
  .slot-check { font-family: var(--ff-m); font-size: 9px; color: var(--accent); letter-spacing: .08em; margin-top: 8px; display: none; }
  .slot-btn.selected .slot-check { display: block; }

  /* CONFIRM */
  .summary-card { background: rgba(255,255,255,.02); border-radius: 14px; padding: 18px 20px; margin-bottom: 16px; position: relative; overflow: hidden; border: 1px solid rgba(0,245,255,.12); }
  .summary-card::before { content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 3px; background: linear-gradient(180deg, var(--accent), transparent); }
  .summary-sec-label { font-family: var(--ff-m); font-size: 9px; color: var(--t3); letter-spacing: .18em; text-transform: uppercase; margin-bottom: 12px; padding-left: 12px; }
  .summary-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px 24px; padding-left: 12px; }
  .sg-item { display: flex; flex-direction: column; gap: 3px; }
  .sg-l { font-family: var(--ff-m); font-size: 8.5px; color: var(--t3); letter-spacing: .14em; text-transform: uppercase; }
  .sg-v { font-family: var(--ff-h); font-size: 15px; font-weight: 600; color: var(--t1); }
  
  .expect-box { background: rgba(0,229,168,.04); border: 1px solid rgba(0,229,168,.12); border-radius: 12px; padding: 14px 16px; margin-bottom: 16px; display: flex; gap: 12px; align-items: flex-start; }
  .expect-ico { font-size: 18px; flex-shrink: 0; }
  .expect-title { font-family: var(--ff-m); font-size: 10px; color: #00E5A8; letter-spacing: .1em; margin-bottom: 5px; }
  .expect-text { font-size: 12.5px; color: var(--t2); line-height: 1.6; }
  
  .topic-label { font-family: var(--ff-m); font-size: 9px; color: var(--t3); letter-spacing: .16em; text-transform: uppercase; margin-bottom: 8px; }
  .topic-input { width: 100%; height: 80px; resize: none; background: rgba(255,255,255,.03); border: 1px solid rgba(255,255,255,.08); border-radius: 10px; padding: 12px 14px; outline: none; font-family: var(--ff-b); font-size: 13px; color: var(--t1); line-height: 1.5; transition: border-color .2s; box-sizing: border-box; }
  .topic-input:focus { border-color: rgba(0,245,255,.3); }
  .topic-counter { text-align: right; font-family: var(--ff-m); font-size: 9px; color: var(--t3); margin-top: 4px; }
  
  .confirm-cta { width: 100%; padding: 14px; background: linear-gradient(135deg, var(--accent), rgba(0,245,255,.8)); border: 1px solid var(--accent); border-radius: 12px; cursor: pointer; font-family: var(--ff-m); font-size: 12px; font-weight: 600; color: #030508; letter-spacing: .14em; text-transform: uppercase; transition: all .25s; display: flex; align-items: center; justify-content: center; gap: 10px; box-shadow: 0 0 24px rgba(0,245,255,.3); margin-top: auto;}
  .confirm-cta:hover { box-shadow: 0 0 40px rgba(0,245,255,.5); }

  /* SUCCESS */
  .success-wrap { text-align: center; padding: 10px 0 20px; position: relative; }
  .success-ring { position: relative; width: 90px; height: 90px; margin: 0 auto 20px; }
  .success-ring svg { animation: successRingAnim .7s ease; }
  .success-check { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; font-size: 32px; animation: checkIn .4s .35s ease backwards; }
  .success-title { font-family: var(--ff-h); font-size: 30px; font-weight: 700; color: #fff; margin-bottom: 6px; letter-spacing: .05em; text-transform: uppercase; }
  .success-sub { font-family: var(--ff-m); font-size: 11px; color: var(--t2); letter-spacing: .08em; margin-bottom: 28px; }
  
  .brief-card { background: rgba(0,245,255,.05); border: 1px solid rgba(0,245,255,.18); border-radius: 14px; padding: 18px 20px; margin-bottom: 16px; text-align: left; }
  .brief-label { font-family: var(--ff-m); font-size: 9px; color: var(--t3); letter-spacing: .16em; margin-bottom: 12px; }
  .brief-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px 24px; }
  .brief-item { display: flex; flex-direction: column; gap: 3px; }
  .bi-l { font-family: var(--ff-m); font-size: 8.5px; color: var(--t3); letter-spacing: .14em; }
  .bi-v { font-family: var(--ff-h); font-size: 15px; font-weight: 600; color: var(--t1); }
  .bi-v.confirmed { color: #00E5A8; }
  
  /* JITSI BOX */
  .meet-box { background: rgba(0,229,168,.05); border: 1px solid rgba(0,229,168,.2); border-radius: 12px; padding: 14px 18px; margin-bottom: 18px; display: flex; align-items: center; justify-content: space-between; gap: 12px; text-align: left; }
  .meet-label { font-family: var(--ff-m); font-size: 9px; color: #00E5A8; letter-spacing: .14em; margin-bottom: 4px; }
  .meet-link { font-family: var(--ff-m); font-size: 11px; color: var(--t2); word-break: break-all; }
  .copy-btn { font-family: var(--ff-m); font-size: 9.5px; letter-spacing: .08em; background: rgba(0,229,168,.1); border: 1px solid rgba(0,229,168,.3); color: #00E5A8; padding: 6px 14px; border-radius: 8px; cursor: pointer; flex-shrink: 0; transition: all .2s; }
  .copy-btn:hover { background: rgba(0,229,168,.2); }
  
  .close-cta { width: 100%; padding: 13px; background: rgba(255,255,255,.04); border: 1px solid rgba(255,255,255,.1); border-radius: 12px; cursor: pointer; font-family: var(--ff-m); font-size: 11px; font-weight: 600; color: var(--t1); letter-spacing: .1em; transition: all .2s; text-transform: uppercase;}
  .close-cta:hover { border-color: rgba(0,245,255,.3); }

  .particle { position: absolute; border-radius: 50%; pointer-events: none; animation: particleFade 2s ease forwards; }

  .loading-spin { width: 16px; height: 16px; border: 2px solid rgba(3,5,8,.3); border-top-color: #030508; border-radius: 50%; animation: spin .8s linear infinite; }

  @keyframes modalIn { from{opacity:0;transform:scale(.96) translateY(12px)} to{opacity:1;transform:scale(1) translateY(0)} }
  @keyframes fadeSlide { from{opacity:0;transform:translateX(12px)} to{opacity:1;transform:translateX(0)} }
  @keyframes ringPulse { 0%,100%{transform:scale(1);opacity:.5} 50%{transform:scale(1.06);opacity:.9} }
  @keyframes spin { to{transform:rotate(360deg)} }
  @keyframes successRingAnim { from{opacity:0;transform:scale(.7)} to{opacity:1;transform:scale(1)} }
  @keyframes checkIn { from{opacity:0;transform:scale(.3)} to{opacity:1;transform:scale(1)} }
  @keyframes particleFade { 0%{opacity:1;transform:scale(0)} 50%{opacity:1;transform:scale(1)} 100%{opacity:0;transform:translateY(-40px) scale(.3)} }
`;

// ════════════════════════════════════════════════════════════════════════════════
// 3. REACT COMPONENT
// ════════════════════════════════════════════════════════════════════════════════
export default function BookingPage() {
  const params = useParams();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  
  // Find mentor from URL id
  const mentorId = params.id;
  const mentor = MENTORS.find(m => m.id === mentorId) || MENTORS[0]; 
  
  // Booking States
  const [curStep, setCurStep] = useState(1);
  const [days] = useState(buildDays());
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [topic, setTopic] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Success state generators
  const [sessionId, setSessionId] = useState('');
  const [jitsiLink, setJitsiLink] = useState('');
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    setMounted(true);
    // Inject Fonts
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500;600;700&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&family=JetBrains+Mono:wght@400;500;600&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }, []);

  const handleConfirm = () => {
    setIsSubmitting(true);
    
    // Simulate API call to save booking
    setTimeout(() => {
      setIsSubmitting(false);
      
      // Generate secure Jitsi Link based on names
      const shortId = Math.random().toString(36).slice(2, 6).toUpperCase();
      const cleanMentorName = mentor.name.replace(/\s+/g, '');
      setSessionId(`MB-${shortId}`);
      setJitsiLink(`https://meet.jit.si/MentorBridge-${cleanMentorName}-${shortId}`);
      
      // Generate Success Particles
      const pArr = [];
      const pcolors = [mentor.hex, '#00E5A8', '#FFB347', '#A78BFA'];
      for(let i = 0; i < 18; i++) {
        pArr.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          s: 2 + Math.random() * 4,
          dl: Math.random() * 1.2,
          c: pcolors[Math.floor(Math.random() * 4)]
        });
      }
      setParticles(pArr);
      
      setCurStep(4); // Move to success step
    }, 1400);
  };

  if (!mounted) return null;

  // Dynamic Styles based on mentor
  const accent = mentor.hex;
  const accentRgb = mentor.rgb;

  return (
    <div className="booking-page-root" style={{'--accent': accent}}>
      <style dangerouslySetInnerHTML={{ __html: styles }} />

      <Link href={`/mentors/${mentor.id}`} className="nav-back">
        <ArrowLeft size={14} /> BACK TO PROFILE
      </Link>

      <div className="b-modal">
        <div className="b-modal-glow" style={{ background: `radial-gradient(ellipse 70% 50% at 50% 0%, rgba(${accentRgb},.07) 0%, transparent 60%)` }}></div>
        <div className="accent-line"></div>

        {/* HEADER */}
        <div className="m-head" style={{ borderBottomColor: `rgba(${accentRgb},.08)` }}>
          <div className="av-wrap">
            <div className="av-ring2" style={{ borderColor: accent }}></div>
            <div className="av-ring" style={{ borderColor: accent }}></div>
            <img className="av-img" src={mentor.img} alt={mentor.name} />
            <div className="av-online"></div>
          </div>
          <div style={{ flex: 1 }}>
            <div className="m-name">
              <span>{mentor.name}</span>
              <span className="m-ctry" style={{ background: `rgba(${accentRgb},.1)`, borderColor: `rgba(${accentRgb},.3)`, color: accent }}>
                {mentor.country}
              </span>
            </div>
            <div className="m-role">{mentor.role} · {mentor.uni}</div>
          </div>
        </div>

        {/* STEPS INDICATOR */}
        {curStep < 4 && (
          <div className="steps" style={{ borderBottomColor: `rgba(${accentRgb},.06)` }}>
            {[1, 2, 3].map((num) => {
              const label = num === 1 ? "DATE" : num === 2 ? "TIME SLOT" : "CONFIRM";
              const isDone = curStep > num;
              const isActive = curStep === num;
              
              let numClass = "step-num idle";
              if (isDone) numClass = "step-num done";
              else if (isActive) numClass = "step-num active";

              return (
                <React.Fragment key={num}>
                  <div className="step-item" style={{ flex: num === 3 ? 'none' : 1 }}>
                    <div className={numClass} style={{
                      background: isDone ? accent : isActive ? `rgba(${accentRgb},.12)` : 'rgba(255,255,255,.04)',
                      borderColor: isDone || isActive ? accent : 'rgba(255,255,255,.1)',
                      color: isDone ? '#030508' : isActive ? accent : 'var(--t3)',
                      boxShadow: isActive ? `0 0 12px rgba(${accentRgb},.3)` : 'none'
                    }}>
                      {isDone ? '✓' : num}
                    </div>
                    <span className={`step-label ${isDone ? 'done' : isActive ? 'active' : 'idle'}`} style={{
                      color: isDone ? 'var(--t2)' : isActive ? accent : 'var(--t3)'
                    }}>
                      {label}
                    </span>
                  </div>
                  {num < 3 && (
                    <div className={`step-line ${isDone ? 'done' : 'idle'}`} style={{
                      background: isDone ? accent : 'rgba(255,255,255,.06)'
                    }}></div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        )}

        {/* DYNAMIC BODY */}
        <div className="m-body" style={{ animation: 'fadeSlide .25s ease' }} key={curStep}>
          
          {/* STEP 1: DATE */}
          {curStep === 1 && (
            <>
              <div style={{ margin: 0, paddingBottom: 16 }}>
                <div className="sec-title" style={{ color: accent }}>SELECT DATE</div>
                <div className="sec-sub">Next 14 days</div>
              </div>
              <div className="date-grid">
                {days.map((d, i) => {
                  const has = hasSlots(d); // Uses our fake logic (Mon,Wed,Fri)
                  const isSel = selectedDay && selectedDay.toDateString() === d.toDateString();
                  const isToday = d.toDateString() === new Date().toDateString();
                  
                  return (
                    <button 
                      key={i} 
                      className={`date-btn ${isSel ? 'selected' : ''} ${!has ? 'no-slots' : ''}`}
                      disabled={!has}
                      onClick={() => { setSelectedDay(d); setSelectedSlot(null); }}
                      style={{
                        background: isSel ? `rgba(${accentRgb},.1)` : 'rgba(255,255,255,.03)',
                        borderColor: isSel ? accent : 'rgba(255,255,255,.08)',
                        boxShadow: isSel ? `0 0 14px rgba(${accentRgb},.2)` : 'none'
                      }}
                    >
                      <span className="date-day" style={{ color: isSel ? accent : 'var(--t3)' }}>{DAYS[d.getDay()]}</span>
                      <span className="date-num" style={{ color: isSel ? accent : !has ? 'var(--t3)' : 'var(--t1)' }}>{d.getDate()}</span>
                      <span className="date-mon">{MONTHS[d.getMonth()]}</span>
                      {isToday && <div className="date-today-dot" style={{ background: accent }}></div>}
                      {has && !isSel && <div className="date-dot"></div>}
                    </button>
                  );
                })}
              </div>
              {selectedDay && (
                <div className="continue-bar" style={{ background: `rgba(${accentRgb},.05)`, borderColor: `rgba(${accentRgb},.18)` }}>
                  <span className="continue-info" style={{ color: accent }}>
                    {DAYS[selectedDay.getDay()]} · {selectedDay.getDate()} {MONTHS[selectedDay.getMonth()]} · {mentor.slots.length} slots available
                  </span>
                  <button className="cta-btn" style={{ background: accent }} onClick={() => setCurStep(2)}>VIEW SLOTS →</button>
                </div>
              )}
            </>
          )}

          {/* STEP 2: TIME SLOT */}
          {curStep === 2 && (
            <>
              <div className="step-toprow">
                <div style={{ margin: 0 }}>
                  <div className="sec-title" style={{ color: accent }}>SELECT TIME SLOT</div>
                  <div className="sec-sub">{DAYS[selectedDay.getDay()]}, {selectedDay.getDate()} {MONTHS[selectedDay.getMonth()]}</div>
                </div>
                <button className="back-btn" onClick={() => setCurStep(1)}>← BACK</button>
              </div>
              <div className="slots-grid">
                {mentor.slots.map((sl, i) => {
                  const isSel = selectedSlot && selectedSlot.t === sl.t;
                  return (
                    <button 
                      key={i} 
                      className={`slot-btn ${isSel ? 'selected' : ''}`} 
                      onClick={() => setSelectedSlot(sl)}
                      style={{
                        background: isSel ? `rgba(${accentRgb},.1)` : 'rgba(255,255,255,.03)',
                        borderColor: isSel ? accent : 'rgba(255,255,255,.08)',
                        boxShadow: isSel ? `0 0 16px rgba(${accentRgb},.2)` : 'none'
                      }}
                    >
                      <div className="slot-accent-bar" style={{ display: isSel ? 'block' : 'none' }}></div>
                      <div className="slot-time" style={{ color: isSel ? accent : 'var(--t1)' }}>{sl.t}</div>
                      <div className="slot-meta">{sl.d} min · {sl.tz}</div>
                      <div className="slot-check" style={{ color: accent, display: isSel ? 'block' : 'none' }}>✓ SELECTED</div>
                    </button>
                  );
                })}
              </div>
              {selectedSlot && (
                <div className="continue-bar" style={{ background: `rgba(${accentRgb},.05)`, borderColor: `rgba(${accentRgb},.18)`, marginTop: 'auto' }}>
                  <span className="continue-info" style={{ color: accent }}>{selectedSlot.t} · {selectedSlot.d} min · {selectedSlot.tz}</span>
                  <button className="cta-btn" style={{ background: accent }} onClick={() => setCurStep(3)}>REVIEW →</button>
                </div>
              )}
            </>
          )}

          {/* STEP 3: CONFIRM */}
          {curStep === 3 && (
            <>
              <div className="step-toprow">
                <div style={{ margin: 0 }}>
                  <div className="sec-title" style={{ color: accent }}>CONFIRM BOOKING</div>
                  <div className="sec-sub">Review your session details</div>
                </div>
                <button className="back-btn" onClick={() => setCurStep(2)}>← BACK</button>
              </div>

              <div className="summary-card" style={{ borderColor: `rgba(${accentRgb},.22)`, background: `rgba(${accentRgb},.02)` }}>
                <div className="summary-sec-label">SESSION BRIEF</div>
                <div className="summary-grid">
                  <div className="sg-item"><span className="sg-l">HANDLER</span><span className="sg-v">{mentor.name}</span></div>
                  <div className="sg-item"><span className="sg-l">DATE</span><span className="sg-v">{DAYS[selectedDay.getDay()]}, {selectedDay.getDate()} {MONTHS[selectedDay.getMonth()]}</span></div>
                  <div className="sg-item"><span className="sg-l">TIME</span><span className="sg-v">{selectedSlot.t} {selectedSlot.tz}</span></div>
                  <div className="sg-item"><span className="sg-l">DURATION</span><span className="sg-v">{selectedSlot.d} min</span></div>
                  <div className="sg-item"><span className="sg-l">PLATFORM</span><span className="sg-v">Jitsi Video</span></div>
                  <div className="sg-item"><span className="sg-l">RATE</span><span className="sg-v" style={{color: accent}}>{mentor.rate}</span></div>
                </div>
              </div>

              <div className="expect-box">
                <div className="expect-ico">💡</div>
                <div>
                  <div className="expect-title">WHAT TO EXPECT</div>
                  <div className="expect-text">Your mentor will review your profile before the session. Come prepared with your target universities, CGPA, and any specific questions. A summary + action items will be shared after the call.</div>
                </div>
              </div>

              <div className="topic-label">WHAT DO YOU WANT TO DISCUSS? <span style={{ color: 'var(--t3)' }}>(optional)</span></div>
              <textarea 
                className="topic-input" 
                maxLength="300" 
                placeholder="e.g. University shortlisting for MS CS in Germany, APS timeline, DAAD eligibility..."
                value={topic}
                onChange={e => setTopic(e.target.value)}
              ></textarea>
              <div className="topic-counter">{topic.length}/300</div>

              <button 
                className="confirm-cta" 
                onClick={handleConfirm}
                disabled={isSubmitting}
                style={{ 
                  background: isSubmitting ? 'rgba(255,255,255,.04)' : `linear-gradient(135deg, ${accent}, rgba(${accentRgb},.8))`,
                  borderColor: isSubmitting ? 'var(--b0)' : accent,
                  boxShadow: isSubmitting ? 'none' : `0 0 24px rgba(${accentRgb},.3)`,
                  color: isSubmitting ? 'var(--t2)' : '#030508',
                  marginTop: '16px'
                }}
              >
                {isSubmitting ? (
                  <>
                    <div className="loading-spin" style={{ display: 'block' }}></div>
                    SECURING SESSION...
                  </>
                ) : (
                  <>⚡ CONFIRM & LOCK IN SESSION</>
                )}
              </button>
            </>
          )}

          {/* STEP 4: SUCCESS WITH JITSI LINK */}
          {curStep === 4 && (
            <div className="success-wrap">
              {particles.map(p => (
                <div key={p.id} className="particle" style={{
                  left: `${p.x}%`, top: `${p.y}%`, width: `${p.s}px`, height: `${p.s}px`,
                  background: p.c, boxShadow: `0 0 ${p.s * 2}px ${p.c}`, animationDelay: `${p.dl}s`
                }}></div>
              ))}
              
              <div className="success-ring">
                <svg width="90" height="90" viewBox="0 0 90 90">
                  <circle cx="45" cy="45" r="38" fill="none" stroke={`rgba(${accentRgb},.22)`} strokeWidth="4"/>
                  <circle cx="45" cy="45" r="38" fill="none" stroke={accent} strokeWidth="4" strokeLinecap="round" strokeDasharray="238" strokeDashoffset="0" transform="rotate(-90 45 45)" style={{ filter: `drop-shadow(0 0 6px ${accent})` }}/>
                </svg>
                <div className="success-check">✓</div>
              </div>
              
              <div className="success-title">SESSION LOCKED IN</div>
              <div className="success-sub">Confirmation sent to your registered email</div>
              
              <div className="brief-card" style={{ background: `rgba(${accentRgb},.05)`, borderColor: `rgba(${accentRgb},.18)` }}>
                <div className="brief-label">MISSION BRIEFING</div>
                <div className="brief-grid">
                  <div className="brief-item"><span className="bi-l">HANDLER</span><span className="bi-v">{mentor.name}</span></div>
                  <div className="brief-item"><span className="bi-l">DATE</span><span className="bi-v">{DAYS[selectedDay.getDay()]}, {selectedDay.getDate()} {MONTHS[selectedDay.getMonth()]}</span></div>
                  <div className="brief-item"><span className="bi-l">TIME</span><span className="bi-v">{selectedSlot.t} {selectedSlot.tz}</span></div>
                  <div className="brief-item"><span className="bi-l">DURATION</span><span className="bi-v">{selectedSlot.d} min</span></div>
                  <div className="brief-item"><span className="bi-l">SESSION ID</span><span className="bi-v">{sessionId}</span></div>
                  <div className="brief-item"><span className="bi-l">STATUS</span><span className="bi-v confirmed" style={{ color: accent }}>CONFIRMED ✓</span></div>
                </div>
              </div>
              
              {/* JITSI LINK BOX */}
              <div className="meet-box" style={{ background: `rgba(${accentRgb},.05)`, borderColor: `rgba(${accentRgb},.2)` }}>
                <div>
                  <div className="meet-label" style={{ color: accent }}>📹 SECURE JITSI LINK</div>
                  <div className="meet-link">{jitsiLink}</div>
                </div>
                <button 
                  className="copy-btn" 
                  style={{ background: `rgba(${accentRgb},.1)`, borderColor: `rgba(${accentRgb},.3)`, color: accent }}
                  onClick={(e) => {
                    navigator.clipboard.writeText(jitsiLink);
                    e.currentTarget.textContent = 'COPIED ✓';
                    e.currentTarget.style.color = '#fff';
                  }}
                >
                  COPY
                </button>
              </div>
              
              <button className="close-cta" onClick={() => router.push('/dashboard/student')}>RETURN TO DASHBOARD</button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}