"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const activities = [
  "🔥 342 sessions completed this month",
  "👥 15 verified mentors available now",
  "✅ Latest booking: Germany MS CS - 5 min ago",
  "🎓 New scholarship added for UK applicants",
  "📊 Most popular: Germany (45%), USA (30%), UK (15%)",
];

export default function LiveActivity() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % activities.length);
    }, 7000);

    return () => clearInterval(id);
  }, []);

  return (
    <div className="fixed bottom-4 left-4 z-40 w-[min(360px,calc(100vw-2rem))]">
      <div className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur">
        <div className="text-[11px] font-medium uppercase tracking-wide text-zinc-400">
          Live Stats
        </div>
        <div className="mt-2 min-h-[22px] text-sm text-zinc-100">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              {activities[index]}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
