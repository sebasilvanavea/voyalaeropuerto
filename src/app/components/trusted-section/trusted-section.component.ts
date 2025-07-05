import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-trusted-section',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  template: `
    <!-- Trusted Section -->
    <section class="py-16 bg-white border-b border-gray-100">
      <div class="max-w-7xl mx-auto px-6 lg:px-8 text-center">
        <h2 class="text-2xl font-bold text-gray-900 mb-12">
          La confianza de más de 500+ viajeros satisfechos
        </h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8 items-center opacity-60">
          <div class="flex justify-center">
            <div class="w-24 h-12 bg-gray-200 rounded flex items-center justify-center text-gray-400 font-semibold">LOGO</div>
          </div>
          <div class="flex justify-center">
            <div class="w-24 h-12 bg-gray-200 rounded flex items-center justify-center text-gray-400 font-semibold">LOGO</div>
          </div>
          <div class="flex justify-center">
            <div class="w-24 h-12 bg-gray-200 rounded flex items-center justify-center text-gray-400 font-semibold">LOGO</div>
          </div>
          <div class="flex justify-center">
            <div class="w-24 h-12 bg-gray-200 rounded flex items-center justify-center text-gray-400 font-semibold">LOGO</div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .logo-hover {
      transition: all 0.3s ease;
    }
    
    .logo-hover:hover {
      opacity: 1;
      transform: scale(1.05);
    }
  `]
})
export class TrustedSectionComponent {}
