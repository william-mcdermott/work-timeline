import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-today-indicator',
  imports: [],
  templateUrl: './today-indicator.html',
  styleUrl: './today-indicator.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodayIndicator {
  getPositionForDate = input.required<(date: string) => number>();

  today = new Date().toISOString().split('T')[0];
}
