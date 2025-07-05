import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <!-- Services Section -->
    <section id="servicios" class="py-20 bg-gray-50 scroll-mt-20">
      <div class="max-w-7xl mx-auto px-6 lg:px-8">
        <div class="text-center mb-16">
          <span class="inline-block px-4 py-2 bg-yellow-100 text-yellow-800 rounded-full text-sm font-semibold mb-4">
            Nuestros Servicios
          </span>
          <h2 class="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Encuentre el talento adecuado en el lugar correcto con 
            <span class="bg-gradient-to-r from-yellow-500 to-amber-600 bg-clip-text text-transparent">
              VoyalAeropuerto.
            </span>
          </h2>
          <p class="text-xl text-gray-600 max-w-3xl mx-auto">
            Reimaginamos los servicios de traslado convencionales, para que puedas acceder 
            al transporte confiable y puntual que complementará perfectamente tu viaje.
          </p>
        </div>

        <div class="grid md:grid-cols-3 gap-8 mb-16">
          <div class="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 service-card">
            <div class="w-16 h-16 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center mb-6">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
              </svg>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-4">Traslado al Aeropuerto</h3>
            <p class="text-gray-600">Servicio directo y confiable desde tu ubicación hasta el aeropuerto con puntualidad garantizada.</p>
          </div>

          <div class="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 service-card">
            <div class="w-16 h-16 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center mb-6">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-4">Pickup Personalizado</h3>
            <p class="text-gray-600">Recogida en tu ubicación exacta con conductores profesionales y vehículos modernos.</p>
          </div>

          <div class="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 service-card">
            <div class="w-16 h-16 bg-gradient-to-br from-yellow-600 to-orange-500 rounded-xl flex items-center justify-center mb-6">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-4">Monitoreo en Tiempo Real</h3>
            <p class="text-gray-600">Seguimiento en vivo de tu viaje y notificaciones automáticas para total tranquilidad.</p>
          </div>
        </div>

        <div class="text-center">
          <p class="text-lg text-gray-600 mb-8">
            Por estar Cerca, podemos garantizar transporte altamente calificado y económico 
            que cumplirá perfectamente con tus expectativas.
          </p>
          <div class="inline-flex items-center bg-gray-100 rounded-full px-6 py-3">
            <span class="text-gray-700">No necesitas solo llegar, necesitas llegar bien.</span>
            <button (click)="scrollToSection('reserva')" 
                    class="ml-4 px-6 py-2 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-full hover:shadow-lg transition-all duration-300">
              ¡Llegar bien!
            </button>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .service-card {
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .service-card:hover {
      transform: translateY(-8px);
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
    }

    .service-card:hover .w-16 {
      transform: scale(1.1);
    }
  `]
})
export class ServicesComponent {
  
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