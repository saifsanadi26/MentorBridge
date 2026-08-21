"use client";

import { useEffect, useMemo, useState } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";

const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const aliases = {
  USA: "United States of America",
  US: "United States of America",
  "United States": "United States of America",
  UK: "United Kingdom",
};

function normalizeCountryName(name) {
  return aliases[name] || name;
}

export default function MentorHeatmap() {
  const [tooltip, setTooltip] = useState(null);
  const [counts, setCounts] = useState(new Map());

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const res = await fetch("/api/mentors", { cache: "no-store" });
        const data = await res.json();
        if (!active) return;
        if (!res.ok || !data?.success) return;

        const m = new Map();
        for (const mentor of data.mentors || []) {
          const key = normalizeCountryName(mentor.country);
          m.set(key, (m.get(key) || 0) + 1);
        }

        setCounts(m);
      } catch {
        // ignore
      }
    }

    load();
    return () => {
      active = false;
    };
  }, []);

  const highlighted = useMemo(() => {
    const keys = new Set(["United States of America", "United Kingdom", "Germany", "India"]);
    for (const k of counts.keys()) keys.add(k);
    return keys;
  }, [counts]);

  return (
    <div className="glass-card relative rounded-2xl p-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <div className="text-sm text-slate-300">Dashboard</div>
          <div className="mt-1 text-xl font-semibold tracking-tight text-slate-100">
            Mentor Heatmap
          </div>
          <div className="mt-2 text-sm text-slate-300">
            Hover a country to see mentor count.
          </div>
        </div>
        <div className="text-sm font-medium text-sky-400">Stormy Morning</div>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-slate-600 bg-white/5">
        <ComposableMap
          projectionConfig={{ scale: 150 }}
          style={{ width: "100%", height: "auto" }}
        >
          <Geographies geography={GEO_URL}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const name = geo.properties?.name;
                const count = counts.get(name) || 0;
                const isHot = highlighted.has(name) && count > 0;

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    onMouseEnter={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      setTooltip({
                        x: rect.left + rect.width / 2,
                        y: rect.top,
                        text: `${name}: ${count} Mentor${count === 1 ? "" : "s"}`,
                      });
                    }}
                    onMouseMove={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      setTooltip((prev) =>
                        prev
                          ? {
                              ...prev,
                              x: rect.left + rect.width / 2,
                              y: rect.top,
                            }
                          : prev
                      );
                    }}
                    onMouseLeave={() => setTooltip(null)}
                    style={{
                      default: {
                        fill: isHot ? "#38BDF8" : "rgba(255,255,255,0.10)",
                        outline: "none",
                        stroke: "rgba(148,163,184,0.25)",
                        strokeWidth: 0.6,
                      },
                      hover: {
                        fill: isHot ? "#7DD3FC" : "rgba(255,255,255,0.16)",
                        outline: "none",
                        stroke: "rgba(148,163,184,0.35)",
                        strokeWidth: 0.8,
                      },
                      pressed: {
                        fill: isHot ? "#38BDF8" : "rgba(255,255,255,0.10)",
                        outline: "none",
                      },
                    }}
                  />
                );
              })
            }
          </Geographies>
        </ComposableMap>
      </div>

      {tooltip ? (
        <div
          className="pointer-events-none fixed z-50 -translate-x-1/2 -translate-y-3 rounded-xl border border-slate-600 bg-slate-900/90 px-3 py-2 text-xs text-slate-100 shadow-xl"
          style={{ left: tooltip.x, top: tooltip.y }}
        >
          {tooltip.text}
        </div>
      ) : null}
    </div>
  );
}
