"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CartesianGrid,
  Bar,
  BarChart,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export default function AdminDashboardClient() {
  const [payload, setPayload] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [resetOpen, setResetOpen] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [resetMessage, setResetMessage] = useState("");

  async function load() {
    try {
      setLoading(true);
      setError("");
      const res = await fetch("/api/admin/analytics", { cache: "no-store" });
      if (res.status === 401) {
        window.location.href = "/login";
        return;
      }
      const data = await res.json();
      if (!res.ok || !data?.success) {
        setError(data?.error || "Failed to load analytics");
        setPayload(null);
        return;
      }
      setPayload(data);
    } catch {
      setError("Failed to load analytics");
      setPayload(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const stats = payload?.stats;

  const userGrowth = payload?.analytics?.userGrowth || [];
  const bookingsOverTime = payload?.analytics?.bookingsOverTime || [];
  const popularMentors = payload?.analytics?.popularMentors || [];

  const bookingsByCountry = useMemo(() => {
    return (payload?.analytics?.bookingsByCountry || []).map((d) => ({
      name: `${d.flag || ""} ${d.country}`.trim(),
      count: d.count,
    }));
  }, [payload]);

  async function onReset() {
    try {
      setResetLoading(true);
      setResetMessage("");
      const res = await fetch("/api/admin/reset-bookings", { method: "POST" });
      const data = await res.json();
      if (!res.ok || !data?.success) {
        setResetMessage(data?.error || "Reset failed");
        return;
      }
      setResetMessage(data.message || "Reset completed");
      setResetOpen(false);
      await load();
    } catch {
      setResetMessage("Reset failed");
    } finally {
      setResetLoading(false);
    }
  }

  return (
    <div className="grid gap-6">
      <div className="glass-card rounded-2xl p-6">
        <div className="text-sm text-slate-300">Admin Dashboard</div>
        <div className="mt-1 text-2xl font-semibold tracking-tight">
          Analytics Overview
        </div>
        <div className="mt-2 text-sm text-slate-300">
          Monitor activity and reset bookings for clean demos.
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <a
          href="/admin/add-mentor"
          className="glass-card rounded-2xl p-6 transition hover:-translate-y-1"
        >
          <div className="text-lg font-semibold">Add Mentor</div>
          <div className="mt-1 text-sm text-slate-300">
            Create new mentors via the Admin CMS.
          </div>
        </a>
        <a
          href="/admin/add-story"
          className="glass-card rounded-2xl p-6 transition hover:-translate-y-1"
        >
          <div className="text-lg font-semibold">Add Success Story</div>
          <div className="mt-1 text-sm text-slate-300">
            Publish new stories without editing seed data.
          </div>
        </a>
      </div>

      {resetMessage ? (
        <div className="rounded-xl border border-[#27272A] bg-black/20 px-4 py-3 text-sm text-zinc-200">
          {resetMessage}
        </div>
      ) : null}

      {loading ? (
        <div className="glass-card rounded-2xl p-6 text-sm text-zinc-400">
          Loading analytics...
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-6 text-sm text-red-400">
          {error}
        </div>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-4">
            <StatCard label="Total Users" value={stats.totalUsers} />
            <StatCard label="Active Mentors" value={stats.activeMentors} />
            <StatCard label="Total Sessions" value={stats.totalSessions} />
            <StatCard label="Total Bookings" value={stats.bookedSessions} />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="glass-card rounded-2xl p-6">
              <div className="text-lg font-semibold">User Growth</div>
              <div className="mt-1 text-sm text-zinc-400">Last 14 days</div>
              <div className="mt-6 h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={userGrowth}>
                    <CartesianGrid stroke="#27272A" strokeDasharray="3 3" />
                    <XAxis dataKey="date" tick={{ fill: "#A1A1AA", fontSize: 12 }} />
                    <YAxis allowDecimals={false} tick={{ fill: "#A1A1AA", fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{
                        background: "#121212",
                        border: "1px solid #27272A",
                        borderRadius: 12,
                        color: "#FAFAFA",
                      }}
                      labelStyle={{ color: "#FAFAFA" }}
                    />
                    <Line
                      type="monotone"
                      dataKey="count"
                      stroke="#6366F1"
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="glass-card rounded-2xl p-6">
              <div className="text-lg font-semibold">Bookings Over Time</div>
              <div className="mt-1 text-sm text-zinc-400">Last 14 days</div>
              <div className="mt-6 h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={bookingsOverTime}>
                    <CartesianGrid stroke="#27272A" strokeDasharray="3 3" />
                    <XAxis dataKey="date" tick={{ fill: "#A1A1AA", fontSize: 12 }} />
                    <YAxis allowDecimals={false} tick={{ fill: "#A1A1AA", fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{
                        background: "#121212",
                        border: "1px solid #27272A",
                        borderRadius: 12,
                        color: "#FAFAFA",
                      }}
                      labelStyle={{ color: "#FAFAFA" }}
                    />
                    <Line
                      type="monotone"
                      dataKey="count"
                      stroke="#8B5CF6"
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="glass-card rounded-2xl p-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="text-lg font-semibold">Popular Mentors</div>
                  <div className="mt-1 text-sm text-zinc-400">
                    Top 5 by total bookings
                  </div>
                </div>
                <button
                  onClick={() => setResetOpen(true)}
                  className="inline-flex h-10 items-center justify-center rounded-full border border-red-500/20 bg-red-500/10 px-5 text-sm font-medium text-red-300 transition hover:bg-red-500/15"
                >
                  Reset All Bookings
                </button>
              </div>

              <div className="mt-6 h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={popularMentors}>
                    <XAxis dataKey="name" tick={{ fill: "#A1A1AA", fontSize: 12 }} />
                    <YAxis allowDecimals={false} tick={{ fill: "#A1A1AA", fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{
                        background: "#121212",
                        border: "1px solid #27272A",
                        borderRadius: 12,
                        color: "#FAFAFA",
                      }}
                      labelStyle={{ color: "#FAFAFA" }}
                    />
                    <Bar dataKey="count" fill="#6366F1" radius={[10, 10, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-4 grid gap-2">
                {popularMentors.map((m) => (
                  <div
                    key={m.mentorId}
                    className="glass-subcard flex items-center justify-between rounded-xl px-4 py-3 text-sm"
                  >
                    <div className="text-zinc-200">
                      {m.countryFlag} {m.name}
                    </div>
                    <div className="text-zinc-400">{m.count} bookings</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-card rounded-2xl p-6">
              <div className="text-lg font-semibold">Bookings by Country</div>
              <div className="mt-1 text-sm text-zinc-400">All-time</div>
              <div className="mt-6 h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={bookingsByCountry}>
                    <XAxis dataKey="name" tick={{ fill: "#A1A1AA", fontSize: 12 }} />
                    <YAxis allowDecimals={false} tick={{ fill: "#A1A1AA", fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{
                        background: "#121212",
                        border: "1px solid #27272A",
                        borderRadius: 12,
                        color: "#FAFAFA",
                      }}
                      labelStyle={{ color: "#FAFAFA" }}
                    />
                    <Bar dataKey="count" fill="#EC4899" radius={[10, 10, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </>
      )}

      {resetOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-md rounded-2xl border border-[#27272A] bg-[#121212] p-6 shadow-lg">
            <div className="text-lg font-semibold">Are you sure?</div>
            <div className="mt-2 text-sm text-zinc-400">
              This will clear all bookings and make all mentor sessions available
              again.
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                onClick={() => setResetOpen(false)}
                className="inline-flex h-10 items-center justify-center rounded-full border border-[#27272A] bg-white/5 px-5 text-sm font-medium text-zinc-100 transition hover:bg-white/10"
              >
                Cancel
              </button>
              <button
                onClick={onReset}
                disabled={resetLoading}
                className="inline-flex h-10 items-center justify-center rounded-full border border-red-500/20 bg-red-500/10 px-5 text-sm font-medium text-red-300 transition hover:bg-red-500/15 disabled:opacity-60"
              >
                {resetLoading ? "Resetting..." : "Confirm Reset"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="glass-card rounded-2xl p-6">
      <div className="text-sm text-zinc-400">{label}</div>
      <div className="mt-2 text-3xl font-semibold">{value ?? "-"}</div>
    </div>
  );
}
