import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Dashboard } from './pages/dashboard/dashboard';
import { CreateBooking} from './pages/create-booking/create-booking';
import { BookingDetail } from './pages/booking-detail/booking-detail';
import { Landing } from './pages/landing/landing';
import { Register } from './pages/register/register';
import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [
  {
    path: 'login',
    component: Login,
  },
  {
    path: 'register',
    component: Register,
  },
  {
    path: 'dashboard',
    component: Dashboard,
    canActivate: [authGuard],
  },
  {
    path: 'create-booking',
    component: CreateBooking,
    canActivate: [authGuard],
  },
  {
    path: 'bookings/:id',
    component: BookingDetail,
    canActivate: [authGuard],
  },
  {
    path: '',
    component: Landing,
  },
];
