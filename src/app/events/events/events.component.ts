import { Component, OnInit, inject } from '@angular/core';
import { EventService } from '../../shared/services/event.service';
import { Event } from '../../shared/models/event.model';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './events.component.html',
  styleUrl: './events.component.css',
})
export class EventsComponent implements OnInit {
  events: Event[] = [];
  private eventService = inject(EventService);

  ngOnInit(): void {
    this.eventService.getEvents$().subscribe((events) => {
      this.events = events;
    });
  }
}
