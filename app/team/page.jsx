'use client'
import { useEffect } from 'react'
import Link from 'next/link'
import { Triangle } from 'lucide-react'

const styles = `
  .team-wrapper {
    --bg:#07090F; --bg-2:#0B0E18; --bg-3:#0F1219; --bg-4:#131720;
    --border:rgba(255,255,255,0.065); --border-h:rgba(255,255,255,0.13);
    --cyan:#00D4FF; --teal:#00E5A8; --violet:#8B7FFF; --gold:#FFB800; --rose:#FF5E8A;
    --text:#E8EAF6; --text-2:#7A7F99; --text-3:#3E4460;
    background: var(--bg); color: var(--text); font-family: 'DM Sans', sans-serif;
    min-height: 100vh; position: relative; overflow-x: hidden;
  }
  .team-wrapper * { box-sizing: border-box; }
  .team-wrapper a { text-decoration: none; color: inherit; }

  .team-wrapper ::-webkit-scrollbar { width:4px; background:var(--bg); }
  .team-wrapper ::-webkit-scrollbar-thumb { background:rgba(255,255,255,.08); border-radius:4px; }

  .bg-wrap { position:fixed; inset:0; z-index:0; pointer-events:none; overflow:hidden; }
  .orb { position:absolute; border-radius:50%; filter:blur(120px); animation:drift 22s ease-in-out infinite alternate; }
  .orb-1 { width:900px; height:900px; background:radial-gradient(circle,rgba(0,212,255,.08) 0%,transparent 65%); top:-350px; left:-200px; }
  .orb-2 { width:700px; height:700px; background:radial-gradient(circle,rgba(139,127,255,.08) 0%,transparent 65%); bottom:-200px; right:-150px; animation-delay:-9s; }
  .orb-3 { width:500px; height:500px; background:radial-gradient(circle,rgba(0,229,168,.06) 0%,transparent 65%); top:40%; left:38%; animation-delay:-5s; }
  @keyframes drift { 0%{transform:translate(0,0)} 100%{transform:translate(50px,35px)} }
  .grid-bg { position:fixed; inset:0; z-index:0; pointer-events:none; background:linear-gradient(rgba(255,255,255,.018) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.018) 1px,transparent 1px); background-size:56px 56px; mask-image:radial-gradient(ellipse 80% 60% at 50% 0%,black 30%,transparent 100%); -webkit-mask-image:radial-gradient(ellipse 80% 60% at 50% 0%,black 30%,transparent 100%); }
  .noise { position:fixed; inset:0; z-index:0; pointer-events:none; opacity:.025; background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E"); }

  .nav { position:fixed; top:0; left:0; right:0; z-index:900; height:62px; background:rgba(7,9,15,.82); backdrop-filter:blur(24px); border-bottom:1px solid var(--border); display:flex; align-items:center; padding:0 44px; }
  .brand { display:flex; align-items:center; gap:9px; margin-right:36px; }
  .brand-ico { width:32px; height:32px; background:linear-gradient(135deg,var(--cyan),var(--teal)); border-radius:9px; display:flex; align-items:center; justify-content:center; font-size:16px; box-shadow:0 0 18px rgba(0,212,255,.3); color:#000; }
  .brand-name { font-family:'Syne',sans-serif; font-size:16px; font-weight:700; letter-spacing:-.03em; background:linear-gradient(135deg,#fff 30%,var(--cyan)); -webkit-background-clip:text; -webkit-text-fill-color:transparent; }
  .nav-links { display:flex; align-items:center; gap:1px; flex:1; }
  .nav-links a { font-size:13px; font-weight:600; color:var(--text-2); padding:6px 12px; border-radius:8px; transition:all .18s; }
  .nav-links a:hover { color:var(--text); background:rgba(255,255,255,.05); }
  .nav-links a.active { color:var(--teal); background:rgba(0,229,168,.07); }
  .nav-end { display:flex; gap:8px; }
  .btn { display:inline-flex; align-items:center; gap:6px; border-radius:10px; font-weight:600; cursor:pointer; transition:all .2s; border:none; font-size:13.5px; }
  .btn-sm { padding:8px 17px; }
  .btn-ghost { background:transparent; border:1px solid var(--border-h); color:var(--text); }
  .btn-ghost:hover { border-color:rgba(255,255,255,.25); background:rgba(255,255,255,.05); }
  .btn-primary { background:linear-gradient(135deg,var(--cyan),var(--teal)); color:#050C12; font-weight:700; box-shadow:0 0 22px rgba(0,212,255,.28); }
  .btn-primary:hover { box-shadow:0 0 36px rgba(0,212,255,.48); transform:translateY(-1px); }

  .page { max-width:1200px; margin:0 auto; padding:120px 44px 96px; position:relative; z-index:1; }

  .hero { text-align:center; margin-bottom:80px; animation:up .7s ease both; }
  .eyebrow { display:inline-flex; align-items:center; gap:8px; font-family:'JetBrains Mono',monospace; font-size:10.5px; letter-spacing:.15em; text-transform:uppercase; padding:5px 13px; border-radius:30px; margin-bottom:22px; color:var(--teal); background:rgba(0,229,168,.07); border:1px solid rgba(0,229,168,.2); }
  .ey-dot { width:6px; height:6px; border-radius:50%; background:var(--teal); box-shadow:0 0 8px var(--teal); animation:blink 2s infinite; }
  @keyframes blink { 0%,100%{opacity:1} 50%{opacity:.25} }
  .hero-title { font-family:'Syne',sans-serif; font-size:clamp(38px,6vw,72px); font-weight:800; letter-spacing:-.05em; line-height:1.04; margin-bottom:22px; }
  .hero-title .line1 { display:block; color:var(--text); }
  .hero-title .line2 { display:block; background:linear-gradient(135deg,var(--cyan) 0%,var(--teal) 50%,var(--violet) 100%); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-size:200% auto; animation:gradShift 4s ease infinite alternate; }
  @keyframes gradShift { 0%{background-position:0% center} 100%{background-position:100% center} }
  .hero-sub { font-size:17px; color:var(--text-2); line-height:1.75; max-width:560px; margin:0 auto 40px; }
  .hero-tags { display:flex; justify-content:center; gap:10px; flex-wrap:wrap; }
  .hero-tag { font-family:'JetBrains Mono',monospace; font-size:11px; padding:5px 14px; border-radius:25px; border:1px solid var(--border-h); color:var(--text-2); background:var(--bg-2); }

  .origin-section { margin-bottom:80px; animation:up .7s .08s ease both; }
  .origin-card { background:var(--bg-2); border:1px solid rgba(0,229,168,.18); border-radius:20px; padding:40px 44px; position:relative; overflow:hidden; }
  .origin-card::before { content:''; position:absolute; inset:0; background:radial-gradient(ellipse 60% 80% at 0% 50%,rgba(0,229,168,.05) 0%,transparent 60%); pointer-events:none; }
  .origin-card::after { content:''; position:absolute; left:0; top:0; bottom:0; width:3px; background:linear-gradient(180deg,var(--cyan),var(--teal),var(--violet)); }
  .origin-label { font-family:'JetBrains Mono',monospace; font-size:10px; letter-spacing:.15em; text-transform:uppercase; color:var(--teal); margin-bottom:14px; }
  .origin-title { font-family:'Syne',sans-serif; font-size:26px; font-weight:800; letter-spacing:-.03em; margin-bottom:18px; }
  .origin-body { font-size:15px; color:var(--text-2); line-height:1.85; max-width:680px; }
  .origin-body p { margin-bottom:14px; }
  .origin-body p:last-child { margin-bottom:0; }
  .origin-body strong { color:var(--text); }

  .team-section { margin-bottom:80px; }
  .section-head { text-align:center; margin-bottom:56px; animation:up .7s .14s ease both; }
  .section-eyebrow { display:inline-flex; align-items:center; gap:8px; font-family:'JetBrains Mono',monospace; font-size:10.5px; letter-spacing:.15em; text-transform:uppercase; padding:5px 13px; border-radius:30px; margin-bottom:14px; color:var(--violet); background:rgba(139,127,255,.07); border:1px solid rgba(139,127,255,.2); }
  .section-title { font-family:'Syne',sans-serif; font-size:clamp(26px,3.5vw,40px); font-weight:800; letter-spacing:-.04em; margin-bottom:10px; }
  .section-sub { font-size:15px; color:var(--text-2); }

  .team-grid { display:grid; grid-template-columns:repeat(auto-fit, minmax(320px, 1fr)); gap:24px; }
  .team-card { border-radius:22px; overflow:hidden; position:relative; animation:up .6s ease both; transition:all .3s; }
  .team-card:hover { transform:translateY(-8px); }
  .team-card:hover .tc-inner { box-shadow:0 40px 80px rgba(0,0,0,.6); }

  .tc-inner { background:var(--bg-2); border:1px solid var(--border); border-radius:22px; overflow:hidden; transition:all .3s; position:relative; height:100%; display:flex; flex-direction:column; }
  .tc-aarya .tc-inner { border-color:rgba(0,212,255,.18); }
  .tc-aarya .tc-inner:hover { border-color:rgba(0,212,255,.35); }
  .tc-ayeesha .tc-inner { border-color:rgba(139,127,255,.18); }
  .tc-ayeesha .tc-inner:hover { border-color:rgba(139,127,255,.35); }
  .tc-saif .tc-inner { border-color:rgba(0,229,168,.18); }
  .tc-saif .tc-inner:hover { border-color:rgba(0,229,168,.35); }

  .tc-inner::before { content:''; position:absolute; inset:0; border-radius:22px; pointer-events:none; }
  .tc-aarya .tc-inner::before { background:radial-gradient(ellipse 80% 60% at 50% 0%,rgba(0,212,255,.06) 0%,transparent 60%); }
  .tc-ayeesha .tc-inner::before { background:radial-gradient(ellipse 80% 60% at 50% 0%,rgba(139,127,255,.06) 0%,transparent 60%); }
  .tc-saif .tc-inner::before { background:radial-gradient(ellipse 80% 60% at 50% 0%,rgba(0,229,168,.06) 0%,transparent 60%); }

  .tc-stripe { height:4px; flex-shrink:0; }
  .stripe-aarya { background:linear-gradient(90deg,var(--cyan),rgba(0,212,255,.3)); }
  .stripe-ayeesha { background:linear-gradient(90deg,var(--violet),rgba(139,127,255,.3)); }
  .stripe-saif { background:linear-gradient(90deg,var(--teal),rgba(0,229,168,.3)); }

  .tc-avatar-wrap { padding:32px 28px 0; display:flex; align-items:flex-start; justify-content:space-between; }
  .tc-av { width:80px; height:80px; border-radius:50%; border:3px solid; display:flex; align-items:center; justify-content:center; font-family:'Syne',sans-serif; font-size:30px; font-weight:800; position:relative; overflow:hidden; flex-shrink:0; }
  .av-aarya { border-color:rgba(0,212,255,.4); background:linear-gradient(135deg,#0a2040,#1a4060); color:var(--cyan); }
  .av-ayeesha { border-color:rgba(139,127,255,.4); background:linear-gradient(135deg,#1a1040,#3a2070); color:var(--violet); }
  .av-saif { border-color:rgba(0,229,168,.4); background:linear-gradient(135deg,#0a2830,#1a4840); color:var(--teal); }
  .tc-av-ring { position:absolute; inset:-5px; border-radius:50%; border:1px solid; animation:spin 10s linear infinite; }
  .ring-aarya { border-color:rgba(0,212,255,.15); }
  .ring-ayeesha { border-color:rgba(139,127,255,.15); }
  .ring-saif { border-color:rgba(0,229,168,.15); }
  @keyframes spin { to { transform:rotate(360deg); } }

  .tc-badge { font-family:'JetBrains Mono',monospace; font-size:9.5px; padding:4px 11px; border-radius:20px; font-weight:500; letter-spacing:.04em; height:fit-content; text-transform:uppercase; }
  .badge-aarya { background:rgba(0,212,255,.1); color:var(--cyan); border:1px solid rgba(0,212,255,.25); }
  .badge-ayeesha { background:rgba(139,127,255,.1); color:var(--violet); border:1px solid rgba(139,127,255,.25); }
  .badge-saif { background:rgba(0,229,168,.1); color:var(--teal); border:1px solid rgba(0,229,168,.25); }

  .tc-body { padding:20px 28px 24px; flex:1; display:flex; flex-direction:column; }
  .tc-name { font-family:'Syne',sans-serif; font-size:22px; font-weight:800; letter-spacing:-.03em; margin-bottom:4px; }
  .tc-handle { font-family:'JetBrains Mono',monospace; font-size:11px; color:var(--text-3); margin-bottom:14px; }
  .tc-role { font-size:13px; font-weight:600; margin-bottom:16px; }
  .tc-bio { font-size:13.5px; color:var(--text-2); line-height:1.75; margin-bottom:20px; flex:1; }
  .tc-skills { display:flex; flex-wrap:wrap; gap:6px; margin-bottom:22px; }
  .tc-skill { font-family:'JetBrains Mono',monospace; font-size:9.5px; padding:3px 9px; border-radius:20px; border:1px solid var(--border-h); color:var(--text-2); background:rgba(255,255,255,.03); }

  .tc-insta { display:flex; align-items:center; gap:9px; padding:11px 16px; border-radius:12px; font-size:13.5px; font-weight:600; cursor:pointer; transition:all .22s; text-decoration:none; border:1px solid; }
  .insta-aarya { color:var(--cyan); border-color:rgba(0,212,255,.3); background:rgba(0,212,255,.07); }
  .insta-aarya:hover { background:rgba(0,212,255,.14); box-shadow:0 0 20px rgba(0,212,255,.2); }
  .insta-ayeesha { color:var(--violet); border-color:rgba(139,127,255,.3); background:rgba(139,127,255,.07); }
  .insta-ayeesha:hover { background:rgba(139,127,255,.14); box-shadow:0 0 20px rgba(139,127,255,.2); }
  .insta-saif { color:var(--teal); border-color:rgba(0,229,168,.3); background:rgba(0,229,168,.07); }
  .insta-saif:hover { background:rgba(0,229,168,.14); box-shadow:0 0 20px rgba(0,229,168,.2); }
  .insta-icon { font-size:18px; }

  .built-section { margin-bottom:80px; animation:up .7s ease both; }
  .built-grid { display:grid; grid-template-columns:repeat(auto-fit, minmax(250px, 1fr)); gap:14px; }
  .built-item { background:var(--bg-2); border:1px solid var(--border); border-radius:14px; padding:20px 18px; transition:all .22s; }
  .built-item:hover { border-color:var(--border-h); transform:translateY(-3px); }
  .built-icon { font-size:28px; margin-bottom:12px; }
  .built-title { font-family:'Syne',sans-serif; font-size:14px; font-weight:700; letter-spacing:-.02em; margin-bottom:6px; }
  .built-desc { font-size:12.5px; color:var(--text-2); line-height:1.6; }

  .quote-strip { background:var(--bg-2); border:1px solid var(--border-h); border-radius:20px; padding:44px; text-align:center; margin-bottom:80px; position:relative; overflow:hidden; animation:up .7s ease both; }
  .quote-strip::before { content:''; position:absolute; inset:0; background:radial-gradient(ellipse 80% 60% at 50% 50%,rgba(0,229,168,.04) 0%,transparent 60%); }
  .quote-mark { font-family:Georgia,serif; font-size:80px; line-height:.8; color:var(--teal); opacity:.25; margin-bottom:8px; }
  .quote-text { font-family:'Syne',sans-serif; font-size:clamp(18px,2.5vw,26px); font-weight:700; letter-spacing:-.03em; line-height:1.4; max-width:640px; margin:0 auto 20px; color:var(--text); }
  .quote-by { font-family:'JetBrains Mono',monospace; font-size:11px; color:var(--text-3); letter-spacing:.1em; text-transform:uppercase; }

  .connect-section { text-align:center; margin-bottom:80px; animation:up .7s ease both; }
  .connect-title { font-family:'Syne',sans-serif; font-size:clamp(28px,4vw,44px); font-weight:800; letter-spacing:-.04em; margin-bottom:14px; }
  .connect-title span { background:linear-gradient(135deg,var(--cyan),var(--teal)); -webkit-background-clip:text; -webkit-text-fill-color:transparent; }
  .connect-sub { font-size:16px; color:var(--text-2); margin-bottom:36px; }
  .connect-cards { display:flex; justify-content:center; gap:16px; flex-wrap:wrap; }
  .connect-card { display:flex; align-items:center; gap:13px; background:var(--bg-2); border:1px solid var(--border); border-radius:16px; padding:18px 24px; transition:all .25s; text-decoration:none; color:var(--text); }
  .connect-card:hover { border-color:var(--border-h); transform:translateY(-3px); box-shadow:0 20px 50px rgba(0,0,0,.4); }
  .cc-av { width:48px; height:48px; border-radius:50%; border:2px solid; display:flex; align-items:center; justify-content:center; font-family:'Syne',sans-serif; font-size:18px; font-weight:800; flex-shrink:0; }
  .cc-name { font-family:'Syne',sans-serif; font-size:15px; font-weight:700; margin-bottom:2px; }
  .cc-handle { font-family:'JetBrains Mono',monospace; font-size:10.5px; color:var(--text-3); }

  .footer { position:relative; z-index:1; border-top:1px solid var(--border); background:rgba(7,9,15,.7); padding:60px 44px 20px; }
  .footer-inner { max-width:1200px; margin:0 auto; }
  .footer-top { display:grid; grid-template-columns:1.8fr 1fr 1fr 1fr; gap:48px; padding-bottom:48px; border-bottom:1px solid var(--border); }
  @media (max-width: 768px) { .footer-top { grid-template-columns: 1fr 1fr; } }
  .footer-brand-row { display:flex; align-items:center; gap:9px; margin-bottom:14px; }
  .footer-brand-ico { width:32px; height:32px; background:linear-gradient(135deg,var(--cyan),var(--teal)); border-radius:9px; display:flex; align-items:center; justify-content:center; font-size:16px; color:#000; }
  .footer-brand-name { font-family:'Syne',sans-serif; font-size:16px; font-weight:700; background:linear-gradient(135deg,#fff 30%,var(--cyan)); -webkit-background-clip:text; -webkit-text-fill-color:transparent; }
  .footer-tagline { font-size:13px; color:var(--text-2); line-height:1.65; max-width:260px; }
  .footer-col-title { font-family:'JetBrains Mono',monospace; font-size:10px; letter-spacing:.14em; text-transform:uppercase; color:var(--text-3); margin-bottom:16px; }
  .footer-col a { display:block; font-size:13.5px; color:var(--text-2); margin-bottom:10px; transition:color .18s; }
  .footer-col a:hover { color:var(--text); }
  .footer-bottom { display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:12px; padding:20px 0 0; }
  .footer-copy { font-size:12.5px; color:var(--text-3); }
  .footer-built { font-family:'JetBrains Mono',monospace; font-size:11px; color:var(--text-3); display:flex; align-items:center; gap:5px; }
  .footer-built a { color:var(--teal); }
  .footer-legal-links { display:flex; gap:18px; }
  .footer-legal-links a { font-size:12.5px; color:var(--text-3); transition:color .18s; }
  .footer-legal-links a:hover { color:var(--text-2); }

  @keyframes up { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
`

