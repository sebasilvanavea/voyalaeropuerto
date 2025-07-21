import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

export interface EmailTemplate {
  to: string | string[];
  subject: string;
  template: string;
  variables: Record<string, any>;
  attachments?: Array<{
    filename: string;
    content: string;
    type: string;
  }>;
}

export interface EmailProvider {
  send(template: EmailTemplate): Promise<void>;
}

// Implementación con multiple providers
class ResendProvider implements EmailProvider {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async send(template: EmailTemplate): Promise<void> {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'VoyAlAeropuerto <noreply@voyalaeropuerto.com>',
        to: Array.isArray(template.to) ? template.to : [template.to],
        subject: template.subject,
        html: this.processTemplate(template.template, template.variables),
        attachments: template.attachments,
      }),
    });

    if (!response.ok) {
      throw new Error(`Email sending failed: ${response.statusText}`);
    }
  }

  private processTemplate(template: string, variables: Record<string, any>): string {
    let processedTemplate = template;
    for (const [key, value] of Object.entries(variables)) {
      const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
      processedTemplate = processedTemplate.replace(regex, String(value));
    }
    return processedTemplate;
  }
}

// Templates de email predefinidos
const EMAIL_TEMPLATES = {
  BOOKING_CONFIRMATION: `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Confirmación de Reserva - VoyAlAeropuerto</title>
      <style>
        body { 
          font-family: 'Segoe UI', system-ui, sans-serif; 
          line-height: 1.6; 
          color: #333; 
          max-width: 600px; 
          margin: 0 auto; 
          background: #f8fafc;
        }
        .header { 
          background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); 
          color: white; 
          padding: 2rem; 
          text-align: center; 
          border-radius: 12px 12px 0 0;
        }
        .content { 
          background: white; 
          padding: 2rem; 
          border-radius: 0 0 12px 12px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .booking-card { 
          background: #f0f9ff; 
          border: 2px solid #0ea5e9; 
          border-radius: 12px; 
          padding: 1.5rem; 
          margin: 1.5rem 0; 
        }
        .detail-row { 
          display: flex; 
          justify-content: space-between; 
          margin: 0.5rem 0; 
          padding: 0.5rem 0;
          border-bottom: 1px solid #e2e8f0;
        }
        .total { 
          background: #ecfdf5; 
          font-weight: bold; 
          font-size: 1.2em; 
          color: #065f46;
        }
        .button { 
          display: inline-block; 
          background: #10b981; 
          color: white; 
          padding: 12px 24px; 
          text-decoration: none; 
          border-radius: 8px; 
          font-weight: bold; 
          text-align: center;
          margin: 1rem 0;
        }
        .footer { 
          text-align: center; 
          color: #64748b; 
          margin-top: 2rem; 
          padding-top: 1rem; 
          border-top: 1px solid #e2e8f0;
        }
        .qr-code { 
          text-align: center; 
          margin: 1rem 0; 
        }
        .important-info {
          background: #fef3c7;
          border: 1px solid #f59e0b;
          border-radius: 8px;
          padding: 1rem;
          margin: 1rem 0;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>🛩️ VoyAlAeropuerto</h1>
        <h2>¡Reserva Confirmada!</h2>
        <p>Código de Confirmación: <strong>{{ confirmationCode }}</strong></p>
      </div>
      
      <div class="content">
        <p>Estimado/a <strong>{{ passengerName }}</strong>,</p>
        
        <p>¡Excelente! Tu reserva ha sido confirmada exitosamente. A continuación encontrarás todos los detalles de tu traslado:</p>
        
        <div class="booking-card">
          <h3>📍 Detalles del Viaje</h3>
          <div class="detail-row">
            <span>📅 Fecha y Hora:</span>
            <strong>{{ pickupDate }} {{ pickupTime }}</strong>
          </div>
          <div class="detail-row">
            <span>🚗 Tipo de Servicio:</span>
            <strong>{{ serviceType }}</strong>
          </div>
          <div class="detail-row">
            <span>🚙 Vehículo:</span>
            <strong>{{ vehicleType }}</strong>
          </div>
          <div class="detail-row">
            <span>👥 Pasajeros:</span>
            <strong>{{ passengers }}</strong>
          </div>
          <div class="detail-row">
            <span>📍 Dirección de Recogida:</span>
            <strong>{{ pickupAddress }}</strong>
          </div>
          <div class="detail-row">
            <span>🎯 Destino:</span>
            <strong>{{ destinationAddress }}</strong>
          </div>
          {{#if flightNumber}}
          <div class="detail-row">
            <span>✈️ Número de Vuelo:</span>
            <strong>{{ flightNumber }}</strong>
          </div>
          {{/if}}
        </div>

        <div class="booking-card">
          <h3>💰 Detalles del Precio</h3>
          <div class="detail-row">
            <span>Precio Base:</span>
            <span>{{ basePrice }}</span>
          </div>
          {{#if airportSurcharge}}
          <div class="detail-row">
            <span>Recargo Aeropuerto:</span>
            <span>{{ airportSurcharge }}</span>
          </div>
          {{/if}}
          <div class="detail-row total">
            <span>Total a Pagar:</span>
            <span>{{ totalPrice }}</span>
          </div>
        </div>

        <div class="important-info">
          <h4>ℹ️ Información Importante</h4>
          <ul>
            <li><strong>Llegada del conductor:</strong> 15 minutos antes de la hora programada</li>
            <li><strong>Tiempo de espera incluido:</strong> 15 minutos sin costo adicional</li>
            <li><strong>Cancelación gratuita:</strong> Hasta 2 horas antes del viaje</li>
            <li><strong>Contacto de emergencia:</strong> +56 9 1234 5678</li>
          </ul>
        </div>

        <div class="qr-code">
          <p><strong>Código QR para seguimiento:</strong></p>
          <img src="{{ qrCodeUrl }}" alt="QR Code" style="width: 150px; height: 150px;">
          <p><small>Muestra este código al conductor</small></p>
        </div>

        <div style="text-align: center;">
          <a href="{{ trackingUrl }}" class="button">🔍 Seguir mi Viaje</a>
          <a href="{{ modifyUrl }}" class="button" style="background: #3b82f6;">✏️ Modificar Reserva</a>
        </div>

        <div class="footer">
          <p>¿Necesitas ayuda? Contáctanos:</p>
          <p>📧 support@voyalaeropuerto.com | 📞 +56 9 1234 5678</p>
          <p>🌐 <a href="{{ websiteUrl }}">www.voyalaeropuerto.com</a></p>
          
          <p style="margin-top: 1rem; font-size: 0.9em;">
            <a href="{{ unsubscribeUrl }}">Cancelar suscripción</a> | 
            <a href="{{ termsUrl }}">Términos y Condiciones</a> | 
            <a href="{{ privacyUrl }}">Política de Privacidad</a>
          </p>
        </div>
      </div>
    </body>
    </html>
  `,

  DRIVER_ASSIGNMENT: `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Conductor Asignado - VoyAlAeropuerto</title>
      <style>
        body { font-family: system-ui, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; }
        .header { background: linear-gradient(135deg, #10b981 0%, #34d399 100%); color: white; padding: 2rem; text-align: center; border-radius: 12px 12px 0 0; }
        .content { background: white; padding: 2rem; border-radius: 0 0 12px 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
        .driver-card { background: #f0fdf4; border: 2px solid #10b981; border-radius: 12px; padding: 1.5rem; margin: 1.5rem 0; display: flex; align-items: center; gap: 1rem; }
        .driver-photo { width: 80px; height: 80px; border-radius: 50%; object-fit: cover; }
        .vehicle-info { background: #fef3c7; border-radius: 8px; padding: 1rem; margin: 1rem 0; }
        .eta { background: #dbeafe; border: 2px solid #3b82f6; border-radius: 8px; padding: 1rem; text-align: center; font-size: 1.2em; font-weight: bold; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>🚗 ¡Conductor Asignado!</h1>
        <p>Tu traslado está confirmado</p>
      </div>
      
      <div class="content">
        <p>Hola <strong>{{ passengerName }}</strong>,</p>
        
        <p>¡Excelente noticia! Hemos asignado un conductor para tu traslado con código <strong>{{ confirmationCode }}</strong>.</p>
        
        <div class="driver-card">
          <img src="{{ driverPhoto }}" alt="Foto del conductor" class="driver-photo">
          <div>
            <h3>{{ driverName }}</h3>
            <p>⭐ Rating: {{ driverRating }}/5.0 ({{ totalTrips }} viajes)</p>
            <p>📞 Teléfono: <a href="tel:{{ driverPhone }}">{{ driverPhone }}</a></p>
            <p>🗣️ Idiomas: {{ languages }}</p>
          </div>
        </div>

        <div class="vehicle-info">
          <h4>🚙 Información del Vehículo</h4>
          <p><strong>{{ vehicleBrand }} {{ vehicleModel }} {{ vehicleYear }}</strong></p>
          <p>🎨 Color: {{ vehicleColor }}</p>
          <p>🔢 Patente: <strong>{{ licensePlate }}</strong></p>
          <p>✨ Características: {{ vehicleFeatures }}</p>
        </div>

        <div class="eta">
          <p>🕒 Tiempo estimado de llegada: <strong>{{ estimatedArrival }}</strong></p>
          <p>📍 El conductor llegará a: {{ pickupAddress }}</p>
        </div>

        <div style="text-align: center; margin: 2rem 0;">
          <a href="{{ trackingUrl }}" style="display: inline-block; background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">
            📱 Ver Ubicación en Tiempo Real
          </a>
        </div>

        <div style="background: #fef2f2; border: 1px solid #f87171; border-radius: 8px; padding: 1rem; margin: 1rem 0;">
          <h4>⚠️ Importante</h4>
          <ul>
            <li>El conductor te contactará cuando esté cerca</li>
            <li>Ten tu teléfono disponible</li>
            <li>Confirma los últimos 4 dígitos de tu reserva: <strong>{{ confirmationLast4 }}</strong></li>
            <li>En caso de emergencia: +56 9 1234 5678</li>
          </ul>
        </div>
      </div>
    </body>
    </html>
  `,

  TRIP_REMINDER: `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Recordatorio de Viaje - VoyAlAeropuerto</title>
      <style>
        body { font-family: system-ui, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; }
        .header { background: linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%); color: white; padding: 2rem; text-align: center; border-radius: 12px 12px 0 0; }
        .content { background: white; padding: 2rem; border-radius: 0 0 12px 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
        .reminder-box { background: #fef3c7; border: 2px solid #f59e0b; border-radius: 12px; padding: 1.5rem; margin: 1.5rem 0; text-align: center; }
        .checklist { background: #f0f9ff; border-radius: 8px; padding: 1rem; margin: 1rem 0; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>⏰ Recordatorio de Viaje</h1>
        <p>Tu traslado es mañana</p>
      </div>
      
      <div class="content">
        <p>Hola <strong>{{ passengerName }}</strong>,</p>
        
        <p>Este es un recordatorio amigable de que tienes un traslado programado para mañana.</p>
        
        <div class="reminder-box">
          <h3>📅 {{ pickupDate }} a las {{ pickupTime }}</h3>
          <p><strong>Desde:</strong> {{ pickupAddress }}</p>
          <p><strong>Hacia:</strong> {{ destinationAddress }}</p>
          <p><strong>Código:</strong> {{ confirmationCode }}</p>
        </div>

        <div class="checklist">
          <h4>📋 Lista de Verificación Pre-Viaje</h4>
          <ul style="text-align: left;">
            <li>✅ Confirma que tienes tu documentación lista</li>
            <li>✅ Verifica el clima y vístete apropiadamente</li>
            <li>✅ Prepara tu equipaje según las restricciones</li>
            <li>✅ Carga tu teléfono para el tracking</li>
            <li>✅ Ten efectivo para propinas (opcional)</li>
          </ul>
        </div>

        {{#if flightNumber}}
        <div style="background: #ddd6fe; border-radius: 8px; padding: 1rem; margin: 1rem 0;">
          <h4>✈️ Información de Vuelo</h4>
          <p><strong>Vuelo:</strong> {{ flightNumber }}</p>
          <p><strong>Hora de llegada:</strong> {{ flightArrival }}</p>
          <p><em>Estaremos monitoreando tu vuelo para ajustar el horario si es necesario.</em></p>
        </div>
        {{/if}}

        <div style="text-align: center; margin: 2rem 0;">
          <a href="{{ modifyUrl }}" style="display: inline-block; background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 0.5rem;">
            ✏️ Modificar Reserva
          </a>
          <a href="{{ cancelUrl }}" style="display: inline-block; background: #ef4444; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 0.5rem;">
            ❌ Cancelar Viaje
          </a>
        </div>
      </div>
    </body>
    </html>
  `,

  PAYMENT_RECEIPT: `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Recibo de Pago - VoyAlAeropuerto</title>
      <style>
        body { font-family: system-ui, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; }
        .header { background: linear-gradient(135deg, #10b981 0%, #34d399 100%); color: white; padding: 2rem; text-align: center; border-radius: 12px 12px 0 0; }
        .content { background: white; padding: 2rem; border-radius: 0 0 12px 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
        .receipt { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem; margin: 1rem 0; }
        .detail-row { display: flex; justify-content: space-between; margin: 0.5rem 0; padding: 0.5rem 0; border-bottom: 1px solid #e2e8f0; }
        .total { background: #ecfdf5; font-weight: bold; font-size: 1.2em; color: #065f46; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>💳 Pago Procesado</h1>
        <p>Recibo #{{ receiptNumber }}</p>
      </div>
      
      <div class="content">
        <p>Estimado/a <strong>{{ passengerName }}</strong>,</p>
        
        <p>Hemos procesado exitosamente tu pago por el traslado con código <strong>{{ confirmationCode }}</strong>.</p>
        
        <div class="receipt">
          <h3>📄 Detalles del Recibo</h3>
          <div class="detail-row">
            <span>Fecha de Pago:</span>
            <strong>{{ paymentDate }}</strong>
          </div>
          <div class="detail-row">
            <span>Método de Pago:</span>
            <strong>{{ paymentMethod }}</strong>
          </div>
          <div class="detail-row">
            <span>ID de Transacción:</span>
            <strong>{{ transactionId }}</strong>
          </div>
          <div class="detail-row">
            <span>Servicio:</span>
            <strong>{{ serviceDescription }}</strong>
          </div>
          <div class="detail-row">
            <span>Fecha del Viaje:</span>
            <strong>{{ tripDate }}</strong>
          </div>
          <div class="detail-row">
            <span>Subtotal:</span>
            <span>{{ subtotal }}</span>
          </div>
          {{#if discount}}
          <div class="detail-row" style="color: #10b981;">
            <span>Descuento ({{ promoCode }}):</span>
            <span>-{{ discount }}</span>
          </div>
          {{/if}}
          <div class="detail-row total">
            <span>Total Pagado:</span>
            <span>{{ totalPaid }}</span>
          </div>
        </div>

        <div style="background: #f0f9ff; border-radius: 8px; padding: 1rem; margin: 1rem 0;">
          <h4>📋 Detalles Fiscales</h4>
          <p><strong>RUT:</strong> 76.XXX.XXX-X</p>
          <p><strong>Razón Social:</strong> VoyAlAeropuerto SpA</p>
          <p><strong>Dirección:</strong> Santiago, Chile</p>
          <p><em>Este documento tiene valor tributario</em></p>
        </div>

        <div style="text-align: center; margin: 2rem 0;">
          <a href="{{ downloadReceiptUrl }}" style="display: inline-block; background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">
            📥 Descargar Recibo PDF
          </a>
        </div>
      </div>
    </body>
    </html>
  `,

  TRIP_COMPLETED: `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Viaje Completado - VoyAlAeropuerto</title>
    </head>
    <body>
      <div class="header">
        <h1>🎉 ¡Viaje Completado!</h1>
        <p>Gracias por elegir VoyAlAeropuerto</p>
      </div>
      
      <div class="content">
        <p>Estimado/a <strong>{{ passengerName }}</strong>,</p>
        
        <p>¡Esperamos que hayas tenido un excelente viaje! Tu traslado con código <strong>{{ confirmationCode }}</strong> ha sido completado exitosamente.</p>
        
        <div class="summary">
          <h3>📋 Resumen del Viaje</h3>
          <p><strong>Conductor:</strong> {{ driverName }}</p>
          <p><strong>Vehículo:</strong> {{ vehicleInfo }}</p>
          <p><strong>Distancia:</strong> {{ distance }} km</p>
          <p><strong>Tiempo:</strong> {{ duration }}</p>
          <p><strong>Costo Total:</strong> {{ totalCost }}</p>
        </div>

        <div class="rating-section">
          <h3>⭐ ¿Cómo fue tu experiencia?</h3>
          <p>Tu opinión nos ayuda a mejorar nuestro servicio</p>
          
          <div class="stars" id="rating">
            <span class="star" data-rating="1">⭐</span>
            <span class="star" data-rating="2">⭐</span>
            <span class="star" data-rating="3">⭐</span>
            <span class="star" data-rating="4">⭐</span>
            <span class="star" data-rating="5">⭐</span>
          </div>
          
          <a href="{{ reviewUrl }}" style="display: inline-block; background: #f59e0b; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">
            ✍️ Escribir Reseña
          </a>
        </div>

        <div style="background: #dbeafe; border-radius: 8px; padding: 1rem; margin: 1rem 0;">
          <h4>🎁 ¡Gana Puntos de Lealtad!</h4>
          <p>Has ganado <strong>{{ loyaltyPoints }}</strong> puntos por este viaje.</p>
          <p>Total de puntos: <strong>{{ totalLoyaltyPoints }}</strong></p>
          <p><em>Usa tus puntos para obtener descuentos en futuros viajes.</em></p>
        </div>

        <div style="text-align: center; margin: 2rem 0;">
          <a href="{{ bookAgainUrl }}" style="display: inline-block; background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 0.5rem;">
            🔄 Reservar Otro Viaje
          </a>
          <a href="{{ referralUrl }}" style="display: inline-block; background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 0.5rem;">
            👥 Referir Amigos
          </a>
        </div>
      </div>
    </body>
    </html>
  `
};

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  private provider: EmailProvider;
  constructor() {
    // Configurar el proveedor de email según el environment
    try {
      if ((environment as any).emailProvider === 'resend' && (environment as any).resendApiKey) {
        this.provider = new ResendProvider((environment as any).resendApiKey);
      } else {
        // Mock provider for development
        this.provider = new ResendProvider('mock-key');
      }
    } catch (error) {
      console.warn('Email provider not configured:', error);
      // Mock provider fallback
      this.provider = new ResendProvider('mock-key');
    }
  }

  async sendBookingConfirmation(booking: any, user: any): Promise<void> {
    const template: EmailTemplate = {
      to: user.email,
      subject: `¡Reserva Confirmada! Código: ${booking.confirmation_code}`,
      template: EMAIL_TEMPLATES.BOOKING_CONFIRMATION,
      variables: {
        passengerName: `${user.first_name} ${user.last_name}`,
        confirmationCode: booking.confirmation_code,
        pickupDate: this.formatDate(booking.pickup_datetime),
        pickupTime: this.formatTime(booking.pickup_datetime),
        serviceType: this.getServiceTypeLabel(booking.service_type),
        vehicleType: this.getVehicleTypeLabel(booking.vehicle_type),
        passengers: booking.passengers,
        pickupAddress: booking.pickup_address,
        destinationAddress: booking.destination_address,
        flightNumber: booking.flight_number,
        basePrice: this.formatCurrency(booking.base_price),
        airportSurcharge: booking.airport_surcharge ? this.formatCurrency(booking.airport_surcharge) : null,
        totalPrice: this.formatCurrency(booking.total_price),
        qrCodeUrl: this.generateQRCodeUrl(booking.confirmation_code),
        trackingUrl: `${environment.appUrl}/tracking/${booking.confirmation_code}`,
        modifyUrl: `${environment.appUrl}/reservar/${booking.id}`,
        websiteUrl: environment.appUrl,
        unsubscribeUrl: `${environment.appUrl}/unsubscribe`,
        termsUrl: `${environment.appUrl}/terminos`,
        privacyUrl: `${environment.appUrl}/privacidad`
      }
    };

    await this.provider.send(template);
  }

  async sendDriverAssignment(booking: any, driver: any, vehicle: any, user: any): Promise<void> {
    const template: EmailTemplate = {
      to: user.email,
      subject: `🚗 Conductor Asignado - ${booking.confirmation_code}`,
      template: EMAIL_TEMPLATES.DRIVER_ASSIGNMENT,
      variables: {
        passengerName: `${user.first_name} ${user.last_name}`,
        confirmationCode: booking.confirmation_code,
        driverName: `${driver.first_name} ${driver.last_name}`,
        driverPhoto: driver.avatar_url || '/assets/default-driver.png',
        driverRating: driver.rating,
        totalTrips: driver.total_trips,
        driverPhone: driver.phone,
        languages: driver.languages.join(', '),
        vehicleBrand: vehicle.brand,
        vehicleModel: vehicle.model,
        vehicleYear: vehicle.year,
        vehicleColor: vehicle.color,
        licensePlate: vehicle.license_plate,
        vehicleFeatures: vehicle.features.join(', '),
        estimatedArrival: this.formatDateTime(booking.estimated_pickup_time),
        pickupAddress: booking.pickup_address,
        trackingUrl: `${environment.appUrl}/tracking/${booking.confirmation_code}`,
        confirmationLast4: booking.confirmation_code.slice(-4)
      }
    };

    await this.provider.send(template);
  }

  async sendTripReminder(booking: any, user: any): Promise<void> {
    const template: EmailTemplate = {
      to: user.email,
      subject: `⏰ Recordatorio: Tu viaje es mañana - ${booking.confirmation_code}`,
      template: EMAIL_TEMPLATES.TRIP_REMINDER,
      variables: {
        passengerName: `${user.first_name} ${user.last_name}`,
        pickupDate: this.formatDate(booking.pickup_datetime),
        pickupTime: this.formatTime(booking.pickup_datetime),
        pickupAddress: booking.pickup_address,
        destinationAddress: booking.destination_address,
        confirmationCode: booking.confirmation_code,
        flightNumber: booking.flight_number,
        flightArrival: booking.flight_arrival_time ? this.formatDateTime(booking.flight_arrival_time) : null,
        modifyUrl: `${environment.appUrl}/reservar/${booking.id}`,
        cancelUrl: `${environment.appUrl}/cancelar/${booking.id}`
      }
    };

    await this.provider.send(template);
  }

  async sendPaymentReceipt(payment: any, booking: any, user: any): Promise<void> {
    const template: EmailTemplate = {
      to: user.email,
      subject: `💳 Recibo de Pago #${payment.id} - VoyAlAeropuerto`,
      template: EMAIL_TEMPLATES.PAYMENT_RECEIPT,
      variables: {
        passengerName: `${user.first_name} ${user.last_name}`,
        receiptNumber: payment.id.slice(-8).toUpperCase(),
        confirmationCode: booking.confirmation_code,
        paymentDate: this.formatDateTime(payment.paid_at),
        paymentMethod: this.getPaymentMethodLabel(payment.payment_method),
        transactionId: payment.provider_transaction_id,
        serviceDescription: `Traslado ${this.getServiceTypeLabel(booking.service_type)}`,
        tripDate: this.formatDate(booking.pickup_datetime),
        subtotal: this.formatCurrency(payment.amount),
        discount: payment.discount_amount ? this.formatCurrency(payment.discount_amount) : null,
        promoCode: payment.promo_code,
        totalPaid: this.formatCurrency(payment.amount - (payment.discount_amount || 0)),
        downloadReceiptUrl: `${environment.appUrl}/recibo/${payment.id}`
      }
    };

    await this.provider.send(template);
  }

  async sendTripCompleted(booking: any, user: any, loyaltyPoints: number): Promise<void> {
    const template: EmailTemplate = {
      to: user.email,
      subject: `🎉 ¡Viaje Completado! - ${booking.confirmation_code}`,
      template: EMAIL_TEMPLATES.TRIP_COMPLETED,
      variables: {
        passengerName: `${user.first_name} ${user.last_name}`,
        confirmationCode: booking.confirmation_code,
        driverName: booking.driver_name,
        vehicleInfo: `${booking.vehicle_brand} ${booking.vehicle_model}`,
        distance: booking.actual_distance,
        duration: this.formatDuration(booking.actual_duration),
        totalCost: this.formatCurrency(booking.total_price),
        loyaltyPoints: loyaltyPoints,
        totalLoyaltyPoints: user.loyalty_points + loyaltyPoints,
        reviewUrl: `${environment.appUrl}/review/${booking.id}`,
        bookAgainUrl: `${environment.appUrl}/reservar`,
        referralUrl: `${environment.appUrl}/referir`
      }
    };

    await this.provider.send(template);
  }

  // Métodos auxiliares para formateo
  private formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('es-CL', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  private formatTime(dateString: string): string {
    return new Date(dateString).toLocaleTimeString('es-CL', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  private formatDateTime(dateString: string): string {
    return new Date(dateString).toLocaleString('es-CL');
  }

  private formatCurrency(amount: number): string {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(amount);
  }

  private formatDuration(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  }
  private getServiceTypeLabel(serviceType: string): string {
    const labels: Record<string, string> = {
      'toAirport': 'Hacia el Aeropuerto',
      'fromAirport': 'Desde el Aeropuerto',
      'intercity': 'Interurbano',
      'hourly': 'Por Horas'
    };
    return labels[serviceType] || serviceType;
  }
  private getVehicleTypeLabel(vehicleType: string): string {
    const labels: Record<string, string> = {
      'taxi': 'Taxi Ejecutivo',
      'suv': 'SUV',
      'van': 'Van',
      'luxury': 'Vehículo de Lujo'
    };
    return labels[vehicleType] || vehicleType;
  }
  private getPaymentMethodLabel(paymentMethod: string): string {
    const labels: Record<string, string> = {
      'credit_card': 'Tarjeta de Crédito',
      'debit_card': 'Tarjeta de Débito',
      'cash': 'Efectivo',
      'transfer': 'Transferencia Bancaria'
    };
    return labels[paymentMethod] || paymentMethod;
  }

  private generateQRCodeUrl(confirmationCode: string): string {
    // Generar URL del QR code usando un servicio como QR Server
    const qrData = `${environment.appUrl}/tracking/${confirmationCode}`;
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrData)}`;
  }
}
