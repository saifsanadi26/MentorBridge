import { format, addMinutes, isBefore, parse } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';

// --- CRASH-PROOF TIME HELPERS ---

/**
 * 1. Safe UTC Converter
 */
export const toUTC = (dateString) => {
  if (!dateString) return new Date();
  try {
    if (dateString instanceof Date) return dateString;
    return new Date(dateString);
  } catch (e) {
    console.error("Time Error:", e);
    return new Date();
  }
};

/**
 * 2. Safe Time Zone Formatter (Renamed from formatInTz)
 * Usage: formatInZone(date, 'yyyy-MM-dd', 'America/New_York')
 */
export const formatInZone = (date, fmt, tz = 'UTC') => {
  if (!date) return '';
  try {
    return formatInTimeZone(date, tz, fmt);
  } catch (e) {
    return format(new Date(date), fmt);
  }
};

/**
 * 3. Format Local Time
 * Simple wrapper to format a date in the user's browser time.
 */
export const formatLocal = (date, fmt) => {
  if (!date) return '';
  try {
    return format(new Date(date), fmt);
  } catch (e) {
    return '';
  }
};

/**
 * 4. Get Available Slots
 * Generates 9 AM - 5 PM slots.
 */
export const getAvailableSlots = (date, bookedSlots = [], duration = 60) => {
  const slots = [];
  try {
    const start = new Date(date);
    start.setHours(9, 0, 0, 0); 
    const end = new Date(date);
    end.setHours(17, 0, 0, 0); 

    let current = start;
    while (isBefore(current, end)) {
      slots.push(new Date(current));
      current = addMinutes(current, duration);
    }
  } catch (error) {
    console.error("Slot Error", error);
  }
  return slots;
};

/**
 * 5. Get Next Session Date (UTC)
 * Combines a Date object and a Time string (e.g., "09:30") into a single UTC Date.
 */
export const getNextSessionDateUtc = (baseDate, timeString) => {
  try {
    // 1. Parse the time string (e.g., "09:30")
    const [hours, minutes] = timeString.split(':').map(Number);
    
    // 2. Create a new date based on the baseDate
    const session = new Date(baseDate);
    session.setHours(hours, minutes, 0, 0);
    
    return session;
  } catch (e) {
    console.error("Session Date Error:", e);
    return new Date();
  }
};