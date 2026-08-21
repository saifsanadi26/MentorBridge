'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Triangle, Search, Filter, TrendingUp, DollarSign, Clock, Building2, ExternalLink, ArrowRight, Target, ChevronDown, Crosshair, Activity } from 'lucide-react'

// ════════════════════════════════════════════════════════════
//  EXCHANGE RATES (Used to normalize the Scatter Plot to USD)
// ════════════════════════════════════════════════════════════
const FX = { USD: 1, EUR: 1.08, GBP: 1.26, CAD: 0.74, AUD: 0.65, SGD: 0.74 };

// ════════════════════════════════════════════════════════════
//  COUNTRY COLOR MAP FOR GRAPH
// ════════════════════════════════════════════════════════════
const COUNTRY_COLORS = {
  'Germany': 'var(--teal)',
  'USA': 'var(--red)',
  'UK': 'var(--purple)',
  'Canada': 'var(--green)',
  'Australia': 'var(--gold)',
  'Ireland': 'var(--blue)',
  'Netherlands': '#00c9ac',
  'Singapore': '#fb923c'
};

// ════════════════════════════════════════════════════════════
//  MASSIVE UNIVERSITY DATABASE (8 Countries, 7 Unis Each = 56 Total)
// ════════════════════════════════════════════════════════════
const UNIVERSITIES = [
  // ── GERMANY ──
  { id: 'tum', name: 'TU Munich', acronym: 'TUM', country: 'Germany', flag: '🇩🇪', currency: 'EUR', tuition: 3000, living: 26000, duration: 2, salary: 65000, taxRate: 0.38, website: 'https://www.tum.de/en/', employers: ['BMW', 'Siemens', 'Celonis', 'Google Munich'], desc: 'The undisputed king of European engineering ROI. While living in Munich is expensive, the low tuition fees and immense brand value in the DACH tech ecosystem make this a top-tier investment.' },
  { id: 'rwth', name: 'RWTH Aachen', acronym: 'RWTH', country: 'Germany', flag: '🇩🇪', currency: 'EUR', tuition: 600, living: 20000, duration: 2, salary: 62000, taxRate: 0.38, website: 'https://www.rwth-aachen.de/', employers: ['Porsche', 'Bosch', 'Daimler', 'Fraunhofer'], desc: 'Known as the "MIT of Germany." Located in a highly affordable student city. If you are targeting mechanical, automotive, or industrial engineering, the ROI here is mathematically unbeatable.' },
  { id: 'tub', name: 'TU Berlin', acronym: 'TUB', country: 'Germany', flag: '🇩🇪', currency: 'EUR', tuition: 600, living: 24000, duration: 2, salary: 60000, taxRate: 0.38, website: 'https://www.tu.berlin/en/', employers: ['Zalando', 'N26', 'Tesla', 'Delivery Hero'], desc: 'Puts you directly in Europe\'s startup capital. Perfect for Data Science and Software Engineering. Living costs in Berlin have risen, but tech salaries are keeping pace perfectly.' },
  { id: 'kit', name: 'Karlsruhe Inst. Tech', acronym: 'KIT', country: 'Germany', flag: '🇩🇪', currency: 'EUR', tuition: 3000, living: 21000, duration: 2, salary: 61000, taxRate: 0.38, website: 'https://www.kit.edu/english/', employers: ['SAP', 'Bosch', 'IBM', 'Intel'], desc: 'Baden-Württemberg charges €1,500/semester for non-EU students, making it slightly pricier than other German states, but the deep industry ties to SAP make it incredibly lucrative.' },
  { id: 'hd', name: 'Heidelberg Uni', acronym: 'UHEI', country: 'Germany', flag: '🇩🇪', currency: 'EUR', tuition: 3000, living: 22000, duration: 2, salary: 58000, taxRate: 0.38, website: 'https://www.uni-heidelberg.de/en', employers: ['BioNTech', 'Bayer', 'SAP', 'Merck'], desc: 'Germany\'s oldest university. Extremely strong for life sciences, bioinformatics, and medicine. ROI is excellent, though salaries in biotech start slightly lower than pure software.' },
  { id: 'lmu', name: 'LMU Munich', acronym: 'LMU', country: 'Germany', flag: '🇩🇪', currency: 'EUR', tuition: 600, living: 26000, duration: 2, salary: 63000, taxRate: 0.38, website: 'https://www.lmu.de/en/', employers: ['Allianz', 'Munich Re', 'Apple Munich', 'Infineon'], desc: 'Exceptional for theoretical computer science, physics, and management. You share the expensive Munich housing market with TUM students, but the career outcomes are universally elite.' },
  { id: 'tud', name: 'TU Darmstadt', acronym: 'TUD', country: 'Germany', flag: '🇩🇪', currency: 'EUR', tuition: 600, living: 22000, duration: 2, salary: 61000, taxRate: 0.38, website: 'https://www.tu-darmstadt.de/index.en.jsp', employers: ['Software AG', 'Merck', 'Deutsche Bank', 'SAP'], desc: 'A powerhouse in cybersecurity and AI. Close proximity to Frankfurt makes it a strategic choice for students targeting the lucrative FinTech and banking IT sectors.' },

  // ── USA ──
  { id: 'mit', name: 'Mass. Inst. of Tech', acronym: 'MIT', country: 'USA', flag: '🇺🇸', currency: 'USD', tuition: 110000, living: 50000, duration: 2, salary: 145000, taxRate: 0.28, website: 'https://web.mit.edu/', employers: ['OpenAI', 'Meta', 'Jane Street', 'NASA'], desc: 'Astronomical upfront cost, but unmatched global prestige. An MIT degree essentially guarantees access to the highest-paying quant and AI roles in Silicon Valley and New York.' },
  { id: 'stanford', name: 'Stanford University', acronym: 'STAN', country: 'USA', flag: '🇺🇸', currency: 'USD', tuition: 115000, living: 60000, duration: 2, salary: 150000, taxRate: 0.32, website: 'https://www.stanford.edu/', employers: ['Google', 'Apple', 'NVIDIA', 'Sequoia'], desc: 'Located in the heart of Silicon Valley. The networking value alone justifies the massive price tag. Ideal for aspiring founders, AI researchers, and high-tier SWEs.' },
  { id: 'ucb', name: 'UC Berkeley', acronym: 'UCB', country: 'USA', flag: '🇺🇸', currency: 'USD', tuition: 65000, living: 55000, duration: 1.5, salary: 140000, taxRate: 0.32, website: 'https://www.berkeley.edu/', employers: ['Tesla', 'Databricks', 'Netflix', 'Salesforce'], desc: 'Slightly shorter master\'s duration yields a faster entry into the workforce. California taxes and rent are brutal, but the $140k+ starting salaries balance it out.' },
  { id: 'cmu', name: 'Carnegie Mellon', acronym: 'CMU', country: 'USA', flag: '🇺🇸', currency: 'USD', tuition: 105000, living: 40000, duration: 2, salary: 138000, taxRate: 0.25, website: 'https://www.cmu.edu/', employers: ['Uber', 'Duolingo', 'Amazon', 'Microsoft'], desc: 'The holy grail for Computer Science and Robotics. Pittsburgh is significantly cheaper than California or New York, meaning your dollar goes much further during your studies.' },
  { id: 'gatech', name: 'Georgia Tech', acronym: 'GT', country: 'USA', flag: '🇺🇸', currency: 'USD', tuition: 62000, living: 35000, duration: 2, salary: 125000, taxRate: 0.24, website: 'https://www.gatech.edu/', employers: ['Delta', 'Home Depot', 'Microsoft', 'NCR'], desc: 'The best ROI in the United States. Georgia Tech offers a tier-1 engineering and CS education at nearly half the tuition of private US universities, with fantastic placement rates.' },
  { id: 'nyu', name: 'New York University', acronym: 'NYU', country: 'USA', flag: '🇺🇸', currency: 'USD', tuition: 110000, living: 65000, duration: 2, salary: 130000, taxRate: 0.30, website: 'https://www.nyu.edu/', employers: ['Goldman Sachs', 'JPMorgan', 'Bloomberg', 'Spotify'], desc: 'Living in Manhattan will drain your savings rapidly. However, if your goal is FinTech, quantitative analysis, or tech roles in investment banking, NYU is a direct pipeline.' },
  { id: 'uta', name: 'UT Austin', acronym: 'UTA', country: 'USA', flag: '🇺🇸', currency: 'USD', tuition: 55000, living: 40000, duration: 2, salary: 115000, taxRate: 0.18, website: 'https://www.utexas.edu/', employers: ['Dell', 'Oracle', 'AMD', 'Apple'], desc: 'Texas has NO state income tax. Combined with moderate public university tuition, UT Austin is a financial cheat code for international students looking to maximize net savings.' },

  // ── UK ──
  { id: 'imperial', name: 'Imperial College', acronym: 'ICL', country: 'UK', flag: '🇬🇧', currency: 'GBP', tuition: 42000, living: 22000, duration: 1, salary: 55000, taxRate: 0.28, website: 'https://www.imperial.ac.uk/', employers: ['DeepMind', 'Barclays', 'Palantir', 'GSK'], desc: 'A 1-year intensive program. You pay highly concentrated tuition, but enter the workforce a full year faster than US/German counterparts. Elite brand prestige globally.' },
  { id: 'ucl', name: 'University College London', acronym: 'UCL', country: 'UK', flag: '🇬🇧', currency: 'GBP', tuition: 38000, living: 22000, duration: 1, salary: 52000, taxRate: 0.28, website: 'https://www.ucl.ac.uk/', employers: ['HSBC', 'Amazon UK', 'PwC', 'AstraZeneca'], desc: 'Massive multidisciplinary university in central London. Exceptional for Data Science and Finance. The 2-year Graduate Visa allows ample time to secure Tier 2 sponsorship.' },
  { id: 'manchester', name: 'Univ. of Manchester', acronym: 'UoM', country: 'UK', flag: '🇬🇧', currency: 'GBP', tuition: 32000, living: 16000, duration: 1, salary: 45000, taxRate: 0.25, website: 'https://www.manchester.ac.uk/', employers: ['BBC', 'The Hut Group', 'KPMG', 'Arm'], desc: 'A fantastic alternative to London. Manchester is a booming tech hub with living costs nearly 40% lower than the capital. Excellent ROI for Business Analytics and Engineering.' },
  { id: 'edinburgh', name: 'University of Edinburgh', acronym: 'UoE', country: 'UK', flag: '🇬🇧', currency: 'GBP', tuition: 35000, living: 15000, duration: 1, salary: 48000, taxRate: 0.26, website: 'https://www.ed.ac.uk/', employers: ['Skyscanner', 'Rockstar', 'NatWest', 'Baillie Gifford'], desc: 'Scotland\'s premier tech institution, famous globally for its AI and Informatics programs. Edinburgh boasts a massive fintech and gaming industry with highly reasonable rent.' },
  { id: 'oxford', name: 'Oxford University', acronym: 'OXF', country: 'UK', flag: '🇬🇧', currency: 'GBP', tuition: 45000, living: 18000, duration: 1, salary: 60000, taxRate: 0.28, website: 'https://www.ox.ac.uk/', employers: ['McKinsey', 'Goldman Sachs', 'Google', 'Oxford Nanopore'], desc: 'Unmatched global pedigree. The ROI here is less about the starting salary and more about the lifelong network and bypass it grants you through HR screeners worldwide.' },
  { id: 'cambridge', name: 'Cambridge University', acronym: 'CAM', country: 'UK', flag: '🇬🇧', currency: 'GBP', tuition: 45000, living: 18000, duration: 1, salary: 60000, taxRate: 0.28, website: 'https://www.cam.ac.uk/', employers: ['DeepMind', 'Arm', 'Raspberry Pi', 'Apple'], desc: 'The heart of the "Silicon Fen." If you are targeting deep tech, hardware, or AI research in the UK, Cambridge offers unparalleled access to elite British engineering firms.' },
  { id: 'kcl', name: 'King\'s College London', acronym: 'KCL', country: 'UK', flag: '🇬🇧', currency: 'GBP', tuition: 35000, living: 22000, duration: 1, salary: 48000, taxRate: 0.28, website: 'https://www.kcl.ac.uk/', employers: ['NHS', 'Deloitte', 'Unilever', 'IBM'], desc: 'A central London heavyweight, particularly strong in health-tech, cybersecurity, and management. Fast 1-year turnaround with excellent graduate employability rates.' },

  // ── CANADA ──
  { id: 'uoft', name: 'University of Toronto', acronym: 'UofT', country: 'Canada', flag: '🇨🇦', currency: 'CAD', tuition: 85000, living: 50000, duration: 2, salary: 90000, taxRate: 0.28, website: 'https://www.utoronto.ca/', employers: ['Shopify', 'RBC', 'Vector Institute', 'IBM'], desc: 'The epicenter of Canada\'s AI boom. Expensive tuition for international students, but it secures a 3-year PGWP and nearly guarantees a pathway to Canadian Permanent Residency.' },
  { id: 'uwaterloo', name: 'University of Waterloo', acronym: 'UW', country: 'Canada', flag: '🇨🇦', currency: 'CAD', tuition: 65000, living: 35000, duration: 2, salary: 100000, taxRate: 0.28, website: 'https://uwaterloo.ca/', employers: ['Google', 'Meta', 'Amazon', 'Faire'], desc: 'Famous for its legendary co-op program. Students often pay off a massive chunk of their tuition by working in Silicon Valley or Toronto before they even graduate.' },
  { id: 'ubc', name: 'Univ. of British Columbia', acronym: 'UBC', country: 'Canada', flag: '🇨🇦', currency: 'CAD', tuition: 70000, living: 55000, duration: 2, salary: 85000, taxRate: 0.25, website: 'https://www.ubc.ca/', employers: ['Amazon', 'EA', 'Microsoft', 'SAP'], desc: 'Vancouver is arguably Canada\'s most beautiful (and expensive) city. UBC offers elite tech placements, particularly for companies seeking to bypass US immigration by hiring in Vancouver.' },
  { id: 'mcgill', name: 'McGill University', acronym: 'MCG', country: 'Canada', flag: '🇨🇦', currency: 'CAD', tuition: 55000, living: 35000, duration: 2, salary: 80000, taxRate: 0.32, website: 'https://www.mcgill.ca/', employers: ['CGI', 'Ubisoft', 'Morgan Stanley', 'BCE'], desc: 'Located in Montreal, one of North America\'s best student cities. Rent is vastly cheaper than Toronto. Great AI ecosystem, though French language skills help significantly for local jobs.' },
  { id: 'ualberta', name: 'University of Alberta', acronym: 'UofA', country: 'Canada', flag: '🇨🇦', currency: 'CAD', tuition: 40000, living: 28000, duration: 2, salary: 75000, taxRate: 0.25, website: 'https://www.ualberta.ca/', employers: ['DeepMind (Edmonton)', 'Stantec', 'Enbridge', 'CGI'], desc: 'A hidden gem for Reinforcement Learning and AI. Living costs in Edmonton are drastically lower than Toronto/Vancouver, resulting in an exceptionally fast financial breakeven.' },
  { id: 'mcmaster', name: 'McMaster University', acronym: 'MAC', country: 'Canada', flag: '🇨🇦', currency: 'CAD', tuition: 45000, living: 32000, duration: 2, salary: 78000, taxRate: 0.28, website: 'https://www.mcmaster.ca/', employers: ['IBM', 'AMD', 'Ford', 'Stelco'], desc: 'Located in Hamilton, offering close proximity to the Toronto tech corridor without the Toronto rent prices. Excellent for engineering, manufacturing tech, and health informatics.' },
  { id: 'umontreal', name: 'Université de Montréal', acronym: 'UdeM', country: 'Canada', flag: '🇨🇦', currency: 'CAD', tuition: 48000, living: 30000, duration: 2, salary: 75000, taxRate: 0.32, website: 'https://www.umontreal.ca/', employers: ['Mila', 'Desjardins', 'CAE', 'Air Canada'], desc: 'The francophone powerhouse of AI research (home to Mila). If you speak French, this is a golden ticket to Montreal\'s booming tech and gaming sectors with very low living costs.' },

  // ── AUSTRALIA ──
  { id: 'unimelb', name: 'University of Melbourne', acronym: 'UNIM', country: 'Australia', flag: '🇦🇺', currency: 'AUD', tuition: 100000, living: 50000, duration: 2, salary: 85000, taxRate: 0.26, website: 'https://www.unimelb.edu.au/', employers: ['Atlassian', 'Telstra', 'Canva', 'CBA'], desc: 'Consistently ranked #1 in Australia. Offers a direct pathway to the 485 Graduate Visa. High upfront investment, but the Australian minimum wage and starting tech salaries are excellent.' },
  { id: 'unsw', name: 'UNSW Sydney', acronym: 'UNSW', country: 'Australia', flag: '🇦🇺', currency: 'AUD', tuition: 95000, living: 55000, duration: 2, salary: 90000, taxRate: 0.26, website: 'https://www.unsw.edu.au/', employers: ['Google Sydney', 'Macquarie', 'Optus', 'AWS'], desc: 'The strongest engineering and CS reputation in Australia. Sydney\'s rent is brutal, but the concentration of global tech HQs here makes securing high-paying roles easier.' },
  { id: 'monash', name: 'Monash University', acronym: 'MON', country: 'Australia', flag: '🇦🇺', currency: 'AUD', tuition: 90000, living: 45000, duration: 2, salary: 82000, taxRate: 0.25, website: 'https://www.monash.edu/', employers: ['Seek', 'BHP', 'NAB', 'Xero'], desc: 'Massive university network with great industry placements. Melbourne\'s tech scene is highly active, particularly in cybersecurity, IT consulting, and biomedical engineering.' },
  { id: 'anu', name: 'Australian National Uni', acronym: 'ANU', country: 'Australia', flag: '🇦🇺', currency: 'AUD', tuition: 90000, living: 40000, duration: 2, salary: 80000, taxRate: 0.24, website: 'https://www.anu.edu.au/', employers: ['Govt of Australia', 'CSIRO', 'KPMG', 'Accenture'], desc: 'Located in the capital (Canberra). Unbeatable if you are targeting public sector consulting, policy, or research, plus Canberra offers a more relaxed lifestyle and better PR points.' },
  { id: 'usyd', name: 'University of Sydney', acronym: 'USYD', country: 'Australia', flag: '🇦🇺', currency: 'AUD', tuition: 98000, living: 55000, duration: 2, salary: 86000, taxRate: 0.26, website: 'https://www.sydney.edu.au/', employers: ['Commonwealth Bank', 'PwC', 'Deloitte', 'Atlassian'], desc: 'Prestigious and centrally located. Incredible alumni network in corporate Australia. Best suited for students mixing tech with finance, business, or project management.' },
  { id: 'uq', name: 'University of Queensland', acronym: 'UQ', country: 'Australia', flag: '🇦🇺', currency: 'AUD', tuition: 88000, living: 42000, duration: 2, salary: 78000, taxRate: 0.24, website: 'https://www.uq.edu.au/', employers: ['Rio Tinto', 'Suncorp', 'Boeing', 'Flight Centre'], desc: 'Brisbane offers significantly better weather and cheaper living costs than Sydney/Melbourne. Excellent for biotech, mining-tech, and civil engineering fields.' },
  { id: 'uwa', name: 'University of WA', acronym: 'UWA', country: 'Australia', flag: '🇦🇺', currency: 'AUD', tuition: 85000, living: 38000, duration: 2, salary: 85000, taxRate: 0.24, website: 'https://www.uwa.edu.au/', employers: ['Woodside', 'Chevron', 'BHP', 'South32'], desc: 'Perth is the mining capital of Australia. If you do data science, automation, or engineering for the resources sector here, the starting salaries are among the highest in the country.' },

  // ── IRELAND ──
  { id: 'tcd', name: 'Trinity College Dublin', acronym: 'TCD', country: 'Ireland', flag: '🇮🇪', currency: 'EUR', tuition: 24000, living: 18000, duration: 1, salary: 55000, taxRate: 0.28, website: 'https://www.tcd.ie/', employers: ['Google Dublin', 'Meta', 'Stripe', 'HubSpot'], desc: 'Ireland\'s most famous university. The 1-year master\'s leads straight into the Stamp 1G visa. Dublin is the EU headquarters for US tech giants, offering massive employment opportunities.' },
  { id: 'ucd', name: 'University College Dublin', acronym: 'UCD', country: 'Ireland', flag: '🇮🇪', currency: 'EUR', tuition: 25000, living: 18000, duration: 1, salary: 52000, taxRate: 0.28, website: 'https://www.ucd.ie/', employers: ['Amazon', 'Microsoft', 'Accenture', 'Intel'], desc: 'The largest university in Ireland with a heavily modern, tech-focused curriculum. Excellent campus and dedicated pipelines into Dublin\'s "Silicon Docks."' },
  { id: 'nuig', name: 'University of Galway', acronym: 'NUIG', country: 'Ireland', flag: '🇮🇪', currency: 'EUR', tuition: 18000, living: 12000, duration: 1, salary: 45000, taxRate: 0.24, website: 'https://www.universityofgalway.ie/', employers: ['Medtronic', 'Boston Scientific', 'Cisco', 'EA'], desc: 'Galway is Ireland\'s medical device and med-tech capital. Significantly cheaper rent than Dublin, making the ROI fantastic for biomedical and manufacturing engineers.' },
  { id: 'ucc', name: 'University College Cork', acronym: 'UCC', country: 'Ireland', flag: '🇮🇪', currency: 'EUR', tuition: 19000, living: 13000, duration: 1, salary: 48000, taxRate: 0.24, website: 'https://www.ucc.ie/', employers: ['Apple Cork', 'Dell', 'EMC', 'Pfizer'], desc: 'Cork is home to Apple\'s massive European HQ. A fantastic, lower-cost alternative to Dublin with a direct pipeline into major hardware and pharma tech roles.' },
  { id: 'dcu', name: 'Dublin City University', acronym: 'DCU', country: 'Ireland', flag: '🇮🇪', currency: 'EUR', tuition: 18000, living: 18000, duration: 1, salary: 50000, taxRate: 0.28, website: 'https://www.dcu.ie/', employers: ['IBM', 'SAP', 'Workday', 'KPMG'], desc: 'Known as Ireland\'s "University of Enterprise." Highly pragmatic, industry-aligned courses. Often yields faster job placements in software engineering than traditional academia.' },
  { id: 'ul', name: 'University of Limerick', acronym: 'UL', country: 'Ireland', flag: '🇮🇪', currency: 'EUR', tuition: 17000, living: 11000, duration: 1, salary: 44000, taxRate: 0.24, website: 'https://www.ul.ie/', employers: ['Regeneron', 'Analog Devices', 'Stripe', 'Northern Trust'], desc: 'Pioneered cooperative education in Ireland. Incredible placement rates and very affordable living costs on the west coast.' },
  { id: 'maynooth', name: 'Maynooth University', acronym: 'MU', country: 'Ireland', flag: '🇮🇪', currency: 'EUR', tuition: 16000, living: 14000, duration: 1, salary: 45000, taxRate: 0.24, website: 'https://www.maynoothuniversity.ie/', employers: ['Intel', 'Hewlett Packard', 'AIB', 'Kerry Group'], desc: 'Located just outside Dublin (commutable). You get access to the Dublin job market without paying central Dublin rent prices. Great for CS and Data.' },

  // ── NETHERLANDS ──
  { id: 'tudelft', name: 'TU Delft', acronym: 'TUD', country: 'Netherlands', flag: '🇳🇱', currency: 'EUR', tuition: 42000, living: 26000, duration: 2, salary: 60000, taxRate: 0.36, website: 'https://www.tudelft.nl/en/', employers: ['ASML', 'Philips', 'Shell', 'Adyen'], desc: 'One of the best engineering schools on the planet. High tuition for non-EU, but direct access to ASML and the Dutch high-tech sector makes it worth every penny.' },
  { id: 'uva', name: 'University of Amsterdam', acronym: 'UvA', country: 'Netherlands', flag: '🇳🇱', currency: 'EUR', tuition: 36000, living: 30000, duration: 2, salary: 58000, taxRate: 0.36, website: 'https://www.uva.nl/en', employers: ['Booking.com', 'Optiver', 'TomTom', 'ING'], desc: 'Excellent for AI, Business Analytics, and quantitative fields. Amsterdam is expensive, but the 30% tax ruling for highly skilled migrants (if eligible) is a game-changer.' },
  { id: 'eindhoven', name: 'TU Eindhoven', acronym: 'TU/e', country: 'Netherlands', flag: '🇳🇱', currency: 'EUR', tuition: 38000, living: 22000, duration: 2, salary: 58000, taxRate: 0.36, website: 'https://www.tue.nl/en/', employers: ['ASML', 'NXP', 'DAF', 'Thermo Fisher'], desc: 'Located in the "Brainport" region. Literally surrounded by hardware, semiconductor, and embedded systems companies. Exceptional job security for engineers.' },
  { id: 'wur', name: 'Wageningen University', acronym: 'WUR', country: 'Netherlands', flag: '🇳🇱', currency: 'EUR', tuition: 38000, living: 20000, duration: 2, salary: 52000, taxRate: 0.32, website: 'https://www.wur.nl/en.htm', employers: ['Unilever', 'FrieslandCampina', 'Danone', 'Bayer'], desc: 'The global #1 for agriculture, food tech, and environmental sciences. If you are in bio-tech or sustainability, this is the absolute pinnacle.' },
  { id: 'leiden', name: 'Leiden University', acronym: 'LEI', country: 'Netherlands', flag: '🇳🇱', currency: 'EUR', tuition: 39000, living: 24000, duration: 2, salary: 54000, taxRate: 0.36, website: 'https://www.universiteitleiden.nl/en', employers: ['Janssen', 'Galapagos', 'Dutch Govt', 'KPMG'], desc: 'Oldest university in the Netherlands. Incredible for life sciences, law, and international relations, located in a beautiful classic Dutch city.' },
  { id: 'vrije', name: 'Vrije Universiteit', acronym: 'VU', country: 'Netherlands', flag: '🇳🇱', currency: 'EUR', tuition: 35000, living: 30000, duration: 2, salary: 55000, taxRate: 0.36, website: 'https://vu.nl/en', employers: ['ABN AMRO', 'KPMG', 'Accenture', 'IBM'], desc: 'Located in Amsterdam\'s business district (Zuidas). Unbeatable networking for corporate IT, business analytics, and finance.' },
  { id: 'erasmus', name: 'Erasmus Uni Rotterdam', acronym: 'EUR', country: 'Netherlands', flag: '🇳🇱', currency: 'EUR', tuition: 38000, living: 24000, duration: 2, salary: 60000, taxRate: 0.36, website: 'https://www.eur.nl/en', employers: ['Unilever', 'Robeco', 'Shell', 'Deloitte'], desc: 'The premier business and economics university in the Netherlands. Supply chain, maritime logistics, and quantitative finance degrees here print money.' },

  // ── SINGAPORE ──
  { id: 'nus', name: 'National Uni Singapore', acronym: 'NUS', country: 'Singapore', flag: '🇸🇬', currency: 'SGD', tuition: 75000, living: 40000, duration: 1.5, salary: 90000, taxRate: 0.12, website: 'https://nus.edu.sg/', employers: ['Grab', 'Sea Group', 'Google APAC', 'Dyson'], desc: 'Ranked #1 in Asia. Very high tuition without the MOE bond, but Singapore\'s incredibly low tax rate means your take-home pay is massive.' },
  { id: 'ntu', name: 'Nanyang Tech Uni', acronym: 'NTU', country: 'Singapore', flag: '🇸🇬', currency: 'SGD', tuition: 70000, living: 35000, duration: 1.5, salary: 85000, taxRate: 0.12, website: 'https://www.ntu.edu.sg/', employers: ['Shopee', 'Micron', 'Rolls-Royce', 'Tiktok'], desc: 'A global powerhouse for AI, materials science, and engineering. Slightly cheaper living costs as the campus is far from the city center. Fast ROI due to low taxes.' },
  { id: 'smu', name: 'Singapore Mgmt Uni', acronym: 'SMU', country: 'Singapore', flag: '🇸🇬', currency: 'SGD', tuition: 65000, living: 40000, duration: 1, salary: 82000, taxRate: 0.12, website: 'https://www.smu.edu.sg/', employers: ['DBS', 'OCBC', 'Citi', 'McKinsey'], desc: 'Located right in the CBD. The undisputed leader for Business Analytics, Finance, and IT Management in Singapore. Direct pipeline to the banking sector.' },
  { id: 'sutd', name: 'Sing. Uni Tech & Design', acronym: 'SUTD', country: 'Singapore', flag: '🇸🇬', currency: 'SGD', tuition: 60000, living: 35000, duration: 1, salary: 78000, taxRate: 0.12, website: 'https://www.sutd.edu.sg/', employers: ['Changi', 'GovTech', 'Singtel', 'Arup'], desc: 'Established in collaboration with MIT. Highly innovative, design-thinking focused engineering programs. Very high employability.' },
  { id: 'suss', name: 'Singapore Uni Soc Sci', acronym: 'SUSS', country: 'Singapore', flag: '🇸🇬', currency: 'SGD', tuition: 50000, living: 35000, duration: 1.5, salary: 65000, taxRate: 0.10, website: 'https://www.suss.edu.sg/', employers: ['Social Services', 'Logistics', 'KPMG', 'SMEs'], desc: 'More focused on applied degrees and adult learning, but offers strong, affordable tracks in supply chain, applied finance, and social tech.' },
  { id: 'inseadsg', name: 'INSEAD Singapore', acronym: 'INSE', country: 'Singapore', flag: '🇸🇬', currency: 'SGD', tuition: 140000, living: 45000, duration: 1, salary: 160000, taxRate: 0.15, website: 'https://www.insead.edu/', employers: ['Bain', 'BCG', 'McKinsey', 'Amazon'], desc: 'One of the world\'s top MBA programs. Outrageously expensive, but the 10-month duration and MBB (McKinsey, BCG, Bain) placements yield instant ROI.' },
  { id: 'essec', name: 'ESSEC Asia-Pacific', acronym: 'ESSC', country: 'Singapore', flag: '🇸🇬', currency: 'SGD', tuition: 60000, living: 40000, duration: 1, salary: 80000, taxRate: 0.12, website: 'https://www.essec.edu/en/asia-pacific/', employers: ['LVMH', 'Chanel', 'BNP Paribas', 'Societe Generale'], desc: 'Elite French business school with a massive Singapore campus. The go-to for luxury brand management, finance, and strategy consulting in APAC.' }
];

