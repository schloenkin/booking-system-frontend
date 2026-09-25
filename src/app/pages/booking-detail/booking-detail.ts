import { ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

import { BookingService } from '../../core/services/booking';
import { BookingResponse } from '../../core/models/booking-response';
import { BookableServiceService, BookableService } from '../../core/services/bookable-service';

@Component({
  selector: 'app-booking-detail',
  standalone: true,
  imports: [RouterLink, DatePipe],
  templateUrl: './booking-detail.html',
  styleUrl: './booking-detail.css',
})
export class BookingDetail implements OnInit {
  booking: BookingResponse | null = null;
  services: BookableService[] = [];
  isCancelling = false;

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
}
