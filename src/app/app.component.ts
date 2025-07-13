import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header-new.component';
import { FooterComponent } from './components/footer.component';
import { NotificationContainerComponent } from './components/notification-container/notification-container.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, HeaderComponent, FooterComponent, NotificationContainerComponent, RouterOutlet, TranslateModule],
  template: `
    <div class="app-container" [class.loading]="loading">
      <app-header *ngIf="!isAdminRoute()"></app-header>
      <main class="main-content">
        <router-outlet (activate)="onActivate()" (deactivate)="onDeactivate()"></router-outlet>
      </main>
      <app-footer *ngIf="!isAdminRoute()"></app-footer>

      <!-- Global notification container -->
      <app-notification-container></app-notification-container>

      <div *ngIf="loading" class="loading-overlay">
        <div class="loading-spinner"></div>
      </div>
    </div>
  `,
  styles: [`
    .app-container {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      opacity: 1;
      transition: opacity 0.3s ease-out;
    }
    
    .main-content {
      flex: 1;
    }

    .app-container.loading {
      opacity: 0.6;
    }

    .loading-overlay {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 1000;
    }

    .loading-spinner {
      width: 40px;
      height: 40px;
      border: 3px solid rgba(37, 99, 235, 0.1);
      border-radius: 50%;
      border-top-color: #2563eb;
      animation: spin 1s ease-in-out infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `]
})
export class AppComponent {
  loading = true;

  constructor(private translate: TranslateService, private router: Router) {
    translate.addLangs(['es', 'pt']);
    translate.setDefaultLang('es');
    const browserLang = translate.getBrowserLang() || 'es';
    const lang = browserLang.match(/es|pt/) ? browserLang : 'es';
    translate.use(lang).subscribe(() => {
      this.loading = false;
    });
  }

  isAdminRoute(): boolean {
    return this.router.url.startsWith('/admin');
  }

  onActivate() {
    this.loading = true;
    setTimeout(() => this.loading = false, 300);
  }

  onDeactivate() {
    window.scrollTo(0, 0);
  }
}
