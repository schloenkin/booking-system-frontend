import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { BookingService } from '../../core/services/booking';

@Component({
  selector: 'app-create-booking',
  imports: [ReactiveFormsModule],
  templateUrl: './create-booking.html',
  styleUrl: './create-booking.css',
})
export class CreateBooking {
  bookingForm = new FormGroup({
    serviceId: new FormControl(0, {
      nonNullable: true,
      validators: [Validators.required],
    }),

    startTime: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),

    endTime: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  constructor(private bookingService: BookingService) {}

  onSubmit(): void {
    if (this.bookingForm.invalid) {
      return;
    }

    const request = this.bookingForm.getRawValue();

    this.bookingService.createBooking(request).subscribe({
      next: (booking) => {
        console.log('CREATED:', booking);
      },

      error: (error) => {
        console.error('CREATE ERROR:', error);
      },
    });
  }
}
