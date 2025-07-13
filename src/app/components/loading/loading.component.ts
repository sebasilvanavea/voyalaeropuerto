import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

interface LoadingStep {
  id: number;
  label: string;
  completed: boolean;
  active: boolean;
}

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  template: `
    <div class="loading-container" [class.visible]="isVisible">
      <div class="loading-backdrop" (click)="onBackdropClick()"></div>
      
      <div class="loading-content">
        <!-- Animated Logo/Icon -->
        <div class="loading-icon">
          <svg class="airplane-animation" viewBox="0 0 24 24" fill="none">
            <path 
              d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"
              fill="currentColor"
              class="airplane-path"
            />
          </svg>
          
          <!-- Pulsating rings -->
          <div class="pulse-ring pulse-ring-1"></div>
          <div class="pulse-ring pulse-ring-2"></div>
          <div class="pulse-ring pulse-ring-3"></div>
        </div>

        <!-- Loading Text with typing effect -->
        <div class="loading-text">
          <h3 class="loading-title">{{ loadingTitle | translate }}</h3>
          <p class="loading-message">
            <span class="typing-text">{{ currentMessage | translate }}</span>
            <span class="cursor">|</span>
          </p>
        </div>

        <!-- Progress Bar -->
        <div class="progress-container" *ngIf="showProgress">
          <div class="progress-bar">
            <div class="progress-fill" [style.width.%]="progress"></div>
            <div class="progress-glow"></div>
          </div>
          <div class="progress-text">{{ progress }}%</div>
        </div>

        <!-- Loading Steps -->
        <div class="loading-steps" *ngIf="steps.length > 0">
          <div 
            class="loading-step"
            *ngFor="let step of getStepsForTemplate(); let i = index"
            [class.active]="i === currentStepIndex"
            [class.completed]="i < currentStepIndex">
            <div class="step-icon">
              <svg *ngIf="i < currentStepIndex" class="check-icon" viewBox="0 0 24 24">
                <path d="M5 13l4 4L19 7" stroke="currentColor" stroke-width="2" fill="none"/>
              </svg>
              <div *ngIf="i === currentStepIndex" class="spinner-mini"></div>
              <div *ngIf="i > currentStepIndex" class="step-number">{{ i + 1 }}</div>
            </div>
            <span class="step-label">{{ step | translate }}</span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .loading-container {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 9999;
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      visibility: hidden;
      transition: opacity 0.3s ease, visibility 0.3s ease;
    }

    .loading-container.visible {
      opacity: 1;
      visibility: visible;
    }

    .loading-backdrop {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.8);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
    }

    .loading-content {
      position: relative;
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(20px);
      border-radius: 20px;
      padding: 3rem 2rem;
      text-align: center;
      max-width: 90vw;
      width: 400px;
      box-shadow: 
        0 20px 40px rgba(0, 0, 0, 0.1),
        0 40px 80px rgba(0, 0, 0, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.2);
      animation: slideInScale 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    }

    @keyframes slideInScale {
      0% {
        opacity: 0;
        transform: translateY(30px) scale(0.9);
      }
      100% {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }

    /* Animated Icon */
    .loading-icon {
      position: relative;
      width: 80px;
      height: 80px;
      margin: 0 auto 2rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .airplane-animation {
      width: 40px;
      height: 40px;
      color: #f59e0b;
      z-index: 2;
      position: relative;
      animation: airplaneFly 3s ease-in-out infinite;
    }

    @keyframes airplaneFly {
      0%, 100% {
        transform: translateX(0) rotate(0deg);
      }
      25% {
        transform: translateX(10px) rotate(5deg);
      }
      50% {
        transform: translateX(-5px) rotate(-3deg);
      }
      75% {
        transform: translateX(8px) rotate(2deg);
      }
    }

    .airplane-path {
      filter: drop-shadow(0 2px 4px rgba(245, 158, 11, 0.3));
    }

    /* Pulsating Rings */
    .pulse-ring {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      border: 2px solid #f59e0b;
      border-radius: 50%;
      opacity: 0;
      animation: pulseRing 2s ease-out infinite;
    }

    .pulse-ring-1 {
      width: 60px;
      height: 60px;
      animation-delay: 0s;
    }

    .pulse-ring-2 {
      width: 80px;
      height: 80px;
      animation-delay: 0.5s;
    }

    .pulse-ring-3 {
      width: 100px;
      height: 100px;
      animation-delay: 1s;
    }

    @keyframes pulseRing {
      0% {
        opacity: 0.7;
        transform: translate(-50%, -50%) scale(0.8);
      }
      50% {
        opacity: 0.3;
      }
      100% {
        opacity: 0;
        transform: translate(-50%, -50%) scale(1.2);
      }
    }

    /* Loading Text */
    .loading-text {
      margin-bottom: 2rem;
    }

    .loading-title {
      font-size: 1.5rem;
      font-weight: 700;
      color: #111827;
      margin-bottom: 0.5rem;
      background: linear-gradient(45deg, #111827, #f59e0b, #111827);
      background-size: 200% 200%;
      background-clip: text;
      -webkit-background-clip: text;
      color: transparent;
      animation: titleShimmer 3s ease-in-out infinite;
    }

    @keyframes titleShimmer {
      0%, 100% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
    }

    .loading-message {
      color: #6b7280;
      font-size: 1rem;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.25rem;
    }

    .typing-text {
      overflow: hidden;
      border-right: 2px solid transparent;
      white-space: nowrap;
      animation: typing 2s steps(20) infinite;
    }

    .cursor {
      color: #f59e0b;
      animation: blink 1s infinite;
    }

    @keyframes typing {
      0%, 100% { max-width: 0; }
      50% { max-width: 100%; }
    }

    @keyframes blink {
      0%, 50% { opacity: 1; }
      51%, 100% { opacity: 0; }
    }

    /* Progress Bar */
    .progress-container {
      margin-bottom: 2rem;
    }

    .progress-bar {
      position: relative;
      width: 100%;
      height: 6px;
      background: rgba(156, 163, 175, 0.2);
      border-radius: 3px;
      overflow: hidden;
      margin-bottom: 0.5rem;
    }

    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #f59e0b, #f97316, #f59e0b);
      background-size: 200% 100%;
      border-radius: 3px;
      transition: width 0.3s ease;
      animation: progressShine 2s ease-in-out infinite;
    }

    @keyframes progressShine {
      0%, 100% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
    }

    .progress-glow {
      position: absolute;
      top: -2px;
      left: 0;
      height: 10px;
      width: 20px;
      background: radial-gradient(ellipse, rgba(245, 158, 11, 0.5) 0%, transparent 70%);
      border-radius: 50%;
      animation: progressGlow 2s ease-in-out infinite;
    }

    @keyframes progressGlow {
      0%, 100% { left: -10px; }
      50% { left: calc(100% - 10px); }
    }

    .progress-text {
      font-size: 0.875rem;
      color: #6b7280;
      font-weight: 600;
    }

    /* Loading Steps */
    .loading-steps {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .loading-step {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 0.75rem;
      border-radius: 10px;
      transition: all 0.3s ease;
      opacity: 0.5;
    }

    .loading-step.active {
      opacity: 1;
      background: rgba(245, 158, 11, 0.1);
      border: 1px solid rgba(245, 158, 11, 0.2);
    }

    .loading-step.completed {
      opacity: 0.8;
      background: rgba(34, 197, 94, 0.1);
      border: 1px solid rgba(34, 197, 94, 0.2);
    }

    .step-icon {
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      background: #f3f4f6;
      flex-shrink: 0;
    }

    .loading-step.active .step-icon {
      background: rgba(245, 158, 11, 0.2);
    }

    .loading-step.completed .step-icon {
      background: rgba(34, 197, 94, 0.2);
    }

    .check-icon {
      width: 14px;
      height: 14px;
      color: #22c55e;
    }

    .spinner-mini {
      width: 12px;
      height: 12px;
      border: 2px solid rgba(245, 158, 11, 0.2);
      border-top: 2px solid #f59e0b;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    .step-number {
      font-size: 0.75rem;
      font-weight: 600;
      color: #6b7280;
    }

    .step-label {
      font-size: 0.875rem;
      color: #374151;
      font-weight: 500;
    }

    .loading-step.active .step-label {
      color: #f59e0b;
      font-weight: 600;
    }

    .loading-step.completed .step-label {
      color: #22c55e;
    }

    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    /* Mobile Responsiveness */
    @media (max-width: 480px) {
      .loading-content {
        margin: 1rem;
        padding: 2rem 1.5rem;
        width: auto;
      }

      .loading-title {
        font-size: 1.25rem;
      }

      .loading-message {
        font-size: 0.875rem;
      }

      .loading-icon {
        width: 60px;
        height: 60px;
        margin-bottom: 1.5rem;
      }

      .airplane-animation {
        width: 30px;
        height: 30px;
      }
    }

    /* Reduced Motion Support */
    @media (prefers-reduced-motion: reduce) {
      .airplane-animation,
      .pulse-ring,
      .progress-fill,
      .progress-glow,
      .typing-text,
      .cursor,
      .spinner-mini {
        animation: none;
      }

      .loading-container.visible {
        transition: none;
      }
    }
  `]
})
export class LoadingComponent implements OnInit, OnDestroy {
  @Input() isVisible = false;
  @Input() loadingTitle = 'LOADING.TITLE';
  @Input() showProgress = true;
  @Input() allowBackdropClose = false;
  @Input() steps: LoadingStep[] | string[] = [];

