import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-how-it-works',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  template: `
    <!-- How it Works Section -->
    <section id="como-funciona" class="py-20 bg-white scroll-mt-20">
      <div class="max-w-7xl mx-auto px-6 lg:px-8">
        <div class="text-center mb-16">
          <span class="inline-block px-4 py-2 bg-yellow-100 text-yellow-800 rounded-full text-sm font-semibold mb-4">
            {{ 'HOW_IT_WORKS.SECTION_BADGE' | translate }}
          </span>
          <h2 class="text-4xl md:text-5xl font-bold text-gray-900">
            {{ 'HOW_IT_WORKS.TITLE' | translate }}
          </h2>
        </div>

        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div class="text-center group">
            <div class="relative mb-6">
              <div class="w-24 h-24 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-2xl mx-auto flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <svg class="w-12 h-12 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
                </svg>
              </div>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-4">{{ 'HOW_IT_WORKS.STEP_1_TITLE' | translate }}</h3>
            <p class="text-gray-600">
              {{ 'HOW_IT_WORKS.STEP_1_DESC' | translate }}
            </p>
          </div>

          <div class="text-center group">
            <div class="relative mb-6">
              <div class="w-24 h-24 bg-gradient-to-br from-amber-100 to-amber-200 rounded-2xl mx-auto flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <svg class="w-12 h-12 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H5m4 0V9a2 2 0 012-2h2a2 2 0 012 2v12M13 7h-2V5h2v2z"/>
                </svg>
              </div>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-4">{{ 'HOW_IT_WORKS.STEP_2_TITLE' | translate }}</h3>
            <p class="text-gray-600">
              {{ 'HOW_IT_WORKS.STEP_2_DESC' | translate }}
            </p>
          </div>

          <div class="text-center group">
            <div class="relative mb-6">
              <div class="w-24 h-24 bg-gradient-to-br from-orange-100 to-orange-200 rounded-2xl mx-auto flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <svg class="w-12 h-12 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"/>
                </svg>
              </div>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-4">{{ 'HOW_IT_WORKS.STEP_3_TITLE' | translate }}</h3>
            <p class="text-gray-600">
              {{ 'HOW_IT_WORKS.STEP_3_DESC' | translate }}
            </p>
          </div>

          <div class="text-center group">
            <div class="relative mb-6">
              <div class="w-24 h-24 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-2xl mx-auto flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <svg class="w-12 h-12 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"/>
                </svg>
              </div>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-4">{{ 'HOW_IT_WORKS.STEP_4_TITLE' | translate }}</h3>
            <p class="text-gray-600">
              {{ 'HOW_IT_WORKS.STEP_4_DESC' | translate }}
            </p>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .group:hover .group-hover\\:scale-110 {
      transform: scale(1.1);
    }

    .transition-transform {
      transition-property: transform;
      transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
      transition-duration: 300ms;
    }

    .duration-300 {
      transition-duration: 300ms;
    }

    /* Smooth scroll animations */
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .group {
      animation: fadeInUp 0.6s ease-out;
    }

    .group:nth-child(2) {
      animation-delay: 0.1s;
    }

    .group:nth-child(3) {
      animation-delay: 0.2s;
    }

    .group:nth-child(4) {
      animation-delay: 0.3s;
    }

    /* Hover effects */
    .group:hover {
      transform: translateY(-5px);
      transition: all 0.3s ease;
    }

    /* Icon container hover effects */
    .group:hover .w-24.h-24 {
      background: linear-gradient(135deg, #0891b2, #7c3aed);
      color: white;
    }

    .group:hover svg {
      color: white !important;
    }
  `]
})
export class HowItWorksComponent {}
