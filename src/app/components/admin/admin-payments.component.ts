import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { AdminService } from '../../services/admin.service';
import { PaymentService } from '../../services/payment.service';

interface PaymentTransaction {
  id: string;
  booking_id: string;
  user_id: string;
  driver_id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded' | 'cancelled';
  payment_method: string;
  provider: 'stripe' | 'transbank' | 'mercadopago';
  transaction_id: string;
  created_at: string;
  updated_at: string;
  user_name?: string;
  driver_name?: string;
  booking_reference?: string;
}

interface PaymentStats {
  totalRevenue: number;
  totalTransactions: number;
  successfulPayments: number;
  failedPayments: number;
  refundedAmount: number;
  pendingPayments: number;
  avgTransactionAmount: number;
  revenueByProvider: { [key: string]: number };
  revenueByMonth: { month: string; amount: number }[];
}

@Component({
  selector: 'app-admin-payments',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="p-6 space-y-6">
      <!-- Page Header -->
      <div class="flex justify-between items-center">
        <div>
          <h2 class="text-2xl font-bold text-gray-900">Gestión de Pagos</h2>
          <p class="text-gray-600">Administra transacciones, reembolsos y estadísticas de pagos</p>
        </div>
        <div class="flex space-x-3">
          <button (click)="exportPayments()" 
                  class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            <svg class="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                    d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
            </svg>
            Exportar
          </button>
          <button (click)="refreshData()" 
                  class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <svg class="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
            </svg>
            Actualizar
          </button>
        </div>
      </div>

      <!-- Payment Statistics Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="p-2 bg-green-100 rounded-lg">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"/>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Ingresos Totales</p>
              <p class="text-2xl font-semibold text-gray-900">
                {{paymentStats?.totalRevenue | currency:'CLP':'symbol':'1.0-0'}}
              </p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="p-2 bg-blue-100 rounded-lg">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Total Transacciones</p>
              <p class="text-2xl font-semibold text-gray-900">{{paymentStats?.totalTransactions | number}}</p>
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
              <p class="text-sm font-medium text-gray-600">Pagos Exitosos</p>
              <p class="text-2xl font-semibold text-gray-900">{{paymentStats?.successfulPayments | number}}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="p-2 bg-red-100 rounded-lg">
              <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z"/>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Pagos Fallidos</p>
              <p class="text-2xl font-semibold text-gray-900">{{paymentStats?.failedPayments | number}}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Filters and Search -->
      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Filtros de Búsqueda</h3>
        <form [formGroup]="filterForm" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Estado</label>
            <select formControlName="status" 
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Todos los estados</option>
              <option value="pending">Pendiente</option>
              <option value="completed">Completado</option>
              <option value="failed">Fallido</option>
              <option value="refunded">Reembolsado</option>
              <option value="cancelled">Cancelado</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Proveedor</label>
            <select formControlName="provider" 
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Todos los proveedores</option>
              <option value="stripe">Stripe</option>
              <option value="transbank">Transbank</option>
              <option value="mercadopago">MercadoPago</option>
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
            <input type="text" formControlName="search" placeholder="ID de transacción, usuario, conductor..." 
                   class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
          </div>

          <div class="flex items-end space-x-2">
            <button type="button" (click)="applyFilters()" 
                    class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
              Aplicar Filtros
            </button>
            <button type="button" (click)="clearFilters()" 
                    class="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors">
              Limpiar
            </button>
          </div>
        </form>
      </div>

      <!-- Payments Table -->
      <div class="bg-white rounded-lg shadow overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200">
          <h3 class="text-lg font-semibold text-gray-900">Transacciones de Pago</h3>
        </div>

        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID Transacción
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Usuario/Conductor
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Monto
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Proveedor
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr *ngFor="let payment of filteredPayments; trackBy: trackByPaymentId" 
                  class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  #{{payment.transaction_id}}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{payment.user_name}}</div>
                  <div class="text-sm text-gray-500">Conductor: {{payment.driver_name}}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{payment.amount | currency:'CLP':'symbol':'1.0-0'}}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span [class]="getStatusBadgeClass(payment.status)" 
                        class="inline-flex px-2 py-1 text-xs font-semibold rounded-full">
                    {{getStatusText(payment.status)}}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span [class]="getProviderBadgeClass(payment.provider)" 
                        class="inline-flex px-2 py-1 text-xs font-semibold rounded-full">
                    {{payment.provider.toUpperCase()}}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{payment.created_at | date:'dd/MM/yyyy HH:mm'}}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <button (click)="viewPaymentDetails(payment)" 
                          class="text-blue-600 hover:text-blue-900">
                    Ver
                  </button>
                  <button *ngIf="payment.status === 'completed'" 
                          (click)="processRefund(payment)" 
                          class="text-red-600 hover:text-red-900">
                    Reembolsar
                  </button>
                  <button *ngIf="payment.status === 'pending'" 
                          (click)="cancelPayment(payment)" 
                          class="text-gray-600 hover:text-gray-900">
                    Cancelar
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

      <!-- Payment Details Modal -->
      <div *ngIf="showPaymentDetails" 
           class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
           (click)="closePaymentDetails()">
        <div class="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white"
             (click)="$event.stopPropagation()">
          <div class="mt-3">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-semibold text-gray-900">Detalles del Pago</h3>
              <button (click)="closePaymentDetails()" 
                      class="text-gray-400 hover:text-gray-600">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>

            <div *ngIf="selectedPayment" class="space-y-4">
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700">ID de Transacción</label>
                  <p class="text-sm text-gray-900">{{selectedPayment.transaction_id}}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700">Estado</label>
                  <span [class]="getStatusBadgeClass(selectedPayment.status)" 
                        class="inline-flex px-2 py-1 text-xs font-semibold rounded-full">
                    {{getStatusText(selectedPayment.status)}}
                  </span>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700">Monto</label>
                  <p class="text-sm text-gray-900">{{selectedPayment.amount | currency:'CLP':'symbol':'1.0-0'}}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700">Proveedor</label>
                  <p class="text-sm text-gray-900">{{selectedPayment.provider.toUpperCase()}}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700">Usuario</label>
                  <p class="text-sm text-gray-900">{{selectedPayment.user_name}}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700">Conductor</label>
                  <p class="text-sm text-gray-900">{{selectedPayment.driver_name}}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700">Fecha de Creación</label>
                  <p class="text-sm text-gray-900">{{selectedPayment.created_at | date:'dd/MM/yyyy HH:mm:ss'}}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700">Última Actualización</label>
                  <p class="text-sm text-gray-900">{{selectedPayment.updated_at | date:'dd/MM/yyyy HH:mm:ss'}}</p>
                </div>
              </div>

              <div class="flex justify-end space-x-2 pt-4 border-t">
                <button (click)="closePaymentDetails()" 
                        class="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors">
                  Cerrar
                </button>
                <button *ngIf="selectedPayment.status === 'completed'" 
                        (click)="processRefund(selectedPayment)" 
                        class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors">
                  Procesar Reembolso
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AdminPaymentsComponent implements OnInit {
  payments: PaymentTransaction[] = [];
  filteredPayments: PaymentTransaction[] = [];
  paymentStats: PaymentStats | null = null;
  filterForm: FormGroup;
  
  // Pagination
  currentPage = 1;
  pageSize = 20;
  totalItems = 0;
  totalPages = 0;

  // Modal state
  showPaymentDetails = false;
  selectedPayment: PaymentTransaction | null = null;

  // Math reference for template
  Math = Math;

  constructor(
    private adminService: AdminService,
    private paymentService: PaymentService,
    private fb: FormBuilder
  ) {
    this.filterForm = this.fb.group({
      status: [''],
      provider: [''],
      dateFrom: [''],
      dateTo: [''],
      search: ['']
    });
  }

  ngOnInit() {
    this.loadPayments();
    this.loadPaymentStats();
    this.setupFormSubscription();
  }

  setupFormSubscription() {
    this.filterForm.valueChanges.subscribe(() => {
      this.applyFilters();
    });
  }

  async loadPayments() {
    try {
      const response = await this.adminService.getPayments({
        page: this.currentPage,
        limit: this.pageSize,
        ...this.filterForm.value
      });
      
      this.payments = response.data;
      this.totalItems = response.total;
      this.totalPages = Math.ceil(this.totalItems / this.pageSize);
      this.applyFilters();
    } catch (error) {
      console.error('Error loading payments:', error);
    }
  }

  async loadPaymentStats() {
    try {
      this.paymentStats = await this.adminService.getPaymentStats();
    } catch (error) {
      console.error('Error loading payment stats:', error);
    }
  }

  applyFilters() {
    const filters = this.filterForm.value;
    let filtered = [...this.payments];

    if (filters.status) {
      filtered = filtered.filter(p => p.status === filters.status);
    }

    if (filters.provider) {
      filtered = filtered.filter(p => p.provider === filters.provider);
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
        p.transaction_id.toLowerCase().includes(search) ||
        p.user_name?.toLowerCase().includes(search) ||
        p.driver_name?.toLowerCase().includes(search) ||
        p.booking_reference?.toLowerCase().includes(search)
      );
    }

    this.filteredPayments = filtered;
  }

  clearFilters() {
    this.filterForm.reset();
    this.applyFilters();
  }

  getStatusBadgeClass(status: string): string {
    const classes = {
      pending: 'bg-yellow-100 text-yellow-800',
      completed: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
      refunded: 'bg-purple-100 text-purple-800',
      cancelled: 'bg-gray-100 text-gray-800'
    };
    return classes[status as keyof typeof classes] || 'bg-gray-100 text-gray-800';
  }

  getStatusText(status: string): string {
    const texts = {
      pending: 'Pendiente',
      completed: 'Completado',
      failed: 'Fallido',
      refunded: 'Reembolsado',
      cancelled: 'Cancelado'
    };
    return texts[status as keyof typeof texts] || status;
  }

  getProviderBadgeClass(provider: string): string {
    const classes = {
      stripe: 'bg-blue-100 text-blue-800',
      transbank: 'bg-red-100 text-red-800',
      mercadopago: 'bg-yellow-100 text-yellow-800'
    };
    return classes[provider as keyof typeof classes] || 'bg-gray-100 text-gray-800';
  }

  viewPaymentDetails(payment: PaymentTransaction) {
    this.selectedPayment = payment;
    this.showPaymentDetails = true;
  }

  closePaymentDetails() {
    this.showPaymentDetails = false;
    this.selectedPayment = null;
  }

  async processRefund(payment: PaymentTransaction) {
    if (confirm(`¿Está seguro de que desea procesar un reembolso para la transacción ${payment.transaction_id}?`)) {
      try {
        await this.paymentService.processRefund(payment.id);
        await this.loadPayments();
        await this.loadPaymentStats();
        this.closePaymentDetails();
      } catch (error) {
        console.error('Error processing refund:', error);
        alert('Error al procesar el reembolso');
      }
    }
  }

  async cancelPayment(payment: PaymentTransaction) {
    if (confirm(`¿Está seguro de que desea cancelar la transacción ${payment.transaction_id}?`)) {
      try {
        await this.paymentService.cancelPayment(payment.id);
        await this.loadPayments();
        await this.loadPaymentStats();
      } catch (error) {
        console.error('Error cancelling payment:', error);
        alert('Error al cancelar el pago');
      }
    }
  }

  async exportPayments() {
    try {
      const data = await this.adminService.exportPayments(this.filterForm.value);
      const blob = new Blob([data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `payments-${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting payments:', error);
      alert('Error al exportar los datos');
    }
  }

  async refreshData() {
    await Promise.all([
      this.loadPayments(),
      this.loadPaymentStats()
    ]);
  }

  // Pagination methods
  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadPayments();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadPayments();
    }
  }

  goToPage(page: number) {
    this.currentPage = page;
    this.loadPayments();
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

  trackByPaymentId(index: number, payment: PaymentTransaction): string {
    return payment.id;
  }
}
