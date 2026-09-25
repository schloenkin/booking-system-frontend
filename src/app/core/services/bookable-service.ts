import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BookingRescheduleRequest } from '../models/booking-reschedule-request';
import { BookingResponse } from '../models/booking-response';

export interface BookableService {
  id: number;
  name: string;
  description: string;
  durationMinutes: number;
  active: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class BookableServiceService {
  private apiUrl = '/api/services';

  constructor(private http: HttpClient) {}

  getAllServices(): Observable<BookableService[]> {
    return this.http.get<BookableService[]>(this.apiUrl);
  }

  rescheduleBooking(id: number, request: BookingRescheduleRequest): Observable<BookingResponse> {
    return this.http.put<BookingResponse>(`${this.apiUrl}/${id}/reschedule`, request);
  }
}
