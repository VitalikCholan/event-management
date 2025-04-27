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
      console.warn('Invalid date after parseISO:', dateTimeStr);
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
        console.warn(
          'Invalid date after parseISO and new Date (local):',
          dateTimeStr
        );
        return '';
      }
    }
    const zonedDate = toZonedTime(parsed, originalTimezone);
    return format(zonedDate, 'dd.MM.yyyy HH:mm');
  }

  // Format UTC ISO string in the event's original timezone
  formatOriginalUtc(utcDateTime: string, timezone: string): string {
    if (!utcDateTime || !timezone) return '';
    const zonedDate = toZonedTime(utcDateTime, timezone);
    return formatInTimeZone(zonedDate, timezone, 'dd.MM.yyyy HH:mm (z)');
  }

  // Format UTC ISO string in the user's local timezone
  formatLocalUtc(utcDateTime: string, originalTimezone: string): string {
    if (!utcDateTime || !originalTimezone) return '';
    const userTz = this.getUserTimezone();
    const zonedDate = toZonedTime(utcDateTime, userTz);
    return formatInTimeZone(zonedDate, userTz, 'dd.MM.yyyy HH:mm (z)');
  }

  // Get user's current timezone
  getUserTimezone(): string {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  }

  zonedTimeToUtc(dateTimeStr: string, timeZone: string): Date {
    const localDate = new Date(dateTimeStr);
    if (isNaN(localDate.getTime())) {
      throw new Error(`Invalid dateTimeStr: ${dateTimeStr}`);
    }
    const utcDate = toZonedTime(localDate, timeZone);
    return new Date(
      localDate.getTime() -
        (utcDate.getTimezoneOffset() - localDate.getTimezoneOffset()) * 60000
    );
  }
}
