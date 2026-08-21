'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

/* ═══════════════════════════════════════════════════════════════
   DATA
═══════════════════════════════════════════════════════════════ */
const COUNTRIES = {
  germany: {
    name:'Germany', flag:'🇩🇪', col:'#00AAFF', glow:'rgba(0,170,255,.4)',
    accent:'#FFD700', embassyName:'German Embassy — Visa Section, New Delhi',
    officerName:'Herr Fischer', officerEmoji:'🧑‍💼',
    officerStyle:'Formal, methodical. Expects academic precision.',
    visaType:'National Visa Type D — Student',
    processingTime:'4–8 weeks', successRate:'78%',
    tagline:'Free tuition, world-class engineering',
    questions:[
      { id:1, scoreLabel:'Clarity of Purpose', text:'Which university have you been admitted to, and what exactly will you study?', hint:'Be precise — name the program, university, duration, and start date.', goodKw:['university','master','program','semester','computer science','engineering','research','tu','rwth','berlin','munich','winter','summer','two years','duration','bachelor','phd'], badKw:['work','job','money','stay','not sure','maybe','earn'], minLen:60, tip:'Officers want to see you know exactly what you\'re doing. Name the program, the university, the start date.', example:'I have been admitted to the MSc Informatics program at TU Munich starting Winter Semester 2025 — a two-year program. I have my APS appointment booked. The program focuses on Machine Learning and aligns directly with my undergraduate research in neural networks.' },
      { id:2, scoreLabel:'Financial Proof', text:'How will you finance your studies and living expenses in Germany?', hint:'Germany requires €11,208/year in a blocked account. The word "Sperrkonto" is key.', goodKw:['blocked account','sperrkonto','bank','savings','scholarship','daad','parents','funds','euros','financial','sponsor','proof','statement','11208','fintiba','dkb'], badKw:['work part time','find job','manage somehow','borrow','unsecured loan','not arranged'], minLen:60, tip:'The magic words are "blocked account" (Sperrkonto). Fintiba and DKB are trusted providers — naming them shows preparation.', example:'I have opened a Fintiba blocked account with €11,208 deposited as required by German immigration law. My parents are additional sponsors — their bank statements showing €40,000 in savings are attached. I am fully financially prepared.' },
      { id:3, scoreLabel:'Intent to Return', text:'What are your plans after completing your degree? Do you intend to return to India?', hint:'The 18-month Job Seeker Visa is a legal pathway — you can mention it honestly.', goodKw:['return','india','family','home','contribute','experience','career','eventually','skills','job seeker visa','18 months','legal','work experience','ties'], badKw:['stay permanently','never return','settle forever','citizenship immediately','bring family right away'], minLen:60, tip:'Don\'t say "settle permanently." The 18-month Job Seeker Visa + eventual India return is the honest and legally sound answer.', example:'After graduation, I plan to use Germany\'s 18-month Job Seeker Visa to gain international work experience — a legal and recognised pathway. My long-term goal is to return to India and contribute my ML expertise to the growing tech sector. My family is in Pune and I have strong ties there.' },
      { id:4, scoreLabel:'Genuine Motivation', text:'Why Germany specifically? Why not study in India, UK, Canada, or USA?', hint:'Free tuition + specific research + German industry connections is the perfect answer.', goodKw:['tuition','free','research','engineering','industry','quality','europe','specific program','professor','technology','tu9','ranked','culture','language','practical','automotive','siemens','bmw'], badKw:['easy visa','cheap','easy to get in','anyone can go','my friend went','random'], minLen:60, tip:'€0 tuition is perfectly valid. Combine with a specific professor, lab, or TU9 ranking to make it genuine.', example:'Germany offers zero tuition fees at public universities — a financial advantage no other country matches. More importantly, TU Munich\'s partnership with BMW and Siemens means direct industry research access. Prof. Schiele\'s computer vision lab directly aligns with my research interests, unavailable in India.' },
      { id:5, scoreLabel:'Independence', text:'Do you have family or close friends currently living in Germany or the EU?', hint:'Answer honestly. If yes, stress your financial and housing independence.', goodKw:['no','independent','accommodation','university housing','dormitory','own arrangements','studentenwerk','wg','student halls','financially independent'], badKw:['live with','depend on','stay with','no plan for housing','figure out later','relatives will manage'], minLen:30, tip:'If family is there, the key phrase is "I am fully financially and housing-independent from them." This removes any concern.', example:'I have no close family in Germany. I have already applied to the Studentenwerk dormitory and identified WG flatshares near TU Munich as backup. I am fully financially self-sufficient with my blocked account and parental sponsorship.' },
    ],
  },
  usa: {
    name:'United States', flag:'🇺🇸', col:'#FF4D6D', glow:'rgba(255,77,109,.4)',
    accent:'#3C3B6E', embassyName:'US Embassy — Nonimmigrant Visa Unit, New Delhi',
    officerName:'Officer Williams', officerEmoji:'👨‍💼',
    officerStyle:'Fast-paced, direct. Seen 50 applicants today.',
    visaType:'F-1 Student Visa',
    processingTime:'2–6 weeks', successRate:'82%',
    tagline:'Ties to India are everything',
    questions:[
      { id:1, scoreLabel:'Study Plan Clarity', text:'Where will you study and what is your program?', hint:'Name the exact university, program, and mention your I-20.', goodKw:['university','master','bachelor','phd','program','degree','i-20','sevis','campus','accepted','enrolled','spring','fall','ivy','cmu','mit','stanford','georgia tech','northeastern'], badKw:['not sure','maybe','might change','backup','undecided'], minLen:50, tip:'Mention your I-20 and SEVIS readiness. Name a specific reason you chose that exact school — not just its ranking.', example:'I have been accepted to the MSCS program at Carnegie Mellon University for Fall 2025. My I-20 has been issued. I chose CMU specifically because of the Language Technologies Institute — it directly aligns with my NLP research background from IIT Bombay.' },
      { id:2, scoreLabel:'Financial Stability', text:'How will you pay for your education and living expenses in the US?', hint:'Show $50,000–70,000/year available. Scholarships or TA/RA funding are strongest.', goodKw:['savings','sponsor','parents','scholarship','fellowship','assistantship','bank statement','funds available','financial support','affidavit','ta','ra','graduate funding'], badKw:['work part time fully','unsecured loan','manage somehow','not confirmed yet','friends will help'], minLen:60, tip:'Lead with scholarships or TA/RA funding if you have them — this is the strongest possible answer.', example:'I have a Teaching Assistantship from CMU covering full tuition plus a $24,000 annual stipend. My parents additionally have $80,000 in savings documented in certified bank statements and affidavit of support. I am completely financially secured for my 18-month program.' },
      { id:3, scoreLabel:'Ties to Home Country', text:'What are your strong ties to India that will bring you back after your studies?', hint:'THIS is the #1 F-1 question. Concrete ties — not just "I love India."', goodKw:['family','parents','siblings','property','business','job offer','career india','home','return','contribute','ties','roots','dependent','assets','obligation'], badKw:['stay','permanent residence','green card','settle forever','no plan to return','might not come back'], minLen:70, tip:'This is the #1 F-1 rejection reason. Name specific ties: family obligations, a concrete job offer, property, business. Generic answers fail.', example:'My parents are in Pune and fully depend on me as their only child. Our family has a software consultancy business I am expected to join. I have a conditional offer from Infosys Bengaluru on degree completion. We own property jointly. All of this brings me home.' },
      { id:4, scoreLabel:'Honesty', text:'Have you applied to or been rejected by any US visa before?', hint:'Answer 100% honestly. Lying is grounds for a permanent ban.', goodKw:['no','first time','never applied','honest','this is my first','transparent','fresh application'], badKw:[], minLen:20, tip:'If previously rejected, say so honestly and explain what changed. Lying = permanent ban. Honesty = possible success.', example:'This is my first US visa application. I have never applied before. I wanted to ensure my profile was complete — with my I-20, financial documents, and admission letter — before applying.' },
      { id:5, scoreLabel:'Career Intent', text:'What do you plan to do with your US degree when you return to India?', hint:'Name a specific industry or company in India. Concrete beats vague every time.', goodKw:['industry','company','career','job','return','india','startup','contribute','apply skills','specific field','work in india','family business','teaching','research','bengaluru','hyderabad','mumbai'], badKw:['stay in usa','find a way to stay','green card','not sure at all','see what happens'], minLen:60, tip:'Name a specific company or sector. "I plan to join Google India\'s AI team in Bengaluru" is infinitely stronger than "work in tech."', example:'I plan to return to India and join a leading AI company — targeting Google India, Microsoft Hyderabad, or a funded AI startup in Bengaluru. India\'s AI sector is growing 40% annually. I also have a strong interest in eventually teaching at IIT, where my skills will multiply in impact.' },
    ],
  },
  uk: {
    name:'United Kingdom', flag:'🇬🇧', col:'#A855F7', glow:'rgba(168,85,247,.4)',
    accent:'#C8102E', embassyName:'UK Visa & Immigration — Application Centre',
    officerName:'Officer Davies', officerEmoji:'👩‍💼',
    officerStyle:'Methodical. Checks documents before asking questions.',
    visaType:'Student Visa (formerly Tier 4)',
    processingTime:'3–6 weeks', successRate:'83%',
    tagline:'CAS number is your passport',
    questions:[
      { id:1, scoreLabel:'CAS & Enrollment', text:'Which UK institution has offered you a place, and what course will you study?', hint:'Mention your CAS reference number — it is the most critical UK visa document.', goodKw:['university','college','cas','confirmation','course','program','master','russell group','oxford','cambridge','imperial','ucl','manchester','edinburgh','lse','warwick'], badKw:['not confirmed','might study','several options','not sure yet','provisional'], minLen:50, tip:'Your CAS number is the most important UK visa document. Mentioning it instantly builds credibility with the officer.', example:'I have been offered a place at UCL for the MSc Computer Science program starting September 2025. My CAS reference has been issued. UCL is part of the Russell Group, consistently ranked top-10 globally, and the specific AI curriculum directly aligns with my research background.' },
      { id:2, scoreLabel:'Financial Evidence', text:'How will you meet UK financial requirements? London needs £1,334/month.', hint:'Show funds for the full course + 1 month. The 28-day rule is critical.', goodKw:['savings','parents','sponsor','scholarship','chevening','commonwealth','bank statement','pounds','funds','financial evidence','maintenance funds','duration','28 days'], badKw:['work and pay entirely','loan from friend','not sure','manage somehow','borrow without plan'], minLen:55, tip:'The 28-day consecutive holding requirement is critical to mention — it shows you\'ve studied UKVI requirements thoroughly.', example:'I have £32,000 in my bank account held continuously for 28+ days — meeting UKVI\'s £1,334 × 12 months London requirement plus my £18,000 tuition. My parents have also provided sponsorship documentation showing £45,000 additional savings. All evidence is UKVI-compliant.' },
      { id:3, scoreLabel:'Academic Suitability', text:'What is your academic background and why are you qualified for this course?', hint:'Show clear progression: undergrad → postgrad. If changing fields, explain the connection.', goodKw:['degree','gpa','percentage','bachelor','engineering','computer science','relevant','grade','qualified','prerequisite','academic','research','project','experience','honours','distinction'], badKw:['not related at all','completely different field','no background whatsoever'], minLen:60, tip:'Show clear undergraduate → postgraduate progression. If your degree is in a different field, explain the intellectual connection explicitly.', example:'I have a B.Tech in Computer Science from VIT Pune with CGPA 8.7/10, qualifying me directly for UCL\'s MSc CS. My undergraduate dissertation on neural network optimization is directly relevant. I have published one paper and completed two ML internships, making me fully prepared.' },
      { id:4, scoreLabel:'Temporary Intent', text:'Do you genuinely intend to leave the UK at the end of your studies?', hint:'Mention the Graduate Route visa (2-year post-study work) — it shows you know UK immigration law.', goodKw:['return','india','home','family','graduate route','graduate visa','temporary','career india','ties','plans back home','experience','contribute','eventually'], badKw:['stay permanently','settle forever','never return','bring entire family immediately','no plans to leave ever'], minLen:60, tip:'Mentioning the Graduate Route visa (2-year post-study work) shows you know UK immigration law — this actively impresses officers.', example:'Yes, absolutely. After my MSc, I plan to use the Graduate Route visa for 2 years of work experience in London\'s tech sector — a legal and expected pathway. After gaining that experience, I intend to return to India, where my family, career prospects, and long-term plans are based.' },
      { id:5, scoreLabel:'English Proficiency', text:'What is your IELTS or equivalent English language score?', hint:'State each band score individually. "UKVI-approved" shows you know the rules.', goodKw:['ielts','6.5','7.0','7.5','8.0','overall','band','language','proficiency','english','score','certificate','test','pte','toefl','ukvi'], badKw:['no test yet','english is my mother tongue without cert','did not take','planning to take soon','exempted without proof'], minLen:40, tip:'Specify each band score individually. Saying "UKVI-approved IELTS" shows you understand the UK visa requirement precisely.', example:'I scored 7.5 overall on UKVI-approved IELTS Academic — Listening 8.0, Reading 8.5, Writing 6.5, Speaking 7.5. This exceeds UCL\'s requirement of 7.0 overall with no band below 6.5. I took the test at an authorised British Council centre.' },
    ],
  },
  canada: {
    name:'Canada', flag:'🇨🇦', col:'#F59E0B', glow:'rgba(245,158,11,.4)',
    accent:'#FF0000', embassyName:'Immigration, Refugees & Citizenship Canada (IRCC)',
    officerName:'Officer Patel', officerEmoji:'🧑‍💼',
    officerStyle:'Open, structured. Canada is transparent about immigration pathways.',
    visaType:'Study Permit',
    processingTime:'4–16 weeks', successRate:'76%',
    tagline:'PGWP is your strongest card',
    questions:[
      { id:1, scoreLabel:'DLI Acceptance', text:'Which Canadian institution has issued your Letter of Acceptance?', hint:'Canada requires a LOA from a Designated Learning Institution (DLI). Mention the DLI number.', goodKw:['university','college','dli','designated learning institution','letter of acceptance','program','master','toronto','ubc','waterloo','mcgill','alberta','start date','dli number'], badKw:['not confirmed','applied but waiting','might go','several options','not sure yet'], minLen:50, tip:'Mentioning the DLI number specifically shows you\'ve done your research — a strong trust signal with IRCC officers.', example:'I have a Letter of Acceptance from the University of Waterloo — a Designated Learning Institution (DLI number O19343984142) — for the Master of Mathematics in Computer Science starting September 2025. The LOA specifies my program start date and expected completion.' },
      { id:2, scoreLabel:'Financial Proof', text:'How will you finance your studies and living expenses in Canada?', hint:'Show tuition + C$10,000/year for living. State the total math clearly.', goodKw:['savings','parents','scholarship','funds','bank statement','canadian dollar','living costs','tuition','total','adequate','proof','financial','c$','cad'], badKw:['work only entirely','borrow later informally','relatives will pay maybe','figure out','not sure exact amount'], minLen:55, tip:'State the math clearly: tuition + C$10,000 living + buffer. Show you know the exact Canadian requirement number.', example:'I have C$68,000 total — C$18,000 first-year tuition plus C$10,000 minimum living expenses plus a C$40,000 buffer for subsequent years. My father has provided sponsorship documents showing this in certified bank statements. I also have a partial Waterloo scholarship.' },
      { id:3, scoreLabel:'Country Reasoning', text:'Why have you chosen Canada for your studies?', hint:'PGWP and Express Entry are legitimate reasons — be honest about them. Canada respects this.', goodKw:['pgwp','post graduate work permit','permanent residence','express entry','university ranking','research','multicultural','safe','quality','indian community','co-op','waterloo co-op'], badKw:['easy immigration backdoor','permanent residence immediately free','backdoor to usa','random choice','friend suggested casually'], minLen:55, tip:'Canada is genuinely open about PGWP and PR pathways. Mentioning them honestly is perfectly acceptable — even expected.', example:'Waterloo\'s co-op program is globally recognised and the AI research department is ranked #1 in Canada. The PGWP allows legitimate Canadian work experience after graduation. Canada\'s multicultural environment and large Indian community will help me settle quickly and focus on academics.' },
      { id:4, scoreLabel:'Compliance Intent', text:'Do you intend to leave Canada at the end of your authorised stay?', hint:'Canada is more open than USA — you can honestly mention PGWP and Express Entry.', goodKw:['intend','comply','leave if required','pgwp','legal pathway','authorized','understand conditions','express entry','proper channels','comply with immigration rules'], badKw:['stay illegally','overstay deliberately','not leave regardless','bypass the system'], minLen:50, tip:'Canada allows honest PGWP + Express Entry discussion. This is unique — embrace this openness rather than giving a USA-style "I\'ll definitely return" answer.', example:'I intend to fully comply with my study permit conditions. After graduation, I plan to apply for PGWP to gain work experience legally. If I decide to pursue permanent residence, I will do so through proper Express Entry channels. I will always comply with Canada\'s immigration requirements.' },
      { id:5, scoreLabel:'Ties & Support', text:'Do you have family in Canada? Tell me about your ties to India.', hint:'Canada checks both India ties AND Canada support network. Family in Canada is not negative.', goodKw:['family india','parents','siblings','home','ties','property','career','support','return plans','india connections','community','established roots'], badKw:['no ties to india','nothing left in india','completely disconnected from india','no reason to go back'], minLen:50, tip:'Family in Canada = support system, not a red flag. But still show India ties clearly and specifically.', example:'My parents and sibling are in Pune — my father runs a small business and my mother teaches at a school. I have a family home there. In Canada, I have a distant uncle in Toronto as emergency contact, but I am fully financially independent from him. My roots are clearly in India.' },
    ],
  },
  australia: {
    name:'Australia', flag:'🇦🇺', col:'#00E5A8', glow:'rgba(0,229,168,.4)',
    accent:'#FFCD00', embassyName:'Australian High Commission — Visa Office, New Delhi',
    officerName:'Officer Thompson', officerEmoji:'👨‍💼',
    officerStyle:'Straightforward, values transparency. GTE is the key test.',
    visaType:'Student Visa (Subclass 500)',
    processingTime:'4–6 weeks', successRate:'85%',
    tagline:'GTE statement is non-negotiable',
    questions:[
      { id:1, scoreLabel:'Enrollment Clarity', text:'Which Australian institution have you enrolled at and what course will you undertake?', hint:'Mention your CoE (Confirmation of Enrolment) — officers check the database immediately.', goodKw:['university','course','enrolled','coe','confirmation of enrolment','ielts','provider','years','semester','melbourne','sydney','unsw','anu','monash','queensland','cricos'], badKw:['not sure','might change','several options','considering multiple'], minLen:50, tip:'Mentioning your CoE number signals genuine enrollment — Australian officers check this database the moment you mention it.', example:'I am enrolled at the University of Melbourne for the Master of Computer Science starting February 2025 — a 2-year CRICOS-registered program. I have my CoE (Confirmation of Enrolment) issued. Melbourne consistently ranks in the global top-35 for CS and its AI research is unmatched in Australia.' },
      { id:2, scoreLabel:'Financial Capacity', text:'How will you fund your studies and living costs in Australia?', hint:'A$21,041/year for living plus tuition. Also mention OSHC — it shows visa condition knowledge.', goodKw:['savings','parents','scholarship','funds','bank statement','financial capacity','australian dollar','living costs','sponsor','sufficient','oshc','overseas student health cover'], badKw:['work only to survive','borrow later vaguely','figure it out','not enough now','plan to earn it'], minLen:55, tip:'Mentioning OSHC (Overseas Student Health Cover) shows you\'ve studied student visa conditions — this builds immediate officer trust.', example:'I have A$95,000 available — covering A$45,000 tuition and the required A$21,041 annual living costs with additional buffer. My parents are co-sponsors. I have already purchased OSHC (Overseas Student Health Cover) as required. All bank statements are certified.' },
      { id:3, scoreLabel:'Genuine Temp Entrant', text:'Are you a genuine temporary entrant? What are your plans after completing studies?', hint:'GTE is Australia\'s unique test. You CAN mention the 485 Graduate Visa — it\'s expected and legal.', goodKw:['temporary','return','india','home country','genuine','family','career india','post study','experience','contribute','develop skills','485','graduate visa','subclass 485'], badKw:['permanent residence immediately','citizenship right away','never go back','stay forever without plans'], minLen:70, tip:'Mentioning the 485 Graduate Visa is expected and respected — it shows you know Australian immigration law, not that you\'re suspicious.', example:'I am a genuine temporary entrant. My primary purpose is completing my Master\'s. After graduation, I plan to apply for the Graduate Visa (Subclass 485) to gain 2-4 years of legitimate work experience — an expected pathway. Long-term, I intend to return to India where my family and career opportunities await.' },
      { id:4, scoreLabel:'Country Choice', text:'Why Australia over UK, Canada, or USA?', hint:'485 Graduate Visa duration + research quality + Indian community = the perfect answer.', goodKw:['post study work','graduate visa','485','research','quality','safe','indian community','specific university','program quality','ranking','climate','lifestyle','opportunity','dandenong','multicultural'], badKw:['easy visa','anyone can go','cheap option','random choice','last resort'], minLen:55, tip:'The 485 Graduate Visa giving 2-4 years of work plus Melbourne\'s liveability plus the large Indian community is Australia\'s strongest combination.', example:'Melbourne consistently ranks as the world\'s most liveable city. The University of Melbourne\'s AI research partnerships are unmatched. The 485 Graduate Visa offering 2-4 years of post-study work is Australia\'s strongest advantage. The large, established Indian community in Melbourne also made my settlement planning significantly easier.' },
      { id:5, scoreLabel:'Visa Compliance', text:'Do you understand your student visa conditions, including the 48-hour fortnightly work limit?', hint:'"48 hours per fortnight during study, unlimited during official breaks" — say this exactly.', goodKw:['48 hours','fortnight','work conditions','understand','comply','full time study','visa conditions','primary purpose','studying','aware','unlimited during breaks','official breaks'], badKw:['work more than allowed','exceed hours','not aware of limits','unlimited work all year','no restriction'], minLen:40, tip:'Saying "48 hours per fortnight during study, unlimited during official breaks" signals you\'ve studied the visa conditions — instantly builds trust.', example:'Yes, I fully understand. I can work up to 48 hours per fortnight during study periods and unlimited hours during officially scheduled academic breaks. My primary purpose is studying — work is supplementary income only. I will comply with all visa conditions without exception.' },
    ],
  },
  ireland: {
    name:'Ireland', flag:'🇮🇪', col:'#22D3A0', glow:'rgba(34,211,160,.4)',
    accent:'#FF7900', embassyName:'Irish Naturalisation & Immigration Service (INIS)',
    officerName:'Officer Murphy', officerEmoji:'👩‍💼',
    officerStyle:'Friendly but thorough. Dublin housing often comes up.',
    visaType:'Irish Study Visa (Stamp 2)',
    processingTime:'4–8 weeks', successRate:'80%',
    tagline:'The only English-speaking EU country',
    questions:[
      { id:1, scoreLabel:'Course & Institution', text:'Which Irish institution has offered you a place, and what program will you study?', hint:'Mention QQI level (Level 9 = Master\'s) — it shows you understand Irish qualifications.', goodKw:['trinity','ucd','dcu','ucc','galway','university','college','program','master','approved','qqi','level 9','irseal','course','semester','year'], badKw:['not sure yet','multiple options','might change','undecided institution'], minLen:50, tip:'Mentioning QQI Level 9 shows you understand the Irish qualification framework — a strong signal to INIS officers.', example:'I have been accepted to the MSc Computer Science at UCD — a QQI-approved Level 9 qualification. UCD is Ireland\'s largest university and ranked in the global top-200. The program starts September 2025 and runs 12 months full-time. My offer letter and acceptance have been confirmed.' },
      { id:2, scoreLabel:'Financial & Housing', text:'How will you finance your studies in Ireland, including Dublin\'s housing costs?', hint:'Dublin housing is Europe\'s worst crisis. Showing you\'ve researched it is a major positive signal.', goodKw:['savings','parents','scholarship','government of ireland','tuition','rent','housing','accommodation','dublin','euros','daft','spareroom','planned','arranged','student accommodation'], badKw:['figure out housing','not arranged yet','borrow for rent','not sure about accommodation'], minLen:60, tip:'Mentioning Dublin\'s housing crisis and showing you\'ve researched it is a major positive — officers know it\'s real and appreciate preparation.', example:'I have €30,000 available — covering UCD\'s €18,500 tuition and approximately €1,200 monthly rent. I researched housing on Daft.ie before applying and identified areas in Dublin 4 near campus. I applied for UCD on-campus accommodation immediately upon receiving my offer letter.' },
      { id:3, scoreLabel:'Ireland Choice', text:'Why Ireland over the UK, USA, or other English-speaking countries?', hint:'"Only English-speaking EU country" + Stamp 1G + Silicon Docks is the perfect answer.', goodKw:['eu','european union','english speaking','stamp 1g','critical skills','work permit','tech hub','google','meta','apple','stripe','silicon docks','english language','gateway','opportunity'], badKw:['easy to get in','no other choice','cheapest','random selection','leftover option'], minLen:55, tip:'"Only English-speaking EU country" + Stamp 1G + Silicon Docks (Google, Meta, Apple, Stripe) = the perfect Ireland answer.', example:'Ireland is the only English-speaking EU member state — strategically unique. The Stamp 1G post-study visa provides 2 years of open work authorization. Dublin\'s Silicon Docks houses Google, Meta, Apple, and Stripe EMEA HQs — an exceptional tech networking opportunity unavailable anywhere else in the EU.' },
      { id:4, scoreLabel:'Work Condition Awareness', text:'Are you aware of the work hour restrictions during your studies in Ireland?', hint:'"20 hours during term, full-time during official holidays" — say exactly this.', goodKw:['20 hours','term time','full time breaks','official breaks','official holidays','work conditions','aware','comply','primary purpose','study','understand'], badKw:['work unlimited','no restrictions','full time work all year','exceed hours','not aware'], minLen:40, tip:'"20 hours during term, full-time during official college holidays" — saying this precisely shows you\'ve studied your visa rules.', example:'Yes — I can work up to 20 hours per week during term time and full-time during official college holidays. My primary purpose is studying for my MSc. Any work I take will be strictly within these conditions. I understand exceeding these limits would violate my visa conditions.' },
      { id:5, scoreLabel:'Post-Study Intent', text:'What are your plans after completing your studies? Do you intend to return to India?', hint:'Stamp 1G → 2-3 years Dublin tech → return to India = the ideal answer structure.', goodKw:['stamp 1g','critical skills permit','return','india','family','home','career','experience','contribute','eu work','silicon docks','eventually','ties','roots','indian tech sector'], badKw:['stay permanently never return','citizenship immediately','never go back','no ties to india'], minLen:60, tip:'Stamp 1G → 2-3 years Dublin tech → return to India = perfect answer. Shows legal pathway knowledge AND return intent simultaneously.', example:'After graduation, I intend to use the Stamp 1G to gain experience at a Dublin tech company — ideally Google or Stripe. After 2-3 years of international experience, I plan to return to India where the tech sector is rapidly growing and my skills will be highly valued. My family is in India and I have strong ties there.' },
    ],
  },
}

