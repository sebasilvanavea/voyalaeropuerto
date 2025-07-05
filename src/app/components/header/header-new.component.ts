import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule],
  template: `
    <!-- Modern Header responsive inspirado en apiux.io -->
    <header class="fixed top-0 w-full z-50 transition-all duration-700 ease-in-out" 
            [ngClass]="{
              'bg-white/95 backdrop-blur-xl shadow-lg': isScrolled,
              'bg-gradient-to-b from-black/5 to-transparent backdrop-blur-sm': !isScrolled
            }"
            [style.border-bottom]="isScrolled ? '1px solid rgba(229, 231, 235, 0.3)' : '1px solid transparent'"
            style="backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px)">
      <div class="container-responsive">
        <div class="flex justify-between items-center h-14 sm:h-16 md:h-18 lg:h-20">
          
          <!-- Logo Section - Completamente responsive -->
          <div class="flex items-center min-w-0 flex-shrink-0 max-w-[60%] sm:max-w-none">
            <a (click)="scrollToSection('inicio')" class="flex items-center space-x-2 sm:space-x-3 cursor-pointer group">
              <div class="relative flex-shrink-0">
                <div class="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-lg sm:rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                  <svg class="w-4 h-4 sm:w-5 sm:h-5 md:w-5 md:h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
                  </svg>
                </div>
                <div class="absolute -top-0.5 -right-0.5 w-2 h-2 sm:w-3 sm:h-3 bg-green-400 rounded-full border border-white animate-pulse"></div>
              </div>
              <div class="min-w-0 overflow-hidden">
                <span class="block text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl font-bold transition-all duration-700 ease-in-out leading-tight"
                      [ngClass]="{
                        'text-gray-900': isScrolled,
                        'text-white drop-shadow-lg': !isScrolled
                      }">
                  <span class="xs:hidden">VoyalAeropuerto</span>
                  <span class="hidden xs:inline sm:hidden">VoyalAeropuerto</span>
                  <span class="hidden sm:inline lg:hidden">VoyalAeropuerto</span>
                  <span class="hidden lg:inline">VoyalAeropuerto</span>
                </span>
                <span class="block text-xs sm:text-xs md:text-sm font-medium opacity-80 leading-none mt-0.5"
                      [ngClass]="{
                        'text-gray-600': isScrolled,
                        'text-yellow-200': !isScrolled
                      }">
                </span>
              </div>
            </a>
          </div>

          <!-- Desktop Navigation - Hidden en mobile -->
          <nav class="hidden lg:flex items-center space-x-6 xl:space-x-8">
            <a (click)="scrollToSection('inicio')" 
               class="relative py-2 px-3 xl:px-4 text-sm font-semibold transition-all duration-700 ease-in-out cursor-pointer group rounded-lg whitespace-nowrap"
               [ngClass]="{
                 'text-gray-700 hover:text-gray-900 hover:bg-gray-50': isScrolled,
                 'text-white/90 hover:text-white hover:bg-white/10 drop-shadow-sm': !isScrolled
               }">
              {{ 'NAV.HOME' | translate }}
              <span class="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-amber-500 to-yellow-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center rounded-full"></span>
            </a>
            <a (click)="scrollToSection('servicios')" 
               class="relative py-2 px-3 xl:px-4 text-sm font-semibold transition-all duration-700 ease-in-out cursor-pointer group rounded-lg whitespace-nowrap"
               [ngClass]="{
                 'text-gray-700 hover:text-gray-900 hover:bg-gray-50': isScrolled,
                 'text-white/90 hover:text-white hover:bg-white/10 drop-shadow-sm': !isScrolled
               }">
              {{ 'NAV.SERVICES' | translate }}
              <span class="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-amber-500 to-yellow-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center rounded-full"></span>
            </a>
            <a (click)="scrollToSection('cotizar')" 
               class="relative py-2 px-3 xl:px-4 text-sm font-semibold transition-all duration-700 ease-in-out cursor-pointer group rounded-lg whitespace-nowrap"
               [ngClass]="{
                 'text-gray-700 hover:text-gray-900 hover:bg-gray-50': isScrolled,
                 'text-white/90 hover:text-white hover:bg-white/10 drop-shadow-sm': !isScrolled
               }">
              {{ 'NAV.QUOTE' | translate }}
              <span class="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-amber-500 to-yellow-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center rounded-full"></span>
            </a>
            <a (click)="scrollToSection('como-funciona')" 
               class="relative py-2 px-3 xl:px-4 text-sm font-semibold transition-all duration-700 ease-in-out cursor-pointer group rounded-lg whitespace-nowrap"
               [ngClass]="{
                 'text-gray-700 hover:text-gray-900 hover:bg-gray-50': isScrolled,
                 'text-white/90 hover:text-white hover:bg-white/10 drop-shadow-sm': !isScrolled
               }">
              {{ 'NAV.HOW_IT_WORKS' | translate }}
              <span class="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-amber-500 to-yellow-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center rounded-full"></span>
            </a>
          </nav>

          <!-- Action Section - Responsive -->
          <div class="flex items-center space-x-2 sm:space-x-3 md:space-x-4 flex-shrink-0">
            <!-- Language Selector - Hidden en móvil muy pequeño -->
            <div class="relative hidden xs:block">
              <button (click)="toggleLanguageMenu()" 
                      class="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg sm:rounded-xl transition-all duration-700 ease-in-out text-xs sm:text-sm font-medium"
                      [ngClass]="{
                        'text-gray-700 hover:text-gray-900 hover:bg-gray-50': isScrolled,
                        'text-white/90 hover:text-white hover:bg-white/10': !isScrolled
                      }">
                <img [src]="getCurrentLanguageFlag()" [alt]="getCurrentLanguage()" class="w-3 h-3 sm:w-4 sm:h-4 rounded">
                <span class="hidden sm:inline">{{ getCurrentLanguage() }}</span>
                <svg class="w-3 h-3 sm:w-4 sm:h-4 transition-transform duration-300" [class.rotate-180]="showLanguageMenu" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>
              
              <div *ngIf="showLanguageMenu" 
                   class="absolute right-0 mt-2 w-36 sm:w-44 bg-white rounded-lg sm:rounded-xl shadow-xl border border-gray-200 overflow-hidden z-50 animate-fadeInDown">
                <div class="py-1">
                  <button (click)="changeLanguage('es')" 
                          class="flex items-center space-x-2 sm:space-x-3 px-3 sm:px-4 py-2 sm:py-3 text-gray-700 hover:text-gray-900 hover:bg-gray-50 w-full text-left text-xs sm:text-sm transition-all duration-200">
                    <img src="/assets/i18n/es-flag.svg" alt="Español" class="w-3 h-3 sm:w-4 sm:h-4 rounded">
                    <span class="font-medium">Español</span>
                  </button>
                  <button (click)="changeLanguage('pt')" 
                          class="flex items-center space-x-2 sm:space-x-3 px-3 sm:px-4 py-2 sm:py-3 text-gray-700 hover:text-gray-900 hover:bg-gray-50 w-full text-left text-xs sm:text-sm transition-all duration-200">
                    <img src="/assets/i18n/pt-flag.svg" alt="Português" class="w-3 h-3 sm:w-4 sm:h-4 rounded">
                    <span class="font-medium">Português</span>
                  </button>
                </div>
              </div>
            </div>

            <!-- Contact Button - Hidden en móvil -->
            <button (click)="scrollToSection('contacto')" 
                    class="hidden md:inline-flex items-center px-3 lg:px-4 py-1.5 lg:py-2 text-xs lg:text-sm font-medium rounded-lg lg:rounded-xl transition-all duration-700 ease-in-out border whitespace-nowrap"
                    [ngClass]="{
                      'text-gray-700 hover:text-gray-900 hover:bg-gray-50 border-gray-200': isScrolled,
                      'text-white/90 hover:text-white hover:bg-white/10 border-white/20': !isScrolled
                    }">
              <svg class="w-3 h-3 lg:w-4 lg:h-4 mr-1 lg:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
              </svg>
              <span class="hidden lg:inline">{{ 'NAV.CONTACT' | translate }}</span>
              <span class="lg:hidden">{{ 'NAV.CONTACT' | translate }}</span>
            </button>

            <!-- CTA Button - Responsive -->
            <button (click)="navigateToBooking()" 
                    class="inline-flex items-center px-3 sm:px-4 lg:px-6 py-1.5 sm:py-2 lg:py-2.5 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-white text-xs sm:text-sm font-semibold rounded-lg sm:rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl whitespace-nowrap">
              <svg class="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0h6m-6 0l-2 13a2 2 0 002 2h6a2 2 0 002-2L14 7"/>
              </svg>
              <span class="hidden sm:inline">{{ 'NAV.BOOK_NOW' | translate }}</span>
              <span class="sm:hidden">{{ 'BOOKING.SUBMIT' | translate }}</span>
            </button>

            <!-- Mobile menu button -->
            <button (click)="toggleMobileMenu()" 
                    class="lg:hidden p-1.5 sm:p-2 rounded-lg sm:rounded-xl transition-all duration-700 ease-in-out"
                    [ngClass]="{
                      'text-gray-700 hover:text-gray-900 hover:bg-gray-50': isScrolled,
                      'text-white/90 hover:text-white hover:bg-white/10': !isScrolled
                    }">
              <svg class="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path *ngIf="!showMobileMenu" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
                <path *ngIf="showMobileMenu" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>

        <!-- Mobile Navigation - Completamente responsive -->
        <div *ngIf="showMobileMenu" 
             class="lg:hidden border-t mt-2 sm:mt-4 pt-3 sm:pt-6 pb-4 sm:pb-6 animate-fadeInDown transition-all duration-700 ease-in-out"
             [ngClass]="{
               'border-gray-200': isScrolled,
               'border-white/20': !isScrolled
             }">
          <div class="space-y-1 sm:space-y-2">
            <a (click)="scrollToSection('inicio'); toggleMobileMenu()"
               class="block px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl transition-all duration-700 ease-in-out cursor-pointer font-medium text-sm sm:text-base"
               [ngClass]="{
                 'text-gray-700 hover:text-gray-900 hover:bg-gray-50': isScrolled,
                 'text-white/90 hover:text-white hover:bg-white/10': !isScrolled
               }">
              {{ 'NAV.HOME' | translate }}
            </a>
            <a (click)="scrollToSection('servicios'); toggleMobileMenu()"
               class="block px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl transition-all duration-700 ease-in-out cursor-pointer font-medium text-sm sm:text-base"
               [ngClass]="{
                 'text-gray-700 hover:text-gray-900 hover:bg-gray-50': isScrolled,
                 'text-white/90 hover:text-white hover:bg-white/10': !isScrolled
               }">
              {{ 'NAV.SERVICES' | translate }}
            </a>
            <a (click)="scrollToSection('cotizar'); toggleMobileMenu()"
               class="block px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl transition-all duration-700 ease-in-out cursor-pointer font-medium text-sm sm:text-base"
               [ngClass]="{
                 'text-gray-700 hover:text-gray-900 hover:bg-gray-50': isScrolled,
                 'text-white/90 hover:text-white hover:bg-white/10': !isScrolled
               }">
              {{ 'NAV.QUOTE' | translate }}
            </a>
            <a (click)="scrollToSection('como-funciona'); toggleMobileMenu()"
               class="block px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl transition-all duration-700 ease-in-out cursor-pointer font-medium text-sm sm:text-base"
               [ngClass]="{
                 'text-gray-700 hover:text-gray-900 hover:bg-gray-50': isScrolled,
                 'text-white/90 hover:text-white hover:bg-white/10': !isScrolled
               }">
              {{ 'NAV.HOW_IT_WORKS' | translate }}
            </a>
            <a (click)="scrollToSection('contacto'); toggleMobileMenu()"
               class="block px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl transition-all duration-700 ease-in-out cursor-pointer font-medium text-sm sm:text-base"
               [ngClass]="{
                 'text-gray-700 hover:text-gray-900 hover:bg-gray-50': isScrolled,
                 'text-white/90 hover:text-white hover:bg-white/10': !isScrolled
               }">
              {{ 'NAV.CONTACT' | translate }}
            </a>
            
            <div class="pt-3 sm:pt-4 border-t transition-all duration-700 ease-in-out"
                 [ngClass]="{
                   'border-gray-200': isScrolled,
                   'border-white/20': !isScrolled
                 }">
              
              <!-- Language Selector Mobile - Responsive -->
              <div class="mb-3 sm:mb-4">
                <button (click)="toggleLanguageMenu()" 
                        class="flex items-center justify-between w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl transition-all duration-300 font-medium text-sm sm:text-base"
                        [class]="isScrolled ? 'text-gray-700 hover:text-gray-900 hover:bg-gray-50' : 'text-gray-200 hover:text-white hover:bg-white/10'">
                  <div class="flex items-center space-x-2 sm:space-x-3">
                    <img [src]="getCurrentLanguageFlag()" [alt]="getCurrentLanguage()" class="w-4 h-4 sm:w-5 sm:h-5 rounded">
                    <span>{{ getCurrentLanguage() === 'ES' ? 'Español' : 'Português' }}</span>
                  </div>
                  <svg class="w-4 h-4 transition-transform duration-300" [class.rotate-180]="showLanguageMenu" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </button>
                
                <div *ngIf="showLanguageMenu" class="mt-1 sm:mt-2 space-y-1 pl-3 sm:pl-4">
                  <button (click)="changeLanguage('es')" 
                          class="flex items-center space-x-2 sm:space-x-3 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg w-full text-left transition-all duration-200 text-sm sm:text-base"
                          [class]="isScrolled ? 'text-gray-600 hover:text-gray-800 hover:bg-gray-50' : 'text-gray-300 hover:text-white hover:bg-white/10'">
                    <img src="/assets/i18n/es-flag.svg" alt="Español" class="w-3 h-3 sm:w-4 sm:h-4 rounded">
                    <span>Español</span>
                  </button>
                  <button (click)="changeLanguage('pt')" 
                          class="flex items-center space-x-2 sm:space-x-3 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg w-full text-left transition-all duration-200 text-sm sm:text-base"
                          [class]="isScrolled ? 'text-gray-600 hover:text-gray-800 hover:bg-gray-50' : 'text-gray-300 hover:text-white hover:bg-white/10'">
                    <img src="/assets/i18n/pt-flag.svg" alt="Português" class="w-3 h-3 sm:w-4 sm:h-4 rounded">
                    <span>Português</span>
                  </button>
                </div>
              </div>

              <!-- Mobile CTA Button - Responsive -->
              <button (click)="navigateToBooking(); toggleMobileMenu()" 
                      class="w-full bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-white px-4 sm:px-6 py-3 sm:py-3.5 rounded-lg sm:rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2 text-sm sm:text-base min-h-[44px]">
                <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0h6m-6 0l-2 13a2 2 0 002 2h6a2 2 0 002-2L14 7"/>
                </svg>
                <span>{{ 'NAV.BOOK_NOW' | translate }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  `,
  styles: [`
    @keyframes fadeInDown {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .animate-fadeInDown {
      animation: fadeInDown 0.3s ease-out;
    }

    /* Smooth scroll behavior */
    html {
      scroll-behavior: smooth;
    }

    /* Media queries específicas para el header */
    @media (max-width: 480px) {
      .container-responsive {
        padding-left: 0.75rem;
        padding-right: 0.75rem;
      }
    }

    /* Extra small devices breakpoint */
    @media (min-width: 375px) {
      .xs\\:block {
        display: block;
      }
    }

    /* Optimizaciones táctiles móviles */
    @media (hover: none) and (pointer: coarse) {
      button:hover,
      a:hover {
        transform: none;
      }
      
      button:active,
      a:active {
        transform: scale(0.98);
      }
    }

    /* Prevenir zoom en iOS para inputs */
    @supports (-webkit-touch-callout: none) {
      input,
      select,
      textarea {
        font-size: 16px;
      }
    }
  `]
})
export class HeaderComponent implements OnInit {
  showMobileMenu = false;
  showLanguageMenu = false;
  isScrolled = false;

