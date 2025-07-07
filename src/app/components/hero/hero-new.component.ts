import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { HeroBookingCardComponent } from './hero-booking-card-fixed.component';

@Component({
  selector: 'app-hero-new',
  standalone: true,
  imports: [CommonModule, TranslateModule, HeroBookingCardComponent],
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
      <div class="relative z-20 max-w-7xl mx-auto px-6 lg:px-8 w-full">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center min-h-[80vh]">
          
          <!-- Left Side - Content & Information -->
          <div class="space-y-8">
            <!-- Badge -->
            <div class="mb-6">
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
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 py-6">
              <div class="flex items-center space-x-3">
                <div class="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <svg class="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                  <svg class="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                  <svg class="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                  <svg class="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                  </svg>
                </div>
                <div>
                  <p class="text-white font-semibold">Soporte 24/7</p>
                  <p class="text-white text-sm">Asistencia constante</p>
                </div>
              </div>
            </div>
            
            <!-- Action Buttons -->
            <div class="flex flex-col sm:flex-row gap-4 pt-4">
              <button (click)="scrollToSection('reservar')" 
                      class="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold bg-yellow-500 hover:bg-yellow-600 text-white rounded-xl transition-all duration-300 shadow-xl hover:shadow-yellow-500/25 transform hover:scale-105 hero-button-primary">
                <svg class="mr-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                </svg>
                <span>Reservar Ahora</span>
              </button>
              
              <button (click)="scrollToSection('tarifas')" 
                      class="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white border-2 border-white/30 rounded-xl hover:bg-white/10 hover:border-white/50 transition-all duration-300 hero-button-secondary">
                <svg class="mr-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"/>
                </svg>
                Ver Tarifas
              </button>
            </div>

            <!-- Trust Indicators -->

          </div>

          <!-- Right Side - Booking Card -->
          <div class="flex justify-center lg:justify-end">
            <app-hero-booking-card></app-hero-booking-card>
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
    @media (max-width: 1024px) {
      .hero-title {
        font-size: 3rem;
      }
      
      .hero-subtitle {
        font-size: 1.25rem;
      }
    }

    @media (max-width: 768px) {
      .hero-title {
        text-shadow: 
          0 1px 4px rgba(0, 0, 0, 0.15),
          0 2px 8px rgba(0, 0, 0, 0.1);
        font-size: 2.5rem;
      }

      .hero-subtitle {
        font-size: 1.125rem;
      }
    }

    /* Performance Optimizations */
    section {
      will-change: transform;
      backface-visibility: hidden;
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
export class HeroNewComponent {
  
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
}