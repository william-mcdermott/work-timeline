import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimelineScrollArea {
  // Inputs using signal-based API
  dateColumns = input.required<DateColumn[]>();
  columnWidth = input.required<number>();
  getPositionForDate = input.required<(date: string) => number>();
  zoomLevel = input.required<ZoomLevel>();

  // Outputs for events
  readonly createFormRequested = output<{ workCenterId: string; clickedDate: Date; endDate: Date }>();
  readonly editRequested = output<WorkOrderDocument>();
  readonly deleteRequested = output<string>();

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
}
