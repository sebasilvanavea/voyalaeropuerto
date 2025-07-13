import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-skeleton',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="skeleton-container" [ngClass]="containerClass">
      <div 
        *ngFor="let item of skeletonItems" 
        class="skeleton-item"
        [ngClass]="[item.class, 'animate-pulse']"
        [style.height.px]="item.height"
        [style.width]="item.width"
        [style.margin-bottom.px]="item.marginBottom || 12">
      </div>
    </div>
  `,
  styles: [`
    .skeleton-container {
      @apply p-4 space-y-3;
    }
    
    .skeleton-item {
      @apply bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg;
      background-size: 200% 100%;
      animation: shimmer 1.5s infinite;
    }
    
    @keyframes shimmer {
      0% {
        background-position: -200% 0;
      }
      100% {
        background-position: 200% 0;
      }
    }
    
    .skeleton-card {
      @apply rounded-xl;
    }
    
    .skeleton-text {
      @apply rounded-md;
    }
    
    .skeleton-button {
      @apply rounded-lg;
    }
    
    .skeleton-image {
      @apply rounded-lg;
    }
    
    .skeleton-circle {
      @apply rounded-full;
    }
    
    /* Dark mode support */
    .dark .skeleton-item {
      @apply bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700;
    }
    
    /* Reduced motion */
    @media (prefers-reduced-motion: reduce) {
      .skeleton-item {
        animation: none;
        @apply bg-gray-200;
      }
      
      .dark .skeleton-item {
        @apply bg-gray-700;
      }
    }
  `]
})
export class SkeletonComponent {
  @Input() type: 'card' | 'text' | 'list' | 'hero' | 'services' | 'custom' = 'card';
  @Input() containerClass = '';
  @Input() customItems: any[] = [];

  get skeletonItems() {
    if (this.type === 'custom' && this.customItems.length > 0) {
      return this.customItems;
    }

    switch (this.type) {
      case 'hero':
        return [
          { height: 60, width: '70%', class: 'skeleton-text', marginBottom: 16 },
          { height: 24, width: '90%', class: 'skeleton-text', marginBottom: 12 },
          { height: 24, width: '80%', class: 'skeleton-text', marginBottom: 24 },
          { height: 48, width: '200px', class: 'skeleton-button' }
        ];
      
      case 'services':
        return [
          { height: 200, width: '100%', class: 'skeleton-image', marginBottom: 16 },
          { height: 32, width: '80%', class: 'skeleton-text', marginBottom: 12 },
          { height: 20, width: '100%', class: 'skeleton-text', marginBottom: 8 },
          { height: 20, width: '90%', class: 'skeleton-text', marginBottom: 8 },
          { height: 20, width: '70%', class: 'skeleton-text' }
        ];
      
      case 'card':
        return [
          { height: 200, width: '100%', class: 'skeleton-card', marginBottom: 16 },
          { height: 24, width: '80%', class: 'skeleton-text', marginBottom: 12 },
          { height: 16, width: '100%', class: 'skeleton-text', marginBottom: 8 },
          { height: 16, width: '60%', class: 'skeleton-text' }
        ];
      
      case 'text':
        return [
          { height: 16, width: '100%', class: 'skeleton-text', marginBottom: 8 },
          { height: 16, width: '90%', class: 'skeleton-text', marginBottom: 8 },
          { height: 16, width: '80%', class: 'skeleton-text' }
        ];
      
      case 'list':
        return Array(5).fill(null).map(() => ({
          height: 60,
          width: '100%',
          class: 'skeleton-card',
          marginBottom: 12
        }));
      
      default:
        return [
          { height: 200, width: '100%', class: 'skeleton-card' }
        ];
    }
  }
}
