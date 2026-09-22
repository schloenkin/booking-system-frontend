import { Component, OnInit } from '@angular/core';
import { BookingService } from '../../core/services/booking';
import { BookingResponse } from '../../core/models/booking-response';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  bookings: BookingResponse[] = [];

  constructor(private bookingService: BookingService) {}

  ngOnInit(): void {
    this.bookingService.getBookings().subscribe({
      next: (response) => {
        this.bookings = response.content;
        console.log('BOOKINGS:', response);
      },

      error: (error) => {
        console.error('BOOKINGS ERROR:', error);
      },
    });
  }
}
