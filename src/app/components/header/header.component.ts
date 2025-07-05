import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService, TranslateStore } from '@ngx-translate/core';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule],
  providers: [TranslateStore],
  template: `
    <header class="bg-white shadow-lg border-b border-gray-200">
      <nav class="container mx-auto px-4 py-4">
        <div class="flex justify-between items-center w-full">
          <a routerLink="/" class="flex items-center gap-2 text-2xl font-extrabold text-gray-900 hover:text-amber-600 transition-colors">
            <img src="assets/logo1.png" alt="Logo VoyalAeropuerto" class="max-h-16 h-12 w-auto object-contain" style="margin-top:-8px;margin-bottom:-8px;" />
            <span class="hidden sm:inline"></span>
          </a>
          <!-- Botón hamburguesa para móviles -->
          <button class="sm:hidden flex flex-col justify-center items-center w-10 h-10 focus:outline-none" (click)="toggleMenu()" aria-label="Abrir menú">
            <span class="block w-7 h-0.5 bg-gray-900 mb-1 transition-all" [ngClass]="{'rotate-45 translate-y-2': menuOpen}"></span>
            <span class="block w-7 h-0.5 bg-gray-900 mb-1 transition-all" [ngClass]="{'opacity-0': menuOpen}"></span>
            <span class="block w-7 h-0.5 bg-gray-900 transition-all" [ngClass]="{'-rotate-45 -translate-y-2': menuOpen}"></span>
          </button>
          <div class="hidden sm:flex items-center space-x-4">
            <div class="flex space-x-8">
              <a href="#servicios" class="text-gray-700 font-semibold text-lg relative group transition-colors hover:text-amber-600">
                {{ 'SERVICES' | translate }}
                <span class="block h-0.5 bg-amber-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
              </a>
              <a routerLink="/precios" class="text-gray-700 font-semibold text-lg relative group transition-colors hover:text-amber-600">
                {{ 'RATES' | translate }}
                <span class="block h-0.5 bg-amber-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
              </a>
              <a routerLink="/cotizar" class="text-gray-700 font-semibold text-lg relative group transition-colors hover:text-amber-600">
                Cotizar
                <span class="block h-0.5 bg-amber-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
              </a>
              <a routerLink="/reservar" class="text-gray-700 font-semibold text-lg relative group transition-colors hover:text-amber-600">
                {{ 'BOOK' | translate }}
                <span class="block h-0.5 bg-amber-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
              </a>
              <a href="#sobre-nosotros" class="text-gray-700 font-semibold text-lg relative group transition-colors hover:text-amber-600">
                Sobre nosotros
                <span class="block h-0.5 bg-amber-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
              </a>
              <a href="#contacto" class="text-gray-700 font-semibold text-lg relative group transition-colors hover:text-amber-600">
                {{ 'CONTACT' | translate }}
                <span class="block h-0.5 bg-amber-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
              </a>
            </div>
            <div class="flex items-center">
              <button (click)="toggleLanguage()"
                class="text-gray-600 rounded-full flex items-center justify-center hover:text-amber-600 transition-colors"
                title="Cambiar idioma del sitio web"
                aria-label="Cambiar idioma del sitio web">
                <span *ngIf="currentLanguage === 'es'" class="inline-flex items-center font-bold">
                  <img src="assets/i18n/es-flag.svg" alt="Español" class="w-5 h-5 mr-1 rounded-full" />ES
                </span>
                <span *ngIf="currentLanguage === 'pt'" class="inline-flex items-center font-bold">
                  <img src="assets/i18n/pt-flag.svg" alt="Português" class="w-5 h-5 mr-1 rounded-full" />PT
                </span>
              </button>
            </div>
          </div>
          <!-- Menú móvil -->
          <div *ngIf="menuOpen" class="absolute top-16 left-0 w-full bg-white border-t border-gray-200 z-50 flex flex-col items-center py-4 sm:hidden animate-fade-in shadow-lg">
            <a href="#servicios" class="text-gray-700 py-2 w-full text-center font-semibold text-lg hover:bg-amber-100 hover:text-amber-700 transition-colors" (click)="toggleMenu()">{{ 'SERVICES' | translate }}</a>
            <a routerLink="/precios" class="text-gray-700 py-2 w-full text-center font-semibold text-lg hover:bg-amber-100 hover:text-amber-700 transition-colors" (click)="toggleMenu()">{{ 'RATES' | translate }}</a>
            <a routerLink="/cotizar" class="text-gray-700 py-2 w-full text-center font-semibold text-lg hover:bg-amber-100 hover:text-amber-700 transition-colors" (click)="toggleMenu()">Cotizar</a>
            <a routerLink="/reservar" class="text-gray-700 py-2 w-full text-center font-semibold text-lg hover:bg-amber-100 hover:text-amber-700 transition-colors" (click)="toggleMenu()">{{ 'BOOK' | translate }}</a>
            <a href="#sobre-nosotros" class="text-gray-700 py-2 w-full text-center font-semibold text-lg hover:bg-amber-100 hover:text-amber-700 transition-colors" (click)="toggleMenu()">Sobre nosotros</a>
            <a href="#contacto" class="text-gray-700 py-2 w-full text-center font-semibold text-lg hover:bg-amber-100 hover:text-amber-700 transition-colors" (click)="toggleMenu()">{{ 'CONTACT' | translate }}</a>
            <button (click)="toggleLanguage()"
              class="mt-4 w-10 h-10 border-2 border-amber-400 text-gray-600 rounded-full flex items-center justify-center font-extrabold text-sm shadow focus:outline-none hover:bg-amber-50 transition-colors"
              title="Cambiar idioma del sitio web"
              aria-label="Cambiar idioma del sitio web">
              <span *ngIf="currentLanguage === 'es'" class="inline-flex items-center font-bold">
                <img src="assets/i18n/es-flag.svg" alt="Español" class="w-5 h-5 mr-1 rounded-full" />ES
              </span>
              <span *ngIf="currentLanguage === 'pt'" class="inline-flex items-center font-bold">
                <img src="assets/i18n/pt-flag.svg" alt="Português" class="w-5 h-5 mr-1 rounded-full" />PT
              </span>
            </button>
          </div>
        </div>
      </nav>
    </header>
  `
})
export class HeaderComponent {
  currentLanguage = '';
  menuOpen = false;

  constructor(private translate: TranslateService) {
    this.currentLanguage = translate.currentLang || 'es';
    translate.onLangChange.subscribe(event => {
      this.currentLanguage = event.lang;
    });
  }

  toggleLanguage() {
    const nextLang = this.currentLanguage === 'es' ? 'pt' : 'es';
    this.translate.use(nextLang);
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }
}