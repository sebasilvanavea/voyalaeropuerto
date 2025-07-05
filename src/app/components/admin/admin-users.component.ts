import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminService, UserDetails } from '../../services/admin.service';

@Component({
  selector: 'app-admin-users',
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
              <option value="active">Activo</option>
              <option value="suspended">Suspendido</option>
              <option value="banned">Baneado</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Buscar por nombre o email</label>
            <input type="text" 
                   [(ngModel)]="searchTerm"
                   (input)="onSearchChange()"
                   placeholder="Escribir para buscar..."
                   class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
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
                <div class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <svg class="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                  </svg>
                </div>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">Usuarios Activos</dt>
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
                <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg class="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"/>
                  </svg>
                </div>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">Nuevos (30 días)</dt>
                  <dd class="text-lg font-medium text-gray-900">{{stats.newUsers}}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                  <svg class="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
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
                  <dt class="text-sm font-medium text-gray-500 truncate">Baneados</dt>
                  <dd class="text-lg font-medium text-gray-900">{{stats.banned}}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Lista de usuarios -->
      <div class="bg-white shadow overflow-hidden sm:rounded-md">
        <div class="px-4 py-5 sm:px-6 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <h3 class="text-lg leading-6 font-medium text-gray-900">
              Usuarios ({{total}} total)
            </h3>
            <div class="flex items-center space-x-2">
              <select [(ngModel)]="pageSize" 
                      (change)="loadUsers()"
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
          <p class="mt-2 text-gray-500">Cargando usuarios...</p>
        </div>

        <ul *ngIf="!loading" class="divide-y divide-gray-200">
          <li *ngFor="let user of users" class="px-4 py-4 sm:px-6">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-4">
                <div class="flex-shrink-0">
                  <img class="h-12 w-12 rounded-full" 
                       [src]="'https://ui-avatars.com/api/?name=' + user.name + '&background=3b82f6&color=fff'" 
                       [alt]="user.name">
                </div>

                <div class="flex-1 min-w-0">
                  <div class="flex items-center space-x-2">
                    <h4 class="text-sm font-medium text-gray-900">{{user.name}}</h4>
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                          [ngClass]="{
                            'bg-green-100 text-green-800': user.status === 'active',
                            'bg-yellow-100 text-yellow-800': user.status === 'suspended',
                            'bg-red-100 text-red-800': user.status === 'banned'
                          }">
                      {{getStatusText(user.status)}}
                    </span>
                  </div>
                  
                  <div class="mt-1">
                    <p class="text-sm text-gray-600">
                      {{user.email}}
                    </p>
                    <p class="text-sm text-gray-500">
                      {{user.phone}} • Registro: {{user.createdAt | date:'short'}}
                    </p>
                  </div>
                </div>
              </div>

              <div class="flex items-center space-x-6">
                <!-- Métricas -->
                <div class="text-right">
                  <div class="flex items-center space-x-4 text-sm">
                    <div>
                      <div class="font-medium text-gray-900">{{user.totalBookings}}</div>
                      <div class="text-gray-500">Reservas</div>
                    </div>
                    <div>
                      <div class="font-medium text-gray-900">{{user.rating | number:'1.1-1'}}</div>
                      <div class="text-gray-500">Rating</div>
                    </div>
                    <div>
                      <div class="font-medium text-gray-900">\${{user.totalSpent | number}}</div>
                      <div class="text-gray-500">Gastado</div>
                    </div>
                  </div>
                  <div class="text-xs text-gray-500 mt-1">
                    Último login: {{user.lastLogin | date:'short'}}
                  </div>
                </div>

                <!-- Acciones -->
                <div class="flex flex-col space-y-2">
                  <button (click)="viewUserDetails(user)"
                          class="text-blue-600 hover:text-blue-800 text-sm font-medium">
                    Ver detalles
                  </button>
                  
                  <div class="relative" *ngIf="user.status !== 'banned'">
                    <button (click)="toggleActionsMenu(user.id)"
                            class="text-gray-600 hover:text-gray-800 text-sm font-medium">
                      Acciones
                    </button>
                    
                    <div *ngIf="showActionsMenu === user.id" 
                         class="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg z-10 border">
                      <div class="py-1">
                        <button *ngIf="user.status === 'suspended'"
                                (click)="updateUserStatus(user.id, 'active')"
                                class="block w-full text-left px-4 py-2 text-sm text-green-700 hover:bg-gray-100">
                          Reactivar
                        </button>
                        <button *ngIf="user.status === 'active'"
                                (click)="updateUserStatus(user.id, 'suspended')"
                                class="block w-full text-left px-4 py-2 text-sm text-yellow-700 hover:bg-gray-100">
                          Suspender
                        </button>
                        <button (click)="updateUserStatus(user.id, 'banned')"
                                class="block w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-gray-100">
                          Banear
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

    <!-- Modal de detalles del usuario -->
    <div *ngIf="selectedUser" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
        <div class="mt-3">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-medium text-gray-900">Detalles del Usuario</h3>
            <button (click)="closeUserDetails()" class="text-gray-400 hover:text-gray-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 class="font-medium text-gray-900 mb-2">Información Personal</h4>
              <div class="space-y-2 text-sm">
                <p><span class="font-medium">Nombre:</span> {{selectedUser.name}}</p>
                <p><span class="font-medium">Email:</span> {{selectedUser.email}}</p>
                <p><span class="font-medium">Teléfono:</span> {{selectedUser.phone}}</p>
                <p><span class="font-medium">Estado:</span> {{getStatusText(selectedUser.status)}}</p>
                <p><span class="font-medium">Registro:</span> {{selectedUser.createdAt | date:'medium'}}</p>
                <p><span class="font-medium">Último login:</span> {{selectedUser.lastLogin | date:'medium'}}</p>
              </div>
            </div>

            <div>
              <h4 class="font-medium text-gray-900 mb-2">Actividad y Métricas</h4>
              <div class="space-y-2 text-sm">
                <p><span class="font-medium">Total reservas:</span> {{selectedUser.totalBookings}}</p>
                <p><span class="font-medium">Total gastado:</span> \${{selectedUser.totalSpent | number}}</p>
                <p><span class="font-medium">Rating promedio:</span> {{selectedUser.rating | number:'1.1-1'}}/5</p>
                <p><span class="font-medium">Gasto promedio:</span> \${{getAverageSpending() | number}}</p>
              </div>
            </div>

            <div class="md:col-span-2">
              <h4 class="font-medium text-gray-900 mb-2">Historial Reciente</h4>
              <div class="bg-gray-50 p-3 rounded">
                <p class="text-sm text-gray-600">
                  Usuario registrado el {{selectedUser.createdAt | date:'medium'}} y ha realizado {{selectedUser.totalBookings}} reservas por un total de \${{selectedUser.totalSpent | number}}.
                </p>
                <p class="text-sm text-gray-600 mt-2">
                  Último acceso: {{selectedUser.lastLogin | date:'medium'}}
                </p>
              </div>
            </div>
          </div>

          <div class="flex justify-end mt-6 space-x-3">
            <button (click)="closeUserDetails()" 
                    class="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400">
              Cerrar
            </button>
            <button *ngIf="selectedUser.status === 'suspended'"
                    (click)="updateUserStatus(selectedUser.id, 'active')"
                    class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
              Reactivar
            </button>
            <button *ngIf="selectedUser.status === 'active'"
                    (click)="updateUserStatus(selectedUser.id, 'suspended')"
                    class="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700">
              Suspender
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class AdminUsersComponent implements OnInit {
  users: UserDetails[] = [];
  total = 0;
  currentPage = 1;
  pageSize = 20;
  loading = false;
  selectedUser: UserDetails | null = null;
  showActionsMenu: string | null = null;
  searchTerm = '';
  searchTimeout: any;

  filters = {
    status: ''
  };

  stats = {
    active: 0,
    newUsers: 0,
    suspended: 0,
    banned: 0
  };

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  async loadUsers(): Promise<void> {
    this.loading = true;
    try {
      const result = await this.adminService.getUsers(this.currentPage, this.pageSize, this.filters);
      this.users = result.users;
      this.total = result.total;
      this.updateStats();
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      this.loading = false;
    }
  }

  onSearchChange(): void {
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }
    
    this.searchTimeout = setTimeout(() => {
      this.applyFilters();
    }, 500);
  }

  applyFilters(): void {
    this.currentPage = 1;
    this.loadUsers();
  }

  clearFilters(): void {
    this.filters = {
      status: ''
    };
    this.searchTerm = '';
    this.applyFilters();
  }

  updateStats(): void {
    this.stats = {
      active: this.users.filter(u => u.status === 'active').length,
      newUsers: this.users.filter(u => {
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        return new Date(u.createdAt) > thirtyDaysAgo;
      }).length,
      suspended: this.users.filter(u => u.status === 'suspended').length,
      banned: this.users.filter(u => u.status === 'banned').length
    };
  }

  getStatusText(status: string): string {
    const statusMap = {
      'active': 'Activo',
      'suspended': 'Suspendido',
      'banned': 'Baneado'
    };
    return statusMap[status as keyof typeof statusMap] || status;
  }

  toggleActionsMenu(userId: string): void {
    this.showActionsMenu = this.showActionsMenu === userId ? null : userId;
  }

  async updateUserStatus(userId: string, newStatus: string): Promise<void> {
    try {
      await this.adminService.updateUserStatus(userId, newStatus);
      this.showActionsMenu = null;
      this.selectedUser = null;
      await this.loadUsers();
    } catch (error) {
      console.error('Error updating user status:', error);
    }
  }

  viewUserDetails(user: UserDetails): void {
    this.selectedUser = user;
  }

  closeUserDetails(): void {
    this.selectedUser = null;
  }

  getAverageSpending(): number {
    if (!this.selectedUser || this.selectedUser.totalBookings === 0) {
      return 0;
    }
    return this.selectedUser.totalSpent / this.selectedUser.totalBookings;
  }

  get totalPages(): number {
    return Math.ceil(this.total / this.pageSize);
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadUsers();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadUsers();
    }
  }

  goToPage(page: number): void {
    this.currentPage = page;
    this.loadUsers();
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
