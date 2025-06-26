import { Component, Inject, PLATFORM_ID, HostListener } from '@angular/core';
import { isPlatformBrowser, CommonModule, DOCUMENT } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BookingService } from '../../services/booking.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  isMenuOpen = false;
  isScrolled = false;
  showConsultationModal = false;
  bookingId = '';
  private browser: boolean;

  constructor(
    private bookingService: BookingService,
    @Inject(PLATFORM_ID) platformId: Object,
    @Inject(DOCUMENT) private doc: any
  ) {
    this.browser = isPlatformBrowser(platformId);
  }

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    if (this.browser) {
      const offset = this.doc.documentElement.scrollTop || this.doc.body.scrollTop || 0;
      this.isScrolled = offset > 10;
    }
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu(): void {
    this.isMenuOpen = false;
  }

  closeMenuOnNavigate(): void {
    this.isMenuOpen = false;
  }

  openConsultation(): void {
    this.showConsultationModal = true;
    this.bookingId = '';
  }

  closeConsultation(): void {
    this.showConsultationModal = false;
    this.bookingId = '';
  }

  scrollToBooking(): void {
    if (!this.browser || !this.doc) return;
    const element = this.doc.getElementById('booking-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    this.closeMenuOnNavigate();
  }

  scrollToSection(event: Event, sectionId: string): void {
    if (!this.browser || !this.doc) return;
    event.preventDefault();
    const el = this.doc.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    this.closeMenuOnNavigate();
  }

  searchBooking(): void {
    if (this.bookingId.trim()) {
      this.bookingService.getBooking(this.bookingId).subscribe({
        next: (booking) => {
          if (booking) {
            alert(`Reserva encontrada: ${booking.id} - Estado: ${booking.status}`);
          } else {
            alert('No se encontró la reserva con ese código');
          }
          this.closeConsultation();
        },
        error: (error) => {
          alert('Error al buscar la reserva');
          console.error(error);
        }
      });
    }
  }
}
