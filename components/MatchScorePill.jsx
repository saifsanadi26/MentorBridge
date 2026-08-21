import { Sparkles } from "lucide-react";

export default function MatchScorePill({ score }) {
  if (typeof score !== "number") return null;

  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-green-500/20 bg-green-500/10 px-3 py-1 text-xs font-medium text-green-400">
      <Sparkles className="h-4 w-4" />
      {score}% Match ✨
    </div>
  );
}
