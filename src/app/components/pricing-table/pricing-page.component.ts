import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PricingTableComponent } from './pricing-table.component';

@Component({
  selector: 'app-pricing-page',
  standalone: true,
  imports: [CommonModule, RouterModule, PricingTableComponent],
  template: `
    <div class="min-h-screen bg-gray-50 pt-20">
      <main class="pt-8 pb-16">
        <app-pricing-table></app-pricing-table>
      </main>
      
      <!-- Call to Action -->
      <section class="bg-gradient-to-r from-amber-500 to-yellow-600 py-12">
        <div class="container mx-auto px-4 text-center">
          <h2 class="text-3xl font-bold text-white mb-4">¿Listo para viajar?</h2>
          <p class="text-xl text-amber-100 mb-8 max-w-2xl mx-auto">
            Reserve su traslado al aeropuerto con tarifas transparentes y servicio confiable
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <a routerLink="/cotizar" 
               class="btn btn-primary">
              Calcular Precio
            </a>
            <a routerLink="/reservar" 
               class="btn btn-accent">
              Reservar Ahora
            </a>
          </div>
        </div>
      </section>
    </div>
  `
})
export class PricingPageComponent {}
