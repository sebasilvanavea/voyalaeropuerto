import { Injectable } from '@angular/core';
import { PreloadingStrategy, Route } from '@angular/router';
import { Observable, of, timer } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SmartPreloadingStrategy implements PreloadingStrategy {
  
  // Rutas críticas que se precargan inmediatamente
  private criticalRoutes = [
    'booking-steps',
    'booking-success'
  ];

  // Rutas que se precargan después de un delay
  private delayedRoutes = [
    'precios',
    'tracking'
  ];

  // Rutas administrativas que se precargan solo cuando es necesario
  private adminRoutes = [
    'admin'
  ];

  preload(route: Route, load: () => Observable<any>): Observable<any> {
    const routePath = route.path || '';

    // Precargar rutas críticas inmediatamente
    if (this.criticalRoutes.some(critical => routePath.includes(critical))) {
      console.log(`🚀 Precargando ruta crítica: ${routePath}`);
      return load();
    }

    // Precargar rutas con delay para no bloquear la inicial
    if (this.delayedRoutes.some(delayed => routePath.includes(delayed))) {
      console.log(`⏱️ Precargando ruta con delay: ${routePath}`);
      return timer(2000).pipe(() => load());
    }

    // Precargar rutas admin solo en conexiones rápidas
    if (this.adminRoutes.some(admin => routePath.includes(admin))) {
      if (this.isOnFastConnection()) {
        console.log(`👨‍💼 Precargando ruta admin: ${routePath}`);
        return timer(5000).pipe(() => load());
      }
      return of(null);
    }

    // No precargar otras rutas por defecto
    return of(null);
  }

  private isOnFastConnection(): boolean {
    // Verificar tipo de conexión si está disponible
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      return connection.effectiveType === '4g' || connection.downlink > 2;
    }
    return true; // Asumir conexión rápida si no hay información
  }
}
