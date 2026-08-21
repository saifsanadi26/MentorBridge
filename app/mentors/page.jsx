// File: app/mentors/page.jsx
'use client'

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// ═══════════════════════════════════════════════════
//   DATA
// ═══════════════════════════════════════════════════
const MENTORS = [
  { id:"mentor_01", name:"Aarav Mehta",     role:"MS CS",              uni:"TU Munich",            country:"Germany",   flag:"🇩🇪", tier:"Elite",    match:94, img:"https://randomuser.me/api/portraits/men/11.jpg",    hex:"#00E5A8", rgb:"0,229,168",    tags:["DAAD Scholar","CS","APS Process","Public Unis"],         bio:"I help students realistically shortlist German public universities. I've been through the APS route, received Deutschlandstipendium funding, and landed a research HiWi at TU Munich.",      sessions:12 },
  { id:"mentor_02", name:"Ritika Sharma",   role:"MS Data Science",    uni:"Arizona State",        country:"USA",       flag:"🇺🇸", tier:"Verified", match:79, img:"https://randomuser.me/api/portraits/women/55.jpg",  hex:"#FFB800", rgb:"255,184,0",    tags:["Data Science","GRE Strategy","SOP Review","Top 2%"],     bio:"I guide students on US admissions and GRE strategy. Top 2% admit at ASU Data Science. I've helped 20+ students with SOP narratives and university shortlisting.",                          sessions:8  },
  { id:"mentor_03", name:"Kunal Verma",     role:"MS AI",              uni:"University of Toronto",country:"Canada",    flag:"🇨🇦", tier:"Elite",    match:88, img:"https://randomuser.me/api/portraits/men/32.jpg",    hex:"#8B7FFF", rgb:"139,127,255",  tags:["AI / ML","Research Profile","IIT Delhi","LoR Strategy"], bio:"Focused on research-oriented AI programs and academic profile building. IIT Delhi background. I help with research proposals, LoR strategy and getting into top AI labs in Canada.",       sessions:15 },
  { id:"mentor_04", name:"Maanya",          role:"MS Business Analytics", uni:"Manchester",        country:"UK",        flag:"🇬🇧", tier:"Verified", match:76, img:"https://randomuser.me/api/portraits/women/31.jpg",  hex:"#00D4FF", rgb:"0,212,255",    tags:["Analytics","SOP Craft","95% Scholar","UK Programs"],     bio:"I help students craft strong SOPs and select analytics programs in the UK. Secured 95% merit scholarship. I'll help you find programs that balance rankings with employability.",           sessions:6  },
  { id:"mentor_05", name:"Siddharth Jain",  role:"MS Mechanical Eng",  uni:"RWTH Aachen",          country:"Germany",   flag:"🇩🇪", tier:"Elite",    match:91, img:"https://randomuser.me/api/portraits/men/41.jpg",    hex:"#00E5A8", rgb:"0,229,168",    tags:["APS Expert","Mechanical","Gold Medalist","Germany"],      bio:"I guide mechanical engineering students through German applications and the APS process. RWTH Aachen is highly competitive — I'll show you exactly what profile gets you in.",             sessions:18 },
  { id:"mentor_06", name:"Ananya Iyer",     role:"MS Software Eng",    uni:"Northeastern",         country:"USA",       flag:"🇺🇸", tier:"Verified", match:83, img:"https://randomuser.me/api/portraits/women/24.jpg",  hex:"#FFB800", rgb:"255,184,0",    tags:["Software Eng","Co-op Programs","Amazon","Job Hunt"],      bio:"I help students understand co-op programs and industry-focused US degrees. Placed at Amazon after my co-op. I'll show you how to pick schools that actually place you.",                  sessions:9  },
  { id:"mentor_07", name:"Rohan Patel",     role:"MS CS",              uni:"Trinity Dublin",       country:"Ireland",   flag:"🇮🇪", tier:"Elite",    match:82, img:"https://randomuser.me/api/portraits/men/86.jpg",    hex:"#FF5E8A", rgb:"255,94,138",   tags:["Ireland","EU Jobs","Visa Guidance","Stripe Network"],     bio:"I guide students interested in studying and working in Ireland and the EU tech market. TCD is a launchpad into European Big Tech. I'll help you build a realistic path to roles like mine.", sessions:11 },
  { id:"mentor_08", name:"Priya Malhotra",  role:"MS Info Systems",    uni:"U of Melbourne",       country:"Australia", flag:"🇦🇺", tier:"Verified", match:77, img:"https://randomuser.me/api/portraits/women/88.jpg",  hex:"#00D4FF", rgb:"0,212,255",    tags:["Australia","IT","PR Points","Visa Strategy"],             bio:"I help students plan Australian education with clarity on visas and job pathways. I'll show you how to calculate your PR points and which degrees maximise your chances.",                  sessions:7  },
  { id:"mentor_09", name:"Mohit Aggarwal",  role:"MS Data Engineering", uni:"TU Berlin",           country:"Germany",   flag:"🇩🇪", tier:"Verified", match:85, img:"https://randomuser.me/api/portraits/men/64.jpg",    hex:"#00E5A8", rgb:"0,229,168",    tags:["Data Engineering","Public Unis","Work Ex","Germany"],     bio:"Focused on data engineering programs in Germany and public university admissions. I help students with 1–3 years work experience navigate realistic German MS pathways.",                  sessions:10 },
  { id:"mentor_10", name:"Simran Kaur",     role:"MS Marketing",       uni:"University of Leeds",  country:"UK",        flag:"🇬🇧", tier:"Verified", match:74, img:"https://randomuser.me/api/portraits/women/62.jpg",  hex:"#00D4FF", rgb:"0,212,255",    tags:["Marketing","Portfolio Review","Scholarships","UK"],       bio:"I guide students applying to marketing and management programs in the UK. I'll help you build a strong portfolio and translate your profile into a compelling UK application.",              sessions:5  },
  { id:"mentor_11", name:"Aditya Rao",      role:"MS Business Analytics", uni:"UT Dallas",         country:"USA",       flag:"🇺🇸", tier:"Elite",    match:86, img:"https://randomuser.me/api/portraits/men/53.jpg",    hex:"#FFB800", rgb:"255,184,0",    tags:["Analytics","STEM OPT","Supply Chain","USA"],              bio:"Helping students choose analytics programs with strong career outcomes. I know exactly which programs have strong STEM OPT placement records and supply-chain industry connections.",         sessions:14 },
  { id:"mentor_12", name:"Sneha Banerjee",  role:"MA Economics",       uni:"UBC Vancouver",        country:"Canada",    flag:"🇨🇦", tier:"Verified", match:72, img:"https://randomuser.me/api/portraits/women/4.jpg",   hex:"#8B7FFF", rgb:"139,127,255",  tags:["Economics","Funding","Research Proposal","Canada"],       bio:"I help economics students plan admissions and funding in Canada. Secured full International Tuition Award at UBC. Research proposal writing is often the key — I'll help you nail it.",     sessions:4  },
  { id:"mentor_13", name:"Yash Kulkarni",   role:"MS Robotics",        uni:"KIT Karlsruhe",        country:"Germany",   flag:"🇩🇪", tier:"Verified", match:80, img:"https://randomuser.me/api/portraits/men/36.jpg",    hex:"#00E5A8", rgb:"0,229,168",    tags:["Robotics","Automation","HiWi Research","Germany"],        bio:"Focused on robotics and automation programs in Germany. KIT is THE place for robotics in Germany. I'll help you build the technical SOP that gets you past the initial profile screening.",   sessions:7  },
  { id:"mentor_14", name:"Tanvi Deshpande", role:"MS Finance",         uni:"University of Bristol", country:"UK",       flag:"🇬🇧", tier:"Verified", match:78, img:"https://randomuser.me/api/portraits/women/65.jpg",  hex:"#00D4FF", rgb:"0,212,255",    tags:["Finance","CFA L1","Think Big Scholar","UK Banking"],      bio:"I guide finance applicants with strong SOP and profile alignment. CFA L1 + B.Com background. I specialize in getting students into UK Finance MSc programs that lead to banking roles.",     sessions:6  },
  { id:"mentor_15", name:"Naveen Reddy",    role:"MS Cyber Security",  uni:"Monash University",    country:"Australia", flag:"🇦🇺", tier:"Verified", match:75, img:"https://randomuser.me/api/portraits/men/91.jpg",    hex:"#FF5E8A", rgb:"255,94,138",   tags:["Cyber Security","Certifications","Monash Scholar","PR"],  bio:"I help students planning cybersecurity careers in Australia. Monash Intl Leadership Scholar. I'll guide you on which certifications to pursue alongside your degree to land security roles.",  sessions:5  },
];

