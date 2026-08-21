'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Triangle, LayoutDashboard, Users, Calendar, DollarSign, MessageSquare, Settings, Bell, Search, LogOut, Plus, Trash2 } from 'lucide-react'

const styles = `
  /* Keeping identical root variables and sidebar CSS */
  .mentor-dash-wrapper { --teal: #00f5d4; --purple: #a855f7; --gold: #f59e0b; --red: #f43f5e; --green: #34d399; --bg: #04080f; --bg2: #0a111a; --bg3: #0f1926; --border: rgba(255,255,255,0.07); --text: #e2e8f0; --muted: #64748b; background: var(--bg); color: var(--text); font-family: 'Syne', sans-serif; min-height: 100vh; display: flex; }
  .mentor-dash-wrapper * { box-sizing: border-box; } .mentor-dash-wrapper a { text-decoration: none; color: inherit; }
  .grid-bg { position: absolute; inset: 0; z-index: 0; pointer-events: none; background-image: linear-gradient(rgba(168,85,247,.015) 1px, transparent 1px), linear-gradient(90deg, rgba(168,85,247,.015) 1px, transparent 1px); background-size: 60px 60px; mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, black 50%, transparent 100%); }
  
  .sidebar { width: 280px; background: rgba(10, 17, 26, 0.6); backdrop-filter: blur(20px); border-right: 1px solid var(--border); display: flex; flex-direction: column; z-index: 10; position: relative; }
  .sb-header { height: 72px; display: flex; align-items: center; padding: 0 24px; border-bottom: 1px solid var(--border); }
  .sb-logo { display: flex; align-items: center; gap: 10px; font-size: 1.1rem; font-weight: 700; color: #fff; }
  .sb-icon { width: 32px; height: 32px; border-radius: 8px; background: linear-gradient(135deg, var(--teal), var(--purple)); display: flex; align-items: center; justify-content: center; font-size: 14px; color: #000; }
  .sb-nav { flex: 1; padding: 24px 16px; display: flex; flex-direction: column; gap: 8px; }
  .sb-link { display: flex; align-items: center; gap: 12px; padding: 12px 16px; border-radius: 12px; font-size: 0.9rem; font-weight: 600; color: var(--muted); transition: all .2s; border: 1px solid transparent; }
  .sb-link:hover { color: #fff; background: rgba(255,255,255,.02); }
  .sb-link.active { background: rgba(168,85,247,.08); color: var(--purple); border-color: rgba(168,85,247,.2); }
  
  .main-area { flex: 1; display: flex; flex-direction: column; position: relative; z-index: 10; height: 100vh; overflow-y: auto; }
  .top-header { height: 72px; display: flex; align-items: center; justify-content: space-between; padding: 0 40px; border-bottom: 1px solid var(--border); background: rgba(4, 8, 15, 0.6); backdrop-filter: blur(10px); position: sticky; top: 0; z-index: 20; }
  .dash-container { padding: 40px; max-width: 1400px; margin: 0 auto; width: 100%; display: flex; flex-direction: column; gap: 24px; animation: fadeUp .5s ease forwards; }

  /* SCHEDULE STYLES */
  .slot-card { background: var(--bg2); border: 1px solid var(--border); border-radius: 20px; padding: 32px; }
  .slot-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
  .slot-title { font-family: 'Bebas Neue', sans-serif; font-size: 2rem; color: #fff; letter-spacing: .05em; }
  .btn-add { background: var(--purple); color: #fff; padding: 10px 20px; border-radius: 10px; font-weight: 700; font-size: 0.85rem; border: none; cursor: pointer; display: flex; align-items: center; gap: 8px; transition: all .2s; }
  .btn-add:hover { box-shadow: 0 0 20px rgba(168,85,247,.4); }

  .slot-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 16px; }
  .slot-item { background: rgba(255,255,255,.02); border: 1px solid var(--border); border-radius: 12px; padding: 20px; position: relative; }
  .slot-day { font-weight: 700; color: #fff; margin-bottom: 4px; font-size: 1.1rem; }
  .slot-time { font-family: 'JetBrains Mono', monospace; font-size: 0.8rem; color: var(--teal); margin-bottom: 16px; }
  .slot-status { display: inline-block; font-size: 0.65rem; padding: 4px 10px; border-radius: 100px; font-weight: 600; text-transform: uppercase; }
  .slot-status.open { background: rgba(0,245,212,.1); color: var(--teal); border: 1px solid rgba(0,245,212,.3); }
  .slot-status.booked { background: rgba(245,158,11,.1); color: var(--gold); border: 1px solid rgba(245,158,11,.3); }

  .btn-delete { position: absolute; top: 16px; right: 16px; color: var(--muted); cursor: pointer; transition: color .2s; background: none; border: none; }
  .btn-delete:hover { color: var(--red); }

  @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
`

