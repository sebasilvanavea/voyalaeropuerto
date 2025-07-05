import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminService, BookingDetails } from '../../services/admin.service';

@Component({
  selector: 'app-admin-bookings',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="space-y-6">
      <!-- Filtros -->
      <div class="bg-white shadow rounded-lg p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Filtros</h3>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Estado</label>
            <select [(ngModel)]="filters.status" 
                    (change)="applyFilters()"
                    class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
              <option value="">Todos</option>
              <option value="pending">Pendiente</option>
              <option value="confirmed">Confirmado</option>
              <option value="assigned">Asignado</option>
              <option value="in_progress">En progreso</option>
              <option value="completed">Completado</option>
              <option value="cancelled">Cancelado</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Fecha desde</label>
            <input type="date" 
                   [(ngModel)]="filters.dateFrom"
                   (change)="applyFilters()"
                   class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Fecha hasta</label>
            <input type="date" 
                   [(ngModel)]="filters.dateTo"
                   (change)="applyFilters()"
                   class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
          </div>

          <div class="flex items-end">
            <button (click)="clearFilters()"
                    class="w-full bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors">
              Limpiar
            </button>
          </div>
        </div>
      </div>

      <!-- Estadísticas rápidas -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                  <svg class="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"/>
                  </svg>
                </div>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">Pendientes</dt>
                  <dd class="text-lg font-medium text-gray-900">{{stats.pending}}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg class="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                  </svg>
                </div>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">En progreso</dt>
                  <dd class="text-lg font-medium text-gray-900">{{stats.inProgress}}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <svg class="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                  </svg>
                </div>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">Completados</dt>
                  <dd class="text-lg font-medium text-gray-900">{{stats.completed}}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                  <svg class="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
                  </svg>
                </div>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">Cancelados</dt>
                  <dd class="text-lg font-medium text-gray-900">{{stats.cancelled}}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Lista de reservas -->
      <div class="bg-white shadow overflow-hidden sm:rounded-md">
        <div class="px-4 py-5 sm:px-6 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <h3 class="text-lg leading-6 font-medium text-gray-900">
              Reservas ({{total}} total)
            </h3>
            <div class="flex items-center space-x-2">
              <select [(ngModel)]="pageSize" 
                      (change)="loadBookings()"
                      class="text-sm border-gray-300 rounded-md">
                <option value="10">10 por página</option>
                <option value="20">20 por página</option>
                <option value="50">50 por página</option>
              </select>
            </div>
          </div>
        </div>

        <div *ngIf="loading" class="p-8 text-center">
          <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p class="mt-2 text-gray-500">Cargando reservas...</p>
        </div>

        <ul *ngIf="!loading" class="divide-y divide-gray-200">
          <li *ngFor="let booking of bookings" class="px-4 py-4 sm:px-6">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-4">
                <div class="flex-shrink-0">
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                        [ngClass]="{
                          'bg-green-100 text-green-800': booking.status === 'completed',
                          'bg-blue-100 text-blue-800': booking.status === 'in_progress' || booking.status === 'assigned',
                          'bg-yellow-100 text-yellow-800': booking.status === 'pending' || booking.status === 'confirmed',
                          'bg-red-100 text-red-800': booking.status === 'cancelled'
                        }">
                    {{getStatusText(booking.status)}}
                  </span>
                </div>

                <div class="flex-1 min-w-0">
                  <div class="flex items-center space-x-2">
                    <h4 class="text-sm font-medium text-gray-900">{{booking.customerName}}</h4>
                    <span class="text-sm text-gray-500">•</span>
                    <span class="text-sm text-gray-500">{{booking.createdAt | date:'short'}}</span>
                  </div>
                  <div class="mt-1">
                    <p class="text-sm text-gray-600">
                      <span class="font-medium">{{booking.pickupLocation}}</span>
                      <svg class="inline w-4 h-4 mx-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                      </svg>
                      <span class="font-medium">{{booking.dropoffLocation}}</span>
                    </p>
                    <p class="text-sm text-gray-500">
                      Fecha viaje: {{booking.pickupDateTime | date:'short'}}
                    </p>
                    <div *ngIf="booking.driverName" class="text-sm text-gray-500">
                      Conductor: {{booking.driverName}} - {{booking.vehicleInfo}}
                    </div>
                  </div>
                </div>
              </div>

              <div class="flex items-center space-x-4">
                <div class="text-right">
                  <div class="text-lg font-medium text-gray-900">\${{booking.amount | number}}</div>
                  <div class="text-sm text-gray-500">
                    Pago: <span [ngClass]="{
                      'text-green-600': booking.paymentStatus === 'completed',
                      'text-yellow-600': booking.paymentStatus === 'pending',
                      'text-red-600': booking.paymentStatus === 'failed'
                    }">{{getPaymentStatusText(booking.paymentStatus)}}</span>
                  </div>
                </div>

                <div class="flex flex-col space-y-2">
                  <button (click)="viewBookingDetails(booking)"
                          class="text-blue-600 hover:text-blue-800 text-sm font-medium">
                    Ver detalles
                  </button>
                  
                  <div class="relative" *ngIf="booking.status !== 'completed' && booking.status !== 'cancelled'">
                    <button (click)="toggleStatusMenu(booking.id)"
                            class="text-gray-600 hover:text-gray-800 text-sm font-medium">
                      Cambiar estado
                    </button>
                    
                    <div *ngIf="showStatusMenu === booking.id" 
                         class="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg z-10 border">
                      <div class="py-1">
                        <button *ngFor="let status of getAvailableStatuses(booking.status)"
                                (click)="updateBookingStatus(booking.id, status.value)"
                                class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                          {{status.label}}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </li>
        </ul>

        <!-- Paginación -->
        <div *ngIf="!loading && total > pageSize" class="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
          <div class="flex items-center justify-between">
            <div class="flex-1 flex justify-between sm:hidden">
              <button (click)="previousPage()" 
                      [disabled]="currentPage <= 1"
                      class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50">
                Anterior
              </button>
              <button (click)="nextPage()" 
                      [disabled]="currentPage >= totalPages"
                      class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50">
                Siguiente
              </button>
            </div>
            <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p class="text-sm text-gray-700">
                  Mostrando <span class="font-medium">{{(currentPage - 1) * pageSize + 1}}</span> a 
                  <span class="font-medium">{{Math.min(currentPage * pageSize, total)}}</span> de 
                  <span class="font-medium">{{total}}</span> resultados
                </p>
              </div>
              <div>
                <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button (click)="previousPage()" 
                          [disabled]="currentPage <= 1"
                          class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50">
                    Anterior
                  </button>
                  
                  <button *ngFor="let page of getVisiblePages()" 
                          (click)="goToPage(page)"
                          [class.bg-blue-50]="page === currentPage"
                          [class.border-blue-500]="page === currentPage"
                          [class.text-blue-600]="page === currentPage"
                          class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                    {{page}}
                  </button>
                  
                  <button (click)="nextPage()" 
                          [disabled]="currentPage >= totalPages"
                          class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50">
                    Siguiente
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de detalles -->
    <div *ngIf="selectedBooking" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
        <div class="mt-3">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-medium text-gray-900">Detalles de la Reserva</h3>
            <button (click)="closeBookingDetails()" class="text-gray-400 hover:text-gray-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 class="font-medium text-gray-900 mb-2">Información del Cliente</h4>
              <div class="space-y-2 text-sm">
                <p><span class="font-medium">Nombre:</span> {{selectedBooking.customerName}}</p>
                <p><span class="font-medium">Email:</span> {{selectedBooking.customerEmail}}</p>
                <p><span class="font-medium">Teléfono:</span> {{selectedBooking.customerPhone}}</p>
              </div>
            </div>

            <div>
              <h4 class="font-medium text-gray-900 mb-2">Información del Viaje</h4>
              <div class="space-y-2 text-sm">
                <p><span class="font-medium">Estado:</span> {{getStatusText(selectedBooking.status)}}</p>
                <p><span class="font-medium">Fecha:</span> {{selectedBooking.pickupDateTime | date:'medium'}}</p>
                <p><span class="font-medium">Monto:</span> \${{selectedBooking.amount | number}}</p>
                <p><span class="font-medium">Pago:</span> {{getPaymentStatusText(selectedBooking.paymentStatus)}}</p>
              </div>
            </div>

            <div class="md:col-span-2">
              <h4 class="font-medium text-gray-900 mb-2">Ruta</h4>
              <div class="bg-gray-50 p-3 rounded">
                <p class="text-sm"><span class="font-medium">Origen:</span> {{selectedBooking.pickupLocation}}</p>
                <p class="text-sm"><span class="font-medium">Destino:</span> {{selectedBooking.dropoffLocation}}</p>
              </div>
            </div>

            <div *ngIf="selectedBooking.driverName" class="md:col-span-2">
              <h4 class="font-medium text-gray-900 mb-2">Conductor Asignado</h4>
              <div class="bg-gray-50 p-3 rounded">
                <p class="text-sm"><span class="font-medium">Nombre:</span> {{selectedBooking.driverName}}</p>
                <p class="text-sm"><span class="font-medium">Vehículo:</span> {{selectedBooking.vehicleInfo}}</p>
              </div>
            </div>
          </div>

          <div class="flex justify-end mt-6 space-x-3">
            <button (click)="closeBookingDetails()" 
                    class="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400">
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class AdminBookingsComponent implements OnInit {
  bookings: BookingDetails[] = [];
  total = 0;
  currentPage = 1;
  pageSize = 20;
  loading = false;
  selectedBooking: BookingDetails | null = null;
  showStatusMenu: string | null = null;

  filters = {
    status: '',
    dateFrom: '',
    dateTo: ''
  };

  stats = {
    pending: 0,
    inProgress: 0,
    completed: 0,
    cancelled: 0
  };

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadBookings();
  }

  async loadBookings(): Promise<void> {
    this.loading = true;
    try {
      const result = await this.adminService.getBookings(this.currentPage, this.pageSize, this.filters);
      this.bookings = result.bookings;
      this.total = result.total;
      this.updateStats();
    } catch (error) {
      console.error('Error loading bookings:', error);
    } finally {
      this.loading = false;
    }
  }

  applyFilters(): void {
    this.currentPage = 1;
    this.loadBookings();
  }

  clearFilters(): void {
    this.filters = {
      status: '',
      dateFrom: '',
      dateTo: ''
    };
    this.applyFilters();
  }

  updateStats(): void {
    this.stats = {
      pending: this.bookings.filter(b => b.status === 'pending').length,
      inProgress: this.bookings.filter(b => ['confirmed', 'assigned', 'in_progress'].includes(b.status)).length,
      completed: this.bookings.filter(b => b.status === 'completed').length,
      cancelled: this.bookings.filter(b => b.status === 'cancelled').length
    };
  }

  getStatusText(status: string): string {
    const statusMap = {
      'pending': 'Pendiente',
      'confirmed': 'Confirmado',
      'assigned': 'Asignado',
      'in_progress': 'En progreso',
      'completed': 'Completado',
      'cancelled': 'Cancelado'
    };
    return statusMap[status as keyof typeof statusMap] || status;
  }

  getPaymentStatusText(status: string): string {
    const statusMap = {
      'pending': 'Pendiente',
      'completed': 'Completado',
      'failed': 'Fallido',
      'refunded': 'Reembolsado'
    };
    return statusMap[status as keyof typeof statusMap] || status;
  }

  getAvailableStatuses(currentStatus: string): Array<{value: string, label: string}> {
    const allStatuses = [
      { value: 'pending', label: 'Pendiente' },
      { value: 'confirmed', label: 'Confirmado' },
      { value: 'assigned', label: 'Asignado' },
      { value: 'in_progress', label: 'En progreso' },
      { value: 'completed', label: 'Completado' },
      { value: 'cancelled', label: 'Cancelado' }
    ];

    return allStatuses.filter(status => status.value !== currentStatus);
  }

  toggleStatusMenu(bookingId: string): void {
    this.showStatusMenu = this.showStatusMenu === bookingId ? null : bookingId;
  }

  async updateBookingStatus(bookingId: string, newStatus: string): Promise<void> {
    try {
      await this.adminService.updateBookingStatus(bookingId, newStatus);
      this.showStatusMenu = null;
      await this.loadBookings();
    } catch (error) {
      console.error('Error updating booking status:', error);
    }
  }

  viewBookingDetails(booking: BookingDetails): void {
    this.selectedBooking = booking;
  }

  closeBookingDetails(): void {
    this.selectedBooking = null;
  }

  get totalPages(): number {
    return Math.ceil(this.total / this.pageSize);
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadBookings();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadBookings();
    }
  }

  goToPage(page: number): void {
    this.currentPage = page;
    this.loadBookings();
  }

  getVisiblePages(): number[] {
    const total = this.totalPages;
    const current = this.currentPage;
    const pages = [];

    if (total <= 7) {
      for (let i = 1; i <= total; i++) {
        pages.push(i);
      }
    } else {
      if (current <= 4) {
        for (let i = 1; i <= 5; i++) {
          pages.push(i);
        }
        pages.push(-1); // separator
        pages.push(total);
      } else if (current >= total - 3) {
        pages.push(1);
        pages.push(-1); // separator
        for (let i = total - 4; i <= total; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push(-1); // separator
        for (let i = current - 1; i <= current + 1; i++) {
          pages.push(i);
        }
        pages.push(-1); // separator
        pages.push(total);
      }
    }

    return pages;
  }

  Math = Math;
}
