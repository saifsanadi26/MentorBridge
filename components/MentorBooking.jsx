"use client";

import { useState } from "react";
import { CheckCircle2, AlertCircle, Clock } from "lucide-react";

export default function MentorBooking({ mentorId, mentorName }) {
  const [status, setStatus] = useState("idle"); // idle, loading, success, error
  const [selectedSlot, setSelectedSlot] = useState(null);

  const handleBooking = async () => {
    if (!selectedSlot) return;
    
    setStatus("loading");

    try {
      const response = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mentorId,
          slot: selectedSlot,
          date: new Date().toLocaleDateString(),
        }),
      });

      const data = await response.json();

      if (data.success) {
        setStatus("success");
        // Redirect after 2 seconds to see the success message
        setTimeout(() => {
          window.location.href = "/dashboard/student";
        }, 2000);
      } else {
        throw new Error();
      }
    } catch (err) {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000); // Reset after 3 seconds
    }
  };

  if (status === "success") {
    return (
      <div className="bg-emerald-900/20 border border-emerald-500/30 rounded-3xl p-8 text-center animate-in fade-in zoom-in">
        <CheckCircle2 className="mx-auto text-emerald-500 mb-4" size={48} />
        <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Session Secured</h3>
        <p className="text-emerald-400 text-sm mt-2">Redirecting to Mission Control...</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-white uppercase tracking-tight flex items-center gap-2">
          <Clock className="text-cyan-500" size={20} /> Select Time Slot
        </h3>
        {status === "error" && (
          <span className="text-red-400 text-[10px] font-bold uppercase animate-bounce flex items-center gap-1">
            <AlertCircle size={12} /> Sync Error
          </span>
        )}
      </div>
      
      <div className="grid grid-cols-2 gap-3 mb-8">
        {["9:00 AM", "11:30 AM", "2:00 PM", "4:30 PM"].map((slot) => (
          <button
            key={slot}
            onClick={() => setSelectedSlot(slot)}
            className={`py-3 rounded-xl border font-mono text-sm transition-all duration-200 ${
              selectedSlot === slot 
              ? "bg-cyan-500 border-cyan-400 text-black font-bold shadow-[0_0_20px_rgba(6,182,212,0.4)]" 
              : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-500"
            }`}
          >
            {slot}
          </button>
        ))}
      </div>

      <button
        onClick={handleBooking}
        disabled={status === "loading" || !selectedSlot}
        className="w-full py-4 bg-gradient-to-r from-cyan-500 to-indigo-500 text-white font-black uppercase tracking-widest rounded-2xl shadow-lg hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:grayscale"
      >
        {status === "loading" ? "SYNCHRONIZING..." : `Confirm with ${mentorName}`}
      </button>
    </div>
  );
}