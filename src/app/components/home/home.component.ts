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
  }

  ngAfterViewInit(): void {
    // Analizar rendimiento después de la carga inicial
    setTimeout(() => {
      this.performanceService.analyzePerformance();
      this.performanceService.hideLoading();
    }, 100);
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
