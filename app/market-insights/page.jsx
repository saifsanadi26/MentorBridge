'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Triangle, ShieldAlert, Cpu, TerminalSquare, Zap, Database, Lock, Code2, MapPin } from 'lucide-react'

// ════════════════════════════════════════════════════════════
//  MASSIVE INTELLIGENCE DATABASE
// ════════════════════════════════════════════════════════════
const TELEMETRY_FEED = [
  "⚡ GERMANY: APS processing times reduced to 3 weeks.",
  "⚡ USA: H1-B FY2026 selection rate projected at ~18%.",
  "⚡ UK: Graduate visa (2-year) confirmed to remain active.",
  "⚡ CANADA: Express Entry STEM draws targeting 480+ CRS.",
  "⚡ AUS: 485 Visa rules updated — IT & Engineering still prioritized.",
  "⚡ IRELAND: Stamp 1G post-study work rights highly favorable for Tech.",
  "⚡ NETHERLANDS: Orientation year visa attracting massive AI talent.",
  "⚡ GLOBAL: PyTorch & Rust developers seeing +22% salary premiums."
];

const IMMIGRATION_MATRIX = [
  { id: 'de', country: 'Germany', flag: '🇩🇪', visa: '18-Month Job Seeker', pr: '21 Mos (Blue Card)', risk: 'Low', color: '#00f5d4', cost: '€0 - €1.5k/yr', english: 'Possible (Tech)', jobs: 'High' },
  { id: 'ca', country: 'Canada', flag: '🇨🇦', visa: '3-Year PGWP', pr: '1-3 Yrs (Express Entry)', risk: 'Low', color: '#34d399', cost: 'C$15k - 35k/yr', english: 'Native', jobs: 'Medium' },
  { id: 'au', country: 'Australia', flag: '🇦🇺', visa: '2-4 Yr Post-Study', pr: '3-4 Yrs (Points)', risk: 'Medium', color: '#f59e0b', cost: 'A$30k - 45k/yr', english: 'Native', jobs: 'Medium-High' },
  { id: 'uk', country: 'UK', flag: '🇬🇧', visa: '2-Year Graduate', pr: '5 Yrs (Tier 2)', risk: 'Medium-High', color: '#a855f7', cost: '£15k - 25k/yr', english: 'Native', jobs: 'Medium' },
  { id: 'us', country: 'USA', flag: '🇺🇸', visa: '3-Year STEM OPT', pr: '10-15+ Yrs (Lottery)', risk: 'High', color: '#f43f5e', cost: '$25k - 60k/yr', english: 'Native', jobs: 'Highest' },
  { id: 'nl', country: 'Netherlands', flag: '🇳🇱', visa: '1-Yr Orientation', pr: '5 Years', risk: 'Low-Medium', color: '#00c9ac', cost: '€15k - 20k/yr', english: 'Highly Common', jobs: 'Medium' },
  { id: 'ie', country: 'Ireland', flag: '🇮🇪', visa: '2-Yr Stamp 1G', pr: '5 Years', risk: 'Low-Medium', color: '#3b82f6', cost: '€12k - 20k/yr', english: 'Native', jobs: 'Medium-High' },
  { id: 'sg', country: 'Singapore', flag: '🇸🇬', visa: '1-Yr LTVP', pr: 'Varies Heavily', risk: 'High', color: '#fb923c', cost: 'S$20k - 40k/yr', english: 'Native', jobs: 'High' },
];

const TECH_HUBS = [
  { city: 'Berlin', country: 'DE', currency: '€', demand: 94, salary: '65k', cost: '€1.2k/mo', trend: '+14% YoY', tags: ['Fintech', 'Mobility'], 
    salaryHistory: [48, 51, 54, 58, 60, 63, 65], demandHistory: [70, 75, 72, 80, 85, 90, 94] },
  { city: 'London', country: 'UK', currency: '£', demand: 88, salary: '55k', cost: '£1.8k/mo', trend: '+8% YoY', tags: ['AI', 'Finance'], 
    salaryHistory: [45, 47, 48, 50, 52, 54, 55], demandHistory: [80, 82, 78, 75, 82, 85, 88] },
  { city: 'Toronto', country: 'CA', currency: 'C$', demand: 95, salary: '85k', cost: 'C$2.0k/mo', trend: '+18% YoY', tags: ['Deep Learning', 'SaaS'], 
    salaryHistory: [65, 68, 72, 76, 80, 82, 85], demandHistory: [60, 65, 75, 80, 88, 92, 95] },
  { city: 'Munich', country: 'DE', currency: '€', demand: 91, salary: '72k', cost: '€1.5k/mo', trend: '+12% YoY', tags: ['Auto-Tech', 'Robotics'], 
    salaryHistory: [55, 58, 62, 65, 68, 70, 72], demandHistory: [75, 78, 80, 82, 85, 88, 91] },
  { city: 'New York', country: 'US', currency: '$', demand: 85, salary: '120k', cost: '$3.5k/mo', trend: '+5% YoY', tags: ['Fintech', 'Media'], 
    salaryHistory: [95, 100, 105, 110, 115, 118, 120], demandHistory: [95, 92, 88, 85, 82, 84, 85] },
  { city: 'Sydney', country: 'AU', currency: 'A$', demand: 87, salary: '95k', cost: 'A$2.2k/mo', trend: '+10% YoY', tags: ['Cybersec', 'Cloud'], 
    salaryHistory: [75, 78, 82, 85, 88, 92, 95], demandHistory: [65, 70, 75, 72, 80, 85, 87] },
  { city: 'Amsterdam', country: 'NL', currency: '€', demand: 89, salary: '60k', cost: '€1.6k/mo', trend: '+15% YoY', tags: ['Payments', 'Logistics'], 
    salaryHistory: [45, 48, 50, 52, 55, 58, 60], demandHistory: [60, 65, 68, 75, 80, 85, 89] },
  { city: 'Dublin', country: 'IE', currency: '€', demand: 92, salary: '55k', cost: '€1.8k/mo', trend: '+11% YoY', tags: ['Cloud HQs', 'Data'], 
    salaryHistory: [40, 42, 45, 48, 50, 53, 55], demandHistory: [70, 75, 80, 82, 85, 88, 92] },
];

