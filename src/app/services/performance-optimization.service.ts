import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

interface LoadingState {
  isLoading: boolean;
  loadingType: 'initial' | 'component' | 'data' | 'navigation';
  message: string;
  progress: number;
}

@Injectable({
  providedIn: 'root'
})
export class PerformanceOptimizationService {
  
  private loadingStateSubject = new BehaviorSubject<LoadingState>({
    isLoading: false,
    loadingType: 'initial',
    message: '',
    progress: 0
  });

  public loadingState$ = this.loadingStateSubject.asObservable();

  // Cache para componentes ya cargados
  private componentCache = new Map<string, any>();
  
  // Queue de recursos a precargar
  private preloadQueue: string[] = [];

  constructor() {
    this.initPerformanceOptimizations();
  }

  // Inicializar optimizaciones de rendimiento
  private initPerformanceOptimizations(): void {
    // Precargar recursos críticos en idle time
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(() => {
        this.preloadCriticalResources();
      });
    } else {
      // Fallback para navegadores que no soportan requestIdleCallback
      setTimeout(() => this.preloadCriticalResources(), 1000);
    }

    // Observer para intersection (lazy loading de imágenes)
    this.setupIntersectionObserver();
  }

  // Precargar recursos críticos
  private preloadCriticalResources(): void {
    const criticalImages = [
      '/assets/logo1.png',
      '/assets/fondo.jpg'
    ];

    const criticalFonts = [
      'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'
    ];

    // Precargar imágenes críticas
    criticalImages.forEach(src => this.preloadImage(src));
    
    // Precargar fuentes críticas
    criticalFonts.forEach(href => this.preloadFont(href));
  }

  // Precargar imagen
  private preloadImage(src: string): void {
    const img = new Image();
    img.onload = () => console.log(`✅ Imagen precargada: ${src}`);
    img.onerror = () => console.warn(`❌ Error cargando imagen: ${src}`);
    img.src = src;
  }

  // Precargar fuente
  private preloadFont(href: string): void {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'font';
    link.href = href;
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  }

  // Configurar intersection observer para lazy loading
  private setupIntersectionObserver(): void {
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            if (img.dataset['src']) {
              img.src = img.dataset['src'];
              img.classList.remove('lazy');
              observer.unobserve(img);
            }
          }
        });
      }, {
        rootMargin: '50px'
      });

      // Observar imágenes lazy cuando se agreguen al DOM
      this.observeLazyImages(observer);
    }
  }

  // Observar imágenes lazy
  private observeLazyImages(observer: IntersectionObserver): void {
    // Observer para nuevas imágenes que se agreguen dinámicamente
    const mutationObserver = new MutationObserver((mutations) => {
      mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node as Element;
            const lazyImages = element.querySelectorAll('img.lazy');
            lazyImages.forEach(img => observer.observe(img));
          }
        });
      });
    });

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  // Actualizar estado de carga
  updateLoadingState(state: Partial<LoadingState>): void {
    const currentState = this.loadingStateSubject.value;
    this.loadingStateSubject.next({
      ...currentState,
      ...state
    });
  }

  // Mostrar loading para componente específico
  showComponentLoading(componentName: string): void {
    this.updateLoadingState({
      isLoading: true,
      loadingType: 'component',
      message: `Cargando ${componentName}...`,
      progress: 0
    });
  }

  // Ocultar loading
  hideLoading(): void {
    this.updateLoadingState({
      isLoading: false,
      progress: 100
    });
  }

  // Simular progreso de carga con mayor realismo
  simulateProgress(duration: number = 2000): void {
    let progress = 0;
    const steps = [10, 25, 40, 60, 75, 85, 95, 100];
    let currentStep = 0;
    
    const interval = setInterval(() => {
      if (currentStep < steps.length) {
        progress = steps[currentStep];
        this.updateLoadingState({ progress });
        currentStep++;
        
        if (progress >= 100) {
          clearInterval(interval);
          setTimeout(() => this.hideLoading(), 200);
        }
      }
    }, duration / steps.length);
  }

  // Nuevo: Progressive enhancement
  enableProgressiveEnhancement(): void {
    // Detectar capacidades del dispositivo
    const capabilities = this.getDeviceCapabilities();
    
    // Aplicar optimizaciones basadas en capacidades
    if (capabilities.lowEnd) {
      document.documentElement.classList.add('low-end-device');
      this.optimizeForLowEnd();
    }

    if (capabilities.supportsPWA) {
      this.enablePWAFeatures();
    }

    if (capabilities.supportsWebP) {
      document.documentElement.classList.add('webp-support');
    }
  }

  private getDeviceCapabilities(): any {
    const isLowEnd = navigator.hardwareConcurrency <= 2 || 
                     (navigator as any).deviceMemory <= 2;
    
    return {
      lowEnd: isLowEnd,
      supportsPWA: 'serviceWorker' in navigator,
      supportsWebP: this.supportsWebP(),
      supportsIntersectionObserver: 'IntersectionObserver' in window,
      connectionSpeed: this.getConnectionSpeed()
    };
  }

  private supportsWebP(): boolean {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    return canvas.toDataURL('image/webp').indexOf('webp') > -1;
  }

  private getConnectionSpeed(): string {
    if ('connection' in navigator) {
      return (navigator as any).connection.effectiveType || 'unknown';
    }
    return 'unknown';
  }

  private optimizeForLowEnd(): void {
    // Reducir animaciones
    document.documentElement.style.setProperty('--animation-duration', '0.1s');
    
    // Deshabilitar efectos costosos
    document.documentElement.classList.add('reduce-effects');
    
    console.log('🔧 Optimizaciones para dispositivos de gama baja aplicadas');
  }

  private enablePWAFeatures(): void {
    // Registrar service worker si está disponible
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/firebase-messaging-sw.js')
        .then(() => console.log('✅ Service Worker registrado'))
        .catch(err => console.warn('❌ Error registrando Service Worker:', err));
    }
  }

  // Cache de componente
  cacheComponent(key: string, component: any): void {
    this.componentCache.set(key, component);
  }

  // Obtener componente del cache
  getCachedComponent(key: string): any {
    return this.componentCache.get(key);
  }

  // Verificar si el componente está en cache
  isComponentCached(key: string): boolean {
    return this.componentCache.has(key);
  }

  // Analizar rendimiento de carga
  analyzePerformance(): void {
    if ('performance' in window) {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      const paint = performance.getEntriesByType('paint');
      
      console.group('📊 Análisis de Rendimiento');
      console.log(`⏱️ DOM Content Loaded: ${navigation.domContentLoadedEventEnd - navigation.fetchStart}ms`);
      console.log(`🎨 First Paint: ${paint.find(p => p.name === 'first-paint')?.startTime}ms`);
      console.log(`🖼️ First Contentful Paint: ${paint.find(p => p.name === 'first-contentful-paint')?.startTime}ms`);
      console.log(`📦 Load Complete: ${navigation.loadEventEnd - navigation.fetchStart}ms`);
      console.groupEnd();
    }
  }

  // Detectar conexión lenta
  isSlowConnection(): boolean {
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      return connection.effectiveType === '2g' || connection.effectiveType === 'slow-2g';
    }
    return false;
  }

  // Optimizar para conexiones lentas
  optimizeForSlowConnection(): void {
    if (this.isSlowConnection()) {
      console.log('🐌 Conexión lenta detectada - Aplicando optimizaciones');
      
      // Reducir calidad de imágenes
      document.documentElement.classList.add('slow-connection');
      
      // Deshabilitar animaciones no críticas
      document.documentElement.classList.add('reduce-animations');
      
      // Precargar menos recursos
      this.preloadQueue = this.preloadQueue.slice(0, 2);
    }
  }

  // Obtener estadísticas de imágenes y performance
  getImageStats(): any {
    return {
      cachedComponents: this.componentCache.size,
      preloadQueue: this.preloadQueue.length,
      slowConnection: this.isSlowConnection(),
      observerActive: true
    };
  }
}