export default function SchedulePage() {
  const [mounted, setMounted] = useState(false)
  const [slots, setSlots] = useState([
    { id: 1, day: 'Monday', time: '07:00 - 07:30', status: 'booked' },
    { id: 2, day: 'Monday', time: '18:00 - 18:30', status: 'open' },
    { id: 3, day: 'Wednesday', time: '19:00 - 19:30', status: 'open' },
  ])

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
      <div className="grid-bg" />
      
      {/* ── SIDEBAR ── */}
      <aside className="sidebar">
        <div className="sb-header">
          <Link href="/" className="sb-logo">
            <div className="sb-icon"><Triangle size={16} fill="currentColor" strokeWidth={2} className="rotate-180" /></div>
            <span>Mentor<em style={{fontStyle:'normal', color:'var(--purple)'}}>Bridge</em></span>
          </Link>
        </div>
        <nav className="sb-nav">
          <Link href="/dashboard/mentor" className="sb-link"><LayoutDashboard size={18} /> Command Center</Link>
          <Link href="/dashboard/mentor/roster" className="sb-link"><Users size={18} /> My Roster</Link>
          <Link href="/dashboard/mentor/schedule" className="sb-link active"><Calendar size={18} /> Schedule & Slots</Link>
          <Link href="#" className="sb-link"><MessageSquare size={18} /> Secure Comms</Link>
          <Link href="/dashboard/mentor/revenue" className="sb-link"><DollarSign size={18} /> Revenue & Payouts</Link>
          <Link href="#" className="sb-link"><Settings size={18} /> Profile Setup</Link>
        </nav>
      </aside>

      {/* ── MAIN CONTENT ── */}
      <main className="main-area">
        <header className="top-header">
          <div style={{fontFamily:'Bebas Neue', fontSize:'1.5rem', letterSpacing:'.05em'}}>AVAILABILITY CALENDAR</div>
          <div className="th-actions">
            <div className="icon-btn"><Bell size={18} /></div>
          </div>
        </header>

        <div className="dash-container">
          <div className="slot-card">
            <div className="slot-header">
              <div>
                <h1 className="slot-title">MANAGE YOUR SLOTS</h1>
                <p style={{fontSize:'0.85rem', color:'var(--muted)'}}>Add or remove 30-minute blocks. Students can only book open slots.</p>
              </div>
              <button className="btn-add"><Plus size={16}/> NEW SLOT</button>
            </div>

            <div className="slot-grid">
              {slots.map(slot => (
                <div key={slot.id} className="slot-item" style={{borderColor: slot.status === 'booked' ? 'rgba(245,158,11,.3)' : ''}}>
                  <div className="slot-day">{slot.day}</div>
                  <div className="slot-time">{slot.time}</div>
                  <div className={`slot-status ${slot.status}`}>
                    {slot.status === 'booked' ? 'LOCKED / BOOKED' : 'OPEN FOR BOOKING'}
                  </div>
                  {slot.status === 'open' && (
                    <button className="btn-delete" onClick={() => setSlots(slots.filter(s => s.id !== slot.id))}>
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}