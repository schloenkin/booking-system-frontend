import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { BookingService } from '../../core/services/booking';
import { BookingResponse } from '../../core/models/booking-response';
import { BookableServiceService, BookableService } from '../../core/services/bookable-service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-my-bookings',
  standalone: true,
  imports: [RouterLink, DatePipe],
  templateUrl: './my-bookings.html',
  styleUrl: './my-bookings.css',
})
export class MyBookings implements OnInit {
  bookings: BookingResponse[] = [];
  services: BookableService[] = [];

  isLoading = false;
  errorMessage = '';

  constructor(
    private bookingService: BookingService,
    private bookableServiceService: BookableServiceService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.bookableServiceService.getAllServices().subscribe({
      next: (services) => {
        this.services = services;
      },

      error: (error) => {
        console.error('SERVICES ERROR:', error);
      },
    });

    this.isLoading = true;

    this.bookingService.getBookings().subscribe({
      next: (response) => {
        this.bookings = response.content;

        this.isLoading = false;

        this.cdr.detectChanges();
      },

      error: (error) => {
        this.isLoading = false;

        this.errorMessage = 'Could not load bookings.';

        console.error('BOOKINGS ERROR:', error);
      },
    });
  }

  getServiceName(serviceId: number): string {
    const service = this.services.find((service) => service.id === serviceId);

    return service?.name ?? 'Unknown service';
  }

  get upcomingBookings(): BookingResponse[] {
    return this.bookings.filter((booking) => new Date(booking.startTime) >= new Date());
  }

  get pastBookings(): BookingResponse[] {
    return this.bookings.filter((booking) => new Date(booking.startTime) < new Date());
  }
}
