import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminService, DriverDetails } from '../../services/admin.service';

@Component({
  selector: 'app-admin-drivers',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="space-y-6">
      <!-- Filtros -->
      <div class="bg-white shadow rounded-lg p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Filtros</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Estado</label>
            <select [(ngModel)]="filters.status" 
                    (change)="applyFilters()"
                    class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
              <option value="">Todos</option>
              <option value="pending">Pendiente</option>
              <option value="approved">Aprobado</option>
              <option value="rejected">Rechazado</option>
              <option value="suspended">Suspendido</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Estado activo</label>
            <select [(ngModel)]="filters.isActive" 
                    (change)="applyFilters()"
                    class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
              <option value="">Todos</option>
              <option value="true">Activo</option>
              <option value="false">Inactivo</option>
            </select>
          </div>

          <div class="flex items-end">
            <button (click)="clearFilters()"
                    class="w-full bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors">
              Limpiar filtros
            </button>
          </div>
        </div>
      </div>

      <!-- Estadísticas -->
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
                <div class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <svg class="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                  </svg>
                </div>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">Aprobados</dt>
                  <dd class="text-lg font-medium text-gray-900">{{stats.approved}}</dd>
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
                    <path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd"/>
                  </svg>
                </div>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">Activos</dt>
                  <dd class="text-lg font-medium text-gray-900">{{stats.active}}</dd>
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
                    <path fill-rule="evenodd" d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z" clip-rule="evenodd"/>
                  </svg>
                </div>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">Suspendidos</dt>
                  <dd class="text-lg font-medium text-gray-900">{{stats.suspended}}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Lista de conductores -->
      <div class="bg-white shadow overflow-hidden sm:rounded-md">
        <div class="px-4 py-5 sm:px-6 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <h3 class="text-lg leading-6 font-medium text-gray-900">
              Conductores ({{total}} total)
            </h3>
            <div class="flex items-center space-x-2">
              <select [(ngModel)]="pageSize" 
                      (change)="loadDrivers()"
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
          <p class="mt-2 text-gray-500">Cargando conductores...</p>
        </div>

        <ul *ngIf="!loading" class="divide-y divide-gray-200">
          <li *ngFor="let driver of drivers" class="px-4 py-4 sm:px-6">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-4">
                <div class="flex-shrink-0">
                  <img class="h-12 w-12 rounded-full" 
                       [src]="'https://ui-avatars.com/api/?name=' + driver.name + '&background=3b82f6&color=fff'" 
                       [alt]="driver.name">
                </div>

                <div class="flex-1 min-w-0">
                  <div class="flex items-center space-x-2">
                    <h4 class="text-sm font-medium text-gray-900">{{driver.name}}</h4>
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                          [ngClass]="{
                            'bg-green-100 text-green-800': driver.status === 'approved',
                            'bg-yellow-100 text-yellow-800': driver.status === 'pending',
                            'bg-red-100 text-red-800': driver.status === 'rejected' || driver.status === 'suspended'
                          }">
                      {{getStatusText(driver.status)}}
                    </span>
                    <span *ngIf="driver.isActive" 
                          class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      En línea
                    </span>
                  </div>
                  
                  <div class="mt-1">
                    <p class="text-sm text-gray-600">
                      {{driver.email}} • {{driver.phone}}
                    </p>
                    <p class="text-sm text-gray-500">
                      Licencia: {{driver.licenseNumber}}
                    </p>
                    <div *ngIf="driver.vehicleInfo" class="text-sm text-gray-500">
                      Vehículo: {{driver.vehicleInfo.make}} {{driver.vehicleInfo.model}} - {{driver.vehicleInfo.license_plate}}
                    </div>
                  </div>
                </div>
              </div>

              <div class="flex items-center space-x-6">
                <!-- Métricas -->
                <div class="text-right">
                  <div class="flex items-center space-x-4 text-sm">
                    <div>
                      <div class="font-medium text-gray-900">{{driver.totalTrips}}</div>
                      <div class="text-gray-500">Viajes</div>
                    </div>
                    <div>
                      <div class="font-medium text-gray-900">{{driver.rating | number:'1.1-1'}}</div>
                      <div class="text-gray-500">Rating</div>
                    </div>
                    <div>
                      <div class="font-medium text-gray-900">\${{driver.totalEarnings | number}}</div>
                      <div class="text-gray-500">Ganancias</div>
                    </div>
                  </div>
                  <div class="text-xs text-gray-500 mt-1">
                    Último activo: {{driver.lastActive | date:'short'}}
                  </div>
                </div>

                <!-- Acciones -->
                <div class="flex flex-col space-y-2">
                  <button (click)="viewDriverDetails(driver)"
                          class="text-blue-600 hover:text-blue-800 text-sm font-medium">
                    Ver detalles
                  </button>
                  
                  <div class="relative" *ngIf="driver.status !== 'rejected'">
                    <button (click)="toggleActionsMenu(driver.id)"
                            class="text-gray-600 hover:text-gray-800 text-sm font-medium">
                      Acciones
                    </button>
                    
                    <div *ngIf="showActionsMenu === driver.id" 
                         class="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg z-10 border">
                      <div class="py-1">
                        <button *ngIf="driver.status === 'pending'"
                                (click)="updateDriverStatus(driver.id, 'approved')"
                                class="block w-full text-left px-4 py-2 text-sm text-green-700 hover:bg-gray-100">
                          Aprobar
                        </button>
                        <button *ngIf="driver.status === 'pending'"
                                (click)="updateDriverStatus(driver.id, 'rejected')"
                                class="block w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-gray-100">
                          Rechazar
                        </button>
                        <button *ngIf="driver.status === 'approved'"
                                (click)="toggleDriverActive(driver.id, !driver.isActive)"
                                class="block w-full text-left px-4 py-2 text-sm text-blue-700 hover:bg-gray-100">
                          {{driver.isActive ? 'Desactivar' : 'Activar'}}
                        </button>
                        <button *ngIf="driver.status === 'approved'"
                                (click)="updateDriverStatus(driver.id, 'suspended')"
                                class="block w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-gray-100">
                          Suspender
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

    <!-- Modal de detalles del conductor -->
    <div *ngIf="selectedDriver" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
        <div class="mt-3">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-medium text-gray-900">Detalles del Conductor</h3>
            <button (click)="closeDriverDetails()" class="text-gray-400 hover:text-gray-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 class="font-medium text-gray-900 mb-2">Información Personal</h4>
              <div class="space-y-2 text-sm">
                <p><span class="font-medium">Nombre:</span> {{selectedDriver.name}}</p>
                <p><span class="font-medium">Email:</span> {{selectedDriver.email}}</p>
                <p><span class="font-medium">Teléfono:</span> {{selectedDriver.phone}}</p>
                <p><span class="font-medium">Licencia:</span> {{selectedDriver.licenseNumber}}</p>
                <p><span class="font-medium">Estado:</span> {{getStatusText(selectedDriver.status)}}</p>
                <p><span class="font-medium">Activo:</span> {{selectedDriver.isActive ? 'Sí' : 'No'}}</p>
                <p><span class="font-medium">Registro:</span> {{selectedDriver.createdAt | date:'medium'}}</p>
              </div>
            </div>

            <div>
              <h4 class="font-medium text-gray-900 mb-2">Métricas</h4>
              <div class="space-y-2 text-sm">
                <p><span class="font-medium">Total viajes:</span> {{selectedDriver.totalTrips}}</p>
                <p><span class="font-medium">Rating promedio:</span> {{selectedDriver.rating | number:'1.1-1'}}/5</p>
                <p><span class="font-medium">Ganancias totales:</span> \${{selectedDriver.totalEarnings | number}}</p>
                <p><span class="font-medium">Último activo:</span> {{selectedDriver.lastActive | date:'medium'}}</p>
              </div>
            </div>

            <div *ngIf="selectedDriver.vehicleInfo" class="md:col-span-2">
              <h4 class="font-medium text-gray-900 mb-2">Información del Vehículo</h4>
              <div class="bg-gray-50 p-3 rounded">
                <p class="text-sm"><span class="font-medium">Marca:</span> {{selectedDriver.vehicleInfo.make}}</p>
                <p class="text-sm"><span class="font-medium">Modelo:</span> {{selectedDriver.vehicleInfo.model}}</p>
                <p class="text-sm"><span class="font-medium">Año:</span> {{selectedDriver.vehicleInfo.year}}</p>
                <p class="text-sm"><span class="font-medium">Patente:</span> {{selectedDriver.vehicleInfo.license_plate}}</p>
                <p class="text-sm"><span class="font-medium">Color:</span> {{selectedDriver.vehicleInfo.color}}</p>
              </div>
            </div>

            <div *ngIf="selectedDriver.documents && selectedDriver.documents.length > 0" class="md:col-span-2">
              <h4 class="font-medium text-gray-900 mb-2">Documentos</h4>
              <div class="space-y-2">
                <div *ngFor="let doc of selectedDriver.documents" class="bg-gray-50 p-3 rounded flex items-center justify-between">
                  <div>
                    <p class="text-sm font-medium">{{doc.type}}</p>
                    <p class="text-xs text-gray-500">{{doc.uploadedAt | date:'short'}}</p>
                  </div>
                  <a [href]="doc.url" target="_blank" 
                     class="text-blue-600 hover:text-blue-800 text-sm font-medium">
                    Ver documento
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div class="flex justify-end mt-6 space-x-3">
            <button (click)="closeDriverDetails()" 
                    class="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400">
              Cerrar
            </button>
            <button *ngIf="selectedDriver.status === 'pending'"
                    (click)="updateDriverStatus(selectedDriver.id, 'approved')"
                    class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
              Aprobar
            </button>
            <button *ngIf="selectedDriver.status === 'pending'"
                    (click)="updateDriverStatus(selectedDriver.id, 'rejected')"
                    class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">
              Rechazar
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class AdminDriversComponent implements OnInit {
  drivers: DriverDetails[] = [];
  total = 0;
  currentPage = 1;
  pageSize = 20;
  loading = false;
  selectedDriver: DriverDetails | null = null;
  showActionsMenu: string | null = null;

  filters = {
    status: '',
    isActive: ''
  };

  stats = {
    pending: 0,
    approved: 0,
    active: 0,
    suspended: 0
  };

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadDrivers();
  }

  async loadDrivers(): Promise<void> {
    this.loading = true;
    try {
      const processedFilters = {
        ...this.filters,
        isActive: this.filters.isActive === '' ? undefined : this.filters.isActive === 'true'
      };

      const result = await this.adminService.getDrivers(this.currentPage, this.pageSize, processedFilters);
      this.drivers = result.drivers;
      this.total = result.total;
      this.updateStats();
    } catch (error) {
      console.error('Error loading drivers:', error);
    } finally {
      this.loading = false;
    }
  }

  applyFilters(): void {
    this.currentPage = 1;
    this.loadDrivers();
  }

  clearFilters(): void {
    this.filters = {
      status: '',
      isActive: ''
    };
    this.applyFilters();
  }

  updateStats(): void {
    this.stats = {
      pending: this.drivers.filter(d => d.status === 'pending').length,
      approved: this.drivers.filter(d => d.status === 'approved').length,
      active: this.drivers.filter(d => d.isActive).length,
      suspended: this.drivers.filter(d => d.status === 'suspended').length
    };
  }

  getStatusText(status: string): string {
    const statusMap = {
      'pending': 'Pendiente',
      'approved': 'Aprobado',
      'rejected': 'Rechazado',
      'suspended': 'Suspendido'
    };
    return statusMap[status as keyof typeof statusMap] || status;
  }

  toggleActionsMenu(driverId: string): void {
    this.showActionsMenu = this.showActionsMenu === driverId ? null : driverId;
  }

  async updateDriverStatus(driverId: string, newStatus: string): Promise<void> {
    try {
      await this.adminService.updateDriverStatus(driverId, newStatus);
      this.showActionsMenu = null;
      this.selectedDriver = null;
      await this.loadDrivers();
    } catch (error) {
      console.error('Error updating driver status:', error);
    }
  }

  async toggleDriverActive(driverId: string, isActive: boolean): Promise<void> {
    try {
      await this.adminService.updateDriverStatus(driverId, 'approved', isActive);
      this.showActionsMenu = null;
      await this.loadDrivers();
    } catch (error) {
      console.error('Error updating driver active status:', error);
    }
  }

  viewDriverDetails(driver: DriverDetails): void {
    this.selectedDriver = driver;
  }

  closeDriverDetails(): void {
    this.selectedDriver = null;
  }

  get totalPages(): number {
    return Math.ceil(this.total / this.pageSize);
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadDrivers();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadDrivers();
    }
  }

  goToPage(page: number): void {
    this.currentPage = page;
    this.loadDrivers();
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
        pages.push(-1);
        pages.push(total);
      } else if (current >= total - 3) {
        pages.push(1);
        pages.push(-1);
        for (let i = total - 4; i <= total; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push(-1);
        for (let i = current - 1; i <= current + 1; i++) {
          pages.push(i);
        }
        pages.push(-1);
        pages.push(total);
      }
    }

    return pages;
  }

  Math = Math;
}
