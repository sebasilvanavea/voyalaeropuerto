import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-why-choose-us',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  template: `
    <!-- Why Choose Us Section -->
    <section id="ventajas" class="py-20 bg-white scroll-mt-20">
      <div class="max-w-7xl mx-auto px-6 lg:px-8">
        <div class="text-center mb-16">
          <span class="inline-block px-4 py-2 bg-yellow-100 text-yellow-800 rounded-full text-sm font-semibold mb-4">
            Nuestras Ventajas
          </span>
          <h2 class="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            ¿Por qué elegir
            <span class="bg-gradient-to-r from-yellow-500 to-amber-600 bg-clip-text text-transparent">
              VoyalAeropuerto?
            </span>
          </h2>
          <p class="text-xl text-gray-600 max-w-3xl mx-auto">
            Más de 5 años brindando el mejor servicio de transporte al aeropuerto. 
            Tu comodidad y puntualidad son nuestra prioridad.
          </p>
        </div>

        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div class="text-center group">
            <div class="relative mb-6">
              <div class="w-24 h-24 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-2xl mx-auto flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <svg class="w-12 h-12 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                </svg>
              </div>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-4">100% Confiable</h3>
            <p class="text-gray-600">
              Conductores verificados y vehículos en perfecto estado. Tu seguridad es nuestra garantía.
            </p>
          </div>

          <div class="text-center group">
            <div class="relative mb-6">
              <div class="w-24 h-24 bg-gradient-to-br from-amber-100 to-amber-200 rounded-2xl mx-auto flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <svg class="w-12 h-12 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-4">Puntualidad Garantizada</h3>
            <p class="text-gray-600">
              Llegamos 15 minutos antes de la hora acordada. Nunca perderás tu vuelo con nosotros.
            </p>
          </div>

          <div class="text-center group">
            <div class="relative mb-6">
              <div class="w-24 h-24 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl mx-auto flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <svg class="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"/>
                </svg>
              </div>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-4">Precios Justos</h3>
            <p class="text-gray-600">
              Tarifas transparentes sin sorpresas. Calidad premium a precios accesibles.
            </p>
          </div>

          <div class="text-center group">
            <div class="relative mb-6">
              <div class="w-24 h-24 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl mx-auto flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <svg class="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                </svg>
              </div>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-4">Soporte 24/7</h3>
            <p class="text-gray-600">
              Estamos disponibles las 24 horas para ayudarte. Tu viaje es nuestra responsabilidad.
            </p>
          </div>
        </div>

        <!-- Additional Benefits Section -->
        <div class="mt-20 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-3xl p-8 lg:p-12">
          <div class="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 class="text-3xl font-bold text-gray-900 mb-6">¿Qué nos hace diferentes?</h3>
              <div class="space-y-4">
                <div class="flex items-start space-x-3">
                  <div class="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                    </svg>
                  </div>
                  <p class="text-gray-700">Monitoreo de vuelos en tiempo real para ajustarnos a cambios de horario</p>
                </div>
                <div class="flex items-start space-x-3">
                  <div class="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                    </svg>
                  </div>
                  <p class="text-gray-700">Vehículos nuevos con aire acondicionado y WiFi gratuito</p>
                </div>
                <div class="flex items-start space-x-3">
                  <div class="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                    </svg>
                  </div>
                  <p class="text-gray-700">Seguimiento del viaje en tiempo real para tu tranquilidad</p>
                </div>
                <div class="flex items-start space-x-3">
                  <div class="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                    </svg>
                  </div>
                  <p class="text-gray-700">Cancelación gratuita hasta 2 horas antes del viaje</p>
                </div>
              </div>
            </div>
            <div class="text-center">
              <div class="bg-white rounded-2xl p-8 shadow-lg">
                <div class="text-4xl font-bold text-yellow-600 mb-2">5000+</div>
                <p class="text-gray-600 mb-4">Viajes exitosos</p>
                <div class="text-4xl font-bold text-yellow-600 mb-2">4.9/5</div>
                <p class="text-gray-600 mb-4">Calificación promedio</p>
                <div class="text-4xl font-bold text-yellow-600 mb-2">24/7</div>
                <p class="text-gray-600">Disponibilidad</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .group:hover .group-hover\\:scale-110 {
      transform: scale(1.1);
    }

    .transition-transform {
      transition-property: transform;
      transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
      transition-duration: 300ms;
    }

    .duration-300 {
      transition-duration: 300ms;
    }

    /* Smooth scroll animations */
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .group {
      animation: fadeInUp 0.6s ease-out;
    }

    .group:nth-child(2) {
      animation-delay: 0.1s;
    }

    .group:nth-child(3) {
      animation-delay: 0.2s;
    }

    .group:nth-child(4) {
      animation-delay: 0.3s;
    }

    /* Hover effects */
    .group:hover {
      transform: translateY(-5px);
      transition: all 0.3s ease;
    }

    /* Icon container hover effects */
    .group:hover .w-24.h-24 {
      background: linear-gradient(135deg, #0891b2, #7c3aed);
      color: white;
    }

    .group:hover svg {
      color: white !important;
    }
  `]
})
export class WhyChooseUsComponent {}
