import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

import { BookableServiceService, BookableService } from '../../core/services/bookable-service';
import { BookingService } from '../../core/services/booking';
import { SlotPicker } from './components/slot-picker/slot-picker';
import { DatePicker } from './components/date-picker/date-picker';

@Component({
  selector: 'app-create-booking',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, SlotPicker, DatePicker],
  templateUrl: './create-booking.html',
  styleUrl: './create-booking.css',
})
export class CreateBooking implements OnInit {
  selectedDate = '';
  selectedSlot = '';
  selectedService: BookableService | null = null;
  errorMessage = '';
  isLoading = false;

  services: BookableService[] = [];

  bookingForm = new FormGroup({
    serviceId: new FormControl(0, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(1)],
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
      this.bookingForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;

    if (!this.selectedService || !this.selectedDate || !this.selectedSlot) {
      return;
    }
    const startTime = `${this.selectedDate}T${this.selectedSlot}`;

    const endTime = new Date(startTime);

    endTime.setMinutes(endTime.getMinutes() + this.selectedService.durationMinutes);

    const request = {
      serviceId: this.bookingForm.controls.serviceId.value,
      startTime,
      endTime: `${endTime.getFullYear()}-${String(endTime.getMonth() + 1).padStart(2, '0')}-${String(endTime.getDate()).padStart(2, '0')}T${String(endTime.getHours()).padStart(2, '0')}:${String(endTime.getMinutes()).padStart(2, '0')}`,
    };

    this.bookingService.createBooking(request).subscribe({
      next: (booking) => {
        console.log('CREATED:', booking);

        this.isLoading = false;

        void this.router.navigate(['/dashboard']);
      },

      error: (error) => {
        console.error('CREATE ERROR:', error);

        this.errorMessage = error.error?.message ?? 'Something went wrong';

        this.isLoading = false;

        this.cdr.detectChanges();
      },
    });
  }

  onDateSelected(date: string): void {
    this.selectedDate = date;
    console.log('DATE:', this.selectedDate);
  }

  onSlotSelected(slot: string): void {
    this.selectedSlot = slot;
    console.log('SLOT:', this.selectedSlot);
  }

  onServiceSelected(event: Event): void {
    const select = event.target as HTMLSelectElement;

    const serviceId = Number(select.value);

    this.selectedService = this.services.find((service) => service.id === serviceId) ?? null;

    console.log('SERVICE:', this.selectedService);
  }
}
