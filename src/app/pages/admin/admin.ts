import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { UserService, UserResponse } from '../../core/services/user';
import { BookingService } from '../../core/services/booking';
import { BookingResponse } from '../../core/models/booking-response';
import { BookableServiceService, BookableService } from '../../core/services/bookable-service';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [DatePipe, FormsModule, RouterLink],
  templateUrl: './admin.html',
  styleUrl: './admin.css',
})
export class Admin implements OnInit {
  users: UserResponse[] = [];
  isLoading = true;
  bookings: BookingResponse[] = [];
  services: BookableService[] = [];
  myBookings: BookingResponse[] = [];
  newService = {
    name: '',
    description: '',
    durationMinutes: 60,
  };
  showUsers = true;
  showBookings = true;
  showServices = true;
  showMyBookings = true;

  constructor(
    private userService: UserService,
    private bookingService: BookingService,
    private bookableServiceService: BookableServiceService,
    private cd: ChangeDetectorRef,
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loadUsers();
    this.loadBookings();
    this.loadServices();
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

        this.myBookings = page.content.filter(
          (booking) => booking.userId === this.authService.getCurrentUser()?.id,
        );

        this.cd.detectChanges();

        console.log('BOOKINGS FROM BACKEND:', this.bookings);
      },

      error: (error) => {
        console.error('LOAD BOOKINGS ERROR:', error);
      },
    });
  }

  loadServices(): void {
    this.bookableServiceService.getAllServices().subscribe({
      next: (services) => {
        this.services = services;

        this.cd.detectChanges();

        console.log('SERVICES FROM BACKEND:', services);
      },

      error: (error) => {
        console.error('LOAD SERVICES ERROR:', error);
      },
    });
  }
  getUserEmail(userId: number): string {
    const user = this.users.find((user) => user.id === userId);

    return user ? user.email : 'Unknown';
  }

  getServiceName(serviceId: number): string {
    const service = this.services.find((service) => service.id === serviceId);

    return service ? service.name : 'Unknown';
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'CONFIRMED':
        return 'status-confirmed';

      case 'PENDING':
        return 'status-pending';

      case 'CANCELLED':
        return 'status-cancelled';

      default:
        return '';
    }
  }

  getActiveLabel(active: boolean): string {
    return active ? 'Active' : 'Inactive';
  }

  getActiveClass(active: boolean): string {
    return active ? 'status-active' : 'status-inactive';
  }

  toggleService(service: BookableService): void {
    if (service.active) {
      this.bookableServiceService.deactivateService(service.id).subscribe({
        next: () => {
          service.active = false;
          this.cd.detectChanges();
        },

        error: (error) => {
          console.error('DEACTIVATE ERROR:', error);
        },
      });
    } else {
      this.bookableServiceService.activateService(service.id).subscribe({
        next: () => {
          service.active = true;
          this.cd.detectChanges();
        },

        error: (error) => {
          console.error('ACTIVATE ERROR:', error);
        },
      });
    }
  }

  toggleUsers(): void {
    this.showUsers = !this.showUsers;
  }

  toggleMyBookings(): void {
    this.showMyBookings = !this.showMyBookings;
  }

  toggleBookings(): void {
    this.showBookings = !this.showBookings;
  }

  toggleServices(): void {
    this.showServices = !this.showServices;
  }

  confirmBooking(id: number): void {
    this.bookingService.confirmBooking(id).subscribe({
      next: () => {
        this.loadBookings();
      },

      error: (error) => {
        console.error('CONFIRM ERROR:', error);
      },
    });
  }

  cancelBooking(id: number): void {
    this.bookingService.cancelBooking(id).subscribe({
      next: () => {
        this.loadBookings();
      },

      error: (error) => {
        console.error('CANCEL ERROR:', error);
      },
    });
  }

  createService(): void {
    this.bookableServiceService.createService(this.newService).subscribe({
      next: () => {
        this.newService = {
          name: '',
          description: '',
          durationMinutes: 60,
        };

        this.loadServices();
      },

      error: (error) => {
        console.error('CREATE SERVICE ERROR:', error);
      },
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
