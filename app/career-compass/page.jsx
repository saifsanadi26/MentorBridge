'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

// ─── FLAG IMAGE HELPER (flagcdn.com — no emoji, always visible) ───────────────
const FLAG = {
  '🇺🇸': 'us', '🇬🇧': 'gb', '🇩🇪': 'de', '🇦🇺': 'au', '🇨🇦': 'ca',
  '🇫🇷': 'fr', '🇮🇹': 'it', '🇳🇱': 'nl', '🇨🇭': 'ch', '🇸🇪': 'se',
  '🇩🇰': 'dk', '🇧🇪': 'be', '🇮🇪': 'ie', '🇪🇸': 'es', '🇯🇵': 'jp',
  '🇸🇬': 'sg', '🇮🇳': 'in',
}
const FlagImg = ({ code, size = 28 }) => {
  const iso = FLAG[code] || 'un'
  return (
    <img
      src={`https://flagcdn.com/w${size * 2}/${iso}.png`}
      width={size}
      height={Math.round(size * 0.67)}
      alt={code}
      style={{ borderRadius: 3, objectFit: 'cover', display: 'block', border: '1px solid rgba(255,255,255,.15)' }}
      onError={e => { e.currentTarget.style.display = 'none' }}
    />
  )
}

// ─── FULL DECISION MATRIX ────────────────────────────────────────────────────
const MATRIX = {
  'engineering_analyzing_sports_usa_corporate': {
    degree: 'MSc Sports Analytics & Data Science',
    emoji: '🏟',
    tagline: 'Where the stat sheet meets the scoreboard',
    niche: 'Every NBA, NFL, MLB and Premier League team now employs 15–30 data scientists. Sports analytics is a $4.6B industry growing at 31% annually.',
    whyRare: 'Less than 12 accredited programs exist globally. Teams pay $120K+ for entry-level analysts — and there aren\'t enough graduates to fill the roles.',
    salaryFrom: 95000, salaryTo: 185000, currency: '$',
    roiScore: 94, demandScore: 91, rarityScore: 89,
    accentCol: '#00D4FF',
    industries: ['NBA / NFL / EPL', 'Sports Betting', 'Olympic Committees', 'Performance Tech'],
    universities: [
      {
        name: 'University of Michigan', flag: '🇺🇸', city: 'Ann Arbor, Michigan',
        program: 'MSc Sport Management & Analytics', qs: 33, tuition: '$51,200/yr',
        intake: 'Aug', duration: '12–16 months', acceptance: '20%',
        highlight: 'Detroit Lions & Pistons analytics staff recruited directly from Michigan. Heinz College sports policy track.', superpower: 'Industry Access',
        badge: '👑 #1 Sports Analytics USA',
      },
      {
        name: 'Carnegie Mellon', flag: '🇺🇸', city: 'Pittsburgh, Pennsylvania',
        program: 'MSc Statistics with Sports Focus', qs: 52, tuition: '$58,924/yr',
        intake: 'Aug', duration: '16 months', acceptance: '11%',
        highlight: 'Pittsburgh Steelers data partnership. 100% of CMU quant graduates placed in top firms or sports organisations.', superpower: 'Quant Depth',
        badge: '⚡ #1 CS + Analytics USA',
      },
      {
        name: 'Loughborough University', flag: '🇬🇧', city: 'Loughborough, England',
        program: 'MSc Sport Analytics', qs: 801, tuition: '£18,500/yr',
        intake: 'Sep', duration: '12 months', acceptance: '49%',
        highlight: 'Olympic training centre on campus. Premier League clubs (Leicester, Nottingham) use Loughborough graduates as first hire.', superpower: 'Olympic Network',
        badge: '🏅 #1 Sports Science UK',
      },
      {
        name: 'RMIT University', flag: '🇦🇺', city: 'Melbourne, Australia',
        program: 'MSc Sport Analytics', qs: 120, tuition: 'A$38,000/yr',
        intake: 'Feb', duration: '18 months', acceptance: '68%',
        highlight: 'AFL, Cricket Australia and Tennis Australia all partner directly. Melbourne hosts F1, Australian Open, AFL Grand Final.', superpower: 'Southern Hemisphere Hub',
        badge: '🎾 #1 Sports Analytics AUS',
      },
      {
        name: 'Northwestern University', flag: '🇺🇸', city: 'Evanston, Illinois',
        program: 'MSc Sports Administration', qs: 97, tuition: '$54,000/yr',
        intake: 'Sep', duration: '12 months', acceptance: '10%',
        highlight: 'Chicago Bulls, Cubs, Bears, Blackhawks — 5 major league teams within 30 minutes. NBC Sports and ESPN digital offices nearby.', superpower: 'Chicago Sports Ecosystem',
        badge: '🏙 Chicago Media Capital',
      },
    ],
    careers: [{ title: 'Performance Data Analyst', co: 'NBA / NFL' }, { title: 'Head of Analytics', co: 'Premier League Club' }, { title: 'Sports Betting Quant', co: 'Bet365 / DraftKings' }, { title: 'Performance Director', co: 'Olympic Committee' }],
  },

  'engineering_designing_fashion_uk_corporate': {
    degree: 'MSc Luxury Brand Management & Design Tech',
    emoji: '💎',
    tagline: 'Where Silicon Valley meets Bond Street',
    niche: 'LVMH, Richemont and Kering are spending billions on digital transformation. They can\'t find engineers who understand luxury. You would be a unicorn.',
    whyRare: '99% of engineers don\'t understand luxury. 99% of fashion graduates can\'t code. You sit at the most lucrative intersection in the creative economy.',
    salaryFrom: 85000, salaryTo: 200000, currency: '€',
    roiScore: 91, demandScore: 88, rarityScore: 97,
    accentCol: '#FF6B9D',
    industries: ['LVMH Group', 'Richemont', 'Kering', 'Luxury E-Commerce'],
    universities: [
      {
        name: 'HEC Paris', flag: '🇫🇷', city: 'Jouy-en-Josas, France',
        program: 'MSc Management of Luxury & Creative Industries', qs: 41, tuition: '€32,000/yr',
        intake: 'Sep', duration: '12 months', acceptance: '12%',
        highlight: 'LVMH HQ is 30 minutes from campus. The Arnault family (LVMH founder) funds a dedicated chair at HEC. Guest lectures from Dior, Givenchy CEOs.', superpower: 'LVMH Pipeline',
        badge: '👑 Closest MBA to LVMH HQ',
      },
      {
        name: 'London Business School', flag: '🇬🇧', city: 'London, England',
        program: 'MBA — Luxury & Fashion Track', qs: 49, tuition: '£92,000 total',
        intake: 'Sep', duration: '15–21 months', acceptance: '23%',
        highlight: 'London is home to Burberry, Mulberry, Jimmy Choo. LBS Fashion & Luxury Club runs one of the largest luxury case competitions globally.', superpower: 'London Fashion Network',
        badge: '🎩 #1 MBA UK',
      },
      {
        name: 'Royal College of Art', flag: '🇬🇧', city: 'London, England',
        program: 'MA Fashion', qs: 1, tuition: '£26,000/yr',
        intake: 'Sep', duration: '24 months', acceptance: '22%',
        highlight: 'Alexander McQueen, Stella McCartney, Vivienne Westwood, Christopher Kane — ALL alumni. #1 Art & Design university in the world, 8 years running.', superpower: 'Alumni Dynasty',
        badge: '🌍 #1 Art & Design World',
      },
      {
        name: 'Politecnico di Milano', flag: '🇮🇹', city: 'Milan, Italy',
        program: 'MSc Fashion Design & Technology', qs: 123, tuition: '€4,000/yr',
        intake: 'Oct', duration: '24 months', acceptance: '35%',
        highlight: 'Milan Fashion Week on your doorstep. Prada, Gucci, Versace all headquartered in Milan and actively recruit. Virtually free tuition.', superpower: 'Italian Fashion Capital',
        badge: '✂️ Heart of Italian Fashion',
      },
      {
        name: 'Parsons School of Design', flag: '🇺🇸', city: 'New York City, USA',
        program: 'MFA Fashion Design & Technology', qs: 650, tuition: '$56,000/yr',
        intake: 'Sep', duration: '24 months', acceptance: '35%',
        highlight: 'Amazon Fashion Lab partner. Located in Manhattan — Bergdorf Goodman, Saks Fifth Avenue, Tiffany all within walking distance. LVMH recruits here annually.', superpower: 'NYC Fashion Week Access',
        badge: '🗽 Manhattan Fashion Hub',
      },
    ],
    careers: [{ title: 'Digital Innovation Director', co: 'LVMH' }, { title: 'Head of Product', co: 'Net-A-Porter' }, { title: 'Design Technology Lead', co: 'Richemont' }, { title: 'Chief Digital Officer', co: 'Fashion House' }],
  },

  'business_analyzing_climate_europe_startup': {
    degree: 'MSc Sustainable Finance & Climate Economics',
    emoji: '🌍',
    tagline: '$100 trillion in assets being reallocated by 2030',
    niche: 'Climate finance is the fastest-growing sector in global finance. Every major bank now has an ESG team — and they cannot find enough people.',
    whyRare: 'ESG analysts are the rarest species in finance. Bloomberg reports 8 open roles for every qualified candidate. Starting salaries 40% above standard finance.',
    salaryFrom: 75000, salaryTo: 165000, currency: '€',
    roiScore: 92, demandScore: 96, rarityScore: 84,
    accentCol: '#00E5A8',
    industries: ['Sovereign Wealth Funds', 'ESG Investment Firms', 'Central Banks', 'Climate Startups'],
    universities: [
      {
        name: 'LSE London', flag: '🇬🇧', city: 'London, England',
        program: 'MSc Climate Change & Finance', qs: 45, tuition: '£27,000/yr',
        intake: 'Sep', duration: '12 months', acceptance: '28%',
        highlight: 'Grantham Research Institute on Climate Change — world\'s leading climate economics unit. BlackRock, HSBC and Standard Chartered ESG teams recruit here annually.', superpower: 'ESG Finance Powerhouse',
        badge: '💷 #1 Climate Finance UK',
      },
      {
        name: 'ETH Zurich', flag: '🇨🇭', city: 'Zurich, Switzerland',
        program: 'MSc Energy Science — Finance Track', qs: 6, tuition: '€1,500/yr',
        intake: 'Sep', duration: '24 months', acceptance: '25%',
        highlight: 'UBS, Credit Suisse (now UBS), and Julius Baer are all in Zurich. ETH\'s Climate Finance Lab has €50M research funding. Near-zero tuition at one of the world\'s top 10 universities.', superpower: 'Swiss Banking + Free Tuition',
        badge: '🏔 #6 World + €1.5K Tuition',
      },
      {
        name: 'Copenhagen Business School', flag: '🇩🇰', city: 'Copenhagen, Denmark',
        program: 'MSc Sustainable Finance', qs: 295, tuition: '€0 (EU) / €17K (intl)',
        intake: 'Sep', duration: '24 months', acceptance: '40%',
        highlight: 'Denmark generates 50% of its electricity from wind. Ørsted — the world\'s most sustainable energy company — is headquartered here and recruits from CBS.', superpower: 'World\'s Greenest Economy',
        badge: '💨 Wind Energy Capital',
      },
      {
        name: 'University of Oxford', flag: '🇬🇧', city: 'Oxford, England',
        program: 'MSc Environmental Change & Management', qs: 3, tuition: '£30,000/yr',
        intake: 'Oct', duration: '12 months', acceptance: '17%',
        highlight: 'Oxford Smith School of Enterprise and the Environment. Shell, BP, and the Green Investment Group all send senior executives to lecture here. Policy access to UK Parliament.', superpower: 'World\'s Most Recognised Brand',
        badge: '🏛 #3 World — Oxford',
      },
      {
        name: 'Bocconi University', flag: '🇮🇹', city: 'Milan, Italy',
        program: 'MSc Finance with ESG Specialisation', qs: 131, tuition: '€14,000/yr',
        intake: 'Sep', duration: '24 months', acceptance: '20%',
        highlight: 'European Central Bank internship programme. Milan is home to Mediobanca, UniCredit, and the Italian Stock Exchange. Bocconi places directly into ECB green finance.', superpower: 'European Central Bank Pipeline',
        badge: '🇪🇺 ECB Green Finance Gateway',
      },
    ],
    careers: [{ title: 'ESG Portfolio Manager', co: 'BlackRock' }, { title: 'Green Bond Analyst', co: 'Goldman Sachs' }, { title: 'Climate Risk Officer', co: 'Central Bank' }, { title: 'Head of Sustainability', co: 'Fortune 500' }],
  },

  'sciences_analyzing_healthcare_usa_research': {
    degree: 'MSc Biomedical Data Science & Health Informatics',
    emoji: '🧬',
    tagline: 'The rarest combination in the world\'s largest industry',
    niche: 'The $8 trillion healthcare industry is drowning in data. Scientists who code and understand biology are the most sought-after professionals alive.',
    whyRare: 'Pfizer, J&J, Roche are each building 500-person data science teams and cannot fill them. Average salary: $145K in year 2 of your career.',
    salaryFrom: 110000, salaryTo: 225000, currency: '$',
    roiScore: 97, demandScore: 99, rarityScore: 92,
    accentCol: '#A78BFA',
    industries: ['Big Pharma', 'Health AI Startups', 'NIH / WHO', 'Digital Health Unicorns'],
    universities: [
      {
        name: 'Harvard University', flag: '🇺🇸', city: 'Cambridge, Massachusetts',
        program: 'MS Biomedical Informatics', qs: 4, tuition: '$54,768/yr',
        intake: 'Sep', duration: '18 months', acceptance: '3.2%',
        highlight: 'Harvard Medical School and the Broad Institute (genomics) are on the same campus. Direct NIH research funding. 161 Nobel Laureates in the alumni network.', superpower: 'Medicine + Data + Network',
        badge: '🏆 161 Nobel Laureates',
      },
      {
        name: 'Stanford University', flag: '🇺🇸', city: 'Palo Alto, California',
        program: 'MS Biomedical Data Science', qs: 3, tuition: '$56,169/yr',
        intake: 'Sep', duration: '18 months', acceptance: '3.7%',
        highlight: 'Stanford Medicine AI Lab sits between UCSF (world\'s top medical school) and Silicon Valley. Google Health, Verily, 23andMe all recruit here. Start funding a health startup from your dorm room.', superpower: 'Silicon Valley + Medicine',
        badge: '🌁 Silicon Valley Health Hub',
      },
      {
        name: 'Johns Hopkins University', flag: '🇺🇸', city: 'Baltimore, Maryland',
        program: 'MS Bioinformatics', qs: 26, tuition: '$59,000/yr',
        intake: 'Aug', duration: '16 months', acceptance: '11%',
        highlight: 'Bloomberg School of Public Health — ranked #1 in the world. WHO and CDC offices cooperate directly with Hopkins. Every pharmaceutical clinical trial uses Hopkins bioinformatics methods.', superpower: 'Public Health Gold Standard',
        badge: '🏥 #1 Public Health Globally',
      },
      {
        name: 'ETH Zurich', flag: '🇨🇭', city: 'Zurich, Switzerland',
        program: 'MSc Computational Biology & Bioinformatics', qs: 6, tuition: '€1,500/yr',
        intake: 'Sep', duration: '24 months', acceptance: '25%',
        highlight: 'Basel — 20 minutes from Zurich — is the global pharmaceutical capital. Novartis, Roche, Lonza all headquartered there. Near-free tuition, world-class research, European work rights.', superpower: 'Basel Pharma Capital',
        badge: '💊 World Pharma HQ Nearby',
      },
      {
        name: 'UC San Francisco / Berkeley', flag: '🇺🇸', city: 'San Francisco, California',
        program: 'MS Computational Precision Health', qs: 10, tuition: '$28,000/yr',
        intake: 'Aug', duration: '12 months', acceptance: '14%',
        highlight: 'Mission Bay in San Francisco is the most concentrated biotech cluster on earth. Genentech (Roche), Gilead, 23andMe, Moderna SF — all within cycling distance.', superpower: 'Biotech Cluster of the World',
        badge: '🔬 Planet\'s Biotech Capital',
      },
    ],
    careers: [{ title: 'Computational Biologist', co: 'Pfizer / Roche' }, { title: 'Health AI Scientist', co: 'Google Health' }, { title: 'Clinical Data Scientist', co: 'Johnson & Johnson' }, { title: 'Bioinformatics Lead', co: 'Moderna / BioNTech' }],
  },

  'arts_designing_gaming_usa_startup': {
    degree: 'MFA Game Design & Interactive Experience',
    emoji: '🎮',
    tagline: 'The world\'s most engaging medium needs its best designers',
    niche: 'Gaming is a $217B industry — bigger than movies and music combined. The metaverse, VR, and AI games are creating 10x demand for designers who code.',
    whyRare: 'Lead game designers at AAA studios earn $180K+. Roblox, Epic, Riot pay senior UX designers $200K+. The field is massively underpopulated.',
    salaryFrom: 85000, salaryTo: 195000, currency: '$',
    roiScore: 88, demandScore: 85, rarityScore: 80,
    accentCol: '#F59E0B',
    industries: ['AAA Game Studios', 'Metaverse Platforms', 'VR / AR Startups', 'Esports Organisations'],
    universities: [
      {
        name: 'USC School of Cinematic Arts', flag: '🇺🇸', city: 'Los Angeles, California',
        program: 'MFA Game Design', qs: 134, tuition: '$64,000/yr',
        intake: 'Aug', duration: '24 months', acceptance: '21%',
        highlight: 'EA, Activision Blizzard, Riot Games, Naughty Dog — all in LA and attend USC career fairs every semester. George Lucas donated $175M to USC. Best Hollywood + Games overlap anywhere.', superpower: 'LA Games & Film Overlap',
        badge: '🎬 Hollywood + Gaming',
      },
      {
        name: 'Carnegie Mellon ETC', flag: '🇺🇸', city: 'Pittsburgh, Pennsylvania',
        program: 'Master of Entertainment Technology', qs: 52, tuition: '$58,924/yr',
        intake: 'Aug', duration: '24 months', acceptance: '16%',
        highlight: 'Entertainment Technology Center — the most famous game programme in the world. Disney, Pixar, and Valve all co-fund research projects. Randy Pausch (The Last Lecture) created this programme.', superpower: 'Disney + Pixar + Valve',
        badge: '🏰 Created by Randy Pausch',
      },
      {
        name: 'Uppsala University', flag: '🇸🇪', city: 'Uppsala / Stockholm, Sweden',
        program: 'MSc Game Design', qs: 408, tuition: '€0 (EU) / SEK 145K',
        intake: 'Sep', duration: '24 months', acceptance: '55%',
        highlight: 'Stockholm is the gaming capital of Europe. DICE (Battlefield), King (Candy Crush), Mojang (Minecraft), Paradox Interactive — all headquartered here. Near-free tuition with easy work permit after graduation.', superpower: 'European Gaming Capital',
        badge: '⚔️ Minecraft Made Here',
      },
      {
        name: 'DigiPen Institute', flag: '🇺🇸', city: 'Redmond, Washington',
        program: 'MS Computer Science in Game Design', qs: 900, tuition: '$36,000/yr',
        intake: 'Aug', duration: '24 months', acceptance: '45%',
        highlight: '75% of graduates work at Nintendo (HQ literally next door), Microsoft Xbox, Valve, Blizzard. Located in Redmond — same city as Microsoft\'s global headquarters and Xbox division.', superpower: 'Nintendo Campus Neighbour',
        badge: '🎮 Nintendo HQ Next Door',
      },
      {
        name: 'Abertay University', flag: '🇬🇧', city: 'Dundee, Scotland',
        program: 'MSc Game Design & Production', qs: 1000, tuition: '£14,000/yr',
        intake: 'Sep', duration: '12 months', acceptance: '65%',
        highlight: 'First university in the world to offer a degree in computer game development. Rockstar Games North (GTA) was born in Dundee. Ubisoft, Outplay Entertainment all recruit here.', superpower: 'GTA Was Born Here',
        badge: '🏴󠁧󠁢󠁳󠁣󠁴󠁿 Grand Theft Auto\'s Birthplace',
      },
    ],
    careers: [{ title: 'Lead Game Designer', co: 'Epic / Riot / EA' }, { title: 'UX Director', co: 'Meta Horizon' }, { title: 'Creative Director', co: 'Mobile Gaming Studio' }, { title: 'XR Experience Designer', co: 'Apple Vision Pro' }],
  },

  'engineering_building_fintech_usa_startup': {
    degree: 'MEng Financial Engineering & Quantitative Finance',
    emoji: '📈',
    tagline: 'The highest-paid engineering discipline on earth',
    niche: 'Quant finance is the intersection of mathematics, computer science, and markets. Hedge funds pay engineers $500K+ in their second year.',
    whyRare: 'Renaissance Technologies, Two Sigma, Citadel only hire from 8 universities in the world. If you can code AND do stochastic calculus, you are unreachable.',
    salaryFrom: 150000, salaryTo: 650000, currency: '$',
    roiScore: 99, demandScore: 82, rarityScore: 99,
    accentCol: '#FBBF24',
    industries: ['Hedge Funds (Two Sigma, Citadel)', 'HFT Firms', 'Investment Banks', 'Crypto Trading Firms'],
    universities: [
      {
        name: 'Carnegie Mellon', flag: '🇺🇸', city: 'Pittsburgh, Pennsylvania',
        program: 'MSc Computational Finance (MSCF)', qs: 52, tuition: '$58,924/yr',
        intake: 'Aug', duration: '16 months', acceptance: '8%',
        highlight: 'The MSCF programme has 100% placement. Average Day-1 salary: $185,000. Renaissance Technologies, Two Sigma, Citadel, and Goldman Sachs all recruit exclusively from this programme.', superpower: '$185K Day-1 Salary',
        badge: '💰 100% Placement, Avg $185K',
      },
      {
        name: 'MIT', flag: '🇺🇸', city: 'Cambridge, Massachusetts',
        program: 'MSc Computational Finance', qs: 1, tuition: '$57,986/yr',
        intake: 'Sep', duration: '18 months', acceptance: '4%',
        highlight: 'Renaissance Technologies was co-founded by MIT mathematics professors. MIT Sloan quant finance alumni network spans every major hedge fund. 97 Nobel Laureates in faculty and alumni.', superpower: 'Renaissance Technologies DNA',
        badge: '🏆 #1 World — MIT',
      },
      {
        name: 'Columbia University', flag: '🇺🇸', city: 'New York City, USA',
        program: 'MSc Financial Engineering', qs: 12, tuition: '$61,850/yr',
        intake: 'Sep', duration: '12 months', acceptance: '11%',
        highlight: 'Goldman Sachs, JPMorgan, Morgan Stanley, Citadel — all headquartered within 2 miles of Columbia\'s campus in Manhattan. Wall Street is literally a subway ride away.', superpower: 'Wall Street Zip Code',
        badge: '🗽 Walk to Goldman Sachs',
      },
      {
        name: 'Imperial College London', flag: '🇬🇧', city: 'London, England',
        program: 'MSc Mathematics & Finance', qs: 8, tuition: '£37,000/yr',
        intake: 'Sep', duration: '12 months', acceptance: '14%',
        highlight: 'London hedge fund cluster: Winton Capital, Man Group, Marshall Wace, Brevan Howard. Canary Wharf (Europe\'s financial district) is 30 minutes by Tube. European passport + London salary.', superpower: 'London Hedge Fund Cluster',
        badge: '🎩 City of London Access',
      },
      {
        name: 'Cornell Tech', flag: '🇺🇸', city: 'New York City (Roosevelt Island)',
        program: 'MSc Financial Engineering', qs: 13, tuition: '$59,316/yr',
        intake: 'Aug', duration: '12 months', acceptance: '10%',
        highlight: 'Cornell Tech campus sits on Roosevelt Island — inside New York City. The only Ivy League campus embedded in a tech startup hub. Bloomberg LP is a major funder and recruiter.', superpower: 'Ivy League Inside NYC',
        badge: '🌆 Ivy League + NYC Tech',
      },
    ],
    careers: [{ title: 'Quantitative Researcher', co: 'Two Sigma / Renaissance' }, { title: 'Algo Trader', co: 'Citadel / Jane Street' }, { title: 'Risk Engineer', co: 'Goldman Sachs' }, { title: 'Quant Developer', co: 'Bridgewater' }],
  },

  'default': {
    degree: 'Interdisciplinary Masters — Your Unique Intersection',
    emoji: '🧭',
    tagline: 'The most valuable careers live at intersections nobody else occupies',
    niche: 'Your combination of skills and interests points to an emerging field. These programs are the most valuable precisely because so few students know they exist.',
    whyRare: 'The highest-paying careers of the next decade are all at intersections: data + law, engineering + psychology, business + climate. Being the bridge is priceless.',
    salaryFrom: 80000, salaryTo: 175000, currency: '$',
    roiScore: 85, demandScore: 88, rarityScore: 82,
    accentCol: '#00D4FF',
    industries: ['Tech Consulting', 'Innovation Strategy', 'Policy & Government', 'Digital Transformation'],
    universities: [
      {
        name: 'University of Edinburgh', flag: '🇬🇧', city: 'Edinburgh, Scotland',
        program: 'MSc by Research — Custom Interdisciplinary', qs: 22, tuition: '£26,000/yr',
        intake: 'Sep', duration: '12 months', acceptance: '43%',
        highlight: 'Edinburgh offers highly flexible masters routes across 21 schools. Charles Darwin studied here. AI capital of Europe outside London. Rockstar Games makes GTA in Edinburgh.', superpower: 'Maximum Flexibility',
        badge: '🏰 Darwin\'s University',
      },
      {
        name: 'UC Berkeley', flag: '🇺🇸', city: 'Berkeley, California',
        program: 'MIMS — Information Management & Systems', qs: 10, tuition: '$28,000/yr',
        intake: 'Aug', duration: '24 months', acceptance: '14%',
        highlight: 'MIMS bridges data science, design, policy, and business — pure interdisciplinary flexibility. Bay Area location = Silicon Valley internships from Day 1. 107 Nobel Laureates in alumni.', superpower: 'Most Flexible Elite Program',
        badge: '🌉 107 Nobel Laureates',
      },
      {
        name: 'ETH Zurich', flag: '🇨🇭', city: 'Zurich, Switzerland',
        program: 'MSc Interdisciplinary Sciences (ISTP)', qs: 6, tuition: '€1,500/yr',
        intake: 'Sep', duration: '24 months', acceptance: '25%',
        highlight: 'ISTP bridges engineering, science, and social impact. Near-free tuition at #6 university in the world. Swiss quality of life, European work rights, global alumni network.', superpower: 'Near-Free at World Top 10',
        badge: '🏔 #6 World + €1.5K Tuition',
      },
      {
        name: 'Trinity College Dublin', flag: '🇮🇪', city: 'Dublin, Ireland',
        program: 'MSc Innovation & Entrepreneurship', qs: 87, tuition: '€10,000/yr',
        intake: 'Sep', duration: '12 months', acceptance: '22%',
        highlight: 'Google, Facebook, LinkedIn, Stripe, Salesforce EMEA HQ all in Dublin. Ireland\'s startup ecosystem rivals London. Oscar Wilde and Bram Stoker both studied here.', superpower: 'Big Tech EMEA Gateway',
        badge: '🍀 Google, Meta, Stripe City',
      },
      {
        name: 'University of Melbourne', flag: '🇦🇺', city: 'Melbourne, Australia',
        program: 'Master of Science — Interdisciplinary', qs: 33, tuition: 'A$42,000/yr',
        intake: 'Feb', duration: '24 months', acceptance: '70%',
        highlight: 'Melbourne Model allows cross-faculty masters with industry mentors. Most livable city in the world (10 years running). 8,200+ Indian students — strongest South Asian community.', superpower: 'Cross-Faculty Maximum Flexibility',
        badge: '🌏 Most Liveable City, 10 Years',
      },
    ],
    careers: [{ title: 'Innovation Strategist', co: 'McKinsey / BCG' }, { title: 'Digital Transformation Lead', co: 'Deloitte / Accenture' }, { title: 'Tech Policy Analyst', co: 'EU Commission / UN' }, { title: 'Venture Analyst', co: 'VC Fund' }],
  },
}

