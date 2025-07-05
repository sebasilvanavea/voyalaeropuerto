import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { PricingService } from '../../services/pricing.service';

@Component({
  selector: 'app-booking-success',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center px-4">
      <div class="max-w-md w-full">
        <!-- Success Animation -->
        <div class="text-center mb-8">
          <div class="w-20 h-20 mx-auto bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mb-4 animate-bounce">
            <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
            </svg>
          </div>
          <h1 class="text-2xl font-bold text-gray-900 mb-2">¡Reserva Confirmada!</h1>
          <p class="text-gray-600">Tu traslado ha sido reservado exitosamente</p>
        </div>

        <!-- Booking Details Card -->
        <div class="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <div class="border-b pb-4 mb-4">
            <h2 class="text-lg font-semibold text-gray-900">Detalles de la reserva</h2>
            <p class="text-sm text-gray-500">ID: {{ bookingId }}</p>
          </div>
          
          <div class="space-y-3 text-sm">
            <div class="flex justify-between">
              <span class="text-gray-600">Total pagado:</span>
              <span class="font-bold text-lg text-green-600">{{ formatPrice(total) }}</span>
            </div>
            <div class="bg-green-50 border border-green-200 rounded-lg p-3">
              <p class="text-green-800 text-xs">
                <strong>¡Importante!</strong> Recibirás un email de confirmación con todos los detalles. 
                El conductor te contactará 15 minutos antes del viaje.
              </p>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="space-y-3">
          <button 
            (click)="goToBookings()"
            class="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg"
          >
            Ver mis reservas
          </button>
          <button 
            (click)="goHome()"
            class="w-full px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
          >
            Volver al inicio
          </button>
        </div>

        <!-- Contact Info -->
        <div class="mt-6 text-center text-sm text-gray-500">
          <p>¿Necesitas ayuda? Contáctanos al</p>
          <a href="tel:+56912345678" class="text-blue-600 font-medium hover:underline">
            +56 9 1234 5678
          </a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    @keyframes bounce {
      0%, 20%, 53%, 80%, 100% {
        transform: translateY(0);
      }
      40%, 43% {
        transform: translateY(-10px);
      }
      70% {
        transform: translateY(-5px);
      }
      90% {
        transform: translateY(-2px);
      }
    }

    .animate-bounce {
      animation: bounce 2s infinite;
    }
  `]
})
export class BookingSuccessComponent implements OnInit {
  bookingId: string = '';
  total: number = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private pricingService: PricingService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.bookingId = params['bookingId'] || '';
      this.total = parseInt(params['total']) || 0;
    });
  }

  formatPrice(price: number): string {
    return this.pricingService.formatPrice(price);
  }

  goToBookings() {
    this.router.navigate(['/admin/bookings']);
  }

  goHome() {
    this.router.navigate(['/']);
  }
}
