import { ChangeDetectionStrategy, Component, effect, input, output, signal } from '@angular/core';
import { ZoomLevel } from '../../../models/work-order.model';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';

interface ZoomOption {
  label: string;
  value: ZoomLevel;
}

@Component({
  selector: 'app-header',
  imports: [FormsModule, NgSelectModule],
  templateUrl: './header.html',
  styleUrl: './header.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Header {
  zoomLevel = input.required<ZoomLevel>();
  readonly zoomLevelChange = output<ZoomLevel>();

  selectedZoom = signal<ZoomLevel>('month');

  zoomOptions: ZoomOption[] = [
    { label: 'Day', value: 'day' },
    { label: 'Week', value: 'week' },
    { label: 'Month', value: 'month' },
  ];

  constructor() {
    effect(() => {
      this.selectedZoom.set(this.zoomLevel());
    });
  }

  onZoomChange(newZoomLevel: ZoomLevel): void {
    this.zoomLevelChange.emit(newZoomLevel);
  }
}
