import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BookingService } from '../../services/booking.service';
import { Zone, Vehicle } from '../../data/fares';

interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
}

interface BookingFormData {
  direction: 'to-airport' | 'from-airport';
  zoneName: string;
  departureDate: string;
  departureTime: string;
  passengers: number;
  largeLuggages: number;
  mediumLuggages: number;
  smallLuggages: number;
  vehicleType: 'Taxi' | 'SUV';
  user: UserData;
}

interface BookingConfirmation {
  id: string;
  bookingData: BookingFormData;
  totalFare: number;
  createdAt: Date;
  status: 'confirmed';
}

@Component({
  selector: 'app-booking-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './booking-form.component.html',
  styleUrl: './booking-form.component.scss'
})
export class BookingFormComponent implements OnInit {  currentStep = 1;
  totalSteps = 5; // Agregamos un paso más para datos del usuario
  steps = [
    { icon: 'pi pi-map-marker', label: 'Ruta' },
    { icon: 'pi pi-calendar', label: 'Fecha y Hora' },
    { icon: 'pi pi-users', label: 'Pasajeros y Equipaje' },
    { icon: 'pi pi-car', label: 'Vehículo y Tarifa' },
    { icon: 'pi pi-user', label: 'Datos del Usuario' }
  ];
  isLoading = false;
  showConfirmation = false;
  bookingConfirmation: BookingConfirmation | null = null;
  today = '';
  zones: Zone[] = [];
  vehicles: Vehicle[] = [];
  calculatedFare: number | null = null;
  errorMessage: string | null = null;

  bookingData: BookingFormData = {
    direction: 'to-airport',
    zoneName: '',
    departureDate: '',
    departureTime: '',
    passengers: 1,
    largeLuggages: 0,
    mediumLuggages: 0,
    smallLuggages: 0,
    vehicleType: 'Taxi',
    user: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: ''
    }
  };
  constructor(private bookingService: BookingService) {
    const today = new Date();
    this.today = today.toISOString().split('T')[0];
    this.bookingData.departureDate = this.today;
  }
  ngOnInit(): void {
    this.bookingService.getZones().subscribe((zones: Zone[]) => {
      this.zones = zones;
      // Set default zone
      if (this.zones.length > 0) {
        this.bookingData.zoneName = this.zones[0].name;
      }
    });
    
    this.bookingService.getFareVehicles().subscribe((vehicles: Vehicle[]) => {
      this.vehicles = vehicles;
    });
  }

  updateDirection(direction: 'to-airport' | 'from-airport'): void {
    this.bookingData.direction = direction;
    this.calculateFare();
  }

  onFormChange(): void {
    this.calculateFare();
  }

  calculateFare(): void {
    this.errorMessage = null;
    this.calculatedFare = null;

    if (!this.bookingData.zoneName || !this.bookingData.vehicleType) {
      return;
    }    try {
      const fare = this.bookingService.calculateFare(
        this.bookingData.zoneName,
        this.bookingData.vehicleType,
        this.bookingData.direction,
        this.bookingData.passengers,
        this.bookingData.largeLuggages,
        this.bookingData.mediumLuggages,
        this.bookingData.smallLuggages
      );
      this.calculatedFare = fare;
    } catch (error: any) {
      this.errorMessage = error.message;
    }
  }

  updatePassengers(change: number): void {
    const newCount = this.bookingData.passengers + change;
    if (newCount >= 1) {
      this.bookingData.passengers = newCount;
      this.calculateFare();
    }
  }

  updateLuggages(type: 'large' | 'medium' | 'small', change: number): void {
    const prop = `${type}Luggages` as 'largeLuggages' | 'mediumLuggages' | 'smallLuggages';
    const newCount = this.bookingData[prop] + change;
    if (newCount >= 0) {
      this.bookingData[prop] = newCount;
      this.calculateFare();
    }
  }
  canProceed(): boolean {
    switch (this.currentStep) {
      case 1:
        return !!this.bookingData.zoneName;
      case 2:
        return !!this.bookingData.departureDate && !!this.bookingData.departureTime;
      case 3:
        return this.bookingData.passengers > 0;
      case 4:
        return !this.errorMessage && this.calculatedFare !== null;
      case 5:
        return !!(this.bookingData.user.firstName && 
                 this.bookingData.user.lastName && 
                 this.bookingData.user.email && 
                 this.bookingData.user.phone);
      default:
        return false;
    }
  }
  nextStep(): void {
    if (this.canProceed() && this.currentStep < this.totalSteps) {
      this.currentStep++;
      // Recalculate fare when moving to step 4 (vehicle selection)
      if (this.currentStep === 4) {
        this.calculateFare();
      }
    }
  }

  prevStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  getProgressBarWidth(): string {
    return ((this.currentStep - 1) / (this.totalSteps - 1)) * 100 + '%';
  }

  selectVehicle(vehicle: Vehicle): void {
    this.bookingData.vehicleType = vehicle.type;
    this.calculateFare();
  }

  getTotalLuggage(): number {
    return this.bookingData.largeLuggages + this.bookingData.mediumLuggages + this.bookingData.smallLuggages;
  }
  bookNow(): void {
    if (this.canProceed() && this.calculatedFare !== null) {
      this.isLoading = true;
      this.errorMessage = null;
      
      // Simulate API call
      setTimeout(() => {
        this.isLoading = false;
        
        // Create booking confirmation
        this.bookingConfirmation = {
          id: this.generateBookingId(),
          bookingData: { ...this.bookingData },
          totalFare: this.calculatedFare!,
          createdAt: new Date(),
          status: 'confirmed'
        };
        
        this.showConfirmation = true;
      }, 2000);
    }
  }

  generateBookingId(): string {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    let result = '';
    
    // Generate 2 letters
    for (let i = 0; i < 2; i++) {
      result += letters.charAt(Math.floor(Math.random() * letters.length));
    }
    
    // Generate 6 numbers
    for (let i = 0; i < 6; i++) {
      result += numbers.charAt(Math.floor(Math.random() * numbers.length));
    }
    
    return result;
  }

  closeConfirmation(): void {
    this.showConfirmation = false;
    this.resetForm();
  }

  resetForm(): void {
    this.currentStep = 1;
    this.calculatedFare = null;
    this.errorMessage = null;
    this.bookingConfirmation = null;
    
    this.bookingData = {
      direction: 'to-airport',
      zoneName: this.zones.length > 0 ? this.zones[0].name : '',
      departureDate: this.today,
      departureTime: '',
      passengers: 1,
      largeLuggages: 0,
      mediumLuggages: 0,
      smallLuggages: 0,
      vehicleType: 'Taxi',
      user: {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: ''
      }
    };
  }
}