const COUNTRIES = ['All', ...Array.from(new Set(MENTORS.map(m => m.country)))].sort((a,b) => a==='All'?-1:b==='All'?1:a.localeCompare(b));
const TIERS     = ['All', 'Elite', 'Verified'];

// ═══════════════════════════════════════════════════
//   CSS STYLES
// ═══════════════════════════════════════════════════
const styles = `
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
  .mentors-root {
    --bg:#07090F; --bg2:#0B0E18; --bg3:#0F1219; --bg4:#131720;
    --b:rgba(255,255,255,.065); --bh:rgba(255,255,255,.13);
    --c:#00D4FF; --t:#00E5A8; --v:#8B7FFF; --g:#FFB800; --g2:#FFD84D; --r:#FF5E8A;
    --tx:#E8EAF6; --tx2:#7A7F99; --tx3:#3E4460;
    --ffh:'Syne',sans-serif; --ffb:'DM Sans',sans-serif; --ffm:'JetBrains Mono',monospace;
    background:var(--bg);color:var(--tx);font-family:var(--ffb);-webkit-font-smoothing:antialiased;overflow-x:hidden;min-height:100vh;
  }
  .mentors-root a { text-decoration:none;color:inherit; }
  .mentors-root ::-webkit-scrollbar { width:4px;background:var(--bg); }
  .mentors-root ::-webkit-scrollbar-thumb { background:rgba(255,255,255,.09);border-radius:4px; }

  /* BACKGROUND */
  .bg-wrap{position:fixed;inset:0;z-index:0;pointer-events:none;overflow:hidden}
  .orb{position:absolute;border-radius:50%;filter:blur(130px);animation:orb-drift 22s ease-in-out infinite alternate}
  .o1{width:860px;height:860px;background:radial-gradient(circle,rgba(0,212,255,.08) 0%,transparent 65%);top:-320px;left:-240px}
  .o2{width:640px;height:640px;background:radial-gradient(circle,rgba(139,127,255,.07) 0%,transparent 65%);bottom:-160px;right:-120px;animation-delay:-9s}
  .o3{width:520px;height:520px;background:radial-gradient(circle,rgba(0,229,168,.06) 0%,transparent 65%);top:38%;left:38%;animation-delay:-5s}
  @keyframes orb-drift{0%{transform:translate(0,0)}100%{transform:translate(55px,38px)}}
  .grid-bg{position:fixed;inset:0;z-index:0;pointer-events:none;background:linear-gradient(rgba(255,255,255,.016) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.016) 1px,transparent 1px);background-size:56px 56px;-webkit-mask-image:radial-gradient(ellipse 80% 70% at 50% 0%,black 20%,transparent 100%)}
  .noise{position:fixed;inset:0;z-index:0;pointer-events:none;opacity:.022;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")}

  /* NAVIGATION */
  .nav{position:fixed;top:0;left:0;right:0;z-index:900;height:62px;background:rgba(7,9,15,.85);backdrop-filter:blur(24px);border-bottom:1px solid var(--b);display:flex;align-items:center;padding:0 44px;gap:0;}
  .brand{display:flex;align-items:center;gap:9px;margin-right:36px}
  .brand-ico{width:32px;height:32px;border-radius:9px;flex-shrink:0;background:linear-gradient(135deg,#0B1A1F 0%,#0D2228 100%);border:1px solid rgba(0,212,255,.3);display:flex;align-items:center;justify-content:center;box-shadow:0 0 16px rgba(0,212,255,.2);}
  .brand-ico svg{display:block}
  .brand-name{font-family:var(--ffh);font-size:16px;font-weight:700;letter-spacing:-.02em;background:linear-gradient(135deg,#fff 30%,var(--c));-webkit-background-clip:text;-webkit-text-fill-color:transparent;}
  .nav-links{display:flex;align-items:center;gap:2px;flex:1;justify-content:center}
  .nav-links a{font-size:13px;color:var(--tx2);padding:6px 12px;border-radius:8px;transition:all .18s;font-weight:500}
  .nav-links a:hover{color:var(--tx);background:rgba(255,255,255,.05)}
  .nav-links a.active{color:var(--c);background:rgba(0,212,255,.07)}
  .nav-end{display:flex;gap:8px}
  .btn{display:inline-flex;align-items:center;justify-content:center;gap:6px;border-radius:10px;font-family:var(--ffb);font-weight:500;cursor:pointer;transition:all .2s;border:none;font-size:13.5px;padding:8px 17px}
  .btn-ghost{background:transparent;border:1px solid var(--bh);color:var(--tx)}
  .btn-ghost:hover{border-color:rgba(255,255,255,.24);background:rgba(255,255,255,.05)}
  .btn-primary{background:linear-gradient(135deg,var(--c),var(--v));color:#050C12;font-weight:700;box-shadow:0 0 22px rgba(0,212,255,.28)}
  .btn-primary:hover{box-shadow:0 0 36px rgba(0,212,255,.5);transform:translateY(-1px)}

  /* PAGE LAYOUT */
  .page{max-width:1280px;margin:0 auto;padding:96px 44px 96px;position:relative;z-index:1}

  /* HERO HEADER */
  .hero{margin-bottom:44px;animation:up .65s ease both}
  .eyebrow{display:inline-flex;align-items:center;gap:8px;font-family:var(--ffm);font-size:10.5px;letter-spacing:.16em;text-transform:uppercase;padding:5px 13px;border-radius:30px;margin-bottom:18px;color:var(--c);background:rgba(0,212,255,.07);border:1px solid rgba(0,212,255,.2);}
  .ey-dot{width:6px;height:6px;border-radius:50%;background:var(--t);box-shadow:0 0 7px var(--t);animation:blink 2s infinite}
  @keyframes blink{0%,100%{opacity:1}50%{opacity:.2}}
  .page-title{font-family:var(--ffh);font-size:clamp(36px,4.8vw,62px);font-weight:800;letter-spacing:-.04em;line-height:1.04;margin-bottom:16px}
  .grad-text{background:linear-gradient(135deg,var(--c) 0%,var(--v) 60%,var(--t) 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
  .page-sub{font-size:15.5px;color:var(--tx2);line-height:1.72;max-width:520px}

  /* STATS ROW */
  .stats-row{display:flex;gap:12px;margin-bottom:44px;flex-wrap:wrap;animation:up .65s .08s ease both}
  .stat-pill{display:flex;align-items:center;gap:14px;background:var(--bg2);border:1px solid var(--b);border-radius:14px;padding:14px 20px;transition:all .22s;flex:1;min-width:180px;}
  .stat-pill:hover{border-color:var(--bh);transform:translateY(-2px)}
  .sp-ico{font-size:24px;flex-shrink:0}
  .sp-num{font-family:var(--ffh);font-size:24px;font-weight:800;line-height:1}
  .sp-lab{font-family:var(--ffm);font-size:8.5px;letter-spacing:.14em;text-transform:uppercase;color:var(--tx3);margin-top:4px}

  /* CONTROLS / FILTERS — Sticky */
  .controls{position:sticky;top:62px;z-index:200;background:rgba(7,9,15,.94);backdrop-filter:blur(20px);border-bottom:1px solid var(--b);padding:14px 0;margin-bottom:28px;animation:up .65s .16s ease both;}
  .search-row{display:flex;gap:11px;margin-bottom:14px}
  .search-box{flex:1;position:relative}
  .s-ico{position:absolute;left:14px;top:50%;transform:translateY(-50%);font-size:14px;color:var(--tx3);pointer-events:none}
  .s-input{width:100%;background:var(--bg2);border:1px solid var(--b);color:var(--tx);font-family:var(--ffb);font-size:13.5px;padding:11px 14px 11px 40px;border-radius:12px;outline:none;transition:all .2s;}
  .s-input::placeholder{color:var(--tx3)}
  .s-input:focus{border-color:rgba(0,212,255,.45);box-shadow:0 0 0 3px rgba(0,212,255,.07)}
  .sort-sel{background:var(--bg2);border:1px solid var(--b);color:var(--tx);font-family:var(--ffb);font-size:13px;padding:11px 14px;border-radius:12px;outline:none;cursor:pointer;min-width:190px;transition:border-color .2s;}
  .sort-sel:focus{border-color:rgba(0,212,255,.4)}
  .filter-row{display:flex;align-items:center;gap:7px;flex-wrap:wrap}
  .f-label{font-family:var(--ffm);font-size:9px;letter-spacing:.14em;text-transform:uppercase;color:var(--tx3);flex-shrink:0}
  .chip{background:var(--bg2);border:1px solid var(--b);color:var(--tx2);font-family:var(--ffb);font-size:12.5px;font-weight:500;padding:5px 13px;border-radius:25px;cursor:pointer;transition:all .18s;}
  .chip:hover{border-color:var(--bh);color:var(--tx)}
  .chip.on{background:rgba(0,212,255,.1);border-color:rgba(0,212,255,.38);color:var(--c)}
  .chip.tier-elite.on{background:rgba(255,184,0,.1);border-color:rgba(255,184,0,.38);color:var(--g)}
  .f-sep{width:1px;height:16px;background:var(--b);margin:0 2px;flex-shrink:0}

  /* META ROW */
  .meta-row{display:flex;align-items:center;justify-content:space-between;margin-bottom:18px}
  .meta-txt{font-family:var(--ffm);font-size:11px;color:var(--tx2)}
  .meta-txt b{color:var(--tx);font-weight:600}

  /* MENTOR GRID */
  .mentor-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:18px}
  @media(max-width:1040px){.mentor-grid{grid-template-columns:repeat(2,1fr)}}
  @media(max-width:660px){.mentor-grid{grid-template-columns:1fr}}

  /* MENTOR CARD */
  .mc{background:var(--bg2);border:1px solid var(--b);border-radius:16px;overflow:hidden;display:flex;flex-direction:column;transition:transform .28s, box-shadow .28s, border-color .28s;position:relative;opacity:0;animation:up .52s ease forwards;}
  .mc:hover{transform:translateY(-6px);box-shadow:0 32px 72px rgba(0,0,0,.55), 0 0 0 1px var(--mc-color, rgba(0,212,255,.3));border-color:var(--mc-color, rgba(0,212,255,.3));}
  .mc::before{content:'';position:absolute;inset:0;background:linear-gradient(135deg,rgba(255,255,255,.016) 0%,transparent 55%);pointer-events:none;border-radius:16px}
  .mc-stripe{height:3px;flex-shrink:0}
  .mc-head{padding:18px 20px 16px;border-bottom:1px solid var(--b);display:grid;grid-template-columns:60px 1fr 54px;align-items:center;gap:14px;position:relative;}
  .mc-head::before{content:'';position:absolute;inset:0;background:linear-gradient(135deg,var(--mc-bg,rgba(0,212,255,.04)) 0%,transparent 55%);pointer-events:none;}
  .mc-photo{width:60px;height:60px;border-radius:14px;overflow:hidden;flex-shrink:0;border:2px solid var(--mc-color, rgba(0,212,255,.3));box-shadow:0 0 0 4px var(--mc-shadow, rgba(0,212,255,.08));position:relative;z-index:1;}
  .mc-photo img{width:100%;height:100%;object-fit:cover;display:block}
  .mc-info{position:relative;z-index:1;min-width:0}
  .mc-name{font-family:var(--ffh);font-size:16px;font-weight:700;letter-spacing:-.02em;line-height:1.25;margin-bottom:3px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  .mc-sub{font-size:11.5px;color:var(--tx2);margin-bottom:8px;line-height:1.4;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  .mc-badges{display:flex;align-items:center;gap:6px;flex-wrap:wrap}
  .tier-badge{font-family:var(--ffm);font-size:9px;padding:2px 8px;border-radius:20px;font-weight:600;letter-spacing:.06em;white-space:nowrap}
  .tier-elite{background:rgba(255,184,0,.12);color:var(--g);border:1px solid rgba(255,184,0,.28)}
  .tier-verified{background:rgba(0,229,168,.1);color:var(--t);border:1px solid rgba(0,229,168,.25)}
  .country-chip{font-family:var(--ffm);font-size:9px;padding:2px 7px;border-radius:20px;background:rgba(255,255,255,.04);border:1px solid var(--b);color:var(--tx2)}
  .mc-ring{position:relative;z-index:1;display:flex;flex-direction:column;align-items:center;gap:3px;flex-shrink:0}
  .ring-label{font-family:var(--ffm);font-size:7.5px;letter-spacing:.1em;text-transform:uppercase;color:var(--tx3)}
  .mc-body{padding:14px 20px;flex:1;display:flex;flex-direction:column;gap:12px}
  .mc-info-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px}
  .ib{background:var(--bg3);border:1px solid var(--b);border-radius:10px;padding:9px 11px}
  .ib-l{font-family:var(--ffm);font-size:8px;letter-spacing:.13em;text-transform:uppercase;color:var(--tx3);margin-bottom:4px}
  .ib-v{font-size:13px;font-weight:600;color:var(--tx);line-height:1.2}
  .tags-lbl{font-family:var(--ffm);font-size:8px;letter-spacing:.13em;text-transform:uppercase;color:var(--tx3);margin-bottom:6px}
  .tags{display:flex;flex-wrap:wrap;gap:5px}
  .tag{font-family:var(--ffm);font-size:9.5px;padding:3px 9px;border-radius:20px;background:rgba(255,255,255,.025);border:1px solid var(--b);color:var(--tx2);transition:all .18s;}
  .tag:hover{border-color:var(--bh);color:var(--tx)}
  .bio-box{background:rgba(255,255,255,.016);border:1px solid var(--b);border-radius:10px;padding:11px 13px;flex:1}
  .bio-lbl{font-family:var(--ffm);font-size:8px;letter-spacing:.13em;text-transform:uppercase;color:var(--tx3);margin-bottom:6px}
  .bio-txt{font-size:12px;color:var(--tx2);line-height:1.6;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden;font-style:italic}
  .mc-foot{padding:12px 18px;border-top:1px solid var(--b);display:flex;gap:8px}
  .btn-book{flex:1;padding:10px;text-align:center;border-radius:10px;color:#060A0C;font-size:13px;font-weight:700;cursor:pointer;border:none;font-family:var(--ffb);transition:all .22s;}
  .btn-book:hover{transform:translateY(-1px)}
  .btn-save{width:38px;height:38px;border-radius:10px;flex-shrink:0;background:rgba(255,255,255,.03);border:1px solid var(--b);color:var(--tx2);font-size:16px;display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all .2s;}
  .btn-save:hover,.btn-save.on{border-color:rgba(255,94,138,.4);color:var(--r);background:rgba(255,94,138,.07)}
  .empty{text-align:center;padding:80px 20px;grid-column:span 3}
  .empty-ico{font-size:52px;margin-bottom:16px}
  .empty-t{font-family:var(--ffh);font-size:22px;font-weight:700;margin-bottom:8px}
  .empty-s{font-size:14px;color:var(--tx2)}

  /* FEATURED TOP MENTOR STRIP */
  .feat-strip{background:var(--bg2);border:1px solid rgba(255,184,0,.22);border-radius:18px;overflow:hidden;margin-bottom:32px;position:relative;animation:up .65s .12s ease both;}
  .feat-strip::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse 70% 100% at 0% 50%,rgba(255,184,0,.05),transparent 60%);pointer-events:none}
  .feat-strip::after{content:'';position:absolute;left:0;top:0;bottom:0;width:3px;background:linear-gradient(180deg,var(--g),var(--g2))}
  .feat-topbar{background:linear-gradient(90deg,rgba(255,184,0,.1),transparent);border-bottom:1px solid rgba(255,184,0,.12);padding:8px 24px;display:flex;align-items:center;gap:10px}
  .feat-pulse{width:7px;height:7px;border-radius:50%;background:var(--g);box-shadow:0 0 8px var(--g);animation:blink 1.5s infinite}
  .feat-label{font-family:var(--ffm);font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:var(--g)}
  .feat-body{display:flex;align-items:center;padding:20px 24px 20px 28px;gap:20px;flex-wrap:wrap}
  .feat-photo{width:72px;height:72px;border-radius:16px;overflow:hidden;border:2px solid rgba(255,184,0,.3);box-shadow:0 0 20px rgba(255,184,0,.12);flex-shrink:0}
  .feat-photo img{width:100%;height:100%;object-fit:cover}
  .feat-info{flex:1;min-width:200px}
  .feat-name{font-family:var(--ffh);font-size:20px;font-weight:800;letter-spacing:-.03em;margin-bottom:4px}
  .feat-sub{font-size:13px;color:var(--tx2);margin-bottom:10px}
  .feat-tags{display:flex;gap:6px;flex-wrap:wrap}
  .feat-divider{width:1px;height:64px;background:var(--b);flex-shrink:0}
  .feat-stats{display:flex;flex-direction:column;gap:10px;padding:0 16px;min-width:160px}
  .fsr{display:flex;flex-direction:column;gap:2px}
  .fsr-l{font-family:var(--ffm);font-size:8.5px;letter-spacing:.12em;text-transform:uppercase;color:var(--tx3)}
  .fsr-v{font-size:14px;font-weight:700}
  .feat-cta{display:flex;flex-direction:column;gap:8px;align-items:center;min-width:130px}
  .btn-feat{padding:11px 22px;border-radius:11px;border:none;cursor:pointer;font-family:var(--ffb);font-size:14px;font-weight:700;background:linear-gradient(135deg,var(--g),var(--g2));color:#0A0800;transition:all .2s;box-shadow:0 0 22px rgba(255,184,0,.28);}
  .btn-feat:hover{box-shadow:0 0 36px rgba(255,184,0,.5);transform:translateY(-1px)}
  .feat-cta-note{font-family:var(--ffm);font-size:9.5px;color:var(--tx3);letter-spacing:.06em}

  @keyframes up{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
`;

