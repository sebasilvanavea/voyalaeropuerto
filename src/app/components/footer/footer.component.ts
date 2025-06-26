import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent implements OnInit {
  email = '';
  showBackToTop = false;

  constructor() { }

  ngOnInit(): void {
    this.checkScrollPosition();
  }

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    this.checkScrollPosition();
  }
  private checkScrollPosition(): void {
    if (typeof window !== 'undefined') {
      this.showBackToTop = window.scrollY > 300;
    }
  }

  subscribeNewsletter(): void {
    if (this.email) {
      // Simulate newsletter subscription
      alert(`¡Gracias por suscribirte! Te enviaremos noticias y ofertas especiales a ${this.email}`);
      this.email = '';
    }
  }
  scrollToTop(): void {
    if (typeof window !== 'undefined') {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  }
}
