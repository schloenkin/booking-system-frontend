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

  slots: string[] = ['09:00', '10:00', '11:00', '13:00', '14:00'];

  selectedSlot = '';

  selectSlot(slot: string): void {
    this.selectedSlot = slot;
    this.slotSelected.emit(slot);
  }
}
