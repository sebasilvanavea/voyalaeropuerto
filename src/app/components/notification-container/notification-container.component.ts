import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { UINotificationService, UINotification } from '../../services/ui-notification.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-notification-container',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  animations: [
    trigger('slideIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(100%) scale(0.9)' }),
        animate('400ms cubic-bezier(0.25, 0.46, 0.45, 0.94)', 
          style({ opacity: 1, transform: 'translateX(0) scale(1)' }))
      ]),
      transition(':leave', [
        animate('300ms cubic-bezier(0.55, 0.055, 0.675, 0.19)', 
          style({ opacity: 0, transform: 'translateX(100%) scale(0.9)' }))
      ])
    ])
  ],
  template: `
    <div class="notification-stack">
      <div *ngFor="let notification of notifications; trackBy: trackByNotification"
           [@slideIn]
           class="notification-item"
           [class]="'notification-' + notification.type">
        
        <div class="notification-icon">
          <!-- Success Icon -->
          <svg *ngIf="notification.type === 'success'" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.2"/>
            <path d="M8 12l2 2 4-4" stroke="currentColor" stroke-width="2" fill="none"/>
          </svg>
          
          <!-- Error Icon -->
          <svg *ngIf="notification.type === 'error'" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.2"/>
            <path d="M15 9l-6 6m0-6l6 6" stroke="currentColor" stroke-width="2"/>
          </svg>
          
          <!-- Warning Icon -->
          <svg *ngIf="notification.type === 'warning'" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L2 22h20L12 2z" fill="currentColor" opacity="0.2"/>
            <path d="M12 8v4m0 4h.01" stroke="currentColor" stroke-width="2"/>
          </svg>
          
          <!-- Info Icon -->
          <svg *ngIf="notification.type === 'info'" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.2"/>
            <path d="M12 16v-4m0-4h.01" stroke="currentColor" stroke-width="2"/>
          </svg>
        </div>

        <div class="notification-content">
          <h4 class="notification-title">{{ notification.title }}</h4>
          <p class="notification-message">{{ notification.message }}</p>
          
          <button *ngIf="notification.action" 
                  class="notification-action"
                  (click)="onActionClick(notification)">
            {{ notification.action.label }}
          </button>
        </div>

        <button class="notification-close" (click)="closeNotification(notification.id)">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <!-- Progress bar for auto-close -->
        <div *ngIf="notification.autoClose" class="notification-progress">
          <div class="progress-bar" [style.animation-duration.ms]="notification.duration || 5000"></div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .notification-stack {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 10001;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      max-height: 100vh;
      overflow-y: auto;
      pointer-events: none;
    }

    .notification-item {
      max-width: 400px;
      width: 90vw;
      background: white;
      border-radius: 12px;
      box-shadow: 
        0 10px 25px rgba(0, 0, 0, 0.1),
        0 20px 48px rgba(0, 0, 0, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      display: flex;
      align-items: flex-start;
      gap: 1rem;
      padding: 1.5rem;
      position: relative;
      overflow: hidden;
      pointer-events: auto;
    }

    .notification-success {
      border-left: 4px solid #10b981;
    }

    .notification-error {
      border-left: 4px solid #ef4444;
    }

    .notification-warning {
      border-left: 4px solid #f59e0b;
    }

    .notification-info {
      border-left: 4px solid #3b82f6;
    }

    .notification-icon {
      width: 24px;
      height: 24px;
      flex-shrink: 0;
      margin-top: 0.25rem;
    }

    .notification-success .notification-icon {
      color: #10b981;
    }

    .notification-error .notification-icon {
      color: #ef4444;
    }

    .notification-warning .notification-icon {
      color: #f59e0b;
    }

    .notification-info .notification-icon {
      color: #3b82f6;
    }

    .notification-content {
      flex: 1;
      min-width: 0;
    }

    .notification-title {
      font-size: 1rem;
      font-weight: 600;
      color: #1f2937;
      margin: 0 0 0.5rem 0;
      line-height: 1.4;
    }

    .notification-message {
      font-size: 0.875rem;
      color: #6b7280;
      margin: 0;
      line-height: 1.5;
    }

    .notification-action {
      display: inline-flex;
      align-items: center;
      padding: 0.5rem 1rem;
      margin-top: 0.75rem;
      background: #3b82f6;
      color: white;
      border: none;
      border-radius: 6px;
      font-size: 0.875rem;
      font-weight: 500;
      cursor: pointer;
      transition: background-color 0.2s ease;
    }

    .notification-action:hover {
      background: #2563eb;
    }

    .notification-close {
      position: absolute;
      top: 1rem;
      right: 1rem;
      width: 24px;
      height: 24px;
      border: none;
      background: none;
      color: #9ca3af;
      cursor: pointer;
      transition: color 0.2s ease;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .notification-close:hover {
      color: #6b7280;
    }

    .notification-close svg {
      width: 16px;
      height: 16px;
    }

    .notification-progress {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }

    .progress-bar {
      height: 100%;
      background: linear-gradient(90deg, #3b82f6, #10b981);
      width: 100%;
      animation: progress-countdown linear;
      transform-origin: left;
    }

    @keyframes progress-countdown {
      from {
        transform: scaleX(1);
      }
      to {
        transform: scaleX(0);
      }
    }

    /* Mobile responsiveness */
    @media (max-width: 640px) {
      .notification-stack {
        top: 10px;
        right: 10px;
        left: 10px;
      }
      
      .notification-item {
        max-width: none;
        width: auto;
      }
    }
  `]
})
export class NotificationContainerComponent implements OnInit, OnDestroy {
  notifications: UINotification[] = [];
  private subscription?: Subscription;

  constructor(private notificationService: UINotificationService) {}

  ngOnInit(): void {
    this.subscription = this.notificationService.notifications$.subscribe(
      notifications => this.notifications = notifications
    );
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  trackByNotification(index: number, notification: UINotification): string {
    return notification.id;
  }

  onActionClick(notification: UINotification): void {
    if (notification.action?.callback) {
      notification.action.callback();
    }
    this.closeNotification(notification.id);
  }

  closeNotification(id: string): void {
    this.notificationService.remove(id);
  }
}
