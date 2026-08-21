"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

const stats = [
  "342 sessions completed this month",
  "15 verified mentors available now",
  "Latest booking: Germany MS CS — 5 min ago",
  "New scholarship added for UK applicants",
  "Most popular: Germany (45%), USA (30%), UK (15%)",
];

export default function LiveStats() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setMounted(true);

    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % stats.length);
    }, 7000);

    return () => clearInterval(id);
  }, []);

  if (pathname !== "/dashboard/student") return null;
  if (!mounted) return null;

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-50 w-full max-w-[180px]">
      <div className="glass-card rounded-xl p-3">
        <div className="text-[10px] font-medium uppercase tracking-wide text-slate-300">
          Live Stats
        </div>
        <div className="mt-2 min-h-[16px] text-[10px] text-slate-100">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              {stats[index]}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
