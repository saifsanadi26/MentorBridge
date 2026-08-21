"use client";

import { useEffect, useRef, useState } from "react";
import Globe from "react-globe.gl";

// Partner Universities (Public = Blue, Private = Gold)
const UNIVERSITY_DATA = [
  {
    lat: 42.3770,
    lng: -71.1167,
    size: 20,
    type: "Private",
    color: "#fbbf24",
    name: "Harvard University (USA)",
  },
  {
    lat: 51.7548,
    lng: -1.2544,
    size: 20,
    type: "Public",
    color: "#38bdf8",
    name: "University of Oxford (UK)",
  },
  {
    lat: 48.2620,
    lng: 11.6670,
    size: 20,
    type: "Public",
    color: "#38bdf8",
    name: "TUM Munich (Germany)",
  },
  {
    lat: 1.2966,
    lng: 103.7764,
    size: 20,
    type: "Public",
    color: "#38bdf8",
    name: "NUS Singapore (Singapore)",
  },
  {
    lat: 19.1334,
    lng: 72.9133,
    size: 18,
    type: "Public",
    color: "#38bdf8",
    name: "IIT Bombay (India)",
  },
  {
    lat: 37.4275,
    lng: -122.1697,
    size: 20,
    type: "Private",
    color: "#fbbf24",
    name: "Stanford University (USA)",
  },
  {
    lat: 40.0076,
    lng: -105.2659,
    size: 18,
    type: "Public",
    color: "#38bdf8",
    name: "University of Colorado Boulder (USA)",
  },
  {
    lat: 43.4723,
    lng: -80.5449,
    size: 18,
    type: "Public",
    color: "#38bdf8",
    name: "University of Waterloo (Canada)",
  },
  {
    lat: 52.2053,
    lng: 0.1218,
    size: 20,
    type: "Public",
    color: "#38bdf8",
    name: "University of Cambridge (UK)",
  },
  {
    lat: 47.3769,
    lng: 8.5417,
    size: 18,
    type: "Public",
    color: "#38bdf8",
    name: "ETH Zurich (Switzerland)",
  },
  {
    lat: 35.7126,
    lng: 139.7610,
    size: 18,
    type: "Public",
    color: "#38bdf8",
    name: "University of Tokyo (Japan)",
  },
  {
    lat: -33.9173,
    lng: 151.2313,
    size: 18,
    type: "Public",
    color: "#38bdf8",
    name: "University of Sydney (Australia)",
  },
  {
    lat: 12.9906,
    lng: 80.2337,
    size: 18,
    type: "Public",
    color: "#38bdf8",
    name: "IIT Madras (India)",
  },
  {
    lat: 47.6538,
    lng: -122.3078,
    size: 18,
    type: "Public",
    color: "#38bdf8",
    name: "University of Washington (USA)",
  },
  {
    lat: 40.3430,
    lng: -74.6514,
    size: 20,
    type: "Private",
    color: "#fbbf24",
    name: "Princeton University (USA)",
  },
];

// Arcs connecting Student Hub (India) to University Partners
const HUB_LOC = { lat: 28.6139, lng: 77.2090 }; // New Delhi
const ARCS_DATA = UNIVERSITY_DATA.map((u) => ({
  startLat: HUB_LOC.lat,
  startLng: HUB_LOC.lng,
  endLat: u.lat,
  endLng: u.lng,
  color: ["rgba(56, 189, 248, 0)", "rgba(56, 189, 248, 1)"]
}));

export default function Globe3D() {
  const globeEl = useRef();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Auto-rotate
    setTimeout(() => {
        if (globeEl.current) {
            globeEl.current.controls().autoRotate = true;
            globeEl.current.controls().autoRotateSpeed = 0.5;
        }
    }, 1000);
  }, []);

  if (!mounted) return <div className="h-96 w-full bg-slate-900 animate-pulse rounded-xl"></div>;

  return (
    <Globe
      ref={globeEl}
      globeImageUrl="//unpkg.com/three-globe/example/img/earth-dark.jpg"
      backgroundColor="rgba(0,0,0,0)"
      atmosphereColor="#3a228a"
      atmosphereAltitude={0.25}
      pointsData={UNIVERSITY_DATA}
      pointAltitude={0.1}
      pointColor="color"
      pointRadius={0.5}
      pointLabel={(d) => `${d.name} • ${d.type} • University Partners`}
      pointsMerge={true}
      arcsData={ARCS_DATA}
      arcColor="color"
      arcDashLength={0.5}
      arcDashGap={2}
      arcDashAnimateTime={2000}
      width={800} // Ensure it fits container
      height={500}
    />
  );
}