"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export default function MentorAnalyticsClient() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        setLoading(true);
        setError("");
        const res = await fetch("/api/mentor/analytics", { cache: "no-store" });
        if (res.status === 401) {
          window.location.href = "/login";
          return;
        }
        const json = await res.json();
        if (!active) return;
        if (!res.ok || !json?.success) {
          setError(json?.error || "Failed to load analytics");
          setData(null);
          return;
        }
        setData(json);
      } catch {
        if (!active) return;
        setError("Failed to load analytics");
        setData(null);
      } finally {
        if (!active) return;
        setLoading(false);
      }
    }

    load();
    return () => {
      active = false;
    };
  }, []);

  const chart = useMemo(() => {
    return data?.analytics?.bookingsOverTime || [];
  }, [data]);

  if (loading) {
    return (
      <div className="glass-card rounded-2xl p-6 text-sm text-zinc-400">
        Loading analytics...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-6 text-sm text-red-400">
        {error}
      </div>
    );
  }

  const stats = data?.stats;

  return (
    <div className="grid gap-6">
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Total sessions" value={stats?.totalSessions} />
        <StatCard label="Booked" value={stats?.bookedSessions} />
        <StatCard label="Available" value={stats?.availableSessions} />
      </div>

      <div className="glass-card rounded-2xl p-6">
        <div className="text-lg font-semibold">Bookings (last 14 days)</div>
        <div className="mt-1 text-sm text-zinc-400">
          Your session booking activity over time.
        </div>

        <div className="mt-6 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chart}>
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
