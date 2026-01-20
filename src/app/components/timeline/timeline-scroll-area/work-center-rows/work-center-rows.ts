import { CommonModule } from '@angular/common';
import { Component, ElementRef, Input, OnInit, TrackByFunction, ViewChild } from '@angular/core';
import { WorkCenterDocument } from '../../../../models/work-order.model';
import { WorkOrderService } from '../../../../services/work-order.service';
import { DateColumn } from '../../timeline';

@Component({
  selector: 'app-work-center-rows',
  imports: [CommonModule],
  templateUrl: './work-center-rows.html',
  styleUrl: './work-center-rows.scss',
})
export class WorkCenterRows implements OnInit {
  constructor(private workOrderService: WorkOrderService) {}

  @Input() trackByWorkCenter!: TrackByFunction<string>;
  @Input() prepForm!: Function;
  @Input() dateColumns!: DateColumn[];
  @Input() columnWidth!: number;

  @ViewChild('timelineScroll') timelineScroll!: ElementRef<HTMLDivElement>;

  workCenters: WorkCenterDocument[] = [];

  ngOnInit() {
    this.workCenters = this.workOrderService.getWorkCenters();
  }

  onTimelineClick(workCenterId: string, event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (target.closest('.work-order-bar, .work-order-menu')) return;

    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    const clickX = event.clientX - rect.left + (this.timelineScroll?.nativeElement.scrollLeft || 0);
    const columnIndex = Math.floor(clickX / this.columnWidth);

    if (columnIndex >= 0 && columnIndex < this.dateColumns.length) {
      const clickedDate = this.dateColumns[columnIndex].date;
      const endDate = new Date(clickedDate);
      endDate.setDate(endDate.getDate() + 7);
      this.prepForm(workCenterId, clickedDate, endDate);
    }
  }
}
