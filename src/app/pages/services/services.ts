import { SlotPicker } from '../create-booking/components/slot-picker/slot-picker';
import { DatePicker } from '../create-booking/components/date-picker/date-picker';

import {
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';

import {
  BookableService,
  BookableServiceService
} from '../../core/services/bookable-service';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [SlotPicker, DatePicker],
  templateUrl: './services.html',
  styleUrl: './services.css',
})
export class Services implements OnInit {

  services: BookableService[] = [];
  selectedService: BookableService | null = null;
  selectedDate = '';
  selectedSlot = '';

  selectService(service: BookableService): void {
    this.selectedService = service;
    this.selectedDate = '';
    this.selectedSlot = '';
  }

  onDateSelected(date: string): void {
    this.selectedDate = date;
    this.selectedSlot = '';
  }

  onSlotSelected(slot: string): void {
    this.selectedSlot = slot;
  }

  closeAvailability(): void {
    this.selectedService = null;
    this.selectedDate = '';
    this.selectedSlot = '';
  }

  isLoading = true;
  errorMessage = '';

  constructor(
    private bookableServiceService: BookableServiceService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.bookableServiceService.getAllServices().subscribe({
      next: (services) => {
        this.services = services.filter(
          (service) => service.active
        );

        this.isLoading = false;
        this.cdr.detectChanges();
      },

      error: (error) => {
        console.error('LOAD SERVICES ERROR:', error);

        this.errorMessage = 'Could not load services.';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }
}
