import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  template: `
    <footer class="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden">
      <!-- Background decoration -->
      <div class="absolute inset-0 bg-gradient-to-r from-amber-500/5 to-yellow-500/5"></div>
      <div class="absolute top-0 left-1/2 transform -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-amber-400/30 to-transparent"></div>
      
      <div class="relative z-10 container mx-auto px-6 py-16">
        <!-- Main footer content -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          <!-- Company Info -->
          <div class="space-y-6">
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-xl flex items-center justify-center">
                <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
                </svg>
              </div>
              <h3 class="text-xl font-bold bg-gradient-to-r from-amber-400 to-yellow-400 bg-clip-text text-transparent">
                VoyalAeropuerto
              </h3>
            </div>
            <p class="text-slate-300 text-sm leading-relaxed max-w-xs">
              Tu compañero confiable para traslados al aeropuerto. Viaja con comodidad, puntualidad y seguridad.
            </p>
            <div class="flex space-x-3">
              <a href="#" class="group w-10 h-10 bg-gray-800 hover:bg-gradient-to-r hover:from-amber-500 hover:to-yellow-500 rounded-lg flex items-center justify-center transition-all duration-300 transform hover:scale-110">
                <svg class="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                </svg>
              </a>
              <a href="#" class="group w-10 h-10 bg-gray-800 hover:bg-gradient-to-r hover:from-amber-500 hover:to-yellow-500 rounded-lg flex items-center justify-center transition-all duration-300 transform hover:scale-110">
                <svg class="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                </svg>
              </a>
              <a href="#" class="group w-10 h-10 bg-gray-800 hover:bg-gradient-to-r hover:from-amber-500 hover:to-yellow-500 rounded-lg flex items-center justify-center transition-all duration-300 transform hover:scale-110">
                <svg class="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.219-.359-1.219c0-1.142.662-1.995 1.482-1.995.699 0 1.037.219 1.037 1.142 0 .695-.442 1.737-.219 2.701.199.84.841 1.359 1.579 1.359 1.898 0 3.358-2.003 3.358-4.897 0-2.56-1.837-4.355-4.457-4.355-3.037 0-4.816 2.279-4.816 4.637 0 .919.219 1.9.619 2.438.041.199-.041.398-.119.558-.119.199-.359.758-.419.978-.041.199-.219.239-.499.119-1.378-.639-2.238-2.638-2.238-4.256 0-3.378 2.458-6.477 7.078-6.477 3.717 0 6.617 2.658 6.617 6.197 0 3.698-2.337 6.677-5.575 6.677-1.079 0-2.098-.558-2.458-1.219 0 0-.538 2.098-.658 2.618-.239.919-.878 2.078-1.317 2.778C9.316 23.764 10.641 24 12.017 24c6.624 0 11.99-5.367 11.99-11.987C24.007 5.367 18.641.001 12.017.001z"/>
                </svg>
              </a>
              <a href="#" class="group w-10 h-10 bg-gray-800 hover:bg-gradient-to-r hover:from-amber-500 hover:to-yellow-500 rounded-lg flex items-center justify-center transition-all duration-300 transform hover:scale-110">
                <svg class="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
            </div>
          </div>

          <!-- Services -->
          <div class="space-y-6">
            <h4 class="text-lg font-semibold text-white mb-4">Servicios</h4>
            <ul class="space-y-3">
              <li><a href="#" class="text-slate-300 hover:text-amber-400 transition-colors duration-200 text-sm flex items-center group">
                <span class="w-1.5 h-1.5 bg-amber-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                Traslado al Aeropuerto
              </a></li>
              <li><a href="#" class="text-slate-300 hover:text-amber-400 transition-colors duration-200 text-sm flex items-center group">
                <span class="w-1.5 h-1.5 bg-amber-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                Traslado desde el Aeropuerto
              </a></li>
              <li><a href="#" class="text-slate-300 hover:text-amber-400 transition-colors duration-200 text-sm flex items-center group">
                <span class="w-1.5 h-1.5 bg-amber-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                Servicios por Horas
              </a></li>
              <li><a href="#" class="text-slate-300 hover:text-amber-400 transition-colors duration-200 text-sm flex items-center group">
                <span class="w-1.5 h-1.5 bg-amber-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                Traslados Corporativos
              </a></li>
              <li><a href="#" class="text-slate-300 hover:text-amber-400 transition-colors duration-200 text-sm flex items-center group">
                <span class="w-1.5 h-1.5 bg-amber-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                Tours Personalizados
              </a></li>
            </ul>
          </div>

          <!-- Support -->
          <div class="space-y-6">
            <h4 class="text-lg font-semibold text-white mb-4">Soporte</h4>
            <ul class="space-y-3">
              <li><a href="#" class="text-slate-300 hover:text-amber-400 transition-colors duration-200 text-sm flex items-center group">
                <span class="w-1.5 h-1.5 bg-amber-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                Centro de Ayuda
              </a></li>
              <li><a href="#" class="text-slate-300 hover:text-amber-400 transition-colors duration-200 text-sm flex items-center group">
                <span class="w-1.5 h-1.5 bg-amber-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                Términos y Condiciones
              </a></li>
              <li><a href="#" class="text-slate-300 hover:text-amber-400 transition-colors duration-200 text-sm flex items-center group">
                <span class="w-1.5 h-1.5 bg-amber-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                Política de Privacidad
              </a></li>
              <li><a href="#" class="text-slate-300 hover:text-amber-400 transition-colors duration-200 text-sm flex items-center group">
                <span class="w-1.5 h-1.5 bg-amber-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                Preguntas Frecuentes
              </a></li>
              <li><a href="mailto:contacto@voyalaeropuerto.com" class="text-slate-300 hover:text-amber-400 transition-colors duration-200 text-sm flex items-center group">
                <span class="w-1.5 h-1.5 bg-amber-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                Contactar Soporte
              </a></li>
            </ul>
          </div>

          <!-- Contact Info -->
          <div class="space-y-6">
            <h4 class="text-lg font-semibold text-white mb-4">Contacto</h4>
            <div class="space-y-4">
              <div class="flex items-start space-x-3">
                <div class="w-5 h-5 text-amber-400 mt-0.5">
                  <svg fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                  </svg>
                </div>
                <div>
                  <p class="text-slate-300 text-sm">Email</p>
                  <a href="mailto:contacto@voyalaeropuerto.com" class="text-white hover:text-amber-400 transition-colors text-sm font-medium">
                    contacto&#64;voyalaeropuerto.com
                  </a>
                </div>
              </div>
              
              <div class="flex items-start space-x-3">
                <div class="w-5 h-5 text-amber-400 mt-0.5">
                  <svg fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"/>
                  </svg>
                </div>
                <div>
                  <p class="text-slate-300 text-sm">Oficina</p>
                  <p class="text-white text-sm font-medium">
                    Ciudad de México, México
                  </p>
                </div>
              </div>

              <div class="flex items-start space-x-3">
                <div class="w-5 h-5 text-amber-400 mt-0.5">
                  <svg fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
                  </svg>
                </div>
                <div>
                  <p class="text-slate-300 text-sm">Teléfono</p>
                  <a href="tel:+525555555555" class="text-white hover:text-amber-400 transition-colors text-sm font-medium">
                    +52 55 5555 5555
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Bottom section -->
        <div class="pt-8 border-t border-slate-700/50">
          <div class="flex flex-col md:flex-row justify-between items-center gap-4">
            <div class="text-center md:text-left">
              <p class="text-slate-400 text-sm">
                © {{ year }} VoyalAeropuerto.com. Todos los derechos reservados.
              </p>
            </div>
            <div class="flex items-center space-x-6">
            </div>
          </div>
        </div>
      </div>

      <!-- Floating elements -->
      <div class="absolute top-20 left-10 w-2 h-2 bg-amber-400/20 rounded-full animate-ping"></div>
      <div class="absolute bottom-32 right-20 w-3 h-3 bg-blue-400/20 rounded-full animate-pulse"></div>
      <div class="absolute top-1/2 right-10 w-1 h-1 bg-amber-300/30 rounded-full"></div>
    </footer>
  `
})
export class FooterComponent {
  year = new Date().getFullYear();
}
