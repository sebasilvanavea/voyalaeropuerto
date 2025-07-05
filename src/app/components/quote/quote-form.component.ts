import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PriceCalculatorComponent } from './price-calculator.component';

@Component({
  selector: 'app-quote-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, PriceCalculatorComponent],
  template: `
    <div class="space-y-8">
      <!-- Calculadora de Precios -->
      <app-price-calculator></app-price-calculator>
      
      <!-- Formulario de Cotización Personalizada -->

    </div>
  `
})
export class QuoteFormComponent {
  quoteForm: FormGroup;
  successMessage = '';

  constructor(private fb: FormBuilder) {
    this.quoteForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      details: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.quoteForm.valid) {
      this.successMessage = '¡Cotización enviada! Te responderemos pronto.';
      this.quoteForm.reset();
    }
  }
}
