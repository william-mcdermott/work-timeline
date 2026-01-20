import { Component, OnInit } from '@angular/core';
import { WorkCenterDocument } from '../../../models/work-order.model';
import { WorkOrderService } from '../../../services/work-order.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-timeline-grid',
  imports: [CommonModule],
  templateUrl: './timeline-grid.html',
  styleUrl: './timeline-grid.scss',
})
export class TimelineGrid implements OnInit {
  workCenters: WorkCenterDocument[] = [];

  constructor(private workOrderService: WorkOrderService) {}

  ngOnInit() {
    this.workCenters = this.workOrderService.getWorkCenters();
  }

  trackByWorkCenter(index: number, item: WorkCenterDocument): string {
    return item.docId;
  }

}
