import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminService } from '../../services/admin.service';

interface SupportTicket {
  id: string;
  user_id: string;
  booking_id?: string;
  subject: string;
  description: string;
  category: 'technical' | 'billing' | 'booking' | 'driver' | 'general';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  assigned_to?: string;
  created_at: string;
  updated_at: string;
  resolved_at?: string;
  user_name?: string;
  user_email?: string;
  admin_name?: string;
}

interface TicketMessage {
  id: string;
  ticket_id: string;
  sender_id: string;
  sender_type: 'user' | 'admin';
  message: string;
  attachments?: string[];
  created_at: string;
  sender_name?: string;
}

@Component({
  selector: 'app-admin-support',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="p-6 space-y-6">
      <!-- Page Header -->
      <div class="flex justify-between items-center">
        <div>
          <h2 class="text-2xl font-bold text-gray-900">Sistema de Soporte</h2>
          <p class="text-gray-600">Gestiona tickets de soporte y consultas de usuarios</p>
        </div>
        <div class="flex space-x-3">
          <button (click)="exportTickets()" 
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

      <!-- Statistics Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="p-2 bg-blue-100 rounded-lg">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"/>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Total Tickets</p>
              <p class="text-2xl font-semibold text-gray-900">{{ticketStats?.total || 0}}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="p-2 bg-yellow-100 rounded-lg">
              <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Abiertos</p>
              <p class="text-2xl font-semibold text-gray-900">{{ticketStats?.open || 0}}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="p-2 bg-orange-100 rounded-lg">
              <svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M13 10V3L4 14h7v7l9-11h-7z"/>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">En Progreso</p>
              <p class="text-2xl font-semibold text-gray-900">{{ticketStats?.inProgress || 0}}</p>
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
              <p class="text-sm font-medium text-gray-600">Resueltos Hoy</p>
              <p class="text-2xl font-semibold text-gray-900">{{ticketStats?.resolvedToday || 0}}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Filters -->
      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Filtros</h3>
        <form [formGroup]="filterForm" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Estado</label>
            <select formControlName="status" 
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Todos</option>
              <option value="open">Abierto</option>
              <option value="in_progress">En Progreso</option>
              <option value="resolved">Resuelto</option>
              <option value="closed">Cerrado</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Categoría</label>
            <select formControlName="category" 
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Todas</option>
              <option value="technical">Técnico</option>
              <option value="billing">Facturación</option>
              <option value="booking">Reservas</option>
              <option value="driver">Conductor</option>
              <option value="general">General</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Prioridad</label>
            <select formControlName="priority" 
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Todas</option>
              <option value="urgent">Urgente</option>
              <option value="high">Alta</option>
              <option value="medium">Media</option>
              <option value="low">Baja</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Asignado a</label>
            <select formControlName="assigned_to" 
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Todos</option>
              <option value="unassigned">Sin asignar</option>
              <option *ngFor="let admin of adminUsers" [value]="admin.id">{{admin.name}}</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Buscar</label>
            <input type="text" formControlName="search" placeholder="ID, asunto, usuario..." 
                   class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
          </div>

          <div class="flex items-end space-x-2 lg:col-span-2">
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

      <!-- Tickets Table -->
      <div class="bg-white rounded-lg shadow overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200">
          <h3 class="text-lg font-semibold text-gray-900">Tickets de Soporte</h3>
        </div>

        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID / Usuario
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Asunto
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Categoría
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Prioridad
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Asignado a
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr *ngFor="let ticket of filteredTickets; trackBy: trackByTicketId" 
                  class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">#{{ticket.id.slice(-6)}}</div>
                  <div class="text-sm text-gray-500">{{ticket.user_name}}</div>
                  <div class="text-sm text-gray-500">{{ticket.user_email}}</div>
                </td>
                <td class="px-6 py-4">
                  <div class="text-sm text-gray-900 font-medium">{{ticket.subject}}</div>
                  <div class="text-sm text-gray-500 truncate max-w-xs">{{ticket.description}}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span [class]="getCategoryBadgeClass(ticket.category)" 
                        class="inline-flex px-2 py-1 text-xs font-semibold rounded-full">
                    {{getCategoryText(ticket.category)}}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span [class]="getPriorityBadgeClass(ticket.priority)" 
                        class="inline-flex px-2 py-1 text-xs font-semibold rounded-full">
                    {{getPriorityText(ticket.priority)}}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span [class]="getStatusBadgeClass(ticket.status)" 
                        class="inline-flex px-2 py-1 text-xs font-semibold rounded-full">
                    {{getStatusText(ticket.status)}}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ticket.admin_name || 'Sin asignar'}}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ticket.created_at | date:'dd/MM/yyyy HH:mm'}}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div class="flex space-x-2">
                    <button (click)="viewTicket(ticket)" 
                            class="text-blue-600 hover:text-blue-900">
                      Ver
                    </button>
                    <button (click)="assignTicket(ticket)" 
                            class="text-green-600 hover:text-green-900">
                      Asignar
                    </button>
                    <button (click)="updateTicketStatus(ticket)" 
                            class="text-purple-600 hover:text-purple-900">
                      Estado
                    </button>
                  </div>
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

      <!-- Ticket Detail Modal -->
      <div *ngIf="showTicketModal" 
           class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
           (click)="closeTicketModal()">
        <div class="relative top-10 mx-auto p-5 border w-11/12 md:w-4/5 lg:w-3/4 xl:w-2/3 shadow-lg rounded-md bg-white"
             (click)="$event.stopPropagation()">
          <div class="mt-3" *ngIf="selectedTicket">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-semibold text-gray-900">
                Ticket #{{selectedTicket.id.slice(-6)}} - {{selectedTicket.subject}}
              </h3>
              <button (click)="closeTicketModal()" 
                      class="text-gray-400 hover:text-gray-600">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <!-- Ticket Info -->
              <div class="lg:col-span-1 space-y-4">
                <div class="bg-gray-50 p-4 rounded-lg">
                  <h4 class="font-semibold text-gray-900 mb-3">Información del Ticket</h4>
                  <div class="space-y-2 text-sm">
                    <div><span class="font-medium">Usuario:</span> {{selectedTicket.user_name}}</div>
                    <div><span class="font-medium">Email:</span> {{selectedTicket.user_email}}</div>
                    <div><span class="font-medium">Categoría:</span> {{getCategoryText(selectedTicket.category)}}</div>
                    <div><span class="font-medium">Prioridad:</span> {{getPriorityText(selectedTicket.priority)}}</div>
                    <div><span class="font-medium">Estado:</span> {{getStatusText(selectedTicket.status)}}</div>
                    <div><span class="font-medium">Asignado a:</span> {{selectedTicket.admin_name || 'Sin asignar'}}</div>
                    <div><span class="font-medium">Creado:</span> {{selectedTicket.created_at | date:'dd/MM/yyyy HH:mm'}}</div>
                    <div *ngIf="selectedTicket.resolved_at"><span class="font-medium">Resuelto:</span> {{selectedTicket.resolved_at | date:'dd/MM/yyyy HH:mm'}}</div>
                  </div>
                </div>

                <!-- Actions -->
                <div class="bg-gray-50 p-4 rounded-lg">
                  <h4 class="font-semibold text-gray-900 mb-3">Acciones</h4>
                  <div class="space-y-2">
                    <select [(ngModel)]="newTicketStatus" 
                            class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm">
                      <option value="open">Abierto</option>
                      <option value="in_progress">En Progreso</option>
                      <option value="resolved">Resuelto</option>
                      <option value="closed">Cerrado</option>
                    </select>
                    <button (click)="updateSelectedTicketStatus()" 
                            class="w-full px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm">
                      Actualizar Estado
                    </button>
                    
                    <select [(ngModel)]="assignToAdmin" 
                            class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm">
                      <option value="">Sin asignar</option>
                      <option *ngFor="let admin of adminUsers" [value]="admin.id">{{admin.name}}</option>
                    </select>
                    <button (click)="updateTicketAssignment()" 
                            class="w-full px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm">
                      Asignar Ticket
                    </button>
                  </div>
                </div>
              </div>

              <!-- Messages -->
              <div class="lg:col-span-2">
                <div class="bg-gray-50 p-4 rounded-lg mb-4">
                  <h4 class="font-semibold text-gray-900 mb-3">Descripción</h4>
                  <p class="text-sm text-gray-700">{{selectedTicket.description}}</p>
                </div>

                <div class="bg-white border rounded-lg">
                  <div class="p-4 border-b">
                    <h4 class="font-semibold text-gray-900">Conversación</h4>
                  </div>
                  
                  <!-- Messages List -->
                  <div class="max-h-96 overflow-y-auto p-4 space-y-4">
                    <div *ngFor="let message of ticketMessages" 
                         [class]="message.sender_type === 'admin' ? 'flex justify-end' : 'flex justify-start'">
                      <div [class]="message.sender_type === 'admin' ? 'bg-blue-100 text-blue-900' : 'bg-gray-100 text-gray-900'"
                           class="max-w-xs lg:max-w-md px-4 py-2 rounded-lg">
                        <div class="text-xs text-gray-600 mb-1">
                          {{message.sender_name}} - {{message.created_at | date:'dd/MM/yyyy HH:mm'}}
                        </div>
                        <div class="text-sm">{{message.message}}</div>
                      </div>
                    </div>
                  </div>

                  <!-- Reply Form -->
                  <div class="p-4 border-t">
                    <form [formGroup]="replyForm" (ngSubmit)="sendReply()">
                      <div class="space-y-3">
                        <textarea formControlName="message" 
                                  rows="3" 
                                  placeholder="Escribe tu respuesta..."
                                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                        </textarea>
                        <div class="flex justify-end">
                          <button type="submit" 
                                  [disabled]="!replyForm.valid || isSendingReply"
                                  class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50">
                            {{isSendingReply ? 'Enviando...' : 'Enviar Respuesta'}}
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AdminSupportComponent implements OnInit {
  tickets: SupportTicket[] = [];
  filteredTickets: SupportTicket[] = [];
  ticketMessages: TicketMessage[] = [];
  ticketStats: any = null;
  adminUsers: any[] = [];
  
  filterForm: FormGroup;
  replyForm: FormGroup;
  
  showTicketModal = false;
  selectedTicket: SupportTicket | null = null;
  isSendingReply = false;
  
  newTicketStatus = '';
  assignToAdmin = '';

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
      category: [''],
      priority: [''],
      assigned_to: [''],
      search: ['']
    });

    this.replyForm = this.fb.group({
      message: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  ngOnInit() {
    this.loadTickets();
    this.loadTicketStats();
    this.loadAdminUsers();
    this.setupFormSubscription();
  }

  setupFormSubscription() {
    this.filterForm.valueChanges.subscribe(() => {
      this.applyFilters();
    });
  }

  async loadTickets() {
    try {
      const response = await this.adminService.getSupportTickets({
        page: this.currentPage,
        limit: this.pageSize,
        ...this.filterForm.value
      });
      
      this.tickets = response.data;
      this.totalItems = response.total;
      this.totalPages = Math.ceil(this.totalItems / this.pageSize);
      this.applyFilters();
    } catch (error) {
      console.error('Error loading tickets:', error);
    }
  }

  async loadTicketStats() {
    try {
      this.ticketStats = await this.adminService.getSupportTicketStats();
    } catch (error) {
      console.error('Error loading ticket stats:', error);
    }
  }

  async loadAdminUsers() {
    try {
      this.adminUsers = await this.adminService.getAdminUsers();
    } catch (error) {
      console.error('Error loading admin users:', error);
    }
  }

  applyFilters() {
    const filters = this.filterForm.value;
    let filtered = [...this.tickets];

    if (filters.status) {
      filtered = filtered.filter(t => t.status === filters.status);
    }

    if (filters.category) {
      filtered = filtered.filter(t => t.category === filters.category);
    }

    if (filters.priority) {
      filtered = filtered.filter(t => t.priority === filters.priority);
    }

    if (filters.assigned_to) {
      if (filters.assigned_to === 'unassigned') {
        filtered = filtered.filter(t => !t.assigned_to);
      } else {
        filtered = filtered.filter(t => t.assigned_to === filters.assigned_to);
      }
    }

    if (filters.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(t => 
        t.id.toLowerCase().includes(search) ||
        t.subject.toLowerCase().includes(search) ||
        t.user_name?.toLowerCase().includes(search) ||
        t.user_email?.toLowerCase().includes(search)
      );
    }

    this.filteredTickets = filtered;
  }

  clearFilters() {
    this.filterForm.reset();
    this.applyFilters();
  }

  async viewTicket(ticket: SupportTicket) {
    this.selectedTicket = ticket;
    this.newTicketStatus = ticket.status;
    this.assignToAdmin = ticket.assigned_to || '';
    
    // Load ticket messages
    try {
      this.ticketMessages = await this.adminService.getTicketMessages(ticket.id);
    } catch (error) {
      console.error('Error loading ticket messages:', error);
      this.ticketMessages = [];
    }
    
    this.showTicketModal = true;
  }

  closeTicketModal() {
    this.showTicketModal = false;
    this.selectedTicket = null;
    this.ticketMessages = [];
    this.replyForm.reset();
  }

  async sendReply() {
    if (!this.replyForm.valid || !this.selectedTicket || this.isSendingReply) return;

    try {
      this.isSendingReply = true;
      
      const message = this.replyForm.get('message')?.value;
      await this.adminService.sendTicketReply(this.selectedTicket.id, message);
      
      // Reload messages
      this.ticketMessages = await this.adminService.getTicketMessages(this.selectedTicket.id);
      this.replyForm.reset();
      
    } catch (error) {
      console.error('Error sending reply:', error);
      alert('Error al enviar la respuesta');
    } finally {
      this.isSendingReply = false;
    }
  }

  async updateSelectedTicketStatus() {
    if (!this.selectedTicket) return;

    try {
      await this.adminService.updateTicketStatus(this.selectedTicket.id, this.newTicketStatus);
      this.selectedTicket.status = this.newTicketStatus as any;
      await this.loadTickets();
      await this.loadTicketStats();
    } catch (error) {
      console.error('Error updating ticket status:', error);
      alert('Error al actualizar el estado');
    }
  }

  async updateTicketAssignment() {
    if (!this.selectedTicket) return;

    try {
      await this.adminService.assignTicket(this.selectedTicket.id, this.assignToAdmin || null);
      this.selectedTicket.assigned_to = this.assignToAdmin || undefined;
      this.selectedTicket.admin_name = this.adminUsers.find(a => a.id === this.assignToAdmin)?.name || undefined;
      await this.loadTickets();
    } catch (error) {
      console.error('Error assigning ticket:', error);
      alert('Error al asignar el ticket');
    }
  }

  async assignTicket(ticket: SupportTicket) {
    const adminId = prompt('ID del administrador para asignar:');
    if (adminId) {
      try {
        await this.adminService.assignTicket(ticket.id, adminId);
        await this.loadTickets();
      } catch (error) {
        console.error('Error assigning ticket:', error);
        alert('Error al asignar el ticket');
      }
    }
  }

  async updateTicketStatus(ticket: SupportTicket) {
    const status = prompt('Nuevo estado (open, in_progress, resolved, closed):', ticket.status);
    if (status && ['open', 'in_progress', 'resolved', 'closed'].includes(status)) {
      try {
        await this.adminService.updateTicketStatus(ticket.id, status);
        await this.loadTickets();
        await this.loadTicketStats();
      } catch (error) {
        console.error('Error updating ticket status:', error);
        alert('Error al actualizar el estado');
      }
    }
  }

  async exportTickets() {
    try {
      const data = await this.adminService.exportSupportTickets(this.filterForm.value);
      const blob = new Blob([data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `support-tickets-${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting tickets:', error);
      alert('Error al exportar los datos');
    }
  }

  async refreshData() {
    await Promise.all([
      this.loadTickets(),
      this.loadTicketStats()
    ]);
  }

  getCategoryBadgeClass(category: string): string {
    const classes = {
      technical: 'bg-red-100 text-red-800',
      billing: 'bg-green-100 text-green-800',
      booking: 'bg-blue-100 text-blue-800',
      driver: 'bg-yellow-100 text-yellow-800',
      general: 'bg-gray-100 text-gray-800'
    };
    return classes[category as keyof typeof classes] || 'bg-gray-100 text-gray-800';
  }

  getCategoryText(category: string): string {
    const texts = {
      technical: 'Técnico',
      billing: 'Facturación',
      booking: 'Reservas',
      driver: 'Conductor',
      general: 'General'
    };
    return texts[category as keyof typeof texts] || category;
  }

  getPriorityBadgeClass(priority: string): string {
    const classes = {
      urgent: 'bg-red-100 text-red-800',
      high: 'bg-orange-100 text-orange-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-green-100 text-green-800'
    };
    return classes[priority as keyof typeof classes] || 'bg-gray-100 text-gray-800';
  }

  getPriorityText(priority: string): string {
    const texts = {
      urgent: 'Urgente',
      high: 'Alta',
      medium: 'Media',
      low: 'Baja'
    };
    return texts[priority as keyof typeof texts] || priority;
  }

  getStatusBadgeClass(status: string): string {
    const classes = {
      open: 'bg-yellow-100 text-yellow-800',
      in_progress: 'bg-blue-100 text-blue-800',
      resolved: 'bg-green-100 text-green-800',
      closed: 'bg-gray-100 text-gray-800'
    };
    return classes[status as keyof typeof classes] || 'bg-gray-100 text-gray-800';
  }

  getStatusText(status: string): string {
    const texts = {
      open: 'Abierto',
      in_progress: 'En Progreso',
      resolved: 'Resuelto',
      closed: 'Cerrado'
    };
    return texts[status as keyof typeof texts] || status;
  }

  // Pagination methods
  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadTickets();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadTickets();
    }
  }

  goToPage(page: number) {
    this.currentPage = page;
    this.loadTickets();
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

  trackByTicketId(index: number, ticket: SupportTicket): string {
    return ticket.id;
  }
}