// ── CALCULATE ROI LOGIC ──
const calculateMetrics = (uni) => {
  const totalTuition = uni.tuition * uni.duration;
  const totalLiving = uni.living * uni.duration;
  const totalCost = totalTuition + totalLiving;
  
  const netSalary = uni.salary * (1 - uni.taxRate);
  const annualSavings = netSalary - uni.living;
  
  const breakevenYears = annualSavings > 0 ? (totalCost / annualSavings) : 99;

  // Convert to USD for plotting
  const fxRate = FX[uni.currency] || 1;
  const costUSD = totalCost * fxRate;
  const salaryUSD = uni.salary * fxRate;

  return { totalCost, netSalary, annualSavings, breakevenYears, costUSD, salaryUSD };
}

// Map data
const MASTER_DATA = UNIVERSITIES.map(u => ({ ...u, ...calculateMetrics(u) }));
const ALL_COUNTRIES = ['All', ...new Set(MASTER_DATA.map(u => u.country))];

// ════════════════════════════════════════════════════════════
//  GLOBAL STYLES
// ════════════════════════════════════════════════════════════
const styles = `
  .roi-wrapper {
    --teal: #00f5d4; --purple: #a855f7; --gold: #f59e0b;
    --red: #f43f5e; --green: #34d399; --blue: #3b82f6; 
    --bg: #060c14; --bg2: #0d1520; --bg3: #111c2e;
    --border: rgba(255,255,255,0.07); --text: #e2e8f0; --muted: #64748b;
    background: var(--bg); color: var(--text); font-family: 'Syne', sans-serif;
    min-height: 100vh; overflow-x: hidden; position: relative;
  }
  .roi-wrapper * { box-sizing: border-box; }
  .roi-wrapper a { text-decoration: none; color: inherit; }

  /* SCROLLBAR */
  .roi-wrapper ::-webkit-scrollbar { width: 5px; }
  .roi-wrapper ::-webkit-scrollbar-track { background: var(--bg); }
  .roi-wrapper ::-webkit-scrollbar-thumb { background: rgba(0,245,212,.3); border-radius: 3px; }

  /* BG */
  .grid-bg { position: fixed; inset: 0; z-index: 0; pointer-events: none; background-image: linear-gradient(rgba(255,255,255,.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.015) 1px, transparent 1px); background-size: 60px 60px; mask-image: radial-gradient(ellipse 80% 80% at 50% 0%, black 30%, transparent 100%); }
  .glow-orb { position: fixed; border-radius: 50%; pointer-events: none; z-index: 0; filter: blur(140px); opacity: 0.12; }

  /* NAV */
  .m-nav { position: fixed; top: 0; left: 0; right: 0; z-index: 999; height: 64px; display: flex; align-items: center; justify-content: space-between; padding: 0 40px; background: rgba(6,12,20,.85); backdrop-filter: blur(16px); border-bottom: 1px solid var(--border); }
  .nav-logo { display: flex; align-items: center; gap: 10px; font-size: 1.1rem; font-weight: 700; color: #fff; }
  .logo-icon { width: 34px; height: 34px; border-radius: 9px; background: linear-gradient(135deg, var(--gold), var(--red)); display: flex; align-items: center; justify-content: center; font-size: 16px; color: #000; }
  .nav-logo em { font-style: normal; color: var(--gold); }
  .nav-links { display: flex; gap: 28px; }
  .nav-links a { color: var(--muted); font-size: 0.85rem; font-weight: 600; transition: color .2s; letter-spacing: .04em; }
  .nav-links a.active { color: var(--gold); }
  .nav-links a:hover { color: #fff; }
  .btn-ghost { padding: 8px 18px; border: 1px solid var(--border); border-radius: 8px; color: #fff; font-size: 0.82rem; font-weight: 600; cursor: pointer; background: none; transition: border-color .2s; }
  .btn-ghost:hover { border-color: rgba(255,255,255,.3); }
  .btn-primary { padding: 8px 20px; border-radius: 8px; border: none; background: var(--gold); color: #060c14; font-size: 0.82rem; font-weight: 700; cursor: pointer; transition: opacity .2s; }
  .btn-primary:hover { opacity: .85; }

  /* LAYOUT */
  .main-content { position: relative; z-index: 1; padding: 100px 40px 80px; max-width: 1400px; margin: 0 auto; }
  
  .hero-header { text-align: center; margin-bottom: 56px; animation: fadeUp .6s ease forwards; }
  .hh-badge { display: inline-flex; align-items: center; gap: 8px; padding: 6px 14px; border-radius: 100px; border: 1px solid rgba(245,158,11,.3); font-size: 0.72rem; font-family: 'JetBrains Mono', monospace; color: var(--gold); letter-spacing: .12em; margin-bottom: 24px; background: rgba(245,158,11,.05); }
  .hh-title { font-family: 'Bebas Neue', sans-serif; font-size: clamp(60px, 8vw, 110px); line-height: 1; letter-spacing: .02em; color: #fff; margin-bottom: 16px; }
  .hh-title span { color: var(--gold); }
  .hh-sub { font-size: 1.1rem; color: var(--muted); max-width: 600px; margin: 0 auto; line-height: 1.6; }

  /* CONTROLS */
  .controls-bar { display: flex; justify-content: space-between; align-items: center; background: var(--bg2); border: 1px solid var(--border); border-radius: 16px; padding: 16px 24px; margin-bottom: 32px; flex-wrap: wrap; gap: 16px; animation: fadeUp .6s .1s ease forwards; opacity: 0; }
  .cb-filters { display: flex; gap: 8px; flex-wrap: wrap; }
  .cb-btn { background: rgba(255,255,255,.02); border: 1px solid var(--border); color: var(--muted); padding: 8px 16px; border-radius: 100px; font-size: 0.8rem; font-weight: 600; cursor: pointer; transition: all .2s; }
  .cb-btn:hover { border-color: rgba(255,255,255,.2); color: #fff; }
  .cb-btn.active { background: rgba(245,158,11,.1); border-color: rgba(245,158,11,.4); color: var(--gold); }
  .cb-sort { background: var(--bg3); border: 1px solid var(--border); color: var(--text); padding: 8px 16px; border-radius: 8px; font-family: 'Syne', sans-serif; font-size: 0.8rem; font-weight: 600; outline: none; cursor: pointer; }

  /* SCATTER PLOT (THE GOLDEN QUADRANT) */
  .chart-section { background: var(--bg2); border: 1px solid var(--border); border-radius: 24px; padding: 40px; margin-bottom: 40px; position: relative; animation: fadeUp .6s .2s ease forwards; opacity: 0; overflow: hidden; }
  .chart-section::before { content: ''; position: absolute; top: 0; right: 0; width: 50%; height: 50%; background: radial-gradient(ellipse at top right, rgba(0,245,212,.08), transparent 70%); pointer-events: none; }
  .cs-title { font-family: 'Bebas Neue', sans-serif; font-size: 2rem; color: #fff; letter-spacing: .04em; margin-bottom: 4px; }
  .cs-sub { font-family: 'JetBrains Mono', monospace; font-size: 0.7rem; color: var(--muted); letter-spacing: .1em; margin-bottom: 32px; }
  
  /* THE FIX: Added padding to wrapper to prevent numbers going out of box */
  .chart-wrapper { padding: 20px 30px 40px 60px; position: relative; }

  /* Gridlines inside scatter area */
  .scatter-area { width: 100%; height: 450px; position: relative; border-left: 2px solid var(--border-h); border-bottom: 2px solid var(--border-h); background-image: linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px); background-size: 10% 10%; }
  
  /* Axes Labels (Safe within padding) */
  .axis-y { position: absolute; left: -50px; top: 50%; transform: translateY(-50%) rotate(-90deg); font-family: 'JetBrains Mono', monospace; font-size: 0.65rem; color: var(--muted); letter-spacing: .1em; }
  .axis-x { position: absolute; bottom: -40px; left: 50%; transform: translateX(-50%); font-family: 'JetBrains Mono', monospace; font-size: 0.65rem; color: var(--muted); letter-spacing: .1em; }
  .val-y-max { position: absolute; top: -10px; left: -50px; font-family: 'JetBrains Mono', monospace; font-size: 0.65rem; color: var(--muted); }
  .val-x-max { position: absolute; bottom: -20px; right: -15px; font-family: 'JetBrains Mono', monospace; font-size: 0.65rem; color: var(--muted); }
  .val-y-min { position: absolute; bottom: 5px; left: -30px; font-family: 'JetBrains Mono', monospace; font-size: 0.65rem; color: var(--muted); }
  .val-x-min { position: absolute; bottom: -20px; left: 5px; font-family: 'JetBrains Mono', monospace; font-size: 0.65rem; color: var(--muted); }

  /* Quadrant Backgrounds */
  .quad-bg { position: absolute; inset: 0; z-index: 0; pointer-events: none; }
  .golden-quad { position: absolute; top: 0; left: 0; width: 50%; height: 50%; background: linear-gradient(135deg, rgba(0,245,212,.08), transparent); border-right: 1px dashed rgba(0,245,212,.3); border-bottom: 1px dashed rgba(0,245,212,.3); }
  .gq-label { position: absolute; top: 16px; left: 16px; font-family: 'JetBrains Mono', monospace; font-size: 0.65rem; color: var(--teal); font-weight: 700; letter-spacing: .1em; }

  /* HUD Overlay */
  .chart-hud { position: absolute; top: 20px; right: 20px; width: 220px; background: rgba(6,12,20,.9); border: 1px solid var(--border-h); border-top: 3px solid var(--gold); border-radius: 12px; padding: 16px; backdrop-filter: blur(8px); z-index: 30; animation: fadeUp .2s ease forwards; box-shadow: 0 10px 30px rgba(0,0,0,.5); }
  .hud-head { display: flex; align-items: center; gap: 10px; margin-bottom: 12px; padding-bottom: 12px; border-bottom: 1px dashed var(--border); }
  .hud-flag { font-size: 1.5rem; line-height: 1; }
  .hud-title { font-family: 'Bebas Neue', sans-serif; font-size: 1.4rem; color: #fff; letter-spacing: .05em; line-height: 1; }
  .hud-row { display: flex; justify-content: space-between; font-size: 0.7rem; font-family: 'JetBrains Mono', monospace; margin-bottom: 6px; }
  .hud-row span:first-child { color: var(--muted); }
  .hud-row span:last-child { color: #fff; font-weight: 600; }

  /* Data Points */
  .s-dot { position: absolute; width: 14px; height: 14px; background: var(--bg3); border: 2px solid; border-radius: 50%; transform: translate(-50%, 50%); cursor: pointer; transition: all .2s; z-index: 10; box-shadow: 0 0 10px rgba(0,0,0,.5); display: flex; align-items: center; justify-content: center; overflow: hidden; }
  .s-dot:hover, .s-dot.active { transform: translate(-50%, 50%) scale(1.8); z-index: 20; }
  .s-dot .s-flag { display: none; font-size: 8px; }
  .s-dot:hover .s-flag, .s-dot.active .s-flag { display: block; }
  
  /* LIST GRID */
  .list-grid { display: flex; flex-direction: column; gap: 16px; animation: fadeUp .6s .3s ease forwards; opacity: 0; }
  
  .uni-card { background: var(--bg2); border: 1px solid var(--border); border-radius: 20px; overflow: hidden; transition: all .3s; }
  .uni-card:hover { border-color: rgba(255,255,255,.15); }
  .uni-card.expanded { border-color: var(--gold); box-shadow: 0 20px 60px rgba(0,0,0,.5); }
  
  .uc-header { padding: 24px 32px; display: grid; grid-template-columns: 2.5fr 1fr 1fr 1fr 40px; align-items: center; gap: 16px; cursor: pointer; }
  @media (max-width: 900px) { .uc-header { grid-template-columns: 1fr; gap: 12px; } }
  
  .uc-identity { display: flex; align-items: center; gap: 16px; }
  .uc-logo { width: 48px; height: 48px; border-radius: 12px; background: linear-gradient(135deg, rgba(255,255,255,.05), rgba(255,255,255,.01)); border: 1px solid var(--border); display: flex; align-items: center; justify-content: center; font-family: 'Bebas Neue', sans-serif; font-size: 1.4rem; color: #fff; letter-spacing: .05em; box-shadow: inset 0 0 20px rgba(0,0,0,.5); flex-shrink:0; }
  .uc-name { font-family: 'Bebas Neue', sans-serif; font-size: 1.5rem; color: #fff; letter-spacing: .04em; margin-bottom: 4px; line-height: 1; }
  .uc-loc { font-size: 0.75rem; color: var(--muted); font-family: 'JetBrains Mono', monospace; }

  .uc-metric { display: flex; flex-direction: column; gap: 4px; }
  .uc-m-lbl { font-family: 'JetBrains Mono', monospace; font-size: 0.6rem; color: var(--muted); text-transform: uppercase; letter-spacing: .1em; }
  .uc-m-val { font-size: 1.1rem; font-weight: 700; color: var(--text); }
  
  .uc-roi { display: flex; flex-direction: column; align-items: flex-end; gap: 4px; }
  .uc-roi-val { font-family: 'Bebas Neue', sans-serif; font-size: 2rem; line-height: 1; color: var(--gold); }
  .uc-roi-val.fast { color: var(--teal); }
  .uc-roi-val.slow { color: var(--red); }

  .uc-expand-icon { color: var(--muted); transition: transform .3s; display: flex; justify-content: center; }
  .uni-card.expanded .uc-expand-icon { transform: rotate(180deg); color: var(--gold); }

  /* EXPANDED CONTENT */
  .uc-body { padding: 0 32px 32px; border-top: 1px solid var(--border); background: rgba(0,0,0,.2); display: none; }
  .uni-card.expanded .uc-body { display: block; animation: slideDown .3s ease forwards; }
  @keyframes slideDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }

  .uc-body-grid { display: grid; grid-template-columns: 2fr 1fr; gap: 40px; margin-top: 32px; }
  @media (max-width: 900px) { .uc-body-grid { grid-template-columns: 1fr; gap: 24px; } }

  .uc-desc { font-size: 0.95rem; color: #cbd5e1; line-height: 1.6; margin-bottom: 24px; }
  .uc-employers-lbl { font-family: 'JetBrains Mono', monospace; font-size: 0.65rem; color: var(--muted); letter-spacing: .1em; margin-bottom: 12px; }
  .uc-tags { display: flex; flex-wrap: wrap; gap: 8px; }
  .uc-tag { font-size: 0.75rem; padding: 6px 12px; background: rgba(255,255,255,.04); border: 1px solid var(--border); border-radius: 8px; color: var(--text-2); font-weight: 600; }

  .uc-math { background: var(--bg2); border: 1px dashed rgba(255,255,255,.1); border-radius: 16px; padding: 20px; }
  .math-row { display: flex; justify-content: space-between; font-size: 0.8rem; color: var(--muted); margin-bottom: 10px; }
  .math-row span:last-child { color: var(--text); font-family: 'JetBrains Mono', monospace; }
  .math-row.divider { border-top: 1px solid var(--border); padding-top: 10px; margin-top: 5px; }
  .math-row.highlight { color: #fff; font-weight: 700; }
  .math-row.highlight span:last-child { color: var(--teal); }

  .uc-actions { margin-top: 32px; display: flex; gap: 16px; }
  .btn-website { flex: 1; padding: 12px; border-radius: 12px; border: 1px solid var(--border); background: var(--bg3); color: #fff; font-size: 0.85rem; font-weight: 600; display: flex; align-items: center; justify-content: center; gap: 8px; transition: all .2s; }
  .btn-website:hover { border-color: var(--gold); color: var(--gold); }
  .btn-mentor { flex: 2; padding: 12px; border-radius: 12px; border: none; background: var(--gold); color: #000; font-size: 0.85rem; font-weight: 700; display: flex; align-items: center; justify-content: center; gap: 8px; cursor: pointer; transition: all .2s; }
  .btn-mentor:hover { transform: translateY(-2px); box-shadow: 0 10px 20px rgba(245,158,11,.3); }

  /* ANIMATIONS */
  @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
`

