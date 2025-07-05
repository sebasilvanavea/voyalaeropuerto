import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminService } from '../../services/admin.service';

interface Promotion {
  id: string;
  code: string;
  name: string;
  description: string;
  type: 'percentage' | 'fixed_amount' | 'free_ride';
  discount_value: number;
  min_trip_amount?: number;
  max_discount_amount?: number;
  usage_limit: number;
  usage_count: number;
  user_limit: number;
  is_active: boolean;
  valid_from: string;
  valid_until: string;
  applicable_routes?: string[];
  applicable_vehicle_types?: string[];
  created_at: string;
  updated_at: string;
}

@Component({
  selector: 'app-admin-promotions',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="p-6 space-y-6">
      <!-- Page Header -->
      <div class="flex justify-between items-center">
        <div>
          <h2 class="text-2xl font-bold text-gray-900">Gestión de Promociones</h2>
          <p class="text-gray-600">Administra códigos de descuento y promociones especiales</p>
        </div>
        <div class="flex space-x-3">
          <button (click)="exportPromotions()" 
                  class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            <svg class="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                    d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
            </svg>
            Exportar
          </button>
          <button (click)="openCreateModal()" 
                  class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <svg class="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
            </svg>
            Nueva Promoción
          </button>
        </div>
      </div>

      <!-- Statistics Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="p-2 bg-blue-100 rounded-lg">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Total Promociones</p>
              <p class="text-2xl font-semibold text-gray-900">{{promotionStats?.total || 0}}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="p-2 bg-green-100 rounded-lg">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Activas</p>
              <p class="text-2xl font-semibold text-gray-900">{{promotionStats?.active || 0}}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="p-2 bg-purple-100 rounded-lg">
              <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Usos Totales</p>
              <p class="text-2xl font-semibold text-gray-900">{{promotionStats?.totalUsage || 0}}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="p-2 bg-yellow-100 rounded-lg">
              <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"/>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Descuento Total</p>
              <p class="text-2xl font-semibold text-gray-900">
                {{promotionStats?.totalDiscount | currency:'CLP':'symbol':'1.0-0'}}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Filters -->
      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Filtros</h3>
        <form [formGroup]="filterForm" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Estado</label>
            <select formControlName="status" 
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Todos</option>
              <option value="active">Activa</option>
              <option value="inactive">Inactiva</option>
              <option value="expired">Expirada</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Tipo</label>
            <select formControlName="type" 
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Todos los tipos</option>
              <option value="percentage">Porcentaje</option>
              <option value="fixed_amount">Monto Fijo</option>
              <option value="free_ride">Viaje Gratis</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Fecha Desde</label>
            <input type="date" formControlName="dateFrom" 
                   class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Fecha Hasta</label>
            <input type="date" formControlName="dateTo" 
                   class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
          </div>

          <div class="lg:col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-2">Buscar</label>
            <input type="text" formControlName="search" placeholder="Código, nombre, descripción..." 
                   class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
          </div>

          <div class="flex items-end space-x-2">
            <button type="button" (click)="applyFilters()" 
                    class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
              Aplicar
            </button>
            <button type="button" (click)="clearFilters()" 
                    class="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors">
              Limpiar
            </button>
          </div>
        </form>
      </div>

      <!-- Promotions Table -->
      <div class="bg-white rounded-lg shadow overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200">
          <h3 class="text-lg font-semibold text-gray-900">Promociones</h3>
        </div>

        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Código
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nombre
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Descuento
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Uso
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vigencia
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr *ngFor="let promotion of filteredPromotions; trackBy: trackByPromotionId" 
                  class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">{{promotion.code}}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{promotion.name}}</div>
                  <div class="text-sm text-gray-500">{{promotion.description}}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span [class]="getTypeBadgeClass(promotion.type)" 
                        class="inline-flex px-2 py-1 text-xs font-semibold rounded-full">
                    {{getTypeText(promotion.type)}}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div [ngSwitch]="promotion.type">
                    <span *ngSwitchCase="'percentage'">{{promotion.discount_value}}%</span>
                    <span *ngSwitchCase="'fixed_amount'">{{promotion.discount_value | currency:'CLP':'symbol':'1.0-0'}}</span>
                    <span *ngSwitchCase="'free_ride'">Gratis</span>
                  </div>
                  <div *ngIf="promotion.max_discount_amount" class="text-xs text-gray-500">
                    Máx: {{promotion.max_discount_amount | currency:'CLP':'symbol':'1.0-0'}}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">
                    {{promotion.usage_count}}/{{promotion.usage_limit === -1 ? '∞' : promotion.usage_limit}}
                  </div>
                  <div class="w-full bg-gray-200 rounded-full h-2 mt-1">
                    <div class="bg-blue-600 h-2 rounded-full" 
                         [style.width.%]="getUsagePercentage(promotion)"></div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span [class]="getStatusBadgeClass(promotion)" 
                        class="inline-flex px-2 py-1 text-xs font-semibold rounded-full">
                    {{getStatusText(promotion)}}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div>{{promotion.valid_from | date:'dd/MM/yyyy'}}</div>
                  <div>{{promotion.valid_until | date:'dd/MM/yyyy'}}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <button (click)="editPromotion(promotion)" 
                          class="text-blue-600 hover:text-blue-900">
                    Editar
                  </button>
                  <button (click)="togglePromotionStatus(promotion)" 
                          [class]="promotion.is_active ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'">
                    {{promotion.is_active ? 'Desactivar' : 'Activar'}}
                  </button>
                  <button (click)="duplicatePromotion(promotion)" 
                          class="text-purple-600 hover:text-purple-900">
                    Duplicar
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div class="flex-1 flex justify-between sm:hidden">
            <button [disabled]="currentPage === 1" 
                    (click)="previousPage()" 
                    class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50">
              Anterior
            </button>
            <button [disabled]="currentPage === totalPages" 
                    (click)="nextPage()" 
                    class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50">
              Siguiente
            </button>
          </div>
          <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p class="text-sm text-gray-700">
                Mostrando <span class="font-medium">{{(currentPage - 1) * pageSize + 1}}</span> a 
                <span class="font-medium">{{Math.min(currentPage * pageSize, totalItems)}}</span> de 
                <span class="font-medium">{{totalItems}}</span> resultados
              </p>
            </div>
            <div>
              <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <button [disabled]="currentPage === 1" 
                        (click)="previousPage()" 
                        class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50">
                  <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd"/>
                  </svg>
                </button>
                
                <ng-container *ngFor="let page of getPageNumbers()">
                  <button (click)="goToPage(page)" 
                          [class.bg-blue-50]="page === currentPage"
                          [class.border-blue-500]="page === currentPage"
                          [class.text-blue-600]="page === currentPage"
                          class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                    {{page}}
                  </button>
                </ng-container>

                <button [disabled]="currentPage === totalPages" 
                        (click)="nextPage()" 
                        class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50">
                  <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"/>
                  </svg>
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>

      <!-- Create/Edit Promotion Modal -->
      <div *ngIf="showPromotionModal" 
           class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
           (click)="closePromotionModal()">
        <div class="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white"
             (click)="$event.stopPropagation()">
          <div class="mt-3">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-semibold text-gray-900">
                {{isEditMode ? 'Editar Promoción' : 'Nueva Promoción'}}
              </h3>
              <button (click)="closePromotionModal()" 
                      class="text-gray-400 hover:text-gray-600">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>

            <form [formGroup]="promotionForm" (ngSubmit)="savePromotion()" class="space-y-4">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Código *</label>
                  <input type="text" formControlName="code" 
                         class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <div *ngIf="promotionForm.get('code')?.errors?.['required'] && promotionForm.get('code')?.touched" 
                       class="text-red-500 text-sm mt-1">
                    El código es requerido
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Nombre *</label>
                  <input type="text" formControlName="name" 
                         class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                </div>

                <div class="md:col-span-2">
                  <label class="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
                  <textarea formControlName="description" rows="3"
                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                  </textarea>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Tipo *</label>
                  <select formControlName="type" 
                          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">Seleccionar tipo</option>
                    <option value="percentage">Porcentaje</option>
                    <option value="fixed_amount">Monto Fijo</option>
                    <option value="free_ride">Viaje Gratis</option>
                  </select>
                </div>

                <div *ngIf="promotionForm.get('type')?.value !== 'free_ride'">
                  <label class="block text-sm font-medium text-gray-700 mb-2">Valor del Descuento *</label>
                  <input type="number" formControlName="discount_value" min="0"
                         [max]="promotionForm.get('type')?.value === 'percentage' ? 100 : null"
                         class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Monto Mínimo de Viaje</label>
                  <input type="number" formControlName="min_trip_amount" min="0"
                         class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                </div>

                <div *ngIf="promotionForm.get('type')?.value === 'percentage'">
                  <label class="block text-sm font-medium text-gray-700 mb-2">Descuento Máximo</label>
                  <input type="number" formControlName="max_discount_amount" min="0"
                         class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Límite de Uso Total</label>
                  <input type="number" formControlName="usage_limit" min="-1"
                         class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <p class="text-xs text-gray-500 mt-1">-1 para uso ilimitado</p>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Límite por Usuario</label>
                  <input type="number" formControlName="user_limit" min="1"
                         class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Válido Desde *</label>
                  <input type="datetime-local" formControlName="valid_from" 
                         class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Válido Hasta *</label>
                  <input type="datetime-local" formControlName="valid_until" 
                         class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                </div>

                <div class="md:col-span-2">
                  <label class="flex items-center">
                    <input type="checkbox" formControlName="is_active" 
                           class="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50">
                    <span class="ml-2 text-sm text-gray-700">Promoción activa</span>
                  </label>
                </div>
              </div>

              <div class="flex justify-end space-x-2 pt-4 border-t">
                <button type="button" (click)="closePromotionModal()" 
                        class="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors">
                  Cancelar
                </button>
                <button type="submit" 
                        [disabled]="!promotionForm.valid || isSaving"
                        class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50">
                  {{isSaving ? 'Guardando...' : (isEditMode ? 'Actualizar' : 'Crear')}}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AdminPromotionsComponent implements OnInit {
  promotions: Promotion[] = [];
  filteredPromotions: Promotion[] = [];
  promotionStats: any = null;
  
  filterForm: FormGroup;
  promotionForm: FormGroup;
  
  showPromotionModal = false;
  isEditMode = false;
  isSaving = false;
  selectedPromotion: Promotion | null = null;

  // Pagination
  currentPage = 1;
  pageSize = 20;
  totalItems = 0;
  totalPages = 0;

  // Math reference for template
  Math = Math;

  constructor(
    private adminService: AdminService,
    private fb: FormBuilder
  ) {
    this.filterForm = this.fb.group({
      status: [''],
      type: [''],
      dateFrom: [''],
      dateTo: [''],
      search: ['']
    });

    this.promotionForm = this.fb.group({
      code: ['', [Validators.required, Validators.pattern(/^[A-Z0-9_-]+$/)]],
      name: ['', Validators.required],
      description: [''],
      type: ['', Validators.required],
      discount_value: [0, [Validators.required, Validators.min(0)]],
      min_trip_amount: [0],
      max_discount_amount: [null],
      usage_limit: [-1, Validators.required],
      user_limit: [1, [Validators.required, Validators.min(1)]],
      valid_from: ['', Validators.required],
      valid_until: ['', Validators.required],
      is_active: [true]
    });
  }

  ngOnInit() {
    this.loadPromotions();
    this.loadPromotionStats();
    this.setupFormSubscriptions();
  }

  setupFormSubscriptions() {
    this.filterForm.valueChanges.subscribe(() => {
      this.applyFilters();
    });

    // Auto-generate code based on name
    this.promotionForm.get('name')?.valueChanges.subscribe(value => {
      if (value && !this.isEditMode) {
        const code = value.toUpperCase().replace(/[^A-Z0-9]/g, '').substring(0, 10);
        this.promotionForm.patchValue({ code }, { emitEvent: false });
      }
    });
  }

  async loadPromotions() {
    try {
      const response = await this.adminService.getPromotions({
        page: this.currentPage,
        limit: this.pageSize,
        ...this.filterForm.value
      });
      
      this.promotions = response.data;
      this.totalItems = response.total;
      this.totalPages = Math.ceil(this.totalItems / this.pageSize);
      this.applyFilters();
    } catch (error) {
      console.error('Error loading promotions:', error);
    }
  }

  async loadPromotionStats() {
    try {
      this.promotionStats = await this.adminService.getPromotionStats();
    } catch (error) {
      console.error('Error loading promotion stats:', error);
    }
  }

  applyFilters() {
    const filters = this.filterForm.value;
    let filtered = [...this.promotions];

    if (filters.status) {
      const now = new Date();
      filtered = filtered.filter(p => {
        if (filters.status === 'active') {
          return p.is_active && new Date(p.valid_until) > now;
        } else if (filters.status === 'inactive') {
          return !p.is_active;
        } else if (filters.status === 'expired') {
          return new Date(p.valid_until) <= now;
        }
        return true;
      });
    }

    if (filters.type) {
      filtered = filtered.filter(p => p.type === filters.type);
    }

    if (filters.dateFrom) {
      const fromDate = new Date(filters.dateFrom);
      filtered = filtered.filter(p => new Date(p.created_at) >= fromDate);
    }

    if (filters.dateTo) {
      const toDate = new Date(filters.dateTo);
      toDate.setHours(23, 59, 59, 999);
      filtered = filtered.filter(p => new Date(p.created_at) <= toDate);
    }

    if (filters.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(p => 
        p.code.toLowerCase().includes(search) ||
        p.name.toLowerCase().includes(search) ||
        p.description?.toLowerCase().includes(search)
      );
    }

    this.filteredPromotions = filtered;
  }

  clearFilters() {
    this.filterForm.reset();
    this.applyFilters();
  }

  openCreateModal() {
    this.isEditMode = false;
    this.selectedPromotion = null;
    this.promotionForm.reset({
      usage_limit: -1,
      user_limit: 1,
      is_active: true
    });
    this.showPromotionModal = true;
  }

  editPromotion(promotion: Promotion) {
    this.isEditMode = true;
    this.selectedPromotion = promotion;
    this.promotionForm.patchValue({
      ...promotion,
      valid_from: new Date(promotion.valid_from).toISOString().slice(0, 16),
      valid_until: new Date(promotion.valid_until).toISOString().slice(0, 16)
    });
    this.showPromotionModal = true;
  }

  closePromotionModal() {
    this.showPromotionModal = false;
    this.selectedPromotion = null;
    this.promotionForm.reset();
  }

  async savePromotion() {
    if (!this.promotionForm.valid) return;

    try {
      this.isSaving = true;
      const formData = this.promotionForm.value;

      if (this.isEditMode && this.selectedPromotion) {
        await this.adminService.updatePromotion(this.selectedPromotion.id, formData);
      } else {
        await this.adminService.createPromotion(formData);
      }

      await this.loadPromotions();
      await this.loadPromotionStats();
      this.closePromotionModal();
    } catch (error) {
      console.error('Error saving promotion:', error);
      alert('Error al guardar la promoción');
    } finally {
      this.isSaving = false;
    }
  }

  async togglePromotionStatus(promotion: Promotion) {
    try {
      await this.adminService.updatePromotion(promotion.id, {
        is_active: !promotion.is_active
      });
      await this.loadPromotions();
      await this.loadPromotionStats();
    } catch (error) {
      console.error('Error toggling promotion status:', error);
      alert('Error al cambiar el estado de la promoción');
    }
  }

  async duplicatePromotion(promotion: Promotion) {
    const newPromotion = {
      ...promotion,
      code: promotion.code + '_COPY',
      name: promotion.name + ' (Copia)',
      usage_count: 0,
      is_active: false
    };
    
    delete (newPromotion as any).id;
    delete (newPromotion as any).created_at;
    delete (newPromotion as any).updated_at;

    this.isEditMode = false;
    this.selectedPromotion = null;
    this.promotionForm.patchValue({
      ...newPromotion,
      valid_from: new Date(promotion.valid_from).toISOString().slice(0, 16),
      valid_until: new Date(promotion.valid_until).toISOString().slice(0, 16)
    });
    this.showPromotionModal = true;
  }

  async exportPromotions() {
    try {
      const data = await this.adminService.exportPromotions(this.filterForm.value);
      const blob = new Blob([data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `promotions-${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting promotions:', error);
      alert('Error al exportar los datos');
    }
  }

  getTypeBadgeClass(type: string): string {
    const classes = {
      percentage: 'bg-blue-100 text-blue-800',
      fixed_amount: 'bg-green-100 text-green-800',
      free_ride: 'bg-purple-100 text-purple-800'
    };
    return classes[type as keyof typeof classes] || 'bg-gray-100 text-gray-800';
  }

  getTypeText(type: string): string {
    const texts = {
      percentage: 'Porcentaje',
      fixed_amount: 'Monto Fijo',
      free_ride: 'Viaje Gratis'
    };
    return texts[type as keyof typeof texts] || type;
  }

  getStatusBadgeClass(promotion: Promotion): string {
    const now = new Date();
    const isExpired = new Date(promotion.valid_until) <= now;
    
    if (!promotion.is_active) {
      return 'bg-gray-100 text-gray-800';
    } else if (isExpired) {
      return 'bg-red-100 text-red-800';
    } else {
      return 'bg-green-100 text-green-800';
    }
  }

  getStatusText(promotion: Promotion): string {
    const now = new Date();
    const isExpired = new Date(promotion.valid_until) <= now;
    
    if (!promotion.is_active) {
      return 'Inactiva';
    } else if (isExpired) {
      return 'Expirada';
    } else {
      return 'Activa';
    }
  }

  getUsagePercentage(promotion: Promotion): number {
    if (promotion.usage_limit === -1) return 0;
    return Math.min(100, (promotion.usage_count / promotion.usage_limit) * 100);
  }

  // Pagination methods
  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadPromotions();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadPromotions();
    }
  }

  goToPage(page: number) {
    this.currentPage = page;
    this.loadPromotions();
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const start = Math.max(1, this.currentPage - 2);
    const end = Math.min(this.totalPages, this.currentPage + 2);
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    return pages;
  }

  trackByPromotionId(index: number, promotion: Promotion): string {
    return promotion.id;
  }
}
