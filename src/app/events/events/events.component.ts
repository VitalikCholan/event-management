import { Component, OnInit, inject } from '@angular/core';
import { EventService } from '../../shared/services/event.service';
import { Event } from '../../shared/models/event.model';
import { TimezoneService } from '../../shared/services/timezone.service';
import { uk } from 'date-fns/locale';
import { setDefaultOptions } from 'date-fns';

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [],
  templateUrl: './events.component.html',
  styleUrl: './events.component.css',
})
export class EventsComponent implements OnInit {
  events: Event[] = [];
  formattedEvents: Array<{
    event: Event;
    originalTime: string;
    localTime: string;
  }> = [];
  private eventService = inject(EventService);
  private timezoneService = inject(TimezoneService);

  ngOnInit(): void {
    // Set the default locale for date-fns
    setDefaultOptions({ locale: uk });

    this.eventService.getEvents$().subscribe((events) => {
      this.events = events;

      this.formattedEvents = events.map((event) => {
        // Format original time (event's timezone)
        const originalTime = this.timezoneService.formatOriginalUtc(
          event.utcDateTime,
          event.timezone
        );

        // Format local time (user's timezone)
        const localTime = this.timezoneService.formatLocalUtc(
          event.utcDateTime
        );

        return {
          event,
          originalTime,
          localTime,
        };
      });
    });
  }
}
