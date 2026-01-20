import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { DateColumn } from '../timeline';
import { WorkCenterRows } from './work-center-rows/work-center-rows';
import { GridLines } from './grid-lines/grid-lines';
import { TodayIndicator } from './today-indicator/today-indicator';
import { WorkOrderDocument, ZoomLevel } from '../../../models/work-order.model';

@Component({
  selector: 'app-timeline-scroll-area',
  imports: [CommonModule, WorkCenterRows, GridLines, TodayIndicator],
  templateUrl: './timeline-scroll-area.html',
  styleUrl: './timeline-scroll-area.scss',
})
export class TimelineScrollArea {
  constructor() {}
  @Input() dateColumns!: DateColumn[];
  @Input() columnWidth!: number;
  @Input() prepForm!: (workCenterId: string, clickedDate: Date, endDate: Date) => void;
  @Input() getPositionForDate!: (date: string) => number;
  @Input() zoomLevel!: ZoomLevel;
  @Input() openMenuId!: string | null;
  @Input() onEdit!: (workOrder: WorkOrderDocument) => void;

  trackByColumn(index: number, column: DateColumn): string {
    return column.date;
  }
}