// ═══════════════════════════════════════════════════
//   MATCH RING COMPONENT
// ═══════════════════════════════════════════════════
const MatchRing = ({ match, color }) => {
  const r = 20;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - match / 100);
  return (
    <svg width="52" height="52" viewBox="0 0 50 50">
      <circle cx="25" cy="25" r="20" fill="none" stroke="rgba(255,255,255,.07)" strokeWidth="3.5"/>
      <circle cx="25" cy="25" r="20" fill="none" stroke={color} strokeWidth="3.5"
        strokeDasharray={circ.toFixed(2)} strokeDashoffset={offset.toFixed(2)}
        strokeLinecap="round" transform="rotate(-90 25 25)"
        style={{filter:`drop-shadow(0 0 4px ${color}60)`}}/>
      <text x="25" y="30" textAnchor="middle"
        fontFamily="Syne,sans-serif" fontSize="12" fontWeight="800"
        fill={color}>{match}</text>
    </svg>
  );
};

export default function MentorsPage() {
  const router = useRouter();

  // AUTH STATE
  const [user, setUser] = useState(null);

  // FILTERS & SORT
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCtry, setFilterCtry] = useState('All');
  const [filterTier, setFilterTier] = useState('All');
  const [sortBy, setSortBy] = useState('match');
  const [saved, setSaved] = useState(new Set());

  useEffect(() => {
    const storedUser = localStorage.getItem('mentorBridgeUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('mentorBridgeUser');
    setUser(null);
    router.push('/login');
  };

  const toggleSave = (id) => {
    setSaved(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const filteredMentors = useMemo(() => {
    let result = [...MENTORS];
    if (filterCtry !== 'All') result = result.filter(m => m.country === filterCtry);
    if (filterTier !== 'All') result = result.filter(m => m.tier === filterTier);
    if (searchTerm.trim()) {
      const s = searchTerm.toLowerCase();
      result = result.filter(m =>
        m.name.toLowerCase().includes(s) ||
        m.country.toLowerCase().includes(s) ||
        m.uni.toLowerCase().includes(s) ||
        m.role.toLowerCase().includes(s) ||
        m.tags.some(t => t.toLowerCase().includes(s))
      );
    }
    if (sortBy === 'match') result.sort((a,b) => b.match - a.match);
    else if (sortBy === 'name') result.sort((a,b) => a.name.localeCompare(b.name));
    else if (sortBy === 'sessions') result.sort((a,b) => b.sessions - a.sessions);
    else if (sortBy === 'country') result.sort((a,b) => a.country.localeCompare(b.country));
    return result;
  }, [searchTerm, filterCtry, filterTier, sortBy]);

  const topMentor = useMemo(() => {
    return [...MENTORS].reduce((a, b) => b.match > a.match ? b : a);
  }, []);

  return (
    <div className="mentors-root">
      <style dangerouslySetInnerHTML={{ __html: styles }} />

      {/* BACKGROUND */}
      <div className="bg-wrap">
        <div className="orb o1"></div>
        <div className="orb o2"></div>
        <div className="orb o3"></div>
      </div>
      <div className="grid-bg"></div>
      <div className="noise"></div>

      {/* NAVIGATION */}
      <nav className="nav">
        <Link href="/" className="brand">
          <div className="brand-ico">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <defs>
                <linearGradient id="lg" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#00D4FF"/>
                  <stop offset="100%" stopColor="#00E5A8"/>
                </linearGradient>
              </defs>
              <path d="M9 14L2 4h14L9 14z" fill="url(#lg)"/>
            </svg>
          </div>
          <span className="brand-name">MentorBridge</span>
        </Link>
        <div className="nav-links">
          <Link href="/mentors" className="active">Mentors</Link>
          <Link href="/scholarships">Scholarships</Link>
          <Link href="/stories">Stories</Link>
          <Link href="/career-paths">Career Paths</Link>
          <Link href="/market-insights">Market Data</Link>
          <Link href="/roi-matrix">ROI Matrix</Link>
        </div>
        <div className="nav-end">
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <span style={{ fontFamily: 'var(--ffh)', fontSize: '15px', fontWeight: '700', color: 'var(--c)', letterSpacing: '-.02em' }}>
                {user.name}
              </span>
              <button className="btn btn-ghost" onClick={handleLogout}>Log out</button>
            </div>
          ) : (
            <>
              <button className="btn btn-ghost" onClick={() => router.push('/login')}>Log in</button>
              <button className="btn btn-primary" onClick={() => router.push('/signup')}>Sign up →</button>
            </>
          )}
        </div>
      </nav>

      <div className="page">
        {/* HERO */}
        <div className="hero">
          <div className="eyebrow">
            <div className="ey-dot"></div>
            <span>{MENTORS.length} Mentors</span> · Verified Network
          </div>
          <h1 className="page-title">Find Your<br/><span className="grad-text">Mentor</span></h1>
          <p className="page-sub">Connect with students who have been exactly where you want to go. Real people, real admits, real guidance — across 6 countries.</p>
        </div>

        {/* STATS */}
        <div className="stats-row">
          <div className="stat-pill">
            <span className="sp-ico">🧑‍🎓</span>
            <div><div className="sp-num" style={{color:'var(--c)'}}>{MENTORS.length}</div><div className="sp-lab">Total Mentors</div></div>
          </div>
          <div className="stat-pill">
            <span className="sp-ico">🌍</span>
            <div><div className="sp-num" style={{color:'var(--t)'}}>{COUNTRIES.length - 1}</div><div className="sp-lab">Countries</div></div>
          </div>
          <div className="stat-pill">
            <span className="sp-ico">⚡</span>
            <div><div className="sp-num" style={{color:'var(--g)'}}>{MENTORS.length}</div><div className="sp-lab">Available Now</div></div>
          </div>
          <div className="stat-pill">
            <span className="sp-ico">✅</span>
            <div><div className="sp-num" style={{color:'var(--v)'}}>100%</div><div className="sp-lab">Verified</div></div>
          </div>
        </div>

        {/* FEATURED MENTOR */}
        <div className="feat-strip">
          <div className="feat-topbar">
            <div className="feat-pulse"></div>
            <span className="feat-label">⭐ Highest Match · Recommended Mentor</span>
          </div>
          <div className="feat-body">
            <div className="feat-photo"><img src={topMentor.img} alt={topMentor.name} /></div>
            <div className="feat-info">
              <div className="feat-name">{topMentor.name}</div>
              <div className="feat-sub">{topMentor.role} · {topMentor.uni} · {topMentor.flag} {topMentor.country}</div>
              <div className="feat-tags">
                {topMentor.tags.slice(0,3).map(t => <span key={t} className="tag">{t}</span>)}
                <span className="tier-badge tier-elite">● ELITE</span>
              </div>
            </div>
            <div className="feat-divider"></div>
            <div className="feat-stats">
              <div className="fsr"><div className="fsr-l">Match Score</div><div className="fsr-v" style={{color: topMentor.hex}}>{topMentor.match}%</div></div>
              <div className="fsr"><div className="fsr-l">Sessions Done</div><div className="fsr-v">{topMentor.sessions}</div></div>
              <div className="fsr"><div className="fsr-l">Status</div><div className="fsr-v" style={{color:'#00E5A8', fontSize:'12px'}}>● Available Now</div></div>
            </div>
            <div className="feat-divider"></div>
            <div className="feat-cta">
              <button className="btn-feat" onClick={() => router.push(`/mentors/${topMentor.id}`)}>Book Session →</button>
              <span className="feat-cta-note">OPENS PROFILE</span>
            </div>
          </div>
        </div>

        {/* CONTROLS */}
        <div className="controls">
          <div className="search-row">
            <div className="search-box">
              <span className="s-ico">🔍</span>
              <input className="s-input" placeholder="Search by name, country, university, expertise..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
            </div>
            <select className="sort-sel" value={sortBy} onChange={e => setSortBy(e.target.value)}>
              <option value="match">Sort: Match Score</option>
              <option value="name">Sort: A → Z</option>
              <option value="sessions">Most Sessions</option>
              <option value="country">By Country</option>
            </select>
          </div>
          <div className="filter-row">
            <span className="f-label">Country:</span>
            {COUNTRIES.map(c => (
              <button key={c} className={`chip ${filterCtry === c ? 'on' : ''}`} onClick={() => setFilterCtry(c)}>{c}</button>
            ))}
            <div className="f-sep"></div>
            <span className="f-label">Tier:</span>
            {TIERS.map(t => (
              <button key={t} className={`chip ${t === 'Elite' ? 'tier-elite' : ''} ${filterTier === t ? 'on' : ''}`} onClick={() => setFilterTier(t)}>{t.toUpperCase()}</button>
            ))}
          </div>
        </div>

        {/* META */}
        <div className="meta-row">
          <span className="meta-txt">Showing <b>{filteredMentors.length}</b> of <b>{MENTORS.length}</b> mentors</span>
        </div>

        {/* GRID */}
        <div className="mentor-grid">
          {filteredMentors.length === 0 ? (
            <div className="empty">
              <div className="empty-ico">🔍</div>
              <div className="empty-t">No mentors found</div>
              <div className="empty-s">Try adjusting your filters or search term</div>
            </div>
          ) : (
            filteredMentors.map((m, i) => {
              const isSaved = saved.has(m.id);
              const delay = i * 0.06;
              return (
                <div key={m.id} className="mc" style={{
                  '--mc-color': `rgba(${m.rgb},.32)`,
                  '--mc-bg': `rgba(${m.rgb},.05)`,
                  '--mc-shadow': `rgba(${m.rgb},.09)`,
                  animationDelay: `${delay}s`
                }}>
                  <div className="mc-stripe" style={{background: `linear-gradient(90deg,${m.hex},rgba(${m.rgb},.25))`}}></div>
                  <div className="mc-head" style={{'--mc-bg': `rgba(${m.rgb},.045)`}}>
                    <div className="mc-photo">
                      <img src={m.img} alt={m.name} loading="lazy" />
                    </div>
                    <div className="mc-info">
                      <div className="mc-name">{m.name}</div>
                      <div className="mc-sub">{m.role} · {m.uni}</div>
                      <div className="mc-badges">
                        {m.tier === 'Elite' ? (
                          <span className="tier-badge tier-elite">● ELITE</span>
                        ) : (
                          <span className="tier-badge tier-verified">✓ VERIFIED</span>
                        )}
                        <span className="country-chip">{m.flag} {m.country}</span>
                      </div>
                    </div>
                    <div className="mc-ring">
                      <MatchRing match={m.match} color={m.hex} />
                      <span className="ring-label">MATCH</span>
                    </div>
                  </div>

                  <div className="mc-body">
                    <div className="mc-info-grid">
                      <div className="ib">
                        <div className="ib-l">Sessions Done</div>
                        <div className="ib-v" style={{fontFamily: 'var(--ffh)', color: m.hex, fontSize: '16px', fontWeight: '800'}}>{m.sessions}</div>
                      </div>
                      <div className="ib">
                        <div className="ib-l">Availability</div>
                        <div className="ib-v" style={{color: '#00E5A8', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '5px'}}>
                          <span style={{width: '6px', height: '6px', borderRadius: '50%', background: '#00E5A8', boxShadow: '0 0 6px #00E5A8', display: 'inline-block', animation: 'blink 2s infinite'}}></span>Open
                        </div>
                      </div>
                    </div>

                    <div className="tags-wrap">
                      <div className="tags-lbl">Expertise</div>
                      <div className="tags">
                        {m.tags.slice(0, 3).map(t => <span key={t} className="tag">{t}</span>)}
                      </div>
                    </div>

                    <div className="bio-box">
                      <div className="bio-lbl">About</div>
                      <div className="bio-txt">{m.bio}</div>
                    </div>
                  </div>

                  <div className="mc-foot">
                    <button className="btn-book" style={{background: `linear-gradient(135deg,${m.hex},rgba(${m.rgb},.65))`}} onClick={() => router.push(`/mentors/${m.id}`)}>
                      View Profile →
                    </button>
                    <button className={`btn-save ${isSaved ? 'on' : ''}`} onClick={() => toggleSave(m.id)}>
                      {isSaved ? '♥' : '♡'}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

      </div>
    </div>
  );
}