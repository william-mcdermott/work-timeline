import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import {
  STATUS_CONFIG,
  WorkCenterDocument,
  WorkOrderDocument,
} from '../../../../../models/work-order.model';
import { WorkOrderService } from '../../../../../services/work-order.service';

@Component({
  selector: 'app-work-orders',
  imports: [CommonModule],
  templateUrl: './work-orders.html',
  styleUrl: './work-orders.scss',
})
export class WorkOrders {
  private workOrderService = inject(WorkOrderService);

  workOrders: WorkOrderDocument[] = [];
  statusConfig = STATUS_CONFIG;

  @Input() workCenter!: WorkCenterDocument;
  @Input() getPositionForDate!: (date: string) => number;
  @Input() zoomLevel!: string;
  @Input() columnWidth!: number;
  @Input() openMenuId!: string | null;
  @Input() onEdit!: (workOrder: WorkOrderDocument) => void;

  getWorkOrdersForCenter(workCenterId: string): WorkOrderDocument[] {
    return this.workOrders.filter((wo) => wo.data.workCenterId === workCenterId);
  }

  getWidthForDateRange(startDate: string, endDate: string): number {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const daysDiff = Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;

    if (this.zoomLevel === 'day') {
      return daysDiff * this.columnWidth;
    } else if (this.zoomLevel === 'week') {
      return Math.ceil(daysDiff / 7) * this.columnWidth;
    } else {
      const monthsDiff =
        (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth()) + 1;
      return monthsDiff * this.columnWidth;
    }
  }

  toggleMenu(orderId: string, event: Event): void {
    event.stopPropagation();
    this.openMenuId = this.openMenuId === orderId ? null : orderId;
  }

  onDelete(orderId: string): void {
    this.workOrderService.deleteWorkOrder(orderId);
    this.openMenuId = null;
  }
}
