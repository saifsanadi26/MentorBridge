"use client";

import { useEffect, useState } from "react";

export default function AdminAddPage() {
  const [allowed, setAllowed] = useState(false);
  const [checking, setChecking] = useState(true);

  const [story, setStory] = useState({
    studentName: "",
    targetUniversityCountry: "",
    successQuote: "",
    studentImageUrl: "",
  });
  const [storyMsg, setStoryMsg] = useState("");
  const [storyLoading, setStoryLoading] = useState(false);

  useEffect(() => {
    let active = true;

    async function check() {
      try {
        setChecking(true);
        const res = await fetch("/api/auth/me", { cache: "no-store" });
        const data = await res.json();
        if (!active) return;

        if (!res.ok || !data?.success || data?.user?.role !== "admin") {
          window.location.href = "/login";
          return;
        }

        setAllowed(true);
      } catch {
        window.location.href = "/login";
      } finally {
        if (active) setChecking(false);
      }
    }

    check();
    return () => {
      active = false;
    };
  }, []);

  async function onAddStory(e) {
    e.preventDefault();
    try {
      setStoryLoading(true);
      setStoryMsg("");

      const res = await fetch("/api/stories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(story),
      });
      const data = await res.json();
      if (!res.ok || !data?.success) {
        setStoryMsg(data?.error || "Failed to create story");
        return;
      }

      setStoryMsg("Story created successfully.");
      setStory({
        studentName: "",
        targetUniversityCountry: "",
        successQuote: "",
        studentImageUrl: "",
      });
    } catch {
      setStoryMsg("Failed to create story");
    } finally {
      setStoryLoading(false);
    }
  }

  if (checking) {
    return (
      <div className="mx-auto w-full max-w-4xl px-4 py-10">
        <div className="glass-card rounded-2xl p-6 text-sm text-slate-300">
          Loading...
        </div>
      </div>
    );
  }

  if (!allowed) {
    return null;
  }

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-10">
      <div className="glass-card rounded-2xl p-6">
        <div className="text-sm text-slate-300">Admin CMS</div>
        <h1 className="mt-1 text-2xl font-semibold text-white">Add Success Story</h1>
        <div className="mt-2 text-sm text-slate-300">
          Write your own student outcomes and publish them to the Stories page.
        </div>
      </div>

      <div className="mt-6 glass-card rounded-2xl p-6">
        <form onSubmit={onAddStory} className="mt-2 grid gap-3">
          <input
            className="h-11 rounded-lg border border-slate-700 bg-slate-900/40 px-4 text-sm text-white outline-none focus:border-sky-400"
            placeholder="Student Name"
            value={story.studentName}
            onChange={(e) =>
              setStory((p) => ({ ...p, studentName: e.target.value }))
            }
            required
          />
          <input
            className="h-11 rounded-lg border border-slate-700 bg-slate-900/40 px-4 text-sm text-white outline-none focus:border-sky-400"
            placeholder="Target University/Country (e.g., Oxford / UK)"
            value={story.targetUniversityCountry}
            onChange={(e) =>
              setStory((p) => ({ ...p, targetUniversityCountry: e.target.value }))
            }
            required
          />
          <textarea
            className="min-h-28 rounded-lg border border-slate-700 bg-slate-900/40 px-4 py-3 text-sm text-white outline-none focus:border-sky-400"
            placeholder="Success Quote"
            value={story.successQuote}
            onChange={(e) =>
              setStory((p) => ({ ...p, successQuote: e.target.value }))
            }
            required
          />
          <input
            className="h-11 rounded-lg border border-slate-700 bg-slate-900/40 px-4 text-sm text-white outline-none focus:border-sky-400"
            placeholder="Student Image URL (optional)"
            value={story.studentImageUrl}
            onChange={(e) =>
              setStory((p) => ({ ...p, studentImageUrl: e.target.value }))
            }
          />

          {storyMsg ? <div className="text-sm text-slate-300">{storyMsg}</div> : null}

          <button
            className="btn-primary h-11 rounded-lg disabled:opacity-70"
            disabled={storyLoading}
            type="submit"
          >
            {storyLoading ? "Saving..." : "Publish Story"}
          </button>
        </form>
      </div>
    </div>
  );
}
