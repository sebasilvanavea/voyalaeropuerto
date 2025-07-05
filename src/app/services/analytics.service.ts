import { Injectable } from '@angular/core';
import { SupabaseClient, createClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';

export interface AnalyticsMetrics {
  revenue: {
    total: number;
    growth: number;
    byPeriod: Array<{ date: string; amount: number }>;
    byService: Array<{ service: string; amount: number; percentage: number }>;
  };
  trips: {
    total: number;
    completed: number;
    cancelled: number;
    growth: number;
    byStatus: { [status: string]: number };
    averageDuration: number;
    averageDistance: number;
  };
  users: {
    total: number;
    new: number;
    active: number;
    retention: number;
    demographics: {
      ageGroups: { [group: string]: number };
      locations: { [location: string]: number };
    };
  };
  drivers: {
    total: number;
    active: number;
    averageRating: number;
    totalEarnings: number;
    performance: Array<{
      driverId: string;
      name: string;
      trips: number;
      rating: number;
      earnings: number;
      hoursWorked: number;
    }>;
  };
  operations: {
    peakHours: Array<{ hour: number; bookings: number }>;
    popularRoutes: Array<{ route: string; count: number; revenue: number }>;
    cancelReasons: { [reason: string]: number };
    averageWaitTime: number;
    customerSatisfaction: number;
  };
}

export interface ReportConfig {
  type: 'revenue' | 'trips' | 'drivers' | 'users' | 'operations' | 'comprehensive';
  period: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly' | 'custom';
  startDate?: Date;
  endDate?: Date;
  filters?: {
    driverId?: string;
    userId?: string;
    serviceType?: string;
    location?: string;
  };
  format: 'json' | 'csv' | 'pdf' | 'excel';
}

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  private supabase: SupabaseClient;
  private metricsSubject = new BehaviorSubject<AnalyticsMetrics | null>(null);
  public metrics$ = this.metricsSubject.asObservable();

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
  }

  async getAnalyticsMetrics(period: string = 'month', filters?: any): Promise<AnalyticsMetrics> {
    try {
      const dateRange = this.getDateRange(period);
      
      // Ejecutar todas las consultas en paralelo
      const [
        revenueData,
        tripsData,
        usersData,
        driversData,
        operationsData
      ] = await Promise.all([
        this.getRevenueMetrics(dateRange, filters),
        this.getTripsMetrics(dateRange, filters),
        this.getUsersMetrics(dateRange, filters),
        this.getDriversMetrics(dateRange, filters),
        this.getOperationsMetrics(dateRange, filters)
      ]);

      const metrics: AnalyticsMetrics = {
        revenue: revenueData,
        trips: tripsData,
        users: usersData,
        drivers: driversData,
        operations: operationsData
      };

      this.metricsSubject.next(metrics);
      return metrics;
    } catch (error) {
      console.error('Error fetching analytics metrics:', error);
      throw error;
    }
  }

  private async getRevenueMetrics(dateRange: { start: string; end: string }, filters?: any) {
    const { data: payments } = await this.supabase
      .from('payments')
      .select('amount, created_at, booking_id, bookings(service_type)')
      .eq('status', 'completed')
      .gte('created_at', dateRange.start)
      .lte('created_at', dateRange.end);

    const { data: previousPeriodPayments } = await this.supabase
      .from('payments')
      .select('amount')
      .eq('status', 'completed')
      .gte('created_at', this.getPreviousPeriodStart(dateRange.start, dateRange.end))
      .lt('created_at', dateRange.start);

    const total = payments?.reduce((sum, p) => sum + p.amount, 0) || 0;
    const previousTotal = previousPeriodPayments?.reduce((sum, p) => sum + p.amount, 0) || 0;
    const growth = previousTotal > 0 ? ((total - previousTotal) / previousTotal) * 100 : 0;

    // Agrupar por período
    const byPeriod = this.groupByPeriod(payments || [], 'created_at', 'amount');    // Agrupar por tipo de servicio
    const serviceGroups = new Map();
    payments?.forEach(payment => {
      const serviceType = (payment.bookings && payment.bookings.length > 0) 
        ? payment.bookings[0].service_type 
        : 'standard';
      const current = serviceGroups.get(serviceType) || 0;
      serviceGroups.set(serviceType, current + payment.amount);
    });

    const byService = Array.from(serviceGroups.entries()).map(([service, amount]) => ({
      service,
      amount,
      percentage: (amount / total) * 100
    }));

    return {
      total,
      growth: Math.round(growth * 100) / 100,
      byPeriod,
      byService
    };
  }

  private async getTripsMetrics(dateRange: { start: string; end: string }, filters?: any) {
    const { data: bookings } = await this.supabase
      .from('bookings')
      .select('status, created_at, pickup_datetime, completed_at, distance, duration, cancellation_reason')
      .gte('created_at', dateRange.start)
      .lte('created_at', dateRange.end);

    const { data: previousBookings } = await this.supabase
      .from('bookings')
      .select('status')
      .gte('created_at', this.getPreviousPeriodStart(dateRange.start, dateRange.end))
      .lt('created_at', dateRange.start);

    const total = bookings?.length || 0;
    const completed = bookings?.filter(b => b.status === 'completed').length || 0;
    const cancelled = bookings?.filter(b => b.status === 'cancelled').length || 0;
    
    const previousTotal = previousBookings?.length || 0;
    const growth = previousTotal > 0 ? ((total - previousTotal) / previousTotal) * 100 : 0;

    // Estadísticas por estado
    const byStatus = bookings?.reduce((acc, booking) => {
      acc[booking.status] = (acc[booking.status] || 0) + 1;
      return acc;
    }, {} as { [status: string]: number }) || {};

    // Promedios
    const completedBookings = bookings?.filter(b => b.status === 'completed') || [];
    const averageDuration = completedBookings.length > 0 
      ? completedBookings.reduce((sum, b) => sum + (b.duration || 0), 0) / completedBookings.length 
      : 0;
    const averageDistance = completedBookings.length > 0 
      ? completedBookings.reduce((sum, b) => sum + (b.distance || 0), 0) / completedBookings.length 
      : 0;

    return {
      total,
      completed,
      cancelled,
      growth: Math.round(growth * 100) / 100,
      byStatus,
      averageDuration: Math.round(averageDuration),
      averageDistance: Math.round(averageDistance * 100) / 100
    };
  }

  private async getUsersMetrics(dateRange: { start: string; end: string }, filters?: any) {
    const { data: users } = await this.supabase
      .from('user_profiles')
      .select('created_at, last_login, age, location');

    const { data: newUsers } = await this.supabase
      .from('user_profiles')
      .select('created_at')
      .gte('created_at', dateRange.start)
      .lte('created_at', dateRange.end);

    const { data: activeUsers } = await this.supabase
      .from('user_profiles')
      .select('last_login')
      .gte('last_login', dateRange.start)
      .lte('last_login', dateRange.end);

    const total = users?.length || 0;
    const newCount = newUsers?.length || 0;
    const activeCount = activeUsers?.length || 0;

    // Calcular retención (usuarios que hicieron al menos 2 reservas)
    const { data: retentionData } = await this.supabase
      .from('bookings')
      .select('user_id')
      .gte('created_at', dateRange.start)
      .lte('created_at', dateRange.end);

    const userBookingCounts = new Map();
    retentionData?.forEach(booking => {
      const count = userBookingCounts.get(booking.user_id) || 0;
      userBookingCounts.set(booking.user_id, count + 1);
    });

    const retainedUsers = Array.from(userBookingCounts.values()).filter(count => count >= 2).length;
    const retention = newCount > 0 ? (retainedUsers / newCount) * 100 : 0;

    // Demografía
    const ageGroups = users?.reduce((acc, user) => {
      if (user.age) {
        const group = this.getAgeGroup(user.age);
        acc[group] = (acc[group] || 0) + 1;
      }
      return acc;
    }, {} as { [group: string]: number }) || {};

    const locations = users?.reduce((acc, user) => {
      if (user.location) {
        acc[user.location] = (acc[user.location] || 0) + 1;
      }
      return acc;
    }, {} as { [location: string]: number }) || {};

    return {
      total,
      new: newCount,
      active: activeCount,
      retention: Math.round(retention * 100) / 100,
      demographics: {
        ageGroups,
        locations
      }
    };
  }

  private async getDriversMetrics(dateRange: { start: string; end: string }, filters?: any) {
    const { data: drivers } = await this.supabase
      .from('drivers')
      .select(`
        id, name, rating, is_active,
        bookings(id, status, total_amount, created_at, completed_at)
      `);

    const { data: payments } = await this.supabase
      .from('payments')
      .select('amount, driver_earnings, created_at')
      .eq('status', 'completed')
      .gte('created_at', dateRange.start)
      .lte('created_at', dateRange.end);

    const total = drivers?.length || 0;
    const active = drivers?.filter(d => d.is_active).length || 0;    const averageRating = (drivers && drivers.length > 0)
      ? drivers.reduce((sum, d) => sum + (d.rating || 0), 0) / drivers.length
      : 0;
    const totalEarnings = payments?.reduce((sum, p) => sum + (p.driver_earnings || 0), 0) || 0;

    // Performance por conductor
    const performance = drivers?.map(driver => {
      const driverBookings = driver.bookings?.filter(b => 
        b.created_at >= dateRange.start && b.created_at <= dateRange.end
      ) || [];
      
      const completedTrips = driverBookings.filter(b => b.status === 'completed');
      const earnings = completedTrips.reduce((sum, b) => sum + (b.total_amount * 0.85), 0); // 85% para el conductor
      
      // Calcular horas trabajadas (estimado)
      const hoursWorked = completedTrips.length * 1.5; // Estimado 1.5 horas por viaje

      return {
        driverId: driver.id,
        name: driver.name,
        trips: completedTrips.length,
        rating: driver.rating || 0,
        earnings,
        hoursWorked
      };
    }).sort((a, b) => b.earnings - a.earnings) || [];

    return {
      total,
      active,
      averageRating: Math.round(averageRating * 100) / 100,
      totalEarnings,
      performance
    };
  }

  private async getOperationsMetrics(dateRange: { start: string; end: string }, filters?: any) {
    const { data: bookings } = await this.supabase
      .from('bookings')
      .select('pickup_datetime, pickup_location, dropoff_location, status, cancellation_reason, wait_time, created_at')
      .gte('created_at', dateRange.start)
      .lte('created_at', dateRange.end);

    const { data: reviews } = await this.supabase
      .from('reviews')
      .select('rating')
      .gte('created_at', dateRange.start)
      .lte('created_at', dateRange.end);

    // Horas pico
    const hourlyBookings = new Array(24).fill(0);
    bookings?.forEach(booking => {
      const hour = new Date(booking.pickup_datetime).getHours();
      hourlyBookings[hour]++;
    });

    const peakHours = hourlyBookings.map((count, hour) => ({ hour, bookings: count }))
      .sort((a, b) => b.bookings - a.bookings)
      .slice(0, 6);

    // Rutas populares
    const routeCounts = new Map();
    const routeRevenue = new Map();
    bookings?.forEach(booking => {
      if (booking.status === 'completed') {
        const route = `${booking.pickup_location} → ${booking.dropoff_location}`;
        routeCounts.set(route, (routeCounts.get(route) || 0) + 1);
        // Necesitaríamos el monto del viaje para calcular revenue real
        routeRevenue.set(route, (routeRevenue.get(route) || 0) + 25000); // Valor estimado
      }
    });

    const popularRoutes = Array.from(routeCounts.entries())
      .map(([route, count]) => ({
        route,
        count,
        revenue: routeRevenue.get(route) || 0
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Razones de cancelación
    const cancelReasons = bookings?.
      filter(b => b.status === 'cancelled' && b.cancellation_reason)
      .reduce((acc, booking) => {
        acc[booking.cancellation_reason] = (acc[booking.cancellation_reason] || 0) + 1;
        return acc;
      }, {} as { [reason: string]: number }) || {};

    // Tiempo de espera promedio
    const waitTimes = bookings?.filter(b => b.wait_time).map(b => b.wait_time) || [];
    const averageWaitTime = waitTimes.length > 0 
      ? waitTimes.reduce((sum, time) => sum + time, 0) / waitTimes.length 
      : 0;    // Satisfacción del cliente
    const customerSatisfaction = (reviews && reviews.length > 0)
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

    return {
      peakHours,
      popularRoutes,
      cancelReasons,
      averageWaitTime: Math.round(averageWaitTime),
      customerSatisfaction: Math.round(customerSatisfaction * 100) / 100
    };
  }

  async generateReport(config: ReportConfig): Promise<any> {
    try {
      const dateRange = config.period === 'custom' && config.startDate && config.endDate
        ? {
            start: config.startDate.toISOString(),
            end: config.endDate.toISOString()
          }
        : this.getDateRange(config.period);

      let data: any;

      switch (config.type) {
        case 'comprehensive':
          data = await this.getAnalyticsMetrics(config.period, config.filters);
          break;
        case 'revenue':
          data = await this.getRevenueMetrics(dateRange, config.filters);
          break;
        case 'trips':
          data = await this.getTripsMetrics(dateRange, config.filters);
          break;
        case 'drivers':
          data = await this.getDriversMetrics(dateRange, config.filters);
          break;
        case 'users':
          data = await this.getUsersMetrics(dateRange, config.filters);
          break;
        case 'operations':
          data = await this.getOperationsMetrics(dateRange, config.filters);
          break;
        default:
          throw new Error('Tipo de reporte no válido');
      }

      // Formatear según el tipo solicitado
      switch (config.format) {
        case 'json':
          return data;
        case 'csv':
          return this.formatAsCSV(data, config.type);
        case 'pdf':
          return this.formatAsPDF(data, config.type);
        case 'excel':
          return this.formatAsExcel(data, config.type);
        default:
          return data;
      }
    } catch (error) {
      console.error('Error generating report:', error);
      throw error;
    }
  }

  private getDateRange(period: string): { start: string; end: string } {
    const now = new Date();
    const start = new Date();
    
    switch (period) {
      case 'daily':
        start.setDate(now.getDate() - 1);
        break;
      case 'weekly':
        start.setDate(now.getDate() - 7);
        break;
      case 'monthly':
        start.setMonth(now.getMonth() - 1);
        break;
      case 'quarterly':
        start.setMonth(now.getMonth() - 3);
        break;
      case 'yearly':
        start.setFullYear(now.getFullYear() - 1);
        break;
      default:
        start.setMonth(now.getMonth() - 1);
    }

    return {
      start: start.toISOString(),
      end: now.toISOString()
    };
  }

  private getPreviousPeriodStart(currentStart: string, currentEnd: string): string {
    const start = new Date(currentStart);
    const end = new Date(currentEnd);
    const diff = end.getTime() - start.getTime();
    return new Date(start.getTime() - diff).toISOString();
  }

  private groupByPeriod(data: any[], dateField: string, valueField: string): Array<{ date: string; amount: number }> {
    const grouped = new Map();
    
    data.forEach(item => {
      const date = new Date(item[dateField]).toISOString().split('T')[0];
      const current = grouped.get(date) || 0;
      grouped.set(date, current + item[valueField]);
    });

    return Array.from(grouped.entries()).map(([date, amount]) => ({ date, amount }));
  }

  private getAgeGroup(age: number): string {
    if (age < 25) return '18-24';
    if (age < 35) return '25-34';
    if (age < 45) return '35-44';
    if (age < 55) return '45-54';
    if (age < 65) return '55-64';
    return '65+';
  }

  private formatAsCSV(data: any, reportType: string): string {
    let csv = `Reporte de ${reportType.toUpperCase()}\n`;
    csv += `Generado el: ${new Date().toLocaleString()}\n\n`;

    // Formatear según el tipo de reporte
    if (reportType === 'revenue') {
      csv += 'Métricas de Ingresos\n';
      csv += `Total,$${data.total}\n`;
      csv += `Crecimiento,${data.growth}%\n\n`;
      
      csv += 'Ingresos por Período\n';
      csv += 'Fecha,Monto\n';
      data.byPeriod.forEach((item: any) => {
        csv += `${item.date},$${item.amount}\n`;
      });
    }

    return csv;
  }

  private formatAsPDF(data: any, reportType: string): any {
    // Aquí se implementaría la generación de PDF
    // Por ejemplo, usando jsPDF o similar
    return {
      message: 'PDF generation not implemented yet',
      data
    };
  }

  private formatAsExcel(data: any, reportType: string): any {
    // Aquí se implementaría la generación de Excel
    // Por ejemplo, usando ExcelJS o similar
    return {
      message: 'Excel generation not implemented yet',
      data
    };
  }

  // Métodos adicionales para análisis específicos
  async getRealtimeMetrics(): Promise<{
    activeTrips: number;
    driversOnline: number;
    avgWaitTime: number;
    currentRevenue: number;
  }> {
    try {
      const today = new Date().toISOString().split('T')[0];

      const [activeTrips, driversOnline, todayPayments] = await Promise.all([
        this.supabase
          .from('bookings')
          .select('id')
          .in('status', ['confirmed', 'assigned', 'in_progress']),
        
        this.supabase
          .from('drivers')
          .select('id')
          .eq('is_active', true)
          .eq('status', 'approved'),
        
        this.supabase
          .from('payments')
          .select('amount')
          .eq('status', 'completed')
          .gte('created_at', `${today}T00:00:00`)
      ]);

      return {
        activeTrips: activeTrips.data?.length || 0,
        driversOnline: driversOnline.data?.length || 0,
        avgWaitTime: 5, // Calcular real basado en datos
        currentRevenue: todayPayments.data?.reduce((sum, p) => sum + p.amount, 0) || 0
      };
    } catch (error) {
      console.error('Error fetching realtime metrics:', error);
      throw error;
    }
  }

  async getCompetitiveAnalysis(): Promise<{
    marketPosition: string;
    priceComparison: { competitor: string; averagePrice: number; ourPrice: number }[];
    strengthsWeaknesses: { strengths: string[]; weaknesses: string[] };
  }> {
    // Esto sería basado en datos externos o configuraciones del admin
    return {
      marketPosition: 'Líder en traslados aeropuerto',
      priceComparison: [
        { competitor: 'Uber', averagePrice: 28000, ourPrice: 25000 },
        { competitor: 'Cabify', averagePrice: 26000, ourPrice: 25000 },
        { competitor: 'Transfer tradicional', averagePrice: 35000, ourPrice: 25000 }
      ],
      strengthsWeaknesses: {
        strengths: ['Precios competitivos', 'Especialización aeropuerto', 'Alta calidad servicio'],
        weaknesses: ['Menor cobertura geográfica', 'Menor reconocimiento marca']
      }
    };
  }
}
