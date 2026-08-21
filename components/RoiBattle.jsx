"use client";

import React, { useState } from 'react';

const UNIVERSITIES = [
  { id: 1, name: 'TU Munich', country: 'Germany', flag: '🇩🇪', cost: 12000, salary: 65000, color: 'from-emerald-500 to-green-500' },
  { id: 2, name: 'Stanford', country: 'USA', flag: '🇺🇸', cost: 140000, salary: 160000, color: 'from-red-500 to-orange-500' },
  { id: 3, name: 'U of Toronto', country: 'Canada', flag: '🇨🇦', cost: 60000, salary: 85000, color: 'from-blue-500 to-indigo-500' },
  { id: 4, name: 'Imperial London', country: 'UK', flag: '🇬🇧', cost: 80000, salary: 95000, color: 'from-purple-500 to-pink-500' },
  { id: 5, name: 'Melbourne Uni', country: 'Australia', flag: '🇦🇺', cost: 70000, salary: 75000, color: 'from-yellow-500 to-amber-500' },
  { id: 6, name: 'RWTH Aachen', country: 'Germany', flag: '🇩🇪', cost: 10000, salary: 62000, color: 'from-emerald-600 to-teal-600' },
];

export default function RoiBattle() {
  const [leftId, setLeftId] = useState(1);
  const [rightId, setRightId] = useState(2);

  const left = UNIVERSITIES.find(u => u.id == leftId);
  const right = UNIVERSITIES.find(u => u.id == rightId);

  const getWinner = (val1, val2, type) => {
    if (val1 === val2) return 'draw';
    if (type === 'low') return val1 < val2 ? 'left' : 'right';
    return val1 > val2 ? 'left' : 'right';
  };

  const leftRoi = (left.salary / left.cost).toFixed(1);
  const rightRoi = (right.salary / right.cost).toFixed(1);
  const leftRepay = (left.cost / left.salary * 12).toFixed(1);
  const rightRepay = (right.cost / right.salary * 12).toFixed(1);

  return (
    <div className="w-full bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[150px] font-black text-slate-800/20 select-none z-0">VS</div>
      <div className="text-center p-6 border-b border-slate-800 relative z-10 bg-slate-900/80 backdrop-blur">
        <h2 className="text-2xl font-bold text-white uppercase tracking-widest">University Face-Off</h2>
        <p className="text-slate-400 text-xs">Compare ROI efficiency directly.</p>
      </div>

      <div className="grid grid-cols-2 relative z-10">
        {/* Left Fighter */}
        <div className={`p-6 border-r border-slate-800 bg-gradient-to-b ${left.color} bg-opacity-5 relative group`}>
          <div className="absolute inset-0 bg-slate-900/90 z-0"></div>
          <div className="relative z-10 flex flex-col items-center">
            <select value={leftId} onChange={(e) => setLeftId(e.target.value)} className="bg-slate-950 border border-slate-700 text-white text-sm rounded-lg p-2 mb-4 w-full">
              {UNIVERSITIES.map(u => <option key={u.id} value={u.id} disabled={u.id == rightId}>{u.flag} {u.name}</option>)}
            </select>
            <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${left.color} p-1 shadow-[0_0_30px_rgba(16,185,129,0.3)] mb-4`}>
              <div className="w-full h-full bg-slate-900 rounded-full flex items-center justify-center text-3xl">{left.flag}</div>
            </div>
            <h3 className="text-2xl font-black text-white text-center">{left.name}</h3>
          </div>
        </div>

        {/* Right Fighter */}
        <div className={`p-6 bg-gradient-to-b ${right.color} bg-opacity-5 relative`}>
          <div className="absolute inset-0 bg-slate-900/90 z-0"></div>
          <div className="relative z-10 flex flex-col items-center">
            <select value={rightId} onChange={(e) => setRightId(e.target.value)} className="bg-slate-950 border border-slate-700 text-white text-sm rounded-lg p-2 mb-4 w-full">
              {UNIVERSITIES.map(u => <option key={u.id} value={u.id} disabled={u.id == leftId}>{u.flag} {u.name}</option>)}
            </select>
            <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${right.color} p-1 shadow-[0_0_30px_rgba(239,68,68,0.3)] mb-4`}>
              <div className="w-full h-full bg-slate-900 rounded-full flex items-center justify-center text-3xl">{right.flag}</div>
            </div>
            <h3 className="text-2xl font-black text-white text-center">{right.name}</h3>
          </div>
        </div>
      </div>

      <div className="relative z-10 bg-slate-950/50">
        <BattleRow label="Total Cost" leftVal={left.cost} rightVal={right.cost} format={(v) => `$${v.toLocaleString()}`} winner={getWinner(left.cost, right.cost, 'low')} />
        <BattleRow label="Starting Salary" leftVal={left.salary} rightVal={right.salary} format={(v) => `$${v.toLocaleString()}`} winner={getWinner(left.salary, right.salary, 'high')} />
        <BattleRow label="ROI Power" leftVal={leftRoi} rightVal={rightRoi} format={(v) => `${v}x`} winner={getWinner(parseFloat(leftRoi), parseFloat(rightRoi), 'high')} highlight={true} />
        <BattleRow label="Repay Time" leftVal={leftRepay} rightVal={rightRepay} format={(v) => `${v} Months`} winner={getWinner(parseFloat(leftRepay), parseFloat(rightRepay), 'low')} />
      </div>
    </div>
  );
}

function BattleRow({ label, leftVal, rightVal, format, winner, highlight = false }) {
  const isLeftWin = winner === 'left';
  const isRightWin = winner === 'right';
  return (
    <div className={`grid grid-cols-3 items-center py-4 border-b border-slate-800 hover:bg-slate-800/30 transition-colors ${highlight ? 'bg-slate-800/20' : ''}`}>
      <div className={`text-right px-6 font-mono text-lg ${isLeftWin ? 'text-emerald-400 font-bold scale-110' : 'text-slate-500'} transition-all`}>
        {format(leftVal)} {isLeftWin && <span className="ml-2 text-xs bg-emerald-500/20 text-emerald-400 px-1 rounded">WIN</span>}
      </div>
      <div className="text-center text-slate-200 font-bold uppercase text-xs tracking-wider">{label}</div>
      <div className={`text-left px-6 font-mono text-lg ${isRightWin ? 'text-emerald-400 font-bold scale-110' : 'text-slate-500'} transition-all`}>
        {isRightWin && <span className="mr-2 text-xs bg-emerald-500/20 text-emerald-400 px-1 rounded">WIN</span>} {format(rightVal)}
      </div>
    </div>
  );
}