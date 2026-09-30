/**
 * Utility functions for time conversions, interval math, and bilingual formatting.
 *
 * In Clean Architecture, utilities like these live in the core/shared layer
 * and remain pure, deterministic, and easily unit-testable.
 */

/**
 * Converts English digits (0-9) to Persian digits (۰-۹)
 */
export function toPersianDigits(input: string | number): string {
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return String(input).replace(/[0-9]/g, (char) => persianDigits[Number(char)]);
}

/**
 * Converts Persian digits (۰-۹) to standard English digits (0-9)
 */
export function toEnglishDigits(input: string): string {
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return input.replace(/[۰-۹]/g, (char) => String(persianDigits.indexOf(char)));
}

/**
 * Parses "HH:mm" string into minutes elapsed since 00:00 (midnight).
 * Example: "08:30" => 8 * 60 + 30 = 510
 */
export function parseTimeToMinutes(timeStr: string): number {
  const cleaned = toEnglishDigits(timeStr).trim();
  const parts = cleaned.split(':');
  if (parts.length !== 2) {
    throw new Error(`Invalid time format: "${timeStr}". Expected HH:mm`);
  }
  const hours = parseInt(parts[0], 10);
  const minutes = parseInt(parts[1], 10);

  if (isNaN(hours) || isNaN(minutes) || hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
    throw new Error(`Invalid time values in "${timeStr}". Hours must be 0-23 and minutes 0-59.`);
  }

  return hours * 60 + minutes;
}

/**
 * Converts minutes since midnight back into a 2-digit zero-padded "HH:mm" string.
 * Example: 510 => "08:30"
 */
export function minutesToTimeString(totalMinutes: number): string {
  const clamped = Math.max(0, Math.min(totalMinutes, 23 * 60 + 59));
  const hours = Math.floor(clamped / 60);
  const minutes = Math.floor(clamped % 60);

  const hh = hours.toString().padStart(2, '0');
  const mm = minutes.toString().padStart(2, '0');
  return `${hh}:${mm}`;
}

/**
 * Returns today's calendar date formatted as YYYY-MM-DD for logging purposes.
 */
export function getTodayDateKey(date: Date = new Date()): string {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

/**
 * Formats a time string according to the active locale.
 * If locale is 'fa', digits are converted to Persian glyphs.
 */
export function formatTimeForLocale(timeStr: string, locale: 'en' | 'fa'): string {
  if (locale === 'fa') {
    return toPersianDigits(timeStr);
  }
  return timeStr;
}