  progress = 0;
  currentMessage = 'LOADING.PREPARING';
  currentStepIndex = 0;

  private messages = [
    'LOADING.INITIALIZING',
    'LOADING.LOADING_DATA',
    'LOADING.PREPARING_UI',
    'LOADING.FINALIZING'
  ];

  private messageInterval?: any;
  private progressInterval?: any;

  ngOnInit(): void {
    if (this.isVisible) {
      this.startLoadingSequence();
    }
  }

  ngOnDestroy(): void {
    this.clearIntervals();
  }

  private startLoadingSequence(): void {
    this.animateProgress();
    this.animateMessages();
    
    if (this.steps.length > 0) {
      this.animateSteps();
    }
  }

  private animateProgress(): void {
    const duration = 3000; // 3 seconds
    const interval = 50; // Update every 50ms
    const increment = 100 / (duration / interval);

    this.progressInterval = setInterval(() => {
      this.progress += increment;
      if (this.progress >= 100) {
        this.progress = 100;
        clearInterval(this.progressInterval);
      }
    }, interval);
  }

  private animateMessages(): void {
    let messageIndex = 0;
    
    this.messageInterval = setInterval(() => {
      this.currentMessage = this.messages[messageIndex];
      messageIndex = (messageIndex + 1) % this.messages.length;
    }, 800);
  }

