'use client'

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// ════════════════════════════════════════════════════════════════════════════════
// 1. DOCUMENT DATA CONSTANT
// ════════════════════════════════════════════════════════════════════════════════
const DOC_DATA = {
  de: {
    country: 'Germany', flag: '🇩🇪',
    tip: 'APS certification is mandatory for all Indian students applying to German universities. Start this process at least 5–6 months before your intake. The APS appointment in Delhi/Mumbai books 4–8 weeks in advance.',
    categories: [
      { name: '🏛 APS Certification (Mandatory)', color: 'var(--rose)', docs: [
        { name: 'APS Application Form (filled online)', desc: 'Download from aps.org.in, fill completely, print and sign.', priority: 'critical', status: 'done' },
        { name: '10th Marksheet — Original + Certified Translation', desc: 'Hindi marksheets require certified German/English translation by a sworn translator.', priority: 'critical', status: 'done' },
        { name: '12th Marksheet — Original + Certified Translation', desc: 'Board certificate + marksheet. Same translation requirements.', priority: 'critical', status: 'done' },
        { name: 'All Semester Marksheets — Original + Translation', desc: 'Every semester, no gaps. Missing a semester will void your APS appointment.', priority: 'critical', status: 'partial' },
        { name: 'Degree/Provisional Certificate (if graduated)', desc: 'Or enrollment certificate if still in final year.', priority: 'critical', status: 'empty' },
        { name: 'Passport (valid minimum 2 years)', desc: 'Bio-data page copy required. Original must be brought to APS appointment.', priority: 'critical', status: 'done' },
        { name: 'Passport Photos (4 copies, white background)', desc: 'Recent, 35×45mm, white background. Taken within last 3 months.', priority: 'required', status: 'done' },
      ]},
      { name: '🎓 University Applications', color: 'var(--cyan)', docs: [
        { name: 'Motivation Letter (per university)', desc: 'German ML ≠ SOP. Academic tone, 1–1.5 pages. Mention specific professors and research groups.', priority: 'critical', status: 'partial' },
        { name: 'CV / Résumé (European Format)', desc: 'Europass format preferred. Include photo (European standard). Max 2 pages.', priority: 'required', status: 'done' },
        { name: '2 Academic Letters of Recommendation', desc: 'Must be from professors, not industry. University letterhead, signed and stamped.', priority: 'critical', status: 'empty' },
        { name: 'IELTS Certificate (7.0+ overall)', desc: 'Academic IELTS preferred. No band below 6.0. Valid for 2 years from test date.', priority: 'critical', status: 'done' },
        { name: 'GRE Score (if required)', desc: 'Not required by all German universities. Check program-specific requirements.', priority: 'optional', status: 'empty' },
        { name: 'University Transcripts (English)', desc: 'Official transcripts issued by your university registrar in English or with certified translation.', priority: 'required', status: 'done' },
        { name: 'Statement of Purpose (Uni-Assist portal)', desc: 'Some programs require a separate SOP in addition to the Motivation Letter.', priority: 'required', status: 'empty' },
      ]},
      { name: '💰 Blocked Account & Financial Proof', color: 'var(--teal)', docs: [
        { name: 'Blocked Account Confirmation (€11,208)', desc: 'Fintiba or DKB. Open immediately after receiving admission — visa timeline is tight.', priority: 'critical', status: 'empty' },
        { name: 'Scholarship Letter (if applicable)', desc: 'DAAD, German Academic Exchange. Reduces or replaces blocked account requirement.', priority: 'optional', status: 'empty' },
        { name: 'Bank Statements (6 months, co-applicant)', desc: 'Parents\'/guardian\'s bank statements showing adequate funds. Some embassies require this.', priority: 'required', status: 'empty' },
      ]},
      { name: '🏥 Health Insurance & Housing', color: 'var(--amber)', docs: [
        { name: 'German Health Insurance Confirmation (TK/AOK)', desc: 'Techniker Krankenkasse or AOK — ~€110/month. Start process 6 weeks before enrollment.', priority: 'critical', status: 'empty' },
        { name: 'Accommodation Confirmation', desc: 'Studentenwerk dorm confirmation OR WG rental agreement. Embassy may ask for address proof.', priority: 'required', status: 'empty' },
      ]},
      { name: '✈️ Visa Application', color: 'var(--purple)', docs: [
        { name: 'German National Visa Application Form (Type D)', desc: 'Available on German Embassy India website. Fill in English or German.', priority: 'critical', status: 'empty' },
        { name: 'University Admission Letter (Zulassungsbescheid)', desc: 'Official unconditional admission letter from the German university.', priority: 'critical', status: 'done' },
        { name: 'APS Certificate (received after APS appointment)', desc: 'This is the key document without which no visa is possible.', priority: 'critical', status: 'partial' },
        { name: 'Flight Booking (for visa appointment)', desc: 'One-way or return flight booking to Germany required for visa appointment.', priority: 'required', status: 'empty' },
      ]},
    ]
  },
  us: {
    country: 'USA', flag: '🇺🇸',
    tip: 'US university deadlines cluster December 15 – January 15. Apply to all programs on your list simultaneously, not one by one. The F-1 Visa I-20 comes after paying the enrollment deposit to your chosen university.',
    categories: [
      { name: '📝 Test Scores', color: 'var(--cyan)', docs: [
        { name: 'GRE Score Report (ETS official)', desc: 'Target 320+ for top programs. 160+ Quant for CS/Engineering programs. Valid 5 years.', priority: 'critical', status: 'done' },
        { name: 'TOEFL Score Report (ETS official)', desc: 'Target 100+ iBT. Some universities accept IELTS 7.5+ instead. Verify per program.', priority: 'critical', status: 'done' },
        { name: 'IELTS Certificate (if accepted instead of TOEFL)', desc: 'Academic IELTS 7.5+ accepted by most universities. Check each program individually.', priority: 'optional', status: 'empty' },
      ]},
      { name: '🎓 Academic Documents', color: 'var(--teal)', docs: [
        { name: 'Official Transcripts (all semesters)', desc: 'Issued by your university registrar in sealed envelope or via official digital portal.', priority: 'critical', status: 'partial' },
        { name: 'Degree Certificate / Provisional Certificate', desc: 'Or enrollment certificate if in final year at time of application.', priority: 'required', status: 'empty' },
        { name: 'WES Evaluation (if required)', desc: 'Some programs require World Education Services credential evaluation for Indian degrees.', priority: 'optional', status: 'empty' },
      ]},
      { name: '✍️ Application Documents', color: 'var(--amber)', docs: [
        { name: 'Statement of Purpose (SOP)', desc: '700–1000 words. Narrative-driven — a pivotal moment, specific research interest, why this exact program.', priority: 'critical', status: 'partial' },
        { name: '3 Letters of Recommendation (LOR)', desc: '2 academic + 1 industry preferred. Request 3 months in advance. Professors submit directly via portal.', priority: 'critical', status: 'empty' },
        { name: 'Résumé / CV (1 page, impact-focused)', desc: '"Built X that improved Y by Z%." No photos. Tailored per program type.', priority: 'critical', status: 'done' },
        { name: 'Research Statement (PhD/Research MS)', desc: 'Required for research-track programs. Describe specific research interests and relevant experience.', priority: 'optional', status: 'empty' },
        { name: 'Portfolio (if applicable)', desc: 'Required for design, architecture, or HCI programs. Digital portfolio link.', priority: 'optional', status: 'empty' },
      ]},
      { name: '💳 Financial & Visa Documents', color: 'var(--purple)', docs: [
        { name: 'Financial Support Affidavit', desc: 'Bank statements showing $50,000+ for first year. Parent/guardian savings, FDs, property valuation.', priority: 'critical', status: 'empty' },
        { name: 'Sponsor Declaration Letter', desc: 'Notarized letter from parent/sponsor confirming financial support. Some universities require this.', priority: 'required', status: 'empty' },
        { name: 'I-20 Form (from university after deposit)', desc: 'University issues after you pay enrollment deposit. This triggers your F-1 visa application.', priority: 'critical', status: 'empty' },
        { name: 'SEVIS Fee Payment Receipt ($350)', desc: 'Pay at FMJfee.com using I-20 details. Keep receipt for visa appointment.', priority: 'critical', status: 'empty' },
        { name: 'DS-160 Visa Application Form', desc: 'Complete online at ceac.state.gov. Takes 2–3 hours. Save confirmation page.', priority: 'critical', status: 'empty' },
        { name: 'Passport (valid minimum 6 months beyond study period)', desc: 'Bio-data page + any previous US visa pages.', priority: 'critical', status: 'done' },
      ]},
    ]
  },
  uk: {
    country: 'UK', flag: '🇬🇧',
    tip: 'UK MS programs are only 12 months. Finance and consulting grad schemes open in Week 6 of your MSc — literally 6 weeks into your degree. Research your target employers before you board the plane to London.',
    categories: [
      { name: '🎓 Academic Documents', color: 'var(--cyan)', docs: [
        { name: 'Official Academic Transcripts', desc: 'All semesters, issued by registrar. UK universities verify transcripts — ensure they match online portals.', priority: 'critical', status: 'done' },
        { name: 'Degree Certificate (or Enrollment Letter)', desc: 'Final degree certificate or enrollment letter for current students.', priority: 'critical', status: 'empty' },
        { name: '10th and 12th Certificates', desc: 'Some UK programs request school certificates for complete educational history.', priority: 'required', status: 'done' },
      ]},
      { name: '🗣 English Language', color: 'var(--teal)', docs: [
        { name: 'IELTS Academic (UKVI approved)', desc: 'MUST be UKVI IELTS for visa purposes. Regular IELTS is NOT accepted for UK Student Visa. Target 7.0+.', priority: 'critical', status: 'empty' },
        { name: 'TOEFL Certificate (if accepted)', desc: 'Fewer UK universities accept TOEFL. Verify specifically for each program.', priority: 'optional', status: 'empty' },
      ]},
      { name: '📝 Application Documents', color: 'var(--amber)', docs: [
        { name: 'Personal Statement (500–1000 words)', desc: 'Why this specific program at this specific university. Concrete career goals. Concise and academic.', priority: 'critical', status: 'partial' },
        { name: '2 Academic References (emailed directly)', desc: 'UK universities email referees directly via a link. Give 4+ weeks lead time. References go to university, not you.', priority: 'critical', status: 'empty' },
        { name: 'Résumé / CV (UK Format)', desc: 'No photos, no date of birth. Clean, chronological, 2 pages maximum.', priority: 'required', status: 'done' },
        { name: 'Research Proposal (research programs)', desc: 'Required for MRes or research-track programs. 1000–1500 words outlining proposed research.', priority: 'optional', status: 'empty' },
      ]},
      { name: '💳 CAS & Student Visa', color: 'var(--purple)', docs: [
        { name: 'CAS Number (from university)', desc: 'Confirmation of Acceptance for Studies. Issued after paying enrollment deposit. Required for visa.', priority: 'critical', status: 'empty' },
        { name: 'Immigration Health Surcharge Payment', desc: '£470/year of study, paid online at immigration.homeoffice.gov.uk before visa application.', priority: 'critical', status: 'empty' },
        { name: 'Passport (valid beyond course end date)', desc: 'All pages, especially any previous UK visa stamps.', priority: 'critical', status: 'done' },
        { name: 'Financial Evidence (£12,006+ in savings)', desc: 'Bank statements for last 28 consecutive days. Funds must be held for 28 days before visa application.', priority: 'critical', status: 'empty' },
        { name: 'Tuberculosis Test Certificate', desc: 'Required for Indian nationals. Done at approved clinics only. Valid for 6 months.', priority: 'critical', status: 'empty' },
        { name: 'Accommodation Proof (if available)', desc: 'University dorm confirmation or private rental agreement helps but not always required.', priority: 'optional', status: 'empty' },
      ]},
    ]
  },
  ca: {
    country: 'Canada', flag: '🇨🇦',
    tip: 'Canada Study Permit is NOT a visa — it\'s a permit. The permit process takes 4–8 weeks via IRCC online portal. OHIP (Ontario health insurance) takes 3 months to activate from arrival — buy travel insurance to bridge the gap.',
    categories: [
      { name: '🎓 Academic & Test Documents', color: 'var(--cyan)', docs: [
        { name: 'Official Transcripts (all semesters)', desc: 'Certified copy or official sealed envelope from your registrar.', priority: 'critical', status: 'partial' },
        { name: 'IELTS Academic Certificate (6.5–7.0)', desc: 'U of T requires 7.0. Waterloo 6.5. Some programs accept TOEFL 90+. Verify per institution.', priority: 'critical', status: 'done' },
        { name: 'GRE Score (if required)', desc: 'Not mandatory at all Canadian universities. Research MASc programs often waive GRE.', priority: 'optional', status: 'empty' },
        { name: 'Degree Certificate / Enrollment Letter', desc: 'Final certificate or current enrollment proof.', priority: 'required', status: 'done' },
      ]},
      { name: '📝 Application Documents', color: 'var(--teal)', docs: [
        { name: 'Statement of Purpose (research-focused)', desc: 'Canadian SOPs emphasize research interests + career goals. Mention specific labs and professors.', priority: 'critical', status: 'partial' },
        { name: '2–3 Letters of Recommendation', desc: 'At least 2 academic. Strong industry LOR as third. Request 3 months in advance.', priority: 'critical', status: 'empty' },
        { name: 'CV / Résumé', desc: 'Research experience, projects, publications (if any). Clean 2-page format.', priority: 'required', status: 'done' },
        { name: 'Research Proposal (MASc/PhD)', desc: '1000–2000 words for research-based programs. Essential for professor contact emails.', priority: 'optional', status: 'empty' },
      ]},
      { name: '🛂 Study Permit & Immigration', color: 'var(--amber)', docs: [
        { name: 'IRCC Online Study Permit Application', desc: 'Apply at ircc.canada.ca. Processing: 4–8 weeks. Apply immediately after admission.', priority: 'critical', status: 'empty' },
        { name: 'Acceptance Letter from Canadian Institution', desc: 'Unconditional admission letter needed for study permit application.', priority: 'critical', status: 'empty' },
        { name: 'Proof of Financial Support', desc: 'Bank statements showing C$20,635+ (tuition + C$10,000 living). Last 6 months.', priority: 'critical', status: 'empty' },
        { name: 'Passport (valid beyond study period)', desc: 'All pages photographed. Must be valid for full duration of program.', priority: 'critical', status: 'done' },
        { name: 'Biometrics (if required)', desc: 'Collect at a Visa Application Centre in India. Valid for 10 years.', priority: 'required', status: 'empty' },
        { name: 'Medical Exam (if study > 6 months)', desc: 'Required for study permits longer than 6 months. Done at approved IRCC panel physicians.', priority: 'required', status: 'empty' },
        { name: 'Police Clearance Certificate', desc: 'From local police. Some Canadian universities and provinces require this.', priority: 'optional', status: 'empty' },
      ]},
    ]
  },
  au: {
    country: 'Australia', flag: '🇦🇺',
    tip: 'Australian Student Visa (Subclass 500) requires a strong GTE (Genuine Temporary Entrant) statement — this is the most important part of your visa application. Also: track every employer\'s superannuation contribution from Day 1 — you can claim it all back when you leave.',
    categories: [
      { name: '🎓 Academic & Language Documents', color: 'var(--teal)', docs: [
        { name: 'Official Transcripts', desc: 'All semesters, certified by institution. University may directly verify with home institution.', priority: 'critical', status: 'done' },
        { name: 'Degree Certificate', desc: 'Final certificate. Enrollment letter for current students.', priority: 'required', status: 'empty' },
        { name: 'IELTS Academic Certificate', desc: 'Melbourne/UNSW: 7.0 with no band below 6.5. ANU: 6.5. Book 8 weeks before deadline.', priority: 'critical', status: 'done' },
        { name: 'English Proficiency Waiver (if applicable)', desc: 'If you studied in English medium for full degree — some universities may waive IELTS.', priority: 'optional', status: 'done' },
      ]},
      { name: '📝 Application Documents', color: 'var(--amber)', docs: [
        { name: 'Personal Statement / Goals-Driven Statement', desc: 'Why Australia? Why this program? Concrete career goals. Professional and concise.', priority: 'critical', status: 'partial' },
        { name: '2–3 Letters of Recommendation', desc: 'Academic preferred. Some programs accept strong industry references.', priority: 'required', status: 'empty' },
        { name: 'CV / Résumé', desc: 'Australian format — no photo, concise, achievement-focused.', priority: 'required', status: 'done' },
      ]},
      { name: '🛂 Subclass 500 Student Visa', color: 'var(--purple)', docs: [
        { name: 'GTE Statement (Genuine Temporary Entrant)', desc: 'CRITICAL: Written statement explaining why you genuinely intend to study and return home. Most common rejection reason if weak.', priority: 'critical', status: 'empty' },
        { name: 'Confirmation of Enrollment (CoE)', desc: 'Issued by the university after you accept and pay deposit. Required for visa.', priority: 'critical', status: 'done' },
        { name: 'Overseas Student Health Cover (OSHC)', desc: 'Mandatory insurance. Buy from approved Australian providers (Medibank, Bupa, etc.).', priority: 'critical', status: 'empty' },
        { name: 'Financial Capacity Evidence', desc: 'Bank statements showing A$21,041/year + tuition funds. Last 6 months.', priority: 'critical', status: 'empty' },
        { name: 'Passport (valid beyond study period)', desc: 'Photo page + any previous Australia visa pages.', priority: 'critical', status: 'done' },
        { name: 'Biometrics', desc: 'At Australian Visa Application Centre in India.', priority: 'required', status: 'empty' },
        { name: 'Academic Technology Step (ATS) Test', desc: 'Some Engineering/IT programs require ATS screening. Check your specific program.', priority: 'optional', status: 'empty' },
        { name: 'Police Clearance Certificate', desc: 'Required if you\'ve lived outside India for 12+ months, or for some visa categories.', priority: 'optional', status: 'empty' },
      ]},
    ]
  },
  ie: {
    country: 'Ireland', flag: '🇮🇪',
    tip: 'Stamp 1G after graduation gives 2 years of free work in Ireland — but almost nobody knows you can use 1 year of Irish work experience to qualify for the EU Blue Card in Germany or Netherlands. Also: Dublin housing is Europe\'s worst crisis — start searching 4+ months before arrival.',
    categories: [
      { name: '🎓 Academic & Language Documents', color: 'var(--teal)', docs: [
        { name: 'Official Transcripts', desc: 'All semesters, certified by your institution.', priority: 'critical', status: 'done' },
        { name: 'Degree Certificate', desc: 'Final certificate or enrollment letter.', priority: 'required', status: 'empty' },
        { name: 'IELTS Certificate (6.5–7.0)', desc: 'Trinity: 7.0. UCD: 6.5. Rolling admissions — applying October = scholarship priority.', priority: 'critical', status: 'done' },
        { name: 'TOEFL Certificate (if accepted)', desc: 'Some Irish universities accept TOEFL 88+ instead of IELTS.', priority: 'optional', status: 'empty' },
      ]},
      { name: '📝 Application Documents', color: 'var(--amber)', docs: [
        { name: 'Personal Statement (300–500 words)', desc: 'Irish unis want concise, direct statements. Why Ireland? Why this program? Career goals.', priority: 'critical', status: 'partial' },
        { name: '2 Academic References', desc: 'Irish universities contact referees directly. Give 4+ weeks minimum before deadline.', priority: 'critical', status: 'empty' },
        { name: 'CV / Résumé', desc: 'Clean, professional, European format. No photo required.', priority: 'required', status: 'done' },
      ]},
      { name: '🛂 Irish Study Visa (Stamp 2)', color: 'var(--purple)', docs: [
        { name: 'Visa Application (AVATS online portal)', desc: 'Apply at inis.gov.ie via AVATS. Processing: 4–8 weeks. Requires acceptance letter first.', priority: 'critical', status: 'empty' },
        { name: 'Acceptance Letter from Irish Institution', desc: 'Unconditional offer letter from your Irish university.', priority: 'critical', status: 'empty' },
        { name: 'Proof of Funds (€7,000+ minimum)', desc: 'Bank statements showing sufficient funds. Some universities have higher requirements.', priority: 'critical', status: 'empty' },
        { name: 'Passport (valid throughout study period)', desc: 'Must be valid for entire duration of your program.', priority: 'critical', status: 'done' },
        { name: 'English Language Proficiency Proof', desc: 'Same IELTS/TOEFL certificate as submitted to university.', priority: 'required', status: 'empty' },
        { name: 'Passport Photos (recent, white background)', desc: '2 recent passport-size photographs for visa application.', priority: 'required', status: 'empty' },
      ]},
    ]
  },
};

