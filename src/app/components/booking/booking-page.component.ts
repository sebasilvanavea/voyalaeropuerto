import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BookingComponent } from './booking.component';

@Component({
  selector: 'app-booking-page',
  standalone: true,
  imports: [CommonModule, RouterModule, BookingComponent],  template: `
    <div class="min-h-screen bg-gradient-to-br from-slate-50 to-gray-50 pt-20">
      
      <!-- Hero Section -->
      <section class="relative py-20 overflow-hidden">
        <div class="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-indigo-600/10"></div>
        <div class="container mx-auto px-4 relative">
          <div class="max-w-4xl mx-auto text-center">
            <div class="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full mb-6">
              <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
              </svg>
            </div>
            <h1 class="text-5xl font-bold text-slate-900 mb-6 leading-tight">
              Reserva tu Traslado al
              <span class="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Aeropuerto</span>
            </h1>
            <p class="text-xl text-slate-600 max-w-3xl mx-auto mb-8 leading-relaxed">
              Servicio premium de traslados con tarifas fijas, conductores profesionales y vehículos de primera clase. 
              <strong>Sin sorpresas, sin esperas.</strong>
            </p>
            
            <!-- Features badges -->
            <div class="flex flex-wrap justify-center gap-4 mb-12">
              <div class="bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 border border-emerald-200">
                <div class="flex items-center gap-2">
                  <svg class="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  <span class="text-sm font-medium text-emerald-800">Precios Fijos</span>
                </div>
              </div>
              <div class="bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 border border-blue-200">
                <div class="flex items-center gap-2">
                  <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  <span class="text-sm font-medium text-blue-800">Puntualidad Garantizada</span>
                </div>
              </div>
              <div class="bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 border border-amber-200">
                <div class="flex items-center gap-2">
                  <svg class="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
                  </svg>
                  <span class="text-sm font-medium text-amber-800">Servicio Premium</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Main Booking Section -->
      <main class="pb-20">
        <div class="container mx-auto px-4">
          <div class="max-w-6xl mx-auto">
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              <!-- Booking Form -->
              <div class="lg:col-span-2">
                <app-booking></app-booking>
              </div>
              
              <!-- Sidebar with Information -->
              <div class="space-y-6">
                
                <!-- Why Choose Us -->
                <div class="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
                  <h3 class="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    ¿Por qué elegirnos?
                  </h3>
                  <div class="space-y-4">
                    <div class="flex items-start gap-3">
                      <div class="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg class="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"/>
                        </svg>
                      </div>
                      <div>
                        <h4 class="font-semibold text-slate-900">Tarifas Transparentes</h4>
                        <p class="text-sm text-slate-600">Sin cargos ocultos ni sorpresas. El precio que ves es el que pagas.</p>
                      </div>
                    </div>
                    
                    <div class="flex items-start gap-3">
                      <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                        </svg>
                      </div>
                      <div>
                        <h4 class="font-semibold text-slate-900">100% Seguro</h4>
                        <p class="text-sm text-slate-600">Conductores verificados, vehículos asegurados y seguimiento GPS.</p>
                      </div>
                    </div>
                    
                    <div class="flex items-start gap-3">
                      <div class="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg class="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                      </div>
                      <div>
                        <h4 class="font-semibold text-slate-900">Siempre Puntual</h4>
                        <p class="text-sm text-slate-600">Te esperamos 15 minutos antes para garantizar tu llegada a tiempo.</p>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Contact Info -->
                <div class="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-6 text-white">
                  <h3 class="text-xl font-bold mb-4">¿Necesitas ayuda?</h3>
                  <div class="space-y-3">
                    <div class="flex items-center gap-3">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                      </svg>
                      <div>
                        <p class="font-semibold">Llámanos 24/7</p>
                        <p class="text-blue-100">+56 9 1234 5678</p>
                      </div>
                    </div>
                    
                    <div class="flex items-center gap-3">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                      </svg>
                      <div>
                        <p class="font-semibold">WhatsApp</p>
                        <p class="text-blue-100">Respuesta inmediata</p>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Service Areas -->
                <div class="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
                  <h3 class="text-xl font-bold text-slate-900 mb-4">Zonas de Servicio</h3>
                  <div class="space-y-2 text-sm">
                    <div class="flex justify-between">
                      <span class="text-slate-600">Santiago Centro</span>
                      <span class="font-semibold text-emerald-600">Desde $25.000</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-slate-600">Las Condes</span>
                      <span class="font-semibold text-emerald-600">Desde $28.000</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-slate-600">Providencia</span>
                      <span class="font-semibold text-emerald-600">Desde $27.000</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-slate-600">Maipú</span>
                      <span class="font-semibold text-emerald-600">Desde $22.000</span>
                    </div>
                  </div>
                  <div class="mt-4 pt-4 border-t border-slate-200">
                    <a routerLink="/precios" class="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-1">
                      Ver todas las tarifas
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/>
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <!-- Process Steps -->
      <section class="bg-white py-16 border-t border-slate-200">
        <div class="container mx-auto px-4">
          <div class="max-w-4xl mx-auto">
            <h2 class="text-3xl font-bold text-center text-slate-900 mb-12">¿Cómo funciona?</h2>
            <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div class="text-center relative">
                <div class="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold shadow-lg">
                  1
                </div>
                <h3 class="text-lg font-semibold text-slate-900 mb-2">Selecciona</h3>
                <p class="text-slate-600">Elige tu destino, vehículo y fecha de viaje</p>
                <!-- Connecting line -->
                <div class="hidden md:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-blue-200 to-blue-300 -translate-x-1/2"></div>
              </div>
              
              <div class="text-center relative">
                <div class="w-16 h-16 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold shadow-lg">
                  2
                </div>
                <h3 class="text-lg font-semibold text-slate-900 mb-2">Completa</h3>
                <p class="text-slate-600">Llena los datos y revisa el precio final</p>
                <!-- Connecting line -->
                <div class="hidden md:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-emerald-200 to-amber-300 -translate-x-1/2"></div>
              </div>
              
              <div class="text-center relative">
                <div class="w-16 h-16 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold shadow-lg">
                  3
                </div>
                <h3 class="text-lg font-semibold text-slate-900 mb-2">Confirma</h3>
                <p class="text-slate-600">Envía tu reserva y recibe confirmación</p>
                <!-- Connecting line -->
                <div class="hidden md:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-amber-200 to-green-300 -translate-x-1/2"></div>
              </div>
              
              <div class="text-center">
                <div class="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <svg class="w-8 h-8" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
                  </svg>
                </div>
                <h3 class="text-lg font-semibold text-slate-900 mb-2">¡Listo!</h3>
                <p class="text-slate-600">Te contactaremos con los detalles del conductor</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <!-- Guarantees -->
      <section class="bg-gradient-to-br from-slate-50 to-blue-50 py-16">
        <div class="container mx-auto px-4">
          <div class="max-w-6xl mx-auto">
            <h2 class="text-3xl font-bold text-center text-slate-900 mb-8">Nuestras Garantías</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div class="bg-white p-6 rounded-2xl shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-300">
                <div class="flex items-center mb-3">
                  <div class="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mr-4">
                    <svg class="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                  </div>
                  <h3 class="font-semibold text-slate-900">Puntualidad</h3>
                </div>
                <p class="text-slate-600">Llegamos 15 minutos antes de la hora acordada. Tu vuelo es nuestra prioridad.</p>
              </div>
              
              <div class="bg-white p-6 rounded-2xl shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-300">
                <div class="flex items-center mb-3">
                  <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                    <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                    </svg>
                  </div>
                  <h3 class="font-semibold text-slate-900">Seguridad</h3>
                </div>
                <p class="text-slate-600">Conductores verificados, antecedentes al día y vehículos completamente asegurados.</p>
              </div>
              
              <div class="bg-white p-6 rounded-2xl shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-300">
                <div class="flex items-center mb-3">
                  <div class="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mr-4">
                    <svg class="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
                    </svg>
                  </div>
                  <h3 class="font-semibold text-slate-900">Calidad Premium</h3>
                </div>
                <p class="text-slate-600">Servicio 5 estrellas con vehículos premium y conductores altamente capacitados.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  `
})
export class BookingPageComponent {}
