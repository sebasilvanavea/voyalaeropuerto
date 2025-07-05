import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="min-h-screen flex bg-gradient-to-br from-blue-50 to-purple-100">
      <!-- Sidebar -->
      <aside class="w-64 bg-gradient-to-b from-blue-800 to-blue-600 text-white shadow-xl flex flex-col">
        <div class="flex items-center justify-center h-20 border-b border-blue-700">
          <img src="assets/logo1.png" alt="Logo" class="h-12">
          <span class="ml-3 text-2xl font-bold tracking-wide">Admin</span>
        </div>
        <nav class="flex-1 py-6 px-4 space-y-2">
          <a *ngFor="let item of navItems"
             [routerLink]="[item.route]"
             (click)="setActiveTab(item.tab)"
             [ngClass]="{'bg-blue-700 text-white': activeTab === item.tab, 'hover:bg-blue-700 hover:text-white': activeTab !== item.tab}"
             class="flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer">
            <span [innerHTML]="item.icon"></span>
            {{ item.label }}
          </a>
        </nav>
        <div class="p-4 border-t border-blue-700">
          <button class="w-full py-2 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold shadow hover:from-blue-500 hover:to-purple-500 transition">Cerrar sesión</button>
        </div>
      </aside>

      <!-- Main Content -->
      <section class="flex-1 flex flex-col min-h-screen">
        <header class="sticky top-0 z-10 bg-white/80 backdrop-blur border-b border-gray-200 shadow-sm flex items-center h-20 px-8">
          <h1 class="text-2xl font-bold text-blue-900 flex-1">Panel de Administración</h1>
          <button (click)="toggleSidebar()" class="lg:hidden p-2 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-700 transition">
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
          </button>
        </header>

        <main class="flex-1 p-6 md:p-10 bg-gradient-to-br from-white to-blue-50">
          <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
            <div class="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center border-t-4 border-blue-500">
              <div class="bg-blue-100 p-3 rounded-full mb-3">
                <svg class="w-7 h-7 text-blue-600" fill="currentColor" viewBox="0 0 20 20"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              </div>
              <div class="text-3xl font-bold text-blue-800">{{ stats.totalBookings || 0 }}</div>
              <div class="text-sm text-gray-500 mt-1">Total Reservas</div>
              <a [routerLink]="['/admin/bookings']" class="mt-4 text-blue-600 hover:underline font-medium">Ver detalles</a>
            </div>
            <div class="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center border-t-4 border-green-500">
              <div class="bg-green-100 p-3 rounded-full mb-3">
                <svg class="w-7 h-7 text-green-600" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.51-1.31c-.562-.649-1.413-1.076-2.353-1.253V5z"/></svg>
              </div>
              <div class="text-3xl font-bold text-green-800">{{ stats.totalRevenue || 0 }}</div>
              <div class="text-sm text-gray-500 mt-1">Ingresos Totales</div>
              <a [routerLink]="['/admin/analytics']" class="mt-4 text-green-600 hover:underline font-medium">Ver reportes</a>
            </div>
            <div class="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center border-t-4 border-yellow-400">
              <div class="bg-yellow-100 p-3 rounded-full mb-3">
                <svg class="w-7 h-7 text-yellow-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"/></svg>
              </div>
              <div class="text-3xl font-bold text-yellow-700">{{ stats.activeDrivers || 0 }}</div>
              <div class="text-sm text-gray-500 mt-1">Conductores Activos</div>
              <a [routerLink]="['/admin/drivers']" class="mt-4 text-yellow-600 hover:underline font-medium">Gestionar</a>
            </div>
            <div class="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center border-t-4 border-purple-500">
              <div class="bg-purple-100 p-3 rounded-full mb-3">
                <svg class="w-7 h-7 text-purple-600" fill="currentColor" viewBox="0 0 20 20"><path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"/></svg>
              </div>
              <div class="text-3xl font-bold text-purple-800">{{ stats.totalUsers || 0 }}</div>
              <div class="text-sm text-gray-500 mt-1">Total Usuarios</div>
              <a [routerLink]="['/admin/users']" class="mt-4 text-purple-600 hover:underline font-medium">Ver usuarios</a>
            </div>
          </div>

          <div class="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div class="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center border-t-4 border-blue-400">
              <h2 class="text-xl font-bold text-blue-800 mb-4">Resumen de Actividad</h2>
              <p class="text-gray-600 text-center mb-6">Aquí puedes ver un resumen de la actividad reciente, estadísticas clave y acceder rápidamente a las secciones administrativas más importantes.</p>
              <a [routerLink]="['/admin/bookings']" class="w-full py-3 rounded-lg bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition mb-2 text-center">Ver Reservas</a>
              <a [routerLink]="['/admin/analytics']" class="w-full py-3 rounded-lg bg-green-600 text-white font-semibold shadow hover:bg-green-700 transition mb-2 text-center">Ver Reportes</a>
              <a [routerLink]="['/admin/drivers']" class="w-full py-3 rounded-lg bg-yellow-500 text-white font-semibold shadow hover:bg-yellow-600 transition mb-2 text-center">Gestionar Conductores</a>
              <a [routerLink]="['/admin/users']" class="w-full py-3 rounded-lg bg-purple-600 text-white font-semibold shadow hover:bg-purple-700 transition text-center">Ver Usuarios</a>
            </div>
            <div class="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center border-t-4 border-pink-400">
              <h2 class="text-xl font-bold text-pink-700 mb-4">Configuración y Soporte</h2>
              <p class="text-gray-600 text-center mb-6">Accede a la configuración avanzada del sistema o solicita soporte técnico para resolver cualquier inconveniente.</p>
              <a [routerLink]="['/admin/settings']" class="w-full py-3 rounded-lg bg-pink-600 text-white font-semibold shadow hover:bg-pink-700 transition mb-2 text-center">Configuración</a>
              <a [routerLink]="['/admin/support']" class="w-full py-3 rounded-lg bg-blue-400 text-white font-semibold shadow hover:bg-blue-500 transition text-center">Soporte</a>
            </div>
          </div>
        </main>
      </section>
    </div>
  `,
  styles: [`
    :host { display: block; }
    .sidebar-enter { transform: translateX(-100%); }
    .sidebar-enter-active { transform: translateX(0); transition: transform 300ms ease-in-out; }
    .sidebar-leave { transform: translateX(0); }
    .sidebar-leave-active { transform: translateX(-100%); transition: transform 300ms ease-in-out; }
  `]
})
export class AdminDashboardComponent implements OnInit {
  activeTab = 'dashboard';
  sidebarOpen = true;
  stats: any = {};

  navItems = [
    { tab: 'dashboard', label: 'Dashboard', route: '/admin/dashboard', icon: `<svg class='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'><path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z'/><path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M8 5v4M16 5v4'/></svg>` },
    { tab: 'bookings', label: 'Reservas', route: '/admin/bookings', icon: `<svg class='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'><path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2'/></svg>` },
    { tab: 'drivers', label: 'Conductores', route: '/admin/drivers', icon: `<svg class='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'><path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'/></svg>` },
    { tab: 'users', label: 'Usuarios', route: '/admin/users', icon: `<svg class='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'><path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z'/></svg>` },
    { tab: 'analytics', label: 'Analytics', route: '/admin/analytics', icon: `<svg class='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'><path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'/></svg>` },
    { tab: 'payments', label: 'Pagos', route: '/admin/payments', icon: `<svg class='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'><path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z'/></svg>` },
    { tab: 'promotions', label: 'Promociones', route: '/admin/promotions', icon: `<svg class='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'><path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z'/></svg>` },
    { tab: 'support', label: 'Soporte', route: '/admin/support', icon: `<svg class='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'><path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z'/></svg>` },
    { tab: 'settings', label: 'Configuración', route: '/admin/settings', icon: `<svg class='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'><path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z'/><path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M15 12a3 3 0 11-6 0 3 3 0 016 0z'/></svg>` },
  ];

  constructor(private adminService: AdminService) {}

  ngOnInit() {
    this.loadDashboardStats();
  }

  setActiveTab(tab: string) {
    this.activeTab = tab;
  }

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  async loadDashboardStats() {
    try {
      this.stats = await this.adminService.getDashboardData();
    } catch (error) {
      console.error('Error loading dashboard stats:', error);
    }
  }
}
