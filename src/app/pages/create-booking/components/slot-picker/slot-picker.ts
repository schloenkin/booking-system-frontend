import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-slot-picker',
  standalone: true,
  imports: [],
  templateUrl: './slot-picker.html',
  styleUrl: './slot-picker.css',
})
export class SlotPicker {
  @Input() selectedDate = '';

  @Output() slotSelected = new EventEmitter<string>();

  allSlots: string[] = ['09:00', '10:00', '11:00', '13:00', '14:00'];

  get availableSlots(): string[] {
    if (!this.selectedDate) {
      return [];
    }

    const today = new Date().toISOString().split('T')[0];

    if (this.selectedDate !== today) {
      return this.allSlots;
    }

    const now = new Date();

    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    return this.allSlots.filter((slot) => {
      const [hours, minutes] = slot.split(':').map(Number);

      const slotMinutes = hours * 60 + minutes;

      return slotMinutes > currentMinutes;
    });
  }

  selectedSlot = '';

  selectSlot(slot: string): void {
    this.selectedSlot = slot;
    this.slotSelected.emit(slot);
  }
}
