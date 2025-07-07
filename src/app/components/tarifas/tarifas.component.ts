import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tarifas',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- Tarifas Section -->
    <section id="tarifas" class="py-20 bg-gray-50 scroll-mt-20">
      <div class="max-w-7xl mx-auto px-6 lg:px-8">
        <div class="text-center mb-16">
          <span class="inline-block px-4 py-2 bg-yellow-100 text-yellow-800 rounded-full text-sm font-semibold mb-4">
            Nuestras Tarifas
          </span>
          <h2 class="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Precios
            <span class="bg-gradient-to-r from-yellow-500 to-amber-600 bg-clip-text text-transparent">
              Transparentes
            </span>
          </h2>
          <p class="text-xl text-gray-600 max-w-3xl mx-auto">
            Sin costos ocultos ni sorpresas. Conoce exactamente cuánto pagarás por tu viaje al aeropuerto.
          </p>
        </div>

        <!-- Tipos de Vehículos -->
        <div class="grid md:grid-cols-2 gap-8 mb-16">
          <!-- Taxi Ejecutivo -->
          <div class="bg-white rounded-2xl p-8 shadow-lg border-2 border-yellow-200 relative overflow-hidden">
            <div class="absolute top-0 right-0 bg-yellow-500 text-white px-4 py-2 text-sm font-semibold rounded-bl-xl">
              Más Popular
            </div>
            <div class="flex items-center mb-6">
              <div class="w-16 h-16 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center mr-4">
                <svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.22.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
                </svg>
              </div>
              <div>
                <h3 class="text-2xl font-bold text-gray-900">Taxi Ejecutivo</h3>
                <p class="text-gray-600">Ideal para 1-3 personas</p>
              </div>
            </div>
            
            <div class="space-y-4 mb-6">
              <div class="flex justify-between py-2 border-b border-gray-100">
                <span class="text-gray-600">Capacidad:</span>
                <span class="font-semibold">3 pasajeros</span>
              </div>
              <div class="flex justify-between py-2 border-b border-gray-100">
                <span class="text-gray-600">Equipaje:</span>
                <span class="font-semibold">2 maletas grandes</span>
              </div>
              <div class="flex justify-between py-2 border-b border-gray-100">
                <span class="text-gray-600">Aire acondicionado:</span>
                <span class="font-semibold text-green-600">✓ Incluido</span>
              </div>
              <div class="flex justify-between py-2 border-b border-gray-100">
                <span class="text-gray-600">WiFi:</span>
                <span class="font-semibold text-green-600">✓ Gratis</span>
              </div>
            </div>

            <div class="text-center">
              <div class="text-3xl font-bold text-gray-900 mb-2">Desde $25.000</div>
              <p class="text-gray-600 text-sm mb-4">*Según distancia y destino</p>
              <button (click)="scrollToSection('reservar')" 
                      class="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-yellow-600 hover:to-yellow-700 transition-all duration-300">
                Reservar Ahora
              </button>
            </div>
          </div>

          <!-- SUV Premium -->
          <div class="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
            <div class="flex items-center mb-6">
              <div class="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mr-4">
                <svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.22.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
                </svg>
              </div>
              <div>
                <h3 class="text-2xl font-bold text-gray-900">SUV Premium</h3>
                <p class="text-gray-600">Perfecto para familias</p>
              </div>
            </div>
            
            <div class="space-y-4 mb-6">
              <div class="flex justify-between py-2 border-b border-gray-100">
                <span class="text-gray-600">Capacidad:</span>
                <span class="font-semibold">4-6 pasajeros</span>
              </div>
              <div class="flex justify-between py-2 border-b border-gray-100">
                <span class="text-gray-600">Equipaje:</span>
                <span class="font-semibold">4 maletas grandes</span>
              </div>
              <div class="flex justify-between py-2 border-b border-gray-100">
                <span class="text-gray-600">Aire acondicionado:</span>
                <span class="font-semibold text-green-600">✓ Dual Zone</span>
              </div>
              <div class="flex justify-between py-2 border-b border-gray-100">
                <span class="text-gray-600">Servicios extra:</span>
                <span class="font-semibold text-green-600">✓ Premium</span>
              </div>
            </div>

            <div class="text-center">
              <div class="text-3xl font-bold text-gray-900 mb-2">Desde $35.000</div>
              <p class="text-gray-600 text-sm mb-4">*Según distancia y destino</p>
              <button (click)="scrollToSection('reservar')" 
                      class="w-full border-2 border-blue-500 text-blue-500 font-semibold py-3 px-6 rounded-xl hover:bg-blue-500 hover:text-white transition-all duration-300">
                Reservar Ahora
              </button>
            </div>
          </div>
        </div>

        <!-- Destinos Populares -->
        <div class="bg-white rounded-2xl p-8 shadow-lg">
          <h3 class="text-2xl font-bold text-gray-900 mb-6 text-center">Destinos Populares</h3>
          <div class="grid md:grid-cols-3 gap-6">
            <div class="text-center p-4 bg-gray-50 rounded-xl">
              <div class="text-xl font-bold text-gray-900 mb-2">Centro de la Ciudad</div>
              <div class="text-sm text-gray-600 mb-2">Distancia: 25 km</div>
              <div class="text-lg font-semibold text-yellow-600">$25.000 - $35.000</div>
            </div>
            <div class="text-center p-4 bg-gray-50 rounded-xl">
              <div class="text-xl font-bold text-gray-900 mb-2">Zona Norte</div>
              <div class="text-sm text-gray-600 mb-2">Distancia: 30 km</div>
              <div class="text-lg font-semibold text-yellow-600">$30.000 - $40.000</div>
            </div>
            <div class="text-center p-4 bg-gray-50 rounded-xl">
              <div class="text-xl font-bold text-gray-900 mb-2">Zona Sur</div>
              <div class="text-sm text-gray-600 mb-2">Distancia: 35 km</div>
              <div class="text-lg font-semibold text-yellow-600">$35.000 - $45.000</div>
            </div>
          </div>
          <div class="text-center mt-6">
            <p class="text-gray-600 mb-4">¿Tu destino no está en la lista? ¡No te preocupes!</p>
            <button (click)="scrollToSection('contacto')" 
                    class="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
              </svg>
              Cotizar mi viaje
            </button>
          </div>
        </div>

        <!-- Información adicional -->
        <div class="mt-12 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-2xl p-8">
          <h3 class="text-2xl font-bold text-gray-900 mb-6 text-center">Lo que incluye tu viaje</h3>
          <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div class="text-center">
              <div class="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                </svg>
              </div>
              <h4 class="font-semibold text-gray-900 mb-2">Recogida puntual</h4>
              <p class="text-sm text-gray-600">15 min antes de la hora</p>
            </div>
            <div class="text-center">
              <div class="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                </svg>
              </div>
              <h4 class="font-semibold text-gray-900 mb-2">Seguimiento GPS</h4>
              <p class="text-sm text-gray-600">En tiempo real</p>
            </div>
            <div class="text-center">
              <div class="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                </svg>
              </div>
              <h4 class="font-semibold text-gray-900 mb-2">Asistencia 24/7</h4>
              <p class="text-sm text-gray-600">Soporte constante</p>
            </div>
            <div class="text-center">
              <div class="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                </svg>
              </div>
              <h4 class="font-semibold text-gray-900 mb-2">Pago flexible</h4>
              <p class="text-sm text-gray-600">Efectivo o tarjeta</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    /* Smooth animations */
    .hover\\:scale-105:hover {
      transform: scale(1.05);
    }
    
    /* Gradient effects */
    .bg-gradient-to-r {
      background-image: linear-gradient(to right, var(--tw-gradient-stops));
    }
    
    /* Button hover effects */
    button {
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    button:hover {
      transform: translateY(-1px);
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
    }
    
    /* Card hover effects */
    .shadow-lg {
      transition: all 0.3s ease;
    }
    
    .shadow-lg:hover {
      transform: translateY(-5px);
      box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
    }
  `]
})
export class TarifasComponent {
  
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
