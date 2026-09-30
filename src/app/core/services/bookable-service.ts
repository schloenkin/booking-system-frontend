import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BookingRescheduleRequest } from '../models/booking-reschedule-request';
import { BookingResponse } from '../models/booking-response';
import { BookableServiceCreateRequest } from '../models/bookable-service-create-request';

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

  activateService(id: number): Observable<BookableService> {
    return this.http.put<BookableService>(`${this.apiUrl}/${id}/activate`, {});
  }

  deactivateService(id: number): Observable<BookableService> {
    return this.http.put<BookableService>(`${this.apiUrl}/${id}/deactivate`, {});
  }

  rescheduleBooking(id: number, request: BookingRescheduleRequest): Observable<BookingResponse> {
    return this.http.put<BookingResponse>(`${this.apiUrl}/${id}/reschedule`, request);
  }

  createService(request: BookableServiceCreateRequest): Observable<BookableService> {
    return this.http.post<BookableService>(this.apiUrl, request);
  }
}
