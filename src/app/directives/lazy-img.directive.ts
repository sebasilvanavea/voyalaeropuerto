import { Directive, ElementRef, Input, OnInit, OnDestroy, inject } from '@angular/core';
import { ImageOptimizationService } from '../services/image-optimization.service';

@Directive({
  selector: '[appLazyImg]',
  standalone: true
})
export class LazyImgDirective implements OnInit, OnDestroy {
  @Input('appLazyImg') src!: string;
  @Input() quality?: number;
  @Input() format?: 'webp' | 'jpg' | 'png' | 'auto';
  @Input() width?: number;
  @Input() height?: number;
  @Input() placeholder?: string;

  private element = inject(ElementRef);
  private imageService = inject(ImageOptimizationService);
  private observer?: IntersectionObserver;

  ngOnInit(): void {
    this.setupLazyLoading();
  }

  private setupLazyLoading(): void {
    const img = this.element.nativeElement as HTMLImageElement;
    
    // Configurar placeholder inicial
    if (this.placeholder) {
      img.src = this.placeholder;
    } else {
      img.src = this.generatePlaceholder();
    }

    // Configurar clases CSS
    img.classList.add('lazy-image', 'opacity-0', 'transition-opacity', 'duration-300');

    // Configurar intersection observer
    if ('IntersectionObserver' in window) {
      this.observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              this.loadImage();
              this.observer?.unobserve(entry.target);
            }
          });
        },
        {
          rootMargin: '50px',
          threshold: 0.1
        }
      );

      this.observer.observe(img);
    } else {
      // Fallback para navegadores sin IntersectionObserver
      setTimeout(() => this.loadImage(), 100);
    }
  }

  private loadImage(): void {
    const img = this.element.nativeElement as HTMLImageElement;
    
    const optimizedSrc = this.imageService.optimizeImageUrl(this.src, {
      quality: this.quality,
      format: this.format,
      width: this.width,
      height: this.height
    });

    // Precargar imagen optimizada
    this.imageService.preloadImage(optimizedSrc)
      .then(() => {
        img.src = optimizedSrc;
        img.classList.remove('lazy-image', 'opacity-0');
        img.classList.add('opacity-100', 'loaded');
      })
      .catch(() => {
        img.src = this.generatePlaceholder();
        img.classList.add('error');
      });
  }

  private generatePlaceholder(): string {
    const width = this.width || 400;
    const height = this.height || 300;
    
    const svg = `
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="shimmer" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style="stop-color:#f3f4f6;stop-opacity:1" />
            <stop offset="50%" style="stop-color:#e5e7eb;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#f3f4f6;stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#shimmer)">
          <animateTransform
            attributeName="transform"
            type="translate"
            values="-100 0;100 0;-100 0"
            dur="2s"
            repeatCount="indefinite"
          />
        </rect>
        <text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#9ca3af" font-family="Arial, sans-serif" font-size="14">
          📷
        </text>
      </svg>
    `;
    
    return `data:image/svg+xml;base64,${btoa(svg)}`;
  }

  ngOnDestroy(): void {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}
