import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { EventService } from '../../shared/services/event.service';
import { TimezoneService } from '../../shared/services/timezone.service';
@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
  ],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css',
})
export class AdminComponent {
  eventForm: FormGroup;
  imagePreview: string | ArrayBuffer | null = null;
  successMessage: string | null = null;
  submitting = false;

  constructor(private fb: FormBuilder) {
    this.eventForm = this.fb.group({
      title: ['', Validators.required],
      date: ['', [Validators.required, this.futureDateValidator]],
      time: ['', Validators.required],
      timezone: ['', Validators.required],
      image: [null, Validators.required],
    });
  }

  eventService = inject(EventService);
  timezoneService = inject(TimezoneService);

  // Custom validator for future date
  futureDateValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;
    const selected = new Date(control.value);
    const today = new Date();
    // Set time to 00:00:00 for both dates to compare only the date part
    selected.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    return selected > today ? null : { notFuture: true };
  }

  onImageSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    const imageControl = this.eventForm.get('image');
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
        imageControl?.setValue(reader.result);
        imageControl?.markAsTouched();
        imageControl?.updateValueAndValidity();
      };
      reader.readAsDataURL(file);
    } else {
      // If no file is selected, clear the value and mark as touched
      imageControl?.setValue(null);
      imageControl?.markAsTouched();
      imageControl?.updateValueAndValidity();
    }
  }

  onSubmit(): void {
    if (this.eventForm.valid) {
      this.submitting = true;
      const { title, date, time, timezone, image } = this.eventForm.value;
      // Ensure date is a Date object and extract YYYY-MM-DD
      const dateObj: Date = date instanceof Date ? date : new Date(date);
      const dateStr = dateObj.toISOString().slice(0, 10); // 'YYYY-MM-DD'
      const dateTimeStr = `${dateStr}T${time}:00`;
      const utcDate = this.timezoneService.zonedTimeToUtc(
        dateTimeStr,
        timezone
      );
      const event = {
        id: Date.now().toString(),
        title,
        utcDateTime: utcDate.toISOString(),
        timezone,
        image,
      };
      this.eventService.addEvent(event);
      this.successMessage = 'Подію успішно створено!'; // "Event created successfully!"
      this.eventForm.reset();
      this.imagePreview = null;
      setTimeout(() => {
        this.successMessage = null;
        this.submitting = false;
      }, 3000);
    } else {
      // Mark all controls as touched to show errors on first submit
      this.eventForm.markAllAsTouched();
    }
  }
}
