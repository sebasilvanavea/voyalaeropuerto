import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ContactService } from '../../services/contact.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-contact-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule],
  template: `
    <!-- Contact Form - Ultra Compacto y Responsivo -->
    <div class="contact-form-container">
      <div class="contact-form-header">
        <h3 class="contact-form-title">
          {{ 'CONTACT.FORM.TITLE' | translate }}
        </h3>
        <p class="contact-form-subtitle">
          {{ 'CONTACT.FORM.SUBTITLE' | translate }}
        </p>
      </div>

      <form [formGroup]="contactForm" (ngSubmit)="onSubmit()" class="contact-form" novalidate>
        <!-- Nombre y Email en fila -->
        <div class="input-row">
          <div class="input-group">
            <label for="name" class="input-label">{{ 'CONTACT.FORM.NAME' | translate }} *</label>
            <input 
              id="name"
              type="text" 
              formControlName="name"
              class="input-field"
              [placeholder]="'CONTACT.FORM.NAME' | translate"
              autocomplete="name"
            >
            <div *ngIf="contactForm.get('name')?.invalid && contactForm.get('name')?.touched" 
                 class="input-error">
              <svg class="error-icon" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
              </svg>
              {{ 'CONTACT.FORM.NAME_REQUIRED' | translate }}
            </div>
          </div>

          <div class="input-group">
            <label for="email" class="input-label">{{ 'CONTACT.FORM.EMAIL' | translate }} *</label>
            <input 
              id="email"
              type="email" 
              formControlName="email"
              class="input-field"
              placeholder="tu@email.com"
              autocomplete="email"
            >
            <div *ngIf="contactForm.get('email')?.invalid && contactForm.get('email')?.touched" 
                 class="input-error">
              <svg class="error-icon" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
              </svg>
              {{ 'CONTACT.FORM.EMAIL_REQUIRED' | translate }}
            </div>
          </div>
        </div>

        <!-- Teléfono y Servicio en fila -->
        <div class="input-row">
          <div class="input-group">
            <label for="phone" class="input-label">{{ 'CONTACT.FORM.PHONE' | translate }}</label>
            <input 
              id="phone"
              type="tel" 
              formControlName="phone"
              class="input-field"
              placeholder="+34 6XX XXX XXX"
              autocomplete="tel"
            >
          </div>

          <div class="input-group">
            <label for="serviceType" class="input-label">Servicio</label>
            <select id="serviceType" formControlName="serviceType" class="input-field select-field">
              <option value="">Seleccionar...</option>
              <option value="airport-transfer">🛫 Al aeropuerto</option>
              <option value="city-transfer">🏙️ En ciudad</option>
              <option value="hourly">⏱️ Por horas</option>
              <option value="other">📋 Otro</option>
            </select>
          </div>
        </div>

        <!-- Mensaje completo -->
        <div class="input-group">
          <label for="message" class="input-label">Mensaje *</label>
          <textarea 
            id="message"
            formControlName="message"
            rows="3"
            class="input-field textarea-field"
            placeholder="Detalles del viaje: origen, destino, fecha, hora, pasajeros..."
          ></textarea>
          <div *ngIf="contactForm.get('message')?.invalid && contactForm.get('message')?.touched" 
               class="input-error">
            <svg class="error-icon" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
            </svg>
            Mensaje requerido (mínimo 10 caracteres)
          </div>
        </div>

        <!-- Botón de envío -->
        <button 
          type="submit" 
          class="submit-btn"
          [class.loading]="isSubmitting"
          [disabled]="contactForm.invalid || isSubmitting"
        >
          <svg *ngIf="!isSubmitting" class="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
          </svg>
          <svg *ngIf="isSubmitting" class="btn-icon animate-spin" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>{{ isSubmitting ? 'Enviando...' : 'Enviar Mensaje' }}</span>
        </button>
      </form>

      <!-- Mensajes de estado -->
      <div *ngIf="successMessage" class="status-message success">
        <svg class="status-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
        </svg>
        <span>{{ successMessage }}</span>
      </div>

      <div *ngIf="errorMessage" class="status-message error">
        <svg class="status-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
        <span>{{ errorMessage }}</span>
      </div>

      <!-- Contacto rápido -->
      <div class="quick-contact">
        <p class="quick-contact-text">¿Necesitas respuesta inmediata?</p>
        <div class="quick-contact-buttons">
          <a href="tel:+34900123456" class="quick-btn phone">
            <svg class="quick-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
            </svg>
            <span>Llamar</span>
          </a>
          <a href="https://wa.me/34900123456" target="_blank" rel="noopener" class="quick-btn whatsapp">
            <svg class="quick-icon" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.087"/>
            </svg>
            <span>WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    /* === CONTACT FORM STYLES === */
    .contact-form-container {
      width: 100%;
      max-width: 100%;
    }

    /* Header */
    .contact-form-header {
      margin-bottom: clamp(1rem, 3vw, 1.5rem);
      text-align: center;
    }

    .contact-form-title {
      font-size: clamp(1.125rem, 3vw, 1.25rem);
      font-weight: 700;
      color: #111827;
      margin-bottom: clamp(0.5rem, 1.5vw, 0.75rem);
      line-height: 1.2;
    }

    .contact-form-subtitle {
      font-size: clamp(0.75rem, 2vw, 0.875rem);
      color: #6b7280;
      margin: 0;
    }

    /* Form */
    .contact-form {
      display: flex;
      flex-direction: column;
      gap: clamp(0.75rem, 2.5vw, 1rem);
    }

    /* Input rows */
    .input-row {
      display: grid;
      grid-template-columns: 1fr;
      gap: clamp(0.75rem, 2.5vw, 1rem);
    }

    @media (min-width: 640px) {
      .input-row {
        grid-template-columns: 1fr 1fr;
      }
    }

    /* Input groups */
    .input-group {
      display: flex;
      flex-direction: column;
      gap: clamp(0.25rem, 1vw, 0.375rem);
    }

    .input-label {
      font-size: clamp(0.75rem, 2vw, 0.875rem);
      font-weight: 600;
      color: #374151;
      line-height: 1.2;
    }

    /* Input fields */
    .input-field {
      width: 100%;
      padding: clamp(0.625rem, 2.5vw, 0.875rem);
      font-size: clamp(0.875rem, 2.2vw, 1rem);
      border: 1.5px solid #e5e7eb;
      border-radius: clamp(0.375rem, 1.5vw, 0.5rem);
      background: rgba(255, 255, 255, 0.8);
      transition: all 0.2s ease;
      min-height: 44px;
      backdrop-filter: blur(2px);
    }

    .input-field:focus {
      outline: none;
      border-color: #f59e0b;
      box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.1);
      background: rgba(255, 255, 255, 0.95);
    }

    .input-field::placeholder {
      color: #9ca3af;
      font-size: clamp(0.8rem, 2vw, 0.875rem);
    }

    .select-field {
      cursor: pointer;
    }

    .textarea-field {
      resize: none;
      min-height: clamp(80px, 15vw, 96px);
    }

    /* Error messages */
    .input-error {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      color: #ef4444;
      font-size: clamp(0.625rem, 1.8vw, 0.75rem);
      font-weight: 500;
    }

    .error-icon {
      width: clamp(12px, 2vw, 14px);
      height: clamp(12px, 2vw, 14px);
      flex-shrink: 0;
    }

    /* Submit button */
    .submit-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: clamp(0.375rem, 1.5vw, 0.5rem);
      width: 100%;
      padding: clamp(0.75rem, 2.5vw, 1rem);
      font-size: clamp(0.875rem, 2.2vw, 1rem);
      font-weight: 600;
      color: white;
      background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
      border: none;
      border-radius: clamp(0.375rem, 1.5vw, 0.5rem);
      cursor: pointer;
      transition: all 0.2s ease;
      min-height: 48px;
      box-shadow: 0 2px 8px rgba(245, 158, 11, 0.25);
    }

    .submit-btn:hover:not(:disabled) {
      background: linear-gradient(135deg, #d97706 0%, #b45309 100%);
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(245, 158, 11, 0.35);
    }

    .submit-btn:disabled {
      opacity: 0.7;
      cursor: not-allowed;
      transform: none;
    }

    .btn-icon {
      width: clamp(16px, 3vw, 20px);
      height: clamp(16px, 3vw, 20px);
      flex-shrink: 0;
    }

    /* Status messages */
    .status-message {
      display: flex;
      align-items: center;
      gap: clamp(0.375rem, 1.5vw, 0.5rem);
      padding: clamp(0.75rem, 2vw, 1rem);
      border-radius: clamp(0.375rem, 1.5vw, 0.5rem);
      font-size: clamp(0.875rem, 2vw, 1rem);
      font-weight: 500;
      margin-top: clamp(0.75rem, 2vw, 1rem);
    }

    .status-message.success {
      background: rgba(16, 185, 129, 0.1);
      border: 1px solid rgba(16, 185, 129, 0.2);
      color: #047857;
    }

    .status-message.error {
      background: rgba(239, 68, 68, 0.1);
      border: 1px solid rgba(239, 68, 68, 0.2);
      color: #dc2626;
    }

    .status-icon {
      width: clamp(16px, 3vw, 20px);
      height: clamp(16px, 3vw, 20px);
      flex-shrink: 0;
    }

    /* Quick contact */
    .quick-contact {
      margin-top: clamp(1rem, 3vw, 1.5rem);
      padding-top: clamp(1rem, 3vw, 1.5rem);
      border-top: 1px solid #e5e7eb;
      text-align: center;
    }

    .quick-contact-text {
      font-size: clamp(0.75rem, 2vw, 0.875rem);
      color: #6b7280;
      margin: 0 0 clamp(0.75rem, 2vw, 1rem) 0;
    }

    .quick-contact-buttons {
      display: flex;
      gap: clamp(0.5rem, 2vw, 0.75rem);
      justify-content: center;
    }

    .quick-btn {
      display: flex;
      align-items: center;
      gap: clamp(0.25rem, 1vw, 0.375rem);
      padding: clamp(0.5rem, 2vw, 0.625rem) clamp(0.75rem, 3vw, 1rem);
      font-size: clamp(0.75rem, 2vw, 0.875rem);
      font-weight: 600;
      color: white;
      text-decoration: none;
      border-radius: clamp(0.25rem, 1vw, 0.375rem);
      transition: all 0.2s ease;
      min-height: 36px;
    }

    .quick-btn.phone {
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    }

    .quick-btn.whatsapp {
      background: linear-gradient(135deg, #25d366 0%, #128c7e 100%);
    }

    .quick-btn:hover {
      transform: translateY(-1px);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    }

    .quick-icon {
      width: clamp(14px, 2.5vw, 16px);
      height: clamp(14px, 2.5vw, 16px);
      flex-shrink: 0;
    }

    /* Mobile optimizations */
    @media (max-width: 640px) {
      .input-field {
        font-size: 16px; /* Prevent zoom on iOS */
      }
    }

    /* Accessibility */
    .input-field:focus-visible,
    .submit-btn:focus-visible,
    .quick-btn:focus-visible {
      outline: 2px solid #f59e0b;
      outline-offset: 2px;
    }

    /* Reduced motion */
    @media (prefers-reduced-motion: reduce) {
      .input-field,
      .submit-btn,
      .quick-btn {
        transition: none;
      }
      
      .submit-btn:hover,
      .quick-btn:hover {
        transform: none;
      }
    }

    /* Performance optimizations */
    .input-field,
    .submit-btn,
    .quick-btn {
      will-change: transform;
      backface-visibility: hidden;
    }
  `]
})
export class ContactFormComponent implements OnInit {
  contactForm: FormGroup;
  isSubmitting = false;
  successMessage: string = '';
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private contactService: ContactService
  ) {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      serviceType: [''],
      message: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  ngOnInit() {
    // Clear messages after 5 seconds
    this.contactForm.statusChanges.subscribe(() => {
      if (this.successMessage || this.errorMessage) {
        setTimeout(() => {
          this.successMessage = '';
          this.errorMessage = '';
        }, 5000);
      }
    });
  }

  async onSubmit() {
    if (this.contactForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      this.errorMessage = '';
      this.successMessage = '';

      try {
        await this.contactService.sendMessage(this.contactForm.value);
        this.successMessage = '¡Mensaje enviado con éxito! Te contactaremos pronto.';
        this.contactForm.reset();
      } catch (error) {
        this.errorMessage = 'Error al enviar el mensaje. Por favor, inténtalo de nuevo.';
        console.error('Contact form error:', error);
      } finally {
        this.isSubmitting = false;
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched() {
    Object.keys(this.contactForm.controls).forEach(key => {
      const control = this.contactForm.get(key);
      if (control) {
        control.markAsTouched();
      }
    });
  }
}
