"use client";

import React, { useState } from 'react';

/* ═══════════════════════════════════════════
   DATA
═══════════════════════════════════════════ */
const COUNTRIES = {
  usa: {
    name: 'USA', flag: '🇺🇸', visaLabel: 'F-1 Student Visa',
    mapLabel: 'USA — 12 Key States',
    reality: [
      { ico: '👨‍🎓', val: '1.2M+', lbl: 'Indian Students', col: '#00f5d4' },
      { ico: '💰', val: '$15-22', lbl: 'Part-time $/hr', col: '#a855f7' },
      { ico: '🛡️', val: '6.8/10', lbl: 'Safety Index', col: '#f59e0b' },
      { ico: '⏳', val: '3 Yrs', lbl: 'OPT STEM Extension', col: '#34d399' },
    ],
    scores: [
      { lbl: 'Physical Safety', val: 6.8, col: '#f59e0b', badge: 'MODERATE', bc: 'rgba(245,158,11,.18)', bct: '#f59e0b' },
      { lbl: 'Job Market', val: 9.1, col: '#34d399', badge: 'EXCELLENT', bc: 'rgba(52,211,153,.18)', bct: '#34d399' },
      { lbl: 'Indian Community', val: 8.7, col: '#00f5d4', badge: 'VERY STRONG', bc: 'rgba(0,245,212,.18)', bct: '#00f5d4' },
      { lbl: 'Healthcare', val: 5.2, col: '#f97316', badge: 'EXPENSIVE', bc: 'rgba(249,115,22,.18)', bct: '#f97316' },
      { lbl: 'Housing Security', val: 6.1, col: '#f59e0b', badge: 'MODERATE', bc: 'rgba(245,158,11,.18)', bct: '#f59e0b' },
      { lbl: 'Work Rights', val: 7.4, col: '#a855f7', badge: 'GOOD', bc: 'rgba(168,85,247,.18)', bct: '#a855f7' },
      { lbl: 'PR Pathway', val: 4.8, col: '#f43f5e', badge: 'DIFFICULT', bc: 'rgba(244,63,94,.18)', bct: '#f43f5e' },
      { lbl: 'Part-time Jobs', val: 8.2, col: '#34d399', badge: 'STRONG', bc: 'rgba(52,211,153,.18)', bct: '#34d399' },
    ],
    work: [
      { ico: '⏰', lbl: 'DURING STUDIES', val: '20 hrs/wk', sub: 'On-campus only in Year 1. CPT/OPT opens after one full academic year on F-1.', tag: 'F-1 RULE', tc: 'rgba(168,85,247,.14)', tv: '#d8b4fe' },
      { ico: '🚀', lbl: 'POST-GRADUATION', val: '1–3 Years', sub: 'STEM degrees = 3-year OPT. Non-STEM = 1 year. Apply 90 days before graduation.', tag: 'PLAN EARLY', tc: 'rgba(0,245,212,.14)', tv: '#5eead4' },
      { ico: '💳', lbl: 'FULL-TIME PATH', val: 'H1-B Lottery', sub: 'Only 65,000 H1-B visas per year. ~25% selection rate. Have a backup plan.', tag: 'HIGH RISK', tc: 'rgba(244,63,94,.14)', tv: '#fda4af' },
      { ico: '💰', lbl: 'AVG PART-TIME', val: '$15–22/hr', sub: 'California/NYC: $20+. Midwest/South: $12-15. Varies enormously by state.', tag: 'STATE VARIES', tc: 'rgba(168,85,247,.14)', tv: '#d8b4fe' },
      { ico: '🏥', lbl: 'HEALTHCARE', val: '$200-400/mo', sub: 'No universal healthcare. Always use the subsidised university health plan.', tag: 'CRITICAL', tc: 'rgba(244,63,94,.14)', tv: '#fda4af' },
      { ico: '💵', lbl: 'TAX BENEFIT', val: 'FICA Exempt', sub: 'F-1 students exempt from Social Security + Medicare taxes. Saves $1-2K/year.', tag: 'MONEY HACK', tc: 'rgba(0,245,212,.14)', tv: '#5eead4' },
    ],
    tips: [
      { num: '01', title: 'H1-B is a lottery — not a guarantee', tag: 'CAREER RISK', body: 'Only 65,000 H1-B visas are issued yearly via random lottery. Thousands of Indian students complete OPT but are never selected. <strong>Have Canada or Germany as a real backup plan before you arrive in the US.</strong> This is the most under-discussed risk in US student planning.' },
      { num: '02', title: 'Build credit from Day 1 or pay the price', tag: 'FINANCIAL MUST', body: 'No credit history means no apartment lease, no car loan, no credit card in your name. <strong>Apply for a Discover Secured Card or Deserve Edu immediately upon arrival.</strong> Pay in full every month. Credit building takes 6-12 months — start on Day 1.' },
      { num: '03', title: 'CPT/OPT timing costs you an entire cycle', tag: 'VISA CRITICAL', body: 'Talk to your DSO (Designated School Official) in Week 1 about CPT eligibility. <strong>Missing the CPT application window means missing the entire US internship recruitment cycle</strong> — which directly reduces job offers at graduation. Worth one 20-minute meeting in your first week.' },
    ],
    regions: {
      CA: { name: 'California', safety: 6.2, jobs: 9.8, community: 9.5, wage: '$21/hr', students: '340K+', uni: 'Stanford, UCLA, UC Berkeley', tip: 'Silicon Valley is the ultimate CS destination. Bay Area rent averages $2,800/month. Consider UC Davis or Riverside for lower cost.' },
      TX: { name: 'Texas', safety: 6.8, jobs: 8.9, community: 8.2, wage: '$16/hr', students: '185K', uni: 'UT Austin, Texas A&M, Rice', tip: 'No state income tax. Austin is the new tech hub. DFW has a massive Indian community. Strong engineering and energy jobs.' },
      NY: { name: 'New York', safety: 6.5, jobs: 8.7, community: 9.1, wage: '$19/hr', students: '210K', uni: 'NYU, Columbia, Cornell', tip: 'Finance and consulting capital. Networking is unmatched. Shared Manhattan room: $1,800+/month. Consider Brooklyn.' },
      WA: { name: 'Washington', safety: 7.8, jobs: 9.2, community: 8.0, wage: '$20/hr', students: '98K', uni: 'University of Washington, WSU', tip: 'Amazon and Microsoft HQ. No state income tax. Seattle is rainy but safe and tech-forward. Best for SDE roles.' },
      IL: { name: 'Illinois', safety: 5.9, jobs: 8.1, community: 8.3, wage: '$15/hr', students: '115K', uni: 'UIUC, Northwestern, UChicago', tip: 'UIUC is a top CS feeder. Chicago winters are brutal but the tech and finance scene is strong. Budget carefully.' },
      MA: { name: 'Massachusetts', safety: 7.9, jobs: 8.8, community: 7.8, wage: '$19/hr', students: '125K', uni: 'MIT, Harvard, Northeastern', tip: 'Best globally for biotech and robotics. Boston is expensive but NEU co-op gives unmatched internship density.' },
      PA: { name: 'Pennsylvania', safety: 6.7, jobs: 7.6, community: 7.9, wage: '$14/hr', students: '135K', uni: 'Penn, Carnegie Mellon, Penn State', tip: 'CMU is #1 for AI/ML. Pittsburgh is surprisingly affordable with a growing tech scene. Excellent safety-to-cost ratio.' },
      GA: { name: 'Georgia', safety: 6.1, jobs: 7.8, community: 8.5, wage: '$14/hr', students: '92K', uni: 'Georgia Tech, Emory, GSU', tip: 'Georgia Tech is CS gold. Atlanta has a huge Indian community. Low cost vs coastal cities. Growing fintech hub.' },
      FL: { name: 'Florida', safety: 6.3, jobs: 7.2, community: 8.0, wage: '$13/hr', students: '105K', uni: 'UF, UCF, FIU', tip: 'No state income tax. Tourism-heavy economy limits tech jobs but Miami is emerging as a fintech and VC hub.' },
      OH: { name: 'Ohio', safety: 6.9, jobs: 7.0, community: 7.2, wage: '$13/hr', students: '78K', uni: 'Ohio State, Case Western', tip: 'Very affordable. Strong engineering. More limited job market than coastal. Good stepping stone for Midwest careers.' },
      NJ: { name: 'New Jersey', safety: 7.4, jobs: 7.8, community: 9.2, wage: '$17/hr', students: '88K', uni: 'Rutgers, Princeton, Stevens', tip: 'Edison NJ is like Little India. Close to NYC for jobs. Pharmaceutical industry (J&J, Merck, Novartis) is massive.' },
      MI: { name: 'Michigan', safety: 6.5, jobs: 7.3, community: 7.5, wage: '$13/hr', students: '72K', uni: 'University of Michigan, MSU', tip: 'UMich is a top research university. Detroit automotive industry is reviving. Ann Arbor is very student-friendly.' },
    }
  },
  germany: {
    name: 'Germany', flag: '🇩🇪', visaLabel: 'Student Visa + Job Seeker Visa',
    mapLabel: 'Germany — 16 Federal States',
    reality: [
      { ico: '🎓', val: '€0-500', lbl: 'Tuition/Semester', col: '#00f5d4' },
      { ico: '💰', val: '€12.41', lbl: 'Min Wage/hr 2024', col: '#a855f7' },
      { ico: '🛡️', val: '8.4/10', lbl: 'Safety Index', col: '#34d399' },
      { ico: '⏳', val: '18 Mo', lbl: 'Job Seeker Visa', col: '#f59e0b' },
    ],
    scores: [
      { lbl: 'Physical Safety', val: 8.4, col: '#34d399', badge: 'EXCELLENT', bc: 'rgba(52,211,153,.18)', bct: '#34d399' },
      { lbl: 'Job Market (STEM)', val: 8.6, col: '#34d399', badge: 'STRONG', bc: 'rgba(52,211,153,.18)', bct: '#34d399' },
      { lbl: 'Indian Community', val: 6.8, col: '#f59e0b', badge: 'MODERATE', bc: 'rgba(245,158,11,.18)', bct: '#f59e0b' },
      { lbl: 'Healthcare', val: 9.1, col: '#00f5d4', badge: 'UNIVERSAL', bc: 'rgba(0,245,212,.18)', bct: '#00f5d4' },
      { lbl: 'Housing Security', val: 7.2, col: '#f59e0b', badge: 'FAIR', bc: 'rgba(245,158,11,.18)', bct: '#f59e0b' },
      { lbl: 'Work Rights', val: 9.0, col: '#34d399', badge: 'BEST IN CLASS', bc: 'rgba(52,211,153,.18)', bct: '#34d399' },
      { lbl: 'PR Pathway', val: 8.8, col: '#34d399', badge: 'CLEAR PATH', bc: 'rgba(52,211,153,.18)', bct: '#34d399' },
      { lbl: 'Part-time Jobs', val: 7.8, col: '#a855f7', badge: 'GOOD', bc: 'rgba(168,85,247,.18)', bct: '#a855f7' },
    ],
    work: [
      { ico: '⏰', lbl: 'DURING STUDIES', val: '120 Full Days', sub: 'Or 240 half-days per year. Far more generous than UK, Canada or USA. Evenings and weekends are unrestricted.', tag: 'BEST IN CLASS', tc: 'rgba(0,245,212,.14)', tv: '#5eead4' },
      { ico: '🚀', lbl: 'POST-GRADUATION', val: '18 Month Visa', sub: 'Job Seeker Visa: 18 months to find employment post-graduation. Unique to Germany — no other country offers this.', tag: 'UNIQUE', tc: 'rgba(0,245,212,.14)', tv: '#5eead4' },
      { ico: '💼', lbl: 'FULL-TIME PATH', val: 'EU Blue Card', sub: 'Salary ≥€45,552/yr → EU Blue Card → Permanent Residence in 21 months. Fastest PR path in Europe.', tag: 'CLEAR PATH', tc: 'rgba(52,211,153,.14)', tv: '#34d399' },
      { ico: '💰', lbl: 'MINIMUM WAGE', val: '€12.41/hr', sub: 'Legally enforced. Werkstudent (student worker) jobs typically pay €14-18/hr in libraries, research labs, stores.', tag: 'GUARANTEED', tc: 'rgba(168,85,247,.14)', tv: '#d8b4fe' },
      { ico: '🏥', lbl: 'HEALTHCARE', val: '~€110/mo', sub: 'TK or AOK student insurance. Covers everything including dental. No surprise bills. University registers you.', tag: 'UNIVERSAL', tc: 'rgba(0,245,212,.14)', tv: '#5eead4' },
      { ico: '💵', lbl: 'TAX REFUND', val: 'Lohnsteuer', sub: 'German income tax is refunded at year-end via Elster portal. Students typically get €300-800 back annually.', tag: 'CLAIM IT', tc: 'rgba(0,245,212,.14)', tv: '#5eead4' },
    ],
    tips: [
      { num: '01', title: 'APS certification: the hidden mandatory step', tag: 'MANDATORY FOR INDIANS', body: 'ALL Indian students need APS (Academic Evaluation Center) certification before any German university will process your application. <strong>It takes 10-12 weeks total.</strong> Book at aps.org.in immediately — this is the single most common and costly mistake Indian applicants make.' },
      { num: '02', title: 'Cash is still king in Germany', tag: 'DAILY LIFE REALITY', body: 'Germany is remarkably cash-heavy. <strong>Many restaurants, grocery stores, kiosks and pharmacies do not accept cards.</strong> Always carry €40-50 in cash. Set up a DKB or N26 account with free cash withdrawals before you arrive. This will genuinely surprise you.' },
      { num: '03', title: 'B2 German unlocks everything', tag: 'CAREER MULTIPLIER', body: 'B2 German language level unlocks 3x more job opportunities, dramatically cheaper housing listings (German-only listings are cheaper), better social integration, and faster PR timelines. <strong>Start German classes in India at Goethe-Institut before you even apply.</strong> It compounds over your entire stay.' },
    ],
    regions: {
      BY: { name: 'Bavaria', safety: 8.9, jobs: 8.8, community: 7.2, wage: '€16/hr', students: '95K', uni: 'TU Munich, LMU Munich', tip: 'TU Munich is #1 German engineering university. Munich is expensive but job market is unmatched. BMW, Siemens, MAN HQ here.' },
      BE: { name: 'Berlin', safety: 7.6, jobs: 7.8, community: 8.1, wage: '€14/hr', students: '175K', uni: 'TU Berlin, Humboldt, FU Berlin', tip: 'Startup capital of Europe. More affordable than Munich. 700+ startups hiring. Massive international community. Very vibrant.' },
      NW: { name: 'North Rhine-Westphalia', safety: 7.8, jobs: 8.2, community: 7.5, wage: '€13/hr', students: '120K', uni: 'RWTH Aachen, Uni Cologne', tip: 'RWTH Aachen is the MIT of Germany for engineering. Düsseldorf has strong Indian community. Deep manufacturing sector.' },
      BW: { name: 'Baden-Württemberg', safety: 8.6, jobs: 8.7, community: 6.9, wage: '€15/hr', students: '88K', uni: 'KIT, Uni Stuttgart, Heidelberg', tip: 'KIT ranks world top 100 for engineering. Home to Bosch, Mercedes, Porsche. Highest post-grad incomes in Germany.' },
      HE: { name: 'Hesse', safety: 8.2, jobs: 8.5, community: 7.8, wage: '€14/hr', students: '72K', uni: 'Goethe Frankfurt, TU Darmstadt', tip: 'Frankfurt is EU financial capital. Darmstadt has a very strong Indian student community and excellent CS programs.' },
      HH: { name: 'Hamburg', safety: 7.9, jobs: 8.1, community: 7.1, wage: '€14/hr', students: '68K', uni: 'Uni Hamburg, TUHH', tip: 'Port city. Strong logistics and maritime. Airbus HQ. More laid-back than Munich but good STEM opportunities.' },
      SN: { name: 'Saxony', safety: 7.2, jobs: 7.4, community: 5.8, wage: '€12/hr', students: '55K', uni: 'TU Dresden, Leipzig Uni', tip: 'Very affordable — rent as low as €250/month. Dresden semiconductor industry is booming (Intel building new fab here).' },
      RP: { name: 'Rhineland-Palatinate', safety: 8.7, jobs: 7.2, community: 5.5, wage: '€12/hr', students: '42K', uni: 'Uni Mainz, TU Kaiserslautern', tip: 'Very safe. Low cost. Kaiserslautern has a strong CS dept connected to DFKI AI research institute.' },
    }
  },
  uk: {
    name: 'UK', flag: '🇬🇧', visaLabel: 'UK Student Visa (CAS)',
    mapLabel: 'United Kingdom — Key Regions',
    reality: [
      { ico: '🎓', val: '£15-30K', lbl: 'Annual Tuition', col: '#a855f7' },
      { ico: '💰', val: '£11.44', lbl: 'Min Wage/hr 2024', col: '#f59e0b' },
      { ico: '🛡️', val: '7.6/10', lbl: 'Safety Index', col: '#00f5d4' },
      { ico: '⏳', val: '2 Years', lbl: 'Graduate Visa', col: '#34d399' },
    ],
    scores: [
      { lbl: 'Physical Safety', val: 7.6, col: '#00f5d4', badge: 'GOOD', bc: 'rgba(0,245,212,.18)', bct: '#00f5d4' },
      { lbl: 'Job Market', val: 8.2, col: '#34d399', badge: 'STRONG', bc: 'rgba(52,211,153,.18)', bct: '#34d399' },
      { lbl: 'Indian Community', val: 8.9, col: '#00f5d4', badge: 'EXCEPTIONAL', bc: 'rgba(0,245,212,.18)', bct: '#00f5d4' },
      { lbl: 'NHS Healthcare', val: 8.8, col: '#34d399', badge: 'COVERED', bc: 'rgba(52,211,153,.18)', bct: '#34d399' },
      { lbl: 'Housing Security', val: 5.8, col: '#f97316', badge: 'COMPETITIVE', bc: 'rgba(249,115,22,.18)', bct: '#f97316' },
      { lbl: 'Work Rights', val: 8.0, col: '#a855f7', badge: 'GOOD', bc: 'rgba(168,85,247,.18)', bct: '#a855f7' },
      { lbl: 'PR Pathway (ILR)', val: 6.5, col: '#f59e0b', badge: '5 YEARS', bc: 'rgba(245,158,11,.18)', bct: '#f59e0b' },
      { lbl: 'Part-time Jobs', val: 7.9, col: '#34d399', badge: 'STRONG', bc: 'rgba(52,211,153,.18)', bct: '#34d399' },
    ],
    work: [
      { ico: '⏰', lbl: 'DURING TERM', val: '20 hrs/wk', sub: 'During term time only. Full-time permitted during official holidays. Exceeding 20hrs is a visa violation.', tag: 'TERM LIMIT', tc: 'rgba(168,85,247,.14)', tv: '#d8b4fe' },
      { ico: '🚀', lbl: 'GRADUATE VISA', val: '2 Years', sub: 'Automatic after any UK degree. Full work rights, no employer sponsorship needed. Unique and extremely valuable.', tag: 'BEST VISA', tc: 'rgba(0,245,212,.14)', tv: '#5eead4' },
      { ico: '💼', lbl: 'FULL-TIME PATH', val: 'Skilled Worker', sub: 'Employer must sponsor after Graduate Visa. Minimum salary threshold £38,700+ from April 2024.', tag: 'SPONSORED', tc: 'rgba(245,158,11,.14)', tv: '#fbbf24' },
      { ico: '💰', lbl: 'NATIONAL MIN', val: '£11.44/hr', sub: 'Legally enforced for 21+. Most student jobs (hospitality, retail, campus) pay £12-15/hr.', tag: 'GUARANTEED', tc: 'rgba(168,85,247,.14)', tv: '#d8b4fe' },
      { ico: '🏥', lbl: 'NHS HEALTHCARE', val: 'IHS Included', sub: 'Immigration Health Surcharge (£470/year) paid with visa application. Covers all NHS treatment.', tag: 'INCLUDED', tc: 'rgba(0,245,212,.14)', tv: '#5eead4' },
      { ico: '🚇', lbl: 'LONDON SAVING', val: '30% Off', sub: '18+ Oyster card for London students. Register before arriving (10 days by post). Saves £40+/month on transport.', tag: 'DO THIS NOW', tc: 'rgba(0,245,212,.14)', tv: '#5eead4' },
    ],
    tips: [
      { num: '01', title: '1-year MSc moves terrifyingly fast', tag: 'URGENT — READ THIS FIRST', body: 'UK 1-year MSc is only 9 months of taught content. <strong>Consulting and banking job applications open in Week 6 of Term 1.</strong> Miss that window and you miss the entire hiring cycle for that year. Research your target employers before you arrive — not after orientation.' },
      { num: '02', title: 'London housing: start 3 months before arrival', tag: 'HOUSING CRITICAL', body: 'London rooms go in hours. A decent Zone 2 room costs £900-1,200/month. <strong>Use SpareRoom.co.uk, not estate agents — agent fees are brutal.</strong> Join the Facebook student group for your specific university the day you receive your offer letter.' },
      { num: '03', title: 'ILR requires 5 continuous years', tag: 'PR REALITY CHECK', body: 'Indefinite Leave to Remain (UK equivalent of PR) requires 5 years of continuous legal UK residence. Graduate Visa (2yr) + Skilled Worker Visa (3yr) minimum. <strong>Achievable but not guaranteed.</strong> Have Germany or Canada as a backup if tech sponsorship is your end goal.' },
    ],
    regions: {
      london: { name: 'Greater London', safety: 6.8, jobs: 9.4, community: 9.7, wage: '£14/hr', students: '120K', uni: 'Imperial, UCL, LSE, KCL', tip: 'Global finance and consulting hub. Indian community is enormous in Southall, Wembley, Harrow. Rent: £1,000-1,400/month shared room.' },
      se_england: { name: 'South East', safety: 8.2, jobs: 7.8, community: 8.1, wage: '£12/hr', students: '68K', uni: 'Sussex, Southampton, Reading', tip: 'Close to London for work. Better housing prices. Southampton strong for maritime industry. Brighton vibrant for tech startups.' },
      northwest: { name: 'North West', safety: 7.4, jobs: 7.6, community: 8.4, wage: '£11/hr', students: '85K', uni: 'Manchester, Lancaster, Liverpool', tip: 'Manchester is the strongest northern city for Indian students — huge community, strong media and tech scene. Half the cost of London.' },
      yorkshire: { name: 'Yorkshire', safety: 7.8, jobs: 7.1, community: 7.6, wage: '£11/hr', students: '72K', uni: 'Leeds, Sheffield, York', tip: 'Very affordable. Sheffield strong engineering heritage. Leeds growing in finance. Bradford has UK\'s 2nd largest Indian community.' },
      scotland: { name: 'Scotland', safety: 8.4, jobs: 7.3, community: 7.2, wage: '£11/hr', students: '58K', uni: 'Edinburgh, Glasgow, St Andrews', tip: 'Edinburgh is the safest UK city for students. Lower tuition for some programs. Strong fintech and oil & gas sectors.' },
      westmidlands: { name: 'West Midlands', safety: 6.9, jobs: 7.5, community: 8.8, wage: '£11/hr', students: '78K', uni: 'Birmingham, Warwick, Aston', tip: 'Birmingham has the UK\'s youngest largest South Asian community outside London. Warwick excellent for finance. Much cheaper than London.' },
      wales: { name: 'Wales', safety: 8.1, jobs: 6.5, community: 6.2, wage: '£11/hr', students: '38K', uni: 'Cardiff, Swansea', tip: 'Very safe and scenic. Cardiff is growing as a tech and media hub (BBC Wales). Lower cost of living. Welcoming environment.' },
    }
  },
  canada: {
    name: 'Canada', flag: '🇨🇦', visaLabel: 'Study Permit (IRCC)',
    mapLabel: 'Canada — Key Provinces',
    reality: [
      { ico: '🎓', val: 'C$18-35K', lbl: 'Annual Tuition', col: '#f59e0b' },
      { ico: '💰', val: 'C$16.55', lbl: 'Federal Min/hr', col: '#00f5d4' },
      { ico: '🛡️', val: '8.1/10', lbl: 'Safety Index', col: '#34d399' },
      { ico: '⏳', val: '3 Years', lbl: 'PGWP Duration', col: '#a855f7' },
    ],
    scores: [
      { lbl: 'Physical Safety', val: 8.1, col: '#34d399', badge: 'VERY GOOD', bc: 'rgba(52,211,153,.18)', bct: '#34d399' },
      { lbl: 'Job Market', val: 7.9, col: '#a855f7', badge: 'GOOD', bc: 'rgba(168,85,247,.18)', bct: '#a855f7' },
      { lbl: 'Indian Community', val: 9.2, col: '#00f5d4', badge: 'EXCEPTIONAL', bc: 'rgba(0,245,212,.18)', bct: '#00f5d4' },
      { lbl: 'Healthcare', val: 9.0, col: '#34d399', badge: 'UNIVERSAL', bc: 'rgba(52,211,153,.18)', bct: '#34d399' },
      { lbl: 'Housing Security', val: 5.6, col: '#f97316', badge: 'COMPETITIVE', bc: 'rgba(249,115,22,.18)', bct: '#f97316' },
      { lbl: 'Work Rights', val: 8.5, col: '#34d399', badge: 'EXCELLENT', bc: 'rgba(52,211,153,.18)', bct: '#34d399' },
      { lbl: 'PR Pathway', val: 9.1, col: '#34d399', badge: 'BEST ROUTE', bc: 'rgba(52,211,153,.18)', bct: '#34d399' },
      { lbl: 'Part-time Jobs', val: 8.0, col: '#a855f7', badge: 'GOOD', bc: 'rgba(168,85,247,.18)', bct: '#a855f7' },
    ],
    work: [
      { ico: '⏰', lbl: 'DURING STUDIES', val: '20 hrs/wk', sub: 'During academic sessions. Full-time during scheduled breaks. Off-campus allowed — more flexible than USA.', tag: 'FLEXIBLE', tc: 'rgba(0,245,212,.14)', tv: '#5eead4' },
      { ico: '🚀', lbl: 'PGWP DURATION', val: 'Up to 3 Yrs', sub: 'Program length = PGWP length. 2-year degree = 2-year PGWP. 3-year = 3-year PGWP. Plan your program.', tag: 'PLAN PROGRAM', tc: 'rgba(168,85,247,.14)', tv: '#d8b4fe' },
      { ico: '💼', lbl: 'PR PATH', val: 'Express Entry', sub: 'PGWP → Canadian work experience → Express Entry CRS points → PR in 6-18 months. Most reliable in the world.', tag: 'BEST PATH', tc: 'rgba(52,211,153,.14)', tv: '#34d399' },
      { ico: '💰', lbl: 'FEDERAL MIN', val: 'C$16.55/hr', sub: 'Ontario: C$16.55. BC: C$17.40. Alberta: C$15. All significantly higher than comparable US states.', tag: 'GUARANTEED', tc: 'rgba(168,85,247,.14)', tv: '#d8b4fe' },
      { ico: '🏥', lbl: 'HEALTHCARE', val: '3 Mo Wait', sub: 'Provincial coverage free after 3-month wait in Ontario. Get travel insurance to bridge the gap — essential.', tag: 'BRIDGE GAP', tc: 'rgba(245,158,11,.14)', tv: '#fbbf24' },
      { ico: '💵', lbl: 'TAX CREDIT', val: 'GST/HST', sub: 'Students get quarterly GST/HST credit. File taxes every April — most students get C$400-1,200 back per year.', tag: 'CLAIM IT', tc: 'rgba(0,245,212,.14)', tv: '#5eead4' },
    ],
    tips: [
      { num: '01', title: 'PGWP length is the most important decision you make', tag: 'VISA STRATEGY', body: 'Your PGWP (Post-Graduation Work Permit) duration equals your program length. <strong>A 2-year program gives 2 years of work rights. A 3-year program gives 3 years.</strong> Those extra 12 months can be the difference between qualifying for Express Entry PR or not. This decision shapes your entire Canada journey.' },
      { num: '02', title: 'Buy winter gear in India — not in Canada', tag: 'PRACTICAL MONEY', body: 'Indian students consistently underestimate Canadian winter. <strong>A quality parka + insulated boots costs C$400-600 in Canada. The same gear in India costs ₹5,000-8,000.</strong> Toronto and Ottawa can hit -20°C with windchill. Edmonton and Winnipeg are even colder. This is not an exaggeration.' },
      { num: '03', title: 'OHIP gap can cost you thousands', tag: 'FINANCIAL RISK', body: 'Ontario health insurance takes 3 full months to activate from arrival. A single ER visit without coverage costs C$800-3,000. <strong>Buy travel insurance for your first 3 months — it costs only C$100-200 and covers emergencies.</strong> This is non-negotiable and most students skip it.' },
    ],
    regions: {
      ontario: { name: 'Ontario', safety: 7.9, jobs: 8.8, community: 9.5, wage: 'C$16.55', students: '320K', uni: 'U of Toronto, Waterloo, McMaster', tip: 'Toronto has the largest Indian-Canadian community globally. U of T is top research. Tech, finance, and healthcare booming.' },
      bc: { name: 'British Columbia', safety: 7.6, jobs: 8.4, community: 8.8, wage: 'C$17.40', students: '185K', uni: 'UBC, SFU, UVIC', tip: 'Vancouver is stunningly beautiful but Canada\'s most expensive city. UBC is world-class. Surrey has huge Indian community.' },
      alberta: { name: 'Alberta', safety: 8.2, jobs: 8.1, community: 8.2, wage: 'C$15.00', students: '92K', uni: 'University of Alberta, U of Calgary', tip: 'No provincial sales tax. Calgary growing rapidly in tech and energy. Edmonton more affordable. Strong petroleum engineering.' },
      quebec: { name: 'Quebec', safety: 8.5, jobs: 7.4, community: 7.1, wage: 'C$15.25', students: '78K', uni: 'McGill, Concordia, U de Montreal', tip: 'French required for provincial PR. McGill is globally ranked. Montreal very affordable and culturally rich. World-class AI hub.' },
      manitoba: { name: 'Manitoba', safety: 7.8, jobs: 7.0, community: 8.0, wage: 'C$15.30', students: '38K', uni: 'U of Manitoba, U of Winnipeg', tip: 'Cheapest cost of living in Canada. Manitoba PNP is one of the most accessible provincial PR programs for international grads.' },
      nova_scotia: { name: 'Nova Scotia', safety: 8.6, jobs: 6.8, community: 7.2, wage: 'C$15.20', students: '28K', uni: 'Dalhousie, Saint Marys', tip: 'Very safe. Beautiful coastline. Halifax growing as tech hub. Nova Scotia PNP is one of the fastest provincial immigration streams.' },
    }
  },
  australia: {
    name: 'Australia', flag: '🇦🇺', visaLabel: 'Subclass 500 Student Visa',
    mapLabel: 'Australia — States & Territories',
    reality: [
      { ico: '🎓', val: 'A$28-48K', lbl: 'Annual Tuition', col: '#f59e0b' },
      { ico: '💰', val: 'A$23.23', lbl: 'Min Wage/hr 2024', col: '#00f5d4' },
      { ico: '🛡️', val: '8.3/10', lbl: 'Safety Index', col: '#34d399' },
      { ico: '⏳', val: '2-4 Years', lbl: '485 Graduate Visa', col: '#a855f7' },
    ],
    scores: [
      { lbl: 'Physical Safety', val: 8.3, col: '#34d399', badge: 'VERY GOOD', bc: 'rgba(52,211,153,.18)', bct: '#34d399' },
      { lbl: 'Job Market', val: 7.8, col: '#a855f7', badge: 'GOOD', bc: 'rgba(168,85,247,.18)', bct: '#a855f7' },
      { lbl: 'Indian Community', val: 8.6, col: '#00f5d4', badge: 'STRONG', bc: 'rgba(0,245,212,.18)', bct: '#00f5d4' },
      { lbl: 'Healthcare (OSHC)', val: 8.2, col: '#34d399', badge: 'COVERED', bc: 'rgba(52,211,153,.18)', bct: '#34d399' },
      { lbl: 'Housing Security', val: 5.3, col: '#f43f5e', badge: 'CRISIS', bc: 'rgba(244,63,94,.18)', bct: '#f43f5e' },
      { lbl: 'Work Rights', val: 8.8, col: '#34d399', badge: 'MOST GENEROUS', bc: 'rgba(52,211,153,.18)', bct: '#34d399' },
      { lbl: 'PR Pathway', val: 7.8, col: '#a855f7', badge: 'ACHIEVABLE', bc: 'rgba(168,85,247,.18)', bct: '#a855f7' },
      { lbl: 'Part-time Jobs', val: 9.1, col: '#34d399', badge: 'EXCELLENT', bc: 'rgba(52,211,153,.18)', bct: '#34d399' },
    ],
    work: [
      { ico: '⏰', lbl: 'DURING STUDIES', val: '48 hrs/fortnight', sub: '24hrs/week average — the most generous in the world. Weekend and evening shifts are fully allowed.', tag: 'WORLD BEST', tc: 'rgba(0,245,212,.14)', tv: '#5eead4' },
      { ico: '🚀', lbl: '485 GRAD VISA', val: '2–4 Years', sub: 'Duration based on degree length. Regional study adds extra years. Full work rights anywhere in Australia.', tag: 'STRONG VISA', tc: 'rgba(52,211,153,.14)', tv: '#34d399' },
      { ico: '💼', lbl: 'FULL-TIME PATH', val: 'Skills-Based', sub: '485 → TSS 482 employer sponsorship or skills migration points test (189/190 visa). More complex than Canada.', tag: 'PLAN AHEAD', tc: 'rgba(245,158,11,.14)', tv: '#fbbf24' },
      { ico: '💰', lbl: 'MINIMUM WAGE', val: 'A$23.23/hr', sub: 'Highest minimum wage in the world. Even casual part-time jobs pay significantly more than comparable roles in USA/Canada.', tag: 'HIGHEST GLOBAL', tc: 'rgba(0,245,212,.14)', tv: '#5eead4' },
      { ico: '🏥', lbl: 'OSHC INSURANCE', val: '~A$600/yr', sub: 'Overseas Student Health Cover must be purchased before visa. Covers GP, hospital, limited dental.', tag: 'MANDATORY', tc: 'rgba(168,85,247,.14)', tv: '#d8b4fe' },
      { ico: '💵', lbl: 'SUPERANNUATION', val: '11% from Employer', sub: 'Every employer pays 11% of your wages to super. Claim it all back via ATO DASP when you leave Australia.', tag: 'CLAIM IT BACK', tc: 'rgba(0,245,212,.14)', tv: '#5eead4' },
    ],
    tips: [
      { num: '01', title: 'Claim your superannuation before leaving', tag: 'FREE MONEY — SERIOUSLY', body: 'Every Australian employer is legally required to contribute 11% of your wages to a superannuation fund. <strong>When you leave Australia, you can claim ALL of it back via ATO Departing Australia Superannuation Payment (DASP).</strong> Students who worked consistently can claim A$3,000-8,000. Track every employer from Day 1.' },
      { num: '02', title: 'Housing crisis: start looking the day you get your offer', tag: 'URGENT — HOUSING CRISIS', body: 'Australia is experiencing its worst housing crisis since records began. Melbourne and Sydney vacancy rates are below 1%. <strong>Start looking for accommodation on the day you receive your admission offer letter.</strong> Budget A$250-400/week for a shared room. Use REA Group and your university Facebook groups.' },
      { num: '03', title: 'Regional study = longer 485 visa', tag: 'VISA STRATEGY', body: 'Studying in a regional area (not Sydney or Melbourne) gives you extra years on your 485 Graduate Visa. <strong>Some regional universities give 5-year 485 visas vs 2 years for metro graduates.</strong> ANU (Canberra), University of Wollongong, University of Adelaide — worth seriously considering for this reason.' },
    ],
    regions: {
      vic: { name: 'Victoria (Melbourne)', safety: 7.8, jobs: 8.2, community: 8.9, wage: 'A$23.23', students: '180K', uni: 'Melbourne, Monash, RMIT', tip: 'Melbourne ranked world\'s most liveable city. Huge Indian community in Clayton and Point Cook. Strong healthcare, education, tech sectors.' },
      nsw: { name: 'NSW (Sydney)', safety: 7.6, jobs: 8.6, community: 8.8, wage: 'A$23.23', students: '195K', uni: 'UNSW, University of Sydney, UTS', tip: 'Financial capital of Australia. UNSW and USyd are globally ranked. Indian community strong in Parramatta. Rent A$280-400/week shared room.' },
      qld: { name: 'Queensland (Brisbane)', safety: 8.1, jobs: 7.6, community: 7.8, wage: 'A$23.23', students: '98K', uni: 'UQ, QUT, Griffith', tip: 'Brisbane rapidly developing post-2032 Olympics announcement. UQ is a top research university. Much cheaper than Sydney or Melbourne.' },
      wa: { name: 'Western Australia', safety: 8.6, jobs: 7.8, community: 7.5, wage: 'A$23.23', students: '72K', uni: 'UWA, Curtin, Murdoch', tip: 'Perth is the safest major Australian city. Mining and resources industry pays exceptionally well. Isolation from eastern states.' },
      sa: { name: 'South Australia', safety: 8.4, jobs: 7.1, community: 7.3, wage: 'A$23.23', students: '55K', uni: 'University of Adelaide, UniSA', tip: 'Most affordable major Australian city. Adelaide ranks highly for safety. South Australia state nomination for PR is accessible.' },
      act: { name: 'ACT (Canberra)', safety: 9.1, jobs: 8.0, community: 7.0, wage: 'A$23.23', students: '38K', uni: 'ANU, UC Canberra', tip: 'ANU is Australia\'s top research university. Canberra is the safest city in Australia. Regional classification = longer 485 visa.' },
    }
  }
};

