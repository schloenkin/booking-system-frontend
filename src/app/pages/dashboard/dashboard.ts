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

    this.bookingService.getBookings().subscribe({
      next: (response) => {
        this.bookings = response.content;

        console.log('BOOKINGS:', response);

        this.cdr.detectChanges();
      },

      error: (error) => {
        console.error('BOOKINGS ERROR:', error);
      },
    });
  }
  getServiceName(serviceId: number): string {
    const service = this.services.find((service) => service.id === serviceId);

    return service?.name ?? 'Unknown service';
  }
}
