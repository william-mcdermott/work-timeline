import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { DateColumn } from '../timeline';
import { WorkCenterRows } from './work-center-rows/work-center-rows';
import { GridLines } from './grid-lines/grid-lines';

@Component({
  selector: 'app-timeline-scroll-area',
  imports: [CommonModule, WorkCenterRows, GridLines],
  templateUrl: './timeline-scroll-area.html',
  styleUrl: './timeline-scroll-area.scss',
})
export class TimelineScrollArea {
  constructor() {}
  @Input() dateColumns!: DateColumn[];
  @Input() columnWidth!: number;
  @Input() prepForm!: Function;

  trackByColumn(index: number, column: DateColumn): string {
    return column.date;
  }
}