  constructor(
    public authService: AuthService,
    private router: Router,
    private translate: TranslateService
  ) {}

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.pageYOffset > 20;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    const target = event.target as HTMLElement;
    if (!target.closest('.relative')) {
      this.showLanguageMenu = false;
    }
  }

  ngOnInit() {
    // Set default language if not set
    if (!this.translate.currentLang) {
      this.translate.setDefaultLang('es');
      this.translate.use('es');
    }
    
    // Initialize scroll state
    this.isScrolled = window.pageYOffset > 20;
  }

  toggleMobileMenu() {
    this.showMobileMenu = !this.showMobileMenu;
    // Prevent body scroll when mobile menu is open
    if (this.showMobileMenu) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }

  toggleLanguageMenu() {
    this.showLanguageMenu = !this.showLanguageMenu;
  }

  changeLanguage(lang: string) {
    this.translate.use(lang);
    this.showLanguageMenu = false;
  }

  getCurrentLanguage(): string {
    return this.translate.currentLang === 'pt' ? 'PT' : 'ES';
  }

  getCurrentLanguageFlag(): string {
    return this.translate.currentLang === 'pt' ? '/assets/i18n/pt-flag.svg' : '/assets/i18n/es-flag.svg';
  }

  scrollToSection(sectionId: string) {
    const element = document.getElementById(sectionId);
    if (element) {
      const headerHeight = 80; // Height of fixed header
      const elementPosition = element.offsetTop - headerHeight;
      
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      });
    }
    this.showMobileMenu = false;
    document.body.style.overflow = 'auto';
  }

  navigateToBooking() {
    this.scrollToSection('reserva');
    this.showMobileMenu = false;
    document.body.style.overflow = 'auto';
  }
}
