import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { trigger, state, style, transition, animate } from '@angular/animations';

interface BookingStep {
  id: number;
  title: string;
  completed: boolean;
  active: boolean;
}

@Component({
  selector: 'app-booking-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, TranslateModule],
  animations: [
    trigger('modalSlide', [
      state('hidden', style({
        opacity: 0,
        transform: 'translateY(100%)'
      })),
      state('visible', style({
        opacity: 1,
        transform: 'translateY(0)'
      })),
      transition('hidden => visible', [
        animate('400ms cubic-bezier(0.25, 0.46, 0.45, 0.94)')
      ]),
      transition('visible => hidden', [
        animate('300ms cubic-bezier(0.55, 0.055, 0.675, 0.19)')
      ])
    ]),
    trigger('backdropFade', [
      state('hidden', style({ opacity: 0 })),
      state('visible', style({ opacity: 1 })),
      transition('hidden => visible', animate('300ms ease-out')),
      transition('visible => hidden', animate('200ms ease-in'))
    ])
  ],
  template: `
    <div class="booking-modal-overlay" 
         [@backdropFade]="isVisible ? 'visible' : 'hidden'"
         *ngIf="isVisible || animating"
         (click)="onBackdropClick()">
      
      <div class="booking-modal-content" 
           [@modalSlide]="isVisible ? 'visible' : 'hidden'"
           (click)="$event.stopPropagation()">
        
        <!-- Modal Header -->
        <div class="modal-header">
          <div class="header-content">
            <div class="icon-container">
              <svg class="airplane-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
              </svg>
            </div>
            <div class="header-text">
              <h2>{{ 'BOOKING_MODAL.TITLE' | translate }}</h2>
              <p>{{ 'BOOKING_MODAL.SUBTITLE' | translate }}</p>
            </div>
          </div>
          
          <button class="close-button" (click)="closeModal()">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <!-- Progress Steps -->
        <div class="progress-steps">
          <div class="step" 
               *ngFor="let step of steps; let i = index"
               [class.completed]="step.completed"
               [class.active]="step.active">
            <div class="step-circle">
              <svg *ngIf="step.completed" class="check-icon" viewBox="0 0 24 24">
                <path d="M5 13l4 4L19 7" stroke="currentColor" stroke-width="2" fill="none"/>
              </svg>
              <span *ngIf="!step.completed" class="step-number">{{ i + 1 }}</span>
            </div>
            <span class="step-title">{{ step.title | translate }}</span>
          </div>
        </div>

        <!-- Step Content -->
        <div class="step-content">
          
          <!-- Step 1: Route Selection -->
          <div *ngIf="currentStep === 1" class="step-panel">
            <h3>{{ 'BOOKING_MODAL.STEP_1.TITLE' | translate }}</h3>
            
            <div class="route-options">
              <div class="route-option" 
                   [class.selected]="bookingForm.get('direction')?.value === 'to-airport'"
                   (click)="selectDirection('to-airport')">
                <div class="option-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
                  </svg>
                </div>
                <div class="option-content">
                  <h4>{{ 'BOOKING_MODAL.TO_AIRPORT' | translate }}</h4>
                  <p>{{ 'BOOKING_MODAL.TO_AIRPORT_DESC' | translate }}</p>
                </div>
              </div>

              <div class="route-option" 
                   [class.selected]="bookingForm.get('direction')?.value === 'from-airport'"
                   (click)="selectDirection('from-airport')">
                <div class="option-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
                  </svg>
                </div>
                <div class="option-content">
                  <h4>{{ 'BOOKING_MODAL.FROM_AIRPORT' | translate }}</h4>
                  <p>{{ 'BOOKING_MODAL.FROM_AIRPORT_DESC' | translate }}</p>
                </div>
              </div>
            </div>

            <div class="location-inputs" *ngIf="bookingForm.get('direction')?.value">
              <div class="input-group">
                <label>{{ getLocationLabel('origin') | translate }}</label>
                <input type="text" 
                       [placeholder]="getLocationPlaceholder('origin') | translate"
                       formControlName="origin"
                       class="location-input"
                       [class.error]="getFieldError('origin')"
                       (blur)="validateOriginLocation()">
                <div class="error-message" *ngIf="getFieldError('origin')">
                  {{ getFieldError('origin') }}
                </div>
              </div>
              
              <div class="input-group">
                <label>{{ getLocationLabel('destination') | translate }}</label>
                <input type="text" 
                       [placeholder]="getLocationPlaceholder('destination') | translate"
                       formControlName="destination"
                       class="location-input"
                       [class.error]="getFieldError('destination')"
                       (blur)="validateDestinationLocation()">
                <div class="error-message" *ngIf="getFieldError('destination')">
                  {{ getFieldError('destination') }}
                </div>
              </div>
            </div>
          </div>

          <!-- Step 2: Vehicle Selection -->
          <div *ngIf="currentStep === 2" class="step-panel">
            <h3>{{ 'BOOKING_MODAL.STEP_2.TITLE' | translate }}</h3>
            
            <div class="vehicle-options">
              <div class="vehicle-option" 
                   *ngFor="let vehicle of vehicleTypes"
                   [class.selected]="bookingForm.get('vehicleType')?.value === vehicle.id"
                   (click)="selectVehicle(vehicle.id)">
                <div class="vehicle-icon">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path [attr.d]="vehicle.iconPath"/>
                  </svg>
                </div>
                <div class="vehicle-info">
                  <h4>{{ vehicle.name | translate }}</h4>
                  <p>{{ vehicle.description | translate }}</p>
                  <div class="vehicle-features">
                    <span *ngFor="let feature of vehicle.features">
                      {{ feature | translate }}
                    </span>
                  </div>
                  <div class="vehicle-price">
                    <span class="price">{{ vehicle.basePrice | currency:'USD':'symbol':'1.0-0' }}</span>
                    <span class="price-note">{{ 'BOOKING_MODAL.BASE_PRICE' | translate }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Step 3: Date & Time -->
          <div *ngIf="currentStep === 3" class="step-panel">
            <h3>{{ 'BOOKING_MODAL.STEP_3.TITLE' | translate }}</h3>
            
            <div class="datetime-inputs">
              <div class="input-group">
                <label>{{ 'BOOKING_MODAL.DATE' | translate }}</label>
                <input type="date" 
                       formControlName="date"
                       [min]="minDate"
                       class="datetime-input">
              </div>
              
              <div class="input-group">
                <label>{{ 'BOOKING_MODAL.TIME' | translate }}</label>
                <input type="time" 
                       formControlName="time"
                       class="datetime-input"
                       [class.error]="getFieldError('time')"
                       (change)="validateDateTime()">
                <div class="error-message" *ngIf="getFieldError('time')">
                  {{ getFieldError('time') }}
                </div>
              </div>
            </div>

            <div class="passenger-info">
              <div class="input-group">
                <label>{{ 'BOOKING_MODAL.PASSENGERS' | translate }}</label>
                <select formControlName="passengers" class="passenger-select">
                  <option value="1">1 {{ 'BOOKING_MODAL.PASSENGER' | translate }}</option>
                  <option value="2">2 {{ 'BOOKING_MODAL.PASSENGERS' | translate }}</option>
                  <option value="3">3 {{ 'BOOKING_MODAL.PASSENGERS' | translate }}</option>
                  <option value="4">4 {{ 'BOOKING_MODAL.PASSENGERS' | translate }}</option>
                  <option value="5">5+ {{ 'BOOKING_MODAL.PASSENGERS' | translate }}</option>
                </select>
              </div>

              <div class="input-group">
                <label>{{ 'BOOKING_MODAL.PHONE' | translate }}</label>
                <input type="tel" 
                       formControlName="phone"
                       [placeholder]="'BOOKING_MODAL.PHONE_PLACEHOLDER' | translate"
                       class="phone-input"
                       [class.error]="getFieldError('phone')"
                       (blur)="validatePhoneNumber()">
                <div class="error-message" *ngIf="getFieldError('phone')">
                  {{ getFieldError('phone') }}
                </div>
              </div>
            </div>
          </div>

          <!-- Step 4: Confirmation -->
          <div *ngIf="currentStep === 4" class="step-panel">
            <h3>{{ 'BOOKING_MODAL.STEP_4.TITLE' | translate }}</h3>
            
            <div class="booking-summary">
              <div class="summary-item">
                <span class="label">{{ 'BOOKING_MODAL.ROUTE' | translate }}:</span>
                <span class="value">{{ getRouteSummary() }}</span>
              </div>
              
              <div class="summary-item">
                <span class="label">{{ 'BOOKING_MODAL.VEHICLE' | translate }}:</span>
                <span class="value">{{ getSelectedVehicleName() | translate }}</span>
              </div>
              
              <div class="summary-item">
                <span class="label">{{ 'BOOKING_MODAL.DATETIME' | translate }}:</span>
                <span class="value">{{ getDateTimeSummary() }}</span>
              </div>
              
              <div class="summary-item">
                <span class="label">{{ 'BOOKING_MODAL.PASSENGERS' | translate }}:</span>
                <span class="value">{{ bookingForm.get('passengers')?.value }}</span>
              </div>
              
              <div class="summary-item total">
                <span class="label">{{ 'BOOKING_MODAL.TOTAL' | translate }}:</span>
                <span class="value price">{{ calculateTotal() | currency:'USD':'symbol':'1.2-2' }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Modal Footer -->
        <div class="modal-footer">
          <button *ngIf="currentStep > 1" 
                  class="back-button"
                  (click)="previousStep()">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="m15 18-6-6 6-6"/>
            </svg>
            {{ 'BOOKING_MODAL.BACK' | translate }}
          </button>
          
          <button class="next-button"
                  [class.loading]="isProcessing"
                  [disabled]="!canProceed()"
                  (click)="nextStep()">
            <span *ngIf="!isProcessing">
              {{ getNextButtonText() | translate }}
            </span>
            <div *ngIf="isProcessing" class="button-spinner">
              <div class="spinner"></div>
              {{ 'BOOKING_MODAL.PROCESSING' | translate }}
            </div>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .booking-modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.7);
      backdrop-filter: blur(8px);
      z-index: 10000;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1rem;
    }

    .booking-modal-content {
      background: white;
      border-radius: 16px;
      max-width: 600px;
      width: 100%;
      max-height: 90vh;
      overflow-y: auto;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
      border: 1px solid rgba(255, 255, 255, 0.2);
    }

    .modal-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 2rem 2rem 1rem;
      border-bottom: 1px solid #e5e7eb;
    }

    .header-content {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .icon-container {
      width: 48px;
      height: 48px;
      background: rgba(245, 158, 11, 0.1);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .airplane-icon {
      width: 24px;
      height: 24px;
      color: #f59e0b;
    }

    .header-text h2 {
      margin: 0;
      font-size: 1.5rem;
      font-weight: 700;
      color: #111827;
    }

    .header-text p {
      margin: 0.25rem 0 0;
      color: #6b7280;
      font-size: 0.875rem;
    }

    .close-button {
      width: 40px;
      height: 40px;
      border: none;
      background: #f3f4f6;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .close-button:hover {
      background: #e5e7eb;
    }

    .close-button svg {
      width: 20px;
      height: 20px;
      color: #6b7280;
    }

    .progress-steps {
      display: flex;
      align-items: center;
      padding: 1.5rem 2rem;
      gap: 1rem;
      overflow-x: auto;
    }

    .step {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      min-width: 120px;
      opacity: 0.5;
      transition: opacity 0.3s ease;
    }

    .step.active,
    .step.completed {
      opacity: 1;
    }

    .step-circle {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: #e5e7eb;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
    }

    .step.active .step-circle {
      background: #f59e0b;
      color: white;
    }

    .step.completed .step-circle {
      background: #10b981;
      color: white;
    }

    .check-icon {
      width: 16px;
      height: 16px;
    }

    .step-number {
      font-size: 0.875rem;
      font-weight: 600;
    }

    .step-title {
      font-size: 0.875rem;
      font-weight: 500;
      color: #374151;
    }

    .step-content {
      padding: 0 2rem 1rem;
      min-height: 300px;
    }

    .step-panel h3 {
      margin: 0 0 1.5rem;
      font-size: 1.25rem;
      font-weight: 600;
      color: #111827;
    }

    /* Route Options */
    .route-options {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      margin-bottom: 1.5rem;
    }

    .route-option {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
      border: 2px solid #e5e7eb;
      border-radius: 12px;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .route-option:hover {
      border-color: #f59e0b;
      background: rgba(245, 158, 11, 0.05);
    }

    .route-option.selected {
      border-color: #f59e0b;
      background: rgba(245, 158, 11, 0.1);
    }

    .option-icon {
      width: 40px;
      height: 40px;
      background: rgba(245, 158, 11, 0.1);
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .option-icon svg {
      width: 20px;
      height: 20px;
      color: #f59e0b;
    }

    .option-content h4 {
      margin: 0 0 0.25rem;
      font-size: 1rem;
      font-weight: 600;
      color: #111827;
    }

    .option-content p {
      margin: 0;
      font-size: 0.875rem;
      color: #6b7280;
    }

    /* Location Inputs */
    .location-inputs {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .input-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .input-group label {
      font-size: 0.875rem;
      font-weight: 600;
      color: #374151;
    }

    .location-input,
    .datetime-input,
    .passenger-select,
    .phone-input {
      padding: 0.75rem;
      border: 1px solid #d1d5db;
      border-radius: 8px;
      font-size: 1rem;
      transition: border-color 0.2s ease;
    }

    .location-input:focus,
    .datetime-input:focus,
    .passenger-select:focus,
    .phone-input:focus {
      outline: none;
      border-color: #f59e0b;
      box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.1);
    }

    /* Vehicle Options */
    .vehicle-options {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .vehicle-option {
      display: flex;
      gap: 1rem;
      padding: 1rem;
      border: 2px solid #e5e7eb;
      border-radius: 12px;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .vehicle-option:hover {
      border-color: #f59e0b;
      background: rgba(245, 158, 11, 0.05);
    }

    .vehicle-option.selected {
      border-color: #f59e0b;
      background: rgba(245, 158, 11, 0.1);
    }

    .vehicle-icon {
      width: 48px;
      height: 48px;
      background: rgba(245, 158, 11, 0.1);
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .vehicle-icon svg {
      width: 24px;
      height: 24px;
      color: #f59e0b;
    }

    .vehicle-info {
      flex: 1;
    }

    .vehicle-info h4 {
      margin: 0 0 0.25rem;
      font-size: 1rem;
      font-weight: 600;
      color: #111827;
    }

    .vehicle-info p {
      margin: 0 0 0.5rem;
      font-size: 0.875rem;
      color: #6b7280;
    }

    .vehicle-features {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin-bottom: 0.5rem;
    }

    .vehicle-features span {
      font-size: 0.75rem;
      padding: 0.25rem 0.5rem;
      background: rgba(245, 158, 11, 0.1);
      color: #f59e0b;
      border-radius: 4px;
    }

    .vehicle-price {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .price {
      font-size: 1.25rem;
      font-weight: 700;
      color: #111827;
    }

    .price-note {
      font-size: 0.75rem;
      color: #6b7280;
    }

    /* DateTime & Passenger Info */
    .datetime-inputs,
    .passenger-info {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
      margin-bottom: 1rem;
    }

    /* Booking Summary */
    .booking-summary {
      background: #f9fafb;
      border-radius: 8px;
      padding: 1rem;
    }

    .summary-item {
      display: flex;
      justify-content: space-between;
      padding: 0.5rem 0;
      border-bottom: 1px solid #e5e7eb;
    }

    .summary-item:last-child {
      border-bottom: none;
    }

    .summary-item.total {
      font-weight: 700;
      font-size: 1.125rem;
      color: #111827;
      margin-top: 0.5rem;
      padding-top: 1rem;
      border-top: 2px solid #e5e7eb;
    }

    .summary-item .label {
      color: #6b7280;
    }

    .summary-item .value {
      color: #111827;
      font-weight: 500;
    }

    /* Modal Footer */
    .modal-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.5rem 2rem;
      border-top: 1px solid #e5e7eb;
      gap: 1rem;
    }

    .back-button {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1rem;
      background: transparent;
      border: 1px solid #d1d5db;
      border-radius: 8px;
      color: #374151;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .back-button:hover {
      background: #f3f4f6;
    }

    .back-button svg {
      width: 16px;
      height: 16px;
    }

    .next-button {
      flex: 1;
      max-width: 200px;
      padding: 0.75rem 1.5rem;
      background: linear-gradient(135deg, #f59e0b, #f97316);
      color: white;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
    }

    .next-button:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
    }

    .next-button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .button-spinner {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .spinner {
      width: 16px;
      height: 16px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-top: 2px solid white;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    /* Mobile Responsiveness */
    @media (max-width: 640px) {
      .booking-modal-overlay {
        padding: 0;
      }

      .booking-modal-content {
        width: 100vw;
        height: 100vh;
        max-height: 100vh;
        border-radius: 0;
        margin: 0;
        transform: translateY(0);
        overflow-y: auto;
      }

      .modal-header {
        padding: 1rem;
        position: sticky;
        top: 0;
        background: white;
        z-index: 10;
        border-bottom: 1px solid #e5e7eb;
      }

      .progress-steps {
        padding: 0 1rem;
        overflow-x: auto;
        -webkit-overflow-scrolling: touch;
      }

      .step-content {
        padding: 1rem;
        min-height: calc(100vh - 200px);
      }

      .modal-footer {
        position: sticky;
        bottom: 0;
        background: white;
        border-top: 1px solid #e5e7eb;
        z-index: 10;
      }

      /* Improve touch targets */
      .route-option,
      .vehicle-option {
        min-height: 60px;
        padding: 1rem;
      }

      .datetime-input,
      .location-input,
      .passenger-select,
      .phone-input {
        min-height: 48px;
        font-size: 16px; /* Prevents zoom on iOS */
      }

      .next-button,
      .back-button {
        min-height: 48px;
        font-size: 16px;
      }
    }

    /* Improved Focus States for Accessibility */
    .route-option:focus,
    .vehicle-option:focus,
    .close-button:focus,
    .back-button:focus,
    .next-button:focus {
      outline: 2px solid #f59e0b;
      outline-offset: 2px;
    }

    /* High Contrast Mode Support */
    @media (prefers-contrast: high) {
      .booking-modal-content {
        border: 2px solid #000;
      }
      
      .route-option,
      .vehicle-option {
        border-width: 2px;
      }
      
      .route-option.selected,
      .vehicle-option.selected {
        border-color: #000;
        background: #fff;
      }
    }

    /* Reduce Motion for Users Who Prefer It */
    @media (prefers-reduced-motion: reduce) {
      * {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
      }
    }

    /* Error Validation Styles */
    .error-message {
      color: #dc2626;
      font-size: 0.75rem;
      margin-top: 0.25rem;
      display: flex;
      align-items: center;
      gap: 0.25rem;
    }

    .error-message::before {
      content: "⚠️";
      font-size: 0.75rem;
    }

    .location-input.error,
    .datetime-input.error,
    .phone-input.error {
      border-color: #dc2626;
      background: rgba(220, 38, 38, 0.05);
    }

    .location-input.error:focus,
    .datetime-input.error:focus,
    .phone-input.error:focus {
      box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1);
    }

    /* Success Validation Styles */
    .location-input.valid,
    .datetime-input.valid,
    .phone-input.valid {
      border-color: #16a34a;
      background: rgba(22, 163, 74, 0.05);
    }

    .location-input.valid::after,
    .datetime-input.valid::after,
    .phone-input.valid::after {
      content: "✓";
      color: #16a34a;
      position: absolute;
      right: 0.75rem;
      top: 50%;
      transform: translateY(-50%);
    }
  `]
})
export class BookingModalComponent implements OnInit, OnDestroy {
  @Input() isVisible = false;
  @Output() close = new EventEmitter<void>();
  @Output() bookingComplete = new EventEmitter<any>();

