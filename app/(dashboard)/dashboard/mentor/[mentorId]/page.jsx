'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Triangle, LayoutDashboard, Users, Calendar, DollarSign, MessageSquare, Settings, Bell, Search, LogOut, CheckCircle2, XCircle, Video, TrendingUp, Activity, ShieldCheck } from 'lucide-react'

// ════════════════════════════════════════════════════════════
//  MOCK MENTOR DATA
// ════════════════════════════════════════════════════════════
const UPCOMING_SESSIONS = [
  { id: "s1", student: "Rahul S.", target: "TU Munich", time: "Today, 18:00 CET", status: "Ready", img: "https://randomuser.me/api/portraits/men/32.jpg" },
  { id: "s2", student: "Priya M.", target: "RWTH Aachen", time: "Tomorrow, 14:30 CET", status: "Scheduled", img: "https://randomuser.me/api/portraits/women/44.jpg" },
  { id: "s3", student: "Omar K.", target: "TU Berlin", time: "Friday, 09:00 CET", status: "Scheduled", img: "https://randomuser.me/api/portraits/men/86.jpg" }
];

const PENDING_REQUESTS = [
  { id: "r1", student: "Ananya I.", focus: "SOP Review & Shortlisting", date: "2 hours ago", match: 92 },
  { id: "r2", student: "Dev P.", focus: "DAAD Strategy", date: "5 hours ago", match: 88 },
];

const RECENT_ACTIVITY = [
  { time: '10:42 AM', log: 'System processed €120.00 payout to connected bank account.' },
  { time: 'Yesterday', log: 'Rahul S. uploaded "Draft_SOP_v2.pdf" to secure vault.' },
  { time: 'Tuesday', log: 'Profile visibility increased by 14% this week.' },
];

