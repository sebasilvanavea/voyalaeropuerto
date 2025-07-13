import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface UINotification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  action?: {
    label: string;
    callback: () => void;
  };
  autoClose?: boolean;
  duration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class UINotificationService {
  private notificationsSubject = new BehaviorSubject<UINotification[]>([]);
  public notifications$ = this.notificationsSubject.asObservable();

  private generateId(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }

  showSuccess(title: string, message: string, autoClose: boolean = true, duration: number = 5000): void {
    this.show({
      type: 'success',
      title,
      message,
      autoClose,
      duration
    });
  }

  showError(title: string, message: string, autoClose: boolean = false): void {
    this.show({
      type: 'error',
      title,
      message,
      autoClose
    });
  }

  showWarning(title: string, message: string, autoClose: boolean = true, duration: number = 5000): void {
    this.show({
      type: 'warning',
      title,
      message,
      autoClose,
      duration
    });
  }

  showInfo(title: string, message: string, autoClose: boolean = true, duration: number = 5000): void {
    this.show({
      type: 'info',
      title,
      message,
      autoClose,
      duration
    });
  }

  show(notification: Omit<UINotification, 'id'>): void {
    const newNotification: UINotification = {
      ...notification,
      id: this.generateId()
    };

    const currentNotifications = this.notificationsSubject.value;
    this.notificationsSubject.next([...currentNotifications, newNotification]);

    // Auto-close if specified
    if (notification.autoClose) {
      setTimeout(() => {
        this.remove(newNotification.id);
      }, notification.duration || 5000);
    }
  }

  remove(id: string): void {
    const currentNotifications = this.notificationsSubject.value;
    const filteredNotifications = currentNotifications.filter(n => n.id !== id);
    this.notificationsSubject.next(filteredNotifications);
  }

  clear(): void {
    this.notificationsSubject.next([]);
  }

  showBookingProgress(step: string, message: string): void {
    this.show({
      type: 'info',
      title: `Paso ${step}`,
      message,
      autoClose: true,
      duration: 3000
    });
  }

  showValidationError(fieldName: string, errorMessage: string): void {
    this.show({
      type: 'warning',
      title: 'Error de Validación',
      message: `${fieldName}: ${errorMessage}`,
      autoClose: true,
      duration: 4000
    });
  }

  showBookingSuccess(bookingId: string): void {
    this.show({
      type: 'success',
      title: '¡Reserva Confirmada!',
      message: `Su reserva #${bookingId} ha sido creada exitosamente. Recibirá un email de confirmación.`,
      autoClose: true,
      duration: 8000,
      action: {
        label: 'Ver Detalles',
        callback: () => {
          // Navigate to booking details
          console.log('Navigate to booking details');
        }
      }
    });
  }

  showConnectionError(): void {
    this.show({
      type: 'error',
      title: 'Error de Conexión',
      message: 'No se pudo conectar con el servidor. Por favor, verifique su conexión a internet.',
      autoClose: false,
      action: {
        label: 'Reintentar',
        callback: () => {
          // Retry logic
          window.location.reload();
        }
      }
    });
  }
}
