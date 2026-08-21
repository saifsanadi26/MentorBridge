"use client";

const NEWS_ITEMS = [
  "📈 MARKET ALERT: Data Science salaries in Munich rose by 12% this quarter.",
  "🚀 TRENDING: 'Python for Finance' is the #1 requested skill in London right now.",
  "🛂 VISA UPDATE: US F-1 Visa interview wait times reduced to 14 days in Mumbai.",
  "🎓 SCHOLARSHIP: DAAD has opened 500 new slots for Indian Engineers.",
  "📉 INSIGHT: MBA demand in UK stabilizing; Business Analytics up by 25%.",
  "💡 TIP: 70% of recruiters in Berlin require B1 German language skills."
];

export default function LiveTicker() {
  return (
    <div className="w-full bg-slate-950 border-b border-slate-800 overflow-hidden py-2 flex items-center">
      <div className="bg-cyan-500/10 text-cyan-400 text-xs font-bold px-3 py-1 ml-4 rounded border border-cyan-500/20 whitespace-nowrap z-10">
        LIVE INTEL
      </div>
      
      {/* The Sliding Track */}
      <div className="flex animate-marquee whitespace-nowrap">
        {[...NEWS_ITEMS, ...NEWS_ITEMS].map((item, i) => (
          <span key={i} className="mx-8 text-sm text-slate-400 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-600"></span>
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}