  bookingForm: FormGroup;
  currentStep = 1;
  animating = false;
  isProcessing = false;

  steps: BookingStep[] = [
    { id: 1, title: 'BOOKING_MODAL.STEP_1.NAV', completed: false, active: true },
    { id: 2, title: 'BOOKING_MODAL.STEP_2.NAV', completed: false, active: false },
    { id: 3, title: 'BOOKING_MODAL.STEP_3.NAV', completed: false, active: false },
    { id: 4, title: 'BOOKING_MODAL.STEP_4.NAV', completed: false, active: false }
  ];

  vehicleTypes = [
    {
      id: 'sedan',
      name: 'VEHICLES.SEDAN',
      description: 'VEHICLES.SEDAN_DESC',
      features: ['VEHICLES.AC', 'VEHICLES.WIFI', 'VEHICLES.4_PASSENGERS'],
      basePrice: 25,
      iconPath: 'M5 11h14V9H5v2zm0 4h14v-2H5v2zm0-8h14V5H5v2z'
    },
    {
      id: 'suv',
      name: 'VEHICLES.SUV',
      description: 'VEHICLES.SUV_DESC',
      features: ['VEHICLES.AC', 'VEHICLES.WIFI', 'VEHICLES.6_PASSENGERS', 'VEHICLES.LUGGAGE'],
      basePrice: 35,
      iconPath: 'M3 11h18V9H3v2zm0 4h18v-2H3v2zm0-8h18V5H3v2z'
    },
    {
      id: 'van',
      name: 'VEHICLES.VAN',
      description: 'VEHICLES.VAN_DESC',
      features: ['VEHICLES.AC', 'VEHICLES.WIFI', 'VEHICLES.8_PASSENGERS', 'VEHICLES.LUGGAGE', 'VEHICLES.PREMIUM'],
      basePrice: 45,
      iconPath: 'M2 11h20V9H2v2zm0 4h20v-2H2v2zm0-8h20V5H2v2z'
    }
  ];

