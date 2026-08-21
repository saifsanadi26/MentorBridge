"use client";

import React from 'react';
import { Sankey, Tooltip, ResponsiveContainer, Layer, Rectangle } from 'recharts';

// --- DATA ---
const DATA = {
  nodes: [
    { name: "🇮🇳 B.Tech Grads" }, // 0
    { name: "🇩🇪 Germany" },      // 1
    { name: "🇺🇸 USA" },          // 2
    { name: "🇬🇧 UK" },           // 3
    { name: "💼 Data Scientist" },// 4
    { name: "💻 Software Eng" }, // 5
    { name: "🎓 PhD / Research" },// 6
    { name: "🏢 Management" },    // 7
  ],
  links: [
    { source: 0, target: 1, value: 50 },
    { source: 0, target: 2, value: 35 },
    { source: 0, target: 3, value: 15 },
    { source: 1, target: 4, value: 25 },
    { source: 1, target: 5, value: 15 },
    { source: 1, target: 6, value: 10 },
    { source: 2, target: 5, value: 20 },
    { source: 2, target: 7, value: 15 },
    { source: 3, target: 7, value: 10 },
    { source: 3, target: 4, value: 5 },
  ],
};

// --- 1. THE GLOWING NODE (Custom SVG) ---
const CustomNode = ({ x, y, width, height, index, payload }) => {
  const colors = ["#6366f1", "#10b981", "#3b82f6", "#f59e0b", "#ec4899", "#8b5cf6", "#06b6d4", "#f43f5e"];
  const color = colors[index % colors.length];

  return (
    <Layer key={`node-${index}`}>
      {/* Glow Behind */}
      <rect x={x} y={y} width={width} height={height} fill={color} filter={`url(#glow-${index})`} opacity="0.4" rx={4} />
      
      {/* Main Block */}
      <rect x={x} y={y} width={width} height={height} fill={color} rx={4} stroke="#fff" strokeWidth={1} />
      
      {/* Label */}
      <text
        x={x < 300 ? x - 10 : x + width + 10} // Smart positioning
        y={y + height / 2}
        textAnchor={x < 300 ? 'end' : 'start'}
        dy={4}
        fontSize="12"
        fill="#e2e8f0"
        fontWeight="bold"
        className="uppercase tracking-wider shadow-black drop-shadow-md"
      >
        {payload.name}
      </text>

      {/* SVG Filter Definition for Glow */}
      <defs>
        <filter id={`glow-${index}`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
    </Layer>
  );
};

// --- 2. THE ANIMATED LINK (Fiber Optic Effect) ---
const AnimatedLink = (props) => {
  const { sourceX, sourceY, targetX, targetY, linkWidth, index } = props;

  // Calculate path
  const radius = 50; // Smooth curve
  const path = `
    M ${sourceX} ${sourceY + linkWidth / 2}
    C ${sourceX + radius} ${sourceY + linkWidth / 2},
      ${targetX - radius} ${targetY + linkWidth / 2},
      ${targetX} ${targetY + linkWidth / 2}
    L ${targetX} ${targetY - linkWidth / 2}
    C ${targetX - radius} ${targetY - linkWidth / 2},
      ${sourceX + radius} ${sourceY - linkWidth / 2},
      ${sourceX} ${sourceY - linkWidth / 2}
    Z
  `;

  return (
    <Layer key={`link-${index}`}>
      <defs>
        {/* Gradient for the flow */}
        <linearGradient id={`gradient-${index}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#6366f1" stopOpacity="0.1" />
          <stop offset="50%" stopColor="#818cf8" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#6366f1" stopOpacity="0.1" />
        </linearGradient>
      </defs>

      {/* The Base Path (Faint) */}
      <path d={path} fill={`url(#gradient-${index})`} stroke="none" />

      {/* The "Data Packet" Animation */}
      {/* We draw a thin line in the middle of the path and animate a dash array */}
      <path 
        d={`M ${sourceX} ${sourceY} C ${sourceX + 100} ${sourceY}, ${targetX - 100} ${targetY}, ${targetX} ${targetY}`}
        fill="none"
        stroke="white"
        strokeWidth="1"
        strokeOpacity="0.6"
        strokeDasharray="10 100" // Short dash, long gap
      >
         <animate 
           attributeName="stroke-dashoffset" 
           from="200" 
           to="0" 
           dur={`${2 + (index % 3)}s`} // Random speeds
           repeatCount="indefinite" 
         />
      </path>
    </Layer>
  );
};

export default function CareersSankey() {
  return (
    <div className="w-full">
      
      {/* HEADER */}
      <div className="text-center space-y-4 mb-12">
        <h1 className="text-5xl font-black text-white tracking-tight uppercase">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">CAREER</span> DNA MAP
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto text-lg">
          Live visualization of 10,000+ student journeys. Watch the data flow.
        </p>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        
        {/* CHART AREA */}
        <div className="lg:col-span-9 bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-3xl p-8 shadow-2xl relative min-h-[600px] flex flex-col">
           {/* Chart Header */}
           <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                 <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
                 </span>
                 <span className="text-sm font-bold text-white uppercase tracking-widest">Live Trajectory Stream</span>
              </div>
              <div className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/30 rounded text-xs text-indigo-300 font-mono">
                 Auto-Play Active
              </div>
           </div>

           {/* The Sankey */}
           <ResponsiveContainer width="100%" height={500}>
            <Sankey
              data={DATA}
              node={<CustomNode />}
              link={<AnimatedLink />} // Using our custom animated link
              nodePadding={50}
              margin={{ left: 20, right: 20, top: 20, bottom: 20 }}
            >
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff', borderRadius: '12px', boxShadow: '0 10px 30px -10px rgba(0,0,0,0.5)' }}
                itemStyle={{ color: '#818cf8', fontWeight: 'bold' }}
                cursor={false}
              />
            </Sankey>
          </ResponsiveContainer>
        </div>

        {/* INSIGHTS PANEL (Glassmorphism) */}
        <div className="lg:col-span-3 space-y-6">
           
           {/* Insight Card 1 */}
           <div className="bg-gradient-to-b from-slate-800 to-slate-900 border border-slate-700 rounded-2xl p-6 shadow-lg">
              <div className="text-3xl mb-3">🇩🇪</div>
              <h3 className="text-white font-bold text-lg mb-2">The Germany Effect</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                 Notice the thick stream from <span className="text-white font-bold">India → Germany</span>. It is the #1 pathway for <span className="text-emerald-400 font-bold">Data Science</span> roles this year.
              </p>
           </div>

           {/* Insight Card 2 */}
           <div className="bg-gradient-to-b from-slate-800 to-slate-900 border border-slate-700 rounded-2xl p-6 shadow-lg">
              <div className="text-3xl mb-3">🇺🇸</div>
              <h3 className="text-white font-bold text-lg mb-2">USA Pivots</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                 While USA intakes are high, notice the split: 50% go to Engineering, but 40% pivot to <span className="text-amber-400 font-bold">Management</span> within 2 years.
              </p>
           </div>

        </div>
      </div>
    </div>
  );
}