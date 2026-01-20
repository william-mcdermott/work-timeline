import { CommonModule } from '@angular/common';
import { Component, Input, TrackByFunction } from '@angular/core';
import { DateColumn } from '../../timeline';

@Component({
  selector: 'app-grid-lines',
  imports: [CommonModule],
  templateUrl: './grid-lines.html',
  styleUrl: './grid-lines.scss',
})
export class GridLines {
  constructor() {}
  @Input() dateColumns!: DateColumn[];
  @Input() columnWidth!: number;
  
  trackByColumn(index: number, column: DateColumn): string {
    return column.date;
  }

}