function lookupResult(answers) {
  const { background, interest, passion, geo, goal } = answers
  const key = `${background}_${interest}_${passion}_${geo}_${goal}`
  if (MATRIX[key]) return MATRIX[key]
  const partial3 = Object.keys(MATRIX).find(k => k.startsWith(`${background}_${interest}_${passion}`))
  if (partial3) return MATRIX[partial3]
  const partial2 = Object.keys(MATRIX).find(k => k.startsWith(`${background}_`) && k.includes(`_${passion}_`))
  if (partial2) return MATRIX[partial2]
  const passionMatch = Object.keys(MATRIX).find(k => k.includes(`_${passion}_`))
  if (passionMatch) return MATRIX[passionMatch]
  return MATRIX['default']
}

// ─── QUESTIONS ────────────────────────────────────────────────────────────────
const QUESTIONS = [
  {
    id: 'eduLevel', step: 1, label: 'BASELINE',
    title: 'Where Are You Now?',
    sub: 'Your current level shapes which doors are open and which ones you\'re about to unlock.',
    options: [
      { value: 'highschool',   ico: '📚', label: 'High School',         sub: 'Class 11–12 / Grade 11–12' },
      { value: 'bachelor',     ico: '🏛',  label: 'Bachelor\'s Degree',  sub: 'Currently enrolled or recently graduated' },
      { value: 'master',       ico: '🔬', label: 'Master\'s Degree',    sub: 'Completed or nearly finished' },
      { value: 'professional', ico: '💼', label: 'Working Professional', sub: '1+ years of full-time work experience' },
    ],
  },
  {
    id: 'targetDegree', step: 2, label: 'TARGET',
    title: 'What Are You Aiming For?',
    sub: 'The qualification level dramatically changes the programs available and the doors they open.',
    options: [
      { value: 'bsc', ico: '📖', label: 'BSc / BA',  sub: 'Undergraduate — 3 to 4 years' },
      { value: 'msc', ico: '🧪', label: 'MSc / MA',  sub: 'Taught Masters — 1 to 2 years' },
      { value: 'mba', ico: '📊', label: 'MBA',        sub: 'Masters in Business Administration' },
      { value: 'phd', ico: '⚗️', label: 'PhD',        sub: 'Doctoral Research — 3 to 5 years' },
    ],
  },
  {
    id: 'background', step: 3, label: 'FOUNDATION',
    title: 'Your Academic DNA',
    sub: 'What have you studied? This is the launchpad, not the destination.',
    options: [
      { value: 'engineering',   ico: '⚙️', label: 'Engineering & Tech',      sub: 'CS, EE, Mechanical, Chemical, Civil' },
      { value: 'business',      ico: '📈', label: 'Business & Finance',       sub: 'Commerce, Economics, Accounting' },
      { value: 'sciences',      ico: '🔬', label: 'Sciences & Medicine',      sub: 'Physics, Chemistry, Biology, Pre-Med' },
      { value: 'arts',          ico: '🎨', label: 'Arts & Design',            sub: 'Fine Arts, Design, Architecture, Media' },
      { value: 'law',           ico: '⚖️', label: 'Law & Political Science',  sub: 'Law, Pol Sci, International Relations' },
      { value: 'psychology',    ico: '🧠', label: 'Psychology & Social Sci',  sub: 'Psychology, Sociology, Anthropology' },
      { value: 'environmental', ico: '🌿', label: 'Environmental Science',    sub: 'Ecology, Earth Science, Geography' },
      { value: 'humanities',    ico: '📜', label: 'Humanities & Languages',   sub: 'History, Literature, Philosophy' },
    ],
  },
  {
    id: 'interest', step: 4, label: 'ENERGY',
    title: 'What Makes You Forget The Time?',
    sub: 'Forget your degree for a moment. What do you genuinely love doing on a Tuesday afternoon?',
    options: [
      { value: 'analyzing', ico: '📊', label: 'Analysing Data & Maths',  sub: 'Numbers, patterns, research, models' },
      { value: 'designing', ico: '✏️', label: 'Designing & Creating',    sub: 'Visual, UX, products, storytelling' },
      { value: 'managing',  ico: '🏆', label: 'Managing & Leading',      sub: 'Teams, strategy, negotiation, vision' },
      { value: 'building',  ico: '🔧', label: 'Building & Engineering',  sub: 'Software, hardware, systems, code' },
    ],
  },
  {
    id: 'passion', step: 5, label: 'OBSESSION',
    title: 'Which World Obsesses You?',
    sub: 'This is the game-changer. The industry you love + your skills = a career most people don\'t know exists.',
    options: [
      { value: 'sports',      ico: '⚽', label: 'Sports & Athletics',        sub: 'Professional sports, performance, data' },
      { value: 'fashion',     ico: '👗', label: 'Fashion & Luxury',          sub: 'LVMH, luxury brands, design, lifestyle' },
      { value: 'climate',     ico: '🌱', label: 'Climate & Sustainability',  sub: 'Clean energy, ESG, green finance' },
      { value: 'healthcare',  ico: '🏥', label: 'Healthcare & BioTech',      sub: 'Medicine, pharma, mental health, biotech' },
      { value: 'gaming',      ico: '🎮', label: 'Gaming & Entertainment',    sub: 'Video games, AR/VR, streaming, metaverse' },
      { value: 'space',       ico: '🚀', label: 'Space & Aerospace',         sub: 'SpaceX, NASA, satellites, exploration' },
      { value: 'fintech',     ico: '💳', label: 'FinTech & Markets',         sub: 'Trading, crypto, payments, hedge funds' },
      { value: 'policy',      ico: '🏛',  label: 'Public Policy & Impact',   sub: 'Government, NGOs, international dev' },
    ],
  },
  {
    id: 'geo', step: 6, label: 'DESTINATION',
    title: 'Where Will You Build Your Life?',
    sub: 'Geography shapes salary, visa pathways, and which industries are accessible to you.',
    options: [
      { value: 'usa',       ico: '🌎', label: 'USA & Canada',         sub: 'Silicon Valley, NYC, Toronto, Vancouver' },
      { value: 'uk',        ico: '🌍', label: 'UK & Ireland',         sub: 'London, Edinburgh, Dublin, Manchester' },
      { value: 'europe',    ico: '🗺',  label: 'Continental Europe',   sub: 'Germany, France, Switzerland, Netherlands' },
      { value: 'australia', ico: '🌏', label: 'Australia & New Zealand', sub: 'Sydney, Melbourne, Brisbane, Auckland' },
    ],
  },
  {
    id: 'goal', step: 7, label: 'ENDGAME',
    title: 'What Does Victory Look Like?',
    sub: 'Your post-graduation vision changes which programs, cities, and networks matter most right now.',
    options: [
      { value: 'corporate', ico: '🏢', label: 'Join a Global Giant',       sub: 'FAANG, McKinsey, Goldman, Fortune 500' },
      { value: 'startup',   ico: '🚀', label: 'Build a Startup',           sub: 'Found or co-found a venture-backed company' },
      { value: 'research',  ico: '🔬', label: 'Academic Research / PhD',   sub: 'Publish, research, become a professor' },
      { value: 'return',    ico: '🇮🇳', label: 'Lead India\'s Next Wave',  sub: 'Bring global expertise back home' },
    ],
  },
]

