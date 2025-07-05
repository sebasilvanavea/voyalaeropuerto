import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminService, AnalyticsData } from '../../services/admin.service';

@Component({
  selector: 'app-admin-analytics',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="space-y-6">
      <!-- Filtros de fecha -->
      <div class="bg-white shadow rounded-lg p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Período de Análisis</h3>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Período</label>
            <select [(ngModel)]="selectedPeriod" 
                    (change)="onPeriodChange()"
                    class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
              <option value="7">Últimos 7 días</option>
              <option value="30">Últimos 30 días</option>
              <option value="90">Últimos 90 días</option>
              <option value="365">Último año</option>
              <option value="custom">Período personalizado</option>
            </select>
          </div>

          <div *ngIf="selectedPeriod === 'custom'">
            <label class="block text-sm font-medium text-gray-700 mb-2">Fecha desde</label>
            <input type="date" 
                   [(ngModel)]="customDateFrom"
                   (change)="loadAnalytics()"
                   class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
          </div>

          <div *ngIf="selectedPeriod === 'custom'">
            <label class="block text-sm font-medium text-gray-700 mb-2">Fecha hasta</label>
            <input type="date" 
                   [(ngModel)]="customDateTo"
                   (change)="loadAnalytics()"
                   class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
          </div>

          <div class="flex items-end">
            <button (click)="exportReport()"
                    class="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
              Exportar Reporte
            </button>
          </div>
        </div>
      </div>

      <!-- KPIs principales -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <svg class="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"/>
                  </svg>
                </div>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">Ingresos Totales</dt>
                  <dd class="text-lg font-medium text-gray-900">\${{kpis.totalRevenue | number}}</dd>
                </dl>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-5 py-3">
            <div class="text-sm">
              <span [class]="kpis.revenueGrowth >= 0 ? 'text-green-600' : 'text-red-600'" class="font-medium">
                {{kpis.revenueGrowth >= 0 ? '+' : ''}}{{kpis.revenueGrowth}}%
              </span>
              <span class="text-gray-600"> vs período anterior</span>
            </div>
          </div>
        </div>

        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg class="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                  </svg>
                </div>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">Viajes Completados</dt>
                  <dd class="text-lg font-medium text-gray-900">{{kpis.totalTrips | number}}</dd>
                </dl>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-5 py-3">
            <div class="text-sm">
              <span [class]="kpis.tripsGrowth >= 0 ? 'text-green-600' : 'text-red-600'" class="font-medium">
                {{kpis.tripsGrowth >= 0 ? '+' : ''}}{{kpis.tripsGrowth}}%
              </span>
              <span class="text-gray-600"> vs período anterior</span>
            </div>
          </div>
        </div>

        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                  <svg class="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z"/>
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clip-rule="evenodd"/>
                  </svg>
                </div>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">Valor Promedio</dt>
                  <dd class="text-lg font-medium text-gray-900">\${{kpis.averageValue | number}}</dd>
                </dl>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-5 py-3">
            <div class="text-sm">
              <span [class]="kpis.valueGrowth >= 0 ? 'text-green-600' : 'text-red-600'" class="font-medium">
                {{kpis.valueGrowth >= 0 ? '+' : ''}}{{kpis.valueGrowth}}%
              </span>
              <span class="text-gray-600"> vs período anterior</span>
            </div>
          </div>
        </div>

        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <svg class="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"/>
                  </svg>
                </div>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">Usuarios Activos</dt>
                  <dd class="text-lg font-medium text-gray-900">{{kpis.activeUsers | number}}</dd>
                </dl>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-5 py-3">
            <div class="text-sm">
              <span class="text-blue-600 font-medium">{{kpis.userRetention}}%</span>
              <span class="text-gray-600"> retención</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Gráficos principales -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Gráfico de ingresos -->
        <div class="bg-white shadow rounded-lg p-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Ingresos por Día</h3>
          <div class="h-80 flex items-center justify-center bg-gray-50 rounded">
            <div class="text-center">
              <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
              </svg>
              <h4 class="mt-2 text-sm font-medium text-gray-900">Gráfico de Ingresos</h4>
              <p class="mt-1 text-sm text-gray-500">Integración con Chart.js próximamente</p>
            </div>
          </div>
        </div>

        <!-- Gráfico de reservas por hora -->
        <div class="bg-white shadow rounded-lg p-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Reservas por Hora del Día</h3>
          <div class="h-80 flex items-center justify-center bg-gray-50 rounded">
            <div class="text-center">
              <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
              </svg>
              <h4 class="mt-2 text-sm font-medium text-gray-900">Gráfico de Distribución</h4>
              <p class="mt-1 text-sm text-gray-500">Horarios pico de demanda</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Rutas más populares -->
      <div class="bg-white shadow rounded-lg">
        <div class="px-6 py-4 border-b border-gray-200">
          <h3 class="text-lg font-medium text-gray-900">Rutas Más Populares</h3>
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ruta</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Viajes</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ingresos</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Promedio</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Porcentaje</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr *ngFor="let route of analyticsData?.topRoutes?.slice(0, 10)" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {{route.route}}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{route.count}}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  \${{route.revenue | number}}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  \${{route.revenue / route.count | number}}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div class="flex items-center">
                    <div class="w-16 bg-gray-200 rounded-full h-2 mr-2">
                      <div class="bg-blue-600 h-2 rounded-full" 
                           [style.width.%]="(route.count / getMaxRouteCount()) * 100"></div>
                    </div>
                    {{((route.count / getTotalRouteCount()) * 100) | number:'1.1-1'}}%
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Performance de conductores -->
      <div class="bg-white shadow rounded-lg">
        <div class="px-6 py-4 border-b border-gray-200">
          <h3 class="text-lg font-medium text-gray-900">Top Conductores por Ingresos</h3>
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Conductor</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Viajes</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ingresos</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Promedio/Viaje</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr *ngFor="let driver of analyticsData?.driverPerformance?.slice(0, 10)" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-10 w-10">
                      <img class="h-10 w-10 rounded-full" 
                           [src]="'https://ui-avatars.com/api/?name=' + driver.name + '&background=3b82f6&color=fff'" 
                           [alt]="driver.name">
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900">{{driver.name}}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{driver.trips}}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div class="flex items-center">
                    <svg class="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                    </svg>
                    {{driver.rating | number:'1.1-1'}}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  \${{driver.earnings | number}}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  \${{driver.earnings / driver.trips | number}}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Métricas de usuarios -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="bg-white shadow rounded-lg p-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Adquisición de Usuarios</h3>
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600">Nuevos usuarios</span>
              <span class="text-lg font-medium text-gray-900">{{analyticsData?.userMetrics?.newUsers || 0}}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600">Usuarios activos</span>
              <span class="text-lg font-medium text-gray-900">{{analyticsData?.userMetrics?.activeUsers || 0}}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600">Tasa de retención</span>
              <span class="text-lg font-medium text-green-600">{{(analyticsData?.userMetrics?.retentionRate || 0) * 100 | number:'1.1-1'}}%</span>
            </div>
          </div>
        </div>

        <div class="bg-white shadow rounded-lg p-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Horarios Pico</h3>
          <div class="space-y-2">
            <div *ngFor="let hour of getPeakHours()" class="flex items-center justify-between">
              <span class="text-sm text-gray-600">{{hour.period}}</span>
              <div class="flex items-center">
                <div class="w-20 bg-gray-200 rounded-full h-2 mr-2">
                  <div class="bg-blue-600 h-2 rounded-full" [style.width.%]="hour.percentage"></div>
                </div>
                <span class="text-sm font-medium text-gray-900">{{hour.count}}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white shadow rounded-lg p-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Resumen del Período</h3>
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600">Total de viajes</span>
              <span class="text-lg font-medium text-gray-900">{{getTotalTrips()}}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600">Ingresos totales</span>
              <span class="text-lg font-medium text-gray-900">\${{getTotalRevenue() | number}}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600">Rutas únicas</span>
              <span class="text-lg font-medium text-gray-900">{{analyticsData?.topRoutes?.length || 0}}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class AdminAnalyticsComponent implements OnInit {
  selectedPeriod = '30';
  customDateFrom = '';
  customDateTo = '';
  loading = false;
  analyticsData: AnalyticsData | null = null;

  kpis = {
    totalRevenue: 0,
    revenueGrowth: 0,
    totalTrips: 0,
    tripsGrowth: 0,
    averageValue: 0,
    valueGrowth: 0,
    activeUsers: 0,
    userRetention: 0
  };

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadAnalytics();
  }

  async loadAnalytics(): Promise<void> {
    this.loading = true;
    try {
      this.analyticsData = await this.adminService.getAnalyticsData();
      this.calculateKPIs();
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      this.loading = false;
    }
  }

  onPeriodChange(): void {
    if (this.selectedPeriod !== 'custom') {
      this.loadAnalytics();
    }
  }

  calculateKPIs(): void {
    if (!this.analyticsData) return;

    const revenue = this.getTotalRevenue();
    const trips = this.getTotalTrips();

    this.kpis = {
      totalRevenue: revenue,
      revenueGrowth: Math.floor(Math.random() * 20) - 5, // Simulado
      totalTrips: trips,
      tripsGrowth: Math.floor(Math.random() * 15) - 5, // Simulado
      averageValue: trips > 0 ? revenue / trips : 0,
      valueGrowth: Math.floor(Math.random() * 10) - 5, // Simulado
      activeUsers: this.analyticsData.userMetrics.activeUsers,
      userRetention: Math.round(this.analyticsData.userMetrics.retentionRate * 100)
    };
  }

  getTotalRevenue(): number {
    return this.analyticsData?.revenueByDay?.reduce((sum, day) => sum + day.amount, 0) || 0;
  }

  getTotalTrips(): number {
    return this.analyticsData?.topRoutes?.reduce((sum, route) => sum + route.count, 0) || 0;
  }

  getMaxRouteCount(): number {
    if (!this.analyticsData?.topRoutes?.length) return 1;
    return Math.max(...this.analyticsData.topRoutes.map(r => r.count));
  }

  getTotalRouteCount(): number {
    return this.analyticsData?.topRoutes?.reduce((sum, route) => sum + route.count, 0) || 1;
  }

  getPeakHours(): Array<{period: string, count: number, percentage: number}> {
    if (!this.analyticsData?.bookingsByHour) return [];

    const hourlyData = this.analyticsData.bookingsByHour;
    const maxCount = Math.max(...hourlyData.map(h => h.count));

    // Agrupar por períodos del día
    const periods = [
      { name: 'Madrugada (0-6)', hours: [0, 1, 2, 3, 4, 5] },
      { name: 'Mañana (6-12)', hours: [6, 7, 8, 9, 10, 11] },
      { name: 'Tarde (12-18)', hours: [12, 13, 14, 15, 16, 17] },
      { name: 'Noche (18-24)', hours: [18, 19, 20, 21, 22, 23] }
    ];

    return periods.map(period => {
      const count = period.hours.reduce((sum, hour) => {
        const hourData = hourlyData.find(h => h.hour === hour);
        return sum + (hourData?.count || 0);
      }, 0);

      return {
        period: period.name,
        count,
        percentage: maxCount > 0 ? (count / maxCount) * 100 : 0
      };
    }).sort((a, b) => b.count - a.count);
  }

  exportReport(): void {
    // Generar reporte CSV o PDF
    const csvContent = this.generateCSVReport();
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `reporte-analytics-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  }

  private generateCSVReport(): string {
    let csv = 'Reporte de Analytics\n\n';
    
    // KPIs
    csv += 'KPIs Principales\n';
    csv += 'Métrica,Valor\n';
    csv += `Ingresos Totales,$${this.kpis.totalRevenue}\n`;
    csv += `Total Viajes,${this.kpis.totalTrips}\n`;
    csv += `Valor Promedio,$${this.kpis.averageValue}\n`;
    csv += `Usuarios Activos,${this.kpis.activeUsers}\n\n`;

    // Rutas más populares
    csv += 'Rutas Más Populares\n';
    csv += 'Ruta,Viajes,Ingresos\n';
    this.analyticsData?.topRoutes?.forEach(route => {
      csv += `"${route.route}",${route.count},$${route.revenue}\n`;
    });

    // Performance conductores
    csv += '\nTop Conductores\n';
    csv += 'Nombre,Viajes,Rating,Ingresos\n';
    this.analyticsData?.driverPerformance?.forEach(driver => {
      csv += `"${driver.name}",${driver.trips},${driver.rating},$${driver.earnings}\n`;
    });

    return csv;
  }
}
