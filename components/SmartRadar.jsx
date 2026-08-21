"use client";

import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip 
} from 'recharts';

// --- DATA: ALL COUNTRIES ---
const RADAR_DATA = {
  Germany: [
    { subject: 'Salary', A: 85, fullMark: 100 },
    { subject: 'Visa Ease', A: 90, fullMark: 100 },
    { subject: 'ROI', A: 95, fullMark: 100 },
    { subject: 'Job Safety', A: 90, fullMark: 100 },
    { subject: 'Language', A: 60, fullMark: 100 },
  ],
  USA: [
    { subject: 'Salary', A: 98, fullMark: 100 },
    { subject: 'Visa Ease', A: 40, fullMark: 100 },
    { subject: 'ROI', A: 70, fullMark: 100 },
    { subject: 'Job Safety', A: 60, fullMark: 100 },
    { subject: 'Language', A: 100, fullMark: 100 },
  ],
  UK: [
    { subject: 'Salary', A: 75, fullMark: 100 },
    { subject: 'Visa Ease', A: 70, fullMark: 100 },
    { subject: 'ROI', A: 65, fullMark: 100 },
    { subject: 'Job Safety', A: 75, fullMark: 100 },
    { subject: 'Language', A: 100, fullMark: 100 },
  ],
  Canada: [
    { subject: 'Salary', A: 75, fullMark: 100 },
    { subject: 'Visa Ease', A: 95, fullMark: 100 },
    { subject: 'ROI', A: 80, fullMark: 100 },
    { subject: 'Job Safety', A: 85, fullMark: 100 },
    { subject: 'Language', A: 100, fullMark: 100 },
  ],
  Australia: [
    { subject: 'Salary', A: 90, fullMark: 100 },
    { subject: 'Visa Ease', A: 70, fullMark: 100 },
    { subject: 'ROI', A: 75, fullMark: 100 },
    { subject: 'Job Safety', A: 80, fullMark: 100 },
    { subject: 'Language', A: 100, fullMark: 100 },
  ],
  Ireland: [
    { subject: 'Salary', A: 70, fullMark: 100 },
    { subject: 'Visa Ease', A: 85, fullMark: 100 },
    { subject: 'ROI', A: 85, fullMark: 100 },
    { subject: 'Job Safety', A: 75, fullMark: 100 },
    { subject: 'Language', A: 100, fullMark: 100 },
  ],
  Global: [
    { subject: 'Salary', A: 60, fullMark: 100 },
    { subject: 'Visa Ease', A: 60, fullMark: 100 },
    { subject: 'ROI', A: 60, fullMark: 100 },
    { subject: 'Job Safety', A: 60, fullMark: 100 },
    { subject: 'Language', A: 60, fullMark: 100 },
  ]
};

export default function SmartRadar({ country }) {
  // Select data based on country, or default to Global
  const data = RADAR_DATA[country] || RADAR_DATA["Global"];

  return (
    <div className="relative h-[300px] w-full flex items-center justify-center">
      {/* Background Glow Effect */}
      <div className="absolute inset-0 bg-cyan-500/5 blur-3xl rounded-full"></div>

      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
          {/* The Spider Web Grid */}
          <PolarGrid stroke="#334155" />
          
          {/* Axis Labels (Salary, ROI, etc.) */}
          <PolarAngleAxis 
            dataKey="subject" 
            tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 'bold' }} 
          />
          
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
          
          {/* The Glowing Shape */}
          <Radar
            name={country}
            dataKey="A"
            stroke="#22d3ee"
            strokeWidth={3}
            fill="#22d3ee"
            fillOpacity={0.4}
            animationDuration={1500}
          />
          <Tooltip 
             contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px', color: '#fff' }}
             itemStyle={{ color: '#22d3ee' }}
          />
        </RadarChart>
      </ResponsiveContainer>

      {/* Center "Score" Badge */}
      <div className="absolute top-2 right-2 bg-slate-900/80 border border-slate-700 px-2 py-1 rounded-lg backdrop-blur-sm">
        <div className="text-[10px] text-slate-400 uppercase font-bold">Score</div>
        <div className="text-lg font-bold text-white">
          {Math.round(data.reduce((acc, curr) => acc + curr.A, 0) / 5)}
        </div>
      </div>
    </div>
  );
}