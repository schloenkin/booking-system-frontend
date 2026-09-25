import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { BookingResponse } from '../models/booking-response';
import { PageResponse } from '../models/page-response';
import { BookingCreateRequest } from '../models/booking-create-request';

@Injectable({
  providedIn: 'root',
})
export class BookingService {
  private readonly apiUrl = '/api/bookings';

  constructor(private http: HttpClient) {}

  getBookings(): Observable<PageResponse<BookingResponse>> {
    return this.http.get<PageResponse<BookingResponse>>(this.apiUrl);
  }

  createBooking(request: BookingCreateRequest): Observable<BookingResponse> {
    return this.http.post<BookingResponse>(this.apiUrl, request);
  }

  cancelBooking(id: number): Observable<BookingResponse> {
    return this.http.put<BookingResponse>(`${this.apiUrl}/${id}/cancel`, {});
  }

  getBookingById(id: number): Observable<BookingResponse> {
    return this.http.get<BookingResponse>(`${this.apiUrl}/${id}`);
  }
}
