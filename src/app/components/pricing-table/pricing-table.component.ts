import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PricingService, Destination } from '../../services/pricing.service';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-pricing-table',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="max-w-6xl mx-auto">
      <h2 class="text-3xl font-bold text-slate-900 mb-2 text-center">Tarifas Voy Al Aeropuerto</h2>
      <p class="text-slate-600 mb-6 text-center">Valores para Taxi Ejecutivo y SUV hacia/desde el aeropuerto</p>

      <!-- Información de vehículos -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div class="card border-yellow-200">
          <h3 class="font-bold text-lg text-yellow-800 mb-3 flex items-center gap-2">
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.22.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
            </svg>
            Taxi Ejecutivo
          </h3>
          <div class="space-y-2 text-sm">
            <div class="flex justify-between">
              <span>Pasajeros máximos:</span>
              <span class="font-semibold">3</span>
            </div>
            <div class="flex justify-between">
              <span>Maletas bodega:</span>
              <span class="font-semibold">2</span>
            </div>
            <div class="flex justify-between">
              <span>Maletas de mano:</span>
              <span class="font-semibold">2</span>
            </div>
          </div>
        </div>

        <div class="card border-blue-200">
          <h3 class="font-bold text-lg text-blue-800 mb-3 flex items-center gap-2">
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.22.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
            </svg>
            SUV
          </h3>
          <div class="space-y-2 text-sm">
            <div class="flex justify-between">
              <span>Pasajeros máximos:</span>
              <span class="font-semibold">4</span>
            </div>
            <div class="flex justify-between">
              <span>Maletas bodega:</span>
              <span class="font-semibold">3</span>
            </div>
            <div class="flex justify-between">
              <span>Maletas de mano:</span>
              <span class="font-semibold">2</span>
            </div>
            <div class="flex justify-between">
              <span>Mochilas:</span>
              <span class="font-semibold">4</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Recargos -->
      <div class="card border-orange-200 mb-6">
        <h3 class="font-bold text-lg text-orange-800 mb-2">⚠️ Recargos Importantes</h3>
        <p class="text-orange-700">Si el servicio es <strong>desde el aeropuerto</strong> tiene un recargo de <strong class="text-xl">$2.000</strong></p>
      </div>

      <!-- Filtros -->
      <form [formGroup]="filterForm" class="mb-6">
        <div class="flex flex-wrap gap-4 items-end">
          <div class="flex-1 min-w-64">
            <label class="block text-sm font-semibold text-slate-700 mb-2">Buscar destino</label>
            <input 
              type="text" 
              formControlName="search"
              placeholder="Buscar por nombre..."
              class="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
          </div>
          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-2">Ordenar por</label>
            <select 
              formControlName="sortBy"
              class="p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="name">Nombre A-Z</option>
              <option value="name-desc">Nombre Z-A</option>
              <option value="price">Precio menor a mayor</option>
              <option value="price-desc">Precio mayor a menor</option>
            </select>
          </div>
        </div>
      </form>

      <!-- Tabla de precios -->
      <div class="overflow-x-auto">
        <table class="w-full border-collapse bg-white rounded-lg overflow-hidden shadow-sm">
          <thead>
            <tr class="bg-slate-50">
              <th class="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider border-b">
                Destino
              </th>
              <th class="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider border-b">
                Precio Base
              </th>
              <th class="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider border-b">
                Desde Aeropuerto<br>
                <span class="text-orange-600 font-normal">(+$2.000)</span>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr 
              *ngFor="let destination of filteredDestinations; let i = index" 
              [class.bg-slate-25]="i % 2 === 0"
              class="hover:bg-blue-50 transition-colors"
            >
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 border-b border-slate-100">
                {{ destination.name }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-bold text-green-600 border-b border-slate-100">
                {{ formatPrice(destination.basePrice) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-bold text-orange-600 border-b border-slate-100">
                {{ formatPrice(destination.basePrice + 2000) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="mt-6 text-center">
        <p class="text-sm text-slate-500">
          Total de destinos: {{ filteredDestinations.length }}
        </p>
      </div>
    </div>
  `
})
export class PricingTableComponent implements OnInit {
  destinations: Destination[] = [];
  filteredDestinations: Destination[] = [];
  filterForm: FormGroup;

  constructor(
    private pricingService: PricingService,
    private fb: FormBuilder
  ) {
    this.filterForm = this.fb.group({
      search: [''],
      sortBy: ['name']
    });
  }

  ngOnInit() {
    this.destinations = this.pricingService.getDestinations();
    this.filteredDestinations = [...this.destinations];

    // Subscribe to form changes for real-time filtering
    this.filterForm.valueChanges.subscribe(() => {
      this.applyFilters();
    });
  }

  applyFilters() {
    const search = this.filterForm.value.search?.toLowerCase() || '';
    const sortBy = this.filterForm.value.sortBy;

    // Filter by search term
    let filtered = this.destinations.filter(dest =>
      dest.name.toLowerCase().includes(search)
    );

    // Sort
    switch (sortBy) {
      case 'name':
        filtered = filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        filtered = filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'price':
        filtered = filtered.sort((a, b) => a.basePrice - b.basePrice);
        break;
      case 'price-desc':
        filtered = filtered.sort((a, b) => b.basePrice - a.basePrice);
        break;
    }

    this.filteredDestinations = filtered;
  }

  formatPrice(price: number): string {
    return this.pricingService.formatPrice(price);
  }
}
