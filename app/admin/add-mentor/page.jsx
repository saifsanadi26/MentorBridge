"use client";

import { useState } from "react";

export default function AddMentorPage() {
  const [name, setName] = useState("");
  const [country, setCountry] = useState("");
  const [university, setUniversity] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function submit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      setSaving(true);
      const res = await fetch("/api/mentors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          country,
          university,
          imageUrl,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data?.success) {
        setError(data?.error || "Failed to add mentor");
        return;
      }

      setSuccess(`Mentor created: ${data?.mentor?.name || name}`);
      setName("");
      setCountry("");
      setUniversity("");
      setImageUrl("");
    } catch {
      setError("Failed to add mentor");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10">
      <div className="text-sm text-slate-300">Admin CMS</div>
      <h1 className="mt-1 text-3xl font-semibold tracking-tight text-slate-100">
        Add Mentor
      </h1>
      <div className="mt-2 text-sm text-slate-300">
        Create mentors directly from the dashboard.
      </div>

      <form onSubmit={submit} className="mt-6 glass-card rounded-2xl p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-sm text-slate-200">
            Name
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-2 h-11 w-full rounded-xl border border-slate-600 bg-white/5 px-4 text-sm text-slate-100 outline-none focus:border-sky-400"
              placeholder="Mentor name"
              required
            />
          </label>

          <label className="text-sm text-slate-200">
            Country
            <input
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="mt-2 h-11 w-full rounded-xl border border-slate-600 bg-white/5 px-4 text-sm text-slate-100 outline-none focus:border-sky-400"
              placeholder="e.g., USA, UK, Germany, India"
              required
            />
          </label>

          <label className="text-sm text-slate-200">
            University
            <input
              value={university}
              onChange={(e) => setUniversity(e.target.value)}
              className="mt-2 h-11 w-full rounded-xl border border-slate-600 bg-white/5 px-4 text-sm text-slate-100 outline-none focus:border-sky-400"
              placeholder="University name"
            />
          </label>

          <label className="text-sm text-slate-200">
            Image URL
            <input
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="mt-2 h-11 w-full rounded-xl border border-slate-600 bg-white/5 px-4 text-sm text-slate-100 outline-none focus:border-sky-400"
              placeholder="https://..."
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
            {saving ? "Saving..." : "Add Mentor"}
          </button>
        </div>

        <div className="mt-4 text-xs text-slate-300">
          Requires admin login. If youre not logged in as admin, the API will return 401/403.
        </div>
      </form>
    </div>
  );
}
