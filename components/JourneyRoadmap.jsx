"use client";

import React from 'react';
import { CheckCircle2, Circle, Clock } from "lucide-react";

const STEPS = [
  { id: "01", name: "Profile Evaluation", status: "complete", date: "Oct 12" },
  { id: "02", name: "University Shortlist", status: "current", date: "In Progress" },
  { id: "03", name: "SOP & LOR Drafts", status: "locked", date: "Nov 20" },
  { id: "04", name: "Application Submission", status: "locked", date: "Dec 15" },
  { id: "05", name: "Visa Interview", status: "locked", date: "Feb 2026" },
];

export default function JourneyRoadmap() {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl -mr-20 -mt-20"></div>

      <div className="flex justify-between items-center mb-10">
        <h3 className="text-white font-black text-xl uppercase tracking-tight">Mission Roadmap</h3>
        <div className="px-4 py-1.5 bg-slate-800 rounded-full border border-slate-700 text-xs text-slate-400 font-mono uppercase">
          Intake: <span className="text-white font-bold">Winter 2026</span>
        </div>
      </div>

      <div className="relative">
        {/* Progress Line */}
        <div className="absolute top-5 left-0 w-full h-1 bg-slate-800 rounded-full"></div>
        <div className="absolute top-5 left-0 w-[25%] h-1 bg-cyan-500 rounded-full shadow-[0_0_15px_rgba(6,182,212,0.6)]"></div>

        <div className="grid grid-cols-5 gap-4 relative z-10">
          {STEPS.map((step) => (
            <div key={step.id} className="flex flex-col items-center group">
              {/* Icon Logic */}
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 transition-all duration-300 ${
                step.status === 'complete' ? 'bg-cyan-500 border-cyan-900 text-black' : 
                step.status === 'current' ? 'bg-slate-950 border-cyan-500 text-cyan-400 scale-125 shadow-[0_0_20px_rgba(6,182,212,0.3)]' : 
                'bg-slate-950 border-slate-800 text-slate-600'
              }`}>
                {step.status === 'complete' ? <CheckCircle2 size={20} /> : 
                 step.status === 'current' ? <Clock size={20} className="animate-spin-slow" /> : 
                 <Circle size={20} />}
              </div>

              {/* Text Labels */}
              <div className="mt-6 text-center">
                <div className={`text-[10px] font-black uppercase tracking-widest mb-1 ${step.status === 'current' ? 'text-white' : 'text-slate-500'}`}>
                  Phase {step.id}
                </div>
                <div className={`text-xs font-bold leading-tight max-w-[100px] mx-auto ${step.status === 'current' ? 'text-cyan-400' : 'text-slate-300'}`}>
                  {step.name}
                </div>
                <div className="mt-2 text-[9px] font-mono text-slate-600 bg-slate-950 px-2 py-0.5 rounded border border-slate-800 inline-block">
                  {step.date}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}