const SKILL_ARBITRAGE = [
  { skill: 'PyTorch / LLMs', bump: '+28%', hub: 'USA / CA', status: 'CRITICAL DEMAND', color: '#00f5d4' },
  { skill: 'Kubernetes / AWS', bump: '+22%', hub: 'Global', status: 'HIGH DEFICIT', color: '#a855f7' },
  { skill: 'Rust / Go', bump: '+18%', hub: 'EU', status: 'RISING', color: '#f59e0b' },
  { skill: 'Data Engineering', bump: '+24%', hub: 'Global', status: 'CRITICAL DEMAND', color: '#00f5d4' },
  { skill: 'Cybersecurity', bump: '+19%', hub: 'AUS / UK', status: 'HIGH DEFICIT', color: '#34d399' },
  { skill: 'SAP Consulting', bump: '+15%', hub: 'Germany', status: 'STEADY', color: '#3b82f6' },
];

const LIVE_OFFERS = [
  { role: 'Data Scientist', company: 'Zalando', location: 'Berlin, DE', salary: '€68,000', time: '2m ago' },
  { role: 'SWE II', company: 'Amazon', location: 'Seattle, US', salary: '$145,000', time: '14m ago' },
  { role: 'ML Engineer', company: 'Vector Inst.', location: 'Toronto, CA', salary: 'C$105,000', time: '28m ago' },
  { role: 'Business Analyst', company: 'Revolut', location: 'Berlin, DE', salary: '€58,000', time: '41m ago' },
  { role: 'Cloud Architect', company: 'Microsoft', location: 'Dublin, IE', salary: '€72,000', time: '1h ago' },
  { role: 'Quant Analyst', company: 'Barclays', location: 'London, UK', salary: '£65,000', time: '1h 15m ago' },
];

