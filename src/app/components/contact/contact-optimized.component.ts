import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ContactService } from '../../services/contact.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <!-- Contact Form - Compacto y Responsivo -->
    <div class="w-full">
      <div class="mb-4 sm:mb-6">
        <h3 class="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
          Envíanos un mensaje
        </h3>
        <p class="text-sm sm:text-base text-gray-600">
          Te responderemos en menos de 24 horas
        </p>
      </div>

      <form [formGroup]="contactForm" (ngSubmit)="onSubmit()" class="space-y-4 sm:space-y-5">
        <!-- Name and Email Row -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="form-group">
            <label class="form-label">Nombre *</label>
            <input 
              type="text" 
              formControlName="name"
              class="form-input"
              placeholder="Tu nombre completo"
            >
            <div *ngIf="contactForm.get('name')?.invalid && contactForm.get('name')?.touched" 
                 class="error-message">
              El nombre es requerido
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Email *</label>
            <input 
              type="email" 
              formControlName="email"
              class="form-input"
              placeholder="tu@email.com"
            >
            <div *ngIf="contactForm.get('email')?.invalid && contactForm.get('email')?.touched" 
                 class="error-message">
              Email válido es requerido
            </div>
          </div>
        </div>

        <!-- Phone -->
        <div class="form-group">
          <label class="form-label">Teléfono</label>
          <input 
            type="tel" 
            formControlName="phone"
            class="form-input"
            placeholder="+34 6XX XXX XXX"
          >
        </div>

        <!-- Service Type -->
        <div class="form-group">
          <label class="form-label">Tipo de servicio</label>
          <select formControlName="serviceType" class="form-input">
            <option value="">Selecciona un servicio</option>
            <option value="airport-transfer">Traslado al aeropuerto</option>
            <option value="city-transfer">Traslado en ciudad</option>
            <option value="hourly">Servicio por horas</option>
            <option value="other">Otro</option>
          </select>
        </div>

        <!-- Message -->
        <div class="form-group">
          <label class="form-label">Mensaje *</label>
          <textarea 
            formControlName="message"
            rows="4"
            class="form-input resize-none"
            placeholder="Cuéntanos los detalles de tu viaje: origen, destino, fecha, hora..."
          ></textarea>
          <div *ngIf="contactForm.get('message')?.invalid && contactForm.get('message')?.touched" 
               class="error-message">
            El mensaje es requerido
          </div>
        </div>

        <!-- Submit Button -->
        <button 
          type="submit" 
          class="submit-button"
          [disabled]="contactForm.invalid || isSubmitting"
        >
          <svg *ngIf="!isSubmitting" class="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
          </svg>
          <svg *ngIf="isSubmitting" class="w-4 h-4 sm:w-5 sm:h-5 mr-2 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {{ isSubmitting ? 'Enviando...' : 'Enviar Mensaje' }}
        </button>
      </form>

      <!-- Success/Error Messages -->
      <div *ngIf="successMessage" class="success-message">
        <svg class="w-5 h-5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
        </svg>
        <span>{{ successMessage }}</span>
      </div>

      <div *ngIf="errorMessage" class="error-message-box">
        <svg class="w-5 h-5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
        <span>{{ errorMessage }}</span>
      </div>

      <!-- Quick Contact Options -->
      <div class="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-200">
        <p class="text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4 text-center">
          ¿Necesitas respuesta inmediata?
        </p>
        <div class="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <a href="tel:+34900123456" 
             class="quick-contact-button bg-green-500 hover:bg-green-600">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
            </svg>
            <span class="hidden sm:inline">Llamar ahora</span>
            <span class="sm:hidden">Llamar</span>
          </a>
          <a href="https://wa.me/34900123456" 
             target="_blank" 
             class="quick-contact-button bg-green-600 hover:bg-green-700">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.087"/>
            </svg>
            <span class="hidden sm:inline">WhatsApp</span>
            <span class="sm:hidden">WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    /* Form Styles - Compacto y moderno */
    .form-group {
      margin-bottom: 0;
    }

    .form-label {
      display: block;
      font-size: clamp(0.75rem, 2vw, 0.875rem);
      font-weight: 600;
      color: #374151;
      margin-bottom: clamp(0.375rem, 1vw, 0.5rem);
      line-height: 1.2;
    }

    .form-input {
      width: 100%;
      padding: clamp(0.75rem, 2.5vw, 1rem);
      font-size: clamp(0.875rem, 2.2vw, 1rem);
      border: 1.5px solid #e5e7eb;
      border-radius: clamp(0.5rem, 1.5vw, 0.75rem);
      background: rgba(255, 255, 255, 0.8);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      backdrop-filter: blur(4px);
      min-height: 44px;
    }

    .form-input:focus {
      outline: none;
      border-color: #f59e0b;
      box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.1);
      background: rgba(255, 255, 255, 0.95);
    }

    .form-input::placeholder {
      color: #9ca3af;
      font-size: clamp(0.8rem, 2vw, 0.875rem);
    }

    /* Submit Button */
    .submit-button {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: clamp(0.875rem, 2.5vw, 1rem) clamp(1.5rem, 4vw, 2rem);
      font-size: clamp(0.875rem, 2.2vw, 1rem);
      font-weight: 600;
      color: white;
      background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
      border: none;
      border-radius: clamp(0.5rem, 1.5vw, 0.75rem);
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 0 4px 16px rgba(245, 158, 11, 0.25);
      min-height: 48px;
    }

    .submit-button:hover:not(:disabled) {
      background: linear-gradient(135deg, #d97706 0%, #b45309 100%);
      transform: translateY(-1px);
      box-shadow: 0 6px 20px rgba(245, 158, 11, 0.35);
    }

    .submit-button:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }

    /* Error Messages */
    .error-message {
      color: #ef4444;
      font-size: clamp(0.7rem, 1.8vw, 0.75rem);
      margin-top: 0.25rem;
      font-weight: 500;
    }

    .success-message {
      display: flex;
      align-items: center;
      padding: clamp(0.75rem, 2vw, 1rem);
      background: rgba(16, 185, 129, 0.1);
      border: 1px solid rgba(16, 185, 129, 0.2);
      border-radius: clamp(0.5rem, 1.5vw, 0.75rem);
      color: #047857;
      font-size: clamp(0.875rem, 2vw, 1rem);
      font-weight: 500;
      margin-top: clamp(1rem, 2.5vw, 1.5rem);
    }

    .error-message-box {
      display: flex;
      align-items: center;
      padding: clamp(0.75rem, 2vw, 1rem);
      background: rgba(239, 68, 68, 0.1);
      border: 1px solid rgba(239, 68, 68, 0.2);
      border-radius: clamp(0.5rem, 1.5vw, 0.75rem);
      color: #dc2626;
      font-size: clamp(0.875rem, 2vw, 1rem);
      font-weight: 500;
      margin-top: clamp(1rem, 2.5vw, 1.5rem);
    }

    /* Quick Contact Buttons */
    .quick-contact-button {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: clamp(0.625rem, 2vw, 0.75rem) clamp(1rem, 3vw, 1.25rem);
      font-size: clamp(0.75rem, 2vw, 0.875rem);
      font-weight: 600;
      color: white;
      text-decoration: none;
      border-radius: clamp(0.375rem, 1vw, 0.5rem);
      transition: all 0.3s ease;
      min-height: 40px;
      gap: clamp(0.25rem, 1vw, 0.5rem);
    }

    .quick-contact-button:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    /* Responsive adjustments */
    @media (max-width: 640px) {
      .grid.sm\\:grid-cols-2 {
        grid-template-columns: 1fr;
      }
      
      .form-input {
        font-size: 16px; /* Prevent zoom on iOS */
      }
    }

    /* Reduced motion support */
    @media (prefers-reduced-motion: reduce) {
      .submit-button:hover,
      .quick-contact-button:hover {
        transform: none;
      }
    }
  `]
})
export class ContactComponent {
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

  async onSubmit() {
    if (this.contactForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      this.errorMessage = '';
      this.successMessage = '';

      try {
        // Simulate API call - replace with actual service call
        await new Promise(resolve => setTimeout(resolve, 2000));
        this.successMessage = '¡Mensaje enviado con éxito! Te responderemos pronto.';
        this.contactForm.reset();
      } catch (error) {
        this.errorMessage = 'Hubo un error al enviar el mensaje. Por favor, intenta nuevamente.';
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
