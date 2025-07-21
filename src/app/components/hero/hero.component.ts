import { Component, ChangeDetectorRef, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BookingComponent } from '../booking/booking.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule, RouterModule, BookingComponent, TranslateModule],
  template: `
    <section class="relative flex items-center justify-center w-full overflow-hidden min-h-[450px] max-h-[900px] md:min-h-[600px] md:max-h-[1000px]" style="height:100vh;">
      <img src="/assets/fondo.jpg" alt="Fondo aeropuerto" class="absolute inset-0 w-full h-full object-cover object-center z-0 opacity-60" />
      <div class="absolute inset-0 bg-gradient-to-b from-blue-900/30 to-blue-700/80 z-10"></div>
      <div class="container mx-auto flex flex-col md:flex-row items-center justify-center gap-12 relative z-20 min-h-[450px] max-h-[900px] md:min-h-[600px] md:max-h-[1000px]">
        <div class="w-full md:w-1/2 text-center md:text-left flex flex-col justify-center">
          <h1 class="text-4xl md:text-6xl font-extrabold text-white mb-6 tracking-tight drop-shadow-lg">
            {{ 'HERO_TITLE' | translate }}
          </h1>
          <p class="text-lg md:text-xl text-blue-100 mb-8 max-w-xl mx-auto md:mx-0">
            {{ 'HERO_SUBTITLE' | translate }}
          </p>
        </div>
        <div class="w-full md:w-1/2 flex justify-center items-center">
          <div class="bg-white rounded-2xl shadow-2xl p-4 sm:p-6 w-full max-w-sm border-t-4 border-accent flex items-center justify-center min-h-[420px]">
            <app-booking variant="hero"></app-booking>
          </div>
        </div>
      </div>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeroComponent implements OnDestroy {
  private destroy$ = new Subject<void>();

  constructor(private cd: ChangeDetectorRef, private translate: TranslateService) {
    this.translate.onLangChange
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.cd.markForCheck();
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}