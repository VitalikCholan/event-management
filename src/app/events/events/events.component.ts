import { Component, OnInit, inject } from '@angular/core';
import { EventService } from '../../shared/services/event.service';
import { Event } from '../../shared/models/event.model';
import { TimezoneService } from '../../shared/services/timezone.service';

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
    this.eventService.getEvents$().subscribe((events) => {
      this.events = events;
      this.formattedEvents = events.map((event) => ({
        event,
        originalTime: this.timezoneService.formatOriginalUtc(
          event.utcDateTime,
          event.timezone
        ),
        localTime: this.timezoneService.formatLocalUtc(
          event.utcDateTime,
          event.timezone
        ),
      }));
    });
  }
}
