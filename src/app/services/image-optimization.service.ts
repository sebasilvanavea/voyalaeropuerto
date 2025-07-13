import { Injectable } from '@angular/core';

interface ImageOptimizationOptions {
  quality?: number;
  format?: 'webp' | 'jpg' | 'png' | 'auto';
  width?: number;
  height?: number;
  lazy?: boolean;
  placeholder?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ImageOptimizationService {
  
  private imageCache = new Map<string, HTMLImageElement>();
  private intersectionObserver?: IntersectionObserver;
  private isSlowConnection = false;

  constructor() {
    this.initializeService();
  }

  private initializeService(): void {
    this.detectConnectionSpeed();
    this.setupIntersectionObserver();
  }

  private detectConnectionSpeed(): void {
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      this.isSlowConnection = connection.effectiveType === '2g' || 
                             connection.effectiveType === 'slow-2g' ||
                             connection.downlink < 0.5;
    }
  }

  private setupIntersectionObserver(): void {
    if ('IntersectionObserver' in window) {
      this.intersectionObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              this.loadImage(entry.target as HTMLImageElement);
              this.intersectionObserver?.unobserve(entry.target);
            }
          });
        },
        {
          rootMargin: this.isSlowConnection ? '0px' : '50px',
          threshold: 0.1
        }
      );
    }
  }

  // Optimizar URL de imagen
  optimizeImageUrl(src: string, options: ImageOptimizationOptions = {}): string {
    const {
      quality = this.isSlowConnection ? 70 : 85,
      format = 'auto',
      width,
      height
    } = options;

    // Si es una imagen local, devolver tal cual
    if (src.startsWith('/assets/') || src.startsWith('./')) {
      return src;
    }

    // Para servicios como Cloudinary, Imagekit, etc.
    if (src.includes('cloudinary.com')) {
      return this.optimizeCloudinaryUrl(src, { quality, format, width, height });
    }

    // Para otros servicios o CDNs
    return src;
  }

  private optimizeCloudinaryUrl(src: string, options: any): string {
    const { quality, format, width, height } = options;
    
    // Insertar parámetros de optimización en URL de Cloudinary
    const params = [];
    if (quality) params.push(`q_${quality}`);
    if (format && format !== 'auto') params.push(`f_${format}`);
    if (width) params.push(`w_${width}`);
    if (height) params.push(`h_${height}`);
    
    // Detectar formato de imagen automáticamente
    if (format === 'auto') {
      params.push('f_auto');
    }

    const transformations = params.join(',');
    return src.replace('/upload/', `/upload/${transformations}/`);
  }

  // Crear imagen con lazy loading
  createLazyImage(src: string, options: ImageOptimizationOptions = {}): HTMLImageElement {
    const img = document.createElement('img');
    const optimizedSrc = this.optimizeImageUrl(src, options);
    
    // Configurar atributos
    img.dataset['src'] = optimizedSrc;
    img.classList.add('lazy-image');
    
    // Placeholder mientras carga
    if (options.placeholder) {
      img.src = options.placeholder;
    } else {
      img.src = this.generatePlaceholder(options.width, options.height);
    }

    // Agregar a intersection observer
    if (this.intersectionObserver) {
      this.intersectionObserver.observe(img);
    }

    return img;
  }

  // Generar placeholder SVG
  private generatePlaceholder(width = 400, height = 300): string {
    const svg = `
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#f3f4f6"/>
        <text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#9ca3af" font-family="Arial, sans-serif" font-size="14">
          Cargando...
        </text>
      </svg>
    `;
    return `data:image/svg+xml;base64,${btoa(svg)}`;
  }

  // Cargar imagen lazy
  private loadImage(img: HTMLImageElement): void {
    const src = img.dataset['src'];
    if (!src) return;

    // Si ya está en cache, usar imagen cacheada
    if (this.imageCache.has(src)) {
      const cachedImg = this.imageCache.get(src)!;
      img.src = cachedImg.src;
      img.classList.remove('lazy-image');
      img.classList.add('loaded');
      return;
    }

    // Crear nueva imagen para precargar
    const newImg = new Image();
    newImg.onload = () => {
      // Cachear imagen
      this.imageCache.set(src, newImg);
      
      // Aplicar imagen con fade-in
      img.style.opacity = '0';
      img.src = newImg.src;
      img.classList.remove('lazy-image');
      
      // Animar entrada
      requestAnimationFrame(() => {
        img.style.transition = 'opacity 0.3s ease-in-out';
        img.style.opacity = '1';
        img.classList.add('loaded');
      });
    };
    
    newImg.onerror = () => {
      img.src = this.generatePlaceholder();
      img.classList.add('error');
    };
    
    newImg.src = src;
  }

  // Precargar imagen crítica
  preloadImage(src: string, options: ImageOptimizationOptions = {}): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const optimizedSrc = this.optimizeImageUrl(src, options);
      
      if (this.imageCache.has(optimizedSrc)) {
        resolve(this.imageCache.get(optimizedSrc)!);
        return;
      }

      const img = new Image();
      img.onload = () => {
        this.imageCache.set(optimizedSrc, img);
        resolve(img);
      };
      img.onerror = reject;
      img.src = optimizedSrc;
    });
  }

  // Obtener estadísticas de performance de imágenes
  getImageStats(): any {
    return {
      cachedImages: this.imageCache.size,
      isSlowConnection: this.isSlowConnection,
      observerActive: !!this.intersectionObserver
    };
  }

  // Limpiar cache
  clearCache(): void {
    this.imageCache.clear();
  }
}
