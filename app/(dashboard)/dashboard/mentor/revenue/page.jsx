'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Triangle, LayoutDashboard, Users, Calendar, DollarSign, MessageSquare, Settings, Bell, Search, LogOut, ArrowUpRight, CheckCircle2, Clock } from 'lucide-react'

const styles = `
  /* Keeping identical root variables and sidebar CSS to match the main dashboard */
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

  /* REVENUE SPECIFIC STYLES */
  .rev-hero { display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 24px; }
  .rh-card { background: var(--bg2); border: 1px solid var(--border); border-radius: 20px; padding: 32px; position: relative; overflow: hidden; }
  .rh-main { background: linear-gradient(135deg, rgba(0,245,212,.05), rgba(168,85,247,.05)); border: 1px solid rgba(0,245,212,.2); }
  .rh-lbl { font-family: 'JetBrains Mono', monospace; font-size: 0.7rem; color: var(--muted); letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 12px; }
  .rh-val { font-family: 'Bebas Neue', sans-serif; font-size: 4rem; color: #fff; line-height: 1; margin-bottom: 8px; }
  .rh-sub { font-size: 0.85rem; color: var(--green); display: flex; align-items: center; gap: 6px; }

  .payout-btn { background: var(--teal); color: #000; padding: 12px 24px; border-radius: 12px; font-weight: 700; font-size: 0.9rem; border: none; cursor: pointer; display: flex; align-items: center; gap: 8px; transition: all .2s; }
  .payout-btn:hover { box-shadow: 0 0 20px rgba(0,245,212,.4); transform: translateY(-2px); }

  .tx-list { background: var(--bg2); border: 1px solid var(--border); border-radius: 20px; padding: 32px; }
  .tx-item { display: flex; justify-content: space-between; align-items: center; padding: 16px 0; border-bottom: 1px solid var(--border); }
  .tx-item:last-child { border: none; padding-bottom: 0; }
  .tx-left { display: flex; align-items: center; gap: 16px; }
  .tx-icon { width: 40px; height: 40px; border-radius: 50%; background: rgba(255,255,255,.03); display: flex; align-items: center; justify-content: center; }
  .tx-icon.in { color: var(--green); background: rgba(52,211,153,.1); }
  .tx-icon.out { color: var(--purple); background: rgba(168,85,247,.1); }
  .tx-title { font-weight: 700; color: #fff; margin-bottom: 4px; }
  .tx-date { font-family: 'JetBrains Mono', monospace; font-size: 0.65rem; color: var(--muted); }
  .tx-amount { font-family: 'Bebas Neue', sans-serif; font-size: 1.4rem; color: #fff; }
  .tx-status { font-size: 0.7rem; padding: 4px 10px; border-radius: 100px; font-weight: 600; text-transform: uppercase; }
  .tx-status.paid { background: rgba(52,211,153,.1); color: var(--green); border: 1px solid rgba(52,211,153,.3); }
  .tx-status.pending { background: rgba(245,158,11,.1); color: var(--gold); border: 1px solid rgba(245,158,11,.3); }

  @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
`

export default function RevenuePage() {
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
          <Link href="/dashboard/mentor/schedule" className="sb-link"><Calendar size={18} /> Schedule & Slots</Link>
          <Link href="#" className="sb-link"><MessageSquare size={18} /> Secure Comms</Link>
          <Link href="/dashboard/mentor/revenue" className="sb-link active"><DollarSign size={18} /> Revenue & Payouts</Link>
          <Link href="#" className="sb-link"><Settings size={18} /> Profile Setup</Link>
        </nav>
      </aside>

      {/* ── MAIN CONTENT ── */}
      <main className="main-area">
        <header className="top-header">
          <div style={{fontFamily:'Bebas Neue', fontSize:'1.5rem', letterSpacing:'.05em'}}>FINANCIAL LEDGER</div>
          <div className="th-actions">
            <div className="icon-btn"><Bell size={18} /></div>
          </div>
        </header>

        <div className="dash-container">
          
          <div className="rev-hero">
            <div className="rh-card rh-main">
              <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start'}}>
                <div>
                  <div className="rh-lbl">Available for Payout</div>
                  <div className="rh-val" style={{color:'var(--teal)'}}>₹18,000</div>
                  <div className="rh-sub"><ArrowUpRight size={14}/> +₹4,000 this week</div>
                </div>
                <button className="payout-btn">WITHDRAW FUNDS</button>
              </div>
            </div>
            <div className="rh-card">
              <div className="rh-lbl">Pending Clearance</div>
              <div className="rh-val" style={{color:'var(--gold)'}}>₹4,000</div>
              <div style={{fontSize:'0.75rem', color:'var(--muted)'}}>Clears 48hrs after session completion</div>
            </div>
            <div className="rh-card">
              <div className="rh-lbl">Total Lifetime Earnings</div>
              <div className="rh-val">₹82,000</div>
              <div style={{fontSize:'0.75rem', color:'var(--muted)'}}>Since Jan 2026</div>
            </div>
          </div>

          <div className="tx-list">
            <h2 style={{fontFamily:'Bebas Neue', fontSize:'1.5rem', marginBottom:24}}>RECENT TRANSACTIONS</h2>
            
            <div className="tx-item">
              <div className="tx-left">
                <div className="tx-icon in"><CheckCircle2 size={20}/></div>
                <div>
                  <div className="tx-title">Session Completed: Priya S.</div>
                  <div className="tx-date">Oct 14, 2026 · ID: MB-TX-9821</div>
                </div>
              </div>
              <div style={{textAlign:'right'}}>
                <div className="tx-amount">+₹2,000</div>
                <div className="tx-status pending">Pending Clearance</div>
              </div>
            </div>

            <div className="tx-item">
              <div className="tx-left">
                <div className="tx-icon out"><DollarSign size={20}/></div>
                <div>
                  <div className="tx-title">Bank Payout (HDFC ****1234)</div>
                  <div className="tx-date">Oct 10, 2026 · ID: MB-WD-4432</div>
                </div>
              </div>
              <div style={{textAlign:'right'}}>
                <div className="tx-amount" style={{color:'var(--muted)'}}>-₹12,000</div>
                <div className="tx-status paid">Processed</div>
              </div>
            </div>

            <div className="tx-item">
              <div className="tx-left">
                <div className="tx-icon in"><CheckCircle2 size={20}/></div>
                <div>
                  <div className="tx-title">Session Completed: Rahul M.</div>
                  <div className="tx-date">Oct 08, 2026 · ID: MB-TX-8831</div>
                </div>
              </div>
              <div style={{textAlign:'right'}}>
                <div className="tx-amount">+₹2,000</div>
                <div className="tx-status paid">Cleared</div>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  )
}