// ════════════════════════════════════════════════════════════
//  INTERACTIVE SPARKLINE COMPONENT (The Magic Graph)
// ════════════════════════════════════════════════════════════
const InteractiveHubCard = ({ hub }) => {
  const [metric, setMetric] = useState('salary') // 'salary' or 'demand'
  const [hoverIdx, setHoverIdx] = useState(null)

  const activeData = metric === 'salary' ? hub.salaryHistory : hub.demandHistory
  const activeColor = metric === 'salary' ? 'var(--teal)' : 'var(--purple)'
  const activePrefix = metric === 'salary' ? hub.currency : ''
  const activeSuffix = metric === 'salary' ? 'k' : ' pts'
  const activeLabel = metric === 'salary' ? 'SALARY GROWTH' : 'HIRING DEMAND'

  // Calculate SVG Points
  const max = Math.max(...activeData)
  const min = Math.min(...activeData)
  const range = max - min || 1
  
  const points = activeData.map((val, i) => {
    const x = (i / (activeData.length - 1)) * 200
    const y = 50 - ((val - min) / range) * 40 // Y ranges from 10 to 50 (to fit in 60px height)
    return `${x},${y}`
  }).join(' ')

  const toggleMetric = () => {
    setMetric(prev => prev === 'salary' ? 'demand' : 'salary')
    setHoverIdx(null)
  }

  return (
    <div className="hub-card">
      <div className="hc-top">
        <div>
          <div className="hc-city">{hub.city}</div>
          <div className="hc-cc">{hub.country}</div>
        </div>
        <div className="hc-trend">{hub.trend}</div>
      </div>

      {/* INTERACTIVE GRAPH AREA */}
      <div 
        className="hc-chart-container" 
        onClick={toggleMetric}
        onMouseLeave={() => setHoverIdx(null)}
        title="Click to toggle metric"
      >
        <div className="chart-header">
          <span style={{ color: activeColor }}>{activeLabel}</span>
          <span className="chart-hint">Click to swap ⟲</span>
        </div>
        
        <svg className="spark-svg" viewBox="0 0 200 60" preserveAspectRatio="none">
          {/* Background grid lines */}
          <line x1="0" y1="10" x2="200" y2="10" stroke="rgba(255,255,255,0.05)" strokeWidth="1" strokeDasharray="4 4" />
          <line x1="0" y1="50" x2="200" y2="50" stroke="rgba(255,255,255,0.05)" strokeWidth="1" strokeDasharray="4 4" />

          {/* The Data Line */}
          <polyline 
            points={points} 
            fill="none" 
            stroke={activeColor} 
            strokeWidth="3" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="animated-path"
            style={{ filter: `drop-shadow(0 4px 8px ${activeColor}60)` }}
          />

          {/* Current Node Dot (End of line) */}
          <circle 
            cx="200" 
            cy={50 - ((activeData[activeData.length-1] - min) / range) * 40} 
            r="4" 
            fill={activeColor} 
          />

          {/* Hover Interaction Overlay & Crosshairs */}
          {activeData.map((val, i) => {
            const cx = (i / (activeData.length - 1)) * 200
            const cy = 50 - ((val - min) / range) * 40
            const isHovered = hoverIdx === i

            return (
              <g key={i}>
                {/* Invisible hover catchers */}
                <rect 
                  x={Math.max(0, cx - 15)} 
                  y="0" 
                  width="30" 
                  height="60" 
                  fill="transparent" 
                  onMouseEnter={() => setHoverIdx(i)}
                  style={{ cursor: 'pointer' }}
                />
                
                {/* Crosshair & Tooltip when hovered */}
                {isHovered && (
                  <g style={{ pointerEvents: 'none' }}>
                    <line x1={cx} y1="0" x2={cx} y2="60" stroke="rgba(255,255,255,0.2)" strokeWidth="1" strokeDasharray="2 2" />
                    <circle cx={cx} cy={cy} r="5" fill="#fff" stroke={activeColor} strokeWidth="2" />
                    
                    {/* Tooltip Background */}
                    <rect 
                      x={cx > 160 ? cx - 45 : cx < 40 ? cx + 5 : cx - 20} 
                      y={cy < 30 ? cy + 10 : cy - 25} 
                      width="40" 
                      height="18" 
                      fill="#060c14" 
                      stroke={activeColor}
                      strokeWidth="1"
                      rx="4" 
                    />
                    {/* Tooltip Text */}
                    <text 
                      x={cx > 160 ? cx - 25 : cx < 40 ? cx + 25 : cx} 
                      y={cy < 30 ? cy + 23 : cy - 12} 
                      fill="#fff" 
                      fontSize="9" 
                      fontFamily="'JetBrains Mono', monospace" 
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      {activePrefix}{val}{activeSuffix}
                    </text>
                  </g>
                )}
              </g>
            )
          })}
        </svg>
      </div>

      <div className="hc-metrics">
        <div className="hcm"><span className="hcm-lbl">Base Salary</span><span className="hcm-val" style={{color: metric === 'salary' ? activeColor : 'var(--text)'}}>{hub.currency}{hub.salary}</span></div>
        <div className="hcm"><span className="hcm-lbl">Hiring Demand</span>
          <div style={{display:'flex', alignItems:'center', gap:'8px', marginTop:'2px'}}>
            <div style={{flex:1, height:'4px', background:'rgba(255,255,255,.05)', borderRadius:'2px', overflow:'hidden'}}>
              <div style={{width:`${hub.demand}%`, height:'100%', background: metric === 'demand' ? activeColor : 'var(--muted)', transition: 'background 0.3s'}}></div>
            </div>
            <span style={{fontFamily:'JetBrains Mono', fontSize:'0.8rem', color: metric === 'demand' ? activeColor : 'var(--text)', fontWeight:700}}>{hub.demand}</span>
          </div>
        </div>
      </div>
      <div className="hc-tags">
        {hub.tags.map((t, j) => <span className="hc-tag" key={j}>{t}</span>)}
      </div>
    </div>
  )
}

