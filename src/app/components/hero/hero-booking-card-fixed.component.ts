import { Component, OnInit, AfterViewInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { trigger, state, style, transition, animate, keyframes, query, stagger } from '@angular/animations';
import { LoadingComponent } from '../loading/loading.component';
import { UINotificationService } from '../../services/ui-notification.service';

@Component({
  selector: 'app-hero-booking-card',
  standalone: true,
  imports: [CommonModule, TranslateModule, LoadingComponent],
  animations: [
    trigger('cardEntry', [
      state('hidden', style({
        opacity: 0,
        transform: 'translateY(50px) scale(0.9)',
        filter: 'blur(10px)'
      })),
      state('visible', style({
        opacity: 1,
        transform: 'translateY(0px) scale(1)',
        filter: 'blur(0px)'
      })),
      transition('hidden => visible', [
        animate('800ms cubic-bezier(0.25, 0.46, 0.45, 0.94)')
      ])
    ]),
    trigger('staggeredFadeIn', [
      transition('* => *', [
        query('.animate-item', [
          style({ opacity: 0, transform: 'translateY(20px)' }),
          stagger(150, [
            animate('600ms cubic-bezier(0.25, 0.46, 0.45, 0.94)', 
              style({ opacity: 1, transform: 'translateY(0px)' }))
          ])
        ], { optional: true })
      ])
    ]),
    trigger('shimmer', [
      transition('* => *', [
        animate('1500ms ease-in-out', keyframes([
          style({ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)', offset: 0 }),
          style({ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)', offset: 1 })
        ]))
      ])
    ]),
    trigger('pulseIcon', [
      transition('* => *', [
        animate('2000ms ease-in-out', keyframes([
          style({ transform: 'scale(1)', opacity: 1, offset: 0 }),
          style({ transform: 'scale(1.1)', opacity: 0.8, offset: 0.5 }),
          style({ transform: 'scale(1)', opacity: 1, offset: 1 })
        ]))
      ])
    ]),
    trigger('buttonHover', [
      state('normal', style({ transform: 'scale(1)' })),
      state('hovered', style({ transform: 'scale(1.02) translateY(-2px)' })),
      transition('normal <=> hovered', animate('200ms cubic-bezier(0.4, 0, 0.2, 1)'))
    ])
  ],
  template: `
    <div class="hero-booking-card" 
         [@cardEntry]="cardState"
         [@staggeredFadeIn]="animationTrigger">
      
      <!-- Loading State -->
      <div *ngIf="isLoading" class="loading-overlay">
        <div class="loading-spinner">
          <div class="spinner-ring"></div>
          <div class="spinner-ring"></div>
          <div class="spinner-ring"></div>
        </div>
        <p class="loading-text">{{ 'LOADING.PREPARING' | translate }}</p>
      </div>

      <!-- Card Header -->
      <div class="card-header animate-item">
        <div class="flex items-center space-x-3 mb-4">
          <div class="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center icon-container" 
               [@pulseIcon]="iconPulse">
            <svg class="w-5 h-5 text-yellow-600 airplane-icon" fill="currentColor" viewBox="0 0 24 24">
              <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
            </svg>
          </div>
          <div>
            <h3 class="text-lg font-bold text-gray-900 title-text">{{ 'BOOKING_CARD.TITLE' | translate }}</h3>
            <p class="text-sm text-yellow-600 subtitle-text">{{ 'BOOKING_CARD.SUBTITLE' | translate }}</p>
          </div>
        </div>
      </div>

      <!-- Quick Booking Steps -->
      <div class="space-y-4 mb-6">
        <div class="booking-step animate-item" 
             *ngFor="let step of bookingSteps; let i = index"
             [style.animation-delay]="(i * 100) + 'ms'">
          <div class="step-icon">
            <svg class="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" [attr.d]="step.iconPath"/>
            </svg>
          </div>
          <div class="step-content">
            <span class="step-title">{{ step.title | translate }}</span>
            <span class="step-desc">{{ step.description | translate }}</span>
          </div>
          <div class="step-progress-line" [class.active]="i <= currentStep"></div>
        </div>
      </div>

      <!-- Features -->
      <div class="features-grid animate-item">
        <div class="feature-item animate-item" 
             *ngFor="let feature of features; let i = index"
             [style.animation-delay]="(i * 50) + 'ms'">
          <svg class="w-4 h-4 text-yellow-600 feature-check" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
          </svg>
          <span>{{ feature | translate }}</span>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="action-buttons animate-item">
        <button 
          (click)="startBooking()"
          (mouseenter)="primaryButtonState = 'hovered'"
          (mouseleave)="primaryButtonState = 'normal'"
          [@buttonHover]="primaryButtonState"
          class="primary-button">
          <span class="relative z-10 flex items-center justify-center space-x-2">
            <svg class="w-5 h-5 book-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0h6m-6 0l-2 13a2 2 0 002 2h6a2 2 0 002-2L14 7"/>
            </svg>
            <span>{{ 'BOOKING_CARD.BOOK_NOW' | translate }}</span>
          </span>
          <div class="button-overlay"></div>
          <div class="button-shine"></div>
        </button>
        
        <button 
          (click)="quickQuote()"
          (mouseenter)="secondaryButtonState = 'hovered'"
          (mouseleave)="secondaryButtonState = 'normal'"
          [@buttonHover]="secondaryButtonState"
          class="secondary-button">
          <svg class="w-4 h-4 mr-2 price-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
          </svg>
          {{ 'BOOKING_CARD.VIEW_PRICES' | translate }}
        </button>
      </div>

      <!-- Trust Badge -->
      <div class="trust-badge animate-item">
        <div class="flex items-center justify-center space-x-2 text-xs text-gray-600">
          <svg class="w-4 h-4 shield-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
          </svg>
          <span>{{ 'BOOKING_CARD.SECURE_BOOKING' | translate }}</span>
        </div>
      </div>
    </div>

    <!-- Loading Component -->
    <app-loading 
      [isVisible]="isLoading"
      [loadingTitle]="'LOADING.BOOKING_TITLE'"
      [showProgress]="true"
      [steps]="loadingSteps">
    </app-loading>
  `,
  styles: [`
    /* Loading Overlay */
    .loading-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(10px);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      z-index: 10;
      border-radius: inherit;
    }

    .loading-spinner {
      position: relative;
      width: 60px;
      height: 60px;
      margin-bottom: 1rem;
    }

    .spinner-ring {
      position: absolute;
      width: 100%;
      height: 100%;
      border: 3px solid transparent;
      border-top: 3px solid #f59e0b;
      border-radius: 50%;
      animation: spin 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
    }

    .spinner-ring:nth-child(1) { animation-delay: -0.45s; }
    .spinner-ring:nth-child(2) { animation-delay: -0.3s; transform: scale(0.8); }
    .spinner-ring:nth-child(3) { animation-delay: -0.15s; transform: scale(0.6); }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .loading-text {
      color: #374151;
      font-size: 0.875rem;
      font-weight: 600;
      animation: pulse 2s infinite;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.6; }
    }

    /* Enhanced Card Animations */
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
      position: relative;
      overflow: hidden;
    }

    .hero-booking-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
      transition: left 0.5s;
      z-index: 1;
    }

    .hero-booking-card:hover::before {
      left: 100%;
    }

    .hero-booking-card:hover {
      transform: translateY(-4px) scale(1.02);
      box-shadow: 
        0 8px 32px rgba(0, 0, 0, 0.12),
        0 32px 64px -12px rgba(251, 191, 36, 0.25);
    }

    /* Icon Animations */
    .icon-container {
      position: relative;
      overflow: hidden;
    }

    .airplane-icon {
      transition: transform 0.3s ease;
    }

    .icon-container:hover .airplane-icon {
      transform: translateX(2px) rotate(5deg);
    }

    /* Text Animations */
    .title-text {
      background: linear-gradient(45deg, #111827, #374151, #111827);
      background-size: 200% 200%;
      background-clip: text;
      -webkit-background-clip: text;
      animation: textShimmer 3s ease-in-out infinite;
    }

    @keyframes textShimmer {
      0%, 100% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
    }

    .subtitle-text {
      position: relative;
      overflow: hidden;
    }

    .subtitle-text::after {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(245, 158, 11, 0.3), transparent);
      animation: subtitleShine 2s ease-in-out infinite;
    }

    @keyframes subtitleShine {
      0% { left: -100%; }
      100% { left: 100%; }
    }

    /* Enhanced Step Animations */
    .booking-step {
      display: flex;
      align-items: center;
      padding: clamp(0.5rem, 2vw, 0.75rem);
      background: rgba(251, 191, 36, 0.06);
      border-radius: clamp(0.5rem, 1.5vw, 0.75rem);
      border: 1px solid rgba(251, 191, 36, 0.12);
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      margin-bottom: clamp(0.5rem, 1.5vw, 0.75rem);
      position: relative;
      overflow: hidden;
    }

    .booking-step::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(251, 191, 36, 0.1), transparent);
      transition: left 0.6s ease;
    }

    .booking-step:hover::before {
      left: 100%;
    }

    .booking-step:hover {
      background: rgba(251, 191, 36, 0.12);
      border-color: rgba(251, 191, 36, 0.25);
      transform: translateX(clamp(2px, 1vw, 4px)) scale(1.02);
      box-shadow: 0 4px 12px rgba(251, 191, 36, 0.15);
    }

    .step-progress-line {
      position: absolute;
      bottom: 0;
      left: 0;
      height: 2px;
      width: 0;
      background: linear-gradient(90deg, #f59e0b, #f97316);
      transition: width 0.8s ease-in-out;
    }

    .step-progress-line.active {
      width: 100%;
    }

    /* Enhanced Icons */
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
      position: relative;
      overflow: hidden;
    }

    .step-icon::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      width: 0;
      height: 0;
      background: radial-gradient(circle, rgba(245, 158, 11, 0.3) 0%, transparent 70%);
      transition: all 0.3s ease;
      transform: translate(-50%, -50%);
    }

    .booking-step:hover .step-icon::before {
      width: 100%;
      height: 100%;
    }

    /* Feature Animations */
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
      padding: 0.25rem;
      border-radius: 0.375rem;
      transition: all 0.3s ease;
    }

    .feature-item:hover {
      background: rgba(251, 191, 36, 0.1);
      transform: translateX(2px);
    }

    .feature-check {
      width: clamp(0.75rem, 2vw, 1rem);
      height: clamp(0.75rem, 2vw, 1rem);
      margin-right: clamp(0.375rem, 1vw, 0.5rem);
      flex-shrink: 0;
      animation: checkPulse 2s ease-in-out infinite;
    }

    @keyframes checkPulse {
      0%, 100% { transform: scale(1); opacity: 1; }
      50% { transform: scale(1.1); opacity: 0.8; }
    }

    /* Enhanced Button Animations */
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
      box-shadow: 
        0 8px 32px rgba(245, 158, 11, 0.4),
        inset 0 1px 0 rgba(255, 255, 255, 0.3);
    }

    .primary-button:active {
      transform: scale(0.98);
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

    .button-shine {
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
      transition: left 0.6s ease;
    }

    .primary-button:hover .button-shine {
      left: 100%;
    }

    .book-icon {
      transition: transform 0.3s ease;
    }

    .primary-button:hover .book-icon {
      transform: rotate(5deg) scale(1.1);
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
      position: relative;
      overflow: hidden;
    }

    .secondary-button::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(156, 163, 175, 0.1), transparent);
      transition: left 0.5s ease;
    }

    .secondary-button:hover::before {
      left: 100%;
    }

    .secondary-button:hover {
      background: rgba(249, 250, 251, 1);
      border-color: rgba(156, 163, 175, 0.5);
      transform: translateY(-1px) scale(1.02);
    }

    .price-icon {
      transition: transform 0.3s ease;
    }

    .secondary-button:hover .price-icon {
      transform: translateX(2px) scale(1.1);
    }

    /* Trust Badge Animations */
    .trust-badge {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: clamp(0.5rem, 2vw, 0.75rem);
      background: rgba(16, 185, 129, 0.08);
      border-radius: clamp(0.375rem, 1vw, 0.5rem);
      border: 1px solid rgba(16, 185, 129, 0.2);
      position: relative;
      overflow: hidden;
    }

    .trust-badge::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(16, 185, 129, 0.1), transparent);
      animation: trustShine 3s ease-in-out infinite;
    }

    @keyframes trustShine {
      0% { left: -100%; }
      50% { left: 100%; }
      100% { left: -100%; }
    }

    .shield-icon {
      width: clamp(0.875rem, 2vw, 1rem);
      height: clamp(0.875rem, 2vw, 1rem);
      color: #10b981;
      margin-right: clamp(0.25rem, 1vw, 0.5rem);
      animation: shieldPulse 2s ease-in-out infinite;
    }

    @keyframes shieldPulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.05); }
    }

    /* Animate Items */
    .animate-item {
      opacity: 0;
      transform: translateY(20px);
      animation: fadeInUp 0.6s ease-out forwards;
    }

    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    /* Staggered animations */
    .animate-item:nth-child(1) { animation-delay: 0.1s; }
    .animate-item:nth-child(2) { animation-delay: 0.2s; }
    .animate-item:nth-child(3) { animation-delay: 0.3s; }
    .animate-item:nth-child(4) { animation-delay: 0.4s; }
    .animate-item:nth-child(5) { animation-delay: 0.5s; }

    /* Responsive Card Header */
    .card-header {
      border-bottom: 1px solid rgba(251, 191, 36, 0.15);
      padding-bottom: clamp(0.75rem, 2vw, 1rem);
      margin-bottom: clamp(1rem, 3vw, 1.5rem);
      position: relative;
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

    .trust-badge span {
      font-size: clamp(0.7rem, 2vw, 0.75rem);
      font-weight: 600;
      color: #047857;
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
    .secondary-button,
    .booking-step {
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
      .secondary-button,
      .animate-item,
      .feature-check,
      .shield-icon {
        animation: none;
        transition: none;
      }

      .booking-step:hover,
      .primary-button:hover,
      .secondary-button:hover {
        transform: none;
      }

      .hero-booking-card::before,
      .booking-step::before,
      .button-shine,
      .trust-badge::before {
        display: none;
      }
    }
  `]
})
export class HeroBookingCardComponent implements OnInit, AfterViewInit, OnDestroy {
  
  // Output events
  @Output() openBookingModal = new EventEmitter<void>();
  
  // Animation states
  cardState = 'hidden';
  animationTrigger = 0;
  iconPulse = 0;
  isLoading = true;
  currentStep = 0;
  
  // Button states for animations
  primaryButtonState = 'normal';
  secondaryButtonState = 'normal';
  
  // Loading steps for component
  loadingSteps: string[] = [
    'LOADING.INITIALIZING_APP',
    'LOADING.LOADING_CONTENT',
    'LOADING.PREPARING_ANIMATIONS',
    'LOADING.FINALIZING'
  ];
  
  // Data for dynamic content
  bookingSteps = [
    {
      title: 'BOOKING_CARD.STEP_1_TITLE',
      description: 'BOOKING_CARD.STEP_1_DESC',
      iconPath: 'M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m-6 3l6-3'
    },
    {
      title: 'BOOKING_CARD.STEP_2_TITLE',
      description: 'BOOKING_CARD.STEP_2_DESC',
      iconPath: 'M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4'
    },
    {
      title: 'BOOKING_CARD.STEP_3_TITLE',
      description: 'BOOKING_CARD.STEP_3_DESC',
      iconPath: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
    }
  ];

  features = [
    'BOOKING_CARD.FEATURE_1',
    'BOOKING_CARD.FEATURE_2',
    'BOOKING_CARD.FEATURE_3',
    'BOOKING_CARD.FEATURE_4'
  ];

  private animationTimeouts: any[] = [];

  constructor(
    private router: Router,
    private notificationService: UINotificationService
  ) {}

  ngOnInit(): void {
    this.initializeLoadingSequence();
  }

  ngAfterViewInit(): void {
    // Start entrance animations after view is ready
    setTimeout(() => {
      this.startEntranceAnimations();
    }, 100);
  }

  ngOnDestroy(): void {
    // Clean up timeouts
    this.animationTimeouts.forEach(timeout => clearTimeout(timeout));
  }

  private initializeLoadingSequence(): void {
    // Simulate realistic loading process
    const loadingSteps = [
      { duration: 500, message: 'LOADING.INITIALIZING' },
      { duration: 800, message: 'LOADING.LOADING_DATA' },
      { duration: 600, message: 'LOADING.PREPARING_UI' }
    ];

    let totalTime = 0;
    
    loadingSteps.forEach((step, index) => {
      totalTime += step.duration;
      
      const timeout = setTimeout(() => {
        if (index === loadingSteps.length - 1) {
          // Last step - finish loading
          this.finishLoading();
        }
      }, totalTime);
      
      this.animationTimeouts.push(timeout);
    });
  }

  private finishLoading(): void {
    this.isLoading = false;
    
    // Start card entrance animation
    const timeout = setTimeout(() => {
      this.cardState = 'visible';
      this.startSequentialAnimations();
    }, 200);
    
    this.animationTimeouts.push(timeout);
  }

  private startEntranceAnimations(): void {
    // Trigger staggered animations
    this.animationTrigger++;
    
    // Start icon pulse animation
    const iconTimeout = setTimeout(() => {
      this.iconPulse++;
    }, 800);
    
    this.animationTimeouts.push(iconTimeout);
  }

  private startSequentialAnimations(): void {
    // Progressive step completion animation
    let stepDelay = 1000;
    
    this.bookingSteps.forEach((_, index) => {
      const timeout = setTimeout(() => {
        this.currentStep = index;
      }, stepDelay * (index + 1));
      
      this.animationTimeouts.push(timeout);
    });

    // Continue icon pulsing
    this.startContinuousIconAnimation();
  }

  private startContinuousIconAnimation(): void {
    const pulseInterval = setInterval(() => {
      this.iconPulse++;
    }, 3000);

    // Store interval reference for cleanup
    this.animationTimeouts.push(pulseInterval);
  }

  startBooking(): void {
    // Add loading state to button
    this.primaryButtonState = 'hovered';
    
    // Emit event to open the booking modal
    setTimeout(() => {
      this.openBookingModal.emit();
      this.primaryButtonState = 'normal';
    }, 300);
  }

  closeBookingModal(): void {
    // Method kept for compatibility but not used
  }

  onBookingComplete(bookingData: any): void {
    console.log('Booking completed:', bookingData);
    
    // Show success notification
    this.notificationService.showSuccess(
      '¡Reserva completada con éxito!', 
      'Recibirás un email de confirmación en los próximos minutos.'
    );
    
    // Optionally navigate to a confirmation page after a delay
    // setTimeout(() => {
    //   this.router.navigate(['/booking-confirmation'], { state: { booking: bookingData } });
    // }, 3000);
  }

  quickQuote(): void {
    // Add hover state animation
    this.secondaryButtonState = 'hovered';
    
    // Reset state after animation
    const resetTimeout = setTimeout(() => {
      this.secondaryButtonState = 'normal';
    }, 300);
    
    this.animationTimeouts.push(resetTimeout);

    // Scroll to quote section with smooth animation
    const element = document.getElementById('cotizar');
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      // Custom smooth scroll with easing
      this.smoothScrollTo(offsetPosition, 1000);
    }
  }

  private smoothScrollTo(target: number, duration: number): void {
    const start = window.pageYOffset;
    const distance = target - start;
    let startTime: number | null = null;

    const easeInOutCubic = (t: number): number => {
      return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
    };

    const animateScroll = (currentTime: number) => {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / duration, 1);
      const ease = easeInOutCubic(progress);
      
      window.scrollTo(0, start + distance * ease);
      
      if (progress < 1) {
        requestAnimationFrame(animateScroll);
      }
    };

    requestAnimationFrame(animateScroll);
  }
}
