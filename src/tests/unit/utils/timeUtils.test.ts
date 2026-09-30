import {
  parseTimeToMinutes,
  minutesToTimeString,
  toPersianDigits,
  toEnglishDigits,
  formatTimeForLocale,
  getTodayDateKey,
} from '../../../core/utils/timeUtils';

describe('timeUtils (Unit Test)', () => {
  describe('parseTimeToMinutes & minutesToTimeString', () => {
    it('should correctly parse HH:mm to minutes from midnight', () => {
      expect(parseTimeToMinutes('00:00')).toBe(0);
      expect(parseTimeToMinutes('08:30')).toBe(510);
      expect(parseTimeToMinutes('14:45')).toBe(885);
      expect(parseTimeToMinutes('23:59')).toBe(1439);
    });

    it('should correctly convert minutes to zero-padded HH:mm', () => {
      expect(minutesToTimeString(0)).toBe('00:00');
      expect(minutesToTimeString(510)).toBe('08:30');
      expect(minutesToTimeString(885)).toBe('14:45');
      expect(minutesToTimeString(1439)).toBe('23:59');
    });

    it('should parse Persian digits properly', () => {
      expect(parseTimeToMinutes('۰۸:۳۰')).toBe(510);
    });

    it('should throw on invalid format', () => {
      expect(() => parseTimeToMinutes('invalid')).toThrow();
      expect(() => parseTimeToMinutes('25:00')).toThrow();
      expect(() => parseTimeToMinutes('08:65')).toThrow();
    });
  });

  describe('toPersianDigits & toEnglishDigits', () => {
    it('should convert 0-9 to Persian digits', () => {
      expect(toPersianDigits('12345')).toBe('۱۲۳۴۵');
      expect(toPersianDigits(8)).toBe('۸');
      expect(toPersianDigits('08:00')).toBe('۰۸:۰۰');
    });

    it('should convert Persian digits back to English', () => {
      expect(toEnglishDigits('۱۲۳۴۵')).toBe('12345');
      expect(toEnglishDigits('۰۸:۰۰')).toBe('08:00');
    });
  });

  describe('formatTimeForLocale', () => {
    it('should format Persian digits when locale is fa', () => {
      expect(formatTimeForLocale('08:00', 'fa')).toBe('۰۸:۰۰');
    });

    it('should keep English digits when locale is en', () => {
      expect(formatTimeForLocale('08:00', 'en')).toBe('08:00');
    });
  });

  describe('getTodayDateKey', () => {
    it('should format date as YYYY-MM-DD', () => {
      const fixedDate = new Date(2026, 8, 30); // Note: month 8 is September (0-indexed)
      expect(getTodayDateKey(fixedDate)).toBe('2026-09-30');
    });
  });
});
