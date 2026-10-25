import { Routes } from '@angular/router';

import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { VenuesComponent } from './pages/venues/venues.component';
import { EventsComponent } from './pages/events/events.component';
import { BookingComponent } from './pages/booking/booking.component';
import { MyBookingsComponent } from './pages/my-bookings/my-bookings.component';
import { TicketsComponent } from './pages/tickets/tickets.component';
import { PaymentComponent } from './pages/payment/payment.component';

// Provider Portal Components & Guard
import { ProviderLoginComponent } from './pages/provider/provider-login.component';
import { ProviderRegisterComponent } from './pages/provider/provider-register.component';
import { ProviderDashboardComponent } from './pages/provider/provider-dashboard.component';
import { providerGuard } from './guards/provider.guard';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [

  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },

  {
    path: 'login',
    component: LoginComponent
  },

  {
    path: 'register',
    component: RegisterComponent
  },

  // Provider / Host Portal
  {
    path: 'provider/login',
    component: ProviderLoginComponent
  },

  {
    path: 'provider/register',
    component: ProviderRegisterComponent
  },

  {
    path: 'provider/dashboard',
    component: ProviderDashboardComponent,
    canActivate: [providerGuard]
  },

  // Customer Portal
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard]
  },

  {
    path: 'venues',
    component: VenuesComponent,
    canActivate: [authGuard]
  },

  {
    path: 'events',
    component: EventsComponent,
    canActivate: [authGuard]
  },

  {
    path: 'booking/:id',
    component: BookingComponent,
    canActivate: [authGuard]
  },

  {
    path: 'my-bookings',
    component: MyBookingsComponent,
    canActivate: [authGuard]
  },

  {
    path: 'tickets',
    component: TicketsComponent,
    canActivate: [authGuard]
  },

  {
    path: 'payment/:bookingId',
    component: PaymentComponent,
    canActivate: [authGuard]
  },

  {
    path: '**',
    redirectTo: 'login'
  }

];
