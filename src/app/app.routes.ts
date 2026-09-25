import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Dashboard } from './pages/dashboard/dashboard';
import { CreateBooking} from './pages/create-booking/create-booking';
import { BookingDetail } from './pages/booking-detail/booking-detail';

export const routes: Routes = [
  {
    path: 'login',
    component: Login,
  },
  {
    path: 'dashboard',
    component: Dashboard,
  },
  {
    path: 'create-booking',
    component: CreateBooking,
  },
  {
    path: 'bookings/:id',
    component: BookingDetail,
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
];
