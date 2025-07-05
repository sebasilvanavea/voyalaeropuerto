import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tracking',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen min-w-full max-w-md mx-auto bg-white p-8 rounded-lg shadow-md mt-12">
      <h2 class="text-2xl font-bold text-slate-900 mb-6">Seguimiento de Reserva</h2>
      <p class="mb-4 text-slate-700">Ingresa tu código de reserva para ver el estado de tu traslado.</p>
      <form class="space-y-4">
        <div>
          <input type="text" class="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary" placeholder="Código de reserva">
        </div>
        <button type="submit" class="w-full py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors">
          Consultar Estado
        </button>
      </form>
      <div class="mt-6 text-slate-600">
        <!-- Aquí se mostraría el estado de la reserva si existiera lógica de backend -->
        <p>Estado: <span class="font-semibold">En desarrollo</span></p>
      </div>
    </div>
  `
})
export class TrackingComponent {}
