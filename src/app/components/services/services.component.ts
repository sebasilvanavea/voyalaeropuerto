import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule],
  template: `
    <!-- Services Section -->
    <section id="servicios" class="py-20 bg-gray-50 scroll-mt-20">
      <div class="max-w-7xl mx-auto px-6 lg:px-8">
        <div class="text-center mb-16">
          <span class="inline-block px-4 py-2 bg-yellow-100 text-yellow-800 rounded-full text-sm font-semibold mb-4">
            Nuestros Servicios
          </span>
          <h2 class="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Transporte Premium
            <span class="bg-gradient-to-r from-yellow-500 to-amber-600 bg-clip-text text-transparent">
              al Aeropuerto
            </span>
          </h2>
          <p class="text-xl text-gray-600 max-w-3xl mx-auto">
            Ofrecemos servicios de transporte confiables, seguros y cómodos desde y hacia el aeropuerto, 
            adaptados a tus necesidades de viaje.
          </p>
        </div>

        <div class="grid md:grid-cols-3 gap-8 mb-16">
          <div class="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 service-card">
            <div class="w-16 h-16 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center mb-6">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
              </svg>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-4">Traslado al Aeropuerto</h3>
            <p class="text-gray-600">Servicio puerta a puerta desde tu ubicación hasta el aeropuerto. Puntualidad garantizada para que no pierdas tu vuelo.</p>
          </div>

          <div class="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 service-card">
            <div class="w-16 h-16 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center mb-6">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-4">Recogida del Aeropuerto</h3>
            <p class="text-gray-600">Te esperamos en el aeropuerto y te llevamos a tu destino. Monitoreo de vuelos incluido para ajustarnos a retrasos.</p>
          </div>

          <div class="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 service-card">
            <div class="w-16 h-16 bg-gradient-to-br from-yellow-600 to-orange-500 rounded-xl flex items-center justify-center mb-6">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-4">Servicio 24/7</h3>
            <p class="text-gray-600">Disponibles las 24 horas del día, todos los días del año. Sin importar la hora de tu vuelo, estaremos ahí.</p>
          </div>
        </div>

        <div class="grid md:grid-cols-2 gap-8 mb-16">
          <div class="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 service-card">
            <div class="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-6">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
              </svg>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-4">Viajes Grupales</h3>
            <p class="text-gray-600">Vehículos espaciosos para familias y grupos. Ideal para viajes de negocio o vacaciones familiares al aeropuerto.</p>
          </div>

          <div class="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 service-card">
            <div class="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-6">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
              </svg>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-4">Viajes Ejecutivos</h3>
            <p class="text-gray-600">Servicio premium con vehículos de lujo para ejecutivos y viajeros de negocios que requieren comodidad y puntualidad.</p>
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