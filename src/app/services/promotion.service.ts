import { Injectable } from '@angular/core';
import { SupabaseClient, createClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';

export interface Promotion {
  id: string;
  code: string;
  name: string;
  description: string;
  type: 'percentage' | 'fixed_amount' | 'free_ride';
  discount_value: number;
  min_trip_amount?: number;
  max_discount_amount?: number;
  usage_limit: number;
  usage_count: number;
  user_limit: number;
  is_active: boolean;
  valid_from: string;
  valid_until: string;
  applicable_routes?: string[];
  applicable_vehicle_types?: string[];
  created_at: string;
  updated_at: string;
}

export interface PromotionUsage {
  id: string;
  promotion_id: string;
  user_id: string;
  booking_id: string;
  discount_amount: number;
  used_at: string;
}

export interface PromotionValidationResult {
  valid: boolean;
  message?: string;
  discount_amount?: number;
  final_amount?: number;
}

@Injectable({
  providedIn: 'root'
})
export class PromotionService {
  private supabase: SupabaseClient;
  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
  }

  async validatePromotion(
    code: string, 
    userId: string, 
    tripAmount: number, 
    vehicleType?: string, 
    route?: string
  ): Promise<PromotionValidationResult> {
    try {
      // Get promotion by code
      const { data: promotion, error } = await this.supabase
        .from('promotions')
        .select('*')
        .eq('code', code.toUpperCase())
        .eq('is_active', true)
        .single();

      if (error || !promotion) {
        return { valid: false, message: 'Código de promoción no válido' };
      }

      // Check if promotion is within valid date range
      const now = new Date();
      const validFrom = new Date(promotion.valid_from);
      const validUntil = new Date(promotion.valid_until);

      if (now < validFrom) {
        return { valid: false, message: 'Esta promoción aún no está disponible' };
      }

      if (now > validUntil) {
        return { valid: false, message: 'Esta promoción ha expirado' };
      }

      // Check usage limits
      if (promotion.usage_limit !== -1 && promotion.usage_count >= promotion.usage_limit) {
        return { valid: false, message: 'Esta promoción ha alcanzado su límite de uso' };
      }

      // Check user usage limit
      const { count: userUsageCount } = await this.supabase
        .from('promotion_usage')
        .select('*', { count: 'exact' })
        .eq('promotion_id', promotion.id)
        .eq('user_id', userId);

      if (userUsageCount && userUsageCount >= promotion.user_limit) {
        return { valid: false, message: 'Ya has usado esta promoción el máximo número de veces' };
      }

      // Check minimum trip amount
      if (promotion.min_trip_amount && tripAmount < promotion.min_trip_amount) {
        return { 
          valid: false, 
          message: `El monto mínimo para usar esta promoción es ${promotion.min_trip_amount.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })}` 
        };
      }

      // Check applicable vehicle types
      if (promotion.applicable_vehicle_types && promotion.applicable_vehicle_types.length > 0 && vehicleType) {
        if (!promotion.applicable_vehicle_types.includes(vehicleType)) {
          return { valid: false, message: 'Esta promoción no es válida para el tipo de vehículo seleccionado' };
        }
      }

      // Check applicable routes
      if (promotion.applicable_routes && promotion.applicable_routes.length > 0 && route) {
        if (!promotion.applicable_routes.includes(route)) {
          return { valid: false, message: 'Esta promoción no es válida para esta ruta' };
        }
      }

      // Calculate discount
      let discountAmount = 0;
      let finalAmount = tripAmount;

      switch (promotion.type) {
        case 'percentage':
          discountAmount = (tripAmount * promotion.discount_value) / 100;
          if (promotion.max_discount_amount && discountAmount > promotion.max_discount_amount) {
            discountAmount = promotion.max_discount_amount;
          }
          break;
        case 'fixed_amount':
          discountAmount = Math.min(promotion.discount_value, tripAmount);
          break;
        case 'free_ride':
          discountAmount = tripAmount;
          break;
      }

      finalAmount = Math.max(0, tripAmount - discountAmount);

      return {
        valid: true,
        message: `Promoción aplicada correctamente. Descuento: ${discountAmount.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })}`,
        discount_amount: discountAmount,
        final_amount: finalAmount
      };

    } catch (error) {
      console.error('Error validating promotion:', error);
      return { valid: false, message: 'Error al validar la promoción' };
    }
  }

  async applyPromotion(
    promotionCode: string,
    userId: string,
    bookingId: string,
    discountAmount: number
  ): Promise<void> {
    try {
      // Get promotion by code
      const { data: promotion } = await this.supabase
        .from('promotions')
        .select('id')
        .eq('code', promotionCode.toUpperCase())
        .single();

      if (!promotion) {
        throw new Error('Promotion not found');
      }

      // Record promotion usage
      const { error: usageError } = await this.supabase
        .from('promotion_usage')
        .insert({
          promotion_id: promotion.id,
          user_id: userId,
          booking_id: bookingId,
          discount_amount: discountAmount
        });

      if (usageError) throw usageError;

      // Update promotion usage count
      const { error: updateError } = await this.supabase
        .rpc('increment_promotion_usage', { promotion_id: promotion.id });

      if (updateError) throw updateError;

    } catch (error) {
      console.error('Error applying promotion:', error);
      throw error;
    }
  }

  async getActivePromotions(): Promise<Promotion[]> {
    try {
      const now = new Date().toISOString();
      
      const { data: promotions, error } = await this.supabase
        .from('promotions')
        .select('*')
        .eq('is_active', true)
        .lte('valid_from', now)
        .gte('valid_until', now)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return promotions || [];
    } catch (error) {
      console.error('Error getting active promotions:', error);
      return [];
    }
  }

  async getPromotionByCode(code: string): Promise<Promotion | null> {
    try {
      const { data: promotion, error } = await this.supabase
        .from('promotions')
        .select('*')
        .eq('code', code.toUpperCase())
        .single();

      if (error) throw error;

      return promotion;
    } catch (error) {
      console.error('Error getting promotion by code:', error);
      return null;
    }
  }

  async getUserPromotionUsage(userId: string, promotionId: string): Promise<number> {
    try {
      const { count } = await this.supabase
        .from('promotion_usage')
        .select('*', { count: 'exact' })
        .eq('user_id', userId)
        .eq('promotion_id', promotionId);

      return count || 0;
    } catch (error) {
      console.error('Error getting user promotion usage:', error);
      return 0;
    }
  }

  async getPromotionUsageHistory(userId: string): Promise<PromotionUsage[]> {
    try {
      const { data: usageHistory, error } = await this.supabase
        .from('promotion_usage')
        .select(`
          *,
          promotion:promotions(
            code,
            name,
            type,
            discount_value
          ),
          booking:bookings(
            pickup_location,
            dropoff_location,
            scheduled_date
          )
        `)
        .eq('user_id', userId)
        .order('used_at', { ascending: false });

      if (error) throw error;

      return usageHistory || [];
    } catch (error) {
      console.error('Error getting promotion usage history:', error);
      return [];
    }
  }

  // Admin functions
  async getAllPromotions(filters?: {
    status?: string;
    type?: string;
    search?: string;
    date_from?: string;
    date_to?: string;
    page?: number;
    limit?: number;
  }): Promise<{ data: Promotion[]; total: number }> {
    try {
      let query = this.supabase
        .from('promotions')
        .select('*', { count: 'exact' });

      // Apply filters
      if (filters?.status) {
        const now = new Date();
        switch (filters.status) {
          case 'active':
            query = query.eq('is_active', true).gte('valid_until', now.toISOString());
            break;
          case 'inactive':
            query = query.eq('is_active', false);
            break;
          case 'expired':
            query = query.lt('valid_until', now.toISOString());
            break;
        }
      }

      if (filters?.type) {
        query = query.eq('type', filters.type);
      }

      if (filters?.search) {
        query = query.or(`code.ilike.%${filters.search}%,name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
      }

      if (filters?.date_from) {
        query = query.gte('created_at', filters.date_from);
      }

      if (filters?.date_to) {
        query = query.lte('created_at', filters.date_to);
      }

      // Apply pagination
      const page = filters?.page || 1;
      const limit = filters?.limit || 20;
      const from = (page - 1) * limit;
      const to = from + limit - 1;

      const { data: promotions, error, count } = await query
        .range(from, to)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return {
        data: promotions || [],
        total: count || 0
      };
    } catch (error) {
      console.error('Error getting all promotions:', error);
      return { data: [], total: 0 };
    }
  }

  async createPromotion(promotionData: Partial<Promotion>): Promise<Promotion> {
    try {
      const { data: promotion, error } = await this.supabase
        .from('promotions')
        .insert([{
          ...promotionData,
          code: promotionData.code?.toUpperCase(),
          usage_count: 0
        }])
        .select()
        .single();

      if (error) throw error;

      return promotion;
    } catch (error) {
      console.error('Error creating promotion:', error);
      throw error;
    }
  }

  async updatePromotion(id: string, promotionData: Partial<Promotion>): Promise<Promotion> {
    try {
      const updateData = { ...promotionData };
      if (updateData.code) {
        updateData.code = updateData.code.toUpperCase();
      }

      const { data: promotion, error } = await this.supabase
        .from('promotions')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return promotion;
    } catch (error) {
      console.error('Error updating promotion:', error);
      throw error;
    }
  }

  async deletePromotion(id: string): Promise<void> {
    try {
      const { error } = await this.supabase
        .from('promotions')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting promotion:', error);
      throw error;
    }
  }

  async getPromotionStats(): Promise<any> {
    try {
      // Get total promotions
      const { count: total } = await this.supabase
        .from('promotions')
        .select('*', { count: 'exact' });

      // Get active promotions
      const now = new Date().toISOString();
      const { count: active } = await this.supabase
        .from('promotions')
        .select('*', { count: 'exact' })
        .eq('is_active', true)
        .gte('valid_until', now);

      // Get total usage
      const { count: totalUsage } = await this.supabase
        .from('promotion_usage')
        .select('*', { count: 'exact' });

      // Get total discount amount
      const { data: discountData } = await this.supabase
        .from('promotion_usage')
        .select('discount_amount');

      const totalDiscount = discountData?.reduce((sum, usage) => sum + usage.discount_amount, 0) || 0;

      return {
        total: total || 0,
        active: active || 0,
        totalUsage: totalUsage || 0,
        totalDiscount
      };
    } catch (error) {
      console.error('Error getting promotion stats:', error);
      return {
        total: 0,
        active: 0,
        totalUsage: 0,
        totalDiscount: 0
      };
    }
  }
}
