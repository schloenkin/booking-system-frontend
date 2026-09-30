import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { UserService, UserResponse } from '../../core/services/user';
import { BookingService } from '../../core/services/booking';
import { BookingResponse } from '../../core/models/booking-response';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [],
  templateUrl: './admin.html',
  styleUrl: './admin.css',
})
export class Admin implements OnInit {
  users: UserResponse[] = [];
  isLoading = true;
  bookings: BookingResponse[] = [];

  constructor(
    private userService: UserService,
    private bookingService: BookingService,
    private cd: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loadUsers();
    this.loadBookings();
  }

  loadUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.cd.detectChanges();
        this.isLoading = false;
        console.log('USERS FROM BACKEND:', users);
      },

      error: (error) => {
        console.error('LOAD USERS ERROR:', error);
        this.isLoading = false;
      },
    });
  }

  loadBookings(): void {
    this.bookingService.getBookings().subscribe({
      next: (page) => {
        this.bookings = page.content;

        this.cd.detectChanges();

        console.log('BOOKINGS FROM BACKEND:', this.bookings);
      },

      error: (error) => {
        console.error('LOAD BOOKINGS ERROR:', error);
      },
    });
  }
}
