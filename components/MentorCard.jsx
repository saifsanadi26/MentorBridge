import Image from "next/image";
import Link from "next/link";

import MatchScorePill from "@/components/MatchScorePill";
import VerifiedBadge from "@/components/VerifiedBadge";

export default function MentorCard({ mentor }) {
  const availableSlots = mentor.availableSlots ?? 0;

  return (
    <Link
      href={`/mentors/${mentor.mentorId}`}
      className="rounded-2xl border border-[#27272A] bg-[#121212] p-5 shadow-lg transition hover:-translate-y-1 hover:shadow-indigo-500/10"
    >
      <div className="flex items-start gap-4">
        <div className="relative h-12 w-12 overflow-hidden rounded-xl border border-[#27272A] bg-black/20">
          {mentor.avatarUrl ? (
            <Image
              src={mentor.avatarUrl}
              alt={mentor.name}
              fill
              className="object-cover"
            />
          ) : null}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-3">
            <div className="truncate text-base font-semibold">{mentor.name}</div>
            {mentor.isVerified ? <VerifiedBadge /> : null}
          </div>

          <div className="mt-1 text-sm text-zinc-300">
            <span className="mr-2">{mentor.countryFlag}</span>
            {mentor.country}
            {mentor.university ? (
              <>
                <span className="mx-2 text-zinc-600">•</span>
                {mentor.university}
              </>
            ) : null}
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            {(mentor.expertise || []).slice(0, 3).map((t) => (
              <span
                key={t}
                className="rounded-full border border-[#27272A] bg-white/5 px-3 py-1 text-xs text-zinc-200"
              >
                {t}
              </span>
            ))}
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <div className="text-xs text-zinc-400">
              Available slots: <span className="text-zinc-200">{availableSlots}</span>
            </div>
            <MatchScorePill score={mentor.matchScore} />
          </div>
        </div>
      </div>
    </Link>
  );
}