export default function ROIMatrixPage() {
  const [mounted, setMounted] = useState(false)
  const [activeCountry, setActiveCountry] = useState('All')
  const [sortMetric, setSortMetric] = useState('breakeven') 
  const [expandedId, setExpandedId] = useState(null)
  const [hoveredNode, setHoveredNode] = useState(null)

  useEffect(() => {
    setMounted(true)
    const link = document.createElement('link')
    link.href = 'https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Syne:wght@400;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap'
    link.rel = 'stylesheet'
    document.head.appendChild(link)
  }, [])

  if (!mounted) return null;

  // Filter & Sort Data
  let displayData = MASTER_DATA;
  if (activeCountry !== 'All') {
    displayData = displayData.filter(d => d.country === activeCountry);
  }

  displayData.sort((a, b) => {
    if (sortMetric === 'breakeven') return a.breakevenYears - b.breakevenYears;
    if (sortMetric === 'cost') return a.totalCost - b.totalCost;
    if (sortMetric === 'salary') return b.salary - a.salary;
    return 0;
  });

  // Safe Scatter Plot Limits
  const MAX_COST_USD = 220000;
  const MAX_SALARY_USD = 180000;
  
  const getCoords = (costUSD, salaryUSD) => {
    const x = (costUSD / MAX_COST_USD) * 100;
    const y = 100 - ((salaryUSD / MAX_SALARY_USD) * 100);
    return { x, y };
  }

  const hoveredData = hoveredNode ? MASTER_DATA.find(u => u.id === hoveredNode) : null;

  return (
    <div className="roi-wrapper">
      <style>{styles}</style>
      
      {/* BACKGROUND */}
      <div className="grid-bg"></div>
      <div className="glow-orb" style={{ width:700, height:700, background:'var(--gold)', top:-200, left:-200 }}></div>
      <div className="glow-orb" style={{ width:500, height:500, background:'var(--teal)', bottom:-100, right:-100 }}></div>

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
          <Link href="/market-insights">Market Data</Link>
          <Link href="/roi-matrix" className="active">ROI Matrix</Link>
        </div>
        <div className="nav-cta">
          <Link href="/dashboard/student" className="btn-ghost">Log in</Link>
          <Link href="/signup" className="btn-primary">Sign up →</Link>
        </div>
      </nav>

      <main className="main-content">
        
        {/* HERO */}
        <div className="hero-header">
          <div className="hh-badge"><Target size={14} /> FINANCIAL PHYSICS ENGINE</div>
          <h1 className="hh-title">THE <span>ROI</span> MATRIX</h1>
          <p className="hh-sub">Total Cost vs. Starting Salary. Calculate the exact timeline to break even on your master's degree across 56 elite global institutions.</p>
        </div>

        {/* CONTROLS */}
        <div className="controls-bar">
          <div className="cb-filters">
            {ALL_COUNTRIES.map(c => (
              <button 
                key={c} 
                className={`cb-btn ${activeCountry === c ? 'active' : ''}`}
                onClick={() => setActiveCountry(c)}
              >
                {c}
              </button>
            ))}
          </div>
          <div>
            <select className="cb-sort" value={sortMetric} onChange={(e) => setSortMetric(e.target.value)}>
              <option value="breakeven">Sort: Fastest ROI</option>
              <option value="cost">Sort: Lowest Cost</option>
              <option value="salary">Sort: Highest Salary</option>
            </select>
          </div>
        </div>

        {/* SCATTER PLOT */}
        <div className="chart-section">
          <div className="cs-title">GLOBAL INVESTMENT MAP</div>
          <div className="cs-sub">Normalized to USD. X-Axis: Total Investment. Y-Axis: Starting Salary.</div>
          
          {/* THE PADDED WRAPPER FIXES AXIS CLIPPING */}
          <div className="chart-wrapper">
            <div className="scatter-area">
              
              {/* Axes */}
              <div className="axis-y">POST-GRADUATION SALARY (USD) →</div>
              <div className="axis-x">TOTAL INVESTMENT COST (USD) →</div>
              
              {/* Markers */}
              <div className="val-y-max">${MAX_SALARY_USD / 1000}k</div>
              <div className="val-x-max">${MAX_COST_USD / 1000}k</div>
              <div className="val-y-min">$0</div>
              <div className="val-x-min">$0</div>

              {/* Quadrant Lines */}
              <div className="quad-bg">
                <div className="golden-quad">
                  <div className="gq-label"><Crosshair size={12} style={{display:'inline', marginBottom:'-2px'}}/> THE GOLDEN QUADRANT<br/><span style={{color:'var(--muted)', fontWeight:400, fontSize:'0.55rem'}}>(Low Cost / High Yield)</span></div>
                </div>
              </div>

              {/* Plot Points with Dynamic Colors and Flags */}
              {displayData.map((uni) => {
                const pos = getCoords(uni.costUSD, uni.salaryUSD);
                const isActive = hoveredNode === uni.id || expandedId === uni.id;
                const safeX = Math.min(pos.x, 100);
                const safeY = Math.max(pos.y, 0);
                const dotColor = COUNTRY_COLORS[uni.country] || 'var(--purple)';

                return (
                  <div 
                    key={uni.id}
                    className={`s-dot ${isActive ? 'active' : ''}`}
                    style={{ left: `${safeX}%`, top: `${safeY}%`, borderColor: dotColor }}
                    onMouseEnter={() => setHoveredNode(uni.id)}
                    onMouseLeave={() => setHoveredNode(null)}
                    onClick={() => {
                      setExpandedId(expandedId === uni.id ? null : uni.id);
                      document.getElementById(`card-${uni.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }}
                  >
                    <span className="s-flag">{uni.flag}</span>
                  </div>
                )
              })}

              {/* TELEMETRY HUD OVERLAY */}
              {hoveredData && (
                <div className="chart-hud">
                  <div className="hud-head">
                    <div className="hud-flag">{hoveredData.flag}</div>
                    <div className="hud-title">{hoveredData.acronym}</div>
                  </div>
                  <div className="hud-row"><span>Investment:</span> <span style={{color:'#f59e0b'}}>${Math.round(hoveredData.costUSD).toLocaleString()}</span></div>
                  <div className="hud-row"><span>Avg Salary:</span> <span style={{color:'#00f5d4'}}>${Math.round(hoveredData.salaryUSD).toLocaleString()}</span></div>
                  <div className="hud-row" style={{marginTop:8, paddingTop:8, borderTop:'1px solid rgba(255,255,255,0.1)'}}>
                    <span>Breakeven:</span> 
                    <span style={{color: hoveredData.breakevenYears < 3 ? '#34d399' : '#f43f5e'}}>
                      {hoveredData.breakevenYears < 10 ? hoveredData.breakevenYears.toFixed(1) + ' Yrs' : '10+ Yrs'}
                    </span>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>

        {/* DATA LIST */}
        <div className="list-grid">
          {displayData.map((uni) => {
            const isExpanded = expandedId === uni.id;
            const be = uni.breakevenYears;
            const beColorClass = be < 2 ? 'fast' : be > 5 ? 'slow' : '';
            const beText = be < 10 ? `${be.toFixed(1)} YRS` : '10+ YRS';

            return (
              <div className={`uni-card ${isExpanded ? 'expanded' : ''}`} id={`card-${uni.id}`} key={uni.id}>
                
                {/* HEADER (Clickable) */}
                <div className="uc-header" onClick={() => setExpandedId(isExpanded ? null : uni.id)}>
                  <div className="uc-identity">
                    <div className="uc-logo">{uni.acronym}</div>
                    <div>
                      <div className="uc-name">{uni.name}</div>
                      <div className="uc-loc">{uni.flag} {uni.country} · {uni.duration} Yr Master's</div>
                    </div>
                  </div>
                  
                  <div className="uc-metric">
                    <span className="uc-m-lbl">Total Cost</span>
                    <span className="uc-m-val">{uni.currency} {uni.totalCost.toLocaleString()}</span>
                  </div>

                  <div className="uc-metric">
                    <span className="uc-m-lbl">Avg Starting Sal</span>
                    <span className="uc-m-val">{uni.currency} {uni.salary.toLocaleString()}</span>
                  </div>

                  <div className="uc-roi">
                    <span className="uc-m-lbl">Breakeven Time</span>
                    <span className={`uc-roi-val ${beColorClass}`}>{beText}</span>
                  </div>

                  <div className="uc-expand-icon">
                    <ChevronDown size={24} />
                  </div>
                </div>

                {/* EXPANDED CONTENT */}
                <div className="uc-body">
                  <div className="uc-body-grid">
                    
                    {/* Left: Info */}
                    <div>
                      <div className="uc-desc">{uni.desc}</div>
                      <div className="uc-employers-lbl">TOP RECRUITERS IN AREA</div>
                      <div className="uc-tags">
                        {uni.employers.map((emp, i) => (
                          <span key={i} className="uc-tag"><Building2 size={12} style={{display:'inline', marginBottom:'-2px', marginRight:'4px'}}/>{emp}</span>
                        ))}
                      </div>

                      <div className="uc-actions">
                        <a href={uni.website} target="_blank" rel="noopener noreferrer" className="btn-website">
                          Official Site <ExternalLink size={14} />
                        </a>
                        <Link href="/mentors" className="btn-mentor">
                          Connect with {uni.acronym} Alumni <ArrowRight size={16} />
                        </Link>
                      </div>
                    </div>

                    {/* Right: The Math */}
                    <div>
                      <div className="uc-math">
                        <div style={{fontFamily:'Bebas Neue', fontSize:'1.2rem', color:'#fff', letterSpacing:'.04em', marginBottom:16}}>THE EXACT MATH</div>
                        
                        <div className="math-row"><span>Degree Duration</span><span>{uni.duration} Years</span></div>
                        <div className="math-row"><span>Tuition (Total)</span><span>{uni.currency} {(uni.tuition * uni.duration).toLocaleString()}</span></div>
                        <div className="math-row"><span>Living Cost (Total)</span><span>{uni.currency} {(uni.living * uni.duration).toLocaleString()}</span></div>
                        <div className="math-row divider highlight" style={{color:'#f59e0b'}}><span>Total Investment</span><span>{uni.currency} {uni.totalCost.toLocaleString()}</span></div>
                        
                        <div className="math-row" style={{marginTop:24}}><span>Gross Starting Salary</span><span>{uni.currency} {uni.salary.toLocaleString()}</span></div>
                        <div className="math-row"><span>Est. Tax Rate</span><span>{(uni.taxRate * 100).toFixed(0)}%</span></div>
                        <div className="math-row"><span>Net Salary (Take home)</span><span>{uni.currency} {Math.round(uni.netSalary).toLocaleString()}</span></div>
                        <div className="math-row"><span>Minus Yearly Living Cost</span><span style={{color:'var(--red)'}}>-{uni.currency} {uni.living.toLocaleString()}</span></div>
                        
                        <div className="math-row divider highlight"><span>Net Annual Savings</span><span>{uni.currency} {Math.round(uni.annualSavings).toLocaleString()}</span></div>
                        
                        <div style={{marginTop:20, padding:'10px', background:'rgba(245,158,11,.1)', border:'1px solid rgba(245,158,11,.3)', borderRadius:8, textAlign:'center'}}>
                          <span style={{fontSize:'0.65rem', fontFamily:'JetBrains Mono', color:'var(--gold)', letterSpacing:'.1em'}}>PAYOFF TIMELINE</span><br/>
                          <span style={{fontFamily:'Bebas Neue', fontSize:'1.8rem', color:'#fff'}}>{beText}</span>
                        </div>

                      </div>
                    </div>

                  </div>
                </div>
              </div>
            )
          })}
        </div>

      </main>
    </div>
  )
}