import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly apiUrl = '/api/auth';

  constructor(private http: HttpClient) {}

  login(request: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, request);
  }

  register(request: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, request);
  }

  logout(): void {
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem("user");
  }

  isAuthenticated(): boolean {
    return !!sessionStorage.getItem('accessToken');
  }

  saveUser(user: UserResponse): void {
    sessionStorage.setItem('user', JSON.stringify(user));
  }

  getCurrentUser(): UserResponse | null {
    const user = sessionStorage.getItem('user');

    if (!user) {
      return null;
    }

    return JSON.parse(user);
  }
}

export interface UserResponse {
  id: number;
  email: string;
  role: string;
}

export interface AuthResponse {
  accessToken: string;
  tokenType: string;
  user: UserResponse;
}
