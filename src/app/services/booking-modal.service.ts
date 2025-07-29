import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BookingModalService {
  private bookingModalSubject = new Subject<boolean>();
  
  // Observable que los componentes pueden suscribirse
  bookingModal$ = this.bookingModalSubject.asObservable();

  // Método para abrir el modal de booking
  openBookingModal(): void {
    this.bookingModalSubject.next(true);
  }

  // Método para cerrar el modal de booking
  closeBookingModal(): void {
    this.bookingModalSubject.next(false);
  }
}
