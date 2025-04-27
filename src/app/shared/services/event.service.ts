import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { Event } from '../models/event.model';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  private storageKey = 'events';
  private eventsSubject: BehaviorSubject<Event[]>;

  constructor(private storageService: StorageService) {
    this.eventsSubject = new BehaviorSubject<Event[]>(
      this.getEventsFromStorage()
    );
  }

  private getEventsFromStorage(): Event[] {
    return this.storageService.get<Event[]>(this.storageKey) || [];
  }

  getEvents$() {
    return this.eventsSubject.asObservable();
  }

  addEvent(event: Event): void {
    const events = this.getEventsFromStorage();
    events.push(event);
    this.storageService.set(this.storageKey, events);
    this.eventsSubject.next(events);
  }

  getEvents(): Event[] {
    return this.getEventsFromStorage();
  }

  getEventById(id: string): Event | undefined {
    return this.getEvents().find((e) => e.id === id);
  }
}
