"use client";
import { useState, useEffect } from "react";

// Mock "Live" Events
const EVENTS = [
  { text: "Rahul (Mumbai) just shortlisted TU Munich", time: "Just now" },
  { text: "Sarah (Delhi) checked Visa stats for USA", time: "2s ago" },
  { text: "New Mentor 'Arjun' joined from Berlin", time: "5s ago" },
  { text: "120 Students are viewing 'Data Science' trends", time: "Live" },
  { text: "Ananya matched with a Senior Mentor!", time: "12s ago" },
];

export default function RealTimeFeed() {
  const [feed, setFeed] = useState(EVENTS);

  // Simulate incoming data
  useEffect(() => {
    const interval = setInterval(() => {
      setFeed(prev => {
        const rotated = [...prev];
        const last = rotated.pop();
        rotated.unshift(last); // Move last to first
        return rotated;
      });
    }, 3500); // Update every 3.5 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-slate-500 text-xs font-bold uppercase">Live Activity</h3>
        <span className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-950/30 px-2 py-1 rounded-full border border-emerald-900">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          420 Online
        </span>
      </div>

      <div className="flex flex-col gap-3 overflow-hidden">
        {feed.map((item, i) => (
          <div 
            key={i} 
            className={`flex items-center justify-between text-sm p-2 rounded-lg transition-all duration-500 ${i === 0 ? 'bg-slate-800/50 scale-100 opacity-100' : 'opacity-60 scale-95'}`}
          >
            <span className="text-slate-300 truncate w-3/4">{item.text}</span>
            <span className="text-xs text-slate-500 whitespace-nowrap">{item.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}