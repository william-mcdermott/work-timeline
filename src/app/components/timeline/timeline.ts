import { Component, inject, OnInit } from '@angular/core';
import { Header } from './header/header';
import { TimelineGrid } from './timeline-grid/timeline-grid';
import { WorkOrderDocument, WorkOrderStatus, ZoomLevel } from '../../models/work-order.model';
import { TimelineScrollArea } from './timeline-scroll-area/timeline-scroll-area';
import { WorkOrderService } from '../../services/work-order.service';
import { SidePanel } from './side-panel/side-panel';

export interface DateColumn {
  label: string;
  date: string;
}

interface WorkOrderFormData {
  name: string;
  status: WorkOrderStatus;
  startDate: string;
  endDate: string;
  workCenterId?: string;
}

@Component({
  selector: 'app-timeline',
  imports: [Header, TimelineGrid, TimelineScrollArea, SidePanel],
  templateUrl: './timeline.html',
  styleUrl: './timeline.scss',
})
export class Timeline implements OnInit {
  private workOrderService = inject(WorkOrderService);

  zoomLevel: ZoomLevel = 'month';
  dateColumns: DateColumn[] = [];
  columnWidth = 80;
  selectedWorkCenter = '';
  panelMode: 'create' | 'edit' = 'create';
  isPanelOpen = false;
  panelInitialData: WorkOrderFormData | null = null;
  editingOrder: WorkOrderDocument | null = null;
  openMenuId: string | null = null;
  formError = '';

  ngOnInit() {
    this.generateDateColumns();
  }

  generateDateColumns(): void {
    const today = new Date();
    this.dateColumns = [];

    if (this.zoomLevel === 'day') {
      this.columnWidth = 80;
      // Show 45 days before and 45 days after today (90 days total)
      const start = new Date(today);
      start.setDate(start.getDate() - 45);
      const end = new Date(today);
      end.setDate(end.getDate() + 45);

      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        this.dateColumns.push({
          label: d.toLocaleDateString('en-US', { day: 'numeric', month: 'short' }),
          date: new Date(d).toISOString().split('T')[0],
        });
      }
    } else if (this.zoomLevel === 'week') {
      this.columnWidth = 120;
      // Show 12 weeks before and 12 weeks after today (24 weeks total)
      const start = new Date(today);
      start.setDate(start.getDate() - (12 * 7));
      const end = new Date(today);
      end.setDate(end.getDate() + (12 * 7));

      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 7)) {
        this.dateColumns.push({
          label: `Week of ${d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`,
          date: new Date(d).toISOString().split('T')[0],
        });
      }
    } else {
      this.columnWidth = 180;
      // Show 6 months before and 6 months after today (12 months total)
      const start = new Date(today.getFullYear(), today.getMonth() - 6, 1);

      for (let m = 0; m < 12; m++) {
        const monthDate = new Date(start.getFullYear(), start.getMonth() + m, 1);
        this.dateColumns.push({
          label: monthDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
          date: new Date(monthDate).toISOString().split('T')[0],
        });
      }
    }
  }

  onZoomChange(): void {
    this.generateDateColumns();
  }

  prepForm(workCenterId: string, clickedDate: Date, endDate: Date) {
    this.selectedWorkCenter = workCenterId;
    this.panelMode = 'create';
    this.panelInitialData = {
      name: '',
      status: 'open',
      startDate: clickedDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
      workCenterId,
    };
    this.editingOrder = null;
    this.formError = '';
    this.isPanelOpen = true;
  }

  getPositionForDate(date: string): number {
    if (!this.dateColumns || this.dateColumns.length === 0) {
      return 0;
    }

    const targetDate = new Date(date);
    const startDate = new Date(this.dateColumns[0].date);
    const daysDiff = Math.floor(
      (targetDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24),
    );

    if (this.zoomLevel === 'day') {
      return daysDiff * this.columnWidth;
    } else if (this.zoomLevel === 'week') {
      return Math.floor(daysDiff / 7) * this.columnWidth;
    } else {
      const monthsDiff =
        (targetDate.getFullYear() - startDate.getFullYear()) * 12 +
        (targetDate.getMonth() - startDate.getMonth());
      return monthsDiff * this.columnWidth;
    }
  }

  onEdit(order: WorkOrderDocument): void {
    this.editingOrder = order;
    this.selectedWorkCenter = order.data.workCenterId;
    this.panelMode = 'edit';
    this.panelInitialData = {
      name: order.data.name,
      status: order.data.status,
      startDate: order.data.startDate,
      endDate: order.data.endDate,
      workCenterId: order.data.workCenterId,
    };
    this.formError = '';
    this.isPanelOpen = true;
    this.openMenuId = null;
  }

  handleCreateFormRequest(event: { workCenterId: string; clickedDate: Date; endDate: Date }): void {
    this.prepForm(event.workCenterId, event.clickedDate, event.endDate);
  }

  handleEdit(workOrder: WorkOrderDocument): void {
    this.onEdit(workOrder);
  }

  handleDelete(orderId: string): void {
    this.workOrderService.deleteWorkOrder(orderId);
    this.openMenuId = null;
  }

  handleFormSubmit(formData: WorkOrderFormData): void {
    const workCenterId = formData.workCenterId || this.selectedWorkCenter;

    const hasOverlap = this.workOrderService.checkOverlap(
      workCenterId,
      formData.startDate,
      formData.endDate,
      this.editingOrder?.docId,
    );

    if (hasOverlap) {
      this.formError = 'This work order overlaps with an existing order on the same work center';
      return;
    }

    if (this.panelMode === 'create') {
      // Create new work order
      const newOrder: WorkOrderDocument = {
        docId: 'wo' + Date.now(),
        docType: 'workOrder',
        data: {
          name: formData.name,
          workCenterId,
          status: formData.status,
          startDate: formData.startDate,
          endDate: formData.endDate,
        },
      };
      this.workOrderService.addWorkOrder(newOrder);
    } else if (this.editingOrder) {
      // Update existing work order
      const updatedOrder: WorkOrderDocument = {
        ...this.editingOrder,
        data: {
          ...this.editingOrder.data,
          name: formData.name,
          status: formData.status,
          startDate: formData.startDate,
          endDate: formData.endDate,
        },
      };
      this.workOrderService.updateWorkOrder(updatedOrder);
    }

    this.closePanel();
  }

  closePanel(): void {
    this.isPanelOpen = false;
    this.editingOrder = null;
    this.panelInitialData = null;
    this.formError = '';
  }
}
