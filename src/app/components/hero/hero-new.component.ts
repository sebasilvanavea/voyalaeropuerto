import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { HeroBookingCardComponent } from './hero-booking-card-fixed.component';
import { BookingModalComponent } from '../booking-modal/booking-modal.component';
import { BookingModalService } from '../../services/booking-modal.service';
import { OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-hero-new',
  standalone: true,
  imports: [CommonModule, TranslateModule, HeroBookingCardComponent, BookingModalComponent],
  template: `
    <!-- Hero Section - Inicio -->
    <section id="inicio" class="relative min-h-screen flex items-center justify-center overflow-hidden bg-gray-50">
      <!-- Clean Background Pattern -->
      <div class="absolute inset-0 w-full h-full">
        <video 
          autoplay 
          muted 
          loop 
          playsinline
          class="absolute inset-0 w-full h-full object-cover video-background">
          <source src="assets/4.mp4" type="video/mp4">
          <!-- Fallback gradient if video fails to load -->
          <div class="w-full h-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"></div>
        </video>
      </div>
      
      <!-- Enhanced Floating Elements with apiux colors -->
      <div class="absolute top-20 left-10 w-32 h-32 bg-yellow-400/10 rounded-full blur-2xl animate-pulse floating-element"></div>
      <div class="absolute bottom-20 right-10 w-40 h-40 bg-yellow-500/10 rounded-full blur-2xl animate-pulse delay-1000 floating-element"></div>
      <div class="absolute top-1/3 right-1/4 w-24 h-24 bg-amber-400/10 rounded-full blur-2xl animate-pulse delay-500 floating-element"></div>
      
      <!-- Content Container - Two Column Layout -->
      <div class="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16 items-center justify-items-center min-h-[80vh] lg:min-h-[90vh]">
          
          <!-- Left Side - Content & Information -->
          <div class="space-y-6 lg:space-y-8 order-1 lg:order-1 w-full max-w-2xl">
            <!-- Badge -->
            <div class="mb-4 lg:mb-6">
            </div>
            <!-- Main Title inspired by apiux.io -->
            <h1 class="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight hero-title">
              <span class="text-white">
                Transporte
              </span>
              <br>
              <span class="bg-gradient-to-r from-yellow-500 to-amber-500 bg-clip-text text-transparent">
                Confiable
              </span>
              <br>
              <span class="text-white">
                al Aeropuerto
              </span>
              <br>
              <span class="bg-gradient-to-r from-amber-500 to-yellow-600 bg-clip-text text-transparent">
                24/7
              </span>
            </h1>
            
            <!-- Subtitle -->
            <p class="text-xl md:text-2xl text-white leading-relaxed font-medium hero-subtitle max-w-2xl">
              Viaja con tranquilidad desde y hacia el aeropuerto con
              <span class="text-yellow-600 font-semibold"> conductores profesionales</span> y vehículos de primera calidad.
            </p>
            
            <!-- Key Features -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4 py-4 lg:py-6">
              <div class="flex items-center space-x-3">
                <div class="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <svg class="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
                <div>
                  <p class="text-white font-semibold">Puntualidad garantizada</p>
                  <p class="text-white text-sm">Llegamos 15 min antes</p>
                </div>
              </div>
              
              <div class="flex items-center space-x-3">
                <div class="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <svg class="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                  </svg>
                </div>
                <div>
                  <p class="text-white font-semibold">Viajes seguros</p>
                  <p class="text-white text-sm">Conductores verificados</p>
                </div>
              </div>
              
              <div class="flex items-center space-x-3">
                <div class="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <svg class="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"/>
                  </svg>
                </div>
                <div>
                  <p class="text-white font-semibold">Precios transparentes</p>
                  <p class="text-white text-sm">Sin costos ocultos</p>
                </div>
              </div>
              
              <div class="flex items-center space-x-3">
                <div class="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <svg class="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                  </svg>
                </div>
                <div>
                  <p class="text-white font-semibold">Soporte 24/7</p>
                  <p class="text-white text-sm">Asistencia constante</p>
                </div>
              </div>
            </div>
            

            <!-- Trust Indicators -->

          </div>

          <!-- Right Side - Booking Card -->
          <div class="order-2 lg:order-2 w-full flex justify-center lg:justify-center mb-8 lg:mb-0">
            <div class="w-full max-w-sm lg:max-w-md xl:max-w-lg lg:sticky lg:top-24">
              <app-hero-booking-card (openBookingModal)="openBookingModal()"></app-hero-booking-card>
            </div>
          </div>

        </div>
      </div>

      <!-- Clean Scroll Indicator -->
      <div class="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce z-20">
        <div class="bg-yellow-100 rounded-full p-2 border border-yellow-200 shadow-lg">
          <svg class="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"/>
          </svg>
        </div>
      </div>
    </section>

    <!-- Booking Modal Container - Perfect Center Alignment -->
    <div *ngIf="isBookingModalOpen" class="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
      <div class="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <app-booking-modal 
          [isOpen]="isBookingModalOpen"
          (closeEvent)="closeBookingModal()"
          (bookingCompleted)="onBookingCompleted($event)"
        ></app-booking-modal>
      </div>
    </div>
  `,
  styles: [`
    /* Clean Text Shadows for light theme */
    .hero-title {
      text-shadow: 
        0 1px 3px rgba(0, 0, 0, 0.1),
        0 2px 6px rgba(0, 0, 0, 0.05);
      padding-top: 6rem;
    }

    .hero-subtitle {
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
    }

    /* Clean Badge Design with apiux colors */
    .hero-badge {
      background: #fef3c7 !important;
      border: 1px solid #fbbf24 !important;
      box-shadow: 0 4px 16px rgba(251, 191, 36, 0.15);
    }

    /* Modern Button Styles with apiux colors */
    .hero-button-primary {
      background: #f59e0b !important;
      box-shadow: 0 8px 32px rgba(245, 158, 11, 0.25);
      transform: translateY(0);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .hero-button-primary:hover {
      background: #d97706 !important;
      box-shadow: 0 12px 40px rgba(245, 158, 11, 0.35);
      transform: translateY(-2px) scale(1.02);
    }

    .hero-button-secondary {
      background: rgba(243, 244, 246, 0.8) !important;
      border: 2px solid rgba(156, 163, 175, 0.6) !important;
    }

    .hero-button-secondary:hover {
      background: rgba(229, 231, 235, 1) !important;
      border-color: rgba(107, 114, 128, 0.8) !important;
    }

    /* Clean Floating Elements with apiux colors */
    .floating-element {
      animation: float 6s ease-in-out infinite;
    }

    @keyframes float {
      0%, 100% { 
        transform: translateY(0px) scale(1);
        opacity: 0.3;
      }
      50% { 
        transform: translateY(-15px) scale(1.05);
        opacity: 0.5;
      }
    }

    /* Optimized Gradient Text with apiux colors */
    .bg-gradient-to-r.from-yellow-500.to-amber-500 {
      background: linear-gradient(90deg, #f59e0b 0%, #f77316 100%);
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .bg-gradient-to-r.from-amber-500.to-yellow-600 {
      background: linear-gradient(90deg, #f77316 0%, #d97706 100%);
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    /* Responsive Optimizations */
    @media (max-width: 640px) {
      .hero-title {
        font-size: 2.25rem;
        padding-top: 0.5rem;
        text-align: center;
        margin-bottom: 1rem;
        line-height: 1.1;
        letter-spacing: -0.02em;
      }
      
      .hero-subtitle {
        font-size: 1rem;
        text-align: center;
        margin-bottom: 1.5rem;
        padding: 0 1rem;
        line-height: 1.4;
      }

      /* Remove lateral spacing on mobile */
      section {
        padding-left: 1rem;
        padding-right: 1rem;
      }

      /* Optimize mobile grid layout - Perfect Centering */
      .grid.grid-cols-1.lg\\:grid-cols-2 {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 2rem;
        text-align: center;
        padding: 1rem 0;
      }

      /* Mobile content spacing - Centered */
      .space-y-6 {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        width: 100%;
        max-width: 400px;
        margin: 0 auto 2rem auto;
      }

      .space-y-6 > :not([hidden]) ~ :not([hidden]) {
        margin-top: 1.5rem;
      }

      /* Booking card on mobile - Perfect Center */
      .order-2 {
        width: 100%;
        display: flex;
        justify-content: center;
        margin: 0;
        padding: 0 1rem;
      }

      .order-2 > div {
        width: 100%;
        max-width: 380px;
      }

      /* Center key features on mobile - Premium Cards Redesigned */
      .grid.grid-cols-1.sm\\:grid-cols-2 {
        display: grid;
        grid-template-columns: 1fr;
        gap: 1rem;
        width: 100%;
        max-width: 360px;
        margin: 1rem auto;
        padding: 0 0.5rem;
      }

      .grid .flex.items-center {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-start;
        text-align: left;
        width: 100%;
        padding: 1.25rem;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 1.25rem;
        backdrop-filter: blur(20px);
        border: 1px solid rgba(255, 255, 255, 0.15);
        box-shadow: 
          0 4px 20px rgba(0, 0, 0, 0.1),
          0 1px 3px rgba(255, 255, 255, 0.1) inset;
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        position: relative;
        overflow: hidden;
      }

      .grid .flex.items-center::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 1px;
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
      }

      .grid .flex.items-center:hover {
        background: rgba(255, 255, 255, 0.15);
        transform: translateY(-3px) scale(1.02);
        box-shadow: 
          0 12px 40px rgba(0, 0, 0, 0.2),
          0 2px 8px rgba(255, 255, 255, 0.1) inset;
        border-color: rgba(251, 191, 36, 0.3);
      }

      .grid .flex.items-center > div:last-child {
        text-align: left;
        margin-left: 1rem;
        flex: 1;
      }

      .grid .flex.items-center .w-10.h-10 {
        width: 4rem;
        height: 4rem;
        margin: 0;
        background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
        border-radius: 1.25rem;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 
          0 6px 20px rgba(251, 191, 36, 0.5),
          0 3px 6px rgba(0, 0, 0, 0.15);
        flex-shrink: 0;
        position: relative;
      }

      .grid .flex.items-center .w-10.h-10::before {
        content: '';
        position: absolute;
        inset: 0;
        border-radius: 1.25rem;
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.3), transparent);
        pointer-events: none;
      }

      .grid .flex.items-center .w-10.h-10 svg {
        width: 2rem;
        height: 2rem;
        color: #ffffff;
        filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
      }

      .grid .flex.items-center .space-x-3 {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 1rem;
        width: 100%;
      }

      /* Typography improvements for mobile */
      .grid .flex.items-center p.font-semibold {
        font-size: 1rem;
        font-weight: 600;
        color: #ffffff;
        margin-bottom: 0.25rem;
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
      }

      .grid .flex.items-center p.text-sm {
        font-size: 0.875rem;
        color: rgba(255, 255, 255, 0.8);
        line-height: 1.3;
        text-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
      }
    }

    @media (min-width: 641px) and (max-width: 1024px) {
      .hero-title {
        font-size: 3rem;
        padding-top: 2rem;
        text-align: center;
      }
      
      .hero-subtitle {
        font-size: 1.25rem;
        text-align: center;
      }

      .grid {
        gap: 2.5rem;
        align-items: center;
      }

      /* Tablet ordering - TEXT FIRST */
      .order-1 {
        order: 1;
      }
      .order-2 {
        order: 2;
        margin-bottom: 0;
      }

      /* Improved tablet grid for features */
      .grid.grid-cols-1.sm\\:grid-cols-2 {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 1.25rem;
        max-width: 600px;
        margin: 1.5rem auto;
      }

      .grid .flex.items-center {
        background: rgba(255, 255, 255, 0.12);
        padding: 1.5rem;
        border-radius: 1.5rem;
      }

      .grid .flex.items-center .w-10.h-10 {
        width: 4.5rem;
        height: 4.5rem;
        border-radius: 1.5rem;
      }

      .grid .flex.items-center .w-10.h-10 svg {
        width: 2.25rem;
        height: 2.25rem;
      }
    }

    @media (min-width: 1025px) {
      .hero-title {
        font-size: 4rem;
        padding-top: 4rem;
        text-align: left;
      }
      
      .hero-subtitle {
        font-size: 1.5rem;
        text-align: left;
      }

      .grid {
        gap: 4rem;
        align-items: center;
      }

      /* Desktop alignment */
      .order-1 {
        display: flex;
        flex-direction: column;
        justify-content: center;
      }
      
      .order-2 {
        display: flex;
        align-items: center;
        justify-content: center;
      }

      /* Desktop features grid - 2x2 layout */
      .grid.grid-cols-1.sm\\:grid-cols-2 {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 1.5rem;
        max-width: none;
        margin: 2rem 0;
      }

      .grid .flex.items-center {
        background: rgba(255, 255, 255, 0.08);
        padding: 1.5rem;
        border-radius: 1.25rem;
        flex-direction: row;
        text-align: left;
      }

      .grid .flex.items-center .w-10.h-10 {
        width: 4rem;
        height: 4rem;
        margin-right: 1.5rem;
        border-radius: 1.25rem;
      }

      .grid .flex.items-center .w-10.h-10 svg {
        width: 2rem;
        height: 2rem;
      }

      .grid .flex.items-center > div:last-child {
        text-align: left;
        margin-left: 0;
      }
    }

    /* Performance Optimizations */
    section {
      will-change: transform;
      backface-visibility: hidden;
    }

    /* Improved Icon Gradients */
    .w-10.h-10.bg-yellow-100 {
      background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #d97706 100%) !important;
      border: 2px solid rgba(255, 255, 255, 0.3);
      position: relative;
      overflow: hidden;
      min-width: 4rem;
      min-height: 4rem;
      width: 4rem !important;
      height: 4rem !important;
      border-radius: 1.25rem !important;
      box-shadow: 
        0 8px 25px rgba(251, 191, 36, 0.4),
        0 4px 10px rgba(0, 0, 0, 0.1),
        inset 0 1px 0 rgba(255, 255, 255, 0.2);
    }

    .w-10.h-10.bg-yellow-100::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.3) 0%, transparent 50%);
      border-radius: inherit;
    }

    .w-10.h-10.bg-yellow-100 svg {
      position: relative;
      z-index: 1;
      color: #ffffff !important;
      width: 2rem !important;
      height: 2rem !important;
      filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
    }

    /* Enhanced Card Animations */
    .flex.items-center {
      position: relative;
      overflow: hidden;
    }

    .flex.items-center::after {
      content: '';
      position: absolute;
      top: -50%;
      left: -50%;
      width: 200%;
      height: 200%;
      background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.1), transparent);
      transform: translateX(-100%) translateY(-100%) rotate(45deg);
      transition: transform 0.6s ease;
    }

    .flex.items-center:hover::after {
      transform: translateX(100%) translateY(100%) rotate(45deg);
    }

    /* Grid Layout Optimization */
    .grid {
      gap: 1rem;
    }

    @media (min-width: 1024px) {
      .grid {
        gap: 3rem;
      }
    }

    @media (min-width: 1280px) {
      .grid {
        gap: 4rem;
      }
    }

    /* Content Spacing Optimization */
    .space-y-6 > :not([hidden]) ~ :not([hidden]) {
      margin-top: 1.5rem;
    }

    @media (min-width: 1024px) {
      .space-y-6 > :not([hidden]) ~ :not([hidden]) {
        margin-top: 2rem;
      }
    }

    /* Container Responsiveness */
    .max-w-7xl {
      max-width: 100%;
      margin-left: auto;
      margin-right: auto;
    }

    @media (min-width: 1280px) {
      .max-w-7xl {
        max-width: 80rem;
      }
    }

    /* Perfect Grid Alignment */
    .grid.items-center {
      align-items: center;
    }

    .grid.justify-items-center {
      justify-items: center;
    }

    @media (min-width: 1024px) {
      .grid.lg\\:items-center {
        align-items: center;
      }
    }

    /* Modal Perfect Centering */
    .fixed.inset-0.z-\\[9999\\] {
      position: fixed;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      z-index: 9999;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    /* Content Perfect Vertical Centering */
    @media (min-width: 1024px) {
      .order-1 {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: flex-start;
        min-height: 70vh;
      }
      
      .order-2 {
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 70vh;
      }
    }

    @media (min-width: 1024px) {
      .order-1 {
        margin-bottom: 0;
      }
      
      /* Sticky positioning to avoid menubar overlap */
      .lg\\:sticky {
        position: sticky;
        top: 6rem; /* Adjust based on your menubar height */
      }
      
      .lg\\:top-24 {
        top: 6rem;
      }
    }

    /* Ensure proper z-index layering */
    .relative.z-20 {
      z-index: 20;
    }

    /* Mobile-first responsive spacing */
    @media (max-width: 1023px) {
      .grid {
        gap: 2rem;
      }
      
      .space-y-6 > :not([hidden]) ~ :not([hidden]) {
        margin-top: 1.5rem;
      }
    }

    /* Clean Bounce Animation */
    .animate-bounce {
      animation: bounce 2s infinite;
    }

    @keyframes bounce {
      0%, 20%, 53%, 80%, 100% {
        transform: translate3d(-50%, 0, 0);
      }
      40%, 43% {
        transform: translate3d(-50%, -10px, 0);
      }
      70% {
        transform: translate3d(-50%, -5px, 0);
      }
    }
  `]
})
export class HeroNewComponent implements OnInit, OnDestroy {
  
  isBookingModalOpen = false;
  private bookingModalSubscription: Subscription | undefined;

  constructor(private bookingModalService: BookingModalService) {}

  ngOnInit() {
    // Suscribirse a los cambios del modal de booking
    this.bookingModalSubscription = this.bookingModalService.bookingModal$.subscribe(
      (isOpen: boolean) => {
        this.isBookingModalOpen = isOpen;
      }
    );
  }

  ngOnDestroy() {
    // Limpiar la suscripción para evitar memory leaks
    if (this.bookingModalSubscription) {
      this.bookingModalSubscription.unsubscribe();
    }
  }

  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  }

  openBookingModal(): void {
    this.bookingModalService.openBookingModal();
  }

  closeBookingModal(): void {
    this.bookingModalService.closeBookingModal();
  }

  onBookingCompleted(bookingData: any): void {
    console.log('Booking completed:', bookingData);
    // Here you can handle the booking completion
    // For example, show a success message, redirect, etc.
    this.bookingModalService.closeBookingModal();
  }
}