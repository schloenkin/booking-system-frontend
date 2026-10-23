import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { BookingResponse } from '../../core/models/booking-response';

@Component({
  selector: 'app-booking-success',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './booking-success.html',
  styleUrl: './booking-success.css',
})
export class BookingSuccess {

  booking: BookingResponse | null = null;
  serviceName = '';

  constructor(private router: Router) {
    const state = this.router.getCurrentNavigation()?.extras.state
      ?? history.state;

    this.booking = state?.['booking'] ?? null;
    this.serviceName = state?.['serviceName'] ?? '';
  }
}
