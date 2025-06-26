import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private quoteModalState = signal<boolean>(false);

  isQuoteModalOpen = this.quoteModalState.asReadonly();

  openQuoteModal() {
    this.quoteModalState.set(true);
  }

  closeQuoteModal() {
    this.quoteModalState.set(false);
  }
}
