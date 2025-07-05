import { Component, OnInit, OnDestroy, Input, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrackingService, LocationData, TripUpdate } from '../../services/tracking.service';
import { BookingService } from '../../services/booking.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

// Declarar Google Maps para TypeScript
declare global {
  interface Window {
    google: any;
  }
}

@Component({
  selector: 'app-trip-tracking',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="tracking-container">
      <!-- Header con estado de conexión -->
      <div class="tracking-header" [class.connected]="isConnected" [class.disconnected]="!isConnected">
        <div class="status-indicator">
          <div class="status-dot" [class.active]="isConnected"></div>
          <span class="status-text">
            {{ isConnected ? 'Conectado' : 'Desconectado' }}
          </span>
        </div>
        
        <div class="trip-info" *ngIf="bookingData">
          <h3>{{ bookingData.confirmation_code }}</h3>
          <p>{{ getServiceTypeLabel(bookingData.service_type) }}</p>
        </div>
      </div>

      <!-- Alertas de geofence -->
      <div class="geofence-alert" *ngIf="geofenceAlert" [class]="'alert-' + geofenceAlert.type">
        <div class="alert-icon">
          {{ getAlertIcon(geofenceAlert.type) }}
        </div>
        <div class="alert-message">
          {{ geofenceAlert.message }}
        </div>
      </div>

      <!-- Información del conductor (si está asignado) -->
      <div class="driver-info" *ngIf="driverData">
        <div class="driver-card">
          <img [src]="driverData.avatar_url || '/assets/default-driver.png'" 
               alt="Foto del conductor" class="driver-photo">
          <div class="driver-details">
            <h4>{{ driverData.first_name }} {{ driverData.last_name }}</h4>
            <div class="driver-rating">
              <span class="stars">{{ getStarRating(driverData.rating) }}</span>
              <span class="rating-text">{{ driverData.rating }}/5.0</span>
            </div>
            <p class="vehicle-info">
              {{ vehicleData?.brand }} {{ vehicleData?.model }} 
              <span class="license-plate">{{ vehicleData?.license_plate }}</span>
            </p>
          </div>
          <div class="contact-actions">
            <a [href]="'tel:' + driverData.phone" class="contact-btn call">
              📞
            </a>
            <a [href]="'sms:' + driverData.phone" class="contact-btn sms">
              💬
            </a>
          </div>
        </div>
      </div>

      <!-- Mapa -->
      <div class="map-container">
        <div #mapElement class="map" id="tracking-map"></div>
        
        <!-- Controles del mapa -->
        <div class="map-controls">
          <button class="map-btn" (click)="centerOnDriver()" *ngIf="driverLocation">
            🎯 Centrar en Conductor
          </button>
          <button class="map-btn" (click)="showFullRoute()">
            🗺️ Ver Ruta Completa
          </button>
          <button class="map-btn" (click)="toggleTrafficLayer()">
            🚗 {{ showTraffic ? 'Ocultar' : 'Mostrar' }} Tráfico
          </button>
        </div>
      </div>

      <!-- Información del viaje -->
      <div class="trip-details">
        <div class="detail-card">
          <h4>📍 Información del Viaje</h4>
          
          <div class="trip-progress" *ngIf="tripUpdate">
            <div class="progress-step" 
                 [class.active]="tripUpdate.status === 'approaching' || tripUpdate.status === 'arrived' || tripUpdate.status === 'in_transit' || tripUpdate.status === 'completed'">
              <div class="step-icon">🚗</div>
              <div class="step-label">En camino</div>
            </div>
            
            <div class="progress-line" 
                 [class.active]="tripUpdate.status === 'arrived' || tripUpdate.status === 'in_transit' || tripUpdate.status === 'completed'">
            </div>
            
            <div class="progress-step" 
                 [class.active]="tripUpdate.status === 'arrived' || tripUpdate.status === 'in_transit' || tripUpdate.status === 'completed'">
              <div class="step-icon">📍</div>
              <div class="step-label">Recogida</div>
            </div>
            
            <div class="progress-line" 
                 [class.active]="tripUpdate.status === 'in_transit' || tripUpdate.status === 'completed'">
            </div>
            
            <div class="progress-step" 
                 [class.active]="tripUpdate.status === 'in_transit' || tripUpdate.status === 'completed'">
              <div class="step-icon">🛣️</div>
              <div class="step-label">En viaje</div>
            </div>
            
            <div class="progress-line" 
                 [class.active]="tripUpdate.status === 'completed'">
            </div>
            
            <div class="progress-step" 
                 [class.active]="tripUpdate.status === 'completed'">
              <div class="step-icon">🎯</div>
              <div class="step-label">Destino</div>
            </div>
          </div>

          <div class="trip-stats" *ngIf="estimatedArrival">
            <div class="stat-item">
              <div class="stat-icon">⏱️</div>
              <div class="stat-content">
                <span class="stat-label">Tiempo estimado</span>
                <span class="stat-value">{{ formatDuration(estimatedArrival.duration) }}</span>
              </div>
            </div>
            
            <div class="stat-item">
              <div class="stat-icon">📏</div>
              <div class="stat-content">
                <span class="stat-label">Distancia restante</span>
                <span class="stat-value">{{ formatDistance(estimatedArrival.distance) }}</span>
              </div>
            </div>
            
            <div class="stat-item" *ngIf="driverLocation?.speed">
              <div class="stat-icon">🚗</div>
              <div class="stat-content">
                <span class="stat-label">Velocidad actual</span>
                <span class="stat-value">{{ roundSpeed(driverLocation?.speed || 0) }} km/h</span>
              </div>
            </div>
          </div>

          <div class="status-message" *ngIf="tripUpdate?.message">
            <div class="message-icon">ℹ️</div>
            <span>{{ tripUpdate?.message || '' }}</span>
          </div>
        </div>

        <!-- Detalles de la reserva -->
        <div class="booking-details" *ngIf="bookingData">
          <h4>📋 Detalles de la Reserva</h4>
          
          <div class="detail-row">
            <span class="detail-label">Desde:</span>
            <span class="detail-value">{{ bookingData.pickup_address }}</span>
          </div>
          
          <div class="detail-row">
            <span class="detail-label">Hacia:</span>
            <span class="detail-value">{{ bookingData.destination_address }}</span>
          </div>
          
          <div class="detail-row">
            <span class="detail-label">Fecha y hora:</span>
            <span class="detail-value">{{ formatDateTime(bookingData.pickup_datetime) }}</span>
          </div>
          
          <div class="detail-row">
            <span class="detail-label">Pasajeros:</span>
            <span class="detail-value">{{ bookingData.passengers }}</span>
          </div>
          
          <div class="detail-row">
            <span class="detail-label">Total:</span>
            <span class="detail-value price">{{ formatCurrency(bookingData.total_price) }}</span>
          </div>
        </div>
      </div>

      <!-- Acciones -->
      <div class="action-buttons">
        <button class="action-btn emergency" (click)="callEmergency()">
          🚨 Emergencia
        </button>
        
        <button class="action-btn modify" (click)="modifyBooking()" 
                *ngIf="bookingData?.status === 'confirmed' || bookingData?.status === 'assigned'">
          ✏️ Modificar
        </button>
        
        <button class="action-btn cancel" (click)="cancelBooking()" 
                *ngIf="bookingData?.status === 'confirmed' || bookingData?.status === 'assigned'">
          ❌ Cancelar
        </button>
      </div>
    </div>
  `,
  styles: [`
    .tracking-container {
      max-width: 1200px;
      margin: 0 auto;
      background: #f8fafc;
      min-height: 100vh;
    }

    .tracking-header {
      background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
      color: white;
      padding: 1.5rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      position: sticky;
      top: 0;
      z-index: 100;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .tracking-header.disconnected {
      background: linear-gradient(135deg, #ef4444 0%, #f87171 100%);
    }

    .status-indicator {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .status-dot {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: #ef4444;
      animation: pulse 2s infinite;
    }

    .status-dot.active {
      background: #10b981;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }

    .trip-info h3 {
      margin: 0;
      font-size: 1.25rem;
      font-weight: 700;
    }

    .trip-info p {
      margin: 0;
      opacity: 0.9;
      font-size: 0.875rem;
    }

    .geofence-alert {
      background: #fef3c7;
      border: 1px solid #f59e0b;
      padding: 1rem;
      margin: 1rem;
      border-radius: 12px;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      animation: slideIn 0.3s ease;
    }

    .geofence-alert.alert-pickup {
      background: #ecfdf5;
      border-color: #10b981;
    }

    .geofence-alert.alert-destination {
      background: #dbeafe;
      border-color: #3b82f6;
    }

    @keyframes slideIn {
      from { transform: translateY(-20px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }

    .driver-info {
      margin: 1rem;
    }

    .driver-card {
      background: white;
      border-radius: 16px;
      padding: 1.5rem;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .driver-photo {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      object-fit: cover;
      border: 3px solid #10b981;
    }

    .driver-details {
      flex: 1;
    }

    .driver-details h4 {
      margin: 0 0 0.25rem 0;
      font-size: 1.125rem;
      font-weight: 600;
    }

    .driver-rating {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 0.25rem;
    }

    .stars {
      color: #fbbf24;
      font-size: 0.875rem;
    }

    .rating-text {
      font-size: 0.75rem;
      color: #64748b;
    }

    .vehicle-info {
      font-size: 0.875rem;
      color: #374151;
      margin: 0;
    }

    .license-plate {
      background: #1e40af;
      color: white;
      padding: 0.125rem 0.5rem;
      border-radius: 4px;
      font-weight: 600;
      font-size: 0.75rem;
    }

    .contact-actions {
      display: flex;
      gap: 0.5rem;
    }

    .contact-btn {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      background: #f3f4f6;
      border: 1px solid #e5e7eb;
      display: flex;
      align-items: center;
      justify-content: center;
      text-decoration: none;
      font-size: 1.25rem;
      transition: all 0.3s ease;
    }

    .contact-btn:hover {
      background: #10b981;
      color: white;
      transform: scale(1.1);
    }

    .map-container {
      position: relative;
      margin: 1rem;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .map {
      width: 100%;
      height: 400px;
      background: #f3f4f6;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #64748b;
      font-size: 1.125rem;
    }

    .map-controls {
      position: absolute;
      top: 1rem;
      right: 1rem;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .map-btn {
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      padding: 0.5rem;
      font-size: 0.75rem;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .map-btn:hover {
      background: #f9fafb;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .trip-details {
      margin: 1rem;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }

    @media (max-width: 768px) {
      .trip-details {
        grid-template-columns: 1fr;
      }
    }

    .detail-card, .booking-details {
      background: white;
      border-radius: 16px;
      padding: 1.5rem;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .detail-card h4, .booking-details h4 {
      margin: 0 0 1rem 0;
      font-size: 1.125rem;
      font-weight: 600;
      color: #1f2937;
    }

    .trip-progress {
      display: flex;
      align-items: center;
      margin-bottom: 1.5rem;
      overflow-x: auto;
    }

    .progress-step {
      display: flex;
      flex-direction: column;
      align-items: center;
      opacity: 0.5;
      transition: opacity 0.3s ease;
    }

    .progress-step.active {
      opacity: 1;
    }

    .step-icon {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: #f3f4f6;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.25rem;
      margin-bottom: 0.5rem;
      transition: all 0.3s ease;
    }

    .progress-step.active .step-icon {
      background: #10b981;
      color: white;
      box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
    }

    .step-label {
      font-size: 0.75rem;
      font-weight: 500;
      text-align: center;
      white-space: nowrap;
    }

    .progress-line {
      width: 40px;
      height: 2px;
      background: #e5e7eb;
      transition: background 0.3s ease;
    }

    .progress-line.active {
      background: #10b981;
    }

    .trip-stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 1rem;
      margin-bottom: 1rem;
    }

    .stat-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 1rem;
      background: #f8fafc;
      border-radius: 12px;
    }

    .stat-icon {
      font-size: 1.5rem;
    }

    .stat-content {
      display: flex;
      flex-direction: column;
    }

    .stat-label {
      font-size: 0.75rem;
      color: #64748b;
      font-weight: 500;
    }

    .stat-value {
      font-size: 1rem;
      font-weight: 600;
      color: #1f2937;
    }

    .status-message {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      background: #dbeafe;
      border: 1px solid #3b82f6;
      border-radius: 8px;
      padding: 1rem;
      font-size: 0.875rem;
      color: #1e40af;
    }

    .detail-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.75rem 0;
      border-bottom: 1px solid #f1f5f9;
    }

    .detail-row:last-child {
      border-bottom: none;
    }

    .detail-label {
      font-size: 0.875rem;
      color: #64748b;
      font-weight: 500;
    }

    .detail-value {
      font-size: 0.875rem;
      color: #1f2937;
      font-weight: 600;
      text-align: right;
    }

    .detail-value.price {
      color: #10b981;
      font-size: 1rem;
    }

    .action-buttons {
      margin: 1rem;
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
    }

    .action-btn {
      flex: 1;
      padding: 0.875rem 1.5rem;
      border: none;
      border-radius: 12px;
      font-weight: 600;
      font-size: 0.875rem;
      cursor: pointer;
      transition: all 0.3s ease;
      min-width: 120px;
    }

    .action-btn.emergency {
      background: #ef4444;
      color: white;
    }

    .action-btn.emergency:hover {
      background: #dc2626;
      transform: translateY(-2px);
    }

    .action-btn.modify {
      background: #3b82f6;
      color: white;
    }

    .action-btn.modify:hover {
      background: #2563eb;
      transform: translateY(-2px);
    }

    .action-btn.cancel {
      background: #f3f4f6;
      color: #64748b;
      border: 1px solid #e5e7eb;
    }

    .action-btn.cancel:hover {
      background: #e5e7eb;
      color: #374151;
    }
  `]
})
export class TripTrackingComponent implements OnInit, OnDestroy {
  @Input() bookingId!: string;
  @ViewChild('mapElement', { static: true }) mapElement!: ElementRef;

  private destroy$ = new Subject<void>();
  private map: any;
  private driverMarker: any;
  private routePolyline: any;
  private trafficLayer: any;

  // Estado del componente
  isConnected = false;
  showTraffic = false;
  bookingData: any = null;
  driverData: any = null;
  vehicleData: any = null;
  driverLocation: LocationData | null = null;
  tripUpdate: TripUpdate | null = null;
  geofenceAlert: { type: string; message: string } | null = null;
  estimatedArrival: { duration: number; distance: number } | null = null;

  constructor(
    private trackingService: TrackingService,
    private bookingService: BookingService
  ) {}

  async ngOnInit(): Promise<void> {
    await this.loadBookingData();
    await this.initializeMap();
    await this.startTracking();
    this.setupSubscriptions();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.trackingService.stopTracking();
  }

  private async loadBookingData(): Promise<void> {
    try {
      // Cargar datos de la reserva
      this.bookingData = await this.bookingService.getBooking(this.bookingId);
      
      // Cargar datos del conductor si está asignado
      if (this.bookingData.driver_id) {
        // Aquí cargarías los datos del conductor desde tu servicio
        // this.driverData = await this.driverService.getDriver(this.bookingData.driver_id);
        // this.vehicleData = await this.vehicleService.getVehicle(this.bookingData.vehicle_id);
      }
    } catch (error) {
      console.error('Error loading booking data:', error);
    }
  }

  private async initializeMap(): Promise<void> {
    // Aquí inicializarías Google Maps
    // Por ahora mostramos un placeholder
    if (this.mapElement) {
      this.mapElement.nativeElement.innerHTML = '🗺️ Mapa de Seguimiento<br><small>Cargando ubicación...</small>';
    }
  }

  private async startTracking(): Promise<void> {
    try {
      await this.trackingService.startTracking(this.bookingId);
    } catch (error) {
      console.error('Error starting tracking:', error);
    }
  }

  private setupSubscriptions(): void {
    // Suscribirse al estado de conexión
    this.trackingService.connectionStatus$
      .pipe(takeUntil(this.destroy$))
      .subscribe(status => {
        this.isConnected = status === 'connected';
      });

    // Suscribirse a actualizaciones de ubicación
    this.trackingService.driverLocation$
      .pipe(takeUntil(this.destroy$))
      .subscribe(location => {
        if (location) {
          this.driverLocation = location;
          this.updateDriverMarker(location);
          this.updateEstimatedArrival();
        }
      });

    // Suscribirse a actualizaciones del viaje
    this.trackingService.tripUpdates$
      .pipe(takeUntil(this.destroy$))
      .subscribe(update => {
        this.tripUpdate = update;
      });

    // Suscribirse a alertas de geofence
    this.trackingService.geofenceAlerts$
      .pipe(takeUntil(this.destroy$))
      .subscribe(alert => {
        this.geofenceAlert = alert;
      });
  }

  private updateDriverMarker(location: LocationData): void {
    // Actualizar marcador del conductor en el mapa
    // Implementación específica de Google Maps
  }

  private async updateEstimatedArrival(): Promise<void> {
    if (!this.driverLocation || !this.bookingData) return;

    try {
      // Calcular tiempo estimado al punto de recogida o destino
      const targetLat = this.bookingData.pickup_location?.x || this.bookingData.destination_location?.x;
      const targetLng = this.bookingData.pickup_location?.y || this.bookingData.destination_location?.y;

      if (targetLat && targetLng) {
        this.estimatedArrival = await this.trackingService.getEstimatedArrival(
          this.driverLocation.latitude,
          this.driverLocation.longitude,
          targetLat,
          targetLng
        );
      }
    } catch (error) {
      console.error('Error updating estimated arrival:', error);
    }
  }

  // Métodos de control del mapa
  centerOnDriver(): void {
    if (this.driverLocation && this.map) {
      // Centrar mapa en la ubicación del conductor
    }
  }

  showFullRoute(): void {
    if (this.map && this.bookingData) {
      // Mostrar ruta completa desde pickup hasta destino
    }
  }

  toggleTrafficLayer(): void {
    this.showTraffic = !this.showTraffic;
    // Mostrar/ocultar capa de tráfico
  }

  // Métodos de acción
  callEmergency(): void {
    window.open('tel:+56912345678', '_self');
  }

  modifyBooking(): void {
    // Navegar a página de modificación
    window.open(`/reservar/${this.bookingId}`, '_blank');
  }

  cancelBooking(): void {
    if (confirm('¿Estás seguro de que quieres cancelar este viaje?')) {
      // Implementar cancelación
    }
  }

  // Métodos de formateo
  formatDateTime(dateString: string): string {
    return new Date(dateString).toLocaleString('es-CL');
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(amount);
  }

  formatDistance(meters: number): string {
    return this.trackingService.formatDistance(meters);
  }

  formatDuration(seconds: number): string {
    return this.trackingService.formatDuration(seconds);
    }

  // Helper methods for template
  roundSpeed(speed: number | null | undefined): number {
    if (!speed) return 0;
    return Math.round(speed * 3.6); // Convert m/s to km/h
  }

  getServiceTypeLabel(serviceType: string): string {
    const labels: { [key: string]: string } = {
      'toAirport': 'Al Aeropuerto',
      'fromAirport': 'Desde Aeropuerto',
      'intercity': 'Interurbano',
      'hourly': 'Por Horas'
    };
    return labels[serviceType] || serviceType;
  }

  getUpdateIcon(type: string): string {
    const icons: { [key: string]: string } = {
      'pickup': '📍',
      'destination': '🏁',
      'airport': '✈️',
      'traffic': '🚦',
      'delay': '⏰'
    };    return icons[type] || 'ℹ️';
  }

  getStarRating(rating: number): string {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    return '⭐'.repeat(fullStars) + 
           (hasHalfStar ? '⭐' : '') + 
           '☆'.repeat(emptyStars);
  }

  getAlertIcon(type: string): string {
    const icons: { [key: string]: string } = {
      'pickup': '📍',
      'destination': '🎯',
      'airport': '✈️',
      'traffic': '🚗',
      'delay': '⏱️'
    };
    return icons[type] || 'ℹ️';
  }
}