  minDate = new Date().toISOString().split('T')[0];

  constructor(private fb: FormBuilder) {
    this.bookingForm = this.fb.group({
      direction: ['', Validators.required],
      origin: ['', Validators.required],
      destination: ['', Validators.required],
      vehicleType: ['', Validators.required],
      date: ['', Validators.required],
      time: ['', Validators.required],
      passengers: ['1', Validators.required],
      phone: ['', [Validators.required, Validators.pattern(/^[+]?[\d\s-()]+$/)]]
    });
  }

  ngOnInit(): void {
    // Set default date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    this.bookingForm.patchValue({
      date: tomorrow.toISOString().split('T')[0],
      time: '08:00'
    });
  }

  ngOnDestroy(): void {
    // Cleanup if needed
  }

  onBackdropClick(): void {
    this.closeModal();
  }

  closeModal(): void {
    this.animating = true;
    this.close.emit();
    
    setTimeout(() => {
      this.animating = false;
      this.resetModal();
    }, 300);
  }

  resetModal(): void {
    this.currentStep = 1;
    this.isProcessing = false;
    this.bookingForm.reset({
      direction: '',
      origin: '',
      destination: '',
      vehicleType: '',
      date: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow
      time: '08:00',
      passengers: '1',
      phone: ''
    });
    this.updateSteps();
  }

  selectDirection(direction: string): void {
    this.bookingForm.patchValue({ direction });
  }

  selectVehicle(vehicleId: string): void {
    this.bookingForm.patchValue({ vehicleType: vehicleId });
  }

  getLocationLabel(type: 'origin' | 'destination'): string {
    const direction = this.bookingForm.get('direction')?.value;
    if (direction === 'to-airport') {
      return type === 'origin' ? 'BOOKING_MODAL.PICKUP_LOCATION' : 'BOOKING_MODAL.AIRPORT';
    } else {
      return type === 'origin' ? 'BOOKING_MODAL.AIRPORT' : 'BOOKING_MODAL.DESTINATION';
    }
  }

  getLocationPlaceholder(type: 'origin' | 'destination'): string {
    const direction = this.bookingForm.get('direction')?.value;
    if (direction === 'to-airport') {
      return type === 'origin' ? 'BOOKING_MODAL.PICKUP_PLACEHOLDER' : 'BOOKING_MODAL.AIRPORT_PLACEHOLDER';
    } else {
      return type === 'origin' ? 'BOOKING_MODAL.AIRPORT_PLACEHOLDER' : 'BOOKING_MODAL.DESTINATION_PLACEHOLDER';
    }
  }

  canProceed(): boolean {
    switch (this.currentStep) {
      case 1:
        return !!(this.bookingForm.get('direction')?.value && 
                 this.bookingForm.get('origin')?.value && 
                 this.bookingForm.get('destination')?.value);
      case 2:
        return !!this.bookingForm.get('vehicleType')?.value;
      case 3:
        return !!(this.bookingForm.get('date')?.value && 
                 this.bookingForm.get('time')?.value && 
                 this.bookingForm.get('phone')?.value);
      case 4:
        return true;
      default:
        return false;
    }
  }

  nextStep(): void {
    if (this.currentStep < 4) {
      this.currentStep++;
      this.updateSteps();
    } else {
      this.confirmBooking();
    }
  }

  previousStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
      this.updateSteps();
    }
  }

  updateSteps(): void {
    this.steps.forEach((step, index) => {
      step.completed = index + 1 < this.currentStep;
      step.active = index + 1 === this.currentStep;
    });
  }

  getNextButtonText(): string {
    switch (this.currentStep) {
      case 1: return 'BOOKING_MODAL.CONTINUE';
      case 2: return 'BOOKING_MODAL.CONTINUE';
      case 3: return 'BOOKING_MODAL.REVIEW';
      case 4: return 'BOOKING_MODAL.CONFIRM';
      default: return 'BOOKING_MODAL.CONTINUE';
    }
  }

  getRouteSummary(): string {
    const origin = this.bookingForm.get('origin')?.value;
    const destination = this.bookingForm.get('destination')?.value;
    return `${origin} → ${destination}`;
  }

  getSelectedVehicleName(): string {
    const vehicleType = this.bookingForm.get('vehicleType')?.value;
    const vehicle = this.vehicleTypes.find(v => v.id === vehicleType);
    return vehicle ? vehicle.name : '';
  }

  getDateTimeSummary(): string {
    const date = this.bookingForm.get('date')?.value;
    const time = this.bookingForm.get('time')?.value;
    if (date && time) {
      const formattedDate = new Date(date).toLocaleDateString();
      return `${formattedDate} at ${time}`;
    }
    return '';
  }

  calculateTotal(): number {
    const vehicleType = this.bookingForm.get('vehicleType')?.value;
    const vehicle = this.vehicleTypes.find(v => v.id === vehicleType);
    const basePrice = vehicle ? vehicle.basePrice : 0;
    
    // Add distance-based pricing (simplified calculation)
    const distanceMultiplier = 1.5; // This would be calculated based on actual distance
    
    return basePrice * distanceMultiplier;
  }

  async confirmBooking(): Promise<void> {
    this.isProcessing = true;
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const bookingData = {
        ...this.bookingForm.value,
        total: this.calculateTotal(),
        id: Date.now().toString()
      };
      
      this.bookingComplete.emit(bookingData);
      this.closeModal();
      
    } catch (error) {
      console.error('Booking failed:', error);
      // Handle error (show notification, etc.)
    } finally {
      this.isProcessing = false;
    }
  }

  // Enhanced real-time validation methods
  validateOriginLocation(): void {
    const originControl = this.bookingForm.get('origin');
    const direction = this.bookingForm.get('direction')?.value;
    
    if (direction === 'from-airport' && originControl?.value) {
      // Validate airport format
      const airportPattern = /aeropuerto|airport|atp/i;
      if (!airportPattern.test(originControl.value)) {
        originControl.setErrors({ invalidAirport: true });
      }
    }
  }

  validateDestinationLocation(): void {
    const destinationControl = this.bookingForm.get('destination');
    const direction = this.bookingForm.get('direction')?.value;
    
    if (direction === 'to-airport' && destinationControl?.value) {
      // Validate destination format (basic address validation)
      const addressPattern = /^[a-zA-Z0-9\s,.-]+$/;
      if (!addressPattern.test(destinationControl.value)) {
        destinationControl.setErrors({ invalidAddress: true });
      }
    }
  }

  validatePhoneNumber(): void {
    const phoneControl = this.bookingForm.get('phone');
    if (phoneControl?.value) {
      // Enhanced phone validation for international numbers
      const phonePattern = /^[\+]?[1-9][\d]{0,15}$/;
      if (!phonePattern.test(phoneControl.value.replace(/[\s-()]/g, ''))) {
        phoneControl.setErrors({ invalidPhone: true });
      }
    }
  }

  validateDateTime(): void {
    const dateControl = this.bookingForm.get('date');
    const timeControl = this.bookingForm.get('time');
    
    if (dateControl?.value && timeControl?.value) {
      const selectedDateTime = new Date(`${dateControl.value}T${timeControl.value}`);
      const now = new Date();
      const minAdvanceTime = new Date(now.getTime() + (2 * 60 * 60 * 1000)); // 2 hours advance
      
      if (selectedDateTime < minAdvanceTime) {
        timeControl.setErrors({ tooSoon: true });
      }
    }
  }

  getFieldError(fieldName: string): string | null {
    const control = this.bookingForm.get(fieldName);
    if (control && control.errors && control.touched) {
      if (control.errors['required']) return 'Este campo es requerido';
      if (control.errors['invalidAirport']) return 'Ingrese un aeropuerto válido';
      if (control.errors['invalidAddress']) return 'Ingrese una dirección válida';
      if (control.errors['invalidPhone']) return 'Ingrese un teléfono válido';
      if (control.errors['tooSoon']) return 'La reserva debe ser con al menos 2 horas de anticipación';
    }
    return null;
  }
}
