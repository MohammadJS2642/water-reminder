/**
 * Domain Entity: NotificationSlot
 *
 * Represents an individual reminder slot calculated within the user's active time window.
 * For instance, if the user drinks 8 glasses between 08:00 and 22:00,
 * each slot corresponds to one planned hydration reminder.
 */
export interface NotificationSlot {
  /**
   * 1-based sequential glass index (e.g. 1, 2, ..., N)
   */
  glassNumber: number;

  /**
   * Scheduled time in "HH:mm" 24h format (e.g. "08:00", "10:00")
   */
  time: string;

  /**
   * Minutes from midnight (e.g. 480 for 08:00)
   */
  minutesFromMidnight: number;
}
