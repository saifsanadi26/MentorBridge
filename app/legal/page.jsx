'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Triangle } from 'lucide-react'

const styles = `
  .legal-wrapper {
    --bg:#07090F; --bg-2:#0B0E18; --bg-3:#0F1219;
    --border:rgba(255,255,255,0.065); --border-h:rgba(255,255,255,0.12);
    --cyan:#00D4FF; --teal:#00E5A8; --violet:#8B7FFF; --gold:#FFB800; --rose:#FF5E8A;
    --text:#E8EAF6; --text-2:#7A7F99; --text-3:#3E4460;
    background: var(--bg); color: var(--text); font-family: 'DM Sans', sans-serif;
    min-height: 100vh; position: relative; overflow-x: hidden; scroll-behavior: smooth;
  }
  .legal-wrapper * { box-sizing: border-box; }
  .legal-wrapper a { text-decoration: none; color: inherit; }

  .legal-wrapper ::-webkit-scrollbar { width:4px; background:var(--bg); }
  .legal-wrapper ::-webkit-scrollbar-thumb { background:rgba(255,255,255,.08); border-radius:4px; }

  .bg-wrap { position:fixed; inset:0; z-index:0; pointer-events:none; }
  .orb { position:absolute; border-radius:50%; filter:blur(130px); animation:drift 22s ease-in-out infinite alternate; }
  .orb-1 { width:600px; height:600px; background:radial-gradient(circle,rgba(139,127,255,.07) 0%,transparent 65%); top:-200px; right:-100px; }
  .orb-2 { width:500px; height:500px; background:radial-gradient(circle,rgba(0,229,168,.06) 0%,transparent 65%); bottom:-100px; left:-100px; animation-delay:-9s; }
  @keyframes drift { 0%{transform:translate(0,0)} 100%{transform:translate(40px,30px)} }
  .grid-bg { position:fixed; inset:0; z-index:0; pointer-events:none; background:linear-gradient(rgba(255,255,255,.016) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.016) 1px,transparent 1px); background-size:56px 56px; mask-image:radial-gradient(ellipse 80% 60% at 50% 0%,black 30%,transparent 100%); -webkit-mask-image:radial-gradient(ellipse 80% 60% at 50% 0%,black 30%,transparent 100%); }

  .nav { position:fixed; top:0; left:0; right:0; z-index:900; height:62px; background:rgba(7,9,15,.82); backdrop-filter:blur(24px); border-bottom:1px solid var(--border); display:flex; align-items:center; padding:0 44px; }
  .brand { display:flex; align-items:center; gap:9px; margin-right:36px; }
  .brand-ico { width:32px; height:32px; background:linear-gradient(135deg,var(--cyan),var(--teal)); border-radius:9px; display:flex; align-items:center; justify-content:center; font-size:16px; color:#000; box-shadow:0 0 18px rgba(0,212,255,.3); }
  .brand-name { font-family:'Syne',sans-serif; font-size:16px; font-weight:700; letter-spacing:-.03em; background:linear-gradient(135deg,#fff 30%,var(--cyan)); -webkit-background-clip:text; -webkit-text-fill-color:transparent; }
  .nav-links { display:flex; align-items:center; gap:1px; flex:1; }
  .nav-links a { font-size:13px; font-weight:600; color:var(--text-2); padding:6px 12px; border-radius:8px; transition:all .18s; }
  .nav-links a:hover { color:var(--text); background:rgba(255,255,255,.05); }
  .nav-end { display:flex; gap:8px; }
  .btn { display:inline-flex; align-items:center; gap:6px; border-radius:10px; font-weight:600; cursor:pointer; transition:all .2s; border:none; font-size:13.5px; }
  .btn-sm { padding:8px 17px; }
  .btn-ghost { background:transparent; border:1px solid var(--border-h); color:var(--text); }
  .btn-ghost:hover { border-color:rgba(255,255,255,.25); background:rgba(255,255,255,.05); }
  .btn-primary { background:linear-gradient(135deg,var(--cyan),var(--teal)); color:#050C12; font-weight:700; box-shadow:0 0 22px rgba(0,212,255,.28); }
  .btn-primary:hover { transform:translateY(-1px); }

  .page-wrap { max-width:1280px; margin:0 auto; padding:120px 44px 96px; position:relative; z-index:1; display:grid; grid-template-columns:260px 1fr; gap:56px; align-items:start; }
  @media (max-width: 900px) { .page-wrap { grid-template-columns: 1fr; } .toc { display: none; } }

  .toc { position:sticky; top:100px; }
  .toc-label { font-family:'JetBrains Mono',monospace; font-size:9.5px; letter-spacing:.14em; text-transform:uppercase; color:var(--text-3); margin-bottom:16px; }
  .toc-item { display:flex; align-items:center; gap:8px; font-size:13px; color:var(--text-2); padding:8px 12px; border-radius:9px; margin-bottom:2px; cursor:pointer; transition:all .18s; border-left:2px solid transparent; }
  .toc-item:hover { color:var(--text); background:rgba(255,255,255,.04); }
  .toc-item.active { color:var(--violet); background:rgba(139,127,255,.07); border-left-color:var(--violet); }
  .toc-num { font-family:'JetBrains Mono',monospace; font-size:10px; color:var(--text-3); width:18px; flex-shrink:0; }
  .toc-sep { height:1px; background:var(--border); margin:10px 0; }
  .toc-section-label { font-family:'JetBrains Mono',monospace; font-size:9px; letter-spacing:.12em; text-transform:uppercase; color:var(--text-3); padding:4px 12px; margin-bottom:4px; }

  .eyebrow { display:inline-flex; align-items:center; gap:8px; font-family:'JetBrains Mono',monospace; font-size:10.5px; letter-spacing:.15em; text-transform:uppercase; padding:5px 13px; border-radius:30px; margin-bottom:18px; color:var(--violet); background:rgba(139,127,255,.07); border:1px solid rgba(139,127,255,.2); }
  .ey-dot { width:6px; height:6px; border-radius:50%; background:var(--violet); box-shadow:0 0 8px var(--violet); animation:blink 2s infinite; }
  @keyframes blink { 0%,100%{opacity:1} 50%{opacity:.25} }
  .page-title { font-family:'Syne',sans-serif; font-size:clamp(30px,4vw,48px); font-weight:800; letter-spacing:-.04em; line-height:1.08; margin-bottom:14px; }
  .page-title span { background:linear-gradient(135deg,var(--violet),var(--cyan)); -webkit-background-clip:text; -webkit-text-fill-color:transparent; }
  .last-updated { font-family:'JetBrains Mono',monospace; font-size:11px; color:var(--text-3); background:var(--bg-2); border:1px solid var(--border); padding:6px 14px; border-radius:20px; display:inline-block; margin-bottom:20px; }
  .intro-box { background:var(--bg-2); border:1px solid rgba(139,127,255,.18); border-radius:14px; padding:20px 22px; font-size:14px; color:var(--text-2); line-height:1.7; border-left:3px solid var(--violet); }

  .content-hero { margin-bottom:48px; animation:up .6s ease both; }

  .tab-bar { display:flex; gap:4px; background:var(--bg-2); border:1px solid var(--border); border-radius:14px; padding:5px; margin-bottom:40px; width:fit-content; animation:up .6s .08s ease both; flex-wrap:wrap; }
  .tab-btn { padding:9px 20px; border-radius:10px; font-family:'DM Sans',sans-serif; font-size:13.5px; font-weight:600; cursor:pointer; transition:all .2s; border:none; color:var(--text-2); background:transparent; }
  .tab-btn.active { background:rgba(139,127,255,.15); color:var(--violet); border:1px solid rgba(139,127,255,.25); }
  .tab-btn:hover:not(.active) { color:var(--text); background:rgba(255,255,255,.04); }

  .tab-panel { display:none; }
  .tab-panel.active { display:block; animation:fade .3s ease forwards; }

  .section { margin-bottom:52px; scroll-margin-top:80px; }
  .section-num { font-family:'JetBrains Mono',monospace; font-size:11px; color:var(--violet); letter-spacing:.1em; margin-bottom:8px; }
  .section-title { font-family:'Syne',sans-serif; font-size:22px; font-weight:700; letter-spacing:-.02em; margin-bottom:18px; padding-bottom:12px; border-bottom:1px solid var(--border); }
  .section-body { font-size:14px; color:var(--text-2); line-height:1.85; }
  .section-body p { margin-bottom:14px; }
  .section-body strong { color:var(--text); font-weight:600; }
  .section-body a { color:var(--violet); transition:color .18s; }
  .section-body a:hover { color:#B8B0FF; }
  
  .info-list { list-style:none; display:flex; flex-direction:column; gap:8px; margin:16px 0; padding:0; }
  .info-list li { display:flex; align-items:flex-start; gap:10px; font-size:14px; color:var(--text-2); line-height:1.65; }
  .info-list li::before { content:'→'; color:var(--violet); flex-shrink:0; font-family:'JetBrains Mono',monospace; font-size:12px; margin-top:2px; }
  
  .highlight-box { background:var(--bg-2); border:1px solid var(--border); border-radius:12px; padding:18px 20px; margin:18px 0; }
  .highlight-box.info { border-color:rgba(139,127,255,.2); background:rgba(139,127,255,.04); }
  .hb-title { font-family:'JetBrains Mono',monospace; font-size:10px; letter-spacing:.12em; text-transform:uppercase; color:var(--text-3); margin-bottom:8px; }
  .hb-title.info { color:var(--violet); }
  .hb-body { font-size:13.5px; color:var(--text-2); line-height:1.7; }

  .data-table { width:100%; border-collapse:collapse; margin:18px 0; }
  .data-table th { font-family:'JetBrains Mono',monospace; font-size:9.5px; letter-spacing:.12em; text-transform:uppercase; color:var(--text-3); text-align:left; padding:10px 14px; border-bottom:1px solid var(--border); }
  .data-table td { font-size:13.5px; color:var(--text-2); padding:12px 14px; border-bottom:1px solid var(--border); vertical-align:top; line-height:1.6; }
  .data-table tr:hover td { background:rgba(255,255,255,.02); }
  .data-table td:first-child { color:var(--text); font-weight:500; white-space:nowrap; }

  .sep { height:1px; background:linear-gradient(90deg,transparent,var(--border-h) 30%,var(--border-h) 70%,transparent); margin:40px 0; }

  .cookie-type { display:inline-block; font-family:'JetBrains Mono',monospace; font-size:9.5px; padding:3px 9px; border-radius:20px; border:1px solid; }
  .ct-essential { color:var(--teal); border-color:rgba(0,229,168,.3); background:rgba(0,229,168,.07); }
  .ct-analytics  { color:var(--cyan); border-color:rgba(0,212,255,.3); background:rgba(0,212,255,.07); }
  .ct-optional   { color:var(--gold); border-color:rgba(255,184,0,.3); background:rgba(255,184,0,.07); }

  .contact-box { background:var(--bg-2); border:1px solid rgba(139,127,255,.2); border-radius:16px; padding:28px; margin-top:32px; display:flex; align-items:center; gap:20px; }
  .contact-title { font-family:'Syne',sans-serif; font-size:18px; font-weight:700; margin-bottom:6px; }
  .contact-sub { font-size:13.5px; color:var(--text-2); line-height:1.6; }
  .contact-sub a { color:var(--violet); }

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
  @keyframes fade { from{opacity:0;} to{opacity:1;} }
`

