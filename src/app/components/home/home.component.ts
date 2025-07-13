import { Component, ChangeDetectorRef, OnDestroy, OnInit, AfterViewInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { PerformanceOptimizationService } from '../../services/performance-optimization.service';

// Import individual section components
import { HeroNewComponent } from '../hero/hero-new.component';
import { TrustedSectionComponent } from '../trusted-section/trusted-section.component';
import { ServicesComponent } from '../services/services.component';
import { WhyChooseUsComponent } from '../how-it-works/how-it-works.component';
import { TarifasComponent } from '../tarifas/tarifas.component';
import { BookingSectionComponent } from '../booking-section/booking-section.component';
import { QuoteSectionComponent } from '../quote-section/quote-section.component';
import { ContactSectionComponent } from '../contact-section/contact-section.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    HeroNewComponent,
    TrustedSectionComponent,
    ServicesComponent,
    WhyChooseUsComponent,
    TarifasComponent,
    BookingSectionComponent,
    QuoteSectionComponent,
    ContactSectionComponent
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private performanceService = inject(PerformanceOptimizationService);
  
  // Control de carga progresiva
  sectionsLoaded = {
    hero: true,        // Carga inmediata
    trusted: false,    // Carga después del hero
    services: false,   // Carga después del scroll
    howItWorks: false, // Lazy load
    tarifas: false,    // Lazy load
    booking: false,    // Lazy load
    quote: false,      // Lazy load
    contact: false     // Lazy load
  };

  constructor(private translate: TranslateService, private cd: ChangeDetectorRef) {
    this.translate.onLangChange
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.cd.markForCheck();
      });
  }

  ngOnInit(): void {
    // Mostrar loading inicial con progreso realista
    this.performanceService.showComponentLoading('Página Principal');
    this.performanceService.simulateProgress(1500);
    
    // Habilitar progressive enhancement
    this.performanceService.enableProgressiveEnhancement();
    
    // Optimizar para conexiones lentas
    this.performanceService.optimizeForSlowConnection();
    
    // Cargar secciones progresivamente
    this.loadSectionsProgressively();
  }

  ngAfterViewInit(): void {
    // Analizar rendimiento después de la carga inicial
    setTimeout(() => {
      this.performanceService.analyzePerformance();
      this.performanceService.hideLoading();
    }, 100);

    // Configurar intersection observer para lazy loading
    this.setupLazyLoading();
  }

  private loadSectionsProgressively(): void {
    // Cargar trusted section después de un pequeño delay
    setTimeout(() => {
      this.sectionsLoaded.trusted = true;
      this.cd.detectChanges();
    }, 500);

    // Cargar services section después de más tiempo
    setTimeout(() => {
      this.sectionsLoaded.services = true;
      this.cd.detectChanges();
    }, 1000);
  }

  private setupLazyLoading(): void {
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const sectionId = entry.target.id;
              this.loadSection(sectionId);
              observer.unobserve(entry.target);
            }
          });
        },
        {
          rootMargin: '100px' // Cargar 100px antes de que sea visible
        }
      );

      // Observar elementos placeholder
      const placeholders = document.querySelectorAll('.section-placeholder');
      placeholders.forEach(placeholder => observer.observe(placeholder));
    } else {
      // Fallback para navegadores sin IntersectionObserver
      setTimeout(() => this.loadAllSections(), 2000);
    }
  }

  private loadSection(sectionId: string): void {
    switch (sectionId) {
      case 'how-it-works-placeholder':
        this.sectionsLoaded.howItWorks = true;
        break;
      case 'tarifas-placeholder':
        this.sectionsLoaded.tarifas = true;
        break;
      case 'booking-placeholder':
        this.sectionsLoaded.booking = true;
        break;
      case 'quote-placeholder':
        this.sectionsLoaded.quote = true;
        break;
      case 'contact-placeholder':
        this.sectionsLoaded.contact = true;
        break;
    }
    this.cd.detectChanges();
  }

  private loadAllSections(): void {
    Object.keys(this.sectionsLoaded).forEach(key => {
      this.sectionsLoaded[key as keyof typeof this.sectionsLoaded] = true;
    });
    this.cd.detectChanges();
  }

  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      const headerOffset = 80; // Altura del header fijo
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
