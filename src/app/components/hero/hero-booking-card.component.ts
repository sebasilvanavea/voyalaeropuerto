import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-hero-booking-card',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  template: `
    <div class="hero-booking-card">
      <!-- Card Header -->
      <div class="card-header">
        <div class="flex items-center space-x-3 mb-4">
          <div class="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center">
            <svg class="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
            </svg>
          </div>
          <div>
            <h3 class="text-lg font-bold text-gray-900">Reserva tu Traslado</h3>
            <p class="text-sm text-yellow-600">Rápido y seguro</p>
          </div>
        </div>
      </div>

      <!-- Quick Booking Steps -->
      <div class="space-y-4 mb-6">
        <div class="booking-step">
          <div class="step-icon">
            <svg class="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m-6 3l6-3"/>
            </svg>
          </div>
          <div class="step-content">
            <span class="step-title">Elige tu ruta</span>
            <span class="step-desc">Aeropuerto ↔ Destino</span>
          </div>
        </div>

        <div class="booking-step">
          <div class="step-icon">
            <svg class="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/>
            </svg>
          </div>
          <div class="step-content">
            <span class="step-title">Selecciona vehículo</span>
            <span class="step-desc">Sedan, SUV o Van</span>
          </div>
        </div>

        <div class="booking-step">
          <div class="step-icon">
            <svg class="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <div class="step-content">
            <span class="step-title">Fecha y hora</span>
            <span class="step-desc">Disponible 24/7</span>
          </div>
        </div>
      </div>

      <!-- Features -->
      <div class="features-grid">
        <div class="feature-item">
          <svg class="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
          </svg>
          <span>Precios fijos</span>
        </div>
        <div class="feature-item">
          <svg class="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
          </svg>
          <span>Sin sorpresas</span>
        </div>
        <div class="feature-item">
          <svg class="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
          </svg>
          <span>Puntualidad</span>
        </div>
        <div class="feature-item">
          <svg class="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
          </svg>
          <span>Seguimiento</span>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="action-buttons">
        <button 
          (click)="startBooking()"
          class="primary-button">
          <span class="relative z-10 flex items-center justify-center space-x-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0h6m-6 0l-2 13a2 2 0 002 2h6a2 2 0 002-2L14 7"/>
            </svg>
            <span>Reservar Ahora</span>
          </span>
          <div class="button-overlay"></div>
        </button>
        
        <button 
          (click)="quickQuote()"
          class="secondary-button">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
          </svg>
          Ver Precios
        </button>
      </div>

      <!-- Trust Badge -->
      <div class="trust-badge">
        <div class="flex items-center justify-center space-x-2 text-xs text-gray-600">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
          </svg>
          <span>Reserva 100% segura</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    /* Responsive Booking Card */
    .hero-booking-card {
      background: rgba(255, 255, 255, 0.98);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid rgba(251, 191, 36, 0.2);
      border-radius: clamp(1rem, 2vw, 1.5rem);
      padding: clamp(1.25rem, 4vw, 2rem);
      box-shadow: 
        0 4px 20px rgba(0, 0, 0, 0.08),
        0 25px 50px -12px rgba(251, 191, 36, 0.15);
      max-width: min(95vw, 400px);
      width: 100%;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      will-change: transform;
    }

    .hero-booking-card:hover {
      transform: translateY(-4px);
      box-shadow: 
        0 8px 32px rgba(0, 0, 0, 0.12),
        0 32px 64px -12px rgba(251, 191, 36, 0.25);
    }

    /* Responsive Card Header */
    .card-header {
      border-bottom: 1px solid rgba(251, 191, 36, 0.15);
      padding-bottom: clamp(0.75rem, 2vw, 1rem);
      margin-bottom: clamp(1rem, 3vw, 1.5rem);
    }

    .card-header h3 {
      font-size: clamp(1rem, 3vw, 1.125rem);
      font-weight: 700;
      color: #111827;
      margin: 0;
    }

    .card-header p {
      font-size: clamp(0.8rem, 2.5vw, 0.875rem);
      color: #f59e0b;
      font-weight: 600;
      margin: 0;
    }

    /* Responsive Booking Steps */
    .booking-step {
      display: flex;
      align-items: center;
      padding: clamp(0.5rem, 2vw, 0.75rem);
      background: rgba(251, 191, 36, 0.06);
      border-radius: clamp(0.5rem, 1.5vw, 0.75rem);
      border: 1px solid rgba(251, 191, 36, 0.12);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      margin-bottom: clamp(0.5rem, 1.5vw, 0.75rem);
    }

    .booking-step:hover {
      background: rgba(251, 191, 36, 0.12);
      border-color: rgba(251, 191, 36, 0.25);
      transform: translateX(clamp(2px, 1vw, 4px));
    }

    .step-icon {
      width: clamp(1.75rem, 4vw, 2rem);
      height: clamp(1.75rem, 4vw, 2rem);
      background: rgba(251, 191, 36, 0.2);
      border-radius: clamp(0.375rem, 1vw, 0.5rem);
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: clamp(0.5rem, 2vw, 0.75rem);
      flex-shrink: 0;
    }

    .step-icon svg {
      width: clamp(0.875rem, 2.5vw, 1rem);
      height: clamp(0.875rem, 2.5vw, 1rem);
    }

    .step-content {
      display: flex;
      flex-direction: column;
      min-width: 0;
      flex: 1;
    }

    .step-title {
      color: #111827;
      font-weight: 600;
      font-size: clamp(0.75rem, 2.5vw, 0.875rem);
      line-height: 1.2;
      margin-bottom: 0.125rem;
    }

    .step-desc {
      color: #6b7280;
      font-size: clamp(0.7rem, 2vw, 0.75rem);
      line-height: 1.3;
    }

    /* Responsive Features Grid */
    .features-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: clamp(0.5rem, 2vw, 0.75rem);
      margin-bottom: clamp(1rem, 3vw, 1.5rem);
      padding: clamp(0.75rem, 3vw, 1rem);
      background: rgba(251, 191, 36, 0.06);
      border-radius: clamp(0.5rem, 1.5vw, 0.75rem);
      border: 1px solid rgba(251, 191, 36, 0.12);
    }

    .feature-item {
      display: flex;
      align-items: center;
      font-size: clamp(0.7rem, 2vw, 0.75rem);
      font-weight: 600;
      color: #374151;
      line-height: 1.2;
    }

    .feature-item svg {
      width: clamp(0.75rem, 2vw, 1rem);
      height: clamp(0.75rem, 2vw, 1rem);
      margin-right: clamp(0.375rem, 1vw, 0.5rem);
      flex-shrink: 0;
    }

    /* Responsive Action Buttons */
    .action-buttons {
      display: flex;
      flex-direction: column;
      gap: clamp(0.5rem, 2vw, 0.75rem);
      margin-bottom: clamp(0.75rem, 2vw, 1rem);
    }

    .primary-button {
      position: relative;
      width: 100%;
      min-height: clamp(44px, 10vw, 48px);
      background: linear-gradient(135deg, #f59e0b 0%, #f97316 100%);
      color: white;
      border: none;
      border-radius: clamp(0.5rem, 1.5vw, 0.75rem);
      font-weight: 600;
      font-size: clamp(0.875rem, 2.5vw, 1rem);
      cursor: pointer;
      overflow: hidden;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 
        0 4px 16px rgba(245, 158, 11, 0.25),
        inset 0 1px 0 rgba(255, 255, 255, 0.2);
    }

    .primary-button:hover {
      transform: translateY(-2px) scale(1.02);
      box-shadow: 
        0 8px 32px rgba(245, 158, 11, 0.4),
        inset 0 1px 0 rgba(255, 255, 255, 0.3);
    }

    .primary-button:active {
      transform: translateY(0) scale(0.98);
    }

    .button-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, transparent 100%);
      pointer-events: none;
    }

    .secondary-button {
      width: 100%;
      min-height: clamp(40px, 9vw, 44px);
      background: rgba(255, 255, 255, 0.8);
      color: #374151;
      border: 1.5px solid rgba(156, 163, 175, 0.3);
      border-radius: clamp(0.5rem, 1.5vw, 0.75rem);
      font-weight: 600;
      font-size: clamp(0.8rem, 2.2vw, 0.875rem);
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .secondary-button:hover {
      background: rgba(249, 250, 251, 1);
      border-color: rgba(156, 163, 175, 0.5);
      transform: translateY(-1px);
    }

    .secondary-button svg {
      width: clamp(0.875rem, 2vw, 1rem);
      height: clamp(0.875rem, 2vw, 1rem);
    }

    /* Trust Badge */
    .trust-badge {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: clamp(0.5rem, 2vw, 0.75rem);
      background: rgba(16, 185, 129, 0.08);
      border-radius: clamp(0.375rem, 1vw, 0.5rem);
      border: 1px solid rgba(16, 185, 129, 0.2);
    }

    .trust-badge span {
      font-size: clamp(0.7rem, 2vw, 0.75rem);
      font-weight: 600;
      color: #047857;
    }

    .trust-badge svg {
      width: clamp(0.875rem, 2vw, 1rem);
      height: clamp(0.875rem, 2vw, 1rem);
      color: #10b981;
      margin-right: clamp(0.25rem, 1vw, 0.5rem);
    }

    /* Mobile Optimizations */
    @media (max-width: 480px) {
      .hero-booking-card {
        margin: 0 0.75rem;
        border-radius: 1rem;
      }

      .features-grid {
        grid-template-columns: 1fr;
      }

      .booking-step {
        padding: 0.625rem;
      }

      .step-icon {
        width: 1.5rem;
        height: 1.5rem;
        margin-right: 0.5rem;
      }
    }

    /* Tablet Optimizations */
    @media (min-width: 768px) and (max-width: 1024px) {
      .hero-booking-card {
        max-width: 380px;
        padding: 1.75rem;
      }

      .features-grid {
        grid-template-columns: 1fr 1fr;
      }
    }

    /* Desktop Optimizations */
    @media (min-width: 1024px) {
      .hero-booking-card {
        max-width: 400px;
        padding: 2rem;
      }

      .action-buttons {
        gap: 0.75rem;
      }
    }

    /* Performance Optimizations */
    .hero-booking-card,
    .primary-button,
    .secondary-button {
      will-change: transform;
      backface-visibility: hidden;
    }

    /* Focus States for Accessibility */
    .primary-button:focus,
    .secondary-button:focus {
      outline: 2px solid #f59e0b;
      outline-offset: 2px;
    }

    /* Reduced Motion Support */
    @media (prefers-reduced-motion: reduce) {
      .hero-booking-card,
      .booking-step,
      .primary-button,
      .secondary-button {
        transition: none;
      }

      .booking-step:hover {
        transform: none;
      }

      .primary-button:hover {
        transform: none;
      }
    }

  `]
})
export class HeroBookingCardComponent {
  
  constructor(private router: Router) {}

  startBooking() {
    this.router.navigate(['/booking-steps']);
  }

  quickQuote() {
    this.router.navigate(['/cotizar']);
  }
}
