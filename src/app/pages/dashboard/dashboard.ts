import { BookingService } from '../../core/services/booking';
import { BookingResponse } from '../../core/models/booking-response';
import { RouterLink } from '@angular/router';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { BookableServiceService, BookableService } from '../../core/services/bookable-service';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, DatePipe],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
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
    this.errorMessage = '';
    this.bookingService.getBookings().subscribe({
      next: (response) => {
        this.bookings = response.content;
        this.isLoading = false;

        console.log('BOOKINGS:', response);

        this.cdr.detectChanges();
      },

      error: (error) => {
        this.isLoading = false;

        this.errorMessage = 'Could not load bookings. Please try again.';

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
