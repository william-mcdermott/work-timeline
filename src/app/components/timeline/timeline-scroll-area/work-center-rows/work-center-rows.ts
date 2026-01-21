import { CommonModule } from '@angular/common';
import { Component, ElementRef, inject, Input, OnInit, output } from '@angular/core';
import { WorkCenterDocument, WorkOrderDocument, ZoomLevel } from '../../../../models/work-order.model';
import { WorkOrderService } from '../../../../services/work-order.service';
import { DateColumn } from '../../timeline';
import { WorkOrders } from './work-orders/work-orders';

@Component({
  selector: 'app-work-center-rows',
  imports: [CommonModule, WorkOrders],
  templateUrl: './work-center-rows.html',
  styleUrl: './work-center-rows.scss',
})
export class WorkCenterRows implements OnInit {
  private workOrderService = inject(WorkOrderService);
  private elementRef = inject(ElementRef);

  // Use @Input() instead of signal inputs
  @Input({ required: true }) dateColumns!: DateColumn[];
  @Input({ required: true }) columnWidth!: number;
  @Input({ required: true }) getPositionForDate!: (date: string) => number;
  @Input({ required: true }) zoomLevel!: ZoomLevel;

  // Outputs for events
  readonly createFormRequested = output<{ workCenterId: string; clickedDate: Date; endDate: Date }>();
  readonly editRequested = output<WorkOrderDocument>();
  readonly deleteRequested = output<string>();

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
      // Find the scroll container by traversing up the DOM
      const scrollContainer = this.elementRef.nativeElement.closest('.timeline-scroll') as HTMLElement;
      const scrollLeft = scrollContainer?.scrollLeft || 0;
      clickX = event.clientX - rect.left + scrollLeft;
    } else {
      // For keyboard events, use the center of the first column
      clickX = this.columnWidth / 2;
    }

    const columnIndex = Math.floor(clickX / this.columnWidth);

    if (columnIndex >= 0 && columnIndex < this.dateColumns.length) {
      const clickedDate = new Date(this.dateColumns[columnIndex].date);
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