export default function TeamPage() {
  useEffect(() => {
    const link = document.createElement('link')
    link.href = 'https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&family=JetBrains+Mono:wght@400;500&display=swap'
    link.rel = 'stylesheet'
    document.head.appendChild(link)
  }, [])

  return (
    <div className="team-wrapper">
      <style>{styles}</style>
      <div className="bg-wrap">
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
        <div className="orb orb-3"></div>
      </div>
      <div className="grid-bg"></div>
      <div className="noise"></div>

      <nav className="nav">
        <Link className="brand" href="/">
          <div className="brand-ico"><Triangle size={16} fill="currentColor" strokeWidth={2} className="rotate-180" /></div>
          <span className="brand-name">MentorBridge</span>
        </Link>
        <div className="nav-links">
          <Link href="/mentors">Mentors</Link>
          <Link href="/scholarships">Scholarships</Link>
          <Link href="/stories">Stories</Link>
          <Link href="/career-paths">Career Paths</Link>
          <Link href="/market-insights">Market Data</Link>
        </div>
        <div className="nav-end">
          <Link href="/login" className="btn btn-ghost btn-sm">Log in</Link>
          <Link href="/signup" className="btn btn-primary btn-sm">Sign up →</Link>
        </div>
      </nav>

      <div className="page">
        <div className="hero">
          <div className="eyebrow"><div className="ey-dot"></div>The People Behind the Product</div>
          <h1 className="hero-title">
            <span className="line1">Built with passion by</span>
            <span className="line2">Three Dreamers</span>
          </h1>
          <p className="hero-sub">MentorBridge didn't come from a boardroom or a VC pitch. It came from three students who felt the confusion of study abroad firsthand — and decided to fix it.</p>
          <div className="hero-tags">
            <span className="hero-tag">🎓 Student-Built</span>
            <span className="hero-tag">💡 Passion Project</span>
            <span className="hero-tag">🌍 Made for India's Future</span>
            <span className="hero-tag">🚀 Full-Stack</span>
          </div>
        </div>

        <div className="origin-section">
          <div className="origin-card">
            <div className="origin-label">✦ Our Origin Story</div>
            <div className="origin-title">How MentorBridge Was Born</div>
            <div className="origin-body">
              <p>Every great product starts with a real problem. For us, it started in the chaos of study abroad research — scrolling through endless Reddit threads, contradicting blog posts, and confusing university websites at 2am, not knowing who to trust.</p>
              <p><strong>Aarya, Ayeesha, and Saif</strong> were three students who met with a shared frustration: Why is there no single place that connects aspiring students with people who've actually done it? No corporate fluff, no paid promotions — just real alumni, real advice, and real outcomes.</p>
              <p>So we built it ourselves. MentorBridge is our answer to that question — a platform built by students, for students. Every feature you see, every data point, every design decision was made with one goal: <strong>to make the study abroad journey less overwhelming and more human.</strong></p>
              <p>We're not a big company. We're three people who care deeply about making quality global education accessible to every Indian student who has the ambition to reach for it.</p>
            </div>
          </div>
        </div>

        <div className="team-section">
          <div className="section-head">
            <div className="section-eyebrow">👋 The Team</div>
            <div className="section-title">Meet the Builders</div>
            <div className="section-sub">Three students. One mission. Zero compromises on quality.</div>
          </div>

          <div className="team-grid">
            <div className="team-card tc-aarya" style={{animationDelay: '.05s'}}>
              <div className="tc-inner">
                <div className="tc-stripe stripe-aarya"></div>
                <div className="tc-avatar-wrap">
                  <div className="tc-av av-aarya">
                    A
                    <div className="tc-av-ring ring-aarya"></div>
                  </div>
                  <span className="tc-badge badge-aarya">Co-Founder</span>
                </div>
                <div className="tc-body">
                  <div className="tc-name">Aarya Gaikwad</div>
                  <div className="tc-handle">@aaryagaikwaad</div>
                  <div className="tc-role" style={{color: 'var(--cyan)'}}>Product Design & Frontend Lead</div>
                  <div className="tc-bio">
                    Aarya is the creative force behind MentorBridge's look and feel. With a sharp eye for design and a passion for user experience, she turned complex student journeys into clean, intuitive interfaces. Every card, animation, and colour choice you see? That's Aarya's vision brought to life.<br/><br/>
                    When she's not designing, she's exploring the intersection of design and technology — and probably pinning references for the next big redesign.
                  </div>
                  <div className="tc-skills">
                    <span className="tc-skill">UI/UX Design</span>
                    <span className="tc-skill">Figma</span>
                    <span className="tc-skill">Frontend</span>
                    <span className="tc-skill">Branding</span>
                    <span className="tc-skill">User Research</span>
                  </div>
                  <a className="tc-insta insta-aarya" href="https://www.instagram.com/aaryagaikwaad/" target="_blank" rel="noopener noreferrer">
                    <span className="insta-icon">📸</span>
                    Follow @aaryagaikwaad
                  </a>
                </div>
              </div>
            </div>

            <div className="team-card tc-ayeesha" style={{animationDelay: '.12s'}}>
              <div className="tc-inner">
                <div className="tc-stripe stripe-ayeesha"></div>
                <div className="tc-avatar-wrap">
                  <div className="tc-av av-ayeesha">
                    Ay
                    <div className="tc-av-ring ring-ayeesha"></div>
                  </div>
                  <span className="tc-badge badge-ayeesha">Co-Founder</span>
                </div>
                <div className="tc-body">
                  <div className="tc-name">Ayeesha Munshi</div>
                  <div className="tc-handle">@ayeeshamunshi</div>
                  <div className="tc-role" style={{color: 'var(--violet)'}}>Content Strategy & Community</div>
                  <div className="tc-bio">
                    Ayeesha is the storyteller of the team. She shaped MentorBridge's voice — from the mentor bios and success stories to how we communicate with students. She understands what students actually want to hear, because she's been that student.<br/><br/>
                    Her work ensures that every piece of content on MentorBridge is honest, warm, and genuinely useful. She also spearheads our mentor community relationships and student outreach.
                  </div>
                  <div className="tc-skills">
                    <span className="tc-skill">Content Strategy</span>
                    <span className="tc-skill">Community</span>
                    <span className="tc-skill">Copywriting</span>
                    <span className="tc-skill">Research</span>
                    <span className="tc-skill">Outreach</span>
                  </div>
                  <a className="tc-insta insta-ayeesha" href="https://www.instagram.com/ayeeshamunshi/" target="_blank" rel="noopener noreferrer">
                    <span className="insta-icon">📸</span>
                    Follow @ayeeshamunshi
                  </a>
                </div>
              </div>
            </div>

            <div className="team-card tc-saif" style={{animationDelay: '.2s'}}>
              <div className="tc-inner">
                <div className="tc-stripe stripe-saif"></div>
                <div className="tc-avatar-wrap">
                  <div className="tc-av av-saif">
                    S
                    <div className="tc-av-ring ring-saif"></div>
                  </div>
                  <span className="tc-badge badge-saif">Co-Founder</span>
                </div>
                <div className="tc-body">
                  <div className="tc-name">Md Saif Sanadi</div>
                  <div className="tc-handle">@saif_sanadi</div>
                  <div className="tc-role" style={{color: 'var(--teal)'}}>Full-Stack Engineer & Product Lead</div>
                  <div className="tc-bio">
                    Saif is the engineer who turned ideas into reality. He architected the full MentorBridge stack — from the Next.js frontend and database to the authentication system, mentor matching logic, and session booking infrastructure.<br/><br/>
                    He led the technical vision of the product, ensuring every feature is fast, reliable, and scalable. When he's not coding, he's thinking about what to build next.
                  </div>
                  <div className="tc-skills">
                    <span className="tc-skill">Next.js</span>
                    <span className="tc-skill">MongoDB</span>
                    <span className="tc-skill">Node.js</span>
                    <span className="tc-skill">Full-Stack</span>
                    <span className="tc-skill">System Design</span>
                  </div>
                  <a className="tc-insta insta-saif" href="https://www.instagram.com/saif_sanadi/" target="_blank" rel="noopener noreferrer">
                    <span className="insta-icon">📸</span>
                    Follow @saif_sanadi
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="built-section">
          <div className="section-head" style={{marginBottom:36}}>
            <div className="section-eyebrow">🔨 What We Built</div>
            <div className="section-title">The Full MentorBridge Stack</div>
            <div className="section-sub">Every feature, built from scratch, by this three-person team.</div>
          </div>
          <div className="built-grid">
            <div className="built-item"><div className="built-icon">🧭</div><div className="built-title">SmartMatch AI</div><div className="built-desc">Intelligent mentor-student matching based on profile, country, and goals.</div></div>
            <div className="built-item"><div className="built-icon">📊</div><div className="built-title">Market Data Engine</div><div className="built-desc">Real-time salary, demand, and career intelligence for 38 countries.</div></div>
            <div className="built-item"><div className="built-icon">🏅</div><div className="built-title">Scholarship Hub</div><div className="built-desc">Curated database of fully funded and partial scholarships with deadline tracking.</div></div>
            <div className="built-item"><div className="built-icon">📅</div><div className="built-title">Session Booking</div><div className="built-desc">End-to-end session booking with Google Meet integration and time zones.</div></div>
            <div className="built-item"><div className="built-icon">💰</div><div className="built-title">ROI Matrix</div><div className="built-desc">Compare program ROI, breakeven timelines, and salary projections.</div></div>
            <div className="built-item"><div className="built-icon">🎮</div><div className="built-title">Survival Simulator</div><div className="built-desc">Simulate life abroad with real housing, food, and work budgets.</div></div>
            <div className="built-item"><div className="built-icon">📖</div><div className="built-title">Success Stories</div><div className="built-desc">Verified student journeys from confused applicant to top university admit.</div></div>
            <div className="built-item"><div className="built-icon">🗺️</div><div className="built-title">Roadmap Builder</div><div className="built-desc">Month-by-month admission plan so you never miss a deadline.</div></div>
          </div>
        </div>

        <div className="quote-strip">
          <div className="quote-mark">"</div>
          <div className="quote-text">We built MentorBridge because we wished it existed when we needed it. This is for every student who stays up at night wondering if they're doing it right.</div>
          <div className="quote-by">— Aarya, Ayeesha & Saif · The MentorBridge Team</div>
        </div>

        <div className="connect-section">
          <div className="connect-title">Say Hi on <span>Instagram</span></div>
          <p className="connect-sub">Follow the builders and be part of the MentorBridge journey from day one.</p>
          <div className="connect-cards">
            <a className="connect-card" href="https://www.instagram.com/aaryagaikwaad/" target="_blank" rel="noopener noreferrer">
              <div className="cc-av av-aarya">A</div>
              <div style={{textAlign:'left'}}><div className="cc-name">Aarya Gaikwad</div><div className="cc-handle">@aaryagaikwaad · Design Lead</div></div>
              <span style={{fontSize:20, marginLeft:4}}>📸</span>
            </a>
            <a className="connect-card" href="https://www.instagram.com/ayeeshamunshi/" target="_blank" rel="noopener noreferrer">
              <div className="cc-av av-ayeesha">Ay</div>
              <div style={{textAlign:'left'}}><div className="cc-name">Ayeesha Munshi</div><div className="cc-handle">@ayeeshamunshi · Content Lead</div></div>
              <span style={{fontSize:20, marginLeft:4}}>📸</span>
            </a>
            <a className="connect-card" href="https://www.instagram.com/saif_sanadi/" target="_blank" rel="noopener noreferrer">
              <div className="cc-av av-saif">S</div>
              <div style={{textAlign:'left'}}><div className="cc-name">Md Saif Sanadi</div><div className="cc-handle">@saif_sanadi · Engineering Lead</div></div>
              <span style={{fontSize:20, marginLeft:4}}>📸</span>
            </a>
          </div>
        </div>
      </div>

      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-top">
            <div>
              <div className="footer-brand-row">
                <div className="footer-brand-ico"><Triangle size={16} fill="currentColor" strokeWidth={2} className="rotate-180" /></div>
                <span className="footer-brand-name">MentorBridge</span>
              </div>
              <p className="footer-tagline">Connecting ambitious students with mentors who've walked the path. From India to the world.</p>
            </div>
            <div className="footer-col">
              <div className="footer-col-title">Platform</div>
              <Link href="/mentors">Find Mentors</Link>
              <Link href="/scholarships">Scholarships</Link>
              <Link href="/stories">Stories</Link>
              <Link href="/career-paths">Career Paths</Link>
            </div>
            <div className="footer-col">
              <div className="footer-col-title">Company</div>
              <Link href="#">About Us</Link>
              <Link href="/team" style={{color:'var(--teal)'}}>Meet the Builders</Link>
              <Link href="#">Contact FAQ</Link>
            </div>
            <div className="footer-col">
              <div className="footer-col-title">Legal</div>
              <Link href="/terms">Terms & Conditions</Link>
              <Link href="/legal">Privacy Policy</Link>
              <Link href="/legal">Cookies</Link>
            </div>
          </div>
          <div className="footer-bottom">
            <span className="footer-copy">© 2026 MentorBridge. All rights reserved.</span>
            <div className="footer-built">Built with ❤️ by <Link href="/team">Aarya, Ayeesha & Saif</Link></div>
            <div className="footer-legal-links">
              <Link href="/terms">Terms</Link>
              <Link href="/legal">Privacy</Link>
              <Link href="/team">Team</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}