const styles = `
  .mentor-dash-wrapper {
    --teal: #00f5d4; --purple: #a855f7; --gold: #f59e0b;
    --red: #f43f5e; --green: #34d399; --blue: #3b82f6; 
    --bg: #04080f; --bg2: #0a111a; --bg3: #0f1926;
    --border: rgba(255,255,255,0.07); --border-h: rgba(255,255,255,0.15);
    --text: #e2e8f0; --muted: #64748b;
    background: var(--bg); color: var(--text); font-family: 'Syne', sans-serif;
    min-height: 100vh; display: flex; overflow: hidden; position: relative;
  }
  .mentor-dash-wrapper * { box-sizing: border-box; }
  .mentor-dash-wrapper a { text-decoration: none; color: inherit; }

  /* SCROLLBAR */
  .mentor-dash-wrapper ::-webkit-scrollbar { width: 5px; }
  .mentor-dash-wrapper ::-webkit-scrollbar-track { background: transparent; }
  .mentor-dash-wrapper ::-webkit-scrollbar-thumb { background: rgba(168,85,247,.3); border-radius: 3px; }

  /* BG EFFECTS */
  .grid-bg { position: absolute; inset: 0; z-index: 0; pointer-events: none; background-image: linear-gradient(rgba(168,85,247,.015) 1px, transparent 1px), linear-gradient(90deg, rgba(168,85,247,.015) 1px, transparent 1px); background-size: 60px 60px; mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, black 50%, transparent 100%); }
  .glow-orb { position: absolute; border-radius: 50%; pointer-events: none; z-index: 0; filter: blur(140px); opacity: 0.1; }

  /* ── SIDEBAR ── */
  .sidebar { width: 280px; background: rgba(10, 17, 26, 0.6); backdrop-filter: blur(20px); border-right: 1px solid var(--border); display: flex; flex-direction: column; z-index: 10; position: relative; }
  .sb-header { height: 72px; display: flex; align-items: center; padding: 0 24px; border-bottom: 1px solid var(--border); }
  .sb-logo { display: flex; align-items: center; gap: 10px; font-size: 1.1rem; font-weight: 700; color: #fff; }
  .sb-icon { width: 32px; height: 32px; border-radius: 8px; background: linear-gradient(135deg, var(--teal), var(--purple)); display: flex; align-items: center; justify-content: center; font-size: 14px; color: #000; }
  
  .sb-nav { flex: 1; padding: 24px 16px; display: flex; flex-direction: column; gap: 8px; overflow-y: auto; }
  .sb-link { display: flex; align-items: center; gap: 12px; padding: 12px 16px; border-radius: 12px; font-size: 0.9rem; font-weight: 600; color: var(--muted); transition: all .2s; border: 1px solid transparent; }
  .sb-link:hover { color: #fff; background: rgba(255,255,255,.02); }
  .sb-link.active { background: rgba(168,85,247,.08); color: var(--purple); border-color: rgba(168,85,247,.2); }
  
  .sb-footer { padding: 24px 16px; border-top: 1px solid var(--border); }
  .user-card { display: flex; align-items: center; gap: 12px; padding: 12px; background: rgba(255,255,255,.02); border: 1px solid var(--border); border-radius: 12px; }
  .uc-av { width: 40px; height: 40px; border-radius: 10px; object-fit: cover; border: 1px solid rgba(168,85,247,.3); }
  .uc-info { flex: 1; overflow: hidden; }
  .uc-name { font-size: 0.85rem; font-weight: 700; color: #fff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .uc-role { font-family: 'JetBrains Mono', monospace; font-size: 0.65rem; color: var(--purple); }

  /* ── MAIN CONTENT AREA ── */
  .main-area { flex: 1; display: flex; flex-direction: column; position: relative; z-index: 10; height: 100vh; overflow-y: auto; }
  
  /* TOP HEADER */
  .top-header { height: 72px; display: flex; align-items: center; justify-content: space-between; padding: 0 40px; border-bottom: 1px solid var(--border); background: rgba(4, 8, 15, 0.6); backdrop-filter: blur(10px); position: sticky; top: 0; z-index: 20; }
  
  /* Status Toggle */
  .status-toggle { display: flex; align-items: center; gap: 10px; background: rgba(255,255,255,.03); border: 1px solid var(--border); padding: 8px 16px; border-radius: 100px; }
  .status-dot { width: 8px; height: 8px; background: var(--green); border-radius: 50%; box-shadow: 0 0 10px var(--green); animation: pulse 2s infinite; }
  .status-text { font-family: 'JetBrains Mono', monospace; font-size: 0.7rem; color: var(--text); letter-spacing: .05em; }

  .th-actions { display: flex; align-items: center; gap: 16px; }
  .icon-btn { width: 40px; height: 40px; border-radius: 50%; border: 1px solid var(--border); display: flex; align-items: center; justify-content: center; color: var(--muted); background: rgba(255,255,255,.02); cursor: pointer; transition: all .2s; position: relative; }
  .icon-btn:hover { color: #fff; border-color: rgba(255,255,255,.2); }
  .badge-dot { position: absolute; top: -2px; right: -2px; width: 10px; height: 10px; background: var(--red); border-radius: 50%; border: 2px solid var(--bg); }

  /* DASHBOARD GRID */
  .dash-container { padding: 40px; max-width: 1400px; margin: 0 auto; width: 100%; display: flex; flex-direction: column; gap: 24px; animation: fadeUp .5s ease forwards; }

  /* WELCOME BANNER (HANDLER THEME) */
  .welcome-banner { background: linear-gradient(135deg, rgba(168,85,247,.08), rgba(0,245,212,.05)); border: 1px solid var(--border-h); border-radius: 20px; padding: 40px; position: relative; overflow: hidden; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 24px; }
  .welcome-banner::before { content: ''; position: absolute; top: 0; left: 0; width: 4px; height: 100%; background: linear-gradient(180deg, var(--purple), var(--teal)); }
  .wb-title { font-family: 'Bebas Neue', sans-serif; font-size: 3rem; color: #fff; letter-spacing: .04em; line-height: 1; margin-bottom: 8px; }
  .wb-sub { font-family: 'JetBrains Mono', monospace; font-size: 0.75rem; color: var(--purple); letter-spacing: .1em; text-transform: uppercase; display: flex; align-items: center; gap: 6px; }
  .wb-stats { display: flex; gap: 16px; flex-wrap: wrap; }
  .wb-stat-box { background: rgba(0,0,0,.4); border: 1px solid var(--border); padding: 16px 24px; border-radius: 12px; text-align: center; backdrop-filter: blur(10px); min-width: 130px; }
  .wb-stat-val { font-family: 'Bebas Neue', sans-serif; font-size: 2rem; color: #fff; line-height: 1; }
  .wb-stat-lbl { font-size: 0.65rem; color: var(--muted); font-weight: 600; margin-top: 4px; text-transform: uppercase; letter-spacing: .05em; }

  /* BENTO GRID */
  .bento-grid { display: grid; grid-template-columns: 2fr 1.2fr; gap: 24px; }
  @media (max-width: 1100px) { .bento-grid { grid-template-columns: 1fr; } }

  .bento-card { background: var(--bg2); border: 1px solid var(--border); border-radius: 20px; padding: 28px; position: relative; overflow: hidden; }
  .bc-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; }
  .bc-title { font-family: 'Bebas Neue', sans-serif; font-size: 1.4rem; color: #fff; letter-spacing: .04em; display: flex; align-items: center; gap: 8px; }

  /* SESSIONS WIDGET */
  .session-list { display: flex; flex-direction: column; gap: 12px; }
  .session-item { display: flex; align-items: center; justify-content: space-between; padding: 16px; background: rgba(255,255,255,.02); border: 1px solid var(--border); border-radius: 16px; transition: all .2s; }
  .session-item:hover { border-color: rgba(168,85,247,.3); background: rgba(168,85,247,.03); }
  .si-left { display: flex; align-items: center; gap: 16px; }
  .si-av { width: 48px; height: 48px; border-radius: 12px; object-fit: cover; }
  .si-name { font-size: 0.95rem; font-weight: 700; color: #fff; margin-bottom: 2px; }
  .si-target { font-family: 'JetBrains Mono', monospace; font-size: 0.65rem; color: var(--muted); }
  .si-time { display: flex; align-items: center; gap: 6px; font-size: 0.8rem; font-weight: 600; color: var(--text); }
  .btn-join { padding: 10px 16px; background: rgba(0,245,212,.1); border: 1px solid rgba(0,245,212,.3); color: var(--teal); border-radius: 10px; font-size: 0.8rem; font-weight: 700; display: flex; align-items: center; gap: 6px; cursor: pointer; transition: all .2s; }
  .btn-join:hover { background: var(--teal); color: #000; box-shadow: 0 0 15px rgba(0,245,212,.4); }

  /* REQUESTS WIDGET */
  .req-list { display: flex; flex-direction: column; gap: 12px; }
  .req-item { padding: 16px; background: rgba(255,255,255,.02); border: 1px solid var(--border); border-left: 3px solid var(--gold); border-radius: 12px; }
  .req-top { display: flex; justify-content: space-between; margin-bottom: 12px; }
  .req-name { font-weight: 700; color: #fff; font-size: 0.9rem; }
  .req-match { font-family: 'JetBrains Mono', monospace; font-size: 0.65rem; color: var(--gold); background: rgba(245,158,11,.1); padding: 2px 6px; border-radius: 4px; }
  .req-focus { font-size: 0.75rem; color: var(--muted); margin-bottom: 16px; }
  .req-actions { display: flex; gap: 8px; }
  .btn-acc { flex: 1; padding: 8px; background: var(--purple); color: #fff; border: none; border-radius: 8px; font-size: 0.75rem; font-weight: 700; cursor: pointer; }
  .btn-dec { padding: 8px 12px; background: transparent; border: 1px solid var(--border); color: var(--muted); border-radius: 8px; cursor: pointer; display: flex; align-items: center; justify-content: center; }
  .btn-dec:hover { border-color: var(--red); color: var(--red); }

  /* TERMINAL LOGS */
  .term-logs { display: flex; flex-direction: column; gap: 10px; font-family: 'JetBrains Mono', monospace; font-size: 0.7rem; }
  .log-item { display: flex; gap: 12px; padding-bottom: 10px; border-bottom: 1px dashed rgba(255,255,255,.05); }
  .log-item:last-child { border: none; }
  .log-time { color: var(--teal); width: 60px; flex-shrink: 0; }
  .log-text { color: var(--muted); }

  @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} }
`

