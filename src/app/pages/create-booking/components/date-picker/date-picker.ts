import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-date-picker',
  standalone: true,
  imports: [],
  templateUrl: './date-picker.html',
  styleUrl: './date-picker.css',
})
export class DatePicker {
  @Output() dateSelected = new EventEmitter<string>();

  selectDate(event: Event): void {
    const input = event.target as HTMLInputElement;

    this.dateSelected.emit(input.value);
  }
}