/* ═══════════════════════════════════════════════════════════════
   EVALUATOR
═══════════════════════════════════════════════════════════════ */
function evalAnswer(answer, q) {
  const txt = answer.toLowerCase().trim()
  const wc = txt.split(/\s+/).filter(w => w).length
  let score = 0
  const lr = txt.length / q.minLen
  score += lr >= 3 ? 25 : lr >= 2 ? 20 : lr >= 1.5 ? 15 : lr >= 1 ? 10 : lr >= 0.5 ? 5 : 0
  const goodFound = q.goodKw.filter(k => txt.includes(k.toLowerCase()))
  score += Math.round((goodFound.length / Math.max(q.goodKw.length, 1)) * 45)
  const badFound = q.badKw.filter(k => txt.includes(k.toLowerCase()))
  score -= badFound.length * 12
  if (/\d/.test(txt)) score += 8
  if (/€|£|\$|aud|cad|euro|pound|dollar/i.test(txt)) score += 7
  if (/202[4-9]|january|february|march|april|may|june|july|august|september|october|november|december|winter|summer|spring|fall/i.test(txt)) score += 5
  if (wc >= 50) score += 10; else if (wc >= 30) score += 6; else if (wc >= 15) score += 3
  const final = Math.max(5, Math.min(100, score))
  const fb = []
  if (goodFound.length) fb.push({ t:'good', text:`✓ Strong keywords detected: ${goodFound.slice(0,3).join(', ')}` })
  if (badFound.length) fb.push({ t:'bad', text:`✗ Red flag phrase: "${badFound[0]}" — rephrase this` })
  if (txt.length < q.minLen) fb.push({ t:'bad', text:'✗ Answer too brief — visa officers want specific detail, not one-liners' })
  if (!/\d/.test(txt) && q.id === 2) fb.push({ t:'warn', text:'⚠ No specific amounts mentioned — always use exact figures for financial questions' })
  if (!goodFound.length && wc > 10) fb.push({ t:'warn', text:'⚠ Answer lacks key terms — check the hint for what to include' })
  if (final >= 82) fb.push({ t:'good', text:'✓ Excellent — this answer would satisfy most visa officers' })
  else if (final >= 65) fb.push({ t:'warn', text:'⚠ Decent but could be stronger — add more specific details' })
  return { score: final, fb, goodFound, badFound }
}