/* ═══════════════════════════════════════════
   MAPS (SVG Arrays for React)
═══════════════════════════════════════════ */
const MAPS = {
  usa: {
    vb: "0 0 900 560",
    paths: [
      { r: "WA", d: "M90,60 L195,55 L205,90 L195,118 L145,120 L90,115Z" },
      { r: "CA", d: "M80,125 L148,122 L162,160 L155,240 L140,320 L125,390 L108,420 L88,410 L72,360 L65,280 L68,180Z" },
      { r: "TX", d: "M285,290 L370,285 L400,310 L415,350 L410,410 L385,450 L340,470 L295,465 L272,440 L260,400 L260,350Z" },
      { r: "NY", d: "M680,95 L745,88 L758,115 L748,140 L720,148 L690,142 L675,120Z" },
      { r: "MA", d: "M748,105 L790,98 L800,118 L790,132 L758,138 L748,120Z" },
      { r: "IL", d: "M520,200 L560,196 L562,250 L555,295 L520,298 L510,255 L512,220Z" },
      { r: "PA", d: "M648,148 L720,140 L728,168 L718,192 L648,196 L640,170Z" },
      { r: "GA", d: "M590,320 L640,318 L645,370 L635,410 L608,418 L585,400 L578,360Z" },
      { r: "FL", d: "M600,420 L640,415 L650,448 L640,490 L610,510 L585,498 L575,465 L580,435Z" },
      { r: "OH", d: "M595,185 L648,180 L650,230 L642,252 L595,255 L585,230Z" },
      { r: "NJ", d: "M722,152 L748,148 L752,172 L740,188 L720,185 L716,168Z" },
      { r: "MI", d: "M555,130 L610,125 L618,160 L605,182 L562,185 L548,160Z" },
      { r: "_", d: "M205,55 L285,50 L295,80 L290,120 L205,118Z" },
      { r: "_", d: "M162,122 L285,118 L295,160 L285,290 L260,295 L220,280 L175,260 L162,200Z" },
      { r: "_", d: "M370,115 L520,110 L520,200 L370,198Z" },
      { r: "_", d: "M370,198 L510,198 L510,295 L590,295 L595,320 L510,325 L415,310 L400,310 L370,285Z" },
      { r: "_", d: "M560,298 L595,295 L595,320 L578,360 L560,355Z" },
      { r: "_", d: "M648,196 L720,192 L730,260 L718,320 L700,380 L670,415 L645,410 L645,370 L640,318 L642,252Z" }
    ]
  },
  germany: {
    vb: "0 0 440 520",
    paths: [
      { r: "HH", d: "M198,72 L222,68 L228,84 L218,94 L198,90Z" },
      { r: "BE", d: "M282,148 L304,144 L310,162 L300,172 L280,170Z" },
      { r: "NW", d: "M108,148 L178,142 L185,182 L175,218 L150,228 L118,220 L102,192Z" },
      { r: "BY", d: "M188,248 L295,242 L308,280 L298,330 L268,358 L228,365 L195,348 L172,310 L168,270Z" },
      { r: "BW", d: "M138,248 L188,248 L172,310 L155,330 L128,318 L118,280Z" },
      { r: "HE", d: "M175,192 L238,186 L242,230 L228,248 L175,245Z" },
      { r: "SN", d: "M260,168 L340,162 L348,208 L320,230 L278,228 L260,205Z" },
      { r: "RP", d: "M108,218 L148,215 L152,255 L135,268 L105,258Z" },
      { r: "_", d: "M175,42 L295,35 L310,68 L300,100 L240,105 L175,100Z" },
      { r: "_", d: "M175,100 L300,100 L310,142 L238,148 L178,142Z" },
      { r: "_", d: "M238,148 L310,142 L318,168 L260,172 L238,168Z" },
      { r: "_", d: "M238,228 L260,205 L278,228 L242,230Z" }
    ]
  },
  uk: {
    vb: "0 0 340 580",
    paths: [
      { r: "scotland", d: "M115,30 L195,22 L215,55 L210,105 L185,122 L150,125 L118,105 L108,68Z" },
      { r: "northwest", d: "M128,218 L170,212 L178,248 L168,278 L140,282 L120,262 L118,238Z" },
      { r: "yorkshire", d: "M170,212 L212,208 L218,248 L205,272 L175,275 L168,250Z" },
      { r: "westmidlands", d: "M135,285 L178,280 L182,318 L168,338 L138,335 L122,312Z" },
      { r: "london", d: "M188,328 L228,322 L235,348 L224,362 L190,360Z" },
      { r: "se_england", d: "M172,362 L235,355 L242,395 L220,415 L185,415 L165,395Z" },
      { r: "wales", d: "M100,280 L135,278 L138,335 L122,362 L96,352 L84,318Z" },
      { r: "_", d: "M170,120 L210,115 L218,170 L215,212 L170,215Z" },
      { r: "_", d: "M175,275 L212,272 L215,285 L182,288 L175,285Z" },
      { r: "_", d: "M178,315 L215,310 L218,325 L185,328Z" }
    ]
  },
  canada: {
    vb: "0 0 820 480",
    paths: [
      { r: "bc", d: "M50,108 L128,90 L148,112 L145,185 L125,215 L85,220 L52,198Z" },
      { r: "alberta", d: "M148,108 L200,100 L208,188 L200,225 L152,228 L145,185Z" },
      { r: "manitoba", d: "M258,108 L322,102 L330,192 L320,232 L268,235 L258,192Z" },
      { r: "ontario", d: "M322,108 L418,100 L430,145 L422,230 L390,255 L345,258 L320,232Z" },
      { r: "quebec", d: "M418,100 L510,88 L528,125 L518,218 L480,238 L440,228 L422,185Z" },
      { r: "nova_scotia", d: "M540,188 L585,182 L598,210 L582,232 L548,235Z" },
      { r: "_", d: "M42,55 L148,42 L148,108 L50,108Z" },
      { r: "_", d: "M148,55 L258,42 L258,108 L148,108Z" },
      { r: "_", d: "M200,100 L258,95 L258,192 L208,188Z" },
      { r: "_", d: "M258,35 L418,22 L418,100 L258,108Z" },
      { r: "_", d: "M510,52 L620,40 L628,100 L528,108 L510,88Z" }
    ]
  },
  australia: {
    vb: "0 0 720 640",
    paths: [
      { r: "wa", d: "M58,88 L218,72 L235,112 L235,268 L218,398 L192,438 L152,448 L108,425 L75,375 L52,290 L45,185Z" },
      { r: "sa", d: "M235,268 L378,255 L395,300 L388,392 L358,438 L305,452 L265,440 L235,405Z" },
      { r: "qld", d: "M378,72 L518,58 L548,100 L542,228 L515,305 L458,338 L405,328 L385,288 L395,218 L395,115Z" },
      { r: "nsw", d: "M405,328 L515,312 L548,358 L542,412 L508,448 L458,455 L418,438 L400,395Z" },
      { r: "vic", d: "M405,440 L458,455 L512,458 L520,492 L495,515 L458,522 L415,508 L398,478Z" },
      { r: "act", d: "M470,398 L495,392 L502,412 L488,422 L468,418Z" },
      { r: "_", d: "M218,72 L378,58 L395,115 L235,112Z" },
      { r: "_", d: "M235,112 L395,115 L395,268 L235,268Z" }
    ]
  }
};

