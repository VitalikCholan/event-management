import { Injectable } from '@angular/core';
import { format, parseISO } from 'date-fns';
import { formatInTimeZone, toZonedTime } from 'date-fns-tz';

@Injectable({
  providedIn: 'root',
})
export class TimezoneService {
  // Format event date/time in the original timezone
  formatOriginal(date: string, time: string, timezone: string): string {
    if (!date || !time || !timezone) return '';
    const dateTimeStr = `${date}T${time}:00`;
    const parsed = parseISO(dateTimeStr);
    if (isNaN(parsed.getTime())) {
      return '';
    }
    const zonedDate = toZonedTime(parsed, timezone);
    return formatInTimeZone(zonedDate, timezone, 'dd.MM.yyyy HH:mm (z)');
  }

  // Convert and format event date/time in the user's local timezone
  formatLocal(date: string, time: string, originalTimezone: string): string {
    if (!date || !time || !originalTimezone) return '';
    const dateTimeStr = `${date}T${time}:00`;
    let parsed = parseISO(dateTimeStr);
    if (isNaN(parsed.getTime())) {
      parsed = new Date(dateTimeStr);
      if (isNaN(parsed.getTime())) {
        return '';
      }
    }
    const zonedDate = toZonedTime(parsed, originalTimezone);
    return format(zonedDate, 'dd.MM.yyyy HH:mm');
  }

  // Format UTC ISO string in the event's original timezone
  formatOriginalUtc(utcDateTime: string, timezone: string): string {
    if (!utcDateTime || !timezone) return '';
    try {
      // Parse the UTC ISO string to a Date object
      const date = new Date(utcDateTime);

      // Direct conversion from UTC to the target timezone without using toZonedTime
      return formatInTimeZone(date, timezone, 'dd.MM.yyyy HH:mm (z)');
    } catch (error) {
      return '';
    }
  }

  // Format UTC ISO string in the user's local timezone
  formatLocalUtc(utcDateTime: string): string {
    if (!utcDateTime) return '';
    try {
      const userTz = this.getUserTimezone();

      // Parse the UTC ISO string to a Date object
      const date = new Date(utcDateTime);

      // Direct conversion from UTC to the user's timezone
      return formatInTimeZone(date, userTz, 'dd.MM.yyyy HH:mm (z)');
    } catch (error) {
      return '';
    }
  }

  // Debugging helper to visualize timezone conversions (simplified)
  private debugTimezoneConversion(
    utcDateTime: string,
    targetTimezone: string
  ): void {
    // Debug function kept for future use but logging removed
    const date = new Date(utcDateTime);
    try {
      const zonedDate = toZonedTime(date, targetTimezone);
      format(zonedDate, 'yyyy-MM-dd HH:mm:ss');
    } catch (e) {
      // Error handling preserved but not logged
    }
  }

  // Get user's current timezone
  getUserTimezone(): string {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  }

  // Convert a local time in the specified timezone to UTC
  zonedTimeToUtc(dateTimeStr: string, timeZone: string): Date {
    try {
      // First parse the date string
      const parsedDate = parseISO(dateTimeStr);
      if (isNaN(parsedDate.getTime())) {
        throw new Error(`Invalid dateTimeStr: ${dateTimeStr}`);
      }

      // This pattern gets the date with timezone offset in ISO format
      const isoWithOffset = formatInTimeZone(
        parsedDate,
        timeZone,
        "yyyy-MM-dd'T'HH:mm:ssXXX"
      );

      // Now parse this string which correctly includes timezone information
      return new Date(isoWithOffset);
    } catch (error) {
      throw error;
    }
  }
}
