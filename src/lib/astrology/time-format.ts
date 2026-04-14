/**
 * Marathi time format utilities
 * Converts AM/PM to Marathi time-of-day names
 */

// Get Marathi time period based on hour (24-hour format)
export function getMarathiPeriod(hour: number): string {
  if (hour >= 0 && hour < 4) return "मध्यरात्री";
  if (hour >= 4 && hour < 6) return "पहाटे";
  if (hour >= 6 && hour < 12) return "सकाळी";
  if (hour >= 12 && hour < 16) return "दुपारी";
  if (hour >= 16 && hour < 18) return "संध्याकाळी";
  if (hour >= 18 && hour < 21) return "सायंकाळी";
  return "रात्री"; // 21-23
}

// Format time as Marathi: "रात्री १:४५" or English: "1:45 AM"
export function formatTimeMarathi(hour: number, minute: number, lang: string): string {
  if (lang !== "mr") {
    const ampm = hour >= 12 ? "PM" : "AM";
    const h12 = hour % 12 || 12;
    return `${h12}:${String(minute).padStart(2, "0")} ${ampm}`;
  }

  const period = getMarathiPeriod(hour);
  const h12 = hour % 12 || 12;
  const digits = "०१२३४५६७८९";
  const hStr = String(h12).split("").map(c => digits[parseInt(c)] || c).join("");
  const mStr = String(minute).padStart(2, "0").split("").map(c => digits[parseInt(c)] || c).join("");
  return `${period} ${hStr}:${mStr}`;
}

// Format a Date object
export function formatDateTimeMarathi(date: Date, lang: string): string {
  return formatTimeMarathi(date.getHours(), date.getMinutes(), lang);
}

// Convert "03:00 PM - 04:30 PM" style string to Marathi
export function formatTimeRangeMarathi(range: string, lang: string): string {
  if (lang !== "mr") return range;

  return range.replace(/(\d{1,2}):(\d{2})\s*(AM|PM)/gi, (_, h, m, ampm) => {
    let hour = parseInt(h);
    if (ampm.toUpperCase() === "PM" && hour !== 12) hour += 12;
    if (ampm.toUpperCase() === "AM" && hour === 12) hour = 0;
    return formatTimeMarathi(hour, parseInt(m), "mr");
  });
}
