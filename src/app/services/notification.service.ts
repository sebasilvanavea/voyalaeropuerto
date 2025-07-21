import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage, MessagePayload } from 'firebase/messaging';
import { environment } from '../../environments/environment';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

export interface PushNotificationData {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  image?: string;
  data?: any;
  actions?: NotificationAction[];
  requireInteraction?: boolean;
  silent?: boolean;
  tag?: string;
  timestamp?: number;
}

export interface NotificationAction {
  action: string;
  title: string;
  icon?: string;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private messaging: any;
  private supabase: SupabaseClient;
  private isSupported = false;

  constructor() {
    this.supabase = createClient(
      environment.supabaseUrl,
      environment.supabaseKey
    );
    this.initializeFirebase();
  }

  private async initializeFirebase(): Promise<void> {
    try {
      if ('serviceWorker' in navigator && 'PushManager' in window) {
        this.isSupported = true;
        
        const app = initializeApp(environment.firebase);
        this.messaging = getMessaging(app);
        
        // Register service worker
        await this.registerServiceWorker();
        
        // Listen for foreground messages
        this.listenForMessages();
      }
    } catch (error) {
      console.error('Error initializing Firebase:', error);
    }
  }

  private async registerServiceWorker(): Promise<void> {
    try {
      const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
      console.log('Service Worker registered:', registration);
    } catch (error) {
      console.error('Service Worker registration failed:', error);
    }
  }

