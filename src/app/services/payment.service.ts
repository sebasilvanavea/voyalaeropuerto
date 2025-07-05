import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { loadStripe, Stripe, StripeElements, StripeCardElement } from '@stripe/stripe-js';
import { SupabaseClient, createClient } from '@supabase/supabase-js';

export interface PaymentMethod {
  id: string;
  type: 'credit_card' | 'debit_card' | 'cash' | 'transfer';
  provider: 'stripe' | 'transbank' | 'mercadopago';
  last4?: string;
  brand?: string;
  expiryMonth?: number;
  expiryYear?: number;
}

export interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  client_secret?: string;
  metadata?: Record<string, any>;
}

export interface TransbankResponse {
  token: string;
  url: string;
}

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private stripe: Stripe | null = null;
  private elements: StripeElements | null = null;
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
    this.initializeStripe();
  }

  private async initializeStripe(): Promise<void> {
    if (environment.stripePublishableKey) {
      this.stripe = await loadStripe(environment.stripePublishableKey);
    }
  }

  // ===============================================
  // STRIPE INTEGRATION
  // ===============================================

  async createStripePaymentIntent(
    amount: number, 
    currency: string = 'clp',
    metadata: Record<string, any> = {}
  ): Promise<PaymentIntent> {
    const response = await fetch(`${environment.apiUrl}/payments/stripe/create-intent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.getAuthToken()}`
      },
      body: JSON.stringify({
        amount: Math.round(amount * 100), // Stripe uses cents
        currency: currency.toLowerCase(),
        metadata
      })
    });

    if (!response.ok) {
      throw new Error('Failed to create payment intent');
    }

    const data = await response.json();
    return {
      id: data.id,
      amount: data.amount / 100,
      currency: data.currency,
      status: 'pending',
      client_secret: data.client_secret,
      metadata: data.metadata
    };
  }

  async confirmStripePayment(
    clientSecret: string,
    cardElement: StripeCardElement,
    billingDetails: any
  ): Promise<{ success: boolean; error?: string; paymentIntent?: any }> {
    if (!this.stripe) {
      throw new Error('Stripe not initialized');
    }

    const { error, paymentIntent } = await this.stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
        billing_details: billingDetails
      }
    });

    if (error) {
      return { success: false, error: error.message };
    }

    if (paymentIntent?.status === 'succeeded') {
      return { success: true, paymentIntent };
    }

    return { success: false, error: 'Payment not completed' };
  }

  createStripeCardElement(): StripeCardElement | null {
    if (!this.stripe) return null;

    this.elements = this.stripe.elements({
      appearance: {
        theme: 'stripe',
        variables: {
          colorPrimary: '#3b82f6',
          colorBackground: '#ffffff',
          colorText: '#1f2937',
          colorDanger: '#ef4444',
          fontFamily: 'system-ui, sans-serif',
          spacingUnit: '4px',
          borderRadius: '8px'
        }
      }
    });

    return this.elements.create('card', {
      style: {
        base: {
          fontSize: '16px',
          color: '#424770',
          '::placeholder': {
            color: '#aab7c4'
          }
        },
        invalid: {
          color: '#9e2146'
        }
      },
      hidePostalCode: true
    });
  }

  // ===============================================
  // TRANSBANK INTEGRATION (Chilean Payment Gateway)
  // ===============================================

  async createTransbankTransaction(
    amount: number,
    orderId: string,
    returnUrl: string
  ): Promise<TransbankResponse> {
    const response = await fetch(`${environment.apiUrl}/payments/transbank/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.getAuthToken()}`
      },
      body: JSON.stringify({
        amount: Math.round(amount),
        buy_order: orderId,
        session_id: this.generateSessionId(),
        return_url: returnUrl
      })
    });

    if (!response.ok) {
      throw new Error('Failed to create Transbank transaction');
    }

    return await response.json();
  }

  async confirmTransbankTransaction(token: string): Promise<any> {
    const response = await fetch(`${environment.apiUrl}/payments/transbank/confirm`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.getAuthToken()}`
      },
      body: JSON.stringify({ token })
    });

    if (!response.ok) {
      throw new Error('Failed to confirm Transbank transaction');
    }

    return await response.json();
  }

  // ===============================================
  // MERCADO PAGO INTEGRATION
  // ===============================================

  async createMercadoPagoPreference(
    amount: number,
    description: string,
    metadata: Record<string, any> = {}
  ): Promise<{ id: string; init_point: string }> {
    const response = await fetch(`${environment.apiUrl}/payments/mercadopago/create-preference`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.getAuthToken()}`
      },
      body: JSON.stringify({
        items: [{
          title: description,
          quantity: 1,
          unit_price: amount,
          currency_id: 'CLP'
        }],
        back_urls: {
          success: `${environment.appUrl}/payment/success`,
          failure: `${environment.appUrl}/payment/failure`,
          pending: `${environment.appUrl}/payment/pending`
        },
        auto_return: 'approved',
        metadata
      })
    });

    if (!response.ok) {
      throw new Error('Failed to create MercadoPago preference');
    }

    return await response.json();
  }

  // ===============================================
  // PAYMENT PROCESSING
  // ===============================================

  async processPayment(
    bookingId: string,
    amount: number,
    paymentMethodId: string,
    paymentData: any
  ): Promise<{ success: boolean; payment?: any; error?: string }> {
    try {
      const response = await fetch(`${environment.apiUrl}/payments/process`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`
        },
        body: JSON.stringify({
          booking_id: bookingId,
          amount,
          payment_method_id: paymentMethodId,
          payment_data: paymentData
        })
      });

      if (!response.ok) {
        const error = await response.json();
        return { success: false, error: error.message };
      }

      const payment = await response.json();
      return { success: true, payment };

    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Payment processing failed' 
      };
    }
  }

  async refundPayment(
    paymentId: string,
    amount?: number,
    reason?: string
  ): Promise<{ success: boolean; refund?: any; error?: string }> {
    try {
      const response = await fetch(`${environment.apiUrl}/payments/${paymentId}/refund`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`
        },
        body: JSON.stringify({
          amount,
          reason
        })
      });

      if (!response.ok) {
        const error = await response.json();
        return { success: false, error: error.message };
      }

      const refund = await response.json();
      return { success: true, refund };

    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Refund processing failed' 
      };
    }
  }

  // Refund Processing
  async processRefund(paymentId: string, amount?: number): Promise<any> {
    try {
      const { data: payment } = await this.supabase
        .from('payments')
        .select('*')
        .eq('id', paymentId)
        .single();

      if (!payment) {
        throw new Error('Payment not found');
      }

      const refundAmount = amount || payment.amount;

      // Process refund with the payment provider
      let refundResult;
      switch (payment.provider) {
        case 'stripe':
          refundResult = await this.processStripeRefund(payment.transaction_id, refundAmount);
          break;
        case 'transbank':
          refundResult = await this.processTransbankRefund(payment.transaction_id, refundAmount);
          break;
        case 'mercadopago':
          refundResult = await this.processMercadoPagoRefund(payment.transaction_id, refundAmount);
          break;
        default:
          throw new Error('Unsupported payment provider for refunds');
      }

      // Update payment status
      await this.supabase
        .from('payments')
        .update({
          status: 'refunded',
          refund_amount: refundAmount,
          refund_id: refundResult.refund_id,
          refunded_at: new Date().toISOString()
        })
        .eq('id', paymentId);

      return refundResult;
    } catch (error) {
      console.error('Error processing refund:', error);
      throw error;
    }
  }

  async cancelPayment(paymentId: string): Promise<any> {
    try {
      const { data: payment } = await this.supabase
        .from('payments')
        .select('*')
        .eq('id', paymentId)
        .single();

      if (!payment) {
        throw new Error('Payment not found');
      }

      if (payment.status !== 'pending') {
        throw new Error('Only pending payments can be cancelled');
      }

      // Update payment status
      await this.supabase
        .from('payments')
        .update({
          status: 'cancelled',
          cancelled_at: new Date().toISOString()
        })
        .eq('id', paymentId);

      return { success: true };
    } catch (error) {
      console.error('Error cancelling payment:', error);
      throw error;
    }
  }

  private async processStripeRefund(transactionId: string, amount: number): Promise<any> {
    const response = await fetch(`${environment.apiUrl}/payments/stripe/refund`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        charge: transactionId,
        amount: amount * 100 // Convert to cents
      })
    });

    if (!response.ok) {
      throw new Error('Failed to process Stripe refund');
    }

    return await response.json();
  }

  private async processTransbankRefund(transactionId: string, amount: number): Promise<any> {
    const response = await fetch(`${environment.apiUrl}/payments/transbank/refund`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token: transactionId,
        amount
      })
    });

    if (!response.ok) {
      throw new Error('Failed to process Transbank refund');
    }

    return await response.json();
  }

  private async processMercadoPagoRefund(transactionId: string, amount: number): Promise<any> {
    const response = await fetch(`${environment.apiUrl}/payments/mercadopago/refund`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        payment_id: transactionId,
        amount
      })
    });

    if (!response.ok) {
      throw new Error('Failed to process MercadoPago refund');
    }

    return await response.json();
  }

  // ===============================================
  // PAYMENT METHODS MANAGEMENT
  // ===============================================

  async savePaymentMethod(
    paymentMethodData: any,
    isDefault: boolean = false
  ): Promise<PaymentMethod> {
    const response = await fetch(`${environment.apiUrl}/payment-methods`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.getAuthToken()}`
      },
      body: JSON.stringify({
        ...paymentMethodData,
        is_default: isDefault
      })
    });

    if (!response.ok) {
      throw new Error('Failed to save payment method');
    }

    return await response.json();
  }

  async getUserPaymentMethods(): Promise<PaymentMethod[]> {
    const response = await fetch(`${environment.apiUrl}/payment-methods`, {
      headers: {
        'Authorization': `Bearer ${this.getAuthToken()}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch payment methods');
    }

    return await response.json();
  }

  async deletePaymentMethod(paymentMethodId: string): Promise<void> {
    const response = await fetch(`${environment.apiUrl}/payment-methods/${paymentMethodId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${this.getAuthToken()}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to delete payment method');
    }
  }

  // ===============================================
  // PAYMENT ANALYTICS
  // ===============================================

  async getPaymentAnalytics(
    startDate: string,
    endDate: string
  ): Promise<{
    totalRevenue: number;
    totalTransactions: number;
    averageTransactionAmount: number;
    paymentMethodBreakdown: Record<string, number>;
    refundRate: number;
  }> {
    const response = await fetch(
      `${environment.apiUrl}/payments/analytics?start_date=${startDate}&end_date=${endDate}`,
      {
        headers: {
          'Authorization': `Bearer ${this.getAuthToken()}`
        }
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch payment analytics');
    }

    return await response.json();
  }

  // ===============================================
  // PROMOCODES AND DISCOUNTS
  // ===============================================

  async validatePromoCode(
    code: string,
    bookingAmount: number
  ): Promise<{
    valid: boolean;
    discount?: {
      type: 'percentage' | 'fixed_amount';
      value: number;
      maxDiscount?: number;
    };
    error?: string;
  }> {
    const response = await fetch(`${environment.apiUrl}/promotions/validate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.getAuthToken()}`
      },
      body: JSON.stringify({
        code,
        amount: bookingAmount
      })
    });

    if (!response.ok) {
      const error = await response.json();
      return { valid: false, error: error.message };
    }

    const promotion = await response.json();
    return {
      valid: true,
      discount: {
        type: promotion.discount_type,
        value: promotion.discount_value,
        maxDiscount: promotion.max_discount_amount
      }
    };
  }

  calculateDiscount(
    amount: number,
    discountType: 'percentage' | 'fixed_amount',
    discountValue: number,
    maxDiscount?: number
  ): number {
    let discount = 0;

    if (discountType === 'percentage') {
      discount = (amount * discountValue) / 100;
      if (maxDiscount && discount > maxDiscount) {
        discount = maxDiscount;
      }
    } else {
      discount = Math.min(discountValue, amount);
    }

    return Math.round(discount);
  }

  // ===============================================
  // UTILITY METHODS
  // ===============================================

  formatCurrency(amount: number, currency: string = 'CLP'): string {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: currency.toUpperCase()
    }).format(amount);
  }
  getPaymentMethodIcon(brand: string): string {
    const icons: { [key: string]: string } = {
      'visa': '💳',
      'mastercard': '💳',
      'amex': '💳',
      'discover': '💳',
      'diners': '💳',
      'jcb': '💳',
      'unionpay': '💳',
      'unknown': '💳'
    };
    return icons[brand.toLowerCase()] || icons['unknown'];
  }

  private getAuthToken(): string {
    // Obtener token de autenticación del almacenamiento local o servicio de auth
    return localStorage.getItem('supabase.auth.token') || '';
  }

  private generateSessionId(): string {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
  }

  // ===============================================
  // SUBSCRIPTION MANAGEMENT (Future feature)
  // ===============================================

  async createSubscription(
    planId: string,
    paymentMethodId: string
  ): Promise<{ success: boolean; subscription?: any; error?: string }> {
    try {
      const response = await fetch(`${environment.apiUrl}/subscriptions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`
        },
        body: JSON.stringify({
          plan_id: planId,
          payment_method_id: paymentMethodId
        })
      });

      if (!response.ok) {
        const error = await response.json();
        return { success: false, error: error.message };
      }

      const subscription = await response.json();
      return { success: true, subscription };

    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Subscription creation failed' 
      };
    }
  }

  async cancelSubscription(subscriptionId: string): Promise<void> {
    const response = await fetch(`${environment.apiUrl}/subscriptions/${subscriptionId}/cancel`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.getAuthToken()}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to cancel subscription');
    }
  }
}
