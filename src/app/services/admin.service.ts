import { Injectable } from '@angular/core';
import { SupabaseClient, createClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';

export interface DashboardData {
  todayBookings: number;
  bookingsGrowth: number;
  todayRevenue: number;
  revenueGrowth: number;
  activeDrivers: number;
  totalDrivers: number;
  totalUsers: number;
  newUsersToday: number;
}

export interface BookingDetails {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  pickupLocation: string;
  dropoffLocation: string;
  pickupDateTime: Date;
  status: 'pending' | 'confirmed' | 'assigned' | 'in_progress' | 'completed' | 'cancelled';
  amount: number;
  paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded';
  driverName?: string;
  vehicleInfo?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface DriverDetails {
  id: string;
  name: string;
  email: string;
  phone: string;
  licenseNumber: string;
  status: 'pending' | 'approved' | 'rejected' | 'suspended';
  isActive: boolean;
  rating: number;
  totalTrips: number;
  totalEarnings: number;
  vehicleInfo: any;
  documents: any[];
  createdAt: Date;
  lastActive: Date;
}

export interface UserDetails {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'active' | 'suspended' | 'banned';
  totalBookings: number;
  totalSpent: number;
  rating: number;
  createdAt: Date;
  lastLogin: Date;
}

export interface AnalyticsData {
  revenueByDay: Array<{ date: string; amount: number }>;
  bookingsByHour: Array<{ hour: number; count: number }>;
  topRoutes: Array<{ route: string; count: number; revenue: number }>;
  driverPerformance: Array<{ driverId: string; name: string; trips: number; rating: number; earnings: number }>;
  userMetrics: {
    newUsers: number;
    activeUsers: number;
    retentionRate: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private supabase: SupabaseClient;
  private dashboardDataSubject = new BehaviorSubject<DashboardData | null>(null);
  public dashboardData$ = this.dashboardDataSubject.asObservable();

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
  }

  async getDashboardData(): Promise<DashboardData> {
    try {
      const today = new Date().toISOString().split('T')[0];
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];

      // Reservas de hoy
      const { data: todayBookings } = await this.supabase
        .from('bookings')
        .select('*')
        .gte('created_at', `${today}T00:00:00`)
        .lt('created_at', `${today}T23:59:59`);

      // Reservas de ayer
      const { data: yesterdayBookings } = await this.supabase
        .from('bookings')
        .select('*')
        .gte('created_at', `${yesterday}T00:00:00`)
        .lt('created_at', `${yesterday}T23:59:59`);

      // Ingresos de hoy
      const { data: todayPayments } = await this.supabase
        .from('payments')
        .select('amount')
        .eq('status', 'completed')
        .gte('created_at', `${today}T00:00:00`)
        .lt('created_at', `${today}T23:59:59`);

      // Ingresos de ayer
      const { data: yesterdayPayments } = await this.supabase
        .from('payments')
        .select('amount')
        .eq('status', 'completed')
        .gte('created_at', `${yesterday}T00:00:00`)
        .lt('created_at', `${yesterday}T23:59:59`);

      // Conductores activos
      const { data: activeDrivers } = await this.supabase
        .from('drivers')
        .select('*')
        .eq('is_active', true)
        .eq('status', 'approved');

      // Total conductores
      const { data: totalDrivers } = await this.supabase
        .from('drivers')
        .select('id');

      // Total usuarios
      const { data: totalUsers } = await this.supabase
        .from('user_profiles')
        .select('id');

      // Nuevos usuarios hoy
      const { data: newUsersToday } = await this.supabase
        .from('user_profiles')
        .select('*')
        .gte('created_at', `${today}T00:00:00`)
        .lt('created_at', `${today}T23:59:59`);

      const todayBookingsCount = todayBookings?.length || 0;
      const yesterdayBookingsCount = yesterdayBookings?.length || 0;
      const bookingsGrowth = yesterdayBookingsCount > 0 
        ? Math.round(((todayBookingsCount - yesterdayBookingsCount) / yesterdayBookingsCount) * 100)
        : 0;

      const todayRevenue = todayPayments?.reduce((sum, p) => sum + p.amount, 0) || 0;
      const yesterdayRevenue = yesterdayPayments?.reduce((sum, p) => sum + p.amount, 0) || 0;
      const revenueGrowth = yesterdayRevenue > 0 
        ? Math.round(((todayRevenue - yesterdayRevenue) / yesterdayRevenue) * 100)
        : 0;

      const dashboardData: DashboardData = {
        todayBookings: todayBookingsCount,
        bookingsGrowth,
        todayRevenue,
        revenueGrowth,
        activeDrivers: activeDrivers?.length || 0,
        totalDrivers: totalDrivers?.length || 0,
        totalUsers: totalUsers?.length || 0,
        newUsersToday: newUsersToday?.length || 0
      };

      this.dashboardDataSubject.next(dashboardData);
      return dashboardData;
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      throw error;
    }
  }

  async getBookings(page = 1, limit = 20, filters?: any): Promise<{ bookings: BookingDetails[]; total: number }> {
    try {
      let query = this.supabase
        .from('bookings')
        .select(`
          *,
          user_profiles(name, email, phone),
          drivers(name, vehicles(make, model, license_plate))
        `)
        .order('created_at', { ascending: false });

      if (filters?.status) {
        query = query.eq('status', filters.status);
      }

      if (filters?.dateFrom) {
        query = query.gte('created_at', filters.dateFrom);
      }

      if (filters?.dateTo) {
        query = query.lte('created_at', filters.dateTo);
      }

      const { data, error, count } = await query
        .range((page - 1) * limit, page * limit - 1);

      if (error) throw error;

      const bookings: BookingDetails[] = data?.map(booking => ({
        id: booking.id,
        customerName: booking.user_profiles?.name || 'N/A',
        customerEmail: booking.user_profiles?.email || '',
        customerPhone: booking.user_profiles?.phone || '',
        pickupLocation: booking.pickup_location,
        dropoffLocation: booking.dropoff_location,
        pickupDateTime: new Date(booking.pickup_datetime),
        status: booking.status,
        amount: booking.total_amount,
        paymentStatus: booking.payment_status,
        driverName: booking.drivers?.name,
        vehicleInfo: booking.drivers?.vehicles ? 
          `${booking.drivers.vehicles.make} ${booking.drivers.vehicles.model} - ${booking.drivers.vehicles.license_plate}` 
          : undefined,
        createdAt: new Date(booking.created_at),
        updatedAt: new Date(booking.updated_at)
      })) || [];

      return { bookings, total: count || 0 };
    } catch (error) {
      console.error('Error fetching bookings:', error);
      throw error;
    }
  }

  async getDrivers(page = 1, limit = 20, filters?: any): Promise<{ drivers: DriverDetails[]; total: number }> {
    try {
      let query = this.supabase
        .from('drivers')
        .select(`
          *,
          vehicles(*),
          bookings(id, status, total_amount, created_at)
        `)
        .order('created_at', { ascending: false });

      if (filters?.status) {
        query = query.eq('status', filters.status);
      }

      if (filters?.isActive !== undefined) {
        query = query.eq('is_active', filters.isActive);
      }

      const { data, error, count } = await query
        .range((page - 1) * limit, page * limit - 1);

      if (error) throw error;

      const drivers: DriverDetails[] = data?.map(driver => {        const completedBookings = driver.bookings?.filter((b: any) => b.status === 'completed') || [];
        const totalEarnings = completedBookings.reduce((sum: number, b: any) => sum + b.total_amount, 0);

        return {
          id: driver.id,
          name: driver.name,
          email: driver.email,
          phone: driver.phone,
          licenseNumber: driver.license_number,
          status: driver.status,
          isActive: driver.is_active,
          rating: driver.rating || 0,
          totalTrips: completedBookings.length,
          totalEarnings,
          vehicleInfo: driver.vehicles,
          documents: driver.documents || [],
          createdAt: new Date(driver.created_at),
          lastActive: new Date(driver.last_active || driver.created_at)
        };
      }) || [];

      return { drivers, total: count || 0 };
    } catch (error) {
      console.error('Error fetching drivers:', error);
      throw error;
    }
  }

  async getUsers(page = 1, limit = 20, filters?: any): Promise<{ users: UserDetails[]; total: number }> {
    try {
      let query = this.supabase
        .from('user_profiles')
        .select(`
          *,
          bookings(id, status, total_amount, created_at)
        `)
        .order('created_at', { ascending: false });

      if (filters?.status) {
        query = query.eq('status', filters.status);
      }

      const { data, error, count } = await query
        .range((page - 1) * limit, page * limit - 1);

      if (error) throw error;

      const users: UserDetails[] = data?.map(user => {        const completedBookings = user.bookings?.filter((b: any) => b.status === 'completed') || [];
        const totalSpent = completedBookings.reduce((sum: number, b: any) => sum + b.total_amount, 0);

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          status: user.status || 'active',
          totalBookings: user.bookings?.length || 0,
          totalSpent,
          rating: user.rating || 0,
          createdAt: new Date(user.created_at),
          lastLogin: new Date(user.last_login || user.created_at)
        };
      }) || [];

      return { users, total: count || 0 };
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  }

  async getAnalyticsData(): Promise<AnalyticsData> {
    try {
      // Ingresos por día (últimos 30 días)
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
      
      const { data: revenueData } = await this.supabase
        .from('payments')
        .select('amount, created_at')
        .eq('status', 'completed')
        .gte('created_at', thirtyDaysAgo)
        .order('created_at');

      // Reservas por hora (último mes)
      const { data: bookingsData } = await this.supabase
        .from('bookings')
        .select('created_at')
        .gte('created_at', thirtyDaysAgo);

      // Rutas más populares
      const { data: routesData } = await this.supabase
        .from('bookings')
        .select('pickup_location, dropoff_location, total_amount')
        .eq('status', 'completed')
        .gte('created_at', thirtyDaysAgo);

      // Performance de conductores
      const { data: driverPerformanceData } = await this.supabase
        .from('drivers')
        .select(`
          id, name,
          bookings(id, status, total_amount, rating)
        `);

      // Métricas de usuarios
      const { data: newUsersData } = await this.supabase
        .from('user_profiles')
        .select('created_at')
        .gte('created_at', thirtyDaysAgo);

      const { data: activeUsersData } = await this.supabase
        .from('user_profiles')
        .select('last_login')
        .gte('last_login', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

      // Procesar datos
      const revenueByDay = this.processRevenueByDay(revenueData || []);
      const bookingsByHour = this.processBookingsByHour(bookingsData || []);
      const topRoutes = this.processTopRoutes(routesData || []);
      const driverPerformance = this.processDriverPerformance(driverPerformanceData || []);

      return {
        revenueByDay,
        bookingsByHour,
        topRoutes,
        driverPerformance,
        userMetrics: {
          newUsers: newUsersData?.length || 0,
          activeUsers: activeUsersData?.length || 0,
          retentionRate: 0.85 // Calcular real basado en datos
        }
      };
    } catch (error) {
      console.error('Error fetching analytics data:', error);
      throw error;
    }
  }

  async updateBookingStatus(bookingId: string, status: string): Promise<void> {
    try {
      const { error } = await this.supabase
        .from('bookings')
        .update({ 
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', bookingId);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating booking status:', error);
      throw error;
    }
  }

  async updateDriverStatus(driverId: string, status: string, isActive?: boolean): Promise<void> {
    try {
      const updates: any = { 
        status,
        updated_at: new Date().toISOString()
      };

      if (isActive !== undefined) {
        updates.is_active = isActive;
      }

      const { error } = await this.supabase
        .from('drivers')
        .update(updates)
        .eq('id', driverId);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating driver status:', error);
      throw error;
    }
  }

  async updateUserStatus(userId: string, status: string): Promise<void> {
    try {
      const { error } = await this.supabase
        .from('user_profiles')
        .update({ 
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating user status:', error);
      throw error;
    }
  }

  // Promotion Management
  async getPromotions(filters: any = {}): Promise<any> {
    let query = this.supabase
      .from('promotions')
      .select('*')
      .order('created_at', { ascending: false });

    if (filters.status) {
      query = query.eq('status', filters.status);
    }

    if (filters.type) {
      query = query.eq('type', filters.type);
    }

    if (filters.code) {
      query = query.ilike('code', `%${filters.code}%`);
    }

    if (filters.startDate) {
      query = query.gte('created_at', filters.startDate);
    }

    if (filters.endDate) {
      query = query.lte('created_at', filters.endDate);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching promotions:', error);
      throw error;
    }

    return {
      promotions: data || [],
      total: data?.length || 0
    };
  }

  async getPromotionStats(): Promise<any> {
    const { data: allPromotions, error: promotionsError } = await this.supabase
      .from('promotions')
      .select('*');

    if (promotionsError) {
      console.error('Error fetching promotion stats:', promotionsError);
      throw promotionsError;
    }

    const now = new Date();
    const activePromotions = allPromotions?.filter(p => 
      new Date(p.start_date) <= now && 
      new Date(p.end_date) >= now && 
      p.status === 'active'
    ) || [];

    const expiredPromotions = allPromotions?.filter(p => 
      new Date(p.end_date) < now
    ) || [];

    const scheduledPromotions = allPromotions?.filter(p => 
      new Date(p.start_date) > now
    ) || [];

    // Calculate usage stats
    const totalUsage = allPromotions?.reduce((sum, p) => sum + (p.usage_count || 0), 0) || 0;
    const totalDiscountAmount = allPromotions?.reduce((sum, p) => sum + (p.total_discount_amount || 0), 0) || 0;

    return {
      totalPromotions: allPromotions?.length || 0,
      activePromotions: activePromotions.length,
      expiredPromotions: expiredPromotions.length,
      scheduledPromotions: scheduledPromotions.length,
      totalUsage,
      totalDiscountAmount,
      averageUsagePerPromotion: allPromotions?.length ? totalUsage / allPromotions.length : 0
    };
  }

  async createPromotion(promotionData: any): Promise<any> {
    const { data, error } = await this.supabase
      .from('promotions')
      .insert([{
        code: promotionData.code,
        type: promotionData.type,
        value: promotionData.value,
        description: promotionData.description,
        start_date: promotionData.startDate,
        end_date: promotionData.endDate,
        usage_limit: promotionData.usageLimit,
        minimum_amount: promotionData.minimumAmount,
        maximum_discount: promotionData.maximumDiscount,
        status: promotionData.status || 'active',
        created_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating promotion:', error);
      throw error;
    }

    return data;
  }

  async updatePromotion(promotionId: string, promotionData: any): Promise<any> {
    const updateData: any = {};

    if (promotionData.code) updateData.code = promotionData.code;
    if (promotionData.type) updateData.type = promotionData.type;
    if (promotionData.value !== undefined) updateData.value = promotionData.value;
    if (promotionData.description) updateData.description = promotionData.description;
    if (promotionData.startDate) updateData.start_date = promotionData.startDate;
    if (promotionData.endDate) updateData.end_date = promotionData.endDate;
    if (promotionData.usageLimit !== undefined) updateData.usage_limit = promotionData.usageLimit;
    if (promotionData.minimumAmount !== undefined) updateData.minimum_amount = promotionData.minimumAmount;
    if (promotionData.maximumDiscount !== undefined) updateData.maximum_discount = promotionData.maximumDiscount;
    if (promotionData.status) updateData.status = promotionData.status;

    updateData.updated_at = new Date().toISOString();

    const { data, error } = await this.supabase
      .from('promotions')
      .update(updateData)
      .eq('id', promotionId)
      .select()
      .single();

    if (error) {
      console.error('Error updating promotion:', error);
      throw error;
    }

    return data;
  }

  async deletePromotion(promotionId: string): Promise<void> {
    const { error } = await this.supabase
      .from('promotions')
      .delete()
      .eq('id', promotionId);

    if (error) {
      console.error('Error deleting promotion:', error);
      throw error;
    }
  }

  async exportPromotions(filters: any = {}): Promise<any> {
    const promotionsData = await this.getPromotions(filters);
    
    // Format data for export
    const exportData = promotionsData.promotions.map((promotion: any) => ({
      'Código': promotion.code,
      'Tipo': promotion.type === 'percentage' ? 'Porcentaje' : 'Monto fijo',
      'Valor': promotion.value,
      'Descripción': promotion.description,
      'Fecha inicio': new Date(promotion.start_date).toLocaleDateString(),
      'Fecha fin': new Date(promotion.end_date).toLocaleDateString(),
      'Límite uso': promotion.usage_limit || 'Sin límite',
      'Usos actuales': promotion.usage_count || 0,
      'Monto mínimo': promotion.minimum_amount || 0,
      'Descuento máximo': promotion.maximum_discount || 'Sin límite',
      'Estado': promotion.status,
      'Descuento total': promotion.total_discount_amount || 0,
      'Creado': new Date(promotion.created_at).toLocaleDateString()
    }));

    return {
      data: exportData,
      filename: `promociones_${new Date().toISOString().split('T')[0]}.csv`
    };
  }

  // Support System Methods
  async getSupportTickets(filters: any = {}): Promise<any> {
    let query = this.supabase
      .from('support_tickets')
      .select(`
        *,
        user:user_id(id, email, full_name),
        assigned_admin:assigned_to(id, email, full_name)
      `)
      .order('created_at', { ascending: false });

    if (filters.status) {
      query = query.eq('status', filters.status);
    }

    if (filters.priority) {
      query = query.eq('priority', filters.priority);
    }

    if (filters.category) {
      query = query.eq('category', filters.category);
    }

    if (filters.assignedTo) {
      query = query.eq('assigned_to', filters.assignedTo);
    }

    if (filters.startDate) {
      query = query.gte('created_at', filters.startDate);
    }

    if (filters.endDate) {
      query = query.lte('created_at', filters.endDate);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching support tickets:', error);
      throw error;
    }

    return {
      tickets: data || [],
      total: data?.length || 0
    };
  }

  async getSupportTicketStats(): Promise<any> {
    const { data: allTickets, error } = await this.supabase
      .from('support_tickets')
      .select('*');

    if (error) {
      console.error('Error fetching support ticket stats:', error);
      throw error;
    }

    const tickets = allTickets || [];
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const openTickets = tickets.filter(t => ['open', 'in_progress'].includes(t.status));
    const closedTickets = tickets.filter(t => t.status === 'closed');
    const todayTickets = tickets.filter(t => new Date(t.created_at) >= todayStart);

    // Average response time calculation
    const respondedTickets = tickets.filter(t => t.first_response_at);
    const avgResponseTime = respondedTickets.length > 0
      ? respondedTickets.reduce((sum, t) => {
          const responseTime = new Date(t.first_response_at).getTime() - new Date(t.created_at).getTime();
          return sum + responseTime;
        }, 0) / respondedTickets.length
      : 0;

    // Priority distribution
    const priorityStats = {
      low: tickets.filter(t => t.priority === 'low').length,
      medium: tickets.filter(t => t.priority === 'medium').length,
      high: tickets.filter(t => t.priority === 'high').length,
      urgent: tickets.filter(t => t.priority === 'urgent').length
    };

    return {
      totalTickets: tickets.length,
      openTickets: openTickets.length,
      closedTickets: closedTickets.length,
      todayTickets: todayTickets.length,
      avgResponseTimeHours: Math.round(avgResponseTime / (1000 * 60 * 60)),
      priorityStats
    };
  }

  async getAdminUsers(): Promise<any[]> {
    const { data, error } = await this.supabase
      .from('user_profiles')
      .select('id, email, full_name')
      .eq('role', 'admin')
      .eq('is_active', true);

    if (error) {
      console.error('Error fetching admin users:', error);
      throw error;
    }

    return data || [];
  }

  async getTicketMessages(ticketId: string): Promise<any[]> {
    const { data, error } = await this.supabase
      .from('support_messages')
      .select(`
        *,
        sender:sender_id(id, email, full_name, role)
      `)
      .eq('ticket_id', ticketId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching ticket messages:', error);
      throw error;
    }

    return data || [];
  }

  async sendTicketReply(ticketId: string, message: string, isInternal: boolean = false): Promise<any> {
    const { data: messageData, error: messageError } = await this.supabase
      .from('support_messages')
      .insert([{
        ticket_id: ticketId,
        sender_id: (await this.supabase.auth.getUser()).data.user?.id,
        message,
        is_internal: isInternal,
        created_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (messageError) {
      console.error('Error sending ticket reply:', messageError);
      throw messageError;
    }

    // Update ticket status if it's the first response
    const { data: ticket } = await this.supabase
      .from('support_tickets')
      .select('first_response_at, status')
      .eq('id', ticketId)
      .single();

    if (ticket && !ticket.first_response_at && !isInternal) {
      await this.supabase
        .from('support_tickets')
        .update({
          first_response_at: new Date().toISOString(),
          status: 'in_progress'
        })
        .eq('id', ticketId);
    }

    return messageData;
  }

  async updateTicketStatus(ticketId: string, status: string): Promise<any> {
    const updateData: any = {
      status,
      updated_at: new Date().toISOString()
    };

    if (status === 'closed') {
      updateData.resolved_at = new Date().toISOString();
    }

    const { data, error } = await this.supabase
      .from('support_tickets')
      .update(updateData)
      .eq('id', ticketId)
      .select()
      .single();

    if (error) {
      console.error('Error updating ticket status:', error);
      throw error;
    }

    return data;
  }

  async assignTicket(ticketId: string, adminId: string | null): Promise<any> {
    const { data, error } = await this.supabase
      .from('support_tickets')
      .update({
        assigned_to: adminId,
        updated_at: new Date().toISOString()
      })
      .eq('id', ticketId)
      .select()
      .single();

    if (error) {
      console.error('Error assigning ticket:', error);
      throw error;
    }

    return data;
  }

  async exportSupportTickets(filters: any = {}): Promise<any> {
    const ticketsData = await this.getSupportTickets(filters);
    
    // Format data for export
    const exportData = ticketsData.tickets.map((ticket: any) => ({
      'ID': ticket.id,
      'Usuario': ticket.user?.full_name || ticket.user?.email || 'Desconocido',
      'Email': ticket.user?.email || '',
      'Asunto': ticket.subject,
      'Categoría': ticket.category,
      'Prioridad': ticket.priority,
      'Estado': ticket.status,
      'Asignado a': ticket.assigned_admin?.full_name || 'Sin asignar',
      'Creado': new Date(ticket.created_at).toLocaleDateString(),
      'Primera respuesta': ticket.first_response_at ? new Date(ticket.first_response_at).toLocaleDateString() : 'Pendiente',
      'Resuelto': ticket.resolved_at ? new Date(ticket.resolved_at).toLocaleDateString() : 'Pendiente'
    }));

    return {
      data: exportData,
      filename: `tickets_soporte_${new Date().toISOString().split('T')[0]}.csv`
    };
  }

  // Payment Management Methods
  async getPayments(filters: any = {}): Promise<any> {
    let query = this.supabase
      .from('payments')
      .select(`
        *,
        booking:booking_id(id, pickup_location, dropoff_location),
        user:user_id(id, email, full_name)
      `)
      .order('created_at', { ascending: false });

    if (filters.status) {
      query = query.eq('status', filters.status);
    }

    if (filters.provider) {
      query = query.eq('provider', filters.provider);
    }

    if (filters.startDate) {
      query = query.gte('created_at', filters.startDate);
    }

    if (filters.endDate) {
      query = query.lte('created_at', filters.endDate);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching payments:', error);
      throw error;
    }

    return {
      payments: data || [],
      total: data?.length || 0
    };
  }

  async getPaymentStats(): Promise<any> {
    const { data: allPayments, error } = await this.supabase
      .from('payments')
      .select('*');

    if (error) {
      console.error('Error fetching payment stats:', error);
      throw error;
    }

    const payments = allPayments || [];
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const completedPayments = payments.filter(p => p.status === 'completed');
    const todayPayments = payments.filter(p => new Date(p.created_at) >= todayStart);
    const failedPayments = payments.filter(p => p.status === 'failed');

    const totalRevenue = completedPayments.reduce((sum, p) => sum + (p.amount || 0), 0);
    const todayRevenue = todayPayments
      .filter(p => p.status === 'completed')
      .reduce((sum, p) => sum + (p.amount || 0), 0);

    // Provider breakdown
    const providerStats = {
      stripe: payments.filter(p => p.provider === 'stripe').length,
      transbank: payments.filter(p => p.provider === 'transbank').length,
      mercadopago: payments.filter(p => p.provider === 'mercadopago').length
    };

    return {
      totalPayments: payments.length,
      completedPayments: completedPayments.length,
      failedPayments: failedPayments.length,
      pendingPayments: payments.filter(p => p.status === 'pending').length,
      totalRevenue,
      todayRevenue,
      avgTransactionValue: completedPayments.length > 0 ? totalRevenue / completedPayments.length : 0,
      providerStats
    };
  }

  async exportPayments(filters: any = {}): Promise<any> {
    const paymentsData = await this.getPayments(filters);
    
    // Format data for export
    const exportData = paymentsData.payments.map((payment: any) => ({
      'ID': payment.id,
      'Usuario': payment.user?.full_name || payment.user?.email || 'Desconocido',
      'Email': payment.user?.email || '',
      'Reserva': payment.booking?.id || '',
      'Origen': payment.booking?.pickup_location || '',
      'Destino': payment.booking?.dropoff_location || '',
      'Monto': payment.amount,
      'Proveedor': payment.provider,
      'Estado': payment.status,
      'ID Transacción': payment.transaction_id || '',
      'Método': payment.payment_method || '',
      'Creado': new Date(payment.created_at).toLocaleDateString(),
      'Procesado': payment.processed_at ? new Date(payment.processed_at).toLocaleDateString() : 'Pendiente'
    }));

    return {
      data: exportData,
      filename: `pagos_${new Date().toISOString().split('T')[0]}.csv`
    };
  }

  private processRevenueByDay(data: any[]): Array<{ date: string; amount: number }> {
    const dailyRevenue = new Map();
    
    data.forEach(payment => {
      const date = payment.created_at.split('T')[0];
      const current = dailyRevenue.get(date) || 0;
      dailyRevenue.set(date, current + payment.amount);
    });

    return Array.from(dailyRevenue.entries()).map(([date, amount]) => ({
      date,
      amount
    }));
  }

  private processBookingsByHour(data: any[]): Array<{ hour: number; count: number }> {
    const hourlyBookings = new Array(24).fill(0);
    
    data.forEach(booking => {
      const hour = new Date(booking.created_at).getHours();
      hourlyBookings[hour]++;
    });

    return hourlyBookings.map((count, hour) => ({ hour, count }));
  }

  private processTopRoutes(data: any[]): Array<{ route: string; count: number; revenue: number }> {
    const routeStats = new Map();
    
    data.forEach(booking => {
      const route = `${booking.pickup_location} → ${booking.dropoff_location}`;
      const current = routeStats.get(route) || { count: 0, revenue: 0 };
      routeStats.set(route, {
        count: current.count + 1,
        revenue: current.revenue + booking.total_amount
      });
    });

    return Array.from(routeStats.entries())
      .map(([route, stats]) => ({ route, ...stats }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }

  private processDriverPerformance(data: any[]): Array<{ driverId: string; name: string; trips: number; rating: number; earnings: number }> {
    return data.map(driver => {
      const completedBookings = driver.bookings?.filter((b: any) => b.status === 'completed') || [];
      const earnings = completedBookings.reduce((sum: number, b: any) => sum + b.total_amount, 0);
      const avgRating = completedBookings.length > 0 
        ? completedBookings.reduce((sum: number, b: any) => sum + (b.rating || 0), 0) / completedBookings.length
        : 0;

      return {
        driverId: driver.id,
        name: driver.name,
        trips: completedBookings.length,
        rating: avgRating,
        earnings
      };
    }).sort((a, b) => b.earnings - a.earnings);
  }
}