// ─── CSS ─────────────────────────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Syne:wght@400;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');

.cc2 {
  --bg:#07090F; --bg1:#0B0E1A; --bg2:#0E1220; --bg3:#121828;
  --bdr:rgba(255,255,255,.07); --bdr2:rgba(255,255,255,.14); --bdr3:rgba(255,255,255,.2);
  --cyan:#00D4FF; --teal:#00E5A8; --violet:#8B7FFF;
  --gold:#FFB347; --rose:#FF4D6D; --orange:#F97316;
  --tx:#E2E8F4; --muted:#4A6080; --dim:#1E2E44;
  --ffh:'Bebas Neue',sans-serif;
  --ffb:'Syne',sans-serif;
  --ffm:'JetBrains Mono',monospace;
  background:var(--bg); color:var(--tx); font-family:var(--ffb);
  min-height:100vh; overflow-x:hidden;
}
.cc2 * { box-sizing:border-box; margin:0; padding:0; }
.cc2 a { text-decoration:none; color:inherit; }
.cc2 button { cursor:pointer; font-family:var(--ffb); border:none; background:none; }
.cc2 ::-webkit-scrollbar { width:4px; background:transparent; }
.cc2 ::-webkit-scrollbar-thumb { background:rgba(0,212,255,.15); border-radius:4px; }