// ════════════════════════════════════════════════════════════
//  GLOBAL STYLES
// ════════════════════════════════════════════════════════════
const styles = `
  .market-v2 {
    --teal: #00f5d4; --purple: #a855f7; --gold: #f59e0b;
    --red: #f43f5e; --green: #34d399; --blue: #3b82f6; 
    --bg: #060c14; --bg2: #0d1520; --bg3: #111c2e;
    --border: rgba(255,255,255,0.07);
    --text: #e2e8f0; --muted: #64748b;
    background: var(--bg); color: var(--text); font-family: 'Syne', sans-serif;
    min-height: 100vh; overflow-x: hidden; position: relative;
  }
  .market-v2 * { box-sizing: border-box; }
  .market-v2 a { text-decoration: none; color: inherit; }

  .market-v2 ::-webkit-scrollbar { width: 5px; }
  .market-v2 ::-webkit-scrollbar-track { background: var(--bg); }
  .market-v2 ::-webkit-scrollbar-thumb { background: rgba(0,245,212,.2); border-radius: 3px; }

  .grid-bg { position: fixed; inset: 0; z-index: 0; pointer-events: none; background-image: linear-gradient(rgba(0,245,212,.02) 1px, transparent 1px), linear-gradient(90deg, rgba(0,245,212,.02) 1px, transparent 1px); background-size: 60px 60px; mask-image: radial-gradient(ellipse 80% 80% at 50% 0%, black 40%, transparent 100%); }
  .glow-orb { position: fixed; border-radius: 50%; pointer-events: none; z-index: 0; filter: blur(140px); opacity: 0.12; }
  .orb1 { width: 800px; height: 800px; background: var(--teal); top: -200px; left: -200px; animation: drift 20s ease-in-out infinite alternate; }
  .orb2 { width: 600px; height: 600px; background: var(--purple); bottom: 100px; right: -100px; animation: drift 25s ease-in-out infinite alternate-reverse; }
  @keyframes drift { 0% { transform: translate(0,0); } 100% { transform: translate(40px, 40px); } }

  .m-nav { position: fixed; top: 0; left: 0; right: 0; z-index: 999; height: 64px; display: flex; align-items: center; justify-content: space-between; padding: 0 40px; background: rgba(6,12,20,.85); backdrop-filter: blur(16px); border-bottom: 1px solid var(--border); }
  .nav-logo { display: flex; align-items: center; gap: 10px; font-size: 1.1rem; font-weight: 700; color: #fff; }
  .logo-icon { width: 34px; height: 34px; border-radius: 9px; background: linear-gradient(135deg, var(--teal), var(--purple)); display: flex; align-items: center; justify-content: center; font-size: 16px; color: #000; }
  .nav-logo em { font-style: normal; color: var(--teal); }
  .nav-links { display: flex; gap: 28px; }
  .nav-links a { color: var(--muted); font-size: 0.85rem; font-weight: 600; transition: color .2s; letter-spacing: .04em; }
  .nav-links a.active { color: var(--teal); }
  .nav-links a:hover { color: #fff; }
  .btn-ghost { padding: 8px 18px; border: 1px solid var(--border); border-radius: 8px; color: #fff; font-size: 0.82rem; font-weight: 600; cursor: pointer; background: none; transition: border-color .2s; }
  .btn-ghost:hover { border-color: rgba(255,255,255,.3); }
  .btn-primary { padding: 8px 20px; border-radius: 8px; border: none; background: var(--teal); color: #060c14; font-size: 0.82rem; font-weight: 700; cursor: pointer; transition: opacity .2s; }
  .btn-primary:hover { opacity: .85; }

  .ticker-bar { position: fixed; top: 64px; left: 0; right: 0; z-index: 998; height: 32px; background: #04080c; border-bottom: 1px solid var(--border); display: flex; align-items: center; overflow: hidden; font-family: 'JetBrains Mono', monospace; font-size: 0.65rem; color: var(--teal); letter-spacing: .08em; }
  .ticker-track { display: flex; white-space: nowrap; animation: ticker 40s linear infinite; }
  .ticker-track:hover { animation-play-state: paused; }
  .ticker-item { display: inline-flex; align-items: center; padding: 0 40px; }
  @keyframes ticker { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }

  .m-main { position: relative; z-index: 1; padding-top: 96px; }
  .hero { padding: 60px 40px 60px; max-width: 1400px; margin: 0 auto; text-align: center; animation: fadeUp .6s ease both; }
  .hero-badge { display: inline-flex; align-items: center; gap: 8px; padding: 6px 14px; border-radius: 100px; border: 1px solid rgba(0,245,212,.3); font-size: 0.72rem; font-family: 'JetBrains Mono', monospace; color: var(--teal); letter-spacing: .12em; margin-bottom: 24px; background: rgba(0,245,212,.05); }
  .hero-badge::before { content: ''; width: 7px; height: 7px; border-radius: 50%; background: var(--teal); animation: pulse 2s infinite; }
  @keyframes pulse { 0%,100%{box-shadow:0 0 0 0 rgba(0,245,212,.4)} 50%{box-shadow:0 0 0 6px rgba(0,245,212,0)} }
  
  .hero-title { font-family: 'Bebas Neue', sans-serif; font-size: clamp(60px, 8vw, 120px); line-height: .9; letter-spacing: .02em; color: #fff; margin-bottom: 16px; text-shadow: 0 0 40px rgba(0,245,212,.1); }
  .hero-title span { background: linear-gradient(90deg, var(--teal), var(--purple)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
  .hero-sub { font-size: 1.1rem; color: var(--muted); max-width: 600px; margin: 0 auto 40px; line-height: 1.6; }

  .live-stats { display: flex; justify-content: center; gap: 40px; flex-wrap: wrap; margin-bottom: 20px; }
  .ls-item { display: flex; flex-direction: column; align-items: center; gap: 6px; padding: 16px 32px; background: rgba(255,255,255,.02); border: 1px solid var(--border); border-radius: 16px; backdrop-filter: blur(10px); }
  .ls-val { font-family: 'Bebas Neue', sans-serif; font-size: 3rem; color: var(--text); line-height: 1; text-shadow: 0 0 20px currentColor; }
  .ls-lbl { font-family: 'JetBrains Mono', monospace; font-size: 0.65rem; color: var(--muted); letter-spacing: .1em; text-transform: uppercase; }

  .section { max-width: 1400px; margin: 0 auto; padding: 0 40px 80px; }
  .section-eyebrow { font-family: 'JetBrains Mono', monospace; font-size: 0.7rem; color: var(--purple); letter-spacing: .15em; padding: 5px 12px; border: 1px solid rgba(168,85,247,.3); border-radius: 4px; display: inline-flex; align-items: center; gap: 6px; margin-bottom: 20px; background: rgba(168,85,247,.05); }
  .section-title { font-family: 'Bebas Neue', sans-serif; font-size: clamp(36px, 4vw, 56px); letter-spacing: .02em; line-height: 1; color: #fff; margin-bottom: 10px; }
  .section-sub { color: var(--muted); font-size: 0.95rem; margin-bottom: 36px; max-width: 600px; line-height: 1.6; }

  /* IMMIGRATION MATRIX TABLE */
  .im-table-wrap { background: var(--bg2); border: 1px solid var(--border); border-radius: 20px; overflow: hidden; box-shadow: 0 24px 80px rgba(0,0,0,.4); }
  .im-table { width: 100%; border-collapse: collapse; text-align: left; }
  .im-th { padding: 20px 24px; font-family: 'JetBrains Mono', monospace; font-size: 0.65rem; color: var(--muted); letter-spacing: .1em; text-transform: uppercase; border-bottom: 1px solid var(--border); background: rgba(255,255,255,.02); }
  .im-tr { border-bottom: 1px solid var(--border); transition: background .2s; }
  .im-tr:hover { background: rgba(255,255,255,.02); }
  .im-tr:last-child { border-bottom: none; }
  .im-td { padding: 20px 24px; font-size: 0.9rem; color: var(--text); vertical-align: middle; }
  .im-country { font-family: 'Bebas Neue', sans-serif; font-size: 1.4rem; color: #fff; letter-spacing: .04em; display: flex; align-items: center; gap: 10px; }
  .im-pill { font-family: 'JetBrains Mono', monospace; font-size: 0.65rem; padding: 4px 10px; border-radius: 100px; font-weight: 600; display: inline-block; white-space: nowrap; }

  /* TECH HUB BENTO - INTERACTIVE */
  .hub-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 16px; }
  .hub-card { background: var(--bg2); border: 1px solid var(--border); border-radius: 20px; padding: 28px; position: relative; overflow: hidden; transition: all .3s; }
  .hub-card:hover { border-color: rgba(255,255,255,.15); transform: translateY(-3px); box-shadow: 0 20px 50px rgba(0,0,0,.5); }
  
  .hc-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px; }
  .hc-city { font-family: 'Bebas Neue', sans-serif; font-size: 2.2rem; color: #fff; line-height: 1; letter-spacing: .02em; }
  .hc-cc { font-family: 'JetBrains Mono', monospace; font-size: 0.75rem; color: var(--teal); margin-top: 4px; display: block; }
  .hc-trend { font-size: 0.75rem; color: var(--green); background: rgba(52,211,153,.1); border: 1px solid rgba(52,211,153,.2); padding: 4px 10px; border-radius: 100px; font-weight: 600; font-family: 'JetBrains Mono', monospace; }
  
  .hc-chart-container { height: 80px; width: 100%; margin-bottom: 24px; position: relative; cursor: pointer; border-radius: 8px; background: rgba(255,255,255,.01); border: 1px solid transparent; transition: background 0.2s, border-color 0.2s; padding: 10px 0 0; }
  .hc-chart-container:hover { background: rgba(255,255,255,.03); border-color: rgba(255,255,255,.05); }
  
  .chart-header { display: flex; justify-content: space-between; padding: 0 10px; font-family: 'JetBrains Mono', monospace; font-size: 0.6rem; letter-spacing: .1em; position: absolute; top: 4px; left: 0; right: 0; font-weight: 600; pointer-events: none; }
  .chart-hint { color: var(--muted); opacity: 0; transition: opacity 0.2s; }
  .hc-chart-container:hover .chart-hint { opacity: 1; }

  .spark-svg { width: 100%; height: 100%; overflow: visible; padding: 0 10px; }
  .animated-path { transition: d 0.5s cubic-bezier(0.4, 0, 0.2, 1), stroke 0.5s ease; }

  .hc-metrics { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 20px; }
  .hcm { display: flex; flex-direction: column; gap: 4px; }
  .hcm-lbl { font-family: 'JetBrains Mono', monospace; font-size: 0.6rem; color: var(--muted); text-transform: uppercase; letter-spacing: .05em; }
  .hcm-val { font-size: 1.2rem; font-weight: 700; color: var(--text); transition: color 0.3s ease; }
  .hc-tags { display: flex; gap: 6px; flex-wrap: wrap; padding-top: 16px; border-top: 1px solid var(--border); }
  .hc-tag { font-family: 'JetBrains Mono', monospace; font-size: 0.65rem; padding: 4px 10px; border-radius: 4px; background: rgba(255,255,255,.03); border: 1px solid var(--border); color: var(--muted); }

  /* SPLIT SECTION: TERMINAL & OFFERS */
  .split-grid { display: grid; grid-template-columns: 1.5fr 1fr; gap: 24px; }
  @media (max-width: 1024px) { .split-grid { grid-template-columns: 1fr; } }

  /* TERMINAL SKILL ARBITRAGE */
  .terminal-box { background: #04080c; border: 1px solid var(--border); border-top: 4px solid var(--purple); border-radius: 20px; padding: 32px; font-family: 'JetBrains Mono', monospace; position: relative; overflow: hidden; box-shadow: 0 24px 60px rgba(0,0,0,.6); }
  .terminal-box::before { content: ''; position: absolute; inset: 0; background: linear-gradient(180deg, transparent, rgba(168,85,247,.04), transparent); animation: scan 4s linear infinite; pointer-events: none; }
  .term-header { font-size: 0.65rem; color: var(--purple); margin-bottom: 24px; display: flex; justify-content: space-between; border-bottom: 1px dashed rgba(168,85,247,.3); padding-bottom: 12px; }
  .term-grid { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 16px; border-bottom: 1px dashed var(--border); padding-bottom: 12px; margin-bottom: 12px; font-size: 0.65rem; color: var(--muted); text-transform: uppercase; }
  .term-row { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 16px; padding: 14px 0; font-size: 0.85rem; color: #e2e8f0; align-items: center; border-bottom: 1px solid rgba(255,255,255,.03); }
  .term-row:last-child { border-bottom: none; }
  .t-skill { color: #fff; font-weight: 600; display: flex; align-items: center; gap: 10px; }
  .t-bump { font-size: 1rem; font-weight: 700; }
  .t-status { font-size: 0.65rem; padding: 4px 8px; border-radius: 4px; text-align: center; font-weight: 600; }

  /* LIVE OFFERS FEED */
  .offers-box { background: var(--bg2); border: 1px solid var(--border); border-radius: 20px; padding: 32px; display: flex; flex-direction: column; }
  .ob-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; border-bottom: 1px solid var(--border); padding-bottom: 16px; }
  .ob-title { font-family: 'Bebas Neue', sans-serif; font-size: 1.5rem; color: #fff; letter-spacing: .04em; display: flex; align-items: center; gap: 10px; }
  .ob-live { display: flex; align-items: center; gap: 6px; font-family: 'JetBrains Mono', monospace; font-size: 0.65rem; color: var(--green); background: rgba(52,211,153,.1); padding: 4px 10px; border-radius: 100px; border: 1px solid rgba(52,211,153,.3); }
  .ob-live .dot { width: 6px; height: 6px; background: var(--green); border-radius: 50%; animation: pulse-g 1.5s infinite; }
  @keyframes pulse-g { 0%,100%{opacity:1} 50%{opacity:.3} }
  .offers-list { display: flex; flex-direction: column; gap: 16px; flex: 1; overflow: hidden; }
  .offer-item { background: rgba(255,255,255,.02); border: 1px solid var(--border); border-radius: 12px; padding: 16px; display: flex; justify-content: space-between; align-items: center; transition: background .2s; }
  .offer-item:hover { background: rgba(255,255,255,.05); border-color: rgba(255,255,255,.1); }
  .oi-left { display: flex; flex-direction: column; gap: 4px; }
  .oi-role { font-weight: 700; color: #fff; font-size: 0.95rem; }
  .oi-comp { font-size: 0.8rem; color: var(--muted); }
  .oi-right { text-align: right; display: flex; flex-direction: column; gap: 4px; }
  .oi-sal { font-family: 'JetBrains Mono', monospace; font-size: 1.1rem; color: var(--teal); font-weight: 700; }
  .oi-time { font-family: 'JetBrains Mono', monospace; font-size: 0.6rem; color: var(--muted); }

  /* CTA */
  .cta-section { background: linear-gradient(135deg, rgba(0,245,212,.06), rgba(168,85,247,.06)); border: 1px solid rgba(0,245,212,.15); border-radius: 24px; padding: 80px 40px; text-align: center; position: relative; overflow: hidden; }
  .cta-section::before { content: ''; position: absolute; inset: 0; background: radial-gradient(ellipse at 50% -30%, rgba(0,245,212,.1), transparent 60%); }
  .cta-title { font-family: 'Bebas Neue', sans-serif; font-size: clamp(36px, 4vw, 64px); color: #fff; letter-spacing: .02em; margin-bottom: 16px; position: relative; }
  .cta-title .gradient-text { background: linear-gradient(90deg, var(--teal), var(--purple)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
  .cta-sub { color: var(--muted); font-size: 1.05rem; margin-bottom: 32px; position: relative; max-width: 500px; margin-inline: auto; line-height: 1.6; }
  .cta-buttons { display: flex; gap: 16px; justify-content: center; flex-wrap: wrap; position: relative; }
  .cta-btn-main { padding: 16px 40px; border-radius: 12px; border: none; background: var(--teal); color: #060c14; font-family: 'Syne', sans-serif; font-size: 1rem; font-weight: 800; cursor: pointer; transition: all .2s; }
  .cta-btn-main:hover { transform: translateY(-2px); box-shadow: 0 16px 40px rgba(0,245,212,.4); }
  .cta-btn-ghost { padding: 16px 40px; border-radius: 12px; border: 1px solid rgba(255,255,255,.15); background: rgba(0,0,0,.2); color: #fff; font-family: 'Syne', sans-serif; font-size: 1rem; font-weight: 700; cursor: pointer; transition: border-color .2s; }
  .cta-btn-ghost:hover { border-color: rgba(255,255,255,.4); }

  /* ANIMATIONS */
  .fade-up { opacity: 0; transform: translateY(24px); transition: opacity .6s ease, transform .6s ease; }
  .fade-up.visible { opacity: 1; transform: translateY(0); }

  @media (max-width: 1024px) {
    .term-grid, .term-row { grid-template-columns: 1.5fr 1fr 1fr; }
    .term-grid div:nth-child(3), .term-row div:nth-child(3) { display: none; } /* Hide Hub on mobile terminal to fit */
  }
  @media (max-width: 768px) {
    .im-table, .im-thead, .im-tbody, .im-th, .im-td, .im-tr { display: block; }
    .im-thead { display: none; }
    .im-tr { margin-bottom: 16px; border: 1px solid var(--border); border-radius: 12px; padding: 16px; }
    .im-td { padding: 8px 0; border: none; display: flex; justify-content: space-between; align-items: center; }
    .im-td::before { content: attr(data-label); font-family: 'JetBrains Mono', monospace; font-size: 0.65rem; color: var(--muted); text-transform: uppercase; }
  }
`

