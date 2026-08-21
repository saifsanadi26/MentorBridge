'use client'
import { useEffect } from 'react'
import Link from 'next/link'
import { Triangle } from 'lucide-react'
import FlagImg from "@/components/FlagImg";


export default function Home() {
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible') })
    }, { threshold: 0.12 })
    
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el))

    const barObserver = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const widths = ['90%','68%','54%']
          e.target.querySelectorAll('.roi-bar-fill').forEach((bar, i) => {
            bar.style.width = '0'
            setTimeout(() => { bar.style.width = widths[i] || '50%' }, 100 + i * 150)
          })
          barObserver.unobserve(e.target)
        }
      })
    }, { threshold: 0.3 })

    document.querySelectorAll('.bento-visual').forEach(el => barObserver.observe(el))

    return () => { observer.disconnect(); barObserver.disconnect() }
  }, [])

  return (
    <div className="landing-page">
      <div className="bg-canvas">
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
        <div className="orb orb-3"></div>
      </div>
      <div className="noise"></div>
      <div className="grid-bg"></div>

      <nav className="nav">
        <Link className="nav-brand" href="/">
          <div className="nav-brand-icon">
            <Triangle size={18} fill="currentColor" strokeWidth={2} className="rotate-180" />
          </div>
          <span className="nav-brand-name">MentorBridge</span>
        </Link>
        <div className="nav-links">
          <Link href="/mentors">Mentors</Link>
          <Link href="/scholarships">Scholarships</Link>
          <Link href="/stories">Stories</Link>
          <Link href="/career-paths">Career Paths</Link>
          <Link href="/survival-sim">Survival Sim</Link>
          <Link href="/market-insights">Market Data</Link>
          <Link href="/roi-matrix">ROI Matrix</Link>
        </div>

        <div className="nav-actions">
          <Link href="/login" className="btn btn-ghost btn-sm">Log in</Link>
          <Link href="/signup" className="btn btn-primary btn-sm">Sign up →</Link>
        </div>
      </nav>

      <section style={{position:'relative', zIndex:1}}>
        <div className="hero">
          <div className="hero-left">
            <div className="hero-badge">
              <div className="hero-badge-dot"></div>
              Now Live · 1,200+ Mentors Worldwide
            </div>
            <h1 className="hero-title">
              <span className="hero-title-plain">Bridge the Gap to</span>
              <span className="hero-title-grad">Global Education</span>
            </h1>
            <p className="hero-sub">
              Connect with mentors who've been where you want to go — top alumni guiding you through admissions, visas, scholarships, and career paths abroad.
            </p>
            <div className="hero-actions">
              <Link href="/mentors" className="btn btn-primary btn-lg">Find Your Mentor <span className="arrow">→</span></Link>
              <Link href="/stories" className="btn btn-ghost btn-lg">See Success Stories</Link>
            </div>
            <div className="hero-social-proof">
              <div className="avatar-stack">
                <div className="av av-1">R</div>
                <div className="av av-2">S</div>
                <div className="av av-3">I</div>
                <div className="av av-4">K</div>
                <div className="av" style={{background:'linear-gradient(135deg,#3a2020,#703030)'}}>A</div>
              </div>
              <p className="social-text"><strong>4,800+ students</strong> matched this year · ⭐ 4.9 avg rating</p>
            </div>
          </div>
          
          <div className="hero-right">
            <div className="hero-glow-ring"></div>
            <div className="hero-card hc-main">
              <div className="hc-avatar av-main">A</div>
              <div className="hc-name">Arjun Mehta</div>
              <div className="hc-role">MS CS @ TU Munich · Ex-Google</div>
              <div className="hc-tags">
                <span className="hc-tag tag-c">Germany</span>
                <span className="hc-tag tag-t">APS Process</span>
                <span className="hc-tag tag-v">SOP Review</span>
              </div>
              <div className="hc-stars">
                <span className="stars">★★★★★</span>
                <span className="hc-rating">4.97 · 143 sessions</span>
              </div>
              <Link href="/mentors" className="hc-btn mt-4 block">Request Mentorship</Link>
            </div>
            <div className="hero-card hc-match">
              <div className="match-label">Match Score</div>
              <div className="match-score-row">
                <span className="match-score">94</span>
                <span className="match-pct">%</span>
              </div>
              <div className="match-bar"><div className="match-fill"></div></div>
              <div className="match-sub">Great fit based on your profile</div>
            </div>
            <div className="hero-card hc-notif">
              <div className="notif-icon">🎓</div>
              <div>
                <div className="notif-title">Priya got admitted!</div>
                <div className="notif-sub">TU Berlin · MS Data Science</div>
              </div>
            </div>
            <div className="hero-card hc-stats">
              <div className="hc-stat"><div className="hs-val c">1,200+</div><div className="hs-lab">Active Mentors</div></div>
              <div className="hc-stat"><div className="hs-val t">38</div><div className="hs-lab">Countries</div></div>
              <div className="hc-stat"><div className="hs-val v">92%</div><div className="hs-lab">Admit Rate</div></div>
            </div>
          </div>
        </div>
      </section>

      <div className="ticker">
        <div className="ticker-inner">
          {[
            {dot:'var(--teal)', text:'Product Manager · India', val:'+25% demand', cls:'green'},
            {dot:'var(--cyan)', text:'Germany APS Approvals', val:'↑ 18% this year', cls:'cyan'},
            {dot:'var(--gold)', text:'TU Munich CGPA cutoff', val:'7.5 / 10.0', cls:'gold'},
            {dot:'var(--violet)', text:'US STEM OPT Extensions', val:'3 years available', cls:'violet'},
            {dot:'var(--teal)', text:'Avg. ROI Breakeven Germany', val:'1.8 years', cls:'green'},
            {dot:'var(--cyan)', text:'Canada PR Pathways', val:'Express Entry 490+ pts', cls:'cyan'},
            {dot:'var(--gold)', text:'Fully Funded Scholarships', val:'340 open now', cls:'gold'},
            {dot:'var(--violet)', text:'UK Graduate Visa', val:'2-year post-study work', cls:'violet'},
          ].concat([
            {dot:'var(--teal)', text:'Product Manager · India', val:'+25% demand', cls:'green'},
            {dot:'var(--cyan)', text:'Germany APS Approvals', val:'↑ 18% this year', cls:'cyan'},
            {dot:'var(--gold)', text:'TU Munich CGPA cutoff', val:'7.5 / 10.0', cls:'gold'},
            {dot:'var(--violet)', text:'US STEM OPT Extensions', val:'3 years available', cls:'violet'},
            {dot:'var(--teal)', text:'Avg. ROI Breakeven Germany', val:'1.8 years', cls:'green'},
            {dot:'var(--cyan)', text:'Canada PR Pathways', val:'Express Entry 490+ pts', cls:'cyan'},
            {dot:'var(--gold)', text:'Fully Funded Scholarships', val:'340 open now', cls:'gold'},
            {dot:'var(--violet)', text:'UK Graduate Visa', val:'2-year post-study work', cls:'violet'},
          ]).map((item, i) => (
            <span className="ticker-item" key={i}>
              <span className="dot" style={{background: item.dot}}></span>
              {item.text} <span className={`val ${item.cls}`}>{item.val}</span>
            </span>
          ))}
        </div>
      </div>

      <div className="stats-section">
        <div className="stats-grid">
          <div className="stat-box reveal d1">
            <div className="stat-num" style={{color:'var(--cyan)'}}>4,800+</div>
            <div className="stat-label">Students Mentored</div>
            <div className="stat-note sn-c">↑ 62% this year</div>
          </div>
          <div className="stat-box reveal d2">
            <div className="stat-num" style={{color:'var(--teal)'}}>92%</div>
            <div className="stat-label">Admission Success Rate</div>
            <div className="stat-note sn-t">Top-tier programs</div>
          </div>
          <div className="stat-box reveal d3">
            <div className="stat-num" style={{color:'var(--violet)'}}>1,200+</div>
            <div className="stat-label">Verified Mentors</div>
            <div className="stat-note sn-v">38 countries</div>
          </div>
          <div className="stat-box reveal d4">
            <div className="stat-num" style={{color:'var(--gold)'}}>$2.4M</div>
            <div className="stat-label">Scholarships Secured</div>
            <div className="stat-note sn-g">By our students</div>
          </div>
        </div>
      </div>
      <div className="sep"></div>

      <section className="section">
        <div className="section-head-row">
          <div>
            <div className="section-eyebrow ey-t reveal">The Process</div>
            <h2 className="section-title reveal">How MentorBridge Works</h2>
            <p className="section-sub reveal">From confused applicant to confident admit — in four steps.</p>
          </div>
        </div>
        <div className="steps-grid">
          <div className="step-card reveal d1">
            <div className="step-num sn1">01</div>
            <div className="step-title">Build Your Profile</div>
            <p className="step-desc">Tell us your academic background, target country, program, and goals. Our system builds your smart profile in minutes.</p>
          </div>
          <div className="step-card reveal d2">
            <div className="step-num sn2">02</div>
            <div className="step-title">Get Matched</div>
            <p className="step-desc">Our AI match engine scores 1,200+ mentors against your profile. See compatibility scores, response times, and real outcomes.</p>
          </div>
          <div className="step-card reveal d3">
            <div className="step-num sn3">03</div>
            <div className="step-title">Book a Session</div>
            <p className="step-desc">Schedule 1-on-1 video calls, get SOP reviews, APS guidance, scholarship strategies — all in one place, on your timeline.</p>
          </div>
        </div>
      </section>
      <div className="sep"></div>

      <section className="section">
        <div className="section-head-row">
          <div>
            <div className="section-eyebrow ey-c reveal">Platform Tools</div>
            <h2 className="section-title reveal">Everything You Need <br/>in One Dashboard</h2>
          </div>
          <p className="section-sub reveal" style={{textAlign:'right', maxWidth:'340px'}}>Data-driven tools that give you an unfair advantage in the admissions process.</p>
        </div>
        <div className="bento-grid">
          <Link href="/roi-matrix" className="bento-card bc-1 reveal">
            <div className="bento-icon bi-g">📊</div>
            <div className="bento-title">ROI Matrix</div>
            <p className="bento-desc">See the exact return on your education investment. Compare tuition, salary, and breakeven across programs and countries.</p>
            <div className="bento-visual">
              <div className="roi-rows">
                <div className="roi-row"><span className="roi-label">Germany MS</span><div className="roi-bar-bg"><div className="roi-bar-fill rb-c" style={{width:'90%'}}></div></div><span className="roi-val" style={{color:'var(--cyan)'}}>1.5y</span></div>
                <div className="roi-row"><span className="roi-label">US MS</span><div className="roi-bar-bg"><div className="roi-bar-fill rb-t" style={{width:'68%'}}></div></div><span className="roi-val" style={{color:'var(--teal)'}}>2.3y</span></div>
                <div className="roi-row"><span className="roi-label">UK MSc</span><div className="roi-bar-bg"><div className="roi-bar-fill rb-v" style={{width:'54%'}}></div></div><span className="roi-val" style={{color:'var(--violet)'}}>2.8y</span></div>
              </div>
            </div>
          </Link>

          <Link href="/market-insights" className="bento-card bc-2 reveal d1">
            <div className="bento-icon bi-c">🌍</div>
            <div className="bento-title">38-Country Career Intelligence</div>
            <p className="bento-desc">Real-time salary distributions, visa timelines, job demand trends, and cultural survival guides — for every major study destination.</p>
            <div className="country-list">
              {['🇩🇪 Germany','🇺🇸 USA','🇨🇦 Canada','🇬🇧 UK','🇦🇺 Australia','🇸🇬 Singapore','🇳🇱 Netherlands','+31 More'].map((c,i) => (
                <div className="c-chip" key={i}><span className="flag">{c.split(' ')[0]}</span> {c.split(' ').slice(1).join(' ')}</div>
              ))}
            </div>
          </Link>

          <Link href="/mentors" className="bento-card bc-3 reveal">
            <div className="bento-icon bi-t">🧠</div>
            <div className="bento-title">SmartMatch AI</div>
            <p className="bento-desc">Scores every mentor against your profile for compatibility, past outcomes, and response speed.</p>
          </Link>

          <Link href="/survival-sim" className="bento-card bc-4 reveal d1">
            <div className="bento-icon bi-v">🎮</div>
            <div className="bento-title">Survival Simulator</div>
            <p className="bento-desc">Simulate life abroad — budgets, housing, part-time work — before you commit to anything.</p>
          </Link>

          <Link href="/roadmap" className="bento-card bc-5 reveal d2">
            <div className="bento-icon bi-r">🗺️</div>
            <div className="bento-title">Roadmap Builder</div>
            <p className="bento-desc">Month-by-month plan from now until your admit. Never miss a deadline again.</p>
          </Link>
        </div>
      </section>
      <div className="sep"></div>

      <section className="section">
        <div className="section-head-row">
          <div>
            <div className="section-eyebrow ey-v reveal">Expert Guides</div>
            <h2 className="section-title reveal">Meet Your Potential Mentors</h2>
            <p className="section-sub reveal">All mentors are verified alumni with real admission outcomes.</p>
          </div>
          <Link href="/mentors" className="btn btn-outline btn-md reveal">Browse All Mentors →</Link>
        </div>
        <div className="mentors-grid">
          {[
            { init:'A', av:'mav1', badge:'mb-gold', badgeTxt:'⭐ Top Mentor', name:'Arjun Mehta', role:'MS CS · TU Munich', flag:'🇩🇪', country:'Germany · 3 yrs experience', tags:[{t:'tag-c',l:'APS Process'},{t:'tag-t',l:'SOP Writing'},{t:'tag-v',l:'Visa'}], s1:{v:'143',c:'var(--cyan)',l:'Sessions'}, s2:{v:'4.97',c:'var(--gold)',l:'Rating'}, s3:{v:'96%',c:'var(--teal)',l:'Admit Rate'} },
            { init:'S', av:'mav2', badge:'mb-blue', badgeTxt:'🎓 Verified', name:'Sneha Kapoor', role:'MSc Business Analytics · U of Manchester', flag:'🇬🇧', country:'United Kingdom · 2 yrs experience', tags:[{t:'tag-t',l:'SOP Structure'},{t:'tag-g',l:'Scholarship'},{t:'tag-v',l:'LOR'}], s1:{v:'87',c:'var(--cyan)',l:'Sessions'}, s2:{v:'4.93',c:'var(--gold)',l:'Rating'}, s3:{v:'89%',c:'var(--teal)',l:'Admit Rate'} },
            { init:'I', av:'mav3', badge:'mb-gold', badgeTxt:'⭐ Top Mentor', name:'Imran Sheikh', role:'MS Economics · U of Waterloo', flag:'🇨🇦', country:'Canada · 4 yrs experience', tags:[{t:'tag-c',l:'Funding'},{t:'tag-v',l:'Budgeting'},{t:'tag-t',l:'PR Pathway'}], s1:{v:'201',c:'var(--cyan)',l:'Sessions'}, s2:{v:'4.95',c:'var(--gold)',l:'Rating'}, s3:{v:'94%',c:'var(--teal)',l:'Admit Rate'} },
          ].map((m, i) => (
            <div className={`mentor-card reveal d${i+1}`} key={i}>
              <div className="mentor-card-header">
                <div className={`mentor-av ${m.av}`}>{m.init}</div>
                <span className={`mentor-badge ${m.badge}`}>{m.badgeTxt}</span>
              </div>
              <div className="mentor-name">{m.name}</div>
              <div className="mentor-role">{m.role}</div>
              <div className="mentor-country"><span>{m.flag}</span> {m.country}</div>
              <div className="mentor-tags">{m.tags.map((tg,j) => <span key={j} className={`hc-tag ${tg.t}`}>{tg.l}</span>)}</div>
              <div className="mentor-stats-row">
                <div className="mstat"><div className="mstat-val" style={{color:m.s1.c}}>{m.s1.v}</div><div className="mstat-lab">{m.s1.l}</div></div>
                <div className="mstat"><div className="mstat-val" style={{color:m.s2.c}}>{m.s2.v}</div><div className="mstat-lab">{m.s2.l}</div></div>
                <div className="mstat"><div className="mstat-val" style={{color:m.s3.c}}>{m.s3.v}</div><div className="mstat-lab">{m.s3.l}</div></div>
              </div>
              <Link href="/mentors" className="mentor-cta mt-4">Connect with {m.name.split(' ')[0]} →</Link>
            </div>
          ))}
        </div>
      </section>
      <div className="sep"></div>

      <section className="section">
        <div className="section-head-row">
          <div>
            <div className="section-eyebrow ey-g reveal">Real Outcomes</div>
            <h2 className="section-title reveal">Success Stories</h2>
            <p className="section-sub reveal">Real students. Real mentors. Real admits.</p>
          </div>
          <Link href="/stories" className="btn btn-outline btn-md reveal">Read All Stories →</Link>
        </div>
        <div className="stories-grid">
          {[
            { init:'R', bg:'linear-gradient(135deg,#1a3a5c,#2a6090)', color:'var(--cyan)', name:'Rohit', dest:'🇩🇪 Germany · MS Computer Science', admit:'Admitted TU Berlin', quote:'"I was confused about German public universities. My mentor helped me understand which programs matched my profile perfectly — and I got in."', tags:['Shortlisting','Profile Evaluation'] },
            { init:'P', bg:'linear-gradient(135deg,#3a1f5c,#6b3a9c)', color:'var(--violet)', name:'Panchi', dest:'🇺🇸 USA · MS Data Science', admit:'Admitted NYU', quote:'"My mentor broke everything down honestly and helped me focus on the right programs. I got into NYU on my first application cycle."', tags:['GRE Strategy','SOP Review'] },
            { init:'I', bg:'linear-gradient(135deg,#1f4a3a,#2d7a5c)', color:'var(--teal)', name:'Imran', dest:'🇨🇦 Canada · MS Economics', admit:'Secured Full Funding', quote:'"MentorBridge helped me understand realistic costs and funding options in Canada. I graduated debt-free with full scholarship support."', tags:['Funding Options','Budgeting'] },
          ].map((s, i) => (
            <div className={`story-card reveal d${i+1}`} key={i}>
              <div className="story-header">
                <div className="story-person">
                  <div className="story-av" style={{background:s.bg, color:s.color}}>{s.init}</div>
                  <div><div className="story-name">{s.name}</div><div className="story-dest">{s.dest}</div></div>
                </div>
                <span className="story-admit">{s.admit}</span>
              </div>
              <p className="story-quote">{s.quote}</p>
              <div className="story-tags">{s.tags.map((t,j) => <span key={j} className="story-tag">{t}</span>)}</div>
            </div>
          ))}
        </div>
      </section>

      <div className="cta-section">
        <div className="cta-box reveal">
          <div className="section-eyebrow ey-c" style={{display:'inline-flex', marginBottom:'22px'}}>Your Journey Starts Here</div>
          <h2 className="cta-title">Ready to Bridge the Gap?</h2>
          <p className="cta-sub">Join thousands of students who turned their study abroad dream into reality — with the right mentor by their side.</p>
          <div className="cta-actions">
            <Link href="/mentors" className="btn btn-primary btn-lg">Find My Mentor <span className="arrow">→</span></Link>
            <Link href="/mentors" className="btn btn-ghost btn-lg">Browse Mentors</Link>
          </div>
          <p className="cta-note">Free to browse · No credit card required · Match in under 2 minutes</p>
        </div>
      </div>

      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-top">
            <div className="footer-brand">
              <div className="footer-brand-row">
                <div className="footer-brand-icon">
                  <Triangle size={16} fill="currentColor" strokeWidth={2} className="rotate-180" />
                </div>
                <span className="footer-brand-name">MentorBridge</span>
              </div>
              <p className="footer-tagline">Connecting ambitious students with mentors who've walked the path. From India to the world.</p>
            </div>
            <div className="footer-col">
              <div className="footer-col-title">Platform</div>
              <Link href="/mentors">Find Mentors</Link>
              <Link href="/scholarships">Scholarships</Link>
              <Link href="/career-paths">Career Paths</Link>
              <Link href="/market-insights">Market Data</Link>
              <Link href="/roi-matrix">ROI Matrix</Link>
            </div>
            <div className="footer-col">
              <div className="footer-col-title">Tools</div>
              <Link href="/survival-sim">Survival Sim</Link>
              {/* Cost Calculator Successfully Removed */}
              <Link href="/roadmap">Roadmap</Link>
              <Link href="/mentors">SmartMatch</Link>
            </div>
            <div className="footer-col">
              <div className="footer-col-title">Company</div>
              {/* Added link to Team Page */}
              <Link href="/team">Meet the Builders</Link> 
              <Link href="/stories">Success Stories</Link>
              <Link href="#">For Mentors</Link>
              <Link href="#">Contact</Link>
            </div>
          </div>
          <div className="footer-bottom">
            <span className="footer-copy">© 2026 MentorBridge. Built for ambitious students everywhere.</span>
            <div className="footer-legal">
              {/* Added links to Legal and Terms pages */}
              <Link href="/legal">Privacy Policy</Link>
              <Link href="/terms">Terms & Conditions</Link>
              <Link href="/legal">Cookie Policy</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}