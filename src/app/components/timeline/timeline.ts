import { Component, OnInit } from '@angular/core';
import { Header } from './header/header';
import { TimelineGrid } from './timeline-grid/timeline-grid';
import { WorkCenterDocument, WorkOrderDocument, ZoomLevel } from '../../models/work-order.model';
import { TimelineScrollArea } from './timeline-scroll-area/timeline-scroll-area';
import { FormGroup } from '@angular/forms';

export interface DateColumn {
  label: string;
  date: string;
}

@Component({
  selector: 'app-timeline',
  imports: [Header, TimelineGrid, TimelineScrollArea],
  templateUrl: './timeline.html',
  styleUrl: './timeline.scss',
})
export class Timeline implements OnInit {
  zoomLevel: ZoomLevel = 'month';
  dateColumns: DateColumn[] = [];
  columnWidth = 80;
  selectedWorkCenter = '';
  workOrderForm!: FormGroup;
  panelMode: 'create' | 'edit' = 'create';
  isPanelOpen = false;
  editingOrder: WorkOrderDocument | null = null;
  openMenuId: string | null = null;
  formError = '';

  constructor() {}

  ngOnInit() {
    this.generateDateColumns();
  }

  generateDateColumns(): void {
    const start = new Date(2025, 0, 1);
    const end = new Date(2025, 2, 31);
    this.dateColumns = [];

    if (this.zoomLevel === 'day') {
      this.columnWidth = 80;
      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        this.dateColumns.push({
          label: d.toLocaleDateString('en-US', { day: 'numeric', month: 'short' }),
          date: new Date(d).toISOString().split('T')[0],
        });
      }
    } else if (this.zoomLevel === 'week') {
      this.columnWidth = 120;
      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 7)) {
        this.dateColumns.push({
          label: `Week of ${d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`,
          date: new Date(d).toISOString().split('T')[0],
        });
      }
    } else {
      this.columnWidth = 180;
      for (let m = 0; m < 3; m++) {
        const monthDate = new Date(2025, m, 1);
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
    this.workOrderForm.patchValue({
      name: '',
      status: 'open',
      startDate: clickedDate,
      endDate: endDate.toISOString().split('T')[0],
    });
    this.formError = '';
    this.panelMode = 'create';
    this.editingOrder = null;
    this.isPanelOpen = true;
  }
}
