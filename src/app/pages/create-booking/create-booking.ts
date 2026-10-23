import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import { BookableServiceService, BookableService } from '../../core/services/bookable-service';
import { BookingService } from '../../core/services/booking';
import { SlotPicker } from './components/slot-picker/slot-picker';
import { DatePicker } from './components/date-picker/date-picker';
import { BookingResponse } from '../../core/models/booking-response';

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
  pendingSlot = '';
  availabilityRefresh = 0;
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
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {

    const serviceId = Number(
      this.route.snapshot.queryParamMap.get('serviceId')
    );

    const date = this.route.snapshot.queryParamMap.get('date');
    const time = this.route.snapshot.queryParamMap.get('time');

    this.bookableServiceService.getAllServices().subscribe({
      next: (services) => {
        this.services = services;

        if (serviceId > 0) {
          const service = services.find(
            (item) => item.id === serviceId && item.active
          );

          if (service) {
            this.selectedService = service;

            this.bookingForm.controls.serviceId.setValue(service.id);
          }
        }

        if (this.selectedService &&
            date &&
            /^\d{4}-\d{2}-\d{2}$/.test(date)) {
          this.selectedDate = date;
        }

        if (
          this.selectedService &&
          this.selectedDate &&
          time &&
          /^([01]\d|2[0-3]):[0-5]\d$/.test(time)
        ) {
          this.pendingSlot = time;
        }

        this.cdr.detectChanges();
      },

      error: (error) => {
        console.error('LOAD SERVICES ERROR:', error);
        this.errorMessage = 'Could not load services.';
        this.cdr.detectChanges();
      }
    });
  }

  onSubmit(): void {
    this.errorMessage = '';

    if (this.bookingForm.invalid) {
      this.bookingForm.markAllAsTouched();
      return;
    }

    if (!this.selectedService) {
        this.errorMessage = 'Please select a valid service.';
        this.cdr.detectChanges();
        return;
    }
    if (!this.selectedDate) {

      this.errorMessage = "Please select a date and time.";
      this.cdr.detectChanges();
      return;
    }
    if (!this.selectedSlot) {

       this.errorMessage = "Please select a time.";
       this.cdr.detectChanges();
       return;
        }

    this.isLoading = true;

    const startTime = `${this.selectedDate}T${this.selectedSlot}`;

    const endTime = new Date(startTime);

    endTime.setMinutes(endTime.getMinutes() + this.selectedService.durationMinutes);

    const request = {
      serviceId: this.bookingForm.controls.serviceId.value,startTime,endTime:`${endTime.getFullYear()}-${String(endTime.getMonth() + 1).padStart(2, '0')}-${String(endTime.getDate()).padStart(2, '0')}T${String(endTime.getHours()).padStart(2, '0')}:${String(endTime.getMinutes()).padStart(2, '0')}`,};

    this.bookingService.createBooking(request).subscribe({
      next: (booking: BookingResponse) => {
        this.isLoading = false;

        this.router.navigate(['/booking-success'], {
          state: {
            booking: booking,
            serviceName: this.selectedService?.name ?? ''
          }
        });
      },


    error: (error) => {
      console.error('CREATE ERROR:', error);

      if (
        error.status === 409 &&
        error.error?.code === 'BOOKING_TIME_CONFLICT'
      ) {
        this.errorMessage =
          'This time slot is no longer available. Please choose another time.';

        this.selectedSlot = '';
        this.pendingSlot = '';
        this.availabilityRefresh++;

      } else if (error.status === 409) {
        this.errorMessage =
          error.error?.message ??
          'Booking conflict. Please check your selection.';

      } else if (error.status === 401) {
        this.errorMessage =
          'Your session has expired. Please sign in again.';

      } else if (error.status === 0) {
        this.errorMessage =
          'Cannot connect to the server. Please check your connection.';

      } else {
        this.errorMessage =
          error.error?.message ?? 'Unable to create booking.';
      }

      this.isLoading = false;
      this.cdr.detectChanges();
    }
    });
      }

  onDateSelected(date: string): void {
    this.selectedDate = date;
    this.selectedSlot = '';
    this.pendingSlot = '';
    this.errorMessage = '';

    this.cdr.detectChanges();

    console.log('DATE:', this.selectedDate);
  }

  onSlotSelected(slot: string): void {
    this.selectedSlot = slot;

    if (slot) {
      this.errorMessage = '';
    }

    this.cdr.detectChanges();
  }

  onServiceSelected(event: Event): void {
    const select = event.target as HTMLSelectElement;

    const serviceId = Number(select.value);

    this.selectedService = this.services.find((service) => service.id === serviceId) ?? null;

    this.selectedSlot = '';
    this.pendingSlot = '';
    this.errorMessage = '';

    console.log('SERVICE:', this.selectedService);
  }

  onCancel(): void {
    void this.router.navigate(['/dashboard']);
  }
}
