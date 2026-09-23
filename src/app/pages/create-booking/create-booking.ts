import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { BookingService } from '../../core/services/booking';

@Component({
  selector: 'app-create-booking',
  standalone: true,
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

  constructor(
    private bookingService: BookingService,
    private router: Router,
  ) {}

  onSubmit(): void {
    if (this.bookingForm.invalid) {
      return;
    }

    const request = this.bookingForm.getRawValue();

    this.bookingService.createBooking(request).subscribe({
      next: (booking) => {
        console.log('CREATED:', booking);
        void this.router.navigate(['/dashboard']);
      },

      error: (error) => {
        console.error('CREATE ERROR:', error);
      },
    });
  }
}
