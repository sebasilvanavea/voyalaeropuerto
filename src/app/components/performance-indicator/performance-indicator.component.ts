import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PerformanceOptimizationService } from '../../services/performance-optimization.service';
import { Observable, interval, map, startWith } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-performance-indicator',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div 
      *ngIf="isVisible && (loadingState$ | async)?.isLoading" 
      class="performance-indicator show"
      [class.slow-connection]="isSlowConnection">
      
      <div class="flex items-center space-x-2">
        <!-- Loading spinner -->
        <div class="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
        
        <!-- Message and progress -->
        <div class="flex flex-col">
          <span class="text-xs font-medium">{{ (loadingState$ | async)?.message }}</span>
          <div class="w-20 h-1 bg-gray-600 rounded-full mt-1">
            <div 
              class="h-full bg-white rounded-full transition-all duration-300"
              [style.width.%]="(loadingState$ | async)?.progress || 0">
            </div>
          </div>
        </div>
        
        <!-- Connection speed indicator -->
        <div class="text-xs opacity-70">
          {{ connectionSpeed }}
        </div>
      </div>
    </div>

    <!-- Performance metrics (development only) -->
    <div 
      *ngIf="showMetrics && isDevelopment"
      class="fixed bottom-20 right-4 bg-black bg-opacity-80 text-white p-3 rounded-lg text-xs">
      <div>FPS: {{ currentFps$ | async }}</div>
      <div>Memoria: {{ memoryUsage }}MB</div>
      <div>Conexión: {{ connectionSpeed }}</div>
      <div>Imágenes: {{ imageStats.cachedImages }}</div>
    </div>
  `,
  styles: [`
    .performance-indicator {
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: rgba(0, 0, 0, 0.9);
      backdrop-filter: blur(10px);
      color: white;
      padding: 12px 16px;
      border-radius: 8px;
      font-size: 12px;
      z-index: 9999;
      opacity: 0;
      transition: all 0.3s ease;
      transform: translateY(20px);
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    }

    .performance-indicator.show {
      opacity: 1;
      transform: translateY(0);
    }

    .performance-indicator.slow-connection {
      background: rgba(239, 68, 68, 0.9);
    }

    @media (max-width: 640px) {
      .performance-indicator {
        bottom: 10px;
        right: 10px;
        padding: 8px 12px;
        font-size: 11px;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .performance-indicator {
        transition: none;
      }
      
      .animate-spin {
        animation: none;
      }
    }
  `]
})
export class PerformanceIndicatorComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private performanceService = inject(PerformanceOptimizationService);

  loadingState$ = this.performanceService.loadingState$;
  isVisible = true;
  showMetrics = false;
  isDevelopment = false;
  isSlowConnection = false;
  connectionSpeed = '';
  memoryUsage = 0;
  imageStats: any = {};

  // FPS monitoring
  currentFps$: Observable<number>;
  private fpsFrames: number[] = [];
  private lastTime = performance.now();

  constructor() {
    this.isDevelopment = false; // Simplificado para evitar errores
    this.detectConnectionSpeed();
    this.updateMemoryUsage();
    
    // Setup FPS monitoring
    this.currentFps$ = interval(1000).pipe(
      startWith(0),
      map(() => this.calculateFPS()),
      takeUntil(this.destroy$)
    );
  }

  ngOnInit(): void {
    // Auto-hide después de un tiempo sin actividad
    this.loadingState$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(state => {
      if (!state.isLoading) {
        setTimeout(() => {
          this.isVisible = false;
        }, 3000);
      } else {
        this.isVisible = true;
      }
    });

    // Update performance metrics
    if (this.isDevelopment) {
      interval(2000).pipe(
        takeUntil(this.destroy$)
      ).subscribe(() => {
        this.updateMetrics();
      });
    }

    // Monitor FPS
    this.monitorFPS();
  }

  private detectConnectionSpeed(): void {
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      this.connectionSpeed = connection.effectiveType || 'unknown';
      this.isSlowConnection = connection.effectiveType === '2g' || 
                             connection.effectiveType === 'slow-2g';
    } else {
      this.connectionSpeed = 'unknown';
    }
  }

  private updateMemoryUsage(): void {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      this.memoryUsage = Math.round(memory.usedJSHeapSize / 1024 / 1024);
    }
  }

  private updateMetrics(): void {
    this.updateMemoryUsage();
    this.imageStats = this.performanceService.getImageStats?.() || {};
  }

  private monitorFPS(): void {
    const monitor = (currentTime: number) => {
      this.fpsFrames.push(currentTime);
      
      // Keep only last second of frames
      while (this.fpsFrames.length > 0 && this.fpsFrames[0] <= currentTime - 1000) {
        this.fpsFrames.shift();
      }
      
      requestAnimationFrame(monitor);
    };
    
    requestAnimationFrame(monitor);
  }

  private calculateFPS(): number {
    return this.fpsFrames.length;
  }

  toggleMetrics(): void {
    this.showMetrics = !this.showMetrics;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
