import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ChangeDetectorRef
} from '@angular/core';

import {
  BookableServiceService,
  AvailabilitySlot
} from '../../../../core/services/bookable-service';

@Component({
  selector: 'app-slot-picker',
  standalone: true,
  imports: [],
  templateUrl: './slot-picker.html',
  styleUrl: './slot-picker.css',
})
export class SlotPicker implements OnChanges {

  @Input() selectedDate = '';
  @Input() serviceId = 0;
  @Input() requestedSlot = '';
  @Input() refreshTrigger = 0;

  @Output() slotSelected = new EventEmitter<string>();

  slots: AvailabilitySlot[] = [];
  selectedSlot = '';
  isLoading = false;
  errorMessage = '';

  private requestVersion = 0;

  constructor(
    private bookableServiceService: BookableServiceService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnChanges(changes: SimpleChanges): void {

    if (
      !changes['selectedDate'] &&
      !changes['serviceId'] &&
      !changes['refreshTrigger']
    ) {
      return;
    }

    this.selectedSlot = '';
    this.slotSelected.emit('');
    this.slots = [];
    this.errorMessage = '';

    const version = ++this.requestVersion;

    if (!this.selectedDate || this.serviceId <= 0) {
      this.isLoading = false;
      return;
    }

    this.isLoading = true;

    this.bookableServiceService
      .getAvailability(this.serviceId, this.selectedDate)
      .subscribe({
        next: (response) => {
          if (version !== this.requestVersion) {
            return;
          }

          this.slots = response.slots;
          this.isLoading = false;

          // Überprüfen, ob die Zeit noch verfügbar ist
          const requested = this.slots.find(
            (slot) =>
              slot.time.substring(0, 5) === this.requestedSlot &&
              slot.available
          );

          if (requested) {
            this.selectSlot(requested);
          } else if (this.requestedSlot) {
            this.errorMessage =
              'Your previously selected time is no longer available. Please choose another slot.';
          }

          this.cdr.detectChanges();
        },

        error: (error) => {
          if (version !== this.requestVersion) {
            return;
          }

          console.error('AVAILABILITY ERROR:', error);
          this.errorMessage = 'Could not load available slots.';
          this.isLoading = false;
          this.cdr.detectChanges();
        }
      });
  }

  selectSlot(slot: AvailabilitySlot): void {
    if (!slot.available || this.isLoading) {
      return;
    }

    this.selectedSlot = slot.time.substring(0, 5);
    this.slotSelected.emit(this.selectedSlot);
  }
}
