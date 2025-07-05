import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactFormComponent } from '../contact/contact-form.component';

@Component({
  selector: 'app-contact-section',
  standalone: true,
  imports: [CommonModule, ContactFormComponent],
  template: `
    <!-- Contact Section - Ultra Compacto y Responsive -->
    <section id="contacto" class="py-8 sm:py-12 lg:py-16 bg-gradient-to-br from-white via-gray-50 to-amber-50/30 relative overflow-hidden scroll-mt-20">
      <!-- Background decorative elements optimized -->
      <div class="absolute top-0 left-0 w-24 h-24 sm:w-32 sm:h-32 lg:w-48 lg:h-48 bg-gradient-to-br from-amber-500/6 to-yellow-500/6 rounded-full blur-2xl"></div>
      <div class="absolute bottom-0 right-0 w-24 h-24 sm:w-32 sm:h-32 lg:w-48 lg:h-48 bg-gradient-to-br from-yellow-500/6 to-amber-500/6 rounded-full blur-2xl"></div>
      
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <!-- Header Section - Más compacto -->
        <div class="text-center mb-6 sm:mb-8 lg:mb-12">
          <span class="inline-flex items-center gap-1 px-3 py-1.5 sm:px-4 sm:py-2 bg-amber-100 text-amber-800 rounded-full text-xs sm:text-sm font-semibold mb-2 sm:mb-3">
            <svg class="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
            </svg>
            Contáctanos
          </span>
          <h2 class="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 sm:mb-3">
            ¿Listo para <span class="text-amber-600">viajar seguro</span>?
          </h2>
          <p class="text-sm sm:text-base lg:text-lg text-gray-600 max-w-2xl mx-auto">
            Estamos aquí para hacer que tu traslado sea perfecto.
          </p>
        </div>

        <div class="grid lg:grid-cols-5 gap-6 lg:gap-8 items-start">
          <!-- Contact Info - Compacto y eficiente -->
          <div class="lg:col-span-2">
            <div class="space-y-3 sm:space-y-4">
              <!-- Quick Contact Cards -->
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2 sm:gap-3">
                <div class="contact-card group">
                  <div class="contact-icon bg-amber-100 group-hover:bg-amber-500">
                    <svg class="w-4 h-4 text-amber-600 group-hover:text-white transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                    </svg>
                  </div>
                  <div class="contact-content">
                    <h4 class="contact-title">Llamadas</h4>
                    <p class="contact-detail">+34 900 123 456</p>
                    <span class="contact-subtitle">24/7 Disponible</span>
                  </div>
                </div>
                
                <div class="contact-card group">
                  <div class="contact-icon bg-blue-100 group-hover:bg-blue-500">
                    <svg class="w-4 h-4 text-blue-600 group-hover:text-white transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                    </svg>
                  </div>
                  <div class="contact-content">
                    <h4 class="contact-title">Email</h4>
                    <p class="contact-detail">hola&#64;voyalaeropuerto.com</p>
                    <span class="contact-subtitle">Respuesta en 1h</span>
                  </div>
                </div>

                <div class="contact-card group sm:col-span-2 lg:col-span-1">
                  <div class="contact-icon bg-green-100 group-hover:bg-green-500">
                    <svg class="w-4 h-4 text-green-600 group-hover:text-white transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                    </svg>
                  </div>
                  <div class="contact-content">
                    <h4 class="contact-title">Ubicación</h4>
                    <p class="contact-detail">Madrid, España</p>
                    <span class="contact-subtitle">Cobertura nacional</span>
                  </div>
                </div>
              </div>

              <!-- Quick Stats - Más compacto -->
              <div class="mt-4 sm:mt-6">
                <h4 class="text-xs sm:text-sm font-semibold text-gray-900 mb-2 sm:mb-3">¿Por qué elegirnos?</h4>
                <div class="grid grid-cols-2 gap-2 sm:gap-3">
                  <div class="stat-card">
                    <div class="stat-number">500+</div>
                    <div class="stat-label">Clientes</div>
                  </div>
                  <div class="stat-card">
                    <div class="stat-number">24/7</div>
                    <div class="stat-label">Disponible</div>
                  </div>
                  <div class="stat-card">
                    <div class="stat-number">5★</div>
                    <div class="stat-label">Calificación</div>
                  </div>
                  <div class="stat-card">
                    <div class="stat-number">99%</div>
                    <div class="stat-label">Puntualidad</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Contact Form - Más compacto -->
          <div class="lg:col-span-3">
            <div class="form-container">
              <app-contact-form></app-contact-form>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    /* Contact Cards - Ultra compacto y moderno */
    .contact-card {
      display: flex;
      align-items: center;
      padding: clamp(0.5rem, 2.5vw, 0.75rem);
      background: rgba(255, 255, 255, 0.8);
      border: 1px solid rgba(229, 231, 235, 0.5);
      border-radius: clamp(0.5rem, 1.5vw, 0.75rem);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      backdrop-filter: blur(10px);
      cursor: pointer;
    }

    .contact-card:hover {
      transform: translateY(-1px);
      background: rgba(255, 255, 255, 0.95);
      border-color: rgba(245, 158, 11, 0.3);
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
    }

    .contact-icon {
      width: clamp(2rem, 5vw, 2.5rem);
      height: clamp(2rem, 5vw, 2.5rem);
      border-radius: clamp(0.375rem, 1vw, 0.5rem);
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: clamp(0.5rem, 1.5vw, 0.75rem);
      transition: all 0.3s ease;
      flex-shrink: 0;
    }

    .contact-content {
      flex: 1;
      min-width: 0;
    }

    .contact-title {
      font-size: clamp(0.75rem, 2.2vw, 0.875rem);
      font-weight: 600;
      color: #111827;
      margin: 0 0 0.125rem 0;
      line-height: 1.2;
    }

    .contact-detail {
      font-size: clamp(0.625rem, 1.8vw, 0.75rem);
      color: #374151;
      margin: 0 0 0.125rem 0;
      line-height: 1.3;
      word-break: break-word;
    }

    .contact-subtitle {
      font-size: clamp(0.5rem, 1.5vw, 0.625rem);
      color: #6b7280;
      font-weight: 500;
      line-height: 1.2;
    }

    /* Stats Cards - Ultra compacto */
    .stat-card {
      background: rgba(255, 255, 255, 0.7);
      border: 1px solid rgba(229, 231, 235, 0.4);
      border-radius: clamp(0.375rem, 1vw, 0.5rem);
      padding: clamp(0.5rem, 2vw, 0.75rem);
      text-align: center;
      transition: all 0.3s ease;
      backdrop-filter: blur(8px);
    }

    .stat-card:hover {
      background: rgba(245, 158, 11, 0.05);
      border-color: rgba(245, 158, 11, 0.2);
      transform: translateY(-1px);
    }

    .stat-number {
      font-size: clamp(1rem, 3.5vw, 1.25rem);
      font-weight: 700;
      color: #f59e0b;
      line-height: 1.1;
      margin-bottom: 0.125rem;
    }

    .stat-label {
      font-size: clamp(0.5rem, 1.8vw, 0.625rem);
      color: #6b7280;
      font-weight: 500;
      line-height: 1.2;
    }

    /* Form Container - Ultra compacto */
    .form-container {
      background: rgba(255, 255, 255, 0.9);
      border: 1px solid rgba(229, 231, 235, 0.3);
      border-radius: clamp(0.75rem, 2vw, 1rem);
      padding: clamp(1rem, 3vw, 1.5rem);
      backdrop-filter: blur(20px);
      box-shadow: 
        0 2px 15px rgba(0, 0, 0, 0.06),
        0 1px 3px rgba(0, 0, 0, 0.08);
      transition: all 0.3s ease;
    }

    .form-container:hover {
      box-shadow: 
        0 4px 20px rgba(0, 0, 0, 0.1),
        0 2px 6px rgba(0, 0, 0, 0.08);
    }

    /* Responsive Layout Adjustments - Optimizado */
    @media (max-width: 1024px) {
      .grid.lg\\:grid-cols-5 {
        grid-template-columns: 1fr;
        gap: 1.5rem;
      }
      
      .lg\\:col-span-2,
      .lg\\:col-span-3 {
        grid-column: span 1;
      }
    }

    @media (max-width: 768px) {
      .grid.sm\\:grid-cols-2 {
        grid-template-columns: 1fr;
        gap: 0.75rem;
      }
      
      .sm\\:col-span-2 {
        grid-column: span 1;
      }
      
      .contact-card {
        padding: 0.5rem;
      }
      
      .contact-icon {
        width: 2rem;
        height: 2rem;
        margin-right: 0.5rem;
      }
    }

    @media (max-width: 480px) {
      .grid.grid-cols-2 {
        grid-template-columns: 1fr 1fr;
        gap: 0.5rem;
      }
      
      .stat-card {
        padding: 0.5rem 0.375rem;
      }
      
      .form-container {
        padding: 0.75rem;
      }
    }

    /* Animation Enhancements */
    @keyframes slideInUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .contact-card,
    .stat-card,
    .form-container {
      animation: slideInUp 0.6s ease-out forwards;
    }

    .contact-card:nth-child(2) {
      animation-delay: 0.1s;
    }

    .contact-card:nth-child(3) {
      animation-delay: 0.2s;
    }

    .stat-card:nth-child(1) {
      animation-delay: 0.3s;
    }

    .stat-card:nth-child(2) {
      animation-delay: 0.35s;
    }

    .stat-card:nth-child(3) {
      animation-delay: 0.4s;
    }

    .stat-card:nth-child(4) {
      animation-delay: 0.45s;
    }

    .form-container {
      animation-delay: 0.2s;
    }

    /* Improved blur effects */
    .blur-3xl {
      filter: blur(clamp(32px, 8vw, 64px));
    }

    /* Performance optimizations */
    .contact-card,
    .stat-card,
    .form-container,
    .contact-icon {
      will-change: transform;
      backface-visibility: hidden;
    }

    /* Focus states for accessibility */
    .contact-card:focus,
    .stat-card:focus {
      outline: 2px solid #f59e0b;
      outline-offset: 2px;
    }

    /* Reduced motion support */
    @media (prefers-reduced-motion: reduce) {
      .contact-card,
      .stat-card,
      .form-container,
      .contact-icon {
        animation: none;
        transition: none;
      }
      
      .contact-card:hover,
      .stat-card:hover {
        transform: none;
      }
    }
  `]
})
export class ContactSectionComponent {}