  async requestPermission(): Promise<boolean> {
    if (!this.isSupported) return false;

    try {
      const permission = await Notification.requestPermission();
      
      if (permission === 'granted') {
        const token = await this.getToken();
        if (token) {
          await this.saveTokenToDatabase(token);
          return true;
        }
      }
      
      return false;
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  }

  private async getToken(): Promise<string | null> {
    try {
      const token = await getToken(this.messaging, {
        vapidKey: environment.firebase.vapidKey
      });
      return token;
    } catch (error) {
      console.error('Error getting notification token:', error);
      return null;
    }
  }

  private async saveTokenToDatabase(token: string): Promise<void> {
    try {
      const { data: { user } } = await this.supabase.auth.getUser();
      
      if (user) {
        await this.supabase
          .from('user_tokens')
          .upsert({
            user_id: user.id,
            token: token,
            type: 'fcm',
            platform: this.getPlatform(),
            updated_at: new Date().toISOString()
          });
      }
    } catch (error) {
      console.error('Error saving token to database:', error);
    }
  }

  private getPlatform(): string {
    const userAgent = navigator.userAgent.toLowerCase();
    
    if (userAgent.includes('android')) return 'android';
    if (userAgent.includes('iphone') || userAgent.includes('ipad')) return 'ios';
    if (userAgent.includes('windows')) return 'windows';
    if (userAgent.includes('mac')) return 'mac';
    
    return 'web';
  }

  private listenForMessages(): void {
    if (!this.messaging) return;

    onMessage(this.messaging, (payload: MessagePayload) => {
      console.log('Foreground message received:', payload);
      
      if (payload.notification) {
        this.showNotification({
          title: payload.notification.title || '',
          body: payload.notification.body || '',
          icon: payload.notification.icon,
          image: payload.notification.image,
          data: payload.data
        });
      }
    });
  }

  async showNotification(data: PushNotificationData): Promise<void> {
    if (!('Notification' in window)) return;    const options: NotificationOptions = {
      body: data.body,
      icon: data.icon || '/assets/icons/icon-192x192.png',
      badge: data.badge || '/assets/icons/badge-72x72.png',
      data: data.data,
      requireInteraction: data.requireInteraction || false,
      silent: data.silent || false,
      tag: data.tag
    };

    try {
      await navigator.serviceWorker.ready;
      const registration = await navigator.serviceWorker.getRegistration();
      
      if (registration) {
        await registration.showNotification(data.title, options);
      } else {
        new Notification(data.title, options);
      }
    } catch (error) {
      console.error('Error showing notification:', error);
    }
  }

  // Trip-specific notifications
  async notifyDriverAssigned(driverName: string, driverPhone: string, eta: string): Promise<void> {
    await this.showNotification({
      title: '🚗 Conductor Asignado',
      body: `${driverName} será tu conductor. Llegará en ${eta}`,
      icon: '/assets/icons/driver-assigned.png',
      requireInteraction: true,
      actions: [
        { action: 'call', title: '📞 Llamar', icon: '/assets/icons/call.png' },
        { action: 'message', title: '💬 Mensaje', icon: '/assets/icons/message.png' }
      ],
      data: { type: 'driver_assigned', driverPhone, driverName }
    });
  }

  async notifyDriverArriving(): Promise<void> {
    await this.showNotification({
      title: '🚗 Conductor Llegando',
      body: 'Tu conductor está a 2 minutos de distancia',
      icon: '/assets/icons/driver-arriving.png',
      requireInteraction: true,
      actions: [
        { action: 'ready', title: '✅ Estoy Listo', icon: '/assets/icons/ready.png' }
      ],
      data: { type: 'driver_arriving' }
    });
  }

  async notifyDriverArrived(): Promise<void> {
    await this.showNotification({
      title: '📍 Conductor Ha Llegado',
      body: 'Tu conductor te está esperando en el punto de encuentro',
      icon: '/assets/icons/driver-arrived.png',
      requireInteraction: true,
      actions: [
        { action: 'locate', title: '📍 Ver Ubicación', icon: '/assets/icons/location.png' },
        { action: 'call', title: '📞 Llamar', icon: '/assets/icons/call.png' }
      ],
      data: { type: 'driver_arrived' }
    });
  }

  async notifyTripStarted(): Promise<void> {
    await this.showNotification({
      title: '🛣️ Viaje Iniciado',
      body: 'Tu viaje al aeropuerto ha comenzado. ¡Buen viaje!',
      icon: '/assets/icons/trip-started.png',
      data: { type: 'trip_started' }
    });
  }

  async notifyTripCompleted(fare: number): Promise<void> {
    await this.showNotification({
      title: '✅ Viaje Completado',
      body: `Has llegado a tu destino. Tarifa: $${fare.toLocaleString()}`,
      icon: '/assets/icons/trip-completed.png',
      requireInteraction: true,
      actions: [
        { action: 'rate', title: '⭐ Calificar', icon: '/assets/icons/star.png' },
        { action: 'receipt', title: '🧾 Recibo', icon: '/assets/icons/receipt.png' }
      ],
      data: { type: 'trip_completed', fare }
    });
  }

  async notifyPaymentProcessed(amount: number, method: string): Promise<void> {
    await this.showNotification({
      title: '💳 Pago Procesado',
      body: `Pago de $${amount.toLocaleString()} procesado exitosamente vía ${method}`,
      icon: '/assets/icons/payment-success.png',
      data: { type: 'payment_processed', amount, method }
    });
  }

  async notifyPromotion(title: string, description: string, discount: number): Promise<void> {
    await this.showNotification({
      title: `🎉 ${title}`,
      body: `${description} - ${discount}% de descuento`,
      icon: '/assets/icons/promotion.png',
      requireInteraction: true,
      actions: [
        { action: 'book', title: '🚗 Reservar Ahora', icon: '/assets/icons/book.png' }
      ],
      data: { type: 'promotion', discount, title, description }
    });
  }

  async notifyWeatherAlert(condition: string, recommendation: string): Promise<void> {
    await this.showNotification({
      title: `🌤️ Alerta Climática`,
      body: `${condition}. ${recommendation}`,
      icon: '/assets/icons/weather-alert.png',
      data: { type: 'weather_alert', condition, recommendation }
    });
  }

  async notifyFlightDelay(newTime: string, suggestion: string): Promise<void> {
    await this.showNotification({
      title: '✈️ Vuelo Retrasado',
      body: `Tu vuelo ahora sale a las ${newTime}. ${suggestion}`,
      icon: '/assets/icons/flight-delay.png',
      requireInteraction: true,
      actions: [
        { action: 'reschedule', title: '📅 Reprogramar', icon: '/assets/icons/reschedule.png' },
        { action: 'contact', title: '📞 Contactar', icon: '/assets/icons/contact.png' }
      ],
      data: { type: 'flight_delay', newTime, suggestion }
    });
  }

  // Admin notifications for drivers
  async notifyNewBooking(pickup: string, dropoff: string, fare: number): Promise<void> {
    await this.showNotification({
      title: '🚗 Nueva Reserva Disponible',
      body: `${pickup} → ${dropoff} | $${fare.toLocaleString()}`,
      icon: '/assets/icons/new-booking.png',
      requireInteraction: true,
      actions: [
        { action: 'accept', title: '✅ Aceptar', icon: '/assets/icons/accept.png' },
        { action: 'decline', title: '❌ Rechazar', icon: '/assets/icons/decline.png' }
      ],
      data: { type: 'new_booking', pickup, dropoff, fare }
    });
  }

  async notifyEarningsUpdate(dailyEarnings: number, weeklyEarnings: number): Promise<void> {
    await this.showNotification({
      title: '💰 Actualización de Ganancias',
      body: `Hoy: $${dailyEarnings.toLocaleString()} | Semana: $${weeklyEarnings.toLocaleString()}`,
      icon: '/assets/icons/earnings.png',
      data: { type: 'earnings_update', dailyEarnings, weeklyEarnings }
    });
  }

  // Utility methods
  async clearAllNotifications(): Promise<void> {
    try {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration) {
        const notifications = await registration.getNotifications();
        notifications.forEach(notification => notification.close());
      }
    } catch (error) {
      console.error('Error clearing notifications:', error);
    }
  }

  async getNotificationPermissionStatus(): Promise<NotificationPermission> {
    return Notification.permission;
  }

  isNotificationSupported(): boolean {
    return this.isSupported;
  }

  // Schedule notifications (requires service worker implementation)
  async scheduleNotification(data: PushNotificationData, delay: number): Promise<void> {
    // This would be handled by the service worker
    // Store in IndexedDB and process in service worker
    const scheduledNotification = {
      ...data,
      scheduledTime: Date.now() + delay,
      id: Date.now().toString()
    };

    // Store in IndexedDB for service worker to process
    await this.storeScheduledNotification(scheduledNotification);
  }

  private async storeScheduledNotification(notification: any): Promise<void> {
    // IndexedDB implementation for scheduled notifications
    // This would be used by the service worker
    if ('indexedDB' in window) {
      // Implementation for storing scheduled notifications
      console.log('Storing scheduled notification:', notification);
    }
  }
}