export default function MentorDashboard() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const link = document.createElement('link')
    link.href = 'https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Syne:wght@400;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap'
    link.rel = 'stylesheet'
    document.head.appendChild(link)
  }, [])

  if (!mounted) return null;

  return (
    <div className="mentor-dash-wrapper">
      <style>{styles}</style>
      
      {/* GLOBAL BG */}
      <div className="grid-bg" />
      <div className="glow-orb" style={{ width: 600, height: 600, background: 'var(--purple)', top: '-10%', left: '-10%' }} />
      <div className="glow-orb" style={{ width: 500, height: 500, background: 'var(--teal)', bottom: '-10%', right: '-5%' }} />

      {/* ── SIDEBAR ── */}
      <aside className="sidebar">
        <div className="sb-header">
          <Link href="/" className="sb-logo">
            <div className="sb-icon"><Triangle size={16} fill="currentColor" strokeWidth={2} className="rotate-180" /></div>
            <span>Mentor<em style={{fontStyle:'normal', color:'var(--purple)'}}>Bridge</em></span>
          </Link>
        </div>

        <nav className="sb-nav">
          <Link href="/dashboard/mentor" className="sb-link active"><LayoutDashboard size={18} /> Command Center</Link>
          <Link href="#" className="sb-link"><Users size={18} /> My Roster</Link>
          <Link href="#" className="sb-link"><Calendar size={18} /> Schedule & Slots</Link>
          <Link href="#" className="sb-link"><MessageSquare size={18} /> Secure Comms</Link>
          <Link href="#" className="sb-link"><DollarSign size={18} /> Revenue & Payouts</Link>
          <Link href="#" className="sb-link"><Settings size={18} /> Profile Setup</Link>
        </nav>

        <div className="sb-footer">
          <div className="user-card">
            <img src="https://randomuser.me/api/portraits/men/11.jpg" alt="Aarav" className="uc-av" />
            <div className="uc-info">
              <div className="uc-name">Aarav Mehta</div>
              <div className="uc-role">Verified Handler</div>
            </div>
            <LogOut size={16} color="var(--muted)" style={{cursor:'pointer'}} />
          </div>
        </div>
      </aside>

      {/* ── MAIN CONTENT ── */}
      <main className="main-area">
        
        {/* TOP HEADER */}
        <header className="top-header">
          <div className="status-toggle">
            <div className="status-dot" />
            <span className="status-text">ACCEPTING NEW DOSSIERS</span>
          </div>
          <div className="th-actions">
            <div className="icon-btn">
              <Search size={18} />
            </div>
            <div className="icon-btn">
              <Bell size={18} />
              <div className="badge-dot" />
            </div>
          </div>
        </header>

        {/* DASHBOARD CONTENT */}
        <div className="dash-container">
          
          {/* WELCOME BANNER */}
          <div className="welcome-banner">
            <div>
              <div className="wb-sub"><ShieldCheck size={14} /> SECURE HANDLER TERMINAL</div>
              <h1 className="wb-title">WELCOME BACK, AARAV.</h1>
              <p style={{color:'var(--muted)', fontSize:'0.95rem'}}>Your uplink is active. You have 1 session scheduled today.</p>
            </div>
            <div className="wb-stats">
              <div className="wb-stat-box">
                <div className="wb-stat-val" style={{color:'var(--purple)'}}>14</div>
                <div className="wb-stat-lbl">ACTIVE MENTEES</div>
              </div>
              <div className="wb-stat-box">
                <div className="wb-stat-val" style={{color:'var(--green)'}}>€480</div>
                <div className="wb-stat-lbl">MONTHLY REVENUE</div>
              </div>
              <div className="wb-stat-box">
                <div className="wb-stat-val" style={{color:'var(--gold)'}}>4.9</div>
                <div className="wb-stat-lbl">COMM RATING</div>
              </div>
            </div>
          </div>

          <div className="bento-grid">
            
            {/* LEFT COLUMN */}
            <div style={{display:'flex', flexDirection:'column', gap:24}}>
              
              {/* UPCOMING SESSIONS */}
              <div className="bento-card">
                <div className="bc-header">
                  <h2 className="bc-title"><Video size={20} color="var(--teal)"/> UPCOMING UPLINKS</h2>
                  <span style={{fontFamily:'JetBrains Mono', fontSize:'0.65rem', color:'var(--muted)', cursor:'pointer'}}>VIEW CALENDAR →</span>
                </div>
                <div className="session-list">
                  {UPCOMING_SESSIONS.map((session, i) => (
                    <div key={i} className="session-item" style={{ borderColor: session.status === 'Ready' ? 'rgba(0,245,212,.3)' : '' }}>
                      <div className="si-left">
                        <img src={session.img} alt={session.student} className="si-av" />
                        <div>
                          <div className="si-name">{session.student}</div>
                          <div className="si-target">Target: {session.target}</div>
                        </div>
                      </div>
                      <div style={{ display:'flex', alignItems:'center', gap:'20px' }}>
                        <div className="si-time"><Calendar size={14} color="var(--muted)"/> {session.time}</div>
                        <button className="btn-join" style={{ opacity: session.status === 'Ready' ? 1 : 0.5, cursor: session.status === 'Ready' ? 'pointer' : 'not-allowed' }}>
                          <Video size={14}/> JOIN MEET
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* TERMINAL LOGS */}
              <div className="bento-card" style={{background: '#04080f', borderTop: '3px solid var(--purple)'}}>
                <div className="bc-header" style={{marginBottom:16}}>
                  <h2 className="bc-title" style={{fontSize:'1rem', fontFamily:'JetBrains Mono'}}><Activity size={16} color="var(--purple)"/> SYSTEM LOGS</h2>
                </div>
                <div className="term-logs">
                  {RECENT_ACTIVITY.map((log, i) => (
                    <div key={i} className="log-item">
                      <div className="log-time">[{log.time}]</div>
                      <div className="log-text">&gt; {log.log}</div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* RIGHT COLUMN */}
            <div style={{display:'flex', flexDirection:'column', gap:24}}>
              
              {/* PENDING REQUESTS */}
              <div className="bento-card">
                <div className="bc-header" style={{marginBottom:16}}>
                  <h2 className="bc-title"><Users size={20} color="var(--gold)"/> DOSSIER REQUESTS</h2>
                </div>
                <div className="req-list">
                  {PENDING_REQUESTS.map((req, i) => (
                    <div key={i} className="req-item">
                      <div className="req-top">
                        <span className="req-name">{req.student}</span>
                        <span className="req-match">{req.match}% Match</span>
                      </div>
                      <div className="req-focus">Focus: {req.focus}</div>
                      <div className="req-actions">
                        <button className="btn-acc">APPROVE DOSSIER</button>
                        <button className="btn-dec"><XCircle size={16}/></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* MARKET DEMAND RADAR (Mini version of Market Intel) */}
              <div className="bento-card">
                <div className="bc-header" style={{marginBottom:16}}>
                  <h2 className="bc-title"><TrendingUp size={20} color="var(--blue)"/> YOUR NICHE DEMAND</h2>
                </div>
                <div style={{display:'flex', flexDirection:'column', gap:12}}>
                  <div>
                    <div style={{display:'flex', justifyContent:'space-between', fontSize:'0.75rem', marginBottom:4}}>
                      <span style={{color:'#fff', fontWeight:600}}>German Public Unis</span>
                      <span style={{color:'var(--green)'}}>High</span>
                    </div>
                    <div style={{height:4, background:'rgba(255,255,255,.05)', borderRadius:2}}><div style={{width:'92%', height:'100%', background:'var(--green)', borderRadius:2}}/></div>
                  </div>
                  <div>
                    <div style={{display:'flex', justifyContent:'space-between', fontSize:'0.75rem', marginBottom:4}}>
                      <span style={{color:'#fff', fontWeight:600}}>CS Profile Building</span>
                      <span style={{color:'var(--gold)'}}>Rising</span>
                    </div>
                    <div style={{height:4, background:'rgba(255,255,255,.05)', borderRadius:2}}><div style={{width:'78%', height:'100%', background:'var(--gold)', borderRadius:2}}/></div>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>
      </main>
    </div>
  )
}