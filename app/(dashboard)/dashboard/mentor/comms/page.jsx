'use client'

import React, { useState } from 'react';
import Link from 'next/link';
import { Triangle, LayoutDashboard, Users, Calendar, DollarSign, MessageSquare, Settings, Send, Shield } from 'lucide-react';

const styles = `
  .comms-wrapper {
    --bg: #02040a; --bg-surface: #0a0f1a; --cyan: #00F5FF; --border: rgba(0, 245, 255, 0.1);
    background: var(--bg); color: #f8fafc; font-family: 'Inter', sans-serif; height: 100vh; display: flex;
  }
  .sidebar { width: 260px; background: rgba(5, 8, 15, 0.95); border-right: 1px solid var(--border); display: flex; flex-direction: column; }
  .chat-container { flex: 1; display: flex; flex-direction: column; background: rgba(0,0,0,0.4); }
  .chat-header { height: 70px; border-bottom: 1px solid var(--border); padding: 0 32px; display: flex; align-items: center; justify-content: space-between; background: rgba(2, 4, 10, 0.8); }
  .chat-messages { flex: 1; padding: 32px; overflow-y: auto; display: flex; flex-direction: column; gap: 16px; }
  .msg { max-width: 60%; padding: 12px 18px; border-radius: 12px; font-size: 14px; line-height: 1.5; }
  .msg.mentor { align-self: flex-end; background: var(--cyan); color: #000; font-weight: 500; }
  .msg.student { align-self: flex-start; background: #1e293b; color: #fff; border: 1px solid var(--border); }
  .chat-input-area { height: 90px; padding: 20px 32px; border-top: 1px solid var(--border); display: flex; gap: 16px; }
  .chat-input { flex: 1; background: #0f172a; border: 1px solid var(--border); border-radius: 12px; padding: 0 20px; color: #fff; outline: none; transition: border-color 0.2s; }
  .chat-input:focus { border-color: var(--cyan); }
  .btn-send { width: 50px; height: 50px; border-radius: 12px; background: var(--cyan); border: none; display: flex; align-items: center; justify-content: center; cursor: pointer; }
`;

export default function SecureComms() {
  return (
    <div className="comms-wrapper">
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <aside className="sidebar">
        <nav style={{padding: '24px 12px', display:'flex', flexDirection:'column', gap: 4}}>
           <Link href="/dashboard/mentor" className="sb-item" style={{display:'flex', gap: 12, padding: 12, color: '#94a3b8'}}><LayoutDashboard size={18}/> Command Center</Link>
           <Link href="/dashboard/mentor/comms" className="sb-item active" style={{display:'flex', gap: 12, padding: 12, color: 'var(--cyan)', background:'rgba(0,245,255,0.1)', borderRadius: 10}}><MessageSquare size={18}/> Secure Comms</Link>
        </nav>
      </aside>
      <div className="chat-container">
        <header className="chat-header">
          <div style={{display:'flex', alignItems:'center', gap: 12}}>
            <div style={{width: 40, height: 40, borderRadius: 50, background: '#1e293b', border: '1px solid var(--cyan)'}}></div>
            <div>
              <div style={{fontWeight: 700}}>Priya Sharma</div>
              <div style={{fontSize: 10, color: 'var(--teal)'}}>● ONLINE | ENCRYPTED CHANNEL</div>
            </div>
          </div>
          <Shield size={20} color="var(--cyan)" />
        </header>
        <div className="chat-messages">
          <div className="msg student">Hi Aarav, I've updated my SOP based on our last session. Can you take a look?</div>
          <div className="msg mentor">Checking it now, Priya. The flow in the introduction is much better.</div>
          <div className="msg student">Great! I'll wait for your detailed notes.</div>
        </div>
        <div className="chat-input-area">
          <input className="chat-input" placeholder="Type an encrypted message..." />
          <button className="btn-send"><Send size={20} color="#000"/></button>
        </div>
      </div>
    </div>
  );
}