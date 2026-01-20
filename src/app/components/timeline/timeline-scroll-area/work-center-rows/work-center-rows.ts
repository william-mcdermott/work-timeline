import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, inject, input, OnInit, output, ViewChild } from '@angular/core';
import { WorkCenterDocument, WorkOrderDocument, ZoomLevel } from '../../../../models/work-order.model';
import { WorkOrderService } from '../../../../services/work-order.service';
import { DateColumn } from '../../timeline';
import { WorkOrders } from './work-orders/work-orders';

@Component({
  selector: 'app-work-center-rows',
  imports: [CommonModule, WorkOrders],
  templateUrl: './work-center-rows.html',
  styleUrl: './work-center-rows.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkCenterRows implements OnInit {
  private workOrderService = inject(WorkOrderService);

  // Inputs using signal-based API
  dateColumns = input.required<DateColumn[]>();
  columnWidth = input.required<number>();
  getPositionForDate = input.required<(date: string) => number>();
  zoomLevel = input.required<ZoomLevel>();

  // Outputs for events
  readonly createFormRequested = output<{ workCenterId: string; clickedDate: Date; endDate: Date }>();
  readonly editRequested = output<WorkOrderDocument>();
  readonly deleteRequested = output<string>();

  @ViewChild('timelineScroll') timelineScroll!: ElementRef<HTMLDivElement>;

  workCenters: WorkCenterDocument[] = [];

  ngOnInit() {
    this.workCenters = this.workOrderService.getWorkCenters();
  }

  onTimelineClick(workCenterId: string, event: Event): void {
    const target = event.target as HTMLElement;
    if (target.closest('.work-order-bar, .work-order-menu')) return;

    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();

    let clickX: number;
    if (event instanceof MouseEvent) {
      clickX = event.clientX - rect.left + (this.timelineScroll?.nativeElement.scrollLeft || 0);
    } else {
      // For keyboard events, use the center of the first column
      clickX = this.columnWidth() / 2;
    }

    const columnIndex = Math.floor(clickX / this.columnWidth());

    if (columnIndex >= 0 && columnIndex < this.dateColumns().length) {
      const clickedDate = new Date(this.dateColumns()[columnIndex].date);
      const endDate = new Date(clickedDate);
      endDate.setDate(endDate.getDate() + 7);
      this.createFormRequested.emit({ workCenterId, clickedDate, endDate });
    }
  }

  handleEdit(workOrder: WorkOrderDocument): void {
    this.editRequested.emit(workOrder);
  }

  handleDelete(orderId: string): void {
    this.deleteRequested.emit(orderId);
  }
}