/* ── AMBIENT BG ── */
.cc2-bg { position:fixed; inset:0; z-index:0; pointer-events:none; overflow:hidden; }
.cc2-orb { position:absolute; border-radius:50%; filter:blur(140px); animation:orbDrift 24s ease-in-out infinite alternate; }
.cc2-o1 { width:600px; height:600px; background:radial-gradient(circle,rgba(0,212,255,.09),transparent 70%); top:-200px; left:-100px; }
.cc2-o2 { width:550px; height:550px; background:radial-gradient(circle,rgba(139,127,255,.07),transparent 70%); bottom:-180px; right:-80px; animation-delay:-10s; }
.cc2-o3 { width:350px; height:350px; background:radial-gradient(circle,rgba(0,229,168,.05),transparent 70%); top:45%; left:42%; animation-delay:-5s; }
@keyframes orbDrift { 0%{transform:translate(0,0)} 100%{transform:translate(36px,24px)} }
.cc2-hexbg {
  position:fixed; inset:0; z-index:0; pointer-events:none;
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='96'%3E%3Cpolygon points='28,2 54,16 54,44 28,58 2,44 2,16' fill='none' stroke='%2300D4FF' stroke-width='0.5' opacity='0.06'/%3E%3Cpolygon points='28,50 54,64 54,92 28,106 2,92 2,64' fill='none' stroke='%2300D4FF' stroke-width='0.5' opacity='0.06'/%3E%3C/svg%3E");
  mask-image: radial-gradient(ellipse 90% 70% at 50% 30%, black 30%, transparent 100%);
}

