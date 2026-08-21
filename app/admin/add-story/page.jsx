"use client";

import { useState } from "react";

export default function AddStoryPage() {
  const [studentName, setStudentName] = useState("");
  const [targetCountry, setTargetCountry] = useState("");
  const [quote, setQuote] = useState("");

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function submit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      setSaving(true);
      const res = await fetch("/api/stories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentName,
          targetCountry,
          quote,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data?.success) {
        setError(data?.error || "Failed to add story");
        return;
      }

      setSuccess(`Story added for ${data?.story?.name || studentName}`);
      setStudentName("");
      setTargetCountry("");
      setQuote("");
    } catch {
      setError("Failed to add story");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10">
      <div className="text-sm text-slate-300">Admin CMS</div>
      <h1 className="mt-1 text-3xl font-semibold tracking-tight text-slate-100">
        Add Success Story
      </h1>
      <div className="mt-2 text-sm text-slate-300">
        Add stories without editing the seed file.
      </div>

      <form onSubmit={submit} className="mt-6 glass-card rounded-2xl p-6">
        <div className="grid gap-4">
          <label className="text-sm text-slate-200">
            Student Name
            <input
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              className="mt-2 h-11 w-full rounded-xl border border-slate-600 bg-white/5 px-4 text-sm text-slate-100 outline-none focus:border-sky-400"
              placeholder="Student name"
              required
            />
          </label>

          <label className="text-sm text-slate-200">
            Target Country
            <input
              value={targetCountry}
              onChange={(e) => setTargetCountry(e.target.value)}
              className="mt-2 h-11 w-full rounded-xl border border-slate-600 bg-white/5 px-4 text-sm text-slate-100 outline-none focus:border-sky-400"
              placeholder="e.g., USA, UK, Germany, India"
              required
            />
          </label>

          <label className="text-sm text-slate-200">
            Quote
            <textarea
              value={quote}
              onChange={(e) => setQuote(e.target.value)}
              className="mt-2 min-h-[120px] w-full rounded-xl border border-slate-600 bg-white/5 px-4 py-3 text-sm text-slate-100 outline-none focus:border-sky-400"
              placeholder="Short quote about the mentor journey..."
              required
            />
          </label>
        </div>

        {error ? (
          <div className="mt-4 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
            {error}
          </div>
        ) : null}

        {success ? (
          <div className="mt-4 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-200">
            {success}
          </div>
        ) : null}

        <div className="mt-6">
          <button
            disabled={saving}
            className="inline-flex h-11 items-center justify-center rounded-xl bg-sky-400 px-6 text-sm font-semibold text-slate-900 transition hover:bg-sky-300 disabled:opacity-60"
            type="submit"
          >
            {saving ? "Saving..." : "Add Story"}
          </button>
        </div>

        <div className="mt-4 text-xs text-slate-300">
          Requires admin login. If youre not logged in as admin, the API will return 401/403.
        </div>
      </form>
    </div>
  );
}
