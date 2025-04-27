import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { Event } from '../models/event.model';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  private storageKey = 'events';

  constructor(private storageService: StorageService) {}

  // CREATE
  addEvent(event: Event): void {
    const events = this.getEvents();
    events.push(event);
    this.storageService.set(this.storageKey, events);
  }

  // READ
  getEvents(): Event[] {
    return this.storageService.get(this.storageKey) || [];
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
  }

  // DELETE
  removeEvent(id: string): void {
    const events = this.getEvents().filter((e) => e.id !== id);
    this.storageService.set(this.storageKey, events);
  }
}