export default function LegalPage() {
  const [activeTab, setActiveTab] = useState('privacy')
  const [activeSection, setActiveSection] = useState('priv-1')

  useEffect(() => {
    const link = document.createElement('link')
    link.href = 'https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&family=JetBrains+Mono:wght@400;500&display=swap'
    link.rel = 'stylesheet'
    document.head.appendChild(link)

    const handleScroll = () => {
      let current = ''
      const sections = document.querySelectorAll('.tab-panel.active section[id]')
      sections.forEach(s => {
        if (window.scrollY >= s.offsetTop - 150) {
          current = s.id
        }
      })
      if (current) setActiveSection(current)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [activeTab])

  const handleTocClick = (id, tabName) => {
    if (activeTab !== tabName) {
      setActiveTab(tabName)
    }
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    }, 10)
  }

  return (
    <div className="legal-wrapper">
      <style>{styles}</style>
      <div className="bg-wrap"><div className="orb orb-1"></div><div className="orb orb-2"></div></div>
      <div className="grid-bg"></div>

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
        </div>
        <div className="nav-end">
          <Link href="/login" className="btn btn-ghost btn-sm">Log in</Link>
          <Link href="/signup" className="btn btn-primary btn-sm">Sign up →</Link>
        </div>
      </nav>

      <div className="page-wrap">
        
        {/* SIDEBAR TOC */}
        <aside className="toc">
          <div className="toc-label">Contents</div>
          
          <div className="toc-section-label">Privacy Policy</div>
          <div className={`toc-item ${activeSection === 'priv-1' && activeTab === 'privacy' ? 'active' : ''}`} onClick={() => handleTocClick('priv-1', 'privacy')}><span className="toc-num">01</span>Data We Collect</div>
          <div className={`toc-item ${activeSection === 'priv-2' && activeTab === 'privacy' ? 'active' : ''}`} onClick={() => handleTocClick('priv-2', 'privacy')}><span className="toc-num">02</span>How We Use Data</div>
          <div className={`toc-item ${activeSection === 'priv-3' && activeTab === 'privacy' ? 'active' : ''}`} onClick={() => handleTocClick('priv-3', 'privacy')}><span className="toc-num">03</span>Data Sharing</div>
          <div className={`toc-item ${activeSection === 'priv-4' && activeTab === 'privacy' ? 'active' : ''}`} onClick={() => handleTocClick('priv-4', 'privacy')}><span className="toc-num">04</span>Your Rights</div>
          <div className={`toc-item ${activeSection === 'priv-5' && activeTab === 'privacy' ? 'active' : ''}`} onClick={() => handleTocClick('priv-5', 'privacy')}><span className="toc-num">05</span>Data Security</div>
          
          <div className="toc-sep"></div>
          
          <div className="toc-section-label">Cookies</div>
          <div className={`toc-item ${activeSection === 'cookies' && activeTab === 'cookies' ? 'active' : ''}`} onClick={() => handleTocClick('cookies', 'cookies')}><span className="toc-num">06</span>Cookie Policy</div>
          
          <div className="toc-sep"></div>
          
          <div className="toc-section-label">Disclaimer</div>
          <div className={`toc-item ${activeSection === 'disclaimer' && activeTab === 'disclaimer' ? 'active' : ''}`} onClick={() => handleTocClick('disclaimer', 'disclaimer')}><span className="toc-num">07</span>Disclaimer</div>
          <div className={`toc-item ${activeSection === 'contact-legal' && activeTab === 'disclaimer' ? 'active' : ''}`} onClick={() => handleTocClick('contact-legal', 'disclaimer')}><span className="toc-num">08</span>Contact</div>
        </aside>

        <main>
          <div className="content-hero">
            <div className="eyebrow"><div className="ey-dot"></div>Legal Documents</div>
            <h1 className="page-title">Privacy & <span>Legal</span></h1>
            <div className="last-updated">Last Updated: January 1, 2026 · Version 1.0</div>
            <div className="intro-box">Your privacy matters to us. This page covers our Privacy Policy, Cookie Policy, and Disclaimer. MentorBridge is committed to protecting your personal data and being transparent about how we use it.</div>
          </div>

          {/* TAB BAR */}
          <div className="tab-bar">
            <button className={`tab-btn ${activeTab === 'privacy' ? 'active' : ''}`} onClick={() => {setActiveTab('privacy'); window.scrollTo(0,0)}}>🔒 Privacy Policy</button>
            <button className={`tab-btn ${activeTab === 'cookies' ? 'active' : ''}`} onClick={() => {setActiveTab('cookies'); window.scrollTo(0,0)}}>🍪 Cookie Policy</button>
            <button className={`tab-btn ${activeTab === 'disclaimer' ? 'active' : ''}`} onClick={() => {setActiveTab('disclaimer'); window.scrollTo(0,0)}}>⚠️ Disclaimer</button>
          </div>

          {/* ── PRIVACY POLICY TAB ── */}
          <div className={`tab-panel ${activeTab === 'privacy' ? 'active' : ''}`}>
            <section className="section" id="priv-1">
              <div className="section-num">01 /</div>
              <div className="section-title">Data We Collect</div>
              <div className="section-body">
                <p>When you use MentorBridge, we collect information to provide and improve our services. Here is what we collect and why:</p>
                <table className="data-table">
                  <thead><tr><th>Data Type</th><th>What We Collect</th><th>Why</th></tr></thead>
                  <tbody>
                    <tr><td>Account Info</td><td>Name, email, password (hashed), role (student/mentor)</td><td>To create and manage your account</td></tr>
                    <tr><td>Profile Data</td><td>Target country, field, degree level, mentor bio, skills</td><td>To power SmartMatch AI and personalise your experience</td></tr>
                    <tr><td>Session Data</td><td>Booked sessions, session times, mentor IDs, Meet links</td><td>To facilitate mentor-student connections</td></tr>
                    <tr><td>Usage Data</td><td>Pages visited, features used, clicks, time on site</td><td>To improve platform performance and UX</td></tr>
                    <tr><td>Device Data</td><td>Browser type, IP address, device type, OS</td><td>For security and fraud prevention</td></tr>
                    <tr><td>Communications</td><td>Emails you send to us, support tickets</td><td>To respond to queries and improve support</td></tr>
                  </tbody>
                </table>
                <p>We do not collect sensitive personal information such as financial account details, passport numbers, or biometric data.</p>
              </div>
            </section>

            <div className="sep"></div>

            <section className="section" id="priv-2">
              <div className="section-num">02 /</div>
              <div className="section-title">How We Use Your Data</div>
              <div className="section-body">
                <p>We use the data we collect only for legitimate purposes related to providing and improving our services:</p>
                <ul className="info-list">
                  <li><strong>Service Delivery:</strong> Matching you with mentors, facilitating session bookings, sending session confirmations and reminders.</li>
                  <li><strong>Personalisation:</strong> Tailoring scholarship recommendations, mentor suggestions, and career intelligence to your profile.</li>
                  <li><strong>Communication:</strong> Sending you important platform updates, booking confirmations, and (with your consent) newsletters or product announcements.</li>
                  <li><strong>Security:</strong> Detecting and preventing fraudulent activity, unauthorised access, and abuse of our platform.</li>
                  <li><strong>Analytics:</strong> Understanding how users interact with the platform to improve features and fix issues.</li>
                  <li><strong>Legal Compliance:</strong> Fulfilling our obligations under applicable laws and regulations.</li>
                </ul>
                <div className="highlight-box info">
                  <div className="hb-title info">📧 Marketing Emails</div>
                  <div className="hb-body">We will only send you marketing emails if you have explicitly opted in. You can unsubscribe at any time using the link in any email we send.</div>
                </div>
              </div>
            </section>

            <div className="sep"></div>

            <section className="section" id="priv-3">
              <div className="section-num">03 /</div>
              <div className="section-title">Data Sharing & Third Parties</div>
              <div className="section-body">
                <p><strong>We do not sell your personal data.</strong> We may share your information with trusted third parties only in the following circumstances:</p>
                <ul className="info-list">
                  <li><strong>Mentors:</strong> When you book a session, we share your name and session details with the relevant mentor.</li>
                  <li><strong>Service Providers:</strong> We use third-party services for hosting, authentication, email delivery, and analytics. These providers are bound by data processing agreements.</li>
                  <li><strong>Google Meet:</strong> Session Meet links are generated using Google's infrastructure. By booking a session, you agree to Google's Terms of Service.</li>
                  <li><strong>Legal Requirements:</strong> We may disclose your data if required by law, court order, or government authority.</li>
                </ul>
                <p>Any third party we work with is required to maintain appropriate security standards and may only use your data for the specific purpose we authorise.</p>
              </div>
            </section>

            <div className="sep"></div>

            <section className="section" id="priv-4">
              <div className="section-num">04 /</div>
              <div className="section-title">Your Rights</div>
              <div className="section-body">
                <p>Depending on your location, you may have the following rights regarding your personal data:</p>
                <ul className="info-list">
                  <li><strong>Access:</strong> Request a copy of the personal data we hold about you.</li>
                  <li><strong>Correction:</strong> Request that we correct inaccurate or incomplete data.</li>
                  <li><strong>Deletion:</strong> Request deletion of your account and associated personal data ("right to be forgotten").</li>
                  <li><strong>Portability:</strong> Request your data in a machine-readable format to transfer to another service.</li>
                  <li><strong>Opt-Out:</strong> Unsubscribe from marketing communications at any time.</li>
                  <li><strong>Objection:</strong> Object to processing of your data for direct marketing purposes.</li>
                </ul>
                <p>To exercise any of these rights, email us at <a href="mailto:privacy@mentorbridge.in">privacy@mentorbridge.in</a>. We will respond within 30 days.</p>
              </div>
            </section>

            <div className="sep"></div>

            <section className="section" id="priv-5">
              <div className="section-num">05 /</div>
              <div className="section-title">Data Security & Retention</div>
              <div className="section-body">
                <p>We take security seriously. Measures we use include:</p>
                <ul className="info-list">
                  <li>All passwords are hashed using bcrypt before storage — we never store plain-text passwords.</li>
                  <li>Data is transmitted over HTTPS with TLS encryption.</li>
                  <li>Access to production databases is restricted to authorised personnel only.</li>
                  <li>Regular security audits and dependency updates are performed.</li>
                </ul>
                <p>We retain your data for as long as your account is active or as needed to provide services. If you delete your account, we will delete or anonymise your personal data within 30 days, except where retention is required by law.</p>
              </div>
            </section>
          </div>

          {/* ── COOKIES TAB ── */}
          <div className={`tab-panel ${activeTab === 'cookies' ? 'active' : ''}`}>
            <section className="section" id="cookies">
              <div className="section-num">06 /</div>
              <div className="section-title">Cookie Policy</div>
              <div className="section-body">
                <p>Cookies are small text files stored on your device when you visit MentorBridge. They help us remember your preferences, keep you logged in, and understand how you use our platform.</p>

                <table className="data-table" style={{marginBottom:24}}>
                  <thead><tr><th>Cookie Name</th><th>Type</th><th>Purpose</th><th>Duration</th></tr></thead>
                  <tbody>
                    <tr><td>mb_session</td><td><span className="cookie-type ct-essential">Essential</span></td><td>Keeps you logged in securely</td><td>Session</td></tr>
                    <tr><td>mb_auth_token</td><td><span className="cookie-type ct-essential">Essential</span></td><td>Authentication and security</td><td>7 days</td></tr>
                    <tr><td>mb_prefs</td><td><span className="cookie-type ct-essential">Essential</span></td><td>Stores your UI preferences (theme, filters)</td><td>30 days</td></tr>
                    <tr><td>_ga</td><td><span className="cookie-type ct-analytics">Analytics</span></td><td>Google Analytics — tracks page views anonymously</td><td>2 years</td></tr>
                    <tr><td>_gid</td><td><span className="cookie-type ct-analytics">Analytics</span></td><td>Google Analytics — distinguishes users</td><td>24 hours</td></tr>
                    <tr><td>mb_referral</td><td><span className="cookie-type ct-optional">Optional</span></td><td>Tracks referral source for improvements</td><td>90 days</td></tr>
                  </tbody>
                </table>

                <p><strong>Essential cookies</strong> are required for the platform to function and cannot be disabled. <strong>Analytics and optional cookies</strong> can be managed through your browser settings or by contacting us.</p>
                <p>Most browsers allow you to refuse or delete cookies. Note that disabling essential cookies may affect platform functionality including the ability to stay logged in.</p>

                <div className="highlight-box info">
                  <div className="hb-title info">🍪 Your Choices</div>
                  <div className="hb-body">You can clear cookies from your browser at any time. For Chrome: Settings → Privacy → Clear browsing data. For Firefox: Options → Privacy → Clear Data. We do not use cookies for targeted advertising.</div>
                </div>
              </div>
            </section>
          </div>

          {/* ── DISCLAIMER TAB ── */}
          <div className={`tab-panel ${activeTab === 'disclaimer' ? 'active' : ''}`}>
            <section className="section" id="disclaimer">
              <div className="section-num">07 /</div>
              <div className="section-title">Disclaimer</div>
              <div className="section-body">
                <p>MentorBridge is a student-built platform created to help aspiring students navigate the study-abroad journey. While we strive to provide accurate, helpful, and up-to-date information, the following important disclaimers apply:</p>

                <p><strong>No Guarantee of Outcomes</strong><br/>
                MentorBridge and its mentors do not guarantee university admission, visa approval, scholarship success, or any specific career outcome. All mentorship is advisory in nature. Final decisions rest with universities, visa authorities, and scholarship committees.</p>

                <p><strong>Not Professional Advice</strong><br/>
                Information provided on MentorBridge — including mentor guidance, scholarship details, salary data, ROI projections, and career intelligence — is for general informational purposes only and does not constitute professional legal, financial, immigration, or academic advice. Always consult official sources and qualified professionals for critical decisions.</p>

                <p><strong>Data Accuracy</strong><br/>
                Scholarship deadlines, amounts, and eligibility criteria are subject to change. Always verify information directly on the official scholarship or university website before applying. MentorBridge is not responsible for any decisions made based on outdated platform data.</p>

                <p><strong>Student-Built Platform</strong><br/>
                MentorBridge was created as a project by three students — <strong>Aarya Gaikwad, Ayeesha Munshi, and Md Saif Sanadi</strong>. While we have put significant effort into building a reliable and helpful product, the platform may have bugs, inaccuracies, or limitations. We welcome all feedback and bug reports at <a href="mailto:support@mentorbridge.in">support@mentorbridge.in</a>.</p>

                <p><strong>External Links</strong><br/>
                MentorBridge may contain links to external websites (official scholarship sites, university portals, government pages). We are not responsible for the content, accuracy, or privacy practices of external sites.</p>
              </div>
            </section>

            <section className="section" id="contact-legal">
              <div className="section-num">08 /</div>
              <div className="section-title">Legal Contact</div>
              <div className="section-body"><p>For any legal or privacy concerns, please contact us directly.</p></div>
              <div className="contact-box">
                <div style={{fontSize:36}}>⚖️</div>
                <div>
                  <div className="contact-title">Legal & Privacy Team</div>
                  <div className="contact-sub">
                    Privacy queries: <a href="mailto:privacy@mentorbridge.in">privacy@mentorbridge.in</a><br/>
                    Legal queries: <a href="mailto:legal@mentorbridge.in">legal@mentorbridge.in</a><br/>
                    General support: <a href="mailto:support@mentorbridge.in">support@mentorbridge.in</a><br/>
                    Built by: <Link href="/team">Aarya, Ayeesha & Saif →</Link>
                  </div>
                </div>
              </div>
            </section>
          </div>

        </main>
      </div>

      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-top">
            <div>
              <div className="footer-brand-row">
                <div className="footer-brand-ico"><Triangle size={16} fill="currentColor" strokeWidth={2} className="rotate-180" /></div>
                <span className="footer-brand-name">MentorBridge</span>
              </div>
              <p className="footer-tagline">Connecting ambitious students with mentors who've walked the path.</p>
            </div>
            <div className="footer-col">
              <div className="footer-col-title">Platform</div>
              <Link href="/mentors">Find Mentors</Link>
              <Link href="/scholarships">Scholarships</Link>
              <Link href="/stories">Success Stories</Link>
            </div>
            <div className="footer-col">
              <div className="footer-col-title">Company</div>
              <Link href="#">About Us</Link>
              <Link href="/team">Meet the Builders</Link>
              <Link href="#">Contact</Link>
            </div>
            <div className="footer-col">
              <div className="footer-col-title">Legal</div>
              <Link href="/terms">Terms & Conditions</Link>
              <Link href="/legal" style={{color:'var(--violet)'}}>Privacy & Legal</Link>
              <Link href="/legal">Cookies</Link>
            </div>
          </div>
          <div className="footer-bottom">
            <span className="footer-copy">© 2026 MentorBridge. All rights reserved.</span>
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