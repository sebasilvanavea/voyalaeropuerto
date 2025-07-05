import { Routes } from '@angular/router';
import { PreloadAllModules } from '@angular/router';

export const routes: Routes = [
  { 
    path: '', 
    loadComponent: () => import('./components/home/home.component').then(m => m.HomeComponent),
    title: 'VoyalAeropuerto - Traslados al Aeropuerto'
  },
  { 
    path: 'precios', 
    loadComponent: () => import('./components/pricing-table/pricing-page.component').then(m => m.PricingPageComponent),
    title: 'Tarifas y Precios - VoyalAeropuerto'
  },
  // Rutas comentadas para mantener todo en una sola página con scroll
  // { 
  //   path: 'cotizar', 
  //   loadComponent: () => import('./components/quote/quote-page.component').then(m => m.QuotePageComponent),
  //   title: 'Cotización - VoyalAeropuerto'
  // },
  // { 
  //   path: 'reservar', 
  //   loadComponent: () => import('./components/booking/booking-page.component').then(m => m.BookingPageComponent),
  //   title: 'Reservar - VoyalAeropuerto'
  // },
  { 
    path: 'booking-steps', 
    loadComponent: () => import('./components/booking/booking-steps.component').then(m => m.BookingStepsComponent),
    title: 'Proceso de Reserva - VoyalAeropuerto'
  },
  { 
    path: 'booking-success', 
    loadComponent: () => import('./components/booking/booking-success.component').then(m => m.BookingSuccessComponent),
    title: 'Reserva Confirmada - VoyalAeropuerto'
  },
  {
    path: 'tracking/:id',
    loadComponent: () => import('./components/tracking/trip-tracking.component').then(m => m.TripTrackingComponent),
    title: 'Seguimiento de Viaje - VoyalAeropuerto'
  },
  {
    path: 'admin',
    loadComponent: () => import('./components/admin/admin-dashboard.component').then(m => m.AdminDashboardComponent),
    title: 'Panel de Administración',
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./components/admin/admin-dashboard.component').then(m => m.AdminDashboardComponent)
      },
      {
        path: 'bookings',
        loadComponent: () => import('./components/admin/admin-bookings.component').then(m => m.AdminBookingsComponent)
      },
      {
        path: 'drivers',
        loadComponent: () => import('./components/admin/admin-drivers.component').then(m => m.AdminDriversComponent)
      },
      {
        path: 'users',
        loadComponent: () => import('./components/admin/admin-users.component').then(m => m.AdminUsersComponent)
      },
      {
        path: 'analytics',
        loadComponent: () => import('./components/admin/admin-analytics.component').then(m => m.AdminAnalyticsComponent)
      },
      {
        path: 'payments',
        loadComponent: () => import('./components/admin/admin-payments.component').then(m => m.AdminPaymentsComponent)
      },
      {
        path: 'promotions',
        loadComponent: () => import('./components/admin/admin-promotions.component').then(m => m.AdminPromotionsComponent)
      },
      {
        path: 'support',
        loadComponent: () => import('./components/admin/admin-support.component').then(m => m.AdminSupportComponent)
      },
      {
        path: 'settings',
        loadComponent: () => import('./components/admin/admin-settings.component').then(m => m.AdminSettingsComponent)
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  },
  { 
    path: '**', 
    redirectTo: '' 
  }
];

export const routingConfig = {
  preloadingStrategy: PreloadAllModules,
  scrollPositionRestoration: 'enabled',
  paramsInheritanceStrategy: 'always',
  anchorScrolling: 'enabled'
};