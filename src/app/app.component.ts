import { Component } from '@angular/core';
import { AdminComponent } from './admin/admin/admin.component';
import { EventsComponent } from './events/events/events.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [AdminComponent, EventsComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {}
