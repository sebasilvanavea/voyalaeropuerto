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
    <!-- Simplified Hero Booking Card -->
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
      <div class="space-y-3 mb-6">
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
          <span class="flex items-center justify-center space-x-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0h6m-6 0l-2 13a2 2 0 002 2h6a2 2 0 002-2L14 7"/>
            </svg>
            <span>Reservar Ahora</span>
          </span>
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
          <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
          </svg>
          <span>Reserva 100% segura</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    /* SIMPLIFIED HERO BOOKING CARD - FIXED SIZES ONLY */
    .hero-booking-card {
      background: rgba(255, 255, 255, 0.98);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(251, 191, 36, 0.2);
      border-radius: 1rem;
      padding: 1.5rem;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
      width: 100%;
      max-width: 380px;
      margin: 0 auto;
      position: relative;
      z-index: 30;
    }

    .card-header {
      border-bottom: 1px solid rgba(251, 191, 36, 0.15);
      padding-bottom: 1rem;
      margin-bottom: 1.5rem;
    }

    .booking-step {
      display: flex;
      align-items: center;
      padding: 0.75rem;
      background: rgba(251, 191, 36, 0.06);
      border-radius: 0.5rem;
      border: 1px solid rgba(251, 191, 36, 0.12);
      margin-bottom: 0.75rem;
    }

    .step-icon {
      width: 2rem;
      height: 2rem;
      background: rgba(251, 191, 36, 0.2);
      border-radius: 0.375rem;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 0.75rem;
      flex-shrink: 0;
    }

    .step-content {
      display: flex;
      flex-direction: column;
      flex: 1;
    }

    .step-title {
      color: #111827;
      font-weight: 600;
      font-size: 0.875rem;
      line-height: 1.2;
      margin-bottom: 0.125rem;
    }

    .step-desc {
      color: #6b7280;
      font-size: 0.75rem;
      line-height: 1.3;
    }

    .features-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.75rem;
      margin-bottom: 1.5rem;
      padding: 1rem;
      background: rgba(251, 191, 36, 0.06);
      border-radius: 0.5rem;
      border: 1px solid rgba(251, 191, 36, 0.12);
    }

    .feature-item {
      display: flex;
      align-items: center;
      font-size: 0.75rem;
      font-weight: 600;
      color: #374151;
    }

    .feature-item svg {
      margin-right: 0.5rem;
      flex-shrink: 0;
    }

    .action-buttons {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      margin-bottom: 1rem;
    }

    .primary-button {
      width: 100%;
      min-height: 48px;
      background: linear-gradient(135deg, #f59e0b 0%, #f97316 100%);
      color: white;
      border: none;
      border-radius: 0.5rem;
      font-weight: 600;
      font-size: 1rem;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .primary-button:hover {
      transform: translateY(-1px);
      box-shadow: 0 8px 25px rgba(245, 158, 11, 0.4);
    }

    .secondary-button {
      width: 100%;
      min-height: 44px;
      background: rgba(255, 255, 255, 0.8);
      color: #374151;
      border: 1.5px solid rgba(156, 163, 175, 0.3);
      border-radius: 0.5rem;
      font-weight: 600;
      font-size: 0.875rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
    }

    .secondary-button:hover {
      background: rgba(249, 250, 251, 1);
      border-color: rgba(156, 163, 175, 0.5);
    }

    .trust-badge {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0.75rem;
      background: rgba(16, 185, 129, 0.08);
      border-radius: 0.375rem;
      border: 1px solid rgba(16, 185, 129, 0.2);
    }

    .trust-badge span {
      font-size: 0.75rem;
      font-weight: 600;
      color: #047857;
    }

    /* MOBILE ONLY OVERRIDES */
    @media (max-width: 640px) {
      .hero-booking-card {
        max-width: 100%;
        padding: 1rem;
        margin: 0;
      }

      .features-grid {
        grid-template-columns: 1fr;
        gap: 0.5rem;
        padding: 0.75rem;
      }

      .primary-button {
        min-height: 44px;
        font-size: 0.9rem;
      }

      .secondary-button {
        min-height: 40px;
        font-size: 0.8rem;
      }
    }

    /* TABLET ONLY OVERRIDES */
    @media (min-width: 641px) and (max-width: 1024px) {
      .hero-booking-card {
        max-width: 360px;
        padding: 1.25rem;
      }
    }

    /* DESKTOP ONLY OVERRIDES */
    @media (min-width: 1025px) {
      .hero-booking-card {
        max-width: 380px;
        padding: 1.5rem;
        margin: 0;
      }
    }

    /* LARGE DESKTOP ONLY OVERRIDES */
    @media (min-width: 1280px) {
      .hero-booking-card {
        max-width: 400px;
        padding: 1.75rem;
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
