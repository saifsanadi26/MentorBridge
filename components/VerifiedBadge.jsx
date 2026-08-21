import { Check } from "lucide-react";

export default function VerifiedBadge() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-[#27272A] bg-white/5 px-2 py-1 text-[11px] text-zinc-100">
      <Check className="h-3.5 w-3.5 text-[#6366F1]" />
      Verified
    </span>
  );
}
