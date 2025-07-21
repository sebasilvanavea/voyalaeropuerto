import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookingComponent } from '../booking/booking.component';

@Component({
  selector: 'app-booking-section',
  standalone: true,
  imports: [CommonModule, BookingComponent],
  template: `
    <!-- Booking/Reserva Section -->
    <section id="reserva" class="py-20 bg-gray-50 scroll-mt-20">
      <div class="max-w-4xl mx-auto px-6 lg:px-8 text-center">
        <div class="mb-12">
          <span class="inline-block px-4 py-2 bg-amber-100 text-amber-800 rounded-full text-sm font-semibold mb-4 animate-fadeInUp">
            ¡Reserva Ahora!
          </span>
          <h2 class="text-4xl md:text-5xl font-bold text-gray-900 mb-6 animate-fadeInUp delay-100">
            Innova con 
            <span class="bg-gradient-to-r from-amber-500 to-yellow-500 bg-clip-text text-transparent">
              Soluciones de Transporte
            </span>
          </h2>
          <p class="text-xl text-gray-600 max-w-3xl mx-auto animate-fadeInUp delay-200">
            Trabaja con un experto certificado y confiable en traslados para satisfacer las necesidades de tu viaje.
          </p>
        </div>
        
        <div class="bg-white rounded-3xl shadow-lg border border-gray-200 p-8 md:p-12 animate-fadeInUp delay-300 hover:shadow-xl transition-all duration-500">
          <app-booking variant="section"></app-booking>
        </div>
      </div>
    </section>
  `,
  styles: [`
    /* Animation keyframes */
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

    /* Animation classes */
    .animate-fadeInUp {
      animation: fadeInUp 0.8s ease-out forwards;
    }

    .delay-100 {
      animation-delay: 0.1s;
    }

    .delay-200 {
      animation-delay: 0.2s;
    }

    .delay-300 {
      animation-delay: 0.3s;
    }

    /* Enhanced shadow effects */
    .shadow-3xl {
      box-shadow: 0 35px 60px -12px rgba(0, 0, 0, 0.25);
    }

    /* Background gradient effects */
    section {
      background: #f9fafb;
      position: relative;
      overflow: hidden;
    }

    section::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: radial-gradient(ellipse at top, rgba(245, 158, 11, 0.05) 0%, transparent 70%);
      pointer-events: none;
    }

    /* Floating elements for modern effect */
    section::after {
      content: '';
      position: absolute;
      top: 20%;
      right: 10%;
      width: 200px;
      height: 200px;
      background: linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(251, 191, 36, 0.1));
      border-radius: 50%;
      filter: blur(40px);
      animation: float 6s ease-in-out infinite;
    }

    @keyframes float {
      0%, 100% {
        transform: translateY(0px);
      }
      50% {
        transform: translateY(-20px);
      }
    }

    /* Enhanced booking card styles */
    .bg-white.rounded-3xl {
      backdrop-filter: blur(10px);
      background: rgba(255, 255, 255, 0.95);
      border: 1px solid rgba(255, 255, 255, 0.2);
    }

    /* Text gradient enhancement */
    .bg-gradient-to-r.from-amber-500.to-yellow-500 {
      background: linear-gradient(90deg, #f59e0b 0%, #eab308 100%);
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    /* Responsive enhancements */
    @media (max-width: 768px) {
      .max-w-4xl {
        max-width: 100%;
      }
      
      .px-6 {
        padding-left: 1rem;
        padding-right: 1rem;
      }
      
      .p-8 {
        padding: 1.5rem;
      }
    }
  `]
})
export class BookingSectionComponent {}