/* ═══════════════════════════════════════════
   HELPERS
═══════════════════════════════════════════ */
function scoreColor(s) {
  if (s >= 8.0) return '#00E5A8';
  if (s >= 6.5) return '#7BC97B';
  if (s >= 5.0) return '#F59E0B';
  if (s >= 3.5) return '#F97316';
  return '#EF4444';
}

export default function CountryIntelligence() {
  const [curCountry, setCurCountry] = useState('usa');
  const [curMode, setCurMode] = useState('safety');
  const [tooltip, setTooltip] = useState({ show: false, x: 0, y: 0, rKey: null });

  const handleMouseMove = (e) => {
    let x = e.clientX + 20;
    let y = e.clientY - 12;
    if (x + 310 > window.innerWidth) x = e.clientX - 320;
    if (y + 420 > window.innerHeight) y = e.clientY - 430;
    setTooltip(prev => ({ ...prev, x, y }));
  };

  const handleMouseEnter = (e, rKey) => {
    setTooltip(prev => ({ ...prev, show: true, rKey }));
  };

  const handleMouseLeave = () => {
    setTooltip(prev => ({ ...prev, show: false }));
  };

  const d = COUNTRIES[curCountry];
  const mid = Math.ceil(d.scores.length / 2);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Syne:wght@400;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');
        
        :root{
          --teal:#00f5d4;--purple:#a855f7;--gold:#f59e0b;
          --red:#f43f5e;--green:#34d399;--orange:#f97316;
          --bg:#060c14;--bg2:#0d1520;--bg3:#111c2e;
          --border:rgba(255,255,255,.07);--text:#e2e8f0;--muted:#64748b;
        }
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        html{scroll-behavior:smooth}
        body{background:var(--bg);color:var(--text);font-family:'Syne',sans-serif;overflow-x:hidden}
        ::-webkit-scrollbar{width:4px}
        ::-webkit-scrollbar-track{background:var(--bg)}
        ::-webkit-scrollbar-thumb{background:rgba(255,255,255,.1);border-radius:3px}
        ::-webkit-scrollbar-thumb:hover{background:rgba(168,85,247,.3)}

        /* ── BACKGROUND ── */
        .grid-bg{position:fixed;inset:0;z-index:0;pointer-events:none;
          background-image:linear-gradient(rgba(168,85,247,.018) 1px,transparent 1px),
          linear-gradient(90deg,rgba(168,85,247,.018) 1px,transparent 1px);
          background-size:60px 60px}
        .glow-orb{position:fixed;border-radius:50%;pointer-events:none;z-index:0;filter:blur(120px);opacity:.1}
        .orb1{width:700px;height:700px;background:var(--purple);top:-200px;left:-200px}
        .orb2{width:500px;height:500px;background:var(--teal);bottom:-150px;right:-100px}
        .orb3{width:350px;height:350px;background:var(--gold);top:60vh;right:25%;opacity:.05}

        /* ── NAV ── */
        nav{position:fixed;top:0;left:0;right:0;z-index:100;display:flex;align-items:center;
          justify-content:space-between;padding:0 40px;height:64px;
          background:rgba(6,12,20,.92);backdrop-filter:blur(16px);border-bottom:1px solid var(--border)}
        .nav-logo{display:flex;align-items:center;gap:10px;font-size:1.05rem;font-weight:700;color:#fff;text-decoration:none}
        .logo-icon{width:34px;height:34px;border-radius:9px;
          background:linear-gradient(135deg,var(--teal),var(--purple));
          display:flex;align-items:center;justify-content:center;flex-shrink:0;
          box-shadow:0 0 18px rgba(168,85,247,.35)}
        .logo-icon svg{width:16px;height:16px}
        .logo-text em{font-style:normal;color:var(--teal)}
        .nav-links{display:flex;gap:24px}
        .nav-links a{color:var(--muted);text-decoration:none;font-size:.82rem;font-weight:600;
          transition:color .2s;letter-spacing:.04em}
        .nav-links a:hover{color:var(--text)}
        .nav-links a.active{color:var(--purple)}
        .nav-actions{display:flex;gap:10px;align-items:center}
        .btn-ghost-nav{padding:7px 16px;border:1px solid var(--border);border-radius:8px;
          background:none;color:var(--text);font-family:'Syne',sans-serif;font-size:.8rem;
          font-weight:600;cursor:pointer;transition:all .2s;text-decoration:none;display:flex;align-items:center}
        .btn-ghost-nav:hover{border-color:rgba(255,255,255,.2)}
        .btn-primary-nav{padding:7px 18px;border:none;border-radius:8px;
          background:var(--teal);color:#060c14;font-family:'Syne',sans-serif;
          font-size:.8rem;font-weight:700;cursor:pointer;transition:all .2s;text-decoration:none;display:flex;align-items:center}
        .btn-primary-nav:hover{opacity:.9;transform:translateY(-1px)}

        /* ── MAIN ── */
        main{position:relative;z-index:1;padding-top:64px}
        .section{max-width:1400px;margin:0 auto;padding:20px 60px 60px}
        @media(max-width:768px){
          .section{padding:20px 24px 40px}
          nav{padding:0 20px}
          .nav-links{display:none}
        }

        /* ── HERO ── */
        .hero{padding:80px 60px 48px;max-width:1400px;margin:0 auto}
        @media(max-width:768px){.hero{padding:48px 24px 32px}}
        .hero-badge{display:inline-flex;align-items:center;gap:8px;padding:6px 14px;border-radius:100px;
          border:1px solid rgba(168,85,247,.35);font-size:.72rem;font-family:'JetBrains Mono',monospace;
          color:var(--purple);letter-spacing:.12em;margin-bottom:24px}
        .hero-badge::before{content:'';width:7px;height:7px;border-radius:50%;
          background:var(--purple);animation:pulse-dot 2s infinite;flex-shrink:0}
        @keyframes pulse-dot{0%,100%{box-shadow:0 0 0 0 rgba(168,85,247,.5)}50%{box-shadow:0 0 0 6px rgba(168,85,247,0)}}
        .hero-title{font-family:'Bebas Neue',sans-serif;font-size:clamp(52px,7vw,100px);
          line-height:.93;letter-spacing:.02em;color:#fff;margin-bottom:16px}
        .hero-title .a1{color:var(--purple)}
        .hero-title .a2{color:var(--teal)}
        .hero-sub{font-size:1rem;color:var(--muted);max-width:580px;line-height:1.7;margin-bottom:36px}
        .hero-stats{display:flex;gap:36px;flex-wrap:wrap}
        .hs-val{font-family:'Bebas Neue',sans-serif;font-size:2.4rem;color:var(--teal);letter-spacing:.04em;line-height:1}
        .hs-lbl{font-size:.62rem;font-family:'JetBrains Mono',monospace;color:var(--muted);letter-spacing:.1em;margin-top:3px}

        /* ── SECTION LABELS ── */
        .section-label{font-size:.68rem;font-family:'JetBrains Mono',monospace;color:var(--purple);
          letter-spacing:.15em;padding:4px 11px;border:1px solid rgba(168,85,247,.25);
          border-radius:4px;display:inline-block;margin-bottom:18px}
        .section-title{font-family:'Bebas Neue',sans-serif;font-size:clamp(32px,4vw,52px);
          letter-spacing:.02em;line-height:1;color:#fff;margin-bottom:10px}
        .section-sub{color:var(--muted);font-size:.92rem;margin-bottom:32px;max-width:600px;line-height:1.65}

        /* ── COUNTRY TABS ── */
        .country-tabs{display:flex;gap:8px;margin-bottom:24px;flex-wrap:wrap}
        .ctab{display:flex;align-items:center;gap:9px;padding:10px 18px;border-radius:12px;
          border:1px solid var(--border);background:rgba(255,255,255,.02);cursor:pointer;
          transition:all .22s;font-family:'Syne',sans-serif;font-size:.86rem;font-weight:600;color:var(--muted)}
        .ctab:hover{border-color:rgba(168,85,247,.3);color:var(--text)}
        .ctab.active{border-color:rgba(168,85,247,.5);background:rgba(168,85,247,.09);
          color:#fff;box-shadow:0 0 22px rgba(168,85,247,.1)}
        .ctab-flag{font-size:1.2rem;line-height:1;
          font-family:'Segoe UI Emoji','Apple Color Emoji','Noto Color Emoji','Android Emoji',sans-serif}
        .ctab-img{width:22px;height:16px;border-radius:2px;object-fit:cover;flex-shrink:0}

        /* ── MODE TOGGLE ── */
        .mode-toggle{display:flex;gap:6px;margin-bottom:26px;flex-wrap:wrap}
        .mtoggle{padding:7px 16px;border-radius:8px;border:1px solid var(--border);
          background:transparent;cursor:pointer;font-family:'JetBrains Mono',monospace;
          font-size:.65rem;letter-spacing:.1em;text-transform:uppercase;color:var(--muted);transition:all .2s}
        .mtoggle:hover{border-color:rgba(168,85,247,.3)}
        .mtoggle.active{border-color:rgba(168,85,247,.5);background:rgba(168,85,247,.1);color:#fff;font-weight:600}

        /* ── MAP SHELL ── */
        .map-shell{background:var(--bg2);border:1px solid var(--border);border-radius:24px;
          overflow:hidden;box-shadow:0 40px 100px rgba(0,0,0,.5);position:relative;margin-bottom:28px}
        .map-shell::before{content:'';position:absolute;inset:0;
          background:radial-gradient(ellipse at 50% 0%,rgba(168,85,247,.04),transparent 55%);
          pointer-events:none;z-index:0}
        .map-topbar{position:relative;z-index:1;display:flex;align-items:center;justify-content:space-between;
          padding:14px 28px;border-bottom:1px solid var(--border);background:rgba(255,255,255,.015);flex-wrap:wrap;gap:8px}
        .map-indicator{display:flex;align-items:center;gap:8px;font-size:.73rem;font-family:'JetBrains Mono',monospace;color:var(--muted)}
        .map-dot{width:7px;height:7px;border-radius:50%;background:var(--teal);
          animation:pulse-dot 2s infinite;flex-shrink:0}
        .map-src{font-family:'JetBrains Mono',monospace;font-size:.6rem;color:rgba(255,255,255,.2);letter-spacing:.06em}
        .map-body{padding:24px 32px;position:relative;z-index:1}
        .map-svg-wrap{display:flex;justify-content:center;align-items:center;min-height:380px}
        .map-svg-wrap svg{width:100%;max-width:820px;height:auto;display:block}
        .region{cursor:pointer;transition:opacity .18s,stroke .18s;}
        .region:hover{opacity:1!important;}
        .map-legend{display:flex;align-items:center;justify-content:center;gap:10px;
          margin-top:16px;font-family:'JetBrains Mono',monospace;font-size:.6rem;
          color:var(--muted);flex-wrap:wrap;letter-spacing:.06em}
        .leg-item{display:flex;align-items:center;gap:5px}
        .leg-sw{width:26px;height:5px;border-radius:3px}

        /* ── TOOLTIP ── */
        #tooltip{position:fixed;z-index:9999;pointer-events:none;
          background:rgba(4,8,18,.98);backdrop-filter:blur(28px) saturate(180%);
          border:1px solid rgba(168,85,247,.32);border-radius:16px;
          padding:18px 20px;min-width:240px;max-width:300px;
          box-shadow:0 30px 80px rgba(0,0,0,.75),0 0 40px rgba(168,85,247,.08);}
        .tt-head{margin-bottom:14px;padding-bottom:10px;border-bottom:1px solid rgba(255,255,255,.06)}
        .tt-region{font-family:'Bebas Neue',sans-serif;font-size:1.3rem;color:#fff;letter-spacing:.04em;line-height:1;margin-bottom:3px}
        .tt-country{font-size:.6rem;font-family:'JetBrains Mono',monospace;color:var(--muted);letter-spacing:.08em;
          font-family:'Segoe UI Emoji','Apple Color Emoji','Noto Color Emoji',monospace}
        .tt-row{display:flex;align-items:center;justify-content:space-between;margin-bottom:9px}
        .tt-lbl{font-family:'JetBrains Mono',monospace;font-size:.6rem;color:var(--muted);letter-spacing:.05em}
        .tt-right{display:flex;align-items:center;gap:8px}
        .tt-bar-bg{width:72px;height:3px;background:rgba(255,255,255,.08);border-radius:2px;overflow:hidden;flex-shrink:0}
        .tt-bar-fill{height:100%;border-radius:2px;transition:width .3s}
        .tt-val{font-family:'JetBrains Mono',monospace;font-size:.7rem;font-weight:600;min-width:26px;text-align:right}
        .tt-meta{display:grid;grid-template-columns:1fr 1fr;gap:7px;margin-top:10px;padding-top:10px;border-top:1px solid rgba(255,255,255,.06)}
        .tt-meta-item{background:rgba(255,255,255,.03);border-radius:7px;padding:7px 9px}
        .tt-meta-lbl{font-family:'JetBrains Mono',monospace;font-size:.55rem;color:var(--muted);letter-spacing:.08em;margin-bottom:3px}
        .tt-meta-val{font-size:.78rem;font-weight:600;color:#fff}
        .tt-tip{font-size:.72rem;color:var(--muted);line-height:1.55;margin-top:10px;
          padding-top:10px;border-top:1px solid rgba(255,255,255,.06);font-style:italic}

        /* ── REALITY GRID ── */
        .reality-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:28px}
        @media(max-width:800px){.reality-grid{grid-template-columns:1fr 1fr}}
        .rc-card{background:var(--bg2);border:1px solid var(--border);border-radius:16px;
          padding:20px;text-align:center;position:relative;overflow:hidden;transition:border-color .2s}
        .rc-card:hover{border-color:rgba(255,255,255,.12)}
        .rc-ico{font-size:1.9rem;margin-bottom:10px;
          font-family:'Segoe UI Emoji','Apple Color Emoji','Noto Color Emoji',sans-serif}
        .rc-val{font-family:'Bebas Neue',sans-serif;font-size:2rem;line-height:1;margin-bottom:5px}
        .rc-lbl{font-size:.6rem;font-family:'JetBrains Mono',monospace;color:var(--muted);letter-spacing:.1em;text-transform:uppercase}
        .rc-stripe{position:absolute;bottom:0;left:0;right:0;height:2px}

        /* ── SCORE GRID ── */
        .score-grid{display:grid;grid-template-columns:1fr 1fr;gap:18px;margin-bottom:28px}
        @media(max-width:800px){.score-grid{grid-template-columns:1fr}}
        .score-card{background:var(--bg2);border:1px solid var(--border);border-radius:20px;padding:26px;position:relative;overflow:hidden}
        .score-card::before{content:'';position:absolute;inset:0;
          background:radial-gradient(ellipse at 0% 0%,rgba(168,85,247,.04),transparent 60%);pointer-events:none}
        .sc-title{font-family:'Bebas Neue',sans-serif;font-size:1.25rem;letter-spacing:.04em;
          color:#fff;margin-bottom:20px;display:flex;align-items:center;gap:8px}
        .sr-row{display:flex;align-items:center;gap:10px;margin-bottom:13px}
        .sr-row:last-child{margin-bottom:0}
        .sr-lbl{font-family:'JetBrains Mono',monospace;font-size:.62rem;color:var(--muted);
          letter-spacing:.05em;width:128px;flex-shrink:0}
        .sr-bar-bg{flex:1;height:5px;background:rgba(255,255,255,.07);border-radius:3px;overflow:hidden}
        .sr-bar-fill{height:100%;border-radius:3px;transition:width 1s cubic-bezier(.4,0,.2,1)}
        .sr-val{font-family:'JetBrains Mono',monospace;font-size:.7rem;font-weight:600;width:28px;text-align:right}
        .sr-badge{font-family:'JetBrains Mono',monospace;font-size:.52rem;padding:2px 6px;
          border-radius:3px;border:1px solid;letter-spacing:.05em;flex-shrink:0;white-space:nowrap}

        /* ── WORK RIGHTS ── */
        .work-shell{background:var(--bg2);border:1px solid var(--border);border-radius:24px;overflow:hidden;margin-bottom:28px}
        .work-header{padding:22px 30px;border-bottom:1px solid var(--border);
          display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px}
        .work-hed-title{font-family:'Bebas Neue',sans-serif;font-size:1.5rem;color:#fff;letter-spacing:.04em;
          font-family:'Segoe UI Emoji','Apple Color Emoji','Noto Color Emoji','Bebas Neue',sans-serif}
        .work-hed-sub{font-size:.68rem;color:var(--muted);font-family:'JetBrains Mono',monospace;margin-top:2px}
        .work-badge{display:inline-flex;align-items:center;gap:6px;padding:5px 12px;border-radius:6px;
          background:rgba(0,245,212,.07);border:1px solid rgba(0,245,212,.18);
          font-size:.68rem;font-family:'JetBrains Mono',monospace;color:var(--teal)}
        .work-grid{display:grid;grid-template-columns:repeat(3,1fr);padding:22px 30px;gap:14px}
        @media(max-width:900px){.work-grid{grid-template-columns:1fr 1fr}}
        @media(max-width:560px){.work-grid{grid-template-columns:1fr}}
        .work-item{background:var(--bg3);border:1px solid var(--border);border-radius:14px;padding:18px;transition:border-color .2s}
        .work-item:hover{border-color:rgba(168,85,247,.25)}
        .wi-ico{font-size:1.6rem;margin-bottom:10px;
          font-family:'Segoe UI Emoji','Apple Color Emoji','Noto Color Emoji',sans-serif}
        .wi-label{font-size:.58rem;font-family:'JetBrains Mono',monospace;color:var(--muted);letter-spacing:.1em;margin-bottom:5px}
        .wi-val{font-family:'Bebas Neue',sans-serif;font-size:1.35rem;color:#fff;letter-spacing:.03em;line-height:1.1;margin-bottom:5px}
        .wi-sub{font-size:.7rem;color:var(--muted);line-height:1.55}
        .wi-tag{display:inline-flex;margin-top:9px;font-size:.57rem;font-family:'JetBrains Mono',monospace;
          padding:2px 8px;border-radius:3px;letter-spacing:.06em;border:1px solid}

        /* ── INSIDER TIPS ── */
        .tips-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-bottom:28px}
        @media(max-width:900px){.tips-grid{grid-template-columns:1fr}}
        .tip-card{background:var(--bg2);border:1px solid var(--border);border-radius:16px;overflow:hidden;transition:all .2s}
        .tip-card:hover{transform:translateY(-3px);border-color:rgba(168,85,247,.28);
          box-shadow:0 12px 36px rgba(168,85,247,.1)}
        .tc-head{padding:18px 22px;border-bottom:1px solid var(--border);display:flex;align-items:flex-start;gap:12px}
        .tc-num{font-family:'Bebas Neue',sans-serif;font-size:2.2rem;color:rgba(168,85,247,.22);line-height:1;flex-shrink:0}
        .tc-title{font-size:.88rem;font-weight:700;color:#fff;margin-bottom:3px;line-height:1.3}
        .tc-tag{font-family:'JetBrains Mono',monospace;font-size:.58rem;color:var(--purple);
          letter-spacing:.06em;background:rgba(168,85,247,.08);padding:2px 6px;border-radius:3px;display:inline-block}
        .tc-body{padding:16px 22px;font-size:.78rem;color:var(--muted);line-height:1.68}
        .tc-body strong{color:var(--text)}

        /* ── CTA ── */
        .cta-section{background:linear-gradient(135deg,rgba(168,85,247,.08),rgba(0,245,212,.05));
          border:1px solid rgba(168,85,247,.18);border-radius:24px;padding:60px;text-align:center;
          margin:0 60px 80px;position:relative;overflow:hidden}
        @media(max-width:768px){.cta-section{margin:0 24px 60px;padding:40px 24px}}
        .cta-section::before{content:'';position:absolute;inset:0;
          background:radial-gradient(ellipse at 50% -20%,rgba(168,85,247,.1),transparent 60%)}
        .cta-title{font-family:'Bebas Neue',sans-serif;font-size:clamp(28px,4vw,58px);
          color:#fff;letter-spacing:.02em;margin-bottom:12px;position:relative}
        .cta-title .g{background:linear-gradient(90deg,var(--purple),var(--teal));
          -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
        .cta-sub{color:var(--muted);font-size:.98rem;margin-bottom:26px;position:relative}
        .cta-btns{display:flex;gap:12px;justify-content:center;flex-wrap:wrap;position:relative}
        .cta-btn-main{padding:14px 32px;border-radius:10px;border:none;background:var(--teal);
          color:#060c14;font-family:'Syne',sans-serif;font-size:.9rem;font-weight:700;cursor:pointer;
          transition:all .2s;text-decoration:none;display:inline-flex;align-items:center}
        .cta-btn-main:hover{transform:translateY(-2px);box-shadow:0 12px 30px rgba(0,245,212,.3)}
        .cta-btn-ghost{padding:14px 32px;border-radius:10px;border:1px solid rgba(255,255,255,.14);
          background:none;color:#fff;font-family:'Syne',sans-serif;font-size:.9rem;font-weight:600;
          cursor:pointer;transition:all .2s}
        .cta-btn-ghost:hover{border-color:rgba(255,255,255,.28);background:rgba(255,255,255,.04)}

        /* ── ANIMATIONS ── */
        @keyframes fade-up-in{from{opacity:0;transform:translateY(22px)}to{opacity:1;transform:translateY(0)}}
        .anim{animation:fade-up-in .6s ease both}
        .d1{animation-delay:.05s}.d2{animation-delay:.12s}.d3{animation-delay:.2s}.d4{animation-delay:.28s}
      `}} />

      <div className="grid-bg"></div>
      <div className="glow-orb orb1"></div>
      <div className="glow-orb orb2"></div>
      <div className="glow-orb orb3"></div>

      {/* ═══ NAV ═══ */}
      <nav>
        <a href="/" className="nav-logo">
          <div className="logo-icon">
            <svg viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 2L16 9L9 16L2 9Z" fill="white" fillOpacity="0.9" />
            </svg>
          </div>
          <span className="logo-text">Mentor<em>Bridge</em></span>
        </a>
        <div className="nav-links">
          <a href="/mentors">Mentors</a>
          <a href="/roadmap">Roadmap</a>
          <a href="/tools/survival-sim">Survival Sim</a>
          <a href="/country-intelligence" className="active">Country Intel</a>
          <a href="/scholarships">Scholarships</a>
          <a href="/market-insights">Market Data</a>
        </div>
        <div className="nav-actions">
          <a href="/login" className="btn-ghost-nav">Log in</a>
          <a href="/signup" className="btn-primary-nav">Sign up</a>
        </div>
      </nav>

      <main>
        {/* ═══ HERO ═══ */}
        <div className="hero anim">
          <div className="hero-badge">SAFETY · JOBS · REALITY CHECK · 2024 DATA</div>
          <div className="hero-title">
            THE TRUTH ABOUT<br />
            <span className="a1">STUDYING</span> <span className="a2">ABROAD</span>
          </div>
          <p className="hero-sub">Safety scores, work rights, job markets and insider tips — the data your university brochure never shows Indian students. Hover any region to see the full picture.</p>
          <div className="hero-stats">
            <div><div className="hs-val">5</div><div className="hs-lbl">Countries Mapped</div></div>
            <div><div className="hs-val">38+</div><div className="hs-lbl">Regions Analysed</div></div>
            <div><div className="hs-val">6</div><div className="hs-lbl">Data Dimensions</div></div>
            <div><div className="hs-val">2024</div><div className="hs-lbl">Last Updated</div></div>
          </div>
        </div>

        {/* ═══ MAP SECTION ═══ */}
        <div className="section anim d1">
          <div className="section-label">INTERACTIVE HEATMAP · HOVER TO EXPLORE</div>
          <div className="section-title">PICK A COUNTRY</div>
          <p className="section-sub">Select a country then toggle between Safety, Job Market, and Indian Community data. Every region tells a different story.</p>

          <div className="country-tabs" id="country-tabs">
            <button className={`ctab ${curCountry === 'usa' ? 'active' : ''}`} onClick={() => setCurCountry('usa')}>
              <img className="ctab-img" src="https://flagcdn.com/24x18/us.png" alt="US" onError={(e) => e.target.style.display='none'} />
              USA
            </button>
            <button className={`ctab ${curCountry === 'germany' ? 'active' : ''}`} onClick={() => setCurCountry('germany')}>
              <img className="ctab-img" src="https://flagcdn.com/24x18/de.png" alt="DE" onError={(e) => e.target.style.display='none'} />
              Germany
            </button>
            <button className={`ctab ${curCountry === 'uk' ? 'active' : ''}`} onClick={() => setCurCountry('uk')}>
              <img className="ctab-img" src="https://flagcdn.com/24x18/gb.png" alt="GB" onError={(e) => e.target.style.display='none'} />
              United Kingdom
            </button>
            <button className={`ctab ${curCountry === 'canada' ? 'active' : ''}`} onClick={() => setCurCountry('canada')}>
              <img className="ctab-img" src="https://flagcdn.com/24x18/ca.png" alt="CA" onError={(e) => e.target.style.display='none'} />
              Canada
            </button>
            <button className={`ctab ${curCountry === 'australia' ? 'active' : ''}`} onClick={() => setCurCountry('australia')}>
              <img className="ctab-img" src="https://flagcdn.com/24x18/au.png" alt="AU" onError={(e) => e.target.style.display='none'} />
              Australia
            </button>
          </div>

          <div className="mode-toggle">
            <button className={`mtoggle ${curMode === 'safety' ? 'active' : ''}`} onClick={() => setCurMode('safety')}>🛡️ Safety Score</button>
            <button className={`mtoggle ${curMode === 'jobs' ? 'active' : ''}`} onClick={() => setCurMode('jobs')}>💼 Job Market</button>
            <button className={`mtoggle ${curMode === 'community' ? 'active' : ''}`} onClick={() => setCurMode('community')}>👨‍👩‍👧‍👦 Indian Community</button>
          </div>

          <div className="map-shell">
            <div className="map-topbar">
              <div className="map-indicator">
                <div className="map-dot"></div>
                <span id="map-label">{d.mapLabel} — Hover any region to explore</span>
              </div>
              <div className="map-src">SOURCE: NUMBEO 2024 • FBI UCR • OECD • QS DATA</div>
            </div>
            <div className="map-body">
              <div className="map-svg-wrap" id="map-container">
                <svg viewBox={MAPS[curCountry].vb} xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">
                  {MAPS[curCountry].paths.map((p, idx) => {
                    const r = d.regions[p.r];
                    if (!r) {
                      return (
                        <path
                          key={idx}
                          className="region"
                          d={p.d}
                          fill="rgba(255,255,255,.04)"
                          stroke="rgba(255,255,255,.08)"
                          style={{ cursor: 'default' }}
                        />
                      );
                    }
                    const score = curMode === 'safety' ? r.safety : curMode === 'jobs' ? r.jobs : r.community;
                    const col = scoreColor(score);
                    
                    return (
                      <path
                        key={idx}
                        className="region"
                        d={p.d}
                        fill={`${col}40`}
                        stroke={`${col}AA`}
                        style={{ strokeWidth: tooltip.rKey === p.r ? '2.5' : '1.2' }}
                        onMouseEnter={(e) => handleMouseEnter(e, p.r)}
                        onMouseMove={handleMouseMove}
                        onMouseLeave={handleMouseLeave}
                      />
                    );
                  })}
                </svg>
              </div>
              <div className="map-legend">
                <div className="leg-item"><div className="leg-sw" style={{ background: '#00E5A8' }}></div>Excellent (8-10)</div>
                <div className="leg-item"><div className="leg-sw" style={{ background: '#7BC97B' }}></div>Good (6.5-8)</div>
                <div className="leg-item"><div className="leg-sw" style={{ background: '#F59E0B' }}></div>Moderate (5-6.5)</div>
                <div className="leg-item"><div className="leg-sw" style={{ background: '#F97316' }}></div>Caution (3.5-5)</div>
                <div className="leg-item"><div className="leg-sw" style={{ background: '#EF4444' }}></div>High Risk (&lt;3.5)</div>
              </div>
            </div>
          </div>

          <div className="reality-grid" id="reality-grid">
            {d.reality.map((r, i) => (
              <div key={i} className="rc-card">
                <div className="rc-ico">{r.ico}</div>
                <div className="rc-val" style={{ color: r.col }}>{r.val}</div>
                <div className="rc-lbl">{r.lbl}</div>
                <div className="rc-stripe" style={{ background: `linear-gradient(90deg,transparent,${r.col},transparent)` }}></div>
              </div>
            ))}
          </div>

          <div className="score-grid" id="score-grid">
            <div className="score-card">
              <div className="sc-title">📊 {d.name} — Index Scores</div>
              {d.scores.slice(0, mid).map((s, i) => (
                <div key={i} className="sr-row">
                  <span className="sr-lbl">{s.lbl}</span>
                  <div className="sr-bar-bg"><div className="sr-bar-fill" style={{ width: `${s.val * 10}%`, background: s.col }}></div></div>
                  <span className="sr-val" style={{ color: s.col }}>{s.val}</span>
                  <span className="sr-badge" style={{ color: s.bct, borderColor: `${s.bct}55`, background: s.bc }}>{s.badge}</span>
                </div>
              ))}
            </div>
            <div className="score-card">
              <div className="sc-title">📈 Detailed Breakdown</div>
              {d.scores.slice(mid).map((s, i) => (
                <div key={i} className="sr-row">
                  <span className="sr-lbl">{s.lbl}</span>
                  <div className="sr-bar-bg"><div className="sr-bar-fill" style={{ width: `${s.val * 10}%`, background: s.col }}></div></div>
                  <span className="sr-val" style={{ color: s.col }}>{s.val}</span>
                  <span className="sr-badge" style={{ color: s.bct, borderColor: `${s.bct}55`, background: s.bc }}>{s.badge}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ═══ WORK RIGHTS ═══ */}
        <div className="section anim d2">
          <div className="section-label">WORK RIGHTS REALITY</div>
          <div className="section-title">WHAT YOU CAN ACTUALLY DO</div>
          <p className="section-sub">The honest breakdown nobody explains clearly — hours, wages, post-study paths, all in one place.</p>
          <div className="work-shell">
            <div className="work-header">
              <div>
                <div className="work-hed-title" id="work-title">{d.name} Work Rights</div>
                <div className="work-hed-sub" id="work-sub">Based on {d.visaLabel} regulations</div>
              </div>
              <div className="work-badge">✓ VERIFIED • OFFICIAL SOURCES</div>
            </div>
            <div className="work-grid" id="work-grid">
              {d.work.map((w, i) => (
                <div key={i} className="work-item">
                  <div className="wi-ico">{w.ico}</div>
                  <div className="wi-label">{w.lbl}</div>
                  <div className="wi-val">{w.val}</div>
                  <div className="wi-sub">{w.sub}</div>
                  <div className="wi-tag" style={{ background: w.tc, color: w.tv, borderColor: `${w.tv}55` }}>{w.tag}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ═══ INSIDER TIPS ═══ */}
        <div className="section anim d3">
          <div className="section-label">INSIDER INTELLIGENCE</div>
          <div className="section-title">WHAT NOBODY TELLS YOU</div>
          <p className="section-sub">Real advice from Indian students who've lived through it — the things your university brochure always skips.</p>
          <div className="tips-grid" id="tips-grid">
            {d.tips.map((t, i) => (
              <div key={i} className="tip-card">
                <div className="tc-head">
                  <div className="tc-num">{t.num}</div>
                  <div>
                    <div className="tc-title">{t.title}</div>
                    <span className="tc-tag">{t.tag}</span>
                  </div>
                </div>
                <div className="tc-body" dangerouslySetInnerHTML={{ __html: t.body }}></div>
              </div>
            ))}
          </div>
        </div>

        {/* ═══ CTA ═══ */}
        <div className="cta-section anim d4">
          <div className="cta-title">BOOK A MENTOR FROM <span className="g">THIS COUNTRY</span></div>
          <p className="cta-sub">Talk to someone who's navigated safety, jobs, and student life exactly where you're planning to go.</p>
          <div className="cta-btns">
            <a href="/mentors" className="cta-btn-main">Find Country Mentors →</a>
            <button className="cta-btn-ghost" onClick={() => window.location.href='/roadmap'}>Build My Roadmap</button>
          </div>
        </div>
      </main>

      {/* ═══ TOOLTIP ═══ */}
      {tooltip.show && d.regions[tooltip.rKey] && (
        <div id="tooltip" style={{ display: 'block', left: tooltip.x, top: tooltip.y }}>
          <div className="tt-head">
            <div className="tt-region" id="tt-region">{d.regions[tooltip.rKey].name}</div>
            <div className="tt-country" id="tt-country">{d.name.toUpperCase()}</div>
          </div>
          <div id="tt-scores">
            <div className="tt-row">
              <span className="tt-lbl">🛡️ SAFETY</span>
              <div className="tt-right">
                <div className="tt-bar-bg"><div className="tt-bar-fill" style={{ width: `${d.regions[tooltip.rKey].safety * 10}%`, background: scoreColor(d.regions[tooltip.rKey].safety) }}></div></div>
                <span className="tt-val" style={{ color: scoreColor(d.regions[tooltip.rKey].safety) }}>{d.regions[tooltip.rKey].safety}</span>
              </div>
            </div>
            <div className="tt-row">
              <span className="tt-lbl">💼 JOB MARKET</span>
              <div className="tt-right">
                <div className="tt-bar-bg"><div className="tt-bar-fill" style={{ width: `${d.regions[tooltip.rKey].jobs * 10}%`, background: scoreColor(d.regions[tooltip.rKey].jobs) }}></div></div>
                <span className="tt-val" style={{ color: scoreColor(d.regions[tooltip.rKey].jobs) }}>{d.regions[tooltip.rKey].jobs}</span>
              </div>
            </div>
            <div className="tt-row">
              <span className="tt-lbl">👨‍👩‍👧‍👦 COMMUNITY</span>
              <div className="tt-right">
                <div className="tt-bar-bg"><div className="tt-bar-fill" style={{ width: `${d.regions[tooltip.rKey].community * 10}%`, background: scoreColor(d.regions[tooltip.rKey].community) }}></div></div>
                <span className="tt-val" style={{ color: scoreColor(d.regions[tooltip.rKey].community) }}>{d.regions[tooltip.rKey].community}</span>
              </div>
            </div>
          </div>
          <div className="tt-meta" id="tt-meta">
            <div className="tt-meta-item"><div className="tt-meta-lbl">PART-TIME</div><div className="tt-meta-val" style={{ color: '#00f5d4' }}>{d.regions[tooltip.rKey].wage}/hr</div></div>
            <div className="tt-meta-item"><div className="tt-meta-lbl">STUDENTS</div><div className="tt-meta-val">{d.regions[tooltip.rKey].students || '—'}</div></div>
            <div className="tt-meta-item" style={{ gridColumn: '1/-1' }}><div className="tt-meta-lbl">TOP UNIVERSITY</div><div className="tt-meta-val" style={{ fontSize: '.78rem', color: '#a855f7' }}>{d.regions[tooltip.rKey].uni ? d.regions[tooltip.rKey].uni.split(',')[0].trim() : '—'}</div></div>
          </div>
          <div className="tt-tip" id="tt-tip">{d.regions[tooltip.rKey].tip || ''}</div>
        </div>
      )}
    </>
  );
}