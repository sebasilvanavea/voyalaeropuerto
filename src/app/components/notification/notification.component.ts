import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { trigger, state, style, transition, animate } from '@angular/animations';

export interface NotificationData {
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  action?: {
    label: string;
    callback: () => void;
  };
  autoClose?: boolean;
  duration?: number;
}

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  animations: [
    trigger('slideIn', [
      state('hidden', style({
        opacity: 0,
        transform: 'translateX(100%) scale(0.9)'
      })),
      state('visible', style({
        opacity: 1,
        transform: 'translateX(0) scale(1)'
      })),
      transition('hidden => visible', [
        animate('400ms cubic-bezier(0.25, 0.46, 0.45, 0.94)')
      ]),
      transition('visible => hidden', [
        animate('300ms cubic-bezier(0.55, 0.055, 0.675, 0.19)')
      ])
    ])
  ],
  template: `
    <div class="notification-container" 
         [@slideIn]="isVisible ? 'visible' : 'hidden'"
         *ngIf="isVisible || animating"
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
        <h4 class="notification-title">{{ notification.title | translate }}</h4>
        <p class="notification-message">{{ notification.message | translate }}</p>
        
        <button *ngIf="notification.action" 
                class="notification-action"
                (click)="onActionClick()">
          {{ notification.action.label | translate }}
        </button>
      </div>

      <button class="notification-close" (click)="close()">
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
  `,
  styles: [`
    .notification-container {
      position: fixed;
      top: 20px;
      right: 20px;
      max-width: 400px;
      width: 90vw;
      background: white;
      border-radius: 12px;
      box-shadow: 
        0 10px 25px rgba(0, 0, 0, 0.1),
        0 20px 48px rgba(0, 0, 0, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      z-index: 10001;
      display: flex;
      align-items: flex-start;
      gap: 1rem;
      padding: 1.5rem;
      position: relative;
      overflow: hidden;
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
      margin: 0 0 0.5rem;
      font-size: 1rem;
      font-weight: 600;
      color: #111827;
      line-height: 1.2;
    }

    .notification-message {
      margin: 0 0 1rem;
      font-size: 0.875rem;
      color: #6b7280;
      line-height: 1.4;
    }

    .notification-action {
      background: transparent;
      border: 1px solid currentColor;
      border-radius: 6px;
      padding: 0.5rem 1rem;
      font-size: 0.875rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .notification-success .notification-action {
      color: #10b981;
      border-color: #10b981;
    }

    .notification-success .notification-action:hover {
      background: #10b981;
      color: white;
    }

    .notification-error .notification-action {
      color: #ef4444;
      border-color: #ef4444;
    }

    .notification-error .notification-action:hover {
      background: #ef4444;
      color: white;
    }

    .notification-warning .notification-action {
      color: #f59e0b;
      border-color: #f59e0b;
    }

    .notification-warning .notification-action:hover {
      background: #f59e0b;
      color: white;
    }

    .notification-info .notification-action {
      color: #3b82f6;
      border-color: #3b82f6;
    }

    .notification-info .notification-action:hover {
      background: #3b82f6;
      color: white;
    }

    .notification-close {
      width: 24px;
      height: 24px;
      background: transparent;
      border: none;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      color: #9ca3af;
      transition: all 0.2s ease;
      flex-shrink: 0;
    }

    .notification-close:hover {
      background: #f3f4f6;
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
    }

    .progress-bar {
      height: 100%;
      background: currentColor;
      animation: progress linear;
      transform-origin: left;
    }

    .notification-success .progress-bar {
      background: #10b981;
    }

    .notification-error .progress-bar {
      background: #ef4444;
    }

    .notification-warning .progress-bar {
      background: #f59e0b;
    }

    .notification-info .progress-bar {
      background: #3b82f6;
    }

    @keyframes progress {
      from {
        transform: scaleX(1);
      }
      to {
        transform: scaleX(0);
      }
    }

    /* Mobile Responsiveness */
    @media (max-width: 480px) {
      .notification-container {
        top: 10px;
        left: 10px;
        right: 10px;
        max-width: none;
        width: auto;
      }
    }
  `]
})
export class NotificationComponent {
  @Input() isVisible = false;
  @Input() notification: NotificationData = {
    type: 'info',
    title: 'Notification',
    message: 'This is a notification message'
  };
  
  @Output() closed = new EventEmitter<void>();

  animating = false;
  private autoCloseTimeout?: any;

  ngOnInit(): void {
    if (this.notification.autoClose) {
      this.startAutoClose();
    }
  }

  ngOnDestroy(): void {
    if (this.autoCloseTimeout) {
      clearTimeout(this.autoCloseTimeout);
    }
  }

  private startAutoClose(): void {
    const duration = this.notification.duration || 5000;
    this.autoCloseTimeout = setTimeout(() => {
      this.close();
    }, duration);
  }

  onActionClick(): void {
    if (this.notification.action?.callback) {
      this.notification.action.callback();
    }
    this.close();
  }

  close(): void {
    this.animating = true;
    this.closed.emit();
    
    setTimeout(() => {
      this.animating = false;
    }, 300);
  }
}
