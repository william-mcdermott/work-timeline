import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-today-indicator',
  imports: [],
  templateUrl: './today-indicator.html',
  styleUrl: './today-indicator.scss',
})
export class TodayIndicator {
  constructor() {}
  @Input() getPositionForDate!: Function;

  today = new Date().toISOString().split('T')[0];
}
