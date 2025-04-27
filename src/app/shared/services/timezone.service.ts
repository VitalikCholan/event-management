import { Injectable } from '@angular/core';
import { format, parseISO } from 'date-fns';
import { formatInTimeZone, toZonedTime } from 'date-fns-tz';
import { uk } from 'date-fns/locale';

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

      // Format date with the actual timezone name rather than GMT offset
      const formattedDate = formatInTimeZone(
        date,
        timezone,
        "dd MMM yyyy 'p.' HH:mm",
        { locale: uk }
      );

      // Use the timezone identifier directly
      return `${formattedDate} (${timezone})`;
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

      // Format date with the actual timezone name rather than GMT offset
      const formattedDate = formatInTimeZone(
        date,
        userTz,
        "dd MMM yyyy 'p.' HH:mm",
        { locale: uk }
      );

      // Use the timezone identifier directly
      return `${formattedDate} (${userTz})`;
    } catch (error) {
      return '';
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
