"use client";

import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

// --- DATA SCIENCE: PPP & TAX INDICES (The "Brain" of the tool) ---
// Multipliers relative to Germany (Base 1.0)
// Example: Living in NYC costs 1.6x more than Berlin.
const INDICES = {
  Germany: { flag: "🇩🇪", ppp: 1.0, tax: 0.42, currency: "€", name: "Germany" },
  USA: { flag: "🇺🇸", ppp: 1.55, tax: 0.30, currency: "$", name: "USA (Major City)" },
  India: { flag: "🇮🇳", ppp: 0.35, tax: 0.20, currency: "₹", name: "India (Bangalore)" },
  UK: { flag: "🇬🇧", ppp: 1.15, tax: 0.35, currency: "£", name: "UK (London)" },
  Canada: { flag: "🇨🇦", ppp: 1.10, tax: 0.33, currency: "C$", name: "Canada" },
};

export default function SurvivalEngine() {
  // Input State
  const [baseSalary, setBaseSalary] = useState(60000);
  const [baseCountry, setBaseCountry] = useState("Germany");

  // --- THE ALGORITHM ---
  const calculateEquivalent = (targetCountry) => {
    const base = INDICES[baseCountry];
    const target = INDICES[targetCountry];

    // 1. Convert to "Global Base Units" (Normalize)
    const normalizedValue = baseSalary / base.ppp;

    // 2. Convert to Target PPP (Localize)
    let localSalary = normalizedValue * target.ppp;

    // 3. Currency Exchange Adjustments (Mock rates for simplicity)
    const exchangeRates = {
        "€": 1, "$": 1.1, "£": 0.85, "C$": 1.5, "₹": 90
    };
    
    // Convert currency purely for display
    // Note: In a real app, you'd separate PPP math from FX math. 
    // Here we simulate the "Required Offer" to match lifestyle.
    if (base.currency !== target.currency) {
        // Simple logic: If moving from Low Cost (India) to High Cost (USA), 
        // the PPP factor handles the massive jump.
    }

    return Math.round(localSalary);
  };

  const chartData = Object.keys(INDICES).map(country => {
    const rawVal = calculateEquivalent(country);
    return {
      name: country,
      value: rawVal,
      currency: INDICES[country].currency,
      flag: INDICES[country].flag,
      isBase: country === baseCountry
    };
  });

  return (
    <div className="w-full">
      
      {/* --- HEADER --- */}
      <div className="text-center space-y-4 mb-12">
        <h1 className="text-5xl font-black text-white tracking-tight uppercase">
          <span className="text-indigo-500">LIFESTYLE</span> EQUALIZER
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto text-lg">
          Don't just convert currency. Normalize for Purchasing Power to find the true value of an offer.
        </p>
      </div>

      {/* --- MAIN INTERFACE --- */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        
        <div className="grid lg:grid-cols-12 gap-8">
          
          {/* LEFT: INPUTS (3 Cols) */}
          <div className="lg:col-span-4 space-y-8">
             <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800">
                <label className="text-xs font-bold text-slate-500 uppercase mb-3 block">I have an offer in...</label>
                
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {Object.keys(INDICES).map(c => (
                    <button 
                      key={c}
                      onClick={() => setBaseCountry(c)}
                      className={`p-2 rounded-lg text-sm font-bold border transition-all ${baseCountry === c ? 'bg-indigo-600 text-white border-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.4)]' : 'bg-slate-900 text-slate-400 border-slate-700 hover:border-slate-500'}`}
                    >
                      {INDICES[c].flag} {c}
                    </button>
                  ))}
                </div>

                <label className="text-xs font-bold text-slate-500 uppercase mb-3 block">Offer Amount ({INDICES[baseCountry].currency})</label>
                <div className="relative">
                   <input 
                     type="number" 
                     value={baseSalary}
                     onChange={(e) => setBaseSalary(Number(e.target.value))}
                     className="w-full bg-slate-900 border border-slate-700 text-white text-2xl font-black p-4 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-mono"
                   />
                </div>
             </div>

             <div className="bg-indigo-900/10 border border-indigo-500/20 p-6 rounded-2xl">
                <div className="flex items-start gap-3">
                   <div className="text-2xl">💡</div>
                   <div>
                     <h4 className="text-white font-bold text-sm mb-1">Data Science Insight</h4>
                     <p className="text-indigo-200 text-xs leading-relaxed">
                       This tool uses <strong>PPP (Purchasing Power Parity)</strong> indices. 
                       Currently, <span className="text-white font-bold">€1.00</span> in Germany buys the same amount of goods/services as <span className="text-white font-bold">${INDICES['USA'].ppp}</span> in a major US city.
                     </p>
                   </div>
                </div>
             </div>
          </div>

          {/* RIGHT: VISUALIZATION (9 Cols) */}
          <div className="lg:col-span-8 flex flex-col">
             <div className="mb-6 flex justify-between items-end">
                <h3 className="text-xl font-bold text-white">Equivalent Lifestyle Value</h3>
                <span className="text-xs text-slate-500 uppercase font-mono">Real-Time Calculation</span>
             </div>

             <div className="flex-1 bg-slate-950 rounded-2xl border border-slate-800 p-6 relative min-h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <XAxis type="number" hide />
                    <YAxis type="category" dataKey="name" hide />
                    <Tooltip 
                      cursor={{fill: 'transparent'}}
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-slate-900 border border-slate-700 p-3 rounded-xl shadow-xl">
                              <p className="text-slate-400 text-xs font-bold uppercase mb-1">{data.name}</p>
                              <p className="text-white font-mono font-bold text-lg">{data.currency}{data.value.toLocaleString()}</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar dataKey="value" barSize={40} radius={[0, 10, 10, 0]}>
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.isBase ? '#6366f1' : '#334155'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>

                {/* OVERLAY LABELS (Custom formatting for the bars) */}
                <div className="absolute inset-0 flex flex-col justify-between py-8 px-6 pointer-events-none">
                   {chartData.map((d, i) => (
                      <div key={i} className="flex items-center justify-between h-[40px] mb-[18px] last:mb-0">
                         <div className="flex items-center gap-3 w-40 z-10">
                            <span className="text-2xl">{d.flag}</span>
                            <span className={`text-sm font-bold ${d.isBase ? 'text-white' : 'text-slate-400'}`}>{d.name.split(' ')[0]}</span>
                         </div>
                         <div className="flex-1"></div>
                         <div className={`text-lg font-mono font-bold z-10 pl-4 ${d.isBase ? 'text-indigo-400' : 'text-slate-500'}`}>
                            {d.currency}{d.value.toLocaleString()}
                         </div>
                      </div>
                   ))}
                </div>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}