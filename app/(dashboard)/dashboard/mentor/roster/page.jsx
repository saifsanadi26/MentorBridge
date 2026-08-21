'use client'

import React from 'react';
import Link from 'next/link';
import { Triangle, LayoutDashboard, Users, Calendar, DollarSign, MessageSquare, Settings, Bell, Search, GraduationCap, Mail, Phone, ArrowUpRight } from 'lucide-react';

const styles = `
  .roster-wrapper {
    --bg: #02040a; --bg-surface: #0a0f1a; --cyan: #00F5FF; --border: rgba(0, 245, 255, 0.1);
    background: var(--bg); color: #f8fafc; font-family: 'Inter', sans-serif; min-height: 100vh; display: flex;
  }
  .sidebar { width: 260px; background: rgba(5, 8, 15, 0.95); border-right: 1px solid var(--border); display: flex; flex-direction: column; }
  .sb-logo { padding: 28px 24px; display: flex; align-items: center; gap: 12px; border-bottom: 1px solid var(--border); }
  .sb-logo-text { font-family: 'Bebas Neue', sans-serif; font-size: 24px; letter-spacing: 0.05em; color: #fff; }
  .sb-nav { flex: 1; padding: 24px 12px; display: flex; flex-direction: column; gap: 4px; }
  .sb-item { display: flex; align-items: center; gap: 12px; padding: 12px 16px; font-size: 14px; color: #94a3b8; border-radius: 10px; cursor: pointer; transition: all 0.2s; }
  .sb-item:hover { color: #fff; background: rgba(255,255,255,0.03); }
  .sb-item.active { color: var(--cyan); background: rgba(0, 245, 255, 0.1); }
  .main-area { flex: 1; padding: 40px; overflow-y: auto; }
  .header { font-family: 'Bebas Neue', sans-serif; font-size: 42px; margin-bottom: 32px; letter-spacing: 0.02em; }
  .roster-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap: 24px; }
  .mentee-card { background: var(--bg-surface); border: 1px solid var(--border); border-radius: 20px; padding: 24px; transition: all 0.3s; }
  .mentee-card:hover { border-color: var(--cyan); transform: translateY(-4px); box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
  .mc-top { display: flex; gap: 16px; align-items: center; margin-bottom: 20px; }
  .mc-av { width: 50px; height: 50px; border-radius: 50%; background: #1e293b; display: flex; align-items: center; justify-content: center; font-size: 20px; color: var(--cyan); font-weight: bold; border: 1px solid var(--cyan); }
  .mc-name { font-size: 18px; font-weight: 700; color: #fff; }
  .mc-target { font-size: 12px; color: #94a3b8; margin-top: 4px; }
  .mc-actions { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 20px; }
  .btn-action { padding: 10px; border-radius: 8px; font-size: 12px; font-weight: 600; text-align: center; border: 1px solid var(--border); transition: all 0.2s; cursor: pointer; }
  .btn-action:hover { background: var(--cyan); color: #000; border-color: var(--cyan); }
`;

export default function MyRoster() {
  const mentees = [
    { name: "Priya Sharma", email: "priya.s@example.com", target: "TU Munich - MS Data Science", status: "Active" },
    { name: "Rahul Verma", email: "rahul.v@example.com", target: "RWTH Aachen - MS Mech Eng", status: "Active" },
    { name: "Sneha Kapur", email: "sneha.k@example.com", target: "TU Berlin - MS CS", status: "Pending SOP" }
  ];

  return (
    <div className="roster-wrapper">
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <aside className="sidebar">
        <div className="sb-logo">
          <div style={{width: 32, height: 32, background: 'var(--cyan)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <Triangle size={16} fill="#000" className="rotate-180" />
          </div>
          <span className="sb-logo-text">MentorBridge</span>
        </div>
        <nav className="sb-nav">
          <Link href="/dashboard/mentor" className="sb-item"><LayoutDashboard size={18} /> Command Center</Link>
          <Link href="/dashboard/mentor/roster" className="sb-item active"><Users size={18} /> My Roster</Link>
          <Link href="/dashboard/mentor/schedule" className="sb-item"><Calendar size={18} /> Schedule & Slots</Link>
          <Link href="/dashboard/mentor/comms" className="sb-item"><MessageSquare size={18} /> Secure Comms</Link>
          <Link href="/dashboard/mentor/revenue" className="sb-item"><DollarSign size={18} /> Financial Ledger</Link>
          <Link href="/dashboard/mentor/settings" className="sb-item"><Settings size={18} /> Profile Setup</Link>
        </nav>
      </aside>
      <main className="main-area">
        <h1 className="header">MY ACTIVE ROSTER</h1>
        <div className="roster-grid">
          {mentees.map((m, i) => (
            <div key={i} className="mentee-card">
              <div className="mc-top">
                <div className="mc-av">{m.name[0]}</div>
                <div>
                  <div className="mc-name">{m.name}</div>
                  <div className="mc-target">{m.target}</div>
                </div>
              </div>
              <div style={{fontSize: 12, color: '#94a3b8'}}>
                <div style={{display:'flex', alignItems:'center', gap: 8, marginBottom: 8}}><Mail size={14}/> {m.email}</div>
                <div style={{display:'flex', alignItems:'center', gap: 8}}><ArrowUpRight size={14}/> Status: <span style={{color: 'var(--cyan)'}}>{m.status}</span></div>
              </div>
              <div className="mc-actions">
                <div className="btn-action">VIEW DOSSIER</div>
                <div className="btn-action">SEND MESSAGE</div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}