// ════════════════════════════════════════════════════════════════════════════════
// 2. CSS STYLES (Safely converted for React)
// ════════════════════════════════════════════════════════════════════════════════
const styles = `
/* ══════════════════════════════════════════════════════
   ROOT & RESET
══════════════════════════════════════════════════════ */
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
.student-dashboard-root {
  --bg:#03060E;--bg1:#060B18;--bg2:#090F1F;--bg3:#0D1628;--bg4:#111E35;
  --cyan:#00F5FF;--teal:#00E5A8;--amber:#F59E0B;--purple:#A855F7;
  --rose:#FB4D6D;--sky:#38BDF8;--green:#22D3A0;
  --b:rgba(0,245,255,.07);--bh:rgba(0,245,255,.18);--bb:rgba(0,245,255,.4);
  --t:#BDD0EE;--t2:#4A6080;--t3:#1C2C44;
  --ffh:'Bebas Neue',sans-serif;
  --ffb:'Syne',sans-serif;
  --ffm:'DM Mono',monospace;
  height: 100vh; background: var(--bg); font-family: var(--ffb); color: var(--t);
  -webkit-font-smoothing: antialiased; overflow: hidden;
  position: relative;
}

/* ═══ AMBIENT ═══ */
.amb{position:fixed;inset:0;z-index:0;pointer-events:none;
  background:
    radial-gradient(ellipse 70% 50% at 15% 10%,rgba(0,245,255,.04),transparent 55%),
    radial-gradient(ellipse 50% 60% at 85% 80%,rgba(168,85,247,.035),transparent 55%),
    radial-gradient(ellipse 45% 45% at 60% 30%,rgba(0,229,168,.025),transparent 55%)}
.hex-bg{position:fixed;inset:0;z-index:0;pointer-events:none;opacity:.018;
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='104'%3E%3Cpolygon points='30,2 58,17 58,47 30,62 2,47 2,17' fill='none' stroke='%2300F5FF' stroke-width='.8'/%3E%3Cpolygon points='30,54 58,69 58,99 30,114 2,99 2,69' fill='none' stroke='%2300F5FF' stroke-width='.8'/%3E%3C/svg%3E")}
.scan{position:fixed;inset:0;z-index:0;pointer-events:none;
  background:repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,.03) 2px,rgba(0,0,0,.03) 4px);
  animation:scanMove 18s linear infinite}
@keyframes scanMove{100%{background-position:0 200px}}
.sweep{position:fixed;top:0;left:0;right:0;z-index:1;pointer-events:none;height:1.5px;
  background:linear-gradient(90deg,transparent,var(--cyan),transparent);
  opacity:.14;animation:sweep 16s ease-in-out infinite}
@keyframes sweep{0%{transform:translateY(-5px);opacity:0}8%{opacity:.22}92%{opacity:.22}100%{transform:translateY(100vh);opacity:0}}

/* ═══ LAYOUT ═══ */
.layout{position:relative;z-index:2;display:flex;height:100vh;overflow:hidden}

/* ═══ SIDEBAR ═══ */
.sb{width:240px;height:100vh;background:#040810;border-right:1px solid var(--b);
  display:flex;flex-direction:column;flex-shrink:0;position:relative;z-index:100}
.sb::before{content:'';position:absolute;top:0;left:0;right:0;height:1px;
  background:linear-gradient(90deg,var(--cyan),transparent);opacity:.3}
.sb-logo{padding:17px 16px 13px;border-bottom:1px solid var(--b);
  display:flex;align-items:center;gap:9px; cursor:pointer;}
.sb-logo-icon{width:32px;height:32px;border-radius:9px;flex-shrink:0;
  background:linear-gradient(135deg,rgba(0,245,255,.15),rgba(168,85,247,.12));
  border:1.5px solid rgba(0,245,255,.35);display:flex;align-items:center;justify-content:center;
  font-size:14px;box-shadow:0 0 18px rgba(0,245,255,.2);animation:logoGlow 4s ease-in-out infinite}
@keyframes logoGlow{0%,100%{box-shadow:0 0 18px rgba(0,245,255,.2)}50%{box-shadow:0 0 30px rgba(0,245,255,.45)}}
.sb-logo-text{font-family:var(--ffh);font-size:17px;letter-spacing:.06em;color:#fff}
.sb-logo-text em{font-style:normal;color:var(--cyan)}

.sb-status{padding:8px 14px;background:rgba(0,229,168,.04);border-bottom:1px solid var(--b);
  display:flex;align-items:center;gap:7px;font-family:var(--ffm);font-size:.62rem;color:var(--teal);letter-spacing:.07em}
.s-dot{width:5px;height:5px;border-radius:50%;background:var(--teal);
  box-shadow:0 0 7px var(--teal);animation:pulse 2s infinite;flex-shrink:0}
@keyframes pulse{0%,100%{box-shadow:0 0 5px var(--teal)}50%{box-shadow:0 0 14px var(--teal)}}
.sb-status span{margin-left:auto;font-size:.58rem;color:var(--t3)}

.sb-nav{flex:1;padding:6px 0;overflow-y:auto}
.sb-sect{padding:10px 16px 4px;font-family:var(--ffm);font-size:.58rem;
  letter-spacing:.2em;text-transform:uppercase;color:var(--t3)}
.sb-item{display:flex;align-items:center;gap:9px;padding:9px 16px;font-size:.85rem;
  font-weight:500;color:var(--t2);cursor:pointer;transition:all .18s;
  border-left:2.5px solid transparent;white-space:nowrap;position:relative}
.sb-item:hover{color:var(--t);background:rgba(0,245,255,.028);border-left-color:rgba(0,245,255,.2)}
.sb-item.active{color:var(--cyan);background:rgba(0,245,255,.055);border-left-color:var(--cyan)}
.sb-item.active::after{content:'';position:absolute;right:0;top:15%;bottom:15%;
  width:1px;background:var(--cyan);opacity:.35}
.sb-ico{font-size:12px;width:16px;text-align:center;flex-shrink:0}
.sb-badge{margin-left:auto;font-family:var(--ffm);font-size:.56rem;padding:1px 6px;border-radius:8px}
.bc{background:rgba(0,245,255,.1);color:var(--cyan);border:1px solid rgba(0,245,255,.2)}
.br{background:rgba(251,77,109,.1);color:var(--rose);border:1px solid rgba(251,77,109,.2);animation:badgeBlink 2s infinite}
.bg{background:rgba(0,229,168,.1);color:var(--teal);border:1px solid rgba(0,229,168,.2)}
@keyframes badgeBlink{0%,100%{opacity:1}50%{opacity:.5}}

.sb-user{padding:11px 13px;border-top:1px solid var(--b);display:flex;align-items:center;gap:9px;position:relative}
.sb-user::before{content:'';position:absolute;top:0;left:13px;right:13px;height:1px;
  background:linear-gradient(90deg,rgba(0,245,255,.18),transparent)}
.sb-av{width:34px;height:34px;border-radius:50%;border:2px solid rgba(0,245,255,.35);
  overflow:hidden;flex-shrink:0}
.sb-av img{width:100%;height:100%;object-fit:cover}
.sb-uname{font-family:var(--ffh);font-size:13px;letter-spacing:.04em;color:#fff}
.sb-urole{font-family:var(--ffm);font-size:.58rem;color:var(--teal);letter-spacing:.05em}

/* ═══ TOPBAR ═══ */
.topbar{height:52px;background:rgba(4,8,18,.92);backdrop-filter:blur(24px);
  border-bottom:1px solid var(--b);padding:0 26px;display:flex;align-items:center;
  gap:12px;position:sticky;top:0;z-index:80;flex-shrink:0}
.tb-crumb{font-family:var(--ffm);font-size:.65rem;color:var(--t3);
  display:flex;align-items:center;gap:5px;letter-spacing:.06em}
.tb-sep{color:rgba(0,245,255,.22)}
.tb-cur{color:var(--cyan);text-transform:uppercase}
.tb-sp{flex:1}
.tb-enc{display:flex;align-items:center;gap:6px;padding:4px 11px;
  background:rgba(0,229,168,.06);border:1px solid rgba(0,229,168,.18);
  border-radius:20px;font-family:var(--ffm);font-size:.62rem;color:var(--teal);letter-spacing:.08em}
.tb-time{font-family:var(--ffm);font-size:.72rem;color:var(--t2);
  background:var(--bg2);border:1px solid var(--b);padding:3px 10px;border-radius:6px}
.tb-btn{width:32px;height:32px;background:var(--bg2);border:1px solid var(--b);border-radius:7px;
  display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all .2s;font-size:12px;position:relative}
.tb-btn:hover{border-color:var(--bh);background:var(--bg3)}
.notif-dot{position:absolute;top:-2px;right:-2px;width:7px;height:7px;border-radius:50%;
  background:var(--rose);border:1.5px solid var(--bg);animation:badgeBlink 1.5s infinite}

/* ═══ MAIN SCROLL ═══ */
.main{flex:1;height:100vh;overflow-y:auto;overflow-x:hidden;display:flex;flex-direction:column}
.content{padding:22px 28px 60px;display:flex;flex-direction:column;gap:0}

/* ═══ SECTIONS ═══ */
.section{display:none}
.section.active{display:block;animation:fadeUp .4s ease}
@keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}

/* ═══ PAGE HEADER ═══ */
.page-header{margin-bottom:28px;padding-bottom:18px;border-bottom:1px solid var(--b);
  display:flex;align-items:flex-end;justify-content:space-between;gap:16px}
.ph-left{}
.ph-eyebrow{font-family:var(--ffm);font-size:.62rem;color:var(--teal);letter-spacing:.16em;
  text-transform:uppercase;margin-bottom:6px;display:flex;align-items:center;gap:8px}
.ph-eyebrow::before{content:'⬡';color:var(--teal);font-size:.7rem}
.ph-title{font-family:var(--ffh);font-size:clamp(28px,3vw,46px);letter-spacing:.04em;color:#fff;line-height:1}
.ph-sub{font-size:.85rem;color:var(--t2);margin-top:5px;max-width:520px;line-height:1.6}
.ph-right{display:flex;gap:8px;align-items:center}

/* ═══ CARD ═══ */
.card{background:var(--bg1);border:1px solid var(--b);border-radius:14px;overflow:hidden;margin-bottom:18px}
.card-head{padding:14px 20px;border-bottom:1px solid var(--b);display:flex;align-items:center;justify-content:space-between;gap:10px}
.card-title{font-family:var(--ffh);font-size:1.05rem;letter-spacing:.07em;color:#fff;display:flex;align-items:center;gap:8px}
.card-title-sub{font-family:var(--ffm);font-size:.62rem;color:var(--t2);font-weight:400;letter-spacing:.04em;margin-left:4px}
.card-body{padding:20px}
.card-action{font-family:var(--ffm);font-size:.6rem;color:var(--cyan);cursor:pointer;
  letter-spacing:.07em;text-transform:uppercase;transition:opacity .2s}
.card-action:hover{opacity:.65}

/* ═══ SETTINGS ROWS ═══ */
.setting-row{display:flex;align-items:center;gap:14px;padding:14px 0;
  border-bottom:1px solid rgba(255,255,255,.04)}
.setting-row:last-child{border-bottom:none}
.setting-ico{width:38px;height:38px;border-radius:10px;background:rgba(0,245,255,.06);
  border:1px solid rgba(0,245,255,.12);display:flex;align-items:center;justify-content:center;
  font-size:15px;flex-shrink:0}
.setting-info{flex:1;min-width:0}
.setting-label{font-size:.88rem;font-weight:600;color:#fff;margin-bottom:2px}
.setting-desc{font-family:var(--ffm);font-size:.65rem;color:var(--t2);line-height:1.45}
.setting-right{display:flex;align-items:center;gap:10px;flex-shrink:0}

/* Toggle switch */
.toggle{position:relative;width:44px;height:24px;cursor:pointer;flex-shrink:0}
.toggle input{opacity:0;width:0;height:0}
.toggle-track{position:absolute;inset:0;background:rgba(255,255,255,.08);border-radius:24px;
  border:1px solid rgba(255,255,255,.12);transition:all .25s}
.toggle input:checked+.toggle-track{background:rgba(0,245,255,.18);border-color:rgba(0,245,255,.4)}
.toggle-thumb{position:absolute;top:3px;left:3px;width:16px;height:16px;border-radius:50%;
  background:var(--t2);transition:all .25s;box-shadow:0 1px 4px rgba(0,0,0,.3)}
.toggle input:checked~.toggle-thumb{left:23px;background:var(--cyan);box-shadow:0 0 8px rgba(0,245,255,.5)}

/* Select */
.s-select{background:var(--bg2);border:1px solid var(--b);border-radius:8px;padding:7px 12px;
  color:var(--t);font-family:var(--ffb);font-size:.82rem;outline:none;transition:border-color .2s;cursor:pointer}
.s-select:focus{border-color:rgba(0,245,255,.3)}
.s-select option{background:var(--bg2)}

/* Input */
.s-input{background:var(--bg2);border:1px solid var(--b);border-radius:8px;padding:8px 12px;
  color:#fff;font-family:var(--ffb);font-size:.85rem;outline:none;transition:border-color .2s;width:100%}
.s-input:focus{border-color:rgba(0,245,255,.3);box-shadow:0 0 0 2px rgba(0,245,255,.06)}
.s-input::placeholder{color:var(--t3)}

/* Button styles */
.btn{padding:9px 18px;border-radius:9px;font-family:var(--ffb);font-size:.82rem;
  font-weight:700;cursor:pointer;transition:all .2s;border:none;letter-spacing:.02em}
.btn-primary{background:linear-gradient(135deg,var(--cyan),var(--teal));color:#020a12}
.btn-primary:hover{transform:translateY(-1px);box-shadow:0 8px 20px rgba(0,245,255,.25)}
.btn-ghost{background:none;border:1px solid var(--b);color:var(--t2)}
.btn-ghost:hover{border-color:var(--bh);color:var(--t)}
.btn-danger{background:rgba(251,77,109,.08);border:1px solid rgba(251,77,109,.25);color:var(--rose)}
.btn-danger:hover{background:rgba(251,77,109,.15)}
.btn-sm{padding:6px 13px;font-size:.75rem;border-radius:7px}
.btn-xs{padding:4px 10px;font-size:.68rem;border-radius:6px}

/* Status badge */
.status-badge{font-family:var(--ffm);font-size:.6rem;padding:3px 9px;border-radius:6px;border:1px solid;letter-spacing:.05em}
.sb-active{color:var(--teal);border-color:rgba(0,229,168,.25);background:rgba(0,229,168,.07)}
.sb-warning{color:var(--amber);border-color:rgba(245,158,11,.25);background:rgba(245,158,11,.07)}
.sb-danger{color:var(--rose);border-color:rgba(251,77,109,.25);background:rgba(251,77,109,.07)}
.sb-info{color:var(--cyan);border-color:rgba(0,245,255,.25);background:rgba(0,245,255,.07)}

/* ═══ SECURITY VISUAL ═══ */
.enc-hero{background:linear-gradient(135deg,rgba(0,245,255,.04),rgba(168,85,247,.04));
  border:1px solid rgba(0,245,255,.12);border-radius:14px;padding:24px;margin-bottom:18px;
  position:relative;overflow:hidden;display:flex;gap:22px;align-items:center}
.enc-hero::before{content:'';position:absolute;left:0;top:0;bottom:0;width:3px;
  background:linear-gradient(180deg,var(--cyan),var(--teal),var(--purple))}
.enc-visual{width:90px;height:90px;flex-shrink:0;position:relative;display:flex;align-items:center;justify-content:center}
.enc-ring{position:absolute;inset:0;border-radius:50%;border:2px solid transparent;animation:encSpin 3s linear infinite}
.enc-ring-1{border-top-color:var(--cyan);animation-duration:2.5s}
.enc-ring-2{inset:10px;border-right-color:var(--teal);animation-duration:3.5s;animation-direction:reverse}
.enc-ring-3{inset:20px;border-bottom-color:var(--purple);animation-duration:4.5s}
@keyframes encSpin{100%{transform:rotate(360deg)}}
.enc-core{position:absolute;inset:30px;border-radius:50%;background:radial-gradient(circle,rgba(0,245,255,.15),rgba(0,245,255,.04));
  border:1px solid rgba(0,245,255,.25);animation:encPulse 2.5s ease-in-out infinite;
  display:flex;align-items:center;justify-content:center;font-size:11px}
@keyframes encPulse{0%,100%{box-shadow:0 0 8px rgba(0,245,255,.18)}50%{box-shadow:0 0 22px rgba(0,245,255,.45)}}
.enc-info{flex:1}
.enc-title{font-family:var(--ffh);font-size:1.4rem;letter-spacing:.05em;color:#fff;margin-bottom:4px}
.enc-level{font-family:var(--ffm);font-size:.65rem;color:var(--teal);letter-spacing:.12em;margin-bottom:8px}
.enc-bars{display:flex;flex-direction:column;gap:5px}
.enc-bar-row{display:flex;align-items:center;gap:8px;font-family:var(--ffm);font-size:.62rem;color:var(--t2)}
.enc-bar-label{min-width:100px}
.enc-bar-track{flex:1;height:3px;background:rgba(255,255,255,.06);border-radius:2px;overflow:hidden}
.enc-bar-fill{height:100%;border-radius:2px}
.enc-badge-row{display:flex;gap:7px;margin-top:12px;flex-wrap:wrap}
.enc-badge{display:flex;align-items:center;gap:5px;padding:4px 10px;border-radius:7px;
  font-family:var(--ffm);font-size:.62rem;border:1px solid;letter-spacing:.04em}

/* Session cards */
.session-device-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.device-card{background:var(--bg2);border:1px solid var(--b);border-radius:12px;padding:14px;position:relative}
.device-card.current{border-color:rgba(0,245,255,.25)}
.device-ico{font-size:1.5rem;margin-bottom:8px}
.device-name{font-size:.85rem;font-weight:600;color:#fff;margin-bottom:3px}
.device-meta{font-family:var(--ffm);font-size:.63rem;color:var(--t2);line-height:1.5}
.device-badge{position:absolute;top:10px;right:10px}
.device-revoke{position:absolute;bottom:10px;right:10px;font-family:var(--ffm);font-size:.6rem;
  color:var(--rose);cursor:pointer;padding:3px 8px;border-radius:5px;border:1px solid rgba(251,77,109,.2);transition:background .15s}
.device-revoke:hover{background:rgba(251,77,109,.08)}

/* Login history */
.login-row{display:flex;align-items:center;gap:12px;padding:10px 0;border-bottom:1px solid rgba(255,255,255,.04)}
.login-row:last-child{border-bottom:none}
.login-icon{font-size:.9rem;flex-shrink:0}
.login-info{flex:1}
.login-main{font-size:.82rem;color:var(--t);margin-bottom:1px}
.login-sub{font-family:var(--ffm);font-size:.62rem;color:var(--t2)}
.login-time{font-family:var(--ffm);font-size:.62rem;color:var(--t3)}

/* 2FA setup */
.twofa-wrap{display:flex;align-items:center;gap:16px;background:rgba(0,245,255,.03);
  border:1px solid rgba(0,245,255,.1);border-radius:12px;padding:16px}
.twofa-qr{width:80px;height:80px;background:var(--bg2);border-radius:8px;flex-shrink:0;
  display:flex;align-items:center;justify-content:center;font-size:2rem;
  border:1px solid rgba(0,245,255,.15)}
.twofa-info{flex:1}
.twofa-key{font-family:var(--ffm);font-size:.68rem;color:var(--cyan);
  background:var(--bg2);border:1px solid var(--b);border-radius:7px;
  padding:8px 12px;letter-spacing:.1em;margin-top:7px;display:flex;justify-content:space-between;align-items:center}
.twofa-copy{font-size:.58rem;color:var(--cyan);cursor:pointer;opacity:.7}
.twofa-copy:hover{opacity:1}

/* ═══ SECURE COMMS ═══ */
.comms-layout{display:grid;grid-template-columns:260px 1fr;height:calc(100vh - 180px);border:1px solid var(--b);border-radius:14px;overflow:hidden}
.threads-panel{border-right:1px solid var(--b);display:flex;flex-direction:column;background:var(--bg1)}
.threads-head{padding:14px 16px;border-bottom:1px solid var(--b);display:flex;align-items:center;justify-content:space-between}
.threads-title{font-family:var(--ffh);font-size:1rem;color:#fff;letter-spacing:.06em}
.threads-search{margin:10px 12px;position:relative}
.threads-search input{width:100%;background:var(--bg2);border:1px solid var(--b);border-radius:8px;
  padding:8px 12px 8px 32px;font-family:var(--ffm);font-size:.68rem;color:var(--t);outline:none;transition:border-color .2s}
.threads-search input:focus{border-color:rgba(0,245,255,.25)}
.threads-search input::placeholder{color:var(--t3)}
.threads-search-ico{position:absolute;left:10px;top:50%;transform:translateY(-50%);font-size:.7rem;color:var(--t3);pointer-events:none}
.threads-list{flex:1;overflow-y:auto}
.thread-item{padding:12px 14px;border-bottom:1px solid var(--b);cursor:pointer;
  transition:background .15s;display:flex;gap:10px;align-items:flex-start;position:relative}
.thread-item:hover{background:rgba(0,245,255,.025)}
.thread-item.active{background:rgba(0,245,255,.05);border-left:2.5px solid var(--cyan)}
.thread-item.unread::after{content:'';position:absolute;top:14px;right:12px;
  width:7px;height:7px;border-radius:50%;background:var(--cyan);box-shadow:0 0 7px var(--cyan)}
.thread-av{width:34px;height:34px;border-radius:50%;overflow:hidden;border:1.5px solid var(--b);flex-shrink:0}
.thread-av img{width:100%;height:100%;object-fit:cover}
.thread-av-init{width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-family:var(--ffh);font-size:1rem;color:var(--cyan)}
.thread-body{flex:1;min-width:0}
.thread-name{font-size:.82rem;font-weight:600;color:#fff;margin-bottom:2px}
.thread-preview{font-family:var(--ffm);font-size:.62rem;color:var(--t2);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:150px}
.thread-time{font-family:var(--ffm);font-size:.58rem;color:var(--t3)}
.thread-enc-badge{font-family:var(--ffm);font-size:.5rem;color:var(--teal);padding:1px 5px;border-radius:3px;background:rgba(0,229,168,.08);border:1px solid rgba(0,229,168,.18);margin-top:3px;display:inline-block;letter-spacing:.06em}

/* Chat area */
.chat-area{display:flex;flex-direction:column;background:var(--bg2)}
.chat-top{padding:12px 18px;border-bottom:1px solid var(--b);display:flex;align-items:center;gap:12px;background:rgba(4,8,18,.6)}
.chat-av{width:36px;height:36px;border-radius:50%;overflow:hidden;border:1.5px solid var(--bh);flex-shrink:0}
.chat-av img{width:100%;height:100%;object-fit:cover}
.chat-info{flex:1}
.chat-name{font-family:var(--ffh);font-size:1rem;color:#fff;letter-spacing:.04em}
.chat-status{font-family:var(--ffm);font-size:.62rem;color:var(--teal);display:flex;align-items:center;gap:5px}
.chat-actions{display:flex;gap:8px}
.chat-btn{width:32px;height:32px;background:var(--bg3);border:1px solid var(--b);
  border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:12px;cursor:pointer;transition:all .15s}
.chat-btn:hover{border-color:var(--bh)}
.enc-bar{padding:6px 18px;background:rgba(0,229,168,.04);border-bottom:1px solid rgba(0,229,168,.1);
  display:flex;align-items:center;gap:7px;font-family:var(--ffm);font-size:.6rem;color:var(--teal);letter-spacing:.08em}
.chat-msgs{flex:1;overflow-y:auto;padding:18px;display:flex;flex-direction:column;gap:14px}
.msg{display:flex;gap:8px;align-items:flex-end;max-width:74%}
.msg.sent{align-self:flex-end;flex-direction:row-reverse}
.msg-av{width:26px;height:26px;border-radius:50%;overflow:hidden;flex-shrink:0;border:1.5px solid var(--b)}
.msg-av img{width:100%;height:100%;object-fit:cover}
.msg-bubble{padding:10px 14px;border-radius:13px;font-size:.82rem;line-height:1.55}
.msg.recv .msg-bubble{background:var(--bg3);border:1px solid var(--b);color:var(--t);border-bottom-left-radius:3px}
.msg.sent .msg-bubble{background:linear-gradient(135deg,rgba(0,245,255,.1),rgba(0,229,168,.07));border:1px solid rgba(0,245,255,.2);color:#fff;border-bottom-right-radius:3px}
.msg-time{font-family:var(--ffm);font-size:.56rem;color:var(--t3);margin-bottom:2px;flex-shrink:0;align-self:flex-end}
.chat-input-area{padding:14px 18px;border-top:1px solid var(--b);display:flex;gap:10px;align-items:flex-end;background:rgba(4,8,18,.4)}
.chat-input{flex:1;background:var(--bg3);border:1px solid var(--b);border-radius:10px;
  padding:10px 14px;font-family:var(--ffb);font-size:.85rem;color:#fff;outline:none;
  resize:none;min-height:40px;max-height:110px;transition:border-color .2s;line-height:1.5}
.chat-input:focus{border-color:rgba(0,245,255,.28)}
.chat-input::placeholder{color:var(--t3)}
.chat-send{width:40px;height:40px;border-radius:9px;border:none;flex-shrink:0;
  background:linear-gradient(135deg,var(--cyan),var(--teal));color:#020a12;cursor:pointer;
  font-size:15px;transition:all .2s;display:flex;align-items:center;justify-content:center}
.chat-send:hover{transform:scale(1.06);box-shadow:0 5px 16px rgba(0,245,255,.3)}

/* ═══ DOCUMENT VAULT ═══ */
.doc-country-tabs{display:flex;gap:0;background:var(--bg2);border:1px solid var(--b);
  border-radius:14px 14px 0 0;overflow:hidden;border-bottom:none}
.doc-country-tab{padding:12px 18px;font-family:var(--ffm);font-size:.65rem;color:var(--t2);
  cursor:pointer;transition:all .18s;white-space:nowrap;border-right:1px solid var(--b);
  letter-spacing:.08em;text-transform:uppercase;display:flex;align-items:center;gap:7px;flex:1;justify-content:center}
.doc-country-tab:last-child{border-right:none}
.doc-country-tab:hover{color:var(--t);background:rgba(0,245,255,.025)}
.doc-country-tab.active{color:var(--cyan);background:rgba(0,245,255,.05);border-bottom:2px solid var(--cyan)}
.doc-flag{font-size:1rem}

/* Doc overall progress */
.doc-progress-bar{display:flex;background:var(--bg1);border:1px solid var(--b);
  border-top:none;border-radius:0;padding:14px 20px;gap:24px;align-items:center;margin-bottom:0;border-bottom:1px solid var(--b)}
.doc-prog-info{display:flex;flex-direction:column;gap:2px;min-width:140px}
.doc-prog-label{font-family:var(--ffm);font-size:.58rem;color:var(--t3);letter-spacing:.1em;text-transform:uppercase}
.doc-prog-val{font-family:var(--ffh);font-size:1.2rem;color:var(--teal);letter-spacing:.04em}
.doc-prog-track{flex:1;height:5px;background:rgba(255,255,255,.06);border-radius:3px;overflow:hidden}
.doc-prog-fill{height:100%;background:linear-gradient(90deg,var(--teal),var(--cyan));border-radius:3px;transition:width .7s ease}
.doc-prog-pct{font-family:var(--ffh);font-size:1.2rem;color:var(--cyan);letter-spacing:.04em;min-width:44px;text-align:right}

/* Doc categories */
.doc-content{background:var(--bg1);border:1px solid var(--b);border-top:none;border-radius:0 0 14px 14px;overflow:hidden}
.doc-category{border-bottom:1px solid var(--b)}
.doc-category:last-child{border-bottom:none}
.doc-cat-head{padding:14px 20px;display:flex;align-items:center;gap:10px;cursor:pointer;transition:background .15s}
.doc-cat-head:hover{background:rgba(0,245,255,.025)}
.doc-cat-head.expanded{background:rgba(0,245,255,.03)}
.doc-cat-ico{font-size:1rem;flex-shrink:0}
.doc-cat-name{font-family:var(--ffh);font-size:1rem;letter-spacing:.06em;color:#fff;flex:1}
.doc-cat-meta{font-family:var(--ffm);font-size:.6rem;color:var(--t2)}
.doc-cat-prog{width:80px;height:3px;background:rgba(255,255,255,.06);border-radius:2px;overflow:hidden}
.doc-cat-prog-fill{height:100%;border-radius:2px;transition:width .5s ease}
.doc-cat-chevron{font-size:.7rem;color:var(--t3);transition:transform .22s;margin-left:4px}
.doc-cat-head.expanded .doc-cat-chevron{transform:rotate(90deg)}
.doc-items{display:none;padding:0 20px 14px}
.doc-cat-head.expanded + .doc-items{display:flex;flex-direction:column;gap:7px}

.doc-item{display:flex;align-items:center;gap:12px;padding:11px 14px;
  background:var(--bg2);border:1px solid var(--b);border-radius:10px;
  transition:all .18s;cursor:pointer;position:relative;overflow:hidden}
.doc-item:hover{border-color:rgba(0,245,255,.15);background:var(--bg3)}
.doc-check{width:22px;height:22px;border-radius:6px;border:1.5px solid;display:flex;align-items:center;
  justify-content:center;flex-shrink:0;cursor:pointer;transition:all .2s;font-size:.7rem}
.doc-check.done{background:rgba(0,229,168,.12);border-color:rgba(0,229,168,.4);color:var(--teal)}
.doc-check.partial{background:rgba(245,158,11,.08);border-color:rgba(245,158,11,.35);color:var(--amber)}
.doc-check.empty{background:rgba(255,255,255,.03);border-color:rgba(255,255,255,.12);color:transparent}
.doc-info{flex:1;min-width:0}
.doc-name{font-size:.87rem;font-weight:600;color:#fff;margin-bottom:2px}
.doc-desc{font-family:var(--ffm);font-size:.63rem;color:var(--t2);line-height:1.4}
.doc-right{display:flex;align-items:center;gap:8px;flex-shrink:0}
.doc-priority{font-family:var(--ffm);font-size:.56rem;padding:2px 7px;border-radius:5px;border:1px solid;letter-spacing:.05em}
.dp-critical{color:var(--rose);border-color:rgba(251,77,109,.25);background:rgba(251,77,109,.07)}
.dp-required{color:var(--amber);border-color:rgba(245,158,11,.25);background:rgba(245,158,11,.07)}
.dp-optional{color:var(--t2);border-color:var(--b);background:rgba(255,255,255,.03)}
.dp-done{color:var(--teal);border-color:rgba(0,229,168,.25);background:rgba(0,229,168,.07)}
.doc-upload{font-family:var(--ffm);font-size:.6rem;color:var(--cyan);cursor:pointer;
  padding:3px 8px;border-radius:5px;border:1px solid rgba(0,245,255,.18);
  transition:background .15s;white-space:nowrap}
.doc-upload:hover{background:rgba(0,245,255,.08)}

/* Doc tip box */
.doc-tip-box{margin:14px 20px 0;background:rgba(245,158,11,.04);border:1px solid rgba(245,158,11,.18);
  border-radius:10px;padding:12px 14px;display:flex;gap:8px;align-items:flex-start;font-family:var(--ffm);font-size:.68rem;color:var(--t2);line-height:1.55}
.doc-tip-ico{color:var(--amber);flex-shrink:0;font-size:.85rem}
.doc-tip-text b{color:var(--amber)}

/* ═══ PROFILE SECTION ═══ */
.profile-avatar-area{display:flex;align-items:center;gap:20px;margin-bottom:20px}
.profile-av{width:72px;height:72px;border-radius:50%;border:3px solid rgba(0,245,255,.3);
  overflow:hidden;position:relative;flex-shrink:0;box-shadow:0 0 24px rgba(0,245,255,.15)}
.profile-av img{width:100%;height:100%;object-fit:cover}
.profile-av-edit{position:absolute;bottom:0;right:0;width:22px;height:22px;border-radius:50%;
  background:var(--cyan);display:flex;align-items:center;justify-content:center;
  font-size:.65rem;cursor:pointer;color:#020a12}
.profile-av-info h3{font-family:var(--ffh);font-size:1.4rem;color:#fff;letter-spacing:.04em;margin-bottom:3px}
.profile-av-info p{font-family:var(--ffm);font-size:.65rem;color:var(--teal);letter-spacing:.06em}
.profile-form-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px}
.form-group{display:flex;flex-direction:column;gap:6px}
.form-group label{font-family:var(--ffm);font-size:.62rem;color:var(--t2);letter-spacing:.1em;text-transform:uppercase}
.form-group.full{grid-column:1/-1}

/* ═══ DANGER ZONE ═══ */
.danger-zone{background:rgba(251,77,109,.03);border:1px solid rgba(251,77,109,.15);
  border-radius:14px;overflow:hidden;margin-bottom:18px}
.dz-head{padding:14px 20px;border-bottom:1px solid rgba(251,77,109,.12);display:flex;align-items:center;gap:8px}
.dz-title{font-family:var(--ffh);font-size:1rem;letter-spacing:.07em;color:var(--rose);display:flex;align-items:center;gap:7px}
.dz-body{padding:16px 20px;display:flex;flex-direction:column;gap:10px}
.dz-row{display:flex;align-items:center;justify-content:space-between;padding:10px 14px;
  background:rgba(251,77,109,.04);border:1px solid rgba(251,77,109,.1);border-radius:9px}
.dz-info{display:flex;flex-direction:column;gap:2px}
.dz-label{font-size:.85rem;color:#fff;font-weight:600}
.dz-desc{font-family:var(--ffm);font-size:.63rem;color:var(--t2)}

/* ═══ NOTIFICATIONS ═══ */
.notif-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px}

/* ═══ APPEARANCE ═══ */
.theme-grid{display:flex;gap:10px;flex-wrap:wrap}
.theme-option{width:80px;height:54px;border-radius:10px;border:2px solid var(--b);cursor:pointer;overflow:hidden;transition:all .2s;position:relative}
.theme-option.active{border-color:var(--cyan);box-shadow:0 0 14px rgba(0,245,255,.2)}
.theme-option-inner{width:100%;height:100%;display:flex}
.theme-label{position:absolute;bottom:3px;left:0;right:0;text-align:center;font-family:var(--ffm);font-size:.52rem;color:rgba(255,255,255,.6);letter-spacing:.06em}

/* ═══ ACCOUNT STATS ═══ */
.account-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:18px}
.acc-stat{background:var(--bg2);border:1px solid var(--b);border-radius:12px;padding:14px;text-align:center;position:relative;overflow:hidden}
.acc-stat::after{content:'';position:absolute;bottom:0;left:0;right:0;height:1.5px}
.acc-stat:nth-child(1)::after{background:linear-gradient(90deg,transparent,var(--cyan),transparent)}
.acc-stat:nth-child(2)::after{background:linear-gradient(90deg,transparent,var(--teal),transparent)}
.acc-stat:nth-child(3)::after{background:linear-gradient(90deg,transparent,var(--amber),transparent)}
.acc-stat:nth-child(4)::after{background:linear-gradient(90deg,transparent,var(--purple),transparent)}
.acc-stat-val{font-family:var(--ffh);font-size:1.7rem;letter-spacing:.04em;line-height:1;margin-bottom:3px}
.acc-stat-lbl{font-family:var(--ffm);font-size:.58rem;color:var(--t2);letter-spacing:.08em;text-transform:uppercase}

/* ═══ CORNER DECO ═══ */
.ctl{position:absolute;top:7px;left:7px;width:11px;height:11px;
  border-top:1.5px solid rgba(0,245,255,.2);border-left:1.5px solid rgba(0,245,255,.2)}
.cbr{position:absolute;bottom:7px;right:7px;width:11px;height:11px;
  border-bottom:1.5px solid rgba(0,245,255,.2);border-right:1.5px solid rgba(0,245,255,.2)}

/* ═══ LOG ROWS ═══ */
.log-body{padding:10px 16px;font-family:var(--ffm);font-size:.67rem;max-height:180px;overflow-y:auto}
.log-row{display:flex;gap:8px;margin-bottom:8px;align-items:flex-start;line-height:1.55}
.log-t{color:var(--t3);flex-shrink:0;min-width:38px;font-size:.6rem;padding-top:1px}
.log-icon{flex-shrink:0;font-size:.75rem}
.log-text{color:var(--t2);flex:1}
.log-text b{color:var(--cyan)}
.log-text .ok{color:var(--teal)}
.log-text .warn{color:var(--amber)}
.log-cur{display:inline-block;width:6px;height:10px;background:var(--cyan);vertical-align:middle;margin-left:2px;animation:blink .85s step-end infinite}
@keyframes blink{0%,100%{opacity:1}50%{opacity:0}}

/* toast */
.toast-zone{position:fixed;bottom:24px;right:28px;z-index:600;display:flex;flex-direction:column;gap:8px;pointer-events:none}
.toast{background:rgba(6,11,24,.97);backdrop-filter:blur(24px);border:1px solid rgba(0,245,255,.2);
  border-radius:12px;padding:12px 16px;width:320px;pointer-events:all;
  display:flex;gap:10px;align-items:center;box-shadow:0 16px 48px rgba(0,0,0,.6);
  animation:toastIn .3s cubic-bezier(.21,1.02,.73,1) both}
@keyframes toastIn{from{opacity:0;transform:translateX(100%)}to{opacity:1;transform:translateX(0)}}
.toast.out{animation:toastOut .25s ease forwards}
@keyframes toastOut{to{opacity:0;transform:translateX(100%)}}
.toast-ico{font-size:1.1rem;flex-shrink:0}
.toast-text{flex:1;font-family:var(--ffm);font-size:.72rem;color:var(--t);line-height:1.45}
.toast-text b{color:var(--cyan)}
.toast-close{font-size:10px;color:var(--t3);cursor:pointer;flex-shrink:0}
.toast-close:hover{color:var(--t)}

/* divider */
.divider{height:1px;background:var(--b);margin:6px 0}
`;

