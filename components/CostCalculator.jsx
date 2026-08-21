"use client";

import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Wallet, Landmark, TrendingDown, AlertTriangle, Home, Utensils, Stethoscope, Bus } from "lucide-react";

// --- MOCK DATA FOR DEMO ---
const COUNTRY_DATA = {
  Germany: { 
    currency: "€",
    costs: [
      { name: 'Rent & Utilities', value: 450, color: '#6366f1', icon: Home }, // Indigo
      { name: 'Food & Groceries', value: 200, color: '#10b981', icon: Utensils }, // Emerald
      { name: 'Health Insurance', value: 110, color: '#f59e0b', icon: Stethoscope }, // Amber
      { name: 'Transport & Misc', value: 174, color: '#06b6d4', icon: Bus }, // Cyan
    ]
  },
  USA: { 
    currency: "$",
    costs: [
      { name: 'Rent & Utilities', value: 1200, color: '#6366f1', icon: Home },
      { name: 'Food & Groceries', value: 400, color: '#10b981', icon: Utensils },
      { name: 'Health Insurance', value: 300, color: '#f59e0b', icon: Stethoscope },
      { name: 'Transport & Misc', value: 250, color: '#06b6d4', icon: Bus },
    ]
  },
  UK: { 
    currency: "£",
    costs: [
      { name: 'Rent & Utilities', value: 800, color: '#6366f1', icon: Home },
      { name: 'Food & Groceries', value: 300, color: '#10b981', icon: Utensils },
      { name: 'Health Insurance', value: 150, color: '#f59e0b', icon: Stethoscope },
      { name: 'Transport & Misc', value: 200, color: '#06b6d4', icon: Bus },
    ]
  },
};

export default function CostCalculator() {
  const [country, setCountry] = useState("Germany");
  const [monthlyBudget, setMonthlyBudget] = useState(800); // User's estimated budget

  const data = COUNTRY_DATA[country];
  const totalCost = data.costs.reduce((acc, item) => acc + item.value, 0);
  const netCashflow = monthlyBudget - totalCost;

  // Custom Tooltip for the chart
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl shadow-xl">
          <p className="text-xs font-bold text-slate-400 mb-1">{payload[0].name}</p>
          <p className="text-lg font-black text-white font-mono">{data.currency}{payload[0].value}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full space-y-8">
      
      {/* --- 1. BOLD HEADER --- */}
      <div className="text-center space-y-4 mb-12">
        <h1 className="text-5xl font-black text-white tracking-tight uppercase">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-500">FINANCIAL</span> STRATEGIZER
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto text-lg">
          Don't just guess. Get a data-driven estimate of your monthly burn rate abroad.
        </p>
      </div>

      {/* --- MAIN HUD GRID --- */}
      <div className="grid lg:grid-cols-12 gap-8">
        
        {/* LEFT: CONTROLS & SUMMARY (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Country Selector */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
             <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 block flex items-center gap-2">
               <Landmark size={14} className="text-cyan-500" /> Target Destination
             </label>
             <div className="flex gap-2">
                {Object.keys(COUNTRY_DATA).map((c) => (
                  <button 
                    key={c}
                    onClick={() => setCountry(c)}
                    className={`flex-1 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${country === c ? 'bg-cyan-500 text-black shadow-[0_0_15px_rgba(6,182,212,0.4)]' : 'bg-slate-950 text-slate-400 border border-slate-800 hover:border-slate-600'}`}
                  >
                    {c}
                  </button>
                ))}
             </div>
          </div>

          {/* Total Cost Summary Card */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-10 text-6xl">💸</div>
             <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Estimated Monthly Cost</h3>
             <div className="text-4xl font-black text-white font-mono flex items-start">
                <span className="text-2xl mt-1 text-slate-500 mr-1">{data.currency}</span>
                {totalCost}
             </div>
             <p className="text-xs text-slate-400 mt-2 italic">Based on average student lifestyle in {country}.</p>
          </div>

        </div>

        {/* RIGHT: CHART & BREAKDOWN (8 Cols) */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden flex flex-col md:flex-row gap-8 items-center">
           
           {/* The Pie Chart */}
           <div className="w-full md:w-1/2 h-[250px] relative">
              {/* Center Text */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center z-0">
                 <div className="text-xs font-bold text-slate-500 uppercase">Total</div>
                 <div className="text-2xl font-black text-white font-mono">{data.currency}{totalCost}</div>
              </div>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie 
                    data={data.costs} 
                    innerRadius={70} 
                    outerRadius={90} 
                    paddingAngle={4} 
                    dataKey="value"
                    stroke="none"
                    cornerRadius={4}
                  >
                    {data.costs.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} style={{ filter: `drop-shadow(0 0 8px ${entry.color}40)` }} />)}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} cursor={false} />
                </PieChart>
              </ResponsiveContainer>
           </div>

           {/* The Breakdown List */}
           <div className="w-full md:w-1/2 space-y-4">
              <h3 className="text-xs font-black text-white uppercase tracking-widest mb-4 flex items-center gap-2 pb-2 border-b border-slate-800">
                 <Wallet size={16} className="text-indigo-500" /> Cost Breakdown
              </h3>
              {data.costs.map((item, index) => {
                const Icon = item.icon;
                return (
                <div key={index} className="flex justify-between items-center p-3 bg-slate-950/50 rounded-xl border border-slate-800/50 group hover:border-slate-700 transition-colors">
                   <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${item.color}20`, color: item.color }}>
                         <Icon size={16} />
                      </div>
                      <span className="text-sm font-bold text-slate-300 group-hover:text-white transition-colors">{item.name}</span>
                   </div>
                   <span className="text-sm font-mono text-white font-bold">{data.currency}{item.value}</span>
                </div>
              )})}
           </div>

        </div>

      </div>

      {/* --- 3. NET CASHFLOW INSIGHT (The "Pro" Feature) --- */}
      <div className={`rounded-2xl p-6 border ${netCashflow >= 0 ? 'bg-emerald-900/10 border-emerald-500/20' : 'bg-red-900/10 border-red-500/20'} flex flex-col md:flex-row items-center justify-between gap-6 transition-all duration-500`}>
         <div className="flex-1">
            <h3 className={`text-sm font-black uppercase tracking-widest mb-2 flex items-center gap-2 ${netCashflow >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
               {netCashflow >= 0 ? <TrendingDown size={18} className="rotate-180" /> : <AlertTriangle size={18} />}
               Net Monthly Cashflow Insight
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed max-w-xl">
               {netCashflow >= 0 
                 ? `Great! Your estimated budget covers all costs with a surplus. Consider saving the extra ${data.currency}${netCashflow} for emergencies.`
                 : `Warning: Your estimated costs exceed your budget by ${data.currency}${Math.abs(netCashflow)}. You may need a part-time job or a scholarship to bridge this gap.`
               }
            </p>
         </div>
         
         {/* Budget Slider Control */}
         <div className="w-full md:w-64 bg-slate-900 p-4 rounded-xl border border-slate-800">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block flex justify-between">
               <span>Your Monthly Budget</span>
               <span className="text-white font-mono">{data.currency}{monthlyBudget}</span>
            </label>
            <input 
               type="range" min="500" max="2000" step="50" 
               value={monthlyBudget} 
               onChange={(e) => setMonthlyBudget(Number(e.target.value))}
               className={`w-full h-2 rounded-lg appearance-none cursor-pointer ${netCashflow >= 0 ? 'accent-emerald-500 bg-emerald-900/30' : 'accent-red-500 bg-red-900/30'}`}
            />
         </div>
      </div>

    </div>
  );
}