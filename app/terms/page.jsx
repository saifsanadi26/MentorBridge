'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Triangle } from 'lucide-react'

const styles = `
  .terms-wrapper {
    --bg:#07090F; --bg-2:#0B0E18; --bg-3:#0F1219; --bg-4:#131720;
    --border:rgba(255,255,255,0.065); --border-h:rgba(255,255,255,0.12);
    --cyan:#00D4FF; --teal:#00E5A8; --violet:#8B7FFF; --gold:#FFB800; --rose:#FF5E8A;
    --text:#E8EAF6; --text-2:#7A7F99; --text-3:#3E4460;
    background: var(--bg); color: var(--text); font-family: 'DM Sans', sans-serif;
    min-height: 100vh; position: relative; overflow-x: hidden; scroll-behavior: smooth;
  }
  .terms-wrapper * { box-sizing: border-box; }
  .terms-wrapper a { text-decoration: none; color: inherit; }

  .terms-wrapper ::-webkit-scrollbar { width:4px; background:var(--bg); }
  .terms-wrapper ::-webkit-scrollbar-thumb { background:rgba(255,255,255,.08); border-radius:4px; }

  .bg-wrap { position:fixed; inset:0; z-index:0; pointer-events:none; }
  .orb { position:absolute; border-radius:50%; filter:blur(130px); animation:drift 22s ease-in-out infinite alternate; }
  .orb-1 { width:600px; height:600px; background:radial-gradient(circle,rgba(0,212,255,.07) 0%,transparent 65%); top:-200px; left:-100px; }
  .orb-2 { width:500px; height:500px; background:radial-gradient(circle,rgba(139,127,255,.06) 0%,transparent 65%); bottom:-100px; right:-100px; animation-delay:-9s; }
  @keyframes drift { 0%{transform:translate(0,0)} 100%{transform:translate(40px,30px)} }
  .grid-bg { position:fixed; inset:0; z-index:0; pointer-events:none; background:linear-gradient(rgba(255,255,255,.016) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.016) 1px,transparent 1px); background-size:56px 56px; mask-image:radial-gradient(ellipse 80% 60% at 50% 0%,black 30%,transparent 100%); -webkit-mask-image:radial-gradient(ellipse 80% 60% at 50% 0%,black 30%,transparent 100%); }

  .nav { position:fixed; top:0; left:0; right:0; z-index:900; height:62px; background:rgba(7,9,15,.82); backdrop-filter:blur(24px); border-bottom:1px solid var(--border); display:flex; align-items:center; padding:0 44px; }
  .brand { display:flex; align-items:center; gap:9px; margin-right:36px; }
  .brand-ico { width:32px; height:32px; background:linear-gradient(135deg,var(--cyan),var(--teal)); border-radius:9px; display:flex; align-items:center; justify-content:center; font-size:16px; box-shadow:0 0 18px rgba(0,212,255,.3); color:#000; }
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
  .btn-primary:hover { box-shadow:0 0 36px rgba(0,212,255,.48); transform:translateY(-1px); }

  .page-wrap { max-width:1280px; margin:0 auto; padding:120px 44px 96px; position:relative; z-index:1; display:grid; grid-template-columns:260px 1fr; gap:56px; align-items:start; }
  @media (max-width: 900px) { .page-wrap { grid-template-columns: 1fr; } .toc { display: none; } }

  .toc { position:sticky; top:100px; }
  .toc-label { font-family:'JetBrains Mono',monospace; font-size:9.5px; letter-spacing:.14em; text-transform:uppercase; color:var(--text-3); margin-bottom:16px; }
  .toc-item { display:flex; align-items:center; gap:8px; font-size:13px; color:var(--text-2); padding:8px 12px; border-radius:9px; margin-bottom:2px; cursor:pointer; transition:all .18s; border-left:2px solid transparent; }
  .toc-item:hover { color:var(--text); background:rgba(255,255,255,.04); border-left-color:var(--border-h); }
  .toc-item.active { color:var(--cyan); background:rgba(0,212,255,.07); border-left-color:var(--cyan); }
  .toc-num { font-family:'JetBrains Mono',monospace; font-size:10px; color:var(--text-3); width:18px; flex-shrink:0; }

  .content-hero { margin-bottom:48px; animation:up .6s ease both; }
  .eyebrow { display:inline-flex; align-items:center; gap:8px; font-family:'JetBrains Mono',monospace; font-size:10.5px; letter-spacing:.15em; text-transform:uppercase; padding:5px 13px; border-radius:30px; margin-bottom:18px; color:var(--cyan); background:rgba(0,212,255,.07); border:1px solid rgba(0,212,255,.2); }
  .page-title { font-family:'Syne',sans-serif; font-size:clamp(30px,4vw,48px); font-weight:800; letter-spacing:-.04em; line-height:1.08; margin-bottom:14px; }
  .page-title span { background:linear-gradient(135deg,var(--cyan),var(--teal)); -webkit-background-clip:text; -webkit-text-fill-color:transparent; }
  .last-updated { font-family:'JetBrains Mono',monospace; font-size:11px; color:var(--text-3); background:var(--bg-2); border:1px solid var(--border); padding:6px 14px; border-radius:20px; display:inline-block; margin-bottom:20px; }
  .intro-box { background:var(--bg-2); border:1px solid rgba(0,212,255,.18); border-radius:14px; padding:20px 22px; font-size:14px; color:var(--text-2); line-height:1.7; border-left:3px solid var(--cyan); }

  .section { margin-bottom:52px; scroll-margin-top:80px; animation:up .5s ease both; }
  .section-num { font-family:'JetBrains Mono',monospace; font-size:11px; color:var(--cyan); letter-spacing:.1em; margin-bottom:8px; }
  .section-title { font-family:'Syne',sans-serif; font-size:22px; font-weight:700; letter-spacing:-.02em; margin-bottom:18px; padding-bottom:12px; border-bottom:1px solid var(--border); }
  .section-body { font-size:14px; color:var(--text-2); line-height:1.85; }
  .section-body p { margin-bottom:14px; }
  .section-body p:last-child { margin-bottom:0; }
  .section-body strong { color:var(--text); font-weight:600; }
  .section-body a { color:var(--cyan); transition:color .18s; }
  .section-body a:hover { color:#7EEDFF; }

  .info-list { list-style:none; display:flex; flex-direction:column; gap:8px; margin:16px 0; padding:0; }
  .info-list li { display:flex; align-items:flex-start; gap:10px; font-size:14px; color:var(--text-2); line-height:1.65; }
  .info-list li::before { content:'→'; color:var(--cyan); flex-shrink:0; font-family:'JetBrains Mono',monospace; font-size:12px; margin-top:2px; }

  .highlight-box { background:var(--bg-2); border:1px solid var(--border); border-radius:12px; padding:18px 20px; margin:18px 0; }
  .highlight-box.warn { border-color:rgba(255,184,0,.2); background:rgba(255,184,0,.04); }
  .highlight-box.danger { border-color:rgba(255,94,138,.2); background:rgba(255,94,138,.04); }
  .hb-title { font-family:'JetBrains Mono',monospace; font-size:10px; letter-spacing:.12em; text-transform:uppercase; color:var(--text-3); margin-bottom:8px; }
  .hb-title.warn { color:var(--gold); }
  .hb-title.danger { color:var(--rose); }
  .hb-body { font-size:13.5px; color:var(--text-2); line-height:1.7; }

  .sep { height:1px; background:linear-gradient(90deg,transparent,var(--border-h) 30%,var(--border-h) 70%,transparent); margin:48px 0; }

  .contact-box { background:var(--bg-2); border:1px solid rgba(0,229,168,.2); border-radius:16px; padding:28px; margin-top:32px; display:flex; align-items:center; gap:20px; }
  .contact-icon { font-size:36px; flex-shrink:0; }
  .contact-title { font-family:'Syne',sans-serif; font-size:18px; font-weight:700; margin-bottom:6px; }
  .contact-sub { font-size:13.5px; color:var(--text-2); line-height:1.6; }
  .contact-sub a { color:var(--teal); }

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

export default function TermsPage() {
  const [activeSection, setActiveSection] = useState('section-1')

  useEffect(() => {
    const link = document.createElement('link')
    link.href = 'https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&family=JetBrains+Mono:wght@400;500&display=swap'
    link.rel = 'stylesheet'
    document.head.appendChild(link)

    const handleScroll = () => {
      let current = ''
      const sections = document.querySelectorAll('section[id]')
      sections.forEach(s => {
        if (window.scrollY >= s.offsetTop - 120) {
          current = s.id
        }
      })
      if (current) setActiveSection(current)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const tocItems = [
    { id: 'section-1', num: '01', title: 'Acceptance of Terms' },
    { id: 'section-2', num: '02', title: 'Use of Platform' },
    { id: 'section-3', num: '03', title: 'User Accounts' },
    { id: 'section-4', num: '04', title: 'Mentor Relationships' },
    { id: 'section-5', num: '05', title: 'Intellectual Property' },
    { id: 'section-6', num: '06', title: 'Payments & Refunds' },
    { id: 'section-7', num: '07', title: 'Prohibited Conduct' },
    { id: 'section-8', num: '08', title: 'Disclaimers' },
    { id: 'section-9', num: '09', title: 'Limitation of Liability' },
    { id: 'section-10', num: '10', title: 'Termination' },
    { id: 'section-11', num: '11', title: 'Governing Law' },
    { id: 'section-12', num: '12', title: 'Contact Us' }
  ]

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="terms-wrapper">
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
          <Link href="/market-insights">Market Data</Link>
        </div>
        <div className="nav-end">
          <Link href="/login" className="btn btn-ghost btn-sm">Log in</Link>
          <Link href="/signup" className="btn btn-primary btn-sm">Sign up →</Link>
        </div>
      </nav>

      <div className="page-wrap">
        {/* SIDEBAR TOC */}
        <aside className="toc">
          <div className="toc-label">Table of Contents</div>
          {tocItems.map(item => (
            <div 
              key={item.id} 
              className={`toc-item ${activeSection === item.id ? 'active' : ''}`}
              onClick={() => scrollToSection(item.id)}
            >
              <span className="toc-num">{item.num}</span>{item.title}
            </div>
          ))}
        </aside>

        {/* MAIN CONTENT */}
        <main className="content">
          <div className="content-hero">
            <div className="eyebrow">📄 Legal Document</div>
            <h1 className="page-title">Terms & <span>Conditions</span></h1>
            <div className="last-updated">Last Updated: January 1, 2026 · Version 1.0</div>
            <div className="intro-box">
              Welcome to MentorBridge. By accessing or using our platform, you agree to be bound by these Terms and Conditions. Please read them carefully before using any of our services. If you do not agree to these terms, you may not use our platform.
            </div>
          </div>

          <section className="section" id="section-1">
            <div className="section-num">01 /</div>
            <div className="section-title">Acceptance of Terms</div>
            <div className="section-body">
              <p>By creating an account, booking a session, or using any feature of <strong>MentorBridge</strong> ("Platform", "we", "us", or "our"), you confirm that you are at least 16 years of age and that you accept and agree to be bound by these Terms and Conditions, together with our Privacy Policy and any additional guidelines we may publish from time to time.</p>
              <p>These Terms constitute a legally binding agreement between you and MentorBridge. If you are using the Platform on behalf of an organisation, you represent that you have authority to bind that organisation to these Terms.</p>
              <div className="highlight-box">
                <div className="hb-title">Important</div>
                <div className="hb-body">We may update these Terms periodically. Continued use of the platform after changes are posted constitutes your acceptance of the revised Terms. We will notify you of significant changes via email or a banner on the site.</div>
              </div>
            </div>
          </section>

          <div className="sep"></div>

          <section className="section" id="section-2">
            <div className="section-num">02 /</div>
            <div className="section-title">Use of Platform</div>
            <div className="section-body">
              <p>MentorBridge provides a platform connecting students seeking study-abroad guidance with verified alumni mentors. Our services include mentor discovery, session booking, scholarship information, career intelligence, ROI tools, and community features.</p>
              <p>You agree to use the Platform only for lawful purposes and in accordance with these Terms. Specifically, you agree to:</p>
              <ul className="info-list">
                <li>Provide accurate, current, and complete information when creating your account or booking sessions.</li>
                <li>Not impersonate any person or entity or misrepresent your affiliation with any person or entity.</li>
                <li>Not use the platform to send spam, unsolicited messages, or promotional content.</li>
                <li>Not attempt to gain unauthorised access to any part of the Platform or its related systems.</li>
                <li>Respect the privacy and personal information of other users, including mentors and students.</li>
                <li>Not use any automated system, including bots or scrapers, to access or collect data from the Platform.</li>
              </ul>
            </div>
          </section>

          <div className="sep"></div>

          <section className="section" id="section-3">
            <div className="section-num">03 /</div>
            <div className="section-title">User Accounts</div>
            <div className="section-body">
              <p>To access certain features you must create an account. When you register, you must provide accurate and complete information. You are responsible for:</p>
              <ul className="info-list">
                <li>Maintaining the confidentiality of your account credentials and password.</li>
                <li>All activities that occur under your account, whether or not authorised by you.</li>
                <li>Notifying us immediately at <a href="mailto:support@mentorbridge.in">support@mentorbridge.in</a> of any unauthorised use of your account.</li>
                <li>Keeping your profile information updated and accurate at all times.</li>
              </ul>
              <p>MentorBridge reserves the right to suspend or terminate accounts that violate these Terms, provide false information, or engage in behaviour harmful to other users or the platform.</p>
              <div className="highlight-box warn">
                <div className="hb-title warn">⚠️ Account Security</div>
                <div className="hb-body">Never share your password with anyone, including our support team. MentorBridge will never ask for your password via email or chat.</div>
              </div>
            </div>
          </section>

          <div className="sep"></div>

          <section className="section" id="section-4">
            <div className="section-num">04 /</div>
            <div className="section-title">Mentor Relationships</div>
            <div className="section-body">
              <p>Mentors on MentorBridge are independent individuals, not employees, agents, or representatives of MentorBridge. All mentor profiles are verified for basic authenticity, but we do not guarantee the accuracy of individual mentor claims regarding their academic or professional background.</p>
              <p>When you book a session with a mentor:</p>
              <ul className="info-list">
                <li>The relationship formed is directly between you and the mentor as independent parties.</li>
                <li>MentorBridge acts solely as a facilitator and is not responsible for the advice given during sessions.</li>
                <li>Guidance provided by mentors is for informational purposes only and does not constitute official academic, legal, financial, or immigration advice.</li>
                <li>Admission outcomes, visa approvals, and scholarship results are not guaranteed by any mentor or by MentorBridge.</li>
                <li>You are responsible for independently verifying any information provided during mentor sessions.</li>
              </ul>
              <p>Both students and mentors agree to conduct sessions professionally and respectfully. Any form of harassment, discrimination, or inappropriate behaviour will result in immediate account termination.</p>
            </div>
          </section>

          <div className="sep"></div>

          <section className="section" id="section-5">
            <div className="section-num">05 /</div>
            <div className="section-title">Intellectual Property</div>
            <div className="section-body">
              <p>All content on MentorBridge — including but not limited to text, graphics, logos, design, software, data, and the overall "look and feel" of the Platform — is owned by MentorBridge or its licensors and is protected by applicable intellectual property laws.</p>
              <p>You are granted a limited, non-exclusive, non-transferable licence to access and use the Platform for your personal, non-commercial use only. You may not:</p>
              <ul className="info-list">
                <li>Copy, reproduce, distribute, or create derivative works from any Platform content without written permission.</li>
                <li>Use our brand name, logo, or trademarks without express written consent.</li>
                <li>Reverse engineer, decompile, or attempt to extract source code from our software.</li>
                <li>Scrape, harvest, or otherwise collect data from the Platform for commercial purposes.</li>
              </ul>
              <p>Any content you submit to the Platform (such as profile information, session notes, or reviews) grants MentorBridge a worldwide, royalty-free licence to use, display, and distribute that content in connection with operating and improving the Platform.</p>
            </div>
          </section>

          <div className="sep"></div>

          <section className="section" id="section-6">
            <div className="section-num">06 /</div>
            <div className="section-title">Payments & Refunds</div>
            <div className="section-body">
              <p>MentorBridge may charge fees for certain services, including session bookings. All fees are displayed clearly before you complete any purchase. By completing a payment, you authorise us to charge your selected payment method.</p>
              <ul className="info-list">
                <li><strong>Session cancellations</strong> made more than 24 hours before the scheduled time are eligible for a full refund.</li>
                <li><strong>Cancellations within 24 hours</strong> of the session may receive a partial refund or platform credit at our discretion.</li>
                <li><strong>No-shows</strong> by the student are not eligible for refunds unless due to a verified technical failure on the Platform's end.</li>
                <li><strong>Mentor no-shows</strong> will result in a full refund and the mentor's availability may be temporarily suspended.</li>
                <li>All refunds are processed within 5–10 business days to the original payment method.</li>
              </ul>
              <div className="highlight-box">
                <div className="hb-title">Free Features</div>
                <div className="hb-body">Browsing mentors, viewing scholarships, reading success stories, and using our ROI and cost calculator tools are always free. Paid sessions are optional and clearly marked.</div>
              </div>
            </div>
          </section>

          <div className="sep"></div>

          <section className="section" id="section-7">
            <div className="section-num">07 /</div>
            <div className="section-title">Prohibited Conduct</div>
            <div className="section-body">
              <p>The following activities are strictly prohibited on MentorBridge:</p>
              <ul className="info-list">
                <li>Submitting false, misleading, or fraudulent information in your profile or during sessions.</li>
                <li>Harassing, threatening, or discriminating against any user based on race, gender, religion, nationality, disability, or any other protected characteristic.</li>
                <li>Attempting to circumvent the platform by arranging payments directly with mentors outside of MentorBridge.</li>
                <li>Posting or sharing harmful, offensive, defamatory, or illegal content.</li>
                <li>Using another user's credentials or impersonating any person or entity.</li>
                <li>Interfering with the security, integrity, or performance of the Platform.</li>
                <li>Engaging in any form of academic dishonesty or encouraging mentors to write application documents on your behalf.</li>
              </ul>
              <div className="highlight-box danger">
                <div className="hb-title danger">⛔ Zero Tolerance</div>
                <div className="hb-body">Any account found engaging in harassment, fraud, or abuse will be permanently banned without refund. We take community safety seriously.</div>
              </div>
            </div>
          </section>

          <div className="sep"></div>

          <section className="section" id="section-8">
            <div className="section-num">08 /</div>
            <div className="section-title">Disclaimers</div>
            <div className="section-body">
              <p>MentorBridge provides the Platform on an <strong>"as is" and "as available" basis</strong> without warranties of any kind, either express or implied. We do not warrant that:</p>
              <ul className="info-list">
                <li>The Platform will be uninterrupted, error-free, or completely secure.</li>
                <li>Mentor advice will result in university admission, visa approval, or scholarship success.</li>
                <li>Scholarship and market data on the Platform is always current or completely accurate.</li>
                <li>The Platform will meet your specific requirements or expectations.</li>
              </ul>
              <p>Career data, salary figures, ROI projections, and scholarship information are provided for informational purposes only and are based on publicly available data. Always verify critical information from official university or government sources before making major decisions.</p>
            </div>
          </section>

          <div className="sep"></div>

          <section className="section" id="section-9">
            <div className="section-num">09 /</div>
            <div className="section-title">Limitation of Liability</div>
            <div className="section-body">
              <p>To the fullest extent permitted by applicable law, MentorBridge, its founders, employees, and partners shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or related to your use of the Platform, including:</p>
              <ul className="info-list">
                <li>Loss of data, profits, goodwill, or other intangible losses.</li>
                <li>Damages resulting from reliance on information provided by mentors.</li>
                <li>Outcomes of university applications, visa processes, or scholarship applications.</li>
                <li>Any unauthorised access to or use of our servers and/or any personal information stored therein.</li>
              </ul>
              <p>In no event shall our total liability to you for all claims exceed the amount you paid to MentorBridge in the twelve (12) months preceding the claim.</p>
            </div>
          </section>

          <div className="sep"></div>

          <section className="section" id="section-10">
            <div className="section-num">10 /</div>
            <div className="section-title">Termination</div>
            <div className="section-body">
              <p>MentorBridge reserves the right to suspend or terminate your account and access to the Platform at any time, with or without notice, for conduct that we believe:</p>
              <ul className="info-list">
                <li>Violates these Terms and Conditions or any applicable laws.</li>
                <li>Is harmful to other users, third parties, or MentorBridge.</li>
                <li>Involves fraudulent, deceptive, or abusive behaviour.</li>
              </ul>
              <p>You may also delete your account at any time from your account settings. Upon termination, your right to use the Platform will immediately cease. We may retain certain data as required by law or for legitimate business purposes, in accordance with our Privacy Policy.</p>
            </div>
          </section>

          <div className="sep"></div>

          <section className="section" id="section-11">
            <div className="section-num">11 /</div>
            <div className="section-title">Governing Law</div>
            <div className="section-body">
              <p>These Terms shall be governed by and construed in accordance with the laws of <strong>India</strong>, without regard to its conflict of law principles. Any disputes arising out of or in connection with these Terms shall be subject to the exclusive jurisdiction of the courts located in <strong>Mumbai, Maharashtra, India</strong>.</p>
              <p>If any provision of these Terms is found to be unenforceable or invalid, that provision shall be limited or eliminated to the minimum extent necessary, and the remaining provisions shall remain in full force and effect.</p>
              <p>These Terms, together with our Privacy & Legal Policy, constitute the entire agreement between you and MentorBridge regarding your use of the Platform.</p>
            </div>
          </section>

          <div className="sep"></div>

          <section className="section" id="section-12">
            <div className="section-num">12 /</div>
            <div className="section-title">Contact Us</div>
            <div className="section-body">
              <p>If you have any questions, concerns, or requests regarding these Terms and Conditions, please reach out to us. We aim to respond to all inquiries within 2 business days.</p>
            </div>
            <div className="contact-box">
              <div className="contact-icon">✉️</div>
              <div>
                <div className="contact-title">Get in Touch</div>
                <div className="contact-sub">
                  Email us at <a href="mailto:legal@mentorbridge.in">legal@mentorbridge.in</a> for legal queries, or <a href="mailto:support@mentorbridge.in">support@mentorbridge.in</a> for general support.<br/>
                  You can also <Link href="/team">meet our team</Link> — the people who built MentorBridge.
                </div>
              </div>
            </div>
          </section>

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
              <Link href="/team">Meet the Builders</Link>
              <Link href="#">Contact FAQ</Link>
            </div>
            <div className="footer-col">
              <div className="footer-col-title">Legal</div>
              <Link href="/terms" style={{color:'var(--cyan)'}}>Terms & Conditions</Link>
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