export default function MarketDataPage() {
  const [typeWriter, setTypeWriter] = useState('')
  const fullText = "Analyzing global tech visa pathways... Cross-referencing 4,800+ student data points... Dashboard Active."

  useEffect(() => {
    // Inject Fonts
    const link = document.createElement('link')
    link.href = 'https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Syne:wght@400;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap'
    link.rel = 'stylesheet'
    document.head.appendChild(link)

    // Scroll Observer
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible') })
    }, { threshold: 0.1 })
    
    setTimeout(() => {
      document.querySelectorAll('.fade-up').forEach(el => observer.observe(el))
    }, 100)

    // Typewriter effect
    let i = 0;
    const typing = setInterval(() => {
      if (i < fullText.length) {
        setTypeWriter(fullText.slice(0, i + 1))
        i++
      } else {
        clearInterval(typing)
      }
    }, 40)

    return () => {
      observer.disconnect()
      clearInterval(typing)
    }
  }, [])

  return (
    <div className="market-v2">
      <style>{styles}</style>
      
      {/* BACKGROUND */}
      <div className="grid-bg"></div>
      <div className="glow-orb orb1"></div>
      <div className="glow-orb orb2"></div>

      {/* NAVBAR */}
      <nav className="m-nav">
        <Link href="/" className="nav-logo">
          <div className="logo-icon"><Triangle size={18} fill="currentColor" strokeWidth={2} className="rotate-180" /></div>
          <span>Mentor<em>Bridge</em></span>
        </Link>
        <div className="nav-links">
          <Link href="/mentors">Mentors</Link>
          <Link href="/scholarships">Scholarships</Link>
          <Link href="/stories">Stories</Link>
          <Link href="/career-paths">Career Paths</Link>
          <Link href="/survival-sim">Survival Sim</Link>
          <Link href="/market-insights" className="active">Market Data</Link>
          <Link href="/roi-matrix">ROI Matrix</Link>
        </div>
        <div className="nav-cta">
          <Link href="/dashboard/student" className="btn-ghost">Log in</Link>
          <Link href="/signup" className="btn-primary">Sign up →</Link>
        </div>
      </nav>

      {/* TOP TICKER */}
      <div className="ticker-bar">
        <div className="ticker-track">
          {[...TELEMETRY_FEED, ...TELEMETRY_FEED].map((text, i) => (
            <span key={i} className="ticker-item">{text}</span>
          ))}
        </div>
      </div>

      <main className="m-main">
        
        {/* HERO */}
        <div className="hero fade-up">
          <div className="hero-badge"><Zap size={14} /> LIVE GLOBAL TELEMETRY</div>
          <h1 className="hero-title">MARKET <span>INTELLIGENCE</span></h1>
          <p className="hero-sub">{typeWriter || 'Loading intelligence...'} <span style={{animation:'pulse 1s infinite'}}>_</span></p>
          
          <div className="live-stats">
            <div className="ls-item"><span className="ls-val" style={{color:'var(--teal)'}}>38</span><span className="ls-lbl">Countries Tracked</span></div>
            <div className="ls-item"><span className="ls-val" style={{color:'var(--purple)'}}>1.2k+</span><span className="ls-lbl">Verified Datapoints</span></div>
            <div className="ls-item"><span className="ls-val" style={{color:'var(--gold)'}}>14</span><span className="ls-lbl">Live Hubs</span></div>
            <div className="ls-item"><span className="ls-val" style={{color:'var(--green)'}}>94%</span><span className="ls-lbl">Avg Visa Success</span></div>
          </div>
        </div>

        {/* IMMIGRATION MATRIX */}
        <div className="section fade-up">
          <div className="section-eyebrow"><ShieldAlert size={14} /> IMMIGRATION MATRIX</div>
          <h2 className="section-title">VISA TO PR PATHWAYS</h2>
          <p className="section-sub">Don't plan your master's without planning your exit strategy. Compare the world's top study destinations by their exact immigration physics.</p>
          
          <div className="im-table-wrap">
            <table className="im-table">
              <thead className="im-thead">
                <tr>
                  <th className="im-th">Country</th>
                  <th className="im-th">Post-Study Visa</th>
                  <th className="im-th">Realistic PR Path</th>
                  <th className="im-th">Tuition Avg</th>
                  <th className="im-th">Risk Level</th>
                </tr>
              </thead>
              <tbody className="im-tbody">
                {IMMIGRATION_MATRIX.map((row) => (
                  <tr key={row.id} className="im-tr">
                    <td className="im-td" data-label="Country">
                      <div className="im-country"><span>{row.flag}</span> {row.country}</div>
                    </td>
                    <td className="im-td" data-label="Visa" style={{fontWeight:600}}>{row.visa}</td>
                    <td className="im-td" data-label="PR Path">{row.pr}</td>
                    <td className="im-td" data-label="Tuition">{row.cost}</td>
                    <td className="im-td" data-label="Risk Level">
                      <span className="im-pill" style={{ 
                        color: row.color, 
                        background: `${row.color}15`, 
                        border: `1px solid ${row.color}40` 
                      }}>
                        {row.risk.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* TECH HUB VELOCITY (INTERACTIVE SPARKLINE) */}
        <div className="section fade-up">
          <div className="section-eyebrow"><MapPin size={14} /> GLOBAL HUB TRACKER</div>
          <h2 className="section-title">TECH HUB VELOCITY</h2>
          <p className="section-sub">Where is the hiring happening right now? Click any graph to toggle between historical Salary Growth and Hiring Demand data.</p>
          
          <div className="hub-grid">
            {TECH_HUBS.map((hub, i) => (
              <InteractiveHubCard key={i} hub={hub} />
            ))}
          </div>
        </div>

        {/* SPLIT SECTION: TERMINAL & OFFERS */}
        <div className="section fade-up">
          <div className="split-grid">
            
            {/* SKILL ARBITRAGE */}
            <div>
              <div className="section-eyebrow"><TerminalSquare size={14} /> THE ARBITRAGE TERMINAL</div>
              <h2 className="section-title">SKILL PREMIUMS</h2>
              <p className="section-sub" style={{marginBottom:'24px'}}>Certain skills trigger massive salary bumps depending on the region. This is what recruiters are desperate for.</p>
              
              <div className="terminal-box">
                <div className="term-header"><span>SERVER: MARKET_PULSE_09</span><span><Lock size={12} style={{display:'inline', marginBottom:'-2px'}}/> ENCRYPTED FEED</span></div>
                <div className="term-grid">
                  <div>Technology</div><div>Bump</div><div>Hub</div><div>Status</div>
                </div>
                {SKILL_ARBITRAGE.map((item, i) => (
                  <div className="term-row" key={i}>
                    <div className="t-skill"><Code2 size={14} color={item.color} /> {item.skill}</div>
                    <div className="t-bump" style={{color: item.color}}>{item.bump}</div>
                    <div className="t-hub">{item.hub}</div>
                    <div>
                      <span className="t-status" style={{ 
                        background: `${item.color}15`, 
                        color: item.color, 
                        border: `1px solid ${item.color}40` 
                      }}>
                        {item.status}
                      </span>
                    </div>
                  </div>
                ))}
                <div style={{marginTop:'20px', display:'flex', alignItems:'center', gap:'8px', color:'#00f5d4', fontSize:'0.75rem'}}>
                  <span style={{display:'inline-block', width:'8px', height:'14px', background:'#00f5d4', animation:'pulse 1s infinite'}}></span>
                  Awaiting next data packet...
                </div>
              </div>
            </div>

            {/* LIVE OFFERS */}
            <div>
              <div className="section-eyebrow" style={{borderColor:'transparent', background:'transparent'}}>&nbsp;</div>
              <h2 className="section-title" style={{color:'transparent'}}>.</h2>
              <p className="section-sub" style={{marginBottom:'24px', color:'transparent'}}>. </p>

              <div className="offers-box">
                <div className="ob-header">
                  <div className="ob-title"><Database size={20} color="var(--purple)"/> Recent Graduate Offers</div>
                  <div className="ob-live"><div className="dot"></div> LIVE</div>
                </div>
                <div className="offers-list">
                  {LIVE_OFFERS.map((offer, i) => (
                    <div className="offer-item" key={i}>
                      <div className="oi-left">
                        <div className="oi-role">{offer.role}</div>
                        <div className="oi-comp">{offer.company} · {offer.location}</div>
                      </div>
                      <div className="oi-right">
                        <div className="oi-sal">{offer.salary}</div>
                        <div className="oi-time">{offer.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* CTA */}
        <div className="section fade-up" style={{paddingBottom: '120px'}}>
          <div className="cta-section">
            <h2 className="cta-title">DATA IS JUST DATA.<br/><span className="gradient-text">STRATEGY REQUIRES A MENTOR.</span></h2>
            <p className="cta-sub">Numbers tell you what's happening in the market. A mentor tells you exactly how to hack the system and get hired.</p>
            <div className="cta-buttons">
              <Link href="/mentors" className="cta-btn-main">Find My Mentor →</Link>
              <Link href="/survival-sim" className="cta-btn-ghost" style={{padding:'16px 36px', fontSize:'0.95rem'}}>Run Survival Sim</Link>
            </div>
          </div>
        </div>

      </main>
    </div>
  )
}