function getDecision(scores) {
  const avg = scores.reduce((a,b)=>a+b,0)/scores.length
  const min = Math.min(...scores)
  const critFails = scores.filter(s=>s<30).length
  if (critFails >= 2) return { v:'REJECTED', col:'#FF4D6D', icon:'❌', conf:'HIGH RISK', msg:'Multiple critical weaknesses. Major revision needed before applying.' }
  if (avg >= 78 && min >= 55) return { v:'APPROVED', col:'#00E5A8', icon:'✅', conf:'HIGH CONFIDENCE', msg:'Excellent responses across all criteria. Very high likelihood of approval.' }
  if (avg >= 62 && min >= 40) return { v:'LIKELY APPROVED', col:'#00D4FF', icon:'🟢', conf:'GOOD CHANCE', msg:'Solid answers with minor gaps. Likely approved with small refinements.' }
  if (avg >= 48) return { v:'UNCERTAIN', col:'#F59E0B', icon:'🟡', conf:'BORDERLINE', msg:'Mixed responses. Some strong, some weak. Could go either way.' }
  return { v:'HIGH RISK', col:'#FF4D6D', icon:'⚠️', conf:'NEEDS WORK', msg:'Several weak answers detected. Significant rejection risk. Revise and retry.' }
}

/* ═══════════════════════════════════════════════════════════════
   RADAR CHART
═══════════════════════════════════════════════════════════════ */
function RadarChart({ scores, labels, col }) {
  const n = scores.length, cx = 120, cy = 120, r = 85
  const pts = scores.map((s,i) => {
    const a = (2*Math.PI/n)*i - Math.PI/2
    return { x: cx + (s/100)*r*Math.cos(a), y: cy + (s/100)*r*Math.sin(a) }
  })
  const poly = pts.map(p=>`${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')
  return (
    <svg viewBox="0 0 240 240" style={{width:'100%',maxWidth:240,overflow:'visible'}}>
      <defs>
        <radialGradient id="radarGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={col} stopOpacity="0.25"/>
          <stop offset="100%" stopColor={col} stopOpacity="0.03"/>
        </radialGradient>
      </defs>
      {[0.25,0.5,0.75,1].map((g,gi) => {
        const gp = Array.from({length:n},(_,i) => { const a=(2*Math.PI/n)*i-Math.PI/2; return `${(cx+g*r*Math.cos(a)).toFixed(1)},${(cy+g*r*Math.sin(a)).toFixed(1)}` }).join(' ')
        return <polygon key={gi} points={gp} fill="none" stroke="rgba(255,255,255,.07)" strokeWidth="1"/>
      })}
      {Array.from({length:n},(_,i) => { const a=(2*Math.PI/n)*i-Math.PI/2; return <line key={i} x1={cx} y1={cy} x2={(cx+r*Math.cos(a)).toFixed(1)} y2={(cy+r*Math.sin(a)).toFixed(1)} stroke="rgba(255,255,255,.06)" strokeWidth="1"/> })}
      <polygon points={poly} fill="url(#radarGrad)" stroke={col} strokeWidth="2" strokeOpacity="0.85"/>
      {pts.map((p,i) => <circle key={i} cx={p.x.toFixed(1)} cy={p.y.toFixed(1)} r="4" fill={col} opacity="0.9"/>)}
      {scores.map((s,i) => {
        const a=(2*Math.PI/n)*i-Math.PI/2
        const lx=cx+(r+20)*Math.cos(a), ly=cy+(r+20)*Math.sin(a)
        return <text key={i} x={lx.toFixed(1)} y={ly.toFixed(1)} textAnchor="middle" dominantBaseline="middle" fontFamily="'JetBrains Mono',monospace" fontSize="8" fill="rgba(189,208,238,0.5)">{labels[i]?.split(' ')[0]}</text>
      })}
    </svg>
  )
}

/* ═══════════════════════════════════════════════════════════════
   CSS
═══════════════════════════════════════════════════════════════ */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Syne:wght@400;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');

.vr {
  --bg:#03060E; --bg1:#060B18; --bg2:#090F1F; --bg3:#0D1628;
  --cyan:#00F5FF; --teal:#00E5A8; --amber:#F59E0B; --purple:#A855F7;
  --rose:#FB4D6D; --sky:#38BDF8; --green:#22D3A0;
  --b:rgba(0,245,255,.07); --bh:rgba(0,245,255,.18);
  --t:#BDD0EE; --t2:#4A6080; --t3:#1C2C44;
  --ffh:'Bebas Neue',sans-serif;
  --ffb:'Syne',sans-serif;
  --ffm:'JetBrains Mono',monospace;
  background:var(--bg); color:var(--t); font-family:var(--ffb);
  min-height:100vh; overflow-x:hidden;
}
.vr * { box-sizing:border-box; margin:0; padding:0; }
.vr a { text-decoration:none; color:inherit; }
.vr button { cursor:pointer; font-family:var(--ffb); border:none; background:none; }
.vr textarea { font-family:var(--ffb); resize:none; }
.vr ::-webkit-scrollbar { width:3px; }
.vr ::-webkit-scrollbar-thumb { background:rgba(0,245,255,.1); border-radius:3px; }

/* ── BG ── */
.vr-bg { position:fixed; inset:0; z-index:0; pointer-events:none; overflow:hidden; }
.vr-orb { position:absolute; border-radius:50%; filter:blur(160px); opacity:.09; animation:orbFloat 22s ease-in-out infinite alternate; }
.vr-orb-a { width:700px; height:700px; top:-200px; right:-150px; }
.vr-orb-b { width:500px; height:500px; bottom:-150px; left:-100px; animation-duration:28s; animation-direction:alternate-reverse; }
@keyframes orbFloat { 0%{transform:translate(0,0)} 100%{transform:translate(28px,18px)} }
.vr-grid { position:fixed; inset:0; z-index:0; pointer-events:none;
  background-image:linear-gradient(rgba(0,245,255,.016) 1px,transparent 1px),linear-gradient(90deg,rgba(0,245,255,.016) 1px,transparent 1px);
  background-size:60px 60px;
  -webkit-mask-image:radial-gradient(ellipse 80% 80% at 50% 50%,black 30%,transparent 100%);
  mask-image:radial-gradient(ellipse 80% 80% at 50% 50%,black 30%,transparent 100%); }
.vr-scan { position:fixed; inset:0; z-index:0; pointer-events:none;
  background:repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,.025) 2px,rgba(0,0,0,.025) 4px);
  animation:scanMove 18s linear infinite; }
@keyframes scanMove { 100%{ background-position:0 200px; } }
.vr-sweep { position:fixed; top:0; left:0; right:0; z-index:1; pointer-events:none; height:1.5px;
  background:linear-gradient(90deg,transparent,var(--cyan),transparent);
  opacity:.1; animation:sweep 16s ease-in-out infinite; }
@keyframes sweep { 0%{transform:translateY(-5px);opacity:0} 8%{opacity:.18} 92%{opacity:.18} 100%{transform:translateY(100vh);opacity:0} }

/* ── TOPBAR ── */
.vr-top { position:sticky; top:0; z-index:200; height:58px;
  background:rgba(3,6,14,.92); backdrop-filter:blur(24px);
  border-bottom:1px solid var(--b); display:flex; align-items:center; padding:0 28px; gap:12px; }
.vr-logo { display:flex; align-items:center; gap:9px; font-family:var(--ffb); font-weight:800; font-size:.95rem; color:#fff; }
.vr-logo-gem { width:32px; height:32px; border-radius:9px;
  background:linear-gradient(135deg,rgba(0,245,255,.15),rgba(168,85,247,.12));
  border:1.5px solid rgba(0,245,255,.35); display:flex; align-items:center; justify-content:center;
  font-size:14px; box-shadow:0 0 18px rgba(0,245,255,.22); animation:gemGlow 4s ease-in-out infinite; }
@keyframes gemGlow { 0%,100%{box-shadow:0 0 18px rgba(0,245,255,.22)} 50%{box-shadow:0 0 30px rgba(0,245,255,.5)} }
.vr-logo em { font-style:normal; color:var(--cyan); }
.vr-top-div { width:1px; height:22px; background:var(--b); }
.vr-top-title { font-family:var(--ffh); font-size:1.05rem; letter-spacing:.07em; color:#fff; }
.vr-top-sub { font-family:var(--ffm); font-size:.58rem; color:var(--t2); }
.vr-top-sp { flex:1; }
.vr-top-pill { font-family:var(--ffm); font-size:.6rem; color:var(--cyan); background:rgba(0,245,255,.07); border:1px solid rgba(0,245,255,.18); padding:4px 12px; border-radius:20px; letter-spacing:.08em; display:flex; align-items:center; gap:5px; }
.vr-top-dot { width:5px; height:5px; border-radius:50%; background:var(--teal); box-shadow:0 0 6px var(--teal); animation:vPulse 1.8s infinite; }
@keyframes vPulse { 0%,100%{box-shadow:0 0 4px var(--teal)} 50%{box-shadow:0 0 12px var(--teal)} }
.vr-back { display:flex; align-items:center; gap:6px; padding:7px 14px; border:1px solid var(--b); border-radius:8px; background:transparent; color:var(--t2); font-family:var(--ffb); font-size:.8rem; font-weight:600; transition:all .2s; }
.vr-back:hover { border-color:var(--bh); color:var(--t); }

/* ── WRAP ── */
.vr-wrap { position:relative; z-index:2; max-width:1140px; margin:0 auto; padding:0 24px 80px; }

/* ── HERO ── */
.vr-hero { text-align:center; padding:48px 0 44px; }
.vr-hero-eyebrow { font-family:var(--ffm); font-size:.62rem; color:var(--purple); letter-spacing:.2em; text-transform:uppercase; margin-bottom:14px; display:flex; align-items:center; justify-content:center; gap:10px; }
.vr-hero-eyebrow::before,.vr-hero-eyebrow::after { content:''; flex:1; max-width:100px; height:1px; }
.vr-hero-eyebrow::before { background:linear-gradient(90deg,transparent,var(--purple)); }
.vr-hero-eyebrow::after { background:linear-gradient(90deg,var(--purple),transparent); }
.vr-hero-h1 { font-family:var(--ffh); font-size:clamp(50px,8vw,100px); color:#fff; letter-spacing:.04em; line-height:.9; margin-bottom:16px; }
.vr-hero-h1 .gold { background:linear-gradient(135deg,var(--amber),#ff9500); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
.vr-hero-sub { font-size:.93rem; color:var(--t2); max-width:520px; margin:0 auto 24px; line-height:1.68; }
.vr-hero-stats { display:flex; align-items:center; justify-content:center; gap:24px; flex-wrap:wrap; }
.vr-hs { display:flex; flex-direction:column; align-items:center; gap:2px; }
.vr-hs-n { font-family:var(--ffh); font-size:2.2rem; color:var(--teal); letter-spacing:.04em; line-height:1; }
.vr-hs-l { font-family:var(--ffm); font-size:.56rem; color:var(--t2); letter-spacing:.1em; }
.vr-hs-div { width:1px; height:30px; background:var(--b); }

/* ── COUNTRY GRID ── */
.vr-cg { display:grid; grid-template-columns:repeat(6,1fr); gap:12px; margin-bottom:36px; }
@media(max-width:900px){.vr-cg{grid-template-columns:repeat(3,1fr);}}
@media(max-width:560px){.vr-cg{grid-template-columns:repeat(2,1fr);}}

/* COUNTRY CARD — KEY DESIGN */
.vr-cc { position:relative; border-radius:18px; padding:22px 14px 18px;
  text-align:center; cursor:pointer; overflow:hidden;
  border:2px solid transparent; background:var(--bg2);
  transition:transform .25s, box-shadow .25s, border-color .25s;
  display:flex; flex-direction:column; align-items:center; gap:6px; }
.vr-cc::before { content:''; position:absolute; inset:0; border-radius:16px; opacity:0; transition:opacity .25s; }
.vr-cc:hover { transform:translateY(-5px); }
.vr-cc.sel { transform:translateY(-6px); }
.vr-cc-shine { position:absolute; top:-50%; left:-50%; width:200%; height:200%; background:radial-gradient(ellipse at 50% 0%,rgba(255,255,255,.07),transparent 60%); pointer-events:none; }
.vr-cc-flag { font-size:2.2rem; line-height:1; margin-bottom:2px; position:relative; z-index:1; }
.vr-cc-name { font-family:var(--ffh); font-size:1rem; letter-spacing:.04em; color:#fff; position:relative; z-index:1; }
.vr-cc-type { font-family:var(--ffm); font-size:.52rem; color:var(--t2); letter-spacing:.04em; line-height:1.4; position:relative; z-index:1; }
.vr-cc-rate { font-family:var(--ffm); font-size:.58rem; padding:3px 10px; border-radius:20px; display:inline-block; position:relative; z-index:1; font-weight:600; }
.vr-cc-tag { font-family:var(--ffm); font-size:.5rem; color:var(--t3); letter-spacing:.03em; position:relative; z-index:1; }
.vr-cc-sel-dot { position:absolute; top:10px; right:10px; width:9px; height:9px; border-radius:50%; display:none; }
.vr-cc.sel .vr-cc-sel-dot { display:block; animation:selPop .3s cubic-bezier(.34,1.56,.64,1) both; }
@keyframes selPop { from{transform:scale(0)} to{transform:scale(1)} }

/* ── INFO CARDS ── */
.vr-ic-row { display:grid; grid-template-columns:repeat(3,1fr); gap:13px; margin-bottom:36px; }
@media(max-width:700px){.vr-ic-row{grid-template-columns:1fr;}}
.vr-ic { background:rgba(9,15,31,.7); border:1px solid var(--b); border-radius:14px; padding:18px 20px; backdrop-filter:blur(16px); transition:all .22s; }
.vr-ic:hover { border-color:rgba(0,245,255,.15); transform:translateY(-2px); }
.vr-ic-ico { font-size:1.7rem; margin-bottom:10px; }
.vr-ic-title { font-family:var(--ffh); font-size:1rem; color:#fff; letter-spacing:.04em; margin-bottom:5px; }
.vr-ic-desc { font-size:.8rem; color:var(--t2); line-height:1.6; }

/* ── INTERVIEW ROOM ── */
.vr-room { background:rgba(6,11,24,.9); border:1px solid var(--b); border-radius:20px; overflow:hidden; backdrop-filter:blur(20px); }

/* ── EMBASSY HEADER ── */
.vr-emb { padding:18px 24px; border-bottom:1px solid var(--b); position:relative; overflow:hidden; }
.vr-emb-bg { position:absolute; inset:0; opacity:.07; }
.vr-emb-inner { position:relative; z-index:1; display:flex; align-items:center; gap:16px; }
.vr-emb-flag { font-size:2.2rem; flex-shrink:0; }
.vr-emb-info { flex:1; }
.vr-emb-name { font-family:var(--ffh); font-size:1.15rem; letter-spacing:.05em; color:#fff; margin-bottom:2px; }
.vr-emb-detail { font-family:var(--ffm); font-size:.6rem; color:var(--t2); letter-spacing:.06em; margin-bottom:2px; }
.vr-emb-style { font-family:var(--ffm); font-size:.58rem; color:rgba(255,255,255,.35); letter-spacing:.04em; }
.vr-emb-right { display:flex; flex-direction:column; align-items:flex-end; gap:7px; flex-shrink:0; }
.vr-live { display:flex; align-items:center; gap:6px; font-family:var(--ffm); font-size:.58rem; color:var(--rose); }
.vr-live-dot { width:6px; height:6px; border-radius:50%; background:var(--rose); animation:livePulse 1.4s infinite; }
@keyframes livePulse { 0%,100%{box-shadow:0 0 4px var(--rose);opacity:1} 50%{box-shadow:0 0 14px var(--rose);opacity:.7} }
.vr-q-badge { font-family:var(--ffm); font-size:.6rem; padding:4px 12px; border-radius:20px; border:1px solid; letter-spacing:.08em; }

/* ── PROGRESS ── */
.vr-prog { height:3px; background:rgba(255,255,255,.05); }
.vr-prog-fill { height:100%; transition:width .6s ease; }

/* ── BODY ── */
.vr-body { display:grid; grid-template-columns:1fr 290px; }
@media(max-width:860px){.vr-body{grid-template-columns:1fr;}}

/* ── QA ── */
.vr-qa { padding:26px 24px; border-right:1px solid var(--b); display:flex; flex-direction:column; gap:18px; }

/* OFFICER */
.vr-off { display:flex; gap:12px; align-items:flex-start; }
.vr-off-av { width:44px; height:44px; border-radius:12px; display:flex; align-items:center; justify-content:center; font-size:1.3rem; flex-shrink:0; border:2px solid; }
.vr-off-bubble { flex:1; }
.vr-off-name { font-family:var(--ffm); font-size:.58rem; color:var(--t2); letter-spacing:.08em; margin-bottom:7px; }
.vr-off-q { font-size:.96rem; font-weight:600; color:#fff; line-height:1.6; margin-bottom:9px;
  padding:13px 15px; background:rgba(255,255,255,.035); border:1px solid var(--b); border-radius:12px; border-top-left-radius:3px; }
.vr-type-cur { display:inline-block; width:2px; height:15px; background:var(--cyan); vertical-align:middle; margin-left:2px; animation:tcBlink .75s step-end infinite; }
@keyframes tcBlink { 0%,100%{opacity:1} 50%{opacity:0} }
.vr-hint { font-family:var(--ffm); font-size:.63rem; color:var(--t2); line-height:1.55; padding:9px 12px; background:rgba(0,245,255,.035); border-radius:8px; border-left:2.5px solid rgba(0,245,255,.25); }

/* LIVE ALERTS */
.vr-warn { padding:8px 12px; background:rgba(251,77,109,.07); border:1px solid rgba(251,77,109,.3); border-radius:8px; font-family:var(--ffm); font-size:.64rem; color:var(--rose); animation:alertIn .22s ease; display:flex; align-items:center; gap:7px; }
.vr-good-alert { padding:8px 12px; background:rgba(0,229,168,.06); border:1px solid rgba(0,229,168,.25); border-radius:8px; font-family:var(--ffm); font-size:.64rem; color:var(--teal); animation:alertIn .22s ease; }
@keyframes alertIn { from{opacity:0;transform:translateY(-5px)} to{opacity:1;transform:none} }

/* EXAMPLE BOX */
.vr-ex-box { background:rgba(168,85,247,.06); border:1px solid rgba(168,85,247,.2); border-radius:10px; padding:12px 14px; font-family:var(--ffm); font-size:.69rem; color:var(--t); line-height:1.6; animation:alertIn .3s ease; }
.vr-ex-label { font-size:.56rem; color:var(--purple); letter-spacing:.1em; display:block; margin-bottom:6px; text-transform:uppercase; }

/* ANSWER */
.vr-ans { display:flex; gap:12px; align-items:flex-start; }
.vr-you-av { width:44px; height:44px; border-radius:12px; background:linear-gradient(135deg,var(--cyan),var(--teal)); display:flex; align-items:center; justify-content:center; font-family:var(--ffh); font-size:1.2rem; color:#020a12; flex-shrink:0; }
.vr-ans-wrap { flex:1; }
.vr-ta { width:100%; background:rgba(255,255,255,.025); border:1.5px solid rgba(0,245,255,.12); border-radius:12px; border-top-left-radius:3px; padding:13px 15px; color:var(--t); font-size:.88rem; line-height:1.65; outline:none; transition:border-color .2s,box-shadow .2s; min-height:110px; }
.vr-ta:focus { border-color:rgba(0,245,255,.35); box-shadow:0 0 0 3px rgba(0,245,255,.05); }
.vr-ta::placeholder { color:var(--t3); }
.vr-ta:disabled { opacity:.6; }
.vr-ans-foot { display:flex; align-items:center; justify-content:space-between; margin-top:9px; gap:10px; flex-wrap:wrap; }
.vr-wc { font-family:var(--ffm); font-size:.6rem; color:var(--t2); }
.vr-wc.ok { color:var(--teal); }
.vr-ans-btns { display:flex; gap:8px; align-items:center; }
.vr-ex-btn { font-family:var(--ffm); font-size:.62rem; color:var(--purple); padding:7px 13px; border:1px solid rgba(168,85,247,.25); border-radius:8px; background:rgba(168,85,247,.06); transition:all .2s; }
.vr-ex-btn:hover { background:rgba(168,85,247,.12); border-color:rgba(168,85,247,.4); }
.vr-submit { padding:10px 22px; border-radius:9px; font-family:var(--ffb); font-size:.85rem; font-weight:700; transition:all .2s; }
.vr-submit.on { background:linear-gradient(135deg,var(--cyan),var(--teal)); color:#020a12; border:none; }
.vr-submit.on:hover { transform:translateY(-2px); box-shadow:0 8px 20px rgba(0,245,255,.28); }
.vr-submit.off { background:rgba(255,255,255,.06); color:var(--t2); border:1px solid var(--b); cursor:not-allowed; }

/* FEEDBACK */
.vr-fb { padding:15px; border-radius:12px; border:1px solid var(--b); background:rgba(255,255,255,.022); animation:fbIn .4s cubic-bezier(.16,1,.3,1); }
@keyframes fbIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:none} }
.vr-fb-top { display:flex; align-items:center; gap:13px; margin-bottom:11px; }
.vr-fb-score { font-family:var(--ffh); font-size:2rem; line-height:1; }
.vr-fb-meta { flex:1; }
.vr-fb-lbl { font-family:var(--ffm); font-size:.56rem; color:var(--t2); letter-spacing:.1em; margin-bottom:5px; }
.vr-fb-bar { height:5px; background:rgba(255,255,255,.06); border-radius:3px; overflow:hidden; }
.vr-fb-fill { height:100%; border-radius:3px; transition:width 1s cubic-bezier(.16,1,.3,1); }
.vr-fb-items { display:flex; flex-direction:column; gap:5px; margin-bottom:11px; }
.vr-fb-item { font-size:.77rem; line-height:1.5; padding:4px 0; border-bottom:1px solid rgba(255,255,255,.04); }
.vr-fb-item:last-child { border-bottom:none; }
.vr-fb-item.good { color:var(--teal); }
.vr-fb-item.bad { color:var(--rose); }
.vr-fb-item.warn { color:var(--amber); }
.vr-off-tip { padding:9px 12px; background:rgba(0,245,255,.045); border:1px solid rgba(0,245,255,.15); border-radius:8px; margin-bottom:11px; }
.vr-ot-lbl { font-family:var(--ffm); font-size:.55rem; color:var(--cyan); letter-spacing:.12em; margin-bottom:4px; }
.vr-ot-text { font-size:.77rem; color:var(--t2); line-height:1.55; }
.vr-next { width:100%; padding:11px; border-radius:9px; background:rgba(255,255,255,.05); border:1px solid rgba(0,245,255,.15); color:var(--t); font-family:var(--ffb); font-size:.85rem; font-weight:600; transition:all .2s; }
.vr-next:hover { background:rgba(0,245,255,.08); border-color:rgba(0,245,255,.3); color:#fff; }

/* ── SIDEBAR ── */
.vr-side { padding:18px 15px; display:flex; flex-direction:column; gap:13px; overflow-y:auto; }
.vr-side-title { font-family:var(--ffm); font-size:.55rem; color:var(--t2); letter-spacing:.15em; text-transform:uppercase; margin-bottom:8px; }

/* QMAP */
.vr-qm-item { display:flex; align-items:center; gap:8px; padding:8px 10px; border-radius:9px; border:1px solid var(--b); background:rgba(255,255,255,.018); transition:all .2s; margin-bottom:5px; }
.vr-qm-cur { border-color:rgba(0,245,255,.35); background:rgba(0,245,255,.05); }
.vr-qm-g { border-color:rgba(0,229,168,.25); background:rgba(0,229,168,.04); }
.vr-qm-ok { border-color:rgba(245,158,11,.25); background:rgba(245,158,11,.04); }
.vr-qm-b { border-color:rgba(251,77,109,.25); background:rgba(251,77,109,.04); }
.vr-qm-num { width:22px; height:22px; border-radius:50%; border:1.5px solid; display:flex; align-items:center; justify-content:center; font-family:var(--ffm); font-size:.58rem; flex-shrink:0; transition:all .3s; }
.vr-qm-lbl { font-size:.75rem; flex:1; line-height:1.3; }
.vr-qm-sc { font-family:var(--ffm); font-size:.66rem; font-weight:600; flex-shrink:0; }

/* OFFICER REACTION */
.vr-rx { background:rgba(255,255,255,.022); border:1px solid var(--b); border-radius:12px; padding:12px 13px; }
.vr-rx-main { display:flex; align-items:center; gap:10px; }
.vr-rx-ico { font-size:1.5rem; transition:all .4s; }
.vr-rx-text { font-family:var(--ffm); font-size:.68rem; color:var(--t); line-height:1.45; flex:1; }
.vr-rx-bar { margin-top:8px; height:3px; background:rgba(255,255,255,.06); border-radius:2px; overflow:hidden; }
.vr-rx-fill { height:100%; border-radius:2px; transition:width .7s ease; }

/* CONFIDENCE */
.vr-conf { background:rgba(255,255,255,.022); border:1px solid var(--b); border-radius:12px; padding:13px; }
.vr-conf-val { font-family:var(--ffh); font-size:1.8rem; line-height:1; margin-bottom:2px; }
.vr-conf-sub { font-family:var(--ffm); font-size:.58rem; color:var(--t2); margin-bottom:10px; }
.vr-conf-bars { display:flex; flex-direction:column; gap:6px; }
.vr-cb-row { display:flex; align-items:center; gap:7px; }
.vr-cb-lbl { font-family:var(--ffm); font-size:.56rem; color:var(--t2); min-width:68px; }
.vr-cb-track { flex:1; height:3px; background:rgba(255,255,255,.06); border-radius:2px; overflow:hidden; }
.vr-cb-fill { height:100%; border-radius:2px; transition:width .8s ease; }

/* TIPS */
.vr-tips { background:rgba(255,255,255,.022); border:1px solid var(--b); border-radius:12px; padding:12px 13px; }
.vr-tip { font-size:.74rem; color:var(--t2); line-height:1.55; padding:3px 0; border-bottom:1px solid rgba(255,255,255,.04); }
.vr-tip:last-child { border-bottom:none; }

/* ── VERDICT ── */
.vr-verdict { padding:50px 36px; text-align:center; }
.vr-v-icon { font-size:5rem; margin-bottom:14px; animation:vPop .5s cubic-bezier(.34,1.56,.64,1) both; }
@keyframes vPop { from{transform:scale(.2) rotate(-15deg);opacity:0} to{transform:scale(1) rotate(0);opacity:1} }
.vr-v-title { font-family:var(--ffh); font-size:3.6rem; letter-spacing:.06em; margin-bottom:6px; }
.vr-v-conf { font-family:var(--ffm); font-size:.66rem; letter-spacing:.16em; text-transform:uppercase; margin-bottom:14px; }
.vr-v-msg { font-size:.93rem; color:var(--t2); line-height:1.7; max-width:500px; margin:0 auto 24px; }
.vr-radar-wrap { max-width:260px; margin:0 auto 22px; }
.vr-v-scores { display:grid; grid-template-columns:repeat(6,1fr); gap:8px; margin-bottom:22px; max-width:640px; margin-left:auto; margin-right:auto; }
@media(max-width:600px){.vr-v-scores{grid-template-columns:repeat(3,1fr);}}
.vr-vs { background:rgba(255,255,255,.03); border:1px solid var(--b); border-radius:10px; padding:11px 7px; text-align:center; }
.vr-vs-num { font-family:var(--ffh); font-size:1.4rem; line-height:1; margin-bottom:3px; }
.vr-vs-lbl { font-family:var(--ffm); font-size:.5rem; color:var(--t2); letter-spacing:.05em; line-height:1.3; }
.vr-v-totals { display:flex; justify-content:center; gap:12px; margin-bottom:22px; flex-wrap:wrap; }
.vr-vt { text-align:center; padding:12px 18px; background:rgba(255,255,255,.03); border:1px solid var(--b); border-radius:11px; min-width:90px; }
.vr-vt-num { font-family:var(--ffh); font-size:2rem; line-height:1; }
.vr-vt-lbl { font-family:var(--ffm); font-size:.54rem; color:var(--t2); letter-spacing:.09em; margin-top:3px; }
.vr-v-weak { max-width:460px; margin:0 auto 24px; padding:13px 17px; background:rgba(251,77,109,.05); border:1px solid rgba(251,77,109,.2); border-radius:11px; text-align:left; }
.vr-v-wt { font-family:var(--ffm); font-size:.56rem; color:var(--rose); letter-spacing:.12em; margin-bottom:8px; }
.vr-v-wi { font-size:.79rem; color:var(--t2); line-height:1.65; padding:2px 0; }
.vr-v-wi b { color:#fff; }

/* BUTTONS */
.btn-retry { padding:12px 32px; border-radius:11px; background:linear-gradient(135deg,var(--cyan),var(--teal)); color:#020a12; font-family:var(--ffb); font-size:.9rem; font-weight:700; transition:all .2s; border:none; }
.btn-retry:hover { transform:translateY(-2px); box-shadow:0 12px 28px rgba(0,245,255,.3); }
.btn-new { margin-left:10px; padding:12px 24px; border-radius:11px; border:1px solid rgba(0,245,255,.25); background:rgba(0,245,255,.05); color:var(--t); font-family:var(--ffb); font-size:.88rem; font-weight:600; transition:all .2s; }
.btn-new:hover { background:rgba(0,245,255,.1); border-color:rgba(0,245,255,.4); color:#fff; }

@keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:none} }
.vu { animation:fadeUp .45s ease both; }
`

/* ═══════════════════════════════════════════════════════════════
   COMPONENT
═══════════════════════════════════════════════════════════════ */
export default function VisaSimulator() {
  const [sel, setSel] = useState(null)
  const [phase, setPhase] = useState('select')
  const [curQ, setCurQ] = useState(0)
  const [ans, setAns] = useState('')
  const [scores, setScores] = useState([])
  const [fbs, setFbs] = useState([])
  const [showFb, setShowFb] = useState(false)
  const [showEx, setShowEx] = useState(false)
  const [typeText, setTypeText] = useState('')
  const [typing, setTyping] = useState(false)
  const [liveWarn, setLiveWarn] = useState(null)
  const [liveGood, setLiveGood] = useState(null)
  const taRef = useRef(null)
  const typeRef = useRef(null)

  const C = sel ? COUNTRIES[sel] : null
  const Qs = C?.questions || []
  const Q = Qs[curQ]
  const prog = ((curQ + (showFb ? 1 : 0)) / Math.max(Qs.length, 1)) * 100
  const sc = s => s >= 75 ? C?.col || '#00E5A8' : s >= 50 ? '#F59E0B' : '#FB4D6D'
  const qmCls = i => {
    if (i === curQ && !showFb) return 'vr-qm-cur'
    if (i < scores.length) { const s = scores[i]; return s >= 70 ? 'vr-qm-g' : s >= 45 ? 'vr-qm-ok' : 'vr-qm-b' }
    return ''
  }
  const avgScore = scores.length ? Math.round(scores.reduce((a,b)=>a+b,0)/scores.length) : 0
  const wc = ans.trim().split(/\s+/).filter(w=>w).length

  // Typewriter
  useEffect(() => {
    if (!Q || phase !== 'interview') return
    setTypeText(''); setTyping(true); setShowFb(false); setShowEx(false); setLiveWarn(null); setLiveGood(null)
    let i = 0; clearInterval(typeRef.current)
    typeRef.current = setInterval(() => {
      i++; setTypeText(Q.text.slice(0, i))
      if (i >= Q.text.length) { clearInterval(typeRef.current); setTyping(false) }
    }, 20)
    return () => clearInterval(typeRef.current)
  }, [curQ, phase])

  useEffect(() => {
    if (!typing && phase === 'interview' && taRef.current && !showFb) taRef.current.focus()
  }, [typing, showFb])

  // Live analysis
  useEffect(() => {
    if (!Q || !ans.trim() || showFb) { setLiveWarn(null); setLiveGood(null); return }
    const txt = ans.toLowerCase()
    const bad = Q.badKw.find(k => txt.includes(k.toLowerCase()))
    if (bad) { setLiveWarn(`Red flag detected: "${bad}" — rephrase this`); setLiveGood(null); return }
    setLiveWarn(null)
    const good = Q.goodKw.filter(k => txt.includes(k.toLowerCase()))
    if (good.length >= 3) setLiveGood(`✓ Using ${good.length} key terms: ${good.slice(0,3).join(', ')}`)
    else setLiveGood(null)
  }, [ans, Q, showFb])

  const startInterview = key => {
    setSel(key); setPhase('interview'); setCurQ(0); setAns('')
    setScores([]); setFbs([]); setShowFb(false); setShowEx(false)
  }

  const submit = () => {
    if (ans.trim().length < 10) return
    const res = evalAnswer(ans, Q)
    setScores(p => [...p, res.score]); setFbs(p => [...p, res]); setShowFb(true)
  }

  const nextQ = () => {
    if (curQ + 1 >= Qs.length) { setPhase('verdict'); return }
    setCurQ(q => q+1); setAns(''); setShowFb(false)
  }

  const reset = () => { setPhase('select'); setSel(null); setCurQ(0); setAns(''); setScores([]); setFbs([]) }

  const reaction = (() => {
    if (!showFb || !fbs[curQ]) return { ico:'😐', text:'Waiting for your response…', fill:40 }
    const s = scores[curQ]
    if (s >= 80) return { ico:'😊', text:'Satisfied. Strong, specific answer.', fill:s }
    if (s >= 65) return { ico:'🤔', text:'Mostly satisfied. Some gaps noted.', fill:s }
    if (s >= 45) return { ico:'😟', text:'Concerned. Needs more detail.', fill:s }
    return { ico:'😤', text:'Not satisfied. Red flags detected.', fill:s }
  })()

  const decision = phase === 'verdict' && scores.length ? getDecision(scores) : null

  return (
    <div className="vr">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="vr-bg">
        <div className="vr-orb vr-orb-a" style={{ background: C?.col || '#003087' }} />
        <div className="vr-orb vr-orb-b" style={{ background: C?.accent || '#1a0800' }} />
      </div>
      <div className="vr-grid" />
      <div className="vr-scan" />
      <div className="vr-sweep" />

      {/* TOPBAR */}
      <div className="vr-top">
        <div className="vr-logo">
          <div className="vr-logo-gem">🌉</div>
          Mentor<em>Bridge</em>
        </div>
        <div className="vr-top-div" />
        <div>
          <div className="vr-top-title">VISA INTERVIEW SIMULATOR</div>
          <div className="vr-top-sub">6 COUNTRIES · 30 REAL QUESTIONS · LIVE EVALUATION</div>
        </div>
        <div className="vr-top-sp" />
        {phase === 'interview' && (
          <div className="vr-top-pill">
            <div className="vr-top-dot" />
            {avgScore > 0 ? `Avg ${avgScore}% · Q${curQ+1}/${Qs.length}` : `Q${curQ+1} of ${Qs.length}`}
          </div>
        )}
        <Link href="/dashboard/student" className="vr-back">← Dashboard</Link>
      </div>

      <div className="vr-wrap">

        {/* HERO */}
        <div className="vr-hero vu">
          <div className="vr-hero-eyebrow">Zero External API · Pure Rule Engine · Real Embassy Questions</div>
          <div className="vr-hero-h1">VISA <span className="gold">INTERVIEW</span><br/>SIMULATOR</div>
          <p className="vr-hero-sub">Practice with 30 real embassy questions across 6 countries. Live red-flag detection, officer reactions, and a detailed radar chart verdict — all in your browser.</p>
          <div className="vr-hero-stats">
            <div className="vr-hs"><div className="vr-hs-n">6</div><div className="vr-hs-l">Countries</div></div>
            <div className="vr-hs-div"/>
            <div className="vr-hs"><div className="vr-hs-n">30</div><div className="vr-hs-l">Questions</div></div>
            <div className="vr-hs-div"/>
            <div className="vr-hs"><div className="vr-hs-n">Live</div><div className="vr-hs-l">Red Flag Scan</div></div>
            <div className="vr-hs-div"/>
            <div className="vr-hs"><div className="vr-hs-n">SVG</div><div className="vr-hs-l">Radar Verdict</div></div>
          </div>
        </div>

        {/* ── SELECT ── */}
        {phase === 'select' && (
          <div className="vu">
            <div className="vr-cg">
              {Object.entries(COUNTRIES).map(([key, c]) => (
                <button
                  key={key}
                  className={`vr-cc${sel===key?' sel':''}`}
                  style={{
                    borderColor: sel===key ? c.col : `${c.col}30`,
                    boxShadow: sel===key ? `0 0 28px ${c.glow}, inset 0 0 28px ${c.col}08` : `0 4px 18px rgba(0,0,0,.3)`,
                    background: sel===key ? `linear-gradient(160deg,${c.col}14,${c.col}06,var(--bg2))` : undefined,
                  }}
                  onClick={() => startInterview(key)}
                >
                  <div className="vr-cc-shine"/>
                  <div style={{position:'absolute',inset:0,background:`radial-gradient(ellipse at 50% 0%,${c.col}18,transparent 65%)`,pointerEvents:'none',borderRadius:16}}/>
                  <div className="vr-cc-sel-dot" style={{background:c.col,boxShadow:`0 0 10px ${c.col}`}}/>
                  <div className="vr-cc-flag">{c.flag}</div>
                  <div className="vr-cc-name">{c.name}</div>
                  <div className="vr-cc-type">{c.visaType}</div>
                  <div className="vr-cc-rate" style={{background:`${c.col}18`,border:`1px solid ${c.col}44`,color:c.col}}>
                    {c.successRate} approval
                  </div>
                  <div className="vr-cc-tag">{c.tagline}</div>
                </button>
              ))}
            </div>

            <div className="vr-ic-row">
              {[
                {ico:'⚡', title:'Live Red-Flag Detection', desc:'As you type, the engine scans your answer in real time — flagging dangerous phrases before you submit.'},
                {ico:'🧠', title:'Typewriter Questions', desc:'Each question types out like a real officer speaking to you. Officer style and embassy atmosphere included.'},
                {ico:'📊', title:'SVG Radar Chart Verdict', desc:'After 5 questions, get a radar chart showing your score across all criteria with specific improvement tips.'},
              ].map((c,i) => (
                <div key={i} className="vr-ic">
                  <div className="vr-ic-ico">{c.ico}</div>
                  <div className="vr-ic-title">{c.title}</div>
                  <div className="vr-ic-desc">{c.desc}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── INTERVIEW ── */}
        {phase === 'interview' && C && Q && (
          <div className="vr-room vu" style={{borderColor:`${C.col}30`}}>
            {/* Embassy header */}
            <div className="vr-emb">
              <div className="vr-emb-bg" style={{background:`linear-gradient(135deg,${C.col},${C.accent})`}}/>
              <div className="vr-emb-inner">
                <div className="vr-emb-flag">{C.flag}</div>
                <div className="vr-emb-info">
                  <div className="vr-emb-name">{C.embassyName}</div>
                  <div className="vr-emb-detail">{C.officerName} · {C.visaType} · ~{C.processingTime}</div>
                  <div className="vr-emb-style">{C.officerStyle}</div>
                </div>
                <div className="vr-emb-right">
                  <div className="vr-live"><div className="vr-live-dot"/>SESSION LIVE</div>
                  <div className="vr-q-badge" style={{color:C.col,borderColor:`${C.col}44`,background:`${C.col}12`}}>Q{curQ+1} / {Qs.length}</div>
                </div>
              </div>
            </div>

            {/* Progress */}
            <div className="vr-prog">
              <div className="vr-prog-fill" style={{width:`${prog}%`,background:`linear-gradient(90deg,${C.col},${C.accent})`}}/>
            </div>

            <div className="vr-body">
              {/* QA */}
              <div className="vr-qa">
                {/* Officer */}
                <div className="vr-off">
                  <div className="vr-off-av" style={{borderColor:`${C.col}55`,background:`${C.col}12`}}>{C.officerEmoji}</div>
                  <div className="vr-off-bubble">
                    <div className="vr-off-name">{C.officerName} · {C.officerStyle}</div>
                    <div className="vr-off-q">"{typeText}{typing && <span className="vr-type-cur"/>}"</div>
                    <div className="vr-hint">💡 {Q.hint}</div>
                  </div>
                </div>

                {/* Live alerts */}
                {liveWarn && <div className="vr-warn">⚠ {liveWarn}</div>}
                {liveGood && !liveWarn && <div className="vr-good-alert">{liveGood}</div>}

                {/* Example */}
                {showEx && (
                  <div className="vr-ex-box">
                    <span className="vr-ex-label">✦ Example Strong Answer</span>
                    {Q.example}
                  </div>
                )}

                {/* Answer */}
                <div className="vr-ans">
                  <div className="vr-you-av">S</div>
                  <div className="vr-ans-wrap">
                    <textarea
                      ref={taRef}
                      className="vr-ta"
                      placeholder="Type your answer here — be specific, honest, and professional."
                      value={ans}
                      onChange={e => setAns(e.target.value)}
                      disabled={showFb || typing}
                      rows={5}
                    />
                    <div className="vr-ans-foot">
                      <span className={`vr-wc ${wc >= 30 ? 'ok' : ''}`}>{wc} words · {ans.length} chars</span>
                      <div className="vr-ans-btns">
                        {!showFb && (
                          <button className="vr-ex-btn" onClick={() => setShowEx(p=>!p)}>
                            {showEx ? 'Hide Example' : '✦ Show Example'}
                          </button>
                        )}
                        {!showFb && (
                          <button
                            className={`vr-submit ${ans.trim().length >= 12 && !typing ? 'on' : 'off'}`}
                            onClick={submit}
                            disabled={ans.trim().length < 12 || typing}
                          >
                            Submit →
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Feedback */}
                {showFb && fbs[curQ] && (
                  <div className="vr-fb">
                    <div className="vr-fb-top">
                      <div>
                        <div className="vr-fb-score" style={{color:sc(scores[curQ])}}>{scores[curQ]}%</div>
                        <div className="vr-fb-lbl">{Q.scoreLabel}</div>
                      </div>
                      <div className="vr-fb-meta">
                        <div className="vr-fb-bar"><div className="vr-fb-fill" style={{width:`${scores[curQ]}%`,background:sc(scores[curQ])}}/></div>
                        <div style={{fontFamily:'var(--ffm)',fontSize:'.57rem',color:'var(--t2)',marginTop:4}}>
                          {scores[curQ]>=80?'Excellent':scores[curQ]>=65?'Good':scores[curQ]>=45?'Needs Work':'Critical Issue'}
                        </div>
                      </div>
                    </div>
                    <div className="vr-fb-items">
                      {fbs[curQ].fb.map((f,i) => (
                        <div key={i} className={`vr-fb-item ${f.t}`}>{f.text}</div>
                      ))}
                    </div>
                    <div className="vr-off-tip">
                      <div className="vr-ot-lbl">OFFICER PERSPECTIVE</div>
                      <div className="vr-ot-text">{Q.tip}</div>
                    </div>
                    <button className="vr-next" onClick={nextQ}>
                      {curQ + 1 >= Qs.length ? '📊 See Final Verdict →' : `Next Question (${curQ+2}/${Qs.length}) →`}
                    </button>
                  </div>
                )}
              </div>

              {/* SIDEBAR */}
              <div className="vr-side">
                <div>
                  <div className="vr-side-title">Question Progress</div>
                  {Qs.map((q,i) => (
                    <div key={i} className={`vr-qm-item ${qmCls(i)}`}>
                      <div className="vr-qm-num" style={{
                        borderColor: i<scores.length ? sc(scores[i]) : i===curQ ? 'rgba(0,245,255,.5)' : 'var(--t3)',
                        color: i<scores.length ? sc(scores[i]) : i===curQ ? 'var(--cyan)' : 'var(--t3)',
                        background: i<scores.length ? `${sc(scores[i])}18` : 'transparent',
                      }}>
                        {i<scores.length ? (scores[i]>=70?'✓':scores[i]>=45?'~':'✗') : i+1}
                      </div>
                      <div className="vr-qm-lbl" style={{color:i===curQ?'#fff':i<scores.length?'var(--t)':'var(--t2)'}}>{q.scoreLabel}</div>
                      {i<scores.length && <div className="vr-qm-sc" style={{color:sc(scores[i])}}>{scores[i]}%</div>}
                    </div>
                  ))}
                </div>

                {/* Officer reaction */}
                <div className="vr-rx">
                  <div className="vr-side-title">Officer Reaction</div>
                  <div className="vr-rx-main">
                    <div className="vr-rx-ico">{reaction.ico}</div>
                    <div className="vr-rx-text">{reaction.text}</div>
                  </div>
                  <div className="vr-rx-bar">
                    <div className="vr-rx-fill" style={{width:`${reaction.fill}%`,background:showFb?sc(scores[curQ]||50):C.col}}/>
                  </div>
                </div>

                {/* Confidence meter */}
                <div className="vr-conf">
                  <div className="vr-side-title">Session Score</div>
                  <div className="vr-conf-val" style={{color:avgScore>=70?'var(--teal)':avgScore>=50?'var(--amber)':'var(--rose)'}}>
                    {avgScore > 0 ? `${avgScore}%` : '—'}
                  </div>
                  <div className="vr-conf-sub">{scores.length ? `${scores.length} answered` : 'No answers yet'}</div>
                  <div className="vr-conf-bars">
                    <div className="vr-cb-row">
                      <div className="vr-cb-lbl">Specificity</div>
                      <div className="vr-cb-track"><div className="vr-cb-fill" style={{width:`${Math.min(100,(ans.match(/\d/g)||[]).length*6)}%`,background:'var(--cyan)'}}/></div>
                    </div>
                    <div className="vr-cb-row">
                      <div className="vr-cb-lbl">Detail Level</div>
                      <div className="vr-cb-track"><div className="vr-cb-fill" style={{width:`${Math.min(100,wc*2.5)}%`,background:'var(--teal)'}}/></div>
                    </div>
                    <div className="vr-cb-row">
                      <div className="vr-cb-lbl">Avg Score</div>
                      <div className="vr-cb-track"><div className="vr-cb-fill" style={{width:`${avgScore}%`,background:'var(--purple)'}}/></div>
                    </div>
                  </div>
                </div>

                {/* Tips */}
                <div className="vr-tips">
                  <div className="vr-side-title">🎯 Key Rules</div>
                  {['Use exact amounts (€11,208, A$21,041, etc.)','Name the specific university + program','18-month/PGWP/485/Stamp 1G are legal — use them','Never say "settle permanently"','Longer + specific = higher score'].map((t,i) => (
                    <div key={i} className="vr-tip">· {t}</div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── VERDICT ── */}
        {phase === 'verdict' && C && decision && (() => {
          const avg = Math.round(scores.reduce((a,b)=>a+b,0)/scores.length)
          return (
            <div className="vr-room vu" style={{borderColor:`${decision.col}40`}}>
              <div style={{height:4,background:`linear-gradient(90deg,${C.col},${decision.col})`}}/>
              <div className="vr-verdict">
                <div className="vr-v-icon">{decision.icon}</div>
                <div className="vr-v-title" style={{color:decision.col}}>{decision.v}</div>
                <div className="vr-v-conf" style={{color:'var(--t2)'}}>{decision.conf} · {C.flag} {C.name} · {C.visaType}</div>
                <p className="vr-v-msg">{decision.msg}</p>

                <div className="vr-radar-wrap">
                  <RadarChart scores={scores} labels={Qs.map(q=>q.scoreLabel)} col={C.col}/>
                </div>

                <div className="vr-v-scores">
                  {Qs.map((q,i) => (
                    <div key={i} className="vr-vs">
                      <div className="vr-vs-num" style={{color:sc(scores[i])}}>{scores[i]}%</div>
                      <div className="vr-vs-lbl">{q.scoreLabel}</div>
                    </div>
                  ))}
                </div>

                <div className="vr-v-totals">
                  {[
                    {num:`${avg}%`,lbl:'Overall',col:decision.col},
                    {num:`${scores.filter(s=>s>=70).length}/${scores.length}`,lbl:'Strong',col:'var(--teal)'},
                    {num:scores.filter(s=>s<45).length,lbl:'Weak',col:'var(--rose)'},
                    {num:scores.filter(s=>s>=80).length,lbl:'Excellent',col:'var(--cyan)'},
                  ].map((t,i) => (
                    <div key={i} className="vr-vt">
                      <div className="vr-vt-num" style={{color:t.col}}>{t.num}</div>
                      <div className="vr-vt-lbl">{t.lbl}</div>
                    </div>
                  ))}
                </div>

                {scores.some(s=>s<55) && (
                  <div className="vr-v-weak">
                    <div className="vr-v-wt">⚠ AREAS NEEDING IMPROVEMENT</div>
                    {scores.map((s,i) => s<55 ? (
                      <div key={i} className="vr-v-wi">· <b>{Qs[i].scoreLabel}:</b> {Qs[i].tip}</div>
                    ) : null)}
                  </div>
                )}

                <div>
                  <button className="btn-retry" onClick={() => startInterview(sel)}>🔄 Retry {C.name}</button>
                  <button className="btn-new" onClick={reset}>🌍 Try Another Country</button>
                </div>
              </div>
            </div>
          )
        })()}

      </div>
    </div>
  )
}