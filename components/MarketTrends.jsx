"use client";

import { useState } from "react";
import SmartRadar from "./SmartRadar"; // ⚠️ Make sure components/SmartRadar.jsx exists!
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Defs, LinearGradient, Stop 
} from "recharts";

// --- 1. DATA: HARDCODED FOR STABILITY ---
// We define this here so the component works instantly without needing external files.
const MARKET_DATA = {
  "Product Manager": {
    Germany: { currency: "€", range: [45000, 95000], avgSalary: 68000, skills: ["Jira", "Strategy", "Agile"] },
    USA: { currency: "$", range: [80000, 180000], avgSalary: 125000, skills: ["Roadmapping", "A/B Testing", "SQL"] },
    UK: { currency: "£", range: [35000, 85000], avgSalary: 55000, skills: ["Leadership", "Scrum", "Communication"] },
    Canada: { currency: "C$", range: [60000, 130000], avgSalary: 90000, skills: ["Stakeholder Mgmt", "Jira", "Tech"] },
    Australia: { currency: "A$", range: [70000, 150000], avgSalary: 110000, skills: ["User Research", "Agile", "UX"] },
    Ireland: { currency: "€", range: [40000, 90000], avgSalary: 65000, skills: ["Product Ops", "Data", "Scrum"] },
  },
  "Data Scientist": {
    Germany: { currency: "€", range: [50000, 100000], avgSalary: 72000, skills: ["Python", "Pandas", "Machine Learning"] },
    USA: { currency: "$", range: [95000, 200000], avgSalary: 140000, skills: ["TensorFlow", "PyTorch", "Big Data"] },
    UK: { currency: "£", range: [40000, 95000], avgSalary: 60000, skills: ["R", "SQL", "Tableau"] },
    Canada: { currency: "C$", range: [70000, 140000], avgSalary: 95000, skills: ["Python", "Spark", "AWS"] },
    Australia: { currency: "A$", range: [80000, 160000], avgSalary: 115000, skills: ["Azure", "Python", "Deep Learning"] },
    Ireland: { currency: "€", range: [45000, 95000], avgSalary: 70000, skills: ["SQL", "Python", "Stats"] },
  },
  "Software Engineer": {
    Germany: { currency: "€", range: [48000, 98000], avgSalary: 70000, skills: ["Java", "Spring", "AWS"] },
    USA: { currency: "$", range: [90000, 190000], avgSalary: 130000, skills: ["React", "Node.js", "System Design"] },
    UK: { currency: "£", range: [38000, 90000], avgSalary: 58000, skills: ["TypeScript", "C#", ".NET"] },
    Canada: { currency: "C$", range: [65000, 135000], avgSalary: 92000, skills: ["Full Stack", "Python", "Cloud"] },
    Australia: { currency: "A$", range: [75000, 155000], avgSalary: 112000, skills: ["Go", "React", "Docker"] },
    Ireland: { currency: "€", range: [42000, 92000], avgSalary: 68000, skills: ["Java", "Kotlin", "AWS"] },
  }
};

const HIRING_COMPANIES = {
  Germany: ["BMW", "Zalando", "SAP", "Siemens", "Allianz"],
  USA: ["Google", "Amazon", "Tesla", "JP Morgan", "Meta"],
  UK: ["Revolut", "Barclays", "DeepMind", "HSBC", "Deliveroo"],
  Canada: ["Shopify", "RBC", "OpenText", "Bombardier", "TD Bank"],
  Australia: ["Canva", "Atlassian", "Telstra", "CommBank", "Xero"],
  Ireland: ["Stripe", "Ryanair", "Accenture", "Pfizer", "Google Dub"]
};

const GROWTH_DATA = [
  { year: '2022', demand: 40 },
  { year: '2023', demand: 55 },
  { year: '2024', demand: 68 },
  { year: '2025', demand: 82 },
  { year: '2026', demand: 95 },
  { year: '2027', demand: 110 },
];

