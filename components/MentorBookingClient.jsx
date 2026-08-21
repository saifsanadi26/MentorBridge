"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar, Clock, Video } from "lucide-react";
import { format } from "date-fns";

import { cn } from "@/lib/utils";
// ✅ FIX: Importing the correct names now
import { formatInZone, formatLocal, getAvailableSlots, getNextSessionDateUtc } from "@/lib/time";
import Spinner from "@/components/Spinner";

export default function MentorBookingClient({ mentor }) {
  const router = useRouter();
  
  // State
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [loading, setLoading] = useState(false);

  // Generate Slots
  const availableSlots = getAvailableSlots(selectedDate);

  const handleBookSession = async () => {
    if (!selectedSlot) return;
    setLoading(true);

    try {
      // Create the final booking date object
      // We assume selectedSlot is already the correct Date object from our helper
      const bookingDate = selectedSlot;

      // Call your API to save the booking
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mentorId: mentor._id || mentor.mentorId, // Handle both ID types
          date: bookingDate,
        }),
      });

      if (res.ok) {
        router.push("/dashboard/student?success=true");
      } else {
        alert("Failed to book session. Please try again.");
      }
    } catch (error) {
      console.error("Booking failed", error);
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">
      <h3 className="text-lg font-semibold text-white mb-6">Book a Session</h3>
      
      <div className="grid md:grid-cols-2 gap-8">
        {/* Left: Date Picker (Simplified for Demo) */}
        <div>
          <label className="mb-3 block text-sm font-medium text-zinc-400">
            Select Date
          </label>
          <div className="p-4 rounded-xl border border-zinc-700 bg-black/40">
            {/* Simple HTML Date Picker for robustness */}
            <input 
              type="date"
              className="w-full bg-transparent text-white outline-none"
              value={formatLocal(selectedDate, "yyyy-MM-dd")}
              onChange={(e) => setSelectedDate(new Date(e.target.value))}
              min={formatLocal(new Date(), "yyyy-MM-dd")}
            />
          </div>
          <p className="mt-2 text-xs text-zinc-500">
            Showing slots for {formatLocal(selectedDate, "MMMM do, yyyy")}
          </p>
        </div>

        {/* Right: Slots */}
        <div>
          <label className="mb-3 block text-sm font-medium text-zinc-400">
            Available Slots
          </label>
          <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
            {availableSlots.map((slot, i) => (
              <button
                key={i}
                onClick={() => setSelectedSlot(slot)}
                className={cn(
                  "flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all",
                  selectedSlot === slot
                    ? "bg-orange-500 text-black shadow-lg"
                    : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                )}
              >
                <Clock className="h-3 w-3" />
                {/* Use the safe formatter */}
                {formatInZone(slot, "h:mm a")}
              </button>
            ))}
          </div>
          {availableSlots.length === 0 && (
            <div className="text-sm text-zinc-500 py-4 text-center">
              No slots available for this date.
            </div>
          )}
        </div>
      </div>

      {/* Footer / Confirm */}
      <div className="mt-8 pt-6 border-t border-zinc-800 flex items-center justify-between">
        <div className="text-sm">
          <span className="text-zinc-400">Total:</span>
          <span className="ml-2 text-xl font-bold text-white">Free</span>
        </div>
        
        <button
          onClick={handleBookSession}
          disabled={!selectedSlot || loading}
          className={cn(
            "flex items-center gap-2 rounded-xl px-6 py-3 font-semibold transition-all",
            !selectedSlot || loading
              ? "bg-zinc-800 text-zinc-500 cursor-not-allowed"
              : "bg-white text-black hover:bg-zinc-200"
          )}
        >
          {loading ? <Spinner className="h-5 w-5" /> : <Video className="h-5 w-5" />}
          {loading ? "Booking..." : "Confirm Booking"}
        </button>
      </div>
    </div>
  );
}