  private animateSteps(): void {
    const stepDuration = 3000 / this.steps.length;
    
    this.steps.forEach((_, index) => {
      setTimeout(() => {
        this.currentStepIndex = index;
      }, stepDuration * index);
    });
  }

  private clearIntervals(): void {
    if (this.messageInterval) {
      clearInterval(this.messageInterval);
    }
    if (this.progressInterval) {
      clearInterval(this.progressInterval);
    }
  }

  onBackdropClick(): void {
    if (this.allowBackdropClose) {
      this.isVisible = false;
    }
  }

  // Enhanced loading states for different contexts
  setBookingLoadingState(): void {
    this.loadingTitle = 'LOADING.BOOKING_TITLE';
    this.messages = [
      'LOADING.VALIDATING_FORM',
      'LOADING.CHECKING_AVAILABILITY',
      'LOADING.PROCESSING_PAYMENT',
      'LOADING.CONFIRMING_BOOKING',
      'LOADING.SENDING_CONFIRMATION'
    ];
    this.showProgress = true;
    this.steps = [
      'LOADING.STEP_VALIDATE',
      'LOADING.STEP_AVAILABILITY', 
      'LOADING.STEP_PAYMENT',
      'LOADING.STEP_CONFIRM',
      'LOADING.STEP_NOTIFICATION'
    ];
  }

  setAppLoadingState(): void {
    this.loadingTitle = 'LOADING.LOADING_TITLE';
    this.messages = [
      'LOADING.INITIALIZING_APP',
      'LOADING.LOADING_CONTENT',
      'LOADING.PREPARING_UI',
      'LOADING.PREPARING_ANIMATIONS',
      'LOADING.FINALIZING'
    ];
    this.showProgress = true;
    this.steps = [];
  }

  setDataLoadingState(): void {
    this.loadingTitle = 'LOADING.LOADING_DATA';
    this.messages = [
      'LOADING.CONNECTING_SERVER',
      'LOADING.FETCHING_DATA',
      'LOADING.PROCESSING_DATA',
      'LOADING.UPDATING_UI'
    ];
    this.showProgress = false;
    this.steps = [];
  }

  // Method to update step completion
  completeStep(stepId: number): void {
    if (Array.isArray(this.steps) && this.steps.length > 0 && typeof this.steps[0] === 'object') {
      const stepArray = this.steps as LoadingStep[];
      const step = stepArray.find(s => s.id === stepId);
      if (step) {
        step.completed = true;
        step.active = false;
        
        // Activate next step
        const nextStep = stepArray.find(s => s.id === stepId + 1);
        if (nextStep) {
          nextStep.active = true;
        }
      }
    }
  }

  // Helper method to get step label
  getStepLabel(step: LoadingStep | string): string {
    if (typeof step === 'string') {
      return step;
    }
    return step.label;
  }

  // Helper method to get steps for template
  getStepsForTemplate(): string[] {
    if (!this.steps || this.steps.length === 0) {
      return [];
    }
    
    if (typeof this.steps[0] === 'string') {
      return this.steps as string[];
    }
    
    return (this.steps as LoadingStep[]).map(step => step.label);
  }
}
