import { ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

import { BookingService } from '../../core/services/booking';
import { BookingResponse } from '../../core/models/booking-response';
import { BookableServiceService, BookableService } from '../../core/services/bookable-service';
import { DatePicker } from '../create-booking/components/date-picker/date-picker';
import { SlotPicker } from '../create-booking/components/slot-picker/slot-picker';

@Component({
  selector: 'app-booking-detail',
  standalone: true,
  imports: [RouterLink, DatePipe, DatePicker, SlotPicker],
  templateUrl: './booking-detail.html',
  styleUrl: './booking-detail.css',
})
export class BookingDetail implements OnInit {
  booking: BookingResponse | null = null;
  services: BookableService[] = [];
  isCancelling = false;
  isRescheduling = false;
  successMessage = '';
  showRescheduleForm = false;
  selectedDate = '';
  selectedSlot = '';

  constructor(
    private route: ActivatedRoute,
    private bookingService: BookingService,
    private bookableServiceService: BookableServiceService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.bookingService.getBookingById(id).subscribe({
      next: (booking) => {
        this.booking = booking;

        console.log('BOOKING DETAIL:', booking);

        this.cdr.detectChanges();
      },

      error: (error) => {
        console.error('LOAD BOOKING ERROR:', error);
      },
    });

    this.bookableServiceService.getAllServices().subscribe({
      next: (services) => {
        this.services = services;
      },
      error: (error) => {
        console.error('LOAD SERVICES ERROR:', error);
      },
    });
  }

  getServiceName(serviceId: number): string {
    const service = this.services.find((service) => service.id === serviceId);

    return service?.name ?? 'Unknown service';
  }

  getService(serviceId: number): BookableService | null {
    return this.services.find((service) => service.id === serviceId) ?? null;
  }

  cancelBooking(): void {
    const confirmed = window.confirm('Are you sure you want to cancel this booking?');

    if (!confirmed) {
      return;
    }

    if (!this.booking) {
      return;
    }

    this.isCancelling = true;

    this.bookingService.cancelBooking(this.booking.id).subscribe({
      next: (booking) => {
        this.booking = booking;
        this.isCancelling = false;

        this.cdr.detectChanges();
      },

      error: (error) => {
        console.error('CANCEL ERROR:', error);

        this.isCancelling = false;
      },
    });
  }

  saveReschedule(): void {
    this.successMessage = '';

    if (!this.booking || !this.selectedDate || !this.selectedSlot) {
      return;
    }

    const service = this.getService(this.booking.serviceId);

    if (!service) {
      console.error('SERVICE NOT FOUND');
      return;
    }

    this.isRescheduling = true;

    const startTime = `${this.selectedDate}T${this.selectedSlot}`;

    const endTime = new Date(startTime);

    endTime.setMinutes(endTime.getMinutes() + service.durationMinutes);

    const request = {
      startTime,
      endTime: `${endTime.getFullYear()}-${String(endTime.getMonth() + 1).padStart(
        2,
        '0',
      )}-${String(endTime.getDate()).padStart(2, '0')}T${String(endTime.getHours()).padStart(
        2,
        '0',
      )}:${String(endTime.getMinutes()).padStart(2, '0')}`,
    };

    this.bookingService.rescheduleBooking(this.booking.id, request).subscribe({
      next: (booking) => {
        console.log('RESCHEDULE RESPONSE:', booking);
        this.booking = booking;
        this.isRescheduling = false;
        this.showRescheduleForm = false;
        this.successMessage = 'Booking time successfully changed.';

        this.cdr.detectChanges();
      },

      error: (error) => {
        console.error('RESCHEDULE ERROR:', error);

        this.isRescheduling = false;
      },
    });
  }

  onDateSelected(date: string): void {
    this.selectedDate = date;
  }

  onSlotSelected(slot: string): void {
    this.selectedSlot = slot;
  }
}
