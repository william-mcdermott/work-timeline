import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input, output, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkOrders {
  private workOrderService = inject(WorkOrderService);

  statusConfig = STATUS_CONFIG;

  // Inputs using signal-based API
  workCenter = input.required<WorkCenterDocument>();
  getPositionForDate = input.required<(date: string) => number>();
  zoomLevel = input.required<string>();
  columnWidth = input.required<number>();

  // Outputs for events
  readonly editRequested = output<WorkOrderDocument>();
  readonly deleteRequested = output<string>();

  // Local state
  openMenuId = signal<string | null>(null);

  // Convert observable to signal for reactivity
  private allWorkOrders = toSignal(this.workOrderService.workOrders$, { initialValue: [] });

  // Computed values
  workOrders = computed(() =>
    this.allWorkOrders()
      .filter(wo => wo.data.workCenterId === this.workCenter().docId)
  );

  getWidthForDateRange(startDate: string, endDate: string): number {
    if (this.zoomLevel() === 'month') {
      // Parse dates as YYYY-MM-DD to avoid timezone issues
      const [startYear, startMonth] = startDate.split('-').map(Number);
      const [endYear, endMonth] = endDate.split('-').map(Number);

      const monthsDiff = (endYear - startYear) * 12 + (endMonth - startMonth) + 1;
      return monthsDiff * this.columnWidth();
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    const daysDiff = Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;

    if (this.zoomLevel() === 'day') {
      return daysDiff * this.columnWidth();
    } else {
      return Math.ceil(daysDiff / 7) * this.columnWidth();
    }
  }

  toggleMenu(orderId: string, event: Event): void {
    event.stopPropagation();
    this.openMenuId.update(current => current === orderId ? null : orderId);
  }

  handleEdit(workOrder: WorkOrderDocument): void {
    this.editRequested.emit(workOrder);
    this.openMenuId.set(null);
  }

  handleDelete(orderId: string): void {
    this.deleteRequested.emit(orderId);
    this.openMenuId.set(null);
  }
}