// ════════════════════════════════════════════════════════════════════════════════
// 3. REACT COMPONENT
// ════════════════════════════════════════════════════════════════════════════════
export default function StudentDashboard() {
  const router = useRouter();

  const SECTIONS = {
    settings: { sec: 'sec-settings', nav: 'nav-settings', label: 'SETTINGS' },
    comms: { sec: 'sec-comms', nav: 'nav-comms', label: 'SECURE COMMS' },
    docs: { sec: 'sec-docs', nav: 'nav-docs', label: 'DOCUMENT VAULT' },
  };

  const [activeSection, setActiveSection] = useState('settings');
  const [timeStr, setTimeStr] = useState('00:00:00');
  const [toasts, setToasts] = useState([]);
  const [show2FA, setShow2FA] = useState(false);

  // Document Vault State
  const [docCountry, setDocCountry] = useState('de');
  const [docStatus, setDocStatus] = useState({});
  const [expandedCats, setExpandedCats] = useState({ 'de_0': true });

  // Chat State
  const [activeThread, setActiveThread] = useState({
    name: 'Aarav Mehta', imgPath: 'men/11', badge: '🔐 AES-256', online: true, desc: 'TU Munich · Verified Mentor'
  });
  const [chatMsgs, setChatMsgs] = useState([
    { id: 1, recv: true, imgPath: 'men/11', text: "Hi Saif! Great to connect. I've reviewed your profile — your CGPA is solid. What's the status on your APS appointment?", time: '10:20' },
    { id: 2, recv: false, text: "Hi Aarav! APS appointment is booked for March 8 in Delhi. Still waiting for 3 translated marksheets — should be done by end of this week.", time: '10:23' },
    { id: 3, recv: true, imgPath: 'men/11', text: "Perfect timing. Get those translations done this week — use only certified translators. I'll share the complete APS document checklist right now. Also start your Motivation Letter draft in parallel, don't wait for APS.", time: '10:25' },
    { id: 4, recv: false, text: "Got it! One question — should I start with Uni-Assist applications before or after APS confirmation?", time: '10:28' },
    { id: 5, recv: true, imgPath: 'men/11', text: "After. Uni-Assist requires your APS certificate number. But you can create your Uni-Assist account now and fill everything else. Deadline for TU Munich Winter intake is July 15 — you have comfortable runway if you stay on track.", time: '10:31' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const chatMsgsRef = useRef(null);

  // Initialize
  useEffect(() => {
    const link = document.createElement('link');
    link.href = "https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Mono:wght@400;500&family=Syne:wght@400;600;700;800&display=swap";
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    const timer = setInterval(() => {
      const n = new Date();
      setTimeStr(
        String(n.getHours()).padStart(2, '0') + ':' +
        String(n.getMinutes()).padStart(2, '0') + ':' +
        String(n.getSeconds()).padStart(2, '0')
      );
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Auto-scroll chat
  useEffect(() => {
    if (chatMsgsRef.current) {
      chatMsgsRef.current.scrollTop = chatMsgsRef.current.scrollHeight;
    }
  }, [chatMsgs, activeSection, activeThread]);

  // Toast Logic
  const addToast = (ico, msg) => {
    const id = 't' + Date.now() + Math.random();
    setToasts(prev => [...prev, { id, ico, msg }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };
  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Nav Logic
  const switchSection = (key) => {
    setActiveSection(key);
  };
  const goTo = (s) => {
    addToast('🔀', 'Navigating to ' + s + '…');
  };

  // Chat Logic
  const handleThreadSwitch = (name, imgPath) => {
    setActiveThread({ name, imgPath, badge: '🔐 AES-256', online: true, desc: 'Verified Mentor' });
    setChatMsgs([
      { id: Date.now(), recv: true, imgPath, text: "Hi! I'm ready to help. What do you want to work on today?", time: "09:00" }
    ]);
  };
  const handleSendMsg = () => {
    const txt = chatInput.trim();
    if (!txt) return;
    setChatInput('');
    const now = new Date();
    const t = String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0');
    setChatMsgs(prev => [...prev, { id: Date.now(), recv: false, text: txt, time: t }]);

    setTimeout(() => {
      const replies = ['Understood. I\'ll work on that right away.', 'Great question! Here\'s what I recommend…', 'Got it. Keep that momentum going.', 'Perfect. I\'ll review and get back to you.'];
      const replyText = replies[Math.floor(Math.random() * replies.length)];
      setChatMsgs(prev => [...prev, { id: Date.now() + 1, recv: true, imgPath: activeThread.imgPath, text: replyText, time: t }]);
    }, 1400 + Math.random() * 1600);
  };
  const handleChatKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMsg();
    }
  };

  // Doc Logic
  const toggleDoc = (key, currentStatus) => {
    const states = ['empty', 'partial', 'done'];
    const curIdx = states.indexOf(currentStatus);
    const nextStatus = states[(curIdx + 1) % 3];
    setDocStatus(prev => ({ ...prev, [key]: nextStatus }));
    
    const msgs = { done: '✅ Marked as complete!', partial: '⏳ Marked as in progress', empty: 'Document marked as pending' };
    addToast(nextStatus === 'done' ? '✅' : nextStatus === 'partial' ? '⏳' : '📋', msgs[nextStatus]);
  };
  const toggleCat = (catId) => {
    setExpandedCats(prev => ({ ...prev, [catId]: !prev[catId] }));
  };

  // Calculate overall progress
  let totalDocs = 0;
  let totalDoneDocs = 0;
  if (DOC_DATA[docCountry]) {
    DOC_DATA[docCountry].categories.forEach((cat, ci) => {
      cat.docs.forEach((doc, di) => {
        totalDocs++;
        const key = `${docCountry}_${ci}_${di}`;
        const st = docStatus[key] || doc.status;
        if (st === 'done') totalDoneDocs++;
      });
    });
  }
  const overallPct = totalDocs === 0 ? 0 : Math.round((totalDoneDocs / totalDocs) * 100);

  return (
    <div className="student-dashboard-root">
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <div className="amb"></div>
      <div className="hex-bg"></div>
      <div className="scan"></div>
      <div className="sweep"></div>

      <div className="toast-zone" id="toastZone">
        {toasts.map(t => (
          <div key={t.id} className="toast">
            <div className="toast-ico">{t.ico}</div>
            <div className="toast-text">{t.msg}</div>
            <div className="toast-close" onClick={() => removeToast(t.id)}>✕</div>
          </div>
        ))}
      </div>

      <div className="layout">
        {/* ═══════════════ SIDEBAR ═══════════════ */}
        <aside className="sb">
          <div className="sb-logo" onClick={() => router.push('/')}>
            <div className="sb-logo-icon">🌉</div>
            <div className="sb-logo-text">Mentor<em>Bridge</em></div>
          </div>
          <div className="sb-status">
            <div className="s-dot"></div> STUDENT PORTAL
            <span>v3.1.2</span>
          </div>
          <nav className="sb-nav">
            <div className="sb-sect">Navigation</div>
            <div className="sb-item" onClick={() => goTo('dash')}><span className="sb-ico">⬡</span>Dashboard</div>
            <div className="sb-item" onClick={() => goTo('roadmap')}><span className="sb-ico">🗺</span>My Roadmap</div>
            <div className="sb-item" onClick={() => goTo('unis')}><span className="sb-ico">🎓</span>University Shortlist</div>
            <div className="sb-item" onClick={() => goTo('funds')}><span className="sb-ico">💰</span>Funding Engine</div>
            <div className="sb-sect">Current</div>
            <div className={`sb-item ${activeSection === 'settings' ? 'active' : ''}`} onClick={() => switchSection('settings')}>
              <span className="sb-ico">⚙</span>Settings <span className="sb-badge bc">NEW</span>
            </div>
            <div className={`sb-item ${activeSection === 'comms' ? 'active' : ''}`} onClick={() => switchSection('comms')}>
              <span className="sb-ico">💬</span>Secure Comms <span className="sb-badge br">2</span>
            </div>
            <div className={`sb-item ${activeSection === 'docs' ? 'active' : ''}`} onClick={() => switchSection('docs')}>
              <span className="sb-ico">📁</span>Document Vault <span className="sb-badge bg">14</span>
            </div>
          </nav>
          <div className="sb-user">
            <div className="sb-av"><img src="https://randomuser.me/api/portraits/men/45.jpg" alt="Saif"/></div>
            <div>
              <div className="sb-uname">Saif Sanadi</div>
              <div className="sb-urole">⬡ STUDENT OPERATIVE</div>
            </div>
          </div>
        </aside>

        {/* ═══════════════ MAIN ═══════════════ */}
        <main className="main">
          <div className="topbar">
            <div className="tb-crumb">MENTORBRIDGE <span className="tb-sep">/</span> STUDENT <span className="tb-sep">/</span> <span className="tb-cur">{SECTIONS[activeSection]?.label}</span></div>
            <div className="tb-sp"></div>
            <div className="tb-enc"><div className="s-dot"></div> AES-256 ENCRYPTED</div>
            <div className="tb-time">{timeStr}</div>
            <div className="tb-btn">🔔<div className="notif-dot"></div></div>
            <div className="tb-btn">⚙</div>
          </div>

          <div className="content">
            {/* ════════════════════════════════════
                  SETTINGS SECTION
            ════════════════════════════════════ */}
            <div className={`section ${activeSection === 'settings' ? 'active' : ''}`}>
              <div className="page-header">
                <div className="ph-left">
                  <div className="ph-eyebrow">OPERATIVE CONFIGURATION</div>
                  <div className="ph-title">SETTINGS</div>
                  <div className="ph-sub">Manage your profile, security, encryption, notifications, and account preferences.</div>
                </div>
                <div className="ph-right">
                  <button className="btn btn-primary" onClick={() => addToast('✅', 'All settings saved successfully')}>Save All Changes</button>
                </div>
              </div>

              {/* Account Stats */}
              <div className="account-stats">
                <div className="acc-stat"><div className="acc-stat-val" style={{color: 'var(--cyan)'}}>47</div><div className="acc-stat-lbl">Days Active</div></div>
                <div className="acc-stat"><div className="acc-stat-val" style={{color: 'var(--teal)'}}>6</div><div className="acc-stat-lbl">Mentor Sessions</div></div>
                <div className="acc-stat"><div className="acc-stat-val" style={{color: 'var(--amber)'}}>82%</div><div className="acc-stat-lbl">Profile Complete</div></div>
                <div className="acc-stat"><div className="acc-stat-val" style={{color: 'var(--purple)'}}>14</div><div className="acc-stat-lbl">Docs Uploaded</div></div>
              </div>

              {/* Profile Setup */}
              <div className="card">
                <div className="card-head">
                  <div className="card-title">👤 PROFILE SETUP</div>
                  <span className="status-badge sb-warning">82% COMPLETE</span>
                </div>
                <div className="card-body">
                  <div className="profile-avatar-area">
                    <div className="profile-av">
                      <img src="https://randomuser.me/api/portraits/men/45.jpg" alt=""/>
                      <div className="profile-av-edit">✎</div>
                    </div>
                    <div className="profile-av-info">
                      <h3>Saif Sanadi</h3>
                      <p>⬡ STUDENT OPERATIVE · JOINED FEB 2026</p>
                    </div>
                  </div>
                  <div className="profile-form-grid">
                    <div className="form-group"><label>Full Name</label><input className="s-input" defaultValue="Saif Sanadi" placeholder="Your full name"/></div>
                    <div className="form-group"><label>Email</label><input className="s-input" defaultValue="saif.sanadi@gmail.com" placeholder="Email address"/></div>
                    <div className="form-group"><label>Phone (with country code)</label><input className="s-input" defaultValue="+91 98765 43210" placeholder="+91 XXXXX XXXXX"/></div>
                    <div className="form-group"><label>City / State</label><input className="s-input" defaultValue="Pune, Maharashtra" placeholder="Your city and state"/></div>
                    <div className="form-group">
                      <label>Current Degree</label>
                      <select className="s-select" style={{width:'100%'}} defaultValue="B.Tech Computer Science">
                        <option>B.Tech Computer Science</option>
                        <option>B.Tech Other Branch</option>
                        <option>B.Sc / BCA / BBA</option>
                        <option>Master's Student</option>
                      </select>
                    </div>
                    <div className="form-group"><label>CGPA / Percentage</label><input className="s-input" defaultValue="8.4" placeholder="CGPA or percentage"/></div>
                    <div className="form-group">
                      <label>Target Destination</label>
                      <select className="s-select" style={{width:'100%'}} defaultValue="🇩🇪 Germany">
                        <option>🇩🇪 Germany</option>
                        <option>🇺🇸 USA</option>
                        <option>🇬🇧 UK</option>
                        <option>🇨🇦 Canada</option>
                        <option>🇦🇺 Australia</option>
                        <option>🇮🇪 Ireland</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Field of Study</label>
                      <select className="s-select" style={{width:'100%'}} defaultValue="CS / AI / Machine Learning">
                        <option>CS / AI / Machine Learning</option>
                        <option>Data Science</option>
                        <option>Mechanical Engineering</option>
                        <option>Business / MBA</option>
                      </select>
                    </div>
                    <div className="form-group full"><label>About You (visible to mentors)</label><input className="s-input" defaultValue="Targeting TU Munich MSCS. Strong in Python, ML. IELTS 7.5. APS process ongoing." placeholder="Brief intro for your mentor profile"/></div>
                  </div>
                </div>
              </div>

              {/* Security & Encryption */}
              <div className="card">
                <div className="card-head">
                  <div className="card-title">🔐 SECURITY CENTRE</div>
                  <span className="status-badge sb-active">SECURED</span>
                </div>
                <div className="card-body">
                  <div className="enc-hero" style={{marginBottom: '20px'}}>
                    <div className="ctl"></div><div className="cbr"></div>
                    <div className="enc-visual">
                      <div className="enc-ring enc-ring-1"></div>
                      <div className="enc-ring enc-ring-2"></div>
                      <div className="enc-ring enc-ring-3"></div>
                      <div className="enc-core">🔑</div>
                    </div>
                    <div className="enc-info">
                      <div className="enc-title">AES-256 ENCRYPTION ACTIVE</div>
                      <div className="enc-level">MILITARY-GRADE SECURITY · ALL DATA ENCRYPTED AT REST & IN TRANSIT</div>
                      <div className="enc-bars">
                        <div className="enc-bar-row"><span className="enc-bar-label">Message Encryption</span><div className="enc-bar-track"><div className="enc-bar-fill" style={{width:'100%', background:'var(--cyan)'}}></div></div><span style={{color:'var(--cyan)', fontSize:'.62rem'}}>AES-256</span></div>
                        <div className="enc-bar-row"><span className="enc-bar-label">Document Storage</span><div className="enc-bar-track"><div className="enc-bar-fill" style={{width:'100%', background:'var(--teal)'}}></div></div><span style={{color:'var(--teal)', fontSize:'.62rem'}}>AES-256</span></div>
                        <div className="enc-bar-row"><span className="enc-bar-label">Profile Data</span><div className="enc-bar-track"><div className="enc-bar-fill" style={{width:'100%', background:'var(--purple)'}}></div></div><span style={{color:'var(--purple)', fontSize:'.62rem'}}>TLS 1.3</span></div>
                      </div>
                      <div className="enc-badge-row">
                        <div className="enc-badge" style={{color:'var(--teal)', borderColor:'rgba(0,229,168,.2)', background:'rgba(0,229,168,.07)'}}>✓ End-to-End Encrypted</div>
                        <div className="enc-badge" style={{color:'var(--cyan)', borderColor:'rgba(0,245,255,.2)', background:'rgba(0,245,255,.07)'}}>✓ Zero-Knowledge Architecture</div>
                        <div className="enc-badge" style={{color:'var(--purple)', borderColor:'rgba(168,85,247,.2)', background:'rgba(168,85,247,.07)'}}>✓ GDPR Compliant</div>
                      </div>
                    </div>
                  </div>

                  <div className="setting-row">
                    <div className="setting-ico">🛡</div>
                    <div className="setting-info">
                      <div className="setting-label">Two-Factor Authentication (2FA)</div>
                      <div className="setting-desc">Add a second layer of protection. Required for accessing encrypted messages and document vault.</div>
                    </div>
                    <div className="setting-right">
                      <span className="status-badge sb-active">ENABLED</span>
                      <button className="btn btn-ghost btn-xs" onClick={() => setShow2FA(!show2FA)}>Manage</button>
                    </div>
                  </div>
                  
                  {show2FA && (
                    <div className="setting-row" id="twoFAPanel">
                      <div style={{flex: 1, paddingLeft: '52px'}}>
                        <div className="twofa-wrap">
                          <div className="twofa-qr">📲</div>
                          <div className="twofa-info">
                            <div style={{fontSize: '.85rem', fontWeight: 600, color: '#fff', marginBottom: '4px'}}>Authenticator App Setup</div>
                            <div style={{fontFamily: 'var(--ffm)', fontSize: '.65rem', color: 'var(--t2)', marginBottom: '8px'}}>Scan QR code with Google Authenticator or Authy to enable TOTP 2FA.</div>
                            <div className="twofa-key">
                              <span>MNTB-SSND-2K3X-9QLP-7WVR</span>
                              <span className="twofa-copy" onClick={() => { navigator.clipboard.writeText('MNTB-SSND-2K3X-9QLP-7WVR'); addToast('📋', 'Secret key copied to clipboard'); }}>📋 COPY</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="setting-row">
                    <div className="setting-ico">🔑</div>
                    <div className="setting-info">
                      <div className="setting-label">Change Password</div>
                      <div className="setting-desc">Last changed 14 days ago. Use a minimum 12-character password with symbols.</div>
                    </div>
                    <div className="setting-right">
                      <button className="btn btn-ghost btn-xs" onClick={() => addToast('🔑', 'Password reset link sent to your email')}>Change</button>
                    </div>
                  </div>

                  <div className="setting-row">
                    <div className="setting-ico">🔒</div>
                    <div className="setting-info">
                      <div className="setting-label">Message Encryption</div>
                      <div className="setting-desc">All messages between you and mentors are AES-256 encrypted. Only you and your mentor can read them.</div>
                    </div>
                    <div className="setting-right">
                      <span className="status-badge sb-active">ON</span>
                    </div>
                  </div>

                  <div className="setting-row">
                    <div className="setting-ico">📱</div>
                    <div className="setting-info">
                      <div className="setting-label">Biometric Authentication</div>
                      <div className="setting-desc">Use fingerprint or Face ID to log in on supported devices.</div>
                    </div>
                    <div className="setting-right">
                      <label className="toggle">
                        <input type="checkbox" defaultChecked />
                        <div className="toggle-track"></div>
                        <div className="toggle-thumb"></div>
                      </label>
                    </div>
                  </div>

                  <div className="setting-row">
                    <div className="setting-ico">⏱</div>
                    <div className="setting-info">
                      <div className="setting-label">Auto-Lock After Inactivity</div>
                      <div className="setting-desc">Automatically lock the session after a period of inactivity for security.</div>
                    </div>
                    <div className="setting-right">
                      <select className="s-select" defaultValue="30 minutes">
                        <option>15 minutes</option>
                        <option>30 minutes</option>
                        <option>1 hour</option>
                        <option>Never</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Active Sessions */}
              <div className="card">
                <div className="card-head">
                  <div className="card-title">📡 ACTIVE SESSIONS</div>
                  <div className="card-action" onClick={() => addToast('🔐', 'All other sessions revoked')}>REVOKE ALL OTHERS</div>
                </div>
                <div className="card-body">
                  <div className="session-device-grid">
                    <div className="device-card current">
                      <div className="device-ico">💻</div>
                      <div className="device-name">Windows 11 · Chrome 121</div>
                      <div className="device-meta">📍 Pune, India<br/>🟢 Current session · Just now<br/>🔑 Encrypted · TLS 1.3</div>
                      <div className="device-badge"><span className="status-badge sb-active">CURRENT</span></div>
                    </div>
                    <div className="device-card" id="dev1">
                      <div className="device-ico">📱</div>
                      <div className="device-name">iPhone 14 · Safari</div>
                      <div className="device-meta">📍 Pune, India<br/>🕐 2 hours ago<br/>🔑 Encrypted · TLS 1.3</div>
                      <div className="device-revoke" onClick={(e) => { document.getElementById('dev1').style.opacity = '.4'; addToast('📱', 'iPhone session revoked'); }}>REVOKE</div>
                    </div>
                    <div className="device-card" id="dev2">
                      <div className="device-ico">🖥</div>
                      <div className="device-name">MacBook · Firefox 122</div>
                      <div className="device-meta">📍 Mumbai, India<br/>🕐 Yesterday, 09:14<br/>🔑 Encrypted · TLS 1.3</div>
                      <div className="device-revoke" onClick={(e) => { document.getElementById('dev2').style.opacity = '.4'; addToast('🖥', 'MacBook session revoked'); }}>REVOKE</div>
                    </div>
                    <div className="device-card">
                      <div className="device-ico">📊</div>
                      <div className="device-name">API Access · MentorBridge App</div>
                      <div className="device-meta">📍 Authorised Token<br/>🕐 Active · Persistent<br/>🔑 OAuth 2.0 Bearer</div>
                      <div className="device-badge"><span className="status-badge sb-info">API</span></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Login History */}
              <div className="card">
                <div className="card-head">
                  <div className="card-title">📋 LOGIN HISTORY</div>
                  <div className="card-action">VIEW ALL →</div>
                </div>
                <div className="card-body" style={{ paddingTop: '6px', paddingBottom: '6px' }}>
                  <div className="login-row"><span className="login-icon">✅</span><div className="login-info"><div className="login-main">Successful login · Windows 11 / Chrome</div><div className="login-sub">📍 Pune, Maharashtra · IP: 103.24.xx.xx</div></div><div className="login-time">Today, 10:22</div></div>
                  <div className="login-row"><span className="login-icon">✅</span><div className="login-info"><div className="login-main">Successful login · iPhone 14 / Safari</div><div className="login-sub">📍 Pune, Maharashtra · IP: 49.32.xx.xx</div></div><div className="login-time">Today, 08:04</div></div>
                  <div className="login-row"><span className="login-icon">⚠️</span><div className="login-info"><div className="login-main" style={{color: 'var(--amber)'}}>Failed login attempt · Unknown Browser</div><div className="login-sub">📍 Location unknown · IP: 185.xx.xx.xx</div></div><div className="login-time">Yesterday</div></div>
                  <div className="login-row"><span className="login-icon">✅</span><div className="login-info"><div className="login-main">Successful login · MacBook / Firefox</div><div className="login-sub">📍 Mumbai, Maharashtra · IP: 117.96.xx.xx</div></div><div className="login-time">Feb 20, 09:14</div></div>
                </div>
              </div>

              {/* Notifications */}
              <div className="card">
                <div className="card-head">
                  <div className="card-title">🔔 NOTIFICATION PREFERENCES</div>
                </div>
                <div className="card-body">
                  <div className="notif-grid">
                    <div>
                      <div style={{fontFamily: 'var(--ffm)', fontSize: '.6rem', color: 'var(--t3)', letterSpacing: '.12em', textTransform: 'uppercase', marginBottom: '12px'}}>IN-APP</div>
                      <div className="setting-row" style={{padding: '8px 0'}}><div className="setting-ico" style={{width:'30px',height:'30px',fontSize:'12px'}}>💬</div><div className="setting-info"><div className="setting-label" style={{fontSize:'.83rem'}}>Mentor Messages</div></div><label className="toggle"><input type="checkbox" defaultChecked/><div className="toggle-track"></div><div className="toggle-thumb"></div></label></div>
                      <div className="setting-row" style={{padding: '8px 0'}}><div className="setting-ico" style={{width:'30px',height:'30px',fontSize:'12px'}}>📅</div><div className="setting-info"><div className="setting-label" style={{fontSize:'.83rem'}}>Session Reminders</div></div><label className="toggle"><input type="checkbox" defaultChecked/><div className="toggle-track"></div><div className="toggle-thumb"></div></label></div>
                      <div className="setting-row" style={{padding: '8px 0'}}><div className="setting-ico" style={{width:'30px',height:'30px',fontSize:'12px'}}>📁</div><div className="setting-info"><div className="setting-label" style={{fontSize:'.83rem'}}>Document Deadlines</div></div><label className="toggle"><input type="checkbox" defaultChecked/><div className="toggle-track"></div><div className="toggle-thumb"></div></label></div>
                      <div className="setting-row" style={{padding: '8px 0'}}><div className="setting-ico" style={{width:'30px',height:'30px',fontSize:'12px'}}>🎯</div><div className="setting-info"><div className="setting-label" style={{fontSize:'.83rem'}}>Roadmap Milestones</div></div><label className="toggle"><input type="checkbox" defaultChecked/><div className="toggle-track"></div><div className="toggle-thumb"></div></label></div>
                      <div className="setting-row" style={{padding: '8px 0'}}><div className="setting-ico" style={{width:'30px',height:'30px',fontSize:'12px'}}>🔔</div><div className="setting-info"><div className="setting-label" style={{fontSize:'.83rem'}}>Platform Updates</div></div><label className="toggle"><input type="checkbox"/><div className="toggle-track"></div><div className="toggle-thumb"></div></label></div>
                    </div>
                    <div>
                      <div style={{fontFamily: 'var(--ffm)', fontSize: '.6rem', color: 'var(--t3)', letterSpacing: '.12em', textTransform: 'uppercase', marginBottom: '12px'}}>EMAIL & SMS</div>
                      <div className="setting-row" style={{padding: '8px 0'}}><div className="setting-ico" style={{width:'30px',height:'30px',fontSize:'12px'}}>📧</div><div className="setting-info"><div className="setting-label" style={{fontSize:'.83rem'}}>Email Notifications</div></div><label className="toggle"><input type="checkbox" defaultChecked/><div className="toggle-track"></div><div className="toggle-thumb"></div></label></div>
                      <div className="setting-row" style={{padding: '8px 0'}}><div className="setting-ico" style={{width:'30px',height:'30px',fontSize:'12px'}}>📱</div><div className="setting-info"><div className="setting-label" style={{fontSize:'.83rem'}}>SMS Alerts</div></div><label className="toggle"><input type="checkbox" defaultChecked/><div className="toggle-track"></div><div className="toggle-thumb"></div></label></div>
                      <div className="setting-row" style={{padding: '8px 0'}}><div className="setting-ico" style={{width:'30px',height:'30px',fontSize:'12px'}}>🔔</div><div className="setting-info"><div className="setting-label" style={{fontSize:'.83rem'}}>Push Notifications</div></div><label className="toggle"><input type="checkbox" defaultChecked/><div className="toggle-track"></div><div className="toggle-thumb"></div></label></div>
                      <div className="setting-row" style={{padding: '8px 0'}}><div className="setting-ico" style={{width:'30px',height:'30px',fontSize:'12px'}}>📢</div><div className="setting-info"><div className="setting-label" style={{fontSize:'.83rem'}}>Marketing Emails</div></div><label className="toggle"><input type="checkbox"/><div className="toggle-track"></div><div className="toggle-thumb"></div></label></div>
                      <div className="form-group" style={{marginTop: '10px'}}><label>Notification Frequency</label><select className="s-select" style={{width:'100%'}} defaultValue="Daily digest"><option>Real-time</option><option>Daily digest</option><option>Weekly</option></select></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Privacy */}
              <div className="card">
                <div className="card-head">
                  <div className="card-title">🕵 PRIVACY CONTROLS</div>
                </div>
                <div className="card-body">
                  <div className="setting-row"><div className="setting-ico">👁</div><div className="setting-info"><div className="setting-label">Profile Visibility</div><div className="setting-desc">Control who can view your profile and application details.</div></div><div className="setting-right"><select className="s-select" defaultValue="Mentors only"><option>Mentors only</option><option>All users</option><option>Private</option></select></div></div>
                  <div className="setting-row"><div className="setting-ico">📊</div><div className="setting-info"><div className="setting-label">Analytics & Usage Data</div><div className="setting-desc">Help us improve MentorBridge by sharing anonymized usage data.</div></div><div className="setting-right"><label className="toggle"><input type="checkbox" defaultChecked/><div className="toggle-track"></div><div className="toggle-thumb"></div></label></div></div>
                  <div className="setting-row"><div className="setting-ico">🤝</div><div className="setting-info"><div className="setting-label">Data Sharing with Partners</div><div className="setting-desc">We never sell your data. Partner sharing is anonymized and aggregated only.</div></div><div className="setting-right"><label className="toggle"><input type="checkbox"/><div className="toggle-track"></div><div className="toggle-thumb"></div></label></div></div>
                  <div className="setting-row"><div className="setting-ico">📥</div><div className="setting-info"><div className="setting-label">Download My Data</div><div className="setting-desc">Export all your personal data, documents, and conversation history.</div></div><div className="setting-right"><button className="btn btn-ghost btn-xs" onClick={() => addToast('📥', 'Data export requested — you\'ll receive an email with the download link')}>Export</button></div></div>
                </div>
              </div>

              {/* Danger Zone */}
              <div className="danger-zone">
                <div className="dz-head"><div className="dz-title">⚠ DANGER ZONE</div></div>
                <div className="dz-body">
                  <div className="dz-row"><div className="dz-info"><div className="dz-label">Deactivate Account</div><div className="dz-desc">Temporarily disable your account. Your data will be preserved.</div></div><button className="btn btn-danger btn-sm">Deactivate</button></div>
                  <div className="dz-row"><div className="dz-info"><div className="dz-label">Delete Account Permanently</div><div className="dz-desc">This will permanently delete all your data, sessions, and messages. Cannot be undone.</div></div><button className="btn btn-danger btn-sm" onClick={() => addToast('⚠️', 'Confirmation email sent. You have 30 days to cancel.')}>Delete</button></div>
                </div>
              </div>

              {/* System Log */}
              <div className="card">
                <div className="card-head">
                  <div className="card-title">■ <span style={{color: 'var(--teal)'}}>SYSTEM LOG</span></div>
                  <div className="card-action">EXPORT LOG</div>
                </div>
                <div className="log-body">
                  <div className="log-row"><span className="log-t">NOW</span><span className="log-icon">🔐</span><span className="log-text">Settings panel loaded — <span className="ok">AES-256 active</span><span className="log-cur"></span></span></div>
                  <div className="log-row"><span className="log-t">10:22</span><span className="log-icon">✅</span><span className="log-text">Login successful — <b>Chrome / Windows 11</b> · Pune</span></div>
                  <div className="log-row"><span className="log-t">09:44</span><span className="log-icon">📁</span><span className="log-text">Document uploaded — <b>APS Appointment Confirmation.pdf</b></span></div>
                  <div className="log-row"><span className="log-t">09:12</span><span className="log-icon">💬</span><span className="log-text">Message to mentor <b>Aarav Mehta</b> — <span className="ok">encrypted &amp; delivered</span></span></div>
                  <div className="log-row"><span className="log-t">YEST</span><span className="log-icon">⚠️</span><span className="log-text">Failed login attempt from <span className="warn">unknown IP 185.xx.xx.xx</span> — blocked</span></div>
                  <div className="log-row"><span className="log-t">YEST</span><span className="log-icon">🎯</span><span className="log-text">Roadmap milestone updated — <b>APS Documents Ready</b></span></div>
                </div>
              </div>
            </div>

            {/* ════════════════════════════════════
                  SECURE COMMS SECTION
            ════════════════════════════════════ */}
            <div className={`section ${activeSection === 'comms' ? 'active' : ''}`} id="sec-comms">
              <div className="page-header">
                <div className="ph-left">
                  <div className="ph-eyebrow">END-TO-END ENCRYPTED CHANNEL</div>
                  <div className="ph-title">SECURE COMMS</div>
                  <div className="ph-sub">All messages are AES-256 encrypted. Only you and your mentor can read them — not even MentorBridge can access your conversations.</div>
                </div>
              </div>
              <div className="comms-layout">
                {/* Threads */}
                <div className="threads-panel">
                  <div className="threads-head">
                    <div className="threads-title">CHANNELS</div>
                    <span className="status-badge sb-active">🔐 E2E</span>
                  </div>
                  <div className="threads-search">
                    <span className="threads-search-ico">🔍</span>
                    <input placeholder="Search conversations…"/>
                  </div>
                  <div className="threads-list">
                    <div className={`thread-item ${activeThread.name === 'Aarav Mehta' ? 'active' : ''}`} onClick={() => handleThreadSwitch('Aarav Mehta', 'men/11')}>
                      <div className="thread-av"><img src="https://randomuser.me/api/portraits/men/11.jpg" alt="" /></div>
                      <div className="thread-body">
                        <div className="thread-name">Aarav Mehta</div>
                        <div className="thread-preview">Get those translations done this week…</div>
                        <div className="thread-enc-badge">🔐 AES-256</div>
                      </div>
                      <div><div className="thread-time">10m</div></div>
                    </div>
                    <div className={`thread-item unread ${activeThread.name === 'Priya Sharma' ? 'active' : ''}`} onClick={() => handleThreadSwitch('Priya Sharma', 'women/55')}>
                      <div className="thread-av"><img src="https://randomuser.me/api/portraits/women/55.jpg" alt="" /></div>
                      <div className="thread-body">
                        <div className="thread-name">Priya Sharma</div>
                        <div className="thread-preview">Your SOP draft is really strong…</div>
                        <div className="thread-enc-badge">🔐 AES-256</div>
                      </div>
                      <div><div className="thread-time">2h</div></div>
                    </div>
                    <div className={`thread-item ${activeThread.name === 'Dev Patel' ? 'active' : ''}`} onClick={() => handleThreadSwitch('Dev Patel', 'men/22')}>
                      <div className="thread-av"><img src="https://randomuser.me/api/portraits/men/22.jpg" alt="" /></div>
                      <div className="thread-body">
                        <div className="thread-name">Dev Patel</div>
                        <div className="thread-preview">Yes, Fintiba is better than DKB for…</div>
                        <div className="thread-enc-badge">🔐 AES-256</div>
                      </div>
                      <div><div className="thread-time">1d</div></div>
                    </div>
                    <div className={`thread-item ${activeThread.name === 'MentorBridge Support' ? 'active' : ''}`} onClick={() => handleThreadSwitch('MentorBridge Support', 'men/80')}>
                      <div className="thread-av" style={{background: 'rgba(0,245,255,.08)', borderColor: 'rgba(0,245,255,.2)'}}>
                        <div className="thread-av-init">M</div>
                      </div>
                      <div className="thread-body">
                        <div className="thread-name">MentorBridge Support</div>
                        <div className="thread-preview">Your APS appointment is booked…</div>
                        <div className="thread-enc-badge">🔐 AES-256</div>
                      </div>
                      <div><div className="thread-time">3d</div></div>
                    </div>
                  </div>
                </div>

                {/* Chat area */}
                <div className="chat-area">
                  <div className="chat-top">
                    <div className="chat-av"><img src={`https://randomuser.me/api/portraits/${activeThread.imgPath}.jpg`} alt="" /></div>
                    <div className="chat-info">
                      <div className="chat-name">{activeThread.name}</div>
                      <div className="chat-status"><div className="s-dot"></div> Online · {activeThread.desc}</div>
                    </div>
                    <div className="chat-actions">
                      <div className="chat-btn" title="Voice">🎙</div>
                      <div className="chat-btn" onClick={() => addToast('🚀', 'Launching Meet: meet.jit.si/MentorBridge-aarav-01')} title="Launch Meet">🚀</div>
                      <div className="chat-btn" title="View Profile">👤</div>
                      <div className="chat-btn" onClick={() => addToast('🔐', 'Encryption details: AES-256-GCM · Key exchange: ECDH P-256')} title="Encryption Info">🔐</div>
                    </div>
                  </div>
                  <div className="enc-bar">
                    <div className="s-dot"></div>
                    Messages encrypted with AES-256-GCM · Key exchange via ECDH · Perfect Forward Secrecy enabled · Zero-knowledge storage
                  </div>
                  <div className="chat-msgs" ref={chatMsgsRef}>
                    {chatMsgs.map((msg) => (
                      <div key={msg.id} className={`msg ${msg.recv ? 'recv' : 'sent'}`}>
                        {msg.recv && (
                          <div className="msg-av"><img src={`https://randomuser.me/api/portraits/${msg.imgPath}.jpg`} alt="" /></div>
                        )}
                        <div className="msg-bubble">{msg.text}</div>
                        <div className="msg-time">{msg.time}</div>
                      </div>
                    ))}
                  </div>
                  <div className="chat-input-area">
                    <textarea 
                      className="chat-input" 
                      placeholder="Send encrypted message…" 
                      rows={1} 
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyDown={handleChatKey}
                    ></textarea>
                    <button className="chat-send" onClick={handleSendMsg}>↑</button>
                  </div>
                </div>
              </div>
            </div>

            {/* ════════════════════════════════════
                  DOCUMENT VAULT SECTION
            ════════════════════════════════════ */}
            <div className={`section ${activeSection === 'docs' ? 'active' : ''}`}>
              <div className="page-header">
                <div className="ph-left">
                  <div className="ph-eyebrow">ENCRYPTED DOCUMENT VAULT</div>
                  <div className="ph-title">DOCUMENT VAULT</div>
                  <div className="ph-sub">Every document you need, organized by country. Track your progress, upload files, and never miss a critical document.</div>
                </div>
                <div className="ph-right">
                  <button className="btn btn-ghost btn-sm" onClick={() => addToast('📥', 'Checklist exported as PDF')}>↓ Export Checklist</button>
                  <button className="btn btn-primary btn-sm" onClick={() => addToast('📁', 'Upload dialog opening…')}>↑ Upload Documents</button>
                </div>
              </div>

              {/* Country Tabs */}
              <div className="doc-country-tabs">
                <div className={`doc-country-tab ${docCountry === 'de' ? 'active' : ''}`} onClick={() => setDocCountry('de')}><span className="doc-flag">🇩🇪</span>Germany</div>
                <div className={`doc-country-tab ${docCountry === 'us' ? 'active' : ''}`} onClick={() => setDocCountry('us')}><span className="doc-flag">🇺🇸</span>USA</div>
                <div className={`doc-country-tab ${docCountry === 'uk' ? 'active' : ''}`} onClick={() => setDocCountry('uk')}><span className="doc-flag">🇬🇧</span>UK</div>
                <div className={`doc-country-tab ${docCountry === 'ca' ? 'active' : ''}`} onClick={() => setDocCountry('ca')}><span className="doc-flag">🇨🇦</span>Canada</div>
                <div className={`doc-country-tab ${docCountry === 'au' ? 'active' : ''}`} onClick={() => setDocCountry('au')}><span className="doc-flag">🇦🇺</span>Australia</div>
                <div className={`doc-country-tab ${docCountry === 'ie' ? 'active' : ''}`} onClick={() => setDocCountry('ie')}><span className="doc-flag">🇮🇪</span>Ireland</div>
              </div>

              {/* Progress bar */}
              <div className="doc-progress-bar">
                <div className="doc-prog-info">
                  <div className="doc-prog-label">Overall Progress</div>
                  <div className="doc-prog-val">{totalDoneDocs} / {totalDocs} Complete</div>
                </div>
                <div className="doc-prog-track">
                  <div className="doc-prog-fill" style={{ width: `${overallPct}%` }}></div>
                </div>
                <div className="doc-prog-pct">{overallPct}%</div>
              </div>

              {/* Doc Categories */}
              <div className="doc-content">
                {DOC_DATA[docCountry] && (
                  <>
                    <div className="doc-tip-box">
                      <span className="doc-tip-ico">💡</span>
                      <span className="doc-tip-text">{DOC_DATA[docCountry].tip}</span>
                    </div>
                    {DOC_DATA[docCountry].categories.map((cat, ci) => {
                      let catDone = 0;
                      const items = cat.docs.map((doc, di) => {
                        const key = `${docCountry}_${ci}_${di}`;
                        const st = docStatus[key] || doc.status;
                        if (st === 'done') catDone++;
                        
                        const chkCls = st === 'done' ? 'done' : st === 'partial' ? 'partial' : 'empty';
                        const chkIco = st === 'done' ? '✓' : st === 'partial' ? '◐' : '';
                        const priBadge = doc.priority === 'critical' ? 'dp-critical' : doc.priority === 'required' ? 'dp-required' : 'dp-optional';
                        const priLabel = doc.priority === 'critical' ? 'CRITICAL' : doc.priority === 'required' ? 'REQUIRED' : 'OPTIONAL';
                        const barColor = st === 'done' ? 'var(--teal)' : st === 'partial' ? 'var(--amber)' : 'rgba(251,77,109,.4)';
                        
                        return (
                          <div key={di} className="doc-item">
                            <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '2.5px', background: barColor, borderRadius: 0 }}></div>
                            <div className={`doc-check ${chkCls}`} onClick={() => toggleDoc(key, st)}>{chkIco}</div>
                            <div className="doc-info">
                              <div className="doc-name">{doc.name}</div>
                              <div className="doc-desc">{doc.desc}</div>
                            </div>
                            <div className="doc-right">
                              <span className={`doc-priority ${st === 'done' ? 'dp-done' : priBadge}`}>{st === 'done' ? '✓ DONE' : priLabel}</span>
                              <span className="doc-upload" onClick={() => addToast('📁', `Upload dialog: ${doc.name.replace(/'/g, '')}`)}>↑ Upload</span>
                            </div>
                          </div>
                        );
                      });
                      
                      const catPct = cat.docs.length > 0 ? Math.round((catDone / cat.docs.length) * 100) : 0;
                      const catId = `${docCountry}_${ci}`;
                      const expanded = expandedCats[catId] !== false; // Default to true if undefined, but logic usually requires explicit. Let's say default true for index 0 elsewhere, but here we can just use the state. Actually, let's default to expanded if it's the first one and state is undefined.
                      const isExpanded = expandedCats.hasOwnProperty(catId) ? expandedCats[catId] : ci === 0;

                      return (
                        <div key={ci} className="doc-category">
                          <div className={`doc-cat-head ${isExpanded ? 'expanded' : ''}`} onClick={() => toggleCat(catId)}>
                            <span className="doc-cat-ico">{cat.name.split(' ')[0]}</span>
                            <span className="doc-cat-name">{cat.name.split(' ').slice(1).join(' ')}</span>
                            <span className="doc-cat-meta">{catDone}/{cat.docs.length} complete</span>
                            <div className="doc-cat-prog">
                              <div className="doc-cat-prog-fill" style={{ width: `${catPct}%`, background: cat.color }}></div>
                            </div>
                            <span className="doc-cat-chevron">{isExpanded ? '▼' : '▶'}</span>
                          </div>
                          <div className="doc-items" style={{ display: isExpanded ? 'flex' : 'none', flexDirection: 'column', gap: '7px' }}>
                            {items}
                          </div>
                        </div>
                      );
                    })}
                  </>
                )}
              </div>

            </div>

          </div>
        </main>
      </div>
    </div>
  );
}