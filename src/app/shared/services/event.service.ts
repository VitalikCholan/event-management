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

  // CREATE
  addEvent(event: Event): void {
    const events = this.getEventsFromStorage();
    events.push(event);
    this.storageService.set(this.storageKey, events);
    this.eventsSubject.next(events);
  }

  // READ
  getEvents(): Event[] {
    return this.getEventsFromStorage();
  }

  getEventById(id: string): Event | undefined {
    return this.getEvents().find((e) => e.id === id);
  }

  // UPDATE
  updateEvent(updated: Event): void {
    const events = this.getEvents().map((e) =>
      e.id === updated.id ? updated : e
    );
    this.storageService.set(this.storageKey, events);
    this.eventsSubject.next(events);
  }

  // DELETE
  removeEvent(id: string): void {
    const events = this.getEvents().filter((e) => e.id !== id);
    this.storageService.set(this.storageKey, events);
    this.eventsSubject.next(events);
  }
}
