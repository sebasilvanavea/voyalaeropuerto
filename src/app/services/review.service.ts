import { Injectable } from '@angular/core';
import { SupabaseClient, createClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Review {
  id: string;
  bookingId: string;
  userId: string;
  driverId: string;
  rating: number;
  comment?: string;
  isAnonymous: boolean;
  createdAt: Date;
  updatedAt: Date;
  // Información adicional para mostrar
  customerName?: string;
  driverName?: string;
  tripRoute?: string;
}

export interface ReviewSummary {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
}

export interface CreateReviewRequest {
  bookingId: string;
  rating: number;
  comment?: string;
  isAnonymous?: boolean;
  categories?: {
    driverBehavior: number;
    vehicleCondition: number;
    punctuality: number;
    communication: number;
    overallExperience: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private supabase: SupabaseClient;
  private reviewsSubject = new BehaviorSubject<Review[]>([]);
  public reviews$ = this.reviewsSubject.asObservable();

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
  }

  async createReview(reviewData: CreateReviewRequest): Promise<Review> {
    try {
      // Verificar que el usuario puede dejar una review para esta reserva
      const { data: booking, error: bookingError } = await this.supabase
        .from('bookings')
        .select('id, user_id, driver_id, pickup_location, dropoff_location, status')
        .eq('id', reviewData.bookingId)
        .eq('status', 'completed')
        .single();

      if (bookingError || !booking) {
        throw new Error('Reserva no encontrada o no completada');
      }

      // Verificar que no existe una review previa
      const { data: existingReview } = await this.supabase
        .from('reviews')
        .select('id')
        .eq('booking_id', reviewData.bookingId)
        .single();

      if (existingReview) {
        throw new Error('Ya existe una review para esta reserva');
      }

      // Crear la review
      const { data: review, error } = await this.supabase
        .from('reviews')
        .insert({
          booking_id: reviewData.bookingId,
          user_id: booking.user_id,
          driver_id: booking.driver_id,
          rating: reviewData.rating,
          comment: reviewData.comment || null,
          is_anonymous: reviewData.isAnonymous || false,
          categories: reviewData.categories || null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      // Actualizar el rating promedio del conductor
      await this.updateDriverRating(booking.driver_id);

      // Notificar al conductor sobre la nueva review
      await this.notifyDriverAboutReview(booking.driver_id, reviewData.rating, reviewData.comment);

      return {
        id: review.id,
        bookingId: review.booking_id,
        userId: review.user_id,
        driverId: review.driver_id,
        rating: review.rating,
        comment: review.comment,
        isAnonymous: review.is_anonymous,
        createdAt: new Date(review.created_at),
        updatedAt: new Date(review.updated_at),
        tripRoute: `${booking.pickup_location} → ${booking.dropoff_location}`
      };
    } catch (error) {
      console.error('Error creating review:', error);
      throw error;
    }
  }

  async getDriverReviews(driverId: string, page = 1, limit = 10): Promise<{ reviews: Review[]; total: number }> {
    try {
      const offset = (page - 1) * limit;

      const { data: reviews, error, count } = await this.supabase
        .from('reviews')
        .select(`
          *,
          user_profiles(name),
          drivers(name),
          bookings(pickup_location, dropoff_location)
        `, { count: 'exact' })
        .eq('driver_id', driverId)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw error;

      const formattedReviews: Review[] = reviews?.map(review => ({
        id: review.id,
        bookingId: review.booking_id,
        userId: review.user_id,
        driverId: review.driver_id,
        rating: review.rating,
        comment: review.comment,
        isAnonymous: review.is_anonymous,
        createdAt: new Date(review.created_at),
        updatedAt: new Date(review.updated_at),
        customerName: review.is_anonymous ? 'Usuario Anónimo' : review.user_profiles?.name,
        driverName: review.drivers?.name,
        tripRoute: `${review.bookings?.pickup_location} → ${review.bookings?.dropoff_location}`
      })) || [];

      return { reviews: formattedReviews, total: count || 0 };
    } catch (error) {
      console.error('Error fetching driver reviews:', error);
      throw error;
    }
  }

  async getUserReviews(userId: string, page = 1, limit = 10): Promise<{ reviews: Review[]; total: number }> {
    try {
      const offset = (page - 1) * limit;

      const { data: reviews, error, count } = await this.supabase
        .from('reviews')
        .select(`
          *,
          drivers(name),
          bookings(pickup_location, dropoff_location, pickup_datetime)
        `, { count: 'exact' })
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw error;

      const formattedReviews: Review[] = reviews?.map(review => ({
        id: review.id,
        bookingId: review.booking_id,
        userId: review.user_id,
        driverId: review.driver_id,
        rating: review.rating,
        comment: review.comment,
        isAnonymous: review.is_anonymous,
        createdAt: new Date(review.created_at),
        updatedAt: new Date(review.updated_at),
        driverName: review.drivers?.name,
        tripRoute: `${review.bookings?.pickup_location} → ${review.bookings?.dropoff_location}`
      })) || [];

      return { reviews: formattedReviews, total: count || 0 };
    } catch (error) {
      console.error('Error fetching user reviews:', error);
      throw error;
    }
  }

  async getDriverRatingSummary(driverId: string): Promise<ReviewSummary> {
    try {
      const { data: reviews, error } = await this.supabase
        .from('reviews')
        .select('rating')
        .eq('driver_id', driverId);

      if (error) throw error;

      if (!reviews || reviews.length === 0) {
        return {
          averageRating: 0,
          totalReviews: 0,
          ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
        };
      }

      const totalReviews = reviews.length;
      const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews;

      const ratingDistribution = reviews.reduce((dist, review) => {
        dist[review.rating as keyof typeof dist]++;
        return dist;
      }, { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 });

      return {
        averageRating: Math.round(averageRating * 100) / 100,
        totalReviews,
        ratingDistribution
      };
    } catch (error) {
      console.error('Error fetching driver rating summary:', error);
      throw error;
    }
  }

  async getPlatformReviews(page = 1, limit = 20, filters?: {
    rating?: number;
    dateFrom?: string;
    dateTo?: string;
  }): Promise<{ reviews: Review[]; total: number }> {
    try {
      const offset = (page - 1) * limit;
      let query = this.supabase
        .from('reviews')
        .select(`
          *,
          user_profiles(name),
          drivers(name),
          bookings(pickup_location, dropoff_location, pickup_datetime)
        `, { count: 'exact' });

      if (filters?.rating) {
        query = query.eq('rating', filters.rating);
      }

      if (filters?.dateFrom) {
        query = query.gte('created_at', filters.dateFrom);
      }

      if (filters?.dateTo) {
        query = query.lte('created_at', filters.dateTo);
      }

      const { data: reviews, error, count } = await query
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw error;

      const formattedReviews: Review[] = reviews?.map(review => ({
        id: review.id,
        bookingId: review.booking_id,
        userId: review.user_id,
        driverId: review.driver_id,
        rating: review.rating,
        comment: review.comment,
        isAnonymous: review.is_anonymous,
        createdAt: new Date(review.created_at),
        updatedAt: new Date(review.updated_at),
        customerName: review.is_anonymous ? 'Usuario Anónimo' : review.user_profiles?.name,
        driverName: review.drivers?.name,
        tripRoute: `${review.bookings?.pickup_location} → ${review.bookings?.dropoff_location}`
      })) || [];

      return { reviews: formattedReviews, total: count || 0 };
    } catch (error) {
      console.error('Error fetching platform reviews:', error);
      throw error;
    }
  }

  async getReviewsForBooking(bookingId: string): Promise<Review | null> {
    try {
      const { data: review, error } = await this.supabase
        .from('reviews')
        .select(`
          *,
          user_profiles(name),
          drivers(name),
          bookings(pickup_location, dropoff_location)
        `)
        .eq('booking_id', bookingId)
        .single();

      if (error || !review) return null;

      return {
        id: review.id,
        bookingId: review.booking_id,
        userId: review.user_id,
        driverId: review.driver_id,
        rating: review.rating,
        comment: review.comment,
        isAnonymous: review.is_anonymous,
        createdAt: new Date(review.created_at),
        updatedAt: new Date(review.updated_at),
        customerName: review.is_anonymous ? 'Usuario Anónimo' : review.user_profiles?.name,
        driverName: review.drivers?.name,
        tripRoute: `${review.bookings?.pickup_location} → ${review.bookings?.dropoff_location}`
      };
    } catch (error) {
      console.error('Error fetching review for booking:', error);
      return null;
    }
  }

  async updateReview(reviewId: string, updates: {
    rating?: number;
    comment?: string;
    isAnonymous?: boolean;
  }): Promise<Review> {
    try {
      const { data: review, error } = await this.supabase
        .from('reviews')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', reviewId)
        .select()
        .single();

      if (error) throw error;

      // Actualizar el rating promedio del conductor si cambió el rating
      if (updates.rating) {
        await this.updateDriverRating(review.driver_id);
      }

      return {
        id: review.id,
        bookingId: review.booking_id,
        userId: review.user_id,
        driverId: review.driver_id,
        rating: review.rating,
        comment: review.comment,
        isAnonymous: review.is_anonymous,
        createdAt: new Date(review.created_at),
        updatedAt: new Date(review.updated_at)
      };
    } catch (error) {
      console.error('Error updating review:', error);
      throw error;
    }
  }

  async deleteReview(reviewId: string): Promise<void> {
    try {
      // Obtener información de la review antes de eliminarla
      const { data: review } = await this.supabase
        .from('reviews')
        .select('driver_id')
        .eq('id', reviewId)
        .single();

      const { error } = await this.supabase
        .from('reviews')
        .delete()
        .eq('id', reviewId);

      if (error) throw error;

      // Actualizar el rating promedio del conductor
      if (review) {
        await this.updateDriverRating(review.driver_id);
      }
    } catch (error) {
      console.error('Error deleting review:', error);
      throw error;
    }
  }

  async flagReview(reviewId: string, reason: string, reportedBy: string): Promise<void> {
    try {
      const { error } = await this.supabase
        .from('review_flags')
        .insert({
          review_id: reviewId,
          reason,
          reported_by: reportedBy,
          created_at: new Date().toISOString()
        });

      if (error) throw error;

      // Notificar a los administradores sobre la denuncia
      await this.notifyAdminsAboutFlag(reviewId, reason);
    } catch (error) {
      console.error('Error flagging review:', error);
      throw error;
    }
  }

  private async updateDriverRating(driverId: string): Promise<void> {
    try {
      const summary = await this.getDriverRatingSummary(driverId);
      
      const { error } = await this.supabase
        .from('drivers')
        .update({
          rating: summary.averageRating,
          total_reviews: summary.totalReviews,
          updated_at: new Date().toISOString()
        })
        .eq('id', driverId);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating driver rating:', error);
    }
  }

  private async notifyDriverAboutReview(driverId: string, rating: number, comment?: string): Promise<void> {
    try {
      // Crear notificación para el conductor
      const { error } = await this.supabase
        .from('notifications')
        .insert({
          user_id: driverId,
          type: 'new_review',
          title: 'Nueva Calificación Recibida',
          message: `Has recibido una calificación de ${rating} estrellas${comment ? ' con comentario' : ''}`,
          data: { rating, comment },
          created_at: new Date().toISOString()
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error notifying driver about review:', error);
    }
  }

  private async notifyAdminsAboutFlag(reviewId: string, reason: string): Promise<void> {
    try {
      // Obtener lista de administradores
      const { data: admins } = await this.supabase
        .from('user_profiles')
        .select('id')
        .eq('role', 'admin');

      if (admins && admins.length > 0) {
        const notifications = admins.map(admin => ({
          user_id: admin.id,
          type: 'review_flagged',
          title: 'Review Denunciada',
          message: `Una review ha sido denunciada por: ${reason}`,
          data: { reviewId, reason },
          created_at: new Date().toISOString()
        }));

        const { error } = await this.supabase
          .from('notifications')
          .insert(notifications);

        if (error) throw error;
      }
    } catch (error) {
      console.error('Error notifying admins about flagged review:', error);
    }
  }

  // Métodos para análisis
  async getReviewsAnalytics(period: 'week' | 'month' | 'quarter' | 'year' = 'month'): Promise<{
    averageRating: number;
    totalReviews: number;
    ratingTrend: Array<{ date: string; rating: number; count: number }>;
    topDrivers: Array<{ driverId: string; driverName: string; rating: number; reviewCount: number }>;
    sentiment: { positive: number; neutral: number; negative: number };
  }> {
    try {
      const daysBack = {
        week: 7,
        month: 30,
        quarter: 90,
        year: 365
      }[period];

      const startDate = new Date(Date.now() - daysBack * 24 * 60 * 60 * 1000).toISOString();

      const { data: reviews, error } = await this.supabase
        .from('reviews')
        .select(`
          rating,
          comment,
          created_at,
          drivers(id, name)
        `)
        .gte('created_at', startDate);

      if (error) throw error;

      if (!reviews || reviews.length === 0) {
        return {
          averageRating: 0,
          totalReviews: 0,
          ratingTrend: [],
          topDrivers: [],
          sentiment: { positive: 0, neutral: 0, negative: 0 }
        };
      }

      const totalReviews = reviews.length;
      const averageRating = reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews;

      // Análisis de sentimiento básico
      const sentiment = reviews.reduce((acc, review) => {
        if (review.rating >= 4) acc.positive++;
        else if (review.rating >= 3) acc.neutral++;
        else acc.negative++;
        return acc;
      }, { positive: 0, neutral: 0, negative: 0 });      // Top conductores
      const driverStats = new Map();
      reviews.forEach(review => {
        const driver = review.drivers && review.drivers.length > 0 ? review.drivers[0] : null;
        const driverId = driver?.id;
        if (driverId) {
          const current = driverStats.get(driverId) || {
            driverId,
            driverName: driver.name,
            totalRating: 0,
            count: 0
          };
          current.totalRating += review.rating;
          current.count++;
          driverStats.set(driverId, current);
        }
      });

      const topDrivers = Array.from(driverStats.values())
        .map(stat => ({
          driverId: stat.driverId,
          driverName: stat.driverName,
          rating: stat.totalRating / stat.count,
          reviewCount: stat.count
        }))
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 10);

      return {
        averageRating: Math.round(averageRating * 100) / 100,
        totalReviews,
        ratingTrend: [], // TODO: Implementar trend por fechas
        topDrivers,
        sentiment
      };
    } catch (error) {
      console.error('Error fetching reviews analytics:', error);
      throw error;
    }
  }
}
