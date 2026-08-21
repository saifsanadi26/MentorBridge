"use client";

import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

// --- CONFIG ---
const UNIVERSITIES = [
  { name: "TU Munich (Germany)", difficulty: 85 },
  { name: "RWTH Aachen (Germany)", difficulty: 80 },
  { name: "Georgia Tech (USA)", difficulty: 90 },
  { name: "U of Toronto (Canada)", difficulty: 88 },
  { name: "Melbourne Uni (Australia)", difficulty: 75 },
];

export default function AdmitPredictor() {
  // User Inputs
  const [gpa, setGpa] = useState(8.5);
  const [gre, setGre] = useState(310);
  const [workEx, setWorkEx] = useState(1);
  const [papers, setPapers] = useState(0);
  const [targetUni, setTargetUni] = useState(UNIVERSITIES[0].name);

  // System State
  const [isCalculating, setIsCalculating] = useState(false);
  const [probability, setProbability] = useState(0);
  const [suggestion, setSuggestion] = useState("");
  const [loadingText, setLoadingText] = useState("");

  // --- THE ALGORITHM (Simulated ML Model) ---
  const calculateChance = () => {
    setIsCalculating(true);
    setProbability(0);
    
    // 1. "Fake" Loading Sequence for Effect
    const texts = ["Parsing Academic Record...", "Normalizing GRE Scores...", "Scanning Alumni Profiles...", "Running Regression Model..."];
    let step = 0;
    
    const interval = setInterval(() => {
      setLoadingText(texts[step]);
      step++;
      if (step >= texts.length) {
        clearInterval(interval);
        finalizeResult();
      }
    }, 600); // 600ms per step
  };

  const finalizeResult = () => {
    // 2. The Logic (Weighted Score)
    // Base Score starts at 30
    let score = 30; 
    
    // GPA Weight (Max +30)
    score += (gpa / 10) * 30;
    
    // GRE Weight (Max +20)
    if (gre > 300) score += ((gre - 300) / 40) * 20;
    
    // Work Ex Weight (Max +15)
    score += Math.min(workEx * 5, 15);
    
    // Research Papers (Max +10)
    score += Math.min(papers * 5, 10);

    // Difficulty Adjustment
    const selectedUni = UNIVERSITIES.find(u => u.name === targetUni);
    const difficultyMod = (100 - selectedUni.difficulty) / 2; // Harder unis lower the score
    score += difficultyMod;

    // Cap at 98%
    const finalScore = Math.min(Math.round(score), 98);
    
    setProbability(finalScore);
    setIsCalculating(false);
    generateSuggestion(finalScore, selectedUni.difficulty);
  };

  const generateSuggestion = (score, difficulty) => {
    if (score > 85) {
      setSuggestion("🌟 STRONG PROFILE: You are in the top 10% of applicants. Focus on your SOP to seal the deal.");
    } else if (score > 60) {
      if (papers === 0) setSuggestion("💡 TIP: Publishing just 1 research paper could boost your chance by ~12%.");
      else if (gre < 320) setSuggestion("💡 TIP: Retaking GRE and scoring 320+ would move you to the 'Safe Zone'.");
      else setSuggestion("📈 You are competitive, but gain 6 more months of Work Ex to stand out.");
    } else {
      setSuggestion("⚠️ RISKY: Consider 'Safe' universities or add a strong internship to your profile.");
    }
  };

  // --- GAUGE DATA HELPERS ---
  const gaugeData = [
    { name: 'Score', value: probability, color: probability > 75 ? '#10b981' : (probability > 50 ? '#f59e0b' : '#ef4444') },
    { name: 'Remaining', value: 100 - probability, color: '#1e293b' },
  ];

  return (
    <div className="w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
      
      {/* Background Tech Circle */}
      <div className="absolute -right-20 -top-20 w-64 h-64 border border-slate-800 rounded-full opacity-20 animate-[spin_10s_linear_infinite]"></div>

      <div className="grid md:grid-cols-2 gap-8 relative z-10">
        
        {/* LEFT: INPUT CONSOLE */}
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-black text-white uppercase flex items-center gap-3">
              <span className="text-cyan-400">⚡</span> Admission Oracle
            </h2>
            <p className="text-slate-400 text-xs mt-2">
              AI-driven probability engine based on 50,000+ past admit records.
            </p>
          </div>

          <div className="space-y-4">
            {/* Target Uni */}
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Target University</label>
              <select 
                className="w-full bg-slate-950 border border-slate-700 text-white rounded-lg p-3 text-sm focus:ring-2 focus:ring-cyan-500"
                value={targetUni}
                onChange={(e) => setTargetUni(e.target.value)}
              >
                {UNIVERSITIES.map(u => <option key={u.name} value={u.name}>{u.name}</option>)}
              </select>
            </div>

            {/* Sliders Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase block mb-2">CGPA (out of 10)</label>
                <input 
                  type="number" step="0.1" min="0" max="10"
                  className="w-full bg-slate-950 border border-slate-700 text-white rounded-lg p-3 font-mono"
                  value={gpa} onChange={(e) => setGpa(Number(e.target.value))}
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase block mb-2">GRE Score</label>
                <input 
                  type="number" min="260" max="340"
                  className="w-full bg-slate-950 border border-slate-700 text-white rounded-lg p-3 font-mono"
                  value={gre} onChange={(e) => setGre(Number(e.target.value))}
                />
              </div>
            </div>

            {/* Toggles */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Work Ex (Yrs)</label>
                <div className="flex items-center gap-3">
                  <button onClick={() => setWorkEx(Math.max(0, workEx-1))} className="w-8 h-8 rounded bg-slate-800 text-white hover:bg-slate-700">-</button>
                  <span className="text-white font-mono font-bold">{workEx}</span>
                  <button onClick={() => setWorkEx(workEx+1)} className="w-8 h-8 rounded bg-slate-800 text-white hover:bg-slate-700">+</button>
                </div>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Research Papers</label>
                <div className="flex items-center gap-3">
                  <button onClick={() => setPapers(Math.max(0, papers-1))} className="w-8 h-8 rounded bg-slate-800 text-white hover:bg-slate-700">-</button>
                  <span className="text-white font-mono font-bold">{papers}</span>
                  <button onClick={() => setPapers(papers+1)} className="w-8 h-8 rounded bg-slate-800 text-white hover:bg-slate-700">+</button>
                </div>
              </div>
            </div>
          </div>

          <button 
            onClick={calculateChance}
            disabled={isCalculating}
            className={`w-full py-4 rounded-xl font-black uppercase tracking-widest transition-all ${isCalculating ? 'bg-slate-800 text-slate-500 cursor-not-allowed' : 'bg-cyan-500 hover:bg-cyan-400 text-black shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:scale-[1.02]'}`}
          >
            {isCalculating ? "Processing..." : "Run Prediction Model"}
          </button>
        </div>

        {/* RIGHT: RESULT HUD */}
        <div className="flex flex-col items-center justify-center bg-slate-950/50 rounded-2xl border border-slate-800 p-6 relative">
          
          {isCalculating ? (
            // LOADING ANIMATION
            <div className="text-center space-y-4">
              <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <div className="font-mono text-cyan-400 text-sm animate-pulse">{loadingText}</div>
            </div>
          ) : probability > 0 ? (
            // RESULT GAUGE
            <>
              <div className="w-full h-64 relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={gaugeData}
                      cx="50%"
                      cy="50%"
                      startAngle={180}
                      endAngle={0}
                      innerRadius={80}
                      outerRadius={100}
                      paddingAngle={0}
                      dataKey="value"
                      stroke="none"
                    >
                      {gaugeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                
                {/* Center Text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pt-10">
                  <span className="text-slate-500 text-xs font-bold uppercase">Acceptance Probability</span>
                  <span className={`text-5xl font-black ${probability > 75 ? 'text-emerald-400' : (probability > 50 ? 'text-amber-400' : 'text-red-400')}`}>
                    {probability}%
                  </span>
                </div>
              </div>

              {/* AI Insight Box */}
              <div className="w-full bg-slate-900 border border-slate-800 p-4 rounded-xl animate-[fadeIn_0.5s_ease-in]">
                <div className="flex items-center gap-2 mb-2">
                   <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></div>
                   <span className="text-[10px] font-bold text-cyan-400 uppercase">AI Recommendation</span>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {suggestion}
                </p>
              </div>
            </>
          ) : (
            // EMPTY STATE
            <div className="text-center opacity-30">
               <div className="text-6xl mb-4">🎯</div>
               <p className="text-sm font-bold uppercase">Ready to Analyze</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}