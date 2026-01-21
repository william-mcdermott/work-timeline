import { Component, ElementRef, inject, OnInit, signal, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
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
export class Timeline implements OnInit, AfterViewInit, OnDestroy {
  private workOrderService = inject(WorkOrderService);

  @ViewChild('timelineBody') timelineBodyRef!: ElementRef<HTMLDivElement>;
  @ViewChild(TimelineGrid) timelineGridRef!: TimelineGrid;

  zoomLevel: ZoomLevel = 'month';
  dateColumns = signal<DateColumn[]>([]);
  columnWidth = signal(80);
  selectedWorkCenter = '';
  panelMode: 'create' | 'edit' = 'create';
  isPanelOpen = false;
  panelInitialData: WorkOrderFormData | null = null;
  editingOrder: WorkOrderDocument | null = null;
  openMenuId: string | null = null;
  formError = signal('');

  ngOnInit() {
    this.generateDateColumns();
  }

  ngAfterViewInit() {
    // Set up scroll listener
    const timelineBody = document.querySelector('.timeline-body');
    if (timelineBody) {
      timelineBody.addEventListener('scroll', this.handleScroll.bind(this));
    }
  }

  ngOnDestroy() {
    // Clean up scroll listener
    const timelineBody = document.querySelector('.timeline-body');
    if (timelineBody) {
      timelineBody.removeEventListener('scroll', this.handleScroll.bind(this));
    }
  }

  handleScroll(event: Event) {
    const scrollContainer = event.target as HTMLElement;
    const scrollLeft = scrollContainer.scrollLeft;

    // Update the grid's transform to follow the scroll
    const grid = document.querySelector('.timeline-grid') as HTMLElement;
    if (grid) {
      grid.style.transform = `translateX(${scrollLeft}px)`;
    }
  }

  generateDateColumns(): void {
    const newColumns: DateColumn[] = [];

    if (this.zoomLevel === 'day') {
      this.columnWidth.set(80);
      // Fixed range: Jan 1 - Mar 31, 2026 (90 days)
      const start = new Date(2026, 0, 1);

      for (let i = 0; i < 90; i++) {
        const d = new Date(start);
        d.setDate(d.getDate() + i);
        newColumns.push({
          label: d.toLocaleDateString('en-US', { day: 'numeric', month: 'short' }),
          date: d.toISOString().split('T')[0],
        });
      }
    } else if (this.zoomLevel === 'week') {
      this.columnWidth.set(120);
      // Fixed range: Jan 1 - Mar 31, 2026 in weeks (13 weeks)
      const start = new Date(2026, 0, 1);

      for (let i = 0; i < 13; i++) {
        const d = new Date(start);
        d.setDate(d.getDate() + (i * 7));
        newColumns.push({
          label: `Week of ${d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`,
          date: d.toISOString().split('T')[0],
        });
      }
    } else {
      this.columnWidth.set(180);
      // Fixed range: 3 months (Jan, Feb, Mar 2026)
      for (let m = 0; m < 3; m++) {
        const monthDate = new Date(2026, m, 1);
        newColumns.push({
          label: monthDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
          date: new Date(monthDate).toISOString().split('T')[0],
        });
      }
    }

    // Use .set() to update the signal
    this.dateColumns.set(newColumns);
  }

  onZoomChange(): void {
    this.generateDateColumns();
  }

  handleZoomLevelChange(newZoomLevel: ZoomLevel): void {
    this.zoomLevel = newZoomLevel;
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
    this.formError.set('');
    this.isPanelOpen = true;
  }

  getPositionForDate(date: string): number {
    const columns = this.dateColumns();
    if (!columns || columns.length === 0) {
      return 0;
    }

    if (this.zoomLevel === 'month') {
      // Parse dates as YYYY-MM-DD to avoid timezone issues
      const [targetYear, targetMonth] = date.split('-').map(Number);
      const [startYear, startMonth] = columns[0].date.split('-').map(Number);

      const monthsDiff = (targetYear - startYear) * 12 + (targetMonth - startMonth);
      return monthsDiff * this.columnWidth();
    }

    const targetDate = new Date(date);
    const startDate = new Date(columns[0].date);
    const daysDiff = Math.floor(
      (targetDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24),
    );

    if (this.zoomLevel === 'day') {
      return daysDiff * this.columnWidth();
    } else {
      return Math.floor(daysDiff / 7) * this.columnWidth();
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
    this.formError.set('');
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
      this.formError.set('This work order overlaps with an existing order on the same work center');
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
    this.formError.set('');
  }
}