/* ── NAV ── */
.cc2-nav { height:58px; display:flex; align-items:center; justify-content:space-between;
  padding:0 28px; border-bottom:1px solid var(--bdr);
  position:relative; z-index:100; background:rgba(7,9,15,.85); backdrop-filter:blur(20px); }
.cc2-logo { display:flex; align-items:center; gap:10px; font-family:var(--ffb); font-weight:700; font-size:1rem; color:#fff; }
.cc2-logo-gem { width:32px; height:32px; border-radius:8px;
  background:linear-gradient(135deg,var(--cyan),var(--teal));
  display:flex; align-items:center; justify-content:center;
  box-shadow:0 0 18px rgba(0,212,255,.35); flex-shrink:0; }
.cc2-logo em { font-style:normal; color:var(--teal); }
.cc2-back { font-family:var(--ffm); font-size:.64rem; color:var(--muted);
  letter-spacing:.08em; padding:7px 14px;
  border:1px solid var(--bdr2); border-radius:8px; transition:all .2s; }
.cc2-back:hover { border-color:var(--cyan); color:var(--cyan); background:rgba(0,212,255,.04); }

/* ── WRAP ── */
.cc2-wrap { position:relative; z-index:2; max-width:880px; margin:0 auto; padding:0 24px 80px; }

/* ── HERO ── */
.cc2-hero { text-align:center; padding:52px 0 46px; }
.cc2-hero-eyebrow { font-family:var(--ffm); font-size:.6rem; color:var(--violet);
  letter-spacing:.2em; text-transform:uppercase; margin-bottom:16px;
  display:flex; align-items:center; justify-content:center; gap:10px; }
.cc2-eyebrow-line { width:44px; height:1px; background:linear-gradient(90deg,transparent,var(--violet)); }
.cc2-hero-h { font-family:var(--ffh); font-size:clamp(52px,8vw,96px); color:#fff;
  letter-spacing:.04em; line-height:.88; margin-bottom:18px; }
.cc2-hero-h span { background:linear-gradient(135deg,var(--gold),var(--orange));
  -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
.cc2-hero-sub { font-size:1rem; color:var(--muted); line-height:1.75; max-width:540px; margin:0 auto 32px; }
.cc2-hero-sub strong { color:var(--tx); font-weight:600; }

/* ✨ FORCED VISIBILITY: DISCOVER BUTTON ✨ */
.cc2-hero-cta { display:inline-flex; align-items:center; gap:10px; padding:15px 38px;
  border-radius:12px;
  background-color: #00E5A8 !important; /* FORCED */
  border: none !important;
  color: #000000 !important; /* FORCED */
  font-family:var(--ffb); font-size:1.1rem; font-weight:800;
  transition:all .25s; box-shadow:0 8px 24px rgba(0,229,168,0.4); letter-spacing:.02em; }
.cc2-hero-cta:hover { transform:translateY(-3px); background-color: #00D4FF !important; box-shadow:0 12px 32px rgba(0,212,255,.6); }

.cc2-hero-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:12px; margin-top:32px; max-width:600px; margin-left:auto; margin-right:auto; }
.cc2-hero-stat { background:rgba(255,255,255,.03); border:1px solid var(--bdr); border-radius:12px; padding:14px 10px; text-align:center; }
.cc2-hero-stat-v { font-family:var(--ffh); font-size:1.8rem; color:#fff; line-height:1; margin-bottom:4px; }
.cc2-hero-stat-l { font-family:var(--ffm); font-size:.55rem; color:var(--muted); letter-spacing:.1em; }

/* ── PROGRESS ── */
.cc2-prog { padding:26px 0 20px; }
.cc2-prog-row { display:flex; align-items:center; justify-content:center; gap:0; }
.cc2-prog-node { width:34px; height:34px; border-radius:50%; border:2px solid var(--bdr);
  display:flex; align-items:center; justify-content:center;
  font-family:var(--ffm); font-size:.65rem; color:var(--muted);
  transition:all .3s; z-index:1; flex-shrink:0; background:var(--bg); }
.cc2-prog-node.done { background:rgba(0,229,168,.12); border-color:var(--teal); color:var(--teal); box-shadow:0 0 14px rgba(0,229,168,.2); }
.cc2-prog-node.active { background:rgba(0,212,255,.1); border-color:var(--cyan); color:var(--cyan); box-shadow:0 0 18px rgba(0,212,255,.3); }
.cc2-prog-connector { width:56px; height:2px; background:var(--bdr); flex-shrink:0; transition:background .4s; }
.cc2-prog-connector.done { background:linear-gradient(90deg,var(--teal),var(--cyan)); }

/* ── QUESTION CARD ── */
.cc2-qcard { background:rgba(11,14,26,.9); border:1px solid var(--bdr);
  border-radius:20px; padding:38px; backdrop-filter:blur(24px);
  position:relative; overflow:hidden; }
.cc2-qcard::before { content:''; position:absolute; top:0; left:0; right:0; height:2px;
  background:linear-gradient(90deg,transparent,var(--cyan),transparent); opacity:.4; }
.cc2-qcard::after { content:''; position:absolute; inset:0;
  background:radial-gradient(ellipse at 0% 0%,rgba(0,212,255,.03),transparent 50%); pointer-events:none; }
.cc2-q-tag { font-family:var(--ffm); font-size:.58rem; color:var(--muted);
  letter-spacing:.18em; text-transform:uppercase; margin-bottom:10px;
  display:flex; align-items:center; gap:8px; }
.cc2-q-tag::before { content:''; width:20px; height:1px; background:var(--muted); }
.cc2-q-h { font-family:var(--ffh); font-size:clamp(28px,4vw,42px);
  letter-spacing:.04em; color:#fff; margin-bottom:8px; line-height:1.05; }
.cc2-q-sub { font-size:.88rem; color:var(--muted); line-height:1.65; margin-bottom:28px; }

/* ── OPTIONS ── */
.cc2-opts { display:grid; grid-template-columns:1fr 1fr; gap:10px; }
.cc2-opts.cols4 { grid-template-columns:1fr 1fr 1fr 1fr; }

/* ✨ FORCED VISIBILITY: OPTIONS ✨ */
.cc2-opt {
  background-color: rgba(255,255,255,.05) !important;
  border: 1px solid rgba(255,255,255,.15) !important;
  border-radius:14px; padding:16px 18px; text-align:left;
  display:flex; align-items:center; gap:14px;
  transition:all .22s; cursor:pointer; position:relative; overflow:hidden;
}
.cc2-opt::before { content:''; position:absolute; inset:0; opacity:0; transition:opacity .2s;
  background:radial-gradient(ellipse at 0% 50%,rgba(0,212,255,.06),transparent 60%); }
.cc2-opt:hover { border-color: rgba(0,212,255,.3) !important; transform:translateY(-2px);
  background-color: rgba(255,255,255,.08) !important; box-shadow:0 8px 24px rgba(0,0,0,.3); }
.cc2-opt:hover::before { opacity:1; }

.cc2-opt.sel {
  border-color: #00D4FF !important;
  background-color: rgba(0,212,255,.15) !important;
  box-shadow: 0 0 15px rgba(0,212,255,.2) !important;
}
.cc2-opt.sel::before { opacity:1; }
.cc2-opt-ico { font-size:1.6rem; flex-shrink:0; line-height:1; }
.cc2-opt-body { flex:1; min-width:0; }

.cc2-opt-l { font-size:.9rem; font-weight:700; color: #ffffff !important; margin-bottom:3px; line-height:1.3; transition: color 0.2s; }
.cc2-opt.sel .cc2-opt-l { color: #00D4FF !important; }

.cc2-opt-s { font-family:var(--ffm); font-size:.6rem; color: #A0B3C6 !important; line-height:1.4; }

.cc2-opt-chk { width:22px; height:22px; border-radius:50%;
  border: 2px solid rgba(255,255,255,.3) !important; display:flex; align-items:center; justify-content:center;
  flex-shrink:0; font-size:.85rem; transition:all .22s; color:transparent; font-weight:900; }
.cc2-opt.sel .cc2-opt-chk { background-color: #00D4FF !important; border-color: #00D4FF !important; color: #000000 !important; }

/* ── FOOTER ── */
.cc2-qfooter { display:flex; align-items:center; justify-content:space-between; margin-top:30px; }

/* ✨ FORCED VISIBILITY: BACK BUTTON ✨ */
.cc2-btn-back { font-family:var(--ffm); font-size:.75rem;
  color: #ffffff !important;
  background-color: rgba(255,255,255,0.05) !important;
  letter-spacing:.08em; padding:11px 20px;
  border: 1px solid rgba(255,255,255,0.4) !important;
  border-radius:10px; transition:all .2s; font-weight: 600; }
.cc2-btn-back:hover { border-color:#ffffff !important; color:#030a12 !important; background-color:#ffffff !important; }

/* ✨ FORCED VISIBILITY: NEXT BUTTON ✨ */
.cc2-btn-next { display:flex; align-items:center; gap:8px; padding:12px 32px;
  border-radius:10px;
  background-color: #00D4FF !important;
  border:none !important;
  color: #000000 !important;
  font-family:var(--ffb); font-size:.95rem; font-weight:800;
  letter-spacing:.02em; transition:all .22s; box-shadow:0 4px 15px rgba(0,212,255,0.4); }
.cc2-btn-next:hover:not(:disabled) { transform:translateY(-2px); background-color:#00E5A8 !important; box-shadow:0 8px 20px rgba(0,229,168,0.5); }
.cc2-btn-next:disabled {
  background-color: rgba(255,255,255,0.1) !important;
  color: rgba(255,255,255,0.5) !important;
  box-shadow:none !important; cursor:not-allowed; transform:none;
}

/* ✨ FORCED VISIBILITY: STEP COUNTER ✨ */
.cc2-q-ctr { font-family:var(--ffm); font-size:.75rem; color: #ffffff !important; letter-spacing:.1em; font-weight: 600; }

/* ══════════════════════════════════════════════════════
  RESULTS
══════════════════════════════════════════════════════ */
.cc2-results { animation:resIn .6s cubic-bezier(.22,1,.36,1) both; }
@keyframes resIn { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }

/* DEGREE REVEAL */
.cc2-reveal { text-align:center; padding:44px 0 32px; position:relative; }
.cc2-reveal-emoji { font-size:4rem; margin-bottom:12px;
  animation:emojiPop .5s cubic-bezier(.34,1.56,.64,1) both; }
@keyframes emojiPop { from{transform:scale(.3) rotate(-30deg);opacity:0} to{transform:scale(1) rotate(0);opacity:1} }
.cc2-reveal-tag { font-family:var(--ffm); font-size:.6rem; letter-spacing:.18em;
  text-transform:uppercase; margin-bottom:10px; display:flex; align-items:center; justify-content:center; gap:8px; }
.cc2-reveal-h { font-family:var(--ffh); font-size:clamp(30px,5vw,56px);
  color:#fff; letter-spacing:.04em; line-height:1.0; margin-bottom:8px; }
.cc2-reveal-tagline { font-family:var(--ffm); font-size:.72rem; letter-spacing:.1em;
  text-transform:uppercase; margin-bottom:16px; padding:6px 16px; border-radius:20px;
  display:inline-block; border:1px solid; }
.cc2-reveal-niche { font-size:.92rem; color:var(--muted); line-height:1.7; max-width:580px; margin:0 auto 14px; }
.cc2-reveal-rare { display:inline-flex; align-items:flex-start; gap:10px;
  padding:12px 18px; border-radius:12px; border:1px solid var(--bdr2);
  background:rgba(255,255,255,.03); max-width:580px;
  font-size:.8rem; color:var(--muted); line-height:1.6; text-align:left; }
.cc2-reveal-rare strong { color:var(--tx); }

/* PROFILE CHIPS */
.cc2-chips { display:flex; flex-wrap:wrap; gap:7px; justify-content:center; margin:20px 0 28px; }
.cc2-chip { display:flex; align-items:center; gap:6px; padding:5px 13px;
  background:rgba(255,255,255,.04); border:1px solid var(--bdr2);
  border-radius:20px; font-family:var(--ffm); font-size:.6rem; color:var(--muted); letter-spacing:.06em; }
.cc2-chip-ico { font-size:.9rem; }

/* STATS ROW */
.cc2-stats-row { display:grid; grid-template-columns:repeat(3,1fr); gap:12px; margin-bottom:24px; }
.cc2-stat-box { background:rgba(11,14,26,.9); border:1px solid var(--bdr);
  border-radius:14px; padding:18px; text-align:center; position:relative; overflow:hidden; }
.cc2-stat-box::before { content:''; position:absolute; top:0; left:0; right:0; height:2px; }
.cc2-stat-v { font-family:var(--ffh); font-size:2rem; line-height:1; margin-bottom:4px; }
.cc2-stat-l { font-family:var(--ffm); font-size:.58rem; color:var(--muted); letter-spacing:.1em; }

/* ROI RING */
.cc2-roi-row { background:rgba(11,14,26,.9); border:1px solid var(--bdr);
  border-radius:14px; padding:18px 22px; margin-bottom:28px;
  display:flex; align-items:center; gap:18px; }
.cc2-roi-ring { position:relative; width:70px; height:70px; flex-shrink:0; }
.cc2-roi-ring svg { transform:rotate(-90deg); }
.cc2-roi-ring-inner { position:absolute; inset:0; display:flex; align-items:center; justify-content:center; flex-direction:column; }
.cc2-roi-ring-num { font-family:var(--ffh); font-size:1.4rem; line-height:1; }
.cc2-roi-ring-lbl { font-family:var(--ffm); font-size:.5rem; color:var(--muted); letter-spacing:.08em; }
.cc2-roi-info { flex:1; }
.cc2-roi-bars { display:flex; flex-direction:column; gap:8px; }
.cc2-roi-bar-row { display:flex; align-items:center; gap:10px; }
.cc2-roi-bar-lbl { font-family:var(--ffm); font-size:.6rem; color:var(--muted); width:80px; flex-shrink:0; }
.cc2-roi-bar-track { flex:1; height:5px; background:rgba(255,255,255,.06); border-radius:3px; overflow:hidden; }
.cc2-roi-bar-fill { height:100%; border-radius:3px; transition:width 1.4s cubic-bezier(.4,0,.2,1); }
.cc2-roi-bar-val { font-family:var(--ffm); font-size:.65rem; font-weight:600; width:32px; text-align:right; }

/* ── UNIVERSITY DESTINATION CARDS ── */
.cc2-unis-header { display:flex; align-items:center; gap:10px; margin-bottom:16px; }
.cc2-unis-title { font-family:var(--ffh); font-size:1.3rem; color:#fff; letter-spacing:.06em; }
.cc2-unis-sub { font-family:var(--ffm); font-size:.6rem; color:var(--muted); letter-spacing:.08em; flex:1; text-align:right; }
.cc2-unis { display:flex; flex-direction:column; gap:14px; margin-bottom:28px; }

/* THE BIG UNI CARD */
.cc2-uni-card { background:rgba(11,14,26,.92); border:1px solid var(--bdr);
  border-radius:18px; overflow:hidden; transition:all .25s; cursor:default;
  position:relative; }
.cc2-uni-card:hover { border-color:var(--bdr2); transform:translateY(-2px); box-shadow:0 20px 50px rgba(0,0,0,.4); }
.cc2-uni-card.top-pick { border-color:rgba(255,184,0,.3); }

/* CARD TOP STRIP */
.cc2-uni-strip { height:4px; width:100%; }

/* CARD MAIN BODY */
.cc2-uni-body { display:grid; grid-template-columns:auto 1fr auto; gap:18px;
  align-items:flex-start; padding:20px 22px 16px; }

/* RANK BADGE */
.cc2-uni-rank-badge { display:flex; flex-direction:column; align-items:center; gap:3px;
  width:44px; flex-shrink:0; }
.cc2-uni-rank-num { font-family:var(--ffh); font-size:2rem; line-height:1; }
.cc2-uni-rank-star { font-size:.75rem; }

/* UNI INFO */
.cc2-uni-info { min-width:0; }
.cc2-uni-top-row { display:flex; align-items:center; gap:10px; margin-bottom:5px; flex-wrap:wrap; }
.cc2-uni-flag-wrap { flex-shrink:0; }
.cc2-uni-name { font-family:var(--ffh); font-size:1.25rem; letter-spacing:.03em; color:#fff; line-height:1.1; }
.cc2-uni-city { font-family:var(--ffm); font-size:.6rem; color:var(--muted); letter-spacing:.06em; margin-bottom:4px; display:flex; align-items:center; gap:4px; }
.cc2-uni-program { font-family:var(--ffm); font-size:.67rem; margin-bottom:10px; letter-spacing:.04em; font-weight:600; }

/* METRICS PILLS */
.cc2-uni-pills { display:flex; flex-wrap:wrap; gap:6px; margin-bottom:10px; }
.cc2-uni-pill { display:flex; align-items:center; gap:4px; padding:4px 10px;
  background:rgba(255,255,255,.04); border:1px solid var(--bdr2);
  border-radius:20px; font-family:var(--ffm); font-size:.6rem; color:var(--muted); }
.cc2-uni-pill-ico { font-size:.8rem; }

/* SUPERPOWER BADGE */
.cc2-uni-superpower { display:inline-flex; align-items:center; gap:6px;
  padding:5px 12px; border-radius:8px; font-family:var(--ffm); font-size:.62rem;
  font-weight:600; letter-spacing:.06em; border:1px solid; margin-bottom:10px; }

/* HIGHLIGHT TEXT */
.cc2-uni-highlight { font-size:.78rem; color:var(--muted); line-height:1.6;
  padding:10px 12px; background:rgba(255,255,255,.025);
  border-radius:8px; border-left:2px solid; }

/* BADGE (top right) */
.cc2-uni-badge-wrap { flex-shrink:0; text-align:right; }
.cc2-uni-badge { font-family:var(--ffm); font-size:.58rem; padding:5px 10px;
  border-radius:7px; border:1px solid; letter-spacing:.06em; line-height:1.4;
  display:inline-block; margin-bottom:8px; max-width:150px; text-align:center; }
.cc2-uni-qs { font-family:var(--ffh); font-size:1.5rem; line-height:1; margin-bottom:2px; }
.cc2-uni-qs-lbl { font-family:var(--ffm); font-size:.55rem; color:var(--muted); letter-spacing:.08em; }

/* TOP PICK CROWN */
.cc2-top-pick-banner { background:linear-gradient(90deg,rgba(255,184,0,.12),rgba(255,184,0,.06));
  border-top:1px solid rgba(255,184,0,.2); padding:7px 22px;
  display:flex; align-items:center; gap:8px;
  font-family:var(--ffm); font-size:.62rem; color:#FFB347; letter-spacing:.1em; }

/* ── CAREERS ── */
.cc2-careers-wrap { margin-bottom:28px; }
.cc2-sec-h { display:flex; align-items:center; gap:10px; margin-bottom:14px; }
.cc2-sec-title { font-family:var(--ffh); font-size:1.1rem; color:#fff; letter-spacing:.06em; }
.cc2-sec-line { flex:1; height:1px; background:var(--bdr); }
.cc2-careers-grid { display:grid; grid-template-columns:1fr 1fr; gap:10px; }
.cc2-career-card { background:rgba(11,14,26,.9); border:1px solid var(--bdr);
  border-radius:12px; padding:14px 16px; transition:all .2s; }
.cc2-career-card:hover { border-color:var(--bdr2); transform:translateX(4px); }
.cc2-career-title { font-size:.88rem; font-weight:700; color:#fff; margin-bottom:3px; }
.cc2-career-co { font-family:var(--ffm); font-size:.62rem; color:var(--muted); letter-spacing:.06em; }

/* ── INDUSTRY TAGS ── */
.cc2-industries { display:flex; flex-wrap:wrap; gap:8px; margin-bottom:28px; }
.cc2-industry { padding:7px 14px; border-radius:8px; font-family:var(--ffm);
  font-size:.65rem; letter-spacing:.07em; border:1px solid; }

/* ── ACTIONS ── */
.cc2-actions { display:flex; gap:12px; justify-content:center; flex-wrap:wrap; margin-top:8px; }
.cc2-act-a { display:flex; align-items:center; gap:8px; padding:14px 32px;
  border-radius:12px; background:linear-gradient(135deg,var(--cyan),var(--teal));
  color:#030a12; font-family:var(--ffb); font-size:.9rem; font-weight:700;
  letter-spacing:.02em; transition:all .22s; }
.cc2-act-a:hover { transform:translateY(-2px); box-shadow:0 14px 36px rgba(0,212,255,.3); }
.cc2-act-b { display:flex; align-items:center; gap:8px; padding:14px 24px;
  border-radius:12px; background:linear-gradient(135deg,var(--violet),#6366f1);
  color:#fff; font-family:var(--ffb); font-size:.9rem; font-weight:700;
  letter-spacing:.02em; transition:all .22s; }
.cc2-act-b:hover { transform:translateY(-2px); box-shadow:0 14px 36px rgba(139,127,255,.3); }

/* ✨ FORCED VISIBILITY: TRY AGAIN BUTTON ✨ */
.cc2-act-c { display:flex; align-items:center; gap:8px; padding:14px 22px;
  border-radius:12px; 
  border: 2px solid rgba(255,255,255,0.4) !important; 
  color: #ffffff !important; 
  background-color: transparent !important;
  font-family:var(--ffb); font-size:1rem; font-weight:700; transition:all .22s; }
.cc2-act-c:hover { border-color:var(--cyan) !important; color:#000000 !important; background-color:var(--cyan) !important; }

/* ── ANIMATIONS ── */
@keyframes fadeUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
.ca { animation:fadeUp .5s ease both; }
.d1{animation-delay:.04s} .d2{animation-delay:.08s} .d3{animation-delay:.12s}
.d4{animation-delay:.16s} .d5{animation-delay:.2s}  .d6{animation-delay:.24s}
.d7{animation-delay:.28s} .d8{animation-delay:.32s}

@media(max-width:700px){
  .cc2-opts { grid-template-columns:1fr; }
  .cc2-uni-body { grid-template-columns:1fr; gap:12px; }
  .cc2-uni-badge-wrap { display:none; }
  .cc2-uni-rank-badge { flex-direction:row; width:auto; }
  .cc2-stats-row { grid-template-columns:1fr 1fr; }
  .cc2-careers-grid { grid-template-columns:1fr; }
  .cc2-hero-grid { grid-template-columns:1fr 1fr; }
}
`

// ─── COMPONENT ────────────────────────────────────────────────────────────────
export default function CareerCompass() {
  const [phase,   setPhase]   = useState('hero')
  const [step,    setStep]    = useState(0)
  const [answers, setAnswers] = useState({})
  const [result,  setResult]  = useState(null)
  const [roiAnim, setRoiAnim] = useState(false)
  const topRef = useRef(null)

  useEffect(() => { if (phase === 'result') setTimeout(() => setRoiAnim(true), 600) }, [phase])

  const scrollTop = () => topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })

  const select = val => setAnswers(p => ({ ...p, [QUESTIONS[step].id]: val }))
  const isSelected = val => answers[QUESTIONS[step]?.id] === val
  const canNext = !!answers[QUESTIONS[step]?.id]

  const next = () => {
    if (step < QUESTIONS.length - 1) { setStep(s => s + 1); scrollTop() }
    else { setResult(lookupResult(answers)); setPhase('result'); scrollTop() }
  }

  const back = () => {
    if (step > 0) { setStep(s => s - 1); scrollTop() }
    else { setPhase('hero'); scrollTop() }
  }

  const restart = () => {
    setPhase('hero'); setStep(0); setAnswers({}); setResult(null); setRoiAnim(false); scrollTop()
  }

  const fmtSalary = (n, cur) => `${cur}${(n/1000).toFixed(0)}K`

  return (
    <div className="cc2" ref={topRef}>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      {/* AMBIENT */}
      <div className="cc2-bg">
        <div className="cc2-orb cc2-o1"/><div className="cc2-orb cc2-o2"/><div className="cc2-orb cc2-o3"/>
      </div>
      <div className="cc2-hexbg"/>

      {/* NAV */}
      <nav className="cc2-nav">
        <div className="cc2-logo">
          <div className="cc2-logo-gem">
            <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
              <path d="M9 2L16 9L9 16L2 9Z" fill="white" fillOpacity=".92"/>
            </svg>
          </div>
          Mentor<em>Bridge</em>
        </div>
        {phase !== 'hero' && (
          <Link href="/dashboard/student" className="cc2-back">← Dashboard</Link>
        )}
      </nav>

      <div className="cc2-wrap">

        {/* ══ HERO ══ */}
        {phase === 'hero' && (
          <div className="cc2-hero ca">
            <div className="cc2-hero-eyebrow">
              <div className="cc2-eyebrow-line"/>
              ✦ Zero Generic Advice · Pure Intelligence
              <div className="cc2-eyebrow-line" style={{transform:'rotate(180deg)'}}/>
            </div>
            <h1 className="cc2-hero-h">
              INTELLIGENT<br/>
              <span>CAREER</span><br/>
              COMPASS
            </h1>
            <p className="cc2-hero-sub">
              <strong>7 questions. No generic advice.</strong><br/>
              Your combination of background, passion, and geography maps to a
              hyper-specific degree that most students don't know exists —
              but pays 3× more than the obvious choice.
            </p>
            <button className="cc2-hero-cta" onClick={() => setPhase('quiz')}>
              🧭 Discover My Degree Path →
            </button>
            <div className="cc2-hero-grid">
              {[['50+','Unique Paths'],['200+','Universities'],['7','Questions'],['0','Generic Answers']].map(([v,l]) => (
                <div className="cc2-hero-stat" key={l}>
                  <div className="cc2-hero-stat-v">{v}</div>
                  <div className="cc2-hero-stat-l">{l}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ══ QUIZ ══ */}
        {phase === 'quiz' && QUESTIONS[step] && (() => {
          const q = QUESTIONS[step]
          return (
            <>
              {/* Progress */}
              <div className="cc2-prog">
                <div className="cc2-prog-row">
                  {QUESTIONS.map((_, i) => (
                    <div key={i} style={{display:'flex',alignItems:'center'}}>
                      <div className={`cc2-prog-node${i<step?' done':i===step?' active':''}`}>
                        {i < step ? '✓' : i + 1}
                      </div>
                      {i < QUESTIONS.length-1 && (
                        <div className={`cc2-prog-connector${i<step?' done':''}`}/>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Question Card */}
              <div className="cc2-qcard ca" key={step}>
                <div className="cc2-q-tag">Step {step+1} of {QUESTIONS.length} — {q.label}</div>
                <h2 className="cc2-q-h">{q.title}</h2>
                <p className="cc2-q-sub">{q.sub}</p>

                <div className={`cc2-opts${q.options.length === 4 ? '' : ''}`}>
                  {q.options.map(o => (
                    <button key={o.value} className={`cc2-opt${isSelected(o.value)?' sel':''}`} onClick={() => select(o.value)}>
                      <span className="cc2-opt-ico">{o.ico}</span>
                      <div className="cc2-opt-body">
                        <div className="cc2-opt-l">{o.label}</div>
                        <div className="cc2-opt-s">{o.sub}</div>
                      </div>
                      <div className="cc2-opt-chk">{isSelected(o.value)?'✓':''}</div>
                    </button>
                  ))}
                </div>

                <div className="cc2-qfooter">
                  <button className="cc2-btn-back" onClick={back}>
                    ← {step === 0 ? 'Home' : 'Previous'}
                  </button>
                  <div className="cc2-q-ctr">{step+1} / {QUESTIONS.length}</div>
                  <button className="cc2-btn-next" onClick={next} disabled={!canNext}>
                    {step === QUESTIONS.length-1 ? '🧭 Reveal My Path →' : 'Next Step →'}
                  </button>
                </div>
              </div>
            </>
          )
        })()}

        {/* ══ RESULTS ══ */}
        {phase === 'result' && result && (
          <div className="cc2-results">

            {/* Degree reveal */}
            <div className="cc2-reveal">
              <div className="cc2-reveal-emoji">{result.emoji}</div>
              <div className="cc2-reveal-tag" style={{color:result.accentCol}}>
                ✦ YOUR PERSONALISED CAREER PATH
              </div>
              <h2 className="cc2-reveal-h">{result.degree}</h2>
              <div className="cc2-reveal-tagline" style={{color:result.accentCol,borderColor:`${result.accentCol}40`,background:`${result.accentCol}0c`}}>
                {result.tagline}
              </div>
              <p className="cc2-reveal-niche">{result.niche}</p>
              <div className="cc2-reveal-rare">
                <span>💡</span>
                <span><strong>Why this is rare:</strong> {result.whyRare}</span>
              </div>
            </div>

            {/* Profile answer chips */}
            <div className="cc2-chips ca d1">
              {Object.entries(answers).map(([qId, val]) => {
                const q = QUESTIONS.find(x => x.id === qId)
                const opt = q?.options.find(o => o.value === val)
                if (!opt) return null
                return (
                  <div key={qId} className="cc2-chip">
                    <span className="cc2-chip-ico">{opt.ico}</span>
                    {opt.label}
                  </div>
                )
              })}
            </div>

            {/* Stats */}
            <div className="cc2-stats-row ca d2">
              <div className="cc2-stat-box">
                <div style={{position:'absolute',top:0,left:0,right:0,height:2,background:`linear-gradient(90deg,transparent,${result.accentCol},transparent)`}}/>
                <div className="cc2-stat-v" style={{color:result.accentCol}}>
                  {fmtSalary(result.salaryFrom,result.currency)}
                </div>
                <div className="cc2-stat-l">STARTING SALARY</div>
              </div>
              <div className="cc2-stat-box">
                <div style={{position:'absolute',top:0,left:0,right:0,height:2,background:'linear-gradient(90deg,transparent,var(--teal),transparent)'}}/>
                <div className="cc2-stat-v" style={{color:'#00E5A8'}}>
                  {fmtSalary(result.salaryTo,result.currency)}
                </div>
                <div className="cc2-stat-l">SENIOR SALARY</div>
              </div>
              <div className="cc2-stat-box">
                <div style={{position:'absolute',top:0,left:0,right:0,height:2,background:'linear-gradient(90deg,transparent,var(--violet),transparent)'}}/>
                <div className="cc2-stat-v" style={{color:'var(--violet)'}}>{result.universities.length}</div>
                <div className="cc2-stat-l">TARGET UNIS</div>
              </div>
            </div>

            {/* ROI Score bars */}
            <div className="cc2-roi-row ca d3">
              <div className="cc2-roi-ring">
                <svg width="70" height="70" viewBox="0 0 70 70">
                  <circle cx="35" cy="35" r="28" fill="none" stroke="rgba(255,255,255,.06)" strokeWidth="6"/>
                  <circle cx="35" cy="35" r="28" fill="none"
                    stroke={result.accentCol} strokeWidth="6" strokeLinecap="round"
                    strokeDasharray={`${2*Math.PI*28}`}
                    strokeDashoffset={roiAnim ? `${2*Math.PI*28*(1-result.roiScore/100)}` : `${2*Math.PI*28}`}
                    style={{transition:'stroke-dashoffset 1.4s cubic-bezier(.4,0,.2,1)'}}
                    filter={`drop-shadow(0 0 6px ${result.accentCol})`}
                  />
                </svg>
                <div className="cc2-roi-ring-inner">
                  <div className="cc2-roi-ring-num" style={{color:result.accentCol}}>{result.roiScore}</div>
                  <div className="cc2-roi-ring-lbl">SCORE</div>
                </div>
              </div>
              <div className="cc2-roi-info">
                <div className="cc2-roi-bars">
                  {[
                    { lbl:'ROI Score',      val:result.roiScore,     col:result.accentCol },
                    { lbl:'Market Demand',    val:result.demandScore,  col:'#00E5A8' },
                    { lbl:'Rarity / Niche',   val:result.rarityScore,  col:'#8B7FFF' },
                  ].map(b => (
                    <div key={b.lbl} className="cc2-roi-bar-row">
                      <div className="cc2-roi-bar-lbl">{b.lbl}</div>
                      <div className="cc2-roi-bar-track">
                        <div className="cc2-roi-bar-fill" style={{width:roiAnim?`${b.val}%`:'0%',background:b.col}}/>
                      </div>
                      <div className="cc2-roi-bar-val" style={{color:b.col}}>{b.val}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Industry tags */}
            <div className="cc2-industries ca d4">
              <span style={{fontFamily:'var(--ffm)',fontSize:'.58rem',color:'var(--muted)',letterSpacing:'.1em',marginRight:4}}>INDUSTRIES:</span>
              {result.industries.map(ind => (
                <div key={ind} className="cc2-industry" style={{color:result.accentCol,borderColor:`${result.accentCol}40`,background:`${result.accentCol}08`}}>
                  {ind}
                </div>
              ))}
            </div>

            {/* ── UNIVERSITY DESTINATION CARDS ── */}
            <div className="ca d5">
              <div className="cc2-unis-header">
                <div className="cc2-unis-title">🏛 YOUR 5 TARGET UNIVERSITIES</div>
                <div className="cc2-unis-sub">Ranked by fit with your profile</div>
              </div>
              <div className="cc2-unis">
                {result.universities.map((uni, i) => (
                  <div key={i} className={`cc2-uni-card${i===0?' top-pick':''}`}
                    style={{animationDelay:`${.04+i*.07}s`}}>
                    {/* Coloured top strip */}
                    <div className="cc2-uni-strip"
                      style={{background:`linear-gradient(90deg,${result.accentCol},${result.accentCol}44,transparent)`}}/>

                    <div className="cc2-uni-body">
                      {/* Rank */}
                      <div className="cc2-uni-rank-badge">
                        <div className="cc2-uni-rank-num" style={{color: i===0?result.accentCol:'var(--dim)'}}>
                          {i+1}
                        </div>
                        <div className="cc2-uni-rank-star">{i===0?'👑':i===1?'🥈':i===2?'🥉':'⭐'}</div>
                      </div>

                      {/* Main info */}
                      <div className="cc2-uni-info">
                        <div className="cc2-uni-top-row">
                          <div className="cc2-uni-flag-wrap">
                            <FlagImg code={uni.flag} size={28}/>
                          </div>
                          <div className="cc2-uni-name">{uni.name}</div>
                        </div>
                        <div className="cc2-uni-city">
                          📍 {uni.city}
                        </div>
                        <div className="cc2-uni-program" style={{color:result.accentCol}}>
                          {uni.program}
                        </div>

                        {/* Metric pills */}
                        <div className="cc2-uni-pills">
                          {[
                            {ico:'💰', txt: uni.tuition},
                            {ico:'📅', txt: uni.intake + ' intake'},
                            {ico:'⏱', txt: uni.duration},
                            {ico:'📊', txt: uni.acceptance + ' acceptance'},
                          ].map(p => (
                            <div key={p.txt} className="cc2-uni-pill">
                              <span className="cc2-uni-pill-ico">{p.ico}</span>
                              {p.txt}
                            </div>
                          ))}
                        </div>

                        {/* Superpower */}
                        <div className="cc2-uni-superpower"
                          style={{color:result.accentCol,borderColor:`${result.accentCol}40`,background:`${result.accentCol}0c`}}>
                          ⚡ {uni.superpower}
                        </div>

                        {/* Highlight */}
                        <div className="cc2-uni-highlight" style={{borderLeftColor:result.accentCol}}>
                          {uni.highlight}
                        </div>
                      </div>

                      {/* Right badge */}
                      <div className="cc2-uni-badge-wrap">
                        <div className="cc2-uni-badge"
                          style={{color:result.accentCol,borderColor:`${result.accentCol}40`,background:`${result.accentCol}0a`}}>
                          {uni.badge}
                        </div>
                        {uni.qs <= 100 && (
                          <div style={{marginTop:4}}>
                            <div className="cc2-uni-qs" style={{color:'#FFB347'}}>#{uni.qs}</div>
                            <div className="cc2-uni-qs-lbl">QS WORLD RANK</div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Top pick footer */}
                    {i === 0 && (
                      <div className="cc2-top-pick-banner">
                        <span>👑</span>
                        <span>TOP RECOMMENDATION — Best fit for your profile combination</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Career paths */}
            <div className="cc2-careers-wrap ca d6">
              <div className="cc2-sec-h">
                <div className="cc2-sec-title">⚡ WHERE THIS TAKES YOU</div>
                <div className="cc2-sec-line"/>
              </div>
              <div className="cc2-careers-grid">
                {result.careers.map((c,i) => (
                  <div key={i} className="cc2-career-card"
                    style={{borderLeftColor:`${result.accentCol}50`,borderLeftWidth:3}}>
                    <div className="cc2-career-title">{c.title}</div>
                    <div className="cc2-career-co">@ {c.co}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="cc2-actions ca d7">
              <Link href="/dashboard/student" className="cc2-act-a">
                💾 Save to My Dashboard
              </Link>
              <Link href="/mentors" className="cc2-act-b">
                🧑‍💼 Find Mentor in This Field
              </Link>
              <button className="cc2-act-c" onClick={restart}>
                🧭 Try Again
              </button>
            </div>

          </div>
        )}
      </div>
    </div>
  )
}