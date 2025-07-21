import { Component, ChangeDetectorRef, ChangeDetectionStrategy, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

type BookingVariant = 'hero' | 'section';

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  template: `
    <div class="booking-cta-container" [ngClass]="getContainerClasses()">
      <!-- Modern Hero Section -->
      <div class="text-center" [ngClass]="getHeaderClasses()">
        <div class="inline-flex items-center justify-center bg-gradient-to-r from-amber-500 to-yellow-500 rounded-2xl shadow-lg" [ngClass]="getIconClasses()">
          <svg class="text-white" [ngClass]="getIconSvgClasses()" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
          </svg>
        </div>
        <h2 class="font-bold text-slate-900" [ngClass]="getTitleClasses()">
          Reserva tu Traslado
        </h2>
        <p class="text-slate-600 max-w-md mx-auto" [ngClass]="getSubtitleClasses()">
          Proceso rápido y seguro en 4 simples pasos
        </p>
      </div>

      <!-- Steps Preview -->
      <div class="grid gap-4" [ngClass]="getStepsGridClasses()">
        <div class="text-center">
          <div class="bg-amber-100 rounded-xl flex items-center justify-center mx-auto hover:bg-amber-200 transition-colors duration-300" [ngClass]="getStepIconClasses()">
            <svg class="text-amber-600" [ngClass]="getStepSvgClasses()" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m-6 3l6-3"/>
            </svg>
          </div>
          <span class="font-medium text-slate-700" [ngClass]="getStepTextClasses()">Ruta</span>
        </div>
        <div class="text-center">
          <div class="bg-yellow-100 rounded-xl flex items-center justify-center mx-auto hover:bg-yellow-200 transition-colors duration-300" [ngClass]="getStepIconClasses()">
            <svg class="text-yellow-600" [ngClass]="getStepSvgClasses()" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/>
            </svg>
          </div>
          <span class="font-medium text-slate-700" [ngClass]="getStepTextClasses()">Vehículo</span>
        </div>
        <div class="text-center">
          <div class="bg-orange-100 rounded-xl flex items-center justify-center mx-auto hover:bg-orange-200 transition-colors duration-300" [ngClass]="getStepIconClasses()">
            <svg class="text-orange-600" [ngClass]="getStepSvgClasses()" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
            </svg>
          </div>
          <span class="font-medium text-slate-700" [ngClass]="getStepTextClasses()">Detalles</span>
        </div>
        <div class="text-center">
          <div class="bg-amber-100 rounded-xl flex items-center justify-center mx-auto hover:bg-amber-200 transition-colors duration-300" [ngClass]="getStepIconClasses()">
            <svg class="text-amber-600" [ngClass]="getStepSvgClasses()" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
            </svg>
          </div>
          <span class="font-medium text-slate-700" [ngClass]="getStepTextClasses()">Confirmar</span>
        </div>
      </div>

      <!-- Features -->
      <div class="bg-gray-50 rounded-xl border border-gray-200" [ngClass]="getFeaturesClasses()">
        <div class="grid gap-4 text-sm" [ngClass]="getFeaturesGridClasses()">
          <div class="flex items-center space-x-3">
            <div class="bg-amber-100 rounded-full flex items-center justify-center" [ngClass]="getFeatureIconClasses()">
              <svg class="text-amber-600" [ngClass]="getFeatureSvgClasses()" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
              </svg>
            </div>
            <span class="text-slate-700" [ngClass]="getFeatureTextClasses()">Precios transparentes</span>
          </div>
          <div class="flex items-center space-x-3">
            <div class="bg-amber-100 rounded-full flex items-center justify-center" [ngClass]="getFeatureIconClasses()">
              <svg class="text-amber-600" [ngClass]="getFeatureSvgClasses()" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
              </svg>
            </div>
            <span class="text-slate-700" [ngClass]="getFeatureTextClasses()">Cancelación gratuita</span>
          </div>
          <div class="flex items-center space-x-3">
            <div class="bg-amber-100 rounded-full flex items-center justify-center" [ngClass]="getFeatureIconClasses()">
              <svg class="text-amber-600" [ngClass]="getFeatureSvgClasses()" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
              </svg>
            </div>
            <span class="text-slate-700" [ngClass]="getFeatureTextClasses()">Conductores verificados</span>
          </div>
          <div class="flex items-center space-x-3">
            <div class="bg-amber-100 rounded-full flex items-center justify-center" [ngClass]="getFeatureIconClasses()">
              <svg class="text-amber-600" [ngClass]="getFeatureSvgClasses()" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
              </svg>
            </div>
            <span class="text-slate-700" [ngClass]="getFeatureTextClasses()">Seguimiento en tiempo real</span>
          </div>
        </div>
      </div>

      <!-- CTA Button -->
      <button 
        (click)="startBooking()"
        class="w-full bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 relative overflow-hidden group"
        [ngClass]="getButtonClasses()"
      >
        <span class="relative z-10 flex items-center justify-center space-x-2">
          <span>Reservar Ahora</span>
          <svg class="transform group-hover:translate-x-1 transition-transform duration-300" [ngClass]="getButtonIconClasses()" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
          </svg>
        </span>
        <div class="absolute inset-0 bg-gradient-to-r from-yellow-600 to-amber-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </button>

      <!-- Quick Quote Button -->
      <button 
        (click)="quickQuote()"
        class="w-full bg-white border-2 border-gray-200 hover:border-amber-300 text-gray-700 font-medium rounded-xl transition-all duration-200 hover:bg-gray-50"
        [ngClass]="getSecondaryButtonClasses()"
      >
        Ver Precios Rápidamente
      </button>
    </div>
  `,
  styles: [`
    .booking-cta-container {
      max-width: 100%;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BookingComponent {
  @Input() variant: BookingVariant = 'section';

  constructor(
    private router: Router,
    private cd: ChangeDetectorRef
  ) {}

  // Métodos para obtener clases dinámicas basadas en la variante
  getContainerClasses(): string {
    return this.variant === 'hero' ? 'p-2' : 'p-4';
  }

  getHeaderClasses(): string {
    return this.variant === 'hero' ? 'mb-4' : 'mb-8';
  }

  getIconClasses(): string {
    return this.variant === 'hero' ? 'w-12 h-12 mb-3' : 'w-16 h-16 mb-6';
  }

  getIconSvgClasses(): string {
    return this.variant === 'hero' ? 'w-6 h-6' : 'w-8 h-8';
  }

  getTitleClasses(): string {
    return this.variant === 'hero' ? 'text-xl mb-2' : 'text-3xl mb-4';
  }

  getSubtitleClasses(): string {
    return this.variant === 'hero' ? 'text-sm' : 'text-lg';
  }

  getStepsGridClasses(): string {
    return this.variant === 'hero' ? 'grid-cols-2 gap-2 mb-4' : 'grid-cols-2 md:grid-cols-4 gap-4 mb-8';
  }

  getStepIconClasses(): string {
    return this.variant === 'hero' ? 'w-8 h-8 mb-1' : 'w-12 h-12 mb-2';
  }

  getStepSvgClasses(): string {
    return this.variant === 'hero' ? 'w-4 h-4' : 'w-6 h-6';
  }

  getStepTextClasses(): string {
    return this.variant === 'hero' ? 'text-xs' : 'text-sm';
  }

  getFeaturesClasses(): string {
    return this.variant === 'hero' ? 'p-3 mb-4' : 'p-6 mb-8';
  }

  getFeaturesGridClasses(): string {
    return this.variant === 'hero' ? 'grid-cols-1 gap-2' : 'grid-cols-1 md:grid-cols-2 gap-4';
  }

  getFeatureIconClasses(): string {
    return this.variant === 'hero' ? 'w-4 h-4' : 'w-6 h-6';
  }

  getFeatureSvgClasses(): string {
    return this.variant === 'hero' ? 'w-3 h-3' : 'w-4 h-4';
  }

  getFeatureTextClasses(): string {
    return this.variant === 'hero' ? 'text-xs' : 'text-sm';
  }

  getButtonClasses(): string {
    return this.variant === 'hero' ? 'py-2 px-4 mb-2' : 'py-4 px-8';
  }

  getButtonIconClasses(): string {
    return this.variant === 'hero' ? 'w-4 h-4' : 'w-5 h-5';
  }

  getSecondaryButtonClasses(): string {
    return this.variant === 'hero' ? 'py-2 px-4 text-sm' : 'mt-3 py-3 px-6';
  }

  startBooking() {
    // En lugar de navegar, hacer scroll a la sección de reserva
    const element = document.getElementById('reserva');
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    } else {
      // Si no encuentra la sección, navegar a booking-steps
      this.router.navigate(['/booking-steps']);
    }
  }

  quickQuote() {
    // Hacer scroll a la sección de cotización
    const element = document.getElementById('cotizar');
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    } else {
      // Fallback a navegación
      this.router.navigate(['/cotizar']);
    }
  }
}