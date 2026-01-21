import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, inject, Input, output, ViewChild } from '@angular/core';
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
export class TimelineScrollArea implements AfterViewInit {
  private cdr = inject(ChangeDetectorRef);

  // Use @Input() instead of signal inputs
  private _dateColumns: DateColumn[] = [];
  @Input({ required: true })
  set dateColumns(value: DateColumn[]) {
    this._dateColumns = [...value]; // Create a new array reference
  }
  get dateColumns(): DateColumn[] {
    return this._dateColumns;
  }

  @Input({ required: true }) columnWidth!: number;
  @Input({ required: true }) getPositionForDate!: (date: string) => number;
  @Input({ required: true }) zoomLevel!: ZoomLevel;

  // Outputs for events
  readonly createFormRequested = output<{ workCenterId: string; clickedDate: Date; endDate: Date }>();
  readonly editRequested = output<WorkOrderDocument>();
  readonly deleteRequested = output<string>();

  @ViewChild('timelineScroll') timelineScrollRef!: ElementRef<HTMLDivElement>;

  ngAfterViewInit() {
    // Removed debug logging
  }

  trackByColumn(index: number, column: DateColumn): string {
    return column.date;
  }

  handleCreateFormRequest(event: { workCenterId: string; clickedDate: Date; endDate: Date }): void {
    this.createFormRequested.emit(event);
  }

  handleEdit(workOrder: WorkOrderDocument): void {
    this.editRequested.emit(workOrder);
  }

  handleDelete(orderId: string): void {
    this.deleteRequested.emit(orderId);
  }

  isCurrentMonth(dateString: string): boolean {
    if (this.zoomLevel !== 'month') {
      return false;
    }
    // Parse date string as YYYY-MM-DD to avoid timezone issues
    const [year, month] = dateString.split('-').map(Number);
    // For demo purposes, treat January 2026 as the "current" month
    // month in the string is 1-based (01 = January)
    return month === 1 && year === 2026;
  }
}
