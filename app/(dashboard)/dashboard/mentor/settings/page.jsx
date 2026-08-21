'use client'

import React from 'react';
import Link from 'next/link';
import { Triangle, LayoutDashboard, Settings, Save, Camera, Globe, Cpu } from 'lucide-react';

const styles = `
  .settings-wrapper {
    --bg: #02040a; --bg-surface: #0a0f1a; --cyan: #00F5FF; --border: rgba(0, 245, 255, 0.1);
    background: var(--bg); color: #f8fafc; font-family: 'Inter', sans-serif; min-height: 100vh; display: flex;
  }
  .main-area { flex: 1; padding: 60px; max-width: 900px; margin: 0 auto; }
  .form-box { background: var(--bg-surface); border: 1px solid var(--border); border-radius: 24px; padding: 40px; }
  .input-group { margin-bottom: 24px; }
  .label { display: block; font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #94a3b8; text-transform: uppercase; margin-bottom: 8px; letter-spacing: 0.1em; }
  .input, .textarea { width: 100%; background: rgba(0,0,0,0.3); border: 1px solid var(--border); border-radius: 12px; padding: 12px 16px; color: #fff; outline: none; }
  .input:focus, .textarea:focus { border-color: var(--cyan); }
  .textarea { height: 120px; resize: none; }
  .btn-save { background: var(--cyan); color: #000; padding: 14px 32px; border-radius: 12px; font-weight: 700; border: none; cursor: pointer; display: flex; align-items: center; gap: 8px; width: 100%; justify-content: center; }
`;

export default function ProfileSetup() {
  return (
    <div className="settings-wrapper">
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <main className="main-area">
        <div style={{marginBottom: 40}}>
           <h1 style={{fontFamily: 'Bebas Neue', fontSize: 48, letterSpacing: '0.02em'}}>PROFILE CONFIGURATION</h1>
           <p style={{color: '#94a3b8'}}>Update your public handler profile and expertise parameters.</p>
        </div>
        <div className="form-box">
          <div style={{display:'flex', gap: 24, marginBottom: 40}}>
            <div style={{width: 100, height: 100, borderRadius: 20, background: '#1e293b', border: '1px dashed var(--cyan)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor:'pointer'}}>
              <Camera size={32} color="var(--cyan)" />
            </div>
            <div style={{flex: 1}}>
              <div className="input-group">
                <span className="label">Public Name</span>
                <input className="input" defaultValue="Aarav Mehta" />
              </div>
            </div>
          </div>
          <div className="input-group">
            <span className="label">Professional Bio</span>
            <textarea className="textarea" placeholder="I help students realistically shortlist German public universities..." />
          </div>
          <div style={{display:'grid', gridTemplateColumns: '1fr 1fr', gap: 20}}>
            <div className="input-group"><span className="label">University</span><input className="input" defaultValue="TU Munich" /></div>
            <div className="input-group"><span className="label">Current Degree</span><input className="input" defaultValue="MS Computer Science" /></div>
          </div>
          <button className="btn-save"><Save size={18}/> PUSH UPDATES TO SYSTEM</button>
        </div>
      </main>
    </div>
  );
}