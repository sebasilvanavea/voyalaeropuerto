import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuoteFormComponent } from '../quote/quote-form.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-quote-section',
  standalone: true,
  imports: [CommonModule, QuoteFormComponent, TranslateModule],
  template: `
    <!-- Quote/Cotizar Section -->
    <section id="cotizar" class="py-20 bg-white scroll-mt-20">
      <div class="max-w-6xl mx-auto px-6 lg:px-8">
        <div class="text-center mb-12">
          <span class="inline-block px-4 py-2 bg-amber-100 text-amber-800 rounded-full text-sm font-semibold mb-4 animate-fadeInUp">
            {{ 'QUOTE_SECTION.BADGE' | translate }}
          </span>
          <h2 class="text-4xl md:text-5xl font-bold text-gray-900 mb-6 animate-fadeInUp delay-100">
            {{ 'QUOTE_SECTION.TITLE_PART_1' | translate }}
            <span class="bg-gradient-to-r from-amber-500 to-yellow-500 bg-clip-text text-transparent">
              {{ 'QUOTE_SECTION.TITLE_PART_2' | translate }}
            </span>
            {{ 'QUOTE_SECTION.TITLE_PART_3' | translate }}
          </h2>
          <p class="text-xl text-gray-600 max-w-3xl mx-auto animate-fadeInUp delay-200">
            {{ 'QUOTE_SECTION.SUBTITLE' | translate }}
          </p>
        </div>
        
        <div class="bg-gray-50 rounded-3xl shadow-lg border border-gray-200 p-8 md:p-12 animate-fadeInUp delay-300 hover:shadow-xl transition-all duration-500">
          <app-quote-form></app-quote-form>
        </div>
      </div>
    </section>
  `,
  styles: [`
    /* Animation keyframes */
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

    /* Animation classes */
    .animate-fadeInUp {
      animation: fadeInUp 0.8s ease-out forwards;
    }

    .delay-100 {
      animation-delay: 0.1s;
    }

    .delay-200 {
      animation-delay: 0.2s;
    }

    .delay-300 {
      animation-delay: 0.3s;
    }

    .delay-400 {
      animation-delay: 0.4s;
    }

    .delay-500 {
      animation-delay: 0.5s;
    }

    /* Hover effects */
    .hover\:shadow-xl:hover {
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15);
    }
  `]
})
export class QuoteSectionComponent {
}