// --- 2. COMPONENT ---
export default function MarketTrends() {
  const roles = Object.keys(MARKET_DATA);
  const [role, setRole] = useState(roles[0]);
  
  const allCountries = ["Germany", "USA", "UK", "Canada", "Australia", "Ireland"];
  const [country, setCountry] = useState("Germany");

  // Get data (Safe access)
  const roleData = MARKET_DATA[role] || MARKET_DATA["Product Manager"];
  const data = roleData[country] || roleData["Germany"];
  const activeCompanies = HIRING_COMPANIES[country] || HIRING_COMPANIES["Germany"];

  return (
    <div className="space-y-6 text-slate-300">
      
      {/* HEADER CONTROLS */}
      <div className="bg-slate-900/60 backdrop-blur-md border border-slate-700 p-4 rounded-2xl flex flex-wrap gap-4 items-center justify-between sticky top-2 z-20 shadow-2xl">
        <div className="flex gap-4">
            <select 
              value={role} onChange={(e) => setRole(e.target.value)} 
              className="bg-slate-950 border border-slate-700 text-white text-sm rounded-lg p-2.5 focus:ring-cyan-500"
            >
              {roles.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
            
            <select 
              value={country} onChange={(e) => setCountry(e.target.value)} 
              className="bg-slate-950 border border-slate-700 text-white text-sm rounded-lg p-2.5 focus:ring-cyan-500"
            >
              {allCountries.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
        </div>
        <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
            <span className="text-xs font-mono text-cyan-400">LIVE FEED</span>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        
        {/* RADAR CHART */}
        <div className="bg-slate-900 p-1 rounded-3xl border border-slate-800 shadow-xl group">
          <div className="p-6">
            <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              <span className="text-2xl">🛡️</span> {country} Matrix
            </h3>
            <p className="text-xs text-slate-400 mb-4">Living standards & Opportunity score.</p>
            <SmartRadar country={country} />
          </div>
        </div>

        {/* CAREER NODES */}
        <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-xl flex flex-col">
            <div>
              <h3 className="text-lg font-bold text-white mb-2">🚀 Career Path</h3>
              <p className="text-xs text-slate-400">Progression for {role} in {country}.</p>
            </div>
            
            <div className="relative py-8 flex-1">
               <div className="absolute left-6 top-4 bottom-4 w-0.5 bg-slate-700"></div>
               <div className="space-y-6 relative">
                  <div className="flex items-center gap-4 group">
                     <div className="w-10 h-10 rounded-full bg-slate-800 border-2 border-slate-600 flex items-center justify-center text-lg z-10 group-hover:border-cyan-400 transition-all">🎓</div>
                     <div>
                        <div className="text-sm font-bold text-white">Entry</div>
                        <div className="text-xs text-cyan-400">{data.currency}{data.range[0].toLocaleString()}</div>
                     </div>
                  </div>
                   <div className="flex items-center gap-4 group">
                     <div className="w-10 h-10 rounded-full bg-slate-800 border-2 border-slate-600 flex items-center justify-center text-lg z-10 group-hover:border-indigo-400 transition-all">💼</div>
                     <div>
                        <div className="text-sm font-bold text-white">Mid-Level</div>
                        <div className="text-xs text-indigo-400">{data.currency}{data.avgSalary.toLocaleString()}</div>
                     </div>
                  </div>
                   <div className="flex items-center gap-4 group">
                     <div className="w-10 h-10 rounded-full bg-slate-800 border-2 border-slate-600 flex items-center justify-center text-lg z-10 group-hover:border-emerald-400 transition-all">👑</div>
                     <div>
                        <div className="text-sm font-bold text-white">Senior</div>
                        <div className="text-xs text-emerald-400">{data.currency}{data.range[1].toLocaleString()}</div>
                     </div>
                  </div>
               </div>
            </div>
        </div>
      </div>

      {/* GRAPH & COMPANIES */}
      <div className="grid md:grid-cols-3 gap-6">
        
        {/* FUTURE DEMAND GRAPH */}
        <div className="md:col-span-2 bg-slate-900 p-6 rounded-2xl border border-slate-800 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
             <h3 className="text-sm font-bold text-slate-400 uppercase mb-4">5-Year Demand Forecast</h3>
             
             <div className="h-40 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={GROWTH_DATA}>
                    <defs>
                      <linearGradient id="colorDemand" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.3} />
                    <XAxis dataKey="year" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis hide />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155' }}
                      itemStyle={{ color: '#818cf8' }}
                    />
                    <Area type="monotone" dataKey="demand" stroke="#6366f1" strokeWidth={3} fill="url(#colorDemand)" />
                  </AreaChart>
                </ResponsiveContainer>
             </div>
        </div>

        {/* TOP COMPANIES */}
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
            <h3 className="text-xs font-bold text-slate-500 uppercase mb-4">Top Employers</h3>
            <div className="flex flex-col gap-2">
              {activeCompanies.slice(0, 4).map((company, i) => (
                <div key={i} className="flex items-center gap-3 p-2 rounded hover:bg-slate-800 transition-colors cursor-pointer">
                  <div className="w-6 h-6 rounded bg-slate-700 flex items-center justify-center text-[10px] font-bold text-white">
                    {company[0]}
                  </div>
                  <span className="text-slate-300 text-sm">{company}</span>
                </div>
              ))}
            </div>
        </div>
      </div>
    </div>
  );
}