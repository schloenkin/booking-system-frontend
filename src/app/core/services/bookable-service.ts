import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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
}
