import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BookableServiceService, BookableService } from '../../core/services/bookable-service';

import { BookingService } from '../../core/services/booking';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-booking',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './create-booking.html',
  styleUrl: './create-booking.css',
})
export class CreateBooking implements OnInit {
  errorMessage = '';

  services: BookableService[] = [];

  bookingForm = new FormGroup({
    serviceId: new FormControl(0, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(1)],
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
    private bookableServiceService: BookableServiceService,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.bookableServiceService.getAllServices().subscribe({
      next: (services) => {
        this.services = services;
      },

      error: (error) => {
        console.error('LOAD SERVICES ERROR:', error);
      },
    });
  }

  onSubmit(): void {
    this.errorMessage = '';
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

        this.errorMessage = error.error?.message ?? 'Something went wrong';

        this.cdr.detectChanges();
      },
    });
  }
}
