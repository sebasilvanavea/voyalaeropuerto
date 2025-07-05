import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { QuoteFormComponent } from './quote-form.component';

@Component({
  selector: 'app-quote-page',
  standalone: true,
  imports: [CommonModule, RouterModule, QuoteFormComponent],
  template: `
    <div class="min-h-screen bg-gray-50 pt-20">
      <!-- <app-header></app-header> removed: header is now global -->
      <main class="pt-8 pb-16">
        <div class="container mx-auto px-4">
          <div class="text-center mb-8">
            <h1 class="text-4xl font-bold text-slate-900 mb-4">Cotiza tu Viaje</h1>
            <p class="text-xl text-slate-600 max-w-3xl mx-auto">
              Calcula el precio exacto de tu traslado al aeropuerto. Precios transparentes, sin sorpresas.
            </p>
          </div>
          <app-quote-form></app-quote-form>
        </div>
      </main>
      
      <!-- Información adicional -->
      <section class="card py-12 border-t">
        <div class="container mx-auto px-4">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div class="text-center">
              <div class="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"/>
                </svg>
              </div>
              <h3 class="text-xl font-bold text-slate-900 mb-2">Precios Fijos</h3>
              <p class="text-slate-600">Tarifas transparentes sin cargos ocultos ni sorpresas</p>
            </div>
            
            <div class="text-center">
              <div class="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <h3 class="text-xl font-bold text-slate-900 mb-2">Servicio Confiable</h3>
              <p class="text-slate-600">Conductores profesionales y vehículos en excelente estado</p>
            </div>
            
            <div class="text-center">
              <div class="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg class="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <h3 class="text-xl font-bold text-slate-900 mb-2">Puntualidad</h3>
              <p class="text-slate-600">Llegamos a tiempo para que no pierdas tu vuelo</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  `
})
export class QuotePageComponent {}
