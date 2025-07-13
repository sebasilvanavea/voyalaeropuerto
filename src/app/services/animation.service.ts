import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface AnimationState {
  isLoading: boolean;
  currentPhase: string;
  progress: number;
}

@Injectable({
  providedIn: 'root'
})
export class AnimationService {
  
  private animationState = new BehaviorSubject<AnimationState>({
    isLoading: true,
    currentPhase: 'initializing',
    progress: 0
  });

  public animationState$ = this.animationState.asObservable();

  constructor() {}

  // Simulate loading with realistic phases
  startLoadingSequence(): Observable<AnimationState> {
    const phases = [
      { name: 'initializing', duration: 500, message: 'Inicializando sistema...' },
      { name: 'loading-assets', duration: 800, message: 'Cargando recursos...' },
      { name: 'preparing-ui', duration: 600, message: 'Preparando interfaz...' },
      { name: 'finishing', duration: 300, message: 'Finalizando...' }
    ];

    let currentProgress = 0;
    const totalDuration = phases.reduce((sum, phase) => sum + phase.duration, 0);

    phases.forEach((phase, index) => {
      setTimeout(() => {
        currentProgress += phase.duration;
        const progress = (currentProgress / totalDuration) * 100;
        
        this.animationState.next({
          isLoading: index < phases.length - 1,
          currentPhase: phase.name,
          progress: Math.min(progress, 100)
        });
      }, currentProgress);
    });

    return this.animationState$;
  }

  // Utility functions for common animations
  fadeInSequence(elements: HTMLElement[], delay = 150): void {
    elements.forEach((element, index) => {
      setTimeout(() => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        
        requestAnimationFrame(() => {
          element.style.opacity = '1';
          element.style.transform = 'translateY(0)';
        });
      }, index * delay);
    });
  }

  // Smooth scroll with custom easing
  smoothScrollTo(target: number, duration = 1000): Promise<void> {
    return new Promise((resolve) => {
      const start = window.pageYOffset;
      const distance = target - start;
      let startTime: number | null = null;

      const easeInOutCubic = (t: number): number => {
        return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
      };

      const animateScroll = (currentTime: number) => {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / duration, 1);
        const ease = easeInOutCubic(progress);
        
        window.scrollTo(0, start + distance * ease);
        
        if (progress < 1) {
          requestAnimationFrame(animateScroll);
        } else {
          resolve();
        }
      };

      requestAnimationFrame(animateScroll);
    });
  }

  // Page transition animations
  pageTransition(direction: 'in' | 'out' = 'in'): void {
    const body = document.body;
    
    if (direction === 'out') {
      body.style.opacity = '0';
      body.style.transform = 'scale(0.98)';
      body.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    } else {
      body.style.opacity = '1';
      body.style.transform = 'scale(1)';
      body.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    }
  }

  // Performance-optimized animations
  optimizeAnimations(): void {
    // Enable hardware acceleration for better performance
    const animatedElements = document.querySelectorAll('.hero-booking-card, .booking-step, .primary-button');
    
    animatedElements.forEach(element => {
      const el = element as HTMLElement;
      el.style.willChange = 'transform';
      el.style.backfaceVisibility = 'hidden';
      el.style.perspective = '1000px';
    });
  }

  // Clean up animations to prevent memory leaks
  cleanupAnimations(): void {
    const animatedElements = document.querySelectorAll('[style*="will-change"]');
    
    animatedElements.forEach(element => {
      const el = element as HTMLElement;
      el.style.willChange = 'auto';
    });
  }

  // Create ripple effect for buttons
  createRippleEffect(event: MouseEvent, element: HTMLElement): void {
    const ripple = document.createElement('span');
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.classList.add('ripple');

    // Add ripple styles
    ripple.style.position = 'absolute';
    ripple.style.borderRadius = '50%';
    ripple.style.background = 'rgba(255, 255, 255, 0.3)';
    ripple.style.transform = 'scale(0)';
    ripple.style.animation = 'ripple 0.6s linear';
    ripple.style.pointerEvents = 'none';

    element.style.position = 'relative';
    element.style.overflow = 'hidden';
    element.appendChild(ripple);

    // Remove ripple after animation
    setTimeout(() => {
      ripple.remove();
    }, 600);
  }

  // Intersection Observer for scroll animations
  observeScrollAnimations(): void {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    // Observe elements with animate-on-scroll class
    document.querySelectorAll('.animate-on-scroll').forEach(el => {
      observer.observe(el);
    });
  }
}
