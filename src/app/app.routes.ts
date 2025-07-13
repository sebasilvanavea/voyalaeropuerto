import { Routes } from '@angular/router';
import { SmartPreloadingStrategy } from './services/smart-preloading.strategy';

export const routes: Routes = [
  { 
    path: '', 
    loadComponent: () => import('./components/home/home.component').then(m => m.HomeComponent),
    title: 'VoyalAeropuerto - Traslados al Aeropuerto',
    data: { preload: true, critical: true }
  },
  { 
    path: 'precios', 
    loadComponent: () => import('./components/pricing-table/pricing-page.component').then(m => m.PricingPageComponent),
    title: 'Tarifas y Precios - VoyalAeropuerto',
    data: { preload: true, delay: 3000 }
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
    title: 'Proceso de Reserva - VoyalAeropuerto',
    data: { preload: true, critical: true }
  },
  { 
    path: 'booking-success', 
    loadComponent: () => import('./components/booking/booking-success.component').then(m => m.BookingSuccessComponent),
    title: 'Reserva Confirmada - VoyalAeropuerto',
    data: { preload: true, critical: true }
  },
  {
    path: 'tracking/:id',
    loadComponent: () => import('./components/tracking/trip-tracking.component').then(m => m.TripTrackingComponent),
    title: 'Seguimiento de Viaje - VoyalAeropuerto',
    data: { preload: false }
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
  preloadingStrategy: SmartPreloadingStrategy,
  scrollPositionRestoration: 'enabled',
  paramsInheritanceStrategy: 'always',
  anchorScrolling: 'enabled'
};