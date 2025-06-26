import { Component, HostBinding, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalService } from '../../services/modal.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextarea } from 'primeng/inputtextarea';
import { CalendarModule } from 'primeng/calendar';
import { KeyFilterModule } from 'primeng/keyfilter';

@Component({
  selector: 'app-quote-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    InputTextarea,
    CalendarModule,
    KeyFilterModule
  ],
  templateUrl: './quote-modal.component.html',
  styleUrls: ['./quote-modal.component.scss']
})
export class QuoteModalComponent {
  private modalService = inject(ModalService);
  private fb = inject(FormBuilder);

  quoteForm: FormGroup;

  isOpen = this.modalService.isQuoteModalOpen;

  @HostBinding('class.visible') get visible() {
    return this.isOpen();
  }

  constructor() {
    this.quoteForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      origin: ['', Validators.required],
      destination: ['', Validators.required],
      date: ['', Validators.required],
      passengers: [1, [Validators.required, Validators.min(1)]],
      message: ['']
    });
  }

  closeModal() {
    this.modalService.closeQuoteModal();
  }

  onSubmit() {
    if (this.quoteForm.valid) {
      console.log('Form Submitted!', this.quoteForm.value);
      // Aquí se enviaría el formulario
      this.closeModal();
    }
  }
}
